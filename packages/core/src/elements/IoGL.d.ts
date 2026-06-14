import { ReactivePropertyInstance, ReactivePropertyDefinition } from '../core/ReactiveProperty.js';
import { ThemeSingleton } from '../nodes/Theme.js';
import { IoElement, IoElementProps } from './IoElement.js';
export declare class IoGl extends IoElement {
    #private;
    static get Style(): string;
    theme: typeof ThemeSingleton;
    size: [number, number];
    pxRatio: number;
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: ReactivePropertyDefinition): string;
    initShader(): WebGLProgram;
    constructor(args?: IoElementProps);
    onResized(): void;
    get ctx(): CanvasRenderingContext2D;
    themeMutated(): void;
    changed(): void;
    onRender(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: ReactivePropertyInstance): void;
    updateThemeUniforms(): void;
    setUniform(name: string, value: any): void;
    Register(ioNodeConstructor: typeof IoElement): void;
}
//# sourceMappingURL=IoGL.d.ts.map