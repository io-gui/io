import { Binding, Node, Register, ReactiveProperty } from 'io-core'

@Register
class TestNode extends Node {
  @ReactiveProperty({type: Number, value: 0})
  declare prop1: number
  @ReactiveProperty({type: Number, value: 0})
  declare prop2: number
}

@Register
class TestNodeString extends Node {
  @ReactiveProperty({type: String, value: ''})
  declare strProp: string
}

// @Register
// class TestNodeBoolean extends Node {
//   @ReactiveProperty({type: Boolean, value: true})
//   declare boolProp: boolean;
// }

// @Register
// class TestNodeObject extends Node {
//   @ReactiveProperty({type: Object, init: null})
//   declare objProp: object;
// }

export default class {
  run() {
    describe('Binding', () => {
      it('Should initialize with correct default values', () => {
        const node = new TestNode()
        const binding = new Binding(node, 'prop1')
        expect(binding.node).to.be.equal(node)
        expect(binding.property).to.be.equal('prop1')
        expect(binding.targets instanceof Array).to.be.equal(true)
        expect(binding.targets.length).to.be.equal(0)
        expect(binding.targetProperties instanceof WeakMap).to.be.equal(true)
      })
      it('Should set source and target properties', () => {
        const node = new TestNode()
        const binding = new Binding(node, 'prop1')
        node.prop1 = 1
        expect(binding.value).to.be.equal(1)
        node.prop1 = 2
        expect(binding.value).to.be.equal(2)
        binding.value = 3
        expect(node.prop1).to.be.equal(3)
        const targetNode = new TestNode()
        binding.addTarget(targetNode, 'prop1')
        expect(targetNode.prop1).to.be.equal(3)
        targetNode.prop1 = 4
        expect(binding.value).to.be.equal(4)
        node.prop1 = 5
        expect(targetNode.prop1).to.be.equal(5)
        expect(binding.value).to.be.equal(5)
        binding.value = 6
        expect(node.prop1).to.be.equal(6)
        expect(targetNode.prop1).to.be.equal(6)
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

        expect(srcNode._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding0.onSourceChanged]],
          'prop2-changed': [[binding1.onSourceChanged]]
        })

        expect(dstNode0._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding0.onTargetChanged]],
          'prop2-changed': [[binding1.onTargetChanged]]
        })

        expect(dstNode1._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding1.onTargetChanged]],
          'prop2-changed': [[binding1.onTargetChanged]]
        })

        expect(binding0.targets[0]).to.be.equal(dstNode0)
        expect(binding0.targets[1]).to.be.equal(undefined)
        expect(binding1.targets[0]).to.be.equal(dstNode0)
        expect(binding1.targets[1]).to.be.equal(dstNode1)
        expect(binding1.targets[2]).to.be.equal(undefined)

        expect(dstNode0._reactiveProperties.get('prop1')!.binding).to.be.equal(binding0)
        expect(dstNode0._reactiveProperties.get('prop2')!.binding).to.be.equal(binding1)
        expect(dstNode1._reactiveProperties.get('prop1')!.binding).to.be.equal(binding1)
        expect(dstNode1._reactiveProperties.get('prop2')!.binding).to.be.equal(binding1)

        const binding0target0Props = binding0.getTargetProperties(dstNode0)
        const binding0target1Props = binding0.getTargetProperties(dstNode1)
        expect(binding0target0Props[0]).to.be.equal('prop1')
        expect(binding0target0Props.length).to.be.equal(1)
        expect(binding0target1Props.length).to.be.equal(0)

        const binding1target0Props = binding1.getTargetProperties(dstNode0)
        const binding1target1Props = binding1.getTargetProperties(dstNode1)
        expect(binding1target0Props[0]).to.be.equal('prop2')
        expect(binding1target0Props.length).to.be.equal(1)
        expect(binding1target1Props[0]).to.be.equal('prop1')
        expect(binding1target1Props[1]).to.be.equal('prop2')
        expect(binding1target1Props.length).to.be.equal(2)

        binding1.removeTarget(dstNode1, 'prop1')
        expect(binding1target1Props[0]).to.be.equal('prop2')
        expect(binding1target1Props.length).to.be.equal(1)
        expect(dstNode1._reactiveProperties.get('prop1')!.binding).to.be.equal(undefined)

        expect(dstNode1._eventDispatcher.addedListeners).to.be.eql({
          'prop2-changed': [[binding1.onTargetChanged]]
        })

        binding1.addTarget(dstNode1, 'prop1')
        expect(binding1target1Props.length).to.be.equal(2)
        expect(dstNode1._reactiveProperties.get('prop1')!.binding).to.be.equal(binding1)
        binding1.removeTarget(dstNode1)
        expect(binding1target1Props.length).to.be.equal(0)
        expect(dstNode1._reactiveProperties.get('prop1')!.binding).to.be.equal(undefined)
        expect(dstNode1._reactiveProperties.get('prop2')!.binding).to.be.equal(undefined)

        expect(dstNode1._eventDispatcher.addedListeners).to.be.eql({})
      })
      it('Should remove existing binding from target if `addTarget()` causes a binding collision', () => {
        const srcNode1 = new TestNode()
        const binding1 = new Binding(srcNode1, 'prop1')
        const dstNode1 = new TestNode()
        binding1.addTarget(dstNode1, 'prop1')

        const srcNode2 = new TestNode()
        const binding2 = new Binding(srcNode2, 'prop1')

        expect(binding1.targets).to.be.include(dstNode1)
        let binding1targetProps = binding1.getTargetProperties(dstNode1)
        expect(binding1targetProps.length).to.be.equal(1)
        expect(binding1targetProps[0]).to.be.equal('prop1')

        binding2.addTarget(dstNode1, 'prop1')

        expect(binding1.targets).to.be.eql([])
        binding1targetProps = binding1.getTargetProperties(dstNode1)
        expect(binding1targetProps.length).to.be.equal(0)
      })
      it('Should dispose correctly', () => {
        const node = new TestNode()
        const dstNode = new TestNode()
        const binding = new Binding(node, 'prop1')
        binding.addTarget(dstNode, 'prop1')

        expect(node._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding.onSourceChanged]]
        })

        expect(dstNode._eventDispatcher.addedListeners).to.be.eql({
          'prop1-changed': [[binding.onTargetChanged]],
        })

        binding.dispose()
        expect(binding.node).to.be.equal(undefined)
        expect(binding.property).to.be.equal(undefined)
        expect(binding.targets).to.be.equal(undefined)
        expect(binding.targetProperties).to.be.equal(undefined)
        expect(dstNode._reactiveProperties.get('prop1')!.binding).to.be.equal(undefined)

        expect(node._eventDispatcher.addedListeners).to.be.eql({})

        expect(dstNode._eventDispatcher.addedListeners).to.be.eql({})
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
        expect(json).to.be.eql({
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
    })
  }
}
