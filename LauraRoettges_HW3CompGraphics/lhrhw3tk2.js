function setup() {
    var canvas = document.getElementById('myCanvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    var context = canvas.getContext('2d');
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;

    function moveToTx(loc,Tx)
    {var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);} // reusing professors initial move to and line to functions to get x,y based on the passed in stack aka Tx

    function lineToTx(loc,Tx)
    {var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}

    function ellipseToTx(loc,Tx,scalor,theta,start_ang,end_ang) {
        var res=vec2.create();
        vec2.transformMat3(res,loc,Tx); 
        context.ellipse(res[0],res[1],8*scalor, 4*scalor, 0-theta, start_ang, end_ang,true);
    } //ellipses with canvas don't like to scale when we scale the stack so I have to do this manually by scaling the height/width of the elipse and I am passing in drawing from/to angles to make this reusable

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

    /*class Hive {
        constructor () {

        }
    }*/


    function Bee(controlP, bigP, basis, tangentBasis, moveToTx, lineToTx, ellipseToTx) {
        this.controlP = controlP;
        this.bigP = bigP,
        this.basis = basis;
        this.tangentBasis = tangentBasis;
        this.moveToTx = moveToTx;
        this.lineToTx = lineToTx;
        this.ellipseToTx =ellipseToTx;


       this.drawBeeBod = function(color, Tx, scalor, theta) {
            //body shape
            context.beginPath();
            context.fillStyle = color;
            ellipseToTx([0,0],Tx,scalor,theta,0,2*Math.PI);
            context.closePath();
            context.stroke();
            context.fill();
            context.beginPath();
            context.fillStyle = "black";
            beeFace([0,0],Tx,scalor,theta,Math.PI/3,5*Math.PI/3); //face
            context.closePath();
            context.stroke();
            context.fill();
            context.beginPath();
            beeButt([0,0],Tx,scalor,theta,7*Math.PI/6,5*Math.PI/6); //butt
            context.closePath();
            context.stroke();
            context.fill();
            //stripes
            context.beginPath();
            context.lineWidth = 1*scalor;
            moveToTx([0,4*scalor],Tx);
            lineToTx([0,-4*scalor],Tx);
            context.stroke();
            const hofln = Math.sqrt(16*scalor*scalor*(1-(4*scalor*scalor)/(64*scalor*scalor))); //height of line
            context.beginPath();
            moveToTx([2*scalor,hofln],Tx);
            lineToTx([2*scalor,-hofln],Tx);
            context.stroke();
            context.beginPath();
            moveToTx([-2*scalor,hofln],Tx);
            lineToTx([-2*scalor,-hofln],Tx);
            context.stroke();
            //stinger
            context.beginPath();
            moveToTx([-8*scalor,0],Tx);
            lineToTx([-12*scalor,0],Tx);
            context.stroke();

        } //end draw bee body

        this.drawWings = function(color, Tx) {
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
        } // end draw Wings

        this.moveBee = function() {
            this.drawBeeBod();
            this.drawWings();

        } //end move Bee

        this.flapWings=function() {

        }//end flap wings

    } // end Bee
    
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

    function generateBigP(controlary) {
            var bigP=[];
            console.log(controlary.length);
            for (let i=0; i < controlary.length-3; i+=2) {
                var big_p_next = [controlary[i],controlary[i+1],controlary[i+2],controlary[i+3]];
                bigP.push(big_p_next);
            }
            return bigP;
            console.log('BigP: at creation' +bigP)
        } // return P matrix should ensure C1 continuity with Hermite

    var bees = []
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
        var testing = [p0,d0,p1,d1,p2,d2,p3,d3,p4,d4,p5,d5]
        var testtest = []
        testtest.push(generateBigP(testing));
        bees.push(new Bee(testing,testtest,Hermite,TangentHermite,moveToTx,lineToTx,ellipseToTx));
    
    for (let j=1; j < 2; j++) {
        //randomly generated set of control points unique to each bee
        var controls = [];
        var p0 = [0,0];
        controls.push(p0)
        for (let i=0; i < 14; i++) {
            var pnext=[((Math.random()-.5)*canvas.width),((Math.random()-.5)*canvas.width)]
            controls.push(pnext)
        }
        var plast = [((Math.random()-.5)*2*canvas.width),((Math.random()-.5)*2*canvas.width)]
        controls.push(plast);
        console.log(controls);
        var pMatrices = generateBigP(controls);

        bees.push(new Bee(controls,pMatrices,Hermite,TangentHermite,moveToTx,lineToTx,ellipseToTx))
    }

    function Cubic(B,pset,t) {
        console.log('pset: '+pset);
        console.log('pset[0]: '+pset[0]);
        console.log('pset[1]: '+pset[1]);
        console.log('pset[2]: ' +pset[2]);
        console.log('pset[3]: '+pset[3]);
        var b = B(t);
        console.log('what is B:'+b)
        console.log('b of 0: ' +b[0])
        console.log('b of 1: ' +b[1])
        console.log('b of 2: ' +b[2])
        console.log('b of 3: ' +b[3])
        console.log('pset o of o:' +pset[0][0])
        console.log('pset o of o:' +pset[0][1])
        console.log('pset o of o:' +pset[1][0])
        console.log('pset o of o:' +pset[1][1])
        console.log('pset o of o:' +pset[1][1])
        console.log('pset o of o:' +pset[2][0])
        console.log('pset o of o:' +pset[2][1])
        console.log('pset o of o:' +pset[3][0])
        console.log('pset o of o:' +pset[3][1])
        var result=vec2.create();
        vec2.scale(result,[pset[0][0],pset[0][1]],b[0]); //1st point
        vec2.scaleAndAdd(result,result,[pset[1][0],pset[1][1]],b[1]); //1st deriv
        vec2.scaleAndAdd(result,result,[pset[2][0],pset[2][1]],b[2]); //2nd point 
        vec2.scaleAndAdd(result,result,[pset[3][0],pset[3][1]],b[3]); //2nd deriv
        return result;
        }

  
    var generatePiecewiseC = function(B,i,t) {
            console.log('what is i: ' +i)
            console.log('what is bgP now:' + bees[0].bigP[0][i-1])
            //B in my example will be either the basis or the tangent basis (trying to make this reusable
            var piecewiseC =(Cubic(B,bees[0].bigP[i-1][i-1],t)); //bigP[0][i] is a set of 4 sets of 2: 2 points/2 tangents
            console.log('WHAT IS C LOOK AT ME:' + piecewiseC)
            return piecewiseC;
        }

    var compRestraintCPath = function(B,t) {
            for (let j=1; j <= bees[0].bigP[0].length; j +=1) {
                console.log('IS j INCREMENTING AT ALL?: ' +j + 'length?: ' +bees[0].bigP[0].length)
                if (t<j) {
                    var u = t-(j-1);
                    var pieceC=generatePiecewiseC(B,j,u);
                    //var pieceC = function(u){Cubic(B,bees[0].bigP[0][i-1],u)};
                    console.log('GRRRRrRRRRRRRRRRRR: ' + pieceC)
                        //function(B,t){Cubic(B,bees[0].bigP[0][i-1],t)})
                    return pieceC;
                    //return generatePiecewiseC(B,i,u);
                } else {
                    var u = t-(bees[0].bigP[0].length-1);
                    var pieceC = function(u){Cubic(B,bees[0].bigP[0][j-1],u)};
                    console.log('AHHHHHHH: ' + pieceC);
                        //function(B,t){Cubic(B,bees[0].bigP[0][i-1],t)})
                    return pieceC;
                    //return generatePiecewiseC(B,i,u); //need to come back and edit this and just get the drawing to disapear ideally
                } //end else   
            } //end for
        } 

    function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
            context.strokeStyle=color;
            context.beginPath();
            moveToTx(compRestraintCPath(Hermite,t_begin),Tx);
            for(var i=1;i<=intervals;i++){
                var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
                lineToTx(compRestraintCPath(Hermite,t),Tx);
            }
            context.stroke();
        };
    console.log('My Bee: ' + bees[0])
    console.log(bees[0].bigP)
    var p=bees[0].bigP;
    //p.push(bees[0].bigP)
    console.log('P:' + p);
    console.log(bees[0].bigP[0].length)
    console.log('here: '+ p[0][0]);
  

    var Tbase_to_canvas = mat3.create();
    mat3.fromTranslation(Tbase_to_canvas,[0,canvas.height]); //move to bottom left
    mat3.scale(Tbase_to_canvas,Tbase_to_canvas,[1,-1]); // Flip the Y-axis
    drawAxes("blue",Tbase_to_canvas);
    drawTrajectory(0.0,1.0,100,compRestraintCPath,Tbase_to_canvas,"red");
    drawTrajectory(1.0,9.0,100,compRestraintCPath,Tbase_to_canvas,"red");


   /* function animate () {
        canvas.width=canvas.width;
    }*/

    canvas.addEventListener('click',(event) => {
        const shape = canvas.getBoundingClientRect();
        const x =event.clientX-shape.left;
        const y = event.clientY - shape.top;
        console.log('x: ' + x + 'y: ' + y)
    })

} //end of setup 
window.onload = setup;
