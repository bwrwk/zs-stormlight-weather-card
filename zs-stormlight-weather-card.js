/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$2=globalThis,e$3=t$2.ShadowRoot&&(void 0===t$2.ShadyCSS||t$2.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,s$2=Symbol(),o$4=new WeakMap;let n$3 = class n{constructor(t,e,o){if(this._$cssResult$=true,o!==s$2)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e;}get styleSheet(){let t=this.o;const s=this.t;if(e$3&&void 0===t){const e=void 0!==s&&1===s.length;e&&(t=o$4.get(s)),void 0===t&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),e&&o$4.set(s,t));}return t}toString(){return this.cssText}};const r$2=t=>new n$3("string"==typeof t?t:t+"",void 0,s$2),i$5=(t,...e)=>{const o=1===t.length?t[0]:e.reduce((e,s,o)=>e+(t=>{if(true===t._$cssResult$)return t.cssText;if("number"==typeof t)return t;throw Error("Value passed to 'css' function must be a 'css' function result: "+t+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(s)+t[o+1],t[0]);return new n$3(o,t,s$2)},S$1=(s,o)=>{if(e$3)s.adoptedStyleSheets=o.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const e of o){const o=document.createElement("style"),n=t$2.litNonce;void 0!==n&&o.setAttribute("nonce",n),o.textContent=e.cssText,s.appendChild(o);}},c$2=e$3?t=>t:t=>t instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return r$2(e)})(t):t;

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:i$4,defineProperty:e$2,getOwnPropertyDescriptor:h$1,getOwnPropertyNames:r$1,getOwnPropertySymbols:o$3,getPrototypeOf:n$2}=Object,a$1=globalThis,c$1=a$1.trustedTypes,l$1=c$1?c$1.emptyScript:"",p$1=a$1.reactiveElementPolyfillSupport,d$1=(t,s)=>t,u$1={toAttribute(t,s){switch(s){case Boolean:t=t?l$1:null;break;case Object:case Array:t=null==t?t:JSON.stringify(t);}return t},fromAttribute(t,s){let i=t;switch(s){case Boolean:i=null!==t;break;case Number:i=null===t?null:Number(t);break;case Object:case Array:try{i=JSON.parse(t);}catch(t){i=null;}}return i}},f$1=(t,s)=>!i$4(t,s),b$1={attribute:true,type:String,converter:u$1,reflect:false,useDefault:false,hasChanged:f$1};Symbol.metadata??=Symbol("metadata"),a$1.litPropertyMetadata??=new WeakMap;let y$1 = class y extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??=[]).push(t);}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,s=b$1){if(s.state&&(s.attribute=false),this._$Ei(),this.prototype.hasOwnProperty(t)&&((s=Object.create(s)).wrapped=true),this.elementProperties.set(t,s),!s.noAccessor){const i=Symbol(),h=this.getPropertyDescriptor(t,i,s);void 0!==h&&e$2(this.prototype,t,h);}}static getPropertyDescriptor(t,s,i){const{get:e,set:r}=h$1(this.prototype,t)??{get(){return this[s]},set(t){this[s]=t;}};return {get:e,set(s){const h=e?.call(this);r?.call(this,s),this.requestUpdate(t,h,i);},configurable:true,enumerable:true}}static getPropertyOptions(t){return this.elementProperties.get(t)??b$1}static _$Ei(){if(this.hasOwnProperty(d$1("elementProperties")))return;const t=n$2(this);t.finalize(),void 0!==t.l&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties);}static finalize(){if(this.hasOwnProperty(d$1("finalized")))return;if(this.finalized=true,this._$Ei(),this.hasOwnProperty(d$1("properties"))){const t=this.properties,s=[...r$1(t),...o$3(t)];for(const i of s)this.createProperty(i,t[i]);}const t=this[Symbol.metadata];if(null!==t){const s=litPropertyMetadata.get(t);if(void 0!==s)for(const[t,i]of s)this.elementProperties.set(t,i);}this._$Eh=new Map;for(const[t,s]of this.elementProperties){const i=this._$Eu(t,s);void 0!==i&&this._$Eh.set(i,t);}this.elementStyles=this.finalizeStyles(this.styles);}static finalizeStyles(s){const i=[];if(Array.isArray(s)){const e=new Set(s.flat(1/0).reverse());for(const s of e)i.unshift(c$2(s));}else void 0!==s&&i.push(c$2(s));return i}static _$Eu(t,s){const i=s.attribute;return  false===i?void 0:"string"==typeof i?i:"string"==typeof t?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=false,this.hasUpdated=false,this._$Em=null,this._$Ev();}_$Ev(){this._$ES=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this));}addController(t){(this._$EO??=new Set).add(t),void 0!==this.renderRoot&&this.isConnected&&t.hostConnected?.();}removeController(t){this._$EO?.delete(t);}_$E_(){const t=new Map,s=this.constructor.elementProperties;for(const i of s.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this._$Ep=t);}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return S$1(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(true),this._$EO?.forEach(t=>t.hostConnected?.());}enableUpdating(t){}disconnectedCallback(){this._$EO?.forEach(t=>t.hostDisconnected?.());}attributeChangedCallback(t,s,i){this._$AK(t,i);}_$ET(t,s){const i=this.constructor.elementProperties.get(t),e=this.constructor._$Eu(t,i);if(void 0!==e&&true===i.reflect){const h=(void 0!==i.converter?.toAttribute?i.converter:u$1).toAttribute(s,i.type);this._$Em=t,null==h?this.removeAttribute(e):this.setAttribute(e,h),this._$Em=null;}}_$AK(t,s){const i=this.constructor,e=i._$Eh.get(t);if(void 0!==e&&this._$Em!==e){const t=i.getPropertyOptions(e),h="function"==typeof t.converter?{fromAttribute:t.converter}:void 0!==t.converter?.fromAttribute?t.converter:u$1;this._$Em=e;const r=h.fromAttribute(s,t.type);this[e]=r??this._$Ej?.get(e)??r,this._$Em=null;}}requestUpdate(t,s,i,e=false,h){if(void 0!==t){const r=this.constructor;if(false===e&&(h=this[t]),i??=r.getPropertyOptions(t),!((i.hasChanged??f$1)(h,s)||i.useDefault&&i.reflect&&h===this._$Ej?.get(t)&&!this.hasAttribute(r._$Eu(t,i))))return;this.C(t,s,i);} false===this.isUpdatePending&&(this._$ES=this._$EP());}C(t,s,{useDefault:i,reflect:e,wrapped:h},r){i&&!(this._$Ej??=new Map).has(t)&&(this._$Ej.set(t,r??s??this[t]),true!==h||void 0!==r)||(this._$AL.has(t)||(this.hasUpdated||i||(s=void 0),this._$AL.set(t,s)),true===e&&this._$Em!==t&&(this._$Eq??=new Set).add(t));}async _$EP(){this.isUpdatePending=true;try{await this._$ES;}catch(t){Promise.reject(t);}const t=this.scheduleUpdate();return null!=t&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[t,s]of this._$Ep)this[t]=s;this._$Ep=void 0;}const t=this.constructor.elementProperties;if(t.size>0)for(const[s,i]of t){const{wrapped:t}=i,e=this[s];true!==t||this._$AL.has(s)||void 0===e||this.C(s,void 0,i,e);}}let t=false;const s=this._$AL;try{t=this.shouldUpdate(s),t?(this.willUpdate(s),this._$EO?.forEach(t=>t.hostUpdate?.()),this.update(s)):this._$EM();}catch(s){throw t=false,this._$EM(),s}t&&this._$AE(s);}willUpdate(t){}_$AE(t){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=true,this.firstUpdated(t)),this.updated(t);}_$EM(){this._$AL=new Map,this.isUpdatePending=false;}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return  true}update(t){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM();}updated(t){}firstUpdated(t){}};y$1.elementStyles=[],y$1.shadowRootOptions={mode:"open"},y$1[d$1("elementProperties")]=new Map,y$1[d$1("finalized")]=new Map,p$1?.({ReactiveElement:y$1}),(a$1.reactiveElementVersions??=[]).push("2.1.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t$1=globalThis,i$3=t=>t,s$1=t$1.trustedTypes,e$1=s$1?s$1.createPolicy("lit-html",{createHTML:t=>t}):void 0,h="$lit$",o$2=`lit$${Math.random().toFixed(9).slice(2)}$`,n$1="?"+o$2,r=`<${n$1}>`,l=document,c=()=>l.createComment(""),a=t=>null===t||"object"!=typeof t&&"function"!=typeof t,u=Array.isArray,d=t=>u(t)||"function"==typeof t?.[Symbol.iterator],f="[ \t\n\f\r]",v=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,_=/-->/g,m=/>/g,p=RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`,"g"),g=/'/g,$=/"/g,y=/^(?:script|style|textarea|title)$/i,x=t=>(i,...s)=>({_$litType$:t,strings:i,values:s}),b=x(1),E=Symbol.for("lit-noChange"),A=Symbol.for("lit-nothing"),C=new WeakMap,P=l.createTreeWalker(l,129);function V(t,i){if(!u(t)||!t.hasOwnProperty("raw"))throw Error("invalid template strings array");return void 0!==e$1?e$1.createHTML(i):i}const N=(t,i)=>{const s=t.length-1,e=[];let n,l=2===i?"<svg>":3===i?"<math>":"",c=v;for(let i=0;i<s;i++){const s=t[i];let a,u,d=-1,f=0;for(;f<s.length&&(c.lastIndex=f,u=c.exec(s),null!==u);)f=c.lastIndex,c===v?"!--"===u[1]?c=_:void 0!==u[1]?c=m:void 0!==u[2]?(y.test(u[2])&&(n=RegExp("</"+u[2],"g")),c=p):void 0!==u[3]&&(c=p):c===p?">"===u[0]?(c=n??v,d=-1):void 0===u[1]?d=-2:(d=c.lastIndex-u[2].length,a=u[1],c=void 0===u[3]?p:'"'===u[3]?$:g):c===$||c===g?c=p:c===_||c===m?c=v:(c=p,n=void 0);const x=c===p&&t[i+1].startsWith("/>")?" ":"";l+=c===v?s+r:d>=0?(e.push(a),s.slice(0,d)+h+s.slice(d)+o$2+x):s+o$2+(-2===d?i:x);}return [V(t,l+(t[s]||"<?>")+(2===i?"</svg>":3===i?"</math>":"")),e]};class S{constructor({strings:t,_$litType$:i},e){let r;this.parts=[];let l=0,a=0;const u=t.length-1,d=this.parts,[f,v]=N(t,i);if(this.el=S.createElement(f,e),P.currentNode=this.el.content,2===i||3===i){const t=this.el.content.firstChild;t.replaceWith(...t.childNodes);}for(;null!==(r=P.nextNode())&&d.length<u;){if(1===r.nodeType){if(r.hasAttributes())for(const t of r.getAttributeNames())if(t.endsWith(h)){const i=v[a++],s=r.getAttribute(t).split(o$2),e=/([.?@])?(.*)/.exec(i);d.push({type:1,index:l,name:e[2],strings:s,ctor:"."===e[1]?I:"?"===e[1]?L:"@"===e[1]?z:H}),r.removeAttribute(t);}else t.startsWith(o$2)&&(d.push({type:6,index:l}),r.removeAttribute(t));if(y.test(r.tagName)){const t=r.textContent.split(o$2),i=t.length-1;if(i>0){r.textContent=s$1?s$1.emptyScript:"";for(let s=0;s<i;s++)r.append(t[s],c()),P.nextNode(),d.push({type:2,index:++l});r.append(t[i],c());}}}else if(8===r.nodeType)if(r.data===n$1)d.push({type:2,index:l});else {let t=-1;for(;-1!==(t=r.data.indexOf(o$2,t+1));)d.push({type:7,index:l}),t+=o$2.length-1;}l++;}}static createElement(t,i){const s=l.createElement("template");return s.innerHTML=t,s}}function M(t,i,s=t,e){if(i===E)return i;let h=void 0!==e?s._$Co?.[e]:s._$Cl;const o=a(i)?void 0:i._$litDirective$;return h?.constructor!==o&&(h?._$AO?.(false),void 0===o?h=void 0:(h=new o(t),h._$AT(t,s,e)),void 0!==e?(s._$Co??=[])[e]=h:s._$Cl=h),void 0!==h&&(i=M(t,h._$AS(t,i.values),h,e)),i}class R{constructor(t,i){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=i;}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:i},parts:s}=this._$AD,e=(t?.creationScope??l).importNode(i,true);P.currentNode=e;let h=P.nextNode(),o=0,n=0,r=s[0];for(;void 0!==r;){if(o===r.index){let i;2===r.type?i=new k(h,h.nextSibling,this,t):1===r.type?i=new r.ctor(h,r.name,r.strings,this,t):6===r.type&&(i=new Z(h,this,t)),this._$AV.push(i),r=s[++n];}o!==r?.index&&(h=P.nextNode(),o++);}return P.currentNode=l,e}p(t){let i=0;for(const s of this._$AV) void 0!==s&&(void 0!==s.strings?(s._$AI(t,s,i),i+=s.strings.length-2):s._$AI(t[i])),i++;}}class k{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(t,i,s,e){this.type=2,this._$AH=A,this._$AN=void 0,this._$AA=t,this._$AB=i,this._$AM=s,this.options=e,this._$Cv=e?.isConnected??true;}get parentNode(){let t=this._$AA.parentNode;const i=this._$AM;return void 0!==i&&11===t?.nodeType&&(t=i.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,i=this){t=M(this,t,i),a(t)?t===A||null==t||""===t?(this._$AH!==A&&this._$AR(),this._$AH=A):t!==this._$AH&&t!==E&&this._(t):void 0!==t._$litType$?this.$(t):void 0!==t.nodeType?this.T(t):d(t)?this.k(t):this._(t);}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t));}_(t){this._$AH!==A&&a(this._$AH)?this._$AA.nextSibling.data=t:this.T(l.createTextNode(t)),this._$AH=t;}$(t){const{values:i,_$litType$:s}=t,e="number"==typeof s?this._$AC(t):(void 0===s.el&&(s.el=S.createElement(V(s.h,s.h[0]),this.options)),s);if(this._$AH?._$AD===e)this._$AH.p(i);else {const t=new R(e,this),s=t.u(this.options);t.p(i),this.T(s),this._$AH=t;}}_$AC(t){let i=C.get(t.strings);return void 0===i&&C.set(t.strings,i=new S(t)),i}k(t){u(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let s,e=0;for(const h of t)e===i.length?i.push(s=new k(this.O(c()),this.O(c()),this,this.options)):s=i[e],s._$AI(h),e++;e<i.length&&(this._$AR(s&&s._$AB.nextSibling,e),i.length=e);}_$AR(t=this._$AA.nextSibling,s){for(this._$AP?.(false,true,s);t!==this._$AB;){const s=i$3(t).nextSibling;i$3(t).remove(),t=s;}}setConnected(t){ void 0===this._$AM&&(this._$Cv=t,this._$AP?.(t));}}class H{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,i,s,e,h){this.type=1,this._$AH=A,this._$AN=void 0,this.element=t,this.name=i,this._$AM=e,this.options=h,s.length>2||""!==s[0]||""!==s[1]?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=A;}_$AI(t,i=this,s,e){const h=this.strings;let o=false;if(void 0===h)t=M(this,t,i,0),o=!a(t)||t!==this._$AH&&t!==E,o&&(this._$AH=t);else {const e=t;let n,r;for(t=h[0],n=0;n<h.length-1;n++)r=M(this,e[s+n],i,n),r===E&&(r=this._$AH[n]),o||=!a(r)||r!==this._$AH[n],r===A?t=A:t!==A&&(t+=(r??"")+h[n+1]),this._$AH[n]=r;}o&&!e&&this.j(t);}j(t){t===A?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"");}}class I extends H{constructor(){super(...arguments),this.type=3;}j(t){this.element[this.name]=t===A?void 0:t;}}class L extends H{constructor(){super(...arguments),this.type=4;}j(t){this.element.toggleAttribute(this.name,!!t&&t!==A);}}class z extends H{constructor(t,i,s,e,h){super(t,i,s,e,h),this.type=5;}_$AI(t,i=this){if((t=M(this,t,i,0)??A)===E)return;const s=this._$AH,e=t===A&&s!==A||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,h=t!==A&&(s===A||e);e&&this.element.removeEventListener(this.name,this,s),h&&this.element.addEventListener(this.name,this,t),this._$AH=t;}handleEvent(t){"function"==typeof this._$AH?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t);}}class Z{constructor(t,i,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=i,this.options=s;}get _$AU(){return this._$AM._$AU}_$AI(t){M(this,t);}}const B=t$1.litHtmlPolyfillSupport;B?.(S,k),(t$1.litHtmlVersions??=[]).push("3.3.2");const D=(t,i,s)=>{const e=s?.renderBefore??i;let h=e._$litPart$;if(void 0===h){const t=s?.renderBefore??null;e._$litPart$=h=new k(i.insertBefore(c(),t),t,void 0,s??{});}return h._$AI(t),h};

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const s=globalThis;let i$2 = class i extends y$1{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0;}createRenderRoot(){const t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){const r=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=D(r,this.renderRoot,this.renderOptions);}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(true);}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(false);}render(){return E}};i$2._$litElement$=true,i$2["finalized"]=true,s.litElementHydrateSupport?.({LitElement:i$2});const o$1=s.litElementPolyfillSupport;o$1?.({LitElement:i$2});(s.litElementVersions??=[]).push("4.2.2");

