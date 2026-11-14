# Media replacement guide

Replace each file in place to update the site; do not rename paths unless you also update `media.config.js`. Video controls use posters and fixed 16:9 dimensions so missing or slow video files do not shift the layout. SVGs in `placeholders/` are clean theme-compatible artwork to use whenever the corresponding real asset is unavailable.

| File | Recommended format and dimensions | Used for |
| --- | --- | --- |
| `main.mp4` | MP4/H.264, 1280×720, under 20 MB | Landing hero intro video |
| `main-poster.jpg` | JPG or WebP, 1280×720 | Hero video poster and theme fallback |
| `from-ai.mp4` | MP4/H.264, 1280×720 | Interview response example |
| `true-false.mp4` | MP4/H.264, 1280×720 | Correct and incorrect interview response example |
| `true-false.jpg` | JPG or WebP, 1280×720 | Interview example poster |
| `talk-about-yourself.mp4` | MP4/H.264, 1280×720 | “Tell me about yourself” example |
| `talk-about-you.jpg` | JPG or WebP, 1280×720 | “Tell me about yourself” poster |
| `path-icon.png` | PNG/SVG, 512×512 | Career quiz card |
| `ai-advisors.png` | PNG/WebP, 900×650 | Soft skills promo card |
| `cv-preview.png` | PNG/WebP, 1000×700 | CV preview on landing page |
| `interview-prep.png` | PNG/WebP, 900×650 | Interview promotion |
| `programming-thumb.jpg` | JPG/WebP, 800×500 | Programming roadmap card |
| `uiux-thumb.jpg` | JPG/WebP, 800×500 | UI/UX roadmap card |
| `graphic-thumb.jpg` | JPG/WebP, 800×500 | Graphic design roadmap card |
| `logo.png` | PNG/SVG, square 256×256 | Site brand and favicon |
| `placeholders/main-video.svg` | SVG, 1280×720 | Hero video placeholder |
| `placeholders/interview-demo.svg` | SVG, 1280×720 | Interview demo placeholder |
| `placeholders/about-yourself.svg` | SVG, 1280×720 | Interview answer placeholder |

The media paths used by pages are centralized in `media.config.js` and the corresponding source keys in the HTML. Files with no page or stylesheet references were removed during cleanup.
