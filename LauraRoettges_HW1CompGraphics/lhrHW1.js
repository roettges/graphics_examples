function setup() { "use strict";
  var canvas = document.getElementById('myCanvas');
  var sliderWindow = document.getElementById('sliderWindow');
  sliderWindow.value = 0;

  var pi = Math.PI

  function drawW() {
    var context = canvas.getContext('2d');
    canvas.width = canvas.width;
    // use the sliders to get various parameters
    var dx = sliderWindow.value;
    var dy = sliderWindow.value;


    //rgb 255 is max
    function WindowColor() {
      var redRg = 10;
      var grnRg=150;
      var bluRg=255;
      var redSeg=600/redRg;
      var grnSeg=600/grnRg;
      var bluSeg=Math.round(600/255);
      var blueStart=250;
      var greenStart=150;
      var redStart=0;
      if (sliderWindow.value/bluSeg>=255) {
        var blue=blueStart-255;
      } else {
        var blue=blueStart-Math.round(sliderWindow.value/bluSeg);
      }
      var green = greenStart-Math.round(sliderWindow.value/grnSeg);
      var red = redStart+Math.round(sliderWindow.value/redSeg);
      var windClr = 'rgb(' + red + ',' + green + ',' + blue + ')';
      return windClr
    }

    function DrawWindowfill() {
      context.beginPath();
      context.fillStyle = WindowColor()
      context.lineWidth = 1;
      context.moveTo(175,50);
      context.lineTo(475,50);
      context.lineTo(475,320);
      context.lineTo(175,320);
      context.lineTo(175,50);
      context.lineWidth = 1;
      context.closePath();
      //context.strokeStyle = color
      context.stroke();
      context.fill();
      context.clip();      
    }
    function DrawWindowshape(color) {
      //context.restore()
      context.beginPath();
      //context.fillStyle = color;
      context.moveTo(165,40);
      context.lineTo(485,40);
      context.lineTo(485,330);
      context.lineTo(165,330);
      context.lineTo(165,40);
      context.lineWidth = 20;
      context.closePath();
      context.strokeStyle = color
      context.stroke()     
    }

    function wLatch(color) {
      context.beginPath();
      //context.fillStyle = color;
      context.moveTo(165,120);
      context.lineTo(485,120);
      context.lineWidth = 20;
      context.strokeStyle = color;
      context.stroke()
    }

    function drawSunMoon() {
      //draw sun
      context.beginPath();
      context.arc(240,80,45,0,2*pi);
      context.fillStyle = 'rgb(205,222,24)';
      context.strokeStyle = 'rgb(252,139,78)';
      context.lineWidth = 5;
      context.closePath();
      context.stroke();
      context.fill();

      //draw moon
      context.beginPath();
      context.arc(320,-220,45,pi/2,1.5*pi,1);
      context.moveTo(320, -265);
      context.bezierCurveTo(340, -240, 340, -200, 320, -175)
      context.fillStyle = 'rgb(195,207,227)';
      context.strokeStyle = 'rgb(230,231,232)';
      context.lineWidth = 1;
      context.lineJoin = "round";
      //context.closePath()
      context.stroke();
      context.fill();
      //context.clip();
    }

    function drawRays() {
      context.beginPath();
      //240,80 center
      context.strokeStyle = 'rgb(205,222,24))';
      context.lineWidth = 4;
      context.moveTo(40,40);
      context.lineTo(70,70);
      context.stroke();
    }

    function chairStart() {
      context.beginPath();
      context.moveTo(10, 30);
      context.lineTo(70,20);
      context.lineTo(70,93);
      context.lineTo(10,73);
      context.lineTo(10,60);
      context.lineWidth = 3;
      context.lineJoin = "round";
      context.fillStyle = 'rgb(38,52,74)';
      context.closePath();
      context.stroke();
      context.fill();
      //bottom of seat
      context.beginPath();
      context.moveTo(8, 75);
      context.lineTo(70,95);
      context.lineTo(-10,110);
      context.lineTo(-43,83);
      context.lineTo(8,75);
      context.closePath();
      context.stroke();
      context.fill();
      //legs
      context.beginPath();
      context.moveTo(-43, 83);
      context.lineTo(-10,110);
      context.lineTo(-5,160);
      context.lineTo(-40,115);
      context.lineTo(-43,83);
      context.stroke();
      context.fill();
    }

    function chairEnd() {
      context.beginPath();
      context.moveTo(0,0);
      context.lineTo(0,200);
      context.lineTo(137,200)
      context.lineTo(0,0);
      context.fillStyle='rgb(153,173,135)'
      context.strokeStyle = 'rgb(74,52,42))';
      context.lineWidth = 2;
      context.closePath()
      context.stroke();
      context.fill();
    }

    function chairBack() {
      context.beginPath();
      context.moveTo(0,5);
      context.lineTo(0,300);
      context.lineTo(-70,250)
      context.lineTo(0,5)
      context.fillStyle='rgb(153,173,135)'
      context.strokeStyle = 'rgb(74,52,42))';
      context.lineWidth = 2;
      context.closePath()
      context.stroke();
      context.fill();
      context.beginPath();
      context.moveTo(-10,0);
      context.lineTo(4,2);
      context.lineTo(257,8);
      context.lineTo(253,6);
      context.lineTo(-10,0);
      context.stroke();
      context.fill();
      //
      context.beginPath();
      context.moveTo(-45,145);
      context.lineTo(-75,245);
      context.lineTo(-140,200);
      context.lineTo(-100,140);
      context.lineTo(-45,145);
      context.stroke();
      context.fill();

      //cushion
      context.beginPath();
      context.lineJoin = "round";
      context.fillStyle = 'rgb(38,52,74)';
      context.moveTo(-3,4);
      context.bezierCurveTo(-10, 20, -30, 60, -38, 130)
      context.lineTo(-3,4);
      context.closePath()
      context.stroke();
      context.fill();
      //
      context.beginPath();
      context.moveTo(-38,130);
      context.bezierCurveTo(-80, 100, -100, 100, -100, 138)
      context.lineTo(-40,145)
      context.lineTo(-38,130);
      context.moveTo(-82,108);
      context.lineTo(-40,112)
      context.lineTo(-38,130)
      context.closePath()
      context.stroke();
      context.fill();

    }
    function Shadow() {
      context.globalAlpha = .0 + (sliderWindow.value/1500)
      context.beginPath()
      context.fillStyle ='rgb(7,56,53)'
      context.rect(-625, 0, 1450, 800)
      context.fill()
    }

    function ground() {
      context.beginPath()
      context.fillStyle ='rgb(54,4,31)'
      context.rect(0,400,800,300)
      context.fill()
      context.beginPath()
      context.fillStyle ='rgb(54,4,31)'
      context.moveTo(0,600)
      context.lineTo(-600,600)
      context.lineTo(-600,290)
      context.lineTo(0,390)
      context.closePath()
      context.fill()

    }
 
 
    var windFrameRGB = 'rgb(22,32,41)'


  
//draw window
    context.save(); //before this is the original canvas
    context.translate(dx,0);
    DrawWindowshape(windFrameRGB);
    DrawWindowfill();
    context.translate(0,dy);
//draw stuff in window
    drawSunMoon();
    context.save(); // dx dy
    context.restore(); //OG
    context.translate(240,80)
    for (let k = 0; k<9; k++ ) {
      context.rotate(pi/4);
      drawRays()
    }
    context.restore(); //back to OG canvas 
    context.translate(dx,0); //moving with slider
    wLatch(windFrameRGB);
    context.save();//dx movement
    context.restore();//back to OG canvas
    context.save(); //resave og canvas
    ground()
//draw 1st row of chairs
    for (let i = 0; i < 1; i++) {
      context.save();
      context.rotate(.1*pi);
      context.translate(600-i*900,100+i*294);
      context.scale(.8,1.2);
      chairStart();
      context.scale(1.5,1.8);
      context.translate(40,-20);
      chairStart();
      context.scale(1.5,1.8);
      context.translate(40,-20);
      chairStart();
      context.translate(73,19)
      chairEnd();
      context.restore();
    }
    context.restore();
    for (let i = 0; i < 1; i++) {
      context.save();
      context.scale(-1, 1)
      context.rotate(.1*pi);
      context.translate(-10+i*400,300-70*i)
      context.scale(.8,1.2);
      chairStart();
      context.scale(1.5,1.8);
      context.translate(40,-20);
      chairStart();
      context.scale(1.5,1.8);
      context.translate(40,-20);
      chairStart();
      context.translate(73,19)
      chairEnd()
      context.restore();
    }
    context.save()
    context.translate(-153,310);
    chairBack()
    context.restore();
    context.save();
    context.translate(790,305)
    context.scale(-1,1)
    chairBack()
    context.restore()
    Shadow()
  }


  sliderWindow.addEventListener("input",drawW);
  drawW();

}

window.onload = setup;


