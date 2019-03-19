import {IoNode} from "./node.js";
import {IoStorage} from "./storage.js";

if (!("serviceWorker" in navigator)) { console.error("No Service Worker support!"); }
if (!("PushManager" in window)) { console.error("No Push API Support!"); }

const db = window.firebase !== undefined ? window.firebase.firestore() : null;

export class IoServiceLoader extends IoNode {
  static get properties() {
    return {
      path: String,
      serviceWorker: null,
      granted: window.Notification.permission === 'granted',
      subscription: IoStorage('io-notification-subscription'),
    };
  }
  constructor(props) {
    super(props);
    this.requestService();
  }
  async requestService() {
    if (this.granted) {
      const serviceWorker = await navigator.serviceWorker.register(this.path);
      serviceWorker.update();
      if (!serviceWorker.active) {
        serviceWorker.addEventListener('activate', () => { this.serviceWorker = serviceWorker; });
      } else {
        this.serviceWorker = serviceWorker;
      }
      navigator.serviceWorker.addEventListener('message', this.onServiceWorkerMessage);
    }
  }
  async requestNotification() {
    this.granted = await window.Notification.requestPermission() === 'granted';
    this.requestService();
  }
  subscriptionChanged(event) {
    if (db && this.subscription) db.collection("subscriptions").add({value: this.subscription});
    if (db && event.detail.oldValue) db.collection("oldsubscriptions").add({value: event.detail.oldValue});
  }
  onServiceWorkerMessage(event) {
    const data = JSON.parse(event.data);
    if (data.subscription) this.subscription = JSON.stringify(data.subscription);
  }
}
