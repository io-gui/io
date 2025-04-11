import { PropertyInstance, PropertyDefinition } from '../core/Property';
import { VDOMElement } from '../core/VDOM';
import { ArgsWithBinding } from '../nodes/Node';
import { ThemeSingleton } from '../nodes/Theme';
import { IoElement, IoElementArgs } from './IoElement';
export type IoGlArgs = IoElementArgs & ArgsWithBinding<{
    color?: [number, number, number, number];
}>;
export declare class IoGl extends IoElement {
    #private;
    static vConstructor: (arg0?: IoGlArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    theme: typeof ThemeSingleton;
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
    constructor(args?: IoGlArgs);
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
export declare const ioGl: (arg0?: IoGlArgs | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoGL.d.ts.map