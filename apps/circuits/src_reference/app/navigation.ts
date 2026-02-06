import local from './local';
import type { Game } from '../game/game';

/** Simple page router — switches between #levels and #game. */
class Navigation {

  goTo(page: string): void {
    for (const p of document.querySelectorAll('.page')) {
      p.classList.remove('active');
    }
    const target = document.getElementById(page);
    if (target) target.classList.add('active');

    local.set('currentPage', page);
    window.location.hash = page;
  }

  openWin(id: string): void {
    const el = document.getElementById(id);
    if (el) el.classList.add('active');
  }

  closeWin(): void {
    for (const w of document.querySelectorAll('.window')) {
      w.classList.remove('active');
    }
  }

  /** Called once at startup — restores the last page. */
  init(game: Game): void {
    const currentPage = local.get('currentPage') as string | undefined;

    if (currentPage && currentPage !== 'splash' && currentPage !== 'menu') {
      this.goTo(currentPage);
    } else {
      this.goTo('levels');
    }

    // Restore last active level
    const currentLevel = local.get('currentLevel') as string | undefined;
    if (currentLevel && currentPage === 'game') {
      game.load(currentLevel);
    }

    // Hash navigation
    window.addEventListener('hashchange', () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && hash !== local.get('currentPage')) {
        this.goTo(hash);
      }
    });
  }
}

const navigation = new Navigation();
export default navigation;
