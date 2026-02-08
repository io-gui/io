import { LineSegments, LineBasicMaterial, Float32BufferAttribute, BufferAttribute, BufferGeometry, Color, AdditiveBlending } from 'three/webgpu'

const GRID_SIZE = 16

class Grid extends LineSegments {

  declare public geometry: BufferGeometry
  declare public material: LineBasicMaterial

  constructor() {

		const color = new Color( 0x666666 );
		const color2 = new Color( 0x333333 );

		const halfSize = GRID_SIZE / 2;
		const stride = GRID_SIZE + 1;
		const cornerCount = stride * stride;
		const centerCount = GRID_SIZE * GRID_SIZE;
		const totalVertices = cornerCount + centerCount;

		const positions = new Float32Array( totalVertices * 3 );
		const colors = new Float32Array( totalVertices * 4 );

		// Grid corner vertices (for horizontal/vertical segments)
		let vi = 0;
		for ( let iz = 0; iz <= GRID_SIZE; iz ++ ) {

			for ( let ix = 0; ix <= GRID_SIZE; ix ++ ) {

				const pi = vi * 3;
				const ci = vi * 4;
				positions[ pi ] = ix - halfSize;
				positions[ pi + 1 ] = 0;
				positions[ pi + 2 ] = iz - halfSize;
				color.toArray( colors, ci );
				colors[ ci + 3 ] = 1;
				vi ++;

			}

		}

		// Cell center vertices (for diagonal segments)
		for ( let cz = 0; cz < GRID_SIZE; cz ++ ) {

			for ( let cx = 0; cx < GRID_SIZE; cx ++ ) {

				const pi = vi * 3;
				const ci = vi * 4;
				positions[ pi ] = cx + 0.5 - halfSize;
				positions[ pi + 1 ] = 0;
				positions[ pi + 2 ] = cz + 0.5 - halfSize;
				color2.toArray( colors, ci );
				colors[ ci + 3 ] = 1;
				vi ++;

			}

		}

		const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new Float32BufferAttribute( positions, 3 ) );
		geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 4 ) );

		const material = new LineBasicMaterial( { transparent: true, vertexColors: true, toneMapped: false, blending: AdditiveBlending } );

		super( geometry, material );
	}

	update( width: number, height: number ) {

		// Dispose previous index buffer
		if ( this.geometry.index ) {

			this.geometry.setIndex( null );

		}

		width = Math.min( width, GRID_SIZE );
		height = Math.min( height, GRID_SIZE );

		if ( width === 0 || height === 0 ) return;

		const stride = GRID_SIZE + 1;

		const cornerIdx = ( ix: number, iz: number ) => iz * stride + ix;
		const centerIdx = ( cx: number, cz: number ) => stride * stride + cz * GRID_SIZE + cx;

		const hSegments = width * ( height + 1 );
		const vSegments = height * ( width + 1 );
		const dSegments = width * height * 4;
		const totalSegments = hSegments + vSegments + dSegments;
		const indices = new Uint16Array( totalSegments * 2 );

		let ii = 0;

		// Horizontal segments (individual per cell edge)
		for ( let iz = 0; iz <= height; iz ++ ) {

			for ( let ix = 0; ix < width; ix ++ ) {

				indices[ ii ++ ] = cornerIdx( ix, iz );
				indices[ ii ++ ] = cornerIdx( ix + 1, iz );

			}

		}

		// Vertical segments (individual per cell edge)
		for ( let ix = 0; ix <= width; ix ++ ) {

			for ( let iz = 0; iz < height; iz ++ ) {

				indices[ ii ++ ] = cornerIdx( ix, iz );
				indices[ ii ++ ] = cornerIdx( ix, iz + 1 );

			}

		}

		// Diagonal segments (4 per cell: center to each corner)
		for ( let cz = 0; cz < height; cz ++ ) {

			for ( let cx = 0; cx < width; cx ++ ) {

				const center = centerIdx( cx, cz );

				indices[ ii ++ ] = center;
				indices[ ii ++ ] = cornerIdx( cx, cz );

				indices[ ii ++ ] = center;
				indices[ ii ++ ] = cornerIdx( cx + 1, cz );

				indices[ ii ++ ] = center;
				indices[ ii ++ ] = cornerIdx( cx, cz + 1 );

				indices[ ii ++ ] = center;
				indices[ ii ++ ] = cornerIdx( cx + 1, cz + 1 );

			}

		}

		this.geometry.setIndex( new BufferAttribute( indices, 1 ) );

		// Offset position so the visible portion is centered at origin
		// Local (x, 0, z) → world (x, -z, 0) after rotation.x = PI/2
		this.position.set(
			GRID_SIZE / 2 - width / 2,
			height / 2 - GRID_SIZE / 2,
			0
		);

	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}

}


export { Grid };
