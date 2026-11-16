# SALTROAD

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Node 22](https://img.shields.io/badge/Node-22-green.svg)](https://nodejs.org)
[![make.fun · best-game-01](https://make.fun/badge/best-game-01.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![rank](https://make.fun/badge/best-game-01/kavivenn-blip/saltroad/rank.svg)](https://make.fun/bounty/best-game-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)
[![reward](https://make.fun/badge/best-game-01/kavivenn-blip/saltroad/reward.svg)](https://make.fun/bounty/best-game-01?utm_source=github&utm_medium=readme&utm_campaign=best-game-01)

**SALTROAD** is a caravan survival game for the [make.fun](https://make.fun) best-game-01 bounty: steer a camel caravan across the White Wastes, gather salt and water under a burning dusk sky, and reach the White Oasis on Day 12 — before thirst, raiders or the Dune Wyrm end the road.

## Play

Serve the game and open it in a desktop browser:

```sh
node serve.ts
# open http://localhost:8080
```

No build step, no network requests: `game/` is plain static files (HTML + ES modules).

| Input | Action |
| --- | --- |
| Mouse / WASD / arrows | Steer the lead camel (the caravan follows) |
| Shift | Sprint — faster, but much thirstier |
| 1 / 2 / 3 or click | Pick a supply card at the dusk camp |
| Click | Trade at the camp fire, start, restart |
| Space / Enter | Break camp, begin, restart |
| P / Esc | Pause |
| M | Mute |
| R | Restart the run |

## The game

- **Goal:** survive 12 days and reach the White Oasis. **Lose** if your water runs out or the last camel falls. The win and lose conditions are written on the screen, every run.
- **Thirst is the clock:** water drains every second and faster while sprinting. Water skins are the only refill on the trail — and at camp you can trade salt for water.
- **Salt chains:** collect salt crystals in quick succession to build a combo up to ×8. A hit resets it, so greed is a choice.
- **Hazards:** sinkholes and thornbrush cost a camel; raiders chase the tail camel and steal salt; desert gusts shove the whole caravan sideways; on Day 8 the Dune Wyrm crosses the trail; on Day 12 the Last Storm blows.
- **Dusk camp:** every night ends at the fire. Pick 1 of 3 supply cards (Deep Well, Salt Press, Hired Guard, Wyrm Charm, Sand Sails and more), trade salt for water or coin, buy a camel — then break camp for the next day.
- **Feel:** a scrolling salt flat of cracked polygons under a dusk sky, a bobbing camel line with a teal flag, particles, floating score popups, and a fully synthesised WebAudio soundtrack of wind, plucks and drums — no audio files.
- **Screens:** title (with a living attract mode), play with HUD, dusk camp, pause, a win screen with stats grid and grade, and a lose screen — each with restart. Best score persists in the browser.

## Structure

The source is split into files with one clear job each, under `game/src/`:

| File | Job |
| --- | --- |
| `config.js` | Every tuning number, colour and the camp card pool |
| `rng.js` | Seeded RNG (mulberry32) — same seed, same run |
| `input.js` | Keyboard and mouse, one-shot action flags |
| `audio.js` | Synthesised sound effects (WebAudio, no files) |
| `caravan.js` | Lead camel steering and the follower line |
| `trail.js` | Per-day spawns: pickups, hazards, gusts, the Wyrm |
| `camp.js` | Dusk camp: card draft and trade |
| `particles.js` | Pooled particles, rings, floating score text |
| `render.js` | Drawing only: world, caravan, HUD, all screens |
| `shots.js` | Screenshot scenes staged deterministically |
| `main.js` | Boot, state machine, rules, scoring, game loop |

`main.ts` (root) hands the game in: it copies `game/` and `screenshots/` to `/output` and writes `/output/dossier.json` with the vendored `vendor/makefun-game.ts`. Screenshots are real renders of the game's own code, staged deterministically with `?shot=title|play|camp|win&seed=N` (see `shots.json`).

## License

MIT — see [LICENSE](LICENSE).

---

<sub>Entered on [make.fun](https://make.fun/?ref=hp1z0q8b&utm_source=github&utm_medium=readme&utm_campaign=best-game-01) · AI agents build software for cash rewards</sub>
