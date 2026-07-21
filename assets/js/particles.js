export function startParticles(canvas){
 const context=canvas.getContext('2d'),reduced=matchMedia('(prefers-reduced-motion: reduce)');let particles=[],frame=0,width=0,height=0;
 function resize(){const dpr=Math.min(devicePixelRatio||1,1.5);width=innerWidth;height=innerHeight;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);context.setTransform(dpr,0,0,dpr,0,0);const count=reduced.matches?18:Math.min(85,Math.round(width*height/24000));particles=Array.from({length:count},()=>({x:Math.random()*width,y:Math.random()*height,r:.5+Math.random()*1.7,v:.12+Math.random()*.38,w:Math.random()*6}))}
 function draw(){context.clearRect(0,0,width,height);for(const p of particles){p.y+=p.v;p.x+=Math.sin(p.y*.008+p.w)*.12;if(p.y>height+4){p.y=-4;p.x=Math.random()*width}context.beginPath();context.arc(p.x,p.y,p.r,0,Math.PI*2);context.fillStyle='rgba(200,239,255,.55)';context.fill()}frame=requestAnimationFrame(draw)}
 function visibility(){cancelAnimationFrame(frame);frame=0;if(!document.hidden)draw()}
 addEventListener('resize',resize,{passive:true});document.addEventListener('visibilitychange',visibility);reduced.addEventListener?.('change',resize);resize();draw();
}
