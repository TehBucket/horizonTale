var C = document.getElementById('game');
var G = C.getContext('2d'); //displays game itself
var coin /*random bool*/= function(){return (ran(0,1)==0 ? true : false)}
var mix /*mixing colours*/= function(c,cc,n){ //adds n amount of cc to c (n is a percent, .25 or 1) (only additive or whatever its called)
	return {r:c.r + Math.floor(cc.r*n),g:c.g + Math.floor(cc.g*n),b:c.b + Math.floor(cc.b*n)};
}
var rgb = function(c){with(c){
	if(typeof a ==='undefined'){return 'rgb('+r+','+g+','+b+')'}
	else{return 'rgba('+r+','+g+','+b+','+a+')'}
}}

var beatCount = 0; //global timer, so that music is synced with actions
var mute = false; //if sound is disabled
var beat = function(n){
	if((beatCount/n) % 1 == 0){return true}
	else{return false}
}
var images = {}
var sounds = {}
//load/write images (and sounds) memory
var loadFiles = function(){
	images.player = new Image();
	images.player.src = 'images/player.png';
	//sound bits
	sounds.hhat= new Audio("sounds/highhat.wav");
	sounds.bass= new Audio("sounds/bass.wav");
}
loadFiles();

var p = {x:20,y:120,w:32,h:32,img:'player',f:4,}
var bullets = [];

var drawImg = function(obj){
	// with(obj){G.drawImage(images[img],x,y);}
	with(obj){
		G.drawImage(images[img]
			,0
			,f*h
			,w
			,h
			,x
			,y
			,w
			,h);
	}
}

var co = {
	sky:[{c:{r:67,g:67,b:67},dist:85/240},{c:{r:107,g:107,b:107},dist:113/240},{c:{r:255,g:40,b:23},dist:118/240},{c:{r:255,g:138,b:0},dist:124/240},{c:{r:255,g:255,b:0},dist:138/240},{c:{r:121,g:255,b:250},dist:162/240},{c:{r:16,b:188,g:219},dist:1},],
}

//converts current arrow key input to axis
var keyStuff = function(){with(keys){
	if(up){y=-1}
	else if(down){y=1}
	else{y=0}
	if(left){x=-1}
	else if(right){x=1}
	else{x=0}
}}

var newBullet = function(x,y,xv,yv,c,o,hp){
	this.x = x;
	this.y = y;
	this.xv = xv;
	this.yv = yv;
	this.c = c;
	this.o = o;
	this.hp = hp; //degrades every frame, how long it lasts
}

//moves and stuff for player
var pMove = function(){with(p){
	//move
	x += keys.x*2
	y += keys.y*2
	//shoot
	if(beat(12)){
		if(!mute){sounds.hhat.currentTime=0;sounds.hhat.play()}
		bullets.push(new newBullet(x+w,y+h/2,3,0,{r:255,g:255,b:255},0,500))
		}
	if(beat(50)){
		if(!mute){sounds.bass.currentTime=0;sounds.bass.play()}
		bullets.push(new newBullet(x+w,y+h/2,2,2,{r:25,g:225,b:25},0,500));
		bullets.push(new newBullet(x+w,y+h/2,2,-2,{r:25,g:225,b:25},0,500));
		}
	//frames, animation
	if(keys.up && f>0 && beat(10)){f-=1}
	else if(keys.down && f<8 && beat(10)){f+=1}
	else if(beat(25)&&f!=4&&!keys.up&&!keys.down){(f<4) ? f++ : f--}
}}

var bulletMove = function(){
	var tmp = [];
	for(var i=0;i<bullets.length-1;i++){with(bullets[i]){
		x += xv;
		y += yv;
		hp--;
		if(hp<=0){tmp.push(i)}
	}}
	for(var i=tmp.length-1;i>-1;i-=1){bullets.splice(tmp[i],1)}
}

////////////UPDATE///////
function update(){
	setTimeout(function() {
		requestAnimationFrame(update);
		C.width = C.width;
		keyStuff();
		(beatCount > 100) ? beatCount = 1 : beatCount++;
		pMove();
		bulletMove();
		//draw all (put in function and fps balance later)	
		//draw bg
		G.rect(0, 0, C.width, C.height); //necessary?
		var grad = G.createLinearGradient(0,C.height,0,0);
		for(var i=0;i<co.sky.length-1;i++){
			with(co.sky[i]){grad.addColorStop(dist, rgb(c))}//add movement later (p.y)
		}
		G.fillStyle = grad;
		G.fill();
		//player draw
		drawImg(p);
		//bullets draw
		for(var i=0;i<bullets.length-1;i++){with(bullets[i]){G.fillStyle=rgb(c);G.fillRect(x,y,5,5);}}
		}, 1000/60);
}
update();

//////////////////////////
//controls
var keys = {
	x:0, // x and y axis instead up up/down/left/right for ease and also controller compatibility
	y:0,
	left:false,
	right:false,
	up:false,
	down:false,
}

document.addEventListener('keydown', function(e){
	if(e.keyCode==65||e.keyCode==37){keys.left=true}
	if(e.keyCode==68||e.keyCode==39){keys.right=true}
	if(e.keyCode==87||e.keyCode==38){keys.up=true}
	if(e.keyCode==83||e.keyCode==40){keys.down=true}
	// console.log(e.keyCode);
},false);
document.addEventListener('keyup', function(e){
	if(e.keyCode==65||e.keyCode==37){keys.left=false}
	if(e.keyCode==68||e.keyCode==39){keys.right=false}
	if(e.keyCode==87||e.keyCode==38){keys.up=false}
	if(e.keyCode==83||e.keyCode==40){keys.down=false}
},false);

//turns off keys when tabs/window is switched
window.addEventListener('blur', function() {
  keys.left=false;keys.right=false;keys.up=false;keys.down=false;
},false);

// var int=self.setInterval(function(){update()},1);

//testification stuff:
