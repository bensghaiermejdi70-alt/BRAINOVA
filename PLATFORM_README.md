Brainova Platform — Packaging and GitHub Pages

This folder contains instructions and a small build helper to create a self-contained
platform package suitable for uploading to GitHub Pages (or any static host).

Files provided:
- scripts/build_platform.ps1 — PowerShell script that assembles `platform_build/` and creates `Brainova_platform.zip`.

Quick local test (Windows / PowerShell):
1. From the repository root run:
   powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\build_platform.ps1
   This creates `platform_build/` and `Brainova_platform.zip`.

2. Start a local static server from the repository root. If you have Python:
   python -m http.server 8000
   Then open http://localhost:8000/platform_build/

   Or use the included Node server (for more logging):
   node simple_static_server.js
   Open http://localhost:8000/platform_build/

3. Verify the platform loads and games open in the overlay.
   - Open DevTools console: look for `GamesIndex: loaded` and `OverlayManager` logs.
   - Try the debug buttons (if present) in `brainova.html`.

Publish to GitHub Pages:
- Option A: Upload ZIP contents to the `gh-pages` branch or `docs/` folder of your repo.
  1. Unzip `Brainova_platform.zip` locally.
  2. Commit the files to `gh-pages` (or to `docs/` on `main`), push to GitHub.
  3. In repository Settings -> Pages, point the site source to the `gh-pages` branch (or `main/docs`).

- Option B: Use the repository root (site root) if you want the platform at `/`.
  Ensure `index.html` is the platform entry (the build script creates `index.html` that redirects to `brainova.html`).

Notes and caveats:
- Always serve over HTTP(S). many in-page overlay/iframe behaviors fail when opened via `file://`.
- If some games rely on absolute paths (e.g., `/platform/...`), double-check the file references after packaging.
- If you want the platform at a subpath (e.g., `https://user.github.io/repo/platform/`), update `base` tags or paths in `brainova.html` and `platform/games/games-index.js` accordingly.

If you'd like, I can:
- Produce the `platform_build/` contents and a ZIP here (I can copy the files into the build folder and create the zip). Note: I cannot push to your GitHub repo from this environment, I can only create the package for you to upload.
- Adjust paths to work under a subpath (e.g., `/repo/` prefix) if you plan to host the platform there. Provide the target path.
