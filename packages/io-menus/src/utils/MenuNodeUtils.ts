import { MenuItem } from '../nodes/MenuItem';
import { MenuOptions } from '../nodes/MenuOptions';

function matchMenuItem(item: MenuItem, search: string) {
  if (item.options) return false;
  if (item.value !== undefined && String(item.value).toLowerCase().indexOf(search) !== -1) return true;
  if (item.label && item.label.toLowerCase().indexOf(search) !== -1) return true;
  if (item.hint && item.hint.toLowerCase().indexOf(search) !== -1) return true;
  return false;
}

export function searchMenuOptions(options: MenuOptions, search: string, depth = 5, d = 0) {
  search = search.toLowerCase();
  const items: MenuItem[] = [];
  if (d <= depth) for (let i = 0; i < options.length; i++) {
    if (matchMenuItem(options[i], search)) {
      items.push(options[i]);
    }
    if (options[i].options) {
      items.push(...searchMenuOptions(options[i].options, search, depth, d + 1));
    }
  }
  return items;
}