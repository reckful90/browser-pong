# Pong: future implementation ideas

Saved 8 October 2026.

Status: The collectible orb and Double Paddle power-up are now implemented. Other features remain concepts only. Proposed details for future features are starting points for testing, not final decisions.

## Design principles

Keep the game visually calm and simple for the children. Avoid flashing, particles, unnecessary animation, sound effects and crowded screens. Build gradually and use the children's feedback to guide changes. Retain keyboard and touch controls.

## Power-ups

### Collectible orbs (implemented)

Random coloured orbs appear within a paddle's movement path. A player must move their paddle into an orb to collect it before it disappears. Proposed collection window: around 3 seconds. Show only one orb at a time initially. Decide how often orbs appear and whether the computer can collect them too.

### Faster next hit

Collecting an orb charges one hit that sends the ball 50% faster. A small coloured mark on the paddle shows that the boost is ready and disappears when used.

Proposed behaviour: the boost lasts until the ball hits the opposing paddle, then returns to the normal rally speed. Keep the normal 5% increase per hit separate from the temporary boost. Initially respect the existing 4x starting-speed cap. Confirm these choices during implementation.

### Double Paddle (implemented)

Collecting another type of orb gives a second defensive paddle for roughly 10 seconds. Both paddles move together with the existing controls. Either paddle can return the ball.

Proposed placement: slightly further into the court and vertically offset to give extra coverage. Decide the offset and top/bottom boundary behaviour before implementation. The extra paddle should resemble the original. A small, quiet duration bar can indicate time remaining. Collecting the same power-up again restarts the timer rather than adding more paddles.

## Main menu

Three simple, large buttons before entering a game:

- Start game: solo play against the computer.
- Multiplayer: choose shared-screen play or, in a later phase, separate-device play.
- Scoreboard: personal bests and a family leaderboard.

## Players and scoreboard

Let each child select their name before playing and view their personal high scores. Decide which achievements constitute a high score.

Proposed scoring: a match to 10 points, with longest rally recorded separately. The current game runs indefinitely, so total points alone would favour longer sessions. Decide whether a rally achievement counts all paddle hits or only the player's hits.

First phase: save names and scores locally in the browser. Different browsers and iPads will have separate records, and clearing browser data can remove them.

Later phase: shared family scores across devices require shared storage. Decide score categories for solo and multiplayer, and whether speed settings and power-ups should have separate records for fair comparisons.

## Multiplayer

### Shared screen

Two players control one paddle each.

- Computer: separate keyboard controls for each player.
- iPad: independent simultaneous touch controls on the left and right halves of the court.

This is the simpler multiplayer phase. Test multiple simultaneous touches and avoid fingers obscuring the play area.

### Separate devices on the same Wi-Fi

Proposed flow: one player creates a room; the other joins with a short code. Each device controls its own paddle while the match stays synchronised.

Same-Wi-Fi membership alone does not connect browser games. This needs a multiplayer connection service, typically a small server, or peer-to-peer connections with a signalling service. GitHub Pages can host the game interface; it cannot run that multiplayer server. This phase is more involved because it must handle latency, scoring consistency, disconnects and reconnection.

The current concept is head-to-head Pong. Clarify whether cooperative play is also desired before implementing a separate cooperative mode.

## Suggested sequence (not committed)

1. Main menu, player names, match rules and personal scores.
2. Shared-screen multiplayer, including iPad touch controls.
3. Optional power-ups, introduced one at a time and tested with the children.
4. Separate-device rooms and a shared family leaderboard.

## Existing game behaviour to preserve unless explicitly changed

Solo player controls the left paddle; computer controls the right. Black court with white paddles and ball. Starting-speed slider, Start/Pause and Reset. Ball speed increases by 5% per paddle hit, capped at 4x starting speed, and resets after each point. No sound effects.


## Implemented Double Paddle behaviour

One blue orb appears on either paddle line after six seconds of active play, then at random intervals of 8-12 seconds after collection or expiry. It stays for five seconds. Either side can collect its own orb by touching it with a paddle. The computer attempts collection while the ball is travelling away. The extra paddle lasts 10 seconds of active play, shares the original vertical line, and has a 58-pixel gap above or below the original. Both paddles move together and stay inside the court. Pausing freezes timers; Reset clears the orb and powers. Extra defence can persist across points until its timer expires. Faster-hit power-ups and leaderboards remain unimplemented.


## Implemented main menu and local two-player mode

The black-and-white main menu offers Start Game (single-player against the existing AI) and 2 Player Game (local keyboard play). In two-player mode, Player 1 controls the left paddle with W/S and Player 2 controls the right paddle with Up/Down. Both move at the same speed. Single-player retains arrows, W/S, mouse and touch. Space pauses/resumes. Main Menu ends the current match; selecting either mode starts a fresh match. Reset clears scores and powers within the selected mode and leaves play paused. Existing speed, collision, scoring and blue-orb mechanics are preserved in both modes.

Validation: run node check-pong.cjs. Automated checks cover both modes, menu transitions, independent and simultaneous controls, AI and pointer input in single-player, scores, pause/resume/reset, focus loss, powers and collision regressions. Browser visual QA could not be completed because the local preview was inaccessible in the editing environment.
