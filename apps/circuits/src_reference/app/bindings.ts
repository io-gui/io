import { isMobile } from './touches';
import navigation from './navigation';
import local from './local';
import type { Game } from '../game/game';

/**
 * Wire up all UI event bindings.
 * Called once at startup, after DOM is ready.
 */
export function initBindings(game: Game): void {
  const clickEvt = isMobile() ? 'touchstart' : 'click';

  // --- Level buttons ---
  for (const btn of document.querySelectorAll<HTMLElement>('.nav-level')) {
    const level = btn.id;
    btn.addEventListener('click', () => {
      if (!btn.classList.contains('locked')) {
        navigation.goTo('game');
        game.load(level);
      }
    });
  }

  // --- Game toolbar ---
  const on = (id: string, handler: () => void) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener(clickEvt, handler);
  };

  on('btn-back', () => {
    game.init();
    navigation.goTo('levels');
  });

  on('btn-undo', () => game.undo());
  on('btn-redo', () => game.redo());
  on('btn-reset', () => game.reset(String(local.get('currentLevel') ?? '')));
  on('btn-edit', () => navigation.openWin('editor-window'));
  on('btn-editor-close', () => navigation.closeWin());
}
