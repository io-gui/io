import { describe, it, expect } from 'vitest'
import { Binding, ReactiveObject, ReactiveElement, Register, PropertyDefinitions } from '@io-gui/core'

@Register
class TestNode extends ReactiveObject {
  declare prop1: number
  static override get Properties(): PropertyDefinitions {
    return {
      prop1: 0,
      prop2: 0
    }
  }
}

@Register
class TestNodeString extends ReactiveObject {
  declare strProp: string
  static override get Properties(): PropertyDefinitions {
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

    expect(dstNode0._properties.get('prop1')!.binding).toBe(binding0)
    expect(dstNode0._properties.get('prop2')!.binding).toBe(binding1)
    expect(dstNode1._properties.get('prop1')!.binding).toBe(binding1)
    expect(dstNode1._properties.get('prop2')!.binding).toBe(binding1)

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
    expect(dstNode1._properties.get('prop1')!.binding).toBe(undefined)

    expect(dstNode1._eventDispatcher.addedListeners).toEqual({
      'prop2-changed': [[binding1.onTargetChanged]]
    })

    binding1.addTarget(dstNode1, 'prop1')
    expect(binding1target1Props.length).toBe(2)
    expect(dstNode1._properties.get('prop1')!.binding).toBe(binding1)
    binding1.removeTarget(dstNode1)
    expect(binding1target1Props.length).toBe(0)
    expect(dstNode1._properties.get('prop1')!.binding).toBe(undefined)
    expect(dstNode1._properties.get('prop2')!.binding).toBe(undefined)

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
    expect(dstNode._properties.get('prop1')!.binding).toBe(undefined)

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
  /**
   * PageModel-like hub-and-spoke: source `guid` bound to model + view.
   * Model `guidChanged` sync-mutates (cache-hit load). View re-renders from that
   * mutation via `modelMutated` and must read the same `guid` as the model.
   *
   * Breaks when `Binding.onSourceChanged` updates targets sequentially: model
   * gets the value first, its sync handler mutates, view re-renders while its
   * own spoke is still `''`. Final `view.guid` may catch up later, but the
   * mutation-time snapshot (download URL) stays wrong — AssetInfoView symptom.
   */
  it('Should keep hub-and-spoke targets in sync when first target mutates during source push', () => {
    @Register
    class GuidModel extends ReactiveObject {
      static override get Properties(): PropertyDefinitions {
        return {
          guid: '',
          formats: {type: Array, init: null},
        }
      }
      declare guid: string
      declare formats: string[]
      guidChanged() {
        this.formats = []
        if (this.guid) {
          // Sync cache-hit path (AssetInfo.load when ASSET_INFO_CACHE hits).
          this.formats = ['GLTF2']
        }
      }
    }

    @Register
    class GuidView extends ReactiveElement {
      static override get Properties(): PropertyDefinitions {
        return {
          model: {type: GuidModel, init: null},
          guid: '',
          downloadPath: '',
        }
      }
      declare model: GuidModel
      declare guid: string
      declare downloadPath: string
      ready() {
        this.modelMutated()
      }
      modelMutated() {
        // AssetInfoView reads this.guid while model.guid is already set.
        this.downloadPath = this.model.formats.length
          ? `/archives/${this.guid}/${this.guid}_${this.model.formats[0]}.zip`
          : ''
      }
    }

    @Register
    class GuidPage extends ReactiveElement {
      static override get Properties(): PropertyDefinitions {
        return {
          guid: '',
          model: {type: GuidModel, init: null},
        }
      }
      declare guid: string
      declare model: GuidModel
      declare view: GuidView
      ready() {
        this.model.guid = this.bind('guid') as unknown as string
        this.view = new GuidView({
          model: this.model,
          guid: this.bind('guid'),
        })
      }
    }

    const page = new GuidPage({guid: ''})
    expect(page.model.guid).toBe('')
    expect(page.view.guid).toBe('')

    page.guid = 'asset-abc'

    expect(page.model.guid).toBe('asset-abc')
    expect(page.view.guid).toBe('asset-abc')
    expect(page.model.formats).toEqual(['GLTF2'])
    // Mutation-time render must not bake empty guid into derived UI state.
    expect(page.view.downloadPath).toBe('/archives/asset-abc/asset-abc_GLTF2.zip')

    page.view.dispose()
    page.dispose()
  })
  it('Should not leave a spoke empty while another spoke already has the source value mid-push', () => {
    @Register
    class Spoke extends ReactiveObject {
      static override get Properties(): PropertyDefinitions {
        return {guid: ''}
      }
      declare guid: string
    }

    const hub = new TestNodeString()
    const model = new Spoke()
    const view = new Spoke()
    const seen: {model: string, view: string}[] = []

    model.addEventListener('guid-changed', () => {
      seen.push({model: model.guid, view: view.guid})
    })

    model.guid = hub.bind('strProp') as unknown as string
    view.guid = hub.bind('strProp') as unknown as string

    hub.strProp = 'asset-abc'

    expect(model.guid).toBe('asset-abc')
    expect(view.guid).toBe('asset-abc')
    // Every observation during the push must see both spokes already matching the source.
    // Fails if onSourceChanged updates targets one-by-one and sync handlers run mid-loop.
    expect(seen).toEqual([{model: 'asset-abc', view: 'asset-abc'}])

    hub.dispose()
    model.dispose()
    view.dispose()
  })
})
