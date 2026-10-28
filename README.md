# Browser Pong

A browser-based Pong game built with HTML, CSS, and JavaScript. Play against the computer or challenge a friend on the same keyboard. No Python, installation, or external libraries are required to play.

## Play

Live site (once GitHub Pages is deployed): https://reckful90.github.io/browser-pong/

To play locally, open `dist/index.html` in a modern web browser. `Pong.html` is an identical standalone copy.

## Controls

Choose **Start Game** for single player or **2 Player Game** for local multiplayer.

| Mode | Paddle | Controls |
| --- | --- | --- |
| Single player | Left | Up/down arrows, W/S, mouse movement, or touch and drag on the court |
| Two players | Player 1, left | W / S |
| Two players | Player 2, right | Up / down arrows |

- **Space** or the **Pause/Resume** button pauses or resumes a game. Click the court first if keyboard input is focused on a button or slider.
- **Reset** clears both scores and returns the current mode to its ready state; press Start to play again.
- **Main Menu** returns to mode selection.
- **Starting speed** changes the starting ball speed; during a game, the new setting applies to the next rally.
- Catch a blue orb with your paddle to gain a second paddle for 10 seconds.
- The ball gets faster as a rally continues. The game pauses when its browser window loses focus.

## Project files

- `dist/index.html`: the complete game published to GitHub Pages.
- `Pong.html`: standalone copy, kept identical to the published game.
- `check-pong.cjs`: automated gameplay checks, run with `node check-pong.cjs` (requires Node.js).
- `Implementation ideas.md`: feature ideas and development notes.
- `.github/workflows/pages.yml`: checks and publishes the `dist` folder on pushes to `main`, or when run manually.

## Publishing

In the repository, open **Settings > Pages** and select **GitHub Actions** as the publishing source. Push a change to `main`, or open **Actions > Deploy Pong to GitHub Pages > Run workflow**. Once deployment succeeds, the live link above serves the game. Subsequent pushes to `main` update it automatically after checks pass.
