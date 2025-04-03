import { IoElement } from '../core/element';
import { PropertyInstance, PropertyDefinition } from '../core/internals/property';
import { IoThemeSingleton } from '../nodes/theme';
export declare class IoGl extends IoElement {
    #private;
    static get Style(): string;
    theme: typeof IoThemeSingleton;
    size: [number, number];
    color: [number, number, number, number];
    transparent: boolean;
    pxRatio: number;
    reactivity: string;
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: PropertyDefinition): string;
    initShader(): WebGLProgram;
    constructor(properties?: Record<string, any>);
    onResized(): void;
    get ctx(): CanvasRenderingContext2D;
    themeMutated(): void;
    changed(): void;
    _onRender(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: PropertyInstance): void;
    updateThemeUniforms(): void;
    setUniform(name: string, value: any): void;
    Register(ioNodeConstructor: typeof IoElement): void;
}
export declare const ioGl: (arg0?: import("../core/element").IoElementArgs | import("../core/element").VDOMArray[] | string, arg1?: import("../core/element").VDOMArray[] | string) => import("../core/element").VDOMArray;
//# sourceMappingURL=gl.d.ts.map