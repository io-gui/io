import { ReactiveProperty as xt, Property as Fr, ThemeSingleton as Yn, IoElement as Gr, Register as Wr } from "@io-gui/core";
function Zt() {
  return { async: !1, breaks: !1, extensions: null, gfm: !0, hooks: null, pedantic: !1, renderer: null, silent: !1, tokenizer: null, walkTokens: null };
}
var Me = Zt();
function Qn(t) {
  Me = t;
}
var Ve = { exec: () => null };
function N(t, e = "") {
  let n = typeof t == "string" ? t : t.source, i = { replace: (r, s) => {
    let a = typeof s == "string" ? s : s.source;
    return a = a.replace(V.caret, "$1"), n = n.replace(r, a), i;
  }, getRegex: () => new RegExp(n, e) };
  return i;
}
var Zr = (() => {
  try {
    return !!new RegExp("(?<=1)(?<!1)");
  } catch {
    return !1;
  }
})(), V = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] +\S/, listReplaceTask: /^\[[ xX]\] +/, listTaskCheckbox: /\[[ xX]\]/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (t) => new RegExp(`^( {0,3}${t})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}#`), htmlBeginRegex: (t) => new RegExp(`^ {0,${Math.min(3, t - 1)}}<(?:[a-z].*>|!--)`, "i") }, qr = /^(?:[ \t]*(?:\n|$))+/, Kr = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Xr = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, tt = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Yr = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, qt = /(?:[*+-]|\d{1,9}[.)])/, Vn = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, Jn = N(Vn).replace(/bull/g, qt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Qr = N(Vn).replace(/bull/g, qt).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), Kt = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, Vr = /^[^\n]+/, Xt = /(?!\s*\])(?:\\[\s\S]|[^\[\]\\])+/, Jr = N(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Xt).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), ei = N(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, qt).getRegex(), wt = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", Yt = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, ti = N("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", Yt).replace("tag", wt).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), er = N(Kt).replace("hr", tt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", wt).getRegex(), ni = N(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", er).getRegex(), Qt = { blockquote: ni, code: Kr, def: Jr, fences: Xr, heading: Yr, hr: tt, html: ti, lheading: Jn, list: ei, newline: qr, paragraph: er, table: Ve, text: Vr }, En = N("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", tt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", wt).getRegex(), ri = { ...Qt, lheading: Qr, table: En, paragraph: N(Kt).replace("hr", tt).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", En).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", wt).getRegex() }, ii = { ...Qt, html: N(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", Yt).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: Ve, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: N(Kt).replace("hr", tt).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", Jn).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, si = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ai = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, tr = /^( {2,}|\\)\n(?!\s*$)/, oi = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, _t = /[\p{P}\p{S}]/u, Vt = /[\s\p{P}\p{S}]/u, nr = /[^\s\p{P}\p{S}]/u, li = N(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, Vt).getRegex(), rr = /(?!~)[\p{P}\p{S}]/u, ci = /(?!~)[\s\p{P}\p{S}]/u, ui = /(?:[^\s\p{P}\p{S}]|~)/u, hi = N(/link|precode-code|html/, "g").replace("link", /\[(?:[^\[\]`]|(?<a>`+)[^`]+\k<a>(?!`))*?\]\((?:\\[\s\S]|[^\\\(\)]|\((?:\\[\s\S]|[^\\\(\)])*\))*\)/).replace("precode-", Zr ? "(?<!`)()" : "(^^|[^`])").replace("code", /(?<b>`+)[^`]+\k<b>(?!`)/).replace("html", /<(?! )[^<>]*?>/).getRegex(), ir = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, pi = N(ir, "u").replace(/punct/g, _t).getRegex(), di = N(ir, "u").replace(/punct/g, rr).getRegex(), sr = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", gi = N(sr, "gu").replace(/notPunctSpace/g, nr).replace(/punctSpace/g, Vt).replace(/punct/g, _t).getRegex(), fi = N(sr, "gu").replace(/notPunctSpace/g, ui).replace(/punctSpace/g, ci).replace(/punct/g, rr).getRegex(), mi = N("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, nr).replace(/punctSpace/g, Vt).replace(/punct/g, _t).getRegex(), bi = N(/\\(punct)/, "gu").replace(/punct/g, _t).getRegex(), ki = N(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), xi = N(Yt).replace("(?:-->|$)", "-->").getRegex(), wi = N("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", xi).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), gt = /(?:\[(?:\\[\s\S]|[^\[\]\\])*\]|\\[\s\S]|`+[^`]*?`+(?!`)|[^\[\]\\`])*?/, _i = N(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", gt).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), ar = N(/^!?\[(label)\]\[(ref)\]/).replace("label", gt).replace("ref", Xt).getRegex(), or = N(/^!?\[(ref)\](?:\[\])?/).replace("ref", Xt).getRegex(), Ei = N("reflink|nolink(?!\\()", "g").replace("reflink", ar).replace("nolink", or).getRegex(), yn = /[hH][tT][tT][pP][sS]?|[fF][tT][pP]/, Jt = { _backpedal: Ve, anyPunctuation: bi, autolink: ki, blockSkip: hi, br: tr, code: ai, del: Ve, emStrongLDelim: pi, emStrongRDelimAst: gi, emStrongRDelimUnd: mi, escape: si, link: _i, nolink: or, punctuation: li, reflink: ar, reflinkSearch: Ei, tag: wi, text: oi, url: Ve }, yi = { ...Jt, link: N(/^!?\[(label)\]\((.*?)\)/).replace("label", gt).getRegex(), reflink: N(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", gt).getRegex() }, jt = { ...Jt, emStrongRDelimAst: fi, emStrongLDelim: di, url: N(/^((?:protocol):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/).replace("protocol", yn).replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\[\s\S]|[^\\])*?(?:\\[\s\S]|[^\s~\\]))\1(?=[^~]|$)/, text: N(/^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|protocol:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/).replace("protocol", yn).getRegex() }, Ti = { ...jt, br: N(tr).replace("{2,}", "*").getRegex(), text: N(jt.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, lt = { normal: Qt, gfm: ri, pedantic: ii }, Ge = { normal: Jt, gfm: jt, breaks: Ti, pedantic: yi }, Ai = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, Tn = (t) => Ai[t];
function xe(t, e) {
  if (e) {
    if (V.escapeTest.test(t)) return t.replace(V.escapeReplace, Tn);
  } else if (V.escapeTestNoEncode.test(t)) return t.replace(V.escapeReplaceNoEncode, Tn);
  return t;
}
function An(t) {
  try {
    t = encodeURI(t).replace(V.percentDecode, "%");
  } catch {
    return null;
  }
  return t;
}
function Sn(t, e) {
  let n = t.replace(V.findPipe, (s, a, c) => {
    let l = !1, h = a;
    for (; --h >= 0 && c[h] === "\\"; ) l = !l;
    return l ? "|" : " |";
  }), i = n.split(V.splitPipe), r = 0;
  if (i[0].trim() || i.shift(), i.length > 0 && !i.at(-1)?.trim() && i.pop(), e) if (i.length > e) i.splice(e);
  else for (; i.length < e; ) i.push("");
  for (; r < i.length; r++) i[r] = i[r].trim().replace(V.slashPipe, "|");
  return i;
}
function We(t, e, n) {
  let i = t.length;
  if (i === 0) return "";
  let r = 0;
  for (; r < i && t.charAt(i - r - 1) === e; )
    r++;
  return t.slice(0, i - r);
}
function Si(t, e) {
  if (t.indexOf(e[1]) === -1) return -1;
  let n = 0;
  for (let i = 0; i < t.length; i++) if (t[i] === "\\") i++;
  else if (t[i] === e[0]) n++;
  else if (t[i] === e[1] && (n--, n < 0)) return i;
  return n > 0 ? -2 : -1;
}
function vn(t, e, n, i, r) {
  let s = e.href, a = e.title || null, c = t[1].replace(r.other.outputLinkReplace, "$1");
  i.state.inLink = !0;
  let l = { type: t[0].charAt(0) === "!" ? "image" : "link", raw: n, href: s, title: a, text: c, tokens: i.inlineTokens(c) };
  return i.state.inLink = !1, l;
}
function vi(t, e, n) {
  let i = t.match(n.other.indentCodeCompensation);
  if (i === null) return e;
  let r = i[1];
  return e.split(`
`).map((s) => {
    let a = s.match(n.other.beginningSpace);
    if (a === null) return s;
    let [c] = a;
    return c.length >= r.length ? s.slice(r.length) : s;
  }).join(`
`);
}
var ft = class {
  options;
  rules;
  lexer;
  constructor(t) {
    this.options = t || Me;
  }
  space(t) {
    let e = this.rules.block.newline.exec(t);
    if (e && e[0].length > 0) return { type: "space", raw: e[0] };
  }
  code(t) {
    let e = this.rules.block.code.exec(t);
    if (e) {
      let n = e[0].replace(this.rules.other.codeRemoveIndent, "");
      return { type: "code", raw: e[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : We(n, `
`) };
    }
  }
  fences(t) {
    let e = this.rules.block.fences.exec(t);
    if (e) {
      let n = e[0], i = vi(n, e[3] || "", this.rules);
      return { type: "code", raw: n, lang: e[2] ? e[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : e[2], text: i };
    }
  }
  heading(t) {
    let e = this.rules.block.heading.exec(t);
    if (e) {
      let n = e[2].trim();
      if (this.rules.other.endingHash.test(n)) {
        let i = We(n, "#");
        (this.options.pedantic || !i || this.rules.other.endingSpaceChar.test(i)) && (n = i.trim());
      }
      return { type: "heading", raw: e[0], depth: e[1].length, text: n, tokens: this.lexer.inline(n) };
    }
  }
  hr(t) {
    let e = this.rules.block.hr.exec(t);
    if (e) return { type: "hr", raw: We(e[0], `
`) };
  }
  blockquote(t) {
    let e = this.rules.block.blockquote.exec(t);
    if (e) {
      let n = We(e[0], `
`).split(`
`), i = "", r = "", s = [];
      for (; n.length > 0; ) {
        let a = !1, c = [], l;
        for (l = 0; l < n.length; l++) if (this.rules.other.blockquoteStart.test(n[l])) c.push(n[l]), a = !0;
        else if (!a) c.push(n[l]);
        else break;
        n = n.slice(l);
        let h = c.join(`
`), u = h.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
        i = i ? `${i}
${h}` : h, r = r ? `${r}
${u}` : u;
        let _ = this.lexer.state.top;
        if (this.lexer.state.top = !0, this.lexer.blockTokens(u, s, !0), this.lexer.state.top = _, n.length === 0) break;
        let E = s.at(-1);
        if (E?.type === "code") break;
        if (E?.type === "blockquote") {
          let v = E, y = v.raw + `
` + n.join(`
`), L = this.blockquote(y);
          s[s.length - 1] = L, i = i.substring(0, i.length - v.raw.length) + L.raw, r = r.substring(0, r.length - v.text.length) + L.text;
          break;
        } else if (E?.type === "list") {
          let v = E, y = v.raw + `
` + n.join(`
`), L = this.list(y);
          s[s.length - 1] = L, i = i.substring(0, i.length - E.raw.length) + L.raw, r = r.substring(0, r.length - v.raw.length) + L.raw, n = y.substring(s.at(-1).raw.length).split(`
`);
          continue;
        }
      }
      return { type: "blockquote", raw: i, tokens: s, text: r };
    }
  }
  list(t) {
    let e = this.rules.block.list.exec(t);
    if (e) {
      let n = e[1].trim(), i = n.length > 1, r = { type: "list", raw: "", ordered: i, start: i ? +n.slice(0, -1) : "", loose: !1, items: [] };
      n = i ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = i ? n : "[*+-]");
      let s = this.rules.other.listItemRegex(n), a = !1;
      for (; t; ) {
        let l = !1, h = "", u = "";
        if (!(e = s.exec(t)) || this.rules.block.hr.test(t)) break;
        h = e[0], t = t.substring(h.length);
        let _ = e[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (L) => " ".repeat(3 * L.length)), E = t.split(`
`, 1)[0], v = !_.trim(), y = 0;
        if (this.options.pedantic ? (y = 2, u = _.trimStart()) : v ? y = e[1].length + 1 : (y = e[2].search(this.rules.other.nonSpaceChar), y = y > 4 ? 1 : y, u = _.slice(y), y += e[1].length), v && this.rules.other.blankLine.test(E) && (h += E + `
`, t = t.substring(E.length + 1), l = !0), !l) {
          let L = this.rules.other.nextBulletRegex(y), le = this.rules.other.hrRegex(y), ie = this.rules.other.fencesBeginRegex(y), Y = this.rules.other.headingBeginRegex(y), d = this.rules.other.htmlBeginRegex(y);
          for (; t; ) {
            let g = t.split(`
`, 1)[0], w;
            if (E = g, this.options.pedantic ? (E = E.replace(this.rules.other.listReplaceNesting, "  "), w = E) : w = E.replace(this.rules.other.tabCharGlobal, "    "), ie.test(E) || Y.test(E) || d.test(E) || L.test(E) || le.test(E)) break;
            if (w.search(this.rules.other.nonSpaceChar) >= y || !E.trim()) u += `
` + w.slice(y);
            else {
              if (v || _.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || ie.test(_) || Y.test(_) || le.test(_)) break;
              u += `
` + E;
            }
            !v && !E.trim() && (v = !0), h += g + `
`, t = t.substring(g.length + 1), _ = w.slice(y);
          }
        }
        r.loose || (a ? r.loose = !0 : this.rules.other.doubleBlankLine.test(h) && (a = !0)), r.items.push({ type: "list_item", raw: h, task: !!this.options.gfm && this.rules.other.listIsTask.test(u), loose: !1, text: u, tokens: [] }), r.raw += h;
      }
      let c = r.items.at(-1);
      if (c) c.raw = c.raw.trimEnd(), c.text = c.text.trimEnd();
      else return;
      r.raw = r.raw.trimEnd();
      for (let l of r.items) {
        if (this.lexer.state.top = !1, l.tokens = this.lexer.blockTokens(l.text, []), l.task) {
          if (l.text = l.text.replace(this.rules.other.listReplaceTask, ""), l.tokens[0]?.type === "text" || l.tokens[0]?.type === "paragraph") {
            l.tokens[0].raw = l.tokens[0].raw.replace(this.rules.other.listReplaceTask, ""), l.tokens[0].text = l.tokens[0].text.replace(this.rules.other.listReplaceTask, "");
            for (let u = this.lexer.inlineQueue.length - 1; u >= 0; u--) if (this.rules.other.listIsTask.test(this.lexer.inlineQueue[u].src)) {
              this.lexer.inlineQueue[u].src = this.lexer.inlineQueue[u].src.replace(this.rules.other.listReplaceTask, "");
              break;
            }
          }
          let h = this.rules.other.listTaskCheckbox.exec(l.raw);
          if (h) {
            let u = { type: "checkbox", raw: h[0] + " ", checked: h[0] !== "[ ]" };
            l.checked = u.checked, r.loose ? l.tokens[0] && ["paragraph", "text"].includes(l.tokens[0].type) && "tokens" in l.tokens[0] && l.tokens[0].tokens ? (l.tokens[0].raw = u.raw + l.tokens[0].raw, l.tokens[0].text = u.raw + l.tokens[0].text, l.tokens[0].tokens.unshift(u)) : l.tokens.unshift({ type: "paragraph", raw: u.raw, text: u.raw, tokens: [u] }) : l.tokens.unshift(u);
          }
        }
        if (!r.loose) {
          let h = l.tokens.filter((_) => _.type === "space"), u = h.length > 0 && h.some((_) => this.rules.other.anyLine.test(_.raw));
          r.loose = u;
        }
      }
      if (r.loose) for (let l of r.items) {
        l.loose = !0;
        for (let h of l.tokens) h.type === "text" && (h.type = "paragraph");
      }
      return r;
    }
  }
  html(t) {
    let e = this.rules.block.html.exec(t);
    if (e) return { type: "html", block: !0, raw: e[0], pre: e[1] === "pre" || e[1] === "script" || e[1] === "style", text: e[0] };
  }
  def(t) {
    let e = this.rules.block.def.exec(t);
    if (e) {
      let n = e[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), i = e[2] ? e[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", r = e[3] ? e[3].substring(1, e[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : e[3];
      return { type: "def", tag: n, raw: e[0], href: i, title: r };
    }
  }
  table(t) {
    let e = this.rules.block.table.exec(t);
    if (!e || !this.rules.other.tableDelimiter.test(e[2])) return;
    let n = Sn(e[1]), i = e[2].replace(this.rules.other.tableAlignChars, "").split("|"), r = e[3]?.trim() ? e[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: e[0], header: [], align: [], rows: [] };
    if (n.length === i.length) {
      for (let a of i) this.rules.other.tableAlignRight.test(a) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(a) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(a) ? s.align.push("left") : s.align.push(null);
      for (let a = 0; a < n.length; a++) s.header.push({ text: n[a], tokens: this.lexer.inline(n[a]), header: !0, align: s.align[a] });
      for (let a of r) s.rows.push(Sn(a, s.header.length).map((c, l) => ({ text: c, tokens: this.lexer.inline(c), header: !1, align: s.align[l] })));
      return s;
    }
  }
  lheading(t) {
    let e = this.rules.block.lheading.exec(t);
    if (e) return { type: "heading", raw: e[0], depth: e[2].charAt(0) === "=" ? 1 : 2, text: e[1], tokens: this.lexer.inline(e[1]) };
  }
  paragraph(t) {
    let e = this.rules.block.paragraph.exec(t);
    if (e) {
      let n = e[1].charAt(e[1].length - 1) === `
` ? e[1].slice(0, -1) : e[1];
      return { type: "paragraph", raw: e[0], text: n, tokens: this.lexer.inline(n) };
    }
  }
  text(t) {
    let e = this.rules.block.text.exec(t);
    if (e) return { type: "text", raw: e[0], text: e[0], tokens: this.lexer.inline(e[0]) };
  }
  escape(t) {
    let e = this.rules.inline.escape.exec(t);
    if (e) return { type: "escape", raw: e[0], text: e[1] };
  }
  tag(t) {
    let e = this.rules.inline.tag.exec(t);
    if (e) return !this.lexer.state.inLink && this.rules.other.startATag.test(e[0]) ? this.lexer.state.inLink = !0 : this.lexer.state.inLink && this.rules.other.endATag.test(e[0]) && (this.lexer.state.inLink = !1), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(e[0]) ? this.lexer.state.inRawBlock = !0 : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(e[0]) && (this.lexer.state.inRawBlock = !1), { type: "html", raw: e[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: !1, text: e[0] };
  }
  link(t) {
    let e = this.rules.inline.link.exec(t);
    if (e) {
      let n = e[2].trim();
      if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
        if (!this.rules.other.endAngleBracket.test(n)) return;
        let s = We(n.slice(0, -1), "\\");
        if ((n.length - s.length) % 2 === 0) return;
      } else {
        let s = Si(e[2], "()");
        if (s === -2) return;
        if (s > -1) {
          let a = (e[0].indexOf("!") === 0 ? 5 : 4) + e[1].length + s;
          e[2] = e[2].substring(0, s), e[0] = e[0].substring(0, a).trim(), e[3] = "";
        }
      }
      let i = e[2], r = "";
      if (this.options.pedantic) {
        let s = this.rules.other.pedanticHrefTitle.exec(i);
        s && (i = s[1], r = s[3]);
      } else r = e[3] ? e[3].slice(1, -1) : "";
      return i = i.trim(), this.rules.other.startAngleBracket.test(i) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? i = i.slice(1) : i = i.slice(1, -1)), vn(e, { href: i && i.replace(this.rules.inline.anyPunctuation, "$1"), title: r && r.replace(this.rules.inline.anyPunctuation, "$1") }, e[0], this.lexer, this.rules);
    }
  }
  reflink(t, e) {
    let n;
    if ((n = this.rules.inline.reflink.exec(t)) || (n = this.rules.inline.nolink.exec(t))) {
      let i = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), r = e[i.toLowerCase()];
      if (!r) {
        let s = n[0].charAt(0);
        return { type: "text", raw: s, text: s };
      }
      return vn(n, r, n[0], this.lexer, this.rules);
    }
  }
  emStrong(t, e, n = "") {
    let i = this.rules.inline.emStrongLDelim.exec(t);
    if (!(!i || i[3] && n.match(this.rules.other.unicodeAlphaNumeric)) && (!(i[1] || i[2]) || !n || this.rules.inline.punctuation.exec(n))) {
      let r = [...i[0]].length - 1, s, a, c = r, l = 0, h = i[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
      for (h.lastIndex = 0, e = e.slice(-1 * t.length + r); (i = h.exec(e)) != null; ) {
        if (s = i[1] || i[2] || i[3] || i[4] || i[5] || i[6], !s) continue;
        if (a = [...s].length, i[3] || i[4]) {
          c += a;
          continue;
        } else if ((i[5] || i[6]) && r % 3 && !((r + a) % 3)) {
          l += a;
          continue;
        }
        if (c -= a, c > 0) continue;
        a = Math.min(a, a + c + l);
        let u = [...i[0]][0].length, _ = t.slice(0, r + i.index + u + a);
        if (Math.min(r, a) % 2) {
          let v = _.slice(1, -1);
          return { type: "em", raw: _, text: v, tokens: this.lexer.inlineTokens(v) };
        }
        let E = _.slice(2, -2);
        return { type: "strong", raw: _, text: E, tokens: this.lexer.inlineTokens(E) };
      }
    }
  }
  codespan(t) {
    let e = this.rules.inline.code.exec(t);
    if (e) {
      let n = e[2].replace(this.rules.other.newLineCharGlobal, " "), i = this.rules.other.nonSpaceChar.test(n), r = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
      return i && r && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: e[0], text: n };
    }
  }
  br(t) {
    let e = this.rules.inline.br.exec(t);
    if (e) return { type: "br", raw: e[0] };
  }
  del(t) {
    let e = this.rules.inline.del.exec(t);
    if (e) return { type: "del", raw: e[0], text: e[2], tokens: this.lexer.inlineTokens(e[2]) };
  }
  autolink(t) {
    let e = this.rules.inline.autolink.exec(t);
    if (e) {
      let n, i;
      return e[2] === "@" ? (n = e[1], i = "mailto:" + n) : (n = e[1], i = n), { type: "link", raw: e[0], text: n, href: i, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  url(t) {
    let e;
    if (e = this.rules.inline.url.exec(t)) {
      let n, i;
      if (e[2] === "@") n = e[0], i = "mailto:" + n;
      else {
        let r;
        do
          r = e[0], e[0] = this.rules.inline._backpedal.exec(e[0])?.[0] ?? "";
        while (r !== e[0]);
        n = e[0], e[1] === "www." ? i = "http://" + e[0] : i = e[0];
      }
      return { type: "link", raw: e[0], text: n, href: i, tokens: [{ type: "text", raw: n, text: n }] };
    }
  }
  inlineText(t) {
    let e = this.rules.inline.text.exec(t);
    if (e) {
      let n = this.lexer.state.inRawBlock;
      return { type: "text", raw: e[0], text: e[0], escaped: n };
    }
  }
}, ae = class $t {
  tokens;
  options;
  state;
  inlineQueue;
  tokenizer;
  constructor(e) {
    this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || Me, this.options.tokenizer = this.options.tokenizer || new ft(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: !1, inRawBlock: !1, top: !0 };
    let n = { other: V, block: lt.normal, inline: Ge.normal };
    this.options.pedantic ? (n.block = lt.pedantic, n.inline = Ge.pedantic) : this.options.gfm && (n.block = lt.gfm, this.options.breaks ? n.inline = Ge.breaks : n.inline = Ge.gfm), this.tokenizer.rules = n;
  }
  static get rules() {
    return { block: lt, inline: Ge };
  }
  static lex(e, n) {
    return new $t(n).lex(e);
  }
  static lexInline(e, n) {
    return new $t(n).inlineTokens(e);
  }
  lex(e) {
    e = e.replace(V.carriageReturn, `
`), this.blockTokens(e, this.tokens);
    for (let n = 0; n < this.inlineQueue.length; n++) {
      let i = this.inlineQueue[n];
      this.inlineTokens(i.src, i.tokens);
    }
    return this.inlineQueue = [], this.tokens;
  }
  blockTokens(e, n = [], i = !1) {
    for (this.options.pedantic && (e = e.replace(V.tabCharGlobal, "    ").replace(V.spaceLine, "")); e; ) {
      let r;
      if (this.options.extensions?.block?.some((a) => (r = a.call({ lexer: this }, e, n)) ? (e = e.substring(r.raw.length), n.push(r), !0) : !1)) continue;
      if (r = this.tokenizer.space(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        r.raw.length === 1 && a !== void 0 ? a.raw += `
` : n.push(r);
        continue;
      }
      if (r = this.tokenizer.code(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.text, this.inlineQueue.at(-1).src = a.text) : n.push(r);
        continue;
      }
      if (r = this.tokenizer.fences(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.heading(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.hr(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.blockquote(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.list(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.html(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.def(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        a?.type === "paragraph" || a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.raw, this.inlineQueue.at(-1).src = a.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title }, n.push(r));
        continue;
      }
      if (r = this.tokenizer.table(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      if (r = this.tokenizer.lheading(e)) {
        e = e.substring(r.raw.length), n.push(r);
        continue;
      }
      let s = e;
      if (this.options.extensions?.startBlock) {
        let a = 1 / 0, c = e.slice(1), l;
        this.options.extensions.startBlock.forEach((h) => {
          l = h.call({ lexer: this }, c), typeof l == "number" && l >= 0 && (a = Math.min(a, l));
        }), a < 1 / 0 && a >= 0 && (s = e.substring(0, a + 1));
      }
      if (this.state.top && (r = this.tokenizer.paragraph(s))) {
        let a = n.at(-1);
        i && a?.type === "paragraph" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(r), i = s.length !== e.length, e = e.substring(r.raw.length);
        continue;
      }
      if (r = this.tokenizer.text(e)) {
        e = e.substring(r.raw.length);
        let a = n.at(-1);
        a?.type === "text" ? (a.raw += (a.raw.endsWith(`
`) ? "" : `
`) + r.raw, a.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = a.text) : n.push(r);
        continue;
      }
      if (e) {
        let a = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(a);
          break;
        } else throw new Error(a);
      }
    }
    return this.state.top = !0, n;
  }
  inline(e, n = []) {
    return this.inlineQueue.push({ src: e, tokens: n }), n;
  }
  inlineTokens(e, n = []) {
    let i = e, r = null;
    if (this.tokens.links) {
      let l = Object.keys(this.tokens.links);
      if (l.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(i)) != null; ) l.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (i = i.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + i.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
    }
    for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(i)) != null; ) i = i.slice(0, r.index) + "++" + i.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
    let s;
    for (; (r = this.tokenizer.rules.inline.blockSkip.exec(i)) != null; ) s = r[2] ? r[2].length : 0, i = i.slice(0, r.index + s) + "[" + "a".repeat(r[0].length - s - 2) + "]" + i.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
    i = this.options.hooks?.emStrongMask?.call({ lexer: this }, i) ?? i;
    let a = !1, c = "";
    for (; e; ) {
      a || (c = ""), a = !1;
      let l;
      if (this.options.extensions?.inline?.some((u) => (l = u.call({ lexer: this }, e, n)) ? (e = e.substring(l.raw.length), n.push(l), !0) : !1)) continue;
      if (l = this.tokenizer.escape(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.tag(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.link(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.reflink(e, this.tokens.links)) {
        e = e.substring(l.raw.length);
        let u = n.at(-1);
        l.type === "text" && u?.type === "text" ? (u.raw += l.raw, u.text += l.text) : n.push(l);
        continue;
      }
      if (l = this.tokenizer.emStrong(e, i, c)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.codespan(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.br(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.del(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (l = this.tokenizer.autolink(e)) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      if (!this.state.inLink && (l = this.tokenizer.url(e))) {
        e = e.substring(l.raw.length), n.push(l);
        continue;
      }
      let h = e;
      if (this.options.extensions?.startInline) {
        let u = 1 / 0, _ = e.slice(1), E;
        this.options.extensions.startInline.forEach((v) => {
          E = v.call({ lexer: this }, _), typeof E == "number" && E >= 0 && (u = Math.min(u, E));
        }), u < 1 / 0 && u >= 0 && (h = e.substring(0, u + 1));
      }
      if (l = this.tokenizer.inlineText(h)) {
        e = e.substring(l.raw.length), l.raw.slice(-1) !== "_" && (c = l.raw.slice(-1)), a = !0;
        let u = n.at(-1);
        u?.type === "text" ? (u.raw += l.raw, u.text += l.text) : n.push(l);
        continue;
      }
      if (e) {
        let u = "Infinite loop on byte: " + e.charCodeAt(0);
        if (this.options.silent) {
          console.error(u);
          break;
        } else throw new Error(u);
      }
    }
    return n;
  }
}, mt = class {
  options;
  parser;
  constructor(t) {
    this.options = t || Me;
  }
  space(t) {
    return "";
  }
  code({ text: t, lang: e, escaped: n }) {
    let i = (e || "").match(V.notSpaceStart)?.[0], r = t.replace(V.endingNewline, "") + `
`;
    return i ? '<pre><code class="language-' + xe(i) + '">' + (n ? r : xe(r, !0)) + `</code></pre>
` : "<pre><code>" + (n ? r : xe(r, !0)) + `</code></pre>
`;
  }
  blockquote({ tokens: t }) {
    return `<blockquote>
${this.parser.parse(t)}</blockquote>
`;
  }
  html({ text: t }) {
    return t;
  }
  def(t) {
    return "";
  }
  heading({ tokens: t, depth: e }) {
    return `<h${e}>${this.parser.parseInline(t)}</h${e}>
`;
  }
  hr(t) {
    return `<hr>
`;
  }
  list(t) {
    let e = t.ordered, n = t.start, i = "";
    for (let a = 0; a < t.items.length; a++) {
      let c = t.items[a];
      i += this.listitem(c);
    }
    let r = e ? "ol" : "ul", s = e && n !== 1 ? ' start="' + n + '"' : "";
    return "<" + r + s + `>
` + i + "</" + r + `>
`;
  }
  listitem(t) {
    return `<li>${this.parser.parse(t.tokens)}</li>
`;
  }
  checkbox({ checked: t }) {
    return "<input " + (t ? 'checked="" ' : "") + 'disabled="" type="checkbox"> ';
  }
  paragraph({ tokens: t }) {
    return `<p>${this.parser.parseInline(t)}</p>
`;
  }
  table(t) {
    let e = "", n = "";
    for (let r = 0; r < t.header.length; r++) n += this.tablecell(t.header[r]);
    e += this.tablerow({ text: n });
    let i = "";
    for (let r = 0; r < t.rows.length; r++) {
      let s = t.rows[r];
      n = "";
      for (let a = 0; a < s.length; a++) n += this.tablecell(s[a]);
      i += this.tablerow({ text: n });
    }
    return i && (i = `<tbody>${i}</tbody>`), `<table>
<thead>
` + e + `</thead>
` + i + `</table>
`;
  }
  tablerow({ text: t }) {
    return `<tr>
${t}</tr>
`;
  }
  tablecell(t) {
    let e = this.parser.parseInline(t.tokens), n = t.header ? "th" : "td";
    return (t.align ? `<${n} align="${t.align}">` : `<${n}>`) + e + `</${n}>
`;
  }
  strong({ tokens: t }) {
    return `<strong>${this.parser.parseInline(t)}</strong>`;
  }
  em({ tokens: t }) {
    return `<em>${this.parser.parseInline(t)}</em>`;
  }
  codespan({ text: t }) {
    return `<code>${xe(t, !0)}</code>`;
  }
  br(t) {
    return "<br>";
  }
  del({ tokens: t }) {
    return `<del>${this.parser.parseInline(t)}</del>`;
  }
  link({ href: t, title: e, tokens: n }) {
    let i = this.parser.parseInline(n), r = An(t);
    if (r === null) return i;
    t = r;
    let s = '<a href="' + t + '"';
    return e && (s += ' title="' + xe(e) + '"'), s += ">" + i + "</a>", s;
  }
  image({ href: t, title: e, text: n, tokens: i }) {
    i && (n = this.parser.parseInline(i, this.parser.textRenderer));
    let r = An(t);
    if (r === null) return xe(n);
    t = r;
    let s = `<img src="${t}" alt="${n}"`;
    return e && (s += ` title="${xe(e)}"`), s += ">", s;
  }
  text(t) {
    return "tokens" in t && t.tokens ? this.parser.parseInline(t.tokens) : "escaped" in t && t.escaped ? t.text : xe(t.text);
  }
}, en = class {
  strong({ text: t }) {
    return t;
  }
  em({ text: t }) {
    return t;
  }
  codespan({ text: t }) {
    return t;
  }
  del({ text: t }) {
    return t;
  }
  html({ text: t }) {
    return t;
  }
  text({ text: t }) {
    return t;
  }
  link({ text: t }) {
    return "" + t;
  }
  image({ text: t }) {
    return "" + t;
  }
  br() {
    return "";
  }
  checkbox({ raw: t }) {
    return t;
  }
}, oe = class Bt {
  options;
  renderer;
  textRenderer;
  constructor(e) {
    this.options = e || Me, this.options.renderer = this.options.renderer || new mt(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new en();
  }
  static parse(e, n) {
    return new Bt(n).parse(e);
  }
  static parseInline(e, n) {
    return new Bt(n).parseInline(e);
  }
  parse(e) {
    let n = "";
    for (let i = 0; i < e.length; i++) {
      let r = e[i];
      if (this.options.extensions?.renderers?.[r.type]) {
        let a = r, c = this.options.extensions.renderers[a.type].call({ parser: this }, a);
        if (c !== !1 || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "def", "paragraph", "text"].includes(a.type)) {
          n += c || "";
          continue;
        }
      }
      let s = r;
      switch (s.type) {
        case "space": {
          n += this.renderer.space(s);
          break;
        }
        case "hr": {
          n += this.renderer.hr(s);
          break;
        }
        case "heading": {
          n += this.renderer.heading(s);
          break;
        }
        case "code": {
          n += this.renderer.code(s);
          break;
        }
        case "table": {
          n += this.renderer.table(s);
          break;
        }
        case "blockquote": {
          n += this.renderer.blockquote(s);
          break;
        }
        case "list": {
          n += this.renderer.list(s);
          break;
        }
        case "checkbox": {
          n += this.renderer.checkbox(s);
          break;
        }
        case "html": {
          n += this.renderer.html(s);
          break;
        }
        case "def": {
          n += this.renderer.def(s);
          break;
        }
        case "paragraph": {
          n += this.renderer.paragraph(s);
          break;
        }
        case "text": {
          n += this.renderer.text(s);
          break;
        }
        default: {
          let a = 'Token with "' + s.type + '" type was not found.';
          if (this.options.silent) return console.error(a), "";
          throw new Error(a);
        }
      }
    }
    return n;
  }
  parseInline(e, n = this.renderer) {
    let i = "";
    for (let r = 0; r < e.length; r++) {
      let s = e[r];
      if (this.options.extensions?.renderers?.[s.type]) {
        let c = this.options.extensions.renderers[s.type].call({ parser: this }, s);
        if (c !== !1 || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(s.type)) {
          i += c || "";
          continue;
        }
      }
      let a = s;
      switch (a.type) {
        case "escape": {
          i += n.text(a);
          break;
        }
        case "html": {
          i += n.html(a);
          break;
        }
        case "link": {
          i += n.link(a);
          break;
        }
        case "image": {
          i += n.image(a);
          break;
        }
        case "checkbox": {
          i += n.checkbox(a);
          break;
        }
        case "strong": {
          i += n.strong(a);
          break;
        }
        case "em": {
          i += n.em(a);
          break;
        }
        case "codespan": {
          i += n.codespan(a);
          break;
        }
        case "br": {
          i += n.br(a);
          break;
        }
        case "del": {
          i += n.del(a);
          break;
        }
        case "text": {
          i += n.text(a);
          break;
        }
        default: {
          let c = 'Token with "' + a.type + '" type was not found.';
          if (this.options.silent) return console.error(c), "";
          throw new Error(c);
        }
      }
    }
    return i;
  }
}, Qe = class {
  options;
  block;
  constructor(t) {
    this.options = t || Me;
  }
  static passThroughHooks = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens", "emStrongMask"]);
  static passThroughHooksRespectAsync = /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"]);
  preprocess(t) {
    return t;
  }
  postprocess(t) {
    return t;
  }
  processAllTokens(t) {
    return t;
  }
  emStrongMask(t) {
    return t;
  }
  provideLexer() {
    return this.block ? ae.lex : ae.lexInline;
  }
  provideParser() {
    return this.block ? oe.parse : oe.parseInline;
  }
}, lr = class {
  defaults = Zt();
  options = this.setOptions;
  parse = this.parseMarkdown(!0);
  parseInline = this.parseMarkdown(!1);
  Parser = oe;
  Renderer = mt;
  TextRenderer = en;
  Lexer = ae;
  Tokenizer = ft;
  Hooks = Qe;
  constructor(...t) {
    this.use(...t);
  }
  walkTokens(t, e) {
    let n = [];
    for (let i of t) switch (n = n.concat(e.call(this, i)), i.type) {
      case "table": {
        let r = i;
        for (let s of r.header) n = n.concat(this.walkTokens(s.tokens, e));
        for (let s of r.rows) for (let a of s) n = n.concat(this.walkTokens(a.tokens, e));
        break;
      }
      case "list": {
        let r = i;
        n = n.concat(this.walkTokens(r.items, e));
        break;
      }
      default: {
        let r = i;
        this.defaults.extensions?.childTokens?.[r.type] ? this.defaults.extensions.childTokens[r.type].forEach((s) => {
          let a = r[s].flat(1 / 0);
          n = n.concat(this.walkTokens(a, e));
        }) : r.tokens && (n = n.concat(this.walkTokens(r.tokens, e)));
      }
    }
    return n;
  }
  use(...t) {
    let e = this.defaults.extensions || { renderers: {}, childTokens: {} };
    return t.forEach((n) => {
      let i = { ...n };
      if (i.async = this.defaults.async || i.async || !1, n.extensions && (n.extensions.forEach((r) => {
        if (!r.name) throw new Error("extension name required");
        if ("renderer" in r) {
          let s = e.renderers[r.name];
          s ? e.renderers[r.name] = function(...a) {
            let c = r.renderer.apply(this, a);
            return c === !1 && (c = s.apply(this, a)), c;
          } : e.renderers[r.name] = r.renderer;
        }
        if ("tokenizer" in r) {
          if (!r.level || r.level !== "block" && r.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
          let s = e[r.level];
          s ? s.unshift(r.tokenizer) : e[r.level] = [r.tokenizer], r.start && (r.level === "block" ? e.startBlock ? e.startBlock.push(r.start) : e.startBlock = [r.start] : r.level === "inline" && (e.startInline ? e.startInline.push(r.start) : e.startInline = [r.start]));
        }
        "childTokens" in r && r.childTokens && (e.childTokens[r.name] = r.childTokens);
      }), i.extensions = e), n.renderer) {
        let r = this.defaults.renderer || new mt(this.defaults);
        for (let s in n.renderer) {
          if (!(s in r)) throw new Error(`renderer '${s}' does not exist`);
          if (["options", "parser"].includes(s)) continue;
          let a = s, c = n.renderer[a], l = r[a];
          r[a] = (...h) => {
            let u = c.apply(r, h);
            return u === !1 && (u = l.apply(r, h)), u || "";
          };
        }
        i.renderer = r;
      }
      if (n.tokenizer) {
        let r = this.defaults.tokenizer || new ft(this.defaults);
        for (let s in n.tokenizer) {
          if (!(s in r)) throw new Error(`tokenizer '${s}' does not exist`);
          if (["options", "rules", "lexer"].includes(s)) continue;
          let a = s, c = n.tokenizer[a], l = r[a];
          r[a] = (...h) => {
            let u = c.apply(r, h);
            return u === !1 && (u = l.apply(r, h)), u;
          };
        }
        i.tokenizer = r;
      }
      if (n.hooks) {
        let r = this.defaults.hooks || new Qe();
        for (let s in n.hooks) {
          if (!(s in r)) throw new Error(`hook '${s}' does not exist`);
          if (["options", "block"].includes(s)) continue;
          let a = s, c = n.hooks[a], l = r[a];
          Qe.passThroughHooks.has(s) ? r[a] = (h) => {
            if (this.defaults.async && Qe.passThroughHooksRespectAsync.has(s)) return (async () => {
              let _ = await c.call(r, h);
              return l.call(r, _);
            })();
            let u = c.call(r, h);
            return l.call(r, u);
          } : r[a] = (...h) => {
            if (this.defaults.async) return (async () => {
              let _ = await c.apply(r, h);
              return _ === !1 && (_ = await l.apply(r, h)), _;
            })();
            let u = c.apply(r, h);
            return u === !1 && (u = l.apply(r, h)), u;
          };
        }
        i.hooks = r;
      }
      if (n.walkTokens) {
        let r = this.defaults.walkTokens, s = n.walkTokens;
        i.walkTokens = function(a) {
          let c = [];
          return c.push(s.call(this, a)), r && (c = c.concat(r.call(this, a))), c;
        };
      }
      this.defaults = { ...this.defaults, ...i };
    }), this;
  }
  setOptions(t) {
    return this.defaults = { ...this.defaults, ...t }, this;
  }
  lexer(t, e) {
    return ae.lex(t, e ?? this.defaults);
  }
  parser(t, e) {
    return oe.parse(t, e ?? this.defaults);
  }
  parseMarkdown(t) {
    return (e, n) => {
      let i = { ...n }, r = { ...this.defaults, ...i }, s = this.onError(!!r.silent, !!r.async);
      if (this.defaults.async === !0 && i.async === !1) return s(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
      if (typeof e > "u" || e === null) return s(new Error("marked(): input parameter is undefined or null"));
      if (typeof e != "string") return s(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(e) + ", string expected"));
      if (r.hooks && (r.hooks.options = r, r.hooks.block = t), r.async) return (async () => {
        let a = r.hooks ? await r.hooks.preprocess(e) : e, c = await (r.hooks ? await r.hooks.provideLexer() : t ? ae.lex : ae.lexInline)(a, r), l = r.hooks ? await r.hooks.processAllTokens(c) : c;
        r.walkTokens && await Promise.all(this.walkTokens(l, r.walkTokens));
        let h = await (r.hooks ? await r.hooks.provideParser() : t ? oe.parse : oe.parseInline)(l, r);
        return r.hooks ? await r.hooks.postprocess(h) : h;
      })().catch(s);
      try {
        r.hooks && (e = r.hooks.preprocess(e));
        let a = (r.hooks ? r.hooks.provideLexer() : t ? ae.lex : ae.lexInline)(e, r);
        r.hooks && (a = r.hooks.processAllTokens(a)), r.walkTokens && this.walkTokens(a, r.walkTokens);
        let c = (r.hooks ? r.hooks.provideParser() : t ? oe.parse : oe.parseInline)(a, r);
        return r.hooks && (c = r.hooks.postprocess(c)), c;
      } catch (a) {
        return s(a);
      }
    };
  }
  onError(t, e) {
    return (n) => {
      if (n.message += `
Please report this to https://github.com/markedjs/marked.`, t) {
        let i = "<p>An error occurred:</p><pre>" + xe(n.message + "", !0) + "</pre>";
        return e ? Promise.resolve(i) : i;
      }
      if (e) return Promise.reject(n);
      throw n;
    };
  }
}, Oe = new lr();
function I(t, e) {
  return Oe.parse(t, e);
}
I.options = I.setOptions = function(t) {
  return Oe.setOptions(t), I.defaults = Oe.defaults, Qn(I.defaults), I;
};
I.getDefaults = Zt;
I.defaults = Me;
I.use = function(...t) {
  return Oe.use(...t), I.defaults = Oe.defaults, Qn(I.defaults), I;
};
I.walkTokens = function(t, e) {
  return Oe.walkTokens(t, e);
};
I.parseInline = Oe.parseInline;
I.Parser = oe;
I.parser = oe.parse;
I.Renderer = mt;
I.TextRenderer = en;
I.Lexer = ae;
I.lexer = ae.lex;
I.Tokenizer = ft;
I.Hooks = Qe;
I.parse = I;
I.options;
I.setOptions;
I.use;
I.walkTokens;
I.parseInline;
oe.parse;
ae.lex;
function Ri(t) {
  if (typeof t == "function" && (t = {
    highlight: t
  }), !t || typeof t.highlight != "function")
    throw new Error("Must provide highlight function");
  return typeof t.langPrefix != "string" && (t.langPrefix = "language-"), typeof t.emptyLangClass != "string" && (t.emptyLangClass = ""), {
    async: !!t.async,
    walkTokens(e) {
      if (e.type !== "code")
        return;
      const n = Rn(e.lang);
      if (t.async)
        return Promise.resolve(t.highlight(e.text, n, e.lang || "")).then(Nn(e));
      const i = t.highlight(e.text, n, e.lang || "");
      if (i instanceof Promise)
        throw new Error("markedHighlight is not set to async but the highlight function is async. Set the async option to true on markedHighlight to await the async highlight function.");
      Nn(e)(i);
    },
    useNewRenderer: !0,
    renderer: {
      code(e, n, i) {
        typeof e == "object" && (i = e.escaped, n = e.lang, e = e.text);
        const r = Rn(n), s = r ? t.langPrefix + Mn(r) : t.emptyLangClass, a = s ? ` class="${s}"` : "";
        return e = e.replace(/\n$/, ""), `<pre><code${a}>${i ? e : Mn(e, !0)}
</code></pre>`;
      }
    }
  };
}
function Rn(t) {
  return (t || "").match(/\S*/)[0];
}
function Nn(t) {
  return (e) => {
    typeof e == "string" && e !== t.text && (t.escaped = !0, t.text = e);
  };
}
const cr = /[&<>"']/, Ni = new RegExp(cr.source, "g"), ur = /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, Oi = new RegExp(ur.source, "g"), Mi = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;"
}, On = (t) => Mi[t];
function Mn(t, e) {
  if (e) {
    if (cr.test(t))
      return t.replace(Ni, On);
  } else if (ur.test(t))
    return t.replace(Oi, On);
  return t;
}
const {
  entries: hr,
  setPrototypeOf: Cn,
  isFrozen: Ci,
  getPrototypeOf: Ii,
  getOwnPropertyDescriptor: Li
} = Object;
let {
  freeze: J,
  seal: re,
  create: Ut
} = Object, {
  apply: Ht,
  construct: Ft
} = typeof Reflect < "u" && Reflect;
J || (J = function(e) {
  return e;
});
re || (re = function(e) {
  return e;
});
Ht || (Ht = function(e, n) {
  for (var i = arguments.length, r = new Array(i > 2 ? i - 2 : 0), s = 2; s < i; s++)
    r[s - 2] = arguments[s];
  return e.apply(n, r);
});
Ft || (Ft = function(e) {
  for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
    i[r - 1] = arguments[r];
  return new e(...i);
});
const ct = ee(Array.prototype.forEach), Di = ee(Array.prototype.lastIndexOf), In = ee(Array.prototype.pop), Ze = ee(Array.prototype.push), zi = ee(Array.prototype.splice), dt = ee(String.prototype.toLowerCase), Mt = ee(String.prototype.toString), Ct = ee(String.prototype.match), qe = ee(String.prototype.replace), Pi = ee(String.prototype.indexOf), ji = ee(String.prototype.trim), se = ee(Object.prototype.hasOwnProperty), Q = ee(RegExp.prototype.test), Ke = $i(TypeError);
function ee(t) {
  return function(e) {
    e instanceof RegExp && (e.lastIndex = 0);
    for (var n = arguments.length, i = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
      i[r - 1] = arguments[r];
    return Ht(t, e, i);
  };
}
function $i(t) {
  return function() {
    for (var e = arguments.length, n = new Array(e), i = 0; i < e; i++)
      n[i] = arguments[i];
    return Ft(t, n);
  };
}
function A(t, e) {
  let n = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : dt;
  Cn && Cn(t, null);
  let i = e.length;
  for (; i--; ) {
    let r = e[i];
    if (typeof r == "string") {
      const s = n(r);
      s !== r && (Ci(e) || (e[i] = s), r = s);
    }
    t[r] = !0;
  }
  return t;
}
function Bi(t) {
  for (let e = 0; e < t.length; e++)
    se(t, e) || (t[e] = null);
  return t;
}
function ge(t) {
  const e = Ut(null);
  for (const [n, i] of hr(t))
    se(t, n) && (Array.isArray(i) ? e[n] = Bi(i) : i && typeof i == "object" && i.constructor === Object ? e[n] = ge(i) : e[n] = i);
  return e;
}
function Xe(t, e) {
  for (; t !== null; ) {
    const i = Li(t, e);
    if (i) {
      if (i.get)
        return ee(i.get);
      if (typeof i.value == "function")
        return ee(i.value);
    }
    t = Ii(t);
  }
  function n() {
    return null;
  }
  return n;
}
const Ln = J(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "search", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]), It = J(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "enterkeyhint", "exportparts", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "inputmode", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "part", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]), Lt = J(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]), Ui = J(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]), Dt = J(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]), Hi = J(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]), Dn = J(["#text"]), zn = J(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "exportparts", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inert", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "part", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "slot", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]), zt = J(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mask-type", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]), Pn = J(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]), ut = J(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]), Fi = re(/\{\{[\w\W]*|[\w\W]*\}\}/gm), Gi = re(/<%[\w\W]*|[\w\W]*%>/gm), Wi = re(/\$\{[\w\W]*/gm), Zi = re(/^data-[\-\w.\u00B7-\uFFFF]+$/), qi = re(/^aria-[\-\w]+$/), pr = re(
  /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|matrix):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
  // eslint-disable-line no-useless-escape
), Ki = re(/^(?:\w+script|data):/i), Xi = re(
  /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
  // eslint-disable-line no-control-regex
), dr = re(/^html$/i), Yi = re(/^[a-z][.\w]*(-[.\w]+)+$/i);
var jn = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  ARIA_ATTR: qi,
  ATTR_WHITESPACE: Xi,
  CUSTOM_ELEMENT: Yi,
  DATA_ATTR: Zi,
  DOCTYPE_NAME: dr,
  ERB_EXPR: Gi,
  IS_ALLOWED_URI: pr,
  IS_SCRIPT_OR_DATA: Ki,
  MUSTACHE_EXPR: Fi,
  TMPLIT_EXPR: Wi
});
const Ye = {
  element: 1,
  text: 3,
  // Deprecated
  progressingInstruction: 7,
  comment: 8,
  document: 9
}, Qi = function() {
  return typeof window > "u" ? null : window;
}, Vi = function(e, n) {
  if (typeof e != "object" || typeof e.createPolicy != "function")
    return null;
  let i = null;
  const r = "data-tt-policy-suffix";
  n && n.hasAttribute(r) && (i = n.getAttribute(r));
  const s = "dompurify" + (i ? "#" + i : "");
  try {
    return e.createPolicy(s, {
      createHTML(a) {
        return a;
      },
      createScriptURL(a) {
        return a;
      }
    });
  } catch {
    return console.warn("TrustedTypes policy " + s + " could not be created."), null;
  }
}, $n = function() {
  return {
    afterSanitizeAttributes: [],
    afterSanitizeElements: [],
    afterSanitizeShadowDOM: [],
    beforeSanitizeAttributes: [],
    beforeSanitizeElements: [],
    beforeSanitizeShadowDOM: [],
    uponSanitizeAttribute: [],
    uponSanitizeElement: [],
    uponSanitizeShadowNode: []
  };
};
function gr() {
  let t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : Qi();
  const e = (k) => gr(k);
  if (e.version = "3.3.1", e.removed = [], !t || !t.document || t.document.nodeType !== Ye.document || !t.Element)
    return e.isSupported = !1, e;
  let {
    document: n
  } = t;
  const i = n, r = i.currentScript, {
    DocumentFragment: s,
    HTMLTemplateElement: a,
    Node: c,
    Element: l,
    NodeFilter: h,
    NamedNodeMap: u = t.NamedNodeMap || t.MozNamedAttrMap,
    HTMLFormElement: _,
    DOMParser: E,
    trustedTypes: v
  } = t, y = l.prototype, L = Xe(y, "cloneNode"), le = Xe(y, "remove"), ie = Xe(y, "nextSibling"), Y = Xe(y, "childNodes"), d = Xe(y, "parentNode");
  if (typeof a == "function") {
    const k = n.createElement("template");
    k.content && k.content.ownerDocument && (n = k.content.ownerDocument);
  }
  let g, w = "";
  const {
    implementation: z,
    createNodeIterator: P,
    createDocumentFragment: $,
    getElementsByTagName: U
  } = n, {
    importNode: G
  } = i;
  let T = $n();
  e.isSupported = typeof hr == "function" && typeof d == "function" && z && z.createHTMLDocument !== void 0;
  const {
    MUSTACHE_EXPR: B,
    ERB_EXPR: ce,
    TMPLIT_EXPR: fe,
    DATA_ATTR: Te,
    ARIA_ATTR: ue,
    IS_SCRIPT_OR_DATA: Ae,
    ATTR_WHITESPACE: K,
    CUSTOM_ELEMENT: Be
  } = jn;
  let {
    IS_ALLOWED_URI: we
  } = jn, m = null;
  const Ue = A({}, [...Ln, ...It, ...Lt, ...Dt, ...Dn]);
  let S = null;
  const C = A({}, [...zn, ...zt, ...Pn, ...ut]);
  let D = Object.seal(Ut(null, {
    tagNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeNameCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    allowCustomizedBuiltInElements: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: !1
    }
  })), ne = null, Se = null;
  const he = Object.seal(Ut(null, {
    tagCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    },
    attributeCheck: {
      writable: !0,
      configurable: !1,
      enumerable: !0,
      value: null
    }
  }));
  let f = !0, x = !0, M = !1, O = !0, R = !1, H = !0, Z = !1, ve = !1, _e = !1, Ie = !1, nt = !1, rt = !1, sn = !0, an = !1;
  const Dr = "user-content-";
  let yt = !0, He = !1, Le = {}, pe = null;
  const Tt = A({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
  let on = null;
  const ln = A({}, ["audio", "video", "img", "source", "image", "track"]);
  let At = null;
  const cn = A({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]), it = "http://www.w3.org/1998/Math/MathML", st = "http://www.w3.org/2000/svg", me = "http://www.w3.org/1999/xhtml";
  let De = me, St = !1, vt = null;
  const zr = A({}, [it, st, me], Mt);
  let at = A({}, ["mi", "mo", "mn", "ms", "mtext"]), ot = A({}, ["annotation-xml"]);
  const Pr = A({}, ["title", "style", "font", "a", "script"]);
  let Fe = null;
  const jr = ["application/xhtml+xml", "text/html"], $r = "text/html";
  let W = null, ze = null;
  const Br = n.createElement("form"), un = function(o) {
    return o instanceof RegExp || o instanceof Function;
  }, Rt = function() {
    let o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    if (!(ze && ze === o)) {
      if ((!o || typeof o != "object") && (o = {}), o = ge(o), Fe = // eslint-disable-next-line unicorn/prefer-includes
      jr.indexOf(o.PARSER_MEDIA_TYPE) === -1 ? $r : o.PARSER_MEDIA_TYPE, W = Fe === "application/xhtml+xml" ? Mt : dt, m = se(o, "ALLOWED_TAGS") ? A({}, o.ALLOWED_TAGS, W) : Ue, S = se(o, "ALLOWED_ATTR") ? A({}, o.ALLOWED_ATTR, W) : C, vt = se(o, "ALLOWED_NAMESPACES") ? A({}, o.ALLOWED_NAMESPACES, Mt) : zr, At = se(o, "ADD_URI_SAFE_ATTR") ? A(ge(cn), o.ADD_URI_SAFE_ATTR, W) : cn, on = se(o, "ADD_DATA_URI_TAGS") ? A(ge(ln), o.ADD_DATA_URI_TAGS, W) : ln, pe = se(o, "FORBID_CONTENTS") ? A({}, o.FORBID_CONTENTS, W) : Tt, ne = se(o, "FORBID_TAGS") ? A({}, o.FORBID_TAGS, W) : ge({}), Se = se(o, "FORBID_ATTR") ? A({}, o.FORBID_ATTR, W) : ge({}), Le = se(o, "USE_PROFILES") ? o.USE_PROFILES : !1, f = o.ALLOW_ARIA_ATTR !== !1, x = o.ALLOW_DATA_ATTR !== !1, M = o.ALLOW_UNKNOWN_PROTOCOLS || !1, O = o.ALLOW_SELF_CLOSE_IN_ATTR !== !1, R = o.SAFE_FOR_TEMPLATES || !1, H = o.SAFE_FOR_XML !== !1, Z = o.WHOLE_DOCUMENT || !1, Ie = o.RETURN_DOM || !1, nt = o.RETURN_DOM_FRAGMENT || !1, rt = o.RETURN_TRUSTED_TYPE || !1, _e = o.FORCE_BODY || !1, sn = o.SANITIZE_DOM !== !1, an = o.SANITIZE_NAMED_PROPS || !1, yt = o.KEEP_CONTENT !== !1, He = o.IN_PLACE || !1, we = o.ALLOWED_URI_REGEXP || pr, De = o.NAMESPACE || me, at = o.MATHML_TEXT_INTEGRATION_POINTS || at, ot = o.HTML_INTEGRATION_POINTS || ot, D = o.CUSTOM_ELEMENT_HANDLING || {}, o.CUSTOM_ELEMENT_HANDLING && un(o.CUSTOM_ELEMENT_HANDLING.tagNameCheck) && (D.tagNameCheck = o.CUSTOM_ELEMENT_HANDLING.tagNameCheck), o.CUSTOM_ELEMENT_HANDLING && un(o.CUSTOM_ELEMENT_HANDLING.attributeNameCheck) && (D.attributeNameCheck = o.CUSTOM_ELEMENT_HANDLING.attributeNameCheck), o.CUSTOM_ELEMENT_HANDLING && typeof o.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements == "boolean" && (D.allowCustomizedBuiltInElements = o.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements), R && (x = !1), nt && (Ie = !0), Le && (m = A({}, Dn), S = [], Le.html === !0 && (A(m, Ln), A(S, zn)), Le.svg === !0 && (A(m, It), A(S, zt), A(S, ut)), Le.svgFilters === !0 && (A(m, Lt), A(S, zt), A(S, ut)), Le.mathMl === !0 && (A(m, Dt), A(S, Pn), A(S, ut))), o.ADD_TAGS && (typeof o.ADD_TAGS == "function" ? he.tagCheck = o.ADD_TAGS : (m === Ue && (m = ge(m)), A(m, o.ADD_TAGS, W))), o.ADD_ATTR && (typeof o.ADD_ATTR == "function" ? he.attributeCheck = o.ADD_ATTR : (S === C && (S = ge(S)), A(S, o.ADD_ATTR, W))), o.ADD_URI_SAFE_ATTR && A(At, o.ADD_URI_SAFE_ATTR, W), o.FORBID_CONTENTS && (pe === Tt && (pe = ge(pe)), A(pe, o.FORBID_CONTENTS, W)), o.ADD_FORBID_CONTENTS && (pe === Tt && (pe = ge(pe)), A(pe, o.ADD_FORBID_CONTENTS, W)), yt && (m["#text"] = !0), Z && A(m, ["html", "head", "body"]), m.table && (A(m, ["tbody"]), delete ne.tbody), o.TRUSTED_TYPES_POLICY) {
        if (typeof o.TRUSTED_TYPES_POLICY.createHTML != "function")
          throw Ke('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        if (typeof o.TRUSTED_TYPES_POLICY.createScriptURL != "function")
          throw Ke('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        g = o.TRUSTED_TYPES_POLICY, w = g.createHTML("");
      } else
        g === void 0 && (g = Vi(v, r)), g !== null && typeof w == "string" && (w = g.createHTML(""));
      J && J(o), ze = o;
    }
  }, hn = A({}, [...It, ...Lt, ...Ui]), pn = A({}, [...Dt, ...Hi]), Ur = function(o) {
    let p = d(o);
    (!p || !p.tagName) && (p = {
      namespaceURI: De,
      tagName: "template"
    });
    const b = dt(o.tagName), j = dt(p.tagName);
    return vt[o.namespaceURI] ? o.namespaceURI === st ? p.namespaceURI === me ? b === "svg" : p.namespaceURI === it ? b === "svg" && (j === "annotation-xml" || at[j]) : !!hn[b] : o.namespaceURI === it ? p.namespaceURI === me ? b === "math" : p.namespaceURI === st ? b === "math" && ot[j] : !!pn[b] : o.namespaceURI === me ? p.namespaceURI === st && !ot[j] || p.namespaceURI === it && !at[j] ? !1 : !pn[b] && (Pr[b] || !hn[b]) : !!(Fe === "application/xhtml+xml" && vt[o.namespaceURI]) : !1;
  }, de = function(o) {
    Ze(e.removed, {
      element: o
    });
    try {
      d(o).removeChild(o);
    } catch {
      le(o);
    }
  }, Re = function(o, p) {
    try {
      Ze(e.removed, {
        attribute: p.getAttributeNode(o),
        from: p
      });
    } catch {
      Ze(e.removed, {
        attribute: null,
        from: p
      });
    }
    if (p.removeAttribute(o), o === "is")
      if (Ie || nt)
        try {
          de(p);
        } catch {
        }
      else
        try {
          p.setAttribute(o, "");
        } catch {
        }
  }, dn = function(o) {
    let p = null, b = null;
    if (_e)
      o = "<remove></remove>" + o;
    else {
      const F = Ct(o, /^[\r\n\t ]+/);
      b = F && F[0];
    }
    Fe === "application/xhtml+xml" && De === me && (o = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + o + "</body></html>");
    const j = g ? g.createHTML(o) : o;
    if (De === me)
      try {
        p = new E().parseFromString(j, Fe);
      } catch {
      }
    if (!p || !p.documentElement) {
      p = z.createDocument(De, "template", null);
      try {
        p.documentElement.innerHTML = St ? w : j;
      } catch {
      }
    }
    const X = p.body || p.documentElement;
    return o && b && X.insertBefore(n.createTextNode(b), X.childNodes[0] || null), De === me ? U.call(p, Z ? "html" : "body")[0] : Z ? p.documentElement : X;
  }, gn = function(o) {
    return P.call(
      o.ownerDocument || o,
      o,
      // eslint-disable-next-line no-bitwise
      h.SHOW_ELEMENT | h.SHOW_COMMENT | h.SHOW_TEXT | h.SHOW_PROCESSING_INSTRUCTION | h.SHOW_CDATA_SECTION,
      null
    );
  }, Nt = function(o) {
    return o instanceof _ && (typeof o.nodeName != "string" || typeof o.textContent != "string" || typeof o.removeChild != "function" || !(o.attributes instanceof u) || typeof o.removeAttribute != "function" || typeof o.setAttribute != "function" || typeof o.namespaceURI != "string" || typeof o.insertBefore != "function" || typeof o.hasChildNodes != "function");
  }, fn = function(o) {
    return typeof c == "function" && o instanceof c;
  };
  function be(k, o, p) {
    ct(k, (b) => {
      b.call(e, o, p, ze);
    });
  }
  const mn = function(o) {
    let p = null;
    if (be(T.beforeSanitizeElements, o, null), Nt(o))
      return de(o), !0;
    const b = W(o.nodeName);
    if (be(T.uponSanitizeElement, o, {
      tagName: b,
      allowedTags: m
    }), H && o.hasChildNodes() && !fn(o.firstElementChild) && Q(/<[/\w!]/g, o.innerHTML) && Q(/<[/\w!]/g, o.textContent) || o.nodeType === Ye.progressingInstruction || H && o.nodeType === Ye.comment && Q(/<[/\w]/g, o.data))
      return de(o), !0;
    if (!(he.tagCheck instanceof Function && he.tagCheck(b)) && (!m[b] || ne[b])) {
      if (!ne[b] && kn(b) && (D.tagNameCheck instanceof RegExp && Q(D.tagNameCheck, b) || D.tagNameCheck instanceof Function && D.tagNameCheck(b)))
        return !1;
      if (yt && !pe[b]) {
        const j = d(o) || o.parentNode, X = Y(o) || o.childNodes;
        if (X && j) {
          const F = X.length;
          for (let te = F - 1; te >= 0; --te) {
            const ke = L(X[te], !0);
            ke.__removalCount = (o.__removalCount || 0) + 1, j.insertBefore(ke, ie(o));
          }
        }
      }
      return de(o), !0;
    }
    return o instanceof l && !Ur(o) || (b === "noscript" || b === "noembed" || b === "noframes") && Q(/<\/no(script|embed|frames)/i, o.innerHTML) ? (de(o), !0) : (R && o.nodeType === Ye.text && (p = o.textContent, ct([B, ce, fe], (j) => {
      p = qe(p, j, " ");
    }), o.textContent !== p && (Ze(e.removed, {
      element: o.cloneNode()
    }), o.textContent = p)), be(T.afterSanitizeElements, o, null), !1);
  }, bn = function(o, p, b) {
    if (sn && (p === "id" || p === "name") && (b in n || b in Br))
      return !1;
    if (!(x && !Se[p] && Q(Te, p))) {
      if (!(f && Q(ue, p))) {
        if (!(he.attributeCheck instanceof Function && he.attributeCheck(p, o))) {
          if (!S[p] || Se[p]) {
            if (
              // First condition does a very basic check if a) it's basically a valid custom element tagname AND
              // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
              !(kn(o) && (D.tagNameCheck instanceof RegExp && Q(D.tagNameCheck, o) || D.tagNameCheck instanceof Function && D.tagNameCheck(o)) && (D.attributeNameCheck instanceof RegExp && Q(D.attributeNameCheck, p) || D.attributeNameCheck instanceof Function && D.attributeNameCheck(p, o)) || // Alternative, second condition checks if it's an `is`-attribute, AND
              // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
              p === "is" && D.allowCustomizedBuiltInElements && (D.tagNameCheck instanceof RegExp && Q(D.tagNameCheck, b) || D.tagNameCheck instanceof Function && D.tagNameCheck(b)))
            ) return !1;
          } else if (!At[p]) {
            if (!Q(we, qe(b, K, ""))) {
              if (!((p === "src" || p === "xlink:href" || p === "href") && o !== "script" && Pi(b, "data:") === 0 && on[o])) {
                if (!(M && !Q(Ae, qe(b, K, "")))) {
                  if (b)
                    return !1;
                }
              }
            }
          }
        }
      }
    }
    return !0;
  }, kn = function(o) {
    return o !== "annotation-xml" && Ct(o, Be);
  }, xn = function(o) {
    be(T.beforeSanitizeAttributes, o, null);
    const {
      attributes: p
    } = o;
    if (!p || Nt(o))
      return;
    const b = {
      attrName: "",
      attrValue: "",
      keepAttr: !0,
      allowedAttributes: S,
      forceKeepAttr: void 0
    };
    let j = p.length;
    for (; j--; ) {
      const X = p[j], {
        name: F,
        namespaceURI: te,
        value: ke
      } = X, Pe = W(F), Ot = ke;
      let q = F === "value" ? Ot : ji(Ot);
      if (b.attrName = Pe, b.attrValue = q, b.keepAttr = !0, b.forceKeepAttr = void 0, be(T.uponSanitizeAttribute, o, b), q = b.attrValue, an && (Pe === "id" || Pe === "name") && (Re(F, o), q = Dr + q), H && Q(/((--!?|])>)|<\/(style|title|textarea)/i, q)) {
        Re(F, o);
        continue;
      }
      if (Pe === "attributename" && Ct(q, "href")) {
        Re(F, o);
        continue;
      }
      if (b.forceKeepAttr)
        continue;
      if (!b.keepAttr) {
        Re(F, o);
        continue;
      }
      if (!O && Q(/\/>/i, q)) {
        Re(F, o);
        continue;
      }
      R && ct([B, ce, fe], (_n) => {
        q = qe(q, _n, " ");
      });
      const wn = W(o.nodeName);
      if (!bn(wn, Pe, q)) {
        Re(F, o);
        continue;
      }
      if (g && typeof v == "object" && typeof v.getAttributeType == "function" && !te)
        switch (v.getAttributeType(wn, Pe)) {
          case "TrustedHTML": {
            q = g.createHTML(q);
            break;
          }
          case "TrustedScriptURL": {
            q = g.createScriptURL(q);
            break;
          }
        }
      if (q !== Ot)
        try {
          te ? o.setAttributeNS(te, F, q) : o.setAttribute(F, q), Nt(o) ? de(o) : In(e.removed);
        } catch {
          Re(F, o);
        }
    }
    be(T.afterSanitizeAttributes, o, null);
  }, Hr = function k(o) {
    let p = null;
    const b = gn(o);
    for (be(T.beforeSanitizeShadowDOM, o, null); p = b.nextNode(); )
      be(T.uponSanitizeShadowNode, p, null), mn(p), xn(p), p.content instanceof s && k(p.content);
    be(T.afterSanitizeShadowDOM, o, null);
  };
  return e.sanitize = function(k) {
    let o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, p = null, b = null, j = null, X = null;
    if (St = !k, St && (k = "<!-->"), typeof k != "string" && !fn(k))
      if (typeof k.toString == "function") {
        if (k = k.toString(), typeof k != "string")
          throw Ke("dirty is not a string, aborting");
      } else
        throw Ke("toString is not a function");
    if (!e.isSupported)
      return k;
    if (ve || Rt(o), e.removed = [], typeof k == "string" && (He = !1), He) {
      if (k.nodeName) {
        const ke = W(k.nodeName);
        if (!m[ke] || ne[ke])
          throw Ke("root node is forbidden and cannot be sanitized in-place");
      }
    } else if (k instanceof c)
      p = dn("<!---->"), b = p.ownerDocument.importNode(k, !0), b.nodeType === Ye.element && b.nodeName === "BODY" || b.nodeName === "HTML" ? p = b : p.appendChild(b);
    else {
      if (!Ie && !R && !Z && // eslint-disable-next-line unicorn/prefer-includes
      k.indexOf("<") === -1)
        return g && rt ? g.createHTML(k) : k;
      if (p = dn(k), !p)
        return Ie ? null : rt ? w : "";
    }
    p && _e && de(p.firstChild);
    const F = gn(He ? k : p);
    for (; j = F.nextNode(); )
      mn(j), xn(j), j.content instanceof s && Hr(j.content);
    if (He)
      return k;
    if (Ie) {
      if (nt)
        for (X = $.call(p.ownerDocument); p.firstChild; )
          X.appendChild(p.firstChild);
      else
        X = p;
      return (S.shadowroot || S.shadowrootmode) && (X = G.call(i, X, !0)), X;
    }
    let te = Z ? p.outerHTML : p.innerHTML;
    return Z && m["!doctype"] && p.ownerDocument && p.ownerDocument.doctype && p.ownerDocument.doctype.name && Q(dr, p.ownerDocument.doctype.name) && (te = "<!DOCTYPE " + p.ownerDocument.doctype.name + `>
` + te), R && ct([B, ce, fe], (ke) => {
      te = qe(te, ke, " ");
    }), g && rt ? g.createHTML(te) : te;
  }, e.setConfig = function() {
    let k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Rt(k), ve = !0;
  }, e.clearConfig = function() {
    ze = null, ve = !1;
  }, e.isValidAttribute = function(k, o, p) {
    ze || Rt({});
    const b = W(k), j = W(o);
    return bn(b, j, p);
  }, e.addHook = function(k, o) {
    typeof o == "function" && Ze(T[k], o);
  }, e.removeHook = function(k, o) {
    if (o !== void 0) {
      const p = Di(T[k], o);
      return p === -1 ? void 0 : zi(T[k], p, 1)[0];
    }
    return In(T[k]);
  }, e.removeHooks = function(k) {
    T[k] = [];
  }, e.removeAllHooks = function() {
    T = $n();
  }, e;
}
var Ji = gr();
const es = (
  /* css */
  `
/* a11y-light theme */
/* Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css */
/* @author: ericwbailey */

/* Comment */
.hljs-comment, .hljs-quote {
  color: #666;
}

/* Red */
.hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion {
  color: #d91e18;
}

/* Orange */
.hljs-number, .hljs-built_in, .hljs-builtin-name, .hljs-literal, .hljs-type, .hljs-params, .hljs-meta, .hljs-link {
  color: #aa5d00;
}

/* Yellow */
.hljs-attribute {
  color: #aa5d00;
}

/* Green */
.hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition {
  color: #008000;
}

/* Blue */
.hljs-title, .hljs-section {
  color: #007faa;
}

/* Purple */
.hljs-keyword, .hljs-selector-tag {
  color: #c928a1;
}

.hljs {
  display: block;
  overflow-x: auto;
  background: #fefefe;
  color: #545454;
  padding: 0.5em;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

@media screen and (-ms-high-contrast: active) {
  .hljs-addition, .hljs-attribute, .hljs-built_in, .hljs-builtin-name, .hljs-bullet, .hljs-comment, .hljs-link, .hljs-literal, .hljs-meta, .hljs-number, .hljs-params, .hljs-string, .hljs-symbol, .hljs-type, .hljs-quote {
    color: highlight;
  }
  .hljs-keyword, .hljs-selector-tag {
      font-weight: bold;
  }
}
`
), ts = (
  /* css */
  `
/* a11y-dark theme */
/* Based on the Tomorrow Night Eighties theme: https://github.com/isagalaev/highlight.js/blob/master/src/styles/tomorrow-night-eighties.css */
/* @author: ericwbailey */

/* Comment */
.hljs-comment, .hljs-quote {
  color: #d4d0ab;
}

/* Red */
.hljs-variable, .hljs-template-variable, .hljs-tag, .hljs-name, .hljs-selector-id, .hljs-selector-class, .hljs-regexp, .hljs-deletion {
  color: #ffa07a;
}

/* Orange */
.hljs-number, .hljs-built_in, .hljs-builtin-name, .hljs-literal, .hljs-type, .hljs-params, .hljs-meta, .hljs-link {
  color: #f5ab35;
}

/* Yellow */
.hljs-attribute {
  color: #ffd700;
}

/* Green */
.hljs-string, .hljs-symbol, .hljs-bullet, .hljs-addition {
  color: #abe338;
}

/* Blue */
.hljs-title, .hljs-section {
  color: #00e0e0;
}

/* Purple */
.hljs-keyword, .hljs-selector-tag {
  color: #dcc6e0;
}

.hljs {
  display: block;
  overflow-x: auto;
  background: #2b2b2b;
  color: #f8f8f2;
  padding: 0.5em;
}

.hljs-emphasis {
  font-style: italic;
}

.hljs-strong {
  font-weight: bold;
}

@media screen and (-ms-high-contrast: active) {
  .hljs-addition, .hljs-attribute, .hljs-built_in, .hljs-builtin-name, .hljs-bullet, .hljs-comment, .hljs-link, .hljs-literal, .hljs-meta, .hljs-number, .hljs-params, .hljs-string, .hljs-symbol, .hljs-type, .hljs-quote {
    color: highlight;
  }
  .hljs-keyword, .hljs-selector-tag {
    font-weight: bold;
  }
}
`
);
function fr(t) {
  return t instanceof Map ? t.clear = t.delete = t.set = () => {
    throw Error("map is read-only");
  } : t instanceof Set && (t.add = t.clear = t.delete = () => {
    throw Error("set is read-only");
  }), Object.freeze(t), Object.getOwnPropertyNames(t).forEach(((e) => {
    const n = t[e], i = typeof n;
    i !== "object" && i !== "function" || Object.isFrozen(n) || fr(n);
  })), t;
}
class Bn {
  constructor(e) {
    e.data === void 0 && (e.data = {}), this.data = e.data, this.isMatchIgnored = !1;
  }
  ignoreMatch() {
    this.isMatchIgnored = !0;
  }
}
function mr(t) {
  return t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
}
function Ee(t, ...e) {
  const n = /* @__PURE__ */ Object.create(null);
  for (const i in t) n[i] = t[i];
  return e.forEach(((i) => {
    for (const r in i) n[r] = i[r];
  })), n;
}
const Un = (t) => !!t.scope, ns = (t, { prefix: e }) => {
  if (t.startsWith("language:")) return t.replace("language:", "language-");
  if (t.includes(".")) {
    const n = t.split(".");
    return [`${e}${n.shift()}`, ...n.map(((i, r) => `${i}${"_".repeat(r + 1)}`))].join(" ");
  }
  return `${e}${t}`;
};
class rs {
  constructor(e, n) {
    this.buffer = "", this.classPrefix = n.classPrefix, e.walk(this);
  }
  addText(e) {
    this.buffer += mr(e);
  }
  openNode(e) {
    if (!Un(e)) return;
    const n = ns(e.scope, { prefix: this.classPrefix });
    this.span(n);
  }
  closeNode(e) {
    Un(e) && (this.buffer += "</span>");
  }
  value() {
    return this.buffer;
  }
  span(e) {
    this.buffer += `<span class="${e}">`;
  }
}
const Hn = (t = {}) => {
  const e = { children: [] };
  return Object.assign(e, t), e;
};
class tn {
  constructor() {
    this.rootNode = Hn(), this.stack = [this.rootNode];
  }
  get top() {
    return this.stack[this.stack.length - 1];
  }
  get root() {
    return this.rootNode;
  }
  add(e) {
    this.top.children.push(e);
  }
  openNode(e) {
    const n = Hn({ scope: e });
    this.add(n), this.stack.push(n);
  }
  closeNode() {
    if (this.stack.length > 1) return this.stack.pop();
  }
  closeAllNodes() {
    for (; this.closeNode(); ) ;
  }
  toJSON() {
    return JSON.stringify(this.rootNode, null, 4);
  }
  walk(e) {
    return this.constructor._walk(e, this.rootNode);
  }
  static _walk(e, n) {
    return typeof n == "string" ? e.addText(n) : n.children && (e.openNode(n), n.children.forEach(((i) => this._walk(e, i))), e.closeNode(n)), e;
  }
  static _collapse(e) {
    typeof e != "string" && e.children && (e.children.every(((n) => typeof n == "string")) ? e.children = [e.children.join("")] : e.children.forEach(((n) => {
      tn._collapse(n);
    })));
  }
}
class is extends tn {
  constructor(e) {
    super(), this.options = e;
  }
  addText(e) {
    e !== "" && this.add(e);
  }
  startScope(e) {
    this.openNode(e);
  }
  endScope() {
    this.closeNode();
  }
  __addSublanguage(e, n) {
    const i = e.root;
    n && (i.scope = "language:" + n), this.add(i);
  }
  toHTML() {
    return new rs(this, this.options).value();
  }
  finalize() {
    return this.closeAllNodes(), !0;
  }
}
function Je(t) {
  return t ? typeof t == "string" ? t : t.source : null;
}
function br(t) {
  return Ce("(?=", t, ")");
}
function ss(t) {
  return Ce("(?:", t, ")*");
}
function as(t) {
  return Ce("(?:", t, ")?");
}
function Ce(...t) {
  return t.map(((e) => Je(e))).join("");
}
function nn(...t) {
  return "(" + (((n) => {
    const i = n[n.length - 1];
    return typeof i == "object" && i.constructor === Object ? (n.splice(n.length - 1, 1), i) : {};
  })(t).capture ? "" : "?:") + t.map(((n) => Je(n))).join("|") + ")";
}
function kr(t) {
  return RegExp(t.toString() + "|").exec("").length - 1;
}
const os = /\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;
function Gt(t, { joinWith: e }) {
  let n = 0;
  return t.map(((i) => {
    n += 1;
    const r = n;
    let s = Je(i), a = "";
    for (; s.length > 0; ) {
      const c = os.exec(s);
      if (!c) {
        a += s;
        break;
      }
      a += s.substring(0, c.index), s = s.substring(c.index + c[0].length), c[0][0] === "\\" && c[1] ? a += "\\" + (Number(c[1]) + r) : (a += c[0], c[0] === "(" && n++);
    }
    return a;
  })).map(((i) => `(${i})`)).join(e);
}
const ls = /\b\B/, xr = "[a-zA-Z]\\w*", wr = "\\b\\d+(\\.\\d+)?", _r = "(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)", cs = "!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~", us = (t = {}) => {
  const e = /^#![ ]*\//;
  return t.binary && (t.begin = Ce(e, /.*\b/, t.binary, /\b.*/)), Ee({ scope: "meta", begin: e, end: /$/, relevance: 0, "on:begin": (n, i) => {
    n.index !== 0 && i.ignoreMatch();
  } }, t);
}, et = {
  begin: "\\\\[\\s\\S]",
  relevance: 0
}, hs = {
  scope: "string",
  begin: "'",
  end: "'",
  illegal: "\\n",
  contains: [et]
}, ps = {
  scope: "string",
  begin: '"',
  end: '"',
  illegal: "\\n",
  contains: [et]
}, ds = {
  begin: /\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
}, Et = (t, e, n = {}) => {
  const i = Ee({
    scope: "comment",
    begin: t,
    end: e,
    contains: []
  }, n);
  i.contains.push({
    scope: "doctag",
    begin: "[ ]*(?=(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):)",
    end: /(TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):/,
    excludeBegin: !0,
    relevance: 0
  });
  const r = nn("I", "a", "is", "so", "us", "to", "at", "if", "in", "it", "on", /[A-Za-z]+['](d|ve|re|ll|t|s|n)/, /[A-Za-z]+[-][a-z]+/, /[A-Za-z][a-z]{2,}/);
  return i.contains.push({
    begin: Ce(/[ ]+/, "(", r, /[.]?[:]?([.][ ]|[ ])/, "){3}")
  }), i;
}, gs = Et("//", "$"), fs = Et("/\\*", "\\*/"), ms = Et("#", "$"), bs = {
  scope: "number",
  begin: wr,
  relevance: 0
}, ks = {
  scope: "number",
  begin: _r,
  relevance: 0
}, xs = {
  scope: "number",
  begin: "\\b(0b[01]+)",
  relevance: 0
}, ws = {
  scope: "regexp",
  begin: /\/(?=[^/\n]*\/)/,
  end: /\/[gimuy]*/,
  contains: [et, {
    begin: /\[/,
    end: /\]/,
    relevance: 0,
    contains: [et]
  }]
}, _s = {
  scope: "title",
  begin: xr,
  relevance: 0
}, Es = {
  scope: "title",
  begin: "[a-zA-Z_]\\w*",
  relevance: 0
}, ys = {
  begin: "\\.\\s*[a-zA-Z_]\\w*",
  relevance: 0
}, Ts = (t) => Object.assign(t, { "on:begin": (e, n) => {
  n.data._beginMatch = e[1];
}, "on:end": (e, n) => {
  n.data._beginMatch !== e[1] && n.ignoreMatch();
} });
var ht = Object.freeze({
  __proto__: null,
  APOS_STRING_MODE: hs,
  BACKSLASH_ESCAPE: et,
  BINARY_NUMBER_MODE: xs,
  BINARY_NUMBER_RE: "\\b(0b[01]+)",
  COMMENT: Et,
  C_BLOCK_COMMENT_MODE: fs,
  C_LINE_COMMENT_MODE: gs,
  C_NUMBER_MODE: ks,
  C_NUMBER_RE: _r,
  END_SAME_AS_BEGIN: Ts,
  HASH_COMMENT_MODE: ms,
  IDENT_RE: xr,
  MATCH_NOTHING_RE: ls,
  METHOD_GUARD: ys,
  NUMBER_MODE: bs,
  NUMBER_RE: wr,
  PHRASAL_WORDS_MODE: ds,
  QUOTE_STRING_MODE: ps,
  REGEXP_MODE: ws,
  RE_STARTERS_RE: cs,
  SHEBANG: us,
  TITLE_MODE: _s,
  UNDERSCORE_IDENT_RE: "[a-zA-Z_]\\w*",
  UNDERSCORE_TITLE_MODE: Es
});
function As(t, e) {
  t.input[t.index - 1] === "." && e.ignoreMatch();
}
function Ss(t, e) {
  t.className !== void 0 && (t.scope = t.className, delete t.className);
}
function vs(t, e) {
  e && t.beginKeywords && (t.begin = "\\b(" + t.beginKeywords.split(" ").join("|") + ")(?!\\.)(?=\\b|\\s)", t.__beforeBegin = As, t.keywords = t.keywords || t.beginKeywords, delete t.beginKeywords, t.relevance === void 0 && (t.relevance = 0));
}
function Rs(t, e) {
  Array.isArray(t.illegal) && (t.illegal = nn(...t.illegal));
}
function Ns(t, e) {
  if (t.match) {
    if (t.begin || t.end) throw Error("begin & end are not supported with match");
    t.begin = t.match, delete t.match;
  }
}
function Os(t, e) {
  t.relevance === void 0 && (t.relevance = 1);
}
const Ms = (t, e) => {
  if (!t.beforeMatch) return;
  if (t.starts) throw Error("beforeMatch cannot be used with starts");
  const n = Object.assign({}, t);
  Object.keys(t).forEach(((i) => {
    delete t[i];
  })), t.keywords = n.keywords, t.begin = Ce(n.beforeMatch, br(n.begin)), t.starts = {
    relevance: 0,
    contains: [Object.assign(n, { endsParent: !0 })]
  }, t.relevance = 0, delete n.beforeMatch;
}, Cs = ["of", "and", "for", "in", "not", "or", "if", "then", "parent", "list", "value"], Is = "keyword";
function Er(t, e, n = Is) {
  const i = /* @__PURE__ */ Object.create(null);
  return typeof t == "string" ? r(n, t.split(" ")) : Array.isArray(t) ? r(n, t) : Object.keys(t).forEach(((s) => {
    Object.assign(i, Er(t[s], e, s));
  })), i;
  function r(s, a) {
    e && (a = a.map(((c) => c.toLowerCase()))), a.forEach(((c) => {
      const l = c.split("|");
      i[l[0]] = [s, Ls(l[0], l[1])];
    }));
  }
}
function Ls(t, e) {
  return e ? Number(e) : ((n) => Cs.includes(n.toLowerCase()))(t) ? 0 : 1;
}
const Fn = {}, Ne = (t) => {
  console.error(t);
}, Gn = (t, ...e) => {
  console.log("WARN: " + t, ...e);
}, je = (t, e) => {
  Fn[`${t}/${e}`] || (console.log(`Deprecated as of ${t}. ${e}`), Fn[`${t}/${e}`] = !0);
}, pt = Error();
function Wn(t, e, { key: n }) {
  let i = 0;
  const r = t[n], s = {}, a = {};
  for (let c = 1; c <= e.length; c++) a[c + i] = r[c], s[c + i] = !0, i += kr(e[c - 1]);
  t[n] = a, t[n]._emit = s, t[n]._multi = !0;
}
function Ds(t) {
  ((e) => {
    e.scope && typeof e.scope == "object" && e.scope !== null && (e.beginScope = e.scope, delete e.scope);
  })(t), typeof t.beginScope == "string" && (t.beginScope = {
    _wrap: t.beginScope
  }), typeof t.endScope == "string" && (t.endScope = {
    _wrap: t.endScope
  }), ((e) => {
    if (Array.isArray(e.begin)) {
      if (e.skip || e.excludeBegin || e.returnBegin) throw Ne("skip, excludeBegin, returnBegin not compatible with beginScope: {}"), pt;
      if (typeof e.beginScope != "object" || e.beginScope === null) throw Ne("beginScope must be object"), pt;
      Wn(e, e.begin, {
        key: "beginScope"
      }), e.begin = Gt(e.begin, { joinWith: "" });
    }
  })(t), ((e) => {
    if (Array.isArray(e.end)) {
      if (e.skip || e.excludeEnd || e.returnEnd) throw Ne("skip, excludeEnd, returnEnd not compatible with endScope: {}"), pt;
      if (typeof e.endScope != "object" || e.endScope === null) throw Ne("endScope must be object"), pt;
      Wn(e, e.end, {
        key: "endScope"
      }), e.end = Gt(e.end, { joinWith: "" });
    }
  })(t);
}
function zs(t) {
  function e(r, s) {
    return RegExp(Je(r), "m" + (t.case_insensitive ? "i" : "") + (t.unicodeRegex ? "u" : "") + (s ? "g" : ""));
  }
  class n {
    constructor() {
      this.matchIndexes = {}, this.regexes = [], this.matchAt = 1, this.position = 0;
    }
    addRule(s, a) {
      a.position = this.position++, this.matchIndexes[this.matchAt] = a, this.regexes.push([a, s]), this.matchAt += kr(s) + 1;
    }
    compile() {
      this.regexes.length === 0 && (this.exec = () => null);
      const s = this.regexes.map(((a) => a[1]));
      this.matcherRe = e(Gt(s, {
        joinWith: "|"
      }), !0), this.lastIndex = 0;
    }
    exec(s) {
      this.matcherRe.lastIndex = this.lastIndex;
      const a = this.matcherRe.exec(s);
      if (!a) return null;
      const c = a.findIndex(((h, u) => u > 0 && h !== void 0)), l = this.matchIndexes[c];
      return a.splice(0, c), Object.assign(a, l);
    }
  }
  class i {
    constructor() {
      this.rules = [], this.multiRegexes = [], this.count = 0, this.lastIndex = 0, this.regexIndex = 0;
    }
    getMatcher(s) {
      if (this.multiRegexes[s]) return this.multiRegexes[s];
      const a = new n();
      return this.rules.slice(s).forEach((([c, l]) => a.addRule(c, l))), a.compile(), this.multiRegexes[s] = a, a;
    }
    resumingScanAtSamePosition() {
      return this.regexIndex !== 0;
    }
    considerAll() {
      this.regexIndex = 0;
    }
    addRule(s, a) {
      this.rules.push([s, a]), a.type === "begin" && this.count++;
    }
    exec(s) {
      const a = this.getMatcher(this.regexIndex);
      a.lastIndex = this.lastIndex;
      let c = a.exec(s);
      if (this.resumingScanAtSamePosition() && !(c && c.index === this.lastIndex)) {
        const l = this.getMatcher(0);
        l.lastIndex = this.lastIndex + 1, c = l.exec(s);
      }
      return c && (this.regexIndex += c.position + 1, this.regexIndex === this.count && this.considerAll()), c;
    }
  }
  if (t.compilerExtensions || (t.compilerExtensions = []), t.contains && t.contains.includes("self")) throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.");
  return t.classNameAliases = Ee(t.classNameAliases || {}), (function r(s, a) {
    const c = s;
    if (s.isCompiled) return c;
    [Ss, Ns, Ds, Ms].forEach(((h) => h(s, a))), t.compilerExtensions.forEach(((h) => h(s, a))), s.__beforeBegin = null, [vs, Rs, Os].forEach(((h) => h(s, a))), s.isCompiled = !0;
    let l = null;
    return typeof s.keywords == "object" && s.keywords.$pattern && (s.keywords = Object.assign({}, s.keywords), l = s.keywords.$pattern, delete s.keywords.$pattern), l = l || /\w+/, s.keywords && (s.keywords = Er(s.keywords, t.case_insensitive)), c.keywordPatternRe = e(l, !0), a && (s.begin || (s.begin = /\B|\b/), c.beginRe = e(c.begin), s.end || s.endsWithParent || (s.end = /\B|\b/), s.end && (c.endRe = e(c.end)), c.terminatorEnd = Je(c.end) || "", s.endsWithParent && a.terminatorEnd && (c.terminatorEnd += (s.end ? "|" : "") + a.terminatorEnd)), s.illegal && (c.illegalRe = e(s.illegal)), s.contains || (s.contains = []), s.contains = [].concat(...s.contains.map(((h) => ((u) => (u.variants && !u.cachedVariants && (u.cachedVariants = u.variants.map(((_) => Ee(u, {
      variants: null
    }, _)))), u.cachedVariants ? u.cachedVariants : yr(u) ? Ee(u, {
      starts: u.starts ? Ee(u.starts) : null
    }) : Object.isFrozen(u) ? Ee(u) : u))(h === "self" ? s : h)))), s.contains.forEach(((h) => {
      r(h, c);
    })), s.starts && r(s.starts, a), c.matcher = ((h) => {
      const u = new i();
      return h.contains.forEach(((_) => u.addRule(_.begin, {
        rule: _,
        type: "begin"
      }))), h.terminatorEnd && u.addRule(h.terminatorEnd, {
        type: "end"
      }), h.illegal && u.addRule(h.illegal, { type: "illegal" }), u;
    })(c), c;
  })(t);
}
function yr(t) {
  return !!t && (t.endsWithParent || yr(t.starts));
}
var Ps = "11.10.0";
class js extends Error {
  constructor(e, n) {
    super(e), this.name = "HTMLInjectionError", this.html = n;
  }
}
const Pt = mr, Zn = Ee, qn = /* @__PURE__ */ Symbol("nomatch"), Tr = (t) => {
  const e = /* @__PURE__ */ Object.create(null), n = /* @__PURE__ */ Object.create(null), i = [];
  let r = !0;
  const s = "Could not find the language '{}', did you forget to load/include a language module?", a = {
    disableAutodetect: !0,
    name: "Plain text",
    contains: []
  };
  let c = {
    ignoreUnescapedHTML: !1,
    throwUnescapedHTML: !1,
    noHighlightRe: /^(no-?highlight)$/i,
    languageDetectRe: /\blang(?:uage)?-([\w-]+)\b/i,
    classPrefix: "hljs-",
    cssSelector: "pre code",
    languages: null,
    __emitter: is
  };
  function l(d) {
    return c.noHighlightRe.test(d);
  }
  function h(d, g, w) {
    let z = "", P = "";
    typeof g == "object" ? (z = d, w = g.ignoreIllegals, P = g.language) : (je("10.7.0", "highlight(lang, code, ...args) has been deprecated."), je("10.7.0", `Please use highlight(code, options) instead.
https://github.com/highlightjs/highlight.js/issues/2277`), P = d, z = g), w === void 0 && (w = !0);
    const $ = { code: z, language: P };
    Y("before:highlight", $);
    const U = $.result ? $.result : u($.language, $.code, w);
    return U.code = $.code, Y("after:highlight", U), U;
  }
  function u(d, g, w, z) {
    const P = /* @__PURE__ */ Object.create(null);
    function $() {
      if (!m.keywords) return void S.addText(C);
      let f = 0;
      m.keywordPatternRe.lastIndex = 0;
      let x = m.keywordPatternRe.exec(C), M = "";
      for (; x; ) {
        M += C.substring(f, x.index);
        const R = K.case_insensitive ? x[0].toLowerCase() : x[0], H = (O = R, m.keywords[O]);
        if (H) {
          const [Z, ve] = H;
          if (S.addText(M), M = "", P[R] = (P[R] || 0) + 1, P[R] <= 7 && (D += ve), Z.startsWith("_")) M += x[0];
          else {
            const _e = K.classNameAliases[Z] || Z;
            G(x[0], _e);
          }
        } else M += x[0];
        f = m.keywordPatternRe.lastIndex, x = m.keywordPatternRe.exec(C);
      }
      var O;
      M += C.substring(f), S.addText(M);
    }
    function U() {
      m.subLanguage != null ? (() => {
        if (C === "") return;
        let f = null;
        if (typeof m.subLanguage == "string") {
          if (!e[m.subLanguage]) return void S.addText(C);
          f = u(m.subLanguage, C, !0, Ue[m.subLanguage]), Ue[m.subLanguage] = f._top;
        } else f = _(C, m.subLanguage.length ? m.subLanguage : null);
        m.relevance > 0 && (D += f.relevance), S.__addSublanguage(f._emitter, f.language);
      })() : $(), C = "";
    }
    function G(f, x) {
      f !== "" && (S.startScope(x), S.addText(f), S.endScope());
    }
    function T(f, x) {
      let M = 1;
      const O = x.length - 1;
      for (; M <= O; ) {
        if (!f._emit[M]) {
          M++;
          continue;
        }
        const R = K.classNameAliases[f[M]] || f[M], H = x[M];
        R ? G(H, R) : (C = H, $(), C = ""), M++;
      }
    }
    function B(f, x) {
      return f.scope && typeof f.scope == "string" && S.openNode(K.classNameAliases[f.scope] || f.scope), f.beginScope && (f.beginScope._wrap ? (G(C, K.classNameAliases[f.beginScope._wrap] || f.beginScope._wrap), C = "") : f.beginScope._multi && (T(f.beginScope, x), C = "")), m = Object.create(f, { parent: {
        value: m
      } }), m;
    }
    function ce(f, x, M) {
      let O = ((R, H) => {
        const Z = R && R.exec(H);
        return Z && Z.index === 0;
      })(f.endRe, M);
      if (O) {
        if (f["on:end"]) {
          const R = new Bn(f);
          f["on:end"](x, R), R.isMatchIgnored && (O = !1);
        }
        if (O) {
          for (; f.endsParent && f.parent; ) f = f.parent;
          return f;
        }
      }
      if (f.endsWithParent) return ce(f.parent, x, M);
    }
    function fe(f) {
      return m.matcher.regexIndex === 0 ? (C += f[0], 1) : (he = !0, 0);
    }
    function Te(f) {
      const x = f[0], M = g.substring(f.index), O = ce(m, f, M);
      if (!O) return qn;
      const R = m;
      m.endScope && m.endScope._wrap ? (U(), G(x, m.endScope._wrap)) : m.endScope && m.endScope._multi ? (U(), T(m.endScope, f)) : R.skip ? C += x : (R.returnEnd || R.excludeEnd || (C += x), U(), R.excludeEnd && (C = x));
      do
        m.scope && S.closeNode(), m.skip || m.subLanguage || (D += m.relevance), m = m.parent;
      while (m !== O.parent);
      return O.starts && B(O.starts, f), R.returnEnd ? 0 : x.length;
    }
    let ue = {};
    function Ae(f, x) {
      const M = x && x[0];
      if (C += f, M == null) return U(), 0;
      if (ue.type === "begin" && x.type === "end" && ue.index === x.index && M === "") {
        if (C += g.slice(x.index, x.index + 1), !r) {
          const O = Error(`0 width match regex (${d})`);
          throw O.languageName = d, O.badRule = ue.rule, O;
        }
        return 1;
      }
      if (ue = x, x.type === "begin") return ((O) => {
        const R = O[0], H = O.rule, Z = new Bn(H), ve = [H.__beforeBegin, H["on:begin"]];
        for (const _e of ve) if (_e && (_e(O, Z), Z.isMatchIgnored)) return fe(R);
        return H.skip ? C += R : (H.excludeBegin && (C += R), U(), H.returnBegin || H.excludeBegin || (C = R)), B(H, O), H.returnBegin ? 0 : R.length;
      })(x);
      if (x.type === "illegal" && !w) {
        const O = Error('Illegal lexeme "' + M + '" for mode "' + (m.scope || "<unnamed>") + '"');
        throw O.mode = m, O;
      }
      if (x.type === "end") {
        const O = Te(x);
        if (O !== qn) return O;
      }
      if (x.type === "illegal" && M === "") return 1;
      if (Se > 1e5 && Se > 3 * x.index) throw Error("potential infinite loop, way more iterations than matches");
      return C += M, M.length;
    }
    const K = L(d);
    if (!K) throw Ne(s.replace("{}", d)), Error('Unknown language: "' + d + '"');
    const Be = zs(K);
    let we = "", m = z || Be;
    const Ue = {}, S = new c.__emitter(c);
    (() => {
      const f = [];
      for (let x = m; x !== K; x = x.parent) x.scope && f.unshift(x.scope);
      f.forEach(((x) => S.openNode(x)));
    })();
    let C = "", D = 0, ne = 0, Se = 0, he = !1;
    try {
      if (K.__emitTokens) K.__emitTokens(g, S);
      else {
        for (m.matcher.considerAll(); ; ) {
          Se++, he ? he = !1 : m.matcher.considerAll(), m.matcher.lastIndex = ne;
          const f = m.matcher.exec(g);
          if (!f) break;
          const x = Ae(g.substring(ne, f.index), f);
          ne = f.index + x;
        }
        Ae(g.substring(ne));
      }
      return S.finalize(), we = S.toHTML(), {
        language: d,
        value: we,
        relevance: D,
        illegal: !1,
        _emitter: S,
        _top: m
      };
    } catch (f) {
      if (f.message && f.message.includes("Illegal")) return {
        language: d,
        value: Pt(g),
        illegal: !0,
        relevance: 0,
        _illegalBy: {
          message: f.message,
          index: ne,
          context: g.slice(ne - 100, ne + 100),
          mode: f.mode,
          resultSoFar: we
        },
        _emitter: S
      };
      if (r) return {
        language: d,
        value: Pt(g),
        illegal: !1,
        relevance: 0,
        errorRaised: f,
        _emitter: S,
        _top: m
      };
      throw f;
    }
  }
  function _(d, g) {
    g = g || c.languages || Object.keys(e);
    const w = ((T) => {
      const B = {
        value: Pt(T),
        illegal: !1,
        relevance: 0,
        _top: a,
        _emitter: new c.__emitter(c)
      };
      return B._emitter.addText(T), B;
    })(d), z = g.filter(L).filter(ie).map(((T) => u(T, d, !1)));
    z.unshift(w);
    const P = z.sort(((T, B) => {
      if (T.relevance !== B.relevance) return B.relevance - T.relevance;
      if (T.language && B.language) {
        if (L(T.language).supersetOf === B.language) return 1;
        if (L(B.language).supersetOf === T.language) return -1;
      }
      return 0;
    })), [$, U] = P, G = $;
    return G.secondBest = U, G;
  }
  function E(d) {
    let g = null;
    const w = (($) => {
      let U = $.className + " ";
      U += $.parentNode ? $.parentNode.className : "";
      const G = c.languageDetectRe.exec(U);
      if (G) {
        const T = L(G[1]);
        return T || (Gn(s.replace("{}", G[1])), Gn("Falling back to no-highlight mode for this block.", $)), T ? G[1] : "no-highlight";
      }
      return U.split(/\s+/).find(((T) => l(T) || L(T)));
    })(d);
    if (l(w)) return;
    if (Y("before:highlightElement", {
      el: d,
      language: w
    }), d.dataset.highlighted) return void console.log("Element previously highlighted. To highlight again, first unset `dataset.highlighted`.", d);
    if (d.children.length > 0 && (c.ignoreUnescapedHTML || (console.warn("One of your code blocks includes unescaped HTML. This is a potentially serious security risk."), console.warn("https://github.com/highlightjs/highlight.js/wiki/security"), console.warn("The element with unescaped HTML:"), console.warn(d)), c.throwUnescapedHTML)) throw new js("One of your code blocks includes unescaped HTML.", d.innerHTML);
    g = d;
    const z = g.textContent, P = w ? h(z, { language: w, ignoreIllegals: !0 }) : _(z);
    d.innerHTML = P.value, d.dataset.highlighted = "yes", (($, U, G) => {
      const T = U && n[U] || G;
      $.classList.add("hljs"), $.classList.add("language-" + T);
    })(d, w, P.language), d.result = {
      language: P.language,
      re: P.relevance,
      relevance: P.relevance
    }, P.secondBest && (d.secondBest = {
      language: P.secondBest.language,
      relevance: P.secondBest.relevance
    }), Y("after:highlightElement", { el: d, result: P, text: z });
  }
  let v = !1;
  function y() {
    document.readyState !== "loading" ? document.querySelectorAll(c.cssSelector).forEach(E) : v = !0;
  }
  function L(d) {
    return d = (d || "").toLowerCase(), e[d] || e[n[d]];
  }
  function le(d, { languageName: g }) {
    typeof d == "string" && (d = [d]), d.forEach(((w) => {
      n[w.toLowerCase()] = g;
    }));
  }
  function ie(d) {
    const g = L(d);
    return g && !g.disableAutodetect;
  }
  function Y(d, g) {
    const w = d;
    i.forEach(((z) => {
      z[w] && z[w](g);
    }));
  }
  typeof window < "u" && window.addEventListener && window.addEventListener("DOMContentLoaded", (() => {
    v && y();
  }), !1), Object.assign(t, {
    highlight: h,
    highlightAuto: _,
    highlightAll: y,
    highlightElement: E,
    highlightBlock: (d) => (je("10.7.0", "highlightBlock will be removed entirely in v12.0"), je("10.7.0", "Please use highlightElement now."), E(d)),
    configure: (d) => {
      c = Zn(c, d);
    },
    initHighlighting: () => {
      y(), je("10.6.0", "initHighlighting() deprecated.  Use highlightAll() now.");
    },
    initHighlightingOnLoad: () => {
      y(), je("10.6.0", "initHighlightingOnLoad() deprecated.  Use highlightAll() now.");
    },
    registerLanguage: (d, g) => {
      let w = null;
      try {
        w = g(t);
      } catch (z) {
        if (Ne("Language definition for '{}' could not be registered.".replace("{}", d)), !r) throw z;
        Ne(z), w = a;
      }
      w.name || (w.name = d), e[d] = w, w.rawDefinition = g.bind(null, t), w.aliases && le(w.aliases, { languageName: d });
    },
    unregisterLanguage: (d) => {
      delete e[d];
      for (const g of Object.keys(n)) n[g] === d && delete n[g];
    },
    listLanguages: () => Object.keys(e),
    getLanguage: L,
    registerAliases: le,
    autoDetection: ie,
    inherit: Zn,
    addPlugin: (d) => {
      ((g) => {
        g["before:highlightBlock"] && !g["before:highlightElement"] && (g["before:highlightElement"] = (w) => {
          g["before:highlightBlock"](Object.assign({ block: w.el }, w));
        }), g["after:highlightBlock"] && !g["after:highlightElement"] && (g["after:highlightElement"] = (w) => {
          g["after:highlightBlock"](Object.assign({ block: w.el }, w));
        });
      })(d), i.push(d);
    },
    removePlugin: (d) => {
      const g = i.indexOf(d);
      g !== -1 && i.splice(g, 1);
    }
  }), t.debugMode = () => {
    r = !1;
  }, t.safeMode = () => {
    r = !0;
  }, t.versionString = Ps, t.regex = {
    concat: Ce,
    lookahead: br,
    either: nn,
    optional: as,
    anyNumberOfTimes: ss
  };
  for (const d in ht) typeof ht[d] == "object" && fr(ht[d]);
  return Object.assign(t, ht), t;
}, Ar = Tr({});
Ar.newInstance = () => Tr({});
const bt = "[A-Za-z$_][0-9A-Za-z$_]*", Sr = ["as", "in", "of", "if", "for", "while", "finally", "var", "new", "function", "do", "return", "void", "else", "break", "catch", "instanceof", "with", "throw", "case", "default", "try", "switch", "continue", "typeof", "delete", "let", "yield", "const", "class", "debugger", "async", "await", "static", "import", "from", "export", "extends"], vr = ["true", "false", "null", "undefined", "NaN", "Infinity"], Rr = ["Object", "Function", "Boolean", "Symbol", "Math", "Date", "Number", "BigInt", "String", "RegExp", "Array", "Float32Array", "Float64Array", "Int8Array", "Uint8Array", "Uint8ClampedArray", "Int16Array", "Int32Array", "Uint16Array", "Uint32Array", "BigInt64Array", "BigUint64Array", "Set", "Map", "WeakSet", "WeakMap", "ArrayBuffer", "SharedArrayBuffer", "Atomics", "DataView", "JSON", "Promise", "Generator", "GeneratorFunction", "AsyncFunction", "Reflect", "Proxy", "Intl", "WebAssembly"], Nr = ["Error", "EvalError", "InternalError", "RangeError", "ReferenceError", "SyntaxError", "TypeError", "URIError"], Or = ["setInterval", "setTimeout", "clearInterval", "clearTimeout", "require", "exports", "eval", "isFinite", "isNaN", "parseFloat", "parseInt", "decodeURI", "decodeURIComponent", "encodeURI", "encodeURIComponent", "escape", "unescape"], Mr = ["arguments", "this", "super", "console", "window", "document", "localStorage", "sessionStorage", "module", "global"], Cr = [].concat(Or, Rr, Nr);
function Kn(t) {
  const e = t.regex, n = bt, i = {
    begin: /<[A-Za-z0-9\\._:-]+/,
    end: /\/[A-Za-z0-9\\._:-]+>|\/>/,
    isTrulyOpeningTag: (B, ce) => {
      const fe = B[0].length + B.index, Te = B.input[fe];
      if (Te === "<" || Te === ",") return void ce.ignoreMatch();
      let ue;
      Te === ">" && (((K, { after: Be }) => {
        const we = "</" + K[0].slice(1);
        return K.input.indexOf(we, Be) !== -1;
      })(B, { after: fe }) || ce.ignoreMatch());
      const Ae = B.input.substring(fe);
      ((ue = Ae.match(/^\s*=/)) || (ue = Ae.match(/^\s+extends\s+/)) && ue.index === 0) && ce.ignoreMatch();
    }
  }, r = {
    $pattern: bt,
    keyword: Sr,
    literal: vr,
    built_in: Cr,
    "variable.language": Mr
  }, s = "[0-9](_?[0-9])*", a = `\\.(${s})`, c = "0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*", l = {
    className: "number",
    variants: [{
      begin: `(\\b(${c})((${a})|\\.)?|(${a}))[eE][+-]?(${s})\\b`
    }, {
      begin: `\\b(${c})\\b((${a})\\b|\\.)?|(${a})\\b`
    }, {
      begin: "\\b(0|[1-9](_?[0-9])*)n\\b"
    }, {
      begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"
    }, {
      begin: "\\b0[bB][0-1](_?[0-1])*n?\\b"
    }, { begin: "\\b0[oO][0-7](_?[0-7])*n?\\b" }, {
      begin: "\\b0[0-7]+n?\\b"
    }],
    relevance: 0
  }, h = {
    className: "subst",
    begin: "\\$\\{",
    end: "\\}",
    keywords: r,
    contains: []
  }, u = { begin: ".?html`", end: "", starts: {
    end: "`",
    returnEnd: !1,
    contains: [t.BACKSLASH_ESCAPE, h],
    subLanguage: "xml"
  } }, _ = {
    begin: ".?css`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [t.BACKSLASH_ESCAPE, h],
      subLanguage: "css"
    }
  }, E = {
    begin: ".?gql`",
    end: "",
    starts: {
      end: "`",
      returnEnd: !1,
      contains: [t.BACKSLASH_ESCAPE, h],
      subLanguage: "graphql"
    }
  }, v = {
    className: "string",
    begin: "`",
    end: "`",
    contains: [t.BACKSLASH_ESCAPE, h]
  }, y = {
    className: "comment",
    variants: [t.COMMENT(/\/\*\*(?!\/)/, "\\*/", {
      relevance: 0,
      contains: [{
        begin: "(?=@[A-Za-z]+)",
        relevance: 0,
        contains: [{
          className: "doctag",
          begin: "@[A-Za-z]+"
        }, {
          className: "type",
          begin: "\\{",
          end: "\\}",
          excludeEnd: !0,
          excludeBegin: !0,
          relevance: 0
        }, {
          className: "variable",
          begin: n + "(?=\\s*(-)|$)",
          endsParent: !0,
          relevance: 0
        }, { begin: /(?=[^\n])\s/, relevance: 0 }]
      }]
    }), t.C_BLOCK_COMMENT_MODE, t.C_LINE_COMMENT_MODE]
  }, L = [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, u, _, E, v, { match: /\$\d+/ }, l];
  h.contains = L.concat({
    begin: /\{/,
    end: /\}/,
    keywords: r,
    contains: ["self"].concat(L)
  });
  const le = [].concat(y, h.contains), ie = le.concat([{
    begin: /(\s*)\(/,
    end: /\)/,
    keywords: r,
    contains: ["self"].concat(le)
  }]), Y = {
    className: "params",
    begin: /(\s*)\(/,
    end: /\)/,
    excludeBegin: !0,
    excludeEnd: !0,
    keywords: r,
    contains: ie
  }, d = { variants: [{
    match: [/class/, /\s+/, n, /\s+/, /extends/, /\s+/, e.concat(n, "(", e.concat(/\./, n), ")*")],
    scope: { 1: "keyword", 3: "title.class", 5: "keyword", 7: "title.class.inherited" }
  }, {
    match: [/class/, /\s+/, n],
    scope: { 1: "keyword", 3: "title.class" }
  }] }, g = {
    relevance: 0,
    match: e.either(/\bJSON/, /\b[A-Z][a-z]+([A-Z][a-z]*|\d)*/, /\b[A-Z]{2,}([A-Z][a-z]+|\d)+([A-Z][a-z]*)*/, /\b[A-Z]{2,}[a-z]+([A-Z][a-z]+|\d)*([A-Z][a-z]*)*/),
    className: "title.class",
    keywords: { _: [...Rr, ...Nr] }
  }, w = {
    variants: [{
      match: [/function/, /\s+/, n, /(?=\s*\()/]
    }, { match: [/function/, /\s*(?=\()/] }],
    className: { 1: "keyword", 3: "title.function" },
    label: "func.def",
    contains: [Y],
    illegal: /%/
  }, z = {
    match: e.concat(/\b/, (P = [...Or, "super", "import"].map(((B) => B + "\\s*\\(")), e.concat("(?!", P.join("|"), ")")), n, e.lookahead(/\s*\(/)),
    className: "title.function",
    relevance: 0
  };
  var P;
  const $ = {
    begin: e.concat(/\./, e.lookahead(e.concat(n, /(?![0-9A-Za-z$_(])/))),
    end: n,
    excludeBegin: !0,
    keywords: "prototype",
    className: "property",
    relevance: 0
  }, U = {
    match: [/get|set/, /\s+/, n, /(?=\()/],
    className: { 1: "keyword", 3: "title.function" },
    contains: [{ begin: /\(\)/ }, Y]
  }, G = "(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|" + t.UNDERSCORE_IDENT_RE + ")\\s*=>", T = {
    match: [/const|var|let/, /\s+/, n, /\s*/, /=\s*/, /(async\s*)?/, e.lookahead(G)],
    keywords: "async",
    className: { 1: "keyword", 3: "title.function" },
    contains: [Y]
  };
  return {
    name: "JavaScript",
    aliases: ["js", "jsx", "mjs", "cjs"],
    keywords: r,
    exports: {
      PARAMS_CONTAINS: ie,
      CLASS_REFERENCE: g
    },
    illegal: /#(?![$_A-z])/,
    contains: [t.SHEBANG({ label: "shebang", binary: "node", relevance: 5 }), {
      label: "use_strict",
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use (strict|asm)['"]/
    }, t.APOS_STRING_MODE, t.QUOTE_STRING_MODE, u, _, E, v, y, { match: /\$\d+/ }, l, g, {
      className: "attr",
      begin: n + e.lookahead(":"),
      relevance: 0
    }, T, {
      begin: "(" + t.RE_STARTERS_RE + "|\\b(case|return|throw)\\b)\\s*",
      keywords: "return throw case",
      relevance: 0,
      contains: [y, t.REGEXP_MODE, {
        className: "function",
        begin: G,
        returnBegin: !0,
        end: "\\s*=>",
        contains: [{
          className: "params",
          variants: [{ begin: t.UNDERSCORE_IDENT_RE, relevance: 0 }, {
            className: null,
            begin: /\(\s*\)/,
            skip: !0
          }, {
            begin: /(\s*)\(/,
            end: /\)/,
            excludeBegin: !0,
            excludeEnd: !0,
            keywords: r,
            contains: ie
          }]
        }]
      }, {
        begin: /,/,
        relevance: 0
      }, { match: /\s+/, relevance: 0 }, { variants: [{ begin: "<>", end: "</>" }, {
        match: /<[A-Za-z0-9\\._:-]+\s*\/>/
      }, {
        begin: i.begin,
        "on:begin": i.isTrulyOpeningTag,
        end: i.end
      }], subLanguage: "xml", contains: [{
        begin: i.begin,
        end: i.end,
        skip: !0,
        contains: ["self"]
      }] }]
    }, w, {
      beginKeywords: "while if switch catch for"
    }, {
      begin: "\\b(?!function)" + t.UNDERSCORE_IDENT_RE + "\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
      returnBegin: !0,
      label: "func.def",
      contains: [Y, t.inherit(t.TITLE_MODE, {
        begin: n,
        className: "title.function"
      })]
    }, { match: /\.\.\./, relevance: 0 }, $, {
      match: "\\$" + n,
      relevance: 0
    }, {
      match: [/\bconstructor(?=\s*\()/],
      className: { 1: "title.function" },
      contains: [Y]
    }, z, {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    }, d, U, { match: /\$[(.]/ }]
  };
}
const $s = (t) => ({
  IMPORTANT: { scope: "meta", begin: "!important" },
  BLOCK_COMMENT: t.C_BLOCK_COMMENT_MODE,
  HEXCOLOR: {
    scope: "number",
    begin: /#(([0-9a-fA-F]{3,4})|(([0-9a-fA-F]{2}){3,4}))\b/
  },
  FUNCTION_DISPATCH: {
    className: "built_in",
    begin: /[\w-]+(?=\()/
  },
  ATTRIBUTE_SELECTOR_MODE: {
    scope: "selector-attr",
    begin: /\[/,
    end: /\]/,
    illegal: "$",
    contains: [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE]
  },
  CSS_NUMBER_MODE: {
    scope: "number",
    begin: t.NUMBER_RE + "(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
    relevance: 0
  },
  CSS_VARIABLE: { className: "attr", begin: /--[A-Za-z_][A-Za-z0-9_-]*/ }
}), Bs = ["a", "abbr", "address", "article", "aside", "audio", "b", "blockquote", "body", "button", "canvas", "caption", "cite", "code", "dd", "del", "details", "dfn", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "mark", "menu", "nav", "object", "ol", "optgroup", "option", "p", "picture", "q", "quote", "samp", "section", "select", "source", "span", "strong", "summary", "sup", "table", "tbody", "td", "textarea", "tfoot", "th", "thead", "time", "tr", "ul", "var", "video"], Us = ["defs", "g", "marker", "mask", "pattern", "svg", "switch", "symbol", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feGaussianBlur", "feImage", "feMerge", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence", "linearGradient", "radialGradient", "stop", "circle", "ellipse", "image", "line", "path", "polygon", "polyline", "rect", "text", "use", "textPath", "tspan", "foreignObject", "clipPath"], Hs = [...Bs, ...Us], Fs = ["any-hover", "any-pointer", "aspect-ratio", "color", "color-gamut", "color-index", "device-aspect-ratio", "device-height", "device-width", "display-mode", "forced-colors", "grid", "height", "hover", "inverted-colors", "monochrome", "orientation", "overflow-block", "overflow-inline", "pointer", "prefers-color-scheme", "prefers-contrast", "prefers-reduced-motion", "prefers-reduced-transparency", "resolution", "scan", "scripting", "update", "width", "min-width", "max-width", "min-height", "max-height"].sort().reverse(), Gs = ["active", "any-link", "blank", "checked", "current", "default", "defined", "dir", "disabled", "drop", "empty", "enabled", "first", "first-child", "first-of-type", "fullscreen", "future", "focus", "focus-visible", "focus-within", "has", "host", "host-context", "hover", "indeterminate", "in-range", "invalid", "is", "lang", "last-child", "last-of-type", "left", "link", "local-link", "not", "nth-child", "nth-col", "nth-last-child", "nth-last-col", "nth-last-of-type", "nth-of-type", "only-child", "only-of-type", "optional", "out-of-range", "past", "placeholder-shown", "read-only", "read-write", "required", "right", "root", "scope", "target", "target-within", "user-invalid", "valid", "visited", "where"].sort().reverse(), Ws = ["after", "backdrop", "before", "cue", "cue-region", "first-letter", "first-line", "grammar-error", "marker", "part", "placeholder", "selection", "slotted", "spelling-error"].sort().reverse(), Zs = ["accent-color", "align-content", "align-items", "align-self", "alignment-baseline", "all", "anchor-name", "animation", "animation-composition", "animation-delay", "animation-direction", "animation-duration", "animation-fill-mode", "animation-iteration-count", "animation-name", "animation-play-state", "animation-range", "animation-range-end", "animation-range-start", "animation-timeline", "animation-timing-function", "appearance", "aspect-ratio", "backdrop-filter", "backface-visibility", "background", "background-attachment", "background-blend-mode", "background-clip", "background-color", "background-image", "background-origin", "background-position", "background-position-x", "background-position-y", "background-repeat", "background-size", "baseline-shift", "block-size", "border", "border-block", "border-block-color", "border-block-end", "border-block-end-color", "border-block-end-style", "border-block-end-width", "border-block-start", "border-block-start-color", "border-block-start-style", "border-block-start-width", "border-block-style", "border-block-width", "border-bottom", "border-bottom-color", "border-bottom-left-radius", "border-bottom-right-radius", "border-bottom-style", "border-bottom-width", "border-collapse", "border-color", "border-end-end-radius", "border-end-start-radius", "border-image", "border-image-outset", "border-image-repeat", "border-image-slice", "border-image-source", "border-image-width", "border-inline", "border-inline-color", "border-inline-end", "border-inline-end-color", "border-inline-end-style", "border-inline-end-width", "border-inline-start", "border-inline-start-color", "border-inline-start-style", "border-inline-start-width", "border-inline-style", "border-inline-width", "border-left", "border-left-color", "border-left-style", "border-left-width", "border-radius", "border-right", "border-right-color", "border-right-style", "border-right-width", "border-spacing", "border-start-end-radius", "border-start-start-radius", "border-style", "border-top", "border-top-color", "border-top-left-radius", "border-top-right-radius", "border-top-style", "border-top-width", "border-width", "bottom", "box-align", "box-decoration-break", "box-direction", "box-flex", "box-flex-group", "box-lines", "box-ordinal-group", "box-orient", "box-pack", "box-shadow", "box-sizing", "break-after", "break-before", "break-inside", "caption-side", "caret-color", "clear", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "color-scheme", "column-count", "column-fill", "column-gap", "column-rule", "column-rule-color", "column-rule-style", "column-rule-width", "column-span", "column-width", "columns", "contain", "contain-intrinsic-block-size", "contain-intrinsic-height", "contain-intrinsic-inline-size", "contain-intrinsic-size", "contain-intrinsic-width", "container", "container-name", "container-type", "content", "content-visibility", "counter-increment", "counter-reset", "counter-set", "cue", "cue-after", "cue-before", "cursor", "cx", "cy", "direction", "display", "dominant-baseline", "empty-cells", "enable-background", "field-sizing", "fill", "fill-opacity", "fill-rule", "filter", "flex", "flex-basis", "flex-direction", "flex-flow", "flex-grow", "flex-shrink", "flex-wrap", "float", "flood-color", "flood-opacity", "flow", "font", "font-display", "font-family", "font-feature-settings", "font-kerning", "font-language-override", "font-optical-sizing", "font-palette", "font-size", "font-size-adjust", "font-smooth", "font-smoothing", "font-stretch", "font-style", "font-synthesis", "font-synthesis-position", "font-synthesis-small-caps", "font-synthesis-style", "font-synthesis-weight", "font-variant", "font-variant-alternates", "font-variant-caps", "font-variant-east-asian", "font-variant-emoji", "font-variant-ligatures", "font-variant-numeric", "font-variant-position", "font-variation-settings", "font-weight", "forced-color-adjust", "gap", "glyph-orientation-horizontal", "glyph-orientation-vertical", "grid", "grid-area", "grid-auto-columns", "grid-auto-flow", "grid-auto-rows", "grid-column", "grid-column-end", "grid-column-start", "grid-gap", "grid-row", "grid-row-end", "grid-row-start", "grid-template", "grid-template-areas", "grid-template-columns", "grid-template-rows", "hanging-punctuation", "height", "hyphenate-character", "hyphenate-limit-chars", "hyphens", "icon", "image-orientation", "image-rendering", "image-resolution", "ime-mode", "initial-letter", "initial-letter-align", "inline-size", "inset", "inset-area", "inset-block", "inset-block-end", "inset-block-start", "inset-inline", "inset-inline-end", "inset-inline-start", "isolation", "justify-content", "justify-items", "justify-self", "kerning", "left", "letter-spacing", "lighting-color", "line-break", "line-height", "line-height-step", "list-style", "list-style-image", "list-style-position", "list-style-type", "margin", "margin-block", "margin-block-end", "margin-block-start", "margin-bottom", "margin-inline", "margin-inline-end", "margin-inline-start", "margin-left", "margin-right", "margin-top", "margin-trim", "marker", "marker-end", "marker-mid", "marker-start", "marks", "mask", "mask-border", "mask-border-mode", "mask-border-outset", "mask-border-repeat", "mask-border-slice", "mask-border-source", "mask-border-width", "mask-clip", "mask-composite", "mask-image", "mask-mode", "mask-origin", "mask-position", "mask-repeat", "mask-size", "mask-type", "masonry-auto-flow", "math-depth", "math-shift", "math-style", "max-block-size", "max-height", "max-inline-size", "max-width", "min-block-size", "min-height", "min-inline-size", "min-width", "mix-blend-mode", "nav-down", "nav-index", "nav-left", "nav-right", "nav-up", "none", "normal", "object-fit", "object-position", "offset", "offset-anchor", "offset-distance", "offset-path", "offset-position", "offset-rotate", "opacity", "order", "orphans", "outline", "outline-color", "outline-offset", "outline-style", "outline-width", "overflow", "overflow-anchor", "overflow-block", "overflow-clip-margin", "overflow-inline", "overflow-wrap", "overflow-x", "overflow-y", "overlay", "overscroll-behavior", "overscroll-behavior-block", "overscroll-behavior-inline", "overscroll-behavior-x", "overscroll-behavior-y", "padding", "padding-block", "padding-block-end", "padding-block-start", "padding-bottom", "padding-inline", "padding-inline-end", "padding-inline-start", "padding-left", "padding-right", "padding-top", "page", "page-break-after", "page-break-before", "page-break-inside", "paint-order", "pause", "pause-after", "pause-before", "perspective", "perspective-origin", "place-content", "place-items", "place-self", "pointer-events", "position", "position-anchor", "position-visibility", "print-color-adjust", "quotes", "r", "resize", "rest", "rest-after", "rest-before", "right", "rotate", "row-gap", "ruby-align", "ruby-position", "scale", "scroll-behavior", "scroll-margin", "scroll-margin-block", "scroll-margin-block-end", "scroll-margin-block-start", "scroll-margin-bottom", "scroll-margin-inline", "scroll-margin-inline-end", "scroll-margin-inline-start", "scroll-margin-left", "scroll-margin-right", "scroll-margin-top", "scroll-padding", "scroll-padding-block", "scroll-padding-block-end", "scroll-padding-block-start", "scroll-padding-bottom", "scroll-padding-inline", "scroll-padding-inline-end", "scroll-padding-inline-start", "scroll-padding-left", "scroll-padding-right", "scroll-padding-top", "scroll-snap-align", "scroll-snap-stop", "scroll-snap-type", "scroll-timeline", "scroll-timeline-axis", "scroll-timeline-name", "scrollbar-color", "scrollbar-gutter", "scrollbar-width", "shape-image-threshold", "shape-margin", "shape-outside", "shape-rendering", "speak", "speak-as", "src", "stop-color", "stop-opacity", "stroke", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke-width", "tab-size", "table-layout", "text-align", "text-align-all", "text-align-last", "text-anchor", "text-combine-upright", "text-decoration", "text-decoration-color", "text-decoration-line", "text-decoration-skip", "text-decoration-skip-ink", "text-decoration-style", "text-decoration-thickness", "text-emphasis", "text-emphasis-color", "text-emphasis-position", "text-emphasis-style", "text-indent", "text-justify", "text-orientation", "text-overflow", "text-rendering", "text-shadow", "text-size-adjust", "text-transform", "text-underline-offset", "text-underline-position", "text-wrap", "text-wrap-mode", "text-wrap-style", "timeline-scope", "top", "touch-action", "transform", "transform-box", "transform-origin", "transform-style", "transition", "transition-behavior", "transition-delay", "transition-duration", "transition-property", "transition-timing-function", "translate", "unicode-bidi", "user-modify", "user-select", "vector-effect", "vertical-align", "view-timeline", "view-timeline-axis", "view-timeline-inset", "view-timeline-name", "view-transition-name", "visibility", "voice-balance", "voice-duration", "voice-family", "voice-pitch", "voice-range", "voice-rate", "voice-stress", "voice-volume", "white-space", "white-space-collapse", "widows", "width", "will-change", "word-break", "word-spacing", "word-wrap", "writing-mode", "x", "y", "z-index", "zoom"].sort().reverse();
var Xn = Object.freeze({
  __proto__: null,
  grmr_bash: (t) => {
    const e = t.regex, n = {}, i = { begin: /\$\{/, end: /\}/, contains: ["self", {
      begin: /:-/,
      contains: [n]
    }] };
    Object.assign(n, { className: "variable", variants: [{
      begin: e.concat(/\$[\w\d#@][\w\d_]*/, "(?![\\w\\d])(?![$])")
    }, i] });
    const r = {
      className: "subst",
      begin: /\$\(/,
      end: /\)/,
      contains: [t.BACKSLASH_ESCAPE]
    }, s = t.inherit(t.COMMENT(), { match: [/(^|\s)/, /#.*$/], scope: { 2: "comment" } }), a = {
      begin: /<<-?\s*(?=\w+)/,
      starts: { contains: [t.END_SAME_AS_BEGIN({
        begin: /(\w+)/,
        end: /(\w+)/,
        className: "string"
      })] }
    }, c = {
      className: "string",
      begin: /"/,
      end: /"/,
      contains: [t.BACKSLASH_ESCAPE, n, r]
    };
    r.contains.push(c);
    const l = {
      begin: /\$?\(\(/,
      end: /\)\)/,
      contains: [{ begin: /\d+#[0-9a-f]+/, className: "number" }, t.NUMBER_MODE, n]
    }, h = t.SHEBANG({
      binary: "(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",
      relevance: 10
    }), u = {
      className: "function",
      begin: /\w[\w\d_]*\s*\(\s*\)\s*\{/,
      returnBegin: !0,
      contains: [t.inherit(t.TITLE_MODE, { begin: /\w[\w\d_]*/ })],
      relevance: 0
    };
    return {
      name: "Bash",
      aliases: ["sh", "zsh"],
      keywords: {
        $pattern: /\b[a-z][a-z0-9._-]+\b/,
        keyword: ["if", "then", "else", "elif", "fi", "for", "while", "until", "in", "do", "done", "case", "esac", "function", "select"],
        literal: ["true", "false"],
        built_in: ["break", "cd", "continue", "eval", "exec", "exit", "export", "getopts", "hash", "pwd", "readonly", "return", "shift", "test", "times", "trap", "umask", "unset", "alias", "bind", "builtin", "caller", "command", "declare", "echo", "enable", "help", "let", "local", "logout", "mapfile", "printf", "read", "readarray", "source", "sudo", "type", "typeset", "ulimit", "unalias", "set", "shopt", "autoload", "bg", "bindkey", "bye", "cap", "chdir", "clone", "comparguments", "compcall", "compctl", "compdescribe", "compfiles", "compgroups", "compquote", "comptags", "comptry", "compvalues", "dirs", "disable", "disown", "echotc", "echoti", "emulate", "fc", "fg", "float", "functions", "getcap", "getln", "history", "integer", "jobs", "kill", "limit", "log", "noglob", "popd", "print", "pushd", "pushln", "rehash", "sched", "setcap", "setopt", "stat", "suspend", "ttyctl", "unfunction", "unhash", "unlimit", "unsetopt", "vared", "wait", "whence", "where", "which", "zcompile", "zformat", "zftp", "zle", "zmodload", "zparseopts", "zprof", "zpty", "zregexparse", "zsocket", "zstyle", "ztcp", "chcon", "chgrp", "chown", "chmod", "cp", "dd", "df", "dir", "dircolors", "ln", "ls", "mkdir", "mkfifo", "mknod", "mktemp", "mv", "realpath", "rm", "rmdir", "shred", "sync", "touch", "truncate", "vdir", "b2sum", "base32", "base64", "cat", "cksum", "comm", "csplit", "cut", "expand", "fmt", "fold", "head", "join", "md5sum", "nl", "numfmt", "od", "paste", "ptx", "pr", "sha1sum", "sha224sum", "sha256sum", "sha384sum", "sha512sum", "shuf", "sort", "split", "sum", "tac", "tail", "tr", "tsort", "unexpand", "uniq", "wc", "arch", "basename", "chroot", "date", "dirname", "du", "echo", "env", "expr", "factor", "groups", "hostid", "id", "link", "logname", "nice", "nohup", "nproc", "pathchk", "pinky", "printenv", "printf", "pwd", "readlink", "runcon", "seq", "sleep", "stat", "stdbuf", "stty", "tee", "test", "timeout", "tty", "uname", "unlink", "uptime", "users", "who", "whoami", "yes"]
      },
      contains: [h, t.SHEBANG(), u, l, s, a, { match: /(\/[a-z._-]+)+/ }, c, { match: /\\"/ }, {
        className: "string",
        begin: /'/,
        end: /'/
      }, { match: /\\'/ }, n]
    };
  },
  grmr_css: (t) => {
    const e = t.regex, n = $s(t), i = [t.APOS_STRING_MODE, t.QUOTE_STRING_MODE];
    return {
      name: "CSS",
      case_insensitive: !0,
      illegal: /[=|'\$]/,
      keywords: {
        keyframePosition: "from to"
      },
      classNameAliases: { keyframePosition: "selector-tag" },
      contains: [n.BLOCK_COMMENT, {
        begin: /-(webkit|moz|ms|o)-(?=[a-z])/
      }, n.CSS_NUMBER_MODE, {
        className: "selector-id",
        begin: /#[A-Za-z0-9_-]+/,
        relevance: 0
      }, {
        className: "selector-class",
        begin: "\\.[a-zA-Z-][a-zA-Z0-9_-]*",
        relevance: 0
      }, n.ATTRIBUTE_SELECTOR_MODE, { className: "selector-pseudo", variants: [{
        begin: ":(" + Gs.join("|") + ")"
      }, {
        begin: ":(:)?(" + Ws.join("|") + ")"
      }] }, n.CSS_VARIABLE, {
        className: "attribute",
        begin: "\\b(" + Zs.join("|") + ")\\b"
      }, {
        begin: /:/,
        end: /[;}{]/,
        contains: [n.BLOCK_COMMENT, n.HEXCOLOR, n.IMPORTANT, n.CSS_NUMBER_MODE, ...i, {
          begin: /(url|data-uri)\(/,
          end: /\)/,
          relevance: 0,
          keywords: {
            built_in: "url data-uri"
          },
          contains: [...i, {
            className: "string",
            begin: /[^)]/,
            endsWithParent: !0,
            excludeEnd: !0
          }]
        }, n.FUNCTION_DISPATCH]
      }, {
        begin: e.lookahead(/@/),
        end: "[{;]",
        relevance: 0,
        illegal: /:/,
        contains: [{
          className: "keyword",
          begin: /@-?\w[\w]*(-\w+)*/
        }, {
          begin: /\s/,
          endsWithParent: !0,
          excludeEnd: !0,
          relevance: 0,
          keywords: {
            $pattern: /[a-z-]+/,
            keyword: "and or not only",
            attribute: Fs.join(" ")
          },
          contains: [{ begin: /[a-z-]+(?=:)/, className: "attribute" }, ...i, n.CSS_NUMBER_MODE]
        }]
      }, { className: "selector-tag", begin: "\\b(" + Hs.join("|") + ")\\b" }]
    };
  },
  grmr_javascript: Kn,
  grmr_json: (t) => {
    const e = ["true", "false", "null"], n = {
      scope: "literal",
      beginKeywords: e.join(" ")
    };
    return {
      name: "JSON",
      aliases: ["jsonc"],
      keywords: { literal: e },
      contains: [{
        className: "attr",
        begin: /"(\\.|[^\\"\r\n])*"(?=\s*:)/,
        relevance: 1.01
      }, {
        match: /[{}[\],:]/,
        className: "punctuation",
        relevance: 0
      }, t.QUOTE_STRING_MODE, n, t.C_NUMBER_MODE, t.C_LINE_COMMENT_MODE, t.C_BLOCK_COMMENT_MODE],
      illegal: "\\S"
    };
  },
  grmr_markdown: (t) => {
    const e = {
      begin: /<\/?[A-Za-z_]/,
      end: ">",
      subLanguage: "xml",
      relevance: 0
    }, n = { variants: [{
      begin: /\[.+?\]\[.*?\]/,
      relevance: 0
    }, {
      begin: /\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
      relevance: 2
    }, {
      begin: t.regex.concat(/\[.+?\]\(/, /[A-Za-z][A-Za-z0-9+.-]*/, /:\/\/.*?\)/),
      relevance: 2
    }, { begin: /\[.+?\]\([./?&#].*?\)/, relevance: 1 }, {
      begin: /\[.*?\]\(.*?\)/,
      relevance: 0
    }], returnBegin: !0, contains: [{
      match: /\[(?=\])/
    }, {
      className: "string",
      relevance: 0,
      begin: "\\[",
      end: "\\]",
      excludeBegin: !0,
      returnEnd: !0
    }, {
      className: "link",
      relevance: 0,
      begin: "\\]\\(",
      end: "\\)",
      excludeBegin: !0,
      excludeEnd: !0
    }, {
      className: "symbol",
      relevance: 0,
      begin: "\\]\\[",
      end: "\\]",
      excludeBegin: !0,
      excludeEnd: !0
    }] }, i = {
      className: "strong",
      contains: [],
      variants: [{ begin: /_{2}(?!\s)/, end: /_{2}/ }, { begin: /\*{2}(?!\s)/, end: /\*{2}/ }]
    }, r = { className: "emphasis", contains: [], variants: [{ begin: /\*(?![*\s])/, end: /\*/ }, {
      begin: /_(?![_\s])/,
      end: /_/,
      relevance: 0
    }] }, s = t.inherit(i, {
      contains: []
    }), a = t.inherit(r, { contains: [] });
    i.contains.push(a), r.contains.push(s);
    let c = [e, n];
    return [i, r, s, a].forEach(((l) => {
      l.contains = l.contains.concat(c);
    })), c = c.concat(i, r), { name: "Markdown", aliases: ["md", "mkdown", "mkd"], contains: [{
      className: "section",
      variants: [{ begin: "^#{1,6}", end: "$", contains: c }, {
        begin: "(?=^.+?\\n[=-]{2,}$)",
        contains: [{ begin: "^[=-]*$" }, {
          begin: "^",
          end: "\\n",
          contains: c
        }]
      }]
    }, e, {
      className: "bullet",
      begin: "^[ 	]*([*+-]|(\\d+\\.))(?=\\s+)",
      end: "\\s+",
      excludeEnd: !0
    }, i, r, {
      className: "quote",
      begin: "^>\\s+",
      contains: c,
      end: "$"
    }, { className: "code", variants: [{ begin: "(`{3,})[^`](.|\\n)*?\\1`*[ ]*" }, {
      begin: "(~{3,})[^~](.|\\n)*?\\1~*[ ]*"
    }, { begin: "```", end: "```+[ ]*$" }, {
      begin: "~~~",
      end: "~~~+[ ]*$"
    }, { begin: "`.+?`" }, {
      begin: "(?=^( {4}|\\t))",
      contains: [{ begin: "^( {4}|\\t)", end: "(\\n)$" }],
      relevance: 0
    }] }, {
      begin: "^[-\\*]{3,}",
      end: "$"
    }, n, { begin: /^\[[^\n]+\]:/, returnBegin: !0, contains: [{
      className: "symbol",
      begin: /\[/,
      end: /\]/,
      excludeBegin: !0,
      excludeEnd: !0
    }, {
      className: "link",
      begin: /:\s*/,
      end: /$/,
      excludeBegin: !0
    }] }, {
      scope: "literal",
      match: /&([a-zA-Z0-9]+|#[0-9]{1,7}|#[Xx][0-9a-fA-F]{1,6});/
    }] };
  },
  grmr_plaintext: (t) => ({
    name: "Plain text",
    aliases: ["text", "txt"],
    disableAutodetect: !0
  }),
  grmr_ruby: (t) => {
    const e = t.regex, n = "([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)", i = e.either(/\b([A-Z]+[a-z0-9]+)+/, /\b([A-Z]+[a-z0-9]+)+[A-Z]+/), r = e.concat(i, /(::\w+)*/), s = {
      "variable.constant": ["__FILE__", "__LINE__", "__ENCODING__"],
      "variable.language": ["self", "super"],
      keyword: ["alias", "and", "begin", "BEGIN", "break", "case", "class", "defined", "do", "else", "elsif", "end", "END", "ensure", "for", "if", "in", "module", "next", "not", "or", "redo", "require", "rescue", "retry", "return", "then", "undef", "unless", "until", "when", "while", "yield", "include", "extend", "prepend", "public", "private", "protected", "raise", "throw"],
      built_in: ["proc", "lambda", "attr_accessor", "attr_reader", "attr_writer", "define_method", "private_constant", "module_function"],
      literal: ["true", "false", "nil"]
    }, a = { className: "doctag", begin: "@[A-Za-z]+" }, c = {
      begin: "#<",
      end: ">"
    }, l = [t.COMMENT("#", "$", {
      contains: [a]
    }), t.COMMENT("^=begin", "^=end", {
      contains: [a],
      relevance: 10
    }), t.COMMENT("^__END__", t.MATCH_NOTHING_RE)], h = {
      className: "subst",
      begin: /#\{/,
      end: /\}/,
      keywords: s
    }, u = {
      className: "string",
      contains: [t.BACKSLASH_ESCAPE, h],
      variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }, { begin: /`/, end: /`/ }, {
        begin: /%[qQwWx]?\(/,
        end: /\)/
      }, { begin: /%[qQwWx]?\[/, end: /\]/ }, {
        begin: /%[qQwWx]?\{/,
        end: /\}/
      }, { begin: /%[qQwWx]?</, end: />/ }, {
        begin: /%[qQwWx]?\//,
        end: /\//
      }, { begin: /%[qQwWx]?%/, end: /%/ }, { begin: /%[qQwWx]?-/, end: /-/ }, {
        begin: /%[qQwWx]?\|/,
        end: /\|/
      }, { begin: /\B\?(\\\d{1,3})/ }, {
        begin: /\B\?(\\x[A-Fa-f0-9]{1,2})/
      }, { begin: /\B\?(\\u\{?[A-Fa-f0-9]{1,6}\}?)/ }, {
        begin: /\B\?(\\M-\\C-|\\M-\\c|\\c\\M-|\\M-|\\C-\\M-)[\x20-\x7e]/
      }, {
        begin: /\B\?\\(c|C-)[\x20-\x7e]/
      }, { begin: /\B\?\\?\S/ }, {
        begin: e.concat(/<<[-~]?'?/, e.lookahead(/(\w+)(?=\W)[^\n]*\n(?:[^\n]*\n)*?\s*\1\b/)),
        contains: [t.END_SAME_AS_BEGIN({
          begin: /(\w+)/,
          end: /(\w+)/,
          contains: [t.BACKSLASH_ESCAPE, h]
        })]
      }]
    }, _ = "[0-9](_?[0-9])*", E = {
      className: "number",
      relevance: 0,
      variants: [{
        begin: `\\b([1-9](_?[0-9])*|0)(\\.(${_}))?([eE][+-]?(${_})|r)?i?\\b`
      }, {
        begin: "\\b0[dD][0-9](_?[0-9])*r?i?\\b"
      }, {
        begin: "\\b0[bB][0-1](_?[0-1])*r?i?\\b"
      }, { begin: "\\b0[oO][0-7](_?[0-7])*r?i?\\b" }, {
        begin: "\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"
      }, {
        begin: "\\b0(_?[0-7])+r?i?\\b"
      }]
    }, v = { variants: [{ match: /\(\)/ }, {
      className: "params",
      begin: /\(/,
      end: /(?=\))/,
      excludeBegin: !0,
      endsParent: !0,
      keywords: s
    }] }, y = [u, { variants: [{ match: [/class\s+/, r, /\s+<\s+/, r] }, {
      match: [/\b(class|module)\s+/, r]
    }], scope: {
      2: "title.class",
      4: "title.class.inherited"
    }, keywords: s }, { match: [/(include|extend)\s+/, r], scope: {
      2: "title.class"
    }, keywords: s }, { relevance: 0, match: [r, /\.new[. (]/], scope: {
      1: "title.class"
    } }, {
      relevance: 0,
      match: /\b[A-Z][A-Z_0-9]+\b/,
      className: "variable.constant"
    }, { relevance: 0, match: i, scope: "title.class" }, {
      match: [/def/, /\s+/, n],
      scope: { 1: "keyword", 3: "title.function" },
      contains: [v]
    }, {
      begin: t.IDENT_RE + "::"
    }, {
      className: "symbol",
      begin: t.UNDERSCORE_IDENT_RE + "(!|\\?)?:",
      relevance: 0
    }, {
      className: "symbol",
      begin: ":(?!\\s)",
      contains: [u, { begin: n }],
      relevance: 0
    }, E, {
      className: "variable",
      begin: "(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"
    }, {
      className: "params",
      begin: /\|/,
      end: /\|/,
      excludeBegin: !0,
      excludeEnd: !0,
      relevance: 0,
      keywords: s
    }, {
      begin: "(" + t.RE_STARTERS_RE + "|unless)\\s*",
      keywords: "unless",
      contains: [{
        className: "regexp",
        contains: [t.BACKSLASH_ESCAPE, h],
        illegal: /\n/,
        variants: [{ begin: "/", end: "/[a-z]*" }, { begin: /%r\{/, end: /\}[a-z]*/ }, {
          begin: "%r\\(",
          end: "\\)[a-z]*"
        }, { begin: "%r!", end: "![a-z]*" }, {
          begin: "%r\\[",
          end: "\\][a-z]*"
        }]
      }].concat(c, l),
      relevance: 0
    }].concat(c, l);
    h.contains = y, v.contains = y;
    const L = [{
      begin: /^\s*=>/,
      starts: { end: "$", contains: y }
    }, {
      className: "meta.prompt",
      begin: "^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+[>*]|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
      starts: { end: "$", keywords: s, contains: y }
    }];
    return l.unshift(c), {
      name: "Ruby",
      aliases: ["rb", "gemspec", "podspec", "thor", "irb"],
      keywords: s,
      illegal: /\/\*/,
      contains: [t.SHEBANG({ binary: "ruby" })].concat(L).concat(l).concat(y)
    };
  },
  grmr_typescript: (t) => {
    const e = Kn(t), n = bt, i = ["any", "void", "number", "boolean", "string", "object", "never", "symbol", "bigint", "unknown"], r = {
      begin: [/namespace/, /\s+/, t.IDENT_RE],
      beginScope: { 1: "keyword", 3: "title.class" }
    }, s = {
      beginKeywords: "interface",
      end: /\{/,
      excludeEnd: !0,
      keywords: {
        keyword: "interface extends",
        built_in: i
      },
      contains: [e.exports.CLASS_REFERENCE]
    }, a = {
      $pattern: bt,
      keyword: Sr.concat(["type", "interface", "public", "private", "protected", "implements", "declare", "abstract", "readonly", "enum", "override", "satisfies"]),
      literal: vr,
      built_in: Cr.concat(i),
      "variable.language": Mr
    }, c = {
      className: "meta",
      begin: "@" + n
    }, l = (u, _, E) => {
      const v = u.contains.findIndex(((y) => y.label === _));
      if (v === -1) throw Error("can not find mode to replace");
      u.contains.splice(v, 1, E);
    };
    Object.assign(e.keywords, a), e.exports.PARAMS_CONTAINS.push(c);
    const h = e.contains.find(((u) => u.className === "attr"));
    return e.exports.PARAMS_CONTAINS.push([e.exports.CLASS_REFERENCE, h]), e.contains = e.contains.concat([c, r, s]), l(e, "shebang", t.SHEBANG()), l(e, "use_strict", {
      className: "meta",
      relevance: 10,
      begin: /^\s*['"]use strict['"]/
    }), e.contains.find(((u) => u.label === "func.def")).relevance = 0, Object.assign(e, {
      name: "TypeScript",
      aliases: ["ts", "tsx", "mts", "cts"]
    }), e;
  },
  grmr_xml: (t) => {
    const e = t.regex, n = e.concat(/[\p{L}_]/u, e.optional(/[\p{L}0-9_.-]*:/u), /[\p{L}0-9_.-]*/u), i = {
      className: "symbol",
      begin: /&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;/
    }, r = {
      begin: /\s/,
      contains: [{ className: "keyword", begin: /#?[a-z_][a-z1-9_-]+/, illegal: /\n/ }]
    }, s = t.inherit(r, { begin: /\(/, end: /\)/ }), a = t.inherit(t.APOS_STRING_MODE, {
      className: "string"
    }), c = t.inherit(t.QUOTE_STRING_MODE, { className: "string" }), l = {
      endsWithParent: !0,
      illegal: /</,
      relevance: 0,
      contains: [{
        className: "attr",
        begin: /[\p{L}0-9._:-]+/u,
        relevance: 0
      }, { begin: /=\s*/, relevance: 0, contains: [{
        className: "string",
        endsParent: !0,
        variants: [{ begin: /"/, end: /"/, contains: [i] }, {
          begin: /'/,
          end: /'/,
          contains: [i]
        }, { begin: /[^\s"'=<>`]+/ }]
      }] }]
    };
    return {
      name: "HTML, XML",
      aliases: ["html", "xhtml", "rss", "atom", "xjb", "xsd", "xsl", "plist", "wsf", "svg"],
      case_insensitive: !0,
      unicodeRegex: !0,
      contains: [{
        className: "meta",
        begin: /<![a-z]/,
        end: />/,
        relevance: 10,
        contains: [r, c, a, s, { begin: /\[/, end: /\]/, contains: [{
          className: "meta",
          begin: /<![a-z]/,
          end: />/,
          contains: [r, s, c, a]
        }] }]
      }, t.COMMENT(/<!--/, /-->/, { relevance: 10 }), {
        begin: /<!\[CDATA\[/,
        end: /\]\]>/,
        relevance: 10
      }, i, { className: "meta", end: /\?>/, variants: [{
        begin: /<\?xml/,
        relevance: 10,
        contains: [c]
      }, { begin: /<\?[a-z][a-z0-9]+/ }] }, {
        className: "tag",
        begin: /<style(?=\s|>)/,
        end: />/,
        keywords: { name: "style" },
        contains: [l],
        starts: {
          end: /<\/style>/,
          returnEnd: !0,
          subLanguage: ["css", "xml"]
        }
      }, {
        className: "tag",
        begin: /<script(?=\s|>)/,
        end: />/,
        keywords: { name: "script" },
        contains: [l],
        starts: {
          end: /<\/script>/,
          returnEnd: !0,
          subLanguage: ["javascript", "handlebars", "xml"]
        }
      }, {
        className: "tag",
        begin: /<>|<\/>/
      }, {
        className: "tag",
        begin: e.concat(/</, e.lookahead(e.concat(n, e.either(/\/>/, />/, /\s/)))),
        end: /\/?>/,
        contains: [{ className: "name", begin: n, relevance: 0, starts: l }]
      }, {
        className: "tag",
        begin: e.concat(/<\//, e.lookahead(e.concat(n, />/))),
        contains: [{
          className: "name",
          begin: n,
          relevance: 0
        }, { begin: />/, relevance: 0, endsParent: !0 }]
      }]
    };
  },
  grmr_yaml: (t) => {
    const e = "true false yes no null", n = "[\\w#;/?:@&=+$,.~*'()[\\]]+", i = {
      className: "string",
      relevance: 0,
      variants: [{ begin: /'/, end: /'/ }, {
        begin: /"/,
        end: /"/
      }, { begin: /\S+/ }],
      contains: [t.BACKSLASH_ESCAPE, {
        className: "template-variable",
        variants: [{ begin: /\{\{/, end: /\}\}/ }, { begin: /%\{/, end: /\}/ }]
      }]
    }, r = t.inherit(i, {
      variants: [{ begin: /'/, end: /'/ }, { begin: /"/, end: /"/ }, { begin: /[^\s,{}[\]]+/ }]
    }), s = {
      end: ",",
      endsWithParent: !0,
      excludeEnd: !0,
      keywords: e,
      relevance: 0
    }, a = {
      begin: /\{/,
      end: /\}/,
      contains: [s],
      illegal: "\\n",
      relevance: 0
    }, c = {
      begin: "\\[",
      end: "\\]",
      contains: [s],
      illegal: "\\n",
      relevance: 0
    }, l = [{ className: "attr", variants: [{
      begin: /\w[\w :()\./-]*:(?=[ \t]|$)/
    }, { begin: /"\w[\w :()\./-]*":(?=[ \t]|$)/ }, {
      begin: /'\w[\w :()\./-]*':(?=[ \t]|$)/
    }] }, {
      className: "meta",
      begin: "^---\\s*$",
      relevance: 10
    }, {
      className: "string",
      begin: "[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"
    }, {
      begin: "<%[%=-]?",
      end: "[%-]?%>",
      subLanguage: "ruby",
      excludeBegin: !0,
      excludeEnd: !0,
      relevance: 0
    }, { className: "type", begin: "!\\w+!" + n }, {
      className: "type",
      begin: "!<" + n + ">"
    }, { className: "type", begin: "!" + n }, {
      className: "type",
      begin: "!!" + n
    }, { className: "meta", begin: "&" + t.UNDERSCORE_IDENT_RE + "$" }, {
      className: "meta",
      begin: "\\*" + t.UNDERSCORE_IDENT_RE + "$"
    }, {
      className: "bullet",
      begin: "-(?=[ ]|$)",
      relevance: 0
    }, t.HASH_COMMENT_MODE, { beginKeywords: e, keywords: { literal: e } }, {
      className: "number",
      begin: "\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
    }, { className: "number", begin: t.C_NUMBER_RE + "\\b", relevance: 0 }, a, c, i], h = [...l];
    return h.pop(), h.push(r), s.contains = h, {
      name: "YAML",
      case_insensitive: !0,
      aliases: ["yml"],
      contains: l
    };
  }
});
const Wt = Ar;
for (const t of Object.keys(Xn)) {
  const e = t.replace("grmr_", "").replace("_", "-");
  Wt.registerLanguage(e, Xn[t]);
}
var qs = Object.defineProperty, Ks = Object.getOwnPropertyDescriptor, $e = (t, e, n, i) => {
  for (var r = i > 1 ? void 0 : i ? Ks(e, n) : e, s = t.length - 1, a; s >= 0; s--)
    (a = t[s]) && (r = (i ? a(e, n, r) : a(r)) || r);
  return i && r && qs(e, n, r), r;
};
const rn = new lr(
  Ri({
    langPrefix: "hljs language-",
    highlight(t, e) {
      const n = Wt.getLanguage(e) ? e : "plaintext";
      return Wt.highlight(t, { language: n }).value;
    }
  })
), Ir = new rn.Renderer();
Ir.heading = function({ tokens: t, depth: e }) {
  const n = t.map((i) => i.text).join("");
  return `<h${e} data-heading="${n}">${n}</h${e}>`;
};
rn.setOptions({ renderer: Ir });
function Xs(t, e) {
  for (let n = 0; n < e.length; n++)
    t = t.replace(new RegExp(e[n], "g"), "");
  return t;
}
let ye = class extends Gr {
  static get Style() {
    return (
      /* css */
      `
      :host {
        display: flex;
        flex-direction: column;
        align-self: stretch;
        justify-self: stretch;
        flex: 1 1 auto;
        /* overflow-x: hidden; */
        /* overflow-y: auto; */
        -webkit-overflow-scrolling: touch;
        -webkit-tap-highlight-color: transparent;
        padding: 0 var(--io_lineHeight);
        padding-bottom: var(--io_lineHeight);
        color: var(--io_color);
        background-color: var(--io_bgColor);
        font-size: var(--io_fontSize);
      }
      :host p {
        line-height: 1.45em;
        margin: 0.35em 0;
      }
      :host a {
        text-decoration: none;
        color: var(--io_colorBlue);
      }
      :host h1 {
        padding: 0.7em 0;
        margin: 0;
        border-bottom: var(--io_border);
        color: var(--io_colorStrong);
      }
      :host h2 {
        padding: 0.6em 0;
        margin: 0;
        color: var(--io_colorStrong);
      }
      :host h3 {
        padding: 0.5em 0;
        margin: 0;
        color: var(--io_colorStrong);
      }
      :host h4 {
        padding: 0.4em 0;
        margin: 0;
        color: var(--io_colorStrong);
      }
      :host code {
        background-color: var(--io_bgColorLight);
      }
      :host strong code {}
      :host pre > code {
        line-height: 1.3em;
      }
      
      :host code[class] {
        background-color: var(--io_bgColorLight);
        padding: var(--io_spacing3);
        display: block;
        overflow-x: auto;
        font-size: var(--io-code-size);
      }
      :host blockquote {
        font-size: 0.85em;
        opacity: 0.75;
        margin: var(--io_lineHeight) 0;
        padding: var(--io_spacing3) var(--io_lineHeight);
        background-color: var(--io_bgColorStrong);
        color: var(--io_color);
        border-left: var(--io_border);
        border-left-width: var(--io_spacing2);
      }
      :host blockquote strong {
        color: var(--io_colorStrong);
      }
      :host table  {
        width: 100% !important;
        border: var(--io_border);
        border-collapse: collapse;
        table-layout: auto;
      }
      :host table th {
        background-color: var(--io_bgColorLight);
        color: var(--io_colorStrong);
        font-weight: bold;
      }
      :host table td,
      :host table tr,
      :host table th {
        border: var(--io_border);
        padding: var(--io_spacing) var(--io_spacing2);
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        width: auto;
      }
      :host .videocontainer {
          width: 100%;
          height: 0;
          position: relative;
          padding-bottom: 56.25%;
      }
      :host .videocontainer > iframe {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
      }
      @keyframes spinner {
        to {transform: rotate(360deg);}
      }
      :host[loading]:after {
        content: '';
        box-sizing: border-box;
        position: absolute;
        top: 50%;
        left: 50%;
        width: 40px;
        height: 40px;
        margin-top: -20px;
        margin-left: -20px;
        border-radius: 50%;
        border: var(--io_border);
        border-top-color: #000;
        animation: spinner .6s linear infinite;
      }
    `
    );
  }
  constructor(t = {}) {
    super(t);
  }
  onResized() {
    let t = this.getBoundingClientRect().width;
    t = Math.min(Math.max((t - 30) / 45, 11), 14), this.style.setProperty("--io-code-size", t + "px");
  }
  srcChanged() {
    this.loading = !0, this.innerHTML = "", fetch(this.src).then((t) => t.text()).then((t) => {
      let e = rn.parse(t);
      this.sanitize && (e = Ji.sanitize(e)), this.innerHTML = Xs(e, this.strip), this.loading = !1;
    });
  }
};
$e([
  xt({ value: "", reflect: !0 })
], ye.prototype, "src", 2);
$e([
  xt({ type: Array, init: null })
], ye.prototype, "strip", 2);
$e([
  xt({ value: !1, reflect: !0 })
], ye.prototype, "loading", 2);
$e([
  xt(!0)
], ye.prototype, "sanitize", 2);
$e([
  Fr("document")
], ye.prototype, "role", 2);
ye = $e([
  Wr
], ye);
const Qs = function(t) {
  return ye.vConstructor(t);
}, kt = document.createElement("style");
kt.id = "io-highlight-theme";
document.head.appendChild(kt);
function Lr() {
  Yn.themeID === "dark" ? kt.innerHTML = ts : kt.innerHTML = es;
}
Lr();
Yn.addEventListener("themeID-changed", Lr);
export {
  ye as IoMarkdown,
  ts as MD_DARK_THEME,
  es as MD_LIGHT_THEME,
  Qs as ioMarkdown
};
//# sourceMappingURL=index.js.map
