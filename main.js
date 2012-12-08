/*=============================================================================
#     FileName: main.js
#         Desc: 
#       Author: Zhiya Zang
#        Email: zangzhiya@gmail.com
#     HomePage: http://www.simpleapples.com
#      Version: 0.1.0
#   LastChange: 2012-12-08 12:57:25
#      History:
=============================================================================*/
var CJ = {};
CJ.GAMEHEIGHT = 900;
CJ.GAMEWIDTH = 640;
CJ.GAMEBLOCKH = 100;
CJ.GAMEBLOCKW = 100;
CJ.GAMEBOARDARR = new Array();
CJ.GAMESPEED = 20;
CJ.FRAMERATE = 25;
CJ.DIRCOUNT = 15;
CJ.DISCOUNT = 0;
CJ.BOARDCOUNT = 0;
CJ.TARGETPOSX = CJ.GAMEWIDTH / 2;
CJ.TARGETPOSY = CJ.GAMEHEIGHT * 0.3;
CJ.DIECOUNT = 0;
CJ.SCORE = 0;
CJ.START = 0;
CJ.GAMEBOARD = function (x, y) {
    this.x = x;
    this.y = y;
}
CJ.IMGCLOUD = new Image();
CJ.IMGCLOUD.src = "img/cloudsmall.png";
CJ.IMGBODY = new Image();
CJ.IMGBODY.src = "img/jumpsmall.png";
function init() {
	var title = document.getElementById("title"),
        gameContent = document.getElementById("gamecontent");
	CJ.GAMEHEIGHT = document.documentElement.clientHeight;
	CJ.GAMEWIDTH = document.documentElement.clientWidth;
	title.style.width = CJ.GAMEWIDTH + "px";
    gameContent.height = CJ.GAMEHEIGHT; 
    gameContent.width = CJ.GAMEWIDTH;
    refreshBody();
    hideUrlBar();
}
function play() {
    interTimer = setInterval(refreshCanvas, 1000 / CJ.FRAMERATE);
}
function stop() {
    clearInterval(interTimer);
}
function addRanBoard() {
    var random = Math.random(),
        singleBoard;
    random *= (CJ.GAMEWIDTH - CJ.GAMEBLOCKW);    //Get board initial position.
    singleBoard = new CJ.GAMEBOARD(parseInt(random), 0);  //Create new board.
    CJ.GAMEBOARDARR.push(singleBoard);     //Add board to board array.
}
function disScore() {
    var disscore = document.getElementById("disscore");
    disscore.innerHTML = "SCORE:" + CJ.SCORE + "</br> DEAD:" + CJ.DIECOUNT;
}
function refreshCanvas() {
    var random,
        i;
    if(CJ.DISCOUNT == 0) {
        if(CJ.GAMEBOARDARR.length > 0) {
            if(CJ.BOARDCOUNT == 0) {
                random = Math.random();
                random *= 10;
                random = parseInt(random);
                addRanBoard();
                CJ.BOARDCOUNT = 3; // board span
            } else {
                CJ.BOARDCOUNT--;
            }
            for(i = 0; i < CJ.GAMEBOARDARR.length; i++) {
                CJ.GAMEBOARDARR[i].y += CJ.GAMESPEED;
                if(CJ.GAMEBOARDARR[i].y > CJ.GAMEHEIGHT) {
                    CJ.GAMEBOARDARR.shift();
                }
            }
        } else {
            addRanBoard();
        }
        CJ.DISCOUNT = 2;
    } else {
        CJ.DISCOUNT--;
    }
    for(i = 0; i < CJ.GAMEBOARDARR.length; i++) {
        document.getElementById("display").innerHTML = "JumpHeight:" + CJ.DIRCOUNT + "</br>JumpPositionY:" + CJ.TARGETPOSY + "</br>BoardCount:" + CJ.GAMEBOARDARR.length + "</br>FrameRate:" + CJ.FRAMERATE;    
        if(CJ.TARGETPOSY == CJ.GAMEBOARDARR[i].y && CJ.TARGETPOSX >= CJ.GAMEBOARDARR[i].x - CJ.GAMEBLOCKW && CJ.TARGETPOSX <= CJ.GAMEBOARDARR[i].x + CJ.GAMEBLOCKW && CJ.DIRCOUNT == 0) {
            CJ.DIRCOUNT = 15; //score.
            CJ.SCORE += 1;
            document.getElementById("display").innerHTML = "ok";
        }
    }
    if(CJ.DIRCOUNT != 0) {
        CJ.TARGETPOSY -= CJ.GAMESPEED;
        if(CJ.TARGETPOSY < 15 * CJ.GAMESPEED) {
            for(i = 0; i < CJ.GAMEBOARDARR.length; i++) {
                CJ.GAMEBOARDARR[i].y += CJ.GAMESPEED;
                if(CJ.GAMEBOARDARR[i].y > CJ.GAMEHEIGHT) {
                    CJ.GAMEBOARDARR.shift();
                }
            }
        }
        CJ.DIRCOUNT--;
    } else {
        CJ.TARGETPOSY += CJ.GAMESPEED;
        if(CJ.TARGETPOSY > CJ.GAMEHEIGHT) {
            CJ.TARGETPOSY = 0; //die.
            CJ.DIECOUNT += 1;
        }
    }
    if(CJ.GAMEBOARDARR[0].y <= 15 * CJ.GAMESPEED && CJ.START == 0) {
        CJ.TARGETPOSY = 0;
        CJ.START = 1; 
    }
    drawBoard();
    drawBody();
    disScore();
}
function refreshBody() {
    var count = 0,
        rotate;
    if(window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation',function(event) {
            rotate = event.gamma / 70 * CJ.GAMEWIDTH;
            CJ.TARGETPOSX = rotate + CJ.GAMEWIDTH / 2;
            if(CJ.TARGETPOSX < 0) {
                CJ.TARGETPOSX = 0;
            }
            if(CJ.TARGETPOSX > CJ.GAMEWIDTH - 100) {
                CJ.TARGETPOSX = CJ.GAMEWIDTH - 100;
            }
            if(CJ.TARGETPOSY > CJ.GAMEHEIGHT) {
                CJ.TARGETPOSY = 0;
            }
        })
    }
}
function drawBody() {
    var canvas = document.getElementById("gamecontent"),
        context = canvas.getContext("2d");
    context.drawImage(CJ.IMGBODY, CJ.TARGETPOSX, CJ.TARGETPOSY - CJ.GAMEBLOCKW);
}
function drawBoard() {
    var canvas = document.getElementById("gamecontent"),
        context = canvas.getContext("2d"),
        i,
        canvas,
        context;
    context.beginPath();
    context.fillStyle = "#dbf1fe";
    context.fillRect(0, 0, CJ.GAMEWIDTH, CJ.GAMEHEIGHT);
    for(i = 0; i < CJ.GAMEBOARDARR.length; i++) {
        canvas = document.getElementById("gamecontent");
        context = canvas.getContext("2d");
        context.drawImage(CJ.IMGCLOUD, CJ.GAMEBOARDARR[i].x, CJ.GAMEBOARDARR[i].y - CJ.GAMEBLOCKH / 2);
    }
}
function hideUrlBar()
{
   window.scrollTo(0, 1);
}
