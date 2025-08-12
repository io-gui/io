import { Register, ReactiveProperty, Property, IoOverlaySingleton as Overlay, span, WithBinding, NudgeDirection } from 'io-core';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { IoMenuElementType, getMenuRoot, getMenuAncestors, getMenuDescendants, getMenuSiblings, getHoveredMenuItem } from '../utils/MenuDOMUtils.js';
import { MenuOption } from '../nodes/MenuOption.js';
import { IoMenuOptions } from './IoMenuOptions.js';
import { IoMenuTree } from './IoMenuTree.js';

let timeoutOpen = -1;

let hovered: IoMenuElementType | undefined;
let prevHovered: IoMenuElementType | undefined;

export function onOverlayPointerdown(event: PointerEvent) {
  hovered = undefined;
  prevHovered = undefined;
}

export function onOverlayPointermove(event: PointerEvent) {
  clearTimeout(timeoutOpen);
  hovered = getHoveredMenuItem(event);
  if (hovered && hovered !== prevHovered) {
    const v = Math.abs(event.movementY) - Math.abs(event.movementX);
    const h = (hovered.parentElement as IoMenuOptions)?.horizontal;
    if (prevHovered?.parentElement !== hovered.parentElement) {
      prevHovered = hovered;
      hovered.focus();
    } else if (h ? v < -0.25 : v > 0.25) {
      prevHovered = hovered;
      hovered.focus();
    } else {
      timeoutOpen = setTimeout(() => {
        prevHovered = hovered;
        if (hovered) hovered.focus();
      }, 250);
    }
  }
}

export function onOverlayPointeup(event: PointerEvent) {
  if (hovered) (hovered as any).onClick();
}

Overlay.addEventListener('pointermove', onOverlayPointermove);

export type IoMenuItemProps = IoFieldProps & {
  option?: MenuOption,
  label?: string,
  expanded?: WithBinding<boolean>,
  direction?: NudgeDirection,
  depth?: number,
  $parent?: IoMenuOptions | IoMenuTree,
};

