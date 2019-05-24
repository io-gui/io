import {html, IoElement} from "../core/element.js";

export class IoButton extends IoElement {
  static get style() {
    return html`<style>
      :host {
        background-color: var(--io-button-bg);
        background-image: var(--io-button-gradient);
        color: var(--io-color);
        border: var(--io-outset-border);
        border-color: var(--io-outset-border-color);
        border-radius: var(--io-border-radius);
        display: inline-block;
        cursor: pointer;
        white-space: nowrap;
        -webkit-tap-highlight-color: transparent;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        padding: var(--io-padding);
        padding-left: calc(3 * var(--io-padding));
        padding-right: calc(3 * var(--io-padding));
        transition: background-color 0.4s;
      }
      :host:focus {
        outline: none;
        border-color: var(--io-focus-color);
      }
      :host:hover {
        background-color: var(--io-hover-bg);
      }
      :host[pressed] {
        background-color: var(--io-pressed-bg);
      }
    </style>`;
  }
  static get properties() {
    return {
      value: undefined,
      label: 'Button',
      role: 'button',
      action: Function,
      tabindex: 0,
    };
  }
  static get listeners() {
    return {
      'click': 'onClick',
      'keydown': 'onKeydown',
    };
  }

  onClick() {
    if (this.action) this.action(this.value);
    this.dispatchEvent('button-clicked', {value: this.value, action: this.action}, true);
  }
  onKeydown(event) {
    if (event.which === 13 || event.which === 32) {
      event.preventDefault();
      if (this.action) this.action(this.value);
      this.dispatchEvent('button-clicked', {value: this.value, action: this.action}, true);
    } else if (event.which == 37) {
      event.preventDefault();
      this.navigateTo('left');
    } else if (event.which == 38) {
      event.preventDefault();
      this.navigateTo('up');
    } else if (event.which == 39) {
      event.preventDefault();
      this.navigateTo('right');
    } else if (event.which == 40) {
      event.preventDefault();
      this.navigateTo('down');
    }
  }
  navigateTo(direction) {
    const siblings = this.parentElement.querySelectorAll('[tabindex="0"]');
    const rect = this.getBoundingClientRect();
    let closest = this;
    let closestDist = Infinity;

    for (let i = siblings.length; i--;) {
      const sRect = siblings[i].getBoundingClientRect();
      const dX = sRect.x - rect.x;
      const dY = sRect.y - rect.y;
      const dist = Math.sqrt(dX * dX + dY * dY);
      switch (direction) {
        case 'right':
          if (dX > Math.abs(dY) && dist < closestDist) {
            closest = siblings[i], closestDist = dist;
          }
          break;
        case 'left':
          if (dX < -Math.abs(dY) && dist < closestDist) {
            closest = siblings[i], closestDist = dist;
          }
          break;
        case 'down':
          if (dY > Math.abs(dX) && dist < closestDist) {
            closest = siblings[i], closestDist = dist;
          }
          break;
        case 'up':
          if (dY < -Math.abs(dX) && dist < closestDist) {
            closest = siblings[i], closestDist = dist;
          }
          break;
      }
    }
    if (closest !== this) closest.focus();
  }
  changed() {
    this.title = this.label;
    this.innerText = this.label;
  }
}

IoButton.Register();
