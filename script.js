/* ItzPRTGamer — small progressive enhancements, no dependencies */

(function () {
  "use strict";

  /* ---------- mobile menu ---------- */
  var toggle = document.getElementById("nav-toggle");
  var nav = document.getElementById("main-nav");

  function closeMenu() {
    if (!nav || !toggle) return;
    nav.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open menu");
  }

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeMenu();
    });

    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("is-open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeMenu();
    });
  }

  /* ---------- click-to-load videos ----------
     Nothing is requested from YouTube until a card is actually pressed. */
  var cards = document.querySelectorAll(".video-card[data-video]");

  Array.prototype.forEach.call(cards, function (card) {
    var button = card.querySelector(".video-thumb");
    if (!button) return;

    button.addEventListener("click", function () {
      if (card.classList.contains("is-loaded")) return;

      var id = card.getAttribute("data-video");
      if (!id) return;

      var frame = document.createElement("iframe");
      frame.src =
        "https://www.youtube-nocookie.com/embed/" +
        encodeURIComponent(id) +
        "?autoplay=1&rel=0&modestbranding=1&playsinline=1";
      frame.title = button.getAttribute("aria-label")
        ? button.getAttribute("aria-label").replace(/^Play:\s*/, "")
        : "YouTube video";
      frame.setAttribute("allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share");
      frame.setAttribute("referrerpolicy", "strict-origin-when-cross-origin");
      frame.setAttribute("allowfullscreen", "");

      button.appendChild(frame);
      card.classList.add("is-loaded");
      button.setAttribute("aria-label", "Video is playing");
    });
  });

  /* ---------- highlight the section you're reading ---------- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.main-nav a[href^="#"]'));
  var sections = links
    .map(function (a) {
      var el = document.querySelector(a.getAttribute("href"));
      return el ? { link: a, el: el } : null;
    })
    .filter(Boolean);

  if (sections.length && "IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          sections.forEach(function (s) {
            s.link.classList.toggle("is-active", s.el === entry.target);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach(function (s) { observer.observe(s.el); });
  }
})();