/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const t={ATTRIBUTE:1},e=t=>(...e)=>({_$litDirective$:t,values:e});let i$1 = class i{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this._$Ct=t,this._$AM=e,this._$Ci=i;}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};

/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const n="important",i=" !"+n,o=e(class extends i$1{constructor(t$1){if(super(t$1),t$1.type!==t.ATTRIBUTE||"style"!==t$1.name||t$1.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(t){return Object.keys(t).reduce((e,r)=>{const s=t[r];return null==s?e:e+`${r=r.includes("-")?r:r.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${s};`},"")}update(e,[r]){const{style:s}=e.element;if(void 0===this.ft)return this.ft=new Set(Object.keys(r)),this.render(r);for(const t of this.ft)null==r[t]&&(this.ft.delete(t),t.includes("-")?s.removeProperty(t):s[t]=null);for(const t in r){const e=r[t];if(null!=e){this.ft.add(t);const r="string"==typeof e&&e.endsWith(i);t.includes("-")||r?s.setProperty(t,r?e.slice(0,-11):e,r?n:""):s[t]=e;}}return E}});

const TRANSLATIONS = {
    en: {
        eyebrow: 'Stormwarden Atmospheric Archive',
        archiveStamp: 'Urithiru Archive Seal',
        defaultTitle: 'Stormlight Weather Archive',
        updated: 'Updated',
        feelsLike: 'Feels like',
        specialEdition: 'Highstorm Warnings',
        forecastTitle: 'Storm Path Outlook',
        almanacTitle: 'Light Cycle',
        quoteTitle: 'Field Notes',
        currentTitle: 'Current Conditions',
        factsTitle: 'Measured Readings',
        watchLabel: 'Watch',
        quoteRotation: {
            forecast: 'Changes with forecast shifts',
            twice_daily: 'Changes twice each day',
            hybrid: 'Changes with forecast or each watch',
        },
        forecastModeLabels: {
            hourly: 'hourly cadence',
            daily: 'daily cadence',
        },
        noForecast: 'No spanreed forecast has arrived from the tower.',
        chanceOfRain: 'Rain chance',
        low: 'Low',
        high: 'High',
        windShort: 'Wind',
        quoteInspiredBy: 'Inspired by',
        debugTitle: 'Diagnostics',
        debugLabels: {
            forecast_source: 'Forecast source',
            forecast_items: 'Forecast items',
            forecast_mode: 'Forecast mode',
            weather_entity: 'Weather entity',
            forecast_entity: 'Forecast bridge',
            service_status: 'Forecast API',
            build_version: 'Build version',
        },
        alertLevels: {
            info: 'Notice',
            warning: 'Warning',
            critical: 'Highstorm',
        },
        labels: {
            entity: 'Weather entity',
            title: 'Title',
            subtitle: 'Subtitle',
            location: 'Location',
            style: 'Style',
            preset: 'Preset',
            ha_theme: 'Home Assistant theme',
            accent_color: 'Accent color',
            ink_color: 'Ink color',
            paper_color: 'Inner surface',
            background: 'Outer background',
            density: 'Density',
            paper_texture: 'Stone texture',
            animated_hero: 'Animated storm layer',
            show_masthead: 'Show header',
            show_almanac: 'Show light cycle',
            show_forecast: 'Show forecast',
            show_alerts: 'Show warnings',
            debug: 'Debug mode',
            layout: 'Layout',
            mode: 'Layout mode',
            forecast_mode: 'Forecast mode',
            forecast_items: 'Forecast items',
            facts: 'Fact tiles',
            content: 'Content',
            headline_mode: 'Headline mode',
            headline_template: 'Custom headline',
            condition_labels: 'Condition language',
            show_quotes: 'Show quote',
            quote_rotation: 'Quote rotation',
            quote_characters: 'Quote characters',
            entities: 'Data overrides',
            forecast_entity: 'Forecast bridge entity',
            forecast_attribute: 'Forecast attribute',
            apparent_temperature: 'Feels-like sensor',
            humidity: 'Humidity sensor',
            pressure: 'Pressure sensor',
            wind_speed: 'Wind speed sensor',
            wind_bearing: 'Wind bearing sensor',
            visibility: 'Visibility sensor',
            uv_index: 'UV index sensor',
            cloud_coverage: 'Cloud coverage sensor',
            precipitation: 'Precipitation sensor',
            sunrise: 'Sunrise entity',
            sunset: 'Sunset entity',
            alerts: 'Alert entities',
            tap_action: 'Tap action',
            action: 'Action',
        },
        helpers: {
            entity: 'Primary weather.* entity used for current conditions and default forecast lookup.',
            location: 'Optional location label shown in the archive header.',
            preset: 'Urithiru Archive is the default balanced preset.',
            ha_theme: 'Optional Home Assistant theme for this card.',
            accent_color: 'Custom accent used for borders and luminous details.',
            ink_color: 'Overrides the main text color.',
            paper_color: 'Overrides the inner archive panel surface.',
            background: 'Overrides the outer card shell.',
            density: 'Controls spacing inside the card.',
            paper_texture: 'Adds subtle mineral grain over the inner panel.',
            animated_hero: 'Enables gentle motion for storms and glow layers.',
            show_masthead: 'Shows the archive header.',
            show_almanac: 'Shows sunrise and sunset blocks.',
            show_forecast: 'Shows the forecast strip.',
            show_alerts: 'Shows weather warning cards.',
            debug: 'Shows a compact diagnostics panel below the main content.',
            mode: 'Frontpage is cinematic. Bulletin is more analytical.',
            forecast_mode: 'Auto detects whether the forecast is hourly or daily.',
            forecast_items: 'How many forecast entries to render.',
            facts: 'Choose which fact tiles appear in the lead panel.',
            headline_mode: 'Auto generates text from weather. Custom uses the field below.',
            headline_template: 'Used only when headline mode is custom.',
            condition_labels: 'Controls the language used for condition names.',
            show_quotes: 'Shows an inspired in-universe character note.',
            quote_rotation: 'Choose whether the quote changes with forecast shifts or on a twice-daily cadence.',
            quote_characters: 'Limit the quote pool to selected characters.',
            forecast_entity: 'Optional helper or template entity that exposes forecast data.',
            forecast_attribute: 'Attribute name on the forecast bridge entity. Defaults to forecast.',
            apparent_temperature: 'Optional sensor override for apparent temperature.',
            humidity: 'Optional sensor override for humidity.',
            pressure: 'Optional sensor override for pressure.',
            wind_speed: 'Optional sensor override for wind speed.',
            wind_bearing: 'Optional sensor override for wind bearing.',
            visibility: 'Optional sensor override for visibility.',
            uv_index: 'Optional sensor override for UV index.',
            cloud_coverage: 'Optional sensor override for cloud coverage.',
            precipitation: 'Optional sensor override for precipitation.',
            sunrise: 'Optional entity or sensor for sunrise time.',
            sunset: 'Optional entity or sensor for sunset time.',
            alerts: 'Optional warning entities, usually binary_sensors or sensors.',
            tap_action: 'What should happen when the card is clicked.',
            action: 'More-info opens the Home Assistant dialog for the main weather entity.',
        },
        facts: {
            humidity: 'Moisture',
            wind: 'Wind',
            pressure: 'Pressure',
            precipitation: 'Rainfall',
            visibility: 'Visibility',
            uv: 'UV',
            cloud_coverage: 'Cloud cover',
            sunrise: 'Sunrise',
            sunset: 'Sunset',
        },
        characterNames: {
            kaladin: 'Kaladin',
            shallan: 'Shallan',
            adolin: 'Adolin',
            dalinar: 'Dalinar',
            navani: 'Navani',
            rock: 'Rock',
        },
        conditions: {
            clear_night: 'clear night',
            cloudy: 'cloudy',
            exceptional: 'unusual',
            fog: 'fog',
            hail: 'hail',
            lightning: 'lightning',
            lightning_rainy: 'storm rain',
            partlycloudy: 'partly cloudy',
            pouring: 'downpour',
            rainy: 'rain',
            snowy: 'snow',
            snowy_rainy: 'sleet',
            sunny: 'sunny',
            windy: 'windy',
            windy_variant: 'gusty',
        },
    },
    pl: {
        eyebrow: 'Archiwum Pogodowe Strażników Burz',
        archiveStamp: 'Pieczęć archiwum Urithiru',
        defaultTitle: 'Archiwum Burzowego Światła',
        updated: 'Aktualizacja',
        feelsLike: 'Odczuwalna',
        specialEdition: 'Ostrzeżenia przed wysoką burzą',
        forecastTitle: 'Szlak burzy',
        almanacTitle: 'Cykl światła',
        quoteTitle: 'Notatka z terenu',
        currentTitle: 'Bieżące warunki',
        factsTitle: 'Pomiary',
        watchLabel: 'Wachta',
        quoteRotation: {
            forecast: 'Zmiana wraz ze zmianą prognozy',
            twice_daily: 'Zmiana dwa razy dziennie',
            hybrid: 'Zmiana przy prognozie lub każdej warcie',
        },
        forecastModeLabels: {
            hourly: 'rytm godzinowy',
            daily: 'rytm dzienny',
        },
        noForecast: 'Do wieży nie dotarła dziś żadna prognoza ze spanreedu.',
        chanceOfRain: 'Szansa opadów',
        low: 'Min',
        high: 'Max',
        windShort: 'Wiatr',
        quoteInspiredBy: 'W stylu postaci',
        debugTitle: 'Diagnostyka',
        debugLabels: {
            forecast_source: 'Źródło prognozy',
            forecast_items: 'Pozycje prognozy',
            forecast_mode: 'Tryb prognozy',
            weather_entity: 'Encja pogody',
            forecast_entity: 'Mostek prognozy',
            service_status: 'API prognozy',
            build_version: 'Wersja buildu',
        },
        alertLevels: {
            info: 'Komunikat',
            warning: 'Ostrzeżenie',
            critical: 'Wysoka burza',
        },
        labels: {
            entity: 'Encja pogody',
            title: 'Tytuł',
            subtitle: 'Podtytuł',
            location: 'Lokalizacja',
            style: 'Styl',
            preset: 'Preset',
            ha_theme: 'Motyw Home Assistanta',
            accent_color: 'Kolor akcentu',
            ink_color: 'Kolor tekstu',
            paper_color: 'Powierzchnia wewnętrzna',
            background: 'Tło zewnętrzne',
            density: 'Gęstość',
            paper_texture: 'Faktura kamienia',
            animated_hero: 'Animowana warstwa burzy',
            show_masthead: 'Pokaż nagłówek',
            show_almanac: 'Pokaż cykl światła',
            show_forecast: 'Pokaż prognozę',
            show_alerts: 'Pokaż ostrzeżenia',
            debug: 'Tryb debug',
            layout: 'Układ',
            mode: 'Tryb układu',
            forecast_mode: 'Tryb prognozy',
            forecast_items: 'Liczba pozycji prognozy',
            facts: 'Kafelki danych',
            content: 'Treść',
            headline_mode: 'Tryb nagłówka',
            headline_template: 'Własny nagłówek',
            condition_labels: 'Język warunków',
            show_quotes: 'Pokaż cytat',
            quote_rotation: 'Rotacja cytatu',
            quote_characters: 'Postacie cytatów',
            entities: 'Nadpisania danych',
            forecast_entity: 'Encja mostka prognozy',
            forecast_attribute: 'Atrybut prognozy',
            apparent_temperature: 'Sensor temperatury odczuwalnej',
            humidity: 'Sensor wilgotności',
            pressure: 'Sensor ciśnienia',
            wind_speed: 'Sensor prędkości wiatru',
            wind_bearing: 'Sensor kierunku wiatru',
            visibility: 'Sensor widoczności',
            uv_index: 'Sensor UV',
            cloud_coverage: 'Sensor zachmurzenia',
            precipitation: 'Sensor opadów',
            sunrise: 'Encja wschodu',
            sunset: 'Encja zachodu',
            alerts: 'Encje alertów',
            tap_action: 'Akcja kliknięcia',
            action: 'Akcja',
        },
        helpers: {
            entity: 'Główna encja weather.* dla bieżących warunków i domyślnego odczytu prognozy.',
            location: 'Opcjonalna nazwa miejsca pokazywana w nagłówku archiwum.',
            preset: 'Urithiru Archive to najbardziej uniwersalny preset startowy.',
            ha_theme: 'Opcjonalny motyw Home Assistanta dla tej karty.',
            accent_color: 'Własny kolor akcentów dla ramek i świetlistych detali.',
            ink_color: 'Nadpisuje główny kolor tekstu.',
            paper_color: 'Nadpisuje kolor wewnętrznego panelu archiwum.',
            background: 'Nadpisuje zewnętrzną powłokę karty.',
            density: 'Steruje odstępami wewnątrz karty.',
            paper_texture: 'Dodaje subtelną mineralną fakturę na powierzchni karty.',
            animated_hero: 'Włącza delikatny ruch warstw burzy i poświaty.',
            show_masthead: 'Pokazuje nagłówek archiwum.',
            show_almanac: 'Pokazuje bloki wschodu i zachodu słońca.',
            show_forecast: 'Pokazuje pasek prognozy.',
            show_alerts: 'Pokazuje karty ostrzeżeń pogodowych.',
            debug: 'Pokazuje kompaktowy panel diagnostyczny pod główną treścią.',
            mode: 'Frontpage jest bardziej filmowy. Bulletin jest bardziej analityczny.',
            forecast_mode: 'Auto wykrywa, czy prognoza jest godzinowa czy dzienna.',
            forecast_items: 'Ile pozycji prognozy wyświetlić.',
            facts: 'Wybierz, które kafelki danych mają się pojawić.',
            headline_mode: 'Auto generuje tekst z pogody. Custom używa pola poniżej.',
            headline_template: 'Używane tylko przy headline mode ustawionym na custom.',
            condition_labels: 'Steruje językiem nazw warunków pogodowych.',
            show_quotes: 'Pokazuje inspirowaną światem notatkę jednej z postaci.',
            quote_rotation: 'Wybierz, czy cytat ma zmieniać się wraz z prognozą, czy dwa razy dziennie.',
            quote_characters: 'Ogranicza pulę cytatów do wybranych postaci.',
            forecast_entity: 'Opcjonalna encja pomocnicza lub template z danymi prognozy.',
            forecast_attribute: 'Nazwa atrybutu na encji mostka. Domyślnie forecast.',
            apparent_temperature: 'Opcjonalny sensor temperatury odczuwalnej.',
            humidity: 'Opcjonalny sensor wilgotności.',
            pressure: 'Opcjonalny sensor ciśnienia.',
            wind_speed: 'Opcjonalny sensor prędkości wiatru.',
            wind_bearing: 'Opcjonalny sensor kierunku wiatru.',
            visibility: 'Opcjonalny sensor widoczności.',
            uv_index: 'Opcjonalny sensor UV.',
            cloud_coverage: 'Opcjonalny sensor zachmurzenia.',
            precipitation: 'Opcjonalny sensor opadów.',
            sunrise: 'Opcjonalna encja lub sensor wschodu słońca.',
            sunset: 'Opcjonalna encja lub sensor zachodu słońca.',
            alerts: 'Opcjonalne encje ostrzeżeń, zwykle binary_sensor lub sensor.',
            tap_action: 'Co ma się stać po kliknięciu w kartę.',
            action: 'More-info otwiera okno Home Assistanta dla głównej encji pogody.',
        },
        facts: {
            humidity: 'Wilgotność',
            wind: 'Wiatr',
            pressure: 'Ciśnienie',
            precipitation: 'Opady',
            visibility: 'Widoczność',
            uv: 'UV',
            cloud_coverage: 'Zachmurzenie',
            sunrise: 'Wschód',
            sunset: 'Zachód',
        },
        characterNames: {
            kaladin: 'Kaladin',
            shallan: 'Shallan',
            adolin: 'Adolin',
            dalinar: 'Dalinar',
            navani: 'Navani',
            rock: 'Skała',
        },
        conditions: {
            clear_night: 'bezchmurna noc',
            cloudy: 'pochmurnie',
            exceptional: 'nietypowo',
            fog: 'mgła',
            hail: 'grad',
            lightning: 'burza',
            lightning_rainy: 'burza z deszczem',
            partlycloudy: 'częściowe zachmurzenie',
            pouring: 'ulewa',
            rainy: 'deszcz',
            snowy: 'śnieg',
            snowy_rainy: 'deszcz ze śniegiem',
            sunny: 'słonecznie',
            windy: 'wietrznie',
            windy_variant: 'porywiście',
        },
    },
};
function getLanguage(hass) {
    const raw = String(hass?.language || hass?.locale?.language || hass?.config?.language || 'en').toLowerCase();
    return raw.startsWith('pl') ? 'pl' : 'en';
}
function getEditorLanguage() {
    const documentLanguage = typeof document !== 'undefined' ? document.documentElement?.lang : '';
    const browserLanguage = typeof navigator !== 'undefined' ? navigator.language : 'en';
    return getLanguage({
        language: documentLanguage || browserLanguage,
    });
}
function getTranslations(language) {
    return TRANSLATIONS[language] || TRANSLATIONS.en;
}

const PRESET_STYLES = {
    urithiru_archive: {
        cardBackground: 'linear-gradient(180deg, rgba(19,33,44,0.98), rgba(8,14,22,0.99))',
        paper: 'linear-gradient(180deg, #dfe5e8 0%, #c6d0d6 52%, #aab6bf 100%)',
        ink: '#15212b',
        muted: 'rgba(21, 33, 43, 0.68)',
        accent: '#7fa9c3',
        accentSoft: 'rgba(127, 169, 195, 0.18)',
        border: '#7a9caf',
        alert: '#c76b4e',
        shadow: 'rgba(3, 8, 14, 0.34)',
    },
    stormfront_warning: {
        cardBackground: 'linear-gradient(180deg, rgba(15,22,35,0.99), rgba(5,9,18,1))',
        paper: 'linear-gradient(180deg, #cfd9e3 0%, #aebbc8 48%, #8191a1 100%)',
        ink: '#101a24',
        muted: 'rgba(16, 26, 36, 0.7)',
        accent: '#7fd6ff',
        accentSoft: 'rgba(127, 214, 255, 0.16)',
        border: '#62b9df',
        alert: '#f28968',
        shadow: 'rgba(2, 7, 12, 0.42)',
    },
    navani_notebook: {
        cardBackground: 'linear-gradient(180deg, rgba(37,39,48,0.98), rgba(17,20,28,1))',
        paper: 'linear-gradient(180deg, #f0e4cf 0%, #dcc8a8 52%, #c5ab82 100%)',
        ink: '#2f2416',
        muted: 'rgba(47, 36, 22, 0.66)',
        accent: '#c68d3c',
        accentSoft: 'rgba(198, 141, 60, 0.18)',
        border: '#b88338',
        alert: '#b3563f',
        shadow: 'rgba(18, 12, 5, 0.3)',
    },
};
function getDensityValues(density) {
    if (density === 'compact') {
        return { cardPadding: '18px', heroPadding: '16px', gap: '14px' };
    }
    if (density === 'airy') {
        return { cardPadding: '28px', heroPadding: '24px', gap: '22px' };
    }
    return { cardPadding: '22px', heroPadding: '20px', gap: '18px' };
}

function formatNumber(value, fractionDigits = 0) {
    if (value === undefined || Number.isNaN(value)) {
        return '-';
    }
    return new Intl.NumberFormat('en-US', {
        maximumFractionDigits: fractionDigits,
        minimumFractionDigits: fractionDigits,
    }).format(value);
}
function formatTime(value) {
    if (!value) {
        return '-';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return '-';
    }
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    });
}
function cardinalFromBearing(bearing) {
    if (bearing === undefined || Number.isNaN(bearing)) {
        return '';
    }
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round((((bearing % 360) + 360) % 360) / 45) % 8;
    return directions[index];
}
function formatForecastTemperature(item, language) {
    const t = getTranslations(language);
    if (item.temperature === undefined && item.templow === undefined) {
        return '-';
    }
    if (item.templow === undefined || item.templow === item.temperature) {
        return item.temperature !== undefined ? `${Math.round(item.temperature)}°` : '-';
    }
    return `${t.high} ${Math.round(item.temperature || 0)}°  ${t.low} ${Math.round(item.templow)}°`;
}
function formatAlertSeverity(alert, language) {
    const t = getTranslations(language);
    return t.alertLevels[alert.severity];
}
function buildHeadline(snapshot, language) {
    const t = getTranslations(language);
    const condition = t.conditions[snapshot.condition] || snapshot.condition || t.conditions.cloudy;
    const temp = snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '';
    if (snapshot.alerts.length) {
        return language === 'pl'
            ? `Pilny meldunek: ${condition} przesuwa się nad ${snapshot.friendlyName}`
            : `Urgent report: ${condition} is sweeping over ${snapshot.friendlyName}`;
    }
    if (snapshot.condition === 'sunny') {
        return language === 'pl'
            ? `Jasne niebo nad ${snapshot.friendlyName}, ${temp} w świetle dnia`
            : `Clear skies over ${snapshot.friendlyName}, ${temp} under open light`;
    }
    if (snapshot.condition === 'rainy' || snapshot.condition === 'pouring' || snapshot.condition === 'lightning_rainy') {
        return language === 'pl'
            ? `Front burzowy dociera do ${snapshot.friendlyName}, przygotuj schronienie`
            : `Stormfront reaches ${snapshot.friendlyName}, seek shelter and supplies`;
    }
    if (snapshot.condition === 'snowy' || snapshot.condition === 'snowy_rainy') {
        return language === 'pl'
            ? `Chłodny front nad ${snapshot.friendlyName}, skała długo oddaje zimno`
            : `A cold front settles over ${snapshot.friendlyName}, stone keeps the chill`;
    }
    return language === 'pl'
        ? `${condition} w ${snapshot.friendlyName}, obecnie ${temp}`
        : `${condition} in ${snapshot.friendlyName}, currently ${temp}`;
}
function buildFacts(snapshot, facts, language) {
    const t = getTranslations(language);
    const map = {
        humidity: { key: 'humidity', label: t.facts.humidity, value: snapshot.humidity !== undefined ? `${formatNumber(snapshot.humidity)}%` : '-' },
        wind: {
            key: 'wind',
            label: t.facts.wind,
            value: snapshot.windSpeed !== undefined ? `${formatNumber(snapshot.windSpeed)} ${cardinalFromBearing(snapshot.windBearing)}`.trim() : '-',
        },
        pressure: { key: 'pressure', label: t.facts.pressure, value: snapshot.pressure !== undefined ? `${formatNumber(snapshot.pressure)} hPa` : '-' },
        precipitation: {
            key: 'precipitation',
            label: t.facts.precipitation,
            value: snapshot.precipitation !== undefined ? `${formatNumber(snapshot.precipitation, 1)} mm` : '-',
        },
        visibility: { key: 'visibility', label: t.facts.visibility, value: snapshot.visibility !== undefined ? `${formatNumber(snapshot.visibility, 1)} km` : '-' },
        uv: { key: 'uv', label: t.facts.uv, value: snapshot.uvIndex !== undefined ? formatNumber(snapshot.uvIndex, 1) : '-' },
        cloud_coverage: {
            key: 'cloud_coverage',
            label: t.facts.cloud_coverage,
            value: snapshot.cloudCoverage !== undefined ? `${formatNumber(snapshot.cloudCoverage)}%` : '-',
        },
        sunrise: { key: 'sunrise', label: t.facts.sunrise, value: formatTime(snapshot.sunrise) },
        sunset: { key: 'sunset', label: t.facts.sunset, value: formatTime(snapshot.sunset) },
    };
    return facts.map((fact) => map[fact]).filter(Boolean);
}

