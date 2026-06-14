import { ThemeSingleton } from '../nodes/Theme.js';
import { IoOverlaySingleton as Overlay } from '../elements/IoOverlay.js';
// TODO: improve focus algorithm
// Note: focus string field in IoInspector demo and use arrowleft - notice focus shift is not intuitive.
// TODO: Home, End, PageUp, PageDown?
let focusBacktrack = new WeakMap();
const backtrackDir = {
    ArrowLeft: 'ArrowRight',
    ArrowRight: 'ArrowLeft',
    ArrowDown: 'ArrowUp',
    ArrowUp: 'ArrowDown'
};
function setFocusBacktrack(element, dir, source) {
    focusBacktrack.set(element, {
        dir: backtrackDir[dir],
        source: source
    });
}
export function clearFocusBacktrack() {
    focusBacktrack = new WeakMap();
}
function getRectDistance(rect1, rect2, dirBias = 1) {
    if (rect1.right > rect2.left && rect2.right > rect1.left && rect1.bottom > rect2.top && rect2.bottom > rect1.top) {
        return 0;
    }
    let dx = 0, dy = 0;
    const MIN_DISTANCE = ThemeSingleton.fieldHeight / 2;
    if (rect1.right < rect2.left)
        dx = Math.max(MIN_DISTANCE, rect2.left - rect1.right);
    else if (rect2.right < rect1.left)
        dx = Math.max(MIN_DISTANCE, rect1.left - rect2.right);
    if (rect1.bottom < rect2.top)
        dy = Math.max(MIN_DISTANCE, rect2.top - rect1.bottom);
    else if (rect2.bottom < rect1.top)
        dy = Math.max(MIN_DISTANCE, rect1.top - rect2.bottom);
    dx = dx * dirBias;
    dy = dy / dirBias;
    return (dx ** 2 + dy ** 2) ** 0.5;
}
function getCenterDistance(rect1, rect2, dirBias = 1) {
    const c1 = { x: rect1.x + rect1.width / 2, y: rect1.y + rect1.height / 2 };
    const c2 = { x: rect2.x + rect2.width / 2, y: rect2.y + rect2.height / 2 };
    let dx = c1.x - c2.x;
    let dy = c1.y - c2.y;
    dx = dx * dirBias;
    dy = dy / dirBias;
    return (dx ** 2 + dy ** 2) ** 0.5;
}
function onIoFocusTo(event) {
    const src = event.detail.source;
    const srcRect = src.getBoundingClientRect();
    const cmd = event.detail.command;
    const inoverlay = Overlay.contains(src);
    let closestElement = src;
    let closestDistance = Infinity;
    let closestCenterDistance = Infinity;
    const backtrack = focusBacktrack.get(src);
    if (backtrack && backtrack.dir === cmd) {
        const source = backtrack.source;
        let visible = true;
        if (!source.offsetParent || source === src) {
            visible = false;
        }
        else {
            const sStyle = window.getComputedStyle(source);
            if (sStyle.visibility !== 'visible' || sStyle.display === 'none') {
                visible = false;
            }
        }
        if (visible) {
            source.focus();
            setFocusBacktrack(source, cmd, src);
            return;
        }
    }
    const root = inoverlay ? Overlay : document;
    let focusableCandidates = Array.from(root.querySelectorAll(`[tabIndex="${src.tabIndex || 0}"]:not([disabled]):not([inert]):not([hidden])`));
    const focusableSiblingCandidates = Array.from(src.parentElement.querySelectorAll(`[tabIndex="${src.tabIndex || 0}"]:not([disabled]):not([inert]):not([hidden])`));
    focusableCandidates = focusableCandidates.filter(el => el.offsetParent !== null);
    focusableCandidates = focusableCandidates.filter(el => {
        const style = window.getComputedStyle(el);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    });
    if (cmd === 'Tab') {
        const index = focusableCandidates.indexOf(src);
        if (index !== -1) {
            focusableCandidates[(index + 1) % focusableCandidates.length].focus();
        }
        return;
    }
    else if (cmd === 'Home') {
        focusableCandidates[0].focus();
        return;
    }
    else if (cmd === 'End') {
        focusableCandidates[focusableCandidates.length - 1].focus();
        return;
    }
    else if (cmd === 'PageUp') {
        focusableSiblingCandidates[0].focus();
        return;
    }
    else if (cmd === 'PageDown') {
        focusableSiblingCandidates[focusableSiblingCandidates.length - 1].focus();
        return;
    }
    else if (['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(cmd)) {
        for (let i = focusableCandidates.length; i--;) {
            const candidate = focusableCandidates[i];
            if (!candidate.offsetParent || candidate === src) {
                continue;
            }
            const sStyle = window.getComputedStyle(candidate);
            if (sStyle.visibility !== 'visible' || sStyle.display === 'none') {
                continue;
            }
            const rect = candidate.getBoundingClientRect();
            if (cmd === 'ArrowRight' && rect.left < srcRect.right)
                continue;
            if (cmd === 'ArrowLeft' && rect.right > srcRect.left)
                continue;
            if (cmd === 'ArrowDown' && rect.top < srcRect.bottom)
                continue;
            if (cmd === 'ArrowUp' && rect.bottom > srcRect.top)
                continue;
            const biasMagnitude = 4;
            const dirBias = cmd === 'ArrowLeft' || cmd === 'ArrowRight' ? 1 / biasMagnitude : biasMagnitude;
            const distance = getRectDistance(srcRect, rect, dirBias);
            const centerDistance = getCenterDistance(srcRect, rect, dirBias);
            if (distance < closestDistance) {
                closestDistance = distance;
                closestCenterDistance = centerDistance;
                closestElement = candidate;
            }
            else if (distance === closestDistance && centerDistance < closestCenterDistance) {
                closestCenterDistance = centerDistance;
                closestElement = candidate;
            }
        }
        if (closestElement !== src) {
            closestElement.focus();
            setFocusBacktrack(closestElement, cmd, src);
        }
    }
}
document.addEventListener('io-focus-to', onIoFocusTo);
//# sourceMappingURL=Focus.js.map