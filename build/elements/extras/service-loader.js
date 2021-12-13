import { IoNode, RegisterIoNode } from '../../core/io-node.js';
if (!('serviceWorker' in navigator)) {
    console.warn('No Service Worker support!');
}
if (!('PushManager' in window)) {
    console.warn('No Push API Support!');
}
/*

 **/
export class IoServiceLoader extends IoNode {
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
            void this.init();
    }
    async init() {
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
}
RegisterIoNode(IoServiceLoader);
//# sourceMappingURL=service-loader.js.map