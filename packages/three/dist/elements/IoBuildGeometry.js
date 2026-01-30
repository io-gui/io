var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Register, IoElement, ReactiveProperty, div } from '@io-gui/core';
import { ioButton } from '@io-gui/inputs';
import { ioPropertyEditor } from '@io-gui/editors';
let IoBuildGeometry = class IoBuildGeometry extends IoElement {
    static get Style() {
        return /* css */ `
      :host {
        display: flex;
        flex-direction: column;
      }
      :host > div {
        display: flex;
        flex-direction: row;
      }
      :host > div > * {
        flex: 1 1 auto;
      }
    `;
    }
    constructor(args = {}) {
        super(args);
    }
    buildGeometry() {
        const geometry = this.value;
        if (!geometry)
            return;
        const parameters = geometry.parameters;
        if (!parameters) {
            debug: {
                console.warn('IoBuildGeometry: geometry has no parameters property');
            }
            return;
        }
        const GeometryClass = geometry.constructor;
        const parameterValues = Object.values(parameters);
        const newGeometry = new GeometryClass(...parameterValues);
        const version = geometry.index?.version ?? 0;
        geometry.copy(newGeometry);
        newGeometry.dispose();
        // Workaround for #32903
        if (geometry.index) {
            geometry.index.version = version;
        }
        for (const name in geometry.attributes) {
            geometry.attributes[name].needsUpdate = true;
        }
        if (geometry.index) {
            geometry.index.needsUpdate = true;
        }
        geometry.computeVertexNormals();
        if (geometry.index && geometry.attributes.position && geometry.attributes.normal && geometry.attributes.uv) {
            geometry.computeTangents();
        }
        geometry.computeBoundingSphere();
        geometry.computeBoundingBox();
        this.dispatchMutation(geometry);
        this.dispatchMutation(geometry.boundingBox);
        this.dispatchMutation(geometry.boundingSphere);
    }
    changed() {
        const geometry = this.value;
        if (!geometry) {
            this.render([]);
            return;
        }
        const hasParameters = geometry && geometry.parameters;
        const hasIndexNormalsUv = geometry.index && geometry.attributes.position && geometry.attributes.normal && geometry.attributes.uv;
        this.render([
            ioPropertyEditor({
                widget: null,
                value: geometry,
                properties: ['parameters'],
                labeled: false,
            }),
            div([
                ioButton({
                    label: 'Build',
                    action: () => this.buildGeometry(),
                    disabled: !hasParameters,
                }),
                ioButton({
                    label: 'vtx',
                    action: () => {
                        geometry?.computeVertexNormals();
                    },
                }),
                ioButton({
                    label: 'tng',
                    disabled: !hasIndexNormalsUv,
                    action: () => {
                        geometry?.computeTangents();
                    },
                }),
                ioButton({
                    label: 'bSphere',
                    action: () => {
                        geometry?.computeBoundingSphere();
                        this.dispatchMutation(geometry.boundingSphere);
                        this.dispatchMutation(geometry.boundingSphere.center);
                    },
                }),
                ioButton({
                    label: 'bBox',
                    action: () => {
                        geometry?.computeBoundingBox();
                        this.dispatchMutation(geometry.boundingBox.max);
                        this.dispatchMutation(geometry.boundingBox.min);
                    },
                }),
            ])
        ]);
    }
};
__decorate([
    ReactiveProperty({ type: Object, init: null })
], IoBuildGeometry.prototype, "value", void 0);
IoBuildGeometry = __decorate([
    Register
], IoBuildGeometry);
export { IoBuildGeometry };
export const ioBuildGeometry = function (arg0) {
    return IoBuildGeometry.vConstructor(arg0);
};
//# sourceMappingURL=IoBuildGeometry.js.map