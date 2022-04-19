import { IoElement, Property } from '../../iogui.js';
import { IoThemeSingleton } from './theme.js';
declare type UniformTypes = BooleanConstructor | NumberConstructor | ArrayConstructor;
export declare class IoGl extends IoElement {
    static get Style(): string;
    static get Properties(): any;
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: Property): string;
    initShader(): WebGLProgram;
    css: typeof IoThemeSingleton;
    constructor(properties?: Record<string, any>);
    onResized(): void;
    cssMutated(): void;
    changed(): void;
    _render(): void;
    setShaderProgram(): void;
    updatePropertyUniform(name: string, property: Property): void;
    updateCssUniforms(): void;
    setUniform(name: string, type: UniformTypes, value: any): void;
}
export {};
//# sourceMappingURL=gl.d.ts.map