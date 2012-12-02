/*=============================================================================
#     FileName: main.js
#         Desc: 
#       Author: Zhiya Zang
#        Email: zangzhiya@gmail.com
#     HomePage: http://www.simpleapples.com
#      Version: 0.0.1
#   LastChange: 2012-11-22 16:04:32
#      History:
=============================================================================*/
GAMEHEIGHT = 900;
GAMEWIDTH = 640;
GAMEBLOCKH = 100;
GAMEBLOCKW = 100;
GAMEBOARDARR = new Array();
GAMESPEED = 20;
FRAMERATE = 25;
DIRCOUNT = 5;
DISCOUNT = 0;
BOARDCOUNT = 0;
TARGETPOSX = GAMEWIDTH / 2;
TARGETPOSY = GAMEHEIGHT * 0.3;
DIECOUNT = 0;
SCORE = 0;
START = 0;
function GAMEBOARD(x, y) {
    this.x = x;
    this.y = y;
}
imgCloud = new Image();
imgCloud.src = "img/cloudsmall.png";
imgBody = new Image();
imgBody.src = "img/jumpsmall.png";
function init() {
	GAMEHEIGHT = document.documentElement.clientHeight;
	GAMEWIDTH = document.documentElement.clientWidth;
	var title = document.getElementById("title");
	title.style.width = GAMEWIDTH + "px";
    var gameContent = document.getElementById("gamecontent");
    gameContent.height = GAMEHEIGHT; 
    gameContent.width = GAMEWIDTH;
    refreshBody();
    hideUrlBar();
}
function play() {
    console.log("start");
    interTimer = setInterval(refreshCanvas, 1000 / FRAMERATE);
}
function stop() {
    clearInterval(interTimer);
}
function addRanBoard() {
    var random = Math.random();
    random *= (GAMEWIDTH - GAMEBLOCKW);    //Get board initial position.
    var singleBoard = new GAMEBOARD(parseInt(random), 0);  //Create new board.
    GAMEBOARDARR.push(singleBoard);     //Add board to board array.
    //alert(GAMEBOARDARR[0].y);
}
function disScore() {
    var disscore = document.getElementById("disscore");
    disscore.innerHTML = "SCORE:" + SCORE + "</br> DEAD:" + DIECOUNT;
}
function refreshCanvas() {
    console.log(GAMEBOARDARR.length);
    if(DISCOUNT == 0) {
        if(GAMEBOARDARR.length > 0) {
            if(BOARDCOUNT == 0) {
                var random = Math.random();
                random *= 10;
                random = parseInt(random);
                //if(random != 5) {
                    addRanBoard();
                //}
                BOARDCOUNT = 10;
            } else {
                BOARDCOUNT--;
            }
            var i = 0;
            for(i = 0; i < GAMEBOARDARR.length; i++) {
                //alert(GAMEBOARDARR.length);
                GAMEBOARDARR[i].y += GAMESPEED;
                if(GAMEBOARDARR[i].y > GAMEHEIGHT) {
                    GAMEBOARDARR.shift();
                }
                console.log("x:" + GAMEBOARDARR[i].x + " y:" + GAMEBOARDARR[i].y);
            }
        } else {
            addRanBoard();
        }
        DISCOUNT = 2;
    } else {
        DISCOUNT--;
    }
    for(var i = 0; i < GAMEBOARDARR.length; i++) {
        document.getElementById("display").innerHTML = "JumpHeight:" + DIRCOUNT + "</br>JumpPositionY:" + TARGETPOSY + "</br>BoardCount:" + GAMEBOARDARR.length + "</br>FrameRate:" + FRAMERATE;    
        if(TARGETPOSY == GAMEBOARDARR[i].y && TARGETPOSX >= GAMEBOARDARR[i].x - GAMEBLOCKW && TARGETPOSX <= GAMEBOARDARR[i].x + GAMEBLOCKW&& DIRCOUNT == 0) {
            DIRCOUNT = 20; //score.
            SCORE += 1;
            document.getElementById("display").innerHTML = "ok";
        }
    }
    if(DIRCOUNT != 0) {
        /*
        if(DIRCOUNT == 20 || DIRCOUNT == 18 || DIRCOUNT == 15 || DIRCOUNT == 11 || DIRCOUNT == 6 || DIRCOUNT == 1) {
            TARGETPOSY -= GAMESPEED;
        }
        */
        TARGETPOSY -= GAMESPEED;
        if(TARGETPOSY < 20 * GAMESPEED) {
            for(i = 0; i < GAMEBOARDARR.length; i++) {
                //alert(GAMEBOARDARR.length);
                GAMEBOARDARR[i].y += GAMESPEED;
                if(GAMEBOARDARR[i].y > GAMEHEIGHT) {
                    GAMEBOARDARR.shift();
                }
                console.log("x:" + GAMEBOARDARR[i].x + " y:" + GAMEBOARDARR[i].y);
            }
        }
        DIRCOUNT--;
    } else {
        TARGETPOSY += GAMESPEED;
        if(TARGETPOSY > GAMEHEIGHT) {
            TARGETPOSY = 0; //die.
            DIECOUNT += 1;
        }
    }
    if(GAMEBOARDARR[0].y <= 20 * GAMESPEED && START == 0) {
        TARGETPOSY = 0;
        START = 1; 
    }
    drawBoard();
    drawBody();
    disScore();
}
function refreshBody() {
    var count = 0;
    if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation',function(event) {
            var rotate = event.gamma / 70 * GAMEWIDTH;
            TARGETPOSX = rotate + GAMEWIDTH / 2;
            if(TARGETPOSX < 0) {
                TARGETPOSX = 0;
            }
            if(TARGETPOSX > GAMEWIDTH - 100) {
                TARGETPOSX = GAMEWIDTH - 100;
            }
            if(TARGETPOSY > GAMEHEIGHT) {
                TARGETPOSY = 0;
            }
        })
    }
}
function drawBody() {
    var canvas = document.getElementById("gamecontent");
    var context = canvas.getContext("2d");
    context.drawImage(imgBody,TARGETPOSX,TARGETPOSY - GAMEBLOCKW);
}
function drawBoard() {
    var canvas = document.getElementById("gamecontent");
    var context = canvas.getContext("2d");
    context.beginPath();
    context.fillStyle = "#dbf1fe";
    context.fillRect(0, 0, GAMEWIDTH, GAMEHEIGHT);
    var i = 0;
    for(i = 0; i < GAMEBOARDARR.length; i++) {
        var canvas = document.getElementById("gamecontent");
        var context = canvas.getContext("2d");
        context.drawImage(imgCloud,GAMEBOARDARR[i].x, GAMEBOARDARR[i].y - GAMEBLOCKH / 2);
    }
    //context.lineWidth = 1;
    //context.strokeStyle = "#000";
    //context.globalCompositeOperation = copy;
    //context.stroke();
}
function hideUrlBar()
{
   window.scrollTo(0, 1);
}
