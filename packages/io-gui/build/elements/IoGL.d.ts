import { ReactivePropertyInstance, ReactivePropertyDefinition } from '../core/ReactiveProperty.js';
import { VDOMElement } from '../vdom/VDOM.js';
import { ReactivityType } from '../nodes/Node.js';
import { ThemeSingleton } from '../nodes/Theme.js';
import { IoElement, IoElementProps } from './IoElement.js';
export declare class IoGl extends IoElement {
    #private;
    static vConstructor: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
    static get Style(): string;
    theme: typeof ThemeSingleton;
    size: [number, number];
    pxRatio: number;
    reactivity: ReactivityType;
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
export declare const ioGl: (arg0?: IoElementProps | Array<VDOMElement | null> | string, arg1?: Array<VDOMElement | null> | string) => VDOMElement;
//# sourceMappingURL=IoGL.d.ts.map