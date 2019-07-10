import{IoElement,html}from"./io.js";class IoElementDemo extends IoElement{static get Style(){return html`<style>:host {display: flex;flex-direction: row;border-radius: calc(2 * var(--io-border-radius));border: var(--io-border);overflow: hidden;}:host[overflow] {flex-direction: column;}:host > div {display: flex;flex-direction: column;border: var(--io-border);border-width: 0;}:host > :first-child {flex: 0 1 auto;border-width: 0 var(--io-border-width) 0 0;}:host[overflow] > :first-child {border-width: 0 0 var(--io-border-width) 0;}:host > :nth-child(2) {flex: 1 1 auto;}:host > div > span {font-weight: bold;border: var(--io-border);border-width: 0 0 var(--io-border-width) 0;background: var(--io-background-color-field);padding: var(--io-spacing) calc(4 * var(--io-spacing));}:host > div > io-properties {margin-left: 0.5em;}:host > div > .io-content {display: flex;flex: 1 1 auto;flex-direction: column;align-items: flex-start;min-height: 1.2em;padding: calc(2 * var(--io-spacing));}</style>`}static get Attributes(){return{element:{type:String,reflect:-1,notify:!0},properties:{type:Object,reflect:-1,notify:!0},config:{type:Object,reflect:-1,notify:!0},overflow:!1}}static get Properties(){return{minWidth:640,_properties:Object}}resized(){this.overflow=this.getBoundingClientRect().width<this.minWidth}_onPropSet(e){this.properties[e.detail.property]=e.detail.value,this.dispatchEvent("object-mutated",{object:this.properties,property:e.detail.property,value:e.detail.value,oldValue:e.detail.oldValue},!1,window)}_onObjectMutation(e){super._onObjectMutation(e);for(let t in this.properties)"object"==typeof this.properties[t]&&this._bubbleMutation(this.properties[t],this.properties,e.detail.object)}_bubbleMutation(e,t,i){if(e===i)this.dispatchEvent("object-mutated",{object:t},!1,window);else for(let t in e)"object"==typeof e[t]&&this._bubbleMutation(e[t],e,i)}changed(){for(let e in this.properties)"undefined"===this.properties[e]&&(this.properties[e]=void 0);this.element?this.template([["div",[["span","<"+this.element+">"],["io-properties",{value:this.properties,config:this.config}]]],["div",[["span","RESULT"],["div",{class:"io-content"},[[this.element,Object.assign({"on-value-set":this._onPropSet},this.properties)]]]]]]):this.template([null])}}IoElementDemo.Register(),function(e){var t={newline:/^\n+/,code:/^( {4}[^\n]+\n*)+/,fences:g,hr:/^ {0,3}((?:- *){3,}|(?:_ *){3,}|(?:\* *){3,})(?:\n+|$)/,heading:/^ *(#{1,6}) *([^\n]+?) *(?:#+ *)?(?:\n+|$)/,nptable:g,blockquote:/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/,list:/^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,html:"^ {0,3}(?:<(script|pre|style)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?\\?>\\n*|<![A-Z][\\s\\S]*?>\\n*|<!\\[CDATA\\[[\\s\\S]*?\\]\\]>\\n*|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:\\n{2,}|$)|<(?!script|pre|style)([a-z][\\w-]*)(?:attribute)*? */?>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$)|</(?!script|pre|style)[a-z][\\w-]*\\s*>(?=\\h*\\n)[\\s\\S]*?(?:\\n{2,}|$))",def:/^ {0,3}\[(label)\]: *\n? *<?([^\s>]+)>?(?:(?: +\n? *| *\n *)(title))? *(?:\n+|$)/,table:g,lheading:/^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,paragraph:/^([^\n]+(?:\n(?!hr|heading|lheading| {0,3}>|<\/?(?:tag)(?: +|\n|\/?>)|<(?:script|pre|style|!--))[^\n]+)*)/,text:/^[^\n]+/};function i(e){this.tokens=[],this.tokens.links=Object.create(null),this.options=e||v.defaults,this.rules=t.normal,this.options.pedantic?this.rules=t.pedantic:this.options.gfm&&(this.options.tables?this.rules=t.tables:this.rules=t.gfm)}t._label=/(?!\s*\])(?:\\[\[\]]|[^\[\]])+/,t._title=/(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/,t.def=c(t.def).replace("label",t._label).replace("title",t._title).getRegex(),t.bullet=/(?:[*+-]|\d+\.)/,t.item=/^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/,t.item=c(t.item,"gm").replace(/bull/g,t.bullet).getRegex(),t.list=c(t.list).replace(/bull/g,t.bullet).replace("hr","\\n+(?=\\1?(?:(?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$))").replace("def","\\n+(?="+t.def.source+")").getRegex(),t._tag="address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul",t._comment=/<!--(?!-?>)[\s\S]*?-->/,t.html=c(t.html,"i").replace("comment",t._comment).replace("tag",t._tag).replace("attribute",/ +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(),t.paragraph=c(t.paragraph).replace("hr",t.hr).replace("heading",t.heading).replace("lheading",t.lheading).replace("tag",t._tag).getRegex(),t.blockquote=c(t.blockquote).replace("paragraph",t.paragraph).getRegex(),t.normal=f({},t),t.gfm=f({},t.normal,{fences:/^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\n? *\1 *(?:\n+|$)/,paragraph:/^/,heading:/^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/}),t.gfm.paragraph=c(t.paragraph).replace("(?!","(?!"+t.gfm.fences.source.replace("\\1","\\2")+"|"+t.list.source.replace("\\1","\\3")+"|").getRegex(),t.tables=f({},t.gfm,{nptable:/^ *([^|\n ].*\|.*)\n *([-:]+ *\|[-| :]*)(?:\n((?:.*[^>\n ].*(?:\n|$))*)\n*|$)/,table:/^ *\|(.+)\n *\|?( *[-:]+[-| :]*)(?:\n((?: *[^>\n ].*(?:\n|$))*)\n*|$)/}),t.pedantic=f({},t.normal,{html:c("^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:\"[^\"]*\"|'[^']*'|\\s[^'\"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))").replace("comment",t._comment).replace(/tag/g,"(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(),def:/^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/}),i.rules=t,i.lex=function(e,t){return new i(t).lex(e)},i.prototype.lex=function(e){return e=e.replace(/\r\n|\r/g,"\n").replace(/\t/g,"    ").replace(/\u00a0/g," ").replace(/\u2424/g,"\n"),this.token(e,!0)},i.prototype.token=function(e,i){var s,n,r,o,l,a,h,c,p,u,d,g,f,v,y,_;for(e=e.replace(/^ +$/gm,"");e;)if((r=this.rules.newline.exec(e))&&(e=e.substring(r[0].length),1<r[0].length&&this.tokens.push({type:"space"})),r=this.rules.code.exec(e))e=e.substring(r[0].length),r=r[0].replace(/^ {4}/gm,""),this.tokens.push({type:"code",text:this.options.pedantic?r:m(r,"\n")});else if(r=this.rules.fences.exec(e))e=e.substring(r[0].length),this.tokens.push({type:"code",lang:r[2],text:r[3]||""});else if(r=this.rules.heading.exec(e))e=e.substring(r[0].length),this.tokens.push({type:"heading",depth:r[1].length,text:r[2]});else if(i&&(r=this.rules.nptable.exec(e))&&(a={type:"table",header:b(r[1].replace(/^ *| *\| *$/g,"")),align:r[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:r[3]?r[3].replace(/\n$/,"").split("\n"):[]}).header.length===a.align.length){for(e=e.substring(r[0].length),d=0;d<a.align.length;d++)/^ *-+: *$/.test(a.align[d])?a.align[d]="right":/^ *:-+: *$/.test(a.align[d])?a.align[d]="center":/^ *:-+ *$/.test(a.align[d])?a.align[d]="left":a.align[d]=null;for(d=0;d<a.cells.length;d++)a.cells[d]=b(a.cells[d],a.header.length);this.tokens.push(a)}else if(r=this.rules.hr.exec(e))e=e.substring(r[0].length),this.tokens.push({type:"hr"});else if(r=this.rules.blockquote.exec(e))e=e.substring(r[0].length),this.tokens.push({type:"blockquote_start"}),r=r[0].replace(/^ *> ?/gm,""),this.token(r,i),this.tokens.push({type:"blockquote_end"});else if(r=this.rules.list.exec(e)){for(e=e.substring(r[0].length),h={type:"list_start",ordered:v=1<(o=r[2]).length,start:v?+o:"",loose:!1},this.tokens.push(h),s=!(c=[]),f=(r=r[0].match(this.rules.item)).length,d=0;d<f;d++)u=(a=r[d]).length,~(a=a.replace(/^ *([*+-]|\d+\.) +/,"")).indexOf("\n ")&&(u-=a.length,a=this.options.pedantic?a.replace(/^ {1,4}/gm,""):a.replace(new RegExp("^ {1,"+u+"}","gm"),"")),this.options.smartLists&&d!==f-1&&(o===(l=t.bullet.exec(r[d+1])[0])||1<o.length&&1<l.length||(e=r.slice(d+1).join("\n")+e,d=f-1)),n=s||/\n\n(?!\s*$)/.test(a),d!==f-1&&(s="\n"===a.charAt(a.length-1),n||(n=s)),n&&(h.loose=!0),_=void 0,(y=/^\[[ xX]\] /.test(a))&&(_=" "!==a[1],a=a.replace(/^\[[ xX]\] +/,"")),p={type:"list_item_start",task:y,checked:_,loose:n},c.push(p),this.tokens.push(p),this.token(a,!1),this.tokens.push({type:"list_item_end"});if(h.loose)for(f=c.length,d=0;d<f;d++)c[d].loose=!0;this.tokens.push({type:"list_end"})}else if(r=this.rules.html.exec(e))e=e.substring(r[0].length),this.tokens.push({type:this.options.sanitize?"paragraph":"html",pre:!this.options.sanitizer&&("pre"===r[1]||"script"===r[1]||"style"===r[1]),text:r[0]});else if(i&&(r=this.rules.def.exec(e)))e=e.substring(r[0].length),r[3]&&(r[3]=r[3].substring(1,r[3].length-1)),g=r[1].toLowerCase().replace(/\s+/g," "),this.tokens.links[g]||(this.tokens.links[g]={href:r[2],title:r[3]});else if(i&&(r=this.rules.table.exec(e))&&(a={type:"table",header:b(r[1].replace(/^ *| *\| *$/g,"")),align:r[2].replace(/^ *|\| *$/g,"").split(/ *\| */),cells:r[3]?r[3].replace(/(?: *\| *)?\n$/,"").split("\n"):[]}).header.length===a.align.length){for(e=e.substring(r[0].length),d=0;d<a.align.length;d++)/^ *-+: *$/.test(a.align[d])?a.align[d]="right":/^ *:-+: *$/.test(a.align[d])?a.align[d]="center":/^ *:-+ *$/.test(a.align[d])?a.align[d]="left":a.align[d]=null;for(d=0;d<a.cells.length;d++)a.cells[d]=b(a.cells[d].replace(/^ *\| *| *\| *$/g,""),a.header.length);this.tokens.push(a)}else if(r=this.rules.lheading.exec(e))e=e.substring(r[0].length),this.tokens.push({type:"heading",depth:"="===r[2]?1:2,text:r[1]});else if(i&&(r=this.rules.paragraph.exec(e)))e=e.substring(r[0].length),this.tokens.push({type:"paragraph",text:"\n"===r[1].charAt(r[1].length-1)?r[1].slice(0,-1):r[1]});else if(r=this.rules.text.exec(e))e=e.substring(r[0].length),this.tokens.push({type:"text",text:r[0]});else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0));return this.tokens};var s={escape:/^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,autolink:/^<(scheme:[^\s\x00-\x1f<>]*|email)>/,url:g,tag:"^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>",link:/^!?\[(label)\]\(href(?:\s+(title))?\s*\)/,reflink:/^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,nolink:/^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,strong:/^__([^\s])__(?!_)|^\*\*([^\s])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,em:/^_([^\s_])_(?!_)|^\*([^\s*"<\[])\*(?!\*)|^_([^\s][\s\S]*?[^\s_])_(?!_)|^_([^\s_][\s\S]*?[^\s])_(?!_)|^\*([^\s"<\[][\s\S]*?[^\s*])\*(?!\*)|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,code:/^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,br:/^( {2,}|\\)\n(?!\s*$)/,del:g,text:/^(`+|[^`])[\s\S]*?(?=[\\<!\[`*]|\b_| {2,}\n|$)/};function n(e,t){if(this.options=t||v.defaults,this.links=e,this.rules=s.normal,this.renderer=this.options.renderer||new r,this.renderer.options=this.options,!this.links)throw new Error("Tokens array requires a `links` property.");this.options.pedantic?this.rules=s.pedantic:this.options.gfm&&(this.options.breaks?this.rules=s.breaks:this.rules=s.gfm)}function r(e){this.options=e||v.defaults}function o(){}function l(e){this.tokens=[],this.token=null,this.options=e||v.defaults,this.options.renderer=this.options.renderer||new r,this.renderer=this.options.renderer,this.renderer.options=this.options}function a(e,t){if(t){if(a.escapeTest.test(e))return e.replace(a.escapeReplace,function(e){return a.replacements[e]})}else if(a.escapeTestNoEncode.test(e))return e.replace(a.escapeReplaceNoEncode,function(e){return a.replacements[e]});return e}function h(e){return e.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/gi,function(e,t){return"colon"===(t=t.toLowerCase())?":":"#"===t.charAt(0)?"x"===t.charAt(1)?String.fromCharCode(parseInt(t.substring(2),16)):String.fromCharCode(+t.substring(1)):""})}function c(e,t){return e=e.source||e,t=t||"",{replace:function(t,i){return i=(i=i.source||i).replace(/(^|[^\[])\^/g,"$1"),e=e.replace(t,i),this},getRegex:function(){return new RegExp(e,t)}}}function p(e,t){return u[" "+e]||(/^[^:]+:\/*[^/]*$/.test(e)?u[" "+e]=e+"/":u[" "+e]=m(e,"/",!0)),e=u[" "+e],"//"===t.slice(0,2)?e.replace(/:[\s\S]*/,":")+t:"/"===t.charAt(0)?e.replace(/(:\/*[^/]*)[\s\S]*/,"$1")+t:e+t}s._escapes=/\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g,s._scheme=/[a-zA-Z][a-zA-Z0-9+.-]{1,31}/,s._email=/[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/,s.autolink=c(s.autolink).replace("scheme",s._scheme).replace("email",s._email).getRegex(),s._attribute=/\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/,s.tag=c(s.tag).replace("comment",t._comment).replace("attribute",s._attribute).getRegex(),s._label=/(?:\[[^\[\]]*\]|\\[\[\]]?|`[^`]*`|[^\[\]\\])*?/,s._href=/\s*(<(?:\\[<>]?|[^\s<>\\])*>|(?:\\[()]?|\([^\s\x00-\x1f\\]*\)|[^\s\x00-\x1f()\\])*?)/,s._title=/"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/,s.link=c(s.link).replace("label",s._label).replace("href",s._href).replace("title",s._title).getRegex(),s.reflink=c(s.reflink).replace("label",s._label).getRegex(),s.normal=f({},s),s.pedantic=f({},s.normal,{strong:/^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,em:/^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,link:c(/^!?\[(label)\]\((.*?)\)/).replace("label",s._label).getRegex(),reflink:c(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label",s._label).getRegex()}),s.gfm=f({},s.normal,{escape:c(s.escape).replace("])","~|])").getRegex(),_extended_email:/[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,url:/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,_backpedal:/(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,del:/^~+(?=\S)([\s\S]*?\S)~+/,text:c(s.text).replace("]|","~]|").replace("|$","|https?://|ftp://|www\\.|[a-zA-Z0-9.!#$%&'*+/=?^_`{\\|}~-]+@|$").getRegex()}),s.gfm.url=c(s.gfm.url).replace("email",s.gfm._extended_email).getRegex(),s.breaks=f({},s.gfm,{br:c(s.br).replace("{2,}","*").getRegex(),text:c(s.gfm.text).replace("{2,}","*").getRegex()}),n.rules=s,n.output=function(e,t,i){return new n(t,i).output(e)},n.prototype.output=function(e){for(var t,i,s,r,o,l,h="";e;)if(o=this.rules.escape.exec(e))e=e.substring(o[0].length),h+=o[1];else if(o=this.rules.autolink.exec(e))e=e.substring(o[0].length),s="@"===o[2]?"mailto:"+(i=a(this.mangle(o[1]))):i=a(o[1]),h+=this.renderer.link(s,null,i);else if(this.inLink||!(o=this.rules.url.exec(e))){if(o=this.rules.tag.exec(e))!this.inLink&&/^<a /i.test(o[0])?this.inLink=!0:this.inLink&&/^<\/a>/i.test(o[0])&&(this.inLink=!1),!this.inRawBlock&&/^<(pre|code|kbd|script)(\s|>)/i.test(o[0])?this.inRawBlock=!0:this.inRawBlock&&/^<\/(pre|code|kbd|script)(\s|>)/i.test(o[0])&&(this.inRawBlock=!1),e=e.substring(o[0].length),h+=this.options.sanitize?this.options.sanitizer?this.options.sanitizer(o[0]):a(o[0]):o[0];else if(o=this.rules.link.exec(e))e=e.substring(o[0].length),this.inLink=!0,s=o[2],this.options.pedantic?(t=/^([^'"]*[^\s])\s+(['"])(.*)\2/.exec(s))?(s=t[1],r=t[3]):r="":r=o[3]?o[3].slice(1,-1):"",s=s.trim().replace(/^<([\s\S]*)>$/,"$1"),h+=this.outputLink(o,{href:n.escapes(s),title:n.escapes(r)}),this.inLink=!1;else if((o=this.rules.reflink.exec(e))||(o=this.rules.nolink.exec(e))){if(e=e.substring(o[0].length),t=(o[2]||o[1]).replace(/\s+/g," "),!(t=this.links[t.toLowerCase()])||!t.href){h+=o[0].charAt(0),e=o[0].substring(1)+e;continue}this.inLink=!0,h+=this.outputLink(o,t),this.inLink=!1}else if(o=this.rules.strong.exec(e))e=e.substring(o[0].length),h+=this.renderer.strong(this.output(o[4]||o[3]||o[2]||o[1]));else if(o=this.rules.em.exec(e))e=e.substring(o[0].length),h+=this.renderer.em(this.output(o[6]||o[5]||o[4]||o[3]||o[2]||o[1]));else if(o=this.rules.code.exec(e))e=e.substring(o[0].length),h+=this.renderer.codespan(a(o[2].trim(),!0));else if(o=this.rules.br.exec(e))e=e.substring(o[0].length),h+=this.renderer.br();else if(o=this.rules.del.exec(e))e=e.substring(o[0].length),h+=this.renderer.del(this.output(o[1]));else if(o=this.rules.text.exec(e))e=e.substring(o[0].length),this.inRawBlock?h+=this.renderer.text(o[0]):h+=this.renderer.text(a(this.smartypants(o[0])));else if(e)throw new Error("Infinite loop on byte: "+e.charCodeAt(0))}else{if("@"===o[2])s="mailto:"+(i=a(o[0]));else{for(;l=o[0],o[0]=this.rules._backpedal.exec(o[0])[0],l!==o[0];);i=a(o[0]),s="www."===o[1]?"http://"+i:i}e=e.substring(o[0].length),h+=this.renderer.link(s,null,i)}return h},n.escapes=function(e){return e?e.replace(n.rules._escapes,"$1"):e},n.prototype.outputLink=function(e,t){var i=t.href,s=t.title?a(t.title):null;return"!"!==e[0].charAt(0)?this.renderer.link(i,s,this.output(e[1])):this.renderer.image(i,s,a(e[1]))},n.prototype.smartypants=function(e){return this.options.smartypants?e.replace(/---/g,"—").replace(/--/g,"–").replace(/(^|[-\u2014/(\[{"\s])'/g,"$1‘").replace(/'/g,"’").replace(/(^|[-\u2014/(\[{\u2018\s])"/g,"$1“").replace(/"/g,"”").replace(/\.{3}/g,"…"):e},n.prototype.mangle=function(e){if(!this.options.mangle)return e;for(var t,i="",s=e.length,n=0;n<s;n++)t=e.charCodeAt(n),.5<Math.random()&&(t="x"+t.toString(16)),i+="&#"+t+";";return i},r.prototype.code=function(e,t,i){if(this.options.highlight){var s=this.options.highlight(e,t);null!=s&&s!==e&&(i=!0,e=s)}return t?'<pre><code class="'+this.options.langPrefix+a(t,!0)+'">'+(i?e:a(e,!0))+"</code></pre>\n":"<pre><code>"+(i?e:a(e,!0))+"</code></pre>"},r.prototype.blockquote=function(e){return"<blockquote>\n"+e+"</blockquote>\n"},r.prototype.html=function(e){return e},r.prototype.heading=function(e,t,i){return this.options.headerIds?"<h"+t+' id="'+this.options.headerPrefix+i.toLowerCase().replace(/[^\w]+/g,"-")+'">'+e+"</h"+t+">\n":"<h"+t+">"+e+"</h"+t+">\n"},r.prototype.hr=function(){return this.options.xhtml?"<hr/>\n":"<hr>\n"},r.prototype.list=function(e,t,i){var s=t?"ol":"ul";return"<"+s+(t&&1!==i?' start="'+i+'"':"")+">\n"+e+"</"+s+">\n"},r.prototype.listitem=function(e){return"<li>"+e+"</li>\n"},r.prototype.checkbox=function(e){return"<input "+(e?'checked="" ':"")+'disabled="" type="checkbox"'+(this.options.xhtml?" /":"")+"> "},r.prototype.paragraph=function(e){return"<p>"+e+"</p>\n"},r.prototype.table=function(e,t){return t&&(t="<tbody>"+t+"</tbody>"),"<table>\n<thead>\n"+e+"</thead>\n"+t+"</table>\n"},r.prototype.tablerow=function(e){return"<tr>\n"+e+"</tr>\n"},r.prototype.tablecell=function(e,t){var i=t.header?"th":"td";return(t.align?"<"+i+' align="'+t.align+'">':"<"+i+">")+e+"</"+i+">\n"},r.prototype.strong=function(e){return"<strong>"+e+"</strong>"},r.prototype.em=function(e){return"<em>"+e+"</em>"},r.prototype.codespan=function(e){return"<code>"+e+"</code>"},r.prototype.br=function(){return this.options.xhtml?"<br/>":"<br>"},r.prototype.del=function(e){return"<del>"+e+"</del>"},r.prototype.link=function(e,t,i){if(this.options.sanitize){try{var s=decodeURIComponent(h(e)).replace(/[^\w:]/g,"").toLowerCase()}catch(e){return i}if(0===s.indexOf("javascript:")||0===s.indexOf("vbscript:")||0===s.indexOf("data:"))return i}this.options.baseUrl&&!d.test(e)&&(e=p(this.options.baseUrl,e));try{e=encodeURI(e).replace(/%25/g,"%")}catch(e){return i}var n='<a href="'+a(e)+'"';return t&&(n+=' title="'+t+'"'),n+">"+i+"</a>"},r.prototype.image=function(e,t,i){this.options.baseUrl&&!d.test(e)&&(e=p(this.options.baseUrl,e));var s='<img src="'+e+'" alt="'+i+'"';return t&&(s+=' title="'+t+'"'),s+(this.options.xhtml?"/>":">")},r.prototype.text=function(e){return e},o.prototype.strong=o.prototype.em=o.prototype.codespan=o.prototype.del=o.prototype.text=function(e){return e},o.prototype.link=o.prototype.image=function(e,t,i){return""+i},o.prototype.br=function(){return""},l.parse=function(e,t){return new l(t).parse(e)},l.prototype.parse=function(e){this.inline=new n(e.links,this.options),this.inlineText=new n(e.links,f({},this.options,{renderer:new o})),this.tokens=e.reverse();for(var t="";this.next();)t+=this.tok();return t},l.prototype.next=function(){return this.token=this.tokens.pop()},l.prototype.peek=function(){return this.tokens[this.tokens.length-1]||0},l.prototype.parseText=function(){for(var e=this.token.text;"text"===this.peek().type;)e+="\n"+this.next().text;return this.inline.output(e)},l.prototype.tok=function(){switch(this.token.type){case"space":return"";case"hr":return this.renderer.hr();case"heading":return this.renderer.heading(this.inline.output(this.token.text),this.token.depth,h(this.inlineText.output(this.token.text)));case"code":return this.renderer.code(this.token.text,this.token.lang,this.token.escaped);case"table":var e,t,i,s,n="",r="";for(i="",e=0;e<this.token.header.length;e++)i+=this.renderer.tablecell(this.inline.output(this.token.header[e]),{header:!0,align:this.token.align[e]});for(n+=this.renderer.tablerow(i),e=0;e<this.token.cells.length;e++){for(t=this.token.cells[e],i="",s=0;s<t.length;s++)i+=this.renderer.tablecell(this.inline.output(t[s]),{header:!1,align:this.token.align[s]});r+=this.renderer.tablerow(i)}return this.renderer.table(n,r);case"blockquote_start":for(r="";"blockquote_end"!==this.next().type;)r+=this.tok();return this.renderer.blockquote(r);case"list_start":r="";for(var o=this.token.ordered,l=this.token.start;"list_end"!==this.next().type;)r+=this.tok();return this.renderer.list(r,o,l);case"list_item_start":r="";var a=this.token.loose;for(this.token.task&&(r+=this.renderer.checkbox(this.token.checked));"list_item_end"!==this.next().type;)r+=a||"text"!==this.token.type?this.tok():this.parseText();return this.renderer.listitem(r);case"html":return this.renderer.html(this.token.text);case"paragraph":return this.renderer.paragraph(this.inline.output(this.token.text));case"text":return this.renderer.paragraph(this.parseText())}},a.escapeTest=/[&<>"']/,a.escapeReplace=/[&<>"']/g,a.replacements={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"},a.escapeTestNoEncode=/[<>"']|&(?!#?\w+;)/,a.escapeReplaceNoEncode=/[<>"']|&(?!#?\w+;)/g;var u={},d=/^$|^[a-z][a-z0-9+.-]*:|^[?#]/i;function g(){}function f(e){for(var t,i,s=1;s<arguments.length;s++)for(i in t=arguments[s])Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i]);return e}function b(e,t){var i=e.replace(/\|/g,function(e,t,i){for(var s=!1,n=t;0<=--n&&"\\"===i[n];)s=!s;return s?"|":" |"}).split(/ \|/),s=0;if(i.length>t)i.splice(t);else for(;i.length<t;)i.push("");for(;s<i.length;s++)i[s]=i[s].trim().replace(/\\\|/g,"|");return i}function m(e,t,i){if(0===e.length)return"";for(var s=0;s<e.length;){var n=e.charAt(e.length-s-1);if(n!==t||i){if(n===t||!i)break;s++}else s++}return e.substr(0,e.length-s)}function v(e,t,s){if(null==e)throw new Error("marked(): input parameter is undefined or null");if("string"!=typeof e)throw new Error("marked(): input parameter is of type "+Object.prototype.toString.call(e)+", string expected");if(s||"function"==typeof t){s||(s=t,t=null);var n,r,o=(t=f({},v.defaults,t||{})).highlight,h=0;try{n=i.lex(e,t)}catch(e){return s(e)}r=n.length;var c=function(e){if(e)return t.highlight=o,s(e);var i;try{i=l.parse(n,t)}catch(i){e=i}return t.highlight=o,e?s(e):s(null,i)};if(!o||o.length<3)return c();if(delete t.highlight,!r)return c();for(;h<n.length;h++)!function(e){"code"!==e.type?--r||c():o(e.text,e.lang,function(t,i){return t?c(t):null==i||i===e.text?--r||c():(e.text=i,e.escaped=!0,void(--r||c()))})}(n[h])}else try{return t&&(t=f({},v.defaults,t)),l.parse(i.lex(e,t),t)}catch(e){if(e.message+="\nPlease report this to https://github.com/markedjs/marked.",(t||v.defaults).silent)return"<p>An error occurred:</p><pre>"+a(e.message+"",!0)+"</pre>";throw e}}g.exec=g,v.options=v.setOptions=function(e){return f(v.defaults,e),v},v.getDefaults=function(){return{baseUrl:null,breaks:!1,gfm:!0,headerIds:!0,headerPrefix:"",highlight:null,langPrefix:"language-",mangle:!0,pedantic:!1,renderer:new r,sanitize:!1,sanitizer:null,silent:!1,smartLists:!1,smartypants:!1,tables:!0,xhtml:!1}},v.defaults=v.getDefaults(),v.Parser=l,v.parser=l.parse,v.Renderer=r,v.TextRenderer=o,v.Lexer=i,v.lexer=i.lex,v.InlineLexer=n,v.inlineLexer=n.output,v.parse=v,"undefined"!=typeof module&&"object"==typeof exports?module.exports=v:"function"==typeof define&&define.amd?define(function(){return v}):e.marked=v}("undefined"!=typeof window?window:global);class IoMdView extends IoElement{static get Style(){return html`<style>:host {display: block;background-color: var(--io-background-color);color: var(--io-color);--io-code-size: 12px;}:host > :first-child {margin-top: 0;}:host > :last-child {margin-top: 0;}:host p {line-height: 1.4em;}:host a {font-weight: bold;text-decoration: none;color: var(--io-color-link);}:host h1, :host h2, :host h3, :host h4 {margin: 0;border: var(--io-border);border-width: 0 0 var(--io-border-width) 0;}:host h1 {padding: 0.5em 0;}:host h2 {padding: 0.4em 0;}:host h3 {padding: 0.3em 0;}:host h4 {padding: 0.2em 0;}:host code {background-color: var(--io-background-color-dark);font-family: "Roboto Mono", Monaco, courier, monospace;overflow: auto;font-weight: bold;}:host code.language-html,:host code.language-javascript {padding: 1em;display: block;font-size: var(--io-code-size);}:host blockquote {font-size: 0.85em;opacity: 0.5;margin: 0;padding: var(--io-spacing) 0;}:host table{width: 100% !important;border: 1px solid black;border-collapse: collapse;table-layout: fixed;}:host table td,:host table tr,:host table th {border: 1px solid gray;padding: 0.25em;text-overflow: ellipsis;overflow: hidden;}:host .videocontainer {width: 100%;height: 0;position: relative;padding-bottom: 56.25%;}:host .videocontainer > iframe {position: absolute;top: 0;left: 0;width: 100%;height: 100%;}:host[loading] {background: repeating-linear-gradient(135deg, var(--io-background-color-light), var(--io-background-color) 3px, var(--io-background-color) 7px, var(--io-background-color-light) 10px);background-repeat: repeat;}</style>`}static get Attributes(){return{role:"document",loading:!0}}static get Properties(){return{path:{type:String,reflect:1},vars:Object}}resized(){const e=this.getBoundingClientRect().width;this.style.setProperty("--io-code-size",Math.min((e-50)/40,12)+"px")}pathChanged(){const e=this;this.loading=!0,fetch(this.path).then(e=>e.text()).then(t=>{window.marked&&(window.marked&&window.marked.setOptions({sanitize:!1,highlight:function(e){return window.hljs?window.hljs.highlightAuto(e).value:null}}),e.innerHTML=window.marked(t),this.loading=!1,this.dispatchEvent("content-ready",{},!0))})}}IoMdView.Register();class NodeBindings{constructor(e){Object.defineProperty(this,"node",{value:e,configurable:!0})}get(e){return this[e]=this[e]||new Binding(this.node,e),this[e]}dispose(){for(let e in this)this[e].dispose(),delete this[e];delete this.node}}class Binding{constructor(e,t){this.source=e,this.sourceProp=t,this.targets=[],this.targetsMap=new WeakMap,this._onTargetChanged=this._onTargetChanged.bind(this),this._onSourceChanged=this._onSourceChanged.bind(this),this.source.addEventListener(this.sourceProp+"-changed",this._onSourceChanged)}get value(){return this.source[this.sourceProp]}addTarget(e,t){if(-1===this.targets.indexOf(e)&&this.targets.push(e),this.targetsMap.has(e)){const i=this.targetsMap.get(e);-1===i.indexOf(t)&&(i.push(t),e.addEventListener(t+"-changed",this._onTargetChanged))}else this.targetsMap.set(e,[t]),e.addEventListener(t+"-changed",this._onTargetChanged)}removeTarget(e,t){if(this.targetsMap.has(e)){const i=this.targetsMap.get(e);if(t){const s=i.indexOf(t);-1!==s&&i.splice(s,1),e.removeEventListener(t+"-changed",this._onTargetChanged)}else{for(let t=i.length;t--;)e.removeEventListener(i[t]+"-changed",this._onTargetChanged);i.length=0}0===i.length&&this.targets.splice(this.targets.indexOf(e),1)}}_onTargetChanged(e){if(-1===this.targets.indexOf(e.target))return void console.error("Io: _onTargetChanged() should never fire when target is removed from binding.\n        Please file an issue at https://github.com/arodic/io/issues.");const t=this.source[this.sourceProp],i=e.detail.value;if(t!==i){if("number"==typeof i&&isNaN(i)&&"number"==typeof t&&isNaN(t))return;this.source[this.sourceProp]=i}}_onSourceChanged(e){if(e.target!=this.source)return void console.error("Io: _onSourceChanged() should always originate form source node.\n        Please file an issue at https://github.com/arodic/io/issues.");const t=e.detail.value;for(let e=this.targets.length;e--;){const i=this.targetsMap.get(this.targets[e]);for(let s=i.length;s--;){const n=this.targets[e][i[s]];if(n!==t){if("number"==typeof t&&isNaN(t)&&"number"==typeof n&&isNaN(n))continue;this.targets[e][i[s]]=t}}}}dispose(){this.source.removeEventListener(this.sourceProp+"-changed",this._onSourceChanged);for(let e in this.targets)this.removeTarget(this.targets[e]),delete this.targets[e]}}class NodeQueue extends Array{constructor(e){super(),Object.defineProperty(this,"node",{value:e,configurable:!0})}queue(e,t,i){const s=this.indexOf(e);-1===s?this.push(e,{property:e,value:t,oldValue:i}):this[s+1].value=t}dispatch(){const e=this.node;if(this.length){let t=!1;for(let i=0;i<this.length;i+=2){const s=this[i],n=this[i+1],r={detail:n};n.value!==n.oldValue?(t=!0,e[s+"Changed"]&&e[s+"Changed"](r),e.dispatchEvent(s+"-changed",r.detail)):n.value}t&&(e.applyCompose(),e.changed()),this.length=0}}dispose(){this.length=0,delete this.node}}class ProtoListeners{constructor(e){for(let t=e.length;t--;){const i=e[t].constructor.Listeners;for(let e in i)this[e]=i[e]}}}class Listeners{constructor(e,t){Object.defineProperty(this,"node",{value:e}),Object.defineProperty(this,"propListeners",{value:{}}),Object.defineProperty(this,"activeListeners",{value:{}});for(let e in t)this[e]=t[e]}setPropListeners(e){for(let e in this.propListeners)delete this.propListeners[e];for(let t in e)t.startsWith("on-")&&(this.propListeners[t.slice(3,t.length)]=e[t])}connect(){const e=this.node;for(let t in this)this[t]instanceof Array?e.addEventListener(t,e[this[t][0]],this[t][1]):e.addEventListener(t,e[this[t]]);const t=this.propListeners;for(let i in t)t[i]instanceof Array?e.addEventListener(i,"function"==typeof t[i][0]?t[i][0]:e[t[i][0]],t[i][1]):e.addEventListener(i,"function"==typeof t[i]?t[i]:e[t[i]])}disconnect(){const e=this.node,t=this.propListeners;for(let t in this){const i="function"==typeof this[t]?this[t]:e[this[t]];e.removeEventListener(t,i)}for(let i in t){const s="function"==typeof t[i]?t[i]:e[t[i]];e.removeEventListener(i,s)}}dispose(){this.disconnect();const e=this.node,t=this.activeListeners;for(let i in t)for(let s=t[i].length;s--;)e.isElement&&HTMLElement.prototype.removeEventListener.call(e,i,t[i][s]),t[i].splice(s,1)}addEventListener(e,t,i){const s=this.node,n=this.activeListeners;n[e]=n[e]||[],-1===n[e].indexOf(t)&&(s.isElement&&HTMLElement.prototype.addEventListener.call(s,e,t,i),n[e].push(t))}removeEventListener(e,t,i){const s=this.node,n=this.activeListeners;if(void 0!==n[e]){const r=n[e].indexOf(t);-1!==r&&(s.isElement&&HTMLElement.prototype.removeEventListener.call(s,e,t,i),n[e].splice(r,1))}}dispatchEvent(e,t={},i=!0,s=this.node){if(s instanceof HTMLElement||s===window)HTMLElement.prototype.dispatchEvent.call(s,new CustomEvent(e,{type:e,detail:t,bubbles:i,composed:!0,cancelable:!0}));else{const i=this.activeListeners;if(void 0!==i[e]){const n=i[e].slice(0);for(let e=0;e<n.length;e++)n[e].call(s,{detail:t,target:s,path:[s]})}}}}class ProtoProperties{constructor(e){this._p=e;const t={};for(let i=e.length;i--;){const s=e[i].constructor.Attributes;for(let e in s)t[e]?Object.assign(t[e],new ProtoProperty(s[e])):t[e]=new ProtoProperty(s[e]),void 0===t[e].reflect&&(t[e].reflect=1),void 0===t[e].notify&&(t[e].notify=!1),void 0===t[e].enumerable&&(t[e].enumerable=!1);const n=e[i].constructor.Properties;for(let e in n)t[e]?Object.assign(t[e],new ProtoProperty(n[e])):t[e]=new ProtoProperty(n[e]),void 0===t[e].reflect&&(t[e].reflect=0),void 0===t[e].notify&&(t[e].notify=!0),void 0===t[e].enumerable&&(t[e].enumerable=!0)}for(let e in t){"_"===e.charAt(0)&&(t[e].notify=!1,t[e].enumerable=!1),void 0===t[e].value&&(t[e].value=void 0),void 0===t[e].type&&(t[e].type=void 0),this[e]=new Property(t[e])}}}class ProtoProperty{constructor(e){const t=typeof e;null==e?e={value:e}:"function"===t?e={type:e}:"number"===t||"string"===t||"boolean"===t?e={value:e,type:e.constructor}:"object"===t?e instanceof Array?e={value:[...e],type:Array}:e instanceof Binding?e={value:e.value,binding:e}:"function"!=typeof e.type&&(void 0===e.value||null===e.value||(e.type=e.value.constructor)):console.error("Property error!",t,e),void 0!==e.value&&(this.value=e.value),void 0!==e.type&&(this.type=e.type),void 0!==e.reflect&&(this.reflect=e.reflect),void 0!==e.binding&&(this.binding=e.binding),void 0!==e.enumerable&&(this.enumerable=e.enumerable),void 0!==e.notify&&(this.notify=e.notify)}}class Properties{constructor(e,t){Object.defineProperty(this,"node",{value:e});for(let i in t)this[i]=new Property(t[i]),this[i].instantiateCustomType(),void 0!==this[i].value&&("object"==typeof this[i].value&&null!==this[i].value?(this[i].value.isNode&&this[i].value.connect(e),e.queue(i,this[i].value,void 0)):1===this[i].reflect&&this.node.setAttribute(i,this[i].value))}get(e){return this[e].value}set(e,t,i){let s=this[e].value;if(t!==s){let n=this[e].binding,r=t instanceof Binding?t:null;r&&n&&r!==n&&n.removeTarget(this.node,e),r?(r.addTarget(this.node,e),this[e].binding=r,this[e].value=t.source[t.sourceProp],t=t.source[t.sourceProp]):this[e].value=t,t&&t.isNode&&t.connect(this.node),s&&s.isNode&&s.disconnect(this.node),this[e].notify&&s!==this[e].value&&(this.node.queue(e,this[e].value,s),this.node.__connected&&!i&&this.node.queueDispatch()),1===this[e].reflect&&this.node.setAttribute(e,t)}}connect(){for(let e in this)this[e].binding&&this[e].binding.addTarget(this.node,e)}disconnect(){for(let e in this)this[e].binding&&this[e].binding.removeTarget(this.node,e)}dispose(){for(let e in this)this[e].binding&&(this[e].binding.removeTarget(this.node,e),delete this[e].binding),delete this[e]}}class Property{constructor(e){this.value=e.value,this.type=e.type,this.reflect=e.reflect,this.binding=e.binding,this.enumerable=e.enumerable,this.notify=e.notify,this.type===Array&&this.value&&(this.value=[...this.value]),this.type===Object&&this.value&&(this.value={}),void 0===this.value&&this.type&&(this.type===Boolean?this.value=!1:this.type===String?this.value="":this.type===Number?this.value=0:this.type===Array?this.value=[]:this.type===Object&&(this.value={}))}instantiateCustomType(){void 0===this.value&&this.type&&this.type!==HTMLElement&&this.type!==Function&&(this.value=new this.type)}}const IoNodeMixin=e=>{const t=class extends e{static get Properties(){return{$:{type:Object,notify:!1}}}constructor(e={}){super(e),Object.defineProperty(this,"__nodeBindings",{value:new NodeBindings(this)}),Object.defineProperty(this,"__nodeQueue",{value:new NodeQueue(this)}),Object.defineProperty(this,"__properties",{value:new Properties(this,this.__protoProperties)}),Object.defineProperty(this,"__listeners",{value:new Listeners(this,this.__protoListeners)});for(let e=0;e<this.__functions.length;e++)this[this.__functions[e]]=this[this.__functions[e]].bind(this);this.__listeners.setPropListeners(e,this),this.setProperties(e)}connect(e){this._owner=this._owner||[],-1===this._owner.indexOf(e)&&(this._owner.push(e),this.__connected||this.connectedCallback())}disconnect(e){-1!==this._owner.indexOf(e)&&this._owner.splice(this._owner.indexOf(e),1),0===this._owner.length&&this.__connected&&this.disconnectedCallback()}preventDefault(e){e.preventDefault()}changed(){}applyCompose(){const e=this.compose;if(e)for(let t in e)this[t].setProperties(e[t]),this[t].__listeners.setPropListeners(e[t],this)}bind(e){return this.__nodeBindings.get(e)}set(e,t,i){if(this[e]!==t||i){const i=this[e];this[e]=t,this.dispatchEvent("value-set",{property:e,value:t,oldValue:i},!1)}}setProperties(e){for(let t in e){if(void 0===this.__properties[t])continue;const i=this.__properties[t].value;this.__properties.set(t,e[t],!0);const s=this.__properties[t].value;s!==i&&this.queue(t,s,i)}if(e.style)for(let t in e.style)this.style[t]=e.style[t],this.style.setProperty(t,e.style[t]);this.__connected&&this.queueDispatch()}_onObjectMutation(e){for(let t=this.__objectProps.length;t--;){const i=this.__objectProps[t];if(this.__properties[i].value===e.detail.object)return this[i+"Mutated"]&&this[i+"Mutated"](e),this.changed(),void this.applyCompose()}}connectedCallback(){this.__listeners.connect(),this.__properties.connect(),this.__connected=!0,this.__objectProps.length&&window.addEventListener("object-mutated",this._onObjectMutation),this.queueDispatch()}disconnectedCallback(){this.__listeners.disconnect(),this.__properties.disconnect(),this.__connected=!1,this.__objectProps.length&&window.removeEventListener("object-mutated",this._onObjectMutation)}dispose(){this.__nodeQueue.dispose(),this.__nodeBindings.dispose(),this.__listeners.dispose(),this.__properties.dispose()}addEventListener(e,t,i){this.__listeners.addEventListener(e,t,i)}removeEventListener(e,t,i){this.__listeners.removeEventListener(e,t,i)}dispatchEvent(e,t,i=!1,s){this.__listeners.dispatchEvent(e,t,i,s)}queue(e,t,i){this.__nodeQueue.queue(e,t,i)}queueDispatch(){this.__nodeQueue.dispatch()}};return t.Register=Register,t},Register=function(){let e=this.prototype;const t=[];for(;e&&e.constructor!==HTMLElement&&e.constructor!==Object;)t.push(e),e=e.__proto__;Object.defineProperty(this.prototype,"isNode",{value:e.constructor!==HTMLElement}),Object.defineProperty(this.prototype,"isElement",{value:e.constructor===HTMLElement}),e=this.prototype,Object.defineProperty(e,"__protochain",{value:t}),Object.defineProperty(e,"__protoProperties",{value:new ProtoProperties(t)}),Object.defineProperty(e,"__protoListeners",{value:new ProtoListeners(t)});const i=new Set;for(let e=t.length;e--;){const s=Object.getOwnPropertyNames(t[e]);for(let e=0;e<s.length;e++)(s[e].startsWith("_on")||s[e].startsWith("on"))&&i.add(s[e])}Object.defineProperty(e,"__functions",{value:[...i]}),Object.defineProperty(e,"__objectProps",{value:[]});const s=[Boolean,String,Number,HTMLElement,Function,void 0];for(let t in e.__protoProperties){const i=e.__protoProperties[t];i.notify&&-1==s.indexOf(i.type)&&e.__objectProps.push(t)}for(let t in e.__protoProperties)Object.defineProperty(e,t,{get:function(){return this.__properties.get(t)},set:function(e){this.__properties.set(t,e)},enumerable:!!e.__protoProperties[t].enumerable,configurable:!0})};IoNodeMixin.Register=Register;class IoNode extends(IoNodeMixin(Object)){}"serviceWorker"in navigator||console.warn("No Service Worker support!"),"PushManager"in window||console.warn("No Push API Support!");class IoServiceLoader extends IoNode{static get Properties(){return{path:"service.js",serviceWorker:void 0,permission:window.Notification?window.Notification.permission:"default",subscription:""}}constructor(e){super(e),this.requestNotification=this.requestNotification.bind(this),"serviceWorker"in navigator&&this.init()}async init(){const e=await navigator.serviceWorker.register(this.path);e.update(),navigator.serviceWorker.addEventListener("message",this.onServiceWorkerMessage),e.active?this.serviceWorker=e:e.addEventListener("activate",()=>{this.serviceWorker=e})}serviceWorkerChanged(){"granted"===this.permission&&this.subscribe()}subscribe(){navigator.serviceWorker.controller&&navigator.serviceWorker.controller.postMessage({command:"subscribe"})}async requestNotification(){this.permission=await window.Notification.requestPermission(),"granted"===this.permission&&this.subscribe()}onServiceWorkerMessage(e){const t=JSON.parse(e.data);t.subscription&&(this.subscription=JSON.stringify(t.subscription))}}IoServiceLoader.Register();export{IoElementDemo,IoMdView,IoServiceLoader};