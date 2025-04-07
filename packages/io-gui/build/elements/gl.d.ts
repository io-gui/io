import { IoElement, IoElementArgs, VDOMArray } from '../core/element';
import { PropertyInstance, PropertyDefinition } from '../core/internals/property';
import { IoThemeSingleton } from '../nodes/theme';
import { ArgsWithBinding } from '../core/node';
export type IoGlArgs = IoElementArgs & ArgsWithBinding<{
    color?: [number, number, number, number];
}>;
export declare class IoGl extends IoElement {
    #private;
    static vConstructor: (arg0?: IoGlArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
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
export declare const ioGl: (arg0?: IoGlArgs | VDOMArray[] | string, arg1?: VDOMArray[] | string) => VDOMArray;
//# sourceMappingURL=gl.d.ts.map