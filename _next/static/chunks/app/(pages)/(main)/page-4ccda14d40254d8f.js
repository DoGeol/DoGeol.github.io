(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[492],{8641:function(e,t,r){Promise.resolve().then(r.t.bind(r,5250,23)),Promise.resolve().then(r.bind(r,5922)),Promise.resolve().then(r.bind(r,3287)),Promise.resolve().then(r.bind(r,5468)),Promise.resolve().then(r.bind(r,874))},5922:function(e,t,r){"use strict";r.r(t),r.d(t,{AccordionContent:function(){return i}});var n=r(3827);r(4090);var o=r(5468),s=r(3287);let i=e=>{let{children:t}=e,{values:r}=(0,o.useAccordionState)(),i=(0,s.useAccordionItemState)(),c=null==r?void 0:r.includes(i);return(0,n.jsx)("div",{className:"overflow-auto transition-[max-height] delay-0 ".concat(c?"max-h-[1000px] duration-500 ease-in":"max-h-[0px] duration-300 ease-out"),children:(0,n.jsx)("div",{className:"p-[1.6rem] pt-[0.8rem]",children:t})})}},3287:function(e,t,r){"use strict";r.r(t),r.d(t,{AccordionItem:function(){return c},useAccordionItemState:function(){return u}});var n=r(3827),o=r(4090),s=r(5468);let i=(0,o.createContext)(""),c=e=>{let{children:t,value:r}=e,{rounded:o}=(0,s.useAccordionState)(),c=["accordion-item w-full border-x border-t border-solid border-neutral-300 last:border-b",o?"first:rounded-t-xl last:rounded-b-xl":""].filter(e=>!!e).join(" ");return(0,n.jsx)(i.Provider,{value:r,children:(0,n.jsx)("div",{className:c,children:t})})},u=()=>(0,o.useContext)(i)},5468:function(e,t,r){"use strict";r.r(t),r.d(t,{AccordionRoot:function(){return c},useAccordionActions:function(){return d},useAccordionState:function(){return u}});var n=r(3827),o=r(4090);let s=(0,o.createContext)({values:[],rounded:!1}),i=(0,o.createContext)({setter:()=>null}),c=e=>{let{children:t,multiple:r=!0,values:c=[],onChange:u,rounded:d=!1}=e,[l,a]=(0,o.useState)(c),m=(0,o.useCallback)(e=>{let t=new Set([e]);r&&((t=new Set(l)).has(e)?t.delete(e):t.add(e)),a(Array.from(t))},[l,r]),f=(0,o.useMemo)(()=>l,[l]),v=(0,o.useMemo)(()=>d,[d]),x=(0,o.useMemo)(()=>m,[m]);return(0,o.useEffect)(()=>{u&&"function"==typeof u&&u(f)},[f]),(0,n.jsx)(i.Provider,{value:{setter:x},children:(0,n.jsx)(s.Provider,{value:{values:f,rounded:v},children:(0,n.jsx)("div",{children:t})})})},u=()=>(0,o.useContext)(s),d=()=>(0,o.useContext)(i)},874:function(e,t,r){"use strict";r.r(t),r.d(t,{AccordionTitle:function(){return i}});var n=r(3827);r(4090);var o=r(5468),s=r(3287);let i=e=>{let{children:t,wrapperClass:r,ellipsis:i=!1}=e,{values:c}=(0,o.useAccordionState)(),{setter:u}=(0,o.useAccordionActions)(),d=(0,s.useAccordionItemState)(),l=null==c?void 0:c.includes(d);return(0,n.jsxs)("div",{className:"flex h-[4.8rem] cursor-pointer items-center justify-between px-[1.6rem] transition-all [&>span]:hover:underline [&>span]:hover:underline-offset-4 ".concat(r),onClick:()=>{u(d)},children:[(0,n.jsx)("span",{className:"text-desc ".concat(i?"truncate":""),children:t}),(0,n.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"h-[2rem] w-[2rem] ".concat(l?"-rotate-180":""," flex-shrink-0 text-neutral-500 transition-transform"),children:(0,n.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"})})]})}}},function(e){e.O(0,[250,971,69,744],function(){return e(e.s=8641)}),_N_E=e.O()}]);