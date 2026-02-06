/** Wrapper around localStorage with type coercion and debug display. */
class Local {

  set(name: string, value: string | number): void {
    localStorage[name] = String(value);
    for (const el of document.querySelectorAll<HTMLElement>('.var_' + name)) {
      el.textContent = String(value);
    }
  }

  get(name: string): string | number | undefined {
    const raw: string | undefined = localStorage[name];
    if (raw === undefined) return undefined;

    const num = parseFloat(raw);
    const value: string | number = !isNaN(num) && isFinite(num) ? num : raw;

    for (const el of document.querySelectorAll<HTMLElement>('.var_' + name)) {
      el.textContent = String(value);
    }
    return value;
  }

  add(name: string, value: number): void {
    const old = this.get(name);
    if (old !== undefined && typeof old === 'number') {
      this.set(name, value + old);
    } else {
      this.set(name, value);
    }
  }

  reload(name: string, def?: string): string | number {
    const old = this.get(name);
    return old ?? def ?? '';
  }
}

const local = new Local();
export default local;
