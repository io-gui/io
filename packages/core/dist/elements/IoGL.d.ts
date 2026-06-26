import { PropertyInstance, PropertyDefinition } from '../core/Property.js';
import { ThemeSingleton } from '../nodes/Theme.js';
import { ReactiveElement, IoElementProps } from './ReactiveElement.js';
/** WebGL canvas element with shared context and shader program cache. */
export declare class IoGl extends ReactiveElement {
    #private;
    static get Style(): string;
    theme: typeof ThemeSingleton;
    size: [number, number];
    pxRatio: number;
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: PropertyDefinition): string;
    initShader(): WebGLProgram;
    constructor(args?: IoElementProps);
    onResized(): void;
    get ctx(): CanvasRenderingContext2D;
    themeMutated(): void;
    mutated(): void;
    onRender(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: PropertyInstance): void;
    updateThemeUniforms(): void;
    setUniform(name: string, value: unknown): void;
    Register(ioNodeConstructor: typeof ReactiveElement): void;
}
