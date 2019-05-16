import {IoNode} from "../core/node.js";

if (!("serviceWorker" in navigator)) { console.warn("No Service Worker support!"); }
if (!("PushManager" in window)) { console.warn("No Push API Support!"); }

export class IoServiceLoader extends IoNode {
  static get properties() {
    return {
      path: 'service.js',
      serviceWorker: undefined,
      granted: window.Notification && window.Notification.permission === 'granted',
      subscription: '',
    };

  }
  constructor(props) {
    super(props);
    if ("serviceWorker" in navigator) this.init();
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
    if (this.granted) this.subscribe();
  }
  subscribe() {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({command: 'subscribe'});
    }
  }
  async requestNotification() {
    this.granted = await window.Notification.requestPermission() === 'granted';
    if (this.granted) this.subscribe();
  }
  onServiceWorkerMessage(event) {
    const data = JSON.parse(event.data);
    if (data.subscription) this.subscription = JSON.stringify(data.subscription);
  }
}
