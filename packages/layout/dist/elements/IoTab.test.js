//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IoTab, Tab, tabDragIconSingleton } from '@io-gui/layout';
describe('IoTab', () => {
    let tab;
    let ioTab;
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
        tab = new Tab({ id: 'test-tab', label: 'Test Tab', icon: 'io:test' });
        ioTab = new IoTab({ tab });
        container.appendChild(ioTab);
    });
    afterEach(() => {
        ioTab.remove();
        container.remove();
        tab.dispose();
        // Reset singleton state
        tabDragIconSingleton.setProperties({
            dragging: false,
            dropSource: null,
            dropTarget: null,
            splitDirection: 'none',
            dropIndex: -1,
        });
    });
    describe('Construction', () => {
        it('should construct with a Tab domain model', () => {
            expect(ioTab.tab).toBe(tab);
        });
        it('should have expected default properties', () => {
            expect(ioTab.overflow).toBe(false);
        });
        it('should set tab property as reactive', () => {
            const newTab = new Tab({ id: 'new-tab' });
            ioTab.tab = newTab;
            expect(ioTab.tab).toBe(newTab);
            newTab.dispose();
        });
    });
    describe('Rendering', () => {
        it('should render icon from tab.icon', () => {
            const icon = ioTab.querySelector('io-icon');
            expect(icon).toBeTruthy();
        });
        it('should render label from tab.label', () => {
            const span = ioTab.querySelector('.io-tab-label');
            expect(span?.textContent).toBe('Test Tab');
        });
        it('should render close icon button', () => {
            const closeIcon = ioTab.querySelector('.io-close-icon');
            expect(closeIcon).toBeTruthy();
        });
        it('should update selected attribute when tab.selected changes', () => {
            expect(ioTab.getAttribute('selected')).toBe(null);
            tab.selected = true;
            expect(ioTab.getAttribute('selected')).toBe('');
        });
        it('should render drop marker when selected', () => {
            tab.selected = false;
            expect(ioTab.querySelector('.io-tab-drop-marker')).toBeNull();
            tab.selected = true;
            expect(ioTab.querySelector('.io-tab-drop-marker')).toBeTruthy();
        });
        it('should update label when tab.label changes', () => {
            tab.label = 'Updated Label';
            const span = ioTab.querySelector('.io-tab-label');
            expect(span?.textContent).toBe('Updated Label');
        });
        it('should update icon when tab.icon changes', () => {
            const icon = ioTab.querySelector('io-icon');
            expect(icon).toBeTruthy();
            tab.icon = 'io:new-icon';
            expect(icon.getAttribute('value')).toBe('io:new-icon');
        });
        it('should not render icon when tab has no icon', () => {
            const noIconTab = new Tab({ id: 'no-icon' });
            const noIconIoTab = new IoTab({ tab: noIconTab });
            container.appendChild(noIconIoTab);
            const icon = noIconIoTab.querySelector('.io-icon');
            expect(icon).toBeNull();
            noIconIoTab.remove();
            noIconTab.dispose();
        });
    });
    describe('Tab Mutation Handling', () => {
        it('should call changed when tabMutated is invoked', () => {
            const changedSpy = vi.spyOn(ioTab, 'changed');
            ioTab.tabMutated();
            expect(changedSpy).toHaveBeenCalledTimes(1);
        });
    });
    describe('Overflow Detection', () => {
        it('should set overflow attribute based on text overflow', () => {
            // Initially no overflow
            expect(ioTab.overflow).toBe(false);
        });
        it('should detect overflow on resize', () => {
            const span = ioTab.querySelector('span:not(.io-icon)');
            if (span) {
                // Mock scrollWidth > clientWidth
                Object.defineProperty(span, 'scrollWidth', { value: 200, configurable: true });
                Object.defineProperty(span, 'clientWidth', { value: 100, configurable: true });
                ioTab.onResized();
                expect(ioTab.overflow).toBe(true);
            }
        });
        it('should not set overflow when text fits', () => {
            const span = ioTab.querySelector('span:not(.io-icon)');
            if (span) {
                Object.defineProperty(span, 'scrollWidth', { value: 50, configurable: true });
                Object.defineProperty(span, 'clientWidth', { value: 100, configurable: true });
                ioTab.onResized();
                expect(ioTab.overflow).toBe(false);
            }
        });
    });
    describe('Event Prevention', () => {
        it('should stop propagation and prevent default on click', () => {
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            const stopSpy = vi.spyOn(event, 'stopPropagation');
            const preventSpy = vi.spyOn(event, 'preventDefault');
            ioTab.preventDefault(event);
            expect(stopSpy).toHaveBeenCalled();
            expect(preventSpy).toHaveBeenCalled();
        });
        it('should stop propagation and prevent default on contextmenu', () => {
            const event = new MouseEvent('contextmenu', { bubbles: true, cancelable: true });
            const stopSpy = vi.spyOn(event, 'stopPropagation');
            const preventSpy = vi.spyOn(event, 'preventDefault');
            ioTab.preventDefault(event);
            expect(stopSpy).toHaveBeenCalled();
            expect(preventSpy).toHaveBeenCalled();
        });
    });
    describe('Pointer Events - Basic', () => {
        it('should capture pointer on pointerdown', () => {
            const captureSpy = vi.spyOn(ioTab, 'setPointerCapture');
            const event = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(event);
            expect(captureSpy).toHaveBeenCalledWith(1);
        });
        it('should focus on left button pointerdown', () => {
            const focusSpy = vi.spyOn(ioTab, 'focus');
            const event = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(event);
            expect(focusSpy).toHaveBeenCalled();
        });
        it('should expand context editor on right button pointerdown', () => {
            const expandSpy = vi.spyOn(ioTab, 'expandContextEditor');
            const event = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 2,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(event);
            expect(expandSpy).toHaveBeenCalled();
        });
        it('should release pointer capture on pointerup', () => {
            const releaseSpy = vi.spyOn(ioTab, 'releasePointerCapture');
            const event = new PointerEvent('pointerup', {
                pointerId: 1,
                buttons: 0,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerup(event);
            expect(releaseSpy).toHaveBeenCalledWith(1);
        });
        it('should prevent default on pointerleave', () => {
            const event = new PointerEvent('pointerleave', {
                bubbles: true,
                cancelable: true,
            });
            const preventSpy = vi.spyOn(event, 'preventDefault');
            const stopSpy = vi.spyOn(event, 'stopPropagation');
            ioTab.onPointerleave(event);
            expect(preventSpy).toHaveBeenCalled();
            expect(stopSpy).toHaveBeenCalled();
        });
        it('should prevent touchmove default', () => {
            const event = new TouchEvent('touchmove', {
                bubbles: true,
                cancelable: true,
            });
            const preventSpy = vi.spyOn(event, 'preventDefault');
            ioTab.onTouchmove(event);
            expect(preventSpy).toHaveBeenCalled();
        });
    });
    describe('Drag Initiation', () => {
        it('should not start drag until 10px threshold is exceeded', () => {
            // Start pointerdown
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            // Move less than 10px
            const moveEvent = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 1,
                clientX: 105,
                clientY: 105,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dragging).toBe(false);
        });
        it('should start drag after moving more than 10px horizontally', () => {
            // Mock parent structure to avoid null errors
            const mockPanel = document.createElement('div');
            const mockTabs = document.createElement('div');
            mockTabs.appendChild(ioTab);
            mockPanel.appendChild(mockTabs);
            container.appendChild(mockPanel);
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 1,
                clientX: 115,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dragging).toBe(true);
            expect(tabDragIconSingleton.tab).toBe(tab);
        });
        it('should start drag after moving more than 10px vertically', () => {
            const mockPanel = document.createElement('div');
            const mockTabs = document.createElement('div');
            mockTabs.appendChild(ioTab);
            mockPanel.appendChild(mockTabs);
            container.appendChild(mockPanel);
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 115,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dragging).toBe(true);
        });
        it('should not start drag when not holding left button', () => {
            const mockPanel = document.createElement('div');
            const mockTabs = document.createElement('div');
            mockTabs.appendChild(ioTab);
            mockPanel.appendChild(mockTabs);
            container.appendChild(mockPanel);
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            // Move with no buttons pressed (e.g., user released button)
            const moveEvent = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 0,
                clientX: 115,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dragging).toBe(false);
        });
        it('should set singleton dropSource to parent panel when drag starts', () => {
            const mockPanel = document.createElement('io-panel');
            const mockTabs = document.createElement('div');
            mockTabs.appendChild(ioTab);
            mockPanel.appendChild(mockTabs);
            container.appendChild(mockPanel);
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 1,
                clientX: 115,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dropSource).toBe(mockPanel);
        });
    });
    describe('Drag Icon Positioning', () => {
        it('should position drag icon at cursor during drag', () => {
            const mockPanel = document.createElement('div');
            const mockTabs = document.createElement('div');
            mockTabs.appendChild(ioTab);
            mockPanel.appendChild(mockTabs);
            container.appendChild(mockPanel);
            // Start drag
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent1 = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 1,
                clientX: 115,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent1);
            expect(tabDragIconSingleton.style.left).toBe('115px');
            expect(tabDragIconSingleton.style.top).toBe('100px');
            // Continue moving
            const moveEvent2 = new PointerEvent('pointermove', {
                pointerId: 1,
                buttons: 1,
                clientX: 200,
                clientY: 150,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointermove(moveEvent2);
            expect(tabDragIconSingleton.style.left).toBe('200px');
            expect(tabDragIconSingleton.style.top).toBe('150px');
        });
    });
    describe('Pointer Cancel', () => {
        it('should reset singleton state on pointer cancel', () => {
            // First capture the pointer via pointerdown
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            // Set up some drag state
            tabDragIconSingleton.setProperties({
                dragging: true,
                dropSource: {},
                dropTarget: {},
                splitDirection: 'left',
                dropIndex: 2,
            });
            const cancelEvent = new PointerEvent('pointercancel', {
                pointerId: 1,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointercancel(cancelEvent);
            expect(tabDragIconSingleton.dragging).toBe(false);
            expect(tabDragIconSingleton.dropSource).toBeNull();
            expect(tabDragIconSingleton.dropTarget).toBeNull();
            expect(tabDragIconSingleton.splitDirection).toBe('none');
            expect(tabDragIconSingleton.dropIndex).toBe(-1);
        });
        it('should prevent default and stop propagation on cancel', () => {
            // First capture the pointer
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            const cancelEvent = new PointerEvent('pointercancel', {
                pointerId: 1,
                bubbles: true,
                cancelable: true,
            });
            const preventSpy = vi.spyOn(cancelEvent, 'preventDefault');
            const stopSpy = vi.spyOn(cancelEvent, 'stopPropagation');
            ioTab.onPointercancel(cancelEvent);
            expect(preventSpy).toHaveBeenCalled();
            expect(stopSpy).toHaveBeenCalled();
        });
    });
    describe('Click Behavior', () => {
        it('should dispatch io-edit-tab with Select key on click when not dragging', () => {
            const handler = vi.fn();
            ioTab.addEventListener('io-edit-tab', handler);
            ioTab.onClick();
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.tab).toBe(tab);
            expect(handler.mock.calls[0][0].detail.key).toBe('Select');
        });
        it('should invoke onClick from pointerup when not dragging', () => {
            // First capture the pointer
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            const clickSpy = vi.spyOn(ioTab, 'onClick');
            const upEvent = new PointerEvent('pointerup', {
                pointerId: 1,
                buttons: 0,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerup(upEvent);
            expect(clickSpy).toHaveBeenCalled();
        });
        it('should NOT invoke onClick from pointerup when dragging', () => {
            // First capture the pointer
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            tabDragIconSingleton.dragging = true;
            const clickSpy = vi.spyOn(ioTab, 'onClick');
            const upEvent = new PointerEvent('pointerup', {
                pointerId: 1,
                buttons: 0,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerup(upEvent);
            expect(clickSpy).not.toHaveBeenCalled();
        });
    });
    describe('Delete Click', () => {
        it('should dispatch io-edit-tab with Backspace key on delete click', () => {
            const handler = vi.fn();
            ioTab.addEventListener('io-edit-tab', handler);
            ioTab.onDeleteClick();
            expect(handler).toHaveBeenCalledTimes(1);
            expect(handler.mock.calls[0][0].detail.tab).toBe(tab);
            expect(handler.mock.calls[0][0].detail.key).toBe('Backspace');
        });
    });
    describe('Keyboard Events', () => {
        const shiftKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'];
        shiftKeys.forEach(key => {
            it(`should dispatch io-edit-tab on Shift+${key}`, () => {
                const handler = vi.fn();
                ioTab.addEventListener('io-edit-tab', handler);
                const event = new KeyboardEvent('keydown', {
                    key,
                    shiftKey: true,
                    bubbles: true,
                    cancelable: true,
                });
                const preventSpy = vi.spyOn(event, 'preventDefault');
                ioTab.onKeydown(event);
                expect(handler).toHaveBeenCalledTimes(1);
                expect(handler.mock.calls[0][0].detail.tab).toBe(tab);
                expect(handler.mock.calls[0][0].detail.key).toBe(key);
                expect(preventSpy).toHaveBeenCalled();
            });
        });
        it('should expand context editor on Shift+Enter', () => {
            const expandSpy = vi.spyOn(ioTab, 'expandContextEditor');
            const event = new KeyboardEvent('keydown', {
                key: 'Enter',
                shiftKey: true,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onKeydown(event);
            expect(expandSpy).toHaveBeenCalled();
        });
        it('should NOT dispatch io-edit-tab without Shift modifier', () => {
            const handler = vi.fn();
            ioTab.addEventListener('io-edit-tab', handler);
            const event = new KeyboardEvent('keydown', {
                key: 'Backspace',
                shiftKey: false,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onKeydown(event);
            expect(handler).not.toHaveBeenCalled();
        });
        it('should call super.onKeydown for non-shift keys', () => {
            // Just verify it doesn't throw and doesn't dispatch io-edit-tab
            const handler = vi.fn();
            ioTab.addEventListener('io-edit-tab', handler);
            const event = new KeyboardEvent('keydown', {
                key: 'Tab',
                shiftKey: false,
                bubbles: true,
                cancelable: true,
            });
            expect(() => ioTab.onKeydown(event)).not.toThrow();
            expect(handler).not.toHaveBeenCalled();
        });
    });
    describe('Context Editor', () => {
        it('should have expandContextEditor method', () => {
            expect(typeof ioTab.expandContextEditor).toBe('function');
        });
        it('should expand context editor without throwing', () => {
            expect(() => ioTab.expandContextEditor()).not.toThrow();
        });
    });
    describe('Drag End - Cleanup', () => {
        it('should reset singleton state after drop on pointerup', () => {
            // First capture the pointer
            const downEvent = new PointerEvent('pointerdown', {
                pointerId: 1,
                buttons: 1,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerdown(downEvent);
            tabDragIconSingleton.setProperties({
                dragging: true,
                dropSource: null,
                dropTarget: null,
                splitDirection: 'none',
                dropIndex: -1,
            });
            const upEvent = new PointerEvent('pointerup', {
                pointerId: 1,
                buttons: 0,
                clientX: 100,
                clientY: 100,
                bubbles: true,
                cancelable: true,
            });
            ioTab.onPointerup(upEvent);
            expect(tabDragIconSingleton.dragging).toBe(false);
            expect(tabDragIconSingleton.dropSource).toBeNull();
            expect(tabDragIconSingleton.dropTarget).toBeNull();
            expect(tabDragIconSingleton.splitDirection).toBe('none');
            expect(tabDragIconSingleton.dropIndex).toBe(-1);
        });
    });
    describe('Edge Cases', () => {
        it('should handle tab with empty label', () => {
            const emptyLabelTab = new Tab({ id: 'empty-label', label: '' });
            const emptyLabelIoTab = new IoTab({ tab: emptyLabelTab });
            container.appendChild(emptyLabelIoTab);
            const span = emptyLabelIoTab.querySelector('.io-tab-label');
            // Label defaults to id when empty
            expect(span?.textContent).toBe('empty-label');
            emptyLabelIoTab.remove();
            emptyLabelTab.dispose();
        });
        it('should handle tab with very long label', () => {
            const longLabel = 'A'.repeat(500);
            const longTab = new Tab({ id: 'long', label: longLabel });
            const longIoTab = new IoTab({ tab: longTab });
            container.appendChild(longIoTab);
            const span = longIoTab.querySelector('.io-tab-label');
            expect(span?.textContent).toBe(longLabel);
            longIoTab.remove();
            longTab.dispose();
        });
        it('should handle tab with unicode characters', () => {
            const unicodeTab = new Tab({ id: 'unicode', label: '日本語タブ 🎉' });
            const unicodeIoTab = new IoTab({ tab: unicodeTab });
            container.appendChild(unicodeIoTab);
            const span = unicodeIoTab.querySelector('.io-tab-label');
            expect(span?.textContent).toBe('日本語タブ 🎉');
            unicodeIoTab.remove();
            unicodeTab.dispose();
        });
        it('should handle rapid selection changes', () => {
            for (let i = 0; i < 10; i++) {
                tab.selected = i % 2 === 0;
                // selected attribute is empty string when true, null when false
                const expected = i % 2 === 0 ? '' : null;
                expect(ioTab.getAttribute('selected')).toBe(expected);
            }
        });
        it('should handle changing tab reference', () => {
            const newTab = new Tab({ id: 'new-tab', label: 'New Tab' });
            ioTab.tab = newTab;
            expect(ioTab.tab).toBe(newTab);
            const span = ioTab.querySelector('.io-tab-label');
            expect(span?.textContent).toBe('New Tab');
            newTab.dispose();
        });
    });
    describe('Static Properties', () => {
        it('should have Style getter', () => {
            expect(IoTab.Style).toBeDefined();
            expect(typeof IoTab.Style).toBe('string');
            expect(IoTab.Style).toContain(':host');
        });
        it('should have Listeners getter', () => {
            expect(IoTab.Listeners).toBeDefined();
            expect(IoTab.Listeners.click).toBe('preventDefault');
            expect(IoTab.Listeners.contextmenu).toBe('preventDefault');
        });
    });
    describe('Attribute Reflection', () => {
        it('should reflect overflow to attribute', () => {
            ioTab.overflow = true;
            expect(ioTab.hasAttribute('overflow')).toBe(true);
            ioTab.overflow = false;
            // When false, boolean attribute is removed
            expect(ioTab.hasAttribute('overflow')).toBe(false);
        });
        it('should update selected attribute synchronously', () => {
            tab.selected = true;
            // Boolean attribute - empty string when true
            expect(ioTab.getAttribute('selected')).toBe('');
            tab.selected = false;
            // Attribute removed when false
            expect(ioTab.getAttribute('selected')).toBe(null);
        });
    });
});
describe('IoTab Factory Function', () => {
    it('should export ioTab factory function', async () => {
        const { ioTab } = await import('@io-gui/layout');
        expect(typeof ioTab).toBe('function');
    });
    it('should create virtual constructor from factory', async () => {
        const { ioTab, Tab } = await import('@io-gui/layout');
        const tab = new Tab({ id: 'factory-test' });
        const vdom = ioTab({ tab });
        expect(vdom).toBeDefined();
        expect(vdom.tag).toBe('io-tab');
        tab.dispose();
    });
});
//# sourceMappingURL=IoTab.test.js.map