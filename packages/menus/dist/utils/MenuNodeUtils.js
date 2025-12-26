function matchMenuOption(option, search) {
    if (option.options.length)
        return false;
    if (option.value !== undefined && String(option.value).toLowerCase().indexOf(search) !== -1)
        return true;
    if (option.label && option.label.toLowerCase().indexOf(search) !== -1)
        return true;
    if (option.hint && option.hint.toLowerCase().indexOf(search) !== -1)
        return true;
    return false;
}
export function searchMenuOption(option, search, depth = 5, d = 0) {
    search = search.toLowerCase();
    const subitems = [];
    if (d <= depth)
        for (let i = 0; i < option.options.length; i++) {
            if (matchMenuOption(option.options[i], search)) {
                subitems.push(option.options[i]);
            }
            if (option.options[i].options.length) {
                subitems.push(...searchMenuOption(option.options[i], search, depth, d + 1));
            }
        }
    return subitems;
}
//# sourceMappingURL=MenuNodeUtils.js.map