import { LineSegments, LineBasicMaterial, Float32BufferAttribute, BufferGeometry, Color, AdditiveBlending } from 'three/webgpu'

class Grid extends LineSegments {

  declare public geometry: BufferGeometry
  declare public material: LineBasicMaterial

  constructor( width = 10, height = 10 ) {

		const color = new Color( 0x666666 );
		const color2 = new Color( 0x333333 );

		const halfWidth = width / 2;
		const halfHeight = height / 2;

		const vertices: number[] = [];
		const colors: number[] = [];
		let j = 0;

		for ( let i = 0, z = - halfHeight; i <= height; i ++, z += 1 ) {

			vertices.push( - halfWidth, 0, z, halfWidth, 0, z );
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;

		}

		for ( let i = 0, x = - halfWidth; i <= width; i ++, x += 1 ) {

			vertices.push( x, 0, - halfHeight, x, 0, halfHeight );
			color.toArray( colors, j ); j += 3;
			color.toArray( colors, j ); j += 3;

		}

		// Diagonal lines (direction 1: x and z both increase, slope +1)
		for ( let k = - height; k <= width; k ++ ) {

			const jStart = Math.max( 0, - k );
			const jEnd = Math.min( height, width - k );
			if ( jStart >= jEnd ) continue;
			vertices.push(
				- halfWidth + jStart + k, 0, - halfHeight + jStart,
				- halfWidth + jEnd + k, 0, - halfHeight + jEnd
			);
			color2.toArray( colors, j ); j += 3;
			color2.toArray( colors, j ); j += 3;

		}

		// Diagonal lines (direction 2: x decreases as z increases, slope -1)
		for ( let m = 0; m <= width + height; m ++ ) {

			const jStart = Math.max( 0, m - width );
			const jEnd = Math.min( height, m );
			if ( jStart >= jEnd ) continue;
			vertices.push(
				- halfWidth + m - jStart, 0, - halfHeight + jStart,
				- halfWidth + m - jEnd, 0, - halfHeight + jEnd
			);
			color2.toArray( colors, j ); j += 3;
			color2.toArray( colors, j ); j += 3;

		}

		const geometry = new BufferGeometry();
		geometry.setAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
		geometry.setAttribute( 'color', new Float32BufferAttribute( colors, 3 ) );

		const material = new LineBasicMaterial( { transparent: true, vertexColors: true, toneMapped: false, blending: AdditiveBlending } );

		super( geometry, material );
	}

	dispose() {
		this.geometry.dispose();
		this.material.dispose();
	}

}


export { Grid };
