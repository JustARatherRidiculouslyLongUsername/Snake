window.onload = function() {
	canvas.width = window.innerWidth - 3;
	canvas.height = window.innerHeight - 4;
	ts = 23;
	h = Math.floor(canvas.height/ts) ;
	w = Math.floor(canvas.width/ts) ;
	s = new Snake();
	allFood = new AllFood();
	setInterval(frame, 1000/12);
	document.addEventListener('keydown',k)

	// console.table([
	// 	[1],
	// 	[4,6, 34 ,4,4,6, 34 ,4,4,6, 34 ,4,4,6, 34 ,4,]
	// 	]);
}

var allFood;
var h;
var w;
var ts;
var d = ''

var canvas = document.getElementById('canvas');
var cvs = canvas.getContext('2d');


function k(key) {

	switch(key.keyCode){
		case 37: case 65:
			d = 'L'
			break;
		
		case 38: case 87:
			d = 'U'
			break;
		
		case 39: case 68:
			d = 'R'
			break;

		case 40: case 83:
			d = 'D'
			break;
	}

	if([37, 38, 39, 40, 32].indexOf(key.keyCode) > -1) {
	        key.preventDefault();
	    }
}



function Snake() {
	this.x = Math.ceil(w/2);
	this.y = Math.ceil(h/2);
	this.xv = this.yv = 0;
	this.score = 5;
	this.body = [];
	this.difficulty = 'medium';

	this.show = function () {

		cvs.fillStyle = '#fff';
		
		cvs.fillRect(this.x*ts,this.y*ts,ts-2, ts-2)
		
		for (var i = 0; i < this.body.length; i++) {
			cvs.fillRect(this.body[i].x*ts, this.body[i].y*ts, ts - 2, ts - 2)
		}		
	}

	this.update = function () {

		this.body.push({x: this.x, y:this.y});

		while (this.body.length > this.score - 1) {
			this.body.shift();
		}

		this.x += this.xv;
		this.y += this.yv;

		if (this.x > w - 1) {this.x = 0}
		if (this.x < 0) {this.x = w - 1}
		if (this.y > h - 1) {this.y = 0}
		if (this.y < 0) {this.y = h - 1}


		if (this.difficulty != 'easy') {
	
			if (this.difficulty == 'medium') { // If medium
				
				for (var i = this.body.length - 1; i >= 0; i--) {

					//If the snake is still and the co ordinates match,
					if ((this.xv !=0 || this.yv != 0) && 
					this.body[i].x == this.x &&			 
					this.body[i].y == this.y) {
						// Reduce the score by the index of bitten peice + 1 
						//(i=0 is the last peice)
						this.score -= i + 1;
						break;
					}

				}

			} else {  // If hard

				for (var i = this.body.length - 1; i >= 0; i--) {
					
					if ((this.xv !=0 || this.yv != 0) &&
					this.body[i].x == this.x &&
					this.body[i].y == this.y) {
						this.score = 5;
						d = NaN;
						this.x = Math.ceil(w/2);
						this.y = Math.ceil(h/2);
						break;
					}

				}

			}
		}		
	}

	this.easy = function() {
		this.difficulty = 'easy'
		this.score = 10;
		d = NaN;
		this.x = Math.ceil(w/2);
		this.y = Math.ceil(h/2);
	}

	this.medium = function() {
		this.difficulty = 'medium'
		this.score = 5;
		d = NaN;
		this.x = Math.ceil(w/2);
		this.y = Math.ceil(h/2);
	}

	this.hard = function() {
		this.difficulty = 'hard'
		this.score = 1;
		d = NaN;
		this.x = Math.ceil(w/2);
		this.y = Math.ceil(h/2);
	}

	this.dir = function(d) {
		switch(d) {
			case 'L':
				if (this.xv != 1) {this.xv = -1; this.yv = 0;}
				break;
			case 'R':
				if (this.xv != -1) {this.xv = 1; this.yv = 0;}
				break;
			case 'U':
				if (this.yv != 1) {this.xv = 0; this.yv = -1;}
				break;
			case 'D':
				if (this.yv != -1) {this.xv = 0; this.yv = 1;}
				break;
			default:
				this.xv = this.yv = 0;
		}
	}


}


