import { IoElement } from '../core/element';
import { PropertyInstance, PropertyDefinition } from '../core/internals/property';
import { IoThemeSingleton } from '../nodes/theme';
export declare class IoGl extends IoElement {
    static get Style(): string;
    transparent: boolean;
    size: [number, number];
    color: [number, number, number, number];
    pxRatio: number;
    theme: typeof IoThemeSingleton;
    reactivity: string;
    needsResize: boolean;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: PropertyDefinition): string;
    initShader(): WebGLProgram;
    constructor(properties?: Record<string, any>);
    onResized(): void;
    themeMutated(): void;
    changed(): void;
    _onRender(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: PropertyInstance): void;
    updateThemeUniforms(): void;
    setUniform(name: string, value: any): void;
    Register(ioNodeConstructor: typeof IoElement): void;
}
//# sourceMappingURL=gl.d.ts.map