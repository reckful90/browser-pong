const fs=require('fs'),vm=require('vm'),assert=require('assert');
const html=fs.readFileSync(require('path').join(__dirname,'dist','index.html'),'utf8');
const elements=new Map();const handlers={};let tool;
function element(id){if(!elements.has(id))elements.set(id,{value:'2',textContent:'',hidden:false,attributes:{},addEventListener(n,f){this[n]=f;},setAttribute(n,v){this.attributes[n]=v;},focus(){},setPointerCapture(){},getBoundingClientRect(){return{top:0,height:600}},getContext(){return new Proxy({},{get:()=>()=>{}})}});return elements.get(id);}
const sandbox={document:{querySelector:element,addEventListener(n,f){handlers[n]=f},modelContext:{registerTool(t){tool=t}}},window:{addEventListener(n,f){handlers[n]=f}},requestAnimationFrame(){},HTMLInputElement:class{},HTMLButtonElement:class{},console};
const script=html.match(/<script>([\s\S]*?)<\/script>/)[1];
new vm.Script(script);
vm.runInNewContext(script.replace('showMenu();requestAnimationFrame(frame);',`showMenu();globalThis.test={step,bounce,serve,setRunning,reset,frame,spawnOrb,tickPowers,collectOrb,grantPower,paddlePositions,paddleBounds,get:()=>({ball,left,right,running,playerScore,computerScore,orb,orbWait,powers,mode,inMenu}),place:(data)=>Object.assign(ball,data),putOrb:(value)=>orb=value,setPaddles:(l,r)=>{left=l;right=r;}};`),sandbox);
const t=sandbox.test;
assert(t.get().inMenu);assert(element('#game').hidden);assert(element('#score').hidden);
function key(name,repeat=false){let prevented=false;handlers.keydown({key:name,repeat,target:{},preventDefault(){prevented=true;}});return prevented;}
key(' ');assert(!t.get().running,'Space cannot start a game behind the menu');
element('#startGame').click();assert.equal(t.get().mode,'single');assert(t.get().running);assert(element('#menu').hidden);assert(!element('#game').hidden);
t.reset();
assert.equal(t.get().running,false);assert.equal(t.get().ball.speed,260);
t.bounce(t.get().left,1);assert.equal(t.get().ball.hits,1);assert.equal(t.get().ball.speed,273);assert(t.get().ball.vx>0);
for(let i=0;i<100;i++)t.bounce(t.get().left,1);assert.equal(t.get().ball.speed,1040);
t.serve();assert.equal(t.get().ball.speed,260);t.step(1);t.place({x:60,y:300,vx:-260,vy:0});t.step(.04);assert(t.get().ball.vx>0);assert.equal(t.get().ball.hits,1);
t.place({x:969,y:0,vx:260,vy:0});t.step(.01);assert.equal(t.get().playerScore,1);assert.equal(t.get().ball.hits,0);assert.equal(t.get().ball.speed,260);
t.setRunning(true);tool.execute({});assert.equal(t.get().running,false);assert.throws(()=>tool.execute({bad:true}));
t.reset();assert.equal(t.get().playerScore,0);assert.equal(t.get().computerScore,0);assert.equal(t.get().running,false);
for(let i=0;i<50;i++){t.spawnOrb();const {orb,left,right}=t.get();assert(orb);const y=orb.side==='left'?left:right;assert(orb.y+12<y||orb.y-12>y+116);assert(orb.y>=12&&orb.y<=588);}
t.reset();t.putOrb({side:'left',x:37,y:300,time:5});t.collectOrb();assert.equal(t.get().orb,null);assert.equal(t.get().powers.left.time,10);assert.equal(t.paddlePositions('left').length,2);assert.equal(Math.abs(t.paddlePositions('left')[0]-t.paddlePositions('left')[1])-116,58);
t.frame(100);t.frame(1100);assert.equal(t.get().powers.left.time,10,'Pause freezes power duration');
t.serve();t.step(1);const extraY=t.paddlePositions('left')[1];t.place({x:60,y:extraY+58,vx:-260,vy:0});t.step(.04);assert(t.get().ball.vx>0,'Extra left paddle returns ball');
t.tickPowers(10);assert.equal(t.paddlePositions('left').length,1,'Power expires');
t.reset();t.setPaddles(0,484);t.grantPower('left');t.grantPower('right');assert(t.get().powers.left.offset>0);assert(t.get().powers.right.offset<0);t.step(1);for(const side of ['left','right'])for(const y of t.paddlePositions(side))assert(y>=0&&y+116<=600,'Both paddles stay inside court');
const extraRight=t.paddlePositions('right')[1];t.place({x:900,y:extraRight+58,vx:260,vy:0});t.step(.04);assert(t.get().ball.vx<0,'Extra right paddle returns ball');
t.tickPowers(2);t.grantPower('left');assert.equal(t.get().powers.left.time,10);assert.equal(t.paddlePositions('left').length,2,'Repeated boost never creates a third paddle');
t.reset();t.putOrb({side:'left',x:37,y:40,time:.01});t.tickPowers(.02);assert.equal(t.get().orb,null);assert(t.get().orbWait>=8,'Missed orb expires');
t.grantPower('right');t.reset();assert.equal(t.get().powers.right.time,0);assert.equal(t.get().orb,null);
// Mode controls, transitions and fixed-step pause behavior.
t.reset();key('ArrowDown');t.step(.1);assert.equal(t.get().left,292,'Single-player arrows control left');handlers.keyup({key:'ArrowDown'});
t.reset();t.place({vx:260,y:500});t.step(.1);assert(t.get().right>242,'Existing AI still tracks the ball');
element('#mainMenu').click();assert(t.get().inMenu);assert(!t.get().running);assert.equal(t.get().playerScore,0);
element('#twoPlayerGame').click();assert.equal(t.get().mode,'two');assert(t.get().running);assert.equal(element('#modeLabel').textContent,'Player 1 vs Player 2');
assert.equal(element('#score').attributes['aria-label'],'Player 1 0, Player 2 0');
t.step(.1);assert.equal(t.get().right,242,'No AI movement in two-player mode');
assert(key('w'));t.step(.1);assert.equal(t.get().left,192);assert.equal(t.get().right,242);handlers.keyup({key:'w'});
key('ArrowDown');t.step(.1);assert.equal(t.get().right,292);assert.equal(t.get().left,192);handlers.keyup({key:'ArrowDown'});
key('s');key('ArrowUp');t.step(.1);assert.equal(t.get().left,242);assert.equal(t.get().right,242);
key(' ');assert(!t.get().running);const frozen=JSON.stringify(t.get());t.frame(100);t.frame(200);assert.equal(JSON.stringify(t.get()),frozen,'Pause freezes game');
key(' ',true);assert(!t.get().running,'Held Space does not repeatedly toggle');key(' ');assert(t.get().running);
const before=t.get().left;t.step(.1);assert.equal(t.get().left,before,'Pause clears held input');
element('#court').pointermove({pointerType:'mouse',clientY:0});t.step(.1);assert.equal(t.get().left,before,'Pointer does not interfere with two-player keyboard controls');
for(const side of ['left','right'])t.grantPower(side);key('w');key('ArrowDown');for(let i=0;i<200;i++)t.step(1/240);
for(const side of ['left','right'])for(const y of t.paddlePositions(side))assert(y>=0&&y+116<=600,'Powered human paddles stay in bounds');
// Both players score and receive correctly labelled scores.
t.reset();t.step(1);t.place({x:969,y:0,vx:260,vy:0});t.step(.01);assert.equal(t.get().playerScore,1);assert.equal(element('#score').attributes['aria-label'],'Player 1 1, Player 2 0');
t.step(1);t.place({x:-9,y:0,vx:-260,vy:0});t.step(.01);assert.equal(t.get().computerScore,1);assert.equal(element('#score').attributes['aria-label'],'Player 1 1, Player 2 1');
element('#reset').click();assert.equal(t.get().mode,'two');assert(!t.get().running);assert.equal(t.get().computerScore,0);assert.equal(t.get().powers.left.time,0);
element('#toggle').click();assert(t.get().running);handlers.blur();assert(!t.get().running);
element('#mainMenu').click();const menuState=JSON.stringify(t.get());key('w');key('ArrowDown');key(' ');t.frame(100);t.frame(200);assert.equal(JSON.stringify(t.get()),menuState);
element('#startGame').click();assert.equal(t.get().mode,'single');assert(t.get().running);assert.equal(t.get().right,242);assert.equal(t.get().orb,null);assert.equal(t.get().powers.right.time,0);
element('#court').pointermove({pointerType:'mouse',clientY:100});t.step(.1);assert(t.get().left<242,'Single-player pointer input preserved');
assert.equal(fs.readFileSync(require('path').join(__dirname,'Pong.html'),'utf8'),html,'Playable copies match');
console.log('Passed: menu transitions; single-player AI, keyboard and pointer controls; independent simultaneous two-player controls; scoring; pause/resume/reset/blur; power-ups and collision regressions; identical playable copies.');
