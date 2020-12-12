/*
  Highlight.js 10.4.1 (e96b915a)
  License: BSD-3-Clause
  Copyright (c) 2006-2020, Ivan Sagalaev
*/
var hljs=function(){"use strict";function e(t){
return t instanceof Map?t.clear=t.delete=t.set=()=>{
throw Error("map is read-only")}:t instanceof Set&&(t.add=t.clear=t.delete=()=>{
throw Error("set is read-only")
}),Object.freeze(t),Object.getOwnPropertyNames(t).forEach((n=>{var s=t[n]
;"object"!=typeof s||Object.isFrozen(s)||e(s)})),t}var t=e,n=e;t.default=n
;class s{constructor(e){void 0===e.data&&(e.data={}),this.data=e.data}
ignoreMatch(){this.ignore=!0}}function r(e){
return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#x27;")
}function a(e,...t){const n=Object.create(null);for(const t in e)n[t]=e[t]
;return t.forEach((e=>{for(const t in e)n[t]=e[t]})),n}function i(e){
return e.nodeName.toLowerCase()}var o=Object.freeze({__proto__:null,
escapeHTML:r,inherit:a,nodeStream:e=>{const t=[];return function e(n,s){
for(let r=n.firstChild;r;r=r.nextSibling)3===r.nodeType?s+=r.nodeValue.length:1===r.nodeType&&(t.push({
event:"start",offset:s,node:r}),s=e(r,s),i(r).match(/br|hr|img|input/)||t.push({
event:"stop",offset:s,node:r}));return s}(e,0),t},mergeStreams:(e,t,n)=>{
let s=0,a="";const o=[];function l(){
return e.length&&t.length?e[0].offset!==t[0].offset?e[0].offset<t[0].offset?e:t:"start"===t[0].event?e:t:e.length?e:t
}function c(e){
a+="<"+i(e)+[].map.call(e.attributes,(e=>" "+e.nodeName+'="'+r(e.value)+'"')).join("")+">"
}function u(e){a+="</"+i(e)+">"}function g(e){("start"===e.event?c:u)(e.node)}
for(;e.length||t.length;){let t=l()
;if(a+=r(n.substring(s,t[0].offset)),s=t[0].offset,t===e){o.reverse().forEach(u)
;do{g(t.splice(0,1)[0]),t=l()}while(t===e&&t.length&&t[0].offset===s)
;o.reverse().forEach(c)
}else"start"===t[0].event?o.push(t[0].node):o.pop(),g(t.splice(0,1)[0])}
return a+r(n.substr(s))}});const l=e=>!!e.kind;class c{constructor(e,t){
this.buffer="",this.classPrefix=t.classPrefix,e.walk(this)}addText(e){
this.buffer+=r(e)}openNode(e){if(!l(e))return;let t=e.kind
;e.sublanguage||(t=`${this.classPrefix}${t}`),this.span(t)}closeNode(e){
l(e)&&(this.buffer+="</span>")}value(){return this.buffer}span(e){
this.buffer+=`<span class="${e}">`}}class u{constructor(){this.rootNode={
children:[]},this.stack=[this.rootNode]}get top(){
return this.stack[this.stack.length-1]}get root(){return this.rootNode}add(e){
this.top.children.push(e)}openNode(e){const t={kind:e,children:[]}
;this.add(t),this.stack.push(t)}closeNode(){
if(this.stack.length>1)return this.stack.pop()}closeAllNodes(){
for(;this.closeNode(););}toJSON(){return JSON.stringify(this.rootNode,null,4)}
walk(e){return this.constructor._walk(e,this.rootNode)}static _walk(e,t){
return"string"==typeof t?e.addText(t):t.children&&(e.openNode(t),
t.children.forEach((t=>this._walk(e,t))),e.closeNode(t)),e}static _collapse(e){
"string"!=typeof e&&e.children&&(e.children.every((e=>"string"==typeof e))?e.children=[e.children.join("")]:e.children.forEach((e=>{
u._collapse(e)})))}}class g extends u{constructor(e){super(),this.options=e}
addKeyword(e,t){""!==e&&(this.openNode(t),this.addText(e),this.closeNode())}
addText(e){""!==e&&this.add(e)}addSublanguage(e,t){const n=e.root
;n.kind=t,n.sublanguage=!0,this.add(n)}toHTML(){
return new c(this,this.options).value()}finalize(){return!0}}function d(e){
return e?"string"==typeof e?e:e.source:null}
const h="[a-zA-Z]\\w*",f="[a-zA-Z_]\\w*",p="\\b\\d+(\\.\\d+)?",m="(-?)(\\b0[xX][a-fA-F0-9]+|(\\b\\d+(\\.\\d*)?|\\.\\d+)([eE][-+]?\\d+)?)",b="\\b(0b[01]+)",x={
begin:"\\\\[\\s\\S]",relevance:0},E={className:"string",begin:"'",end:"'",
illegal:"\\n",contains:[x]},v={className:"string",begin:'"',end:'"',
illegal:"\\n",contains:[x]},_={
begin:/\b(a|an|the|are|I'm|isn't|don't|doesn't|won't|but|just|should|pretty|simply|enough|gonna|going|wtf|so|such|will|you|your|they|like|more)\b/
},w=(e,t,n={})=>{const s=a({className:"comment",begin:e,end:t,contains:[]},n)
;return s.contains.push(_),s.contains.push({className:"doctag",
begin:"(?:TODO|FIXME|NOTE|BUG|OPTIMIZE|HACK|XXX):",relevance:0}),s
},N=w("//","$"),y=w("/\\*","\\*/"),R=w("#","$");var k=Object.freeze({
__proto__:null,IDENT_RE:h,UNDERSCORE_IDENT_RE:f,NUMBER_RE:p,C_NUMBER_RE:m,
BINARY_NUMBER_RE:b,
RE_STARTERS_RE:"!|!=|!==|%|%=|&|&&|&=|\\*|\\*=|\\+|\\+=|,|-|-=|/=|/|:|;|<<|<<=|<=|<|===|==|=|>>>=|>>=|>=|>>>|>>|>|\\?|\\[|\\{|\\(|\\^|\\^=|\\||\\|=|\\|\\||~",
SHEBANG:(e={})=>{const t=/^#![ ]*\//
;return e.binary&&(e.begin=((...e)=>e.map((e=>d(e))).join(""))(t,/.*\b/,e.binary,/\b.*/)),
a({className:"meta",begin:t,end:/$/,relevance:0,"on:begin":(e,t)=>{
0!==e.index&&t.ignoreMatch()}},e)},BACKSLASH_ESCAPE:x,APOS_STRING_MODE:E,
QUOTE_STRING_MODE:v,PHRASAL_WORDS_MODE:_,COMMENT:w,C_LINE_COMMENT_MODE:N,
C_BLOCK_COMMENT_MODE:y,HASH_COMMENT_MODE:R,NUMBER_MODE:{className:"number",
begin:p,relevance:0},C_NUMBER_MODE:{className:"number",begin:m,relevance:0},
BINARY_NUMBER_MODE:{className:"number",begin:b,relevance:0},CSS_NUMBER_MODE:{
className:"number",
begin:p+"(%|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|px|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx)?",
relevance:0},REGEXP_MODE:{begin:/(?=\/[^/\n]*\/)/,contains:[{className:"regexp",
begin:/\//,end:/\/[gimuy]*/,illegal:/\n/,contains:[x,{begin:/\[/,end:/\]/,
relevance:0,contains:[x]}]}]},TITLE_MODE:{className:"title",begin:h,relevance:0
},UNDERSCORE_TITLE_MODE:{className:"title",begin:f,relevance:0},METHOD_GUARD:{
begin:"\\.\\s*[a-zA-Z_]\\w*",relevance:0},END_SAME_AS_BEGIN:e=>Object.assign(e,{
"on:begin":(e,t)=>{t.data._beginMatch=e[1]},"on:end":(e,t)=>{
t.data._beginMatch!==e[1]&&t.ignoreMatch()}})})
;const M=["of","and","for","in","not","or","if","then","parent","list","value"]
;function O(e){function t(t,n){
return RegExp(d(t),"m"+(e.case_insensitive?"i":"")+(n?"g":""))}class n{
constructor(){
this.matchIndexes={},this.regexes=[],this.matchAt=1,this.position=0}
addRule(e,t){
t.position=this.position++,this.matchIndexes[this.matchAt]=t,this.regexes.push([t,e]),
this.matchAt+=(e=>RegExp(e.toString()+"|").exec("").length-1)(e)+1}compile(){
0===this.regexes.length&&(this.exec=()=>null)
;const e=this.regexes.map((e=>e[1]));this.matcherRe=t(((e,t="|")=>{
const n=/\[(?:[^\\\]]|\\.)*\]|\(\??|\\([1-9][0-9]*)|\\./;let s=0,r=""
;for(let a=0;a<e.length;a++){s+=1;const i=s;let o=d(e[a])
;for(a>0&&(r+=t),r+="(";o.length>0;){const e=n.exec(o);if(null==e){r+=o;break}
r+=o.substring(0,e.index),
o=o.substring(e.index+e[0].length),"\\"===e[0][0]&&e[1]?r+="\\"+(Number(e[1])+i):(r+=e[0],
"("===e[0]&&s++)}r+=")"}return r})(e),!0),this.lastIndex=0}exec(e){
this.matcherRe.lastIndex=this.lastIndex;const t=this.matcherRe.exec(e)
;if(!t)return null
;const n=t.findIndex(((e,t)=>t>0&&void 0!==e)),s=this.matchIndexes[n]
;return t.splice(0,n),Object.assign(t,s)}}class s{constructor(){
this.rules=[],this.multiRegexes=[],
this.count=0,this.lastIndex=0,this.regexIndex=0}getMatcher(e){
if(this.multiRegexes[e])return this.multiRegexes[e];const t=new n
;return this.rules.slice(e).forEach((([e,n])=>t.addRule(e,n))),
t.compile(),this.multiRegexes[e]=t,t}resumingScanAtSamePosition(){
return 0!==this.regexIndex}considerAll(){this.regexIndex=0}addRule(e,t){
this.rules.push([e,t]),"begin"===t.type&&this.count++}exec(e){
const t=this.getMatcher(this.regexIndex);t.lastIndex=this.lastIndex
;let n=t.exec(e)
;if(this.resumingScanAtSamePosition())if(n&&n.index===this.lastIndex);else{
const t=this.getMatcher(0);t.lastIndex=this.lastIndex+1,n=t.exec(e)}
return n&&(this.regexIndex+=n.position+1,
this.regexIndex===this.count&&this.considerAll()),n}}function r(e,t){
"."===e.input[e.index-1]&&t.ignoreMatch()}
if(e.contains&&e.contains.includes("self"))throw Error("ERR: contains `self` is not supported at the top-level of a language.  See documentation.")
;return e.classNameAliases=a(e.classNameAliases||{}),function n(i,o){const l=i
;if(i.compiled)return l
;i.compiled=!0,i.__beforeBegin=null,i.keywords=i.keywords||i.beginKeywords
;let c=null
;if("object"==typeof i.keywords&&(c=i.keywords.$pattern,delete i.keywords.$pattern),
i.keywords&&(i.keywords=((e,t)=>{const n={}
;return"string"==typeof e?s("keyword",e):Object.keys(e).forEach((t=>{s(t,e[t])
})),n;function s(e,s){t&&(s=s.toLowerCase()),s.split(" ").forEach((t=>{
const s=t.split("|");n[s[0]]=[e,A(s[0],s[1])]}))}
})(i.keywords,e.case_insensitive)),
i.lexemes&&c)throw Error("ERR: Prefer `keywords.$pattern` to `mode.lexemes`, BOTH are not allowed. (see mode reference) ")
;return l.keywordPatternRe=t(i.lexemes||c||/\w+/,!0),
o&&(i.beginKeywords&&(i.begin="\\b("+i.beginKeywords.split(" ").join("|")+")(?!\\.)(?=\\b|\\s)",
i.__beforeBegin=r),
i.begin||(i.begin=/\B|\b/),l.beginRe=t(i.begin),i.endSameAsBegin&&(i.end=i.begin),
i.end||i.endsWithParent||(i.end=/\B|\b/),
i.end&&(l.endRe=t(i.end)),l.terminator_end=d(i.end)||"",
i.endsWithParent&&o.terminator_end&&(l.terminator_end+=(i.end?"|":"")+o.terminator_end)),
i.illegal&&(l.illegalRe=t(i.illegal)),
void 0===i.relevance&&(i.relevance=1),i.contains||(i.contains=[]),
i.contains=[].concat(...i.contains.map((e=>(e=>(e.variants&&!e.cached_variants&&(e.cached_variants=e.variants.map((t=>a(e,{
variants:null},t)))),e.cached_variants?e.cached_variants:L(e)?a(e,{
starts:e.starts?a(e.starts):null
}):Object.isFrozen(e)?a(e):e))("self"===e?i:e)))),i.contains.forEach((e=>{n(e,l)
})),i.starts&&n(i.starts,o),l.matcher=(e=>{const t=new s
;return e.contains.forEach((e=>t.addRule(e.begin,{rule:e,type:"begin"
}))),e.terminator_end&&t.addRule(e.terminator_end,{type:"end"
}),e.illegal&&t.addRule(e.illegal,{type:"illegal"}),t})(l),l}(e)}function L(e){
return!!e&&(e.endsWithParent||L(e.starts))}function A(e,t){
return t?Number(t):(e=>M.includes(e.toLowerCase()))(e)?0:1}function j(e){
const t={props:["language","code","autodetect"],data:()=>({detectedLanguage:"",
unknownLanguage:!1}),computed:{className(){
return this.unknownLanguage?"":"hljs "+this.detectedLanguage},highlighted(){
if(!this.autoDetect&&!e.getLanguage(this.language))return console.warn(`The language "${this.language}" you specified could not be found.`),
this.unknownLanguage=!0,r(this.code);let t
;return this.autoDetect?(t=e.highlightAuto(this.code),
this.detectedLanguage=t.language):(t=e.highlight(this.language,this.code,this.ignoreIllegals),
this.detectedLanguage=this.language),t.value},autoDetect(){
return!(this.language&&(e=this.autodetect,!e&&""!==e));var e},
ignoreIllegals:()=>!0},render(e){return e("pre",{},[e("code",{
class:this.className,domProps:{innerHTML:this.highlighted}})])}};return{
Component:t,VuePlugin:{install(e){e.component("highlightjs",t)}}}}
const I=r,S=a,{nodeStream:T,mergeStreams:B}=o,P=Symbol("nomatch");return(e=>{
const n=[],r=Object.create(null),a=Object.create(null),i=[];let o=!0
;const l=/(^(<[^>]+>|\t|)+|\n)/gm,c="Could not find the language '{}', did you forget to load/include a language module?",u={
disableAutodetect:!0,name:"Plain text",contains:[]};let d={
noHighlightRe:/^(no-?highlight)$/i,
languageDetectRe:/\blang(?:uage)?-([\w-]+)\b/i,classPrefix:"hljs-",
tabReplace:null,useBR:!1,languages:null,__emitter:g};function h(e){
return d.noHighlightRe.test(e)}function f(e,t,n,s){const r={code:t,language:e}
;N("before:highlight",r);const a=r.result?r.result:p(r.language,r.code,n,s)
;return a.code=r.code,N("after:highlight",a),a}function p(e,t,n,a){const i=t
;function l(e,t){const n=_.case_insensitive?t[0].toLowerCase():t[0]
;return Object.prototype.hasOwnProperty.call(e.keywords,n)&&e.keywords[n]}
function u(){null!=y.subLanguage?(()=>{if(""===M)return;let e=null
;if("string"==typeof y.subLanguage){
if(!r[y.subLanguage])return void k.addText(M)
;e=p(y.subLanguage,M,!0,R[y.subLanguage]),R[y.subLanguage]=e.top
}else e=m(M,y.subLanguage.length?y.subLanguage:null)
;y.relevance>0&&(L+=e.relevance),k.addSublanguage(e.emitter,e.language)
})():(()=>{if(!y.keywords)return void k.addText(M);let e=0
;y.keywordPatternRe.lastIndex=0;let t=y.keywordPatternRe.exec(M),n="";for(;t;){
n+=M.substring(e,t.index);const s=l(y,t);if(s){const[e,r]=s
;k.addText(n),n="",L+=r;const a=_.classNameAliases[e]||e;k.addKeyword(t[0],a)
}else n+=t[0];e=y.keywordPatternRe.lastIndex,t=y.keywordPatternRe.exec(M)}
n+=M.substr(e),k.addText(n)})(),M=""}function g(e){
return e.className&&k.openNode(_.classNameAliases[e.className]||e.className),
y=Object.create(e,{parent:{value:y}}),y}function h(e,t,n){let r=((e,t)=>{
const n=e&&e.exec(t);return n&&0===n.index})(e.endRe,n);if(r){if(e["on:end"]){
const n=new s(e);e["on:end"](t,n),n.ignore&&(r=!1)}if(r){
for(;e.endsParent&&e.parent;)e=e.parent;return e}}
if(e.endsWithParent)return h(e.parent,t,n)}function f(e){
return 0===y.matcher.regexIndex?(M+=e[0],1):(S=!0,0)}function b(e){
const t=e[0],n=i.substr(e.index),s=h(y,e,n);if(!s)return P;const r=y
;r.skip?M+=t:(r.returnEnd||r.excludeEnd||(M+=t),u(),r.excludeEnd&&(M=t));do{
y.className&&k.closeNode(),y.skip||y.subLanguage||(L+=y.relevance),y=y.parent
}while(y!==s.parent)
;return s.starts&&(s.endSameAsBegin&&(s.starts.endRe=s.endRe),
g(s.starts)),r.returnEnd?0:t.length}let x={};function E(t,r){const a=r&&r[0]
;if(M+=t,null==a)return u(),0
;if("begin"===x.type&&"end"===r.type&&x.index===r.index&&""===a){
if(M+=i.slice(r.index,r.index+1),!o){const t=Error("0 width match regex")
;throw t.languageName=e,t.badRule=x.rule,t}return 1}
if(x=r,"begin"===r.type)return function(e){
const t=e[0],n=e.rule,r=new s(n),a=[n.__beforeBegin,n["on:begin"]]
;for(const n of a)if(n&&(n(e,r),r.ignore))return f(t)
;return n&&n.endSameAsBegin&&(n.endRe=RegExp(t.replace(/[-/\\^$*+?.()|[\]{}]/g,"\\$&"),"m")),
n.skip?M+=t:(n.excludeBegin&&(M+=t),
u(),n.returnBegin||n.excludeBegin||(M=t)),g(n),n.returnBegin?0:t.length}(r)
;if("illegal"===r.type&&!n){
const e=Error('Illegal lexeme "'+a+'" for mode "'+(y.className||"<unnamed>")+'"')
;throw e.mode=y,e}if("end"===r.type){const e=b(r);if(e!==P)return e}
if("illegal"===r.type&&""===a)return 1
;if(j>1e5&&j>3*r.index)throw Error("potential infinite loop, way more iterations than matches")
;return M+=a,a.length}const _=v(e);if(!_)throw console.error(c.replace("{}",e)),
Error('Unknown language: "'+e+'"');const w=O(_);let N="",y=a||w
;const R={},k=new d.__emitter(d);(()=>{const e=[]
;for(let t=y;t!==_;t=t.parent)t.className&&e.unshift(t.className)
;e.forEach((e=>k.openNode(e)))})();let M="",L=0,A=0,j=0,S=!1;try{
for(y.matcher.considerAll();;){
j++,S?S=!1:y.matcher.considerAll(),y.matcher.lastIndex=A
;const e=y.matcher.exec(i);if(!e)break;const t=E(i.substring(A,e.index),e)
;A=e.index+t}return E(i.substr(A)),k.closeAllNodes(),k.finalize(),N=k.toHTML(),{
relevance:L,value:N,language:e,illegal:!1,emitter:k,top:y}}catch(t){
if(t.message&&t.message.includes("Illegal"))return{illegal:!0,illegalBy:{
msg:t.message,context:i.slice(A-100,A+100),mode:t.mode},sofar:N,relevance:0,
value:I(i),emitter:k};if(o)return{illegal:!1,relevance:0,value:I(i),emitter:k,
language:e,top:y,errorRaised:t};throw t}}function m(e,t){
t=t||d.languages||Object.keys(r);const n=(e=>{const t={relevance:0,
emitter:new d.__emitter(d),value:I(e),illegal:!1,top:u}
;return t.emitter.addText(e),t})(e),s=t.filter(v).filter(w).map((t=>p(t,e,!1)))
;s.unshift(n);const a=s.sort(((e,t)=>{
if(e.relevance!==t.relevance)return t.relevance-e.relevance
;if(e.language&&t.language){if(v(e.language).supersetOf===t.language)return 1
;if(v(t.language).supersetOf===e.language)return-1}return 0})),[i,o]=a,l=i
;return l.second_best=o,l}function b(e){
return d.tabReplace||d.useBR?e.replace(l,(e=>"\n"===e?d.useBR?"<br>":e:d.tabReplace?e.replace(/\t/g,d.tabReplace):e)):e
}function x(e){let t=null;const n=(e=>{let t=e.className+" "
;t+=e.parentNode?e.parentNode.className:"";const n=d.languageDetectRe.exec(t)
;if(n){const t=v(n[1])
;return t||(console.warn(c.replace("{}",n[1])),console.warn("Falling back to no-highlight mode for this block.",e)),
t?n[1]:"no-highlight"}return t.split(/\s+/).find((e=>h(e)||v(e)))})(e)
;if(h(n))return;N("before:highlightBlock",{block:e,language:n
}),d.useBR?(t=document.createElement("div"),
t.innerHTML=e.innerHTML.replace(/\n/g,"").replace(/<br[ /]*>/g,"\n")):t=e
;const s=t.textContent,r=n?f(n,s,!0):m(s),i=T(t);if(i.length){
const e=document.createElement("div");e.innerHTML=r.value,r.value=B(i,T(e),s)}
r.value=b(r.value),N("after:highlightBlock",{block:e,result:r
}),e.innerHTML=r.value,e.className=((e,t,n)=>{const s=t?a[t]:n,r=[e.trim()]
;return e.match(/\bhljs\b/)||r.push("hljs"),
e.includes(s)||r.push(s),r.join(" ").trim()
})(e.className,n,r.language),e.result={language:r.language,re:r.relevance,
relavance:r.relevance},r.second_best&&(e.second_best={
language:r.second_best.language,re:r.second_best.relevance,
relavance:r.second_best.relevance})}const E=()=>{if(E.called)return;E.called=!0
;const e=document.querySelectorAll("pre code");n.forEach.call(e,x)}
;function v(e){return e=(e||"").toLowerCase(),r[e]||r[a[e]]}
function _(e,{languageName:t}){"string"==typeof e&&(e=[e]),e.forEach((e=>{a[e]=t
}))}function w(e){const t=v(e);return t&&!t.disableAutodetect}function N(e,t){
const n=e;i.forEach((e=>{e[n]&&e[n](t)}))}Object.assign(e,{highlight:f,
highlightAuto:m,
fixMarkup:e=>(console.warn("fixMarkup is deprecated and will be removed entirely in v11.0"),
console.warn("Please see https://github.com/highlightjs/highlight.js/issues/2534"),
b(e)),highlightBlock:x,configure:e=>{
e.useBR&&(console.warn("'useBR' option is deprecated and will be removed entirely in v11.0"),
console.warn("Please see https://github.com/highlightjs/highlight.js/issues/2559")),
d=S(d,e)},initHighlighting:E,initHighlightingOnLoad:()=>{
window.addEventListener("DOMContentLoaded",E,!1)},registerLanguage:(t,n)=>{
let s=null;try{s=n(e)}catch(e){
if(console.error("Language definition for '{}' could not be registered.".replace("{}",t)),
!o)throw e;console.error(e),s=u}
s.name||(s.name=t),r[t]=s,s.rawDefinition=n.bind(null,e),
s.aliases&&_(s.aliases,{languageName:t})},listLanguages:()=>Object.keys(r),
getLanguage:v,registerAliases:_,requireLanguage:e=>{
console.warn("requireLanguage is deprecated and will be removed entirely in the future."),
console.warn("Please see https://github.com/highlightjs/highlight.js/pull/2844")
;const t=v(e);if(t)return t
;throw Error("The '{}' language is required, but not loaded.".replace("{}",e))},
autoDetection:w,inherit:S,addPlugin:e=>{i.push(e)},vuePlugin:j(e).VuePlugin
}),e.debugMode=()=>{o=!1},e.safeMode=()=>{o=!0},e.versionString="10.4.1"
;for(const e in k)"object"==typeof k[e]&&t(k[e]);return Object.assign(e,k),e
})({})}()
;"object"==typeof exports&&"undefined"!=typeof module&&(module.exports=hljs);hljs.registerLanguage("accesslog",(()=>{"use strict";return e=>{
const n=["GET","POST","HEAD","PUT","DELETE","CONNECT","OPTIONS","PATCH","TRACE"]
;return{name:"Apache Access Log",contains:[{className:"number",
begin:"^\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b",relevance:5},{
className:"number",begin:"\\b\\d+\\b",relevance:0},{className:"string",
begin:'"('+n.join("|")+")",end:'"',keywords:n.join(" "),illegal:"\\n",
relevance:5,contains:[{begin:"HTTP/[12]\\.\\d",relevance:5}]},{
className:"string",begin:/\[\d[^\]\n]{8,}\]/,illegal:"\\n",relevance:1},{
className:"string",begin:/\[/,end:/\]/,illegal:"\\n",relevance:0},{
className:"string",begin:'"Mozilla/\\d\\.\\d \\(',end:'"',illegal:"\\n",
relevance:3},{className:"string",begin:'"',end:'"',illegal:"\\n",relevance:0}]}}
})());hljs.registerLanguage("ada",(()=>{"use strict";return e=>{
const n="[A-Za-z](_?[A-Za-z0-9.])*",s="[]\\{\\}%#'\"",a=e.COMMENT("--","$"),r={
begin:"\\s+:\\s+",end:"\\s*(:=|;|\\)|=>|$)",illegal:s,contains:[{
beginKeywords:"loop for declare others",endsParent:!0},{className:"keyword",
beginKeywords:"not null constant access function procedure in out aliased exception"
},{className:"type",begin:n,endsParent:!0,relevance:0}]};return{name:"Ada",
case_insensitive:!0,keywords:{
keyword:"abort else new return abs elsif not reverse abstract end accept entry select access exception of separate aliased exit or some all others subtype and for out synchronized array function overriding at tagged generic package task begin goto pragma terminate body private then if procedure type case in protected constant interface is raise use declare range delay limited record when delta loop rem while digits renames with do mod requeue xor",
literal:"True False"},contains:[a,{className:"string",begin:/"/,end:/"/,
contains:[{begin:/""/,relevance:0}]},{className:"string",begin:/'.'/},{
className:"number",
begin:"\\b(\\d(_|\\d)*#\\w+(\\.\\w+)?#([eE][-+]?\\d(_|\\d)*)?|\\d(_|\\d)*(\\.\\d(_|\\d)*)?([eE][-+]?\\d(_|\\d)*)?)",
relevance:0},{className:"symbol",begin:"'"+n},{className:"title",
begin:"(\\bwith\\s+)?(\\bprivate\\s+)?\\bpackage\\s+(\\bbody\\s+)?",
end:"(is|$)",keywords:"package body",excludeBegin:!0,excludeEnd:!0,illegal:s},{
begin:"(\\b(with|overriding)\\s+)?\\b(function|procedure)\\s+",
end:"(\\bis|\\bwith|\\brenames|\\)\\s*;)",
keywords:"overriding function procedure with is renames return",returnBegin:!0,
contains:[a,{className:"title",
begin:"(\\bwith\\s+)?\\b(function|procedure)\\s+",end:"(\\(|\\s+|$)",
excludeBegin:!0,excludeEnd:!0,illegal:s},r,{className:"type",
begin:"\\breturn\\s+",end:"(\\s+|;|$)",keywords:"return",excludeBegin:!0,
excludeEnd:!0,endsParent:!0,illegal:s}]},{className:"type",
begin:"\\b(sub)?type\\s+",end:"\\s+",keywords:"type",excludeBegin:!0,illegal:s
},r]}}})());hljs.registerLanguage("r",(()=>{"use strict";function e(...e){return e.map((e=>{
return(n=e)?"string"==typeof n?n:n.source:null;var n})).join("")}return n=>{
const a=/(?:(?:[a-zA-Z]|\.[._a-zA-Z])[._a-zA-Z0-9]*)|\.(?!\d)/;return{name:"R",
illegal:/->/,keywords:{$pattern:a,
keyword:"function if in break next repeat else for while",
literal:"NULL NA TRUE FALSE Inf NaN NA_integer_|10 NA_real_|10 NA_character_|10 NA_complex_|10",
built_in:"LETTERS letters month.abb month.name pi T F abs acos acosh all any anyNA Arg as.call as.character as.complex as.double as.environment as.integer as.logical as.null.default as.numeric as.raw asin asinh atan atanh attr attributes baseenv browser c call ceiling class Conj cos cosh cospi cummax cummin cumprod cumsum digamma dim dimnames emptyenv exp expression floor forceAndCall gamma gc.time globalenv Im interactive invisible is.array is.atomic is.call is.character is.complex is.double is.environment is.expression is.finite is.function is.infinite is.integer is.language is.list is.logical is.matrix is.na is.name is.nan is.null is.numeric is.object is.pairlist is.raw is.recursive is.single is.symbol lazyLoadDBfetch length lgamma list log max min missing Mod names nargs nzchar oldClass on.exit pos.to.env proc.time prod quote range Re rep retracemem return round seq_along seq_len seq.int sign signif sin sinh sinpi sqrt standardGeneric substitute sum switch tan tanh tanpi tracemem trigamma trunc unclass untracemem UseMethod xtfrm"
},contains:[n.COMMENT(/#'/,/$/,{contains:[{className:"doctag",begin:"@examples",
starts:{contains:[{begin:/\n/},{begin:/#'\s*(?=@[a-zA-Z]+)/,endsParent:!0},{
begin:/#'/,end:/$/,excludeBegin:!0}]}},{className:"doctag",begin:"@param",
end:/$/,contains:[{className:"variable",variants:[{begin:a},{
begin:/`(?:\\.|[^`\\])+`/}],endsParent:!0}]},{className:"doctag",
begin:/@[a-zA-Z]+/},{className:"meta-keyword",begin:/\\[a-zA-Z]+/}]
}),n.HASH_COMMENT_MODE,{className:"string",contains:[n.BACKSLASH_ESCAPE],
variants:[n.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\(/,end:/\)(-*)"/
}),n.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\{/,end:/\}(-*)"/
}),n.END_SAME_AS_BEGIN({begin:/[rR]"(-*)\[/,end:/\](-*)"/
}),n.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\(/,end:/\)(-*)'/
}),n.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\{/,end:/\}(-*)'/
}),n.END_SAME_AS_BEGIN({begin:/[rR]'(-*)\[/,end:/\](-*)'/}),{begin:'"',end:'"',
relevance:0},{begin:"'",end:"'",relevance:0}]},{className:"number",variants:[{
begin:/([^a-zA-Z0-9._])(?=0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?)/,
end:/0[xX][0-9a-fA-F]+\.[0-9a-fA-F]*[pP][+-]?\d+i?/,excludeBegin:!0},{
begin:/([^a-zA-Z0-9._])(?=0[xX][0-9a-fA-F]+([pP][+-]?\d+)?[Li]?)/,
end:/0[xX][0-9a-fA-F]+([pP][+-]?\d+)?[Li]?/,excludeBegin:!0},{
begin:/([^a-zA-Z0-9._])(?=(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?[Li]?)/,
end:/(\d+(\.\d*)?|\.\d+)([eE][+-]?\d+)?[Li]?/,excludeBegin:!0}],relevance:0},{
begin:"%",end:"%"},{begin:e(/[a-zA-Z][a-zA-Z_0-9]*/,"\\s+<-\\s+")},{begin:"`",
end:"`",contains:[{begin:/\\./}]}]}}})());hljs.registerLanguage("latex",(()=>{"use strict";return e=>{const n=[{
begin:/\^{6}[0-9a-f]{6}/},{begin:/\^{5}[0-9a-f]{5}/},{begin:/\^{4}[0-9a-f]{4}/
},{begin:/\^{3}[0-9a-f]{3}/},{begin:/\^{2}[0-9a-f]{2}/},{
begin:/\^{2}[\u0000-\u007f]/}],a=[{className:"keyword",begin:/\\/,relevance:0,
contains:[{endsParent:!0,begin:((...e)=>"("+e.map((e=>{
return(n=e)?"string"==typeof n?n:n.source:null;var n
})).join("|")+")")(...["(?:NeedsTeXFormat|RequirePackage|GetIdInfo)","Provides(?:Expl)?(?:Package|Class|File)","(?:DeclareOption|ProcessOptions)","(?:documentclass|usepackage|input|include)","makeat(?:letter|other)","ExplSyntax(?:On|Off)","(?:new|renew|provide)?command","(?:re)newenvironment","(?:New|Renew|Provide|Declare)(?:Expandable)?DocumentCommand","(?:New|Renew|Provide|Declare)DocumentEnvironment","(?:(?:e|g|x)?def|let)","(?:begin|end)","(?:part|chapter|(?:sub){0,2}section|(?:sub)?paragraph)","caption","(?:label|(?:eq|page|name)?ref|(?:paren|foot|super)?cite)","(?:alpha|beta|[Gg]amma|[Dd]elta|(?:var)?epsilon|zeta|eta|[Tt]heta|vartheta)","(?:iota|(?:var)?kappa|[Ll]ambda|mu|nu|[Xx]i|[Pp]i|varpi|(?:var)rho)","(?:[Ss]igma|varsigma|tau|[Uu]psilon|[Pp]hi|varphi|chi|[Pp]si|[Oo]mega)","(?:frac|sum|prod|lim|infty|times|sqrt|leq|geq|left|right|middle|[bB]igg?)","(?:[lr]angle|q?quad|[lcvdi]?dots|d?dot|hat|tilde|bar)"].map((e=>e+"(?![a-zA-Z@:_])")))
},{endsParent:!0,
begin:RegExp(["(?:__)?[a-zA-Z]{2,}_[a-zA-Z](?:_?[a-zA-Z])+:[a-zA-Z]*","[lgc]__?[a-zA-Z](?:_?[a-zA-Z])*_[a-zA-Z]{2,}","[qs]__?[a-zA-Z](?:_?[a-zA-Z])+","use(?:_i)?:[a-zA-Z]*","(?:else|fi|or):","(?:if|cs|exp):w","(?:hbox|vbox):n","::[a-zA-Z]_unbraced","::[a-zA-Z:]"].map((e=>e+"(?![a-zA-Z:_])")).join("|"))
},{endsParent:!0,variants:n},{endsParent:!0,relevance:0,variants:[{
begin:/[a-zA-Z@]+/},{begin:/[^a-zA-Z@]?/}]}]},{className:"params",relevance:0,
begin:/#+\d?/},{variants:n},{className:"built_in",relevance:0,begin:/[$&^_]/},{
className:"meta",begin:"% !TeX",end:"$",relevance:10},e.COMMENT("%","$",{
relevance:0})],i={begin:/\{/,end:/\}/,relevance:0,contains:["self",...a]
},t=e.inherit(i,{relevance:0,endsParent:!0,contains:[i,...a]}),r={begin:/\[/,
end:/\]/,endsParent:!0,relevance:0,contains:[i,...a]},s={begin:/\s+/,relevance:0
},c=[t],l=[r],o=(e,n)=>({contains:[s],starts:{relevance:0,contains:e,starts:n}
}),d=(e,n)=>({begin:"\\\\"+e+"(?![a-zA-Z@:_])",keywords:{$pattern:/\\[a-zA-Z]+/,
keyword:"\\"+e},relevance:0,contains:[s],starts:n}),g=(n,a)=>e.inherit({
begin:"\\\\begin(?=[ \t]*(\\r?\\n[ \t]*)?\\{"+n+"\\})",keywords:{
$pattern:/\\[a-zA-Z]+/,keyword:"\\begin"},relevance:0
},o(c,a)),m=(n="string")=>e.END_SAME_AS_BEGIN({className:n,begin:/(.|\r?\n)/,
end:/(.|\r?\n)/,excludeBegin:!0,excludeEnd:!0,endsParent:!0}),b=e=>({
className:"string",end:"(?=\\\\end\\{"+e+"\\})"}),p=(e="string")=>({relevance:0,
begin:/\{/,starts:{endsParent:!0,contains:[{className:e,end:/(?=\})/,
endsParent:!0,contains:[{begin:/\{/,end:/\}/,relevance:0,contains:["self"]}]}]}
});return{name:"LaTeX",aliases:["TeX"],
contains:[...["verb","lstinline"].map((e=>d(e,{contains:[m()]}))),d("mint",o(c,{
contains:[m()]})),d("mintinline",o(c,{contains:[p(),m()]})),d("url",{
contains:[p("link"),p("link")]}),d("hyperref",{contains:[p("link")]
}),d("href",o(l,{contains:[p("link")]
})),...[].concat(...["","\\*"].map((e=>[g("verbatim"+e,b("verbatim"+e)),g("filecontents"+e,o(c,b("filecontents"+e))),...["","B","L"].map((n=>g(n+"Verbatim"+e,o(l,b(n+"Verbatim"+e)))))]))),g("minted",o(l,o(c,b("minted")))),...a]
}}})());hljs.registerLanguage("xml",(()=>{"use strict";function e(e){
return e?"string"==typeof e?e:e.source:null}function n(e){return a("(?=",e,")")}
function a(...n){return n.map((n=>e(n))).join("")}function s(...n){
return"("+n.map((n=>e(n))).join("|")+")"}return e=>{
const t=a(/[A-Z_]/,a("(",/[A-Z0-9_.-]+:/,")?"),/[A-Z0-9_.-]*/),i={
className:"symbol",begin:"&[a-z]+;|&#[0-9]+;|&#x[a-f0-9]+;"},c={begin:"\\s",
contains:[{className:"meta-keyword",begin:"#?[a-z_][a-z1-9_-]+",illegal:"\\n"}]
},r=e.inherit(c,{begin:"\\(",end:"\\)"}),l=e.inherit(e.APOS_STRING_MODE,{
className:"meta-string"}),g=e.inherit(e.QUOTE_STRING_MODE,{
className:"meta-string"}),m={endsWithParent:!0,illegal:/</,relevance:0,
contains:[{className:"attr",begin:"[A-Za-z0-9\\._:-]+",relevance:0},{
begin:/=\s*/,relevance:0,contains:[{className:"string",endsParent:!0,variants:[{
begin:/"/,end:/"/,contains:[i]},{begin:/'/,end:/'/,contains:[i]},{
begin:/[^\s"'=<>`]+/}]}]}]};return{name:"HTML, XML",
aliases:["html","xhtml","rss","atom","xjb","xsd","xsl","plist","wsf","svg"],
case_insensitive:!0,contains:[{className:"meta",begin:"<![a-z]",end:">",
relevance:10,contains:[c,g,l,r,{begin:"\\[",end:"\\]",contains:[{
className:"meta",begin:"<![a-z]",end:">",contains:[c,r,g,l]}]}]
},e.COMMENT("\x3c!--","--\x3e",{relevance:10}),{begin:"<!\\[CDATA\\[",
end:"\\]\\]>",relevance:10},i,{className:"meta",begin:/<\?xml/,end:/\?>/,
relevance:10},{className:"tag",begin:"<style(?=\\s|>)",end:">",keywords:{
name:"style"},contains:[m],starts:{end:"</style>",returnEnd:!0,
subLanguage:["css","xml"]}},{className:"tag",begin:"<script(?=\\s|>)",end:">",
keywords:{name:"script"},contains:[m],starts:{end:/<\/script>/,returnEnd:!0,
subLanguage:["javascript","handlebars","xml"]}},{className:"tag",begin:/<>|<\/>/
},{className:"tag",begin:a(/</,n(a(t,s(/\/>/,/>/,/\s/)))),end:/\/?>/,contains:[{
className:"name",begin:t,relevance:0,starts:m}]},{className:"tag",
begin:a(/<\//,n(a(t,/>/))),contains:[{className:"name",begin:t,relevance:0},{
begin:/>/,relevance:0}]}]}}})());hljs.registerLanguage("lisp",(()=>{"use strict";return e=>{
var n="[a-zA-Z_\\-+\\*\\/<=>&#][a-zA-Z0-9_\\-+*\\/<=>&#!]*",a="\\|[^]*?\\|",i="(-|\\+)?\\d+(\\.\\d+|\\/\\d+)?((d|e|f|l|s|D|E|F|L|S)(\\+|-)?\\d+)?",s={
className:"literal",begin:"\\b(t{1}|nil)\\b"},l={className:"number",variants:[{
begin:i,relevance:0},{begin:"#(b|B)[0-1]+(/[0-1]+)?"},{
begin:"#(o|O)[0-7]+(/[0-7]+)?"},{begin:"#(x|X)[0-9a-fA-F]+(/[0-9a-fA-F]+)?"},{
begin:"#(c|C)\\("+i+" +"+i,end:"\\)"}]},b=e.inherit(e.QUOTE_STRING_MODE,{
illegal:null}),g=e.COMMENT(";","$",{relevance:0}),r={begin:"\\*",end:"\\*"},t={
className:"symbol",begin:"[:&]"+n},c={begin:n,relevance:0},d={begin:a},o={
contains:[l,b,r,t,{begin:"\\(",end:"\\)",contains:["self",s,b,l,c]},c],
variants:[{begin:"['`]\\(",end:"\\)"},{begin:"\\(quote ",end:"\\)",keywords:{
name:"quote"}},{begin:"'"+a}]},v={variants:[{begin:"'"+n},{
begin:"#'"+n+"(::"+n+")*"}]},m={begin:"\\(\\s*",end:"\\)"},u={endsWithParent:!0,
relevance:0};return m.contains=[{className:"name",variants:[{begin:n,relevance:0
},{begin:a}]},u],u.contains=[o,v,m,s,l,b,g,r,t,d,c],{name:"Lisp",illegal:/\S/,
contains:[l,e.SHEBANG(),s,b,g,o,v,m,c]}}})());hljs.registerLanguage("asciidoc",(()=>{"use strict";return e=>({name:"AsciiDoc",
aliases:["adoc"],contains:[e.COMMENT("^/{4,}\\n","\\n/{4,}$",{relevance:10
}),e.COMMENT("^//","$",{relevance:0}),{className:"title",begin:"^\\.\\w.*$"},{
begin:"^[=\\*]{4,}\\n",end:"\\n^[=\\*]{4,}$",relevance:10},{className:"section",
relevance:10,variants:[{begin:"^(={1,5}) .+?( \\1)?$"},{
begin:"^[^\\[\\]\\n]+?\\n[=\\-~\\^\\+]{2,}$"}]},{className:"meta",
begin:"^:.+?:",end:"\\s",excludeEnd:!0,relevance:10},{className:"meta",
begin:"^\\[.+?\\]$",relevance:0},{className:"quote",begin:"^_{4,}\\n",
end:"\\n_{4,}$",relevance:10},{className:"code",begin:"^[\\-\\.]{4,}\\n",
end:"\\n[\\-\\.]{4,}$",relevance:10},{begin:"^\\+{4,}\\n",end:"\\n\\+{4,}$",
contains:[{begin:"<",end:">",subLanguage:"xml",relevance:0}],relevance:10},{
className:"bullet",begin:"^(\\*+|-+|\\.+|[^\\n]+?::)\\s+"},{className:"symbol",
begin:"^(NOTE|TIP|IMPORTANT|WARNING|CAUTION):\\s+",relevance:10},{
className:"strong",begin:"\\B\\*(?![\\*\\s])",end:"(\\n{2}|\\*)",contains:[{
begin:"\\\\*\\w",relevance:0}]},{className:"emphasis",begin:"\\B'(?!['\\s])",
end:"(\\n{2}|')",contains:[{begin:"\\\\'\\w",relevance:0}],relevance:0},{
className:"emphasis",begin:"_(?![_\\s])",end:"(\\n{2}|_)",relevance:0},{
className:"string",variants:[{begin:"``.+?''"},{begin:"`.+?'"}]},{
className:"code",begin:"(`.+?`|\\+.+?\\+)",relevance:0},{className:"code",
begin:"^[ \\t]",end:"$",relevance:0},{begin:"^'{3,}[ \\t]*$",relevance:10},{
begin:"(link:)?(http|https|ftp|file|irc|image:?):\\S+?\\[[^[]*?\\]",
returnBegin:!0,contains:[{begin:"(link|image:?):",relevance:0},{
className:"link",begin:"\\w",end:"[^\\[]+",relevance:0},{className:"string",
begin:"\\[",end:"\\]",excludeBegin:!0,excludeEnd:!0,relevance:0}],relevance:10}]
})})());hljs.registerLanguage("vbnet",(()=>{"use strict";return e=>({
name:"Visual Basic .NET",aliases:["vb"],case_insensitive:!0,keywords:{
keyword:"addhandler addressof alias and andalso aggregate ansi as async assembly auto await binary by byref byval call case catch class compare const continue custom declare default delegate dim distinct do each equals else elseif end enum erase error event exit explicit finally for friend from function get global goto group handles if implements imports in inherits interface into is isfalse isnot istrue iterator join key let lib like loop me mid mod module mustinherit mustoverride mybase myclass nameof namespace narrowing new next not notinheritable notoverridable of off on operator option optional or order orelse overloads overridable overrides paramarray partial preserve private property protected public raiseevent readonly redim rem removehandler resume return select set shadows shared skip static step stop structure strict sub synclock take text then throw to try unicode until using when where while widening with withevents writeonly xor yield",
built_in:"boolean byte cbool cbyte cchar cdate cdec cdbl char cint clng cobj csbyte cshort csng cstr ctype date decimal directcast double gettype getxmlnamespace iif integer long object sbyte short single string trycast typeof uinteger ulong ushort",
literal:"true false nothing"},
illegal:"//|\\{|\\}|endif|gosub|variant|wend|^\\$ ",
contains:[e.inherit(e.QUOTE_STRING_MODE,{contains:[{begin:'""'}]
}),e.COMMENT("'","$",{returnBegin:!0,contains:[{className:"doctag",
begin:"'''|\x3c!--|--\x3e",contains:[e.PHRASAL_WORDS_MODE]},{className:"doctag",
begin:"</?",end:">",contains:[e.PHRASAL_WORDS_MODE]}]}),e.C_NUMBER_MODE,{
className:"meta",begin:"#",end:"$",keywords:{
"meta-keyword":"if else elseif end region externalsource"}}]})})());hljs.registerLanguage("clojure",(()=>{"use strict";return e=>{
var t="a-zA-Z_\\-!.?+*=<>&#'",n="["+t+"]["+t+"0-9/;:]*",r="def defonce defprotocol defstruct defmulti defmethod defn- defn defmacro deftype defrecord",a={
$pattern:n,
"builtin-name":r+" cond apply if-not if-let if not not= =|0 <|0 >|0 <=|0 >=|0 ==|0 +|0 /|0 *|0 -|0 rem quot neg? pos? delay? symbol? keyword? true? false? integer? empty? coll? list? set? ifn? fn? associative? sequential? sorted? counted? reversible? number? decimal? class? distinct? isa? float? rational? reduced? ratio? odd? even? char? seq? vector? string? map? nil? contains? zero? instance? not-every? not-any? libspec? -> ->> .. . inc compare do dotimes mapcat take remove take-while drop letfn drop-last take-last drop-while while intern condp case reduced cycle split-at split-with repeat replicate iterate range merge zipmap declare line-seq sort comparator sort-by dorun doall nthnext nthrest partition eval doseq await await-for let agent atom send send-off release-pending-sends add-watch mapv filterv remove-watch agent-error restart-agent set-error-handler error-handler set-error-mode! error-mode shutdown-agents quote var fn loop recur throw try monitor-enter monitor-exit macroexpand macroexpand-1 for dosync and or when when-not when-let comp juxt partial sequence memoize constantly complement identity assert peek pop doto proxy first rest cons cast coll last butlast sigs reify second ffirst fnext nfirst nnext meta with-meta ns in-ns create-ns import refer keys select-keys vals key val rseq name namespace promise into transient persistent! conj! assoc! dissoc! pop! disj! use class type num float double short byte boolean bigint biginteger bigdec print-method print-dup throw-if printf format load compile get-in update-in pr pr-on newline flush read slurp read-line subvec with-open memfn time re-find re-groups rand-int rand mod locking assert-valid-fdecl alias resolve ref deref refset swap! reset! set-validator! compare-and-set! alter-meta! reset-meta! commute get-validator alter ref-set ref-history-count ref-min-history ref-max-history ensure sync io! new next conj set! to-array future future-call into-array aset gen-class reduce map filter find empty hash-map hash-set sorted-map sorted-map-by sorted-set sorted-set-by vec vector seq flatten reverse assoc dissoc list disj get union difference intersection extend extend-type extend-protocol int nth delay count concat chunk chunk-buffer chunk-append chunk-first chunk-rest max min dec unchecked-inc-int unchecked-inc unchecked-dec-inc unchecked-dec unchecked-negate unchecked-add-int unchecked-add unchecked-subtract-int unchecked-subtract chunk-next chunk-cons chunked-seq? prn vary-meta lazy-seq spread list* str find-keyword keyword symbol gensym force rationalize"
},s={begin:n,relevance:0},o={className:"number",begin:"[-+]?\\d+(\\.\\d+)?",
relevance:0},i=e.inherit(e.QUOTE_STRING_MODE,{illegal:null
}),c=e.COMMENT(";","$",{relevance:0}),d={className:"literal",
begin:/\b(true|false|nil)\b/},l={begin:"[\\[\\{]",end:"[\\]\\}]"},m={
className:"comment",begin:"\\^"+n},p=e.COMMENT("\\^\\{","\\}"),u={
className:"symbol",begin:"[:]{1,2}"+n},f={begin:"\\(",end:"\\)"},h={
endsWithParent:!0,relevance:0},y={keywords:a,className:"name",begin:n,
relevance:0,starts:h},g=[f,i,m,p,c,u,l,o,d,s],b={beginKeywords:r,lexemes:n,
end:'(\\[|#|\\d|"|:|\\{|\\)|\\(|$)',contains:[{className:"title",begin:n,
relevance:0,excludeEnd:!0,endsParent:!0}].concat(g)}
;return f.contains=[e.COMMENT("comment",""),b,y,h],
h.contains=g,l.contains=g,p.contains=[l],{name:"Clojure",aliases:["clj"],
illegal:/\S/,contains:[f,i,m,p,c,u,l,o,d]}}})());hljs.registerLanguage("swift",(()=>{"use strict";return e=>{var i={
$pattern:/[\w#]+/,
keyword:"#available #colorLiteral #column #else #elseif #endif #file #fileLiteral #function #if #imageLiteral #line #selector #sourceLocation _ __COLUMN__ __FILE__ __FUNCTION__ __LINE__ Any as as! as? associatedtype associativity break case catch class continue convenience default defer deinit didSet do dynamic dynamicType else enum extension fallthrough false fileprivate final for func get guard if import in indirect infix init inout internal is lazy left let mutating nil none nonmutating open operator optional override postfix precedence prefix private protocol Protocol public repeat required rethrows return right self Self set some static struct subscript super switch throw throws true try try! try? Type typealias unowned var weak where while willSet",
literal:"true false nil",
built_in:"abs advance alignof alignofValue anyGenerator assert assertionFailure bridgeFromObjectiveC bridgeFromObjectiveCUnconditional bridgeToObjectiveC bridgeToObjectiveCUnconditional c compactMap contains count countElements countLeadingZeros debugPrint debugPrintln distance dropFirst dropLast dump encodeBitsAsWords enumerate equal fatalError filter find getBridgedObjectiveCType getVaList indices insertionSort isBridgedToObjectiveC isBridgedVerbatimToObjectiveC isUniquelyReferenced isUniquelyReferencedNonObjC join lazy lexicographicalCompare map max maxElement min minElement numericCast overlaps partition posix precondition preconditionFailure print println quickSort readLine reduce reflect reinterpretCast reverse roundUpToAlignment sizeof sizeofValue sort split startsWith stride strideof strideofValue swap toString transcode underestimateCount unsafeAddressOf unsafeBitCast unsafeDowncast unsafeUnwrap unsafeReflect withExtendedLifetime withObjectAtPlusZero withUnsafePointer withUnsafePointerToObject withUnsafeMutablePointer withUnsafeMutablePointers withUnsafePointer withUnsafePointers withVaList zip"
},n=e.COMMENT("/\\*","\\*/",{contains:["self"]}),t={className:"subst",
begin:/\\\(/,end:"\\)",keywords:i,contains:[]},a={className:"string",
contains:[e.BACKSLASH_ESCAPE,t],variants:[{begin:/"""/,end:/"""/},{begin:/"/,
end:/"/}]},r="([0-9a-fA-F]_*)+",s={className:"number",relevance:0,variants:[{
begin:"\\b(([0-9]_*)+)(\\.(([0-9]_*)+))?([eE][+-]?(([0-9]_*)+))?\\b"},{
begin:`\\b0x(${r})(\\.(${r}))?([pP][+-]?(([0-9]_*)+))?\\b`},{
begin:/\b0o([0-7]_*)+\b/},{begin:/\b0b([01]_*)+\b/}]};return t.contains=[s],{
name:"Swift",keywords:i,contains:[a,e.C_LINE_COMMENT_MODE,n,{className:"type",
begin:"\\b[A-Z][\\w\xc0-\u02b8']*[!?]"},{className:"type",
begin:"\\b[A-Z][\\w\xc0-\u02b8']*",relevance:0},s,{className:"function",
beginKeywords:"func",end:/\{/,excludeEnd:!0,contains:[e.inherit(e.TITLE_MODE,{
begin:/[A-Za-z$_][0-9A-Za-z$_]*/}),{begin:/</,end:/>/},{className:"params",
begin:/\(/,end:/\)/,endsParent:!0,keywords:i,
contains:["self",s,a,e.C_BLOCK_COMMENT_MODE,{begin:":"}],illegal:/["']/}],
illegal:/\[|%/},{className:"class",
beginKeywords:"struct protocol class extension enum",keywords:i,end:"\\{",
excludeEnd:!0,contains:[e.inherit(e.TITLE_MODE,{
begin:/[A-Za-z$_][\u00C0-\u02B80-9A-Za-z$_]*/})]},{className:"meta",
begin:"(@discardableResult|@warn_unused_result|@exported|@lazy|@noescape|@NSCopying|@NSManaged|@objc|@objcMembers|@convention|@required|@noreturn|@IBAction|@IBDesignable|@IBInspectable|@IBOutlet|@infix|@prefix|@postfix|@autoclosure|@testable|@available|@nonobjc|@NSApplicationMain|@UIApplicationMain|@dynamicMemberLookup|@propertyWrapper|@main)\\b"
},{beginKeywords:"import",end:/$/,contains:[e.C_LINE_COMMENT_MODE,n],relevance:0
}]}}})());hljs.registerLanguage("erlang",(()=>{"use strict";return e=>{
const n="[a-z'][a-zA-Z0-9_']*",r="("+n+":"+n+"|"+n+")",a={
keyword:"after and andalso|10 band begin bnot bor bsl bzr bxor case catch cond div end fun if let not of orelse|10 query receive rem try when xor",
literal:"false true"},i=e.COMMENT("%","$"),s={className:"number",
begin:"\\b(\\d+(_\\d+)*#[a-fA-F0-9]+(_[a-fA-F0-9]+)*|\\d+(_\\d+)*(\\.\\d+(_\\d+)*)?([eE][-+]?\\d+)?)",
relevance:0},c={begin:"fun\\s+"+n+"/\\d+"},t={begin:r+"\\(",end:"\\)",
returnBegin:!0,relevance:0,contains:[{begin:r,relevance:0},{begin:"\\(",
end:"\\)",endsWithParent:!0,returnEnd:!0,relevance:0}]},d={begin:/\{/,end:/\}/,
relevance:0},o={begin:"\\b_([A-Z][A-Za-z0-9_]*)?",relevance:0},l={
begin:"[A-Z][a-zA-Z0-9_]*",relevance:0},b={begin:"#"+e.UNDERSCORE_IDENT_RE,
relevance:0,returnBegin:!0,contains:[{begin:"#"+e.UNDERSCORE_IDENT_RE,
relevance:0},{begin:/\{/,end:/\}/,relevance:0}]},g={
beginKeywords:"fun receive if try case",end:"end",keywords:a}
;g.contains=[i,c,e.inherit(e.APOS_STRING_MODE,{className:""
}),g,t,e.QUOTE_STRING_MODE,s,d,o,l,b]
;const E=[i,c,g,t,e.QUOTE_STRING_MODE,s,d,o,l,b]
;t.contains[1].contains=E,d.contains=E,b.contains[1].contains=E;const u={
className:"params",begin:"\\(",end:"\\)",contains:E};return{name:"Erlang",
aliases:["erl"],keywords:a,illegal:"(</|\\*=|\\+=|-=|/\\*|\\*/|\\(\\*|\\*\\))",
contains:[{className:"function",begin:"^"+n+"\\s*\\(",end:"->",returnBegin:!0,
illegal:"\\(|#|//|/\\*|\\\\|:|;",contains:[u,e.inherit(e.TITLE_MODE,{begin:n})],
starts:{end:";|\\.",keywords:a,contains:E}},i,{begin:"^-",end:"\\.",relevance:0,
excludeEnd:!0,returnBegin:!0,keywords:{$pattern:"-"+e.IDENT_RE,
keyword:"-module -record -undef -export -ifdef -ifndef -author -copyright -doc -vsn -import -include -include_lib -compile -define -else -endif -file -behaviour -behavior -spec"
},contains:[u]},s,e.QUOTE_STRING_MODE,b,o,l,d,{begin:/\.$/}]}}})());hljs.registerLanguage("perl",(()=>{"use strict";function e(...e){
return e.map((e=>{return(n=e)?"string"==typeof n?n:n.source:null;var n
})).join("")}return n=>{const t=/[dualxmsipn]{0,12}/,s={$pattern:/[\w.]+/,
keyword:"getpwent getservent quotemeta msgrcv scalar kill dbmclose undef lc ma syswrite tr send umask sysopen shmwrite vec qx utime local oct semctl localtime readpipe do return format read sprintf dbmopen pop getpgrp not getpwnam rewinddir qq fileno qw endprotoent wait sethostent bless s|0 opendir continue each sleep endgrent shutdown dump chomp connect getsockname die socketpair close flock exists index shmget sub for endpwent redo lstat msgctl setpgrp abs exit select print ref gethostbyaddr unshift fcntl syscall goto getnetbyaddr join gmtime symlink semget splice x|0 getpeername recv log setsockopt cos last reverse gethostbyname getgrnam study formline endhostent times chop length gethostent getnetent pack getprotoent getservbyname rand mkdir pos chmod y|0 substr endnetent printf next open msgsnd readdir use unlink getsockopt getpriority rindex wantarray hex system getservbyport endservent int chr untie rmdir prototype tell listen fork shmread ucfirst setprotoent else sysseek link getgrgid shmctl waitpid unpack getnetbyname reset chdir grep split require caller lcfirst until warn while values shift telldir getpwuid my getprotobynumber delete and sort uc defined srand accept package seekdir getprotobyname semop our rename seek if q|0 chroot sysread setpwent no crypt getc chown sqrt write setnetent setpriority foreach tie sin msgget map stat getlogin unless elsif truncate exec keys glob tied closedir ioctl socket readlink eval xor readline binmode setservent eof ord bind alarm pipe atan2 getgrent exp time push setgrent gt lt or ne m|0 break given say state when"
},r={className:"subst",begin:"[$@]\\{",end:"\\}",keywords:s},i={begin:/->\{/,
end:/\}/},a={variants:[{begin:/\$\d/},{
begin:e(/[$%@](\^\w\b|#\w+(::\w+)*|\{\w+\}|\w+(::\w*)*)/,"(?![A-Za-z])(?![@$%])")
},{begin:/[$%@][^\s\w{]/,relevance:0}]
},o=[n.BACKSLASH_ESCAPE,r,a],c=[a,n.HASH_COMMENT_MODE,n.COMMENT(/^=\w/,/=cut/,{
endsWithParent:!0}),i,{className:"string",contains:o,variants:[{
begin:"q[qwxr]?\\s*\\(",end:"\\)",relevance:5},{begin:"q[qwxr]?\\s*\\[",
end:"\\]",relevance:5},{begin:"q[qwxr]?\\s*\\{",end:"\\}",relevance:5},{
begin:"q[qwxr]?\\s*\\|",end:"\\|",relevance:5},{begin:"q[qwxr]?\\s*<",end:">",
relevance:5},{begin:"qw\\s+q",end:"q",relevance:5},{begin:"'",end:"'",
contains:[n.BACKSLASH_ESCAPE]},{begin:'"',end:'"'},{begin:"`",end:"`",
contains:[n.BACKSLASH_ESCAPE]},{begin:/\{\w+\}/,contains:[],relevance:0},{
begin:"-?\\w+\\s*=>",contains:[],relevance:0}]},{className:"number",
begin:"(\\b0[0-7_]+)|(\\b0x[0-9a-fA-F_]+)|(\\b[1-9][0-9_]*(\\.[0-9_]+)?)|[0_]\\b",
relevance:0},{
begin:"(\\/\\/|"+n.RE_STARTERS_RE+"|\\b(split|return|print|reverse|grep)\\b)\\s*",
keywords:"split return print reverse grep",relevance:0,
contains:[n.HASH_COMMENT_MODE,{className:"regexp",
begin:e(/(s|tr|y)/,/\//,/(\\.|[^\\\/])*/,/\//,/(\\.|[^\\\/])*/,/\//,t),
relevance:10},{className:"regexp",begin:/(m|qr)?\//,end:e(/\//,t),
contains:[n.BACKSLASH_ESCAPE],relevance:0}]},{className:"function",
beginKeywords:"sub",end:"(\\s*\\(.*?\\))?[;{]",excludeEnd:!0,relevance:5,
contains:[n.TITLE_MODE]},{begin:"-\\w\\b",relevance:0},{begin:"^__DATA__$",
end:"^__END__$",subLanguage:"mojolicious",contains:[{begin:"^@@.*",end:"$",
className:"comment"}]}];return r.contains=c,i.contains=c,{name:"Perl",
aliases:["pl","pm"],keywords:s,contains:c}}})());hljs.registerLanguage("fortran",(()=>{"use strict";function e(...e){
return e.map((e=>{return(n=e)?"string"==typeof n?n:n.source:null;var n
})).join("")}return n=>{const a={variants:[n.COMMENT("!","$",{relevance:0
}),n.COMMENT("^C[ ]","$",{relevance:0}),n.COMMENT("^C$","$",{relevance:0})]
},t=/(_[a-z_\d]+)?/,i=/([de][+-]?\d+)?/,c={className:"number",variants:[{
begin:e(/\b\d+/,/\.(\d*)/,i,t)},{begin:e(/\b\d+/,i,t)},{begin:e(/\.\d+/,i,t)}],
relevance:0},o={className:"function",
beginKeywords:"subroutine function program",illegal:"[${=\\n]",
contains:[n.UNDERSCORE_TITLE_MODE,{className:"params",begin:"\\(",end:"\\)"}]}
;return{name:"Fortran",case_insensitive:!0,aliases:["f90","f95"],keywords:{
literal:".False. .True.",
keyword:"kind do concurrent local shared while private call intrinsic where elsewhere type endtype endmodule endselect endinterface end enddo endif if forall endforall only contains default return stop then block endblock endassociate public subroutine|10 function program .and. .or. .not. .le. .eq. .ge. .gt. .lt. goto save else use module select case access blank direct exist file fmt form formatted iostat name named nextrec number opened rec recl sequential status unformatted unit continue format pause cycle exit c_null_char c_alert c_backspace c_form_feed flush wait decimal round iomsg synchronous nopass non_overridable pass protected volatile abstract extends import non_intrinsic value deferred generic final enumerator class associate bind enum c_int c_short c_long c_long_long c_signed_char c_size_t c_int8_t c_int16_t c_int32_t c_int64_t c_int_least8_t c_int_least16_t c_int_least32_t c_int_least64_t c_int_fast8_t c_int_fast16_t c_int_fast32_t c_int_fast64_t c_intmax_t C_intptr_t c_float c_double c_long_double c_float_complex c_double_complex c_long_double_complex c_bool c_char c_null_ptr c_null_funptr c_new_line c_carriage_return c_horizontal_tab c_vertical_tab iso_c_binding c_loc c_funloc c_associated  c_f_pointer c_ptr c_funptr iso_fortran_env character_storage_size error_unit file_storage_size input_unit iostat_end iostat_eor numeric_storage_size output_unit c_f_procpointer ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode newunit contiguous recursive pad position action delim readwrite eor advance nml interface procedure namelist include sequence elemental pure impure integer real character complex logical codimension dimension allocatable|10 parameter external implicit|10 none double precision assign intent optional pointer target in out common equivalence data",
built_in:"alog alog10 amax0 amax1 amin0 amin1 amod cabs ccos cexp clog csin csqrt dabs dacos dasin datan datan2 dcos dcosh ddim dexp dint dlog dlog10 dmax1 dmin1 dmod dnint dsign dsin dsinh dsqrt dtan dtanh float iabs idim idint idnint ifix isign max0 max1 min0 min1 sngl algama cdabs cdcos cdexp cdlog cdsin cdsqrt cqabs cqcos cqexp cqlog cqsin cqsqrt dcmplx dconjg derf derfc dfloat dgamma dimag dlgama iqint qabs qacos qasin qatan qatan2 qcmplx qconjg qcos qcosh qdim qerf qerfc qexp qgamma qimag qlgama qlog qlog10 qmax1 qmin1 qmod qnint qsign qsin qsinh qsqrt qtan qtanh abs acos aimag aint anint asin atan atan2 char cmplx conjg cos cosh exp ichar index int log log10 max min nint sign sin sinh sqrt tan tanh print write dim lge lgt lle llt mod nullify allocate deallocate adjustl adjustr all allocated any associated bit_size btest ceiling count cshift date_and_time digits dot_product eoshift epsilon exponent floor fraction huge iand ibclr ibits ibset ieor ior ishft ishftc lbound len_trim matmul maxexponent maxloc maxval merge minexponent minloc minval modulo mvbits nearest pack present product radix random_number random_seed range repeat reshape rrspacing scale scan selected_int_kind selected_real_kind set_exponent shape size spacing spread sum system_clock tiny transpose trim ubound unpack verify achar iachar transfer dble entry dprod cpu_time command_argument_count get_command get_command_argument get_environment_variable is_iostat_end ieee_arithmetic ieee_support_underflow_control ieee_get_underflow_mode ieee_set_underflow_mode is_iostat_eor move_alloc new_line selected_char_kind same_type_as extends_type_of acosh asinh atanh bessel_j0 bessel_j1 bessel_jn bessel_y0 bessel_y1 bessel_yn erf erfc erfc_scaled gamma log_gamma hypot norm2 atomic_define atomic_ref execute_command_line leadz trailz storage_size merge_bits bge bgt ble blt dshiftl dshiftr findloc iall iany iparity image_index lcobound ucobound maskl maskr num_images parity popcnt poppar shifta shiftl shiftr this_image sync change team co_broadcast co_max co_min co_sum co_reduce"
},illegal:/\/\*/,contains:[{className:"string",relevance:0,
variants:[n.APOS_STRING_MODE,n.QUOTE_STRING_MODE]},o,{begin:/^C\s*=(?!=)/,
relevance:0},a,c]}}})());hljs.registerLanguage("llvm",(()=>{"use strict";function e(...e){
return e.map((e=>{return(n=e)?"string"==typeof n?n:n.source:null;var n
})).join("")}return n=>{const a=/([-a-zA-Z$._][\w$.-]*)/,t={
className:"variable",variants:[{begin:e(/%/,a)},{begin:/%\d+/},{begin:/#\d+/}]
},i={className:"title",variants:[{begin:e(/@/,a)},{begin:/@\d+/},{begin:e(/!/,a)
},{begin:e(/!\d+/,a)},{begin:/!\d+/}]};return{name:"LLVM IR",
keywords:"begin end true false declare define global constant private linker_private internal available_externally linkonce linkonce_odr weak weak_odr appending dllimport dllexport common default hidden protected extern_weak external thread_local zeroinitializer undef null to tail target triple datalayout volatile nuw nsw nnan ninf nsz arcp fast exact inbounds align addrspace section alias module asm sideeffect gc dbg linker_private_weak attributes blockaddress initialexec localdynamic localexec prefix unnamed_addr ccc fastcc coldcc x86_stdcallcc x86_fastcallcc arm_apcscc arm_aapcscc arm_aapcs_vfpcc ptx_device ptx_kernel intel_ocl_bicc msp430_intrcc spir_func spir_kernel x86_64_sysvcc x86_64_win64cc x86_thiscallcc cc c signext zeroext inreg sret nounwind noreturn noalias nocapture byval nest readnone readonly inlinehint noinline alwaysinline optsize ssp sspreq noredzone noimplicitfloat naked builtin cold nobuiltin noduplicate nonlazybind optnone returns_twice sanitize_address sanitize_memory sanitize_thread sspstrong uwtable returned type opaque eq ne slt sgt sle sge ult ugt ule uge oeq one olt ogt ole oge ord uno ueq une x acq_rel acquire alignstack atomic catch cleanup filter inteldialect max min monotonic nand personality release seq_cst singlethread umax umin unordered xchg add fadd sub fsub mul fmul udiv sdiv fdiv urem srem frem shl lshr ashr and or xor icmp fcmp phi call trunc zext sext fptrunc fpext uitofp sitofp fptoui fptosi inttoptr ptrtoint bitcast addrspacecast select va_arg ret br switch invoke unwind unreachable indirectbr landingpad resume malloc alloca free load store getelementptr extractelement insertelement shufflevector getresult extractvalue insertvalue atomicrmw cmpxchg fence argmemonly double",
contains:[{className:"type",begin:/\bi\d+(?=\s|\b)/},n.COMMENT(/;\s*$/,null,{
relevance:0}),n.COMMENT(/;/,/$/),n.QUOTE_STRING_MODE,{className:"string",
variants:[{begin:/"/,end:/[^\\]"/}]},i,{className:"punctuation",relevance:0,
begin:/,/},{className:"operator",relevance:0,begin:/=/},t,{className:"symbol",
variants:[{begin:/^\s*[a-z]+:/}],relevance:0},{className:"number",variants:[{
begin:/0[xX][a-fA-F0-9]+/},{begin:/-?\d+(?:[.]\d+)?(?:[eE][-+]?\d+(?:[.]\d+)?)?/
}],relevance:0}]}}})());hljs.registerLanguage("bash",(()=>{"use strict";function e(...e){
return e.map((e=>{return(s=e)?"string"==typeof s?s:s.source:null;var s
})).join("")}return s=>{const n={},t={begin:/\$\{/,end:/\}/,contains:["self",{
begin:/:-/,contains:[n]}]};Object.assign(n,{className:"variable",variants:[{
begin:e(/\$[\w\d#@][\w\d_]*/,"(?![\\w\\d])(?![$])")},t]});const a={
className:"subst",begin:/\$\(/,end:/\)/,contains:[s.BACKSLASH_ESCAPE]},i={
begin:/<<-?\s*(?=\w+)/,starts:{contains:[s.END_SAME_AS_BEGIN({begin:/(\w+)/,
end:/(\w+)/,className:"string"})]}},c={className:"string",begin:/"/,end:/"/,
contains:[s.BACKSLASH_ESCAPE,n,a]};a.contains.push(c);const o={begin:/\$\(\(/,
end:/\)\)/,contains:[{begin:/\d+#[0-9a-f]+/,className:"number"},s.NUMBER_MODE,n]
},r=s.SHEBANG({binary:"(fish|bash|zsh|sh|csh|ksh|tcsh|dash|scsh)",relevance:10
}),l={className:"function",begin:/\w[\w\d_]*\s*\(\s*\)\s*\{/,returnBegin:!0,
contains:[s.inherit(s.TITLE_MODE,{begin:/\w[\w\d_]*/})],relevance:0};return{
name:"Bash",aliases:["sh","zsh"],keywords:{$pattern:/\b[a-z._-]+\b/,
keyword:"if then else elif fi for while in do done case esac function",
literal:"true false",
built_in:"break cd continue eval exec exit export getopts hash pwd readonly return shift test times trap umask unset alias bind builtin caller command declare echo enable help let local logout mapfile printf read readarray source type typeset ulimit unalias set shopt autoload bg bindkey bye cap chdir clone comparguments compcall compctl compdescribe compfiles compgroups compquote comptags comptry compvalues dirs disable disown echotc echoti emulate fc fg float functions getcap getln history integer jobs kill limit log noglob popd print pushd pushln rehash sched setcap setopt stat suspend ttyctl unfunction unhash unlimit unsetopt vared wait whence where which zcompile zformat zftp zle zmodload zparseopts zprof zpty zregexparse zsocket zstyle ztcp"
},contains:[r,s.SHEBANG(),l,o,s.HASH_COMMENT_MODE,i,c,{className:"",begin:/\\"/
},{className:"string",begin:/'/,end:/'/},n]}}})());hljs.registerLanguage("shell",(()=>{"use strict";return s=>({
name:"Shell Session",aliases:["console"],contains:[{className:"meta",
begin:/^\s{0,3}[/~\w\d[\]()@-]*[>%$#]/,starts:{end:/[^\\](?=\s*$)/,
subLanguage:"bash"}}]})})());hljs.registerLanguage("prolog",(()=>{"use strict";return n=>{const e={
begin:/\(/,end:/\)/,relevance:0},a={begin:/\[/,end:/\]/},s={className:"comment",
begin:/%/,end:/$/,contains:[n.PHRASAL_WORDS_MODE]},i={className:"string",
begin:/`/,end:/`/,contains:[n.BACKSLASH_ESCAPE]},g=[{begin:/[a-z][A-Za-z0-9_]*/,
relevance:0},{className:"symbol",variants:[{begin:/[A-Z][a-zA-Z0-9_]*/},{
begin:/_[A-Za-z0-9_]*/}],relevance:0},e,{begin:/:-/
},a,s,n.C_BLOCK_COMMENT_MODE,n.QUOTE_STRING_MODE,n.APOS_STRING_MODE,i,{
className:"string",begin:/0'(\\'|.)/},{className:"string",begin:/0'\\s/
},n.C_NUMBER_MODE];return e.contains=g,a.contains=g,{name:"Prolog",
contains:g.concat([{begin:/\.$/}])}}})());hljs.registerLanguage("django",(()=>{"use strict";return e=>{const t={
begin:/\|[A-Za-z]+:?/,keywords:{
name:"truncatewords removetags linebreaksbr yesno get_digit timesince random striptags filesizeformat escape linebreaks length_is ljust rjust cut urlize fix_ampersands title floatformat capfirst pprint divisibleby add make_list unordered_list urlencode timeuntil urlizetrunc wordcount stringformat linenumbers slice date dictsort dictsortreversed default_if_none pluralize lower join center default truncatewords_html upper length phone2numeric wordwrap time addslashes slugify first escapejs force_escape iriencode last safe safeseq truncatechars localize unlocalize localtime utc timezone"
},contains:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE]};return{name:"Django",
aliases:["jinja"],case_insensitive:!0,subLanguage:"xml",
contains:[e.COMMENT(/\{%\s*comment\s*%\}/,/\{%\s*endcomment\s*%\}/),e.COMMENT(/\{#/,/#\}/),{
className:"template-tag",begin:/\{%/,end:/%\}/,contains:[{className:"name",
begin:/\w+/,keywords:{
name:"comment endcomment load templatetag ifchanged endifchanged if endif firstof for endfor ifnotequal endifnotequal widthratio extends include spaceless endspaceless regroup ifequal endifequal ssi now with cycle url filter endfilter debug block endblock else autoescape endautoescape csrf_token empty elif endwith static trans blocktrans endblocktrans get_static_prefix get_media_prefix plural get_current_language language get_available_languages get_current_language_bidi get_language_info get_language_info_list localize endlocalize localtime endlocaltime timezone endtimezone get_current_timezone verbatim"
},starts:{endsWithParent:!0,keywords:"in by as",contains:[t],relevance:0}}]},{
className:"template-variable",begin:/\{\{/,end:/\}\}/,contains:[t]}]}}})());hljs.registerLanguage("kotlin",(()=>{"use strict"
;var e="\\.([0-9](_*[0-9])*)",n="[0-9a-fA-F](_*[0-9a-fA-F])*",a={
className:"number",variants:[{
begin:`(\\b([0-9](_*[0-9])*)((${e})|\\.)?|(${e}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
},{begin:`\\b([0-9](_*[0-9])*)((${e})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{
begin:`(${e})[fFdD]?\\b`},{begin:"\\b([0-9](_*[0-9])*)[fFdD]\\b"},{
begin:`\\b0[xX]((${n})\\.?|(${n})?\\.(${n}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${n})[lL]?\\b`},{
begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],
relevance:0};return e=>{const n={
keyword:"abstract as val var vararg get set class object open private protected public noinline crossinline dynamic final enum if else do while for when throw try catch finally import package is in fun override companion reified inline lateinit init interface annotation data sealed internal infix operator out by constructor super tailrec where const inner suspend typealias external expect actual",
built_in:"Byte Short Char Int Long Boolean Float Double Void Unit Nothing",
literal:"true false null"},i={className:"symbol",begin:e.UNDERSCORE_IDENT_RE+"@"
},s={className:"subst",begin:/\$\{/,end:/\}/,contains:[e.C_NUMBER_MODE]},t={
className:"variable",begin:"\\$"+e.UNDERSCORE_IDENT_RE},r={className:"string",
variants:[{begin:'"""',end:'"""(?=[^"])',contains:[t,s]},{begin:"'",end:"'",
illegal:/\n/,contains:[e.BACKSLASH_ESCAPE]},{begin:'"',end:'"',illegal:/\n/,
contains:[e.BACKSLASH_ESCAPE,t,s]}]};s.contains.push(r);const l={
className:"meta",
begin:"@(?:file|property|field|get|set|receiver|param|setparam|delegate)\\s*:(?:\\s*"+e.UNDERSCORE_IDENT_RE+")?"
},c={className:"meta",begin:"@"+e.UNDERSCORE_IDENT_RE,contains:[{begin:/\(/,
end:/\)/,contains:[e.inherit(r,{className:"meta-string"})]}]
},o=a,b=e.COMMENT("/\\*","\\*/",{contains:[e.C_BLOCK_COMMENT_MODE]}),E={
variants:[{className:"type",begin:e.UNDERSCORE_IDENT_RE},{begin:/\(/,end:/\)/,
contains:[]}]},d=E;return d.variants[1].contains=[E],E.variants[1].contains=[d],
{name:"Kotlin",aliases:["kt"],keywords:n,contains:[e.COMMENT("/\\*\\*","\\*/",{
relevance:0,contains:[{className:"doctag",begin:"@[A-Za-z]+"}]
}),e.C_LINE_COMMENT_MODE,b,{className:"keyword",
begin:/\b(break|continue|return|this)\b/,starts:{contains:[{className:"symbol",
begin:/@\w+/}]}},i,l,c,{className:"function",beginKeywords:"fun",end:"[(]|$",
returnBegin:!0,excludeEnd:!0,keywords:n,relevance:5,contains:[{
begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,
contains:[e.UNDERSCORE_TITLE_MODE]},{className:"type",begin:/</,end:/>/,
keywords:"reified",relevance:0},{className:"params",begin:/\(/,end:/\)/,
endsParent:!0,keywords:n,relevance:0,contains:[{begin:/:/,end:/[=,\/]/,
endsWithParent:!0,contains:[E,e.C_LINE_COMMENT_MODE,b],relevance:0
},e.C_LINE_COMMENT_MODE,b,l,c,r,e.C_NUMBER_MODE]},b]},{className:"class",
beginKeywords:"class interface trait",end:/[:\{(]|$/,excludeEnd:!0,
illegal:"extends implements",contains:[{
beginKeywords:"public protected internal private constructor"
},e.UNDERSCORE_TITLE_MODE,{className:"type",begin:/</,end:/>/,excludeBegin:!0,
excludeEnd:!0,relevance:0},{className:"type",begin:/[,:]\s*/,end:/[<\(,]|$/,
excludeBegin:!0,returnEnd:!0},l,c]},r,{className:"meta",begin:"^#!/usr/bin/env",
end:"$",illegal:"\n"},o]}}})());hljs.registerLanguage("php",(()=>{"use strict";return e=>{const r={
className:"variable",
begin:"\\$+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*(?![A-Za-z0-9])(?![$])"},t={
className:"meta",variants:[{begin:/<\?php/,relevance:10},{begin:/<\?[=]?/},{
begin:/\?>/}]},a={className:"subst",variants:[{begin:/\$\w+/},{begin:/\{\$/,
end:/\}/}]},n=e.inherit(e.APOS_STRING_MODE,{illegal:null
}),i=e.inherit(e.QUOTE_STRING_MODE,{illegal:null,
contains:e.QUOTE_STRING_MODE.contains.concat(a)}),o=e.END_SAME_AS_BEGIN({
begin:/<<<[ \t]*(\w+)\n/,end:/[ \t]*(\w+)\b/,
contains:e.QUOTE_STRING_MODE.contains.concat(a)}),l={className:"string",
contains:[e.BACKSLASH_ESCAPE,t],variants:[e.inherit(n,{begin:"b'",end:"'"
}),e.inherit(i,{begin:'b"',end:'"'}),i,n,o]},c={
variants:[e.BINARY_NUMBER_MODE,e.C_NUMBER_MODE]},s={
keyword:"__CLASS__ __DIR__ __FILE__ __FUNCTION__ __LINE__ __METHOD__ __NAMESPACE__ __TRAIT__ die echo exit include include_once print require require_once array abstract and as binary bool boolean break callable case catch class clone const continue declare default do double else elseif empty enddeclare endfor endforeach endif endswitch endwhile eval extends final finally float for foreach from global goto if implements instanceof insteadof int integer interface isset iterable list match|0 new object or private protected public real return string switch throw trait try unset use var void while xor yield",
literal:"false null true",
built_in:"Error|0 AppendIterator ArgumentCountError ArithmeticError ArrayIterator ArrayObject AssertionError BadFunctionCallException BadMethodCallException CachingIterator CallbackFilterIterator CompileError Countable DirectoryIterator DivisionByZeroError DomainException EmptyIterator ErrorException Exception FilesystemIterator FilterIterator GlobIterator InfiniteIterator InvalidArgumentException IteratorIterator LengthException LimitIterator LogicException MultipleIterator NoRewindIterator OutOfBoundsException OutOfRangeException OuterIterator OverflowException ParentIterator ParseError RangeException RecursiveArrayIterator RecursiveCachingIterator RecursiveCallbackFilterIterator RecursiveDirectoryIterator RecursiveFilterIterator RecursiveIterator RecursiveIteratorIterator RecursiveRegexIterator RecursiveTreeIterator RegexIterator RuntimeException SeekableIterator SplDoublyLinkedList SplFileInfo SplFileObject SplFixedArray SplHeap SplMaxHeap SplMinHeap SplObjectStorage SplObserver SplObserver SplPriorityQueue SplQueue SplStack SplSubject SplSubject SplTempFileObject TypeError UnderflowException UnexpectedValueException ArrayAccess Closure Generator Iterator IteratorAggregate Serializable Throwable Traversable WeakReference Directory __PHP_Incomplete_Class parent php_user_filter self static stdClass"
};return{aliases:["php","php3","php4","php5","php6","php7","php8"],
case_insensitive:!0,keywords:s,
contains:[e.HASH_COMMENT_MODE,e.COMMENT("//","$",{contains:[t]
}),e.COMMENT("/\\*","\\*/",{contains:[{className:"doctag",begin:"@[A-Za-z]+"}]
}),e.COMMENT("__halt_compiler.+?;",!1,{endsWithParent:!0,
keywords:"__halt_compiler"}),t,{className:"keyword",begin:/\$this\b/},r,{
begin:/(::|->)+[a-zA-Z_\x7f-\xff][a-zA-Z0-9_\x7f-\xff]*/},{className:"function",
relevance:0,beginKeywords:"fn function",end:/[;{]/,excludeEnd:!0,
illegal:"[$%\\[]",contains:[e.UNDERSCORE_TITLE_MODE,{begin:"=>"},{
className:"params",begin:"\\(",end:"\\)",excludeBegin:!0,excludeEnd:!0,
keywords:s,contains:["self",r,e.C_BLOCK_COMMENT_MODE,l,c]}]},{className:"class",
beginKeywords:"class interface",relevance:0,end:/\{/,excludeEnd:!0,
illegal:/[:($"]/,contains:[{beginKeywords:"extends implements"
},e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"namespace",relevance:0,end:";",
illegal:/[.']/,contains:[e.UNDERSCORE_TITLE_MODE]},{beginKeywords:"use",
relevance:0,end:";",contains:[e.UNDERSCORE_TITLE_MODE]},l,c]}}})());hljs.registerLanguage("php-template",(()=>{"use strict";return n=>({
name:"PHP template",subLanguage:"xml",contains:[{begin:/<\?(php|=)?/,end:/\?>/,
subLanguage:"php",contains:[{begin:"/\\*",end:"\\*/",skip:!0},{begin:'b"',
end:'"',skip:!0},{begin:"b'",end:"'",skip:!0},n.inherit(n.APOS_STRING_MODE,{
illegal:null,className:null,contains:null,skip:!0
}),n.inherit(n.QUOTE_STRING_MODE,{illegal:null,className:null,contains:null,
skip:!0})]}]})})());hljs.registerLanguage("dos",(()=>{"use strict";return e=>{
const t=e.COMMENT(/^\s*@?rem\b/,/$/,{relevance:10});return{
name:"Batch file (DOS)",aliases:["bat","cmd"],case_insensitive:!0,
illegal:/\/\*/,keywords:{
keyword:"if else goto for in do call exit not exist errorlevel defined equ neq lss leq gtr geq",
built_in:"prn nul lpt3 lpt2 lpt1 con com4 com3 com2 com1 aux shift cd dir echo setlocal endlocal set pause copy append assoc at attrib break cacls cd chcp chdir chkdsk chkntfs cls cmd color comp compact convert date dir diskcomp diskcopy doskey erase fs find findstr format ftype graftabl help keyb label md mkdir mode more move path pause print popd pushd promt rd recover rem rename replace restore rmdir shift sort start subst time title tree type ver verify vol ping net ipconfig taskkill xcopy ren del"
},contains:[{className:"variable",begin:/%%[^ ]|%[^ ]+?%|![^ ]+?!/},{
className:"function",begin:"^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)",
end:"goto:eof",contains:[e.inherit(e.TITLE_MODE,{
begin:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),t]},{
className:"number",begin:"\\b\\d+",relevance:0},t]}}})());hljs.registerLanguage("rust",(()=>{"use strict";return e=>{
const n="([ui](8|16|32|64|128|size)|f(32|64))?",t="drop i8 i16 i32 i64 i128 isize u8 u16 u32 u64 u128 usize f32 f64 str char bool Box Option Result String Vec Copy Send Sized Sync Drop Fn FnMut FnOnce ToOwned Clone Debug PartialEq PartialOrd Eq Ord AsRef AsMut Into From Default Iterator Extend IntoIterator DoubleEndedIterator ExactSizeIterator SliceConcatExt ToString assert! assert_eq! bitflags! bytes! cfg! col! concat! concat_idents! debug_assert! debug_assert_eq! env! panic! file! format! format_args! include_bin! include_str! line! local_data_key! module_path! option_env! print! println! select! stringify! try! unimplemented! unreachable! vec! write! writeln! macro_rules! assert_ne! debug_assert_ne!"
;return{name:"Rust",aliases:["rs"],keywords:{$pattern:e.IDENT_RE+"!?",
keyword:"abstract as async await become box break const continue crate do dyn else enum extern false final fn for if impl in let loop macro match mod move mut override priv pub ref return self Self static struct super trait true try type typeof unsafe unsized use virtual where while yield",
literal:"true false Some None Ok Err",built_in:t},illegal:"</",
contains:[e.C_LINE_COMMENT_MODE,e.COMMENT("/\\*","\\*/",{contains:["self"]
}),e.inherit(e.QUOTE_STRING_MODE,{begin:/b?"/,illegal:null}),{
className:"string",variants:[{begin:/r(#*)"(.|\n)*?"\1(?!#)/},{
begin:/b?'\\?(x\w{2}|u\w{4}|U\w{8}|.)'/}]},{className:"symbol",
begin:/'[a-zA-Z_][a-zA-Z0-9_]*/},{className:"number",variants:[{
begin:"\\b0b([01_]+)"+n},{begin:"\\b0o([0-7_]+)"+n},{
begin:"\\b0x([A-Fa-f0-9_]+)"+n},{
begin:"\\b(\\d[\\d_]*(\\.[0-9_]+)?([eE][+-]?[0-9_]+)?)"+n}],relevance:0},{
className:"function",beginKeywords:"fn",end:"(\\(|<)",excludeEnd:!0,
contains:[e.UNDERSCORE_TITLE_MODE]},{className:"meta",begin:"#!?\\[",end:"\\]",
contains:[{className:"meta-string",begin:/"/,end:/"/}]},{className:"class",
beginKeywords:"type",end:";",contains:[e.inherit(e.UNDERSCORE_TITLE_MODE,{
endsParent:!0})],illegal:"\\S"},{className:"class",
beginKeywords:"trait enum struct union",end:/\{/,
contains:[e.inherit(e.UNDERSCORE_TITLE_MODE,{endsParent:!0})],illegal:"[\\w\\d]"
},{begin:e.IDENT_RE+"::",keywords:{built_in:t}},{begin:"->"}]}}})());hljs.registerLanguage("makefile",(()=>{"use strict";return e=>{const i={
className:"variable",variants:[{begin:"\\$\\("+e.UNDERSCORE_IDENT_RE+"\\)",
contains:[e.BACKSLASH_ESCAPE]},{begin:/\$[@%<?\^\+\*]/}]},a={className:"string",
begin:/"/,end:/"/,contains:[e.BACKSLASH_ESCAPE,i]},n={className:"variable",
begin:/\$\([\w-]+\s/,end:/\)/,keywords:{
built_in:"subst patsubst strip findstring filter filter-out sort word wordlist firstword lastword dir notdir suffix basename addsuffix addprefix join wildcard realpath abspath error warning shell origin flavor foreach if or and call eval file value"
},contains:[i]},s={begin:"^"+e.UNDERSCORE_IDENT_RE+"\\s*(?=[:+?]?=)"},r={
className:"section",begin:/^[^\s]+:/,end:/$/,contains:[i]};return{
name:"Makefile",aliases:["mk","mak"],keywords:{$pattern:/[\w-]+/,
keyword:"define endef undefine ifdef ifndef ifeq ifneq else endif include -include sinclude override export unexport private vpath"
},contains:[e.HASH_COMMENT_MODE,i,a,n,s,{className:"meta",begin:/^\.PHONY:/,
end:/$/,keywords:{$pattern:/[\.\w]+/,"meta-keyword":".PHONY"}},r]}}})());hljs.registerLanguage("vim",(()=>{"use strict";return e=>({name:"Vim Script",
keywords:{$pattern:/[!#@\w]+/,
keyword:"N|0 P|0 X|0 a|0 ab abc abo al am an|0 ar arga argd arge argdo argg argl argu as au aug aun b|0 bN ba bad bd be bel bf bl bm bn bo bp br brea breaka breakd breakl bro bufdo buffers bun bw c|0 cN cNf ca cabc caddb cad caddf cal cat cb cc ccl cd ce cex cf cfir cgetb cgete cg changes chd che checkt cl cla clo cm cmapc cme cn cnew cnf cno cnorea cnoreme co col colo com comc comp con conf cope cp cpf cq cr cs cst cu cuna cunme cw delm deb debugg delc delf dif diffg diffo diffp diffpu diffs diffthis dig di dl dell dj dli do doautoa dp dr ds dsp e|0 ea ec echoe echoh echom echon el elsei em en endfo endf endt endw ene ex exe exi exu f|0 files filet fin fina fini fir fix fo foldc foldd folddoc foldo for fu go gr grepa gu gv ha helpf helpg helpt hi hid his ia iabc if ij il im imapc ime ino inorea inoreme int is isp iu iuna iunme j|0 ju k|0 keepa kee keepj lN lNf l|0 lad laddb laddf la lan lat lb lc lch lcl lcs le lefta let lex lf lfir lgetb lgete lg lgr lgrepa lh ll lla lli lmak lm lmapc lne lnew lnf ln loadk lo loc lockv lol lope lp lpf lr ls lt lu lua luad luaf lv lvimgrepa lw m|0 ma mak map mapc marks mat me menut mes mk mks mksp mkv mkvie mod mz mzf nbc nb nbs new nm nmapc nme nn nnoreme noa no noh norea noreme norm nu nun nunme ol o|0 om omapc ome on ono onoreme opt ou ounme ow p|0 profd prof pro promptr pc ped pe perld po popu pp pre prev ps pt ptN ptf ptj ptl ptn ptp ptr pts pu pw py3 python3 py3d py3f py pyd pyf quita qa rec red redi redr redraws reg res ret retu rew ri rightb rub rubyd rubyf rund ru rv sN san sa sal sav sb sbN sba sbf sbl sbm sbn sbp sbr scrip scripte scs se setf setg setl sf sfir sh sim sig sil sl sla sm smap smapc sme sn sni sno snor snoreme sor so spelld spe spelli spellr spellu spellw sp spr sre st sta startg startr star stopi stj sts sun sunm sunme sus sv sw sy synti sync tN tabN tabc tabdo tabe tabf tabfir tabl tabm tabnew tabn tabo tabp tabr tabs tab ta tags tc tcld tclf te tf th tj tl tm tn to tp tr try ts tu u|0 undoj undol una unh unl unlo unm unme uns up ve verb vert vim vimgrepa vi viu vie vm vmapc vme vne vn vnoreme vs vu vunme windo w|0 wN wa wh wi winc winp wn wp wq wqa ws wu wv x|0 xa xmapc xm xme xn xnoreme xu xunme y|0 z|0 ~ Next Print append abbreviate abclear aboveleft all amenu anoremenu args argadd argdelete argedit argglobal arglocal argument ascii autocmd augroup aunmenu buffer bNext ball badd bdelete behave belowright bfirst blast bmodified bnext botright bprevious brewind break breakadd breakdel breaklist browse bunload bwipeout change cNext cNfile cabbrev cabclear caddbuffer caddexpr caddfile call catch cbuffer cclose center cexpr cfile cfirst cgetbuffer cgetexpr cgetfile chdir checkpath checktime clist clast close cmap cmapclear cmenu cnext cnewer cnfile cnoremap cnoreabbrev cnoremenu copy colder colorscheme command comclear compiler continue confirm copen cprevious cpfile cquit crewind cscope cstag cunmap cunabbrev cunmenu cwindow delete delmarks debug debuggreedy delcommand delfunction diffupdate diffget diffoff diffpatch diffput diffsplit digraphs display deletel djump dlist doautocmd doautoall deletep drop dsearch dsplit edit earlier echo echoerr echohl echomsg else elseif emenu endif endfor endfunction endtry endwhile enew execute exit exusage file filetype find finally finish first fixdel fold foldclose folddoopen folddoclosed foldopen function global goto grep grepadd gui gvim hardcopy help helpfind helpgrep helptags highlight hide history insert iabbrev iabclear ijump ilist imap imapclear imenu inoremap inoreabbrev inoremenu intro isearch isplit iunmap iunabbrev iunmenu join jumps keepalt keepmarks keepjumps lNext lNfile list laddexpr laddbuffer laddfile last language later lbuffer lcd lchdir lclose lcscope left leftabove lexpr lfile lfirst lgetbuffer lgetexpr lgetfile lgrep lgrepadd lhelpgrep llast llist lmake lmap lmapclear lnext lnewer lnfile lnoremap loadkeymap loadview lockmarks lockvar lolder lopen lprevious lpfile lrewind ltag lunmap luado luafile lvimgrep lvimgrepadd lwindow move mark make mapclear match menu menutranslate messages mkexrc mksession mkspell mkvimrc mkview mode mzscheme mzfile nbclose nbkey nbsart next nmap nmapclear nmenu nnoremap nnoremenu noautocmd noremap nohlsearch noreabbrev noremenu normal number nunmap nunmenu oldfiles open omap omapclear omenu only onoremap onoremenu options ounmap ounmenu ownsyntax print profdel profile promptfind promptrepl pclose pedit perl perldo pop popup ppop preserve previous psearch ptag ptNext ptfirst ptjump ptlast ptnext ptprevious ptrewind ptselect put pwd py3do py3file python pydo pyfile quit quitall qall read recover redo redir redraw redrawstatus registers resize retab return rewind right rightbelow ruby rubydo rubyfile rundo runtime rviminfo substitute sNext sandbox sargument sall saveas sbuffer sbNext sball sbfirst sblast sbmodified sbnext sbprevious sbrewind scriptnames scriptencoding scscope set setfiletype setglobal setlocal sfind sfirst shell simalt sign silent sleep slast smagic smapclear smenu snext sniff snomagic snoremap snoremenu sort source spelldump spellgood spellinfo spellrepall spellundo spellwrong split sprevious srewind stop stag startgreplace startreplace startinsert stopinsert stjump stselect sunhide sunmap sunmenu suspend sview swapname syntax syntime syncbind tNext tabNext tabclose tabedit tabfind tabfirst tablast tabmove tabnext tabonly tabprevious tabrewind tag tcl tcldo tclfile tearoff tfirst throw tjump tlast tmenu tnext topleft tprevious trewind tselect tunmenu undo undojoin undolist unabbreviate unhide unlet unlockvar unmap unmenu unsilent update vglobal version verbose vertical vimgrep vimgrepadd visual viusage view vmap vmapclear vmenu vnew vnoremap vnoremenu vsplit vunmap vunmenu write wNext wall while winsize wincmd winpos wnext wprevious wqall wsverb wundo wviminfo xit xall xmapclear xmap xmenu xnoremap xnoremenu xunmap xunmenu yank",
built_in:"synIDtrans atan2 range matcharg did_filetype asin feedkeys xor argv complete_check add getwinposx getqflist getwinposy screencol clearmatches empty extend getcmdpos mzeval garbagecollect setreg ceil sqrt diff_hlID inputsecret get getfperm getpid filewritable shiftwidth max sinh isdirectory synID system inputrestore winline atan visualmode inputlist tabpagewinnr round getregtype mapcheck hasmapto histdel argidx findfile sha256 exists toupper getcmdline taglist string getmatches bufnr strftime winwidth bufexists strtrans tabpagebuflist setcmdpos remote_read printf setloclist getpos getline bufwinnr float2nr len getcmdtype diff_filler luaeval resolve libcallnr foldclosedend reverse filter has_key bufname str2float strlen setline getcharmod setbufvar index searchpos shellescape undofile foldclosed setqflist buflisted strchars str2nr virtcol floor remove undotree remote_expr winheight gettabwinvar reltime cursor tabpagenr finddir localtime acos getloclist search tanh matchend rename gettabvar strdisplaywidth type abs py3eval setwinvar tolower wildmenumode log10 spellsuggest bufloaded synconcealed nextnonblank server2client complete settabwinvar executable input wincol setmatches getftype hlID inputsave searchpair or screenrow line settabvar histadd deepcopy strpart remote_peek and eval getftime submatch screenchar winsaveview matchadd mkdir screenattr getfontname libcall reltimestr getfsize winnr invert pow getbufline byte2line soundfold repeat fnameescape tagfiles sin strwidth spellbadword trunc maparg log lispindent hostname setpos globpath remote_foreground getchar synIDattr fnamemodify cscope_connection stridx winbufnr indent min complete_add nr2char searchpairpos inputdialog values matchlist items hlexists strridx browsedir expand fmod pathshorten line2byte argc count getwinvar glob foldtextresult getreg foreground cosh matchdelete has char2nr simplify histget searchdecl iconv winrestcmd pumvisible writefile foldlevel haslocaldir keys cos matchstr foldtext histnr tan tempname getcwd byteidx getbufvar islocked escape eventhandler remote_send serverlist winrestview synstack pyeval prevnonblank readfile cindent filereadable changenr exp"
},illegal:/;/,contains:[e.NUMBER_MODE,{className:"string",begin:"'",end:"'",
illegal:"\\n"},{className:"string",begin:/"(\\"|\n\\|[^"\n])*"/
},e.COMMENT('"',"$"),{className:"variable",begin:/[bwtglsav]:[\w\d_]*/},{
className:"function",beginKeywords:"function function!",end:"$",relevance:0,
contains:[e.TITLE_MODE,{className:"params",begin:"\\(",end:"\\)"}]},{
className:"symbol",begin:/<[\w-]+>/}]})})());hljs.registerLanguage("purebasic",(()=>{"use strict";return e=>({
name:"PureBASIC",aliases:["pb","pbi"],
keywords:"Align And Array As Break CallDebugger Case CompilerCase CompilerDefault CompilerElse CompilerElseIf CompilerEndIf CompilerEndSelect CompilerError CompilerIf CompilerSelect CompilerWarning Continue Data DataSection Debug DebugLevel Declare DeclareC DeclareCDLL DeclareDLL DeclareModule Default Define Dim DisableASM DisableDebugger DisableExplicit Else ElseIf EnableASM EnableDebugger EnableExplicit End EndDataSection EndDeclareModule EndEnumeration EndIf EndImport EndInterface EndMacro EndModule EndProcedure EndSelect EndStructure EndStructureUnion EndWith Enumeration EnumerationBinary Extends FakeReturn For ForEach ForEver Global Gosub Goto If Import ImportC IncludeBinary IncludeFile IncludePath Interface List Macro MacroExpandedCount Map Module NewList NewMap Next Not Or Procedure ProcedureC ProcedureCDLL ProcedureDLL ProcedureReturn Protected Prototype PrototypeC ReDim Read Repeat Restore Return Runtime Select Shared Static Step Structure StructureUnion Swap Threaded To UndefineMacro Until Until  UnuseModule UseModule Wend While With XIncludeFile XOr",
contains:[e.COMMENT(";","$",{relevance:0}),{className:"function",
begin:"\\b(Procedure|Declare)(C|CDLL|DLL)?\\b",end:"\\(",excludeEnd:!0,
returnBegin:!0,contains:[{className:"keyword",
begin:"(Procedure|Declare)(C|CDLL|DLL)?",excludeEnd:!0},{className:"type",
begin:"\\.\\w*"},e.UNDERSCORE_TITLE_MODE]},{className:"string",begin:'(~)?"',
end:'"',illegal:"\\n"},{className:"symbol",begin:"#[a-zA-Z_]\\w*\\$?"}]})})());hljs.registerLanguage("profile",(()=>{"use strict";return e=>({
name:"Python profiler",contains:[e.C_NUMBER_MODE,{
begin:"[a-zA-Z_][\\da-zA-Z_]+\\.[\\da-zA-Z_]{1,3}",end:":",excludeEnd:!0},{
begin:"(ncalls|tottime|cumtime)",end:"$",
keywords:"ncalls tottime|10 cumtime|10 filename",relevance:10},{
begin:"function calls",end:"$",contains:[e.C_NUMBER_MODE],relevance:10
},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{className:"string",begin:"\\(",
end:"\\)$",excludeBegin:!0,excludeEnd:!0,relevance:0}]})})());hljs.registerLanguage("avrasm",(()=>{"use strict";return r=>({
name:"AVR Assembly",case_insensitive:!0,keywords:{$pattern:"\\.?"+r.IDENT_RE,
keyword:"adc add adiw and andi asr bclr bld brbc brbs brcc brcs break breq brge brhc brhs brid brie brlo brlt brmi brne brpl brsh brtc brts brvc brvs bset bst call cbi cbr clc clh cli cln clr cls clt clv clz com cp cpc cpi cpse dec eicall eijmp elpm eor fmul fmuls fmulsu icall ijmp in inc jmp ld ldd ldi lds lpm lsl lsr mov movw mul muls mulsu neg nop or ori out pop push rcall ret reti rjmp rol ror sbc sbr sbrc sbrs sec seh sbi sbci sbic sbis sbiw sei sen ser ses set sev sez sleep spm st std sts sub subi swap tst wdr",
built_in:"r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 r16 r17 r18 r19 r20 r21 r22 r23 r24 r25 r26 r27 r28 r29 r30 r31 x|0 xh xl y|0 yh yl z|0 zh zl ucsr1c udr1 ucsr1a ucsr1b ubrr1l ubrr1h ucsr0c ubrr0h tccr3c tccr3a tccr3b tcnt3h tcnt3l ocr3ah ocr3al ocr3bh ocr3bl ocr3ch ocr3cl icr3h icr3l etimsk etifr tccr1c ocr1ch ocr1cl twcr twdr twar twsr twbr osccal xmcra xmcrb eicra spmcsr spmcr portg ddrg ping portf ddrf sreg sph spl xdiv rampz eicrb eimsk gimsk gicr eifr gifr timsk tifr mcucr mcucsr tccr0 tcnt0 ocr0 assr tccr1a tccr1b tcnt1h tcnt1l ocr1ah ocr1al ocr1bh ocr1bl icr1h icr1l tccr2 tcnt2 ocr2 ocdr wdtcr sfior eearh eearl eedr eecr porta ddra pina portb ddrb pinb portc ddrc pinc portd ddrd pind spdr spsr spcr udr0 ucsr0a ucsr0b ubrr0l acsr admux adcsr adch adcl porte ddre pine pinf",
meta:".byte .cseg .db .def .device .dseg .dw .endmacro .equ .eseg .exit .include .list .listmac .macro .nolist .org .set"
},contains:[r.C_BLOCK_COMMENT_MODE,r.COMMENT(";","$",{relevance:0
}),r.C_NUMBER_MODE,r.BINARY_NUMBER_MODE,{className:"number",
begin:"\\b(\\$[a-zA-Z0-9]+|0o[0-7]+)"},r.QUOTE_STRING_MODE,{className:"string",
begin:"'",end:"[^\\\\]'",illegal:"[^\\\\][^']"},{className:"symbol",
begin:"^[A-Za-z0-9_.$]+:"},{className:"meta",begin:"#",end:"$"},{
className:"subst",begin:"@[0-9]+"}]})})());hljs.registerLanguage("java",(()=>{"use strict"
;var e="\\.([0-9](_*[0-9])*)",n="[0-9a-fA-F](_*[0-9a-fA-F])*",a={
className:"number",variants:[{
begin:`(\\b([0-9](_*[0-9])*)((${e})|\\.)?|(${e}))[eE][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
},{begin:`\\b([0-9](_*[0-9])*)((${e})[fFdD]?\\b|\\.([fFdD]\\b)?)`},{
begin:`(${e})[fFdD]?\\b`},{begin:"\\b([0-9](_*[0-9])*)[fFdD]\\b"},{
begin:`\\b0[xX]((${n})\\.?|(${n})?\\.(${n}))[pP][+-]?([0-9](_*[0-9])*)[fFdD]?\\b`
},{begin:"\\b(0|[1-9](_*[0-9])*)[lL]?\\b"},{begin:`\\b0[xX](${n})[lL]?\\b`},{
begin:"\\b0(_*[0-7])*[lL]?\\b"},{begin:"\\b0[bB][01](_*[01])*[lL]?\\b"}],
relevance:0};return e=>{
var n="false synchronized int abstract float private char boolean var static null if const for true while long strictfp finally protected import native final void enum else break transient catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private module requires exports do",s={
className:"meta",begin:"@[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*",
contains:[{begin:/\(/,end:/\)/,contains:["self"]}]};const r=a;return{
name:"Java",aliases:["jsp"],keywords:n,illegal:/<\/|#/,
contains:[e.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{begin:/\w+@/,
relevance:0},{className:"doctag",begin:"@[A-Za-z]+"}]}),{
begin:/import java\.[a-z]+\./,keywords:"import",relevance:2
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{
className:"class",beginKeywords:"class interface enum",end:/[{;=]/,
excludeEnd:!0,keywords:"class interface enum",illegal:/[:"\[\]]/,contains:[{
beginKeywords:"extends implements"},e.UNDERSCORE_TITLE_MODE]},{
beginKeywords:"new throw return else",relevance:0},{className:"class",
begin:"record\\s+"+e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,excludeEnd:!0,
end:/[{;=]/,keywords:n,contains:[{beginKeywords:"record"},{
begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,
contains:[e.UNDERSCORE_TITLE_MODE]},{className:"params",begin:/\(/,end:/\)/,
keywords:n,relevance:0,contains:[e.C_BLOCK_COMMENT_MODE]
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"function",
begin:"([\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*(<[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*(\\s*,\\s*[\xc0-\u02b8a-zA-Z_$][\xc0-\u02b8a-zA-Z_$0-9]*)*>)?\\s+)+"+e.UNDERSCORE_IDENT_RE+"\\s*\\(",
returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:n,contains:[{
begin:e.UNDERSCORE_IDENT_RE+"\\s*\\(",returnBegin:!0,relevance:0,
contains:[e.UNDERSCORE_TITLE_MODE]},{className:"params",begin:/\(/,end:/\)/,
keywords:n,relevance:0,
contains:[s,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,r,e.C_BLOCK_COMMENT_MODE]
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},r,s]}}})());hljs.registerLanguage("javascript",(()=>{"use strict"
;const e="[A-Za-z$_][0-9A-Za-z$_]*",n=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],a=["true","false","null","undefined","NaN","Infinity"],s=[].concat(["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],["arguments","this","super","console","window","document","localStorage","module","global"],["Intl","DataView","Number","Math","Date","String","RegExp","Object","Function","Boolean","Error","Symbol","Set","Map","WeakSet","WeakMap","Proxy","Reflect","JSON","Promise","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Float32Array","Array","Uint8Array","Uint8ClampedArray","ArrayBuffer"],["EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"])
;function r(e){return i("(?=",e,")")}function i(...e){return e.map((e=>{
return(n=e)?"string"==typeof n?n:n.source:null;var n})).join("")}return t=>{
const c=e,o={begin:/<[A-Za-z0-9\\._:-]+/,end:/\/[A-Za-z0-9\\._:-]+>|\/>/,
isTrulyOpeningTag:(e,n)=>{const a=e[0].length+e.index,s=e.input[a]
;"<"!==s?">"===s&&(((e,{after:n})=>{const a="</"+e[0].slice(1)
;return-1!==e.input.indexOf(a,n)})(e,{after:a
})||n.ignoreMatch()):n.ignoreMatch()}},l={$pattern:e,keyword:n.join(" "),
literal:a.join(" "),built_in:s.join(" ")
},b="\\.([0-9](_?[0-9])*)",g="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",d={
className:"number",variants:[{
begin:`(\\b(${g})((${b})|\\.)?|(${b}))[eE][+-]?([0-9](_?[0-9])*)\\b`},{
begin:`\\b(${g})\\b((${b})\\b|\\.)?|(${b})\\b`},{
begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{
begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{
begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{
begin:"\\b0[0-7]+n?\\b"}],relevance:0},E={className:"subst",begin:"\\$\\{",
end:"\\}",keywords:l,contains:[]},u={begin:"html`",end:"",starts:{end:"`",
returnEnd:!1,contains:[t.BACKSLASH_ESCAPE,E],subLanguage:"xml"}},_={
begin:"css`",end:"",starts:{end:"`",returnEnd:!1,
contains:[t.BACKSLASH_ESCAPE,E],subLanguage:"css"}},m={className:"string",
begin:"`",end:"`",contains:[t.BACKSLASH_ESCAPE,E]},N={className:"comment",
variants:[t.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+",contains:[{className:"type",begin:"\\{",end:"\\}",relevance:0
},{className:"variable",begin:c+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{
begin:/(?=[^\n])\s/,relevance:0}]}]
}),t.C_BLOCK_COMMENT_MODE,t.C_LINE_COMMENT_MODE]
},y=[t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,u,_,m,d,t.REGEXP_MODE]
;E.contains=y.concat({begin:/\{/,end:/\}/,keywords:l,contains:["self"].concat(y)
});const f=[].concat(N,E.contains),A=f.concat([{begin:/\(/,end:/\)/,keywords:l,
contains:["self"].concat(f)}]),p={className:"params",begin:/\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,keywords:l,contains:A};return{name:"Javascript",
aliases:["js","jsx","mjs","cjs"],keywords:l,exports:{PARAMS_CONTAINS:A},
illegal:/#(?![$_A-z])/,contains:[t.SHEBANG({label:"shebang",binary:"node",
relevance:5}),{label:"use_strict",className:"meta",relevance:10,
begin:/^\s*['"]use (strict|asm)['"]/
},t.APOS_STRING_MODE,t.QUOTE_STRING_MODE,u,_,m,N,d,{
begin:i(/[{,\n]\s*/,r(i(/(((\/\/.*$)|(\/\*(\*[^/]|[^*])*\*\/))\s*)*/,c+"\\s*:"))),
relevance:0,contains:[{className:"attr",begin:c+r("\\s*:"),relevance:0}]},{
begin:"("+t.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",
keywords:"return throw case",contains:[N,t.REGEXP_MODE,{className:"function",
begin:"(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+t.UNDERSCORE_IDENT_RE+")\\s*=>",
returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{
begin:t.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0
},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:A}]}]
},{begin:/,/,relevance:0},{className:"",begin:/\s/,end:/\s*/,skip:!0},{
variants:[{begin:"<>",end:"</>"},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,
end:o.end}],subLanguage:"xml",contains:[{begin:o.begin,end:o.end,skip:!0,
contains:["self"]}]}],relevance:0},{className:"function",
beginKeywords:"function",end:/[{;]/,excludeEnd:!0,keywords:l,
contains:["self",t.inherit(t.TITLE_MODE,{begin:c}),p],illegal:/%/},{
beginKeywords:"while if switch catch for"},{className:"function",
begin:t.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
returnBegin:!0,contains:[p,t.inherit(t.TITLE_MODE,{begin:c})]},{variants:[{
begin:"\\."+c},{begin:"\\$"+c}],relevance:0},{className:"class",
beginKeywords:"class",end:/[{;=]/,excludeEnd:!0,illegal:/[:"[\]]/,contains:[{
beginKeywords:"extends"},t.UNDERSCORE_TITLE_MODE]},{begin:/\b(?=constructor)/,
end:/[{;]/,excludeEnd:!0,contains:[t.inherit(t.TITLE_MODE,{begin:c}),"self",p]
},{begin:"(get|set)\\s+(?="+c+"\\()",end:/\{/,keywords:"get set",
contains:[t.inherit(t.TITLE_MODE,{begin:c}),{begin:/\(\)/},p]},{begin:/\$[(.]/}]
}}})());hljs.registerLanguage("smalltalk",(()=>{"use strict";return e=>{
const n="[a-z][a-zA-Z0-9_]*",a={className:"string",begin:"\\$.{1}"},s={
className:"symbol",begin:"#"+e.UNDERSCORE_IDENT_RE};return{name:"Smalltalk",
aliases:["st"],keywords:"self super nil true false thisContext",
contains:[e.COMMENT('"','"'),e.APOS_STRING_MODE,{className:"type",
begin:"\\b[A-Z][A-Za-z0-9_]*",relevance:0},{begin:n+":",relevance:0
},e.C_NUMBER_MODE,s,a,{begin:"\\|[ ]*"+n+"([ ]+"+n+")*[ ]*\\|",returnBegin:!0,
end:/\|/,illegal:/\S/,contains:[{begin:"(\\|[ ]*)?"+n}]},{begin:"#\\(",
end:"\\)",contains:[e.APOS_STRING_MODE,a,e.C_NUMBER_MODE,s]}]}}})());hljs.registerLanguage("delphi",(()=>{"use strict";return e=>{
const r="exports register file shl array record property for mod while set ally label uses raise not stored class safecall var interface or private static exit index inherited to else stdcall override shr asm far resourcestring finalization packed virtual out and protected library do xorwrite goto near function end div overload object unit begin string on inline repeat until destructor write message program with read initialization except default nil if case cdecl in downto threadvar of try pascal const external constructor type public then implementation finally published procedure absolute reintroduce operator as is abstract alias assembler bitpacked break continue cppdecl cvar enumerator experimental platform deprecated unimplemented dynamic export far16 forward generic helper implements interrupt iochecks local name nodefault noreturn nostackframe oldfpccall otherwise saveregisters softfloat specialize strict unaligned varargs ",a=[e.C_LINE_COMMENT_MODE,e.COMMENT(/\{/,/\}/,{
relevance:0}),e.COMMENT(/\(\*/,/\*\)/,{relevance:10})],t={className:"meta",
variants:[{begin:/\{\$/,end:/\}/},{begin:/\(\*\$/,end:/\*\)/}]},n={
className:"string",begin:/'/,end:/'/,contains:[{begin:/''/}]},s={
className:"string",begin:/(#\d+)+/},i={begin:e.IDENT_RE+"\\s*=\\s*class\\s*\\(",
returnBegin:!0,contains:[e.TITLE_MODE]},c={className:"function",
beginKeywords:"function constructor destructor procedure",end:/[:;]/,
keywords:"function constructor|10 destructor|10 procedure|10",
contains:[e.TITLE_MODE,{className:"params",begin:/\(/,end:/\)/,keywords:r,
contains:[n,s,t].concat(a)},t].concat(a)};return{name:"Delphi",
aliases:["dpr","dfm","pas","pascal","freepascal","lazarus","lpr","lfm"],
case_insensitive:!0,keywords:r,illegal:/"|\$[G-Zg-z]|\/\*|<\/|\|/,
contains:[n,s,e.NUMBER_MODE,{className:"number",relevance:0,variants:[{
begin:"\\$[0-9A-Fa-f]+"},{begin:"&[0-7]+"},{begin:"%[01]+"}]},i,c,t].concat(a)}}
})());hljs.registerLanguage("css",(()=>{"use strict";return e=>{
var n="[a-zA-Z-][a-zA-Z0-9_-]*",a={
begin:/([*]\s?)?(?:[A-Z_.\-\\]+|--[a-zA-Z0-9_-]+)\s*(\/\*\*\/)?:/,
returnBegin:!0,end:";",endsWithParent:!0,contains:[{className:"attribute",
begin:/\S/,end:":",excludeEnd:!0,starts:{endsWithParent:!0,excludeEnd:!0,
contains:[{begin:/[\w-]+\(/,returnBegin:!0,contains:[{className:"built_in",
begin:/[\w-]+/},{begin:/\(/,end:/\)/,
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.CSS_NUMBER_MODE]}]
},e.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,e.C_BLOCK_COMMENT_MODE,{
className:"number",begin:"#[0-9A-Fa-f]+"},{className:"meta",begin:"!important"}]
}}]};return{name:"CSS",case_insensitive:!0,illegal:/[=|'\$]/,
contains:[e.C_BLOCK_COMMENT_MODE,{className:"selector-id",
begin:/#[A-Za-z0-9_-]+/},{className:"selector-class",begin:"\\."+n},{
className:"selector-attr",begin:/\[/,end:/\]/,illegal:"$",
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]},{className:"selector-pseudo",
begin:/:(:)?[a-zA-Z0-9_+()"'.-]+/},{begin:"@(page|font-face)",
lexemes:"@[a-z-]+",keywords:"@page @font-face"},{begin:"@",end:"[{;]",
illegal:/:/,returnBegin:!0,contains:[{className:"keyword",
begin:/@-?\w[\w]*(-\w+)*/},{begin:/\s/,endsWithParent:!0,excludeEnd:!0,
relevance:0,keywords:"and or not only",contains:[{begin:/[a-z-]+:/,
className:"attribute"},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.CSS_NUMBER_MODE]
}]},{className:"selector-tag",begin:n,relevance:0},{begin:/\{/,end:/\}/,
illegal:/\S/,contains:[e.C_BLOCK_COMMENT_MODE,{begin:/;/},a]}]}}})());hljs.registerLanguage("awk",(()=>{"use strict";return e=>({name:"Awk",keywords:{
keyword:"BEGIN END if else while do for in break continue delete next nextfile function func exit|10"
},contains:[{className:"variable",variants:[{begin:/\$[\w\d#@][\w\d_]*/},{
begin:/\$\{(.*?)\}/}]},{className:"string",contains:[e.BACKSLASH_ESCAPE],
variants:[{begin:/(u|b)?r?'''/,end:/'''/,relevance:10},{begin:/(u|b)?r?"""/,
end:/"""/,relevance:10},{begin:/(u|r|ur)'/,end:/'/,relevance:10},{
begin:/(u|r|ur)"/,end:/"/,relevance:10},{begin:/(b|br)'/,end:/'/},{
begin:/(b|br)"/,end:/"/},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},e.REGEXP_MODE,e.HASH_COMMENT_MODE,e.NUMBER_MODE]})})());hljs.registerLanguage("lua",(()=>{"use strict";return e=>{
const t="\\[=*\\[",a="\\]=*\\]",n={begin:t,end:a,contains:["self"]
},o=[e.COMMENT("--(?!\\[=*\\[)","$"),e.COMMENT("--\\[=*\\[",a,{contains:[n],
relevance:10})];return{name:"Lua",keywords:{$pattern:e.UNDERSCORE_IDENT_RE,
literal:"true false nil",
keyword:"and break do else elseif end for goto if in local not or repeat return then until while",
built_in:"_G _ENV _VERSION __index __newindex __mode __call __metatable __tostring __len __gc __add __sub __mul __div __mod __pow __concat __unm __eq __lt __le assert collectgarbage dofile error getfenv getmetatable ipairs load loadfile loadstring module next pairs pcall print rawequal rawget rawset require select setfenv setmetatable tonumber tostring type unpack xpcall arg self coroutine resume yield status wrap create running debug getupvalue debug sethook getmetatable gethook setmetatable setlocal traceback setfenv getinfo setupvalue getlocal getregistry getfenv io lines write close flush open output type read stderr stdin input stdout popen tmpfile math log max acos huge ldexp pi cos tanh pow deg tan cosh sinh random randomseed frexp ceil floor rad abs sqrt modf asin min mod fmod log10 atan2 exp sin atan os exit setlocale date getenv difftime remove time clock tmpname rename execute package preload loadlib loaded loaders cpath config path seeall string sub upper len gfind rep find match char dump gmatch reverse byte format gsub lower table setn insert getn foreachi maxn foreach concat sort remove"
},contains:o.concat([{className:"function",beginKeywords:"function",end:"\\)",
contains:[e.inherit(e.TITLE_MODE,{
begin:"([_a-zA-Z]\\w*\\.)*([_a-zA-Z]\\w*:)?[_a-zA-Z]\\w*"}),{className:"params",
begin:"\\(",endsWithParent:!0,contains:o}].concat(o)
},e.C_NUMBER_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{className:"string",
begin:t,end:a,contains:[n],relevance:5}])}}})());hljs.registerLanguage("go",(()=>{"use strict";return e=>{const n={
keyword:"break default func interface select case map struct chan else goto package switch const fallthrough if range type continue for import return var go defer bool byte complex64 complex128 float32 float64 int8 int16 int32 int64 string uint8 uint16 uint32 uint64 int uint uintptr rune",
literal:"true false iota nil",
built_in:"append cap close complex copy imag len make new panic print println real recover delete"
};return{name:"Go",aliases:["golang"],keywords:n,illegal:"</",
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"string",
variants:[e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{begin:"`",end:"`"}]},{
className:"number",variants:[{begin:e.C_NUMBER_RE+"[i]",relevance:1
},e.C_NUMBER_MODE]},{begin:/:=/},{className:"function",beginKeywords:"func",
end:"\\s*(\\{|$)",excludeEnd:!0,contains:[e.TITLE_MODE,{className:"params",
begin:/\(/,end:/\)/,keywords:n,illegal:/["']/}]}]}}})());hljs.registerLanguage("julia",(()=>{"use strict";return e=>{
var r="[A-Za-z_\\u00A1-\\uFFFF][A-Za-z_0-9\\u00A1-\\uFFFF]*",t={$pattern:r,
keyword:"baremodule begin break catch ccall const continue do else elseif end export false finally for function global if import in isa let local macro module quote return true try using where while",
literal:"ARGS C_NULL DEPOT_PATH ENDIAN_BOM ENV Inf Inf16 Inf32 Inf64 InsertionSort LOAD_PATH MergeSort NaN NaN16 NaN32 NaN64 PROGRAM_FILE QuickSort RoundDown RoundFromZero RoundNearest RoundNearestTiesAway RoundNearestTiesUp RoundToZero RoundUp VERSION|0 devnull false im missing nothing pi stderr stdin stdout true undef \u03c0 \u212f",
built_in:"AbstractArray AbstractChannel AbstractChar AbstractDict AbstractDisplay AbstractFloat AbstractIrrational AbstractMatrix AbstractRange AbstractSet AbstractString AbstractUnitRange AbstractVecOrMat AbstractVector Any ArgumentError Array AssertionError BigFloat BigInt BitArray BitMatrix BitSet BitVector Bool BoundsError CapturedException CartesianIndex CartesianIndices Cchar Cdouble Cfloat Channel Char Cint Cintmax_t Clong Clonglong Cmd Colon Complex ComplexF16 ComplexF32 ComplexF64 CompositeException Condition Cptrdiff_t Cshort Csize_t Cssize_t Cstring Cuchar Cuint Cuintmax_t Culong Culonglong Cushort Cvoid Cwchar_t Cwstring DataType DenseArray DenseMatrix DenseVecOrMat DenseVector Dict DimensionMismatch Dims DivideError DomainError EOFError Enum ErrorException Exception ExponentialBackOff Expr Float16 Float32 Float64 Function GlobalRef HTML IO IOBuffer IOContext IOStream IdDict IndexCartesian IndexLinear IndexStyle InexactError InitError Int Int128 Int16 Int32 Int64 Int8 Integer InterruptException InvalidStateException Irrational KeyError LinRange LineNumberNode LinearIndices LoadError MIME Matrix Method MethodError Missing MissingException Module NTuple NamedTuple Nothing Number OrdinalRange OutOfMemoryError OverflowError Pair PartialQuickSort PermutedDimsArray Pipe ProcessFailedException Ptr QuoteNode Rational RawFD ReadOnlyMemoryError Real ReentrantLock Ref Regex RegexMatch RoundingMode SegmentationFault Set Signed Some StackOverflowError StepRange StepRangeLen StridedArray StridedMatrix StridedVecOrMat StridedVector String StringIndexError SubArray SubString SubstitutionString Symbol SystemError Task TaskFailedException Text TextDisplay Timer Tuple Type TypeError TypeVar UInt UInt128 UInt16 UInt32 UInt64 UInt8 UndefInitializer UndefKeywordError UndefRefError UndefVarError Union UnionAll UnitRange Unsigned Val Vararg VecElement VecOrMat Vector VersionNumber WeakKeyDict WeakRef"
},n={keywords:t,illegal:/<\//},a={className:"subst",begin:/\$\(/,end:/\)/,
keywords:t},i={className:"variable",begin:"\\$"+r},o={className:"string",
contains:[e.BACKSLASH_ESCAPE,a,i],variants:[{begin:/\w*"""/,end:/"""\w*/,
relevance:10},{begin:/\w*"/,end:/"\w*/}]},s={className:"string",
contains:[e.BACKSLASH_ESCAPE,a,i],begin:"`",end:"`"},l={className:"meta",
begin:"@"+r};return n.name="Julia",n.contains=[{className:"number",
begin:/(\b0x[\d_]*(\.[\d_]*)?|0x\.\d[\d_]*)p[-+]?\d+|\b0[box][a-fA-F0-9][a-fA-F0-9_]*|(\b\d[\d_]*(\.[\d_]*)?|\.\d[\d_]*)([eEfF][-+]?\d+)?/,
relevance:0},{className:"string",begin:/'(.|\\[xXuU][a-zA-Z0-9]+)'/},o,s,l,{
className:"comment",variants:[{begin:"#=",end:"=#",relevance:10},{begin:"#",
end:"$"}]},e.HASH_COMMENT_MODE,{className:"keyword",
begin:"\\b(((abstract|primitive)\\s+)type|(mutable\\s+)?struct)\\b"},{begin:/<:/
}],a.contains=n.contains,n}})());hljs.registerLanguage("groovy",(()=>{"use strict";function e(e,n={}){
return n.variants=e,n}return n=>{
const a="[A-Za-z0-9_$]+",t=e([n.C_LINE_COMMENT_MODE,n.C_BLOCK_COMMENT_MODE,n.COMMENT("/\\*\\*","\\*/",{
relevance:0,contains:[{begin:/\w+@/,relevance:0},{className:"doctag",
begin:"@[A-Za-z]+"}]})]),s={className:"regexp",begin:/~?\/[^\/\n]+\//,
contains:[n.BACKSLASH_ESCAPE]
},i=e([n.BINARY_NUMBER_MODE,n.C_NUMBER_MODE]),r=e([{begin:/"""/,end:/"""/},{
begin:/'''/,end:/'''/},{begin:"\\$/",end:"/\\$",relevance:10
},n.APOS_STRING_MODE,n.QUOTE_STRING_MODE],{className:"string"});return{
name:"Groovy",keywords:{built_in:"this super",literal:"true false null",
keyword:"byte short char int long boolean float double void def as in assert trait abstract static volatile transient public private protected synchronized final class interface enum if else for while switch case break default continue throw throws try catch finally implements extends new import package return instanceof"
},contains:[n.SHEBANG({binary:"groovy",relevance:10}),t,r,s,i,{
className:"class",beginKeywords:"class interface trait enum",end:/\{/,
illegal:":",contains:[{beginKeywords:"extends implements"
},n.UNDERSCORE_TITLE_MODE]},{className:"meta",begin:"@[A-Za-z]+",relevance:0},{
className:"attr",begin:a+"[ \t]*:"},{begin:/\?/,end:/:/,relevance:0,
contains:[t,r,s,i,"self"]},{className:"symbol",
begin:"^[ \t]*"+(l=a+":",((...e)=>e.map((e=>(e=>e?"string"==typeof e?e:e.source:null)(e))).join(""))("(?=",l,")")),
excludeBegin:!0,end:a+":",relevance:0}],illegal:/#|<\//};var l}})());hljs.registerLanguage("actionscript",(()=>{"use strict";return e=>({
name:"ActionScript",aliases:["as"],keywords:{
keyword:"as break case catch class const continue default delete do dynamic each else extends final finally for function get if implements import in include instanceof interface internal is namespace native new override package private protected public return set static super switch this throw try typeof use var void while with",
literal:"true false null undefined"},
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.C_NUMBER_MODE,{
className:"class",beginKeywords:"package",end:/\{/,contains:[e.TITLE_MODE]},{
className:"class",beginKeywords:"class interface",end:/\{/,excludeEnd:!0,
contains:[{beginKeywords:"extends implements"},e.TITLE_MODE]},{className:"meta",
beginKeywords:"import include",end:";",keywords:{"meta-keyword":"import include"
}},{className:"function",beginKeywords:"function",end:"[{;]",excludeEnd:!0,
illegal:"\\S",contains:[e.TITLE_MODE,{className:"params",begin:"\\(",end:"\\)",
contains:[e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{
className:"rest_arg",begin:"[.]{3}",end:"[a-zA-Z_$][a-zA-Z0-9_$]*",relevance:10
}]},{begin:":\\s*([*]|[a-zA-Z_$][a-zA-Z0-9_$]*)"}]},e.METHOD_GUARD],illegal:/#/
})})());hljs.registerLanguage("dockerfile",(()=>{"use strict";return e=>({
name:"Dockerfile",aliases:["docker"],case_insensitive:!0,
keywords:"from maintainer expose env arg user onbuild stopsignal",
contains:[e.HASH_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,{
beginKeywords:"run cmd entrypoint volume add copy workdir label healthcheck shell",
starts:{end:/[^\\]$/,subLanguage:"bash"}}],illegal:"</"})})());hljs.registerLanguage("pf",(()=>{"use strict";return t=>({
name:"Packet Filter config",aliases:["pf.conf"],keywords:{
$pattern:/[a-z0-9_<>-]+/,
built_in:"block match pass load anchor|5 antispoof|10 set table",
keyword:"in out log quick on rdomain inet inet6 proto from port os to route allow-opts divert-packet divert-reply divert-to flags group icmp-type icmp6-type label once probability recieved-on rtable prio queue tos tag tagged user keep fragment for os drop af-to|10 binat-to|10 nat-to|10 rdr-to|10 bitmask least-stats random round-robin source-hash static-port dup-to reply-to route-to parent bandwidth default min max qlimit block-policy debug fingerprints hostid limit loginterface optimization reassemble ruleset-optimization basic none profile skip state-defaults state-policy timeout const counters persist no modulate synproxy state|5 floating if-bound no-sync pflow|10 sloppy source-track global rule max-src-nodes max-src-states max-src-conn max-src-conn-rate overload flush scrub|5 max-mss min-ttl no-df|10 random-id",
literal:"all any no-route self urpf-failed egress|5 unknown"},
contains:[t.HASH_COMMENT_MODE,t.NUMBER_MODE,t.QUOTE_STRING_MODE,{
className:"variable",begin:/\$[\w\d#@][\w\d_]*/},{className:"variable",
begin:/<(?!\/)/,end:/>/}]})})());hljs.registerLanguage("tcl",(()=>{"use strict";return e=>({name:"Tcl",
aliases:["tk"],
keywords:"after append apply array auto_execok auto_import auto_load auto_mkindex auto_mkindex_old auto_qualify auto_reset bgerror binary break catch cd chan clock close concat continue dde dict encoding eof error eval exec exit expr fblocked fconfigure fcopy file fileevent filename flush for foreach format gets glob global history http if incr info interp join lappend|10 lassign|10 lindex|10 linsert|10 list llength|10 load lrange|10 lrepeat|10 lreplace|10 lreverse|10 lsearch|10 lset|10 lsort|10 mathfunc mathop memory msgcat namespace open package parray pid pkg::create pkg_mkIndex platform platform::shell proc puts pwd read refchan regexp registry regsub|10 rename return safe scan seek set socket source split string subst switch tcl_endOfWord tcl_findLibrary tcl_startOfNextWord tcl_startOfPreviousWord tcl_wordBreakAfter tcl_wordBreakBefore tcltest tclvars tell time tm trace unknown unload unset update uplevel upvar variable vwait while",
contains:[e.COMMENT(";[ \\t]*#","$"),e.COMMENT("^[ \\t]*#","$"),{
beginKeywords:"proc",end:"[\\{]",excludeEnd:!0,contains:[{className:"title",
begin:"[ \\t\\n\\r]+(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*",end:"[ \\t\\n\\r]",
endsWithParent:!0,excludeEnd:!0}]},{excludeEnd:!0,variants:[{
begin:"\\$(\\{)?(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*\\(([a-zA-Z0-9_])*\\)",
end:"[^a-zA-Z0-9_\\}\\$]"},{begin:"\\$(\\{)?(::)?[a-zA-Z_]((::)?[a-zA-Z0-9_])*",
end:"(\\))?[^a-zA-Z0-9_\\}\\$]"}]},{className:"string",
contains:[e.BACKSLASH_ESCAPE],variants:[e.inherit(e.QUOTE_STRING_MODE,{
illegal:null})]},{className:"number",
variants:[e.BINARY_NUMBER_MODE,e.C_NUMBER_MODE]}]})})());hljs.registerLanguage("ocaml",(()=>{"use strict";return e=>({name:"OCaml",
aliases:["ml"],keywords:{$pattern:"[a-z_]\\w*!?",
keyword:"and as assert asr begin class constraint do done downto else end exception external for fun function functor if in include inherit! inherit initializer land lazy let lor lsl lsr lxor match method!|10 method mod module mutable new object of open! open or private rec sig struct then to try type val! val virtual when while with parser value",
built_in:"array bool bytes char exn|5 float int int32 int64 list lazy_t|5 nativeint|5 string unit in_channel out_channel ref",
literal:"true false"},illegal:/\/\/|>>/,contains:[{className:"literal",
begin:"\\[(\\|\\|)?\\]|\\(\\)",relevance:0},e.COMMENT("\\(\\*","\\*\\)",{
contains:["self"]}),{className:"symbol",begin:"'[A-Za-z_](?!')[\\w']*"},{
className:"type",begin:"`[A-Z][\\w']*"},{className:"type",
begin:"\\b[A-Z][\\w']*",relevance:0},{begin:"[a-z_]\\w*'[\\w']*",relevance:0
},e.inherit(e.APOS_STRING_MODE,{className:"string",relevance:0
}),e.inherit(e.QUOTE_STRING_MODE,{illegal:null}),{className:"number",
begin:"\\b(0[xX][a-fA-F0-9_]+[Lln]?|0[oO][0-7_]+[Lln]?|0[bB][01_]+[Lln]?|[0-9][0-9_]*([Lln]|(\\.[0-9_]*)?([eE][-+]?[0-9_]+)?)?)",
relevance:0},{begin:/->/}]})})());hljs.registerLanguage("apache",(()=>{"use strict";return e=>{const n={
className:"number",begin:"\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?"
};return{name:"Apache config",aliases:["apacheconf"],case_insensitive:!0,
contains:[e.HASH_COMMENT_MODE,{className:"section",begin:"</?",end:">",
contains:[n,{className:"number",begin:":\\d{1,5}"
},e.inherit(e.QUOTE_STRING_MODE,{relevance:0})]},{className:"attribute",
begin:/\w+/,relevance:0,keywords:{
nomarkup:"order deny allow setenv rewriterule rewriteengine rewritecond documentroot sethandler errordocument loadmodule options header listen serverroot servername"
},starts:{end:/$/,relevance:0,keywords:{literal:"on off all deny allow"},
contains:[{className:"meta",begin:"\\s\\[",end:"\\]$"},{className:"variable",
begin:"[\\$%]\\{",end:"\\}",contains:["self",{className:"number",
begin:"[\\$%]\\d+"}]},n,{className:"number",begin:"\\d+"},e.QUOTE_STRING_MODE]}
}],illegal:/\S/}}})());hljs.registerLanguage("d",(()=>{"use strict";return e=>{const a={
$pattern:e.UNDERSCORE_IDENT_RE,
keyword:"abstract alias align asm assert auto body break byte case cast catch class const continue debug default delete deprecated do else enum export extern final finally for foreach foreach_reverse|10 goto if immutable import in inout int interface invariant is lazy macro mixin module new nothrow out override package pragma private protected public pure ref return scope shared static struct super switch synchronized template this throw try typedef typeid typeof union unittest version void volatile while with __FILE__ __LINE__ __gshared|10 __thread __traits __DATE__ __EOF__ __TIME__ __TIMESTAMP__ __VENDOR__ __VERSION__",
built_in:"bool cdouble cent cfloat char creal dchar delegate double dstring float function idouble ifloat ireal long real short string ubyte ucent uint ulong ushort wchar wstring",
literal:"false null true"
},d="((0|[1-9][\\d_]*)|0[bB][01_]+|0[xX]([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*))",n="\\\\(['\"\\?\\\\abfnrtv]|u[\\dA-Fa-f]{4}|[0-7]{1,3}|x[\\dA-Fa-f]{2}|U[\\dA-Fa-f]{8})|&[a-zA-Z\\d]{2,};",t={
className:"number",begin:"\\b"+d+"(L|u|U|Lu|LU|uL|UL)?",relevance:0},_={
className:"number",
begin:"\\b(((0[xX](([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)\\.([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*)|\\.?([\\da-fA-F][\\da-fA-F_]*|_[\\da-fA-F][\\da-fA-F_]*))[pP][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))|((0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)(\\.\\d*|([eE][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)))|\\d+\\.(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d)|\\.(0|[1-9][\\d_]*)([eE][+-]?(0|[1-9][\\d_]*|\\d[\\d_]*|[\\d_]+?\\d))?))([fF]|L|i|[fF]i|Li)?|"+d+"(i|[fF]i|Li))",
relevance:0},r={className:"string",begin:"'("+n+"|.)",end:"'",illegal:"."},i={
className:"string",begin:'"',contains:[{begin:n,relevance:0}],end:'"[cwd]?'
},s=e.COMMENT("\\/\\+","\\+\\/",{contains:["self"],relevance:10});return{
name:"D",keywords:a,contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,s,{
className:"string",begin:'x"[\\da-fA-F\\s\\n\\r]*"[cwd]?',relevance:10},i,{
className:"string",begin:'[rq]"',end:'"[cwd]?',relevance:5},{className:"string",
begin:"`",end:"`[cwd]?"},{className:"string",begin:'q"\\{',end:'\\}"'},_,t,r,{
className:"meta",begin:"^#!",end:"$",relevance:5},{className:"meta",
begin:"#(line)",end:"$",relevance:5},{className:"keyword",
begin:"@[a-zA-Z_][a-zA-Z_\\d]*"}]}}})());hljs.registerLanguage("coffeescript",(()=>{"use strict"
;const e=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],n=["true","false","null","undefined","NaN","Infinity"],a=[].concat(["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],["arguments","this","super","console","window","document","localStorage","module","global"],["Intl","DataView","Number","Math","Date","String","RegExp","Object","Function","Boolean","Error","Symbol","Set","Map","WeakSet","WeakMap","Proxy","Reflect","JSON","Promise","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Float32Array","Array","Uint8Array","Uint8ClampedArray","ArrayBuffer"],["EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"])
;return r=>{const t={
keyword:e.concat(["then","unless","until","loop","by","when","and","or","is","isnt","not"]).filter((i=["var","const","let","function","static"],
e=>!i.includes(e))).join(" "),
literal:n.concat(["yes","no","on","off"]).join(" "),
built_in:a.concat(["npm","print"]).join(" ")};var i
;const s="[A-Za-z$_][0-9A-Za-z$_]*",o={className:"subst",begin:/#\{/,end:/\}/,
keywords:t},c=[r.BINARY_NUMBER_MODE,r.inherit(r.C_NUMBER_MODE,{starts:{
end:"(\\s*/)?",relevance:0}}),{className:"string",variants:[{begin:/'''/,
end:/'''/,contains:[r.BACKSLASH_ESCAPE]},{begin:/'/,end:/'/,
contains:[r.BACKSLASH_ESCAPE]},{begin:/"""/,end:/"""/,
contains:[r.BACKSLASH_ESCAPE,o]},{begin:/"/,end:/"/,
contains:[r.BACKSLASH_ESCAPE,o]}]},{className:"regexp",variants:[{begin:"///",
end:"///",contains:[o,r.HASH_COMMENT_MODE]},{begin:"//[gim]{0,3}(?=\\W)",
relevance:0},{begin:/\/(?![ *]).*?(?![\\]).\/[gim]{0,3}(?=\W)/}]},{begin:"@"+s
},{subLanguage:"javascript",excludeBegin:!0,excludeEnd:!0,variants:[{
begin:"```",end:"```"},{begin:"`",end:"`"}]}];o.contains=c
;const l=r.inherit(r.TITLE_MODE,{begin:s}),d="(\\(.*\\)\\s*)?\\B[-=]>",g={
className:"params",begin:"\\([^\\(]",returnBegin:!0,contains:[{begin:/\(/,
end:/\)/,keywords:t,contains:["self"].concat(c)}]};return{name:"CoffeeScript",
aliases:["coffee","cson","iced"],keywords:t,illegal:/\/\*/,
contains:c.concat([r.COMMENT("###","###"),r.HASH_COMMENT_MODE,{
className:"function",begin:"^\\s*"+s+"\\s*=\\s*"+d,end:"[-=]>",returnBegin:!0,
contains:[l,g]},{begin:/[:\(,=]\s*/,relevance:0,contains:[{className:"function",
begin:d,end:"[-=]>",returnBegin:!0,contains:[g]}]},{className:"class",
beginKeywords:"class",end:"$",illegal:/[:="\[\]]/,contains:[{
beginKeywords:"extends",endsWithParent:!0,illegal:/[:="\[\]]/,contains:[l]},l]
},{begin:s+":",end:":",returnBegin:!0,returnEnd:!0,relevance:0}])}}})());hljs.registerLanguage("c",(()=>{"use strict";function e(e){
return((...e)=>e.map((e=>(e=>e?"string"==typeof e?e:e.source:null)(e))).join(""))("(",e,")?")
}return t=>{const n=(t=>{const n=t.COMMENT("//","$",{contains:[{begin:/\\\n/}]
}),r="[a-zA-Z_]\\w*::",a="(decltype\\(auto\\)|"+e(r)+"[a-zA-Z_]\\w*"+e("<[^<>]+>")+")",s={
className:"keyword",begin:"\\b[a-z\\d_]*_t\\b"},i={className:"string",
variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",
contains:[t.BACKSLASH_ESCAPE]},{
begin:"(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
end:"'",illegal:"."},t.END_SAME_AS_BEGIN({
begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},o={
className:"number",variants:[{begin:"\\b(0b[01']+)"},{
begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{
begin:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
}],relevance:0},c={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{
"meta-keyword":"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
},contains:[{begin:/\\\n/,relevance:0},t.inherit(i,{className:"meta-string"}),{
className:"meta-string",begin:/<.*?>/,end:/$/,illegal:"\\n"
},n,t.C_BLOCK_COMMENT_MODE]},l={className:"title",begin:e(r)+t.IDENT_RE,
relevance:0},d=e(r)+t.IDENT_RE+"\\s*\\(",u={
keyword:"int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
literal:"true false nullptr NULL"},m=[c,s,n,t.C_BLOCK_COMMENT_MODE,o,i],p={
variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{
beginKeywords:"new throw return else",end:/;/}],keywords:u,contains:m.concat([{
begin:/\(/,end:/\)/,keywords:u,contains:m.concat(["self"]),relevance:0}]),
relevance:0},_={className:"function",begin:"("+a+"[\\*&\\s]+)+"+d,
returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:u,illegal:/[^\w\s\*&:<>]/,
contains:[{begin:"decltype\\(auto\\)",keywords:u,relevance:0},{begin:d,
returnBegin:!0,contains:[l],relevance:0},{className:"params",begin:/\(/,
end:/\)/,keywords:u,relevance:0,contains:[n,t.C_BLOCK_COMMENT_MODE,i,o,s,{
begin:/\(/,end:/\)/,keywords:u,relevance:0,
contains:["self",n,t.C_BLOCK_COMMENT_MODE,i,o,s]}]
},s,n,t.C_BLOCK_COMMENT_MODE,c]};return{
aliases:["c","cc","h","c++","h++","hpp","hh","hxx","cxx"],keywords:u,
disableAutodetect:!0,illegal:"</",contains:[].concat(p,_,m,[c,{
begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
end:">",keywords:u,contains:["self",s]},{begin:t.IDENT_RE+"::",keywords:u},{
className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,
contains:[{beginKeywords:"final class struct"},t.TITLE_MODE]}]),exports:{
preprocessor:c,strings:i,keywords:u}}})(t)
;return n.name="C",n.aliases=["c","h"],n}})());hljs.registerLanguage("pgsql",(()=>{"use strict";return E=>{
const T=E.COMMENT("--","$"),N="\\$([a-zA-Z_]?|[a-zA-Z_][a-zA-Z_0-9]*)\\$",A="BIGINT INT8 BIGSERIAL SERIAL8 BIT VARYING VARBIT BOOLEAN BOOL BOX BYTEA CHARACTER CHAR VARCHAR CIDR CIRCLE DATE DOUBLE PRECISION FLOAT8 FLOAT INET INTEGER INT INT4 INTERVAL JSON JSONB LINE LSEG|10 MACADDR MACADDR8 MONEY NUMERIC DEC DECIMAL PATH POINT POLYGON REAL FLOAT4 SMALLINT INT2 SMALLSERIAL|10 SERIAL2|10 SERIAL|10 SERIAL4|10 TEXT TIME ZONE TIMETZ|10 TIMESTAMP TIMESTAMPTZ|10 TSQUERY|10 TSVECTOR|10 TXID_SNAPSHOT|10 UUID XML NATIONAL NCHAR INT4RANGE|10 INT8RANGE|10 NUMRANGE|10 TSRANGE|10 TSTZRANGE|10 DATERANGE|10 ANYELEMENT ANYARRAY ANYNONARRAY ANYENUM ANYRANGE CSTRING INTERNAL RECORD PG_DDL_COMMAND VOID UNKNOWN OPAQUE REFCURSOR NAME OID REGPROC|10 REGPROCEDURE|10 REGOPER|10 REGOPERATOR|10 REGCLASS|10 REGTYPE|10 REGROLE|10 REGNAMESPACE|10 REGCONFIG|10 REGDICTIONARY|10 ",R=A.trim().split(" ").map((E=>E.split("|")[0])).join("|"),I="ARRAY_AGG AVG BIT_AND BIT_OR BOOL_AND BOOL_OR COUNT EVERY JSON_AGG JSONB_AGG JSON_OBJECT_AGG JSONB_OBJECT_AGG MAX MIN MODE STRING_AGG SUM XMLAGG CORR COVAR_POP COVAR_SAMP REGR_AVGX REGR_AVGY REGR_COUNT REGR_INTERCEPT REGR_R2 REGR_SLOPE REGR_SXX REGR_SXY REGR_SYY STDDEV STDDEV_POP STDDEV_SAMP VARIANCE VAR_POP VAR_SAMP PERCENTILE_CONT PERCENTILE_DISC ROW_NUMBER RANK DENSE_RANK PERCENT_RANK CUME_DIST NTILE LAG LEAD FIRST_VALUE LAST_VALUE NTH_VALUE NUM_NONNULLS NUM_NULLS ABS CBRT CEIL CEILING DEGREES DIV EXP FLOOR LN LOG MOD PI POWER RADIANS ROUND SCALE SIGN SQRT TRUNC WIDTH_BUCKET RANDOM SETSEED ACOS ACOSD ASIN ASIND ATAN ATAND ATAN2 ATAN2D COS COSD COT COTD SIN SIND TAN TAND BIT_LENGTH CHAR_LENGTH CHARACTER_LENGTH LOWER OCTET_LENGTH OVERLAY POSITION SUBSTRING TREAT TRIM UPPER ASCII BTRIM CHR CONCAT CONCAT_WS CONVERT CONVERT_FROM CONVERT_TO DECODE ENCODE INITCAP LEFT LENGTH LPAD LTRIM MD5 PARSE_IDENT PG_CLIENT_ENCODING QUOTE_IDENT|10 QUOTE_LITERAL|10 QUOTE_NULLABLE|10 REGEXP_MATCH REGEXP_MATCHES REGEXP_REPLACE REGEXP_SPLIT_TO_ARRAY REGEXP_SPLIT_TO_TABLE REPEAT REPLACE REVERSE RIGHT RPAD RTRIM SPLIT_PART STRPOS SUBSTR TO_ASCII TO_HEX TRANSLATE OCTET_LENGTH GET_BIT GET_BYTE SET_BIT SET_BYTE TO_CHAR TO_DATE TO_NUMBER TO_TIMESTAMP AGE CLOCK_TIMESTAMP|10 DATE_PART DATE_TRUNC ISFINITE JUSTIFY_DAYS JUSTIFY_HOURS JUSTIFY_INTERVAL MAKE_DATE MAKE_INTERVAL|10 MAKE_TIME MAKE_TIMESTAMP|10 MAKE_TIMESTAMPTZ|10 NOW STATEMENT_TIMESTAMP|10 TIMEOFDAY TRANSACTION_TIMESTAMP|10 ENUM_FIRST ENUM_LAST ENUM_RANGE AREA CENTER DIAMETER HEIGHT ISCLOSED ISOPEN NPOINTS PCLOSE POPEN RADIUS WIDTH BOX BOUND_BOX CIRCLE LINE LSEG PATH POLYGON ABBREV BROADCAST HOST HOSTMASK MASKLEN NETMASK NETWORK SET_MASKLEN TEXT INET_SAME_FAMILY INET_MERGE MACADDR8_SET7BIT ARRAY_TO_TSVECTOR GET_CURRENT_TS_CONFIG NUMNODE PLAINTO_TSQUERY PHRASETO_TSQUERY WEBSEARCH_TO_TSQUERY QUERYTREE SETWEIGHT STRIP TO_TSQUERY TO_TSVECTOR JSON_TO_TSVECTOR JSONB_TO_TSVECTOR TS_DELETE TS_FILTER TS_HEADLINE TS_RANK TS_RANK_CD TS_REWRITE TSQUERY_PHRASE TSVECTOR_TO_ARRAY TSVECTOR_UPDATE_TRIGGER TSVECTOR_UPDATE_TRIGGER_COLUMN XMLCOMMENT XMLCONCAT XMLELEMENT XMLFOREST XMLPI XMLROOT XMLEXISTS XML_IS_WELL_FORMED XML_IS_WELL_FORMED_DOCUMENT XML_IS_WELL_FORMED_CONTENT XPATH XPATH_EXISTS XMLTABLE XMLNAMESPACES TABLE_TO_XML TABLE_TO_XMLSCHEMA TABLE_TO_XML_AND_XMLSCHEMA QUERY_TO_XML QUERY_TO_XMLSCHEMA QUERY_TO_XML_AND_XMLSCHEMA CURSOR_TO_XML CURSOR_TO_XMLSCHEMA SCHEMA_TO_XML SCHEMA_TO_XMLSCHEMA SCHEMA_TO_XML_AND_XMLSCHEMA DATABASE_TO_XML DATABASE_TO_XMLSCHEMA DATABASE_TO_XML_AND_XMLSCHEMA XMLATTRIBUTES TO_JSON TO_JSONB ARRAY_TO_JSON ROW_TO_JSON JSON_BUILD_ARRAY JSONB_BUILD_ARRAY JSON_BUILD_OBJECT JSONB_BUILD_OBJECT JSON_OBJECT JSONB_OBJECT JSON_ARRAY_LENGTH JSONB_ARRAY_LENGTH JSON_EACH JSONB_EACH JSON_EACH_TEXT JSONB_EACH_TEXT JSON_EXTRACT_PATH JSONB_EXTRACT_PATH JSON_OBJECT_KEYS JSONB_OBJECT_KEYS JSON_POPULATE_RECORD JSONB_POPULATE_RECORD JSON_POPULATE_RECORDSET JSONB_POPULATE_RECORDSET JSON_ARRAY_ELEMENTS JSONB_ARRAY_ELEMENTS JSON_ARRAY_ELEMENTS_TEXT JSONB_ARRAY_ELEMENTS_TEXT JSON_TYPEOF JSONB_TYPEOF JSON_TO_RECORD JSONB_TO_RECORD JSON_TO_RECORDSET JSONB_TO_RECORDSET JSON_STRIP_NULLS JSONB_STRIP_NULLS JSONB_SET JSONB_INSERT JSONB_PRETTY CURRVAL LASTVAL NEXTVAL SETVAL COALESCE NULLIF GREATEST LEAST ARRAY_APPEND ARRAY_CAT ARRAY_NDIMS ARRAY_DIMS ARRAY_FILL ARRAY_LENGTH ARRAY_LOWER ARRAY_POSITION ARRAY_POSITIONS ARRAY_PREPEND ARRAY_REMOVE ARRAY_REPLACE ARRAY_TO_STRING ARRAY_UPPER CARDINALITY STRING_TO_ARRAY UNNEST ISEMPTY LOWER_INC UPPER_INC LOWER_INF UPPER_INF RANGE_MERGE GENERATE_SERIES GENERATE_SUBSCRIPTS CURRENT_DATABASE CURRENT_QUERY CURRENT_SCHEMA|10 CURRENT_SCHEMAS|10 INET_CLIENT_ADDR INET_CLIENT_PORT INET_SERVER_ADDR INET_SERVER_PORT ROW_SECURITY_ACTIVE FORMAT_TYPE TO_REGCLASS TO_REGPROC TO_REGPROCEDURE TO_REGOPER TO_REGOPERATOR TO_REGTYPE TO_REGNAMESPACE TO_REGROLE COL_DESCRIPTION OBJ_DESCRIPTION SHOBJ_DESCRIPTION TXID_CURRENT TXID_CURRENT_IF_ASSIGNED TXID_CURRENT_SNAPSHOT TXID_SNAPSHOT_XIP TXID_SNAPSHOT_XMAX TXID_SNAPSHOT_XMIN TXID_VISIBLE_IN_SNAPSHOT TXID_STATUS CURRENT_SETTING SET_CONFIG BRIN_SUMMARIZE_NEW_VALUES BRIN_SUMMARIZE_RANGE BRIN_DESUMMARIZE_RANGE GIN_CLEAN_PENDING_LIST SUPPRESS_REDUNDANT_UPDATES_TRIGGER LO_FROM_BYTEA LO_PUT LO_GET LO_CREAT LO_CREATE LO_UNLINK LO_IMPORT LO_EXPORT LOREAD LOWRITE GROUPING CAST".split(" ").map((E=>E.split("|")[0])).join("|")
;return{name:"PostgreSQL",aliases:["postgres","postgresql"],case_insensitive:!0,
keywords:{
keyword:"ABORT ALTER ANALYZE BEGIN CALL CHECKPOINT|10 CLOSE CLUSTER COMMENT COMMIT COPY CREATE DEALLOCATE DECLARE DELETE DISCARD DO DROP END EXECUTE EXPLAIN FETCH GRANT IMPORT INSERT LISTEN LOAD LOCK MOVE NOTIFY PREPARE REASSIGN|10 REFRESH REINDEX RELEASE RESET REVOKE ROLLBACK SAVEPOINT SECURITY SELECT SET SHOW START TRUNCATE UNLISTEN|10 UPDATE VACUUM|10 VALUES AGGREGATE COLLATION CONVERSION|10 DATABASE DEFAULT PRIVILEGES DOMAIN TRIGGER EXTENSION FOREIGN WRAPPER|10 TABLE FUNCTION GROUP LANGUAGE LARGE OBJECT MATERIALIZED VIEW OPERATOR CLASS FAMILY POLICY PUBLICATION|10 ROLE RULE SCHEMA SEQUENCE SERVER STATISTICS SUBSCRIPTION SYSTEM TABLESPACE CONFIGURATION DICTIONARY PARSER TEMPLATE TYPE USER MAPPING PREPARED ACCESS METHOD CAST AS TRANSFORM TRANSACTION OWNED TO INTO SESSION AUTHORIZATION INDEX PROCEDURE ASSERTION ALL ANALYSE AND ANY ARRAY ASC ASYMMETRIC|10 BOTH CASE CHECK COLLATE COLUMN CONCURRENTLY|10 CONSTRAINT CROSS DEFERRABLE RANGE DESC DISTINCT ELSE EXCEPT FOR FREEZE|10 FROM FULL HAVING ILIKE IN INITIALLY INNER INTERSECT IS ISNULL JOIN LATERAL LEADING LIKE LIMIT NATURAL NOT NOTNULL NULL OFFSET ON ONLY OR ORDER OUTER OVERLAPS PLACING PRIMARY REFERENCES RETURNING SIMILAR SOME SYMMETRIC TABLESAMPLE THEN TRAILING UNION UNIQUE USING VARIADIC|10 VERBOSE WHEN WHERE WINDOW WITH BY RETURNS INOUT OUT SETOF|10 IF STRICT CURRENT CONTINUE OWNER LOCATION OVER PARTITION WITHIN BETWEEN ESCAPE EXTERNAL INVOKER DEFINER WORK RENAME VERSION CONNECTION CONNECT TABLES TEMP TEMPORARY FUNCTIONS SEQUENCES TYPES SCHEMAS OPTION CASCADE RESTRICT ADD ADMIN EXISTS VALID VALIDATE ENABLE DISABLE REPLICA|10 ALWAYS PASSING COLUMNS PATH REF VALUE OVERRIDING IMMUTABLE STABLE VOLATILE BEFORE AFTER EACH ROW PROCEDURAL ROUTINE NO HANDLER VALIDATOR OPTIONS STORAGE OIDS|10 WITHOUT INHERIT DEPENDS CALLED INPUT LEAKPROOF|10 COST ROWS NOWAIT SEARCH UNTIL ENCRYPTED|10 PASSWORD CONFLICT|10 INSTEAD INHERITS CHARACTERISTICS WRITE CURSOR ALSO STATEMENT SHARE EXCLUSIVE INLINE ISOLATION REPEATABLE READ COMMITTED SERIALIZABLE UNCOMMITTED LOCAL GLOBAL SQL PROCEDURES RECURSIVE SNAPSHOT ROLLUP CUBE TRUSTED|10 INCLUDE FOLLOWING PRECEDING UNBOUNDED RANGE GROUPS UNENCRYPTED|10 SYSID FORMAT DELIMITER HEADER QUOTE ENCODING FILTER OFF FORCE_QUOTE FORCE_NOT_NULL FORCE_NULL COSTS BUFFERS TIMING SUMMARY DISABLE_PAGE_SKIPPING RESTART CYCLE GENERATED IDENTITY DEFERRED IMMEDIATE LEVEL LOGGED UNLOGGED OF NOTHING NONE EXCLUDE ATTRIBUTE USAGE ROUTINES TRUE FALSE NAN INFINITY ALIAS BEGIN CONSTANT DECLARE END EXCEPTION RETURN PERFORM|10 RAISE GET DIAGNOSTICS STACKED|10 FOREACH LOOP ELSIF EXIT WHILE REVERSE SLICE DEBUG LOG INFO NOTICE WARNING ASSERT OPEN SUPERUSER NOSUPERUSER CREATEDB NOCREATEDB CREATEROLE NOCREATEROLE INHERIT NOINHERIT LOGIN NOLOGIN REPLICATION NOREPLICATION BYPASSRLS NOBYPASSRLS ",
built_in:"CURRENT_TIME CURRENT_TIMESTAMP CURRENT_USER CURRENT_CATALOG|10 CURRENT_DATE LOCALTIME LOCALTIMESTAMP CURRENT_ROLE|10 CURRENT_SCHEMA|10 SESSION_USER PUBLIC FOUND NEW OLD TG_NAME|10 TG_WHEN|10 TG_LEVEL|10 TG_OP|10 TG_RELID|10 TG_RELNAME|10 TG_TABLE_NAME|10 TG_TABLE_SCHEMA|10 TG_NARGS|10 TG_ARGV|10 TG_EVENT|10 TG_TAG|10 ROW_COUNT RESULT_OID|10 PG_CONTEXT|10 RETURNED_SQLSTATE COLUMN_NAME CONSTRAINT_NAME PG_DATATYPE_NAME|10 MESSAGE_TEXT TABLE_NAME SCHEMA_NAME PG_EXCEPTION_DETAIL|10 PG_EXCEPTION_HINT|10 PG_EXCEPTION_CONTEXT|10 SQLSTATE SQLERRM|10 SUCCESSFUL_COMPLETION WARNING DYNAMIC_RESULT_SETS_RETURNED IMPLICIT_ZERO_BIT_PADDING NULL_VALUE_ELIMINATED_IN_SET_FUNCTION PRIVILEGE_NOT_GRANTED PRIVILEGE_NOT_REVOKED STRING_DATA_RIGHT_TRUNCATION DEPRECATED_FEATURE NO_DATA NO_ADDITIONAL_DYNAMIC_RESULT_SETS_RETURNED SQL_STATEMENT_NOT_YET_COMPLETE CONNECTION_EXCEPTION CONNECTION_DOES_NOT_EXIST CONNECTION_FAILURE SQLCLIENT_UNABLE_TO_ESTABLISH_SQLCONNECTION SQLSERVER_REJECTED_ESTABLISHMENT_OF_SQLCONNECTION TRANSACTION_RESOLUTION_UNKNOWN PROTOCOL_VIOLATION TRIGGERED_ACTION_EXCEPTION FEATURE_NOT_SUPPORTED INVALID_TRANSACTION_INITIATION LOCATOR_EXCEPTION INVALID_LOCATOR_SPECIFICATION INVALID_GRANTOR INVALID_GRANT_OPERATION INVALID_ROLE_SPECIFICATION DIAGNOSTICS_EXCEPTION STACKED_DIAGNOSTICS_ACCESSED_WITHOUT_ACTIVE_HANDLER CASE_NOT_FOUND CARDINALITY_VIOLATION DATA_EXCEPTION ARRAY_SUBSCRIPT_ERROR CHARACTER_NOT_IN_REPERTOIRE DATETIME_FIELD_OVERFLOW DIVISION_BY_ZERO ERROR_IN_ASSIGNMENT ESCAPE_CHARACTER_CONFLICT INDICATOR_OVERFLOW INTERVAL_FIELD_OVERFLOW INVALID_ARGUMENT_FOR_LOGARITHM INVALID_ARGUMENT_FOR_NTILE_FUNCTION INVALID_ARGUMENT_FOR_NTH_VALUE_FUNCTION INVALID_ARGUMENT_FOR_POWER_FUNCTION INVALID_ARGUMENT_FOR_WIDTH_BUCKET_FUNCTION INVALID_CHARACTER_VALUE_FOR_CAST INVALID_DATETIME_FORMAT INVALID_ESCAPE_CHARACTER INVALID_ESCAPE_OCTET INVALID_ESCAPE_SEQUENCE NONSTANDARD_USE_OF_ESCAPE_CHARACTER INVALID_INDICATOR_PARAMETER_VALUE INVALID_PARAMETER_VALUE INVALID_REGULAR_EXPRESSION INVALID_ROW_COUNT_IN_LIMIT_CLAUSE INVALID_ROW_COUNT_IN_RESULT_OFFSET_CLAUSE INVALID_TABLESAMPLE_ARGUMENT INVALID_TABLESAMPLE_REPEAT INVALID_TIME_ZONE_DISPLACEMENT_VALUE INVALID_USE_OF_ESCAPE_CHARACTER MOST_SPECIFIC_TYPE_MISMATCH NULL_VALUE_NOT_ALLOWED NULL_VALUE_NO_INDICATOR_PARAMETER NUMERIC_VALUE_OUT_OF_RANGE SEQUENCE_GENERATOR_LIMIT_EXCEEDED STRING_DATA_LENGTH_MISMATCH STRING_DATA_RIGHT_TRUNCATION SUBSTRING_ERROR TRIM_ERROR UNTERMINATED_C_STRING ZERO_LENGTH_CHARACTER_STRING FLOATING_POINT_EXCEPTION INVALID_TEXT_REPRESENTATION INVALID_BINARY_REPRESENTATION BAD_COPY_FILE_FORMAT UNTRANSLATABLE_CHARACTER NOT_AN_XML_DOCUMENT INVALID_XML_DOCUMENT INVALID_XML_CONTENT INVALID_XML_COMMENT INVALID_XML_PROCESSING_INSTRUCTION INTEGRITY_CONSTRAINT_VIOLATION RESTRICT_VIOLATION NOT_NULL_VIOLATION FOREIGN_KEY_VIOLATION UNIQUE_VIOLATION CHECK_VIOLATION EXCLUSION_VIOLATION INVALID_CURSOR_STATE INVALID_TRANSACTION_STATE ACTIVE_SQL_TRANSACTION BRANCH_TRANSACTION_ALREADY_ACTIVE HELD_CURSOR_REQUIRES_SAME_ISOLATION_LEVEL INAPPROPRIATE_ACCESS_MODE_FOR_BRANCH_TRANSACTION INAPPROPRIATE_ISOLATION_LEVEL_FOR_BRANCH_TRANSACTION NO_ACTIVE_SQL_TRANSACTION_FOR_BRANCH_TRANSACTION READ_ONLY_SQL_TRANSACTION SCHEMA_AND_DATA_STATEMENT_MIXING_NOT_SUPPORTED NO_ACTIVE_SQL_TRANSACTION IN_FAILED_SQL_TRANSACTION IDLE_IN_TRANSACTION_SESSION_TIMEOUT INVALID_SQL_STATEMENT_NAME TRIGGERED_DATA_CHANGE_VIOLATION INVALID_AUTHORIZATION_SPECIFICATION INVALID_PASSWORD DEPENDENT_PRIVILEGE_DESCRIPTORS_STILL_EXIST DEPENDENT_OBJECTS_STILL_EXIST INVALID_TRANSACTION_TERMINATION SQL_ROUTINE_EXCEPTION FUNCTION_EXECUTED_NO_RETURN_STATEMENT MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED INVALID_CURSOR_NAME EXTERNAL_ROUTINE_EXCEPTION CONTAINING_SQL_NOT_PERMITTED MODIFYING_SQL_DATA_NOT_PERMITTED PROHIBITED_SQL_STATEMENT_ATTEMPTED READING_SQL_DATA_NOT_PERMITTED EXTERNAL_ROUTINE_INVOCATION_EXCEPTION INVALID_SQLSTATE_RETURNED NULL_VALUE_NOT_ALLOWED TRIGGER_PROTOCOL_VIOLATED SRF_PROTOCOL_VIOLATED EVENT_TRIGGER_PROTOCOL_VIOLATED SAVEPOINT_EXCEPTION INVALID_SAVEPOINT_SPECIFICATION INVALID_CATALOG_NAME INVALID_SCHEMA_NAME TRANSACTION_ROLLBACK TRANSACTION_INTEGRITY_CONSTRAINT_VIOLATION SERIALIZATION_FAILURE STATEMENT_COMPLETION_UNKNOWN DEADLOCK_DETECTED SYNTAX_ERROR_OR_ACCESS_RULE_VIOLATION SYNTAX_ERROR INSUFFICIENT_PRIVILEGE CANNOT_COERCE GROUPING_ERROR WINDOWING_ERROR INVALID_RECURSION INVALID_FOREIGN_KEY INVALID_NAME NAME_TOO_LONG RESERVED_NAME DATATYPE_MISMATCH INDETERMINATE_DATATYPE COLLATION_MISMATCH INDETERMINATE_COLLATION WRONG_OBJECT_TYPE GENERATED_ALWAYS UNDEFINED_COLUMN UNDEFINED_FUNCTION UNDEFINED_TABLE UNDEFINED_PARAMETER UNDEFINED_OBJECT DUPLICATE_COLUMN DUPLICATE_CURSOR DUPLICATE_DATABASE DUPLICATE_FUNCTION DUPLICATE_PREPARED_STATEMENT DUPLICATE_SCHEMA DUPLICATE_TABLE DUPLICATE_ALIAS DUPLICATE_OBJECT AMBIGUOUS_COLUMN AMBIGUOUS_FUNCTION AMBIGUOUS_PARAMETER AMBIGUOUS_ALIAS INVALID_COLUMN_REFERENCE INVALID_COLUMN_DEFINITION INVALID_CURSOR_DEFINITION INVALID_DATABASE_DEFINITION INVALID_FUNCTION_DEFINITION INVALID_PREPARED_STATEMENT_DEFINITION INVALID_SCHEMA_DEFINITION INVALID_TABLE_DEFINITION INVALID_OBJECT_DEFINITION WITH_CHECK_OPTION_VIOLATION INSUFFICIENT_RESOURCES DISK_FULL OUT_OF_MEMORY TOO_MANY_CONNECTIONS CONFIGURATION_LIMIT_EXCEEDED PROGRAM_LIMIT_EXCEEDED STATEMENT_TOO_COMPLEX TOO_MANY_COLUMNS TOO_MANY_ARGUMENTS OBJECT_NOT_IN_PREREQUISITE_STATE OBJECT_IN_USE CANT_CHANGE_RUNTIME_PARAM LOCK_NOT_AVAILABLE OPERATOR_INTERVENTION QUERY_CANCELED ADMIN_SHUTDOWN CRASH_SHUTDOWN CANNOT_CONNECT_NOW DATABASE_DROPPED SYSTEM_ERROR IO_ERROR UNDEFINED_FILE DUPLICATE_FILE SNAPSHOT_TOO_OLD CONFIG_FILE_ERROR LOCK_FILE_EXISTS FDW_ERROR FDW_COLUMN_NAME_NOT_FOUND FDW_DYNAMIC_PARAMETER_VALUE_NEEDED FDW_FUNCTION_SEQUENCE_ERROR FDW_INCONSISTENT_DESCRIPTOR_INFORMATION FDW_INVALID_ATTRIBUTE_VALUE FDW_INVALID_COLUMN_NAME FDW_INVALID_COLUMN_NUMBER FDW_INVALID_DATA_TYPE FDW_INVALID_DATA_TYPE_DESCRIPTORS FDW_INVALID_DESCRIPTOR_FIELD_IDENTIFIER FDW_INVALID_HANDLE FDW_INVALID_OPTION_INDEX FDW_INVALID_OPTION_NAME FDW_INVALID_STRING_LENGTH_OR_BUFFER_LENGTH FDW_INVALID_STRING_FORMAT FDW_INVALID_USE_OF_NULL_POINTER FDW_TOO_MANY_HANDLES FDW_OUT_OF_MEMORY FDW_NO_SCHEMAS FDW_OPTION_NAME_NOT_FOUND FDW_REPLY_HANDLE FDW_SCHEMA_NOT_FOUND FDW_TABLE_NOT_FOUND FDW_UNABLE_TO_CREATE_EXECUTION FDW_UNABLE_TO_CREATE_REPLY FDW_UNABLE_TO_ESTABLISH_CONNECTION PLPGSQL_ERROR RAISE_EXCEPTION NO_DATA_FOUND TOO_MANY_ROWS ASSERT_FAILURE INTERNAL_ERROR DATA_CORRUPTED INDEX_CORRUPTED "
},illegal:/:==|\W\s*\(\*|(^|\s)\$[a-z]|\{\{|[a-z]:\s*$|\.\.\.|TO:|DO:/,
contains:[{className:"keyword",variants:[{begin:/\bTEXT\s*SEARCH\b/},{
begin:/\b(PRIMARY|FOREIGN|FOR(\s+NO)?)\s+KEY\b/},{
begin:/\bPARALLEL\s+(UNSAFE|RESTRICTED|SAFE)\b/},{
begin:/\bSTORAGE\s+(PLAIN|EXTERNAL|EXTENDED|MAIN)\b/},{
begin:/\bMATCH\s+(FULL|PARTIAL|SIMPLE)\b/},{begin:/\bNULLS\s+(FIRST|LAST)\b/},{
begin:/\bEVENT\s+TRIGGER\b/},{begin:/\b(MAPPING|OR)\s+REPLACE\b/},{
begin:/\b(FROM|TO)\s+(PROGRAM|STDIN|STDOUT)\b/},{
begin:/\b(SHARE|EXCLUSIVE)\s+MODE\b/},{
begin:/\b(LEFT|RIGHT)\s+(OUTER\s+)?JOIN\b/},{
begin:/\b(FETCH|MOVE)\s+(NEXT|PRIOR|FIRST|LAST|ABSOLUTE|RELATIVE|FORWARD|BACKWARD)\b/
},{begin:/\bPRESERVE\s+ROWS\b/},{begin:/\bDISCARD\s+PLANS\b/},{
begin:/\bREFERENCING\s+(OLD|NEW)\b/},{begin:/\bSKIP\s+LOCKED\b/},{
begin:/\bGROUPING\s+SETS\b/},{
begin:/\b(BINARY|INSENSITIVE|SCROLL|NO\s+SCROLL)\s+(CURSOR|FOR)\b/},{
begin:/\b(WITH|WITHOUT)\s+HOLD\b/},{
begin:/\bWITH\s+(CASCADED|LOCAL)\s+CHECK\s+OPTION\b/},{
begin:/\bEXCLUDE\s+(TIES|NO\s+OTHERS)\b/},{
begin:/\bFORMAT\s+(TEXT|XML|JSON|YAML)\b/},{
begin:/\bSET\s+((SESSION|LOCAL)\s+)?NAMES\b/},{begin:/\bIS\s+(NOT\s+)?UNKNOWN\b/
},{begin:/\bSECURITY\s+LABEL\b/},{begin:/\bSTANDALONE\s+(YES|NO|NO\s+VALUE)\b/
},{begin:/\bWITH\s+(NO\s+)?DATA\b/},{begin:/\b(FOREIGN|SET)\s+DATA\b/},{
begin:/\bSET\s+(CATALOG|CONSTRAINTS)\b/},{begin:/\b(WITH|FOR)\s+ORDINALITY\b/},{
begin:/\bIS\s+(NOT\s+)?DOCUMENT\b/},{
begin:/\bXML\s+OPTION\s+(DOCUMENT|CONTENT)\b/},{
begin:/\b(STRIP|PRESERVE)\s+WHITESPACE\b/},{
begin:/\bNO\s+(ACTION|MAXVALUE|MINVALUE)\b/},{
begin:/\bPARTITION\s+BY\s+(RANGE|LIST|HASH)\b/},{begin:/\bAT\s+TIME\s+ZONE\b/},{
begin:/\bGRANTED\s+BY\b/},{begin:/\bRETURN\s+(QUERY|NEXT)\b/},{
begin:/\b(ATTACH|DETACH)\s+PARTITION\b/},{
begin:/\bFORCE\s+ROW\s+LEVEL\s+SECURITY\b/},{
begin:/\b(INCLUDING|EXCLUDING)\s+(COMMENTS|CONSTRAINTS|DEFAULTS|IDENTITY|INDEXES|STATISTICS|STORAGE|ALL)\b/
},{begin:/\bAS\s+(ASSIGNMENT|IMPLICIT|PERMISSIVE|RESTRICTIVE|ENUM|RANGE)\b/}]},{
begin:/\b(FORMAT|FAMILY|VERSION)\s*\(/},{begin:/\bINCLUDE\s*\(/,
keywords:"INCLUDE"},{begin:/\bRANGE(?!\s*(BETWEEN|UNBOUNDED|CURRENT|[-0-9]+))/
},{
begin:/\b(VERSION|OWNER|TEMPLATE|TABLESPACE|CONNECTION\s+LIMIT|PROCEDURE|RESTRICT|JOIN|PARSER|COPY|START|END|COLLATION|INPUT|ANALYZE|STORAGE|LIKE|DEFAULT|DELIMITER|ENCODING|COLUMN|CONSTRAINT|TABLE|SCHEMA)\s*=/
},{begin:/\b(PG_\w+?|HAS_[A-Z_]+_PRIVILEGE)\b/,relevance:10},{
begin:/\bEXTRACT\s*\(/,end:/\bFROM\b/,returnEnd:!0,keywords:{
type:"CENTURY DAY DECADE DOW DOY EPOCH HOUR ISODOW ISOYEAR MICROSECONDS MILLENNIUM MILLISECONDS MINUTE MONTH QUARTER SECOND TIMEZONE TIMEZONE_HOUR TIMEZONE_MINUTE WEEK YEAR"
}},{begin:/\b(XMLELEMENT|XMLPI)\s*\(\s*NAME/,keywords:{keyword:"NAME"}},{
begin:/\b(XMLPARSE|XMLSERIALIZE)\s*\(\s*(DOCUMENT|CONTENT)/,keywords:{
keyword:"DOCUMENT CONTENT"}},{beginKeywords:"CACHE INCREMENT MAXVALUE MINVALUE",
end:E.C_NUMBER_RE,returnEnd:!0,keywords:"BY CACHE INCREMENT MAXVALUE MINVALUE"
},{className:"type",begin:/\b(WITH|WITHOUT)\s+TIME\s+ZONE\b/},{className:"type",
begin:/\bINTERVAL\s+(YEAR|MONTH|DAY|HOUR|MINUTE|SECOND)(\s+TO\s+(MONTH|HOUR|MINUTE|SECOND))?\b/
},{
begin:/\bRETURNS\s+(LANGUAGE_HANDLER|TRIGGER|EVENT_TRIGGER|FDW_HANDLER|INDEX_AM_HANDLER|TSM_HANDLER)\b/,
keywords:{keyword:"RETURNS",
type:"LANGUAGE_HANDLER TRIGGER EVENT_TRIGGER FDW_HANDLER INDEX_AM_HANDLER TSM_HANDLER"
}},{begin:"\\b("+I+")\\s*\\("},{begin:"\\.("+R+")\\b"},{
begin:"\\b("+R+")\\s+PATH\\b",keywords:{keyword:"PATH",
type:A.replace("PATH ","")}},{className:"type",begin:"\\b("+R+")\\b"},{
className:"string",begin:"'",end:"'",contains:[{begin:"''"}]},{
className:"string",begin:"(e|E|u&|U&)'",end:"'",contains:[{begin:"\\\\."}],
relevance:10},E.END_SAME_AS_BEGIN({begin:N,end:N,contains:[{
subLanguage:["pgsql","perl","python","tcl","r","lua","java","php","ruby","bash","scheme","xml","json"],
endsWithParent:!0}]}),{begin:'"',end:'"',contains:[{begin:'""'}]
},E.C_NUMBER_MODE,E.C_BLOCK_COMMENT_MODE,T,{className:"meta",variants:[{
begin:"%(ROW)?TYPE",relevance:10},{begin:"\\$\\d+"},{begin:"^#\\w",end:"$"}]},{
className:"symbol",begin:"<<\\s*[a-zA-Z_][a-zA-Z_0-9$]*\\s*>>",relevance:10}]}}
})());hljs.registerLanguage("cmake",(()=>{"use strict";return e=>({name:"CMake",
aliases:["cmake.in"],case_insensitive:!0,keywords:{
keyword:"break cmake_host_system_information cmake_minimum_required cmake_parse_arguments cmake_policy configure_file continue elseif else endforeach endfunction endif endmacro endwhile execute_process file find_file find_library find_package find_path find_program foreach function get_cmake_property get_directory_property get_filename_component get_property if include include_guard list macro mark_as_advanced math message option return separate_arguments set_directory_properties set_property set site_name string unset variable_watch while add_compile_definitions add_compile_options add_custom_command add_custom_target add_definitions add_dependencies add_executable add_library add_link_options add_subdirectory add_test aux_source_directory build_command create_test_sourcelist define_property enable_language enable_testing export fltk_wrap_ui get_source_file_property get_target_property get_test_property include_directories include_external_msproject include_regular_expression install link_directories link_libraries load_cache project qt_wrap_cpp qt_wrap_ui remove_definitions set_source_files_properties set_target_properties set_tests_properties source_group target_compile_definitions target_compile_features target_compile_options target_include_directories target_link_directories target_link_libraries target_link_options target_sources try_compile try_run ctest_build ctest_configure ctest_coverage ctest_empty_binary_directory ctest_memcheck ctest_read_custom_files ctest_run_script ctest_sleep ctest_start ctest_submit ctest_test ctest_update ctest_upload build_name exec_program export_library_dependencies install_files install_programs install_targets load_command make_directory output_required_files remove subdir_depends subdirs use_mangled_mesa utility_source variable_requires write_file qt5_use_modules qt5_use_package qt5_wrap_cpp on off true false and or not command policy target test exists is_newer_than is_directory is_symlink is_absolute matches less greater equal less_equal greater_equal strless strgreater strequal strless_equal strgreater_equal version_less version_greater version_equal version_less_equal version_greater_equal in_list defined"
},contains:[{className:"variable",begin:/\$\{/,end:/\}/
},e.HASH_COMMENT_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE]})})());hljs.registerLanguage("scss",(()=>{"use strict";return e=>{var t="@[a-z-]+",i={
className:"variable",begin:"(\\$[a-zA-Z-][a-zA-Z0-9_-]*)\\b"},r={
className:"number",begin:"#[0-9A-Fa-f]+"}
;return e.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,
e.APOS_STRING_MODE,e.C_BLOCK_COMMENT_MODE,{name:"SCSS",case_insensitive:!0,
illegal:"[=/|']",contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{
className:"selector-id",begin:"#[A-Za-z0-9_-]+",relevance:0},{
className:"selector-class",begin:"\\.[A-Za-z0-9_-]+",relevance:0},{
className:"selector-attr",begin:"\\[",end:"\\]",illegal:"$"},{
className:"selector-tag",
begin:"\\b(a|abbr|acronym|address|area|article|aside|audio|b|base|big|blockquote|body|br|button|canvas|caption|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|div|dl|dt|em|embed|fieldset|figcaption|figure|footer|form|frame|frameset|(h[1-6])|head|header|hgroup|hr|html|i|iframe|img|input|ins|kbd|keygen|label|legend|li|link|map|mark|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|samp|script|section|select|small|span|strike|strong|style|sub|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|ul|var|video)\\b",
relevance:0},{className:"selector-pseudo",
begin:":(visited|valid|root|right|required|read-write|read-only|out-range|optional|only-of-type|only-child|nth-of-type|nth-last-of-type|nth-last-child|nth-child|not|link|left|last-of-type|last-child|lang|invalid|indeterminate|in-range|hover|focus|first-of-type|first-line|first-letter|first-child|first|enabled|empty|disabled|default|checked|before|after|active)"
},{className:"selector-pseudo",
begin:"::(after|before|choices|first-letter|first-line|repeat-index|repeat-item|selection|value)"
},i,{className:"attribute",
begin:"\\b(src|z-index|word-wrap|word-spacing|word-break|width|widows|white-space|visibility|vertical-align|unicode-bidi|transition-timing-function|transition-property|transition-duration|transition-delay|transition|transform-style|transform-origin|transform|top|text-underline-position|text-transform|text-shadow|text-rendering|text-overflow|text-indent|text-decoration-style|text-decoration-line|text-decoration-color|text-decoration|text-align-last|text-align|tab-size|table-layout|right|resize|quotes|position|pointer-events|perspective-origin|perspective|page-break-inside|page-break-before|page-break-after|padding-top|padding-right|padding-left|padding-bottom|padding|overflow-y|overflow-x|overflow-wrap|overflow|outline-width|outline-style|outline-offset|outline-color|outline|orphans|order|opacity|object-position|object-fit|normal|none|nav-up|nav-right|nav-left|nav-index|nav-down|min-width|min-height|max-width|max-height|mask|marks|margin-top|margin-right|margin-left|margin-bottom|margin|list-style-type|list-style-position|list-style-image|list-style|line-height|letter-spacing|left|justify-content|initial|inherit|ime-mode|image-orientation|image-resolution|image-rendering|icon|hyphens|height|font-weight|font-variant-ligatures|font-variant|font-style|font-stretch|font-size-adjust|font-size|font-language-override|font-kerning|font-feature-settings|font-family|font|float|flex-wrap|flex-shrink|flex-grow|flex-flow|flex-direction|flex-basis|flex|filter|empty-cells|display|direction|cursor|counter-reset|counter-increment|content|column-width|column-span|column-rule-width|column-rule-style|column-rule-color|column-rule|column-gap|column-fill|column-count|columns|color|clip-path|clip|clear|caption-side|break-inside|break-before|break-after|box-sizing|box-shadow|box-decoration-break|bottom|border-width|border-top-width|border-top-style|border-top-right-radius|border-top-left-radius|border-top-color|border-top|border-style|border-spacing|border-right-width|border-right-style|border-right-color|border-right|border-radius|border-left-width|border-left-style|border-left-color|border-left|border-image-width|border-image-source|border-image-slice|border-image-repeat|border-image-outset|border-image|border-color|border-collapse|border-bottom-width|border-bottom-style|border-bottom-right-radius|border-bottom-left-radius|border-bottom-color|border-bottom|border|background-size|background-repeat|background-position|background-origin|background-image|background-color|background-clip|background-attachment|background-blend-mode|background|backface-visibility|auto|animation-timing-function|animation-play-state|animation-name|animation-iteration-count|animation-fill-mode|animation-duration|animation-direction|animation-delay|animation|align-self|align-items|align-content)\\b",
illegal:"[^\\s]"},{
begin:"\\b(whitespace|wait|w-resize|visible|vertical-text|vertical-ideographic|uppercase|upper-roman|upper-alpha|underline|transparent|top|thin|thick|text|text-top|text-bottom|tb-rl|table-header-group|table-footer-group|sw-resize|super|strict|static|square|solid|small-caps|separate|se-resize|scroll|s-resize|rtl|row-resize|ridge|right|repeat|repeat-y|repeat-x|relative|progress|pointer|overline|outside|outset|oblique|nowrap|not-allowed|normal|none|nw-resize|no-repeat|no-drop|newspaper|ne-resize|n-resize|move|middle|medium|ltr|lr-tb|lowercase|lower-roman|lower-alpha|loose|list-item|line|line-through|line-edge|lighter|left|keep-all|justify|italic|inter-word|inter-ideograph|inside|inset|inline|inline-block|inherit|inactive|ideograph-space|ideograph-parenthesis|ideograph-numeric|ideograph-alpha|horizontal|hidden|help|hand|groove|fixed|ellipsis|e-resize|double|dotted|distribute|distribute-space|distribute-letter|distribute-all-lines|disc|disabled|default|decimal|dashed|crosshair|collapse|col-resize|circle|char|center|capitalize|break-word|break-all|bottom|both|bolder|bold|block|bidi-override|below|baseline|auto|always|all-scroll|absolute|table|table-cell)\\b"
},{begin:":",end:";",
contains:[i,r,e.CSS_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{
className:"meta",begin:"!important"}]},{begin:"@(page|font-face)",lexemes:t,
keywords:"@page @font-face"},{begin:"@",end:"[{;]",returnBegin:!0,
keywords:"and or not only",contains:[{begin:t,className:"keyword"
},i,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,r,e.CSS_NUMBER_MODE]}]}}})());hljs.registerLanguage("properties",(()=>{"use strict";return e=>{
var n="[ \\t\\f]*",a=n+"[:=]"+n,t="("+a+"|[ \\t\\f]+)",r="([^\\\\\\W:= \\t\\f\\n]|\\\\.)+",s="([^\\\\:= \\t\\f\\n]|\\\\.)+",i={
end:t,relevance:0,starts:{className:"string",end:/$/,relevance:0,contains:[{
begin:"\\\\\\n"}]}};return{name:".properties",case_insensitive:!0,illegal:/\S/,
contains:[e.COMMENT("^\\s*[!#]","$"),{returnBegin:!0,variants:[{begin:r+a,
relevance:1},{begin:r+"[ \\t\\f]+",relevance:0}],contains:[{className:"attr",
begin:r,endsParent:!0,relevance:0}],starts:i},{begin:s+t,returnBegin:!0,
relevance:0,contains:[{className:"meta",begin:s,endsParent:!0,relevance:0}],
starts:i},{className:"attr",relevance:0,begin:s+n+"$"}]}}})());hljs.registerLanguage("sql",(()=>{"use strict";return e=>{
var t=e.COMMENT("--","$");return{name:"SQL",case_insensitive:!0,
illegal:/[<>{}*]/,contains:[{
beginKeywords:"begin end start commit rollback savepoint lock alter create drop rename call delete do handler insert load replace select truncate update set show pragma grant merge describe use explain help declare prepare execute deallocate release unlock purge reset change stop analyze cache flush optimize repair kill install uninstall checksum restore check backup revoke comment values with",
end:/;/,endsWithParent:!0,keywords:{$pattern:/[\w\.]+/,
keyword:"as abort abs absolute acc acce accep accept access accessed accessible account acos action activate add addtime admin administer advanced advise aes_decrypt aes_encrypt after agent aggregate ali alia alias all allocate allow alter always analyze ancillary and anti any anydata anydataset anyschema anytype apply archive archived archivelog are as asc ascii asin assembly assertion associate asynchronous at atan atn2 attr attri attrib attribu attribut attribute attributes audit authenticated authentication authid authors auto autoallocate autodblink autoextend automatic availability avg backup badfile basicfile before begin beginning benchmark between bfile bfile_base big bigfile bin binary_double binary_float binlog bit_and bit_count bit_length bit_or bit_xor bitmap blob_base block blocksize body both bound bucket buffer_cache buffer_pool build bulk by byte byteordermark bytes cache caching call calling cancel capacity cascade cascaded case cast catalog category ceil ceiling chain change changed char_base char_length character_length characters characterset charindex charset charsetform charsetid check checksum checksum_agg child choose chr chunk class cleanup clear client clob clob_base clone close cluster_id cluster_probability cluster_set clustering coalesce coercibility col collate collation collect colu colum column column_value columns columns_updated comment commit compact compatibility compiled complete composite_limit compound compress compute concat concat_ws concurrent confirm conn connec connect connect_by_iscycle connect_by_isleaf connect_by_root connect_time connection consider consistent constant constraint constraints constructor container content contents context contributors controlfile conv convert convert_tz corr corr_k corr_s corresponding corruption cos cost count count_big counted covar_pop covar_samp cpu_per_call cpu_per_session crc32 create creation critical cross cube cume_dist curdate current current_date current_time current_timestamp current_user cursor curtime customdatum cycle data database databases datafile datafiles datalength date_add date_cache date_format date_sub dateadd datediff datefromparts datename datepart datetime2fromparts day day_to_second dayname dayofmonth dayofweek dayofyear days db_role_change dbtimezone ddl deallocate declare decode decompose decrement decrypt deduplicate def defa defau defaul default defaults deferred defi defin define degrees delayed delegate delete delete_all delimited demand dense_rank depth dequeue des_decrypt des_encrypt des_key_file desc descr descri describ describe descriptor deterministic diagnostics difference dimension direct_load directory disable disable_all disallow disassociate discardfile disconnect diskgroup distinct distinctrow distribute distributed div do document domain dotnet double downgrade drop dumpfile duplicate duration each edition editionable editions element ellipsis else elsif elt empty enable enable_all enclosed encode encoding encrypt end end-exec endian enforced engine engines enqueue enterprise entityescaping eomonth error errors escaped evalname evaluate event eventdata events except exception exceptions exchange exclude excluding execu execut execute exempt exists exit exp expire explain explode export export_set extended extent external external_1 external_2 externally extract failed failed_login_attempts failover failure far fast feature_set feature_value fetch field fields file file_name_convert filesystem_like_logging final finish first first_value fixed flash_cache flashback floor flush following follows for forall force foreign form forma format found found_rows freelist freelists freepools fresh from from_base64 from_days ftp full function general generated get get_format get_lock getdate getutcdate global global_name globally go goto grant grants greatest group group_concat group_id grouping grouping_id groups gtid_subtract guarantee guard handler hash hashkeys having hea head headi headin heading heap help hex hierarchy high high_priority hosts hour hours http id ident_current ident_incr ident_seed identified identity idle_time if ifnull ignore iif ilike ilm immediate import in include including increment index indexes indexing indextype indicator indices inet6_aton inet6_ntoa inet_aton inet_ntoa infile initial initialized initially initrans inmemory inner innodb input insert install instance instantiable instr interface interleaved intersect into invalidate invisible is is_free_lock is_ipv4 is_ipv4_compat is_not is_not_null is_used_lock isdate isnull isolation iterate java join json json_exists keep keep_duplicates key keys kill language large last last_day last_insert_id last_value lateral lax lcase lead leading least leaves left len lenght length less level levels library like like2 like4 likec limit lines link list listagg little ln load load_file lob lobs local localtime localtimestamp locate locator lock locked log log10 log2 logfile logfiles logging logical logical_reads_per_call logoff logon logs long loop low low_priority lower lpad lrtrim ltrim main make_set makedate maketime managed management manual map mapping mask master master_pos_wait match matched materialized max maxextents maximize maxinstances maxlen maxlogfiles maxloghistory maxlogmembers maxsize maxtrans md5 measures median medium member memcompress memory merge microsecond mid migration min minextents minimum mining minus minute minutes minvalue missing mod mode model modification modify module monitoring month months mount move movement multiset mutex name name_const names nan national native natural nav nchar nclob nested never new newline next nextval no no_write_to_binlog noarchivelog noaudit nobadfile nocheck nocompress nocopy nocycle nodelay nodiscardfile noentityescaping noguarantee nokeep nologfile nomapping nomaxvalue nominimize nominvalue nomonitoring none noneditionable nonschema noorder nopr nopro noprom nopromp noprompt norely noresetlogs noreverse normal norowdependencies noschemacheck noswitch not nothing notice notnull notrim novalidate now nowait nth_value nullif nulls num numb numbe nvarchar nvarchar2 object ocicoll ocidate ocidatetime ociduration ociinterval ociloblocator ocinumber ociref ocirefcursor ocirowid ocistring ocitype oct octet_length of off offline offset oid oidindex old on online only opaque open operations operator optimal optimize option optionally or oracle oracle_date oradata ord ordaudio orddicom orddoc order ordimage ordinality ordvideo organization orlany orlvary out outer outfile outline output over overflow overriding package pad parallel parallel_enable parameters parent parse partial partition partitions pascal passing password password_grace_time password_lock_time password_reuse_max password_reuse_time password_verify_function patch path patindex pctincrease pctthreshold pctused pctversion percent percent_rank percentile_cont percentile_disc performance period period_add period_diff permanent physical pi pipe pipelined pivot pluggable plugin policy position post_transaction pow power pragma prebuilt precedes preceding precision prediction prediction_cost prediction_details prediction_probability prediction_set prepare present preserve prior priority private private_sga privileges procedural procedure procedure_analyze processlist profiles project prompt protection public publishingservername purge quarter query quick quiesce quota quotename radians raise rand range rank raw read reads readsize rebuild record records recover recovery recursive recycle redo reduced ref reference referenced references referencing refresh regexp_like register regr_avgx regr_avgy regr_count regr_intercept regr_r2 regr_slope regr_sxx regr_sxy reject rekey relational relative relaylog release release_lock relies_on relocate rely rem remainder rename repair repeat replace replicate replication required reset resetlogs resize resource respect restore restricted result result_cache resumable resume retention return returning returns reuse reverse revoke right rlike role roles rollback rolling rollup round row row_count rowdependencies rowid rownum rows rtrim rules safe salt sample save savepoint sb1 sb2 sb4 scan schema schemacheck scn scope scroll sdo_georaster sdo_topo_geometry search sec_to_time second seconds section securefile security seed segment select self semi sequence sequential serializable server servererror session session_user sessions_per_user set sets settings sha sha1 sha2 share shared shared_pool short show shrink shutdown si_averagecolor si_colorhistogram si_featurelist si_positionalcolor si_stillimage si_texture siblings sid sign sin size size_t sizes skip slave sleep smalldatetimefromparts smallfile snapshot some soname sort soundex source space sparse spfile split sql sql_big_result sql_buffer_result sql_cache sql_calc_found_rows sql_small_result sql_variant_property sqlcode sqldata sqlerror sqlname sqlstate sqrt square standalone standby start starting startup statement static statistics stats_binomial_test stats_crosstab stats_ks_test stats_mode stats_mw_test stats_one_way_anova stats_t_test_ stats_t_test_indep stats_t_test_one stats_t_test_paired stats_wsr_test status std stddev stddev_pop stddev_samp stdev stop storage store stored str str_to_date straight_join strcmp strict string struct stuff style subdate subpartition subpartitions substitutable substr substring subtime subtring_index subtype success sum suspend switch switchoffset switchover sync synchronous synonym sys sys_xmlagg sysasm sysaux sysdate sysdatetimeoffset sysdba sysoper system system_user sysutcdatetime table tables tablespace tablesample tan tdo template temporary terminated tertiary_weights test than then thread through tier ties time time_format time_zone timediff timefromparts timeout timestamp timestampadd timestampdiff timezone_abbr timezone_minute timezone_region to to_base64 to_date to_days to_seconds todatetimeoffset trace tracking transaction transactional translate translation treat trigger trigger_nestlevel triggers trim truncate try_cast try_convert try_parse type ub1 ub2 ub4 ucase unarchived unbounded uncompress under undo unhex unicode uniform uninstall union unique unix_timestamp unknown unlimited unlock unnest unpivot unrecoverable unsafe unsigned until untrusted unusable unused update updated upgrade upped upper upsert url urowid usable usage use use_stored_outlines user user_data user_resources users using utc_date utc_timestamp uuid uuid_short validate validate_password_strength validation valist value values var var_samp varcharc vari varia variab variabl variable variables variance varp varraw varrawc varray verify version versions view virtual visible void wait wallet warning warnings week weekday weekofyear wellformed when whene whenev wheneve whenever where while whitespace window with within without work wrapped xdb xml xmlagg xmlattributes xmlcast xmlcolattval xmlelement xmlexists xmlforest xmlindex xmlnamespaces xmlpi xmlquery xmlroot xmlschema xmlserialize xmltable xmltype xor year year_to_month years yearweek",
literal:"true false null unknown",
built_in:"array bigint binary bit blob bool boolean char character date dec decimal float int int8 integer interval number numeric real record serial serial8 smallint text time timestamp tinyint varchar varchar2 varying void"
},contains:[{className:"string",begin:"'",end:"'",contains:[{begin:"''"}]},{
className:"string",begin:'"',end:'"',contains:[{begin:'""'}]},{
className:"string",begin:"`",end:"`"
},e.C_NUMBER_MODE,e.C_BLOCK_COMMENT_MODE,t,e.HASH_COMMENT_MODE]
},e.C_BLOCK_COMMENT_MODE,t,e.HASH_COMMENT_MODE]}}})());hljs.registerLanguage("matlab",(()=>{"use strict";return e=>{var a={relevance:0,
contains:[{begin:"('|\\.')+"}]};return{name:"Matlab",keywords:{
keyword:"arguments break case catch classdef continue else elseif end enumeration events for function global if methods otherwise parfor persistent properties return spmd switch try while",
built_in:"sin sind sinh asin asind asinh cos cosd cosh acos acosd acosh tan tand tanh atan atand atan2 atanh sec secd sech asec asecd asech csc cscd csch acsc acscd acsch cot cotd coth acot acotd acoth hypot exp expm1 log log1p log10 log2 pow2 realpow reallog realsqrt sqrt nthroot nextpow2 abs angle complex conj imag real unwrap isreal cplxpair fix floor ceil round mod rem sign airy besselj bessely besselh besseli besselk beta betainc betaln ellipj ellipke erf erfc erfcx erfinv expint gamma gammainc gammaln psi legendre cross dot factor isprime primes gcd lcm rat rats perms nchoosek factorial cart2sph cart2pol pol2cart sph2cart hsv2rgb rgb2hsv zeros ones eye repmat rand randn linspace logspace freqspace meshgrid accumarray size length ndims numel disp isempty isequal isequalwithequalnans cat reshape diag blkdiag tril triu fliplr flipud flipdim rot90 find sub2ind ind2sub bsxfun ndgrid permute ipermute shiftdim circshift squeeze isscalar isvector ans eps realmax realmin pi i|0 inf nan isnan isinf isfinite j|0 why compan gallery hadamard hankel hilb invhilb magic pascal rosser toeplitz vander wilkinson max min nanmax nanmin mean nanmean type table readtable writetable sortrows sort figure plot plot3 scatter scatter3 cellfun legend intersect ismember procrustes hold num2cell "
},illegal:'(//|"|#|/\\*|\\s+/\\w+)',contains:[{className:"function",
beginKeywords:"function",end:"$",contains:[e.UNDERSCORE_TITLE_MODE,{
className:"params",variants:[{begin:"\\(",end:"\\)"},{begin:"\\[",end:"\\]"}]}]
},{className:"built_in",begin:/true|false/,relevance:0,starts:a},{
begin:"[a-zA-Z][a-zA-Z_0-9]*('|\\.')+",relevance:0},{className:"number",
begin:e.C_NUMBER_RE,relevance:0,starts:a},{className:"string",begin:"'",end:"'",
contains:[e.BACKSLASH_ESCAPE,{begin:"''"}]},{begin:/\]|\}|\)/,relevance:0,
starts:a},{className:"string",begin:'"',end:'"',contains:[e.BACKSLASH_ESCAPE,{
begin:'""'}],starts:a
},e.COMMENT("^\\s*%\\{\\s*$","^\\s*%\\}\\s*$"),e.COMMENT("%","$")]}}})());hljs.registerLanguage("python",(()=>{"use strict";return e=>{const n={
keyword:"and as assert async await break class continue def del elif else except finally for  from global if import in is lambda nonlocal|10 not or pass raise return try while with yield",
built_in:"__import__ abs all any ascii bin bool breakpoint bytearray bytes callable chr classmethod compile complex delattr dict dir divmod enumerate eval exec filter float format frozenset getattr globals hasattr hash help hex id input int isinstance issubclass iter len list locals map max memoryview min next object oct open ord pow print property range repr reversed round set setattr slice sorted staticmethod str sum super tuple type vars zip",
literal:"__debug__ Ellipsis False None NotImplemented True"},a={
className:"meta",begin:/^(>>>|\.\.\.) /},s={className:"subst",begin:/\{/,
end:/\}/,keywords:n,illegal:/#/},i={begin:/\{\{/,relevance:0},r={
className:"string",contains:[e.BACKSLASH_ESCAPE],variants:[{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,a],relevance:10},{
begin:/([uU]|[bB]|[rR]|[bB][rR]|[rR][bB])?"""/,end:/"""/,
contains:[e.BACKSLASH_ESCAPE,a],relevance:10},{
begin:/([fF][rR]|[rR][fF]|[fF])'''/,end:/'''/,
contains:[e.BACKSLASH_ESCAPE,a,i,s]},{begin:/([fF][rR]|[rR][fF]|[fF])"""/,
end:/"""/,contains:[e.BACKSLASH_ESCAPE,a,i,s]},{begin:/([uU]|[rR])'/,end:/'/,
relevance:10},{begin:/([uU]|[rR])"/,end:/"/,relevance:10},{
begin:/([bB]|[bB][rR]|[rR][bB])'/,end:/'/},{begin:/([bB]|[bB][rR]|[rR][bB])"/,
end:/"/},{begin:/([fF][rR]|[rR][fF]|[fF])'/,end:/'/,
contains:[e.BACKSLASH_ESCAPE,i,s]},{begin:/([fF][rR]|[rR][fF]|[fF])"/,end:/"/,
contains:[e.BACKSLASH_ESCAPE,i,s]},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},t="[0-9](_?[0-9])*",l=`(\\b(${t}))?\\.(${t})|\\b(${t})\\.`,b={
className:"number",relevance:0,variants:[{
begin:`(\\b(${t})|(${l}))[eE][+-]?(${t})[jJ]?\\b`},{begin:`(${l})[jJ]?`},{
begin:"\\b([1-9](_?[0-9])*|0+(_?0)*)[lLjJ]?\\b"},{
begin:"\\b0[bB](_?[01])+[lL]?\\b"},{begin:"\\b0[oO](_?[0-7])+[lL]?\\b"},{
begin:"\\b0[xX](_?[0-9a-fA-F])+[lL]?\\b"},{begin:`\\b(${t})[jJ]\\b`}]},o={
className:"params",variants:[{begin:/\(\s*\)/,skip:!0,className:null},{
begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:n,
contains:["self",a,b,r,e.HASH_COMMENT_MODE]}]};return s.contains=[r,b,a],{
name:"Python",aliases:["py","gyp","ipython"],keywords:n,
illegal:/(<\/|->|\?)|=>/,contains:[a,b,{begin:/\bself\b/},{beginKeywords:"if",
relevance:0},r,e.HASH_COMMENT_MODE,{variants:[{className:"function",
beginKeywords:"def"},{className:"class",beginKeywords:"class"}],end:/:/,
illegal:/[${=;\n,]/,contains:[e.UNDERSCORE_TITLE_MODE,o,{begin:/->/,
endsWithParent:!0,keywords:"None"}]},{className:"meta",begin:/^[\t ]*@/,
end:/(?=#)|$/,contains:[b,o,r]},{begin:/\b(print|exec)\(/}]}}})());hljs.registerLanguage("ruby",(()=>{"use strict";function e(...e){
return e.map((e=>{return(n=e)?"string"==typeof n?n:n.source:null;var n
})).join("")}return n=>{
var a,i="([a-zA-Z_]\\w*[!?=]?|[-+~]@|<<|>>|=~|===?|<=>|[<>]=?|\\*\\*|[-/+%^&*~`|]|\\[\\]=?)",s={
keyword:"and then defined module in return redo if BEGIN retry end for self when next until do begin unless END rescue else break undef not super class case require yield alias while ensure elsif or include attr_reader attr_writer attr_accessor __FILE__",
built_in:"proc lambda",literal:"true false nil"},r={className:"doctag",
begin:"@[A-Za-z]+"},b={begin:"#<",end:">"},t=[n.COMMENT("#","$",{contains:[r]
}),n.COMMENT("^=begin","^=end",{contains:[r],relevance:10
}),n.COMMENT("^__END__","\\n$")],c={className:"subst",begin:/#\{/,end:/\}/,
keywords:s},d={className:"string",contains:[n.BACKSLASH_ESCAPE,c],variants:[{
begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/`/,end:/`/},{begin:/%[qQwWx]?\(/,
end:/\)/},{begin:/%[qQwWx]?\[/,end:/\]/},{begin:/%[qQwWx]?\{/,end:/\}/},{
begin:/%[qQwWx]?</,end:/>/},{begin:/%[qQwWx]?\//,end:/\//},{begin:/%[qQwWx]?%/,
end:/%/},{begin:/%[qQwWx]?-/,end:/-/},{begin:/%[qQwWx]?\|/,end:/\|/},{
begin:/\B\?(\\\d{1,3}|\\x[A-Fa-f0-9]{1,2}|\\u[A-Fa-f0-9]{4}|\\?\S)\b/},{
begin:/<<[-~]?'?(\w+)\n(?:[^\n]*\n)*?\s*\1\b/,returnBegin:!0,contains:[{
begin:/<<[-~]?'?/},n.END_SAME_AS_BEGIN({begin:/(\w+)/,end:/(\w+)/,
contains:[n.BACKSLASH_ESCAPE,c]})]}]},g="[0-9](_?[0-9])*",l={className:"number",
relevance:0,variants:[{
begin:`\\b([1-9](_?[0-9])*|0)(\\.(${g}))?([eE][+-]?(${g})|r)?i?\\b`},{
begin:"\\b0[dD][0-9](_?[0-9])*r?i?\\b"},{begin:"\\b0[bB][0-1](_?[0-1])*r?i?\\b"
},{begin:"\\b0[oO][0-7](_?[0-7])*r?i?\\b"},{
begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*r?i?\\b"},{
begin:"\\b0(_?[0-7])+r?i?\\b"}]},o={className:"params",begin:"\\(",end:"\\)",
endsParent:!0,keywords:s},_=[d,{className:"class",beginKeywords:"class module",
end:"$|;",illegal:/=/,contains:[n.inherit(n.TITLE_MODE,{
begin:"[A-Za-z_]\\w*(::\\w+)*(\\?|!)?"}),{begin:"<\\s*",contains:[{
begin:"("+n.IDENT_RE+"::)?"+n.IDENT_RE}]}].concat(t)},{className:"function",
begin:e(/def\s*/,(a=i+"\\s*(\\(|;|$)",e("(?=",a,")"))),keywords:"def",end:"$|;",
contains:[n.inherit(n.TITLE_MODE,{begin:i}),o].concat(t)},{begin:n.IDENT_RE+"::"
},{className:"symbol",begin:n.UNDERSCORE_IDENT_RE+"(!|\\?)?:",relevance:0},{
className:"symbol",begin:":(?!\\s)",contains:[d,{begin:i}],relevance:0},l,{
className:"variable",
begin:"(\\$\\W)|((\\$|@@?)(\\w+))(?=[^@$?])(?![A-Za-z])(?![@$?'])"},{
className:"params",begin:/\|/,end:/\|/,relevance:0,keywords:s},{
begin:"("+n.RE_STARTERS_RE+"|unless)\\s*",keywords:"unless",contains:[{
className:"regexp",contains:[n.BACKSLASH_ESCAPE,c],illegal:/\n/,variants:[{
begin:"/",end:"/[a-z]*"},{begin:/%r\{/,end:/\}[a-z]*/},{begin:"%r\\(",
end:"\\)[a-z]*"},{begin:"%r!",end:"![a-z]*"},{begin:"%r\\[",end:"\\][a-z]*"}]
}].concat(b,t),relevance:0}].concat(b,t);c.contains=_,o.contains=_;var E=[{
begin:/^\s*=>/,starts:{end:"$",contains:_}},{className:"meta",
begin:"^([>?]>|[\\w#]+\\(\\w+\\):\\d+:\\d+>|(\\w+-)?\\d+\\.\\d+\\.\\d+(p\\d+)?[^\\d][^>]+>)(?=[ ])",
starts:{end:"$",contains:_}}];return t.unshift(b),{name:"Ruby",
aliases:["rb","gemspec","podspec","thor","irb"],keywords:s,illegal:/\/\*/,
contains:[n.SHEBANG({binary:"ruby"})].concat(E).concat(t).concat(_)}}})());hljs.registerLanguage("yaml",(()=>{"use strict";return e=>{
var n="true false yes no null",a="[\\w#;/?:@&=+$,.~*'()[\\]]+",s={
className:"string",relevance:0,variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/
},{begin:/\S+/}],contains:[e.BACKSLASH_ESCAPE,{className:"template-variable",
variants:[{begin:/\{\{/,end:/\}\}/},{begin:/%\{/,end:/\}/}]}]},i=e.inherit(s,{
variants:[{begin:/'/,end:/'/},{begin:/"/,end:/"/},{begin:/[^\s,{}[\]]+/}]}),l={
end:",",endsWithParent:!0,excludeEnd:!0,contains:[],keywords:n,relevance:0},t={
begin:/\{/,end:/\}/,contains:[l],illegal:"\\n",relevance:0},g={begin:"\\[",
end:"\\]",contains:[l],illegal:"\\n",relevance:0},b=[{className:"attr",
variants:[{begin:"\\w[\\w :\\/.-]*:(?=[ \t]|$)"},{
begin:'"\\w[\\w :\\/.-]*":(?=[ \t]|$)'},{begin:"'\\w[\\w :\\/.-]*':(?=[ \t]|$)"
}]},{className:"meta",begin:"^---\\s*$",relevance:10},{className:"string",
begin:"[\\|>]([1-9]?[+-])?[ ]*\\n( +)[^ ][^\\n]*\\n(\\2[^\\n]+\\n?)*"},{
begin:"<%[%=-]?",end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0,
relevance:0},{className:"type",begin:"!\\w+!"+a},{className:"type",
begin:"!<"+a+">"},{className:"type",begin:"!"+a},{className:"type",begin:"!!"+a
},{className:"meta",begin:"&"+e.UNDERSCORE_IDENT_RE+"$"},{className:"meta",
begin:"\\*"+e.UNDERSCORE_IDENT_RE+"$"},{className:"bullet",begin:"-(?=[ ]|$)",
relevance:0},e.HASH_COMMENT_MODE,{beginKeywords:n,keywords:{literal:n}},{
className:"number",
begin:"\\b[0-9]{4}(-[0-9][0-9]){0,2}([Tt \\t][0-9][0-9]?(:[0-9][0-9]){2})?(\\.[0-9]*)?([ \\t])*(Z|[-+][0-9][0-9]?(:[0-9][0-9])?)?\\b"
},{className:"number",begin:e.C_NUMBER_RE+"\\b",relevance:0},t,g,s],r=[...b]
;return r.pop(),r.push(i),l.contains=r,{name:"YAML",case_insensitive:!0,
aliases:["yml","YAML"],contains:b}}})());hljs.registerLanguage("diff",(()=>{"use strict";return e=>({name:"Diff",
aliases:["patch"],contains:[{className:"meta",relevance:10,variants:[{
begin:/^@@ +-\d+,\d+ +\+\d+,\d+ +@@/},{begin:/^\*\*\* +\d+,\d+ +\*\*\*\*$/},{
begin:/^--- +\d+,\d+ +----$/}]},{className:"comment",variants:[{begin:/Index: /,
end:/$/},{begin:/^index/,end:/$/},{begin:/={3,}/,end:/$/},{begin:/^-{3}/,end:/$/
},{begin:/^\*{3} /,end:/$/},{begin:/^\+{3}/,end:/$/},{begin:/^\*{15}$/},{
begin:/^diff --git/,end:/$/}]},{className:"addition",begin:/^\+/,end:/$/},{
className:"deletion",begin:/^-/,end:/$/},{className:"addition",begin:/^!/,
end:/$/}]})})());hljs.registerLanguage("python-repl",(()=>{"use strict";return s=>({
aliases:["pycon"],contains:[{className:"meta",starts:{end:/ |$/,starts:{end:"$",
subLanguage:"python"}},variants:[{begin:/^>>>(?=[ ]|$)/},{
begin:/^\.\.\.(?=[ ]|$)/}]}]})})());hljs.registerLanguage("processing",(()=>{"use strict";return e=>({
name:"Processing",keywords:{
keyword:"BufferedReader PVector PFont PImage PGraphics HashMap boolean byte char color double float int long String Array FloatDict FloatList IntDict IntList JSONArray JSONObject Object StringDict StringList Table TableRow XML false synchronized int abstract float private char boolean static null if const for true while long throw strictfp finally protected import native final return void enum else break transient new catch instanceof byte super volatile case assert short package default double public try this switch continue throws protected public private",
literal:"P2D P3D HALF_PI PI QUARTER_PI TAU TWO_PI",title:"setup draw",
built_in:"displayHeight displayWidth mouseY mouseX mousePressed pmouseX pmouseY key keyCode pixels focused frameCount frameRate height width size createGraphics beginDraw createShape loadShape PShape arc ellipse line point quad rect triangle bezier bezierDetail bezierPoint bezierTangent curve curveDetail curvePoint curveTangent curveTightness shape shapeMode beginContour beginShape bezierVertex curveVertex endContour endShape quadraticVertex vertex ellipseMode noSmooth rectMode smooth strokeCap strokeJoin strokeWeight mouseClicked mouseDragged mouseMoved mousePressed mouseReleased mouseWheel keyPressed keyPressedkeyReleased keyTyped print println save saveFrame day hour millis minute month second year background clear colorMode fill noFill noStroke stroke alpha blue brightness color green hue lerpColor red saturation modelX modelY modelZ screenX screenY screenZ ambient emissive shininess specular add createImage beginCamera camera endCamera frustum ortho perspective printCamera printProjection cursor frameRate noCursor exit loop noLoop popStyle pushStyle redraw binary boolean byte char float hex int str unbinary unhex join match matchAll nf nfc nfp nfs split splitTokens trim append arrayCopy concat expand reverse shorten sort splice subset box sphere sphereDetail createInput createReader loadBytes loadJSONArray loadJSONObject loadStrings loadTable loadXML open parseXML saveTable selectFolder selectInput beginRaw beginRecord createOutput createWriter endRaw endRecord PrintWritersaveBytes saveJSONArray saveJSONObject saveStream saveStrings saveXML selectOutput popMatrix printMatrix pushMatrix resetMatrix rotate rotateX rotateY rotateZ scale shearX shearY translate ambientLight directionalLight lightFalloff lights lightSpecular noLights normal pointLight spotLight image imageMode loadImage noTint requestImage tint texture textureMode textureWrap blend copy filter get loadPixels set updatePixels blendMode loadShader PShaderresetShader shader createFont loadFont text textFont textAlign textLeading textMode textSize textWidth textAscent textDescent abs ceil constrain dist exp floor lerp log mag map max min norm pow round sq sqrt acos asin atan atan2 cos degrees radians sin tan noise noiseDetail noiseSeed random randomGaussian randomSeed"
},
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.C_NUMBER_MODE]
})})());hljs.registerLanguage("haskell",(()=>{"use strict";return e=>{const n={
variants:[e.COMMENT("--","$"),e.COMMENT(/\{-/,/-\}/,{contains:["self"]})]},i={
className:"meta",begin:/\{-#/,end:/#-\}/},a={className:"meta",begin:"^#",end:"$"
},s={className:"type",begin:"\\b[A-Z][\\w']*",relevance:0},l={begin:"\\(",
end:"\\)",illegal:'"',contains:[i,a,{className:"type",
begin:"\\b[A-Z][\\w]*(\\((\\.\\.|,|\\w+)\\))?"},e.inherit(e.TITLE_MODE,{
begin:"[_a-z][\\w']*"}),n]};return{name:"Haskell",aliases:["hs"],
keywords:"let in if then else case of where do module import hiding qualified type data newtype deriving class instance as default infix infixl infixr foreign export ccall stdcall cplusplus jvm dotnet safe unsafe family forall mdo proc rec",
contains:[{beginKeywords:"module",end:"where",keywords:"module where",
contains:[l,n],illegal:"\\W\\.|;"},{begin:"\\bimport\\b",end:"$",
keywords:"import qualified as hiding",contains:[l,n],illegal:"\\W\\.|;"},{
className:"class",begin:"^(\\s*)?(class|instance)\\b",end:"where",
keywords:"class family instance where",contains:[s,l,n]},{className:"class",
begin:"\\b(data|(new)?type)\\b",end:"$",
keywords:"data family type newtype deriving",contains:[i,s,l,{begin:/\{/,
end:/\}/,contains:l.contains},n]},{beginKeywords:"default",end:"$",
contains:[s,l,n]},{beginKeywords:"infix infixl infixr",end:"$",
contains:[e.C_NUMBER_MODE,n]},{begin:"\\bforeign\\b",end:"$",
keywords:"foreign import export ccall stdcall cplusplus jvm dotnet safe unsafe",
contains:[s,e.QUOTE_STRING_MODE,n]},{className:"meta",
begin:"#!\\/usr\\/bin\\/env runhaskell",end:"$"
},i,a,e.QUOTE_STRING_MODE,e.C_NUMBER_MODE,s,e.inherit(e.TITLE_MODE,{
begin:"^[_a-z][\\w']*"}),n,{begin:"->|<-"}]}}})());hljs.registerLanguage("csharp",(()=>{"use strict";return e=>{var n={
keyword:["abstract","as","base","break","case","class","const","continue","do","else","event","explicit","extern","finally","fixed","for","foreach","goto","if","implicit","in","interface","internal","is","lock","namespace","new","operator","out","override","params","private","protected","public","readonly","record","ref","return","sealed","sizeof","stackalloc","static","struct","switch","this","throw","try","typeof","unchecked","unsafe","using","virtual","void","volatile","while"].concat(["add","alias","and","ascending","async","await","by","descending","equals","from","get","global","group","init","into","join","let","nameof","not","notnull","on","or","orderby","partial","remove","select","set","unmanaged","value|0","var","when","where","with","yield"]).join(" "),
built_in:"bool byte char decimal delegate double dynamic enum float int long nint nuint object sbyte short string ulong unit ushort",
literal:"default false null true"},a=e.inherit(e.TITLE_MODE,{
begin:"[a-zA-Z](\\.?\\w)*"}),i={className:"number",variants:[{
begin:"\\b(0b[01']+)"},{
begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{
begin:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
}],relevance:0},s={className:"string",begin:'@"',end:'"',contains:[{begin:'""'}]
},t=e.inherit(s,{illegal:/\n/}),r={className:"subst",begin:/\{/,end:/\}/,
keywords:n},l=e.inherit(r,{illegal:/\n/}),c={className:"string",begin:/\$"/,
end:'"',illegal:/\n/,contains:[{begin:/\{\{/},{begin:/\}\}/
},e.BACKSLASH_ESCAPE,l]},o={className:"string",begin:/\$@"/,end:'"',contains:[{
begin:/\{\{/},{begin:/\}\}/},{begin:'""'},r]},d=e.inherit(o,{illegal:/\n/,
contains:[{begin:/\{\{/},{begin:/\}\}/},{begin:'""'},l]})
;r.contains=[o,c,s,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,i,e.C_BLOCK_COMMENT_MODE],
l.contains=[d,c,t,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,i,e.inherit(e.C_BLOCK_COMMENT_MODE,{
illegal:/\n/})];var g={variants:[o,c,s,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
},E={begin:"<",end:">",contains:[{beginKeywords:"in out"},a]
},_=e.IDENT_RE+"(<"+e.IDENT_RE+"(\\s*,\\s*"+e.IDENT_RE+")*>)?(\\[\\])?",b={
begin:"@"+e.IDENT_RE,relevance:0};return{name:"C#",aliases:["cs","c#"],
keywords:n,illegal:/::/,contains:[e.COMMENT("///","$",{returnBegin:!0,
contains:[{className:"doctag",variants:[{begin:"///",relevance:0},{
begin:"\x3c!--|--\x3e"},{begin:"</?",end:">"}]}]
}),e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{className:"meta",begin:"#",
end:"$",keywords:{
"meta-keyword":"if else elif endif define undef warning error line region endregion pragma checksum"
}},g,i,{beginKeywords:"class interface",relevance:0,end:/[{;=]/,
illegal:/[^\s:,]/,contains:[{beginKeywords:"where class"
},a,E,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{beginKeywords:"namespace",
relevance:0,end:/[{;=]/,illegal:/[^\s:]/,
contains:[a,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{
beginKeywords:"record",relevance:0,end:/[{;=]/,illegal:/[^\s:]/,
contains:[a,E,e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{className:"meta",
begin:"^\\s*\\[",excludeBegin:!0,end:"\\]",excludeEnd:!0,contains:[{
className:"meta-string",begin:/"/,end:/"/}]},{
beginKeywords:"new return throw await else",relevance:0},{className:"function",
begin:"("+_+"\\s+)+"+e.IDENT_RE+"\\s*(<.+>\\s*)?\\(",returnBegin:!0,
end:/\s*[{;=]/,excludeEnd:!0,keywords:n,contains:[{
beginKeywords:"public private protected static internal protected abstract async extern override unsafe virtual new sealed partial",
relevance:0},{begin:e.IDENT_RE+"\\s*(<.+>\\s*)?\\(",returnBegin:!0,
contains:[e.TITLE_MODE,E],relevance:0},{className:"params",begin:/\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,keywords:n,relevance:0,
contains:[g,i,e.C_BLOCK_COMMENT_MODE]
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},b]}}})());hljs.registerLanguage("armasm",(()=>{"use strict";return s=>{const e={
variants:[s.COMMENT("^[ \\t]*(?=#)","$",{relevance:0,excludeBegin:!0
}),s.COMMENT("[;@]","$",{relevance:0
}),s.C_LINE_COMMENT_MODE,s.C_BLOCK_COMMENT_MODE]};return{name:"ARM Assembly",
case_insensitive:!0,aliases:["arm"],keywords:{$pattern:"\\.?"+s.IDENT_RE,
meta:".2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .arm .thumb .code16 .code32 .force_thumb .thumb_func .ltorg ALIAS ALIGN ARM AREA ASSERT ATTR CN CODE CODE16 CODE32 COMMON CP DATA DCB DCD DCDU DCDO DCFD DCFDU DCI DCQ DCQU DCW DCWU DN ELIF ELSE END ENDFUNC ENDIF ENDP ENTRY EQU EXPORT EXPORTAS EXTERN FIELD FILL FUNCTION GBLA GBLL GBLS GET GLOBAL IF IMPORT INCBIN INCLUDE INFO KEEP LCLA LCLL LCLS LTORG MACRO MAP MEND MEXIT NOFP OPT PRESERVE8 PROC QN READONLY RELOC REQUIRE REQUIRE8 RLIST FN ROUT SETA SETL SETS SN SPACE SUBT THUMB THUMBX TTL WHILE WEND ",
built_in:"r0 r1 r2 r3 r4 r5 r6 r7 r8 r9 r10 r11 r12 r13 r14 r15 pc lr sp ip sl sb fp a1 a2 a3 a4 v1 v2 v3 v4 v5 v6 v7 v8 f0 f1 f2 f3 f4 f5 f6 f7 p0 p1 p2 p3 p4 p5 p6 p7 p8 p9 p10 p11 p12 p13 p14 p15 c0 c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12 c13 c14 c15 q0 q1 q2 q3 q4 q5 q6 q7 q8 q9 q10 q11 q12 q13 q14 q15 cpsr_c cpsr_x cpsr_s cpsr_f cpsr_cx cpsr_cxs cpsr_xs cpsr_xsf cpsr_sf cpsr_cxsf spsr_c spsr_x spsr_s spsr_f spsr_cx spsr_cxs spsr_xs spsr_xsf spsr_sf spsr_cxsf s0 s1 s2 s3 s4 s5 s6 s7 s8 s9 s10 s11 s12 s13 s14 s15 s16 s17 s18 s19 s20 s21 s22 s23 s24 s25 s26 s27 s28 s29 s30 s31 d0 d1 d2 d3 d4 d5 d6 d7 d8 d9 d10 d11 d12 d13 d14 d15 d16 d17 d18 d19 d20 d21 d22 d23 d24 d25 d26 d27 d28 d29 d30 d31 {PC} {VAR} {TRUE} {FALSE} {OPT} {CONFIG} {ENDIAN} {CODESIZE} {CPU} {FPU} {ARCHITECTURE} {PCSTOREOFFSET} {ARMASM_VERSION} {INTER} {ROPI} {RWPI} {SWST} {NOSWST} . @"
},contains:[{className:"keyword",
begin:"\\b(adc|(qd?|sh?|u[qh]?)?add(8|16)?|usada?8|(q|sh?|u[qh]?)?(as|sa)x|and|adrl?|sbc|rs[bc]|asr|b[lx]?|blx|bxj|cbn?z|tb[bh]|bic|bfc|bfi|[su]bfx|bkpt|cdp2?|clz|clrex|cmp|cmn|cpsi[ed]|cps|setend|dbg|dmb|dsb|eor|isb|it[te]{0,3}|lsl|lsr|ror|rrx|ldm(([id][ab])|f[ds])?|ldr((s|ex)?[bhd])?|movt?|mvn|mra|mar|mul|[us]mull|smul[bwt][bt]|smu[as]d|smmul|smmla|mla|umlaal|smlal?([wbt][bt]|d)|mls|smlsl?[ds]|smc|svc|sev|mia([bt]{2}|ph)?|mrr?c2?|mcrr2?|mrs|msr|orr|orn|pkh(tb|bt)|rbit|rev(16|sh)?|sel|[su]sat(16)?|nop|pop|push|rfe([id][ab])?|stm([id][ab])?|str(ex)?[bhd]?|(qd?)?sub|(sh?|q|u[qh]?)?sub(8|16)|[su]xt(a?h|a?b(16)?)|srs([id][ab])?|swpb?|swi|smi|tst|teq|wfe|wfi|yield)(eq|ne|cs|cc|mi|pl|vs|vc|hi|ls|ge|lt|gt|le|al|hs|lo)?[sptrx]?(?=\\s)"
},e,s.QUOTE_STRING_MODE,{className:"string",begin:"'",end:"[^\\\\]'",relevance:0
},{className:"title",begin:"\\|",end:"\\|",illegal:"\\n",relevance:0},{
className:"number",variants:[{begin:"[#$=]?0x[0-9a-f]+"},{begin:"[#$=]?0b[01]+"
},{begin:"[#$=]\\d+"},{begin:"\\b\\d+"}],relevance:0},{className:"symbol",
variants:[{begin:"^[ \\t]*[a-z_\\.\\$][a-z0-9_\\.\\$]+:"},{
begin:"^[a-z_\\.\\$][a-z0-9_\\.\\$]+"},{begin:"[=#]\\w+"}],relevance:0}]}}})());hljs.registerLanguage("ini",(()=>{"use strict";function e(e){
return e?"string"==typeof e?e:e.source:null}function n(...n){
return n.map((n=>e(n))).join("")}return s=>{const a={className:"number",
relevance:0,variants:[{begin:/([+-]+)?[\d]+_[\d_]+/},{begin:s.NUMBER_RE}]
},i=s.COMMENT();i.variants=[{begin:/;/,end:/$/},{begin:/#/,end:/$/}];const t={
className:"variable",variants:[{begin:/\$[\w\d"][\w\d_]*/},{begin:/\$\{(.*?)\}/
}]},r={className:"literal",begin:/\bon|off|true|false|yes|no\b/},l={
className:"string",contains:[s.BACKSLASH_ESCAPE],variants:[{begin:"'''",
end:"'''",relevance:10},{begin:'"""',end:'"""',relevance:10},{begin:'"',end:'"'
},{begin:"'",end:"'"}]},c={begin:/\[/,end:/\]/,contains:[i,r,t,l,a,"self"],
relevance:0
},g="("+[/[A-Za-z0-9_-]+/,/"(\\"|[^"])*"/,/'[^']*'/].map((n=>e(n))).join("|")+")"
;return{name:"TOML, also INI",aliases:["toml"],case_insensitive:!0,illegal:/\S/,
contains:[i,{className:"section",begin:/\[+/,end:/\]+/},{
begin:n(g,"(\\s*\\.\\s*",g,")*",n("(?=",/\s*=\s*[^#\s]/,")")),className:"attr",
starts:{end:/$/,contains:[i,c,r,t,l,a]}}]}}})());hljs.registerLanguage("typescript",(()=>{"use strict"
;const e="[A-Za-z$_][0-9A-Za-z$_]*",n=["as","in","of","if","for","while","finally","var","new","function","do","return","void","else","break","catch","instanceof","with","throw","case","default","try","switch","continue","typeof","delete","let","yield","const","class","debugger","async","await","static","import","from","export","extends"],a=["true","false","null","undefined","NaN","Infinity"],s=[].concat(["setInterval","setTimeout","clearInterval","clearTimeout","require","exports","eval","isFinite","isNaN","parseFloat","parseInt","decodeURI","decodeURIComponent","encodeURI","encodeURIComponent","escape","unescape"],["arguments","this","super","console","window","document","localStorage","module","global"],["Intl","DataView","Number","Math","Date","String","RegExp","Object","Function","Boolean","Error","Symbol","Set","Map","WeakSet","WeakMap","Proxy","Reflect","JSON","Promise","Float64Array","Int16Array","Int32Array","Int8Array","Uint16Array","Uint32Array","Float32Array","Array","Uint8Array","Uint8ClampedArray","ArrayBuffer"],["EvalError","InternalError","RangeError","ReferenceError","SyntaxError","TypeError","URIError"])
;function t(e){return i("(?=",e,")")}function i(...e){return e.map((e=>{
return(n=e)?"string"==typeof n?n:n.source:null;var n})).join("")}return r=>{
const c={$pattern:e,
keyword:n.concat(["type","namespace","typedef","interface","public","private","protected","implements","declare","abstract","readonly"]).join(" "),
literal:a.join(" "),
built_in:s.concat(["any","void","number","boolean","string","object","never","enum"]).join(" ")
},o={className:"meta",begin:"@[A-Za-z$_][0-9A-Za-z$_]*"},l=(e,n,a)=>{
const s=e.contains.findIndex((e=>e.label===n))
;if(-1===s)throw Error("can not find mode to replace");e.contains.splice(s,1,a)
},b=(r=>{const c=e,o={begin:/<[A-Za-z0-9\\._:-]+/,
end:/\/[A-Za-z0-9\\._:-]+>|\/>/,isTrulyOpeningTag:(e,n)=>{
const a=e[0].length+e.index,s=e.input[a];"<"!==s?">"===s&&(((e,{after:n})=>{
const a="</"+e[0].slice(1);return-1!==e.input.indexOf(a,n)})(e,{after:a
})||n.ignoreMatch()):n.ignoreMatch()}},l={$pattern:e,keyword:n.join(" "),
literal:a.join(" "),built_in:s.join(" ")
},b="\\.([0-9](_?[0-9])*)",d="0|[1-9](_?[0-9])*|0[0-7]*[89][0-9]*",g={
className:"number",variants:[{
begin:`(\\b(${d})((${b})|\\.)?|(${b}))[eE][+-]?([0-9](_?[0-9])*)\\b`},{
begin:`\\b(${d})\\b((${b})\\b|\\.)?|(${b})\\b`},{
begin:"\\b(0|[1-9](_?[0-9])*)n\\b"},{
begin:"\\b0[xX][0-9a-fA-F](_?[0-9a-fA-F])*n?\\b"},{
begin:"\\b0[bB][0-1](_?[0-1])*n?\\b"},{begin:"\\b0[oO][0-7](_?[0-7])*n?\\b"},{
begin:"\\b0[0-7]+n?\\b"}],relevance:0},u={className:"subst",begin:"\\$\\{",
end:"\\}",keywords:l,contains:[]},E={begin:"html`",end:"",starts:{end:"`",
returnEnd:!1,contains:[r.BACKSLASH_ESCAPE,u],subLanguage:"xml"}},m={
begin:"css`",end:"",starts:{end:"`",returnEnd:!1,
contains:[r.BACKSLASH_ESCAPE,u],subLanguage:"css"}},_={className:"string",
begin:"`",end:"`",contains:[r.BACKSLASH_ESCAPE,u]},y={className:"comment",
variants:[r.COMMENT("/\\*\\*","\\*/",{relevance:0,contains:[{className:"doctag",
begin:"@[A-Za-z]+",contains:[{className:"type",begin:"\\{",end:"\\}",relevance:0
},{className:"variable",begin:c+"(?=\\s*(-)|$)",endsParent:!0,relevance:0},{
begin:/(?=[^\n])\s/,relevance:0}]}]
}),r.C_BLOCK_COMMENT_MODE,r.C_LINE_COMMENT_MODE]
},p=[r.APOS_STRING_MODE,r.QUOTE_STRING_MODE,E,m,_,g,r.REGEXP_MODE]
;u.contains=p.concat({begin:/\{/,end:/\}/,keywords:l,contains:["self"].concat(p)
});const N=[].concat(y,u.contains),f=N.concat([{begin:/\(/,end:/\)/,keywords:l,
contains:["self"].concat(N)}]),A={className:"params",begin:/\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,keywords:l,contains:f};return{name:"Javascript",
aliases:["js","jsx","mjs","cjs"],keywords:l,exports:{PARAMS_CONTAINS:f},
illegal:/#(?![$_A-z])/,contains:[r.SHEBANG({label:"shebang",binary:"node",
relevance:5}),{label:"use_strict",className:"meta",relevance:10,
begin:/^\s*['"]use (strict|asm)['"]/
},r.APOS_STRING_MODE,r.QUOTE_STRING_MODE,E,m,_,y,g,{
begin:i(/[{,\n]\s*/,t(i(/(((\/\/.*$)|(\/\*(\*[^/]|[^*])*\*\/))\s*)*/,c+"\\s*:"))),
relevance:0,contains:[{className:"attr",begin:c+t("\\s*:"),relevance:0}]},{
begin:"("+r.RE_STARTERS_RE+"|\\b(case|return|throw)\\b)\\s*",
keywords:"return throw case",contains:[y,r.REGEXP_MODE,{className:"function",
begin:"(\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)|"+r.UNDERSCORE_IDENT_RE+")\\s*=>",
returnBegin:!0,end:"\\s*=>",contains:[{className:"params",variants:[{
begin:r.UNDERSCORE_IDENT_RE,relevance:0},{className:null,begin:/\(\s*\)/,skip:!0
},{begin:/\(/,end:/\)/,excludeBegin:!0,excludeEnd:!0,keywords:l,contains:f}]}]
},{begin:/,/,relevance:0},{className:"",begin:/\s/,end:/\s*/,skip:!0},{
variants:[{begin:"<>",end:"</>"},{begin:o.begin,"on:begin":o.isTrulyOpeningTag,
end:o.end}],subLanguage:"xml",contains:[{begin:o.begin,end:o.end,skip:!0,
contains:["self"]}]}],relevance:0},{className:"function",
beginKeywords:"function",end:/[{;]/,excludeEnd:!0,keywords:l,
contains:["self",r.inherit(r.TITLE_MODE,{begin:c}),A],illegal:/%/},{
beginKeywords:"while if switch catch for"},{className:"function",
begin:r.UNDERSCORE_IDENT_RE+"\\([^()]*(\\([^()]*(\\([^()]*\\)[^()]*)*\\)[^()]*)*\\)\\s*\\{",
returnBegin:!0,contains:[A,r.inherit(r.TITLE_MODE,{begin:c})]},{variants:[{
begin:"\\."+c},{begin:"\\$"+c}],relevance:0},{className:"class",
beginKeywords:"class",end:/[{;=]/,excludeEnd:!0,illegal:/[:"[\]]/,contains:[{
beginKeywords:"extends"},r.UNDERSCORE_TITLE_MODE]},{begin:/\b(?=constructor)/,
end:/[{;]/,excludeEnd:!0,contains:[r.inherit(r.TITLE_MODE,{begin:c}),"self",A]
},{begin:"(get|set)\\s+(?="+c+"\\()",end:/\{/,keywords:"get set",
contains:[r.inherit(r.TITLE_MODE,{begin:c}),{begin:/\(\)/},A]},{begin:/\$[(.]/}]
}})(r)
;return Object.assign(b.keywords,c),b.exports.PARAMS_CONTAINS.push(o),b.contains=b.contains.concat([o,{
beginKeywords:"namespace",end:/\{/,excludeEnd:!0},{beginKeywords:"interface",
end:/\{/,excludeEnd:!0,keywords:"interface extends"
}]),l(b,"shebang",r.SHEBANG()),l(b,"use_strict",{className:"meta",relevance:10,
begin:/^\s*['"]use strict['"]/
}),b.contains.find((e=>"function"===e.className)).relevance=0,Object.assign(b,{
name:"TypeScript",aliases:["ts"]}),b}})());hljs.registerLanguage("powershell",(()=>{"use strict";return e=>{const n={
$pattern:/-?[A-z\.\-]+\b/,
keyword:"if else foreach return do while until elseif begin for trap data dynamicparam end break throw param continue finally in switch exit filter try process catch hidden static parameter",
built_in:"ac asnp cat cd CFS chdir clc clear clhy cli clp cls clv cnsn compare copy cp cpi cpp curl cvpa dbp del diff dir dnsn ebp echo|0 epal epcsv epsn erase etsn exsn fc fhx fl ft fw gal gbp gc gcb gci gcm gcs gdr gerr ghy gi gin gjb gl gm gmo gp gps gpv group gsn gsnp gsv gtz gu gv gwmi h history icm iex ihy ii ipal ipcsv ipmo ipsn irm ise iwmi iwr kill lp ls man md measure mi mount move mp mv nal ndr ni nmo npssc nsn nv ogv oh popd ps pushd pwd r rbp rcjb rcsn rd rdr ren ri rjb rm rmdir rmo rni rnp rp rsn rsnp rujb rv rvpa rwmi sajb sal saps sasv sbp sc scb select set shcm si sl sleep sls sort sp spjb spps spsv start stz sujb sv swmi tee trcm type wget where wjb write"
},s={begin:"`[\\s\\S]",relevance:0},i={className:"variable",variants:[{
begin:/\$\B/},{className:"keyword",begin:/\$this/},{begin:/\$[\w\d][\w\d_:]*/}]
},a={className:"string",variants:[{begin:/"/,end:/"/},{begin:/@"/,end:/^"@/}],
contains:[s,i,{className:"variable",begin:/\$[A-z]/,end:/[^A-z]/}]},t={
className:"string",variants:[{begin:/'/,end:/'/},{begin:/@'/,end:/^'@/}]
},r=e.inherit(e.COMMENT(null,null),{variants:[{begin:/#/,end:/$/},{begin:/<#/,
end:/#>/}],contains:[{className:"doctag",variants:[{
begin:/\.(synopsis|description|example|inputs|outputs|notes|link|component|role|functionality)/
},{
begin:/\.(parameter|forwardhelptargetname|forwardhelpcategory|remotehelprunspace|externalhelp)\s+\S+/
}]}]}),c={className:"class",beginKeywords:"class enum",end:/\s*[{]/,
excludeEnd:!0,relevance:0,contains:[e.TITLE_MODE]},l={className:"function",
begin:/function\s+/,end:/\s*\{|$/,excludeEnd:!0,returnBegin:!0,relevance:0,
contains:[{begin:"function",relevance:0,className:"keyword"},{className:"title",
begin:/\w[\w\d]*((-)[\w\d]+)*/,relevance:0},{begin:/\(/,end:/\)/,
className:"params",relevance:0,contains:[i]}]},o={begin:/using\s/,end:/$/,
returnBegin:!0,contains:[a,t,{className:"keyword",
begin:/(using|assembly|command|module|namespace|type)/}]},p={
className:"function",begin:/\[.*\]\s*[\w]+[ ]??\(/,end:/$/,returnBegin:!0,
relevance:0,contains:[{className:"keyword",
begin:"(".concat(n.keyword.toString().replace(/\s/g,"|"),")\\b"),endsParent:!0,
relevance:0},e.inherit(e.TITLE_MODE,{endsParent:!0})]
},g=[p,r,s,e.NUMBER_MODE,a,t,{className:"built_in",variants:[{
begin:"(Add|Clear|Close|Copy|Enter|Exit|Find|Format|Get|Hide|Join|Lock|Move|New|Open|Optimize|Pop|Push|Redo|Remove|Rename|Reset|Resize|Search|Select|Set|Show|Skip|Split|Step|Switch|Undo|Unlock|Watch|Backup|Checkpoint|Compare|Compress|Convert|ConvertFrom|ConvertTo|Dismount|Edit|Expand|Export|Group|Import|Initialize|Limit|Merge|Out|Publish|Restore|Save|Sync|Unpublish|Update|Approve|Assert|Complete|Confirm|Deny|Disable|Enable|Install|Invoke|Register|Request|Restart|Resume|Start|Stop|Submit|Suspend|Uninstall|Unregister|Wait|Debug|Measure|Ping|Repair|Resolve|Test|Trace|Connect|Disconnect|Read|Receive|Send|Write|Block|Grant|Protect|Revoke|Unblock|Unprotect|Use|ForEach|Sort|Tee|Where)+(-)[\\w\\d]+"
}]},i,{className:"literal",begin:/\$(null|true|false)\b/},{
className:"selector-tag",begin:/@\B/,relevance:0}],m={begin:/\[/,end:/\]/,
excludeBegin:!0,excludeEnd:!0,relevance:0,contains:[].concat("self",g,{
begin:"(string|char|byte|int|long|bool|decimal|single|double|DateTime|xml|array|hashtable|void)",
className:"built_in",relevance:0},{className:"type",begin:/[\.\w\d]+/,
relevance:0})};return p.contains.unshift(m),{name:"PowerShell",
aliases:["ps","ps1"],case_insensitive:!0,keywords:n,contains:g.concat(c,l,o,{
variants:[{className:"operator",
begin:"(-and|-as|-band|-bnot|-bor|-bxor|-casesensitive|-ccontains|-ceq|-cge|-cgt|-cle|-clike|-clt|-cmatch|-cne|-cnotcontains|-cnotlike|-cnotmatch|-contains|-creplace|-csplit|-eq|-exact|-f|-file|-ge|-gt|-icontains|-ieq|-ige|-igt|-ile|-ilike|-ilt|-imatch|-in|-ine|-inotcontains|-inotlike|-inotmatch|-ireplace|-is|-isnot|-isplit|-join|-le|-like|-lt|-match|-ne|-not|-notcontains|-notin|-notlike|-notmatch|-or|-regex|-replace|-shl|-shr|-split|-wildcard|-xor)\\b"
},{className:"literal",begin:/(-)[\w\d]+/,relevance:0}]},m)}}})());hljs.registerLanguage("c-like",(()=>{"use strict";function e(e){
return((...e)=>e.map((e=>(e=>e?"string"==typeof e?e:e.source:null)(e))).join(""))("(",e,")?")
}return t=>{const n=t.COMMENT("//","$",{contains:[{begin:/\\\n/}]
}),r="[a-zA-Z_]\\w*::",a="(decltype\\(auto\\)|"+e(r)+"[a-zA-Z_]\\w*"+e("<[^<>]+>")+")",i={
className:"keyword",begin:"\\b[a-z\\d_]*_t\\b"},s={className:"string",
variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",
contains:[t.BACKSLASH_ESCAPE]},{
begin:"(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
end:"'",illegal:"."},t.END_SAME_AS_BEGIN({
begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},o={
className:"number",variants:[{begin:"\\b(0b[01']+)"},{
begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{
begin:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
}],relevance:0},c={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{
"meta-keyword":"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
},contains:[{begin:/\\\n/,relevance:0},t.inherit(s,{className:"meta-string"}),{
className:"meta-string",begin:/<.*?>/,end:/$/,illegal:"\\n"
},n,t.C_BLOCK_COMMENT_MODE]},l={className:"title",begin:e(r)+t.IDENT_RE,
relevance:0},d=e(r)+t.IDENT_RE+"\\s*\\(",u={
keyword:"int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
literal:"true false nullptr NULL"},m=[c,i,n,t.C_BLOCK_COMMENT_MODE,o,s],p={
variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{
beginKeywords:"new throw return else",end:/;/}],keywords:u,contains:m.concat([{
begin:/\(/,end:/\)/,keywords:u,contains:m.concat(["self"]),relevance:0}]),
relevance:0},_={className:"function",begin:"("+a+"[\\*&\\s]+)+"+d,
returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:u,illegal:/[^\w\s\*&:<>]/,
contains:[{begin:"decltype\\(auto\\)",keywords:u,relevance:0},{begin:d,
returnBegin:!0,contains:[l],relevance:0},{className:"params",begin:/\(/,
end:/\)/,keywords:u,relevance:0,contains:[n,t.C_BLOCK_COMMENT_MODE,s,o,i,{
begin:/\(/,end:/\)/,keywords:u,relevance:0,
contains:["self",n,t.C_BLOCK_COMMENT_MODE,s,o,i]}]
},i,n,t.C_BLOCK_COMMENT_MODE,c]};return{
aliases:["c","cc","h","c++","h++","hpp","hh","hxx","cxx"],keywords:u,
disableAutodetect:!0,illegal:"</",contains:[].concat(p,_,m,[c,{
begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
end:">",keywords:u,contains:["self",i]},{begin:t.IDENT_RE+"::",keywords:u},{
className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,
contains:[{beginKeywords:"final class struct"},t.TITLE_MODE]}]),exports:{
preprocessor:c,strings:s,keywords:u}}}})());hljs.registerLanguage("plaintext",(()=>{"use strict";return t=>({
name:"Plain text",aliases:["text","txt"],disableAutodetect:!0})})());hljs.registerLanguage("verilog",(()=>{"use strict";return e=>({name:"Verilog",
aliases:["v","sv","svh"],case_insensitive:!1,keywords:{$pattern:/[\w\$]+/,
keyword:"accept_on alias always always_comb always_ff always_latch and assert assign assume automatic before begin bind bins binsof bit break buf|0 bufif0 bufif1 byte case casex casez cell chandle checker class clocking cmos config const constraint context continue cover covergroup coverpoint cross deassign default defparam design disable dist do edge else end endcase endchecker endclass endclocking endconfig endfunction endgenerate endgroup endinterface endmodule endpackage endprimitive endprogram endproperty endspecify endsequence endtable endtask enum event eventually expect export extends extern final first_match for force foreach forever fork forkjoin function generate|5 genvar global highz0 highz1 if iff ifnone ignore_bins illegal_bins implements implies import incdir include initial inout input inside instance int integer interconnect interface intersect join join_any join_none large let liblist library local localparam logic longint macromodule matches medium modport module nand negedge nettype new nexttime nmos nor noshowcancelled not notif0 notif1 or output package packed parameter pmos posedge primitive priority program property protected pull0 pull1 pulldown pullup pulsestyle_ondetect pulsestyle_onevent pure rand randc randcase randsequence rcmos real realtime ref reg reject_on release repeat restrict return rnmos rpmos rtran rtranif0 rtranif1 s_always s_eventually s_nexttime s_until s_until_with scalared sequence shortint shortreal showcancelled signed small soft solve specify specparam static string strong strong0 strong1 struct super supply0 supply1 sync_accept_on sync_reject_on table tagged task this throughout time timeprecision timeunit tran tranif0 tranif1 tri tri0 tri1 triand trior trireg type typedef union unique unique0 unsigned until until_with untyped use uwire var vectored virtual void wait wait_order wand weak weak0 weak1 while wildcard wire with within wor xnor xor",
literal:"null",
built_in:"$finish $stop $exit $fatal $error $warning $info $realtime $time $printtimescale $bitstoreal $bitstoshortreal $itor $signed $cast $bits $stime $timeformat $realtobits $shortrealtobits $rtoi $unsigned $asserton $assertkill $assertpasson $assertfailon $assertnonvacuouson $assertoff $assertcontrol $assertpassoff $assertfailoff $assertvacuousoff $isunbounded $sampled $fell $changed $past_gclk $fell_gclk $changed_gclk $rising_gclk $steady_gclk $coverage_control $coverage_get $coverage_save $set_coverage_db_name $rose $stable $past $rose_gclk $stable_gclk $future_gclk $falling_gclk $changing_gclk $display $coverage_get_max $coverage_merge $get_coverage $load_coverage_db $typename $unpacked_dimensions $left $low $increment $clog2 $ln $log10 $exp $sqrt $pow $floor $ceil $sin $cos $tan $countbits $onehot $isunknown $fatal $warning $dimensions $right $high $size $asin $acos $atan $atan2 $hypot $sinh $cosh $tanh $asinh $acosh $atanh $countones $onehot0 $error $info $random $dist_chi_square $dist_erlang $dist_exponential $dist_normal $dist_poisson $dist_t $dist_uniform $q_initialize $q_remove $q_exam $async$and$array $async$nand$array $async$or$array $async$nor$array $sync$and$array $sync$nand$array $sync$or$array $sync$nor$array $q_add $q_full $psprintf $async$and$plane $async$nand$plane $async$or$plane $async$nor$plane $sync$and$plane $sync$nand$plane $sync$or$plane $sync$nor$plane $system $display $displayb $displayh $displayo $strobe $strobeb $strobeh $strobeo $write $readmemb $readmemh $writememh $value$plusargs $dumpvars $dumpon $dumplimit $dumpports $dumpportson $dumpportslimit $writeb $writeh $writeo $monitor $monitorb $monitorh $monitoro $writememb $dumpfile $dumpoff $dumpall $dumpflush $dumpportsoff $dumpportsall $dumpportsflush $fclose $fdisplay $fdisplayb $fdisplayh $fdisplayo $fstrobe $fstrobeb $fstrobeh $fstrobeo $swrite $swriteb $swriteh $swriteo $fscanf $fread $fseek $fflush $feof $fopen $fwrite $fwriteb $fwriteh $fwriteo $fmonitor $fmonitorb $fmonitorh $fmonitoro $sformat $sformatf $fgetc $ungetc $fgets $sscanf $rewind $ftell $ferror"
},contains:[e.C_BLOCK_COMMENT_MODE,e.C_LINE_COMMENT_MODE,e.QUOTE_STRING_MODE,{
className:"number",contains:[e.BACKSLASH_ESCAPE],variants:[{
begin:"\\b((\\d+'(b|h|o|d|B|H|O|D))[0-9xzXZa-fA-F_]+)"},{
begin:"\\B(('(b|h|o|d|B|H|O|D))[0-9xzXZa-fA-F_]+)"},{begin:"\\b([0-9_])+",
relevance:0}]},{className:"variable",variants:[{begin:"#\\((?!parameter).+\\)"
},{begin:"\\.\\w+",relevance:0}]},{className:"meta",begin:"`",end:"$",keywords:{
"meta-keyword":"define __FILE__ __LINE__ begin_keywords celldefine default_nettype define else elsif end_keywords endcelldefine endif ifdef ifndef include line nounconnected_drive pragma resetall timescale unconnected_drive undef undefineall"
},relevance:0}]})})());hljs.registerLanguage("json",(()=>{"use strict";return n=>{const e={
literal:"true false null"
},i=[n.C_LINE_COMMENT_MODE,n.C_BLOCK_COMMENT_MODE],a=[n.QUOTE_STRING_MODE,n.C_NUMBER_MODE],l={
end:",",endsWithParent:!0,excludeEnd:!0,contains:a,keywords:e},t={begin:/\{/,
end:/\}/,contains:[{className:"attr",begin:/"/,end:/"/,
contains:[n.BACKSLASH_ESCAPE],illegal:"\\n"},n.inherit(l,{begin:/:/
})].concat(i),illegal:"\\S"},s={begin:"\\[",end:"\\]",contains:[n.inherit(l)],
illegal:"\\S"};return a.push(t,s),i.forEach((n=>{a.push(n)})),{name:"JSON",
contains:a,keywords:e,illegal:"\\S"}}})());hljs.registerLanguage("erb",(()=>{"use strict";return e=>({name:"ERB",
subLanguage:"xml",contains:[e.COMMENT("<%#","%>"),{begin:"<%[%=-]?",
end:"[%-]?%>",subLanguage:"ruby",excludeBegin:!0,excludeEnd:!0}]})})());hljs.registerLanguage("objectivec",(()=>{"use strict";return e=>{
const n=/[a-zA-Z@][a-zA-Z0-9_]*/,_={$pattern:n,
keyword:"@interface @class @protocol @implementation"};return{
name:"Objective-C",aliases:["mm","objc","obj-c","obj-c++","objective-c++"],
keywords:{$pattern:n,
keyword:"int float while char export sizeof typedef const struct for union unsigned long volatile static bool mutable if do return goto void enum else break extern asm case short default double register explicit signed typename this switch continue wchar_t inline readonly assign readwrite self @synchronized id typeof nonatomic super unichar IBOutlet IBAction strong weak copy in out inout bycopy byref oneway __strong __weak __block __autoreleasing @private @protected @public @try @property @end @throw @catch @finally @autoreleasepool @synthesize @dynamic @selector @optional @required @encode @package @import @defs @compatibility_alias __bridge __bridge_transfer __bridge_retained __bridge_retain __covariant __contravariant __kindof _Nonnull _Nullable _Null_unspecified __FUNCTION__ __PRETTY_FUNCTION__ __attribute__ getter setter retain unsafe_unretained nonnull nullable null_unspecified null_resettable class instancetype NS_DESIGNATED_INITIALIZER NS_UNAVAILABLE NS_REQUIRES_SUPER NS_RETURNS_INNER_POINTER NS_INLINE NS_AVAILABLE NS_DEPRECATED NS_ENUM NS_OPTIONS NS_SWIFT_UNAVAILABLE NS_ASSUME_NONNULL_BEGIN NS_ASSUME_NONNULL_END NS_REFINED_FOR_SWIFT NS_SWIFT_NAME NS_SWIFT_NOTHROW NS_DURING NS_HANDLER NS_ENDHANDLER NS_VALUERETURN NS_VOIDRETURN",
literal:"false true FALSE TRUE nil YES NO NULL",
built_in:"BOOL dispatch_once_t dispatch_queue_t dispatch_sync dispatch_async dispatch_once"
},illegal:"</",contains:[{className:"built_in",
begin:"\\b(AV|CA|CF|CG|CI|CL|CM|CN|CT|MK|MP|MTK|MTL|NS|SCN|SK|UI|WK|XC)\\w+"
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.C_NUMBER_MODE,e.QUOTE_STRING_MODE,e.APOS_STRING_MODE,{
className:"string",variants:[{begin:'@"',end:'"',illegal:"\\n",
contains:[e.BACKSLASH_ESCAPE]}]},{className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,
keywords:{
"meta-keyword":"if else elif endif define undef warning error line pragma ifdef ifndef include"
},contains:[{begin:/\\\n/,relevance:0},e.inherit(e.QUOTE_STRING_MODE,{
className:"meta-string"}),{className:"meta-string",begin:/<.*?>/,end:/$/,
illegal:"\\n"},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE]},{
className:"class",begin:"("+_.keyword.split(" ").join("|")+")\\b",end:/(\{|$)/,
excludeEnd:!0,keywords:_,contains:[e.UNDERSCORE_TITLE_MODE]},{
begin:"\\."+e.UNDERSCORE_IDENT_RE,relevance:0}]}}})());hljs.registerLanguage("applescript",(()=>{"use strict";return e=>{
const t=e.inherit(e.QUOTE_STRING_MODE,{illegal:""}),r={className:"params",
begin:"\\(",end:"\\)",contains:["self",e.C_NUMBER_MODE,t]
},i=e.COMMENT("--","$"),n=[i,e.COMMENT("\\(\\*","\\*\\)",{contains:["self",i]
}),e.HASH_COMMENT_MODE];return{name:"AppleScript",aliases:["osascript"],
keywords:{
keyword:"about above after against and around as at back before beginning behind below beneath beside between but by considering contain contains continue copy div does eighth else end equal equals error every exit fifth first for fourth from front get given global if ignoring in into is it its last local me middle mod my ninth not of on onto or over prop property put ref reference repeat returning script second set seventh since sixth some tell tenth that the|0 then third through thru timeout times to transaction try until where while whose with without",
literal:"AppleScript false linefeed return pi quote result space tab true",
built_in:"alias application boolean class constant date file integer list number real record string text activate beep count delay launch log offset read round run say summarize write character characters contents day frontmost id item length month name paragraph paragraphs rest reverse running time version weekday word words year"
},contains:[t,e.C_NUMBER_MODE,{className:"built_in",
begin:"\\b(clipboard info|the clipboard|info for|list (disks|folder)|mount volume|path to|(close|open for) access|(get|set) eof|current date|do shell script|get volume settings|random number|set volume|system attribute|system info|time to GMT|(load|run|store) script|scripting components|ASCII (character|number)|localized string|choose (application|color|file|file name|folder|from list|remote application|URL)|display (alert|dialog))\\b|^\\s*return\\b"
},{className:"literal",
begin:"\\b(text item delimiters|current application|missing value)\\b"},{
className:"keyword",
begin:"\\b(apart from|aside from|instead of|out of|greater than|isn't|(doesn't|does not) (equal|come before|come after|contain)|(greater|less) than( or equal)?|(starts?|ends|begins?) with|contained by|comes (before|after)|a (ref|reference)|POSIX file|POSIX path|(date|time) string|quoted form)\\b"
},{beginKeywords:"on",illegal:"[${=;\\n]",contains:[e.UNDERSCORE_TITLE_MODE,r]
}].concat(n),illegal:"//|->|=>|\\[\\["}}})());hljs.registerLanguage("nginx",(()=>{"use strict";return e=>{const n={
className:"variable",variants:[{begin:/\$\d+/},{begin:/\$\{/,end:/\}/},{
begin:/[$@]/+e.UNDERSCORE_IDENT_RE}]},a={endsWithParent:!0,keywords:{
$pattern:"[a-z/_]+",
literal:"on off yes no true false none blocked debug info notice warn error crit select break last permanent redirect kqueue rtsig epoll poll /dev/poll"
},relevance:0,illegal:"=>",contains:[e.HASH_COMMENT_MODE,{className:"string",
contains:[e.BACKSLASH_ESCAPE,n],variants:[{begin:/"/,end:/"/},{begin:/'/,end:/'/
}]},{begin:"([a-z]+):/",end:"\\s",endsWithParent:!0,excludeEnd:!0,contains:[n]
},{className:"regexp",contains:[e.BACKSLASH_ESCAPE,n],variants:[{begin:"\\s\\^",
end:"\\s|\\{|;",returnEnd:!0},{begin:"~\\*?\\s+",end:"\\s|\\{|;",returnEnd:!0},{
begin:"\\*(\\.[a-z\\-]+)+"},{begin:"([a-z\\-]+\\.)+\\*"}]},{className:"number",
begin:"\\b\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}(:\\d{1,5})?\\b"},{
className:"number",begin:"\\b\\d+[kKmMgGdshdwy]*\\b",relevance:0},n]};return{
name:"Nginx config",aliases:["nginxconf"],contains:[e.HASH_COMMENT_MODE,{
begin:e.UNDERSCORE_IDENT_RE+"\\s+\\{",returnBegin:!0,end:/\{/,contains:[{
className:"section",begin:e.UNDERSCORE_IDENT_RE}],relevance:0},{
begin:e.UNDERSCORE_IDENT_RE+"\\s",end:";|\\{",returnBegin:!0,contains:[{
className:"attribute",begin:e.UNDERSCORE_IDENT_RE,starts:a}],relevance:0}],
illegal:"[^\\s\\}]"}}})());hljs.registerLanguage("http",(()=>{"use strict";return e=>{
var n="HTTP/[0-9\\.]+";return{name:"HTTP",aliases:["https"],illegal:"\\S",
contains:[{begin:"^"+n,end:"$",contains:[{className:"number",
begin:"\\b\\d{3}\\b"}]},{begin:"^[A-Z]+ (.*?) "+n+"$",returnBegin:!0,end:"$",
contains:[{className:"string",begin:" ",end:" ",excludeBegin:!0,excludeEnd:!0},{
begin:n},{className:"keyword",begin:"[A-Z]+"}]},{className:"attribute",
begin:"^\\w",end:": ",excludeEnd:!0,illegal:"\\n|\\s|=",starts:{end:"$",
relevance:0}},{begin:"\\n\\n",starts:{subLanguage:[],endsWithParent:!0}}]}}
})());hljs.registerLanguage("markdown",(()=>{"use strict";function n(...n){
return n.map((n=>{return(e=n)?"string"==typeof e?e:e.source:null;var e
})).join("")}return e=>{const a={begin:/<\/?[A-Za-z_]/,end:">",
subLanguage:"xml",relevance:0},i={variants:[{begin:/\[.+?\]\[.*?\]/,relevance:0
},{begin:/\[.+?\]\(((data|javascript|mailto):|(?:http|ftp)s?:\/\/).*?\)/,
relevance:2},{begin:n(/\[.+?\]\(/,/[A-Za-z][A-Za-z0-9+.-]*/,/:\/\/.*?\)/),
relevance:2},{begin:/\[.+?\]\([./?&#].*?\)/,relevance:1},{
begin:/\[.+?\]\(.*?\)/,relevance:0}],returnBegin:!0,contains:[{
className:"string",relevance:0,begin:"\\[",end:"\\]",excludeBegin:!0,
returnEnd:!0},{className:"link",relevance:0,begin:"\\]\\(",end:"\\)",
excludeBegin:!0,excludeEnd:!0},{className:"symbol",relevance:0,begin:"\\]\\[",
end:"\\]",excludeBegin:!0,excludeEnd:!0}]},s={className:"strong",contains:[],
variants:[{begin:/_{2}/,end:/_{2}/},{begin:/\*{2}/,end:/\*{2}/}]},c={
className:"emphasis",contains:[],variants:[{begin:/\*(?!\*)/,end:/\*/},{
begin:/_(?!_)/,end:/_/,relevance:0}]};s.contains.push(c),c.contains.push(s)
;let t=[a,i]
;return s.contains=s.contains.concat(t),c.contains=c.contains.concat(t),
t=t.concat(s,c),{name:"Markdown",aliases:["md","mkdown","mkd"],contains:[{
className:"section",variants:[{begin:"^#{1,6}",end:"$",contains:t},{
begin:"(?=^.+?\\n[=-]{2,}$)",contains:[{begin:"^[=-]*$"},{begin:"^",end:"\\n",
contains:t}]}]},a,{className:"bullet",begin:"^[ \t]*([*+-]|(\\d+\\.))(?=\\s+)",
end:"\\s+",excludeEnd:!0},s,c,{className:"quote",begin:"^>\\s+",contains:t,
end:"$"},{className:"code",variants:[{begin:"(`{3,})[^`](.|\\n)*?\\1`*[ ]*"},{
begin:"(~{3,})[^~](.|\\n)*?\\1~*[ ]*"},{begin:"```",end:"```+[ ]*$"},{
begin:"~~~",end:"~~~+[ ]*$"},{begin:"`.+?`"},{begin:"(?=^( {4}|\\t))",
contains:[{begin:"^( {4}|\\t)",end:"(\\n)$"}],relevance:0}]},{
begin:"^[-\\*]{3,}",end:"$"},i,{begin:/^\[[^\n]+\]:/,returnBegin:!0,contains:[{
className:"symbol",begin:/\[/,end:/\]/,excludeBegin:!0,excludeEnd:!0},{
className:"link",begin:/:\s*/,end:/$/,excludeBegin:!0}]}]}}})());hljs.registerLanguage("mipsasm",(()=>{"use strict";return e=>({
name:"MIPS Assembly",case_insensitive:!0,aliases:["mips"],keywords:{
$pattern:"\\.?"+e.IDENT_RE,
meta:".2byte .4byte .align .ascii .asciz .balign .byte .code .data .else .end .endif .endm .endr .equ .err .exitm .extern .global .hword .if .ifdef .ifndef .include .irp .long .macro .rept .req .section .set .skip .space .text .word .ltorg ",
built_in:"$0 $1 $2 $3 $4 $5 $6 $7 $8 $9 $10 $11 $12 $13 $14 $15 $16 $17 $18 $19 $20 $21 $22 $23 $24 $25 $26 $27 $28 $29 $30 $31 zero at v0 v1 a0 a1 a2 a3 a4 a5 a6 a7 t0 t1 t2 t3 t4 t5 t6 t7 t8 t9 s0 s1 s2 s3 s4 s5 s6 s7 s8 k0 k1 gp sp fp ra $f0 $f1 $f2 $f2 $f4 $f5 $f6 $f7 $f8 $f9 $f10 $f11 $f12 $f13 $f14 $f15 $f16 $f17 $f18 $f19 $f20 $f21 $f22 $f23 $f24 $f25 $f26 $f27 $f28 $f29 $f30 $f31 Context Random EntryLo0 EntryLo1 Context PageMask Wired EntryHi HWREna BadVAddr Count Compare SR IntCtl SRSCtl SRSMap Cause EPC PRId EBase Config Config1 Config2 Config3 LLAddr Debug DEPC DESAVE CacheErr ECC ErrorEPC TagLo DataLo TagHi DataHi WatchLo WatchHi PerfCtl PerfCnt "
},contains:[{className:"keyword",
begin:"\\b(addi?u?|andi?|b(al)?|beql?|bgez(al)?l?|bgtzl?|blezl?|bltz(al)?l?|bnel?|cl[oz]|divu?|ext|ins|j(al)?|jalr(\\.hb)?|jr(\\.hb)?|lbu?|lhu?|ll|lui|lw[lr]?|maddu?|mfhi|mflo|movn|movz|move|msubu?|mthi|mtlo|mul|multu?|nop|nor|ori?|rotrv?|sb|sc|se[bh]|sh|sllv?|slti?u?|srav?|srlv?|subu?|sw[lr]?|xori?|wsbh|abs\\.[sd]|add\\.[sd]|alnv.ps|bc1[ft]l?|c\\.(s?f|un|u?eq|[ou]lt|[ou]le|ngle?|seq|l[et]|ng[et])\\.[sd]|(ceil|floor|round|trunc)\\.[lw]\\.[sd]|cfc1|cvt\\.d\\.[lsw]|cvt\\.l\\.[dsw]|cvt\\.ps\\.s|cvt\\.s\\.[dlw]|cvt\\.s\\.p[lu]|cvt\\.w\\.[dls]|div\\.[ds]|ldx?c1|luxc1|lwx?c1|madd\\.[sd]|mfc1|mov[fntz]?\\.[ds]|msub\\.[sd]|mth?c1|mul\\.[ds]|neg\\.[ds]|nmadd\\.[ds]|nmsub\\.[ds]|p[lu][lu]\\.ps|recip\\.fmt|r?sqrt\\.[ds]|sdx?c1|sub\\.[ds]|suxc1|swx?c1|break|cache|d?eret|[de]i|ehb|mfc0|mtc0|pause|prefx?|rdhwr|rdpgpr|sdbbp|ssnop|synci?|syscall|teqi?|tgei?u?|tlb(p|r|w[ir])|tlti?u?|tnei?|wait|wrpgpr)",
end:"\\s"
},e.COMMENT("[;#](?!\\s*$)","$"),e.C_BLOCK_COMMENT_MODE,e.QUOTE_STRING_MODE,{
className:"string",begin:"'",end:"[^\\\\]'",relevance:0},{className:"title",
begin:"\\|",end:"\\|",illegal:"\\n",relevance:0},{className:"number",variants:[{
begin:"0x[0-9a-f]+"},{begin:"\\b-?\\d+"}],relevance:0},{className:"symbol",
variants:[{begin:"^\\s*[a-z_\\.\\$][a-z0-9_\\.\\$]+:"},{begin:"^\\s*[0-9]+:"},{
begin:"[0-9]+[bf]"}],relevance:0}],illegal:/\//})})());hljs.registerLanguage("basic",(()=>{"use strict";return E=>({name:"BASIC",
case_insensitive:!0,illegal:"^.",keywords:{$pattern:"[a-zA-Z][a-zA-Z0-9_$%!#]*",
keyword:"ABS ASC AND ATN AUTO|0 BEEP BLOAD|10 BSAVE|10 CALL CALLS CDBL CHAIN CHDIR CHR$|10 CINT CIRCLE CLEAR CLOSE CLS COLOR COM COMMON CONT COS CSNG CSRLIN CVD CVI CVS DATA DATE$ DEFDBL DEFINT DEFSNG DEFSTR DEF|0 SEG USR DELETE DIM DRAW EDIT END ENVIRON ENVIRON$ EOF EQV ERASE ERDEV ERDEV$ ERL ERR ERROR EXP FIELD FILES FIX FOR|0 FRE GET GOSUB|10 GOTO HEX$ IF THEN ELSE|0 INKEY$ INP INPUT INPUT# INPUT$ INSTR IMP INT IOCTL IOCTL$ KEY ON OFF LIST KILL LEFT$ LEN LET LINE LLIST LOAD LOC LOCATE LOF LOG LPRINT USING LSET MERGE MID$ MKDIR MKD$ MKI$ MKS$ MOD NAME NEW NEXT NOISE NOT OCT$ ON OR PEN PLAY STRIG OPEN OPTION BASE OUT PAINT PALETTE PCOPY PEEK PMAP POINT POKE POS PRINT PRINT] PSET PRESET PUT RANDOMIZE READ REM RENUM RESET|0 RESTORE RESUME RETURN|0 RIGHT$ RMDIR RND RSET RUN SAVE SCREEN SGN SHELL SIN SOUND SPACE$ SPC SQR STEP STICK STOP STR$ STRING$ SWAP SYSTEM TAB TAN TIME$ TIMER TROFF TRON TO USR VAL VARPTR VARPTR$ VIEW WAIT WHILE WEND WIDTH WINDOW WRITE XOR"
},contains:[E.QUOTE_STRING_MODE,E.COMMENT("REM","$",{relevance:10
}),E.COMMENT("'","$",{relevance:0}),{className:"symbol",begin:"^[0-9]+ ",
relevance:10},{className:"number",begin:"\\b\\d+(\\.\\d+)?([edED]\\d+)?[#!]?",
relevance:0},{className:"number",begin:"(&[hH][0-9a-fA-F]{1,4})"},{
className:"number",begin:"(&[oO][0-7]{1,6})"}]})})());hljs.registerLanguage("handlebars",(()=>{"use strict";function e(e){
return e?"string"==typeof e?e:e.source:null}function n(...n){
return n.map((n=>e(n))).join("")}return a=>{const t={
"builtin-name":"action bindattr collection component concat debugger each each-in get hash if in input link-to loc log lookup mut outlet partial query-params render template textarea unbound unless view with yield"
},s=/\[\]|\[[^\]]+\]/,i=/[^\s!"#%&'()*+,.\/;<=>@\[\\\]^`{|}~]+/,r=((...n)=>"("+n.map((n=>e(n))).join("|")+")")(/""|"[^"]+"/,/''|'[^']+'/,s,i),l=n(n("(",/\.|\.\/|\//,")?"),r,(h=n(/(\.|\/)/,r),
n("(",h,")*"))),c=n("(",s,"|",i,")(?==)"),o={begin:l,lexemes:/[\w.\/]+/
},m=a.inherit(o,{keywords:{literal:"true false undefined null"}}),d={begin:/\(/,
end:/\)/},g={className:"attr",begin:c,relevance:0,starts:{begin:/=/,end:/=/,
starts:{contains:[a.NUMBER_MODE,a.QUOTE_STRING_MODE,a.APOS_STRING_MODE,m,d]}}
},b={contains:[a.NUMBER_MODE,a.QUOTE_STRING_MODE,a.APOS_STRING_MODE,{
begin:/as\s+\|/,keywords:{keyword:"as"},end:/\|/,contains:[{begin:/\w+/}]
},g,m,d],returnEnd:!0},u=a.inherit(o,{className:"name",keywords:t,
starts:a.inherit(b,{end:/\)/})});var h;d.contains=[u];const N=a.inherit(o,{
keywords:t,className:"name",starts:a.inherit(b,{end:/\}\}/})}),p=a.inherit(o,{
keywords:t,className:"name"}),E=a.inherit(o,{className:"name",keywords:t,
starts:a.inherit(b,{end:/\}\}/})});return{name:"Handlebars",
aliases:["hbs","html.hbs","html.handlebars","htmlbars"],case_insensitive:!0,
subLanguage:"xml",contains:[{begin:/\\\{\{/,skip:!0},{begin:/\\\\(?=\{\{)/,
skip:!0},a.COMMENT(/\{\{!--/,/--\}\}/),a.COMMENT(/\{\{!/,/\}\}/),{
className:"template-tag",begin:/\{\{\{\{(?!\/)/,end:/\}\}\}\}/,contains:[N],
starts:{end:/\{\{\{\{\//,returnEnd:!0,subLanguage:"xml"}},{
className:"template-tag",begin:/\{\{\{\{\//,end:/\}\}\}\}/,contains:[p]},{
className:"template-tag",begin:/\{\{#/,end:/\}\}/,contains:[N]},{
className:"template-tag",begin:/\{\{(?=else\}\})/,end:/\}\}/,keywords:"else"},{
className:"template-tag",begin:/\{\{(?=else if)/,end:/\}\}/,keywords:"else if"
},{className:"template-tag",begin:/\{\{\//,end:/\}\}/,contains:[p]},{
className:"template-variable",begin:/\{\{\{/,end:/\}\}\}/,contains:[E]},{
className:"template-variable",begin:/\{\{/,end:/\}\}/,contains:[E]}]}}})());hljs.registerLanguage("less",(()=>{"use strict";return e=>{
var n="([\\w-]+|@\\{[\\w-]+\\})",a=[],s=[],t=e=>({className:"string",
begin:"~?"+e+".*?"+e}),r=(e,n,a)=>({className:e,begin:n,relevance:a}),i={
begin:"\\(",end:"\\)",contains:s,relevance:0}
;s.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,t("'"),t('"'),e.CSS_NUMBER_MODE,{
begin:"(url|data-uri)\\(",starts:{className:"string",end:"[\\)\\n]",
excludeEnd:!0}
},r("number","#[0-9A-Fa-f]+\\b"),i,r("variable","@@?[\\w-]+",10),r("variable","@\\{[\\w-]+\\}"),r("built_in","~?`[^`]*?`"),{
className:"attribute",begin:"[\\w-]+\\s*:",end:":",returnBegin:!0,excludeEnd:!0
},{className:"meta",begin:"!important"});var c=s.concat({begin:/\{/,end:/\}/,
contains:a}),l={beginKeywords:"when",endsWithParent:!0,contains:[{
beginKeywords:"and not"}].concat(s)},g={begin:n+"\\s*:",returnBegin:!0,
end:"[;}]",relevance:0,contains:[{className:"attribute",begin:n,end:":",
excludeEnd:!0,starts:{endsWithParent:!0,illegal:"[<=$]",relevance:0,contains:s}
}]},d={className:"keyword",
begin:"@(import|media|charset|font-face|(-[a-z]+-)?keyframes|supports|document|namespace|page|viewport|host)\\b",
starts:{end:"[;{}]",returnEnd:!0,contains:s,relevance:0}},o={
className:"variable",variants:[{begin:"@[\\w-]+\\s*:",relevance:15},{
begin:"@[\\w-]+"}],starts:{end:"[;}]",returnEnd:!0,contains:c}},b={variants:[{
begin:"[\\.#:&\\[>]",end:"[;{}]"},{begin:n,end:/\{/}],returnBegin:!0,
returnEnd:!0,illegal:"[<='$\"]",relevance:0,
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,l,r("keyword","all\\b"),r("variable","@\\{[\\w-]+\\}"),r("selector-tag",n+"%?",0),r("selector-id","#"+n),r("selector-class","\\."+n,0),r("selector-tag","&",0),{
className:"selector-attr",begin:"\\[",end:"\\]"},{className:"selector-pseudo",
begin:/:(:)?[a-zA-Z0-9_\-+()"'.]+/},{begin:"\\(",end:"\\)",contains:c},{
begin:"!important"}]}
;return a.push(e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,d,o,g,b),{
name:"Less",case_insensitive:!0,illegal:"[=>'/<($\"]",contains:a}}})());hljs.registerLanguage("gradle",(()=>{"use strict";return e=>({name:"Gradle",
case_insensitive:!0,keywords:{
keyword:"task project allprojects subprojects artifacts buildscript configurations dependencies repositories sourceSets description delete from into include exclude source classpath destinationDir includes options sourceCompatibility targetCompatibility group flatDir doLast doFirst flatten todir fromdir ant def abstract break case catch continue default do else extends final finally for if implements instanceof native new private protected public return static switch synchronized throw throws transient try volatile while strictfp package import false null super this true antlrtask checkstyle codenarc copy boolean byte char class double float int interface long short void compile runTime file fileTree abs any append asList asWritable call collect compareTo count div dump each eachByte eachFile eachLine every find findAll flatten getAt getErr getIn getOut getText grep immutable inject inspect intersect invokeMethods isCase join leftShift minus multiply newInputStream newOutputStream newPrintWriter newReader newWriter next plus pop power previous print println push putAt read readBytes readLines reverse reverseEach round size sort splitEachLine step subMap times toInteger toList tokenize upto waitForOrKill withPrintWriter withReader withStream withWriter withWriterAppend write writeLine"
},
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,e.NUMBER_MODE,e.REGEXP_MODE]
})})());hljs.registerLanguage("x86asm",(()=>{"use strict";return s=>({
name:"Intel x86 Assembly",case_insensitive:!0,keywords:{
$pattern:"[.%]?"+s.IDENT_RE,
keyword:"lock rep repe repz repne repnz xaquire xrelease bnd nobnd aaa aad aam aas adc add and arpl bb0_reset bb1_reset bound bsf bsr bswap bt btc btr bts call cbw cdq cdqe clc cld cli clts cmc cmp cmpsb cmpsd cmpsq cmpsw cmpxchg cmpxchg486 cmpxchg8b cmpxchg16b cpuid cpu_read cpu_write cqo cwd cwde daa das dec div dmint emms enter equ f2xm1 fabs fadd faddp fbld fbstp fchs fclex fcmovb fcmovbe fcmove fcmovnb fcmovnbe fcmovne fcmovnu fcmovu fcom fcomi fcomip fcomp fcompp fcos fdecstp fdisi fdiv fdivp fdivr fdivrp femms feni ffree ffreep fiadd ficom ficomp fidiv fidivr fild fimul fincstp finit fist fistp fisttp fisub fisubr fld fld1 fldcw fldenv fldl2e fldl2t fldlg2 fldln2 fldpi fldz fmul fmulp fnclex fndisi fneni fninit fnop fnsave fnstcw fnstenv fnstsw fpatan fprem fprem1 fptan frndint frstor fsave fscale fsetpm fsin fsincos fsqrt fst fstcw fstenv fstp fstsw fsub fsubp fsubr fsubrp ftst fucom fucomi fucomip fucomp fucompp fxam fxch fxtract fyl2x fyl2xp1 hlt ibts icebp idiv imul in inc incbin insb insd insw int int01 int1 int03 int3 into invd invpcid invlpg invlpga iret iretd iretq iretw jcxz jecxz jrcxz jmp jmpe lahf lar lds lea leave les lfence lfs lgdt lgs lidt lldt lmsw loadall loadall286 lodsb lodsd lodsq lodsw loop loope loopne loopnz loopz lsl lss ltr mfence monitor mov movd movq movsb movsd movsq movsw movsx movsxd movzx mul mwait neg nop not or out outsb outsd outsw packssdw packsswb packuswb paddb paddd paddsb paddsiw paddsw paddusb paddusw paddw pand pandn pause paveb pavgusb pcmpeqb pcmpeqd pcmpeqw pcmpgtb pcmpgtd pcmpgtw pdistib pf2id pfacc pfadd pfcmpeq pfcmpge pfcmpgt pfmax pfmin pfmul pfrcp pfrcpit1 pfrcpit2 pfrsqit1 pfrsqrt pfsub pfsubr pi2fd pmachriw pmaddwd pmagw pmulhriw pmulhrwa pmulhrwc pmulhw pmullw pmvgezb pmvlzb pmvnzb pmvzb pop popa popad popaw popf popfd popfq popfw por prefetch prefetchw pslld psllq psllw psrad psraw psrld psrlq psrlw psubb psubd psubsb psubsiw psubsw psubusb psubusw psubw punpckhbw punpckhdq punpckhwd punpcklbw punpckldq punpcklwd push pusha pushad pushaw pushf pushfd pushfq pushfw pxor rcl rcr rdshr rdmsr rdpmc rdtsc rdtscp ret retf retn rol ror rdm rsdc rsldt rsm rsts sahf sal salc sar sbb scasb scasd scasq scasw sfence sgdt shl shld shr shrd sidt sldt skinit smi smint smintold smsw stc std sti stosb stosd stosq stosw str sub svdc svldt svts swapgs syscall sysenter sysexit sysret test ud0 ud1 ud2b ud2 ud2a umov verr verw fwait wbinvd wrshr wrmsr xadd xbts xchg xlatb xlat xor cmove cmovz cmovne cmovnz cmova cmovnbe cmovae cmovnb cmovb cmovnae cmovbe cmovna cmovg cmovnle cmovge cmovnl cmovl cmovnge cmovle cmovng cmovc cmovnc cmovo cmovno cmovs cmovns cmovp cmovpe cmovnp cmovpo je jz jne jnz ja jnbe jae jnb jb jnae jbe jna jg jnle jge jnl jl jnge jle jng jc jnc jo jno js jns jpo jnp jpe jp sete setz setne setnz seta setnbe setae setnb setnc setb setnae setcset setbe setna setg setnle setge setnl setl setnge setle setng sets setns seto setno setpe setp setpo setnp addps addss andnps andps cmpeqps cmpeqss cmpleps cmpless cmpltps cmpltss cmpneqps cmpneqss cmpnleps cmpnless cmpnltps cmpnltss cmpordps cmpordss cmpunordps cmpunordss cmpps cmpss comiss cvtpi2ps cvtps2pi cvtsi2ss cvtss2si cvttps2pi cvttss2si divps divss ldmxcsr maxps maxss minps minss movaps movhps movlhps movlps movhlps movmskps movntps movss movups mulps mulss orps rcpps rcpss rsqrtps rsqrtss shufps sqrtps sqrtss stmxcsr subps subss ucomiss unpckhps unpcklps xorps fxrstor fxrstor64 fxsave fxsave64 xgetbv xsetbv xsave xsave64 xsaveopt xsaveopt64 xrstor xrstor64 prefetchnta prefetcht0 prefetcht1 prefetcht2 maskmovq movntq pavgb pavgw pextrw pinsrw pmaxsw pmaxub pminsw pminub pmovmskb pmulhuw psadbw pshufw pf2iw pfnacc pfpnacc pi2fw pswapd maskmovdqu clflush movntdq movnti movntpd movdqa movdqu movdq2q movq2dq paddq pmuludq pshufd pshufhw pshuflw pslldq psrldq psubq punpckhqdq punpcklqdq addpd addsd andnpd andpd cmpeqpd cmpeqsd cmplepd cmplesd cmpltpd cmpltsd cmpneqpd cmpneqsd cmpnlepd cmpnlesd cmpnltpd cmpnltsd cmpordpd cmpordsd cmpunordpd cmpunordsd cmppd comisd cvtdq2pd cvtdq2ps cvtpd2dq cvtpd2pi cvtpd2ps cvtpi2pd cvtps2dq cvtps2pd cvtsd2si cvtsd2ss cvtsi2sd cvtss2sd cvttpd2pi cvttpd2dq cvttps2dq cvttsd2si divpd divsd maxpd maxsd minpd minsd movapd movhpd movlpd movmskpd movupd mulpd mulsd orpd shufpd sqrtpd sqrtsd subpd subsd ucomisd unpckhpd unpcklpd xorpd addsubpd addsubps haddpd haddps hsubpd hsubps lddqu movddup movshdup movsldup clgi stgi vmcall vmclear vmfunc vmlaunch vmload vmmcall vmptrld vmptrst vmread vmresume vmrun vmsave vmwrite vmxoff vmxon invept invvpid pabsb pabsw pabsd palignr phaddw phaddd phaddsw phsubw phsubd phsubsw pmaddubsw pmulhrsw pshufb psignb psignw psignd extrq insertq movntsd movntss lzcnt blendpd blendps blendvpd blendvps dppd dpps extractps insertps movntdqa mpsadbw packusdw pblendvb pblendw pcmpeqq pextrb pextrd pextrq phminposuw pinsrb pinsrd pinsrq pmaxsb pmaxsd pmaxud pmaxuw pminsb pminsd pminud pminuw pmovsxbw pmovsxbd pmovsxbq pmovsxwd pmovsxwq pmovsxdq pmovzxbw pmovzxbd pmovzxbq pmovzxwd pmovzxwq pmovzxdq pmuldq pmulld ptest roundpd roundps roundsd roundss crc32 pcmpestri pcmpestrm pcmpistri pcmpistrm pcmpgtq popcnt getsec pfrcpv pfrsqrtv movbe aesenc aesenclast aesdec aesdeclast aesimc aeskeygenassist vaesenc vaesenclast vaesdec vaesdeclast vaesimc vaeskeygenassist vaddpd vaddps vaddsd vaddss vaddsubpd vaddsubps vandpd vandps vandnpd vandnps vblendpd vblendps vblendvpd vblendvps vbroadcastss vbroadcastsd vbroadcastf128 vcmpeq_ospd vcmpeqpd vcmplt_ospd vcmpltpd vcmple_ospd vcmplepd vcmpunord_qpd vcmpunordpd vcmpneq_uqpd vcmpneqpd vcmpnlt_uspd vcmpnltpd vcmpnle_uspd vcmpnlepd vcmpord_qpd vcmpordpd vcmpeq_uqpd vcmpnge_uspd vcmpngepd vcmpngt_uspd vcmpngtpd vcmpfalse_oqpd vcmpfalsepd vcmpneq_oqpd vcmpge_ospd vcmpgepd vcmpgt_ospd vcmpgtpd vcmptrue_uqpd vcmptruepd vcmplt_oqpd vcmple_oqpd vcmpunord_spd vcmpneq_uspd vcmpnlt_uqpd vcmpnle_uqpd vcmpord_spd vcmpeq_uspd vcmpnge_uqpd vcmpngt_uqpd vcmpfalse_ospd vcmpneq_ospd vcmpge_oqpd vcmpgt_oqpd vcmptrue_uspd vcmppd vcmpeq_osps vcmpeqps vcmplt_osps vcmpltps vcmple_osps vcmpleps vcmpunord_qps vcmpunordps vcmpneq_uqps vcmpneqps vcmpnlt_usps vcmpnltps vcmpnle_usps vcmpnleps vcmpord_qps vcmpordps vcmpeq_uqps vcmpnge_usps vcmpngeps vcmpngt_usps vcmpngtps vcmpfalse_oqps vcmpfalseps vcmpneq_oqps vcmpge_osps vcmpgeps vcmpgt_osps vcmpgtps vcmptrue_uqps vcmptrueps vcmplt_oqps vcmple_oqps vcmpunord_sps vcmpneq_usps vcmpnlt_uqps vcmpnle_uqps vcmpord_sps vcmpeq_usps vcmpnge_uqps vcmpngt_uqps vcmpfalse_osps vcmpneq_osps vcmpge_oqps vcmpgt_oqps vcmptrue_usps vcmpps vcmpeq_ossd vcmpeqsd vcmplt_ossd vcmpltsd vcmple_ossd vcmplesd vcmpunord_qsd vcmpunordsd vcmpneq_uqsd vcmpneqsd vcmpnlt_ussd vcmpnltsd vcmpnle_ussd vcmpnlesd vcmpord_qsd vcmpordsd vcmpeq_uqsd vcmpnge_ussd vcmpngesd vcmpngt_ussd vcmpngtsd vcmpfalse_oqsd vcmpfalsesd vcmpneq_oqsd vcmpge_ossd vcmpgesd vcmpgt_ossd vcmpgtsd vcmptrue_uqsd vcmptruesd vcmplt_oqsd vcmple_oqsd vcmpunord_ssd vcmpneq_ussd vcmpnlt_uqsd vcmpnle_uqsd vcmpord_ssd vcmpeq_ussd vcmpnge_uqsd vcmpngt_uqsd vcmpfalse_ossd vcmpneq_ossd vcmpge_oqsd vcmpgt_oqsd vcmptrue_ussd vcmpsd vcmpeq_osss vcmpeqss vcmplt_osss vcmpltss vcmple_osss vcmpless vcmpunord_qss vcmpunordss vcmpneq_uqss vcmpneqss vcmpnlt_usss vcmpnltss vcmpnle_usss vcmpnless vcmpord_qss vcmpordss vcmpeq_uqss vcmpnge_usss vcmpngess vcmpngt_usss vcmpngtss vcmpfalse_oqss vcmpfalsess vcmpneq_oqss vcmpge_osss vcmpgess vcmpgt_osss vcmpgtss vcmptrue_uqss vcmptruess vcmplt_oqss vcmple_oqss vcmpunord_sss vcmpneq_usss vcmpnlt_uqss vcmpnle_uqss vcmpord_sss vcmpeq_usss vcmpnge_uqss vcmpngt_uqss vcmpfalse_osss vcmpneq_osss vcmpge_oqss vcmpgt_oqss vcmptrue_usss vcmpss vcomisd vcomiss vcvtdq2pd vcvtdq2ps vcvtpd2dq vcvtpd2ps vcvtps2dq vcvtps2pd vcvtsd2si vcvtsd2ss vcvtsi2sd vcvtsi2ss vcvtss2sd vcvtss2si vcvttpd2dq vcvttps2dq vcvttsd2si vcvttss2si vdivpd vdivps vdivsd vdivss vdppd vdpps vextractf128 vextractps vhaddpd vhaddps vhsubpd vhsubps vinsertf128 vinsertps vlddqu vldqqu vldmxcsr vmaskmovdqu vmaskmovps vmaskmovpd vmaxpd vmaxps vmaxsd vmaxss vminpd vminps vminsd vminss vmovapd vmovaps vmovd vmovq vmovddup vmovdqa vmovqqa vmovdqu vmovqqu vmovhlps vmovhpd vmovhps vmovlhps vmovlpd vmovlps vmovmskpd vmovmskps vmovntdq vmovntqq vmovntdqa vmovntpd vmovntps vmovsd vmovshdup vmovsldup vmovss vmovupd vmovups vmpsadbw vmulpd vmulps vmulsd vmulss vorpd vorps vpabsb vpabsw vpabsd vpacksswb vpackssdw vpackuswb vpackusdw vpaddb vpaddw vpaddd vpaddq vpaddsb vpaddsw vpaddusb vpaddusw vpalignr vpand vpandn vpavgb vpavgw vpblendvb vpblendw vpcmpestri vpcmpestrm vpcmpistri vpcmpistrm vpcmpeqb vpcmpeqw vpcmpeqd vpcmpeqq vpcmpgtb vpcmpgtw vpcmpgtd vpcmpgtq vpermilpd vpermilps vperm2f128 vpextrb vpextrw vpextrd vpextrq vphaddw vphaddd vphaddsw vphminposuw vphsubw vphsubd vphsubsw vpinsrb vpinsrw vpinsrd vpinsrq vpmaddwd vpmaddubsw vpmaxsb vpmaxsw vpmaxsd vpmaxub vpmaxuw vpmaxud vpminsb vpminsw vpminsd vpminub vpminuw vpminud vpmovmskb vpmovsxbw vpmovsxbd vpmovsxbq vpmovsxwd vpmovsxwq vpmovsxdq vpmovzxbw vpmovzxbd vpmovzxbq vpmovzxwd vpmovzxwq vpmovzxdq vpmulhuw vpmulhrsw vpmulhw vpmullw vpmulld vpmuludq vpmuldq vpor vpsadbw vpshufb vpshufd vpshufhw vpshuflw vpsignb vpsignw vpsignd vpslldq vpsrldq vpsllw vpslld vpsllq vpsraw vpsrad vpsrlw vpsrld vpsrlq vptest vpsubb vpsubw vpsubd vpsubq vpsubsb vpsubsw vpsubusb vpsubusw vpunpckhbw vpunpckhwd vpunpckhdq vpunpckhqdq vpunpcklbw vpunpcklwd vpunpckldq vpunpcklqdq vpxor vrcpps vrcpss vrsqrtps vrsqrtss vroundpd vroundps vroundsd vroundss vshufpd vshufps vsqrtpd vsqrtps vsqrtsd vsqrtss vstmxcsr vsubpd vsubps vsubsd vsubss vtestps vtestpd vucomisd vucomiss vunpckhpd vunpckhps vunpcklpd vunpcklps vxorpd vxorps vzeroall vzeroupper pclmullqlqdq pclmulhqlqdq pclmullqhqdq pclmulhqhqdq pclmulqdq vpclmullqlqdq vpclmulhqlqdq vpclmullqhqdq vpclmulhqhqdq vpclmulqdq vfmadd132ps vfmadd132pd vfmadd312ps vfmadd312pd vfmadd213ps vfmadd213pd vfmadd123ps vfmadd123pd vfmadd231ps vfmadd231pd vfmadd321ps vfmadd321pd vfmaddsub132ps vfmaddsub132pd vfmaddsub312ps vfmaddsub312pd vfmaddsub213ps vfmaddsub213pd vfmaddsub123ps vfmaddsub123pd vfmaddsub231ps vfmaddsub231pd vfmaddsub321ps vfmaddsub321pd vfmsub132ps vfmsub132pd vfmsub312ps vfmsub312pd vfmsub213ps vfmsub213pd vfmsub123ps vfmsub123pd vfmsub231ps vfmsub231pd vfmsub321ps vfmsub321pd vfmsubadd132ps vfmsubadd132pd vfmsubadd312ps vfmsubadd312pd vfmsubadd213ps vfmsubadd213pd vfmsubadd123ps vfmsubadd123pd vfmsubadd231ps vfmsubadd231pd vfmsubadd321ps vfmsubadd321pd vfnmadd132ps vfnmadd132pd vfnmadd312ps vfnmadd312pd vfnmadd213ps vfnmadd213pd vfnmadd123ps vfnmadd123pd vfnmadd231ps vfnmadd231pd vfnmadd321ps vfnmadd321pd vfnmsub132ps vfnmsub132pd vfnmsub312ps vfnmsub312pd vfnmsub213ps vfnmsub213pd vfnmsub123ps vfnmsub123pd vfnmsub231ps vfnmsub231pd vfnmsub321ps vfnmsub321pd vfmadd132ss vfmadd132sd vfmadd312ss vfmadd312sd vfmadd213ss vfmadd213sd vfmadd123ss vfmadd123sd vfmadd231ss vfmadd231sd vfmadd321ss vfmadd321sd vfmsub132ss vfmsub132sd vfmsub312ss vfmsub312sd vfmsub213ss vfmsub213sd vfmsub123ss vfmsub123sd vfmsub231ss vfmsub231sd vfmsub321ss vfmsub321sd vfnmadd132ss vfnmadd132sd vfnmadd312ss vfnmadd312sd vfnmadd213ss vfnmadd213sd vfnmadd123ss vfnmadd123sd vfnmadd231ss vfnmadd231sd vfnmadd321ss vfnmadd321sd vfnmsub132ss vfnmsub132sd vfnmsub312ss vfnmsub312sd vfnmsub213ss vfnmsub213sd vfnmsub123ss vfnmsub123sd vfnmsub231ss vfnmsub231sd vfnmsub321ss vfnmsub321sd rdfsbase rdgsbase rdrand wrfsbase wrgsbase vcvtph2ps vcvtps2ph adcx adox rdseed clac stac xstore xcryptecb xcryptcbc xcryptctr xcryptcfb xcryptofb montmul xsha1 xsha256 llwpcb slwpcb lwpval lwpins vfmaddpd vfmaddps vfmaddsd vfmaddss vfmaddsubpd vfmaddsubps vfmsubaddpd vfmsubaddps vfmsubpd vfmsubps vfmsubsd vfmsubss vfnmaddpd vfnmaddps vfnmaddsd vfnmaddss vfnmsubpd vfnmsubps vfnmsubsd vfnmsubss vfrczpd vfrczps vfrczsd vfrczss vpcmov vpcomb vpcomd vpcomq vpcomub vpcomud vpcomuq vpcomuw vpcomw vphaddbd vphaddbq vphaddbw vphadddq vphaddubd vphaddubq vphaddubw vphaddudq vphadduwd vphadduwq vphaddwd vphaddwq vphsubbw vphsubdq vphsubwd vpmacsdd vpmacsdqh vpmacsdql vpmacssdd vpmacssdqh vpmacssdql vpmacsswd vpmacssww vpmacswd vpmacsww vpmadcsswd vpmadcswd vpperm vprotb vprotd vprotq vprotw vpshab vpshad vpshaq vpshaw vpshlb vpshld vpshlq vpshlw vbroadcasti128 vpblendd vpbroadcastb vpbroadcastw vpbroadcastd vpbroadcastq vpermd vpermpd vpermps vpermq vperm2i128 vextracti128 vinserti128 vpmaskmovd vpmaskmovq vpsllvd vpsllvq vpsravd vpsrlvd vpsrlvq vgatherdpd vgatherqpd vgatherdps vgatherqps vpgatherdd vpgatherqd vpgatherdq vpgatherqq xabort xbegin xend xtest andn bextr blci blcic blsi blsic blcfill blsfill blcmsk blsmsk blsr blcs bzhi mulx pdep pext rorx sarx shlx shrx tzcnt tzmsk t1mskc valignd valignq vblendmpd vblendmps vbroadcastf32x4 vbroadcastf64x4 vbroadcasti32x4 vbroadcasti64x4 vcompresspd vcompressps vcvtpd2udq vcvtps2udq vcvtsd2usi vcvtss2usi vcvttpd2udq vcvttps2udq vcvttsd2usi vcvttss2usi vcvtudq2pd vcvtudq2ps vcvtusi2sd vcvtusi2ss vexpandpd vexpandps vextractf32x4 vextractf64x4 vextracti32x4 vextracti64x4 vfixupimmpd vfixupimmps vfixupimmsd vfixupimmss vgetexppd vgetexpps vgetexpsd vgetexpss vgetmantpd vgetmantps vgetmantsd vgetmantss vinsertf32x4 vinsertf64x4 vinserti32x4 vinserti64x4 vmovdqa32 vmovdqa64 vmovdqu32 vmovdqu64 vpabsq vpandd vpandnd vpandnq vpandq vpblendmd vpblendmq vpcmpltd vpcmpled vpcmpneqd vpcmpnltd vpcmpnled vpcmpd vpcmpltq vpcmpleq vpcmpneqq vpcmpnltq vpcmpnleq vpcmpq vpcmpequd vpcmpltud vpcmpleud vpcmpnequd vpcmpnltud vpcmpnleud vpcmpud vpcmpequq vpcmpltuq vpcmpleuq vpcmpnequq vpcmpnltuq vpcmpnleuq vpcmpuq vpcompressd vpcompressq vpermi2d vpermi2pd vpermi2ps vpermi2q vpermt2d vpermt2pd vpermt2ps vpermt2q vpexpandd vpexpandq vpmaxsq vpmaxuq vpminsq vpminuq vpmovdb vpmovdw vpmovqb vpmovqd vpmovqw vpmovsdb vpmovsdw vpmovsqb vpmovsqd vpmovsqw vpmovusdb vpmovusdw vpmovusqb vpmovusqd vpmovusqw vpord vporq vprold vprolq vprolvd vprolvq vprord vprorq vprorvd vprorvq vpscatterdd vpscatterdq vpscatterqd vpscatterqq vpsraq vpsravq vpternlogd vpternlogq vptestmd vptestmq vptestnmd vptestnmq vpxord vpxorq vrcp14pd vrcp14ps vrcp14sd vrcp14ss vrndscalepd vrndscaleps vrndscalesd vrndscaless vrsqrt14pd vrsqrt14ps vrsqrt14sd vrsqrt14ss vscalefpd vscalefps vscalefsd vscalefss vscatterdpd vscatterdps vscatterqpd vscatterqps vshuff32x4 vshuff64x2 vshufi32x4 vshufi64x2 kandnw kandw kmovw knotw kortestw korw kshiftlw kshiftrw kunpckbw kxnorw kxorw vpbroadcastmb2q vpbroadcastmw2d vpconflictd vpconflictq vplzcntd vplzcntq vexp2pd vexp2ps vrcp28pd vrcp28ps vrcp28sd vrcp28ss vrsqrt28pd vrsqrt28ps vrsqrt28sd vrsqrt28ss vgatherpf0dpd vgatherpf0dps vgatherpf0qpd vgatherpf0qps vgatherpf1dpd vgatherpf1dps vgatherpf1qpd vgatherpf1qps vscatterpf0dpd vscatterpf0dps vscatterpf0qpd vscatterpf0qps vscatterpf1dpd vscatterpf1dps vscatterpf1qpd vscatterpf1qps prefetchwt1 bndmk bndcl bndcu bndcn bndmov bndldx bndstx sha1rnds4 sha1nexte sha1msg1 sha1msg2 sha256rnds2 sha256msg1 sha256msg2 hint_nop0 hint_nop1 hint_nop2 hint_nop3 hint_nop4 hint_nop5 hint_nop6 hint_nop7 hint_nop8 hint_nop9 hint_nop10 hint_nop11 hint_nop12 hint_nop13 hint_nop14 hint_nop15 hint_nop16 hint_nop17 hint_nop18 hint_nop19 hint_nop20 hint_nop21 hint_nop22 hint_nop23 hint_nop24 hint_nop25 hint_nop26 hint_nop27 hint_nop28 hint_nop29 hint_nop30 hint_nop31 hint_nop32 hint_nop33 hint_nop34 hint_nop35 hint_nop36 hint_nop37 hint_nop38 hint_nop39 hint_nop40 hint_nop41 hint_nop42 hint_nop43 hint_nop44 hint_nop45 hint_nop46 hint_nop47 hint_nop48 hint_nop49 hint_nop50 hint_nop51 hint_nop52 hint_nop53 hint_nop54 hint_nop55 hint_nop56 hint_nop57 hint_nop58 hint_nop59 hint_nop60 hint_nop61 hint_nop62 hint_nop63",
built_in:"ip eip rip al ah bl bh cl ch dl dh sil dil bpl spl r8b r9b r10b r11b r12b r13b r14b r15b ax bx cx dx si di bp sp r8w r9w r10w r11w r12w r13w r14w r15w eax ebx ecx edx esi edi ebp esp eip r8d r9d r10d r11d r12d r13d r14d r15d rax rbx rcx rdx rsi rdi rbp rsp r8 r9 r10 r11 r12 r13 r14 r15 cs ds es fs gs ss st st0 st1 st2 st3 st4 st5 st6 st7 mm0 mm1 mm2 mm3 mm4 mm5 mm6 mm7 xmm0  xmm1  xmm2  xmm3  xmm4  xmm5  xmm6  xmm7  xmm8  xmm9 xmm10  xmm11 xmm12 xmm13 xmm14 xmm15 xmm16 xmm17 xmm18 xmm19 xmm20 xmm21 xmm22 xmm23 xmm24 xmm25 xmm26 xmm27 xmm28 xmm29 xmm30 xmm31 ymm0  ymm1  ymm2  ymm3  ymm4  ymm5  ymm6  ymm7  ymm8  ymm9 ymm10  ymm11 ymm12 ymm13 ymm14 ymm15 ymm16 ymm17 ymm18 ymm19 ymm20 ymm21 ymm22 ymm23 ymm24 ymm25 ymm26 ymm27 ymm28 ymm29 ymm30 ymm31 zmm0  zmm1  zmm2  zmm3  zmm4  zmm5  zmm6  zmm7  zmm8  zmm9 zmm10  zmm11 zmm12 zmm13 zmm14 zmm15 zmm16 zmm17 zmm18 zmm19 zmm20 zmm21 zmm22 zmm23 zmm24 zmm25 zmm26 zmm27 zmm28 zmm29 zmm30 zmm31 k0 k1 k2 k3 k4 k5 k6 k7 bnd0 bnd1 bnd2 bnd3 cr0 cr1 cr2 cr3 cr4 cr8 dr0 dr1 dr2 dr3 dr8 tr3 tr4 tr5 tr6 tr7 r0 r1 r2 r3 r4 r5 r6 r7 r0b r1b r2b r3b r4b r5b r6b r7b r0w r1w r2w r3w r4w r5w r6w r7w r0d r1d r2d r3d r4d r5d r6d r7d r0h r1h r2h r3h r0l r1l r2l r3l r4l r5l r6l r7l r8l r9l r10l r11l r12l r13l r14l r15l db dw dd dq dt ddq do dy dz resb resw resd resq rest resdq reso resy resz incbin equ times byte word dword qword nosplit rel abs seg wrt strict near far a32 ptr",
meta:"%define %xdefine %+ %undef %defstr %deftok %assign %strcat %strlen %substr %rotate %elif %else %endif %if %ifmacro %ifctx %ifidn %ifidni %ifid %ifnum %ifstr %iftoken %ifempty %ifenv %error %warning %fatal %rep %endrep %include %push %pop %repl %pathsearch %depend %use %arg %stacksize %local %line %comment %endcomment .nolist __FILE__ __LINE__ __SECT__  __BITS__ __OUTPUT_FORMAT__ __DATE__ __TIME__ __DATE_NUM__ __TIME_NUM__ __UTC_DATE__ __UTC_TIME__ __UTC_DATE_NUM__ __UTC_TIME_NUM__  __PASS__ struc endstruc istruc at iend align alignb sectalign daz nodaz up down zero default option assume public bits use16 use32 use64 default section segment absolute extern global common cpu float __utf16__ __utf16le__ __utf16be__ __utf32__ __utf32le__ __utf32be__ __float8__ __float16__ __float32__ __float64__ __float80m__ __float80e__ __float128l__ __float128h__ __Infinity__ __QNaN__ __SNaN__ Inf NaN QNaN SNaN float8 float16 float32 float64 float80m float80e float128l float128h __FLOAT_DAZ__ __FLOAT_ROUND__ __FLOAT__"
},contains:[s.COMMENT(";","$",{relevance:0}),{className:"number",variants:[{
begin:"\\b(?:([0-9][0-9_]*)?\\.[0-9_]*(?:[eE][+-]?[0-9_]+)?|(0[Xx])?[0-9][0-9_]*(\\.[0-9_]*)?(?:[pP](?:[+-]?[0-9_]+)?)?)\\b",
relevance:0},{begin:"\\$[0-9][0-9A-Fa-f]*",relevance:0},{
begin:"\\b(?:[0-9A-Fa-f][0-9A-Fa-f_]*[Hh]|[0-9][0-9_]*[DdTt]?|[0-7][0-7_]*[QqOo]|[0-1][0-1_]*[BbYy])\\b"
},{
begin:"\\b(?:0[Xx][0-9A-Fa-f_]+|0[DdTt][0-9_]+|0[QqOo][0-7_]+|0[BbYy][0-1_]+)\\b"
}]},s.QUOTE_STRING_MODE,{className:"string",variants:[{begin:"'",end:"[^\\\\]'"
},{begin:"`",end:"[^\\\\]`"}],relevance:0},{className:"symbol",variants:[{
begin:"^\\s*[A-Za-z._?][A-Za-z0-9_$#@~.?]*(:|\\s+label)"},{
begin:"^\\s*%%[A-Za-z0-9_$#@~.?]*:"}],relevance:0},{className:"subst",
begin:"%[0-9]+",relevance:0},{className:"subst",begin:"%!S+",relevance:0},{
className:"meta",begin:/^\s*\.[\w_-]+/}]})})());hljs.registerLanguage("cpp",(()=>{"use strict";function e(e){
return((...e)=>e.map((e=>(e=>e?"string"==typeof e?e:e.source:null)(e))).join(""))("(",e,")?")
}return t=>{const n=(t=>{const n=t.COMMENT("//","$",{contains:[{begin:/\\\n/}]
}),r="[a-zA-Z_]\\w*::",a="(decltype\\(auto\\)|"+e(r)+"[a-zA-Z_]\\w*"+e("<[^<>]+>")+")",s={
className:"keyword",begin:"\\b[a-z\\d_]*_t\\b"},i={className:"string",
variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",
contains:[t.BACKSLASH_ESCAPE]},{
begin:"(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
end:"'",illegal:"."},t.END_SAME_AS_BEGIN({
begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},c={
className:"number",variants:[{begin:"\\b(0b[01']+)"},{
begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{
begin:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
}],relevance:0},o={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{
"meta-keyword":"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
},contains:[{begin:/\\\n/,relevance:0},t.inherit(i,{className:"meta-string"}),{
className:"meta-string",begin:/<.*?>/,end:/$/,illegal:"\\n"
},n,t.C_BLOCK_COMMENT_MODE]},l={className:"title",begin:e(r)+t.IDENT_RE,
relevance:0},d=e(r)+t.IDENT_RE+"\\s*\\(",u={
keyword:"int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
literal:"true false nullptr NULL"},p=[o,s,n,t.C_BLOCK_COMMENT_MODE,c,i],m={
variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{
beginKeywords:"new throw return else",end:/;/}],keywords:u,contains:p.concat([{
begin:/\(/,end:/\)/,keywords:u,contains:p.concat(["self"]),relevance:0}]),
relevance:0},_={className:"function",begin:"("+a+"[\\*&\\s]+)+"+d,
returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:u,illegal:/[^\w\s\*&:<>]/,
contains:[{begin:"decltype\\(auto\\)",keywords:u,relevance:0},{begin:d,
returnBegin:!0,contains:[l],relevance:0},{className:"params",begin:/\(/,
end:/\)/,keywords:u,relevance:0,contains:[n,t.C_BLOCK_COMMENT_MODE,i,c,s,{
begin:/\(/,end:/\)/,keywords:u,relevance:0,
contains:["self",n,t.C_BLOCK_COMMENT_MODE,i,c,s]}]
},s,n,t.C_BLOCK_COMMENT_MODE,o]};return{
aliases:["c","cc","h","c++","h++","hpp","hh","hxx","cxx"],keywords:u,
disableAutodetect:!0,illegal:"</",contains:[].concat(m,_,p,[o,{
begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
end:">",keywords:u,contains:["self",s]},{begin:t.IDENT_RE+"::",keywords:u},{
className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,
contains:[{beginKeywords:"final class struct"},t.TITLE_MODE]}]),exports:{
preprocessor:o,strings:i,keywords:u}}})(t)
;return n.disableAutodetect=!1,n.name="C++",
n.aliases=["cc","c++","h++","hpp","hh","hxx","cxx"],n}})());hljs.registerLanguage("scala",(()=>{"use strict";return e=>{const n={
className:"subst",variants:[{begin:"\\$[A-Za-z0-9_]+"},{begin:/\$\{/,end:/\}/}]
},a={className:"string",variants:[{begin:'"',end:'"',illegal:"\\n",
contains:[e.BACKSLASH_ESCAPE]},{begin:'"""',end:'"""',relevance:10},{
begin:'[a-z]+"',end:'"',illegal:"\\n",contains:[e.BACKSLASH_ESCAPE,n]},{
className:"string",begin:'[a-z]+"""',end:'"""',contains:[n],relevance:10}]},s={
className:"type",begin:"\\b[A-Z][A-Za-z0-9_]*",relevance:0},t={
className:"title",
begin:/[^0-9\n\t "'(),.`{}\[\]:;][^\n\t "'(),.`{}\[\]:;]+|[^0-9\n\t "'(),.`{}\[\]:;=]/,
relevance:0},i={className:"class",beginKeywords:"class object trait type",
end:/[:={\[\n;]/,excludeEnd:!0,
contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,{
beginKeywords:"extends with",relevance:10},{begin:/\[/,end:/\]/,excludeBegin:!0,
excludeEnd:!0,relevance:0,contains:[s]},{className:"params",begin:/\(/,end:/\)/,
excludeBegin:!0,excludeEnd:!0,relevance:0,contains:[s]},t]},l={
className:"function",beginKeywords:"def",end:/[:={\[(\n;]/,excludeEnd:!0,
contains:[t]};return{name:"Scala",keywords:{literal:"true false null",
keyword:"type yield lazy override def with val var sealed abstract private trait object if forSome for while throw finally protected extends import final return else break new catch super class case package default try this match continue throws implicit"
},contains:[e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,a,{className:"symbol",
begin:"'\\w[\\w\\d_]*(?!')"},s,l,i,e.C_NUMBER_MODE,{className:"meta",
begin:"@[A-Za-z]+"}]}}})());hljs.registerLanguage("bnf",(()=>{"use strict";return e=>({
name:"Backus\u2013Naur Form",contains:[{className:"attribute",begin:/</,end:/>/
},{begin:/::=/,end:/$/,contains:[{begin:/</,end:/>/
},e.C_LINE_COMMENT_MODE,e.C_BLOCK_COMMENT_MODE,e.APOS_STRING_MODE,e.QUOTE_STRING_MODE]
}]})})());hljs.registerLanguage("haml",(()=>{"use strict";return e=>({name:"HAML",
case_insensitive:!0,contains:[{className:"meta",
begin:"^!!!( (5|1\\.1|Strict|Frameset|Basic|Mobile|RDFa|XML\\b.*))?$",
relevance:10},e.COMMENT("^\\s*(!=#|=#|-#|/).*$",!1,{relevance:0}),{
begin:"^\\s*(-|=|!=)(?!#)",starts:{end:"\\n",subLanguage:"ruby"}},{
className:"tag",begin:"^\\s*%",contains:[{className:"selector-tag",begin:"\\w+"
},{className:"selector-id",begin:"#[\\w-]+"},{className:"selector-class",
begin:"\\.[\\w-]+"},{begin:/\{\s*/,end:/\s*\}/,contains:[{begin:":\\w+\\s*=>",
end:",\\s+",returnBegin:!0,endsWithParent:!0,contains:[{className:"attr",
begin:":\\w+"},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{begin:"\\w+",relevance:0
}]}]},{begin:"\\(\\s*",end:"\\s*\\)",excludeEnd:!0,contains:[{begin:"\\w+\\s*=",
end:"\\s+",returnBegin:!0,endsWithParent:!0,contains:[{className:"attr",
begin:"\\w+",relevance:0},e.APOS_STRING_MODE,e.QUOTE_STRING_MODE,{begin:"\\w+",
relevance:0}]}]}]},{begin:"^\\s*[=~]\\s*"},{begin:/#\{/,starts:{end:/\}/,
subLanguage:"ruby"}}]})})());hljs.registerLanguage("vbscript",(()=>{"use strict";function e(e){
return e?"string"==typeof e?e:e.source:null}function t(...t){
return t.map((t=>e(t))).join("")}function r(...t){
return"("+t.map((t=>e(t))).join("|")+")"}return e=>{
const i="lcase month vartype instrrev ubound setlocale getobject rgb getref string weekdayname rnd dateadd monthname now day minute isarray cbool round formatcurrency conversions csng timevalue second year space abs clng timeserial fixs len asc isempty maths dateserial atn timer isobject filter weekday datevalue ccur isdate instr datediff formatdatetime replace isnull right sgn array snumeric log cdbl hex chr lbound msgbox ucase getlocale cos cdate cbyte rtrim join hour oct typename trim strcomp int createobject loadpicture tan formatnumber mid split  cint sin datepart ltrim sqr time derived eval date formatpercent exp inputbox left ascw chrw regexp cstr err".split(" ")
;return{name:"VBScript",aliases:["vbs"],case_insensitive:!0,keywords:{
keyword:"call class const dim do loop erase execute executeglobal exit for each next function if then else on error option explicit new private property let get public randomize redim rem select case set stop sub while wend with end to elseif is or xor and not class_initialize class_terminate default preserve in me byval byref step resume goto",
built_in:"server response request scriptengine scriptenginebuildversion scriptengineminorversion scriptenginemajorversion",
literal:"true false null nothing empty"},illegal:"//",contains:[{
begin:t(r(...i),"\\s*\\("),relevance:0,keywords:{built_in:i.join(" ")}
},e.inherit(e.QUOTE_STRING_MODE,{contains:[{begin:'""'}]}),e.COMMENT(/'/,/$/,{
relevance:0}),e.C_NUMBER_MODE]}}})());hljs.registerLanguage("arduino",(()=>{"use strict";function e(e){
return((...e)=>e.map((e=>(e=>e?"string"==typeof e?e:e.source:null)(e))).join(""))("(",e,")?")
}return t=>{const r=function(t){const r=(t=>{const r=t.COMMENT("//","$",{
contains:[{begin:/\\\n/}]
}),n="[a-zA-Z_]\\w*::",i="(decltype\\(auto\\)|"+e(n)+"[a-zA-Z_]\\w*"+e("<[^<>]+>")+")",a={
className:"keyword",begin:"\\b[a-z\\d_]*_t\\b"},s={className:"string",
variants:[{begin:'(u8?|U|L)?"',end:'"',illegal:"\\n",
contains:[t.BACKSLASH_ESCAPE]},{
begin:"(u8?|U|L)?'(\\\\(x[0-9A-Fa-f]{2}|u[0-9A-Fa-f]{4,8}|[0-7]{3}|\\S)|.)",
end:"'",illegal:"."},t.END_SAME_AS_BEGIN({
begin:/(?:u8?|U|L)?R"([^()\\ ]{0,16})\(/,end:/\)([^()\\ ]{0,16})"/})]},o={
className:"number",variants:[{begin:"\\b(0b[01']+)"},{
begin:"(-?)\\b([\\d']+(\\.[\\d']*)?|\\.[\\d']+)(u|U|l|L|ul|UL|f|F|b|B)"},{
begin:"(-?)(\\b0[xX][a-fA-F0-9']+|(\\b[\\d']+(\\.[\\d']*)?|\\.[\\d']+)([eE][-+]?[\\d']+)?)"
}],relevance:0},l={className:"meta",begin:/#\s*[a-z]+\b/,end:/$/,keywords:{
"meta-keyword":"if else elif endif define undef warning error line pragma _Pragma ifdef ifndef include"
},contains:[{begin:/\\\n/,relevance:0},t.inherit(s,{className:"meta-string"}),{
className:"meta-string",begin:/<.*?>/,end:/$/,illegal:"\\n"
},r,t.C_BLOCK_COMMENT_MODE]},c={className:"title",begin:e(n)+t.IDENT_RE,
relevance:0},d=e(n)+t.IDENT_RE+"\\s*\\(",u={
keyword:"int float while private char char8_t char16_t char32_t catch import module export virtual operator sizeof dynamic_cast|10 typedef const_cast|10 const for static_cast|10 union namespace unsigned long volatile static protected bool template mutable if public friend do goto auto void enum else break extern using asm case typeid wchar_t short reinterpret_cast|10 default double register explicit signed typename try this switch continue inline delete alignas alignof constexpr consteval constinit decltype concept co_await co_return co_yield requires noexcept static_assert thread_local restrict final override atomic_bool atomic_char atomic_schar atomic_uchar atomic_short atomic_ushort atomic_int atomic_uint atomic_long atomic_ulong atomic_llong atomic_ullong new throw return and and_eq bitand bitor compl not not_eq or or_eq xor xor_eq",
built_in:"std string wstring cin cout cerr clog stdin stdout stderr stringstream istringstream ostringstream auto_ptr deque list queue stack vector map set pair bitset multiset multimap unordered_set unordered_map unordered_multiset unordered_multimap priority_queue make_pair array shared_ptr abort terminate abs acos asin atan2 atan calloc ceil cosh cos exit exp fabs floor fmod fprintf fputs free frexp fscanf future isalnum isalpha iscntrl isdigit isgraph islower isprint ispunct isspace isupper isxdigit tolower toupper labs ldexp log10 log malloc realloc memchr memcmp memcpy memset modf pow printf putchar puts scanf sinh sin snprintf sprintf sqrt sscanf strcat strchr strcmp strcpy strcspn strlen strncat strncmp strncpy strpbrk strrchr strspn strstr tanh tan vfprintf vprintf vsprintf endl initializer_list unique_ptr _Bool complex _Complex imaginary _Imaginary",
literal:"true false nullptr NULL"},m=[l,a,r,t.C_BLOCK_COMMENT_MODE,o,s],p={
variants:[{begin:/=/,end:/;/},{begin:/\(/,end:/\)/},{
beginKeywords:"new throw return else",end:/;/}],keywords:u,contains:m.concat([{
begin:/\(/,end:/\)/,keywords:u,contains:m.concat(["self"]),relevance:0}]),
relevance:0},g={className:"function",begin:"("+i+"[\\*&\\s]+)+"+d,
returnBegin:!0,end:/[{;=]/,excludeEnd:!0,keywords:u,illegal:/[^\w\s\*&:<>]/,
contains:[{begin:"decltype\\(auto\\)",keywords:u,relevance:0},{begin:d,
returnBegin:!0,contains:[c],relevance:0},{className:"params",begin:/\(/,
end:/\)/,keywords:u,relevance:0,contains:[r,t.C_BLOCK_COMMENT_MODE,s,o,a,{
begin:/\(/,end:/\)/,keywords:u,relevance:0,
contains:["self",r,t.C_BLOCK_COMMENT_MODE,s,o,a]}]
},a,r,t.C_BLOCK_COMMENT_MODE,l]};return{
aliases:["c","cc","h","c++","h++","hpp","hh","hxx","cxx"],keywords:u,
disableAutodetect:!0,illegal:"</",contains:[].concat(p,g,m,[l,{
begin:"\\b(deque|list|queue|priority_queue|pair|stack|vector|map|set|bitset|multiset|multimap|unordered_map|unordered_set|unordered_multiset|unordered_multimap|array)\\s*<",
end:">",keywords:u,contains:["self",a]},{begin:t.IDENT_RE+"::",keywords:u},{
className:"class",beginKeywords:"enum class struct union",end:/[{;:<>=]/,
contains:[{beginKeywords:"final class struct"},t.TITLE_MODE]}]),exports:{
preprocessor:l,strings:s,keywords:u}}})(t)
;return r.disableAutodetect=!1,r.name="C++",
r.aliases=["cc","c++","h++","hpp","hh","hxx","cxx"],r}(t),n=r.keywords
;return n.keyword+=" boolean byte word String",
n.literal+=" DIGITAL_MESSAGE FIRMATA_STRING ANALOG_MESSAGE REPORT_DIGITAL REPORT_ANALOG INPUT_PULLUP SET_PIN_MODE INTERNAL2V56 SYSTEM_RESET LED_BUILTIN INTERNAL1V1 SYSEX_START INTERNAL EXTERNAL DEFAULT OUTPUT INPUT HIGH LOW",
n.built_in+=" setup loop KeyboardController MouseController SoftwareSerial EthernetServer EthernetClient LiquidCrystal RobotControl GSMVoiceCall EthernetUDP EsploraTFT HttpClient RobotMotor WiFiClient GSMScanner FileSystem Scheduler GSMServer YunClient YunServer IPAddress GSMClient GSMModem Keyboard Ethernet Console GSMBand Esplora Stepper Process WiFiUDP GSM_SMS Mailbox USBHost Firmata PImage Client Server GSMPIN FileIO Bridge Serial EEPROM Stream Mouse Audio Servo File Task GPRS WiFi Wire TFT GSM SPI SD runShellCommandAsynchronously analogWriteResolution retrieveCallingNumber printFirmwareVersion analogReadResolution sendDigitalPortPair noListenOnLocalhost readJoystickButton setFirmwareVersion readJoystickSwitch scrollDisplayRight getVoiceCallStatus scrollDisplayLeft writeMicroseconds delayMicroseconds beginTransmission getSignalStrength runAsynchronously getAsynchronously listenOnLocalhost getCurrentCarrier readAccelerometer messageAvailable sendDigitalPorts lineFollowConfig countryNameWrite runShellCommand readStringUntil rewindDirectory readTemperature setClockDivider readLightSensor endTransmission analogReference detachInterrupt countryNameRead attachInterrupt encryptionType readBytesUntil robotNameWrite readMicrophone robotNameRead cityNameWrite userNameWrite readJoystickY readJoystickX mouseReleased openNextFile scanNetworks noInterrupts digitalWrite beginSpeaker mousePressed isActionDone mouseDragged displayLogos noAutoscroll addParameter remoteNumber getModifiers keyboardRead userNameRead waitContinue processInput parseCommand printVersion readNetworks writeMessage blinkVersion cityNameRead readMessage setDataMode parsePacket isListening setBitOrder beginPacket isDirectory motorsWrite drawCompass digitalRead clearScreen serialEvent rightToLeft setTextSize leftToRight requestFrom keyReleased compassRead analogWrite interrupts WiFiServer disconnect playMelody parseFloat autoscroll getPINUsed setPINUsed setTimeout sendAnalog readSlider analogRead beginWrite createChar motorsStop keyPressed tempoWrite readButton subnetMask debugPrint macAddress writeGreen randomSeed attachGPRS readString sendString remotePort releaseAll mouseMoved background getXChange getYChange answerCall getResult voiceCall endPacket constrain getSocket writeJSON getButton available connected findUntil readBytes exitValue readGreen writeBlue startLoop IPAddress isPressed sendSysex pauseMode gatewayIP setCursor getOemKey tuneWrite noDisplay loadImage switchPIN onRequest onReceive changePIN playFile noBuffer parseInt overflow checkPIN knobRead beginTFT bitClear updateIR bitWrite position writeRGB highByte writeRed setSpeed readBlue noStroke remoteIP transfer shutdown hangCall beginSMS endWrite attached maintain noCursor checkReg checkPUK shiftOut isValid shiftIn pulseIn connect println localIP pinMode getIMEI display noBlink process getBand running beginSD drawBMP lowByte setBand release bitRead prepare pointTo readRed setMode noFill remove listen stroke detach attach noTone exists buffer height bitSet circle config cursor random IRread setDNS endSMS getKey micros millis begin print write ready flush width isPIN blink clear press mkdir rmdir close point yield image BSSID click delay read text move peek beep rect line open seek fill size turn stop home find step tone sqrt RSSI SSID end bit tan cos sin pow map abs max min get run put",
r.name="Arduino",r.aliases=["ino"],r.supersetOf="cpp",r}})());