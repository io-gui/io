import{RegisterIoElement,IoElement}from"./iogui.js";mocha.setup("bdd");const mochaDiv=document.createElement("div");mochaDiv.setAttribute("id","mocha"),document.body.appendChild(mochaDiv);let testCompleted=!(mochaDiv.style.display="none");function runTests(){testCompleted||(mocha.checkLeaks(),mocha.run(),testCompleted=!0)}class IoElementsTest extends IoElement{static get Style(){return`
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
    `}connectedCallback(){super.connectedCallback(),runTests(),this.appendChild(mochaDiv),mochaDiv.style.display="block"}disconnectedCallback(){super.disconnectedCallback(),document.body.appendChild(mochaDiv),mochaDiv.style.display="none"}}RegisterIoElement(IoElementsTest);export{IoElementsTest};
