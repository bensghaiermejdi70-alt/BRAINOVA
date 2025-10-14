Platform (work copy)

How to run locally (Windows PowerShell):

1) Start the simple PowerShell static server (runs in foreground):

   .\platform\scripts\serve.ps1

2) Open a browser to:

   http://localhost:8000/platform/index.html

3) To run a quick smoke-test that checks accessibility of the index and each jeuxNN.html:

   .\platform\scripts\test_platform.ps1

Notes:
- The platform copies original game files and uses a single OverlayManager and GameLoader to open games inside a fullscreen iframe.
- If OverlayManager or GameLoader fail to initialize, games will open in a new browser tab as a fallback.
- Keep the original monolithic files untouched; this directory is a safe work copy.