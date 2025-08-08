'use strict';

// Live Code Editor (LCE)
document.addEventListener('DOMContentLoaded', () => {
  const htmlEl = document.getElementById('lce-html');
  const cssEl = document.getElementById('lce-css');
  const jsEl = document.getElementById('lce-js');
  const iframe = document.getElementById('lce-preview');
  const runBtn = document.getElementById('lce-run');
  const resetBtn = document.getElementById('lce-reset');
  const autoRunEl = document.getElementById('lce-autorun');

  const DEFAULTS = {
    html: '<h1>Hello 👋</h1>\n<p>Edit the HTML, CSS, and JS on the left. Changes will update the preview.</p>',
    css: 'body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;padding:16px;background:#f7f7f7;color:#222;}\nh1{color:#18d26e;}\n',
    js: "console.log('Hello from JS!');\n"
  };

  function getVal(key, fallback) {
    const v = localStorage.getItem(key);
    return v !== null ? v : fallback;
  }

  // Initialize editors with saved values or defaults
  htmlEl.value = getVal('lce_html', DEFAULTS.html);
  cssEl.value = getVal('lce_css', DEFAULTS.css);
  jsEl.value = getVal('lce_js', DEFAULTS.js);
  autoRunEl.checked = localStorage.getItem('lce_autorun') !== '0';

  function persist() {
    localStorage.setItem('lce_html', htmlEl.value);
    localStorage.setItem('lce_css', cssEl.value);
    localStorage.setItem('lce_js', jsEl.value);
    localStorage.setItem('lce_autorun', autoRunEl.checked ? '1' : '0');
  }

  function buildSrcDoc(html, css, js) {
    return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${css}</style></head><body>${html}<script>${js}<\/script></body></html>`;
  }

  function update() {
    iframe.srcdoc = buildSrcDoc(htmlEl.value, cssEl.value, jsEl.value);
    persist();
  }

  const debounce = (fn, wait = 300) => {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn.apply(null, args), wait);
    };
  };

  const debouncedUpdate = debounce(update, 300);

  [htmlEl, cssEl, jsEl].forEach(el => {
    el.addEventListener('input', () => {
      if (autoRunEl.checked) {
        debouncedUpdate();
      } else {
        persist();
      }
    });
    el.addEventListener('change', persist);
  });

  autoRunEl.addEventListener('change', () => {
    persist();
    if (autoRunEl.checked) update();
  });

  runBtn.addEventListener('click', update);
  resetBtn.addEventListener('click', () => {
    htmlEl.value = DEFAULTS.html;
    cssEl.value = DEFAULTS.css;
    jsEl.value = DEFAULTS.js;
    update();
  });

  // Initial render
  update();
});