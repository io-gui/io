import local from '../app/local';

/**
 * Score — tracks which levels are completed.
 * Persisted in localStorage; updates CSS classes on level buttons.
 */
class Score {
  completed: Record<string, boolean> = {};

  init(): void {
    this.completed = {};
    this.load();
  }

  load(): void {
    const raw = local.get('score');
    if (raw) {
      try {
        const data = JSON.parse(String(raw));
        for (const i in data.completed) {
          this.completed[i] = data.completed[i];
        }
      } catch { /* ignore corrupt data */ }
      this.updateButtons();
    }
  }

  save(): void {
    localStorage['score'] = JSON.stringify({ completed: this.completed });
  }

  set(level: string, completed: boolean): void {
    this.completed[level] = completed;
    this.save();
    this.updateButtons();
  }

  updateButtons(): void {
    for (const btn of document.querySelectorAll('.nav-level')) {
      btn.classList.remove('completed');
    }
    for (const id in this.completed) {
      if (this.completed[id]) {
        const el = document.getElementById(id);
        if (el) {
          el.classList.add('completed');
          el.classList.remove('locked');
        }
      }
    }
  }
}

const score = new Score();
export default score;
