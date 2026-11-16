// SALTROAD — deterministic screenshot scenes for ?shot=title|play|camp|win&seed=N.
import { CFG } from './config.js';
import { makeRng } from './rng.js';

function stageEntities(game, seed) {
  const rng = makeRng(seed * 31 + 7);
  const ents = [];
  // a salt chain arcing toward the caravan
  for (let i = 0; i < 4; i++) {
    ents.push({ kind: 'salt', x: 380 + i * 42, y: 300 - i * 26, vy: 0, hp: 1, r: 12 });
  }
  ents.push({ kind: 'water', x: 640, y: 250, vy: 0, hp: 1, r: 13 });
  ents.push({ kind: 'coin', x: 700, y: 330, vy: 0, hp: 1, r: 11 });
  ents.push({ kind: 'salt', x: 760, y: 260, vy: 0, hp: 1, r: 12 });
  ents.push({ kind: 'sinkhole', x: 300, y: 470, vy: 0, hp: 1, r: 26 });
  ents.push({ kind: 'thorn', x: 820, y: 470, vy: 0, hp: 1, r: 20 });
  ents.push({ kind: 'raider', x: 880, y: 210, vy: 0, hp: 1, r: 16 });
  ents.push({ kind: 'water', x: 220, y: 240, vy: 0, hp: 1, r: 13 });
  void rng;
  game.trail.entities = ents;
}

export function stageShot(game, shot, seed) {
  game.shotMode = true;
  game.seed = seed;
  if (shot === 'title') {
    game.state = 'title';
    game.time = 2.4;
    game.best = 38518;
    game.trail.startDay(1, seed);
    game.caravan.x = 200;
    game.caravan.y = 480;
    stageEntities(game, seed);
  } else if (shot === 'play') {
    game.startRun();
    game.day = 4;
    game.best = 38518;
    game.distance = 620;
    game.dayProgress = 0.62;
    game.water = 64;
    game.salt = 86;
    game.saltTotal = 86;
    game.coin = 40;
    game.score = 12480;
    game.combo = 5;
    game.comboTimer = 2;
    game.bestCombo = 6;
    game.camels = 4;
    game.caravan.x = 512;
    game.caravan.y = 400;
    game.setBanner('DAY 4 — RAIDER AMBUSH', 99);
    stageEntities(game, seed);
    game.state = 'play';
  } else if (shot === 'camp') {
    game.startRun();
    game.day = 5;
    game.water = 58;
    game.salt = 142;
    game.coin = 65;
    game.score = 15230;
    game.camels = 4;
    game.bestCombo = 7;
    game.camp.open(makeRng(seed * 13 + 5));
    game.state = 'camp';
  } else if (shot === 'win') {
    game.startRun();
    game.day = 12;
    game.water = 41;
    game.salt = 388;
    game.saltTotal = 412;
    game.coin = 120;
    game.score = 41280;
    game.bestCombo = 8;
    game.camels = 4;
    game.grade = game.gradeOf(game.score);
    game.best = Math.max(game.best, 41280);
    game.newBest = true;
    game.state = 'win';
  }
}
