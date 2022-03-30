import{IoNodeMixin,ProtoChain as ProtoChain$1,IoNode,IoElement,RegisterIoNode,PropertyDefinition,Property as Property$1,Binding,assignPropertyDefinition,EventDispatcher as EventDispatcher$1,RegisterIoElement}from"./iogui.js";class Array1 extends Array{}class Array2 extends Array1{}class Array3 extends Array2{}class Object1$1{}class Object2 extends Object1$1{}class Object3 extends Object2{}class HTMLElement1 extends HTMLElement{}class HTMLElement2 extends HTMLElement1{}class HTMLElement3 extends HTMLElement2{}class IoNode1$1 extends IoNode{}class IoElement1 extends IoElement{}class IoNode2$1 extends IoNodeMixin(Object3){}class FakeIoNode1{static get Properties(){return{prop1:{notify:!1}}}static get Listeners(){return{listener1:"function1",listener2:"",listener3:["_function1",{capture:!0}],listener4:()=>{}}}static get Style(){return"a"}function1(){}onFunction1(){}_function1(){}}class FakeIoNode2 extends FakeIoNode1{function2(){}onFunction2(){}_function2(){}static get Properties(){return{prop1:{observe:!0},prop2:{}}}static get Listeners(){return{listener1:"_function2",listener2:["function2",{capture:!0,passive:!0}],listener3:["_function1",{passive:!0}]}}static get Style(){return"b"}}class FakeIoNode3 extends FakeIoNode2{}class ProtoChain{run(){describe("ProtoChain",()=>{it("Should include an array of inherited class constructors",()=>{var e=new ProtoChain$1(Array3).constructors;chai.expect(e).to.be.eql([Array3,Array2,Array1]),e=new ProtoChain$1(Object3).constructors,chai.expect(e).to.be.eql([Object3,Object2,Object1$1]),e=new ProtoChain$1(HTMLElement3).constructors,chai.expect(e).to.be.eql([HTMLElement3,HTMLElement2,HTMLElement1]),e=new ProtoChain$1(IoNode1$1).constructors,chai.expect(e).to.be.eql([IoNode1$1,IoNode]),e=new ProtoChain$1(IoElement1).constructors,chai.expect(e).to.be.eql([IoElement1,IoElement]),e=new ProtoChain$1(IoNode2$1).constructors,chai.expect(e).to.be.eql([IoNode2$1])}),it('Should include an rray of function names that start with "on" or "_" for auto-binding',()=>{var e=new ProtoChain$1(IoNode1$1);chai.expect(e.functions).to.be.eql([]),e=new ProtoChain$1(FakeIoNode1),chai.expect(e.functions).to.be.eql(["onFunction1","_function1"]),e=new ProtoChain$1(FakeIoNode2),chai.expect(e.functions).to.be.eql(["onFunction2","_function2","onFunction1","_function1"])}),it("Should bind all auto-binding functions from the `.functions` array with `.bindFunctions(node)` function",()=>{const e=new ProtoChain$1(FakeIoNode2);var t=new FakeIoNode2;e.bindFunctions(t),chai.expect(t.function1.name).to.be.equal("function1"),chai.expect(t.onFunction1.name).to.be.equal("bound onFunction1"),chai.expect(t._function1.name).to.be.equal("bound _function1"),chai.expect(t.function2.name).to.be.equal("function2"),chai.expect(t.onFunction2.name).to.be.equal("bound onFunction2"),chai.expect(t._function2.name).to.be.equal("bound _function2")}),it("Should include all property definitions declared in `static get Properties()` return oject",()=>{var e=new ProtoChain$1(FakeIoNode1);chai.expect(Object.keys(e.properties)).to.be.eql(["prop1"]),chai.expect(e.properties).to.be.eql({prop1:{value:void 0,type:void 0,binding:void 0,notify:!1,reflect:0,observe:!1}}),e=new ProtoChain$1(FakeIoNode2),chai.expect(Object.keys(e.properties)).to.be.eql(["prop1","prop2"]),chai.expect(e.properties).to.be.eql({prop1:{value:void 0,type:void 0,binding:void 0,notify:!1,reflect:0,observe:!0},prop2:{value:void 0,type:void 0,binding:void 0,notify:!0,reflect:0,observe:!1}})}),it("Should include all listner definitions declared in `static get Listeners()` return oject",()=>{var e=new ProtoChain$1(FakeIoNode1);chai.expect(Object.keys(e.listeners)).to.be.eql(["listener1","listener3","listener4"]),chai.expect(e.listeners.listener1).to.be.eql([["function1"]]),chai.expect(e.listeners.listener3).to.be.eql([["_function1",{capture:!0}]]),chai.expect(String(e.listeners.listener4)).to.be.eql(String([[()=>{}]])),e=new ProtoChain$1(FakeIoNode2),chai.expect(Object.keys(e.listeners)).to.be.eql(["listener1","listener3","listener4","listener2"]),chai.expect(e.listeners.listener1).to.be.eql([["function1"],["_function2"]]),chai.expect(e.listeners.listener2).to.be.eql([["function2",{capture:!0,passive:!0}]]),chai.expect(e.listeners.listener3).to.be.eql([["_function1",{capture:!0,passive:!0}]]),chai.expect(String(e.listeners.listener4)).to.be.eql(String([[()=>{}]]))}),it("Should include all style strings declared in `static get Style()` return string",()=>{var e=new ProtoChain$1(FakeIoNode1);chai.expect(e.style).to.be.equal("a\n"),e=new ProtoChain$1(FakeIoNode2),chai.expect(e.style).to.be.equal("a\nb\n"),e=new ProtoChain$1(FakeIoNode3),chai.expect(e.style).to.be.equal("a\nb\n")}),it("Should include all property names of observed object properties",()=>{var e=new ProtoChain$1(FakeIoNode1);chai.expect(e.observedObjects).to.be.eql([]),e=new ProtoChain$1(FakeIoNode2),chai.expect(e.observedObjects).to.be.eql(["prop1"])})})}}class Object1{prop=!0}class TestIoNode extends IoNode{static get Properties(){return{label:""}}}RegisterIoNode(TestIoNode);class Property{run(){describe("Property",()=>{it("Should initialize correct property definitions and values from weakly typed property definitions",()=>{var e=new PropertyDefinition({}),t=new Property$1(e),n=(chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(null),t=new Property$1(e),chai.expect(e).to.be.eql(t).to.be.eql({value:null,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(void 0),t=new Property$1(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(Number),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:0,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({type:Number}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:0,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(1),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:1,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({value:2}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:2,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(String),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({type:String}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition("test"),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"test",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({value:"test"}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"test",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(Boolean),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!1,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({type:Boolean}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!1,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(!0),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!0,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({value:!0}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!0,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(Object),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({type:Object}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),{prop:!0}),n=(e=new PropertyDefinition({value:n}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{prop:!0},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(n),chai.expect(t.value).not.to.equal(n),e=new PropertyDefinition(Array),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({type:Array}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition(Object1),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:new Object1,type:Object1,binding:void 0,reflect:0,notify:!0,observe:!1}),[1,2,3]),n=(e=new PropertyDefinition({value:n}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[1,2,3],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(n),chai.expect(t.value).not.to.equal(n),new Object1);e=new PropertyDefinition({value:n}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:new Object1,type:Object1,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(n),chai.expect(t.value).not.to.equal(n),e=new PropertyDefinition({type:Object1}),t=new Property$1(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{prop:!0},type:Object1,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new PropertyDefinition({reflect:-1,notify:!1,observe:!0}),t=new Property$1(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:-1,notify:!1,observe:!0})}),it("Should initialize properties with binding correctly",()=>{var e=new Binding(new TestIoNode({label:"lorem"}),"label"),t=new PropertyDefinition(e),n=new Property$1(t);chai.expect(t).to.be.eql(n).to.be.eql({value:"lorem",type:String,binding:e,reflect:0,notify:!0,observe:!1}),e=new Binding(new TestIoNode({label:"lorem"}),"label"),t=new PropertyDefinition({binding:e,value:"ipsum"}),n=new Property$1(t),chai.expect(t).to.be.eql(n).to.be.eql({value:"lorem",type:String,binding:e,reflect:0,notify:!0,observe:!1})}),it("Should assign property definitions correctly",()=>{var e=new Binding(new TestIoNode({label:"lorem"}),"label"),t=new PropertyDefinition({}),n=new PropertyDefinition({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0});assignPropertyDefinition(t,n),chai.expect(t).to.be.eql(n),t=new PropertyDefinition({}),n=new PropertyDefinition({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0}),assignPropertyDefinition(n,t),chai.expect(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(n).to.be.eql({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0})})})}}const handlerFunction=()=>{};class IoNode1 extends IoNode{handler1Count=0;handler1Detail;static get Listeners(){return{event1:"handler1"}}handler1(e){this.handler1Count++,this.handler1Detail=e.detail}}RegisterIoNode(IoNode1);class IoNode2 extends IoNode1{handler2Count=0;handler3Count=0;handler2Detail;handler3Detail;static get Listeners(){return{event2:["handler2",{capture:!0}]}}handler2(e){this.handler2Count++,this.handler2Detail=e.detail}handler3(e){this.handler3Count++,this.handler3Detail=e.detail}}RegisterIoNode(IoNode2);class IoNode3 extends IoNode2{static get Listeners(){return{event1:"handler3",event2:[handlerFunction,{passive:!0}],event3:handlerFunction}}}RegisterIoNode(IoNode3);class TestDivEventDispatchElement extends HTMLElement{handler3Count=0;handler3Detail;handler3(e){this.handler3Count++,this.handler3Detail=e.detail}}window.customElements.define("test-div-event-dispatch",TestDivEventDispatchElement);class EventDispatcher{run(){describe("EventDispatcher",()=>{it("Should initialize with correct values",()=>{var e={},t=new EventDispatcher$1(e),e=(chai.expect(t.node).to.be.equal(e),chai.expect(t.protoListeners).to.be.eql({}),chai.expect(t.propListeners).to.be.eql({}),chai.expect(t.addedListeners).to.be.eql({}),chai.expect(t.isEventTarget).to.be.eql(!1),document.createElement("div")),t=new EventDispatcher$1(e);chai.expect(t.node).to.be.equal(e),chai.expect(t.protoListeners).to.be.eql({}),chai.expect(t.propListeners).to.be.eql({}),chai.expect(t.addedListeners).to.be.eql({}),chai.expect(t.isEventTarget).to.be.equal(!0)}),it("Should initialize listeners from ProtoChain",()=>{var e=new IoNode1,t=new EventDispatcher$1(e);chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1]]}),e=new IoNode2,t=new EventDispatcher$1(e),chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1]],event2:[[e.handler2,{capture:!0}]]}),e=new IoNode3,t=new EventDispatcher$1(e),chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1],[e.handler3]],event2:[[e.handler2,{capture:!0}],[handlerFunction,{passive:!0}]],event3:[[handlerFunction]]})}),it("Should set property listeners correctly",()=>{var e=new IoNode2;const t=new EventDispatcher$1(e);var n=()=>{},o=()=>{};t.applyPropListeners({"on-event3":"handler3","on-event4":n}),chai.expect(t.propListeners).to.be.eql({event3:[[e.handler3]],event4:[[n]]}),t.applyPropListeners({"on-event5":["handler3"],"on-event6":[n]}),chai.expect(t.propListeners).to.be.eql({event5:[[e.handler3]],event6:[[n]]}),t.applyPropListeners({"on-event7":[e.handler3,{capture:!0}],"on-event8":[o,{capture:!0}]}),chai.expect(t.propListeners).to.be.eql({event7:[[e.handler3,{capture:!0}]],event8:[[o,{capture:!0}]]}),t.applyPropListeners({}),chai.expect(t.propListeners).to.be.eql({})}),it("Should add/remove listeners correctly",()=>{var e=new IoNode2;const t=new EventDispatcher$1(e);var e=()=>{},n=()=>{};t.addEventListener("event1",e),t.addEventListener("event1",n,{capture:!0}),chai.expect(t.addedListeners).to.be.eql({event1:[[e],[n,{capture:!0}]]}),t.removeEventListener("event1",e),chai.expect(t.addedListeners).to.be.eql({event1:[[n,{capture:!0}]]}),t.removeEventListener("event1"),chai.expect(t.addedListeners).to.be.eql({})}),it("Should dispatch added events",()=>{var e=new IoNode2;const t=new EventDispatcher$1(e);let n=0;var o=()=>{n++};let i=0;var r=()=>{i++};t.applyPropListeners({"on-event3":"handler3","on-event4":o}),t.addEventListener("event5",r),t.dispatchEvent("event1"),t.dispatchEvent("event2"),t.dispatchEvent("event3"),t.dispatchEvent("event4"),t.dispatchEvent("event5"),chai.expect(e.handler1Count).to.be.equal(1),chai.expect(e.handler2Count).to.be.equal(1),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(1),chai.expect(i).to.be.equal(1),t.applyPropListeners({"on-event4":o}),t.removeEventListener("event5",r),t.dispatchEvent("event1"),t.dispatchEvent("event2"),t.dispatchEvent("event3"),t.dispatchEvent("event4"),t.dispatchEvent("event5"),chai.expect(e.handler1Count).to.be.equal(2),chai.expect(e.handler2Count).to.be.equal(2),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(2),chai.expect(i).to.be.equal(1)}),it("Should dispatch events with correct event detail",()=>{var e=new IoNode2;const t=new EventDispatcher$1(e);let n;let o;t.applyPropListeners({"on-event3":"handler3","on-event4":e=>{n=e.detail}}),t.addEventListener("event5",e=>{o=e.detail}),t.dispatchEvent("event1","detail1"),t.dispatchEvent("event2","detail2"),t.dispatchEvent("event3","detail3"),t.dispatchEvent("event4","detail4"),t.dispatchEvent("event5","detail5"),chai.expect(e.handler1Detail).to.be.equal("detail1"),chai.expect(e.handler2Detail).to.be.equal("detail2"),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(o).to.be.equal("detail5")}),it("Should add/remove/dispatch events on HTML elements",()=>{const e=document.createElement("test-div-event-dispatch"),t=new EventDispatcher$1(e);let n=0,o;let i=0,r;var a=e=>{i++,r=e.detail};t.applyPropListeners({"on-event3":"handler3","on-event4":e=>{n++,o=e.detail}}),t.addEventListener("event5",a),e.dispatchEvent(new CustomEvent("event3",{detail:"detail3"})),e.dispatchEvent(new CustomEvent("event4",{detail:"detail4"})),e.dispatchEvent(new CustomEvent("event5",{detail:"detail5"})),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(1),chai.expect(i).to.be.equal(1),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(o).to.be.equal("detail4"),chai.expect(r).to.be.equal("detail5"),t.applyPropListeners({}),t.removeEventListener("event5",a),e.dispatchEvent(new CustomEvent("event3",{detail:"detail3i"})),e.dispatchEvent(new CustomEvent("event4",{detail:"detail4i"})),e.dispatchEvent(new CustomEvent("event5",{detail:"detail5i"})),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(1),chai.expect(i).to.be.equal(1),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(o).to.be.equal("detail4"),chai.expect(r).to.be.equal("detail5")}),it("Should bubble events if specified",()=>{}),it("Should emit event from specified target",()=>{var e=document.createElement("div");const t=new EventDispatcher$1(e);e=document.createElement("test-div-event-dispatch");const n=new EventDispatcher$1(e);n.applyPropListeners({"on-event3":"handler3"});let o=null,i=null;n.addEventListener("event3",e=>{o=e.path,i=e.target}),t.dispatchEvent("event3","detail",!1,e),chai.expect(e.handler3Detail).to.be.equal("detail"),chai.expect(o).to.be.eql([e]),chai.expect(i).to.be.eql(i)}),it("Should dispose correctly",()=>{var e=new IoNode2;const t=new EventDispatcher$1(e);t.dispose(),chai.expect(t.node).to.be.equal(void 0),chai.expect(t.protoListeners).to.be.equal(void 0),chai.expect(t.propListeners).to.be.equal(void 0),chai.expect(t.addedListeners).to.be.equal(void 0)})})}}mocha.setup("bdd");const mochaDiv=document.createElement("div");mochaDiv.setAttribute("id","mocha"),document.body.appendChild(mochaDiv);let testCompleted=!(mochaDiv.style.display="none");function runTests(){testCompleted||((new ProtoChain).run(),(new Property).run(),(new EventDispatcher).run(),mocha.checkLeaks(),mocha.run(),testCompleted=!0)}class IoTest extends IoElement{static get Style(){return`
      :host #mocha {
        margin: 0;
        position: relative;
      }
      :host #mocha-report {
        margin: 2em 1em;
      }
      :host #mocha-stats {
        position: absolute;
        top: -2em;
        right: 2em;
        font-size: 12px;
        margin: 0;
      }
      :host #mocha-stats em {
        color: var(--io-color);
      }
      :host #mocha-stats li {
        padding: 0;
      }
      :host #mocha-stats .progress {
        display: none;
      }
      :host #mocha-stats .passes {
        color: #0c0;
      }
      :host #mocha-stats .failures {
        color: #f00;
        font-weight: bold;
      }
      :host h2 {
        padding-right: 2em;
      }
      :host .replay {
        display: none !important;
      }
    `}connectedCallback(){super.connectedCallback(),runTests(),this.appendChild(mochaDiv),mochaDiv.style.display="block"}disconnectedCallback(){super.disconnectedCallback(),document.body.appendChild(mochaDiv),mochaDiv.style.display="none"}}RegisterIoElement(IoTest);export{IoTest};
