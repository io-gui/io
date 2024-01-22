import { IoNode } from '../../core/node.js';
export declare class IoServiceLoader extends IoNode {
    static get Properties(): any;
    constructor(props?: any);
    activate(): Promise<void>;
    serviceWorkerChanged(): void;
    subscribe(): void;
    requestNotification(): Promise<void>;
    onServiceWorkerMessage(message: any): void;
}
//# sourceMappingURL=io-service-loader.d.ts.map