/** Whether `object` is `ancestor` or below it. */
export function isDescendant(object, ancestor) {
    for (let node = object; node; node = node.parent)
        if (node === ancestor)
            return true;
    return false;
}
/** Whether `object` and every ancestor are visible. */
export function isShown(object) {
    for (let node = object; node; node = node.parent)
        if (!node.visible)
            return false;
    return true;
}
