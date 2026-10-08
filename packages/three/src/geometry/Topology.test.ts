import { describe, it, expect } from 'vitest'
import { BoxGeometry, BufferGeometry, Float32BufferAttribute, PlaneGeometry } from 'three/webgpu'
import { ComponentSet, convertComponents, deriveComponents, getTopology, topologyDomainSize } from '@io-gui/three'

describe('Topology', () => {
  it('welds seam vertices into points and builds unique edges', () => {
    const topology = getTopology(new BoxGeometry(1, 1, 1), 'mesh')
    expect(topology.vertexCount).toBe(24)
    expect(topology.pointCount).toBe(8)
    expect(topology.primitiveCount).toBe(12)
    // 12 box edges plus one diagonal per side.
    expect(topology.edgeCount).toBe(18)
    expect(topology.cornerCount).toBe(36)
    for (let f = 0; f < topology.primitiveCount; f++) {
      for (let k = 0; k < 3; k++) {
        const a = topology.vertexToPoint[topology.corners[f * 3 + k]]
        const b = topology.vertexToPoint[topology.corners[f * 3 + (k + 1) % 3]]
        const edge = topology.primitiveEdges[f * 3 + k]
        expect([topology.edgePoints[edge * 2], topology.edgePoints[edge * 2 + 1]]).toEqual([Math.min(a, b), Math.max(a, b)])
      }
    }
  })

  it('is cached per geometry and rebuilt when positions or the index change', () => {
    const geometry = new PlaneGeometry(1, 1)
    const first = getTopology(geometry, 'mesh')
    expect(getTopology(geometry, 'mesh')).toBe(first)
    expect(first.pointCount).toBe(4)
    expect(first.edgeCount).toBe(5)
    geometry.getAttribute('position').needsUpdate = true
    const second = getTopology(geometry, 'mesh')
    expect(second).not.toBe(first)
    expect(getTopology(geometry, 'line').kind).toBe('line')
  })

  it('treats line segments as edges and points as points only', () => {
    const geometry = new BufferGeometry()
    geometry.setAttribute('position', new Float32BufferAttribute([0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 0], 3))
    const line = getTopology(geometry, 'line')
    expect(line.pointCount).toBe(3)
    expect(line.edgeCount).toBe(2)
    expect(line.primitiveCount).toBe(2)
    expect(line.cornerCount).toBe(0)
    const points = getTopology(geometry, 'points')
    expect(points.pointCount).toBe(3)
    expect(points.edgeCount).toBe(0)
    expect(topologyDomainSize(points, 'primitive')).toBe(0)
  })
})

describe('ComponentSet', () => {
  it('stores bits with a partial last word', () => {
    const set = new ComponentSet(40)
    set.add(0).add(31).add(39).add(40).add(-1)
    expect(set.toArray()).toEqual([0, 31, 39])
    expect(set.count()).toBe(3)
    set.toggle(31).delete(0)
    expect(set.toArray()).toEqual([39])
    expect(set.clone().invert().count()).toBe(39)
    expect(new ComponentSet(40).fill().count()).toBe(40)
    expect(set.equals(ComponentSet.from(40, [39]))).toBe(true)
    expect(new ComponentSet(40).equals(undefined)).toBe(true)
    expect(set.has(39) && !set.has(40)).toBe(true)
  })
})

describe('Component domains', () => {
  // Plane 1x1 segments: points 0..3, two triangles sharing the diagonal.
  const topology = getTopology(new PlaneGeometry(1, 1), 'mesh')

  it('derives down by touching and up by completeness', () => {
    const face = ComponentSet.from(2, [0])
    const fromFace = deriveComponents(topology, 'primitive', face)
    expect(fromFace.point.count()).toBe(3)
    expect(fromFace.edge.count()).toBe(3)

    const points = convertComponents(topology, 'primitive', face, 'point')
    expect(points.count()).toBe(3)
    expect(convertComponents(topology, 'point', points, 'primitive').toArray()).toEqual([0])
    expect(convertComponents(topology, 'point', points, 'edge').count()).toBe(3)

    const allButOne = new ComponentSet(4).fill().delete(points.toArray()[0])
    expect(convertComponents(topology, 'point', allButOne, 'primitive').count()).toBeLessThan(2)
  })

  it('ignores sets made for another topology', () => {
    expect(deriveComponents(topology, 'point', new ComponentSet(99).fill()).point.count()).toBe(0)
  })

  it('maps corners to points', () => {
    const corners = convertComponents(topology, 'point', ComponentSet.from(4, [0]), 'corner')
    expect(corners.count()).toBe(topology.corners.filter(vertex => topology.vertexToPoint[vertex] === 0).length)
  })
})
