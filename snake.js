var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

// gotta do this or its not gonna be readable
var scoreCanvas = document.getElementById("score-canvas");
var scoreCtx = scoreCanvas.getContext("2d");

const sideLength = 150;
const spaceSize = 3;
const gameSideLength = 750;

const scoreHeight = 30;
const scoreTileSize = 2.5;

updateCanvasResolution();

function updateCanvasResolution()
{
	const tabLength = Math.min(gameSideLength, window.innerWidth, window.innerHeight);

	canvas.style.left = ((window.innerWidth - tabLength) / 2) + 'px';
	canvas.style.top = (window.innerHeight - tabLength) / 2 + 'px';
	canvas.style.position = "absolute";
	canvas.width = tabLength;
	canvas.height = tabLength;

	ctx.msImageSmoothingEnabled = false;
	ctx.mozImageSmoothingEnabled = false;
	ctx.webkitImageSmoothingEnabled = false;
	ctx.imageSmoothingEnabled = false;

	scoreCanvas.style.left = canvas.style.left;
	scoreCanvas.style.top = (((window.innerHeight - tabLength) / 2) - scoreHeight) + 'px';
	scoreCanvas.style.position = canvas.style.position;
	scoreCanvas.width = tabLength;
	scoreCanvas.height = scoreHeight;

	scoreCtx.msImageSmoothingEnabled = false;
	scoreCtx.mozImageSmoothingEnabled = false;
	scoreCtx.webkitImageSmoothingEnabled = false;
	scoreCtx.imageSmoothingEnabled = false;

	updateScoreBoard();

	document.body.width = window.innerWidth;
	document.body.height = window.innerHeight;
}

window.addEventListener("resize", updateCanvasResolution);

function drawSquare(x, y, width, height) 
{
	ctx.fillStyle = "green";
	ctx.fillRect(x, y, width, height);
}

function scaleCanvas()
{
	ctx.drawImage(canvas, 0, 0, sideLength, sideLength, 0, 0, canvas.width, canvas.height);
}

var updateID;
var curSpeed = 200;
function setupGame()
{
	moveFruit();
	updateScoreBoard();

	updateID = setInterval(update, curSpeed);
	document.addEventListener("keydown", keyDown, false);
}

var snake = {x: 0, y: 0};
var snakeArray = [];
var snakeLength = 1; // acts like score
function drawSnake()
{
	var curSnakes = getCurSnakes();
	for(var i=0; i < curSnakes.length; i++)
	{
		var drawSnake = curSnakes[i];
		drawSquare(drawSnake.x*spaceSize, drawSnake.y*spaceSize, spaceSize, spaceSize);
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
	drawSquare((fruit.x*spaceSize)+1, (fruit.y*spaceSize), 1, 1);

	drawSquare((fruit.x*spaceSize), (fruit.y*spaceSize)+1, 1, 1);
	drawSquare((fruit.x*spaceSize)+2, (fruit.y*spaceSize)+1, 1, 1);

	drawSquare((fruit.x*spaceSize)+1, (fruit.y*spaceSize)+2, 1, 1);
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

	if ((key == 37 || key == 65) && (lastDirectionIsnt("right") && lastDirectionIsnt("left"))) {
		directions.push("left");
	}
	
	if ((key == 38 || key == 87) && (lastDirectionIsnt("down") && lastDirectionIsnt("up"))) {
		directions.push("up");
	}
	
	if ((key == 39 || key == 68) && (lastDirectionIsnt("left") && lastDirectionIsnt("right"))) {
		directions.push("right");
	}
	
	if ((key == 40 || key == 83) && (lastDirectionIsnt("up") && lastDirectionIsnt("down"))) {
		directions.push("down");
	}
}

function moveFruit()
{
	fruit.x = Math.floor(Math.random() * (sideLength / spaceSize));
	fruit.y = Math.floor(Math.random() * (sideLength / spaceSize));
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
			console.log('snake died! ' + snakeLength);
			snakeDeath();
		}
	}

	if(snake.x == fruit.x && snake.y == fruit.y)
	{
		snakeLength++;
		console.log('snake got fruit!');
		checkHighscore();
		updateScoreBoard();
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

function updateSnakeLogic()
{
	snake.x = snake.x % (sideLength / spaceSize);
	snake.y = snake.y % (sideLength / spaceSize);

	if(snake.x < 0)
		snake.x = (sideLength / spaceSize) + snake.x;

	if(snake.y < 0)
		snake.y = (sideLength / spaceSize) + snake.y;

	snakeArray.push(snake);
}

function updateScoreBoard()
{
	const nonScaledScoreHeight = scoreHeight / scoreTileSize;
	const nonScaledScoreWidth = scoreCanvas.width / scoreTileSize;

	scoreCtx.fillStyle = "black";
	scoreCtx.fillRect(0, 0, nonScaledScoreWidth, nonScaledScoreHeight);

	scoreCtx.font = nonScaledScoreHeight + "px vcrOsdMono";
	scoreCtx.fillStyle = "green";

	scoreCtx.textAlign = "left";
	scoreCtx.fillText("score: " + (snakeLength - 1),2,nonScaledScoreHeight);

	scoreCtx.textAlign = "right";
	scoreCtx.fillText("highscore: " + localStorage.getItem('snakeHighscore'), nonScaledScoreWidth-2,nonScaledScoreHeight);

	scoreCtx.drawImage(scoreCanvas, 0, 0, nonScaledScoreWidth, nonScaledScoreHeight, 0, 0, scoreCanvas.width, scoreCanvas.height);
}

var newHighscore = false;
function checkHighscore()
{
	const curHighscore = localStorage.getItem('snakeHighscore');

	if(curHighscore == null)
		localStorage.setItem('snakeHighscore', (snakeLength - 1));
	else
	{
		const curHighscoreNumber = Number(curHighscore);

		if(curHighscoreNumber < (snakeLength - 1))
		{
			localStorage.setItem('snakeHighscore', (snakeLength - 1));
			newHighscore = true;
		}
	}
}

function snakeDeath()
{
	clearInterval(updateID);

	deathAnim = setInterval(playDeathAnim, 500);
	document.removeEventListener("keydown", keyDown, false);

	var animElapsed = 0;
	function playDeathAnim() 
	{
		clearDrawings();

		if(animElapsed == 4)
		{
			clearInterval(deathAnim);
			deathAnim = null;
			showDeathScreen();
			return;
		}

		if(animElapsed % 2 != 0)
		{
			drawSnake();
			drawFruit();
		}

		scaleCanvas();

		animElapsed++;
	}

	playDeathAnim();
}

function showDeathScreen()
{
	ctx.font = "18px vcrOsdMono";
	ctx.textAlign = "center";
	ctx.fillStyle = "green";

	ctx.fillText("you died",sideLength/2,30);

	var scoreText = "score: ";
	scoreText += (snakeLength - 1);
	ctx.fillText(scoreText,sideLength/2,65);
	
	if(newHighscore)
		ctx.fillText('new highscore!',sideLength/2,65+20);

	var enterTextX = 110;
	ctx.fillText("press ENTER",sideLength/2,enterTextX);
	ctx.fillText("to play again",sideLength/2,enterTextX+20);

	scaleCanvas();

	function keydownEnter(e)
	{
		if(e.keyCode == 13)
		{
			document.removeEventListener("keydown", keydownEnter, false);
			location.reload();
		}
	}
	document.addEventListener("keydown", keydownEnter, false);
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

	updateSnakeLogic();
	drawSnake();

	drawFruit();

	scaleCanvas();
	checkColision();
}

setupGame();