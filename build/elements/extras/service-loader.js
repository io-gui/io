var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { IoNode, RegisterIoNode } from '../../core/node.js';
debug: {
    if (!('serviceWorker' in navigator)) {
        console.warn('No Service Worker support!');
    }
    if (!('PushManager' in window)) {
        console.warn('No Push API Support!');
    }
}
let IoServiceLoader = class IoServiceLoader extends IoNode {
    static get Properties() {
        return {
            path: 'service.js',
            serviceWorker: undefined,
            permission: window.Notification ? window.Notification.permission : 'default',
            subscription: '',
        };
    }
    constructor(props) {
        super(props);
        this.requestNotification = this.requestNotification.bind(this);
        if ('serviceWorker' in navigator)
            void this.activate();
    }
    async activate() {
        const serviceWorkerRegistration = await navigator.serviceWorker.register(this.path);
        void serviceWorkerRegistration.update();
        navigator.serviceWorker.addEventListener('message', this.onServiceWorkerMessage);
        if (serviceWorkerRegistration.active) {
            this.serviceWorker = serviceWorkerRegistration;
        }
        else {
            serviceWorkerRegistration.addEventListener('activate', () => {
                this.serviceWorker = serviceWorkerRegistration;
            });
        }
    }
    serviceWorkerChanged() {
        if (this.permission === 'granted')
            this.subscribe();
    }
    subscribe() {
        if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({ command: 'subscribe' });
        }
    }
    async requestNotification() {
        this.permission = await window.Notification.requestPermission();
        if (this.permission === 'granted')
            this.subscribe();
    }
    onServiceWorkerMessage(message) {
        const data = JSON.parse(message.data);
        if (data.subscription)
            this.subscription = JSON.stringify(data.subscription);
    }
};
IoServiceLoader = __decorate([
    RegisterIoNode
], IoServiceLoader);
export { IoServiceLoader };
//# sourceMappingURL=service-loader.js.map