const QUOTES = [
    {
        character: 'kaladin',
        weather: ['storm', 'wind', 'rain'],
        text: {
            pl: 'Wiatr nigdy nie pyta, czy jesteś gotów. Możesz tylko stanąć pewnie i oddychać razem z nim.',
            en: 'The wind never asks whether you are ready. You just plant your feet and breathe with it.',
        },
    },
    {
        character: 'kaladin',
        weather: ['cloud', 'cold', 'any'],
        text: {
            pl: 'Nawet najcięższe niebo w końcu pęka. Trzeba tylko wytrzymać do światła.',
            en: 'Even the heaviest sky breaks eventually. You only have to hold until the light returns.',
        },
    },
    {
        character: 'shallan',
        weather: ['sun', 'cloud', 'any'],
        text: {
            pl: 'Pogoda też nosi maski. Czasem trzeba spojrzeć dwa razy, by zobaczyć, czy chmura nie udaje światła.',
            en: 'Weather wears masks too. Sometimes you need a second glance to see whether a cloud is pretending to be light.',
        },
    },
    {
        character: 'shallan',
        weather: ['rain', 'storm'],
        text: {
            pl: 'Deszcz poprawia kontury świata. Wszystko staje się bardziej dramatyczne, a więc odrobinę bardziej szczere.',
            en: 'Rain sharpens the world\'s lines. Everything turns more dramatic, and therefore a bit more honest.',
        },
    },
    {
        character: 'adolin',
        weather: ['sun', 'wind', 'any'],
        text: {
            pl: 'Dobra pogoda jest jak dobrze skrojony mundur. Nie wygrywa za ciebie bitwy, ale pomaga wejść w nią z podniesioną głową.',
            en: 'Good weather is like a well-cut uniform. It does not win the battle for you, but it helps you step into it proudly.',
        },
    },
    {
        character: 'adolin',
        weather: ['storm', 'rain'],
        text: {
            pl: 'Jeśli nadciąga burza, przynajmniej nadciąga z rozmachem. Szanuję to.',
            en: 'If a storm is coming, at least it arrives with style. I can respect that.',
        },
    },
    {
        character: 'dalinar',
        weather: ['storm', 'wind', 'any'],
        text: {
            pl: 'Burza nie jest wrogiem ani sprzymierzeńcem. Jest próbą. To my wybieramy, jak ją przejdziemy.',
            en: 'The storm is neither enemy nor ally. It is a test. We decide how we walk through it.',
        },
    },
    {
        character: 'dalinar',
        weather: ['sun', 'cloud', 'any'],
        text: {
            pl: 'Spokojne niebo także wymaga dyscypliny. Łatwo zmarnować jasny dzień, jeśli uzna się go za rzecz należną.',
            en: 'A calm sky requires discipline too. Bright days are easy to waste when we treat them as owed to us.',
        },
    },
    {
        character: 'navani',
        weather: ['storm', 'rain', 'wind'],
        text: {
            pl: 'Każda burza zostawia wzór. Jeśli umiemy go odczytać, ostrzeżenie staje się wiedzą.',
            en: 'Every storm leaves a pattern. If we can read it, warning becomes knowledge.',
        },
    },
    {
        character: 'navani',
        weather: ['sun', 'cloud', 'any'],
        text: {
            pl: 'Lubię pogodę, którą da się zmierzyć, a jeszcze bardziej tę, która po pomiarze wciąż potrafi zaskoczyć.',
            en: 'I admire weather that can be measured, and even more the kind that still surprises after measurement.',
        },
    },
    {
        character: 'rock',
        weather: ['cold', 'wind', 'rain'],
        text: {
            pl: 'Gdy wiatr gryzie, trzeba mieć gorący garnek i lepszych przyjaciół. Najlepiej jedno i drugie.',
            en: 'When the wind bites, you need a hot pot and better friends. Best to have both.',
        },
    },
    {
        character: 'rock',
        weather: ['sun', 'any'],
        text: {
            pl: 'Słońce jest dobre. Pod takim niebem nawet zupa wie, że trzeba się bardziej postarać.',
            en: 'Sun is good. Under that kind of sky even the stew knows it ought to do its best.',
        },
    },
];
function hashString(value) {
    let hash = 0;
    for (let i = 0; i < value.length; i += 1) {
        hash = ((hash << 5) - hash + value.charCodeAt(i)) | 0;
    }
    return Math.abs(hash);
}
function classifyWeather(condition) {
    if (['lightning', 'lightning_rainy', 'pouring'].includes(condition)) {
        return 'storm';
    }
    if (['rainy', 'hail', 'snowy_rainy'].includes(condition)) {
        return 'rain';
    }
    if (['windy', 'windy_variant'].includes(condition)) {
        return 'wind';
    }
    if (['sunny', 'clear_night'].includes(condition)) {
        return 'sun';
    }
    if (['snowy', 'fog'].includes(condition)) {
        return 'cold';
    }
    return 'cloud';
}
function createForecastSignature(forecast) {
    return forecast
        .slice(0, 4)
        .map((item) => [item.datetime || '', item.condition || '', item.temperature ?? '', item.templow ?? ''].join(':'))
        .join('|');
}
function createRotationKey(snapshot, forecast, rotation) {
    const now = new Date();
    const halfdayBucket = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}-${now.getHours() < 12 ? 'daywatch' : 'nightwatch'}`;
    const forecastSignature = `${snapshot.condition}|${snapshot.temperature ?? ''}|${createForecastSignature(forecast)}`;
    if (rotation === 'forecast') {
        return forecastSignature;
    }
    if (rotation === 'twice_daily') {
        return halfdayBucket;
    }
    return `${forecastSignature}|${halfdayBucket}`;
}
function selectQuote(options) {
    const language = options.language;
    const t = getTranslations(language);
    const rotation = options.rotation;
    const weatherTag = classifyWeather(options.snapshot.condition);
    const allowedCharacters = options.characters?.length ? options.characters : undefined;
    const pool = QUOTES.filter((quote) => {
        const characterMatch = !allowedCharacters || allowedCharacters.includes(quote.character);
        const weatherMatch = quote.weather.includes('any') || quote.weather.includes(weatherTag);
        return characterMatch && weatherMatch;
    });
    const finalPool = pool.length ? pool : QUOTES.filter((quote) => !allowedCharacters || allowedCharacters.includes(quote.character));
    if (!finalPool.length) {
        return undefined;
    }
    const seed = createRotationKey(options.snapshot, options.forecast, rotation);
    const selected = finalPool[hashString(seed) % finalPool.length];
    return {
        character: selected.character,
        characterLabel: t.characterNames[selected.character] || selected.character,
        text: selected.text[language],
        rotationLabel: t.quoteRotation[rotation],
    };
}

function getEntity(hass, entityId) {
    if (!hass || !entityId) {
        return undefined;
    }
    return hass.states?.[entityId];
}
function readNumberEntityState(entity) {
    if (!entity) {
        return undefined;
    }
    const value = Number(entity.state);
    return Number.isFinite(value) ? value : undefined;
}
function readNumberAttribute(entity, keys) {
    for (const key of keys) {
        const value = Number(entity?.attributes?.[key]);
        if (Number.isFinite(value)) {
            return value;
        }
    }
    return undefined;
}
function readStringAttribute(entity, keys) {
    for (const key of keys) {
        const value = entity?.attributes?.[key];
        if (value !== undefined && value !== null && String(value).trim()) {
            return String(value);
        }
    }
    return undefined;
}
function normalizeForecastData(raw) {
    if (!Array.isArray(raw)) {
        return [];
    }
    return raw.map((item) => ({
        datetime: item?.datetime,
        temperature: Number.isFinite(Number(item?.temperature)) ? Number(item.temperature) : undefined,
        templow: Number.isFinite(Number(item?.templow)) ? Number(item.templow) : undefined,
        condition: item?.condition ? String(item.condition) : undefined,
        precipitation: Number.isFinite(Number(item?.precipitation)) ? Number(item.precipitation) : undefined,
        precipitation_probability: Number.isFinite(Number(item?.precipitation_probability)) ? Number(item.precipitation_probability) : undefined,
        wind_speed: Number.isFinite(Number(item?.wind_speed)) ? Number(item.wind_speed) : undefined,
        is_daytime: item?.is_daytime === undefined ? undefined : Boolean(item.is_daytime),
    }));
}
function extractForecastResponse(raw, entityId) {
    if (!raw) {
        return [];
    }
    if (Array.isArray(raw)) {
        for (const entry of raw) {
            const extracted = extractForecastResponse(entry, entityId);
            if (extracted.length) {
                return extracted;
            }
        }
        return [];
    }
    if (typeof raw !== 'object') {
        return [];
    }
    const directEntityForecast = raw?.[entityId]?.forecast;
    if (Array.isArray(directEntityForecast)) {
        return normalizeForecastData(directEntityForecast);
    }
    if (Array.isArray(raw.forecast)) {
        return normalizeForecastData(raw.forecast);
    }
    for (const value of Object.values(raw)) {
        const extracted = extractForecastResponse(value, entityId);
        if (extracted.length) {
            return extracted;
        }
    }
    return [];
}
function deriveAlertSeverity(entity) {
    const raw = String(entity.attributes?.severity
        || entity.attributes?.level
        || entity.state
        || '').toLowerCase();
    if (['critical', 'severe', 'extreme', 'danger', 'on'].includes(raw)) {
        return 'critical';
    }
    if (['warning', 'watch', 'moderate', 'problem'].includes(raw)) {
        return 'warning';
    }
    return 'info';
}
function normalizeAlerts(entities) {
    return entities
        .filter((entity) => !['off', 'false', '0', 'idle', 'unknown', 'unavailable'].includes(String(entity.state).toLowerCase()))
        .map((entity) => ({
        entityId: entity.entity_id,
        title: String(entity.attributes?.headline
            || entity.attributes?.title
            || entity.attributes?.friendly_name
            || entity.entity_id),
        severity: deriveAlertSeverity(entity),
        description: String(entity.attributes?.description
            || entity.attributes?.message
            || entity.attributes?.event
            || '').trim() || undefined,
    }));
}
function createWeatherSnapshot(hass, config) {
    const weatherEntity = getEntity(hass, config.entity);
    const overrides = config.entities || {};
    const forecastEntity = getEntity(hass, overrides.forecast_entity);
    const humidityEntity = getEntity(hass, overrides.humidity);
    const pressureEntity = getEntity(hass, overrides.pressure);
    const windSpeedEntity = getEntity(hass, overrides.wind_speed);
    const windBearingEntity = getEntity(hass, overrides.wind_bearing);
    const apparentEntity = getEntity(hass, overrides.apparent_temperature);
    const visibilityEntity = getEntity(hass, overrides.visibility);
    const uvEntity = getEntity(hass, overrides.uv_index);
    const cloudEntity = getEntity(hass, overrides.cloud_coverage);
    const precipitationEntity = getEntity(hass, overrides.precipitation);
    const sunriseEntity = getEntity(hass, overrides.sunrise);
    const sunsetEntity = getEntity(hass, overrides.sunset);
    const alertEntities = (overrides.alerts || []).map((entityId) => getEntity(hass, entityId)).filter(Boolean);
    const forecastSource = normalizeForecastData(forecastEntity?.attributes?.[overrides.forecast_attribute || 'forecast']
        ?? weatherEntity?.attributes?.forecast);
    const lastUpdated = forecastSource[0]?.datetime || weatherEntity?.attributes?.last_updated;
    const lastUpdatedLabel = lastUpdated
        ? new Date(lastUpdated).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })
        : new Date().toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
    return {
        entityId: config.entity,
        state: weatherEntity?.state || 'unknown',
        condition: weatherEntity?.state || 'cloudy',
        temperature: readNumberAttribute(weatherEntity, ['temperature']) ?? readNumberEntityState(weatherEntity),
        apparentTemperature: readNumberEntityState(apparentEntity) ?? readNumberAttribute(weatherEntity, ['apparent_temperature', 'feels_like']),
        humidity: readNumberEntityState(humidityEntity) ?? readNumberAttribute(weatherEntity, ['humidity']),
        pressure: readNumberEntityState(pressureEntity) ?? readNumberAttribute(weatherEntity, ['pressure']),
        windSpeed: readNumberEntityState(windSpeedEntity) ?? readNumberAttribute(weatherEntity, ['wind_speed']),
        windBearing: readNumberEntityState(windBearingEntity) ?? readNumberAttribute(weatherEntity, ['wind_bearing']),
        visibility: readNumberEntityState(visibilityEntity) ?? readNumberAttribute(weatherEntity, ['visibility']),
        uvIndex: readNumberEntityState(uvEntity) ?? readNumberAttribute(weatherEntity, ['uv_index']),
        cloudCoverage: readNumberEntityState(cloudEntity) ?? readNumberAttribute(weatherEntity, ['cloud_coverage']),
        precipitation: readNumberEntityState(precipitationEntity) ?? readNumberAttribute(weatherEntity, ['precipitation', 'precipitation_amount']),
        sunrise: sunriseEntity?.state || readStringAttribute(weatherEntity, ['sunrise']),
        sunset: sunsetEntity?.state || readStringAttribute(weatherEntity, ['sunset']),
        friendlyName: config.location || String(weatherEntity?.attributes?.friendly_name || config.title || 'Hogwarts'),
        attribution: readStringAttribute(weatherEntity, ['attribution']),
        forecast: forecastSource,
        alerts: normalizeAlerts(alertEntities),
        lastUpdatedLabel,
    };
}

const CARD_TAG = 'zs-stormlight-weather-card';
const CARD_VERSION = '0.1.1';
const DEFAULT_CONFIG = {
    type: `custom:${CARD_TAG}`,
    entity: '',
    title: 'Stormlight Weather Archive',
    subtitle: 'Roshar weather report',
    location: '',
    style: {
        preset: 'urithiru_archive',
        density: 'comfortable',
        paper_texture: true,
        animated_hero: false,
        show_masthead: true,
        show_almanac: true,
        show_forecast: true,
        show_alerts: true,
        debug: false,
    },
    layout: {
        mode: 'frontpage',
        forecast_mode: 'daily',
        forecast_items: 5,
        facts: ['humidity', 'wind', 'pressure', 'precipitation'],
    },
    content: {
        headline_mode: 'auto',
        headline_template: '',
        condition_labels: 'auto',
        show_quotes: true,
        quote_rotation: 'hybrid',
        quote_characters: ['kaladin', 'shallan', 'adolin', 'dalinar', 'navani', 'rock'],
    },
    entities: {},
    tap_action: {
        action: 'more-info',
    },
};
function mergeConfig(config) {
    return {
        ...DEFAULT_CONFIG,
        ...config,
        style: { ...DEFAULT_CONFIG.style, ...(config.style || {}) },
        layout: { ...DEFAULT_CONFIG.layout, ...(config.layout || {}) },
        content: { ...DEFAULT_CONFIG.content, ...(config.content || {}) },
        entities: { ...DEFAULT_CONFIG.entities, ...(config.entities || {}) },
        tap_action: { ...DEFAULT_CONFIG.tap_action, ...(config.tap_action || {}) },
    };
}
function getConditionIcon(condition) {
    switch (condition) {
        case 'sunny':
            return '\u263c';
        case 'partlycloudy':
            return '\u26c5';
        case 'rainy':
        case 'pouring':
            return '\u2614';
        case 'lightning':
        case 'lightning_rainy':
            return '\u2607';
        case 'snowy':
        case 'snowy_rainy':
            return '\u2744';
        case 'fog':
            return '\u3030';
        case 'windy':
        case 'windy_variant':
            return '\ud83c\udf01';
        default:
            return '\u2601';
    }
}
function formatForecastLabel(item, mode) {
    if (!item.datetime) {
        return 'Watch';
    }
    const date = new Date(item.datetime);
    if (Number.isNaN(date.getTime())) {
        return 'Watch';
    }
    if (mode === 'hourly') {
        return date.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
        });
    }
    return date.toLocaleDateString([], {
        weekday: 'short',
    });
}
function resolveForecastMode(configuredMode, items) {
    if (configuredMode === 'hourly' || configuredMode === 'daily') {
        return configuredMode;
    }
    const first = items[0]?.datetime ? new Date(items[0].datetime) : undefined;
    const second = items[1]?.datetime ? new Date(items[1].datetime) : undefined;
    if (!first || !second || Number.isNaN(first.getTime()) || Number.isNaN(second.getTime())) {
        return 'daily';
    }
    const diff = Math.abs(second.getTime() - first.getTime());
    return diff <= 1000 * 60 * 60 * 6 ? 'hourly' : 'daily';
}
class ZSDailyProphetCard extends i$2 {
    constructor() {
        super(...arguments);
        this.serviceForecast = [];
        this.forecastLoading = false;
        this.forecastSource = 'weather_entity';
        this.forecastServiceStatus = 'idle';
        this.lastForecastFetchKey = '';
        this.forecastRequestToken = 0;
    }
    static getStubConfig() {
        return {
            type: `custom:${CARD_TAG}`,
            entity: 'weather.home',
            title: 'Archiwum Burzowego ĹšwiatĹ‚a',
            subtitle: 'Raport pogodowy Rosharu',
            location: 'Urithiru i okolice',
            style: {
                preset: 'urithiru_archive',
            },
        };
    }
    static getConfigForm() {
        const t = getTranslations(getEditorLanguage());
        return {
            schema: [
                {
                    name: 'entity',
                    required: true,
                    selector: {
                        entity: {
                            filter: [{ domain: 'weather' }],
                        },
                    },
                },
                { name: 'title', selector: { text: {} } },
                { name: 'subtitle', selector: { text: {} } },
                { name: 'location', selector: { text: {} } },
                {
                    type: 'expandable',
                    name: 'style',
                    title: t.labels.style,
                    schema: [
                        {
                            name: 'preset',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'urithiru_archive', label: 'Urithiru Archive' },
                                        { value: 'stormfront_warning', label: 'Stormfront Warning' },
                                        { value: 'navani_notebook', label: 'Navani Notebook' },
                                    ],
                                },
                            },
                        },
                        { name: 'ha_theme', selector: { theme: {} } },
                        { name: 'accent_color', selector: { text: {} } },
                        { name: 'ink_color', selector: { text: {} } },
                        { name: 'paper_color', selector: { text: {} } },
                        { name: 'background', selector: { text: {} } },
                        {
                            name: 'density',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'compact', label: 'Compact' },
                                        { value: 'comfortable', label: 'Comfortable' },
                                        { value: 'airy', label: 'Airy' },
                                    ],
                                },
                            },
                        },
                        { name: 'paper_texture', selector: { boolean: {} } },
                        { name: 'animated_hero', selector: { boolean: {} } },
                        { name: 'show_masthead', selector: { boolean: {} } },
                        { name: 'show_almanac', selector: { boolean: {} } },
                        { name: 'show_forecast', selector: { boolean: {} } },
                        { name: 'show_alerts', selector: { boolean: {} } },
                        { name: 'debug', selector: { boolean: {} } },
                    ],
                },
                {
                    type: 'expandable',
                    name: 'layout',
                    title: t.labels.layout,
                    schema: [
                        {
                            name: 'mode',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'frontpage', label: 'Frontpage' },
                                        { value: 'bulletin', label: 'Bulletin' },
                                    ],
                                },
                            },
                        },
                        {
                            name: 'forecast_mode',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'auto', label: 'Auto' },
                                        { value: 'hourly', label: 'Hourly' },
                                        { value: 'daily', label: 'Daily' },
                                    ],
                                },
                            },
                        },
                        {
                            name: 'forecast_items',
                            selector: {
                                number: {
                                    min: 1,
                                    max: 12,
                                    step: 1,
                                    mode: 'slider',
                                },
                            },
                        },
                        {
                            name: 'facts',
                            selector: {
                                select: {
                                    multiple: true,
                                    mode: 'list',
                                    options: [
                                        { value: 'humidity', label: t.facts.humidity },
                                        { value: 'wind', label: t.facts.wind },
                                        { value: 'pressure', label: t.facts.pressure },
                                        { value: 'precipitation', label: t.facts.precipitation },
                                        { value: 'visibility', label: t.facts.visibility },
                                        { value: 'uv', label: t.facts.uv },
                                        { value: 'cloud_coverage', label: t.facts.cloud_coverage },
                                        { value: 'sunrise', label: t.facts.sunrise },
                                        { value: 'sunset', label: t.facts.sunset },
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    type: 'expandable',
                    name: 'content',
                    title: t.labels.content,
                    schema: [
                        {
                            name: 'headline_mode',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'auto', label: 'Auto' },
                                        { value: 'custom', label: 'Custom' },
                                        { value: 'none', label: 'None' },
                                    ],
                                },
                            },
                        },
                        { name: 'headline_template', selector: { text: {} } },
                        {
                            name: 'condition_labels',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'auto', label: 'Auto' },
                                        { value: 'pl', label: 'Polish' },
                                        { value: 'en', label: 'English' },
                                    ],
                                },
                            },
                        },
                        { name: 'show_quotes', selector: { boolean: {} } },
                        {
                            name: 'quote_rotation',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'forecast', label: 'Forecast' },
                                        { value: 'twice_daily', label: 'Twice daily' },
                                        { value: 'hybrid', label: 'Hybrid' },
                                    ],
                                },
                            },
                        },
                        {
                            name: 'quote_characters',
                            selector: {
                                select: {
                                    multiple: true,
                                    mode: 'list',
                                    options: [
                                        { value: 'kaladin', label: t.characterNames.kaladin },
                                        { value: 'shallan', label: t.characterNames.shallan },
                                        { value: 'adolin', label: t.characterNames.adolin },
                                        { value: 'dalinar', label: t.characterNames.dalinar },
                                        { value: 'navani', label: t.characterNames.navani },
                                        { value: 'rock', label: t.characterNames.rock },
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    type: 'expandable',
                    name: 'entities',
                    title: t.labels.entities,
                    schema: [
                        { name: 'forecast_entity', selector: { entity: {} } },
                        { name: 'forecast_attribute', selector: { text: {} } },
                        { name: 'apparent_temperature', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'humidity', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'pressure', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'wind_speed', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'wind_bearing', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'visibility', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'uv_index', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'cloud_coverage', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'precipitation', selector: { entity: { filter: [{ domain: 'sensor' }] } } },
                        { name: 'sunrise', selector: { entity: {} } },
                        { name: 'sunset', selector: { entity: {} } },
                        {
                            name: 'alerts',
                            selector: {
                                entity: {
                                    multiple: true,
                                    filter: [{ domain: 'binary_sensor' }, { domain: 'sensor' }],
                                },
                            },
                        },
                    ],
                },
                {
                    type: 'expandable',
                    name: 'tap_action',
                    title: t.labels.tap_action,
                    schema: [
                        {
                            name: 'action',
                            selector: {
                                select: {
                                    options: [
                                        { value: 'more-info', label: 'More info' },
                                        { value: 'none', label: 'None' },
                                    ],
                                },
                            },
                        },
                    ],
                },
            ],
            computeLabel: (schema) => t.labels[schema.name] || schema.name,
            computeHelper: (schema) => t.helpers[schema.name],
        };
    }
    setConfig(config) {
        if (!config.entity?.trim()) {
            throw new Error('`entity` is required.');
        }
        this.config = config;
        this.resolvedConfig = mergeConfig(config);
    }
    updated(changedProperties) {
        if (changedProperties.has('hass') || changedProperties.has('config')) {
            void this.refreshForecastIfNeeded();
        }
    }
    getCardSize() {
        return 6;
    }
    getGridOptions() {
        return {
            columns: 12,
            min_columns: 4,
            rows: 6,
            min_rows: 5,
        };
    }
    get language() {
        const configured = this.effectiveConfig?.content?.condition_labels;
        if (configured && configured !== 'auto') {
            return configured;
        }
        return getLanguage(this.hass);
    }
    get t() {
        return getTranslations(this.language);
    }
    get effectiveConfig() {
        return this.resolvedConfig;
    }
    get preset() {
        return PRESET_STYLES[this.effectiveConfig.style?.preset || 'urithiru_archive'] || PRESET_STYLES.urithiru_archive;
    }
    get selectedThemeVariables() {
        const themeName = this.effectiveConfig.style?.ha_theme;
        if (!themeName) {
            return {};
        }
        return { ...(this.hass?.themes?.themes?.[themeName] || {}) };
    }
    get selectedFacts() {
        return this.effectiveConfig.layout?.facts?.length ? this.effectiveConfig.layout.facts : ['humidity', 'wind', 'pressure', 'precipitation'];
    }
    get isWeatherBureau() {
        return this.effectiveConfig.style?.preset === 'navani_notebook';
    }
    get isAnimatedFrontPage() {
        return this.effectiveConfig.style?.preset === 'stormfront_warning';
    }
    get isUrithiruArchive() {
        return !this.isAnimatedFrontPage && !this.isWeatherBureau;
    }
    get presetLayoutClass() {
        if (this.isAnimatedFrontPage) {
            return 'stormfront-layout';
        }
        if (this.isWeatherBureau) {
            return 'navani-layout';
        }
        return 'urithiru-layout';
    }
    get effectiveForecastMode() {
        const configured = this.effectiveConfig.layout?.forecast_mode || 'daily';
        return configured === 'hourly' ? 'hourly' : 'daily';
    }
    openMoreInfo() {
        const config = this.effectiveConfig;
        if (config.tap_action?.action === 'none') {
            return;
        }
        const event = new Event('hass-more-info', { bubbles: true, composed: true });
        event.detail = { entityId: config.entity };
        this.dispatchEvent(event);
    }
    computeCardStyle() {
        const config = this.effectiveConfig;
        const density = getDensityValues(config.style?.density);
        return {
            ...this.selectedThemeVariables,
            '--zs-prophet-card-bg': config.style?.background || this.preset.cardBackground,
            '--zs-prophet-paper': config.style?.paper_color || this.preset.paper,
            '--zs-prophet-ink': config.style?.ink_color || this.preset.ink,
            '--zs-prophet-muted': this.preset.muted,
            '--zs-prophet-accent': config.style?.accent_color || this.preset.accent,
            '--zs-prophet-accent-soft': this.preset.accentSoft,
            '--zs-prophet-border': config.style?.accent_color || this.preset.border,
            '--zs-prophet-alert': this.preset.alert,
            '--zs-prophet-shadow': this.preset.shadow,
            '--zs-prophet-card-padding': density.cardPadding,
            '--zs-prophet-gap': density.gap,
            '--zs-prophet-hero-padding': density.heroPadding,
        };
    }
    getForecastModeLabel(mode) {
        return this.t.forecastModeLabels[mode] || mode;
    }
    async fetchForecastFromService(forecastType) {
        const config = this.effectiveConfig;
        const callApi = this.hass?.callApi;
        if (!callApi || !config?.entity) {
            return [];
        }
        const attempts = [
            {
                path: 'services/weather/get_forecasts?return_response',
                body: {
                    target: { entity_id: [config.entity] },
                    data: { type: forecastType },
                },
            },
            {
                path: 'services/weather/get_forecasts?return_response=true',
                body: {
                    target: { entity_id: [config.entity] },
                    data: { type: forecastType },
                },
            },
            {
                path: 'services/weather/get_forecasts?return_response',
                body: {
                    entity_id: config.entity,
                    type: forecastType,
                },
            },
        ];
        for (const attempt of attempts) {
            try {
                const response = await callApi('POST', attempt.path, attempt.body);
                const forecast = extractForecastResponse(response, config.entity);
                if (forecast.length) {
                    return forecast;
                }
            }
            catch {
                continue;
            }
        }
        return [];
    }
    async refreshForecastIfNeeded() {
        const config = this.effectiveConfig;
        if (!this.hass || !config) {
            return;
        }
        if (config.entities?.forecast_entity) {
            this.forecastSource = 'forecast_entity';
            this.forecastServiceStatus = 'skipped';
            if (this.serviceForecast.length) {
                this.serviceForecast = [];
            }
            return;
        }
        const weatherEntity = this.hass.states?.[config.entity];
        const directForecast = weatherEntity?.attributes?.forecast;
        if (Array.isArray(directForecast) && directForecast.length) {
            this.forecastSource = 'weather_entity';
            this.forecastServiceStatus = 'skipped';
            if (this.serviceForecast.length) {
                this.serviceForecast = [];
            }
            return;
        }
        const fetchKey = [
            config.entity,
            this.effectiveForecastMode,
            weatherEntity?.state || '',
            weatherEntity?.attributes?.temperature ?? '',
            weatherEntity?.last_updated || '',
        ].join('|');
        if (fetchKey === this.lastForecastFetchKey) {
            return;
        }
        this.lastForecastFetchKey = fetchKey;
        const requestToken = ++this.forecastRequestToken;
        this.forecastLoading = true;
        this.forecastServiceStatus = 'loading';
        const primaryForecast = await this.fetchForecastFromService(this.effectiveForecastMode);
        const fallbackForecast = !primaryForecast.length && this.effectiveForecastMode === 'daily'
            ? await this.fetchForecastFromService('hourly')
            : [];
        if (requestToken !== this.forecastRequestToken) {
            return;
        }
        this.serviceForecast = primaryForecast.length ? primaryForecast : fallbackForecast;
        this.forecastSource = this.serviceForecast.length ? 'weather_service' : 'unavailable';
        this.forecastServiceStatus = this.serviceForecast.length ? 'ok' : 'unavailable';
        this.forecastLoading = false;
    }
    renderDebugPanel(forecastMode, forecastItems) {
        const config = this.effectiveConfig;
        if (config.style?.debug !== true) {
            return '';
        }
        const debugItems = [
            { label: this.t.debugLabels.weather_entity, value: config.entity || '-' },
            { label: this.t.debugLabels.forecast_entity, value: config.entities?.forecast_entity || '-' },
            { label: this.t.debugLabels.forecast_source, value: this.forecastSource },
            { label: this.t.debugLabels.service_status, value: this.forecastServiceStatus },
            { label: this.t.debugLabels.forecast_mode, value: forecastMode },
            { label: this.t.debugLabels.forecast_items, value: String(forecastItems.length) },
            { label: this.t.debugLabels.build_version, value: CARD_VERSION },
        ];
        return b `
      <section class="debug-panel">
        <div class="debug-title">${this.t.debugTitle}</div>
        <div class="debug-grid">
          ${debugItems.map((item) => b `
            <div class="debug-item">
              <div class="debug-label">${item.label}</div>
              <div class="debug-value">${item.value}</div>
            </div>
          `)}
        </div>
      </section>
    `;
    }
    renderForecastItem(item, mode) {
        const conditionLabel = this.t.conditions[item.condition] || item.condition || '';
        const rainChance = item.precipitation_probability !== undefined ? `${this.t.chanceOfRain}: ${Math.round(item.precipitation_probability)}%` : '';
        const precipitation = item.precipitation !== undefined ? `${item.precipitation.toFixed(1)} mm` : '';
        const wind = item.wind_speed !== undefined ? `${this.t.windShort}: ${Math.round(item.wind_speed)}` : '';
        return b `
      <div class="forecast-item">
        <div class="forecast-name">${formatForecastLabel(item, mode)}</div>
        <div class="forecast-main">
          <div class="forecast-temp">${mode === 'hourly'
            ? (item.temperature !== undefined ? `${Math.round(item.temperature)}°` : '-')
            : formatForecastTemperature(item, this.language)}</div>
          <div class="forecast-extra forecast-condition">${getConditionIcon(item.condition || 'cloudy')} ${conditionLabel}</div>
        </div>
        <div class="forecast-meta">
          ${rainChance ? b `<div>${rainChance}</div>` : ''}
          ${precipitation ? b `<div>${precipitation}</div>` : ''}
          ${wind ? b `<div>${wind}</div>` : ''}
        </div>
      </div>
    `;
    }
    renderHeader(snapshot) {
        const config = this.effectiveConfig;
        if (config.style?.show_masthead === false) {
            return '';
        }
        if (!this.isWeatherBureau && !this.isAnimatedFrontPage) {
            return b `
        <div class="masthead">
          <div class="archive-header">
            <div class="archive-sigil" aria-hidden="true"></div>
            <div class="archive-copy">
              <div class="eyebrow">${this.t.eyebrow}</div>
              <div class="title">${config.title || this.t.defaultTitle}</div>
              ${config.subtitle ? b `<div class="subtitle">${config.subtitle}</div>` : ''}
            </div>
            <div class="archive-meta">
              <div class="archive-meta-chip">${this.t.archiveStamp}</div>
              <div>${snapshot.friendlyName}</div>
              <div>${this.t.updated}: ${snapshot.lastUpdatedLabel}</div>
            </div>
          </div>
        </div>
      `;
        }
        if (this.isAnimatedFrontPage) {
            return b `
        <div class="animated-header">
          <div class="animated-ribbon">${this.t.eyebrow}</div>
          <div class="animated-grid">
            <div class="bureau-title">
              <div class="title">${config.title || this.t.defaultTitle}</div>
              ${config.subtitle ? b `<div class="subtitle">${config.subtitle}</div>` : ''}
            </div>
            <div class="animated-meta">
              <div>${this.t.updated}: ${snapshot.lastUpdatedLabel}</div>
              <div>${snapshot.friendlyName}</div>
            </div>
          </div>
        </div>
      `;
        }
        return b `
      <div class="bureau-header">
        <div class="bureau-bar">
          <div class="bureau-stamp">${this.t.eyebrow}</div>
          <div class="bureau-stamp">${snapshot.friendlyName}</div>
        </div>
        <div class="bureau-grid">
          <div class="bureau-title">
            <div class="title">${config.title || this.t.defaultTitle}</div>
            ${config.subtitle ? b `<div class="subtitle">${config.subtitle}</div>` : ''}
          </div>
          <div class="bureau-meta">
            <div>${this.t.updated}: ${snapshot.lastUpdatedLabel}</div>
            <div>${snapshot.state}</div>
          </div>
        </div>
      </div>
    `;
    }
    renderQuoteBlock(snapshot, forecastItems) {
        const config = this.effectiveConfig;
        if (config.content?.show_quotes === false) {
            return '';
        }
        const quote = selectQuote({
            language: this.language,
            snapshot,
            forecast: forecastItems,
            rotation: config.content?.quote_rotation || 'hybrid',
            characters: config.content?.quote_characters,
        });
        if (!quote) {
            return '';
        }
        return b `
      <aside class="quote-card">
        <div class="quote-kicker">${this.t.quoteTitle}</div>
        <div class="quote-body">"${quote.text}"</div>
        <div class="quote-meta">
          <span>${this.t.quoteInspiredBy}: ${quote.characterLabel}</span>
          <span>${quote.rotationLabel}</span>
        </div>
      </aside>
    `;
    }
    renderHero(snapshot, headline, facts, conditionLabel, forecastItems) {
        const config = this.effectiveConfig;
        if (!this.isWeatherBureau && !this.isAnimatedFrontPage) {
            return b `
        <section class="hero">
          <div class="lead">
            <div class="lead-copy">
              <div class="edition-row">
                <span>${snapshot.friendlyName}</span>
                <span>${this.t.updated}: ${snapshot.lastUpdatedLabel}</span>
              </div>
              <div class="story-kicker">${this.t.currentTitle}</div>
              ${headline ? b `<div class="headline">${headline}</div>` : ''}
              <div class="lede">${snapshot.attribution || config.location || snapshot.friendlyName}</div>
              ${this.renderQuoteBlock(snapshot, forecastItems)}
            </div>
            <div class="facts storm-facts-card">
              <div class="facts-label">${this.t.factsTitle}</div>
              ${facts.map((fact) => b `
                <div class="fact">
                  <div class="fact-label">${fact.label}</div>
                  <div class="fact-value">${fact.value}</div>
                </div>
              `)}
            </div>
          </div>

          <div class=${`hero-side ${config.style?.animated_hero ? 'animated' : ''}`}>
            <div class="storm-reading-card">
              <div class="current-label">${this.t.currentTitle}</div>
              <div class="archive-reading-grid">
                <div class="icon-medallion">${getConditionIcon(snapshot.condition)}</div>
                <div class="bureau-reading">
                  <div class="temperature">${snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '-'}</div>
                  <div class="condition">${conditionLabel}</div>
                  <div class="apparent">
                    ${this.t.feelsLike}: ${snapshot.apparentTemperature !== undefined ? `${Math.round(snapshot.apparentTemperature)}°` : '-'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
        }
        if (this.isAnimatedFrontPage) {
            const stageClass = `animated-stage condition-${snapshot.condition || 'cloudy'}`;
            return b `
        <section class="hero animated-hero">
          <div class=${stageClass}>
            <div class="animated-sky" aria-hidden="true">
              <div class="animated-cloud a"></div>
              <div class="animated-cloud b"></div>
              <div class="animated-rain"></div>
            </div>

            <div class="animated-story">
              <div class="edition-row">
                <span>${snapshot.friendlyName}</span>
                <span>${this.t.updated}: ${snapshot.lastUpdatedLabel}</span>
              </div>
              <div class="story-kicker">${this.t.currentTitle}</div>
              ${headline ? b `<div class="headline">${headline}</div>` : ''}
              <div class="lede">${snapshot.attribution || config.location || snapshot.friendlyName}</div>
              ${this.renderQuoteBlock(snapshot, forecastItems)}
              <div class="facts storm-facts-card">
                <div class="facts-label">${this.t.factsTitle}</div>
                ${facts.map((fact) => b `
                  <div class="fact">
                    <div class="fact-label">${fact.label}</div>
                    <div class="fact-value">${fact.value}</div>
                  </div>
                `)}
              </div>
            </div>

            <div class=${`animated-reading-card ${config.style?.animated_hero ? 'animated' : ''}`}>
              <div class="current-label">${this.t.currentTitle}</div>
              <div class="icon-medallion">${getConditionIcon(snapshot.condition)}</div>
              <div class="animated-reading">
                <div class="temperature">${snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '-'}</div>
                <div class="condition">${conditionLabel}</div>
                <div class="apparent">
                  ${this.t.feelsLike}: ${snapshot.apparentTemperature !== undefined ? `${Math.round(snapshot.apparentTemperature)}°` : '-'}
                </div>
                <div class="animated-summary">
                  <div>${headline || conditionLabel}</div>
                  <div>${snapshot.state}</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      `;
        }
        return b `
      <section class="hero bureau-hero">
        <div class="bureau-story">
          <div class="edition-row">
            <span>${snapshot.friendlyName}</span>
            <span>${this.t.updated}: ${snapshot.lastUpdatedLabel}</span>
          </div>
          <div class="story-kicker">${this.t.currentTitle}</div>
          ${headline ? b `<div class="headline">${headline}</div>` : ''}
          <div class="lede">${snapshot.attribution || config.location || snapshot.friendlyName}</div>
          ${this.renderQuoteBlock(snapshot, forecastItems)}
        </div>

        <div class="bureau-side">
          <div class="bureau-reading-card">
            <div class="current-label">${this.t.currentTitle}</div>
            <div class="icon-medallion">${getConditionIcon(snapshot.condition)}</div>
            <div class="bureau-reading">
              <div class="temperature">${snapshot.temperature !== undefined ? `${Math.round(snapshot.temperature)}°` : '-'}</div>
              <div class="condition">${conditionLabel}</div>
              <div class="apparent">
                ${this.t.feelsLike}: ${snapshot.apparentTemperature !== undefined ? `${Math.round(snapshot.apparentTemperature)}°` : '-'}
              </div>
              <div class="bureau-summary">
                <div>${conditionLabel}</div>
                <div>${snapshot.friendlyName}</div>
              </div>
            </div>
          </div>

          <div class="bureau-facts storm-facts-card">
            <div class="facts-label">${this.t.factsTitle}</div>
            ${facts.map((fact) => b `
              <div class="fact">
                <div class="fact-label">${fact.label}</div>
                <div class="fact-value">${fact.value}</div>
              </div>
            `)}
          </div>
        </div>
      </section>
    `;
    }
    render() {
        if (!this.config || !this.hass) {
            return b `<ha-card><div class="empty">Loading archive...</div></ha-card>`;
        }
        const config = this.effectiveConfig;
        const snapshot = createWeatherSnapshot(this.hass, config);
        const facts = buildFacts(snapshot, this.selectedFacts, this.language);
        const headline = config.content?.headline_mode === 'none'
            ? ''
            : config.content?.headline_mode === 'custom' && config.content.headline_template
                ? config.content.headline_template
                : buildHeadline(snapshot, this.language);
        const combinedForecast = snapshot.forecast.length ? snapshot.forecast : this.serviceForecast;
        const forecastItems = combinedForecast.slice(0, config.layout?.forecast_items || 5);
        const forecastMode = resolveForecastMode(config.layout?.forecast_mode || 'daily', combinedForecast);
        const conditionLabel = this.t.conditions[snapshot.condition] || snapshot.condition;
        return b `
      <ha-card style=${o(this.computeCardStyle())} data-version=${CARD_VERSION} @click=${() => this.openMoreInfo()}>
        <div class=${`frame ${config.style?.paper_texture === false ? '' : 'paper-texture'} ${this.isWeatherBureau ? 'bureau-layout' : ''} ${this.isAnimatedFrontPage ? 'animated-layout' : ''} ${this.presetLayoutClass}`}>
          ${this.renderHeader(snapshot)}

          ${this.renderHero(snapshot, headline, facts, conditionLabel, forecastItems)}

          ${config.style?.show_alerts === false || !snapshot.alerts.length ? '' : b `
            <section class="section">
              <div class="section-header">
                <div class="section-title">${this.t.specialEdition}</div>
              </div>
              <div class="alert-list">
                ${snapshot.alerts.map((alert) => b `
                  <div class=${`alert ${alert.severity}`}>
                    <div class="alert-kicker">${formatAlertSeverity(alert, this.language)}</div>
                    <div class="alert-title">${alert.title}</div>
                    ${alert.description ? b `<div class="alert-description">${alert.description}</div>` : ''}
                  </div>
                `)}
              </div>
            </section>
          `}

          ${config.style?.show_forecast === false ? '' : b `
            <section class="section">
              <div class="section-header">
                <div class="section-title">${this.t.forecastTitle}</div>
              <div class="section-meta">${this.getForecastModeLabel(forecastMode)}</div>
            </div>
              ${forecastItems.length
            ? b `<div class="forecast">${forecastItems.map((item) => this.renderForecastItem(item, forecastMode))}</div>`
            : b `<div class="empty">${this.t.noForecast}</div>`}
            </section>
          `}

          ${config.style?.show_almanac === false ? '' : b `
            <section class="section">
              <div class="section-header">
                <div class="section-title">${this.t.almanacTitle}</div>
                <div class="section-meta">${snapshot.state}</div>
              </div>
              <div class="almanac">
                <div class="almanac-item">
                  <div class="fact-label">${this.t.facts.sunrise}</div>
                  <div class="fact-value">${formatTime(snapshot.sunrise)}</div>
                </div>
                <div class="almanac-item">
                  <div class="fact-label">${this.t.facts.sunset}</div>
                  <div class="fact-value">${formatTime(snapshot.sunset)}</div>
                </div>
              </div>
            </section>
          `}

          ${this.renderDebugPanel(forecastMode, forecastItems)}
        </div>
      </ha-card>
    `;
    }
}
ZSDailyProphetCard.properties = {
    hass: { attribute: false },
    config: { attribute: false },
    serviceForecast: { attribute: false, state: true },
    forecastLoading: { attribute: false, state: true },
    forecastSource: { attribute: false, state: true },
    forecastServiceStatus: { attribute: false, state: true },
};
ZSDailyProphetCard.styles = i$5 `
    :host {
      display: block;
      --zs-prophet-card-bg: linear-gradient(180deg, rgba(118,91,56,0.96), rgba(68,49,28,0.98));
      --zs-prophet-paper: linear-gradient(180deg, #f3e8c9 0%, #e8d7b1 54%, #d3ba8b 100%);
      --zs-prophet-ink: #2e2215;
      --zs-prophet-muted: rgba(46, 34, 21, 0.64);
      --zs-prophet-accent: #8f6230;
      --zs-prophet-accent-soft: rgba(143, 98, 48, 0.18);
      --zs-prophet-border: #8f6b3d;
      --zs-prophet-alert: #8d2b1f;
      --zs-prophet-shadow: rgba(34, 22, 10, 0.24);
      --zs-prophet-title: "Cinzel Decorative", "Cinzel", Georgia, serif;
      --zs-prophet-copy: "Cormorant Garamond", Georgia, serif;
      --zs-prophet-card-padding: 22px;
      --zs-prophet-gap: 18px;
      --zs-prophet-hero-padding: 20px;
    }

    ha-card {
      position: relative;
      overflow: hidden;
      border-radius: 30px;
      padding: var(--zs-prophet-card-padding);
      background: var(--zs-prophet-card-bg);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 50%, transparent);
      box-shadow: 0 24px 44px rgba(0, 0, 0, 0.28), inset 0 1px 0 rgba(255, 255, 255, 0.06);
      color: var(--zs-prophet-ink);
      cursor: pointer;
    }

    .frame {
      position: relative;
      display: grid;
      gap: var(--zs-prophet-gap);
      background: var(--zs-prophet-paper);
      border-radius: 24px;
      padding: var(--zs-prophet-card-padding);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 42%, transparent);
      box-shadow: inset 0 0 0 1px rgba(255, 248, 230, 0.26), 0 16px 32px var(--zs-prophet-shadow);
    }

    .frame::after {
      content: "";
      position: absolute;
      inset: 12px;
      border-radius: 18px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 24%, transparent);
      pointer-events: none;
      opacity: 0.8;
    }

    .frame::before {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.5;
      background:
        radial-gradient(circle at 15% 12%, rgba(255,255,255,0.38), transparent 22%),
        linear-gradient(135deg, rgba(255,255,255,0.08), transparent 38%, rgba(88,57,28,0.04) 90%);
      mix-blend-mode: screen;
    }

    .paper-texture::after {
      content: "";
      position: absolute;
      inset: 0;
      pointer-events: none;
      opacity: 0.18;
      background-image:
        radial-gradient(rgba(79, 51, 23, 0.28) 0.55px, transparent 0.7px),
        radial-gradient(rgba(255, 251, 239, 0.45) 0.55px, transparent 0.8px);
      background-size: 18px 18px, 24px 24px;
      background-position: 0 0, 11px 9px;
    }

    .masthead {
      display: grid;
      gap: 10px;
      padding-bottom: 16px;
      border-bottom: 1px solid color-mix(in srgb, var(--zs-prophet-border) 48%, transparent);
    }

    .archive-header {
      display: grid;
      grid-template-columns: 84px minmax(0, 1fr) auto;
      gap: 16px;
      align-items: center;
    }

    .archive-sigil {
      position: relative;
      width: 84px;
      height: 84px;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 50%, transparent);
      background:
        radial-gradient(circle at center, rgba(255,255,255,0.28), transparent 38%),
        radial-gradient(circle at center, color-mix(in srgb, var(--zs-prophet-accent) 26%, transparent) 0 18%, transparent 19% 100%);
      box-shadow: inset 0 0 0 10px rgba(255, 255, 255, 0.04);
      overflow: hidden;
    }

    .archive-sigil::before,
    .archive-sigil::after {
      content: "";
      position: absolute;
      inset: 14px;
      border-radius: 50%;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 40%, transparent);
    }

    .archive-sigil::after {
      inset: 28px;
      background: color-mix(in srgb, var(--zs-prophet-accent) 64%, transparent);
      border: none;
      clip-path: polygon(50% 0%, 61% 32%, 100% 50%, 61% 68%, 50% 100%, 39% 68%, 0% 50%, 39% 32%);
      opacity: 0.9;
    }

    .archive-copy {
      display: grid;
      gap: 4px;
      min-width: 0;
    }

    .archive-meta {
      display: grid;
      gap: 6px;
      justify-items: end;
      text-align: right;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      font-size: 0.94rem;
    }

    .archive-meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 36%, transparent);
      background: color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
      letter-spacing: 0.08em;
      text-transform: uppercase;
      font-size: 0.78rem;
    }

    .bureau-header {
      display: grid;
      gap: 12px;
      padding: 0 0 14px;
      border-bottom: 1px solid color-mix(in srgb, var(--zs-prophet-border) 52%, transparent);
    }

    .bureau-bar {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px 16px;
      align-items: center;
    }

    .bureau-stamp {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 40%, transparent);
      font-family: var(--zs-prophet-copy);
      font-size: 0.88rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: var(--zs-prophet-muted);
    }

    .bureau-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.3fr) minmax(180px, 0.9fr);
      gap: 12px;
      align-items: end;
    }

    .bureau-title {
      display: grid;
      gap: 4px;
    }

    .bureau-title .title {
      font-size: clamp(1.75rem, 4vw, 2.8rem);
      line-height: 0.98;
      letter-spacing: 0.06em;
    }

    .bureau-title .subtitle {
      font-size: 1rem;
    }

    .bureau-meta {
      display: grid;
      gap: 6px;
      justify-items: end;
      text-align: right;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      font-size: 0.96rem;
    }

    .animated-header {
      position: relative;
      display: grid;
      gap: 12px;
      padding: 0 0 16px;
      border-bottom: 1px solid color-mix(in srgb, var(--zs-prophet-border) 50%, transparent);
      overflow: hidden;
    }

    .animated-header::before {
      content: "";
      position: absolute;
      inset: -12% -8% auto -8%;
      height: 120px;
      background:
        radial-gradient(circle at 20% 50%, rgba(255,255,255,0.28), transparent 28%),
        radial-gradient(circle at 80% 35%, rgba(255,214,143,0.22), transparent 24%);
      filter: blur(12px);
      opacity: 0.9;
      pointer-events: none;
    }

    .animated-ribbon {
      position: relative;
      display: inline-flex;
      justify-self: start;
      padding: 8px 14px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 44%, transparent);
      background: linear-gradient(180deg, rgba(255,248,229,0.14), rgba(255,248,229,0.04));
      font-family: var(--zs-prophet-copy);
      font-size: 0.86rem;
      text-transform: uppercase;
      letter-spacing: 0.16em;
      color: var(--zs-prophet-muted);
    }

    .animated-grid {
      position: relative;
      display: grid;
      grid-template-columns: 1fr;
      gap: 10px;
      align-items: start;
    }

    .animated-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      align-items: center;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
    }

    .animated-header .title {
      font-size: clamp(1.85rem, 4.8vw, 3rem);
      line-height: 0.96;
      letter-spacing: 0.06em;
    }

    .eyebrow,
    .subtitle,
    .edition-row,
    .lede,
    .quote-kicker,
    .quote-meta,
    .fact-label,
    .section-meta,
    .forecast-name,
    .forecast-extra {
      font-family: var(--zs-prophet-copy);
    }

    .eyebrow {
      font-size: 0.84rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
    }

    .title,
    .headline,
    .temperature,
    .fact-value,
    .section-title {
      font-family: var(--zs-prophet-title);
    }

    .title {
      font-size: clamp(2rem, 5vw, 3.4rem);
      line-height: 0.95;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .subtitle {
      font-size: 1.08rem;
      color: var(--zs-prophet-muted);
    }

    .hero {
      display: grid;
      grid-template-columns: minmax(0, 1.35fr) minmax(260px, 0.95fr);
      gap: 18px;
      align-items: stretch;
    }

    .bureau-layout .hero {
      grid-template-columns: 1fr;
      gap: 14px;
    }

    .lead,
    .hero-side {
      padding: var(--zs-prophet-hero-padding);
      border-radius: 22px;
      border: 1px solid rgba(104, 73, 39, 0.12);
    }

    .lead {
      display: grid;
      gap: 12px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08)),
        color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
    }

    .story-kicker {
      display: inline-flex;
      justify-self: start;
      padding: 7px 12px;
      border-radius: 999px;
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 30%, transparent);
      background: rgba(255, 255, 255, 0.12);
      font-size: 0.75rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
      font-family: var(--zs-prophet-copy);
    }

    .lead-copy {
      display: grid;
      gap: 12px;
      min-width: 0;
    }

    .quote-card {
      display: grid;
      gap: 8px;
      margin-top: 4px;
      padding: 14px 16px;
      border-radius: 16px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)),
        color-mix(in srgb, var(--zs-prophet-accent-soft) 100%, transparent);
      border: 1px solid color-mix(in srgb, var(--zs-prophet-border) 26%, transparent);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18);
    }

    .quote-kicker {
      font-size: 0.74rem;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
    }

    .quote-body {
      font-family: var(--zs-prophet-copy);
      font-size: 1.08rem;
      line-height: 1.45;
      font-style: italic;
    }

    .quote-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 8px 14px;
      font-size: 0.82rem;
      color: var(--zs-prophet-muted);
    }

    .bureau-hero {
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) minmax(260px, 0.95fr);
      gap: 14px;
      align-items: stretch;
    }

    .animated-hero {
      display: block;
    }

    .bureau-story,
    .bureau-reading-card,
    .bureau-facts {
      padding: var(--zs-prophet-hero-padding);
      border-radius: 18px;
      border: 1px solid rgba(104, 73, 39, 0.12);
      background:
        linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.04)),
        rgba(255,255,255,0.08);
    }

    .animated-stage {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1.05fr) 220px;
      gap: 18px;
      padding: 20px;
      border-radius: 28px;
      border: 1px solid rgba(104, 73, 39, 0.16);
      overflow: hidden;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04)),
        radial-gradient(circle at top left, rgba(255,224,165,0.18), transparent 32%),
        linear-gradient(180deg, rgba(236, 214, 171, 0.78), rgba(213, 181, 122, 0.58));
      min-height: 420px;
    }

    .animated-stage::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.2), transparent 30%),
        radial-gradient(circle at 82% 16%, rgba(255,244,217,0.34), transparent 18%);
      pointer-events: none;
    }

    .animated-stage.condition-rainy::after,
    .animated-stage.condition-pouring::after,
    .animated-stage.condition-lightning_rainy::after {
      content: "";
      position: absolute;
      inset: -20% 0 0 0;
      background-image: linear-gradient(180deg, rgba(126, 119, 155, 0.22), rgba(126, 119, 155, 0));
      pointer-events: none;
    }

    .animated-sky {
      position: absolute;
      inset: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .animated-cloud {
      position: absolute;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,0.44), rgba(255,255,255,0.05));
      filter: blur(4px);
      opacity: 0.9;
    }

    .animated-cloud.a {
      width: 170px;
      height: 58px;
      top: 58px;
      left: 18px;
      animation: drift 14s ease-in-out infinite alternate;
    }

    .animated-cloud.b {
      width: 110px;
      height: 42px;
      top: 132px;
      left: 140px;
      animation: drift 17s ease-in-out infinite alternate-reverse;
      opacity: 0.75;
    }

    .animated-rain {
      position: absolute;
      inset: 0;
      opacity: 0;
      pointer-events: none;
    }

    .animated-stage.condition-rainy .animated-rain,
    .animated-stage.condition-pouring .animated-rain,
    .animated-stage.condition-lightning_rainy .animated-rain {
      opacity: 1;
    }

    .animated-rain::before,
    .animated-rain::after {
      content: "";
      position: absolute;
      inset: 0;
      background-image: linear-gradient(110deg, transparent 0 46%, rgba(120, 124, 162, 0.24) 47%, transparent 49%, transparent 100%);
      background-size: 28px 28px;
      animation: rainFall 1.15s linear infinite;
    }

    .animated-rain::after {
      animation-duration: 1.55s;
      opacity: 0.7;
      transform: translateX(10px);
    }

    .animated-story {
      position: relative;
      z-index: 1;
      align-self: end;
      display: grid;
      gap: 12px;
      padding: 18px;
      border-radius: 22px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.3), rgba(255,255,255,0.08)),
        rgba(255, 248, 230, 0.18);
      backdrop-filter: blur(6px);
    }

    .animated-reading-card {
      position: relative;
      z-index: 1;
      display: grid;
      gap: 14px;
      justify-items: center;
      align-content: center;
      padding: 18px;
      border-radius: 24px;
      border: 1px solid rgba(104, 73, 39, 0.16);
      background:
        radial-gradient(circle at 50% 20%, rgba(255,255,255,0.26), transparent 26%),
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.05)),
        rgba(255,255,255,0.08);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.16);
    }

    .animated-reading-card::before,
    .animated-reading-card::after {
      content: "";
      position: absolute;
      inset: auto;
      border-radius: 999px;
      pointer-events: none;
    }

    .animated-reading-card::before {
      width: 180px;
      height: 54px;
      top: 42px;
      left: 12px;
      background: radial-gradient(circle, rgba(255,255,255,0.3), rgba(255,255,255,0));
      filter: blur(10px);
      animation: drift 10s ease-in-out infinite alternate;
      opacity: 0.7;
    }

    .animated-reading-card::after {
      width: 120px;
      height: 120px;
      right: -16px;
      bottom: 24px;
      background: radial-gradient(circle, rgba(255,205,129,0.18), rgba(255,205,129,0));
      filter: blur(16px);
      opacity: 0.85;
      animation: pulseGlow 9s ease-in-out infinite;
    }

    .animated-reading {
      display: grid;
      gap: 10px;
      justify-items: center;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .animated-summary {
      display: grid;
      gap: 8px;
      padding-top: 10px;
      border-top: 1px dashed color-mix(in srgb, var(--zs-prophet-border) 38%, transparent);
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      text-align: center;
    }

    .animated-reading-card.animated .icon-medallion {
      animation: floatSeal 5.8s ease-in-out infinite;
    }

    .animated-reading-card.animated .animated-summary {
      animation: shimmer 7s linear infinite;
      background-image: linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent);
      background-size: 180% 100%;
      background-repeat: no-repeat;
    }

    .bureau-story {
      display: grid;
      gap: 12px;
    }

    .bureau-side {
      display: grid;
      grid-template-rows: auto auto;
      gap: 14px;
      min-width: 0;
    }

    .bureau-reading-card {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      align-items: start;
      min-width: 0;
    }

    .bureau-facts {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .edition-row,
    .section-header {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 10px 14px;
      align-items: center;
    }

    .edition-row,
    .section-meta,
    .lede,
    .forecast-extra,
    .forecast-name {
      color: var(--zs-prophet-muted);
    }

    .headline {
      font-size: clamp(1.3rem, 3vw, 2rem);
      line-height: 1.05;
      text-wrap: balance;
    }

    .lede {
      font-size: 1.08rem;
      line-height: 1.18;
    }

    .hero-side {
      position: relative;
      display: block;
      background:
        radial-gradient(circle at 50% 28%, rgba(255,255,255,0.42), transparent 32%),
        linear-gradient(180deg, rgba(250,240,215,0.82), rgba(227,208,168,0.75));
      overflow: hidden;
      min-height: 260px;
    }

    .storm-reading-card {
      display: grid;
      gap: 14px;
      justify-items: center;
      align-content: center;
      min-height: 100%;
    }

    .bureau-reading-card .icon-medallion {
      width: 108px;
      height: 108px;
      margin: 0;
      align-self: start;
    }

    .bureau-reading {
      display: grid;
      gap: 8px;
      align-content: start;
      min-width: 0;
    }

    .storm-reading-card > .bureau-reading {
      width: 100%;
      justify-items: center;
      text-align: center;
    }

    .archive-reading-grid {
      position: relative;
      z-index: 1;
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 14px;
      align-items: center;
      width: 100%;
    }

    .storm-reading-card,
    .storm-facts-card {
      position: relative;
      overflow: hidden;
    }

    .storm-reading-card::before,
    .storm-facts-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background:
        linear-gradient(90deg, color-mix(in srgb, var(--zs-prophet-accent) 18%, transparent), transparent 40%),
        linear-gradient(180deg, rgba(255,255,255,0.12), transparent 28%);
      pointer-events: none;
    }

    .current-label,
    .facts-label {
      position: relative;
      z-index: 1;
      font-family: var(--zs-prophet-copy);
      font-size: 0.74rem;
      letter-spacing: 0.16em;
      text-transform: uppercase;
      color: var(--zs-prophet-muted);
    }

    .bureau-layout .temperature,
    .bureau-layout .condition,
    .bureau-layout .apparent {
      text-align: left;
    }

    .bureau-layout .temperature {
      font-size: clamp(2.5rem, 6vw, 4.1rem);
    }

    .bureau-summary {
      display: grid;
      gap: 6px;
      padding-top: 10px;
      border-top: 1px dashed color-mix(in srgb, var(--zs-prophet-border) 35%, transparent);
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
    }

    .hero-side.animated::before {
      content: "";
      position: absolute;
      inset: auto -10% 18% -10%;
      height: 84px;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,0.38), rgba(255,255,255,0));
      animation: drift 11s ease-in-out infinite alternate;
      opacity: 0.75;
    }

    .icon-medallion {
      width: 124px;
      height: 124px;
      margin: 0 auto;
      display: grid;
      place-items: center;
      border-radius: 999px;
      background:
        radial-gradient(circle at 50% 35%, rgba(255,255,255,0.86), rgba(214,180,122,0.75) 64%, rgba(120,79,37,0.84) 100%);
      border: 2px solid color-mix(in srgb, var(--zs-prophet-border) 72%, white);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.56), 0 16px 26px rgba(88, 57, 28, 0.18);
      font-size: 3rem;
    }

    .temperature {
      font-size: clamp(2.8rem, 7vw, 4.8rem);
      line-height: 0.92;
      text-align: center;
    }

    .condition,
    .apparent {
      font-family: var(--zs-prophet-copy);
      text-align: center;
    }

    .condition {
      font-size: 1.2rem;
      text-transform: capitalize;
    }

    .apparent {
      font-size: 1rem;
      color: var(--zs-prophet-muted);
    }

    .facts,
    .forecast,
    .almanac {
      display: grid;
      gap: 12px;
    }

    .facts {
      grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    }

    .forecast {
      grid-template-columns: repeat(auto-fit, minmax(94px, 1fr));
    }

    .almanac {
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    }

    .fact,
    .forecast-item,
    .almanac-item,
    .alert {
      border-radius: 16px;
      border: 1px solid rgba(104, 73, 39, 0.12);
    }

    .fact,
    .almanac-item {
      padding: 12px 14px;
      background: rgba(255, 248, 230, 0.28);
    }

    .forecast-item {
      padding: 14px 12px;
      text-align: center;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.34), rgba(255,255,255,0.14)),
        rgba(255, 248, 230, 0.16);
    }

    .bureau-layout .forecast {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    }

    .bureau-layout .forecast-item {
      text-align: left;
      border-radius: 14px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06)),
        rgba(255,255,255,0.08);
    }

    .animated-layout .forecast {
      grid-template-columns: repeat(auto-fit, minmax(126px, 1fr));
    }

    .animated-layout .forecast-item {
      border-radius: 20px;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.16), rgba(255,255,255,0.04)),
        radial-gradient(circle at top, rgba(255,223,166,0.12), transparent 40%),
        rgba(255,255,255,0.05);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.12);
    }

    .forecast-main {
      display: grid;
      gap: 6px;
    }

    .forecast-meta {
      display: grid;
      gap: 4px;
      margin-top: 8px;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      font-size: 0.92rem;
    }

    .forecast-condition {
      text-transform: capitalize;
    }

    .alert-list {
      display: grid;
      gap: 10px;
    }

    .bureau-layout .alert-list {
      gap: 8px;
    }

    .alert {
      padding: 14px 16px;
      background: linear-gradient(180deg, rgba(166,56,40,0.12), rgba(141,43,31,0.18));
      color: var(--zs-prophet-alert);
    }

    .bureau-layout .alert {
      border-radius: 14px;
    }

    .animated-layout .alert {
      border-radius: 18px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
    }

    .alert.info {
      background: linear-gradient(180deg, rgba(98,86,61,0.1), rgba(98,86,61,0.16));
      color: var(--zs-prophet-ink);
    }

    .alert.warning {
      background: linear-gradient(180deg, rgba(184,118,38,0.12), rgba(160,95,22,0.18));
      color: #7a4312;
    }

    .alert.critical {
      background: linear-gradient(180deg, rgba(166,56,40,0.12), rgba(141,43,31,0.18));
      color: var(--zs-prophet-alert);
    }

    .alert-kicker,
    .alert-description {
      font-family: var(--zs-prophet-copy);
    }

    .alert-kicker {
      margin-bottom: 4px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.84rem;
      opacity: 0.85;
    }

    .alert-title {
      font-family: var(--zs-prophet-title);
      font-size: 1.1rem;
      line-height: 1.05;
    }

    .alert-description {
      margin-top: 6px;
      font-size: 0.98rem;
      line-height: 1.15;
    }

    .fact-label {
      font-size: 0.9rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--zs-prophet-muted);
    }

    .fact-value {
      margin-top: 4px;
      font-size: 1.2rem;
    }

    .section {
      display: grid;
      gap: 12px;
    }

    .section-header {
      padding-top: 4px;
      border-top: 1px solid color-mix(in srgb, var(--zs-prophet-border) 38%, transparent);
    }

    .section-title {
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 1rem;
    }

    .forecast-temp {
      margin: 8px 0;
      font-family: var(--zs-prophet-title);
      font-size: 1.35rem;
    }

    .empty {
      padding: 24px 16px;
      font-family: var(--zs-prophet-copy);
      color: var(--zs-prophet-muted);
      text-align: center;
    }

    .urithiru-layout .lead {
      background:
        linear-gradient(180deg, rgba(240,247,250,0.54), rgba(181,202,215,0.18)),
        linear-gradient(135deg, rgba(127,169,195,0.12), transparent 58%);
      border-color: rgba(84, 117, 139, 0.2);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
    }

    .urithiru-layout .storm-facts-card {
      background:
        linear-gradient(180deg, rgba(226,235,240,0.78), rgba(184,199,209,0.32)),
        linear-gradient(90deg, rgba(127,169,195,0.1), transparent 48%);
      border-color: rgba(84, 117, 139, 0.18);
    }

    .urithiru-layout .hero-side {
      background:
        radial-gradient(circle at top, rgba(210,232,246,0.38), transparent 30%),
        linear-gradient(180deg, rgba(90,117,136,0.28), rgba(45,61,74,0.1)),
        linear-gradient(180deg, rgba(224,232,238,0.92), rgba(163,178,190,0.86));
      border-color: rgba(84, 117, 139, 0.24);
    }

    .urithiru-layout .storm-reading-card {
      padding: 6px;
      background:
        linear-gradient(180deg, rgba(236,243,247,0.82), rgba(172,188,200,0.28)),
        linear-gradient(135deg, rgba(127,169,195,0.18), transparent 52%);
      border-left: 4px solid color-mix(in srgb, var(--zs-prophet-accent) 72%, white);
      border-radius: 18px;
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.38);
    }

    .urithiru-layout .storm-reading-card > .bureau-reading {
      padding: 0;
      justify-items: start;
      text-align: left;
    }

    .urithiru-layout .archive-reading-grid {
      padding: 0 14px 14px;
    }

    .urithiru-layout .storm-reading-card .icon-medallion {
      width: 110px;
      height: 110px;
      margin: 0;
    }

    .urithiru-layout .current-label,
    .urithiru-layout .facts-label {
      color: color-mix(in srgb, var(--zs-prophet-accent) 68%, var(--zs-prophet-ink));
    }

    .urithiru-layout .icon-medallion {
      background:
        radial-gradient(circle at 50% 30%, rgba(255,255,255,0.92), rgba(195,217,231,0.8) 56%, rgba(79,109,132,0.92) 100%);
      border-color: color-mix(in srgb, var(--zs-prophet-border) 74%, white);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), 0 18px 30px rgba(48, 70, 88, 0.18);
      color: #1a3342;
    }

    .urithiru-layout .fact,
    .urithiru-layout .almanac-item {
      background: rgba(229, 238, 244, 0.62);
      border-color: rgba(84, 117, 139, 0.16);
    }

    .urithiru-layout .forecast-item {
      background:
        linear-gradient(180deg, rgba(236,243,247,0.72), rgba(174,192,203,0.24)),
        rgba(255,255,255,0.12);
      border-color: rgba(84, 117, 139, 0.18);
    }

    .stormfront-layout .frame {
      background:
        linear-gradient(180deg, rgba(17,26,38,0.92), rgba(9,15,24,0.96)),
        linear-gradient(135deg, rgba(127,214,255,0.06), transparent 44%);
      color: #dceaf7;
    }

    .stormfront-layout .frame::before {
      background:
        radial-gradient(circle at 18% 12%, rgba(125,215,255,0.18), transparent 18%),
        radial-gradient(circle at 82% 24%, rgba(255,255,255,0.14), transparent 16%),
        linear-gradient(135deg, rgba(125,215,255,0.08), transparent 38%, rgba(255,255,255,0.03) 90%);
      mix-blend-mode: screen;
    }

    .stormfront-layout .animated-header,
    .stormfront-layout .animated-ribbon,
    .stormfront-layout .animated-meta,
    .stormfront-layout .eyebrow,
    .stormfront-layout .subtitle,
    .stormfront-layout .edition-row,
    .stormfront-layout .lede,
    .stormfront-layout .quote-kicker,
    .stormfront-layout .quote-meta,
    .stormfront-layout .fact-label,
    .stormfront-layout .section-meta,
    .stormfront-layout .forecast-name,
    .stormfront-layout .forecast-extra,
    .stormfront-layout .forecast-meta,
    .stormfront-layout .apparent,
    .stormfront-layout .condition,
    .stormfront-layout .animated-summary {
      color: rgba(220, 234, 247, 0.8);
    }

    .stormfront-layout .title,
    .stormfront-layout .headline,
    .stormfront-layout .temperature,
    .stormfront-layout .fact-value,
    .stormfront-layout .section-title {
      color: #f4fbff;
    }

    .stormfront-layout .animated-stage {
      border-color: rgba(98, 185, 223, 0.28);
      background:
        radial-gradient(circle at 12% 12%, rgba(127,214,255,0.16), transparent 24%),
        radial-gradient(circle at 88% 18%, rgba(255,255,255,0.08), transparent 20%),
        linear-gradient(180deg, rgba(32,48,68,0.82), rgba(9,16,27,0.96));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 18px 36px rgba(2,7,12,0.34);
    }

    .stormfront-layout .animated-story {
      background:
        linear-gradient(180deg, rgba(17,30,45,0.72), rgba(10,17,29,0.54)),
        linear-gradient(135deg, rgba(127,214,255,0.08), transparent 60%);
      border: 1px solid rgba(98, 185, 223, 0.16);
      backdrop-filter: blur(10px);
    }

    .stormfront-layout .storm-facts-card {
      background:
        linear-gradient(180deg, rgba(16,28,42,0.72), rgba(10,16,26,0.48)),
        linear-gradient(135deg, rgba(127,214,255,0.12), transparent 58%);
      border: 1px solid rgba(98, 185, 223, 0.16);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }

    .stormfront-layout .facts-label,
    .stormfront-layout .current-label,
    .stormfront-layout .story-kicker {
      color: #8fdfff;
      background: rgba(127,214,255,0.08);
      border-color: rgba(127,214,255,0.22);
    }

    .stormfront-layout .animated-reading-card {
      border-color: rgba(98, 185, 223, 0.28);
      background:
        radial-gradient(circle at 50% 18%, rgba(159,226,255,0.22), transparent 22%),
        linear-gradient(180deg, rgba(15,27,41,0.86), rgba(9,16,26,0.62)),
        linear-gradient(135deg, rgba(127,214,255,0.08), transparent 60%);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.08), 0 16px 34px rgba(2,7,12,0.28);
    }

    .stormfront-layout .animated-reading-card::after {
      background: radial-gradient(circle, rgba(127,214,255,0.26), rgba(127,214,255,0));
    }

    .stormfront-layout .icon-medallion {
      background:
        radial-gradient(circle at 50% 28%, rgba(255,255,255,0.94), rgba(166,231,255,0.74) 48%, rgba(61,116,149,0.94) 100%);
      border-color: rgba(143,223,255,0.84);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.62), 0 0 30px rgba(127,214,255,0.22);
      color: #0f2333;
    }

    .stormfront-layout .fact,
    .stormfront-layout .forecast-item,
    .stormfront-layout .almanac-item,
    .stormfront-layout .alert {
      background:
        linear-gradient(180deg, rgba(15,27,41,0.72), rgba(8,14,24,0.54)),
        linear-gradient(135deg, rgba(127,214,255,0.05), transparent 58%);
      border-color: rgba(98, 185, 223, 0.16);
    }

    .stormfront-layout .quote-card {
      background:
        linear-gradient(180deg, rgba(17,30,45,0.82), rgba(9,17,29,0.6)),
        linear-gradient(135deg, rgba(127,214,255,0.08), transparent 60%);
      border-color: rgba(98, 185, 223, 0.16);
    }

    .navani-layout .bureau-story,
    .navani-layout .bureau-reading-card,
    .navani-layout .bureau-facts,
    .navani-layout .fact,
    .navani-layout .forecast-item,
    .navani-layout .almanac-item,
    .navani-layout .quote-card {
      background:
        linear-gradient(180deg, rgba(250,242,225,0.82), rgba(228,206,166,0.5)),
        repeating-linear-gradient(0deg, rgba(109,82,39,0.06) 0 1px, transparent 1px 28px),
        repeating-linear-gradient(90deg, rgba(109,82,39,0.05) 0 1px, transparent 1px 28px);
      border-color: rgba(152, 112, 45, 0.22);
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.3);
    }

    .navani-layout .bureau-story {
      position: relative;
      overflow: hidden;
    }

    .navani-layout .bureau-story::after {
      content: "";
      position: absolute;
      inset: 16px auto 16px 16px;
      width: 3px;
      border-radius: 999px;
      background: linear-gradient(180deg, rgba(198,141,60,0.8), rgba(198,141,60,0.06));
      opacity: 0.9;
    }

    .navani-layout .story-kicker {
      background: rgba(198,141,60,0.14);
      border-style: dashed;
      border-color: rgba(152, 112, 45, 0.28);
      color: #7b5421;
    }

    .navani-layout .bureau-reading-card {
      grid-template-columns: 1fr;
      justify-items: center;
      text-align: center;
      position: relative;
      overflow: hidden;
    }

    .navani-layout .bureau-reading-card::before {
      content: "";
      position: absolute;
      inset: 14px;
      border: 1px dashed rgba(152, 112, 45, 0.24);
      border-radius: 14px;
      pointer-events: none;
    }

    .navani-layout .current-label,
    .navani-layout .facts-label {
      color: #8b5d21;
    }

    .navani-layout .bureau-reading {
      justify-items: center;
      text-align: center;
    }

    .navani-layout .bureau-layout .temperature,
    .navani-layout .bureau-layout .condition,
    .navani-layout .bureau-layout .apparent {
      text-align: center;
    }

    .navani-layout .icon-medallion {
      width: 100px;
      height: 100px;
      background:
        radial-gradient(circle at 50% 30%, rgba(255,255,255,0.92), rgba(255,224,167,0.82) 48%, rgba(162,104,28,0.94) 100%);
      border-color: rgba(184,131,56,0.82);
      color: #5a390d;
    }

    .navani-layout .bureau-facts {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .navani-layout .fact,
    .navani-layout .almanac-item {
      clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
    }

    .navani-layout .forecast-item {
      text-align: left;
    }

    .navani-layout .forecast-item::before {
      content: "";
      display: block;
      width: 42px;
      height: 2px;
      margin-bottom: 10px;
      background: color-mix(in srgb, var(--zs-prophet-accent) 72%, white);
      opacity: 0.8;
    }

    .navani-layout .quote-body {
      font-style: normal;
    }

    .debug-panel {
      display: grid;
      gap: 8px;
      padding-top: 8px;
      border-top: 1px dashed color-mix(in srgb, var(--zs-prophet-border) 45%, transparent);
    }

    .debug-title {
      font-family: var(--zs-prophet-title);
      font-size: 0.95rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .debug-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
    }

    .debug-item {
      padding: 10px 12px;
      border-radius: 14px;
      background: rgba(255, 248, 230, 0.2);
      border: 1px solid rgba(104, 73, 39, 0.1);
    }

    .debug-label,
    .debug-value {
      font-family: var(--zs-prophet-copy);
    }

    .debug-label {
      font-size: 0.82rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--zs-prophet-muted);
    }

    .debug-value {
      margin-top: 4px;
      font-size: 0.98rem;
      line-height: 1.15;
      word-break: break-word;
    }

    @keyframes drift {
      from { transform: translateX(-4%); }
      to { transform: translateX(7%); }
    }

    @keyframes floatSeal {
      0% { transform: translateY(0px) scale(1); }
      50% { transform: translateY(-8px) scale(1.02); }
      100% { transform: translateY(0px) scale(1); }
    }

    @keyframes pulseGlow {
      0% { opacity: 0.45; transform: scale(0.96); }
      50% { opacity: 0.9; transform: scale(1.05); }
      100% { opacity: 0.45; transform: scale(0.96); }
    }

    @keyframes shimmer {
      from { background-position: 140% 0; }
      to { background-position: -40% 0; }
    }

    @keyframes rainFall {
      from { transform: translateY(-10px); }
      to { transform: translateY(24px); }
    }

    @media (max-width: 760px) {
      .hero {
        grid-template-columns: 1fr;
      }

      .bureau-grid,
      .bureau-hero,
      .bureau-reading-card {
        grid-template-columns: 1fr;
      }

      .archive-header {
        grid-template-columns: 1fr;
      }

      .archive-reading-grid {
        grid-template-columns: 1fr;
      }

      .archive-sigil,
      .archive-meta {
        justify-self: start;
        text-align: left;
        justify-items: start;
      }

      .bureau-meta {
        justify-items: start;
        text-align: left;
      }

      .animated-meta {
        justify-content: flex-start;
      }

      .animated-stage {
        grid-template-columns: 1fr;
        min-height: 0;
      }

      .bureau-reading-card .icon-medallion {
        margin: 0 auto;
      }

      .bureau-layout .temperature,
      .bureau-layout .condition,
      .bureau-layout .apparent {
        text-align: center;
      }

      .hero-side {
        min-height: 0;
      }

      .title {
        font-size: clamp(1.8rem, 9vw, 2.9rem);
      }
    }
  `;
customElements.define(CARD_TAG, ZSDailyProphetCard);
window.customCards = window.customCards || [];
window.customCards.push({
    type: CARD_TAG,
    name: 'ZS Stormlight Weather Card',
    preview: true,
    description: `Stormlight Archive inspired weather card for Home Assistant (${CARD_VERSION})`,
    documentationURL: 'https://github.com/bwrwk/zs-stormlight-weather-card',
});
//# sourceMappingURL=zs-stormlight-weather-card.js.map
