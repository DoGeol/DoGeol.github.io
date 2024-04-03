(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[185],{6349:function(e,t,n){Promise.resolve().then(n.t.bind(n,1993,23)),Promise.resolve().then(n.t.bind(n,3385,23)),Promise.resolve().then(n.bind(n,867)),Promise.resolve().then(n.bind(n,5423))},1774:function(e,t,n){"use strict";n.d(t,{F:function(){return l},f:function(){return i}});var r=n(4090);let a=["light","dark"],s="(prefers-color-scheme: dark)",c=(0,r.createContext)(void 0),o={setTheme:e=>{},themes:[]},l=()=>{var e;return null!==(e=(0,r.useContext)(c))&&void 0!==e?e:o},i=e=>(0,r.useContext)(c)?r.createElement(r.Fragment,null,e.children):r.createElement(u,e),m=["light","dark"],u=e=>{let{forcedTheme:t,disableTransitionOnChange:n=!1,enableSystem:o=!0,enableColorScheme:l=!0,storageKey:i="theme",themes:u=m,defaultTheme:b=o?"system":"light",attribute:g="data-theme",value:x,children:y,nonce:p}=e,[k,w]=(0,r.useState)(()=>h(i,b)),[j,E]=(0,r.useState)(()=>h(i)),S=x?Object.values(x):u,C=(0,r.useCallback)(e=>{let t=e;if(!t)return;"system"===e&&o&&(t=v());let r=x?x[t]:t,s=n?f():null,c=document.documentElement;if("class"===g?(c.classList.remove(...S),r&&c.classList.add(r)):r?c.setAttribute(g,r):c.removeAttribute(g),l){let e=a.includes(b)?b:null,n=a.includes(t)?t:e;c.style.colorScheme=n}null==s||s()},[]),N=(0,r.useCallback)(e=>{w(e);try{localStorage.setItem(i,e)}catch(e){}},[t]),T=(0,r.useCallback)(e=>{E(v(e)),"system"===k&&o&&!t&&C("system")},[k,t]);(0,r.useEffect)(()=>{let e=window.matchMedia(s);return e.addListener(T),T(e),()=>e.removeListener(T)},[T]),(0,r.useEffect)(()=>{let e=e=>{e.key===i&&N(e.newValue||b)};return window.addEventListener("storage",e),()=>window.removeEventListener("storage",e)},[N]),(0,r.useEffect)(()=>{C(null!=t?t:k)},[t,k]);let _=(0,r.useMemo)(()=>({theme:k,setTheme:N,forcedTheme:t,resolvedTheme:"system"===k?j:k,themes:o?[...u,"system"]:u,systemTheme:o?j:void 0}),[k,N,t,j,o,u]);return r.createElement(c.Provider,{value:_},r.createElement(d,{forcedTheme:t,disableTransitionOnChange:n,enableSystem:o,enableColorScheme:l,storageKey:i,themes:u,defaultTheme:b,attribute:g,value:x,children:y,attrs:S,nonce:p}),y)},d=(0,r.memo)(e=>{let{forcedTheme:t,storageKey:n,attribute:c,enableSystem:o,enableColorScheme:l,defaultTheme:i,value:m,attrs:u,nonce:d}=e,h="system"===i,f="class"===c?"var d=document.documentElement,c=d.classList;c.remove(".concat(u.map(e=>"'".concat(e,"'")).join(","),");"):"var d=document.documentElement,n='".concat(c,"',s='setAttribute';"),v=l?a.includes(i)&&i?"if(e==='light'||e==='dark'||!e)d.style.colorScheme=e||'".concat(i,"'"):"if(e==='light'||e==='dark')d.style.colorScheme=e":"",b=function(e){let t=arguments.length>1&&void 0!==arguments[1]&&arguments[1],n=!(arguments.length>2)||void 0===arguments[2]||arguments[2],r=m?m[e]:e,s=t?e+"|| ''":"'".concat(r,"'"),o="";return l&&n&&!t&&a.includes(e)&&(o+="d.style.colorScheme = '".concat(e,"';")),"class"===c?o+=t||r?"c.add(".concat(s,")"):"null":r&&(o+="d[s](n,".concat(s,")")),o},g=t?"!function(){".concat(f).concat(b(t),"}()"):o?"!function(){try{".concat(f,"var e=localStorage.getItem('").concat(n,"');if('system'===e||(!e&&").concat(h,")){var t='").concat(s,"',m=window.matchMedia(t);if(m.media!==t||m.matches){").concat(b("dark"),"}else{").concat(b("light"),"}}else if(e){").concat(m?"var x=".concat(JSON.stringify(m),";"):"").concat(b(m?"x[e]":"e",!0),"}").concat(h?"":"else{"+b(i,!1,!1)+"}").concat(v,"}catch(e){}}()"):"!function(){try{".concat(f,"var e=localStorage.getItem('").concat(n,"');if(e){").concat(m?"var x=".concat(JSON.stringify(m),";"):"").concat(b(m?"x[e]":"e",!0),"}else{").concat(b(i,!1,!1),";}").concat(v,"}catch(t){}}();");return r.createElement("script",{nonce:d,dangerouslySetInnerHTML:{__html:g}})},()=>!0),h=(e,t)=>{let n;try{n=localStorage.getItem(e)||void 0}catch(e){}return n||t},f=()=>{let e=document.createElement("style");return e.appendChild(document.createTextNode("*{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}")),document.head.appendChild(e),()=>{window.getComputedStyle(document.body),setTimeout(()=>{document.head.removeChild(e)},1)}},v=e=>(e||(e=window.matchMedia(s)),e.matches?"dark":"light")},8792:function(e,t,n){"use strict";n.d(t,{default:function(){return a.a}});var r=n(5250),a=n.n(r)},7907:function(e,t,n){"use strict";var r=n(5313);n.o(r,"usePathname")&&n.d(t,{usePathname:function(){return r.usePathname}})},867:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return i}});var r=n(3827),a=n(4090),s=n(1774);function c(){let{systemTheme:e,theme:t,setTheme:n}=(0,s.F)(),c="system"===t?e:t,[o,l]=(0,a.useState)(!1),i=(0,a.useCallback)(()=>{n("dark"===c?"light":"dark")},[c,n]);return((0,a.useEffect)(()=>{l(!0)},[]),o)?(0,r.jsx)("button",{onClick:i,children:(0,r.jsx)("svg",{xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor",className:"h-[2.0rem] w-[2.0rem]",children:(0,r.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"dark"===c?"M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z":"M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"})})}):(0,r.jsx)(r.Fragment,{})}var o=n(8792),l=n(7907);function i(){let[e,t]=(0,a.useState)(0),n=(0,l.usePathname)(),s=(0,a.useMemo)(()=>n.split("/").at(1),[n]);return(0,a.useEffect)(()=>{let e=()=>{t((document.body.scrollTop||document.documentElement.scrollTop)/(document.documentElement.scrollHeight-document.documentElement.clientHeight)*100)};return window.addEventListener("scroll",e),()=>{window.removeEventListener("scroll",e)}},[]),(0,a.useEffect)(()=>{t(0)},[n]),(0,r.jsxs)("nav",{className:"sticky top-0 z-[9999] h-[4rem] bg-white/70 backdrop-blur-sm dark:bg-neutral-900/70",children:[(0,r.jsxs)("div",{className:"flex items-center justify-between px-[1.6rem]",children:[(0,r.jsxs)("div",{className:"flex items-center justify-start",children:[(0,r.jsx)("div",{className:"px-[1rem]",children:(0,r.jsx)("div",{className:"h-[1.4rem] w-[1.4rem]",children:(0,r.jsx)("img",{src:"/logo.png",alt:"logo-pdg"})})}),(0,r.jsxs)("ul",{className:"flex gap-[0.4rem] text-[1.2rem] font-medium transition-all",children:[(0,r.jsx)(o.default,{href:"/",children:(0,r.jsx)("li",{className:"flex h-[4rem] cursor-pointer items-center justify-center rounded-xl px-[1.2rem] hover:bg-neutral-200 dark:hover:bg-neutral-800",children:(0,r.jsx)("span",{className:""===s?"text-blue-600 dark:text-blue-400":"",children:"메인"})})}),(0,r.jsx)(o.default,{href:"/sample",children:(0,r.jsx)("li",{className:"flex h-[4rem] cursor-pointer items-center justify-center rounded-xl px-[1.2rem] hover:bg-neutral-200 dark:hover:bg-neutral-800",children:(0,r.jsx)("span",{className:"sample"===s?"text-blue-600 dark:text-blue-400":"",children:"컴포넌트"})})})]})]}),(0,r.jsx)(c,{})]}),(0,r.jsx)("div",{className:"absolute bottom-0 left-0 h-[0.1rem] w-full bg-gray-200 dark:bg-neutral-600 ",children:(0,r.jsx)("div",{className:"h-[0.15rem] bg-sky-400 dark:bg-sky-500",style:{width:"".concat(e,"%")}})})]})}},5423:function(e,t,n){"use strict";n.r(t),n.d(t,{default:function(){return s}});var r=n(3827);n(4090);var a=n(1774);function s(e){let{children:t}=e;return(0,r.jsx)(a.f,{attribute:"class",children:t})}},3385:function(){},1993:function(e){e.exports={style:{fontFamily:"'__rootFont_192b5a', '__rootFont_Fallback_192b5a'"},className:"__className_192b5a"}}},function(e){e.O(0,[250,971,69,744],function(){return e(e.s=6349)}),_N_E=e.O()}]);