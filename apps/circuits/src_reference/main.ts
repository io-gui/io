/**
 * Circuits — main entry point.
 * All modules are ES modules written in TypeScript.
 */

import { resize } from './app/resize';
import { initBindings } from './app/bindings';
import navigation from './app/navigation';
import scene from './game/scene';
import editor from './game/editor';
import game from './game/game';
import plotter from './game/plotter';
import score from './game/score';

// --- Boot ---

resize();

scene.init();
game.init();
plotter.init();
score.init();
editor.init();

initBindings(game);
navigation.init(game);
