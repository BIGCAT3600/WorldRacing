# World Racing development workflow

- **main**: stable public GitHub Pages release. Do not commit untested changes directly here.
- **dev**: experimental work. Push to dev, then review the GitHub Actions **World Racing visual smoke test**.
- Download the `world-racing-screenshots` artifact from the latest Actions run to inspect driving, acceleration and F2 developer camera screenshots.
- Once screenshots and browser errors are checked, merge a pull request from dev into main.
- F2 toggles an overhead developer view. F3 toggles track wireframe overlay. F4 teleports the car to a new circuit section.
- The screenshot workflow is a smoke test, not proof of visual quality. Inspect its PNGs before merging.
- Revert a bad release through GitHub commit history or a revert pull request.

GitHub Pages remains served from main; the dev branch does not automatically replace the live game.
