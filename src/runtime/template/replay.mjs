(()=>{w._$delayHydration.then(e=>{if(e instanceof PointerEvent||e instanceof MouseEvent&&e.type==="click"||window.TouchEvent&&e instanceof TouchEvent){setTimeout(()=>w.requestIdleCallback(()=>setTimeout(()=>e.target&&e.target.click(),500)),50)}})})();