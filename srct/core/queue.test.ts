import {Queue} from './queue.js';

export default class {
  idChangeCounter = 0;
  changeCounter = 0;
  eventCounter = 0;
  eventName: any = null;
  eventPayload: any = null;
  fakeNode?: any = null;
  queue: Queue;
  constructor() {
    this.reset();
    this.queue = new Queue(this.fakeNode);
  }
  reset() {
    this.idChangeCounter = 0;
    this.changeCounter = 0;
    this.eventCounter = 0;
    this.eventName = null;
    this.eventPayload = null;
    const scope = this;
    this.fakeNode = {
      id: 0,
      idChanged() {
        scope.idChangeCounter++;
      },
      dispatchEvent(eventName: string, eventPayload: any) {
        scope.eventCounter++;
        scope.eventName = eventName;
        scope.eventPayload = eventPayload;
      },
      applyCompose(){},
      changed() {
        scope.changeCounter++;
      },
      __connected: true
    };
    this.queue = new Queue(this.fakeNode);
  }
  run() {
    describe('Queue', () => {
      it('Should have correct defaults', () => {
        chai.expect(typeof (this.queue as any).__node).to.be.equal('object');
        chai.expect(typeof (this.queue as any).__changes).to.be.equal('object');
        chai.expect((this.queue as any).__changes.length).to.be.equal(0);
        chai.expect((this.queue as any).__changes instanceof Array).to.be.equal(true);
        this.reset();
      });
      it('Should dispose correctly', () => {
        this.queue.dispose();
        chai.expect(typeof (this.queue as any).__node).to.be.equal('undefined');
        chai.expect(typeof (this.queue as any).__changes).to.be.equal('undefined');
        this.reset();
      });
      it('Should trigger change events', () => {
        this.queue.queue('test', 1, 0);
        this.queue.queue('test', 2, 1);
        this.queue.dispatch();
        chai.expect(this.eventName).to.be.equal('test-changed');
        chai.expect(this.eventPayload.property).to.be.equal('test');
        chai.expect(this.eventPayload.value).to.be.equal(2);
        chai.expect(this.eventPayload.oldValue).to.be.equal(0);
        chai.expect(this.eventCounter).to.be.equal(1);
        chai.expect(this.changeCounter).to.be.equal(1);
        this.queue.queue('test2', 0, -1);
        this.queue.queue('test3', 2, 1);
        this.queue.dispatch();
        chai.expect(this.eventName).to.be.equal('test2-changed');
        chai.expect(this.eventPayload.property).to.be.equal('test2');
        chai.expect(this.eventPayload.value).to.be.equal(0);
        chai.expect(this.eventPayload.oldValue).to.be.equal(-1);
        chai.expect(this.eventCounter).to.be.equal(3);
        chai.expect(this.idChangeCounter).to.be.equal(0);
        chai.expect(this.changeCounter).to.be.equal(2);
        this.reset();
      });
      it('should trigger handler functions', () => {
        this.queue.queue('id', 1, 0);
        this.queue.queue('id', 2, 1);
        this.queue.dispatch();
        chai.expect(this.idChangeCounter).to.be.equal(1);
        chai.expect(this.changeCounter).to.be.equal(1);
        this.reset();
      });
    });
  }
}
