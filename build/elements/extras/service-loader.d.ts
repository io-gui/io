import { IoNode } from '../../iogui.js';
export declare class IoServiceLoader extends IoNode {
    static get Properties(): any;
    constructor(props?: any);
    init(): Promise<void>;
    serviceWorkerChanged(): void;
    subscribe(): void;
    requestNotification(): Promise<void>;
    onServiceWorkerMessage(message: any): void;
}
//# sourceMappingURL=service-loader.d.ts.map