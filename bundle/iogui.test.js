import{IoNodeMixin as e,ProtoChain as t,IoNode as n,IoElement as i,RegisterIoNode as o,PropertyDefinition as a,Property as c,Binding as l,assignPropertyDefinition as s,EventDispatcher as r,ChangeQueue as p,RegisterIoElement as d}from"./iogui.js";class h extends Array{}class u extends h{}class v extends u{}class b{}class q extends b{}class x extends q{}class g extends HTMLElement{}class y extends g{}class w extends y{}class f extends n{}class m extends i{}class C extends(e(x)){}class E{static get Properties(){return{prop1:{notify:!1}}}static get Listeners(){return{listener1:"function1",listener2:"",listener3:["_function1",{capture:!0}],listener4:()=>{}}}static get Style(){return"a"}function1(){}onFunction1(){}_function1(){}}class L extends E{function2(){}onFunction2(){}_function2(){}static get Properties(){return{prop1:{observe:!0},prop2:{}}}static get Listeners(){return{listener1:"_function2",listener2:["function2",{capture:!0,passive:!0}],listener3:["_function1",{passive:!0}]}}static get Style(){return"b"}}class S extends L{}class D{run(){describe("ProtoChain",(()=>{it("Should include an array of inherited class constructors",(()=>{let e=new t(v).constructors;chai.expect(e).to.be.eql([v,u,h]),e=new t(x).constructors,chai.expect(e).to.be.eql([x,q,b]),e=new t(w).constructors,chai.expect(e).to.be.eql([w,y,g]),e=new t(f).constructors,chai.expect(e).to.be.eql([f,n]),e=new t(m).constructors,chai.expect(e).to.be.eql([m,i]),e=new t(C).constructors,chai.expect(e).to.be.eql([C])})),it('Should include an rray of function names that start with "on" or "_" for auto-binding',(()=>{let e=new t(f);chai.expect(e.functions).to.be.eql([]),e=new t(E),chai.expect(e.functions).to.be.eql(["onFunction1","_function1"]),e=new t(L),chai.expect(e.functions).to.be.eql(["onFunction2","_function2","onFunction1","_function1"])})),it("Should bind all auto-binding functions from the `.functions` array with `.bindFunctions(node)` function",(()=>{const e=new t(L),n=new L;e.bindFunctions(n),chai.expect(n.function1.name).to.be.equal("function1"),chai.expect(n.onFunction1.name).to.be.equal("bound onFunction1"),chai.expect(n._function1.name).to.be.equal("bound _function1"),chai.expect(n.function2.name).to.be.equal("function2"),chai.expect(n.onFunction2.name).to.be.equal("bound onFunction2"),chai.expect(n._function2.name).to.be.equal("bound _function2")})),it("Should include all property definitions declared in `static get Properties()` return oject",(()=>{let e=new t(E);chai.expect(Object.keys(e.properties)).to.be.eql(["prop1"]),chai.expect(e.properties).to.be.eql({prop1:{value:void 0,type:void 0,binding:void 0,notify:!1,reflect:0,observe:!1}}),e=new t(L),chai.expect(Object.keys(e.properties)).to.be.eql(["prop1","prop2"]),chai.expect(e.properties).to.be.eql({prop1:{value:void 0,type:void 0,binding:void 0,notify:!1,reflect:0,observe:!0},prop2:{value:void 0,type:void 0,binding:void 0,notify:!0,reflect:0,observe:!1}})})),it("Should include all listner definitions declared in `static get Listeners()` return oject",(()=>{let e=new t(E);chai.expect(Object.keys(e.listeners)).to.be.eql(["listener1","listener3","listener4"]),chai.expect(e.listeners.listener1).to.be.eql([["function1"]]),chai.expect(e.listeners.listener3).to.be.eql([["_function1",{capture:!0}]]),chai.expect(String(e.listeners.listener4)).to.be.eql(String([[()=>{}]])),e=new t(L),chai.expect(Object.keys(e.listeners)).to.be.eql(["listener1","listener3","listener4","listener2"]),chai.expect(e.listeners.listener1).to.be.eql([["function1"],["_function2"]]),chai.expect(e.listeners.listener2).to.be.eql([["function2",{capture:!0,passive:!0}]]),chai.expect(e.listeners.listener3).to.be.eql([["_function1",{capture:!0,passive:!0}]]),chai.expect(String(e.listeners.listener4)).to.be.eql(String([[()=>{}]]))})),it("Should include all style strings declared in `static get Style()` return string",(()=>{let e=new t(E);chai.expect(e.style).to.be.equal("a\n"),e=new t(L),chai.expect(e.style).to.be.equal("a\nb\n"),e=new t(S),chai.expect(e.style).to.be.equal("a\nb\n")})),it("Should include all property names of observed object properties",(()=>{let e=new t(E);chai.expect(e.observedObjects).to.be.eql([]),e=new t(L),chai.expect(e.observedObjects).to.be.eql(["prop1"])}))}))}}class P{prop=!0}class _ extends n{static get Properties(){return{label:""}}}o(_);class j{run(){describe("Property",(()=>{it("Should initialize correct property definitions and values from weakly typed property definitions",(()=>{let e,t;e=new a({}),t=new c(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(null),t=new c(e),chai.expect(e).to.be.eql(t).to.be.eql({value:null,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(void 0),t=new c(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Number),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:0,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Number}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:0,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(1),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:1,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({value:2}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:2,type:Number,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(String),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:String}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a("test"),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"test",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({value:"test"}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:"test",type:String,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Boolean),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!1,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Boolean}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!1,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(!0),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!0,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({value:!0}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:!0,type:Boolean,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(Object),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Object}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1});const n={prop:!0};e=new a({value:n}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{prop:!0},type:Object,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(n),chai.expect(t.value).not.to.equal(n),e=new a(Array),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({type:Array}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a(P),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:new P,type:P,binding:void 0,reflect:0,notify:!0,observe:!1});const i=[1,2,3];e=new a({value:i}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:[1,2,3],type:Array,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(i),chai.expect(t.value).not.to.equal(i);const o=new P;e=new a({value:o}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:new P,type:P,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(e.value).to.equal(o),chai.expect(t.value).not.to.equal(o),e=new a({type:P}),t=new c(e),chai.expect(t).to.be.eql(e).to.be.eql({value:{prop:!0},type:P,binding:void 0,reflect:0,notify:!0,observe:!1}),e=new a({reflect:-1,notify:!1,observe:!0}),t=new c(e),chai.expect(e).to.be.eql(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:-1,notify:!1,observe:!0})})),it("Should initialize properties with binding correctly",(()=>{let e,t,n=new l(new _({label:"lorem"}),"label");e=new a(n),t=new c(e),chai.expect(e).to.be.eql(t).to.be.eql({value:"lorem",type:String,binding:n,reflect:0,notify:!0,observe:!1}),n=new l(new _({label:"lorem"}),"label"),e=new a({binding:n,value:"ipsum"}),t=new c(e),chai.expect(e).to.be.eql(t).to.be.eql({value:"lorem",type:String,binding:n,reflect:0,notify:!0,observe:!1})})),it("Should assign property definitions correctly",(()=>{const e=new l(new _({label:"lorem"}),"label");let t=new a({}),n=new a({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0});s(t,n),chai.expect(t).to.be.eql(n),t=new a({}),n=new a({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0}),s(n,t),chai.expect(t).to.be.eql({value:void 0,type:void 0,binding:void 0,reflect:0,notify:!0,observe:!1}),chai.expect(n).to.be.eql({value:"lorem",type:String,binding:e,reflect:2,notify:!1,observe:!0})}))}))}}const O=()=>{};class k extends n{handler1Count=0;handler1Detail;static get Listeners(){return{event1:"handler1"}}handler1(e){this.handler1Count++,this.handler1Detail=e.detail}}o(k);class F extends k{handler2Count=0;handler3Count=0;handler2Detail;handler3Detail;static get Listeners(){return{event2:["handler2",{capture:!0}]}}handler2(e){this.handler2Count++,this.handler2Detail=e.detail}handler3(e){this.handler3Count++,this.handler3Detail=e.detail}}o(F);class N extends F{static get Listeners(){return{event1:"handler3",event2:[O,{passive:!0}],event3:O}}}o(N);class A extends HTMLElement{handler3Count=0;handler3Detail;handler3(e){this.handler3Count++,this.handler3Detail=e.detail}}window.customElements.define("test-div-event-dispatch",A);class R{run(){describe("EventDispatcher",(()=>{it("Should initialize with correct values",(()=>{const e={};let t=new r(e);chai.expect(t.node).to.be.equal(e),chai.expect(t.protoListeners).to.be.eql({}),chai.expect(t.propListeners).to.be.eql({}),chai.expect(t.addedListeners).to.be.eql({}),chai.expect(t.isEventTarget).to.be.eql(!1);const n=document.createElement("div");t=new r(n),chai.expect(t.node).to.be.equal(n),chai.expect(t.protoListeners).to.be.eql({}),chai.expect(t.propListeners).to.be.eql({}),chai.expect(t.addedListeners).to.be.eql({}),chai.expect(t.isEventTarget).to.be.equal(!0)})),it("Should initialize listeners from ProtoChain",(()=>{let e=new k,t=new r(e);chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1]]}),e=new F,t=new r(e),chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1]],event2:[[e.handler2,{capture:!0}]]}),e=new N,t=new r(e),chai.expect(t.protoListeners).to.be.eql({event1:[[e.handler1],[e.handler3]],event2:[[e.handler2,{capture:!0}],[O,{passive:!0}]],event3:[[O]]})})),it("Should set property listeners correctly",(()=>{const e=new F,t=new r(e),n=()=>{},i=()=>{};t.applyPropListeners({"on-event3":"handler3","on-event4":n}),chai.expect(t.propListeners).to.be.eql({event3:[[e.handler3]],event4:[[n]]}),t.applyPropListeners({"on-event5":["handler3"],"on-event6":[n]}),chai.expect(t.propListeners).to.be.eql({event5:[[e.handler3]],event6:[[n]]}),t.applyPropListeners({"on-event7":[e.handler3,{capture:!0}],"on-event8":[i,{capture:!0}]}),chai.expect(t.propListeners).to.be.eql({event7:[[e.handler3,{capture:!0}]],event8:[[i,{capture:!0}]]}),t.applyPropListeners({}),chai.expect(t.propListeners).to.be.eql({})})),it("Should add/remove listeners correctly",(()=>{const e=new F,t=new r(e),n=()=>{},i=()=>{};t.addEventListener("event1",n),t.addEventListener("event1",i,{capture:!0}),chai.expect(t.addedListeners).to.be.eql({event1:[[n],[i,{capture:!0}]]}),t.removeEventListener("event1",n),chai.expect(t.addedListeners).to.be.eql({event1:[[i,{capture:!0}]]}),t.removeEventListener("event1"),chai.expect(t.addedListeners).to.be.eql({})})),it("Should dispatch added events",(()=>{const e=new F,t=new r(e);let n=0;const i=()=>{n++};let o=0;const a=()=>{o++};t.applyPropListeners({"on-event3":"handler3","on-event4":i}),t.addEventListener("event5",a),t.dispatchEvent("event1"),t.dispatchEvent("event2"),t.dispatchEvent("event3"),t.dispatchEvent("event4"),t.dispatchEvent("event5"),chai.expect(e.handler1Count).to.be.equal(1),chai.expect(e.handler2Count).to.be.equal(1),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(1),chai.expect(o).to.be.equal(1),t.applyPropListeners({"on-event4":i}),t.removeEventListener("event5",a),t.dispatchEvent("event1"),t.dispatchEvent("event2"),t.dispatchEvent("event3"),t.dispatchEvent("event4"),t.dispatchEvent("event5"),chai.expect(e.handler1Count).to.be.equal(2),chai.expect(e.handler2Count).to.be.equal(2),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(n).to.be.equal(2),chai.expect(o).to.be.equal(1)})),it("Should dispatch events with correct event detail",(()=>{const e=new F,t=new r(e);let n;let i;t.applyPropListeners({"on-event3":"handler3","on-event4":e=>{n=e.detail}}),t.addEventListener("event5",(e=>{i=e.detail})),t.dispatchEvent("event1","detail1"),t.dispatchEvent("event2","detail2"),t.dispatchEvent("event3","detail3"),t.dispatchEvent("event4","detail4"),t.dispatchEvent("event5","detail5"),chai.expect(e.handler1Detail).to.be.equal("detail1"),chai.expect(e.handler2Detail).to.be.equal("detail2"),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(i).to.be.equal("detail5")})),it("Should add/remove/dispatch events on HTML elements",(()=>{const e=document.createElement("test-div-event-dispatch"),t=new r(e);let n,i=0;let o,a=0;const c=e=>{a++,o=e.detail};t.applyPropListeners({"on-event3":"handler3","on-event4":e=>{i++,n=e.detail}}),t.addEventListener("event5",c),e.dispatchEvent(new CustomEvent("event3",{detail:"detail3"})),e.dispatchEvent(new CustomEvent("event4",{detail:"detail4"})),e.dispatchEvent(new CustomEvent("event5",{detail:"detail5"})),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(i).to.be.equal(1),chai.expect(a).to.be.equal(1),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(o).to.be.equal("detail5"),t.applyPropListeners({}),t.removeEventListener("event5",c),e.dispatchEvent(new CustomEvent("event3",{detail:"detail3i"})),e.dispatchEvent(new CustomEvent("event4",{detail:"detail4i"})),e.dispatchEvent(new CustomEvent("event5",{detail:"detail5i"})),chai.expect(e.handler3Count).to.be.equal(1),chai.expect(i).to.be.equal(1),chai.expect(a).to.be.equal(1),chai.expect(e.handler3Detail).to.be.equal("detail3"),chai.expect(n).to.be.equal("detail4"),chai.expect(o).to.be.equal("detail5")})),it("Should bubble events if specified",(()=>{const e=document.createElement("test-div-event-dispatch"),t=document.createElement("test-div-event-dispatch");t.appendChild(e);const n=new r(e);let i=0;t.addEventListener("event",(()=>{i++})),n.dispatchEvent("event",null,!1),chai.expect(i).to.be.equal(0),n.dispatchEvent("event",null,!0),chai.expect(i).to.be.equal(1),n.dispatchEvent("event"),chai.expect(i).to.be.equal(2)})),it("Should emit event from specified target",(()=>{const e=document.createElement("div"),t=new r(e),n=document.createElement("test-div-event-dispatch"),i=new r(n);i.applyPropListeners({"on-event3":"handler3"});let o=null,a=null;i.addEventListener("event3",(e=>{o=e.path,a=e.target})),t.dispatchEvent("event3","detail",!1,n),chai.expect(n.handler3Detail).to.be.equal("detail"),chai.expect(o).to.be.eql([n]),chai.expect(a).to.be.eql(a)})),it("Should dispose correctly",(()=>{const e=new F,t=new r(e);t.dispose(),chai.expect(t.node).to.be.equal(void 0),chai.expect(t.protoListeners).to.be.equal(void 0),chai.expect(t.propListeners).to.be.equal(void 0),chai.expect(t.addedListeners).to.be.equal(void 0)}))}))}}class z{connected=!0;prop1ChangeCounter=0;prop1Change;prop2ChangeCounter=0;prop2Change;changeCounter=0;applyComposeCounter=0;eventDispatchCounter=0;eventName;eventChange;eventRegister=[];changeRegister=[];prop1Changed(e){this.prop1Change=e,this.prop1ChangeCounter++,this.changeRegister.push("prop1Changed")}prop2Changed(e){this.prop2Change=e,this.prop2ChangeCounter++,this.changeRegister.push("prop2Changed")}dispatchEvent(e,t){this.eventDispatchCounter++,this.eventName=e,this.eventChange=t,this.eventRegister.push(e)}changed(){this.changeCounter++}applyCompose(){this.applyComposeCounter++}}class B{run(){describe("ChangeQueue",(()=>{it("Should initialize with correct default values",(()=>{const e=new z,t=new p(e);chai.expect(t.node).to.be.equal(e),chai.expect(JSON.stringify(t.changes)).to.be.equal("[]"),chai.expect(t.changes.length).to.be.equal(0),chai.expect(t.dispatching).to.be.equal(!1)})),it("Should dispatch change events with correct payloads",(()=>{const e=new z,t=new p(e);t.queue("test",1,0),t.queue("test",2,1),chai.expect(t.changes.length).to.be.equal(1),t.dispatch(),chai.expect(t.changes.length).to.be.equal(0),chai.expect(e.eventName).to.be.equal("test-changed"),chai.expect(e.eventChange?.property).to.be.equal("test"),chai.expect(e.eventChange?.value).to.be.equal(2),chai.expect(e.eventChange?.oldValue).to.be.equal(0),chai.expect(e.eventDispatchCounter).to.be.equal(1),chai.expect(e.changeCounter).to.be.equal(1),chai.expect(e.applyComposeCounter).to.be.equal(1),t.queue("test2",0,-1),t.queue("test3",2,1),chai.expect(t.changes.length).to.be.equal(2),t.dispatch(),chai.expect(t.changes.length).to.be.equal(0),chai.expect(e.eventName).to.be.equal("test3-changed"),chai.expect(e.eventChange?.property).to.be.equal("test3"),chai.expect(e.eventChange?.value).to.be.equal(2),chai.expect(e.eventChange?.oldValue).to.be.equal(1),chai.expect(e.eventDispatchCounter).to.be.equal(3),chai.expect(e.prop1ChangeCounter).to.be.equal(0),chai.expect(e.changeCounter).to.be.equal(2),chai.expect(e.applyComposeCounter).to.be.equal(2)})),it("Should invoke handler functions with correct payloads",(()=>{const e=new z,t=new p(e);t.queue("prop1",1,0),t.queue("prop1",2,1),t.dispatch(),chai.expect(e.prop1ChangeCounter).to.be.equal(1),chai.expect(e.changeCounter).to.be.equal(1),chai.expect(e.applyComposeCounter).to.be.equal(1),chai.expect(e.prop1Change?.property).to.be.equal("prop1"),chai.expect(e.prop1Change?.value).to.be.equal(2),chai.expect(e.prop1Change?.oldValue).to.be.equal(0)})),it("Should handle changes in first-in, first-out (FIFO) order",(()=>{const e=new z,t=new p(e);t.queue("prop1",1,0),t.queue("prop1",3,0),t.queue("prop2",2,0),t.dispatch(),chai.expect(JSON.stringify(e.changeRegister)).to.be.equal('["prop1Changed","prop2Changed"]'),chai.expect(JSON.stringify(e.eventRegister)).to.be.equal('["prop1-changed","prop2-changed"]')})),it("Should skip dispatch if value is same as oldValue",(()=>{const e=new z,t=new p(e);t.queue("prop1",0,0),t.dispatch(),chai.expect(e.prop1ChangeCounter).to.be.equal(0)})),it("Should dispose correctly",(()=>{const e=new z,t=new p(e);t.dispose(),chai.expect(t.node).to.be.equal(void 0),chai.expect(t.changes).to.be.equal(void 0)}))}))}}mocha.setup("bdd");const T=document.createElement("div");T.setAttribute("id","mocha"),document.body.appendChild(T),T.style.display="none";let V=!1;class H extends i{static get Style(){return":host #mocha {margin: 0;position: relative;}:host #mocha-report {margin: 2em 1em;}:host #mocha-stats {position: absolute;top: -2em;right: 2em;font-size: 12px;margin: 0;}:host #mocha-stats em {color: var(--io-color);}:host #mocha-stats li {padding: 0;}:host #mocha-stats .progress {display: none;}:host #mocha-stats .passes {color: #0c0;}:host #mocha-stats .failures {color: #f00;font-weight: bold;}:host h2 {padding-right: 2em;}:host .replay {display: none !important;}"}connectedCallback(){super.connectedCallback(),V||((new D).run(),(new j).run(),(new R).run(),(new B).run(),mocha.checkLeaks(),mocha.run(),V=!0),this.appendChild(T),T.style.display="block"}disconnectedCallback(){super.disconnectedCallback(),document.body.appendChild(T),T.style.display="none"}}d(H);export{H as IoTest};
