// SALTROAD — the dusk camp: choose 1 of 3 cards, plus trade and repair.
import { CFG, CARD_POOL } from './config.js';

export class Camp {
  constructor() {
    this.cards = [];
    this.picked = false;
  }
  open(rng) {
    const pool = [...CARD_POOL];
    this.cards = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(rng.next() * pool.length);
      this.cards.push(pool.splice(idx, 1)[0]);
    }
    this.picked = false;
  }
  // trade options, each with a live affordability check
  trades(game) {
    return [
      {
        id: 'water', label: `Sell ${CFG.TRADE_SALT_WATER.salt} salt → +${CFG.TRADE_SALT_WATER.water} water`,
        ok: game.salt >= CFG.TRADE_SALT_WATER.salt,
        run: () => { game.salt -= CFG.TRADE_SALT_WATER.salt; game.water = Math.min(game.waterMax, game.water + CFG.TRADE_SALT_WATER.water); },
      },
      {
        id: 'coin', label: `Sell ${CFG.TRADE_SALT_COIN.salt} salt → +${CFG.TRADE_SALT_COIN.coin} coin`,
        ok: game.salt >= CFG.TRADE_SALT_COIN.salt,
        run: () => { game.salt -= CFG.TRADE_SALT_COIN.salt; game.coin += CFG.TRADE_SALT_COIN.coin; },
      },
      {
        id: 'camel', label: `Buy a camel — ${CFG.CAMEL_PRICE} coin`,
        ok: game.coin >= CFG.CAMEL_PRICE && game.camels < CFG.CAMEL_MAX,
        run: () => { game.coin -= CFG.CAMEL_PRICE; game.camels += 1; },
      },
    ];
  }
}
