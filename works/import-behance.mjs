#!/usr/bin/env node
/*
 * Fills works/projects.js from a Behance profile.
 *
 *   node works/import-behance.mjs yatripatel
 *   node works/import-behance.mjs yatripatel --download   (also saves covers
 *                                                          into assets/works/)
 *
 * Behance retired its public API, so this reads the JSON that the profile and
 * project pages embed in their own HTML. Run it from a machine that can reach
 * behance.net; it rewrites works/projects.js in place, keeping the file's
 * header comment.
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

const user = process.argv[2];
const download = process.argv.includes('--download');
if (!user) {
  console.error('usage: node works/import-behance.mjs <behance-username> [--download]');
  process.exit(1);
}

async function getHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} for ${url}`);
  return res.text();
}

/* Behance ships its page state as JSON in a <script> tag. The id has changed
   over the years, so try the known ones and fall back to any JSON script. */
function embeddedJson(html) {
  const blobs = [];
  const script = /<script[^>]*type="application\/json"[^>]*>([\s\S]*?)<\/script>/gi;
  for (const m of html.matchAll(script)) blobs.push(m[1]);
  const assigned = /window\.__(?:INITIAL_STATE|BEHANCE_STATE)__\s*=\s*(\{[\s\S]*?\});?\s*<\/script>/i.exec(html);
  if (assigned) blobs.push(assigned[1]);

  const parsed = [];
  for (const blob of blobs) {
    try { parsed.push(JSON.parse(blob.trim())); } catch { /* not JSON, skip */ }
  }
  return parsed;
}

/* Behance uses both absolute and site-relative project URLs. */
const ORIGIN = new URL(`https://www.behance.net`).origin;
const absolute = (url) => (url && url.startsWith('/') ? ORIGIN + url : url);

/* Walk any parsed blob and collect objects that look like a project. */
function collectProjects(value, found = new Map()) {
  if (Array.isArray(value)) {
    for (const v of value) collectProjects(v, found);
  } else if (value && typeof value === 'object') {
    const url = absolute(typeof value.url === 'string' ? value.url : '');
    if (value.name && /\/gallery\/\d+\//.test(url) && !found.has(url)) {
      found.set(url, { ...value, url });
    }
    for (const v of Object.values(value)) collectProjects(v, found);
  }
  return found;
}

const pickCover = (covers = {}) =>
  covers.original || covers['808'] || covers['404'] || covers['230'] || covers['115'] || '';

const fieldsOf = (project) =>
  (project.fields || project.tags || [])
    .map((f) => (typeof f === 'string' ? f : f && f.name))
    .filter(Boolean)
    .join(' | ')
    .toUpperCase();

function metaTag(html, name) {
  const re = new RegExp(
    `<meta[^>]+(?:name|property)=["']${name}["'][^>]*content=["']([^"']*)["']`, 'i');
  const alt = new RegExp(
    `<meta[^>]+content=["']([^"']*)["'][^>]*(?:name|property)=["']${name}["']`, 'i');
  return (re.exec(html) || alt.exec(html) || [, ''])[1];
}

const decode = (s) =>
  String(s || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/* A project's blurb lives on its own page, not in the profile listing. */
async function describe(projectUrl) {
  try {
    const html = await getHtml(projectUrl);
    for (const blob of embeddedJson(html)) {
      const projects = collectProjects(blob);
      const project = projects.get(projectUrl) || [...projects.values()][0];
      const text = project && (project.description || project.summary);
      if (text) return decode(text);
    }
    return decode(metaTag(html, 'og:description') || metaTag(html, 'description'));
  } catch (err) {
    console.warn(`  ! could not read description for ${projectUrl}: ${err.message}`);
    return '';
  }
}

async function saveCover(url, slug) {
  const res = await fetch(url, { headers: { 'user-agent': UA } });
  if (!res.ok) throw new Error(`${res.status} for ${url}`);
  const ext = (/\.(jpe?g|png|webp|gif)/i.exec(url) || [, 'jpg'])[1];
  const rel = `/assets/works/${slug}.${ext}`;
  await mkdir(join(ROOT, 'assets/works'), { recursive: true });
  await writeFile(join(ROOT, 'assets/works', `${slug}.${ext}`),
                  Buffer.from(await res.arrayBuffer()));
  return rel;
}

const profileUrl = `https://www.behance.net/${user}`;
console.log(`reading ${profileUrl}`);

const html = await getHtml(profileUrl);
const projects = [];
for (const blob of embeddedJson(html)) {
  for (const p of collectProjects(blob).values()) projects.push(p);
}
const unique = [...new Map(projects.map((p) => [p.url, p])).values()];

if (!unique.length) {
  console.error(
    'No projects found. Behance likely changed its page shape, or the profile ' +
    'is private. Fill in works/projects.js by hand instead.');
  process.exit(2);
}
console.log(`found ${unique.length} project(s)`);

const entries = [];
for (const p of unique) {
  const name = decode(p.name);
  console.log(`  · ${name}`);
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  let image = pickCover(p.covers || p.cover || {});
  if (image && download) {
    try { image = await saveCover(image, slug); }
    catch (err) { console.warn(`  ! cover download failed: ${err.message}`); }
  }
  entries.push({
    eyebrow: fieldsOf(p),
    title: name,
    description: await describe(p.url),
    url: p.url,
    image,
  });
}

const header = readFileSync(join(HERE, 'projects.js'), 'utf8').split('window.WORKS_PROJECTS')[0];
const body = entries
  .map((e) => '  ' + JSON.stringify(e, null, 2).split('\n').join('\n  '))
  .join(',\n');
await writeFile(join(HERE, 'projects.js'), `${header}window.WORKS_PROJECTS = [\n${body},\n];\n`);
console.log(`wrote ${entries.length} project(s) to works/projects.js`);
