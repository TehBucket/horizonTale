var C = document.getElementById('game');
var G = C.getContext('2d'); //displays game itself
var lastFrame = new Date().getTime();
var fD = 0; // [last, current] how much time since last frame, to smooth observed fps
var ran /*random int*/= function(min,max){return Math.floor(Math.random()*(max - min + 1) + min)}
var coin /*random bool*/= function(){return (ran(0,1)==0 ? true : false)}
var mix /*mixing colours*/= function(c,cc,n){ //adds n amount of cc to c (n is a percent, .25 or 1) (only additive or whatever its called)
	return {r:c.r + Math.floor(cc.r*n),g:c.g + Math.floor(cc.g*n),b:c.b + Math.floor(cc.b*n)};
}
var rgb = function(c){with(c){
	if(typeof a ==='undefined'){return 'rgb('+r+','+g+','+b+')'}
	else{return 'rgba('+r+','+g+','+b+','+a+')'}
}}

var x = 0;
var y = 0;
x,y = 12;
console.log(x,y);
var images = {}
//load/write images (and sounds) memory
var loadFiles = function(){
	images.player = new Image();
	images.player.src = 'images/player.png';
}
loadFiles();

var p = {x:20,y:120,w:25,h:25,img:'player'}

var drawImg = function(obj){
	with(obj){G.drawImage(images[img],x,y);}
}

var co = {
	sky:[{c:{r:44,g:44,b:44},dist:85/240},{c:{r:107,g:107,b:107},dist:113/240},{c:{r:255,g:40,b:23},dist:118/240},{c:{r:255,g:138,b:0},dist:124/240},{c:{r:255,g:255,b:0},dist:138/240},{c:{r:121,g:255,b:250},dist:162/240},{c:{r:16,b:188,g:219},dist:1},],
}

var pMove = function(){
	p.x += keys.x*fD
	p.y += keys.y*fD
}

var update = function(){
	fD = (new Date().getTime() - lastFrame)/5;
	lastFrame = new Date().getTime();
	C.width = C.width;
	pMove();
	//draw all (put in function and fps balance later)	
	//draw bg
	G.rect(0, 0, C.width, C.height); //necessary?
	var grad = G.createLinearGradient(0,C.height,0,0);
	for(var i=0;i<co.sky.length-1;i++){
		with(co.sky[i]){grad.addColorStop(dist*p.y/240, rgb(c));}
	}
	G.fillStyle = grad;
	G.fill();
	
	drawImg(p);
}


//////////////////////////
//controls
var keys = {
	x:0, // x and y axis instead up up/down/left/right for ease and also controller compatibility
	y:0,
}

document.addEventListener('keydown', function(e){
	if(e.keyCode==65||e.keyCode==37){keys.x=-1}
	if(e.keyCode==68||e.keyCode==39){keys.x=1}
	if(e.keyCode==87||e.keyCode==38){keys.y=-1}
	if(e.keyCode==83||e.keyCode==40){keys.y=1}
	// console.log(e.keyCode);
},false);
document.addEventListener('keyup', function(e){
	if(e.keyCode==65||e.keyCode==37){keys.x=0}
	if(e.keyCode==68||e.keyCode==39){keys.x=0}
	if(e.keyCode==87||e.keyCode==38){keys.y=0}
	if(e.keyCode==83||e.keyCode==40){keys.y=0}
},false);

//turns off keys when tabs/window is switched
window.addEventListener('blur', function() {
  keys.x=0;keys.y=0;
},false);

var int=self.setInterval(function(){update()},1);
