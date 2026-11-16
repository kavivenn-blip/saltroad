// SALTROAD — every tuning number and colour in one place.
export const CFG = {
  W: 1024,
  H: 576,
  DAYS: 12,
  DAY_LENGTH_S: 30,
  DAY_DISTANCE: 1000,
  // caravan
  CAMEL_START: 3,
  CAMEL_MAX: 6,
  BASE_SPEED: 34, // world units per second scrolled
  SPRINT_MULT: 1.6,
  STEER_SPEED: 430, // px per second, keyboard
  MOUSE_FOLLOW: 9.0, // lerp rate toward the pointer
  // water: the survival clock
  WATER_START: 100,
  WATER_MAX: 100,
  WATER_DRAIN: 1.05, // per second
  WATER_DRAIN_SPRINT: 2.3,
  WATER_SKIN: 18,
  WATER_LOW_WARN: 25,
  // pickups
  SALT_SCORE: 25,
  COMBO_MAX: 8,
  COMBO_WINDOW_S: 2.5,
  COIN_VALUE: 5,
  // hazards
  HIT_INVULN_S: 1.6,
  RAIDER_SALT_STEAL: 10,
  // camp trade
  TRADE_SALT_WATER: { salt: 10, water: 15 },
  TRADE_SALT_COIN: { salt: 20, coin: 25 },
  CAMEL_PRICE: 40,
  // grades (final score)
  GRADE_S: 45000,
  GRADE_A: 30000,
  GRADE_B: 18000,
};

export const PAL = {
  skyTop: '#2b1d3a',
  skyMid: '#7a3b4f',
  skyLow: '#e08a4e',
  horizon: '#f2b06a',
  salt: '#f7efdd',
  saltShadow: '#e3d3b3',
  saltCrack: '#b89a6d',
  duneFar: '#c98a56',
  duneNear: '#a86a42',
  trail: '#e9dcc0',
  ink: '#241a12',
  panel: 'rgba(24,14,8,0.82)',
  panelEdge: '#e8b25c',
  gold: '#f5c542',
  teal: '#3ec6b8',
  water: '#4fb3e8',
  danger: '#e84a4a',
  cream: '#fff6e0',
  muted: '#c9b18a',
};

export const CARD_POOL = [
  { id: 'well', name: 'Deep Well', icon: '💧', rarity: 'common', desc: '+35 water, right now.', apply: (g) => { g.water = Math.min(g.waterMax, g.water + 35); } },
  { id: 'cask', name: 'Water Cask', icon: '🛢️', rarity: 'common', desc: '+25 max water. Stacks to 3.', apply: (g) => { g.waterMax += 25; g.water = Math.min(g.waterMax, g.water + 25); } },
  { id: 'camel', name: 'Stray Camel', icon: '🐪', rarity: 'common', desc: '+1 camel joins the caravan.', apply: (g) => { g.camels = Math.min(CFG.CAMEL_MAX, g.camels + 1); } },
  { id: 'press', name: 'Salt Press', icon: '⚙️', rarity: 'rare', desc: 'Salt scores double from now on.', apply: (g) => { g.saltMult *= 2; } },
  { id: 'hooves', name: 'Swift Hooves', icon: '💨', rarity: 'common', desc: '+12% travel speed. Days end sooner.', apply: (g) => { g.speedMult *= 1.12; } },
  { id: 'guard', name: 'Hired Guard', icon: '🛡️', rarity: 'rare', desc: 'Raiders flee. No more ambushes.', apply: (g) => { g.guard = true; } },
  { id: 'compass', name: 'Salt Compass', icon: '🧭', rarity: 'common', desc: 'Water skins glow and drift toward you.', apply: (g) => { g.compass = true; } },
  { id: 'lantern', name: 'Dune Lantern', icon: '🏮', rarity: 'common', desc: '+1s combo window. Chains last longer.', apply: (g) => { g.comboWindow += 1; } },
  { id: 'pouch', name: 'Coin Pouch', icon: '👛', rarity: 'common', desc: '+30 coin, right now.', apply: (g) => { g.coin += 30; } },
  { id: 'bandage', name: 'Camel Salve', icon: '🩹', rarity: 'common', desc: 'Heal the caravan: +1 camel, +15 water.', apply: (g) => { g.camels = Math.min(CFG.CAMEL_MAX, g.camels + 1); g.water = Math.min(g.waterMax, g.water + 15); } },
  { id: 'charm', name: 'Wyrm Charm', icon: '🧿', rarity: 'rare', desc: 'The Dune Wyrm passes once, then sleeps.', apply: (g) => { g.wyrmCharm = true; } },
  { id: 'sails', name: 'Sand Sails', icon: '⛵', rarity: 'rare', desc: 'Storm gusts push you forward instead of sideways.', apply: (g) => { g.sandSails = true; } },
];
