const normalize=value=>((value%360)+360)%360;
const nearestEquivalent=(target,current)=>current+((((target-current)+540)%360)-180);

export class RuneDial{
  constructor({root,itemsRoot,previous,next,items,onChange}){
    this.root=root;this.itemsRoot=itemsRoot;this.previous=previous;this.next=next;this.items=items;this.onChange=onChange;
    this.step=360/items.length;this.pointerAngleOffset=90;this.angle=this.pointerAngleOffset;this.index=0;this.drag=null;this.suppressClick=false;this.buttons=[];this.abortController=new AbortController();this.renderItems();this.bind();this.select(0,false);
  }
  renderItems(){
    this.itemsRoot.replaceChildren();
    this.buttons=this.items.map((item,index)=>{
      const button=document.createElement('button');button.type='button';button.className='dial-item';button.style.setProperty('--angle',`${index*this.step}deg`);button.setAttribute('role','option');button.setAttribute('aria-label',item.name);
      if(item.image){const image=new Image();image.src=item.image;image.alt='';image.addEventListener('error',()=>image.remove(),{once:true});button.append(image)}
      const label=document.createElement('span');label.textContent=item.name;button.append(label);button.addEventListener('click',event=>{if(this.suppressClick){event.preventDefault();return}this.select(index)},{signal:this.abortController.signal});this.itemsRoot.append(button);return button;
    });
  }
  bind(){
    const options={signal:this.abortController.signal};
    this.previous.addEventListener('click',()=>this.select(this.index-1),options);this.next.addEventListener('click',()=>this.select(this.index+1),options);
    this.root.addEventListener('keydown',event=>{if(event.key==='ArrowLeft'||event.key==='ArrowUp'){event.preventDefault();this.select(this.index-1)}if(event.key==='ArrowRight'||event.key==='ArrowDown'){event.preventDefault();this.select(this.index+1)}},options);
    this.root.addEventListener('pointerdown',event=>{this.suppressClick=false;this.drag={id:event.pointerId,start:this.getPointerAngle(event),base:this.angle,moved:false};this.root.setPointerCapture(event.pointerId);this.root.classList.add('is-dragging')},options);
    this.root.addEventListener('pointermove',event=>{if(!this.drag||event.pointerId!==this.drag.id)return;const delta=this.getPointerAngle(event)-this.drag.start;const corrected=delta>180?delta-360:delta<-180?delta+360:delta;this.drag.moved||=Math.abs(corrected)>3;this.setAngle(this.drag.base+corrected,false)},options);
    const release=event=>{if(!this.drag||event.pointerId!==this.drag.id)return;this.root.classList.remove('is-dragging');if(this.root.hasPointerCapture(event.pointerId))this.root.releasePointerCapture(event.pointerId);const index=Math.round(normalize(this.pointerAngleOffset-this.angle)/this.step)%this.items.length;this.suppressClick=this.drag.moved;this.drag=null;this.select(index,true);if(this.suppressClick){event.preventDefault();setTimeout(()=>{this.suppressClick=false},0)}};
    this.root.addEventListener('pointerup',release,options);this.root.addEventListener('pointercancel',release,options);
  }
  getPointerAngle(event){const box=this.root.getBoundingClientRect();return Math.atan2(event.clientY-box.top-box.height/2,event.clientX-box.left-box.width/2)*180/Math.PI}
  setAngle(angle,animate=true){this.angle=angle;this.root.style.transition=animate?'transform .55s cubic-bezier(.2,.75,.2,1)':'none';this.root.style.transform=`rotate(${angle}deg)`;this.buttons.forEach(button=>button.style.setProperty('--counter',`${-angle}deg`))}
  select(rawIndex,animate=true){const count=this.items.length;this.index=((rawIndex%count)+count)%count;this.setAngle(nearestEquivalent(this.pointerAngleOffset-this.index*this.step,this.angle),animate);this.buttons.forEach((button,index)=>{const active=index===this.index;button.classList.toggle('is-active',active);button.setAttribute('aria-selected',String(active))});this.onChange?.(this.items[this.index],this.index)}
  destroy(){this.abortController.abort();this.root.classList.remove('is-dragging');this.root.style.removeProperty('transform');this.root.style.removeProperty('transition');this.itemsRoot.replaceChildren()}
}
