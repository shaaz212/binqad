/* =============================================================================
   binQad Business Services LLC — site behaviour
   -----------------------------------------------------------------------------
   Modules
     1. media loading states      5. scroll reveal
     2. navigation                6. details modal
     3. hero carousel             7. footer year
     4. active section link       8. lead form → WhatsApp
   ========================================================================== */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  var canHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  /* ---------------------------------------------------------------------------
     1. Media loading states
     Reveals each image once it has actually decoded, so the colour placeholder
     and shimmer hand over cleanly instead of flashing an empty box.
     ------------------------------------------------------------------------ */
  function markLoaded(img) {
    var box = img.closest(".media") || img.parentElement;
    if (box) box.classList.add("is-loaded");
  }

  function initMediaLoading() {
    document.querySelectorAll(".media img").forEach(function (img) {
      if (img.complete && img.naturalWidth > 0) {
        markLoaded(img);
      } else {
        img.addEventListener("load", function () { markLoaded(img); }, { once: true });
        // A broken file should still clear the shimmer rather than spin forever
        img.addEventListener("error", function () { markLoaded(img); }, { once: true });
      }
    });
  }

  /* ---------------------------------------------------------------------------
     2. Navigation — drawer, backdrop, scroll lock, elevation on scroll
     ------------------------------------------------------------------------ */
  function initNav() {
    var toggle = document.getElementById("mobile-menu");
    var menu = document.getElementById("nav-menu");
    var backdrop = document.getElementById("nav-backdrop");
    var navbar = document.getElementById("navbar");
    if (!toggle || !menu) return;

    function setMenu(open) {
      toggle.classList.toggle("active", open);
      menu.classList.toggle("active", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
      document.body.classList.toggle("is-locked", open);
      if (backdrop) {
        backdrop.hidden = !open;
        // let `hidden` clear before transitioning opacity
        requestAnimationFrame(function () {
          backdrop.classList.toggle("is-open", open);
        });
      }
    }

    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("active"));
    });

    if (backdrop) backdrop.addEventListener("click", function () { setMenu(false); });

    // Anchor scrolling is handled natively via scroll-padding-top; just close up.
    menu.querySelectorAll(".nav-link, .login-btn").forEach(function (link) {
      link.addEventListener("click", function () { setMenu(false); });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menu.classList.contains("active")) {
        setMenu(false);
        toggle.focus();
      }
    });

    // Reset the drawer if the viewport grows past the mobile breakpoint
    var desktop = window.matchMedia("(min-width: 969px)");
    desktop.addEventListener("change", function (e) {
      if (e.matches) setMenu(false);
    });

    if (navbar) {
      var onScroll = function () {
        navbar.classList.toggle("is-scrolled", window.scrollY > 8);
      };
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
    }
  }

  /* ---------------------------------------------------------------------------
     3. Hero carousel — cross-fades the four background frames
     ------------------------------------------------------------------------ */
  function initHero() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".hero-dot"));
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var DELAY = 6000;

    function show(next) {
      if (next === index) return;
      slides[index].classList.remove("is-active");
      slides[next].classList.add("is-active");
      if (dots[index]) {
        dots[index].classList.remove("is-active");
        dots[index].setAttribute("aria-current", "false");
      }
      if (dots[next]) {
        dots[next].classList.add("is-active");
        dots[next].setAttribute("aria-current", "true");
      }
      index = next;
    }

    function start() {
      if (timer || reduceMotion.matches) return;
      timer = setInterval(function () {
        show((index + 1) % slides.length);
      }, DELAY);
    }

    function stop() {
      if (timer) { clearInterval(timer); timer = null; }
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        stop();
        start();
      });
    });

    // Don't animate against a hidden tab, and honour reduced-motion changes
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
    reduceMotion.addEventListener("change", function (e) {
      if (e.matches) stop(); else start();
    });

    start();
  }

  /* ---------------------------------------------------------------------------
     4. Active section link
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    var links = Array.prototype.slice.call(document.querySelectorAll(".nav-menu .nav-link"));
    var sections = links
      .map(function (l) { return document.querySelector(l.getAttribute("href")); })
      .filter(Boolean);
    if (!sections.length) return;

    var visible = new Map();

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      var bestId = null;
      var bestRatio = 0;
      visible.forEach(function (ratio, id) {
        if (ratio > bestRatio) { bestRatio = ratio; bestId = id; }
      });

      links.forEach(function (link) {
        link.classList.toggle("active", link.getAttribute("href") === "#" + bestId);
      });
    }, {
      // Discount the fixed header when deciding which section is "current"
      rootMargin: "-88px 0px -55% 0px",
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------------------------------------------------------------------------
     5. Scroll reveal
     ------------------------------------------------------------------------ */
  function initReveal() {
    var targets = document.querySelectorAll(
      ".unique-item, .service-card, .lead-card, .contact-item-pro, .mission, .vision, .about-stats"
    );
    if (!targets.length) return;

    if (reduceMotion.matches || !("IntersectionObserver" in window)) {
      targets.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

    targets.forEach(function (el, i) {
      el.classList.add("reveal");
      // Small stagger within a row, capped so nothing lags far behind
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      observer.observe(el);
    });
  }

  /* ---------------------------------------------------------------------------
     6. Details modal — shared by service cards and differentiator cards
     ------------------------------------------------------------------------ */
  function initModal() {
    var overlay = document.getElementById("service-modal-overlay");
    var modal = document.getElementById("service-modal");
    var image = document.getElementById("service-modal-image");
    var title = document.getElementById("service-modal-title");
    var points = document.getElementById("service-modal-points");
    var closeBtn = document.getElementById("service-modal-close");
    if (!overlay || !modal || !image || !title || !points || !closeBtn) return;

    var imageBox = image.closest(".media");
    var info = modal.querySelector(".modal-info");
    var timers = [];
    var isOpen = false;
    var lastTrigger = null;
    var blockedCard = null;
    var blockedUntil = 0;
    var openTimer = null;
    var OPEN_DELAY = 140;
    var REOPEN_BLOCK = 600;

    function clearTimers() {
      timers.forEach(clearTimeout);
      timers = [];
    }

    function revealPoints() {
      Array.prototype.slice.call(points.children).forEach(function (li, i) {
        timers.push(setTimeout(function () { li.classList.add("visible"); }, 120 + i * 110));
      });
    }

    /* Mirror the card's own <picture> sources into the dialog so the browser
       picks the same modern format, sized for the larger modal slot. Widths the
       card already fetched stay warm in cache. */
    var MODAL_SIZES = "(min-width: 820px) 420px, calc(100vw - 6rem)";

    function setImage(card, alt) {
      var cardImg = card.querySelector("img");
      var cardPic = card.querySelector("picture");
      if (!cardImg) return;

      var box = card.querySelector(".media");
      if (imageBox && box) {
        imageBox.style.setProperty("--ph", getComputedStyle(box).getPropertyValue("--ph"));
      }

      var src = cardImg.getAttribute("src") || "";
      if (image.getAttribute("src") === src) {
        if (imageBox) imageBox.classList.add("is-loaded");
        image.alt = alt;
        return;
      }

      if (imageBox) imageBox.classList.remove("is-loaded");

      if (cardPic) {
        ["avif", "webp"].forEach(function (fmt) {
          var target = document.getElementById("service-modal-" + fmt);
          var origin = cardPic.querySelector('source[type="image/' + fmt + '"]');
          if (!target) return;
          if (origin && origin.getAttribute("srcset")) {
            target.setAttribute("srcset", origin.getAttribute("srcset"));
            target.setAttribute("sizes", MODAL_SIZES);
          } else {
            target.removeAttribute("srcset");
          }
        });
      }

      image.alt = alt;
      image.setAttribute("sizes", MODAL_SIZES);
      var cardSrcset = cardImg.getAttribute("srcset");
      if (cardSrcset) image.setAttribute("srcset", cardSrcset);
      else image.removeAttribute("srcset");
      image.setAttribute("src", src);

      var done = function () { if (imageBox) imageBox.classList.add("is-loaded"); };
      if (image.decode) image.decode().then(done).catch(done);
      else image.addEventListener("load", done, { once: true });
    }

    function fill(card, type) {
      var heading = card.querySelector("h3");
      var text = heading ? heading.textContent.trim() : "";
      title.textContent = text;

      points.innerHTML = "";
      var lines;
      if (type === "unique") {
        var desc = card.querySelector(".unique-desc");
        lines = desc ? [desc.textContent.trim()] : [];
      } else {
        lines = Array.prototype.map.call(card.querySelectorAll("ul li"), function (li) {
          return li.textContent.trim();
        });
      }
      lines.forEach(function (line) {
        var li = document.createElement("li");
        li.textContent = line;
        points.appendChild(li);
      });

      overlay.classList.toggle("type-unique", type === "unique");
      overlay.classList.toggle("type-service", type !== "unique");
      setImage(card, text);
      revealPoints();
    }

    function open(card, type) {
      clearTimers();

      if (!isOpen) {
        lastTrigger = card;
        fill(card, type);
        overlay.classList.add("show");
        overlay.setAttribute("aria-hidden", "false");
        document.body.classList.add("is-locked");
        isOpen = true;
        closeBtn.focus({ preventScroll: true });
        return;
      }

      // Already open: cross-fade the contents rather than flashing the overlay
      lastTrigger = card;
      image.classList.add("fade-out");
      if (info) info.classList.add("fade-out");
      timers.push(setTimeout(function () {
        fill(card, type);
        image.classList.remove("fade-out");
        if (info) {
          info.classList.remove("fade-out");
          info.classList.add("fade-in");
          timers.push(setTimeout(function () { info.classList.remove("fade-in"); }, 300));
        }
      }, 200));
    }

    function close() {
      if (!isOpen) return;
      overlay.classList.remove("show");
      overlay.setAttribute("aria-hidden", "true");
      document.body.classList.remove("is-locked");
      clearTimers();
      points.innerHTML = "";
      title.textContent = "";
      isOpen = false;
      blockedCard = lastTrigger;
      blockedUntil = Date.now() + REOPEN_BLOCK;
      if (lastTrigger && typeof lastTrigger.focus === "function") {
        lastTrigger.focus({ preventScroll: true });
      }
    }

    function bind(card, type) {
      var trigger = function () { open(card, type); };

      card.addEventListener("click", trigger);
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          trigger();
        }
      });

      if (!canHover.matches) return;

      card.addEventListener("mouseenter", function () {
        clearTimeout(openTimer);
        if (blockedCard === card && Date.now() < blockedUntil) return;
        openTimer = setTimeout(function () {
          if (lastTrigger === card && isOpen) return;
          trigger();
        }, OPEN_DELAY);
      });

      // Deliberately no close-on-mouseleave: the dialog stays until dismissed.
      card.addEventListener("mouseleave", function () { clearTimeout(openTimer); });
    }

    document.querySelectorAll(".service-card").forEach(function (c) { bind(c, "service"); });
    document.querySelectorAll(".unique-item").forEach(function (c) { bind(c, "unique"); });

    if (canHover.matches) {
      modal.addEventListener("mouseenter", function () { clearTimeout(openTimer); });
    }

    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) close();
    });
    closeBtn.addEventListener("click", close);

    document.addEventListener("keydown", function (e) {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }

      // Keep focus inside the dialog while it is open
      if (e.key !== "Tab") return;
      var focusables = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    });
  }

  /* ---------------------------------------------------------------------------
     7. Footer year
     ------------------------------------------------------------------------ */
  function initFooterYear() {
    var el = document.getElementById("copyright-year");
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------------------------
     8. Lead form — validates the enquiry, then opens a WhatsApp chat with the
        details pre-filled. The destination number lives in the form's
        data-whatsapp attribute (country code + number, digits only).
     ------------------------------------------------------------------------ */
  function initLeadForm() {
    var form = document.getElementById("lead-form");
    var success = document.getElementById("lead-success");
    if (!form || !success) return;

    var number = (form.getAttribute("data-whatsapp") || "").replace(/\D/g, "");
    var waLink = document.getElementById("lead-whatsapp-link");
    var successName = document.getElementById("lead-success-name");
    var resetBtn = document.getElementById("lead-reset");
    var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    function value(name) {
      return form.elements[name].value.trim();
    }

    function selectedServices() {
      return Array.prototype.filter
        .call(form.querySelectorAll('input[name="services"]'), function (c) { return c.checked; })
        .map(function (c) { return c.value; });
    }

    // Each check returns an error message, or "" when the field is valid
    var checks = {
      name: function () {
        return value("name").length >= 2 ? "" : "Please enter your name.";
      },
      email: function () {
        var v = value("email");
        if (!v) return "Please enter your email address.";
        return EMAIL.test(v) ? "" : "Please enter a valid email address.";
      },
      phone: function () {
        var v = value("phone");
        if (!v) return "Please enter your contact number.";
        var digits = v.replace(/\D/g, "").length;
        return /^\+?[\d\s()-]+$/.test(v) && digits >= 7 && digits <= 15
          ? ""
          : "Please enter a valid contact number.";
      },
      services: function () {
        return selectedServices().length ? "" : "Please choose at least one service.";
      }
    };

    function fieldWrap(key) {
      return form.querySelector('[data-field="' + key + '"]');
    }

    function validate(key) {
      var wrap = fieldWrap(key);
      var message = checks[key]();
      wrap.classList.toggle("is-invalid", !!message);
      wrap.querySelector(".field-error").textContent = message;
      var input = wrap.querySelector('input:not([type="checkbox"])');
      if (input) input.setAttribute("aria-invalid", String(!!message));
      return !message;
    }

    function clearErrors() {
      Object.keys(checks).forEach(function (key) {
        var wrap = fieldWrap(key);
        wrap.classList.remove("is-invalid");
        wrap.querySelector(".field-error").textContent = "";
        var input = wrap.querySelector('input:not([type="checkbox"])');
        if (input) input.removeAttribute("aria-invalid");
      });
    }

    // Validate on blur once something is typed; re-check live once flagged
    ["name", "email", "phone"].forEach(function (key) {
      var input = form.elements[key];
      input.addEventListener("blur", function () {
        if (input.value.trim()) validate(key);
      });
      input.addEventListener("input", function () {
        if (fieldWrap(key).classList.contains("is-invalid")) validate(key);
      });
    });

    form.addEventListener("change", function (e) {
      if (e.target.name === "services" && fieldWrap("services").classList.contains("is-invalid")) {
        validate("services");
      }
    });

    function buildMessage() {
      var lines = [
        "Hello binQad, I'd like to enquire about your services.",
        "",
        "*Name:* " + value("name"),
        "*Email:* " + value("email"),
        "*Contact number:* " + value("phone"),
        "*Required services:*"
      ];
      selectedServices().forEach(function (s) { lines.push("• " + s); });
      return lines.join("\n");
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      var firstInvalid = null;
      Object.keys(checks).forEach(function (key) {
        if (!validate(key) && !firstInvalid) firstInvalid = key;
      });
      if (firstInvalid) {
        var target = firstInvalid === "services"
          ? form.querySelector('input[name="services"]')
          : form.elements[firstInvalid];
        target.focus();
        return;
      }

      var url = "https://wa.me/" + number + "?text=" + encodeURIComponent(buildMessage());

      // Opened inside the submit gesture so popup blockers allow it;
      // fall back to same-tab navigation if it is blocked anyway.
      var win = window.open(url, "_blank");
      if (win) {
        win.opener = null;
      } else {
        window.location.href = url;
        return;
      }

      var first = value("name").split(/\s+/)[0];
      successName.textContent = first ? ", " + first : "";
      waLink.href = url;
      form.hidden = true;
      success.hidden = false;
      success.focus({ preventScroll: true });
    });

    resetBtn.addEventListener("click", function () {
      form.reset();
      clearErrors();
      success.hidden = true;
      form.hidden = false;
      form.elements.name.focus();
    });
  }

  /* ------------------------------------------------------------------------ */
  function init() {
    initMediaLoading();
    initNav();
    initHero();
    initActiveNav();
    initReveal();
    initModal();
    initFooterYear();
    initLeadForm();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
