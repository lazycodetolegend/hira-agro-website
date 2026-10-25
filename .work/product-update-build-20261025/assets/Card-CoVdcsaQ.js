import{j as s}from"./vendor-DaWYjExo.js";import{m as u}from"./framer-motion-8mRhX5Pa.js";const l=({children:o,className:a="",hoverEffect:i=!0,animate:n=!1,delay:m=0,onClick:t,...e})=>{const r=`
    border border-stone/15 rounded-sm
    ${i?"hover:border-stone/40 transition-colors duration-300":""}
    ${a}
  `;return n?s.jsx(u.div,{initial:{opacity:0,y:16},whileInView:{opacity:1,y:0},viewport:{once:!0,amount:.2},transition:{duration:.5,delay:m,ease:"easeOut"},className:r,onClick:t,...e,children:o}):s.jsx("div",{className:r,onClick:t,...e,children:o})};export{l as C};
