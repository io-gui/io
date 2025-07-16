import { MenuOption } from '../nodes/MenuOption.js';

function matchMenuItem(option: MenuOption, search: string) {
  if (option.options) return false;
  if (option.value !== undefined && String(option.value).toLowerCase().indexOf(search) !== -1) return true;
  if (option.label && option.label.toLowerCase().indexOf(search) !== -1) return true;
  if (option.hint && option.hint.toLowerCase().indexOf(search) !== -1) return true;
  return false;
}

export function searchMenuOptions(options: MenuOption[], search: string, depth = 5, d = 0) {
  search = search.toLowerCase();
  const suboptions: MenuOption[] = [];
  if (d <= depth) for (let i = 0; i < options.length; i++) {
    if (matchMenuItem(options[i], search)) {
      suboptions.push(options[i]);
    }
    if (options[i].options.length) {
      suboptions.push(...searchMenuOptions(options[i].options, search, depth, d + 1));
    }
  }
  return suboptions;
}