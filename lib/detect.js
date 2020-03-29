(function(){

function tryEval(code) {
  try {
    eval(code);
    return true;
  } catch (error) {
    return false;
  }
}

const hasClass = (tryEval('class Name {}'));
const hasArrow = (tryEval('const a = b => 1'));
const hasLet = (tryEval('let a = 1'));
const hasConst = (tryEval('const a = 1'));
const hasLiteral = (tryEval('const a = `a`'));
const hasSpread = (tryEval('Math.max(...[0, 1])'));
const hasAsync = (tryEval('async function f () {}'));
const hasCustom = ('customElements' in window);
const hasPointer = ('PointerEvent' in window);

const hasAll = (hasClass && hasArrow && hasLet && hasConst && hasLiteral && hasSpread && hasAsync && hasCustom && hasPointer);

if (!hasAll) {

  const warning = document.createElement('div');
  warning.style.top = 0;
  warning.style.left = 0;
  warning.style.position = "fixed";
  warning.style.width = "100%";
  warning.style.height = "100%";
  warning.style.zIndex = "100";
  warning.style.position = "fixed";
  warning.style.color = "black";
  warning.style.background = "white";
  warning.style.padding = "1em";

  let text = "Sorry, this app cannot run because it requires some of the latest web technologies.<br/><br/>";

  if (!hasClass) text += "Missing browser support for <b>ES6 slasses</b>.<br/>";
  if (!hasArrow) text += "Missing browser support for <b>arrow functions</b>.<br/>";
  if (!hasLet) text += "Missing browser support for <b>let keyword</b>.<br/>";
  if (!hasConst) text += "Missing browser support for <b>const keyword</b>.<br/>";
  if (!hasLiteral) text += "Missing browser support for <b>template literal</b>.<br/>";
  if (!hasSpread) text += "Missing browser support for <b>spread operator</b>.<br/>";
  if (!hasAsync) text += "Missing browser support for <b>async function</b>.<br/>";
  if (!hasCustom) text += "Missing browser support for <b>custom elements</b>.<br/>";
  if (!hasPointer) text += "Missing browser support for <b>pointer events</b>.<br/>";

  text += '<br/>Please try <a target="_blank" href="https://www.mozilla.org/en-US/firefox/new/">Firefox</a>, ';
  text += '<a target="_blank" href="https://www.microsoft.com/en-us/windows/microsoft-edge">Edge 78+</a> or ';
  text += '<a target="_blank" href="https://www.google.com/chrome/">Chrome</a> or ';
  text += '<a target="_blank" href="https://www.apple.com/lae/safari/">Safari 13+</a>.<br/><br/>';

  text += '<a href="#" id="closewarning">Close</a><br/>';

  warning.innerHTML = text;

  setTimeout(function() {
    document.body.appendChild(warning, document.body.children[0]);
    warning.querySelector(['#closewarning']).addEventListener('click', function(){
      document.body.removeChild(warning);
    }.bind(this));
  }, 1000);

}

}());
