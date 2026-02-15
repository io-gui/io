import {
  LineSegments,
  LineBasicMaterial,
  Float32BufferAttribute,
  BufferGeometry,
  Color,
  AdditiveBlending,
} from 'three/webgpu'
import type { Line } from '../game/items/line.js'
import type { Pads } from '../game/pads.js'

class Grid extends LineSegments {

  declare public geometry: BufferGeometry
  declare public material: LineBasicMaterial

  public width: number = 0
  public height: number = 0

  constructor() {
		const geometry = new BufferGeometry()
		const material = new LineBasicMaterial( { transparent: true, vertexColors: true, toneMapped: false, blending: AdditiveBlending } )
		super( geometry, material )
	}

	update( width: number, height: number, layer0Lines: Line[], layer1Lines: Line[], pads: Pads ) {

    const lines = [...layer0Lines, ...layer1Lines]

    this.width = width
    this.height = height

    if ( width < 2 || height < 2 ) {
			this.geometry.setAttribute( 'position', new Float32BufferAttribute( [], 3 ) )
			this.geometry.setAttribute( 'color', new Float32BufferAttribute( [], 4 ) )
			return
		}

    const segmentWidth = width - 1
    const segmentHeight = height - 1

		/*
		 * Grid segment visibility algorithm
		 *
		 * A grid segment (horizontal, vertical, or diagonal) is hidden (alpha = 0)
		 * when any of the following rules apply:
		 *
		 * 1. Vertex on layer-0 line without a pad:
		 *    If either vertex of the segment touches a position occupied by a
		 *    game line on layer 0, the segment is hidden — unless a pad exists
		 *    at that contact point (pads keep the grid visible).
		 *
		 * 2. Vertex on a fully-connected pad:
		 *    If either vertex coincides with a pad that has 2 or more line
		 *    connections (regardless of layer), the segment is hidden.
		 *
		 * 3. Vertex on a connected terminal pad:
		 *    If either vertex coincides with a terminal pad that has at least 1
		 *    line connection, the segment is hidden.
		 *
		 * 4. Perpendicular diagonal crossing:
		 *    A diagonal grid segment is hidden if a layer-0 game line has a
		 *    diagonal segment crossing the same cell in the perpendicular
		 *    direction (e.g. a "\" game line hides the "/" grid diagonal).
		 */

		// Build lookup structures for visibility checks
		const linePointsL0 = new Set<string>()
		const padPositions = new Set<string>()
		const padConnectionCounts = new Map<string, number>()
		const terminalPadPositions = new Set<string>()
		// Cells with layer-0 diagonal game lines: backslash "\" and slash "/"
		const cellDiagBackslash = new Set<string>()
		const cellDiagSlash = new Set<string>()

		pads.forEach((pad, x, y) => {
			const key = x + ',' + y
			padPositions.add( key )
			padConnectionCounts.set( key, 0 )
			if ( pad.isTerminal ) terminalPadPositions.add( key )
		})

		for ( const line of lines ) {
      const layer = layer0Lines.includes(line) ? 0 : 1
			if ( layer === 1 ) {
				const lastIdx = line.pos.length - 1
        if ( line.pos.length === 1) continue
				for ( let i = 0; i <= lastIdx; i ++ ) {
					const pos = line.pos[ i ]
					const key = pos.x + ',' + pos.y
					// Skip dangling endpoints (first/last with no terminal pad)
					if ( ( i === 0 || i === lastIdx ) && !terminalPadPositions.has( key ) ) continue
					linePointsL0.add( key )
				}
				for ( let i = 1; i < line.pos.length; i ++ ) {
					const ax = line.pos[ i - 1 ].x
					const ay = line.pos[ i - 1 ].y
					const bx = line.pos[ i ].x
					const by = line.pos[ i ].y
					const dx = bx - ax
					const dy = by - ay
					if ( Math.abs( dx ) === 1 && Math.abs( dy ) === 1 ) {
						const cellKey = Math.min( ax, bx ) + ',' + Math.min( ay, by )
						if ( ( dx > 0 ) === ( dy > 0 ) ) {
							cellDiagBackslash.add( cellKey )
						} else {
							cellDiagSlash.add( cellKey )
						}
					}
				}
			}
			const first = line.pos[ 0 ]
			const last = line.pos[ line.pos.length - 1 ]
			const firstKey = first.x + ',' + first.y
			const lastKey = last.x + ',' + last.y
			if ( padConnectionCounts.has( firstKey ) ) {
				padConnectionCounts.set( firstKey, padConnectionCounts.get( firstKey )! + 1 )
			}
			if ( padConnectionCounts.has( lastKey ) ) {
				padConnectionCounts.set( lastKey, padConnectionCounts.get( lastKey )! + 1 )
			}
		}

		const isHidden = ( [x, y]: [number, number] ): boolean => {
			const key = x + ',' + y
			// Rule 1: On a layer-0 line and no pad at this position
			if ( linePointsL0.has( key ) && !padPositions.has( key ) ) return true
			// Rule 2: Pad with 2+ line connections
			const padConns = padConnectionCounts.get( key )
			if ( padConns !== undefined ) {
				if ( terminalPadPositions.has( key ) ) {
					if ( padConns >= 1 ) return true
				} else if ( padConns >= 2 ) {
					return true
				}
			}
			return false
		}

		const color = new Color( 0x666666 )
		const color2 = new Color( 0x666666 )

    const hSegments = segmentWidth * height
		const vSegments = segmentHeight * width
		const dSegments = segmentWidth * segmentHeight * 2
		const totalSegments = hSegments + vSegments + dSegments
		const totalVertices = totalSegments * 2

		const positions = new Float32Array( totalVertices * 3 )
		const colors = new Float32Array( totalVertices * 4 )

		let vi = 0

		const pushVertex = ( [x, y]: [number, number], c: Color, alpha: number ) => {

			const pi = vi * 3
			const ci = vi * 4
			positions[ pi ] = x
			positions[ pi + 1 ] = y
			positions[ pi + 2 ] = 0
			c.toArray( colors, ci )
			colors[ ci + 3 ] = alpha
			vi ++

		}

		// Horizontal segments
		for ( let iz = 0; iz < height; iz ++ ) {
			for ( let ix = 0; ix < segmentWidth; ix ++ ) {
				const alpha = ( isHidden( [ix, iz] ) || isHidden( [ix + 1, iz] ) ) ? 0.15 : 1
				pushVertex( [ix, iz], color, alpha )
				pushVertex( [ix + 1, iz], color, alpha )
			}
		}

		// Vertical segments
		for ( let ix = 0; ix < width; ix ++ ) {
			for ( let iz = 0; iz < segmentHeight; iz ++ ) {
				const alpha = ( isHidden( [ix, iz] ) || isHidden( [ix, iz + 1] ) ) ? 0.15 : 1
				pushVertex( [ix, iz], color, alpha )
				pushVertex( [ix, iz + 1], color, alpha )
			}
		}

		// Diagonal segments (2 per cell: corner to corner)
		for ( let cz = 0; cz < segmentHeight; cz ++ ) {
			for ( let cx = 0; cx < segmentWidth; cx ++ ) {
				const cellKey = cx + ',' + cz
				// "\" grid diagonal: hidden if perpendicular "/" game line crosses this cell
				const a1 = ( isHidden( [cx, cz] ) || isHidden( [cx + 1, cz + 1] ) || cellDiagSlash.has( cellKey ) ) ? 0 : 1
				pushVertex( [cx, cz], color2, a1 )
				pushVertex( [cx + 1, cz + 1], color2, a1 )
				// "/" grid diagonal: hidden if perpendicular "\" game line crosses this cell
				const a2 = ( isHidden( [cx + 1, cz] ) || isHidden( [cx, cz + 1] ) || cellDiagBackslash.has( cellKey ) ) ? 0 : 1
				pushVertex( [cx + 1, cz], color2, a2 )
				pushVertex( [cx, cz + 1], color2, a2 )
			}
		}

		this.geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) )
		this.geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 4 ) )
	}

	dispose() {
		this.geometry.dispose()
		this.material.dispose()
	}

}


export { Grid }