function Food(xpos, ypos, powerup) {
	this.powerup = powerup == 'powerup';

	this.x = Math.floor(Math.random()*w);
	this.y = Math.floor(Math.random()*h);


	if (powerup) {this.countdown = new Countdown(this.x, this.y);}


	for (var i = 0; i < s.body.length; i++) {
		while(s.body[i].x == this.x && s.body[i].y == this.y) {

			this.x = Math.floor(Math.random()*w);
			this.y = Math.floor(Math.random()*h);
		}

	}

	if (xpos >= 0) {this.x = xpos;} 
	if (ypos >= 0) {this.y = ypos;} 


	if (powerup) {this.countdown = new Countdown(this.x, this.y);}


	this.show = function () {
		
		if (powerup) {cvs.fillStyle = '#4286f4';} else {cvs.fillStyle = '#f44';}
		cvs.fillRect(this.x*ts, this.y*ts, ts-2, ts-2);

		if (powerup) {
			this.countdown.show()
		}
	}

	this.eaten = function() {
		return this.x == s.x && this.y == s.y
	}


}


function AllFood () {
	this.list = [];
	this.no_of_foods = 5;
	
	while (this.list.length < this.no_of_foods) {
		this.list.push(new Food())
	}

	this.show = function() {
		for (var i = 0; i < this.list.length; i++) {
			this.list[i].show();
		}
	}

	this.update = function () {

		switch(s.difficulty) {
			case 'easy': this.no_of_foods = 10;break;

			case 'medium': this.no_of_foods = 5; break;

			case 'hard': this.no_of_foods = 1; break;
		}



		while (this.no_of_foods > this.list.length) {
			this.list.push(new Food);
		}

			//Manage the number of foods

		while (this.no_of_foods < this.list.length) {
			this.list.shift();
		}


		// Loop iterating over all foods
		for (var i = this.list.length - 1; i >= 0 ; i--) {

		
			// When the food is eaten
			if (this.list[i].eaten()) {

				if (this.list[i].powerup) {s.score += 10} else {s.score++}

				this.list.splice(i, 1);

				if (Math.random()*10 < 1) {
					this.list.push(new Food(NaN, NaN, 'powerup'));
				} else {
					this.list.push(new Food());
				}
			
			// When the food is a powerup and time is up
			}else if (this.list[i].powerup) {
				this.list[i].countdown.update();

				if (this.list[i].countdown.done) {
					this.list.push(new Food(this.list[i].x, this.list[i].y));
					this.list.splice(i, 1);
					
				}
			}

		}
	}
}


function Countdown(x, y) {
	this.x = x * ts + ts/2 - 1;
	this.y = y * ts + ts/2 - 1;
	this.timer = 1
	this.done = false;

	this.show = function() {
		cvs.strokeStyle = '#4286f4';
		cvs.lineWidth = 6;
		cvs.beginPath();
		cvs.arc(this.x, this.y, 22, -Math.PI/2, 2*Math.PI*this.timer - Math.PI/2, false);
		cvs.stroke();
	}

	this.update = function() {
		this.timer -= .028;
		if (this.timer <= 0) {
			this.done = true
		}
	}
}


function frame(){

	cvs.fillStyle = '#333'
	cvs.fillRect(0, 0, canvas.width, canvas.height)

	s.dir(d);

	s.update();

	allFood.update();

	s.show();

	allFood.show();


	cvs.fillStyle = '#f44'
	cvs.font = '40px Arial'
	cvs.textAlign="center"
	cvs.fillText(s.score, canvas.width/2, 40);
	
}