/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu options whose `option.value` matches selected value.
 **/

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoMenuItem extends IoField {
  static get Style() {
    return /* css */`
      :host > * {
        pointer-events: none;
        text-overflow: ellipsis;
      }
      :host > .label {
        flex: 1 1 auto;
        padding: 0 var(--io_spacing2);
      }
      :host > .hint {
        flex: 0 1 auto;
        opacity: 0.25;
        padding: 0 var(--io_spacing2);
      }
      :host > .hasmore {
        opacity: 0.5;
      }
    `;
  }

  @ReactiveProperty({type: MenuOption})
  declare option: MenuOption;

  @Property('')
  declare label: string;

  @ReactiveProperty({value: false, reflect: true})
  declare expanded: boolean;

  @ReactiveProperty({value: 'right', reflect: true})
  declare direction: NudgeDirection;

  @ReactiveProperty({value: 1000, reflect: true})
  declare depth: number;

  @Property('false')
  declare contentEditable: string;

  @Property()
  declare $parent?: IoMenuOptions | IoMenuTree;

  declare $options?: IoMenuOptions;

  static get Listeners(): any {
    return {
      'click': 'preventDefault',
      'focus': 'onFocus',
      'blur': 'onBlur',
    };
  }

  constructor(args: IoMenuItemProps = {}) { super(args); }

  preventDefault(event: Event) {
    event.stopPropagation();
    event.preventDefault();
  }
  get hasmore() {
    return this.option.options.length && this.depth > 0;
  }
  get inoverlay() {
    return Overlay.contains(this.parentElement?.parentElement as HTMLElement);
  }
  connectedCallback() {
    super.connectedCallback();
    if (this.$options) Overlay.appendChild(this.$options as HTMLElement);
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    if (this.$options) Overlay.removeChild(this.$options as HTMLElement);
  }
  onClick() {
    const o = this.option;
    if (this.hasmore) {
      if (!this.expanded) this.expanded = true;
    } else if (o.mode === 'toggle') {
      o.selected = !o.selected;
    } else {
      if (o.action) {
        o.action.apply(null, [o.value]);
        this.collapseRoot();
      }
      if (o.mode === 'select') {
        if (o.options.length && this.depth <= 0) {
          o.selectDefault();
        } else {
          o.selected = true;
          // TODO: figure out OptionSelect value input with NodeArray options
          // o.dispatch('option-selected', {option: o}, true);
        }
        this.collapseRoot();
      }
    }
    getMenuRoot(this).dispatch('io-menu-option-clicked', {option: o}, true);
  }
  onPointerdown(event: PointerEvent) {
    super.onPointerdown(event);
    if (event.pointerType !== 'touch') {
      this.setPointerCapture(event.pointerId);
      event.stopPropagation();
      if (this.hasmore) this.expanded = true;
      onOverlayPointerdown.call(this, event);
    }
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation();
    if (event.pointerType !== 'touch') {
      onOverlayPointermove.call(this, event);
    }
  }
  onPointerup(event: PointerEvent) {
    super.onPointerup(event);
    event.stopPropagation();
    this.onPointerupAction(event);
  }
  onPointerupAction(event: PointerEvent) {
    this.onClick();
  }
  onFocus(event: FocusEvent) {
    super.onFocus(event);
    if (this.hasmore && this.inoverlay) this.expanded = true;
    const $allitems = getMenuDescendants(getMenuRoot(this));
    const $ancestoritems = getMenuAncestors(this);
    for (let i = $allitems.length; i--;) {
      if ($allitems[i] !== this && $allitems[i] !== this.$options && $ancestoritems.indexOf($allitems[i]) === -1 && ($allitems[i] as any).expanded) {
        ($allitems[i] as any).collapse();
      }
    }
  }
  onBlur(event: FocusEvent) {
    super.onBlur(event);
    this.debounce(this.onBlurDebounced);
  }
  onBlurDebounced() {
    if (this._disposed) return;
    // TODO: rewrite this.
    const descendants = getMenuDescendants(this);
    const siblings = getMenuSiblings(this);
    const ancestors = getMenuAncestors(this);
    const descendantIsFocused = descendants.some(descendant => descendant === document.activeElement as unknown as IoMenuElementType);
    const siblingIsFocused = siblings.some(sibling => sibling === document.activeElement as unknown as IoMenuElementType);
    const ancestorIsFocused = ancestors.some(ancestor => ancestor === document.activeElement as unknown as IoMenuElementType);
    const nothingIsFocused = document.activeElement === document.body;

    const fucusLeftOverlay = !Overlay.contains(document.activeElement);

    if (descendantIsFocused || nothingIsFocused) return;
    if (ancestorIsFocused || siblingIsFocused) {
      this.collapse();
    } else if (fucusLeftOverlay) {
      this.collapseRoot();
    }
  }
  onKeydown(event: KeyboardEvent) {
    const inoverlay = this.inoverlay;
    let direction = this.direction;

    // Determine relative position of expanded options. If they are nudged to the opposite direction, flip direction.
    let optionsAreAbove = false;
    let optionsAreBelow = false;
    let optionsAreLeft = false;
    let optionsAreRight = false;
    if (this.expanded && this.$options) {
      const rect = this.getBoundingClientRect();
      const optionsRect = this.$options.getBoundingClientRect();
      optionsAreAbove = rect.top > optionsRect.top;
      optionsAreBelow = rect.bottom < optionsRect.bottom;
      optionsAreLeft = rect.left > optionsRect.left;
      optionsAreRight = rect.right < optionsRect.right;
    }
    // Flip direction if options are nudged to the opposite direction.
    if (direction === 'up' && optionsAreBelow) direction = 'down';
    if (direction === 'down' && optionsAreAbove) direction = 'up';
    if (direction === 'left' && optionsAreRight) direction = 'right';
    if (direction === 'right' && optionsAreLeft) direction = 'left';

    // TODO: types!
    let cmd = null;

    // TODO: 'Home', 'End', 'PageUp', 'PageDown' keys should be handled.
    if (event.key === 'Enter' || event.key === ' ') {
      if (this.hasmore) {
        cmd = 'In';
      } else {
        event.preventDefault();
        this.onClick();
        return;
      }
    } else if (event.key === 'Backspace') {
      cmd = 'Out';
    } else if (event.key === 'Escape') {
      cmd = 'Collapse';
    } else if (event.key === 'ArrowLeft' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'left') {
        cmd = 'In';
      } else if (direction === 'right') {
        cmd = 'Out';
      }
    } else if (event.key === 'ArrowRight' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'right') {
        cmd = 'In';
      } else if (direction === 'left') {
        cmd = 'Out';
      }
    } else if (event.key === 'ArrowUp' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'up') {
        cmd = 'In';
      } else if (direction === 'down') {
        cmd = 'Out';
      }
    } else if (event.key === 'ArrowDown' && (inoverlay || this.expanded)) {
      if (this.hasmore && direction === 'down') {
        cmd = 'In';
      } else if (direction === 'up') {
        cmd = 'Out';
      }
    }

    if (cmd) {
      event.preventDefault();
      switch (cmd) {
        case 'Collapse':
          this.collapseRoot();
          break;
        case 'In':
          if (this.hasmore) this.expanded = true;
          if (this.$options && this.$options.children.length) {
            const option = this.$options!.querySelector('[selected]') as IoMenuItem;
            if (option) option.focus();
            else (this.$options!.children[0] as IoMenuItem).focus();
          }
          break;
        case 'Out':
          if (this.$parent && this.$parent.$parent) {
            this.$parent.$parent.focus();
            this.$parent.$parent.collapse();
          }
          break;
        default:
          break;
      }
    } else {
      super.onKeydown(event);
    }
  }
  collapse() {
    getMenuDescendants(this).forEach(descendant => {
      (descendant as any).expanded = false;
    });
    this.expanded = false;
  }
  collapseRoot() {
    (getMenuRoot(this) as any).collapse();
  }
  optionChanged() {
    this.setProperties({
      selected: this.option.selected,
      disabled: this.option.disabled,
    });
    this.initOptions();
  }
  optionMutated() {
    this.setProperties({
      selected: this.option.selected,
      disabled: this.option.disabled,
    });
    this.changed();
  }
  initOptions() {
    if (this.option.options && this.depth > 0) {
      if (this.$options === undefined) {
        this.$options = new IoMenuOptions({
          expanded: this.bind('expanded'),
          depth: this.depth - 1,
          option: this.option,
          direction: this.direction,
          $parent: this,
        });
      } else {
        this.$options.option = this.option;
      }
    }
  }
  changed() {
    const icon = this.icon || this.option.icon;
    const label = this.label || this.option.label;

    this.render([
      this.hasmore && this.direction === 'left' ? ioIcon({value: 'io:triangle_left', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'up' ? ioIcon({value: 'io:triangle_up', class: 'hasmore'}) : null,
      icon ? ioIcon({value: icon}) : null,
      label ? span({class: 'label'}, label) : null,
      this.option.hint ? span({class: 'hint'}, this.option.hint) : null,
      this.hasmore && this.direction === 'right' ? ioIcon({value: 'io:triangle_right', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'down' ? ioIcon({value: 'io:triangle_down', class: 'hasmore'}) : null,
    ]);
  }
  dispose() {
    super.dispose();
    delete this.$options;
  }
}
export const ioMenuItem = function(arg0?: IoMenuItemProps) {
  return IoMenuItem.vConstructor(arg0);
};




