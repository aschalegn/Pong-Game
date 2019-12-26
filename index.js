
let max, player1Name, player2Name
let playBtn = document.getElementById('playBtn')
let warning = document.getElementById('warning');
let gameFlow = window.requestAnimationFrame || // take care of refreshing the board smoothly 
    window.webkitRequestAnimationFrame ||
    window.mzRequestAnimationFrame

playBtn.onclick = (e) => {
    max = Number(document.getElementById('maxScore').value);
    player1Name = document.getElementById('player1').value;
    player2Name = document.getElementById('player2').value;
    e.preventDefault();
    if (max < 5 || player1Name.length < 0 || player2Name.length < 0) {
        warning.style.display = 'block';
        setTimeout(() => {
            warning.style.display = 'none';
        }, 2500);
    } else {
        e.preventDefault();
        e.target.disabled = true
        //*------------- The game starts after 2 Seconds ------------->
        setTimeout(() => {
            gameFlow(play);
        }, 2000);
    }
}

let canvas = document.getElementById('canvas');
let ballSpeed = 10, playerSpeed = 25, roundScore = 10;
let Block = function (x, y, width, height, score) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.score = score
}
Block.prototype.goUp = function () { return this.y -= playerSpeed; };
Block.prototype.goDown = function () { return this.y += playerSpeed };

//*----------- Ball ------->
function Ball(x, y, radius, sEngle, eEngle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sEngle = sEngle;
    this.eEngle = eEngle;

    this.hitTheEdgesAndMovement = () => {
        if (ball.y - ball.radius <= 0) { ttob = 'top' } //collapse on top
        if (ball.y + ball.radius >= 400) { ttob = 'bottom' } //collapse on bottom
        //! continuosly movement rightToLeft
        if (rtol == 'right') { ball.x += ballSpeed; }
        else { ball.x -= ballSpeed; }
        //! continuosly movement topToBottom
        if (ttob === 'top') { ball.y += ballSpeed / 2 }
        else { ball.y -= ballSpeed / 2 }
    };
}

//*-------- defining Objects And Vars ----->
let ctx = canvas.getContext('2d');
let board = ctx.fillRect(0, 0, 800, 400);
let player1 = new Block(2, 150, 5, 100, 0);
let player2 = new Block(793, 150, 5, 100, 0);
let ball = new Ball(400, 200, 10, 0, 9 * Math.PI, []);
let starter = Math.floor((Math.random() * 2) + 1);
let rtol = '', ttob = '', winner = ''

//*-------- Define who is starting --------->
starter === 1 ? ball.x = player1.x + 15 : ball.x = player2.x - 11
//! Draw the Board
function draw() {
    ctx.fillStyle = "black";
    ctx.fillStyle = "white";
    //*------- Drawing Players ------->
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    //*----- players score ----------->
    ctx.font = "40px Georgia";
    ctx.fillText(player1.score, 30, 50);
    ctx.fillText(player2.score, 740, 50);

    //*------ Drawing Ball ------>
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, ball.sEngle, ball.eEngle);
    ctx.fill();
    ctx.closePath();
    //*----- Drawing Deviders ----->
    let y = 10
    for (let i = 0; i < 5; i++) {
        let divider = new Block(400, y, 5, 50);
        ctx.fillRect(divider.x, divider.y, divider.width, divider.height);
        y += 80
    }
}
draw();

//! Players Movement
window.addEventListener('keydown', (e) => {
    //* Players movement
    switch (e.keyCode) {
        case 87:
            player1.y > 0 ? player1.goUp() : null
            break;
        case 83:
            player1.y + player1.height < canvas.height ? player1.goDown() : null
            break;
        case 38:
            player2.y > 0 ? player2.goUp() : null
            break;
        case 40:
            player2.y + player2.height < canvas.height ? player2.goDown() : null
            break;
        default:
            break;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    draw();
});

function play() {
    //*------- ball movement-------- >
    function movementAndScore() {
        ctx.clearRect(0, 0, 800, 400);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 800, 400);
        ball.hitTheEdgesAndMovement();
        //! Score & define ball direction
        if (ball.x <= player1.x + player1.width) {
            rtol = "right";
            //*-------------- player1 ------------>
            if (ball.y + ball.radius < player1.y || ball.y + ball.radius > player1.y + player1.height) {
                //Todo: reset ball position
                player2.score += roundScore;
                ball.x = player1.x + player1.width;
                ball.y = player1.y * 1.5;
            }
        }
        //*--------- player2 -------->
        if (ball.x + ball.radius * 2 >= player2.x) {
            rtol = "left";
            if (ball.y + ball.radius < player2.y || ball.y + ball.radius > player2.y + player2.height) {
                //Todo: reset ball position
                ball.x = player2.x + ball.radius * 2;
                ball.y = player2.y * 1.5;
                player1.score += roundScore;
            }
        }

        //*---------- Finish the game ------------->
        if (player2.score < max && player1.score < max) {
            gameFlow(play);
        }
        else {
            player1.score > player2.score ? winner = player1Name : winner = player2Name
            gameOver();
        };
        draw();
    }
    movementAndScore();
}

function gameOver() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "red";
    ctx.font = "40px Georgia";
    ctx.fillText(`${winner} is The Winner`, 275, 190);
    ctx.fillStyle = "olive";
    ctx.fillText("Play Again", 305, 240);
    requestAnimationFrame(gameOver);
}