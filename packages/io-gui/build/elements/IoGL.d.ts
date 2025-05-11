import { ReactivePropertyInstance, ReactivePropertyDefinition } from '../core/ReactiveProperty';
import { VDOMElement } from '../vdom/VDOM';
import { ThemeSingleton } from '../nodes/Theme';
import { IoElement, IoElementProps } from './IoElement';
export declare class IoGl extends IoElement {
    #private;
    static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    theme: typeof ThemeSingleton;
    size: [number, number];
    pxRatio: number;
    reactivity: string;
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
    _onRender(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: ReactivePropertyInstance): void;
    updateThemeUniforms(): void;
    setUniform(name: string, value: any): void;
    Register(ioNodeConstructor: typeof IoElement): void;
}
export declare const ioGl: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoGL.d.ts.map