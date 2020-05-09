import {Node} from '../io.js';

if (!('serviceWorker' in navigator)) { console.warn('No Service Worker support!'); }
if (!('PushManager' in window)) { console.warn('No Push API Support!'); }

export class IoServiceLoader extends Node {
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
    if ('serviceWorker' in navigator) this.init();
  }
  async init() {
    const serviceWorkerRegistration = await navigator.serviceWorker.register(this.path);
    serviceWorkerRegistration.update();
    navigator.serviceWorker.addEventListener('message', this.onServiceWorkerMessage);
    if (serviceWorkerRegistration.active) {
      this.serviceWorker = serviceWorkerRegistration;
    } else {
      serviceWorkerRegistration.addEventListener('activate', () => {
        this.serviceWorker = serviceWorkerRegistration;
      });
    }
  }
  serviceWorkerChanged() {
    if (this.permission === 'granted') this.subscribe();
  }
  subscribe() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({command: 'subscribe'});
    }
  }
  async requestNotification() {
    this.permission = await window.Notification.requestPermission();
    if (this.permission === 'granted') this.subscribe();
  }
  onServiceWorkerMessage(event) {
    const data = JSON.parse(event.data);
    if (data.subscription) this.subscription = JSON.stringify(data.subscription);
  }
}

IoServiceLoader.Register();
