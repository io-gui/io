import { IoElement } from './element.js';
import { PropertyInstance, PropertyDeclaration } from './internals/property.js';
import { IoThemeSingleton } from './theme.js';
export declare class IoGl extends IoElement {
    static get Style(): string;
    size: [number, number];
    color: [number, number, number, number];
    pxRatio: number;
    theme: typeof IoThemeSingleton;
    private _needsResize;
    private _canvas;
    private _ctx;
    static get Vert(): string;
    static get GlUtils(): string;
    static get Frag(): string;
    initPropertyUniform(name: string, property: PropertyDeclaration): string;
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
}
//# sourceMappingURL=gl.d.ts.map