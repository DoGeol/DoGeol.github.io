(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[991],{5108:function(e,i,r){Promise.resolve().then(r.bind(r,247))},247:function(e,i,r){"use strict";r.r(i),r.d(i,{default:function(){return o}});var t=r(3827),n=r(4090),s=r(3287),l=r(874),a=r(5922),u=r(5468);function o(){let[e,i]=(0,n.useState)([]),[r,o]=(0,n.useState)([]);return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)("p",{className:"mb-[4.0rem] text-sub-title",children:"아코디언 컴포넌트"}),(0,t.jsxs)("div",{className:"flex flex-col gap-[2.0rem]",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"mb-[0.8rem] text-[2.0rem] font-bold",children:"Multiple"}),(0,t.jsx)("div",{className:"flex flex-col gap-[0.8rem] rounded-xl border border-solid border-gray-300 p-[1.8rem]",children:(0,t.jsxs)(u.c2,{multiple:!0,values:e,onChange:i,rounded:!1,children:[(0,t.jsxs)(s.Q,{value:"1",children:[(0,t.jsx)(l.i,{children:"제목"}),(0,t.jsx)(a.v,{children:[,].fill("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur\n                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi\n                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!").join(" ")})]}),(0,t.jsxs)(s.Q,{value:"2",children:[(0,t.jsx)(l.i,{children:"테스트 제목 입니당"}),(0,t.jsx)(a.v,{children:Array(9).fill("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur\n                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi\n                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!").join(" ")})]})]})})]}),(0,t.jsxs)("div",{children:[(0,t.jsx)("h3",{className:"mb-[0.8rem] text-[2.0rem] font-bold",children:"Rounded"}),(0,t.jsx)("div",{className:"flex flex-col gap-[0.8rem] rounded-xl border border-solid border-gray-300 p-[1.8rem]",children:(0,t.jsxs)(u.c2,{multiple:!1,values:r,onChange:o,rounded:!0,children:[(0,t.jsxs)(s.Q,{value:"1",children:[(0,t.jsx)(l.i,{children:"제목"}),(0,t.jsx)(a.v,{children:[,].fill("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur\n                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi\n                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!").join(" ")})]}),(0,t.jsxs)(s.Q,{value:"2",children:[(0,t.jsx)(l.i,{children:"테스트 제목 입니당"}),(0,t.jsx)(a.v,{children:Array(100).fill("Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae consequatur\n                  cumque, doloribus earum et libero placeat quae quia quis ratione reiciendis sequi\n                  sit, tenetur veritatis, vitae. Adipisci animi itaque sequi!").join(" ")})]})]})})]})]})]})}},5922:function(e,i,r){"use strict";r.d(i,{v:function(){return l}});var t=r(3827);r(4090);var n=r(5468),s=r(3287);let l=e=>{let{children:i}=e,{values:r}=(0,n.w8)(),l=(0,s.S)(),a=null==r?void 0:r.includes(l);return(0,t.jsx)("div",{className:"overscroll-none transition-[max-height] delay-0 ".concat(a?"max-h-[1000px] duration-500 ease-in":"max-h-[0px] duration-300 ease-out"),children:(0,t.jsx)("div",{className:"p-[1.6rem] pt-[0.8rem]",children:i})})}},3287:function(e,i,r){"use strict";r.d(i,{Q:function(){return a},S:function(){return u}});var t=r(3827),n=r(4090),s=r(5468);let l=(0,n.createContext)(""),a=e=>{let{children:i,value:r}=e,{rounded:n}=(0,s.w8)(),a=["accordion-item w-full border-x border-t border-solid border-neutral-300 last:border-b overflow-hidden",n?"first:rounded-t-xl last:rounded-b-xl":""].filter(e=>!!e).join(" ");return(0,t.jsx)(l.Provider,{value:r,children:(0,t.jsx)("div",{className:a,children:i})})},u=()=>(0,n.useContext)(l)},5468:function(e,i,r){"use strict";r.d(i,{Lf:function(){return o},c2:function(){return a},w8:function(){return u}});var t=r(3827),n=r(4090);let s=(0,n.createContext)({values:[],rounded:!1}),l=(0,n.createContext)({setter:()=>null}),a=e=>{let{children:i,multiple:r=!0,values:a=[],onChange:u,rounded:o=!1}=e,[c,d]=(0,n.useState)(a),m=(0,n.useCallback)(e=>{let i=new Set([e]);r&&((i=new Set(c)).has(e)?i.delete(e):i.add(e)),d(Array.from(i))},[c,r]),x=(0,n.useMemo)(()=>c,[c]),h=(0,n.useMemo)(()=>o,[o]),v=(0,n.useMemo)(()=>m,[m]);return(0,n.useEffect)(()=>{u&&"function"==typeof u&&u(x)},[x]),(0,t.jsx)(l.Provider,{value:{setter:v},children:(0,t.jsx)(s.Provider,{value:{values:x,rounded:h},children:(0,t.jsx)("div",{children:i})})})},u=()=>(0,n.useContext)(s),o=()=>(0,n.useContext)(l)},874:function(e,i,r){"use strict";r.d(i,{i:function(){return l}});var t=r(3827);r(4090);var n=r(5468),s=r(3287);let l=e=>{let{children:i,wrapperClass:r,ellipsis:l=!1}=e,{values:a}=(0,n.w8)(),{setter:u}=(0,n.Lf)(),o=(0,s.S)(),c=null==a?void 0:a.includes(o);return(0,t.jsxs)("div",{className:"flex h-[4.8rem] cursor-pointer items-center justify-between px-[1.6rem] transition-all [&>span]:hover:underline [&>span]:hover:underline-offset-4 ".concat(c?"bg-blue-100 dark:bg-blue-900":""," ").concat(r),onClick:()=>{u(o)},children:[(0,t.jsx)("span",{className:"text-desc ".concat(l?"truncate":""),children:i}),(0,t.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"h-[2rem] w-[2rem] ".concat(c?"-rotate-180":""," flex-shrink-0 text-neutral-500 transition-transform"),children:(0,t.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"m19.5 8.25-7.5 7.5-7.5-7.5"})})]})}}},function(e){e.O(0,[971,69,744],function(){return e(e.s=5108)}),_N_E=e.O()}]);