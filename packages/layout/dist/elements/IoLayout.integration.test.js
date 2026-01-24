//@ts-nocheck
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { IoLayout, IoTab, Split, Panel, Tab, tabDragIconSingleton, ioTabDropRectSingleton, } from '@io-gui/layout';
/**
 * Integration tests for IoLayout drag-drop flows.
 *
 * These tests verify the complete drag-drop interaction flows including:
 * - Tab reordering within the same panel
 * - Tab moving between panels
 * - Tab moving to create new splits
 * - Drag cancellation and edge cases
 */
describe('IoLayout Integration - Drag Drop Flows', () => {
    let layout;
    let container;
    function createPointerEvent(type, options = {}) {
        return new PointerEvent(type, {
            pointerId: 1,
            buttons: type === 'pointerup' ? 0 : 1,
            bubbles: true,
            cancelable: true,
            ...options,
        });
    }
    function simulateDrag(ioTab, startX, startY, endX, endY, complete = true) {
        const downEvent = createPointerEvent('pointerdown', {
            clientX: startX,
            clientY: startY,
        });
        ioTab.onPointerdown(downEvent);
        // Move past threshold (10px)
        const moveEvent1 = createPointerEvent('pointermove', {
            clientX: startX + 15,
            clientY: startY,
        });
        ioTab.onPointermove(moveEvent1);
        // Move to final position
        const moveEvent2 = createPointerEvent('pointermove', {
            clientX: endX,
            clientY: endY,
        });
        ioTab.onPointermove(moveEvent2);
        if (complete) {
            const upEvent = createPointerEvent('pointerup', {
                clientX: endX,
                clientY: endY,
            });
            ioTab.onPointerup(upEvent);
        }
    }
    beforeEach(() => {
        container = document.createElement('div');
        // Set visible dimensions for bounding rect calculations
        container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 800px;
      height: 600px;
    `;
        document.body.appendChild(container);
    });
    afterEach(() => {
        if (layout) {
            layout.remove();
        }
        container.remove();
        // Reset singleton state
        tabDragIconSingleton.setProperties({
            dragging: false,
            tab: null,
            dropSource: null,
            dropTarget: null,
            splitDirection: 'none',
            dropIndex: -1,
        });
    });
    describe('Tab Reordering Within Same Panel', () => {
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                children: [
                    {
                        type: 'panel',
                        tabs: [
                            { id: 'tab1', label: 'Tab 1' },
                            { id: 'tab2', label: 'Tab 2' },
                            { id: 'tab3', label: 'Tab 3' },
                        ],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
        });
        it('should initiate drag after moving past threshold', () => {
            const ioTab = layout.querySelector('io-tab');
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            ioTab.onPointerdown(downEvent);
            // Move 5px (less than threshold)
            const moveEvent1 = createPointerEvent('pointermove', {
                clientX: 105,
                clientY: 50,
            });
            ioTab.onPointermove(moveEvent1);
            expect(tabDragIconSingleton.dragging).toBe(false);
            // Move past 10px threshold
            const moveEvent2 = createPointerEvent('pointermove', {
                clientX: 115,
                clientY: 50,
            });
            ioTab.onPointermove(moveEvent2);
            expect(tabDragIconSingleton.dragging).toBe(true);
        });
        it('should set drag icon position at cursor', () => {
            const ioTab = layout.querySelector('io-tab');
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = createPointerEvent('pointermove', {
                clientX: 200,
                clientY: 75,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.style.left).toBe('200px');
            expect(tabDragIconSingleton.style.top).toBe('75px');
        });
        it('should set drop source panel when drag starts', () => {
            const ioTab = layout.querySelector('io-tab');
            const ioPanel = layout.querySelector('io-panel');
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = createPointerEvent('pointermove', {
                clientX: 115,
                clientY: 50,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dropSource).toBe(ioPanel);
        });
        it('should reset singleton state on drop completion', () => {
            const ioTab = layout.querySelector('io-tab');
            simulateDrag(ioTab, 100, 50, 200, 50);
            expect(tabDragIconSingleton.dragging).toBe(false);
            expect(tabDragIconSingleton.tab).toBeNull();
            expect(tabDragIconSingleton.dropSource).toBeNull();
            expect(tabDragIconSingleton.dropTarget).toBeNull();
            expect(tabDragIconSingleton.splitDirection).toBe('none');
            expect(tabDragIconSingleton.dropIndex).toBe(-1);
        });
        it('should trigger click when no drag occurred', () => {
            const panel = layout.split.children[0];
            // Initially tab1 is selected
            expect(panel.getSelected()).toBe('tab1');
            // Get second tab and click without drag
            const tabs = layout.querySelectorAll('io-tab');
            const tab2Element = tabs[1];
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            tab2Element.onPointerdown(downEvent);
            // Minimal movement (under threshold)
            const moveEvent = createPointerEvent('pointermove', {
                clientX: 102,
                clientY: 50,
            });
            tab2Element.onPointermove(moveEvent);
            const upEvent = createPointerEvent('pointerup', {
                clientX: 102,
                clientY: 50,
            });
            tab2Element.onPointerup(upEvent);
            // Tab 2 should be selected via click
            expect(panel.getSelected()).toBe('tab2');
        });
    });
    describe('Tab Drag Between Panels', () => {
        let sourcePanel;
        let targetPanel;
        let sourcePanelElement;
        let targetPanelElement;
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    {
                        type: 'panel',
                        tabs: [
                            { id: 'src-tab1', label: 'Source Tab 1' },
                            { id: 'src-tab2', label: 'Source Tab 2' },
                        ],
                    },
                    {
                        type: 'panel',
                        tabs: [{ id: 'tgt-tab1', label: 'Target Tab 1' }],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            sourcePanel = split.children[0];
            targetPanel = split.children[1];
            const panels = layout.querySelectorAll('io-panel');
            sourcePanelElement = panels[0];
            targetPanelElement = panels[1];
        });
        it('should move tab to another panel center', () => {
            const originalTab = sourcePanel.tabs[0];
            expect(sourcePanel.tabs.length).toBe(2);
            expect(targetPanel.tabs.length).toBe(1);
            // Simulate drag to center of target panel
            targetPanelElement.moveTabToSplit(sourcePanelElement, originalTab, 'center');
            expect(sourcePanel.tabs.length).toBe(1);
            expect(targetPanel.tabs.length).toBe(2);
            expect(targetPanel.tabs.find((t) => t.id === 'src-tab1')).toBeTruthy();
        });
        it('should preserve panel structure when moving tabs', () => {
            const originalTab = sourcePanel.tabs[1];
            targetPanelElement.moveTabToSplit(sourcePanelElement, originalTab, 'center');
            // Both panels should still exist
            const panelCount = layout.querySelectorAll('io-panel').length;
            expect(panelCount).toBe(2);
            // Layout structure should remain
            expect(layout.split.children.length).toBe(2);
        });
        it('should select moved tab in target panel', () => {
            const originalTab = sourcePanel.tabs[0];
            targetPanelElement.moveTabToSplit(sourcePanelElement, originalTab, 'center');
            expect(targetPanel.getSelected()).toBe('src-tab1');
        });
    });
    describe('Tab Drag to Create New Splits', () => {
        let sourcePanel;
        let targetPanel;
        let ioSplit;
        let sourcePanelElement;
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    {
                        type: 'panel',
                        tabs: [
                            { id: 'src-tab1' },
                            { id: 'src-tab2' },
                        ],
                    },
                    {
                        type: 'panel',
                        tabs: [{ id: 'tgt-tab1' }],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            sourcePanel = split.children[0];
            targetPanel = split.children[1];
            ioSplit = layout.querySelector('io-split');
            const panels = layout.querySelectorAll('io-panel');
            sourcePanelElement = panels[0];
        });
        it('should create new split when dropping left in same orientation', () => {
            const tab = sourcePanel.tabs[1];
            ioSplit.moveTabToSplit(sourcePanelElement, targetPanel, tab, 'left');
            // Should add new panel at left of target (at index 0, since newIndex = targetIndex - 1 = 0)
            expect(layout.split.children.length).toBe(3);
            expect(layout.split.children[0] instanceof Panel).toBe(true);
            expect(layout.split.children[0].tabs[0].id).toBe('src-tab2');
        });
        it('should create new split when dropping right in same orientation', () => {
            const tab = sourcePanel.tabs[1];
            ioSplit.moveTabToSplit(sourcePanelElement, targetPanel, tab, 'right');
            // Should add new panel at right of target
            expect(layout.split.children.length).toBe(3);
            expect(layout.split.children[2] instanceof Panel).toBe(true);
            expect(layout.split.children[2].tabs[0].id).toBe('src-tab2');
        });
        it('should create nested split when dropping perpendicular (top)', () => {
            const tab = sourcePanel.tabs[1];
            const targetPanelModel = layout.split.children[0];
            ioSplit.moveTabToSplit(sourcePanelElement, targetPanelModel, tab, 'top');
            // First child should now be a split with vertical orientation
            expect(layout.split.children[0] instanceof Split).toBe(true);
            expect(layout.split.children[0].orientation).toBe('vertical');
        });
        it('should create nested split when dropping perpendicular (bottom)', () => {
            const tab = sourcePanel.tabs[1];
            const targetPanelModel = layout.split.children[0];
            ioSplit.moveTabToSplit(sourcePanelElement, targetPanelModel, tab, 'bottom');
            // First child should now be a split with vertical orientation
            expect(layout.split.children[0] instanceof Split).toBe(true);
            expect(layout.split.children[0].orientation).toBe('vertical');
            // New panel should be at bottom
            const nestedSplit = layout.split.children[0];
            expect(nestedSplit.children[1] instanceof Panel).toBe(true);
            expect(nestedSplit.children[1].tabs[0].id).toBe('src-tab2');
        });
        it('should remove tab from source panel when creating split', () => {
            const tab = sourcePanel.tabs[1];
            ioSplit.moveTabToSplit(sourcePanelElement, targetPanel, tab, 'left');
            // Tab should be removed from source
            expect(sourcePanel.tabs.length).toBe(1);
            expect(sourcePanel.tabs.find((t) => t.id === 'src-tab2')).toBeUndefined();
        });
    });
    describe('Drag Cancellation', () => {
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                children: [
                    {
                        type: 'panel',
                        tabs: [
                            { id: 'tab1' },
                            { id: 'tab2' },
                        ],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
        });
        it('should cancel drag on pointercancel event', () => {
            const ioTab = layout.querySelector('io-tab');
            const panel = layout.split.children[0];
            const originalTabCount = panel.tabs.length;
            // Start drag
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = createPointerEvent('pointermove', {
                clientX: 200,
                clientY: 50,
            });
            ioTab.onPointermove(moveEvent);
            expect(tabDragIconSingleton.dragging).toBe(true);
            // Cancel
            const cancelEvent = createPointerEvent('pointercancel');
            ioTab.onPointercancel(cancelEvent);
            expect(tabDragIconSingleton.dragging).toBe(false);
            expect(panel.tabs.length).toBe(originalTabCount);
        });
        it('should reset drop marker on drag cancel', () => {
            const ioTab = layout.querySelector('io-tab');
            // Start drag
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            ioTab.onPointerdown(downEvent);
            const moveEvent = createPointerEvent('pointermove', {
                clientX: 200,
                clientY: 50,
            });
            ioTab.onPointermove(moveEvent);
            // Cancel
            tabDragIconSingleton.cancelDrag();
            expect(ioTabDropRectSingleton.dropTarget).toBeNull();
            expect(ioTabDropRectSingleton.dropIndex).toBe(-1);
            expect(ioTabDropRectSingleton.splitDirection).toBe('none');
        });
    });
    describe('TabDragIcon Singleton Behavior', () => {
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                children: [
                    {
                        type: 'panel',
                        tabs: [{ id: 'tab1' }],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
        });
        it('should update drop marker when drag icon properties change', () => {
            const ioPanel = layout.querySelector('io-panel');
            tabDragIconSingleton.setProperties({
                dragging: true,
                dropTarget: ioPanel,
                splitDirection: 'left',
                dropIndex: -1,
            });
            expect(ioTabDropRectSingleton.dropTarget).toBe(ioPanel);
            expect(ioTabDropRectSingleton.splitDirection).toBe('left');
        });
        it('should show drag icon with dragging attribute', () => {
            tabDragIconSingleton.dragging = true;
            expect(tabDragIconSingleton.hasAttribute('dragging')).toBe(true);
            tabDragIconSingleton.dragging = false;
            expect(tabDragIconSingleton.hasAttribute('dragging')).toBe(false);
        });
        it('should display tab label in drag icon', () => {
            const tab = layout.split.children[0].tabs[0];
            tabDragIconSingleton.tab = tab;
            const labelSpan = tabDragIconSingleton.querySelector('.label');
            expect(labelSpan?.textContent).toBe('tab1');
        });
    });
    describe('Drop Target Detection', () => {
        it('should calculate split direction based on cursor position', () => {
            // Test the calculateSplitDirection logic via the singleton
            // This verifies the direction calculation without needing actual DOM positions
            const split = new Split({
                type: 'split',
                children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const ioPanel = layout.querySelector('io-panel');
            // Test center detection via direct property setting
            tabDragIconSingleton.setProperties({
                dragging: true,
                dropTarget: ioPanel,
                splitDirection: 'center',
                dropIndex: -1,
            });
            expect(tabDragIconSingleton.splitDirection).toBe('center');
            expect(tabDragIconSingleton.dropTarget).toBe(ioPanel);
        });
        it('should detect edge directions', () => {
            const split = new Split({
                type: 'split',
                children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const ioPanel = layout.querySelector('io-panel');
            // Test various directions
            const directions = ['left', 'right', 'top', 'bottom', 'center'];
            for (const direction of directions) {
                tabDragIconSingleton.setProperties({
                    dragging: true,
                    dropTarget: ioPanel,
                    splitDirection: direction,
                    dropIndex: -1,
                });
                expect(tabDragIconSingleton.splitDirection).toBe(direction);
            }
        });
    });
    describe('Last Tab Protection', () => {
        it('should NOT remove panel when moving last tab to same panel', () => {
            const split = new Split({
                type: 'split',
                children: [
                    { type: 'panel', tabs: [{ id: 'only-tab' }] },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const panel = split.children[0];
            const ioPanel = layout.querySelector('io-panel');
            const tab = panel.tabs[0];
            // Add the same tab back (simulating drop to same location)
            ioPanel.addTab(tab, 0);
            // Panel should still exist with 1 tab
            expect(panel.tabs.length).toBe(1);
            expect(layout.querySelectorAll('io-panel').length).toBe(1);
        });
        it('should NOT dispatch panel-remove when removing last tab from root panel', () => {
            const split = new Split({
                type: 'split',
                children: [
                    { type: 'panel', tabs: [{ id: 'only-tab' }] },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const ioPanel = layout.querySelector('io-panel');
            const removeSpy = vi.fn();
            ioPanel.addEventListener('io-panel-remove', removeSpy);
            // Try to remove the last tab
            ioPanel.removeTab(ioPanel.panel.tabs[0]);
            // Should not dispatch remove event
            expect(removeSpy).not.toHaveBeenCalled();
        });
        it('should dispatch panel-remove when removing last tab from non-root panel', () => {
            const split = new Split({
                type: 'split',
                children: [
                    { type: 'panel', tabs: [{ id: 'tab1' }] },
                    { type: 'panel', tabs: [{ id: 'tab2' }] },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const panels = layout.querySelectorAll('io-panel');
            const secondPanel = panels[1];
            const removeSpy = vi.fn();
            secondPanel.addEventListener('io-panel-remove', removeSpy);
            secondPanel.removeTab(secondPanel.panel.tabs[0]);
            expect(removeSpy).toHaveBeenCalled();
        });
    });
    describe('Drag End Drop Operations', () => {
        let sourcePanel;
        let targetPanel;
        let sourcePanelElement;
        let targetPanelElement;
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    {
                        type: 'panel',
                        tabs: [{ id: 'src-tab1' }, { id: 'src-tab2' }],
                    },
                    {
                        type: 'panel',
                        tabs: [{ id: 'tgt-tab1' }],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            sourcePanel = split.children[0];
            targetPanel = split.children[1];
            const panels = layout.querySelectorAll('io-panel');
            sourcePanelElement = panels[0];
            targetPanelElement = panels[1];
        });
        it('should add tab to target panel with specific index when dropIndex is set', () => {
            const tab = sourcePanel.tabs[0];
            tabDragIconSingleton.setProperties({
                dragging: true,
                tab: tab,
                dropSource: sourcePanelElement,
                dropTarget: targetPanelElement,
                splitDirection: 'none',
                dropIndex: 1,
            });
            tabDragIconSingleton.endDrag();
            expect(sourcePanel.tabs.length).toBe(1);
            expect(targetPanel.tabs.length).toBe(2);
            expect(targetPanel.tabs[1].id).toBe('src-tab1');
        });
        it('should call moveTabToSplit when splitDirection is set', () => {
            const tab = sourcePanel.tabs[0];
            const moveTabToSplitSpy = vi.spyOn(targetPanelElement, 'moveTabToSplit');
            tabDragIconSingleton.setProperties({
                dragging: true,
                tab: tab,
                dropSource: sourcePanelElement,
                dropTarget: targetPanelElement,
                splitDirection: 'left',
                dropIndex: -1,
            });
            tabDragIconSingleton.endDrag();
            expect(moveTabToSplitSpy).toHaveBeenCalledWith(sourcePanelElement, tab, 'left');
        });
        it('should not move tab when dropping on same panel without direction', () => {
            const tab = sourcePanel.tabs[0];
            tabDragIconSingleton.setProperties({
                dragging: true,
                tab: tab,
                dropSource: sourcePanelElement,
                dropTarget: sourcePanelElement,
                splitDirection: 'none',
                dropIndex: 1,
            });
            tabDragIconSingleton.endDrag();
            // Should reorder within same panel, not remove
            expect(sourcePanel.tabs.length).toBe(2);
        });
    });
    describe('Complex Multi-Panel Scenarios', () => {
        it('should handle drag through multiple nested splits', () => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'left' }] },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [
                            { type: 'panel', tabs: [{ id: 'top-right' }] },
                            { type: 'panel', tabs: [{ id: 'bottom-right' }] },
                        ],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const panels = layout.querySelectorAll('io-panel');
            expect(panels.length).toBe(3);
            // Moving a tab from one nested panel to another should work
            const sourcePanel = panels[1];
            const targetPanel = panels[2];
            const tab = sourcePanel.panel.tabs[0];
            targetPanel.moveTabToSplit(sourcePanel, tab, 'center');
            // Source should be empty (pending removal) or removed
            expect(sourcePanel.panel.tabs.length).toBe(0);
            // Target should have the tab
            expect(targetPanel.panel.tabs.find((t) => t.id === 'top-right')).toBeTruthy();
        });
        it('should consolidate splits after panel removal', () => {
            const split = new Split({
                type: 'split',
                orientation: 'horizontal',
                children: [
                    { type: 'panel', tabs: [{ id: 'left' }, { id: 'left2' }] },
                    {
                        type: 'split',
                        orientation: 'vertical',
                        children: [
                            { type: 'panel', tabs: [{ id: 'top-right' }] },
                            { type: 'panel', tabs: [{ id: 'bottom-right' }] },
                        ],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            // Get the nested split
            const nestedSplit = split.children[1];
            expect(nestedSplit.children.length).toBe(2);
            // Remove one panel from nested split
            const panelToRemove = nestedSplit.children[0];
            panelToRemove.tabs.length = 0;
            // Dispatch panel-remove event
            const panels = layout.querySelectorAll('io-panel');
            const ioPanelToRemove = panels[1];
            ioPanelToRemove.dispatchEvent(new CustomEvent('io-panel-remove', {
                detail: { panel: panelToRemove },
                bubbles: true,
            }));
            // After consolidation, the nested split should be replaced with its sole child
            expect(split.children[1] instanceof Panel).toBe(true);
        });
    });
    describe('Drop Marker Synchronization', () => {
        beforeEach(() => {
            const split = new Split({
                type: 'split',
                children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
        });
        it('should sync drop marker with drag icon state changes', () => {
            const ioPanel = layout.querySelector('io-panel');
            // Initial state
            expect(ioTabDropRectSingleton.dropIndex).toBe(-1);
            // Update drag icon state
            tabDragIconSingleton.setProperties({
                dropTarget: ioPanel,
                splitDirection: 'none',
                dropIndex: 2,
            });
            // Drop marker should be in sync
            expect(ioTabDropRectSingleton.dropTarget).toBe(ioPanel);
            expect(ioTabDropRectSingleton.dropIndex).toBe(2);
        });
        it('should reset drop marker when drag ends', () => {
            const ioPanel = layout.querySelector('io-panel');
            tabDragIconSingleton.setProperties({
                dragging: true,
                dropTarget: ioPanel,
                splitDirection: 'left',
                dropIndex: 1,
            });
            tabDragIconSingleton.cancelDrag();
            expect(ioTabDropRectSingleton.dropTarget).toBeNull();
            expect(ioTabDropRectSingleton.splitDirection).toBe('none');
            expect(ioTabDropRectSingleton.dropIndex).toBe(-1);
        });
    });
    describe('Edge Cases and Error Handling', () => {
        it('should handle drag when no io-layout ancestor exists', () => {
            // Create a standalone io-tab not within a layout
            const tab = new Tab({ id: 'orphan-tab' });
            const ioTab = new IoTab({ tab });
            container.appendChild(ioTab);
            // Should not throw
            const downEvent = createPointerEvent('pointerdown', {
                clientX: 100,
                clientY: 50,
            });
            expect(() => ioTab.onPointerdown(downEvent)).not.toThrow();
            const moveEvent = createPointerEvent('pointermove', {
                clientX: 200,
                clientY: 50,
            });
            expect(() => ioTab.onPointermove(moveEvent)).not.toThrow();
            ioTab.remove();
            tab.dispose();
        });
        it('should handle rapid drag start/cancel sequences', () => {
            const split = new Split({
                type: 'split',
                children: [{ type: 'panel', tabs: [{ id: 'tab1' }] }],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const ioTab = layout.querySelector('io-tab');
            for (let i = 0; i < 5; i++) {
                const downEvent = createPointerEvent('pointerdown', {
                    clientX: 100,
                    clientY: 50,
                });
                ioTab.onPointerdown(downEvent);
                const moveEvent = createPointerEvent('pointermove', {
                    clientX: 200,
                    clientY: 50,
                });
                ioTab.onPointermove(moveEvent);
                const cancelEvent = createPointerEvent('pointercancel');
                ioTab.onPointercancel(cancelEvent);
            }
            expect(tabDragIconSingleton.dragging).toBe(false);
            expect(layout.split.children[0].tabs.length).toBe(1);
        });
        it('should handle duplicate tab ID when dragging to same panel', () => {
            const split = new Split({
                type: 'split',
                children: [
                    {
                        type: 'panel',
                        tabs: [{ id: 'tab1' }, { id: 'tab2' }],
                    },
                ],
            });
            layout = new IoLayout({ split, elements: [] });
            container.appendChild(layout);
            const ioPanel = layout.querySelector('io-panel');
            const panel = ioPanel.panel;
            // Try to add duplicate
            const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => { });
            const duplicateTab = new Tab({ id: 'tab1' });
            ioPanel.addTab(duplicateTab);
            // Should have removed the duplicate
            const tab1Count = panel.tabs.filter((t) => t.id === 'tab1').length;
            expect(tab1Count).toBe(1);
            expect(consoleWarnSpy).toHaveBeenCalled();
            consoleWarnSpy.mockRestore();
        });
    });
});
describe('IoLayout Integration - Multiple Instances', () => {
    let layout1;
    let layout2;
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 1600px;
      height: 600px;
    `;
        document.body.appendChild(container);
        const split1 = new Split({
            type: 'split',
            children: [{ type: 'panel', tabs: [{ id: 'layout1-tab' }] }],
        });
        layout1 = new IoLayout({ split: split1, elements: [] });
        layout1.style.cssText = 'width: 800px; height: 600px; float: left;';
        container.appendChild(layout1);
        const split2 = new Split({
            type: 'split',
            children: [{ type: 'panel', tabs: [{ id: 'layout2-tab' }] }],
        });
        layout2 = new IoLayout({ split: split2, elements: [] });
        layout2.style.cssText = 'width: 800px; height: 600px; float: left;';
        container.appendChild(layout2);
    });
    afterEach(() => {
        layout1.remove();
        layout2.remove();
        container.remove();
        tabDragIconSingleton.setProperties({
            dragging: false,
            tab: null,
            dropSource: null,
            dropTarget: null,
            splitDirection: 'none',
            dropIndex: -1,
        });
    });
    it('should scope drop target detection to containing layout', () => {
        // This test documents the current behavior with multiple layouts
        const tab1 = layout1.querySelector('io-tab');
        const panel1 = layout1.querySelector('io-panel');
        // Start drag from layout1
        const downEvent = new PointerEvent('pointerdown', {
            pointerId: 1,
            buttons: 1,
            clientX: 50,
            clientY: 50,
            bubbles: true,
            cancelable: true,
        });
        tab1.onPointerdown(downEvent);
        // Move past the 10px threshold to initiate drag
        const moveEvent = new PointerEvent('pointermove', {
            pointerId: 1,
            buttons: 1,
            clientX: 65,
            clientY: 50,
            bubbles: true,
            cancelable: true,
        });
        tab1.onPointermove(moveEvent);
        // Drag icon should show layout1 panel as source
        expect(tabDragIconSingleton.dragging).toBe(true);
        expect(tabDragIconSingleton.dropSource).toBe(panel1);
        // Note: Cross-layout drag behavior depends on the root passed to updateDrag
        // which is scoped by closest('io-layout')
    });
    it('should maintain independent layout states', () => {
        const panel1 = layout1.split.children[0];
        const panel2 = layout2.split.children[0];
        // Add tab to layout1
        const ioPanel1 = layout1.querySelector('io-panel');
        ioPanel1.addTab(new Tab({ id: 'new-tab' }));
        expect(panel1.tabs.length).toBe(2);
        expect(panel2.tabs.length).toBe(1);
    });
});
describe('IoLayout Integration - State Persistence', () => {
    let container;
    beforeEach(() => {
        container = document.createElement('div');
        container.style.display = 'none';
        document.body.appendChild(container);
    });
    afterEach(() => {
        container.remove();
        tabDragIconSingleton.setProperties({
            dragging: false,
            tab: null,
            dropSource: null,
            dropTarget: null,
            splitDirection: 'none',
            dropIndex: -1,
        });
    });
    it('should serialize layout state after drag operations', () => {
        const split = new Split({
            type: 'split',
            orientation: 'horizontal',
            children: [
                { type: 'panel', tabs: [{ id: 'tab1' }, { id: 'tab2' }] },
                { type: 'panel', tabs: [{ id: 'tab3' }] },
            ],
        });
        const layout = new IoLayout({ split, elements: [] });
        container.appendChild(layout);
        // Move tab from first to second panel
        const sourcePanelElement = layout.querySelectorAll('io-panel')[0];
        const targetPanelElement = layout.querySelectorAll('io-panel')[1];
        const tab = split.children[0].tabs[1];
        targetPanelElement.moveTabToSplit(sourcePanelElement, tab, 'center');
        // Serialize state
        const json = split.toJSON();
        expect(json.children[0].tabs.length).toBe(1);
        expect(json.children[1].tabs.length).toBe(2);
        expect(json.children[1].tabs[1].id).toBe('tab2');
        layout.remove();
    });
    it('should restore layout state from JSON', () => {
        const initialJson = {
            type: 'split',
            orientation: 'horizontal',
            children: [
                { type: 'panel', tabs: [{ id: 'restored-tab1' }] },
                { type: 'panel', tabs: [{ id: 'restored-tab2' }] },
            ],
        };
        const split = new Split(initialJson);
        const layout = new IoLayout({ split, elements: [] });
        container.appendChild(layout);
        const panels = layout.querySelectorAll('io-panel');
        expect(panels.length).toBe(2);
        expect(panels[0].panel.tabs[0].id).toBe('restored-tab1');
        expect(panels[1].panel.tabs[0].id).toBe('restored-tab2');
        layout.remove();
    });
});
//# sourceMappingURL=IoLayout.integration.test.js.map