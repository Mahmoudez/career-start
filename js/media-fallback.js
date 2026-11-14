(() => {
  const root = location.pathname.includes('/pages/') ? '../assets/' : 'assets/';
  const config = window.CAREER_MEDIA || {};
  const pathFor = file => `${root}${file}`;
  document.querySelectorAll('img[src],video[poster],video source[src]').forEach(element => {
    const attribute = element instanceof HTMLSourceElement ? 'src' : element instanceof HTMLVideoElement ? 'poster' : 'src';
    const current = element.getAttribute(attribute); const filename = current && current.split('/').pop();
    const key = Object.keys(config).find(name => typeof config[name] === 'string' && config[name] === filename);
    if (key) element.setAttribute(attribute, pathFor(config[key]));
    if (element instanceof HTMLSourceElement) {
      const video = element.closest('video'); const sourceName = Object.keys(config).find(name => typeof config[name] === 'string' && config[name] === filename);
      if (video && sourceName && config.placeholders?.[sourceName]) video.dataset.placeholder = pathFor(config.placeholders[sourceName]);
    }
  });
  document.addEventListener('error', event => {
  const video = event.target;
  if (video instanceof HTMLVideoElement && !video.dataset.fallbackApplied) {
    video.dataset.fallbackApplied = 'true';
    const card = document.createElement('div'); card.className = 'media-fallback'; card.setAttribute('role','img'); card.setAttribute('aria-label', video.getAttribute('aria-label') || 'معاينة فيديو غير متاحة');
    const placeholder = video.dataset.placeholder || video.poster;
    if (placeholder) card.style.backgroundImage = `linear-gradient(135deg,rgba(8,18,38,.45),rgba(8,18,38,.9)),url("${placeholder.replace(/["\\]/g,'')}")`;
    card.textContent = video.getAttribute('aria-label') || 'معاينة الفيديو'; video.hidden = true; video.insertAdjacentElement('afterend', card); return;
  }
  const img = event.target;
  if (img instanceof HTMLImageElement && !img.dataset.fallbackApplied) {
    img.dataset.fallbackApplied = 'true'; const card = document.createElement('div'); card.className = 'image-fallback'; card.setAttribute('role','img'); card.setAttribute('aria-label',img.alt || 'صورة توضيحية'); card.textContent = img.alt || 'صورة توضيحية';
    const style = getComputedStyle(img); card.style.width = style.width; card.style.height = style.height; img.replaceWith(card);
  }
  }, true);
})();
