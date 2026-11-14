(function (root) {
    'use strict';

    const INTRO_TEXT = 'Your next step in Career Start starts here';
    const INTRO_DURATION_MS = 10000;
    const EXIT_DURATION_MS = 800;
    function shouldShowIntro(search) {
        return !/(?:^|[?&])intro=0(?:&|$)/.test(search || '');
    }

    function createExit(onExit) {
        let exited = false;
        return function () {
            if (exited) return false;
            exited = true;
            onExit();
            return true;
        };
    }

    function buildTitle(doc, title) {
        const heading = doc.createElement('h1');
        heading.className = 'career-intro__title';
        const words = title.split(/\s+/);
        const highlightStart = words.indexOf('Career');
        words.forEach(function (word, index) {
            if (index > 0) heading.appendChild(doc.createTextNode(' '));
            const span = doc.createElement('span');
            span.className = 'career-intro__word';
            if (index === highlightStart || index === highlightStart + 1) span.className += ' career-intro__highlight';
            span.style.setProperty('--word-delay', (index * 115) + 'ms');
            span.textContent = word;
            heading.appendChild(span);
        });
        return heading;
    }

    function start(doc, win) {
        if (!shouldShowIntro(win.location.search)) return;

        const previousFocus = doc.activeElement;
        const oldOverflow = doc.body.style.overflow;
        const overlay = doc.createElement('div');
        overlay.className = 'career-intro';
        overlay.setAttribute('role', 'dialog');
        overlay.setAttribute('aria-label', 'Career Start introduction');
        overlay.setAttribute('aria-live', 'polite');
        overlay.setAttribute('dir', 'ltr');
        overlay.style.setProperty('--intro-duration', INTRO_DURATION_MS + 'ms');

        ['career-intro__glow career-intro__glow--one', 'career-intro__glow career-intro__glow--two', 'career-intro__grain'].forEach(function (className) {
            const decoration = doc.createElement('div');
            decoration.className = className;
            decoration.setAttribute('aria-hidden', 'true');
            overlay.appendChild(decoration);
        });
        const content = doc.createElement('div');
        content.className = 'career-intro__content';
        content.appendChild(buildTitle(doc, INTRO_TEXT));
        overlay.appendChild(content);

        const skip = doc.createElement('button');
        skip.type = 'button';
        skip.className = 'career-intro__skip';
        skip.textContent = 'Skip / تخطي';
        overlay.appendChild(skip);
        const progress = doc.createElement('div');
        progress.className = 'career-intro__progress';
        progress.setAttribute('aria-hidden', 'true');
        const fill = doc.createElement('div');
        fill.className = 'career-intro__progress-fill';
        progress.appendChild(fill);
        overlay.appendChild(progress);

        doc.body.style.overflow = 'hidden';
        doc.body.appendChild(overlay);
        skip.focus();

        const exit = createExit(function () {
            overlay.classList.add('is-exiting');
            win.setTimeout(function () {
                if (overlay.parentNode) overlay.parentNode.removeChild(overlay);
                doc.body.style.overflow = oldOverflow;
                if (previousFocus && previousFocus !== doc.body && typeof previousFocus.focus === 'function') previousFocus.focus();
                else {
                    const main = doc.querySelector('main');
                    if (main) { main.setAttribute('tabindex', '-1'); main.focus(); main.removeAttribute('tabindex'); }
                }
            }, EXIT_DURATION_MS);
        });
        const timer = win.setTimeout(exit, INTRO_DURATION_MS);
        skip.addEventListener('click', function () { win.clearTimeout(timer); exit(); });
        doc.addEventListener('keydown', function onKeydown(event) {
            if (event.key === 'Escape' && overlay.parentNode) {
                win.clearTimeout(timer);
                exit();
                doc.removeEventListener('keydown', onKeydown);
            }
        });
    }

    if (typeof module !== 'undefined' && module.exports) module.exports = { shouldShowIntro, createExit };
    if (root.document) {
        const run = function () { start(root.document, root); };
        if (root.document.readyState === 'loading') root.document.addEventListener('DOMContentLoaded', run, { once: true });
        else run();
    }
})(typeof window !== 'undefined' ? window : globalThis);
