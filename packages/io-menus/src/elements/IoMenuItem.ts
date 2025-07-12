import { Register, ReactiveProperty, Property, IoOverlaySingleton as Overlay, span, VDOMElement, WithBinding, NudgeDirection } from 'io-gui';
import { IoField, IoFieldProps } from 'io-inputs';
import { ioIcon } from 'io-icons';
import { IoMenuElementType, getMenuRoot, getMenuAncestors, getMenuDescendants, getMenuSiblings, getHoveredMenuItem } from '../utils/MenuDOMUtils.js';
import { MenuItem } from '../nodes/MenuItem.js';
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
  item?: MenuItem,
  label?: string,
  expanded?: WithBinding<boolean>,
  direction?: NudgeDirection,
  depth?: number,
  $parent?: IoMenuOptions | IoMenuTree,
};

/**
 * It displays `option.icon`, `option.label` and `option.hint` property and it creates expandable `IoMenuOptions` from the `option.options` array. Options are expand in the direction specified by `direction` property. If `selectable` property is set, selecting an option sets its `value` to the entire menu tree and `selected` atribute is set on menu items whose `option.value` matches selected value.
 **/

// TODO: fix and improve keyboard navigation in all cases.
@Register
export class IoMenuItem extends IoField {
  static get Style() {
    return /* css */`
      :host {
        user-select: none;
      }
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

  @ReactiveProperty({type: MenuItem})
  declare item: MenuItem;

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
    return this.item.hasmore && this.depth > 0;
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
    const item = this.item;
    if (this.hasmore) {
      if (!this.expanded) this.expanded = true;
    } else if (item.mode === 'toggle') {
      item.selected = !item.selected;
    } else {
      if (item.action) {
        item.action.apply(null, [item.value]);
        this.collapseRoot();
      }
      if (item.mode === 'select') {
        if (item.hasmore && item.options && this.depth <= 0) {
          item.options.selectDefault();
        } else {
          item.selected = true;
        }
        this.collapseRoot();
      } else if (item.mode === 'link') {
        window.open(item.value, '_blank');
        this.collapseRoot();
      }
    }
    getMenuRoot(this).dispatch('io-menu-item-clicked', {item: this.item}, true);
  }
  onPointerdown(event: PointerEvent) {
    super.onPointerdown(event);
    event.stopPropagation();
    this.setPointerCapture(event.pointerId);
    this.expanded = true;
    onOverlayPointerdown.call(this, event);
  }
  onPointermove(event: PointerEvent) {
    event.stopPropagation();
    if (event.pointerType === 'touch') {
      // Let touch scroll the document.
      if (!this.expanded && !this.inoverlay) return;
      // Let touch scroll in clipped menu options.
      if (!!this.$parent && !!this.$parent.style.height) return;
    }
    onOverlayPointermove.call(this, event);
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
            const item = this.$options!.querySelector('[selected]') as IoMenuItem;
            if (item) item.focus();
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
  itemChanged() {
    // TODO: unbind previous? Test!
    this.setProperties({
      selected: this.item.bind('selected'),
      disabled: this.item.bind('disabled'),
    });
    this.initOptions();
  }
  itemMutated() {
    this.changed();
  }
  initOptions() {
    if (this.item.options && this.depth > 0) {
      if (this.$options === undefined) {
        this.$options = new IoMenuOptions({
          expanded: this.bind('expanded'),
          depth: this.depth - 1,
          options: this.item.options,
          direction: this.direction,
          $parent: this,
        });
      } else {
        this.$options.options = this.item.options;
      }
    }
  }
  changed() {
    const icon = this.icon || this.item.icon;
    const label = this.label || this.item.label;

    this.hidden = this.item.hidden;

    this.render([
      this.hasmore && this.direction === 'left' ? ioIcon({value: 'io:triangle_left', class: 'hasmore'}) : null,
      this.hasmore && this.direction === 'up' ? ioIcon({value: 'io:triangle_up', class: 'hasmore'}) : null,
      icon ? ioIcon({value: icon}) : null,
      label ? span({class: 'label'}, label) : null,
      this.item.hint ? span({class: 'hint'}, this.item.hint) : null,
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




