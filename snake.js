var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var sideLength = 150;
var gameSideLength = 750;

updateCanvasResolution();

function updateCanvasResolution()
{
	gameSideLength = Math.min(750, window.innerWidth, window.innerHeight);

	canvas.style.left = (window.innerWidth - gameSideLength) / 2 + 'px';
	canvas.style.top = (window.innerHeight - gameSideLength) / 2 + 'px';
	canvas.style.position = "absolute";

	canvas.width = gameSideLength;
	canvas.height = gameSideLength;

	document.body.width = window.innerWidth;
	document.body.height = window.innerHeight;

	var scale = gameSideLength/sideLength;
	ctx.scale(scale, scale);
}

window.addEventListener("resize", updateCanvasResolution);

function drawSquare(x, y, width, height) 
{
	ctx.fillStyle = "green";
	ctx.fillRect(x, y, width, height);
}

var snake = {x: 0, y: 0};
var snakeArray = [];
var snakeLength = 1; // acts like score
function drawSnake()
{
	snake.x = snake.x % (sideLength / 3);
	snake.y = snake.y % (sideLength / 3);

	if(snake.x < 0)
		snake.x = sideLength + snake.x;

	if(snake.y < 0)
		snake.y = sideLength + snake.y;

	snakeArray.push(snake);

	var curSnakes = getCurSnakes();
	for(var i=0; i < curSnakes.length; i++)
	{
		var drawSnake = curSnakes[i];
		drawSquare(drawSnake.x*3, drawSnake.y*3, 3, 3);
	}
}

function getCurSnakes()
{
	var toReturn = [];

	for(var i=1; i < snakeLength+1; i++)
		toReturn.push(snakeArray[snakeArray.length-i]);

	return toReturn;
}

var fruit = {x: 0, y: 0};
function drawFruit()
{
	drawSquare((fruit.x*3)+1, (fruit.y*3), 1, 1);

	drawSquare((fruit.x*3), (fruit.y*3)+1, 1, 1);
	drawSquare((fruit.x*3)+2, (fruit.y*3)+1, 1, 1);

	drawSquare((fruit.x*3)+1, (fruit.y*3)+2, 1, 1);
}

function clearDrawings()
{
	ctx.fillStyle = "black";
	ctx.fillRect(0, 0, sideLength, sideLength);
}

var directions = [];

function keyDown(e)
{
	var key = e.keyCode;

	function lastDirectionIsnt(direction) 
	{
		if(directions.length != 0)
			return directions[directions.length-1] != direction;
		else
			return lastDirection != direction;
	}

	if ((key == 37 || key == 65) && lastDirectionIsnt("right")) {
		directions.push("left");
	}
	
	if ((key == 38 || key == 87) && lastDirectionIsnt("down")) {
		directions.push("up");
	}
	
	if ((key == 39 || key == 68) && lastDirectionIsnt("left")) {
		directions.push("right");
	}
	
	if ((key == 40 || key == 83) && lastDirectionIsnt("up")) {
		directions.push("down");
	}
}

function moveFruit()
{
	fruit.x = Math.floor(Math.random() * (sideLength / 3));
	fruit.y = Math.floor(Math.random() * (sideLength / 3));
}

function checkColision()
{
	var curSnakes = getCurSnakes();
	for(var i=0; i < curSnakes.length; i++)
	{
		var drawSnake = curSnakes[i];
		if(drawSnake.x == snake.x && drawSnake.y == snake.y && i != 0)
		{
			// TODO: make an animation that happens when you die
			console.log('snake died! ' + i);
			clearInterval(updateID);
		}
	}

	if(snake.x == fruit.x && snake.y == fruit.y)
	{
		snakeLength++;
		console.log('snake got fruit!');
		moveFruit();

		// speed up the game by 0.5%
		clearInterval(updateID);
		curSpeed -= curSpeed * 0.01;
		console.log(curSpeed);
		updateID = setInterval(update, curSpeed);
	}

	snake = {
		x: snake.x,
		y: snake.y
	}; // new snake obj
}

var lastDirection = 'right';
function update() {
	clearDrawings();

	var curDirection;
	if(directions.length != 0)
		curDirection = directions.shift();
	else
		curDirection = lastDirection;

	if(curDirection == 'left')
		snake.x -= 1;
	else if(curDirection == 'down')
		snake.y += 1;
	else if(curDirection == 'up')
		snake.y -= 1;
	else if(curDirection == 'right')
		snake.x += 1;

	lastDirection = curDirection;

	drawSnake();
	drawFruit();
	checkColision();
}

var updateID;
var curSpeed = 200;
function setupGame()
{
	moveFruit();

	updateID = setInterval(update, curSpeed);
	document.addEventListener("keydown", keyDown, false);
}

setupGame();