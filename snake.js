var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var width = 50;
var height = 50;

var scale = 15;
canvas.width = width*scale;
canvas.height = height*scale;

ctx.scale(scale, scale);

document.body.style.width = canvas.width + 'px';
document.body.style.height= canvas.height + 'px';

var updateID;
var curSpeed = 200;
function setupGame()
{
    updateID = setInterval(update, curSpeed);
    document.addEventListener("keydown", keyDown, false);
}

setupGame();


function drawSquare(x, y) 
{
    ctx.fillStyle = "green";
    ctx.fillRect(x, y, 1, 1);
}

var snake = {x: 0, y: 0};
var snakeArray = [];
var snakeLength = 1;
function drawSnake()
{
    snake.x = snake.x % width;
    snake.y = snake.y % height;

    if(snake.x < 0)
        snake.x = width + snake.x;

    if(snake.y < 0)
        snake.y = height + snake.y;

    snakeArray.push(snake);

    for(var i=0; i < snakeLength; i++)
    {
        var drawSnake = snakeArray[snakeArray.length-i-1];
        drawSquare(drawSnake.x, drawSnake.y);
    }

    snake = {
        x: snake.x,
        y: snake.y
    }; // new snake obj
}

var fruit = null;
function drawFruit()
{
    if(fruit == null)
        fruit = {x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height)};

    drawSquare(fruit.x, fruit.y);
}

function clearDrawings()
{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
}

var directions = [];

function keyDown(e)
{
    var key = e.keyCode;

    function lastDirectionIsnt(direction) 
    {
        console.log(directions.length);
        console.log(direction);
        console.log(lastDirection);
        
        if(directions.length != 0)
            return directions[directions.length-1] != direction;
        else
            return lastDirection != direction;
    }

    if (key == 37 && lastDirectionIsnt("right")) {
        directions.push("left");
    }
    
    if (key == 38 && lastDirectionIsnt("down")) {
        directions.push("up");
    }
    
    if (key == 39 && lastDirectionIsnt("left")) {
        directions.push("right");
    }
    
    if (key == 40 && lastDirectionIsnt("up")) {
        directions.push("down");
    }
}

function checkColision()
{
    if(snake.x == fruit.x && snake.y == fruit.y)
    {
        snakeLength++;
        console.log('snake got fruit!');
        fruit = {x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height)};

        // speed up the game by 0.5%
        clearInterval(updateID);
        curSpeed -= curSpeed * 0.05;
        updateID = setInterval(update, curSpeed);
    }

    for(var i=0; i < snakeLength; i++)
    {
        if(drawSnake.x == snake.x && drawSnake.y == snake.y && drawSnake != snake)
        {
            // TODO: make an animation that happens when you die
            console.log('snake died!');
            clearInterval(updateID);
        }
    }
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