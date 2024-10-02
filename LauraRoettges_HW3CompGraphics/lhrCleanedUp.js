function setup() {
    var canvas = document.getElementById('myCanvas');
    var context = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    time = 0;
    var p0=[0,0];
	var d0=[1*(canvas.width/2),3*(canvas.height/2)];
	var p1=[1*(canvas.width/2),1*(canvas.height/2)];
	var d1=[-1*(canvas.width/2),3*(canvas.height/2)];
	var p2=[1.8*(canvas.width/2),1.8*(canvas.height/2)];
	var d2=[0*(canvas.width/2),3*(canvas.height/2)];
    var p3=[.5*(canvas.width/2),1.5*(canvas.height/2)];
    var d3 =[-2*(canvas.width/2),-1*(canvas.height/2)];
    var p4 = [.2*(canvas.width/2),0.3*(canvas.height/2)];
    var d4 = [2*(canvas.width/2),1*(canvas.height/2)];
    var p5 = [1.3*(canvas.width/2),0.5*(canvas.height/2)];
    var d5 = [.3*(canvas.width/2),-3*(canvas.height/2)];

    function draw(tParam,p0,d0,p1,d1,p2,d2,p3,d3,p4,d4,p5,d5) {
	canvas.width = canvas.width;
	
	function moveToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}

	function ellipseToTx(loc,Tx,scalor,theta) {
		var res=vec2.create();
		vec2.transformMat3(res,loc,Tx); 
		context.ellipse(res[0],res[1],8*scalor, 4*scalor, 0-theta, 0, 2*Math.PI,true); 
	}

	function beeFace(loc,Tx,scalor,theta){
		var res=vec2.create();
		vec2.transformMat3(res,loc,Tx); 
		context.ellipse(res[0],res[1],8*scalor, 4*scalor, 0-theta, Math.PI/3, 5*Math.PI/3,true);  
	}

	function beeButt(loc,Tx,scalor,theta){
		var res=vec2.create();
		vec2.transformMat3(res,loc,Tx); 
		context.ellipse(res[0],res[1],8*scalor, 4*scalor, 0-theta, 5*Math.PI/6, 7*Math.PI/6,false);  
	}
	
	function drawObject(color,Tx,scalor,theta) {
	    context.beginPath();
	    context.fillStyle = color;
	    ellipseToTx([0,0],Tx,scalor,theta);
	    //context.closePath();
	    context.stroke();
	    context.fill();
	    context.beginPath();
	    context.fillStyle = "black";
	    beeFace([0,0],Tx,scalor,theta);
	    context.closePath();
	    context.stroke();
	    context.fill();
	    context.beginPath();
	    context.fillStyle = "black";
	    beeButt([0,0],Tx,scalor,theta);
	    context.closePath();
	    context.stroke();
	    context.fill();
	    context.beginPath();
	    context.strokeStyle = "black"
	    moveToTx([0,4*scalor],Tx)
	    lineToTx([0,-4*scalor],Tx)
	    context.stroke();
	    var hofln = Math.sqrt(16*scalor*scalor*(1-(4*scalor*scalor)/(64*scalor*scalor)))
	    context.beginPath();
	    context.strokeStyle = "black"
	    moveToTx([2*scalor,hofln],Tx)
	    lineToTx([2*scalor,-hofln],Tx)
	    context.stroke();
	    context.beginPath();
	    context.strokeStyle = "black"
	    moveToTx([-2*scalor,hofln],Tx)
	    lineToTx([-2*scalor,-hofln],Tx)
	    context.stroke();
	    context.beginPath();
	    context.strokeStyle = "black"
	    moveToTx([-8*scalor,0],Tx)
	    lineToTx([-12*scalor,0],Tx)
	    context.stroke();
	}

	function drawWings(color,Tx) {
		context.globalAlpha = 0.2;
		context.beginPath();
	    context.strokeStyle = color;
	    moveToTx([0,0],Tx);
	    lineToTx([7,0],Tx);
	    lineToTx([10,1],Tx);
	    lineToTx([14,3],Tx);
	    lineToTx([15,5],Tx);
	    lineToTx([14,6],Tx);
	    lineToTx([9,8],Tx);
	    lineToTx([6,8],Tx);
	    lineToTx([4,5],Tx);
	    lineToTx([3,3],Tx);
	    lineToTx([0,0],Tx);
	    context.closePath();
	    context.stroke();
	    context.fill();
	    context.globalAlpha = 1;
	}

		function drawAxes(color,Tx) {
	    context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([120,0],Tx);lineToTx([0,0],Tx);lineToTx([0,120],Tx);
	    // Arrowheads
	    moveToTx([110,5],Tx);lineToTx([120,0],Tx);lineToTx([110,-5],Tx);
	    moveToTx([5,110],Tx);lineToTx([0,120],Tx);lineToTx([-5,110],Tx);
	    // X-label
	    moveToTx([130,0],Tx);lineToTx([140,10],Tx);
	    moveToTx([130,10],Tx);lineToTx([140,0],Tx);
	    context.stroke();
	}
	function drawAxes1unit(color,Tx) {
	    context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([1.20,0],Tx);lineToTx([0,0],Tx);lineToTx([0,1.20],Tx);
	    // Arrowheads
	    moveToTx([1.10,.05],Tx);lineToTx([1.20,0],Tx);lineToTx([1.10,-.05],Tx);
	    moveToTx([.05,1.10],Tx);lineToTx([0,1.20],Tx);lineToTx([-.05,1.10],Tx);
	    // X-label
	    moveToTx([1.30,0],Tx);lineToTx([1.40,.10],Tx);
	    moveToTx([1.30,.10],Tx);lineToTx([1.40,0],Tx);
	    context.stroke();
	}

	var Hermite = function(t) {
	    return [
		2*t*t*t-3*t*t+1,
		t*t*t-2*t*t+t,
		-2*t*t*t+3*t*t,
		t*t*t-t*t
	    ];
	}

	var TangentHermite = function(t) {
		return [
			6*Math.pow(t,2)-6*t,
			3*Math.pow(t,2)-4*t+1,
			-6*Math.pow(t,2)+6*t,
			3*Math.pow(t,2)-2*t
			];
	}

	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec2.create();
	    vec2.scale(result,P[0],b[0]);
	    vec2.scaleAndAdd(result,result,P[1],b[1]);
	    vec2.scaleAndAdd(result,result,P[2],b[2]);
	    vec2.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}

	var P0 = [p0,d0,p1,d1]; // First two points and tangents
	var P1 = [p1,d1,p2,d2]; // mid two points and tangents
    var P2 = [p2,d2,p3,d3]; // ... 
    var P3 = [p3,d3,p4,d4]; 
    var P4 = [p4,d4,p5,d5];

	var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
	var C1 = function(t_) {return Cubic(Hermite,P1,t_);};
    var C2 = function(t_) {return Cubic(Hermite,P2,t_);};
    var C3 = function(t_) {return Cubic(Hermite,P3,t_);};
    var C4 = function(t_) {return Cubic(Hermite,P4,t_);};

	var Ctang0 = function(t_) {return Cubic(TangentHermite,P0,t_);};
	var Ctang1 = function(t_) {return Cubic(TangentHermite,P1,t_);};
    var Ctang2 = function(t_) {return Cubic(TangentHermite,P2,t_);};
    var Ctang3 = function(t_) {return Cubic(TangentHermite,P3,t_);};
    var Ctang4 = function(t_) {return Cubic(TangentHermite,P4,t_);};


    var Ccomp = function(t) {
        if (t<1){
            var u = t;
            return C0(u);
        } else if (t >= 1 && t<= 2){
            var u = t-1.0;
            return C1(u);
        } else if (t >= 2 && t <= 3){
          var u = t-2;
          return C2(u);
        } else if (t >=3 && t <= 4){
          var u = t-3;
          return C3(u);
        } else {
          var u =t-4;
          return C4(u);
        }
	}
	var Ctangent = function(t) {
        if (t<1){
            var u = t;
            return Ctang0(u);
        } else if (t >= 1 && t<= 2){
            var u = t-1.0;
            return Ctang1(u);
        } else if (t >= 2 && t <= 3){
          var u = t-2;
          return Ctang2(u);
        } else if (t >=3 && t <= 4){
          var u = t-3;
          return Ctang3(u);
        } else {
          var u =t-4;
          return Ctang4(u);
        }	
	}

	function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
				var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
				lineToTx(C(t),Tx);
            }
            context.stroke();
	}

	var Tbase_to_canvas = mat3.create();
	mat3.fromTranslation(Tbase_to_canvas,[0,canvas.height]); //move to bottom left
	mat3.scale(Tbase_to_canvas,Tbase_to_canvas,[1,-1]); // Flip the Y-axis
	//drawAxes("blue",Tbase_to_canvas);

	//drawTrajectory(0.0,5.0,100,Ccomp,Tbase_to_canvas,"red");
	


	var Tbee_to_base = mat3.create();
	mat3.fromTranslation(Tbee_to_base,Ccomp(tParam));
	var tangent = Ctangent(tParam);
	var angle = Math.atan2(tangent[1],tangent[0]);
	mat3.rotate(Tbee_to_base,Tbee_to_base,angle);
	var Tbee_to_canvas = mat3.create();
	mat3.multiply(Tbee_to_canvas, Tbase_to_canvas, Tbee_to_base);
	//drawAxes("green",Tbee_to_canvas); // Un-comment this to view axes
	drawObject("yellow",Tbee_to_canvas,2+(tParam),angle);
	
	if (Math.round(tParam*20) % 2 ==0) {
		var degrees1=70;
		var degrees2=20;
	} else {
		var degrees1 = 80;
		var degrees2 = 40;
	}


	var Twings_to_bee = mat3.create();
	mat3.copy(Twings_to_bee,Tbee_to_canvas);
	mat3.rotate(Twings_to_bee,Twings_to_bee,degrees1*Math.PI/180)
	mat3.scale(Twings_to_bee,Twings_to_bee,[1+(tParam),1+(tParam)])
	//drawAxes("orange",Twings_to_bee);
	drawWings("blue",Twings_to_bee);
	drawObject("yellow",Tbee_to_canvas,2+(tParam),angle);
	var Twing_to_wing = mat3.create();
	mat3.copy(Twing_to_wing,Twings_to_bee);
	mat3.rotate(Twing_to_wing,Twing_to_wing,degrees2*Math.PI/180)
	drawWings("blue",Twing_to_wing);

    }
    
    
    function update(time,p0,d0,p1,d1,p2,d2,p3,d3,p4,d4,p5,d5) {
    	draw(time,p0,d0,p1,d1,p2,d2,p3,d3,p4,d4,p5,d5);
    }

    function moveBee() {
    	requestAnimationFrame(moveBee);
    	if (time > 8) {time = 0;
    		p0=[0,Math.random()*canvas.height/2];
    		p2=[(2*(Math.random()-.5)+.2)*(canvas.width/2),2*(Math.random()-.5)*(canvas.height/2)];
		    d5 = [3*(Math.random()+1)*(canvas.width/2),-4*((Math.random()-.5))*(canvas.height/2)];
    	}
    	time = time + 0.01;
    	update(time,p0,d0,p1,d1,p2,d2,p3,d3,p4,d4,p5,d5);
    }
    moveBee();
}
window.onload = setup;
