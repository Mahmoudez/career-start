# Career Start

Career Start is a static Arabic first career guidance website for new graduates. The frontend uses vanilla HTML, CSS and JavaScript; Vercel serverless functions provide optional Gemini assistance. The deterministic CV analyzer and CV improvement suggestions work without Gemini.

## Run locally

1. Use Node.js 18 or newer.
2. Run `npm test` for the no-dependency analyzer and response parser checks.
3. For the static site, run `python3 -m http.server 8000` and open `http://localhost:8000`. Quiz, roadmap and soft-skills data also has a generated browser fallback for direct `file://` use; after editing JSON run `npm run sync-data-fallback` to refresh it. API-backed AI requires the Vercel local server, while the CV analyzer has a browser local fallback.
4. To run `/api` locally, use Vercel CLI (`vercel dev`) and configure the environment values below.

The landing page intro plays on every load. Add `?intro=0` to the URL to disable it while testing; the Skip button and Escape key also dismiss it.

## Environment variables

Copy `.env.example` to `.env.local` for local API development. Set `GEMINI_API_KEY` only in Vercel/server environment to enable AI. `GEMINI_MODEL` selects the first model (default `gemini-2.5-flash`) and `GEMINI_FALLBACK_MODEL` optionally adds another model. The functions always fall back to local rules if the key is absent, invalid, timed out, rate limited or unavailable. Never put provider keys in browser code. `SUPABASE_URL` and `SUPABASE_ANON_KEY` are optional public client settings; no Supabase feature currently depends on them.

## Deploy

Deploy the repository root as a Vercel static project with the included `/api` functions. Configure the Gemini variables in the Vercel project settings. No build step or dependency install is required. Requests are capped at 1 MB and the in-memory per-IP limiter is best effort per serverless instance, so it is appropriate for a demo rather than production abuse protection.

## CV resilience

`api/_cv-engine.js` holds shared deterministic checks for contact details, summary, skills, experience and action verbs, education, projects, measurable results, ATS formatting, field keywords, and text red flags. The API routes validate JSON, request size, field/section, retry transient Gemini failures with timeout and model fallback, and return `{ ok, source, result, warning? }`. Browser analysis extracts PDF/DOCX/TXT where its CDN helpers are available, caches the last result locally, and runs a local fallback if API access fails. Files are not uploaded; extracted text is submitted when the server endpoint is reachable.

## Media

All media paths are centralized in [`assets/media.config.js`](assets/media.config.js). Existing media can be replaced in place; expected names, formats, dimensions and usage are in [`assets/README-MEDIA.md`](assets/README-MEDIA.md). Video posters remain visible if a source fails, and the shared media fallback displays a poster card.

## Pages and data

- `index.html`: landing page and CV analyzer
- `pages/quiz.html`: career direction quiz (10 questions per field)
- `pages/roadmaps.html`: three learning tracks loaded from `data/roadmaps.json`
- `pages/soft-skills.html`: lessons, scenario practice, self checks and 15 item assessment
- `pages/interview.html`, `pages/cv-guide.html`, `pages/cv-builder.html`, `pages/cv-analyzer.html`: supporting tools

Assessment progress and the last CV result are stored in localStorage on the user's device.
