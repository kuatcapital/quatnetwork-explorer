// Modified by Quat Capital, 2026-10-27: exercise actual canvas localization without starting the game. GPL-3.0.
import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';

import { describe, expect, it, vi } from 'vitest';

type Panel = { draw: () => void };
type Meter = {
  acheivement: boolean;
  setHighScore: (distance: number) => void;
  drawHighScore: () => void;
  highScore: Array<string>;
};
type RunnerState = {
  outerContainerEl: object;
  gameOver: () => void;
  gameOverPanel?: Panel;
  crashed: boolean;
  distanceRan: number;
  highestScore: number;
};
type RunnerClass = {
  prototype: object;
  instance_: RunnerState;
  imageSprite: object;
  updateLocale: (element: object) => void;
};

function createGame(locale: string, text: string, width = 600) {
  const source = readFileSync(new URL('../../public/static/capybara/index.js', import.meta.url), 'utf8');
  const bootstrap = 'new Runner(\'.interstitial-wrapper\');';
  expect(source.split(bootstrap)).toHaveLength(2);
  const sandbox = {
    window: {
      navigator: { platform: '', userAgent: '' },
      Runner: undefined as RunnerClass | undefined,
      TestDistanceMeter: undefined as (new(canvas: object, spritePos: object, width: number) => Meter) | undefined,
    },
    performance: { now: () => 100 },
  };
  // Define the real runner and panel; skip only automatic DOM/game initialization.
  const definitions = source.replace(bootstrap, '');
  const end = definitions.lastIndexOf('})();');
  // Expose the private, unmodified meter only inside this VM for its rendering regression.
  runInNewContext(definitions.slice(0, end) + 'window.TestDistanceMeter = DistanceMeter;\n' + definitions.slice(end), sandbox);
  const Runner = sandbox.window.Runner!;
  const attributes: Record<string, string> = { 'data-locale': locale, 'data-game-over': text, 'data-high-score': 'Рекорд' };
  const outer = { getAttribute: (name: string) => attributes[name] ?? null };
  const context = {
    font: '',
    textAlign: '',
    textBaseline: '',
    fillStyle: '',
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    clearRect: vi.fn(),
    drawImage: vi.fn(),
    fillText: vi.fn(),
    measureText: vi.fn((value: string): { width: number } => ({
      width: value.length * Number(context.font.match(/\d+/)?.[0] ?? 18),
    })),
  };
  const runner = Object.assign(Object.create(Runner.prototype) as RunnerState, {
    outerContainerEl: outer,
    canvas: { getContext: () => context },
    dimensions: { WIDTH: width, HEIGHT: 150 },
    spriteDef: { TEXT_SPRITE: { x: 655, y: 2 }, RESTART: { x: 2, y: 2 } },
    distanceMeter: { acheivement: false, setHighScore: vi.fn(), drawHighScore: vi.fn() } as Omit<Meter, 'highScore'> & { highScore?: Array<string> },
    tRex: { update: vi.fn() },
    stop: vi.fn(),
    distanceRan: 42,
    highestScore: 1000,
    crashed: false,
  });
  Runner.imageSprite = {};
  Runner.instance_ = runner;
  return { Runner, runner, context, attributes, outer, DistanceMeter: sandbox.window.TestDistanceMeter! };
}

describe('Capybara runtime locale', () => {
  it.each([
    [ 'ru', 'ИГРА ОКОНЧЕНА' ],
    [ 'kk', 'ОЙЫН АЯҚТАЛДЫ' ],
  ])('draws %s text with a Cyrillic font and leaves restart artwork intact', (locale, text) => {
    const { runner, context } = createGame(locale, text);
    runner.gameOver();
    expect(context.fillText).toHaveBeenCalledWith(text, 300, expect.any(Number), 576);
    expect(context.font).toMatch(/bold \d+px Arial, sans-serif/);
    expect(context.drawImage).toHaveBeenCalledTimes(1);
    expect(context.restore).toHaveBeenCalledOnce();
  });

  it('preserves English sprite coordinates and redraws a crashed game without resetting it', () => {
    const { Runner, runner, context, attributes, outer } = createGame('en', 'GAME OVER');
    runner.gameOver();
    expect(context.fillText).not.toHaveBeenCalled();
    expect(context.drawImage).toHaveBeenCalledTimes(2);
    const englishSprite = context.drawImage.mock.calls[0];
    attributes['data-locale'] = 'ru';
    attributes['data-game-over'] = 'ИГРА ОКОНЧЕНА';
    Runner.updateLocale(outer);
    expect(context.fillText).toHaveBeenLastCalledWith('ИГРА ОКОНЧЕНА', 300, expect.any(Number), 576);
    expect(context.clearRect).toHaveBeenCalled();
    attributes['data-locale'] = 'en';
    Runner.updateLocale(outer);
    expect(context.drawImage.mock.calls.at(-2)).toEqual(englishSprite);
    expect(runner.distanceRan).toBe(42);
    expect(runner.highestScore).toBe(1000);
    expect(runner.crashed).toBe(true);
  });

  it('fits narrow canvases and ignores a detached container or a running game', () => {
    const { Runner, runner, context, outer } = createGame('kk', 'ОЙЫН АЯҚТАЛДЫ', 180);
    runner.gameOver();
    expect(context.measureText.mock.calls.length).toBeGreaterThan(1);
    expect(context.fillText).toHaveBeenLastCalledWith('ОЙЫН АЯҚТАЛДЫ', 90, expect.any(Number), 156);
    context.fillText.mockClear();
    Runner.updateLocale({});
    expect(context.fillText).not.toHaveBeenCalled();
    runner.crashed = false;
    Runner.updateLocale(outer);
    expect(context.fillText).not.toHaveBeenCalled();
  });

  it('localizes the high-score prefix without changing its digits or overlapping the current score', () => {
    const { Runner, runner, context, attributes, outer, DistanceMeter } = createGame('en', 'GAME OVER', 180);
    const meter = new DistanceMeter(runner.canvas, { x: 655, y: 2 }, 180);
    runner.distanceMeter = meter;
    meter.setHighScore(40000);
    const digits = [ ...meter.highScore ];
    context.drawImage.mockClear();
    meter.drawHighScore();
    const englishCalls = [ ...context.drawImage.mock.calls ];
    expect(englishCalls).toHaveLength(8);
    runner.crashed = true;
    attributes['data-locale'] = 'kk';
    context.drawImage.mockClear();
    context.translate.mockClear();
    Runner.updateLocale(outer);
    expect(context.fillText).toHaveBeenLastCalledWith('Рекорд', 39, 16, 37);
    expect(context.drawImage).toHaveBeenCalledTimes(5);
    expect(context.translate.mock.calls.every(([ x ]) => x === 14)).toBe(true);
    expect(meter.highScore).toEqual(digits);
    expect(runner.distanceRan).toBe(42);
    attributes['data-locale'] = 'en';
    context.drawImage.mockClear();
    Runner.updateLocale(outer);
    expect(context.drawImage.mock.calls).toEqual(englishCalls);
  });
});
