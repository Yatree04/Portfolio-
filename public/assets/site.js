/*
 * Shared chrome for the static pages (works, playground, about, resume).
 *
 * Each page sets `data-page` on <body>; this renders the nav pill and the
 * footer from the one list below, so a route is added in one place. The
 * onboarding and the mailbox are the React app and carry their own chrome.
 *
 * Links are built from this script's own URL rather than from "/", so the
 * site works wherever it is mounted — yatree04.github.io/Portfolio-/ today,
 * a domain root later — without a rebuild.
 */
(function () {
  var SITE = (function () {
    var self = document.currentScript;
    if (!self) {
      var all = document.getElementsByTagName("script");
      self = all[all.length - 1];
    }
    return (self && self.src ? self.src : "").replace(/assets\/site\.js.*$/, "");
  })();

  var NAV = [
    { id: "mailbox", label: "MAILBOX", href: SITE + "mailbox/" },
    { id: "works", label: "WORKS", href: SITE + "works/" },
    { id: "playground", label: "PLAYGROUND", href: SITE + "playground/" },
    { id: "about", label: "ABOUT", href: SITE + "about/" },
    { id: "resume", label: "RESUME", href: SITE + "resume/" },
  ];

  var SOCIAL = [
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/yatripatel/",
      path: "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z",
      box: "0 0 448 512",
    },
    {
      label: "GitHub",
      href: "https://github.com/Yatree04",
      path: "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z",
      box: "0 0 496 512",
    },
    {
      label: "Email",
      href: "mailto:yatri.3014.patel@gmail.com",
      path: "M502.3 190.8c3.9-3.1 9.7-.2 9.7 4.7V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V195.6c0-5 5.7-7.8 9.7-4.7 22.4 17.4 52.1 39.5 154.1 113.6 21.1 15.4 56.7 47.8 92.2 47.6 35.7.3 72-32.8 92.3-47.6 102-74.1 131.6-96.3 154-113.7zM256 320c23.2.4 56.6-29.2 73.4-41.4 132.7-96.3 142.8-104.7 173.4-128.7 5.8-4.5 9.2-11.5 9.2-18.9v-19c0-26.5-21.5-48-48-48H48C21.5 64 0 85.5 0 112v19c0 7.4 3.4 14.3 9.2 18.9 30.6 23.9 40.7 32.4 173.4 128.7 16.8 12.2 50.2 41.8 73.4 41.4z",
      box: "0 0 512 512",
    },
  ];

  var current = document.body.getAttribute("data-page") || "";

  function link(item) {
    var active = item.id === current;
    return (
      '<a href="' + item.href + '"' +
      (active ? ' class="is-active" aria-current="page"' : "") +
      ">" + item.label + "</a>"
    );
  }

  var header = document.createElement("header");
  header.className = "site-header";
  header.innerHTML =
    '<nav class="nav-pill" aria-label="Primary">' + NAV.map(link).join("") + "</nav>";

  var footer = document.createElement("footer");
  footer.className = "site-footer";
  footer.innerHTML =
    '<div class="footer-inner">' +
      '<p class="footer-copy">© 2026, Vibe coded in Antigravity and Claude Code by me :)</p>' +
      '<nav class="footer-nav" aria-label="Footer">' +
        '<a href="' + SITE + '">HOME</a>' +
        NAV.map(function (item) {
          return '<a href="' + item.href + '">' + item.label + "</a>";
        }).join("") +
      "</nav>" +
      '<div class="footer-social">' +
        SOCIAL.map(function (s) {
          return (
            '<a href="' + s.href + '" aria-label="' + s.label + '"' +
            (s.href.indexOf("mailto:") === 0 ? "" : ' target="_blank" rel="noopener"') +
            '><svg viewBox="' + s.box + '" aria-hidden="true"><path d="' + s.path + '"/></svg></a>'
          );
        }).join("") +
      "</div>" +
    "</div>";

  document.body.insertBefore(header, document.body.firstChild);
  document.body.appendChild(footer);
})();
