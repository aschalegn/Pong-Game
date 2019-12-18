let canvas = document.getElementById('canvas');
function Block(x, y, width, height, score) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.score = score
}
//*----------- Ball ------->
function Ball(x, y, radius, sEngle, eEngle) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.sEngle = sEngle;
    this.eEngle = eEngle;
}

//*-------- Global Vars ----->
let ctx = canvas.getContext('2d');
let board = ctx.fillRect(0, 0, 800, 400);
let player1 = new Block(2, 150, 5, 100, 0);
let player2 = new Block(793, 150, 5, 100, 0);
let ball = new Ball(400, 200, 10, 0, 9 * Math.PI, []);
let speed = 40;
let starter = Math.floor((Math.random() * 2) + 1);
let rtol = '';
let ttob = '';

//*-------- Define who is starting --------->
starter === 1 ? ball.x = player1.x + 15 : ball.x = player2.x - 11
//! Draw the Board
function draw() {
    ctx.fillStyle = "black";
    ctx.fillStyle = "white";
    //*------- Drawing Players ------->
    ctx.fillRect(player1.x, player1.y, player1.width, player1.height);
    ctx.fillRect(player2.x, player2.y, player2.width, player2.height);
    //*------ Drawing Ball ------>
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, ball.sEngle, ball.eEngle);
    ctx.fill();
    ctx.closePath();
    //*----- Drawing Deviders ----->
    let divider = new Block(400, 10, 5, 50);
    let divider1 = new Block(400, 90, 5, 50);
    let divider2 = new Block(400, 170, 5, 50);
    let divider3 = new Block(400, 250, 5, 50);
    let divider4 = new Block(400, 330, 5, 50);
    ctx.fillRect(divider.x, divider.y, divider.width, divider.height);
    ctx.fillRect(divider1.x, divider1.y, divider1.width, divider1.height);
    ctx.fillRect(divider2.x, divider2.y, divider2.width, divider2.height);
    ctx.fillRect(divider3.x, divider3.y, divider3.width, divider3.height);
    ctx.fillRect(divider4.x, divider4.y, divider4.width, divider4.height);
}
draw();

//! Movement
function play() {
    window.addEventListener('keydown', (e) => {
        //! Player2 movement
        if (e.keyCode === 38) {
            if (player2.y > 19) { player2.y -= speed }
        }
        if (e.keyCode === 40) {
            if (player2.y < 292) { player2.y += speed }
        }
        //! Player1 movement
        if (e.keyCode === 87) {
            if (player1.y > 9) { player1.y -= speed }
        }
        if (e.keyCode === 83) {
            if (player1.y < 292) { player1.y += speed }
        }
        ctx.clearRect(0, 0, 800, 400);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, 800, 400);
        draw();
    });

    //*------- ball movement-------- >
    setInterval(() => {
        ctx.clearRect((ball.x) - ball.radius, (ball.y) - ball.radius, (ball.radius) * 2, (ball.radius) * 2);
        ctx.fillStyle = "black";
        ctx.fillRect((ball.x) - ball.radius, (ball.y) - ball.radius, (ball.radius) * 2, (ball.radius) * 2);
        //! detect if hit the player bet **Done partialy**
        //*-------------- player1 ------------>
        if (ball.x <= player1.x + 15) {
            ball.x += speed;
            rtol = "right";
            if (ball.y < player1.y || ball.y > player1.y + player1.height) {
                //Todo: reset ball position
                player2.score += 15;
                ball.x = player1.x + 15;
            }
        }
        //*--------- player2 -------->
        if (ball.x + 11 >= player2.x) {
            ball.x -= speed;
            rtol = "left";
            if (ball.y < player2.y || ball.y > player2.y + player2.height) {
                //Todo: reset ball position
                player1.score += 15;
                ball.x = player2.x - 11;
            }
        }
        //! continuosly movement rightToLeft
        if (rtol == 'right') { ball.x += speed; }
        else { ball.x -= speed; }
        //! Detect Collapse inthe top and bottom top and bottom
        if (ball.y - ball.radius <= 0) { ttob = 'top' } //collapse on top
        if (ball.y + ball.radius >= 400) { ttob = 'bottom' } //collapse on bottom
        //! continuosly movement topToBottom
        if (ttob === 'top') { ball.y += speed / 2 }
        else { ball.y -= speed / 2 }
        draw();
    }, 100);
}


//*------------- The game starts after 1.5 Seconds ------------->
setTimeout(() => {
    play();
}, 1500)



