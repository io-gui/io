import { describe, it, expect } from 'vitest'
import { Binding, ReactiveNode, Register, ReactivePropertyDefinitions } from '@io-gui/core'

@Register
class TestNode extends ReactiveNode {
  declare prop1: number
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      prop1: 0,
      prop2: 0
    }
  }
}

@Register
class TestNodeString extends ReactiveNode {
  declare strProp: string
  static override get ReactiveProperties(): ReactivePropertyDefinitions {
    return {
      strProp: ''
    }
  }
}

describe('Binding', () => {
  it('Should initialize with correct default values', () => {
    const node = new TestNode()
    const binding = new Binding(node, 'prop1')
    expect(binding.node).toBe(node)
    expect(binding.property).toBe('prop1')
    expect(binding.targets instanceof Set).toBe(true)
    expect(binding.targets.size).toBe(0)
    expect(binding.targetProperties instanceof WeakMap).toBe(true)
  })
  it('Should set source and target properties', () => {
    const node = new TestNode()
    const binding = new Binding(node, 'prop1')
    node.prop1 = 1
    expect(binding.value).toBe(1)
    node.prop1 = 2
    expect(binding.value).toBe(2)
    binding.value = 3
    expect(node.prop1).toBe(3)
    const targetNode = new TestNode()
    binding.addTarget(targetNode, 'prop1')
    expect(targetNode.prop1).toBe(3)
    targetNode.prop1 = 4
    expect(binding.value).toBe(4)
    node.prop1 = 5
    expect(targetNode.prop1).toBe(5)
    expect(binding.value).toBe(5)
    binding.value = 6
    expect(node.prop1).toBe(6)
    expect(targetNode.prop1).toBe(6)
  })
  it('Should add/remove target nodes+properties with `addTarget()` and `removeTarget()`', () => {
    const srcNode = new TestNode()
    const binding0 = new Binding(srcNode, 'prop1')
    const binding1 = new Binding(srcNode, 'prop2')

    const dstNode0 = new TestNode()
    const dstNode1 = new TestNode()

    binding0.addTarget(dstNode0, 'prop1')
    binding1.addTarget(dstNode0, 'prop2')
    binding1.addTarget(dstNode1, 'prop1')
    binding1.addTarget(dstNode1, 'prop2')

    expect(srcNode._eventDispatcher.addedListeners).toEqual({
      'prop1-changed': [[binding0.onSourceChanged]],
      'prop2-changed': [[binding1.onSourceChanged]]
    })

    expect(dstNode0._eventDispatcher.addedListeners).toEqual({
      'prop1-changed': [[binding0.onTargetChanged]],
      'prop2-changed': [[binding1.onTargetChanged]]
    })

    expect(dstNode1._eventDispatcher.addedListeners).toEqual({
      'prop1-changed': [[binding1.onTargetChanged]],
      'prop2-changed': [[binding1.onTargetChanged]]
    })

    expect(binding0.targets.has(dstNode0)).toBe(true)
    expect(binding0.targets.size).toBe(1)
    expect(binding1.targets.has(dstNode0)).toBe(true)
    expect(binding1.targets.has(dstNode1)).toBe(true)
    expect(binding1.targets.size).toBe(2)

    expect(dstNode0._reactiveProperties.get('prop1')!.binding).toBe(binding0)
    expect(dstNode0._reactiveProperties.get('prop2')!.binding).toBe(binding1)
    expect(dstNode1._reactiveProperties.get('prop1')!.binding).toBe(binding1)
    expect(dstNode1._reactiveProperties.get('prop2')!.binding).toBe(binding1)

    const binding0target0Props = binding0.getTargetProperties(dstNode0)
    const binding0target1Props = binding0.getTargetProperties(dstNode1)
    expect(binding0target0Props[0]).toBe('prop1')
    expect(binding0target0Props.length).toBe(1)
    expect(binding0target1Props.length).toBe(0)

    const binding1target0Props = binding1.getTargetProperties(dstNode0)
    const binding1target1Props = binding1.getTargetProperties(dstNode1)
    expect(binding1target0Props[0]).toBe('prop2')
    expect(binding1target0Props.length).toBe(1)
    expect(binding1target1Props[0]).toBe('prop1')
    expect(binding1target1Props[1]).toBe('prop2')
    expect(binding1target1Props.length).toBe(2)

    binding1.removeTarget(dstNode1, 'prop1')
    expect(binding1target1Props[0]).toBe('prop2')
    expect(binding1target1Props.length).toBe(1)
    expect(dstNode1._reactiveProperties.get('prop1')!.binding).toBe(undefined)

    expect(dstNode1._eventDispatcher.addedListeners).toEqual({
      'prop2-changed': [[binding1.onTargetChanged]]
    })

    binding1.addTarget(dstNode1, 'prop1')
    expect(binding1target1Props.length).toBe(2)
    expect(dstNode1._reactiveProperties.get('prop1')!.binding).toBe(binding1)
    binding1.removeTarget(dstNode1)
    expect(binding1target1Props.length).toBe(0)
    expect(dstNode1._reactiveProperties.get('prop1')!.binding).toBe(undefined)
    expect(dstNode1._reactiveProperties.get('prop2')!.binding).toBe(undefined)

    expect(dstNode1._eventDispatcher.addedListeners).toEqual({})
  })
  it('Should remove existing binding from target if `addTarget()` causes a binding collision', () => {
    const srcNode1 = new TestNode()
    const binding1 = new Binding(srcNode1, 'prop1')
    const dstNode1 = new TestNode()
    binding1.addTarget(dstNode1, 'prop1')

    const srcNode2 = new TestNode()
    const binding2 = new Binding(srcNode2, 'prop1')

    expect(binding1.targets.has(dstNode1)).toBe(true)
    let binding1targetProps = binding1.getTargetProperties(dstNode1)
    expect(binding1targetProps.length).toBe(1)
    expect(binding1targetProps[0]).toBe('prop1')

    binding2.addTarget(dstNode1, 'prop1')

    expect(binding1.targets.size).toBe(0)
    binding1targetProps = binding1.getTargetProperties(dstNode1)
    expect(binding1targetProps.length).toBe(0)
  })
  it('Should dispose correctly', () => {
    const node = new TestNode()
    const dstNode = new TestNode()
    const binding = new Binding(node, 'prop1')
    binding.addTarget(dstNode, 'prop1')

    expect(node._eventDispatcher.addedListeners).toEqual({
      'prop1-changed': [[binding.onSourceChanged]]
    })

    expect(dstNode._eventDispatcher.addedListeners).toEqual({
      'prop1-changed': [[binding.onTargetChanged]],
    })

    binding.dispose()
    expect(binding.node).toBe(undefined)
    expect(binding.property).toBe(undefined)
    expect(binding.targets).toBe(undefined)
    expect(binding.targetProperties).toBe(undefined)
    expect(dstNode._reactiveProperties.get('prop1')!.binding).toBe(undefined)

    expect(node._eventDispatcher.addedListeners).toEqual({})

    expect(dstNode._eventDispatcher.addedListeners).toEqual({})
  })
  it('Should return correct JSON representation', () => {
    const node1 = new TestNode()
    const node2 = new TestNode()
    const node3 = new TestNode()
    const node4 = new TestNodeString()
    const binding = new Binding(node1, 'prop1')
    binding.addTarget(node2, 'prop1')
    binding.addTarget(node2, 'prop2')
    binding.addTarget(node3, 'prop1')
    binding.addTarget(node4, 'strProp')
    const json = binding.toJSON()
    expect(json).toEqual({
      node: 'TestNode',
      property: 'prop1',
      targets: ['TestNode', 'TestNode', 'TestNodeString'],
      targetProperties: [
        ['prop1', 'prop2'],
        ['prop1'],
        ['strProp']
      ]
    })
  })
  it('Should passthrough NaN without resync loop', () => {
    const src = new TestNode()
    const dst = new TestNode()
    const binding = new Binding(src, 'prop1')
    binding.addTarget(dst, 'prop1')

    src.prop1 = NaN
    expect(src.prop1).toBeNaN()
    expect(dst.prop1).toBeNaN()

    let changes = 0
    src.addEventListener('prop1-changed', () => changes++)
    dst.prop1 = NaN
    expect(changes).toBe(0)

    src.dispose()
    dst.dispose()
  })
  it('Should sync one source to four targets', () => {
    const src = new TestNode()
    const binding = new Binding(src, 'prop1')
    const targets = [new TestNode(), new TestNode(), new TestNode(), new TestNode()]
    for (const target of targets) {
      binding.addTarget(target, 'prop1')
    }

    src.prop1 = 7
    for (const target of targets) {
      expect(target.prop1).toBe(7)
    }

    targets[2].prop1 = 9
    expect(src.prop1).toBe(9)
    for (const target of targets) {
      expect(target.prop1).toBe(9)
    }

    src.dispose()
    for (const target of targets) target.dispose()
  })
  it('Should not infinite loop on circular binding', () => {
    const node1 = new TestNode()
    const node2 = new TestNode()
    node1.prop1 = node2.bind('prop1') as unknown as number
    node2.prop1 = node1.bind('prop1') as unknown as number

    let changes = 0
    node1.addEventListener('prop1-changed', () => changes++)
    node2.addEventListener('prop1-changed', () => changes++)

    node1.prop1 = 3
    expect(node1.prop1).toBe(3)
    expect(node2.prop1).toBe(3)
    expect(changes).toBeLessThan(8)

    node1.dispose()
    node2.dispose()
  })
})
