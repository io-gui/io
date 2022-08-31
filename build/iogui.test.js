import{ProtoChain as e,IoNode as t,IoElement as n,IoNodeMixin as o,ProtoProperty as a,Property as i,Binding as c,assignProtoProperty as l,RegisterIoNode as r,EventDispatcher as s,ChangeQueue as p,RegisterIoElement as d}from"./iogui.js";import"mocha";import"chai";class Array1 extends Array{}class Array2 extends Array1{}class Array3 extends Array2{}class Object1$1{}class Object2 extends Object1$1{}class Object3 extends Object2{}class HTMLElement1 extends HTMLElement{}class HTMLElement2 extends HTMLElement1{}class HTMLElement3 extends HTMLElement2{}class IoNode1$1 extends t{}class IoElement1 extends n{}class IoNode2$1 extends(o(Object3)){}class FakeIoNode1{static get Properties(){return{prop1:{notify:!1}}}static get Listeners(){return{listener1:"function1",listener2:"",listener3:["_function1",{capture:!0}],listener4:()=>{}}}static get Style(){return"a"}function1(){}onFunction1(){}_function1(){}}class FakeIoNode2 extends FakeIoNode1{function2(){}onFunction2(){}_function2(){}static get Properties(){return{prop1:{observe:!0},prop2:{}}}static get Listeners(){return{listener1:"_function2",listener2:["function2",{capture:!0,passive:!0}],listener3:["_function1",{passive:!0}]}}static get Style(){return"b"}}class FakeIoNode3 extends FakeIoNode2{}class ProtoChain{run(){describe("ProtoChain",(()=>{it("Should include an array of inherited class constructors",(()=>{let o=new e(Array3).constructors;chai.expect(o).to.be.eql([Array3,Array2,Array1]),o=new e(Object3).constructors,chai.expect(o).to.be.eql([Object3,Object2,Object1$1]),o=new e(HTMLElement3).constructors,chai.expect(o).to.be.eql([HTMLElement3,HTMLElement2,HTMLElement1]),o=new e(IoNode1$1).constructors,chai.expect(o).to.be.eql([IoNode1$1,t]),o=new e(IoElement1).constructors,chai.expect(o).to.be.eql([IoElement1,n]),o=new e(IoNode2$1).constructors,chai.expect(o).to.be.eql([IoNode2$1])})),it('Should include an array of function names that start with "on" or "_" for auto-binding',(()=>{let t=new e(IoNode1$1);chai.expect(t.functions).to.be.eql([]),t=new e(FakeIoNode1),chai.expect(t.functions).to.be.eql(["onFunction1","_function1"]),t=new e(FakeIoNode2),chai.expect(t.functions).to.be.eql(["onFunction2","_function2","onFunction1","_function1"])})),it("Should bind all auto-binding functions from the `.functions` array with `.bindFunctions(node)` function",(()=>{const t=new e(FakeIoNode2),n=new FakeIoNode2;t.bindFunctions(n),chai.expect(n.function1.name).to.be.equal("function1"),chai.expect(n.onFunction1.name).to.be.equal("bound onFunction1"),chai.expect(n._function1.name).to.be.equal("bound _function1"),chai.expect(n.function2.name).to.be.equal("function2"),chai.expect(n.onFunction2.name).to.be.equal("bound onFunction2"),chai.expect(n._function2.name).to.be.equal("bound _function2")})),it("Should include all property definitions declared in `static get Properties()` return oject",(()=>{let t=new e(FakeIoNode1);chai.expect(Object.keys(t.properties)).to.be.eql(["prop1"]),chai.expect(t.properties).to.be.eql({prop1:{value:void 0,type:void 0,binding:void 0,notify:!1,reflect:0,observe:!1}}),t=new e(FakeIoNode2),chai.expect(Object.keys(t.properties)).to.be.eql(["prop1","prop2"]),chai.expect(t.properties).to.be.eql({prop1:{value:void 0,type:void 0,binding:void 0,notify:!1,reflect:0,observe:!0},prop2:{value:void 0,type:void 0,binding:void 0,notify:!0,reflect:0,observe:!1}})})),it("Should include all listner definitions declared in `static get Listeners()` return oject",(()=>{let t=new e(FakeIoNode1);chai.expect(Object.keys(t.listeners)).to.be.eql(["listener1","listener3","listener4"]),chai.expect(t.listeners.listener1).to.be.eql([["function1"]]),chai.expect(t.listeners.listener3).to.be.eql([["_function1",{capture:!0}]]),chai.expect(String(t.listeners.listener4)).to.be.eql(String([[()=>{}]])),t=new e(FakeIoNode2),chai.expect(Object.keys(t.listeners)).to.be.eql(["listener1","listener3","listener4","listener2"]),chai.expect(t.listeners.listener1).to.be.eql([["function1"],["_function2"]]),chai.expect(t.listeners.listener2).to.be.eql([["function2",{capture:!0,passive:!0}]]),chai.expect(t.listeners.listener3).to.be.eql([["_function1",{capture:!0,passive:!0}]]),chai.expect(String(t.listeners.listener4)).to.be.eql(String([[()=>{}]]))})),it("Should include all style strings declared in `static get Style()` return string",(()=>{let t=new e(FakeIoNode1);chai.expect(t.style).to.be.equal("a\n"),t=new e(FakeIoNode2),chai.expect(t.style).to.be.equal("a\nb\n"),t=new e(FakeIoNode3),chai.expect(t.style).to.be.equal("a\nb\n")})),it("Should include all property names of observed object properties",(()=>{let t=new e(FakeIoNode1);chai.expect(t.observedObjects).to.be.eql([]),t=new e(FakeIoNode2),chai.expect(t.observedObjects).to.be.eql(["prop1"])}))}))}}class Object1{prop=!0}class TestIoNode$1 extends t{static get Properties(){return{label:""}}}r(TestIoNode$1);class Property{run(){describe("Property",(()=>{it("Should initialize correct property definitions and values from weakly typed property definitions",(()=>{let e,t;e=new a({}),t=new i(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(null),t=new i(e),chai.expect(e).to.be.eql(t).to.be.eql({value:null,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(void 0),t=new i(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Number),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:0,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Number}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:0,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(1),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:1,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({value:2}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:2,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(String),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:String}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a("test"),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"test",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({value:"test"}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"test",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Boolean),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!1,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Boolean}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!1,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(!0),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!0,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({value:!0}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!0,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Object),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Object}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1});const n={prop:!0};e=new a({value:n}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{prop:!0},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(n),chai.expect(t.value).not.to.equal(n),e=new a(Array),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Array}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Object1),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:new Object1,type:Object1,binding:void 0,reflect:0,notify:!0,observe:!1});const o=[1,2,3];e=new a({value:o}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[1,2,3],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(o),chai.expect(t.value).not.to.equal(o);const c=new Object1;e=new a({value:c}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:new Object1,type:Object1,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(c),chai.expect(t.value).not.to.equal(c),e=new a({type:Object1}),t=new i(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{prop:!0},type:Object1,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({reflect:-1,notify:!1,observe:!0}),t=new i(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:-1,notify:!1,observe:!0})})),it("Should initialize properties with binding correctly",(()=>{let e,t,n=new c(new TestIoNode$1({label:"lorem"}),"label");e=new a(n),t=new i(e),chai.expect(e).to.be.eql(t).to.be.eql({value:"lorem",type:String,binding:n,reflect:0,notify:!0,observe:!1}),n=new c(new TestIoNode$1({label:"lorem"}),"label"),e=new a({binding:n,value:"ipsum"}),t=new i(e),chai.expect(e).to.be.eql(t).to.be.eql({value:"lorem",type:String,binding:n,reflect:0,notify:!0,observe:!1})})),it("Should assign property definitions correctly",(()=>{const e=new c(new TestIoNode$1({label:"lorem"}),"label");let t=new a({}),n=new a({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0});l(t,n),chai.expect(t).to.be.eql(n),t=new a({}),n=new a({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0}),l(n,t),chai.expect(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(n).to.be.eql({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0})}))}))}}class TestIoNode extends t{static get Properties(){return{prop1:0,prop2:0}}}r(TestIoNode);class Binding{run(){describe("Binding",(()=>{it("Should initialize with correct default values",(()=>{const e=new TestIoNode,t=new c(e,"prop1");chai.expect(t.node).to.be.equal(e),chai.expect(t.property).to.be.equal("prop1"),chai.expect(t.targets instanceof Array).to.be.equal(!0),chai.expect(t.targets.length).to.be.equal(0),chai.expect(t.targetProperties instanceof WeakMap).to.be.equal(!0)})),it("Should get and set property value on source node with `value` getter/setter",(()=>{const e=new TestIoNode,t=new c(e,"prop1");e.prop1=1,chai.expect(t.value).to.be.equal(1),e.prop1=2,chai.expect(t.value).to.be.equal(2),t.value=3,chai.expect(e.prop1).to.be.equal(3)})),it("Should add/remove target nodes and properties with `.addTarget()` and `removeTarget()`",(()=>{const e=new TestIoNode,t=new c(e,"prop1"),n=new c(e,"prop2"),o=new TestIoNode,a=new TestIoNode;t.addTarget(o,"prop1"),n.addTarget(o,"prop2"),n.addTarget(a,"prop1"),n.addTarget(a,"prop2"),chai.expect(t.targets[0]).to.be.equal(o),chai.expect(t.targets[1]).to.be.equal(void 0),chai.expect(n.targets[0]).to.be.equal(o),chai.expect(n.targets[1]).to.be.equal(a),chai.expect(n.targets[2]).to.be.equal(void 0);const i=t.getTargetProperties(o),l=t.getTargetProperties(a);chai.expect(i[0]).to.be.equal("prop1"),chai.expect(i.length).to.be.equal(1),chai.expect(l.length).to.be.equal(0);const r=n.getTargetProperties(o),s=n.getTargetProperties(a);chai.expect(r[0]).to.be.equal("prop2"),chai.expect(r.length).to.be.equal(1),chai.expect(s[0]).to.be.equal("prop1"),chai.expect(s[1]).to.be.equal("prop2"),chai.expect(s.length).to.be.equal(2),n.removeTarget(a,"prop1"),chai.expect(s[0]).to.be.equal("prop2"),chai.expect(s.length).to.be.equal(1),n.addTarget(a,"prop1"),n.removeTarget(a),chai.expect(s.length).to.be.equal(0)})),it("Should dispose correctly",(()=>{const e=new TestIoNode,t=new c(e,"prop1");t.dispose(),chai.expect(t.node).to.be.equal(void 0),chai.expect(t.property).to.be.equal(void 0),chai.expect(t.targets).to.be.equal(void 0),chai.expect(t.targetProperties).to.be.equal(void 0)}))}))}}const handlerFunction=()=>{};class IoNode1 extends t{handler1Count=0;handler1Detail;static get Listeners(){return{event1:"handler1"}}handler1(e){this.handler1Count++,this.handler1Detail=e.detail}}r(IoNode1);class IoNode2 extends IoNode1{handler2Count=0;handler3Count=0;handler2Detail;handler3Detail;static get Listeners(){return{event2:["handler2",{capture:!0}]}}handler2(e){this.handler2Count++,this.handler2Detail=e.detail}handler3(e){this.handler3Count++,this.handler3Detail=e.detail}}r(IoNode2);class IoNode3 extends IoNode2{static get Listeners(){return{event1:"handler3",event2:[handlerFunction,{passive:!0}],event3:handlerFunction}}}r(IoNode3);class TestDivEventDispatchElement extends HTMLElement{handler3Count=0;handler3Detail;handler3(e){this.handler3Count++,this.handler3Detail=e.detail}}window.customElements.define("test-div-event-dispatch",TestDivEventDispatchElement);class EventDispatcher{run(){describe("EventDispatcher",(()=>{it("Should initialize with correct values",(()=>{const e={};let t=new s(e);chai.expect(t.node).to.be.equal(e),chai.expect(t.protoListeners).to.be.eql({}),chai.expect(t.propListeners).to.be.eql({}),chai.expect(t.addedListeners).to.be.eql({}),chai.expect(t.isEventTarget).to.be.eql(!1);const n=document.createElement("div");t=new s(n),chai.expect(t.node).to.be.equal(n),chai.expect(t.protoListeners).to.be.eql({}),chai.expect(t.propListeners).to.be.eql({}),chai.expect(t.addedListeners).to.be.eql({}),chai.expect(t.isEventTarget).to.be.equal(!0)})),it("Should initialize listeners from ProtoChain",(()=>{let e=new IoNode1,t=new s(e);chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1]]}),e=new IoNode2,t=new s(e),chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1]],event2:[[e.handler2,{capture:!0}]]}),e=new IoNode3,t=new s(e),chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler3]],event2:[[handlerFunction,{passive:!0}]],event3:[[handlerFunction]]})})),it("Should set property listeners correctly",(()=>{const e=new IoNode2,t=new s(e),handler4=()=>{},handler5=()=>{};t.applyPropListeners({"on-event3":"handler3","on-event4":handler4}),chai.expect(t.propListeners).to.be.eql({event3:[[e.handler3]],event4:[[handler4]]}),t.applyPropListeners({"on-event5":["handler3"],"on-event6":[handler4]}),chai.expect(t.propListeners).to.be.eql({event5:[[e.handler3]],event6:[[handler4]]}),t.applyPropListeners({"on-event7":[e.handler3,{capture:!0}],"on-event8":[handler5,{capture:!0}]}),chai.expect(t.propListeners).to.be.eql({event7:[[e.handler3,{capture:!0}]],event8:[[handler5,{capture:!0}]]}),t.applyPropListeners({}),chai.expect(t.propListeners).to.be.eql({})})),it("Should add/remove listeners correctly",(()=>{const e=new IoNode2,t=new s(e),listener1=()=>{},listener2=()=>{};t.addEventListener("event1",listener1),t.addEventListener("event1",listener2,{capture:!0}),chai.expect(t.addedListeners).to.be.eql({event1:[[listener1],[listener2,{capture:!0}]]}),t.removeEventListener("event1",listener1),chai.expect(t.addedListeners).to.be.eql({event1:[[listener2,{capture:!0}]]}),t.removeEventListener("event1"),chai.expect(t.addedListeners).to.be.eql({})})),it("Should dispatch added events",(()=>{const e=new IoNode2,t=new s(e);let n=0;const handler4=()=>{n++};let o=0;const handler5=()=>{o++};t.applyPropListeners({"on-event3":"handler3","on-event4":handler4}),t.addEventListener("event5",handler5),t.dispatchEvent("event1"),t.dispatchEvent("event2"),t.dispatchEvent("event3"),t.dispatchEvent("event4"),t.dispatchEvent("event5"),chai.expect(e.handler1Count).to.be.equal(1),chai.expect(e.handler2Count).to.be.equal(1),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(1),chai.expect(o).to.be.equal(1),t.applyPropListeners({"on-event4":handler4}),t.removeEventListener("event5",handler5),t.dispatchEvent("event1"),t.dispatchEvent("event2"),t.dispatchEvent("event3"),t.dispatchEvent("event4"),t.dispatchEvent("event5"),chai.expect(e.handler1Count).to.be.equal(2),chai.expect(e.handler2Count).to.be.equal(2),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(2),chai.expect(o).to.be.equal(1)})),it("Should dispatch events with correct event detail",(()=>{const e=new IoNode2,t=new s(e);let n;let o;t.applyPropListeners({"on-event3":"handler3","on-event4":e=>{n=e.detail}}),t.addEventListener("event5",(e=>{o=e.detail})),t.dispatchEvent("event1","detail1"),t.dispatchEvent("event2","detail2"),t.dispatchEvent("event3","detail3"),t.dispatchEvent("event4","detail4"),t.dispatchEvent("event5","detail5"),chai.expect(e.handler1Detail).to.be.equal("detail1"),chai.expect(e.handler2Detail).to.be.equal("detail2"),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(o).to.be.equal("detail5")})),it("Should add/remove/dispatch events on HTML elements",(()=>{const e=document.createElement("test-div-event-dispatch"),t=new s(e);let n,o=0;let a,i=0;const handler5=e=>{i++,a=e.detail};t.applyPropListeners({"on-event3":"handler3","on-event4":e=>{o++,n=e.detail}}),t.addEventListener("event5",handler5),e.dispatchEvent(new CustomEvent("event3",{detail:"detail3"})),e.dispatchEvent(new CustomEvent("event4",{detail:"detail4"})),e.dispatchEvent(new CustomEvent("event5",{detail:"detail5"})),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(o).to.be.equal(1),chai.expect(i).to.be.equal(1),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(a).to.be.equal("detail5"),t.applyPropListeners({}),t.removeEventListener("event5",handler5),e.dispatchEvent(new CustomEvent("event3",{detail:"detail3i"})),e.dispatchEvent(new CustomEvent("event4",{detail:"detail4i"})),e.dispatchEvent(new CustomEvent("event5",{detail:"detail5i"})),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(o).to.be.equal(1),chai.expect(i).to.be.equal(1),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(a).to.be.equal("detail5")})),it("Should bubble events if specified",(()=>{const e=document.createElement("test-div-event-dispatch"),t=document.createElement("test-div-event-dispatch");t.appendChild(e);const n=new s(e);let o=0;t.addEventListener("event",(()=>{o++})),n.dispatchEvent("event",null,!1),chai.expect(o).to.be.equal(0),n.dispatchEvent("event",null,!0),chai.expect(o).to.be.equal(1),n.dispatchEvent("event"),chai.expect(o).to.be.equal(2)})),it("Should emit event from specified target",(()=>{const e=document.createElement("div"),t=new s(e),n=document.createElement("test-div-event-dispatch"),o=new s(n);o.applyPropListeners({"on-event3":"handler3"});let a=null,i=null;o.addEventListener("event3",(e=>{a=e.path,i=e.target})),t.dispatchEvent("event3","detail",!1,n),chai.expect(n.handler3Detail).to.be.equal("detail"),chai.expect(a).to.be.eql([n]),chai.expect(i).to.be.eql(i)})),it("Should dispose correctly",(()=>{const e=new IoNode2,t=new s(e);t.dispose(),chai.expect(t.node).to.be.equal(void 0),chai.expect(t.protoListeners).to.be.equal(void 0),chai.expect(t.propListeners).to.be.equal(void 0),chai.expect(t.addedListeners).to.be.equal(void 0)}))}))}}class FakeIoNode{connected=!0;prop1ChangeCounter=0;prop1Change;prop2ChangeCounter=0;prop2Change;changeCounter=0;eventDispatchCounter=0;eventName;eventChange;eventRegister=[];changeRegister=[];prop1Changed(e){this.prop1Change=e,this.prop1ChangeCounter++,this.changeRegister.push("prop1Changed")}prop2Changed(e){this.prop2Change=e,this.prop2ChangeCounter++,this.changeRegister.push("prop2Changed")}dispatchEvent(e,t){this.eventDispatchCounter++,this.eventName=e,this.eventChange=t,this.eventRegister.push(e)}changed(){this.changeCounter++}}class ChangeQueue{run(){describe("ChangeQueue",(()=>{it("Should initialize with correct default values",(()=>{const e=new FakeIoNode,t=new p(e);chai.expect(t.node).to.be.equal(e),chai.expect(JSON.stringify(t.changes)).to.be.equal("[]"),chai.expect(t.changes.length).to.be.equal(0),chai.expect(t.dispatching).to.be.equal(!1)})),it("Should dispatch change events with correct payloads",(()=>{const e=new FakeIoNode,t=new p(e);t.queue("test",1,0),t.queue("test",2,1),chai.expect(t.changes.length).to.be.equal(1),t.dispatch(),chai.expect(t.changes.length).to.be.equal(0),chai.expect(e.eventName).to.be.equal("test-changed"),chai.expect(e.eventChange?.property).to.be.equal("test"),chai.expect(e.eventChange?.value).to.be.equal(2),chai.expect(e.eventChange?.oldValue).to.be.equal(0),chai.expect(e.eventDispatchCounter).to.be.equal(1),chai.expect(e.changeCounter).to.be.equal(1),t.queue("test2",0,-1),t.queue("test3",2,1),chai.expect(t.changes.length).to.be.equal(2),t.dispatch(),chai.expect(t.changes.length).to.be.equal(0),chai.expect(e.eventName).to.be.equal("test3-changed"),chai.expect(e.eventChange?.property).to.be.equal("test3"),chai.expect(e.eventChange?.value).to.be.equal(2),chai.expect(e.eventChange?.oldValue).to.be.equal(1),chai.expect(e.eventDispatchCounter).to.be.equal(3),chai.expect(e.prop1ChangeCounter).to.be.equal(0),chai.expect(e.changeCounter).to.be.equal(2)})),it("Should invoke handler functions with correct payloads",(()=>{const e=new FakeIoNode,t=new p(e);t.queue("prop1",1,0),t.queue("prop1",2,1),t.dispatch(),chai.expect(e.prop1ChangeCounter).to.be.equal(1),chai.expect(e.changeCounter).to.be.equal(1),chai.expect(e.prop1Change?.property).to.be.equal("prop1"),chai.expect(e.prop1Change?.value).to.be.equal(2),chai.expect(e.prop1Change?.oldValue).to.be.equal(0)})),it("Should handle changes in first-in, first-out (FIFO) order",(()=>{const e=new FakeIoNode,t=new p(e);t.queue("prop1",1,0),t.queue("prop1",3,0),t.queue("prop2",2,0),t.dispatch(),chai.expect(JSON.stringify(e.changeRegister)).to.be.equal('["prop1Changed","prop2Changed"]'),chai.expect(JSON.stringify(e.eventRegister)).to.be.equal('["prop1-changed","prop2-changed"]')})),it("Should skip dispatch if value is same as oldValue",(()=>{const e=new FakeIoNode,t=new p(e);t.queue("prop1",0,0),t.dispatch(),chai.expect(e.prop1ChangeCounter).to.be.equal(0)})),it("Should dispose correctly",(()=>{const e=new FakeIoNode,t=new p(e);t.dispose(),chai.expect(t.node).to.be.equal(void 0),chai.expect(t.changes).to.be.equal(void 0)}))}))}}mocha.setup("bdd");const h=document.createElement("div");h.setAttribute("id","mocha"),document.body.appendChild(h),h.style.display="none";let u=!1;class IoTest extends n{static get Style(){return"\n      :host #mocha {\n        margin: 0;\n        position: relative;\n      }\n      :host #mocha-report {\n        margin: 2em 1em;\n      }\n      :host #mocha-stats {\n        position: absolute;\n        top: -2em;\n        right: 2em;\n        font-size: 12px;\n        margin: 0;\n      }\n      :host #mocha-stats em {\n        color: var(--io-color);\n      }\n      :host #mocha-stats li {\n        padding: 0;\n      }\n      :host #mocha-stats .progress {\n        display: none;\n      }\n      :host #mocha-stats .passes {\n        color: #0c0;\n      }\n      :host #mocha-stats .failures {\n        color: #f00;\n        font-weight: bold;\n      }\n      :host h2 {\n        padding-right: 2em;\n      }\n      :host .replay {\n        display: none !important;\n      }\n    "}connectedCallback(){super.connectedCallback(),function runTests(){u||((new ProtoChain).run(),(new Property).run(),(new Binding).run(),(new EventDispatcher).run(),(new ChangeQueue).run(),mocha.checkLeaks(),mocha.run(),u=!0)}(),this.appendChild(h),h.style.display="block"}disconnectedCallback(){super.disconnectedCallback(),document.body.appendChild(h),h.style.display="none"}}d(IoTest);export{IoTest};
