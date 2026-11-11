/* HumAIn site script — plain JS, no dependencies. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;
  var cfg = window.HUMAIN_CONFIG || {};
  var KEY = cfg.STORAGE_KEY || "humain_subscribed_v1";
  var NEXT_KEY = "humain_next";
  var DONE_KEY = "humain_lessons_done_v1";

  function store(get, k, v) {
    try {
      if (get === "get") return window.localStorage.getItem(k);
      if (get === "set") window.localStorage.setItem(k, v);
      if (get === "del") window.localStorage.removeItem(k);
    } catch (e) { return null; }
    return null;
  }
  function isSubscribed() { return store("get", KEY) === "1"; }
  function $all(sel, ctx) { return Array.prototype.slice.call((ctx || doc).querySelectorAll(sel)); }

  /* ---- course is open: no sign-up gate ---- */
  var signupReady = !!cfg.BEEHIIV_EMBED_URL;
  root.classList.add("unlocked"); /* the basic course is open: no gate */

  /* ---- nav toggle ---- */
  var toggle = doc.querySelector(".nav-toggle"), nav = doc.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---- copy buttons ---- */
  function fallbackCopy(text) {
    var ta = doc.createElement("textarea");
    ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
    doc.body.appendChild(ta); ta.select();
    var ok = false;
    try { ok = doc.execCommand("copy"); } catch (e) {}
    doc.body.removeChild(ta);
    return ok;
  }
  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return fallbackCopy(text); });
    }
    return Promise.resolve(fallbackCopy(text));
  }
  $all("[data-copy-target]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      var el = doc.getElementById(btn.getAttribute("data-copy-target"));
      if (!el) return;
      var label = btn.getAttribute("data-label") || btn.textContent;
      btn.setAttribute("data-label", label);
      copyText(el.textContent).then(function (ok) {
        btn.textContent = ok ? "Copied ✓" : "Press Ctrl/Cmd+C to copy";
        btn.classList.toggle("copied", ok);
        var live = doc.getElementById("copy-status");
        if (live) live.textContent = ok ? "Prompt copied to clipboard." : "Copy failed. Select the text and copy it manually.";
        setTimeout(function () { btn.textContent = label; btn.classList.remove("copied"); if (live) live.textContent = ""; }, 2200);
      });
    });
  });

  /* ---- rough token estimates (OpenAI rule of thumb: ~4 characters per token in English) ---- */
  $all("[data-token-for]").forEach(function (span) {
    var el = doc.getElementById(span.getAttribute("data-token-for"));
    if (!el) return;
    var n = Math.max(1, Math.round(el.textContent.trim().length / 4));
    span.textContent = "≈ " + n + " tokens (rough estimate)";
  });

  /* ---- prompt / agent library filter ---- */
  var list = doc.querySelector("[data-filter-list]");
  if (list) {
    var chips = $all("[data-chip]");
    var search = doc.getElementById("lib-search");
    var count = doc.getElementById("lib-count");
    var active = "all";
    var items = $all("[data-item]", list);
    function apply() {
      var q = search ? search.value.trim().toLowerCase() : "";
      var shown = 0;
      items.forEach(function (it) {
        var okCat = active === "all" || it.getAttribute("data-cat") === active;
        var okQ = !q || it.textContent.toLowerCase().indexOf(q) !== -1;
        it.hidden = !(okCat && okQ);
        if (!it.hidden) shown++;
      });
      if (count) count.textContent = shown + " shown";
    }
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        active = c.getAttribute("data-chip");
        chips.forEach(function (o) { o.setAttribute("aria-pressed", o === c ? "true" : "false"); });
        apply();
      });
    });
    if (search) search.addEventListener("input", apply);
    apply();
  }

  /* ---- sign-up forms (CASL-friendly: unchecked consent box reveals the beehiiv embed) ---- */
  function rememberNext() {
    // store a site-relative page name only (e.g. "course/lesson-02-....html" or "course.html")
    var inCourse = /\/course\/[^/]+\.html$/.test(window.location.pathname);
    var page = inCourse ? "course/" + window.location.pathname.split("/").pop() : window.location.pathname.split("/").pop();
    if (/^[A-Za-z0-9_\-\/]+\.html$/.test(page) && page !== "welcome.html") store("set", NEXT_KEY, page);
  }
  $all("[data-signup]").forEach(function (form) {
    var box = form.querySelector("[data-consent]");
    var slot = form.querySelector("[data-embed]");
    var rendered = false;
    var embedKey = form.getAttribute("data-embed-key") || "BEEHIIV_EMBED_URL";
    var embedUrl = cfg[embedKey] || "";
    var formReady = !!embedUrl;
    var heightKey = embedKey.replace(/_URL$/, "_HEIGHT");
    var embedHeight = cfg[heightKey] || cfg.BEEHIIV_EMBED_HEIGHT || 320;
    var soonDefault = "<strong>Sign-up opens soon.</strong><br>" +
      "The email list isn't open yet, so no address is collected here. The free course is readable in the meantime.";
    var soonHtml = form.getAttribute("data-soon") || soonDefault;
    form.addEventListener("submit", function (e) { e.preventDefault(); });
    function renderSoon() {
      slot.innerHTML = "";
      var t = doc.createElement("div");
      t.className = "todo-box";
      t.innerHTML = soonHtml;
      slot.appendChild(t);
      slot.hidden = false;
    }
    function render() {
      slot.innerHTML = "";
      if (formReady) {
        rememberNext();
        var f = doc.createElement("iframe");
        f.src = embedUrl;
        f.title = "HumAIn email sign-up form";
        f.setAttribute("loading", "lazy");
        f.setAttribute("scrolling", "no");
        f.style.width = "100%"; f.style.border = "0"; f.style.background = "transparent";
        f.height = String(embedHeight);
        slot.appendChild(f);
      } else {
        renderSoon();
      }
      rendered = true;
    }
    if (!formReady && slot) {
      renderSoon();
    } else if (box && slot) {
      box.addEventListener("change", function () {
        if (box.checked) { if (!rendered) render(); slot.hidden = false; }
        else { slot.hidden = true; }
      });
    }
  });

  /* "Already on the list?" — honour-system unlock on a new device */
  $all("[data-already]").forEach(function (b) {
    b.addEventListener("click", function () {
      store("set", KEY, "1");
      window.location.reload();
    });
  });

  /* sign-out (testing / shared computers) */
  $all("[data-signout]").forEach(function (b) {
    b.addEventListener("click", function () {
      store("del", KEY); store("del", DONE_KEY); window.location.reload();
    });
  });

  /* ---- welcome page: set flag, then go to the course ---- */
  var welcome = doc.querySelector("[data-welcome]");
  if (welcome) {
    store("set", KEY, "1");
    var next = store("get", NEXT_KEY) || "course.html";
    if (!/^[A-Za-z0-9_\-\/]+\.html$/.test(next) || next.indexOf("..") !== -1) next = "course.html";
    store("del", NEXT_KEY);
    var link = doc.getElementById("welcome-link");
    if (link) link.setAttribute("href", next);
    setTimeout(function () { window.location.replace(next); }, 1800);
  }

  /* ---- lesson progress (local only) ---- */
  function getDone() { try { return JSON.parse(store("get", DONE_KEY) || "[]"); } catch (e) { return []; } }
  function setDone(a) { store("set", DONE_KEY, JSON.stringify(a)); }
  var markBtn = doc.querySelector("[data-mark-done]");
  if (markBtn) {
    var id = markBtn.getAttribute("data-mark-done");
    var paint = function () {
      var d = getDone().indexOf(id) !== -1;
      markBtn.textContent = d ? "✓ Lesson completed (click to undo)" : "Mark lesson as complete";
      markBtn.setAttribute("aria-pressed", d ? "true" : "false");
    };
    markBtn.addEventListener("click", function () {
      var d = getDone(), i = d.indexOf(id);
      if (i === -1) d.push(id); else d.splice(i, 1);
      setDone(d); paint();
    });
    paint();
  }
  var prog = doc.querySelector("[data-progress]");
  if (prog) {
    var total = parseInt(prog.getAttribute("data-progress"), 10) || 1;
    var done = getDone();
    var bar = prog.querySelector("span.bar"), txt = doc.querySelector(".ptext");
    prog.setAttribute("aria-valuenow", String(done.length));
    if (bar) bar.style.width = Math.round(done.length / total * 100) + "%";
    if (txt) txt.textContent = done.length + " of " + total + " lessons completed (saved in this browser only)";
    $all("[data-module-id]").forEach(function (m) {
      if (done.indexOf(m.getAttribute("data-module-id")) !== -1) m.classList.add("done");
    });
  }

  /* contact placeholders from config */
  $all("[data-cfg]").forEach(function (el) {
    var v = cfg[el.getAttribute("data-cfg")];
    if (v) el.textContent = v;
  });
})();
