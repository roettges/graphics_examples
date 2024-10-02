//adding a comment to see if I can save an update to github
function setup() {
    var canvas = document.getElementById('myCanvas');
    var toggle = document.getElementById('toggle-curves');
    canvas.width = window.innerWidth; //very important or width defaults to 300
    canvas.height = window.innerHeight; //very important or width defaults to 150
    var context = canvas.getContext('2d');
    time = 0; //start time at 0
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var viewAngle = slider1.value*0.02*Math.PI;
    var tParam = 0;
    var duration = 20;

    //___________________________________________________Move/Line To _________________________________________________________

    //reusing professors initial move to and line to functions to get x,y,z based on the passed in stack aka Tx
    function moveToTx(loc,Tx)
    {var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);} 
    function lineToTx(loc,Tx)
    {var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}

    //___________________________________________________END Move/Line To _________________________________________________________

    //___________________________________________________Draw Axes _________________________________________________________
        function drawAxes(color,Tx) {
        context.strokeStyle=color;
        context.beginPath();
        // Axes
        moveToTx([120,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,120,0],Tx);
        moveToTx([0,0,0],Tx);lineToTx([0,0,120],Tx);
        // Arrowheads
        moveToTx([110,5,0],Tx);lineToTx([120,0,0],Tx);lineToTx([110,-5,0],Tx);
        moveToTx([5,110,0],Tx);lineToTx([0,120,0],Tx);lineToTx([-5,110,0],Tx);
        moveToTx([5,0,110],Tx);lineToTx([0,0,120],Tx);lineToTx([-5,0,110],Tx);
        // X-label
        moveToTx([130,0,0],Tx);lineToTx([140,10,0],Tx);
        moveToTx([130,10,0],Tx);lineToTx([140,0,0],Tx);
        //Y-label
        moveToTx([0,135,0],Tx);lineToTx([5,130,0],Tx);lineToTx([10,135,0],Tx);
        moveToTx([5,130,0],Tx);lineToTx([5,125,0],Tx);
        context.stroke();
    }
    function drawAxes1unit(color,Tx) {
        context.strokeStyle=color;
        context.beginPath();
        // Axes
        moveToTx([1.20,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.20,0],Tx);
        moveToTx([0,0,0],Tx);lineToTx([0,0,1.20],Tx);
        // Arrowheads
        moveToTx([1.10,.05,0],Tx);lineToTx([1.20,0,0],Tx);lineToTx([1.10,-.05,0],Tx);
        moveToTx([.05,1.10,0],Tx);lineToTx([0,1.20,0],Tx);lineToTx([-.05,1.10,0],Tx);
        moveToTx([.05,0,1.10],Tx);lineToTx([0,0,1.20],Tx);lineToTx([-.05,0,1.10],Tx);
        // X-label
        moveToTx([1.30,0,0],Tx);lineToTx([1.40,.10,0],Tx);
        moveToTx([1.30,.10,0],Tx);lineToTx([1.40,0,0],Tx);
        //Y-label
        moveToTx([0,1.35,0],Tx);lineToTx([.05,1.30,0],Tx);lineToTx([.10,1.35,0],Tx);
        moveToTx([.05,1.30,0],Tx);lineToTx([.05,1.25,0],Tx);
        context.stroke();
    }
    //___________________________________________________END Draw Axes _________________________________________________________

    //___________________________________________________Distance Function_________________________________________________________
    function distance(loc,Tx){
        var res=vec3.create(); vec3.transformMat4(res,loc,Tx);
        return res[2] //aka return w point
    }
    //___________________________________________________Basis/Tangent Functions _________________________________________________________
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

    var AccelerationHermite = function(t) {
        return [
            12*t-6,
            6*t-4,
            -12*t+6,
            6*t-2
            ];
    }

    var Bezier = function(t) {
        return [
            1-3*t+3*Math.pow(t,2)-Math.pow(t,3),
            3*t-6*Math.pow(t,2)+3*Math.pow(t,3),
            3*Math.pow(t,2)-3*Math.pow(t,3),
            Math.pow(t,3)
            ];

    }

    var TangentBezier = function(t) {
        return [
            -3*Math.pow(t,2)+6*t-3,
            9*Math.pow(t,2)-12*t+3,
            -9*Math.pow(t,2)+6*t,
            3*Math.pow(t,2)
            ];
    }

    var Bspline = function(t) {
        return [
            (Math.pow(t,3)-3*Math.pow(t,2)+3*t-1)/6,
            (4*Math.pow(t,3)-6*t+3)/6,
            (-3+3*t+3*Math.pow(t,2)-Math.pow(t,3))/6,
            1/6
            ];
    }

    var TangentBspline = function(t) {
        return [
            (3-6*t+3*Math.pow(t,2))/6,
            (-6+12*Math.pow(t,2))/6,
            (3+6*t+3*Math.pow(t,2))/6,
            0
            ];
    }
    //___________________________________________________END Basis/Tangent Functions _________________________________________________________

    //___________________________________________________Define Transforms To Get to Camera to Viewport_________________________________________________________
    //LHR: NEED TO UPDATE TO PASS IN ANGLE, DIST, camera[1] - y coord,
    function getCanvastoVPmatrix() {
        var tVP=mat4.create();
        mat4.fromTranslation(tVP,[canvas.width/2,canvas.height/2,0]); // actuality I 'think for the bees I want 0, canvas.height/2, 0
        mat4.scale(tVP,tVP,[canvas.width/2,-canvas.height/2,1]); // IMPORTANT FOR SIZE OF DRAWINGFlip the Y-axis this is going to be tiny right now
        //drawAxes1unit("blue",tVP);
    
        // Create projection transform
        // (orthographic for now)
        var Tprojection = mat4.create();
        //mat4.ortho(Tprojection,-10,10,-10,10,-1,1);
        mat4.perspective(Tprojection,Math.PI/4,(canvas.width/canvas.height),2,10); // Use for perspective teaser
        //param 2 here is vertical feild of view which effectively causes you to zoom in or out
        //param 3 is aspect ratio of canvas (An aspect ratio is a proportional relationship between an image's width and height. Essentially, it describes an image's shape. Aspect ratios are written as a formula of width to height, like this: 3:2. For example, a square image has an aspect ratio of 1:1)
        //param 4 is near clipping plane
        //param 5 is far clipping plane
    
        // Combined transform for viewport and projection
        var tVP_PROJ = mat4.create();
        mat4.multiply(tVP_PROJ,tVP,Tprojection);

        // Create Camera (lookAt) transform
        var locCamera = vec3.create();
        var distCamera = 25.0;
        locCamera[0] = distCamera*Math.sin(viewAngle);
        locCamera[1] = 10;
        locCamera[2] = distCamera*Math.cos(viewAngle);
        var locTarget = vec3.fromValues(0,0,0); // Aim at the origin of the world coords Q to self if I see nothing move this to canvas.width/2, canvas.height/2,0
        var vecUp = vec3.fromValues(0,1,0);
        var TlookAt = mat4.create();
        mat4.lookAt(TlookAt, locCamera, locTarget, vecUp);

        // Create transform t_VP_CAM that incorporates
        // Viewport and Camera transformations
        var tVP_PROJ_CAM = mat4.create();
        mat4.multiply(tVP_PROJ_CAM,tVP_PROJ,TlookAt);
        //drawAxes1unit("black",tVP_PROJ_CAM);
        makeshape("green",tVP_PROJ_CAM)

        return tVP_PROJ_CAM;
    }//end getCanvastoVPmatrix
    //___________________________________________________END Define Transforms To Get to Camera to Viewport_________________________________________________________


    //___________________________________________________Function to initialize randomized controlled P matrix - needs to be optimized for different basis types, functional for C1 for Hermite_________________________________________________________
    function generateBigP(controlary, basis) {
        var bigP=[];
        //console.log(basis);
        if (basis == "Hermite") {
            for (let i=0; i < controlary.length-3; i+=2) {
                var big_p_next = [controlary[i],controlary[i+1],controlary[i+2],controlary[i+3]];
                bigP.push(big_p_next);
            } // end for
        } // end if Hermite
        else if (basis == "Bezier") {
            for (let i=0; i < controlary.length-3; i+=3) {
                if (i==0) {
                    //var big_p_next = [controlary[i],[3*(controlary[i+1][0]-controlary[i][0]),3*(controlary[i+1][1]-controlary[i][1])],[3*(controlary[i+3][0]-controlary[i+2][0]),3*(controlary[i+3][1]-controlary[i+2][1])],controlary[i+3]];
                    var big_p_next = [controlary[i],controlary[i+1],controlary[i+2],controlary[i+3]];
                } else {
                    var big_p_next = [controlary[i],[(2*controlary[i][0]-controlary[i-1][0]),(2*controlary[i][1]-controlary[i-1][1])],controlary[i+2],controlary[i+3]]; 
                    //if this works we are sort of throwing away some of our generated control points initially so there would be a more efficient way of doing this
                }
                bigP.push(big_p_next);
            } // end for
        } // end if Bezier
        else if (basis == "Bspline") {
            for (let i=0; i < controlary.length-3; i+=1) {
                var big_p_next = [controlary[i],controlary[i+1],controlary[i+2],controlary[i+3]];
                bigP.push(big_p_next);
            } // end for
        } // end if Bspline
        else {
            console.log("Error: invalid basis");
        }
        return bigP;
        //console.log('BigP: at creation' +bigP)
    } // return P matrix should ensure C1 continuity with Hermite
    
    //___________________________________________________BEE OBJECT _________________________________________________________
    /*Generate a Bee object that stores information about that Bee's path, and the order to draw portions of the bee
    based on the camera location*/


    function Bee(controlP, bigP, basis, tangentBasis) {
        this.controlP = controlP;
        this.bigP = bigP; //This represents the bee path 
        this.basis = basis;
        this.tangentBasis = tangentBasis;
        this.drawOrder = [];
        this.bodyTxCalls = [];
        this.tModeltoViewport = mat4.create(); //hope this works
        this.flap = 0;
        this.sampledistance=0; //this is not a very smart way of doing this but trying o do so for the sake of time

        this.modelTransform = function(t,tVP_PROJ_CAM) {
            //define model transform based on path
            var Tmodel = mat4.create();
            mat4.fromTranslation(Tmodel,compC4ShapePath(Hermite,t,this.bigP));
            var tangent=compC4ShapePath(TangentHermite,t,this.bigP);
            var angle = Math.atan2(tangent[1],tangent[0]);
            mat4.rotateZ(Tmodel,Tmodel,angle);
            //move Mod along a path 
            var tVP_PROJ_CAM_MOD=mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD,tVP_PROJ_CAM,Tmodel);
            this.tModeltoViewport = tVP_PROJ_CAM_MOD; //hope this works
            this.sampledistance=distance([0,0,0],tVP_PROJ_CAM_MOD);
            return tVP_PROJ_CAM_MOD;
        }

        //I could do this with less functions e.g. one to just flip the MOD y axis, leaving verbose due to time constraints 
        //"I would have written a shorter letter, but I did not have the time." - Blaise Pascal

        this.modLeftWing = function(modVP) {
            var tVP_PROJ_CAM_MOD_wing2 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_wing2,modVP,tVP_PROJ_CAM_MOD_wing2);   
            mat4.translate(tVP_PROJ_CAM_MOD_wing2,tVP_PROJ_CAM_MOD_wing2,[1,.25,-.32]);
            mat4.scale(tVP_PROJ_CAM_MOD_wing2,tVP_PROJ_CAM_MOD_wing2,[1.5,1.5,1])
            var flapint2 = (Math.round(tParam * 10))
            var flapint = flapint2%=2
            if (flapint==0) {
                if (this.flap==0) {this.flap =1} else {this.flap=0}
            }
            if (this.flap==1) {mat4.rotate(tVP_PROJ_CAM_MOD_wing2,tVP_PROJ_CAM_MOD_wing2,-Math.PI/2,[1,0,0]);}
            return tVP_PROJ_CAM_MOD_wing2
        }

        this.modRightWing = function(modVP) {
            var tVP_PROJ_CAM_MOD_wing1 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_wing1,modVP,tVP_PROJ_CAM_MOD_wing1);   
            mat4.translate(tVP_PROJ_CAM_MOD_wing1,tVP_PROJ_CAM_MOD_wing1,[1,.25,.32]);
            mat4.scale(tVP_PROJ_CAM_MOD_wing1,tVP_PROJ_CAM_MOD_wing1,[1.5,1.5,1])
            if (this.flap==1) {mat4.rotate(tVP_PROJ_CAM_MOD_wing1,tVP_PROJ_CAM_MOD_wing1,Math.PI/2,[1,0,0]);}
            return tVP_PROJ_CAM_MOD_wing1
        } 
        this.modAbdomenTop = function(modVP) {
            var tVP_PROJ_CAM_MOD_abdomen = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_abdomen,modVP,tVP_PROJ_CAM_MOD_abdomen)
            return tVP_PROJ_CAM_MOD_abdomen //actually just the same as tVP_PROJ_CAM_MOD so can get rid of 
        }
        
        this.modAbdomenBottom = function(modVP) {
            tmodabdFlipped = mat4.create();
            mat4.multiply(tmodabdFlipped,modVP,tmodabdFlipped)
            mat4.scale(tmodabdFlipped,tmodabdFlipped,[1,-1,1]);
            return tmodabdFlipped
        } 
        this.modThoraxTop = function(modVP) {
            var tVP_PROJ_CAM_MOD_thorax = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_thorax,modVP,tVP_PROJ_CAM_MOD_thorax)
            mat4.translate(tVP_PROJ_CAM_MOD_thorax,tVP_PROJ_CAM_MOD_thorax,[1.0,.10,0]);
            return tVP_PROJ_CAM_MOD_thorax
        }
        
        this.modThoraxBottom = function(modVP) {
            var tVP_PROJ_CAM_MOD_thoraxB = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_thoraxB,modVP,tVP_PROJ_CAM_MOD_thoraxB)
            mat4.translate(tVP_PROJ_CAM_MOD_thoraxB,tVP_PROJ_CAM_MOD_thoraxB,[1.0,.10,0]);
            mat4.scale(tVP_PROJ_CAM_MOD_thoraxB,tVP_PROJ_CAM_MOD_thoraxB,[1,-1,1]);
            return tVP_PROJ_CAM_MOD_thoraxB
        } 
        this.modHeadTop = function(modVP) {
            var tVP_PROJ_CAM_MOD_head = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_head,modVP,tVP_PROJ_CAM_MOD_head)
            mat4.translate(tVP_PROJ_CAM_MOD_head,tVP_PROJ_CAM_MOD_head,[1.5,.2,0]);
            return tVP_PROJ_CAM_MOD_head
        }
        
        this.modHeadBottom = function(modVP) {
            var tVP_PROJ_CAM_MOD_headB = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_headB,modVP,tVP_PROJ_CAM_MOD_headB)
            mat4.translate(tVP_PROJ_CAM_MOD_headB,tVP_PROJ_CAM_MOD_headB,[1.5,.2,0]);
            mat4.scale(tVP_PROJ_CAM_MOD_headB,tVP_PROJ_CAM_MOD_headB,[1,-1,1]);
            return tVP_PROJ_CAM_MOD_headB
        } 
        //note to self I should fix L6-4 if I have time
        this.modlegs_l6top = function(modVP) { //back left top half
            var tVP_PROJ_CAM_MOD_leg6 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg6,modVP,tVP_PROJ_CAM_MOD_leg6)
            mat4.translate(tVP_PROJ_CAM_MOD_leg6,tVP_PROJ_CAM_MOD_leg6,[-.2,.2,-.65]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg6,tVP_PROJ_CAM_MOD_leg6,[.4,1,.8])
            return tVP_PROJ_CAM_MOD_leg6
        } 
        this.modlegs_l6bottom = function(modVP) { //back left bottom half
            var tVP_PROJ_CAM_MOD_leg6B = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg6B,modVP,tVP_PROJ_CAM_MOD_leg6B)
            mat4.translate(tVP_PROJ_CAM_MOD_leg6B,tVP_PROJ_CAM_MOD_leg6B,[-.2,.2,-.65]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg6B,tVP_PROJ_CAM_MOD_leg6B,[.4,1,.8])
            mat4.translate(tVP_PROJ_CAM_MOD_leg6B,tVP_PROJ_CAM_MOD_leg6B,[0,-.8,0]);
            mat4.rotate(tVP_PROJ_CAM_MOD_leg6B,tVP_PROJ_CAM_MOD_leg6B,-Math.PI/4,[-.2,0,-.5]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg6B,tVP_PROJ_CAM_MOD_leg6B,[.7,.9,1]);
            return tVP_PROJ_CAM_MOD_leg6B
        } 
        this.modlegs_l5top = function(modVP) { //mid left top
            var tVP_PROJ_CAM_MOD_leg5 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg5,modVP,tVP_PROJ_CAM_MOD_leg5)
            mat4.translate(tVP_PROJ_CAM_MOD_leg5,tVP_PROJ_CAM_MOD_leg5,[.3,.2,-.6]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg5,tVP_PROJ_CAM_MOD_leg5,[.4,1,.8])
            return tVP_PROJ_CAM_MOD_leg5
        }
        this.modlegs_l5bottom = function(modVP) { //mid left bottom half
            var tVP_PROJ_CAM_MOD_leg5B = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg5B,modVP,tVP_PROJ_CAM_MOD_leg5B)
            mat4.translate(tVP_PROJ_CAM_MOD_leg5B,tVP_PROJ_CAM_MOD_leg5B,[.3,.2,-.6]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg5B,tVP_PROJ_CAM_MOD_leg5B,[.4,1,.8])
            mat4.translate(tVP_PROJ_CAM_MOD_leg5B,tVP_PROJ_CAM_MOD_leg5B,[0,-.8,0]);
            mat4.rotate(tVP_PROJ_CAM_MOD_leg5B,tVP_PROJ_CAM_MOD_leg5B,-Math.PI/4,[-.2,0,-.5]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg5B,tVP_PROJ_CAM_MOD_leg5B,[.7,.9,1]);
            return tVP_PROJ_CAM_MOD_leg5B
        } 
        this.modlegs_l4top = function(modVP) { //front left top half
            var tVP_PROJ_CAM_MOD_leg4 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg4,modVP,tVP_PROJ_CAM_MOD_leg4)
            mat4.translate(tVP_PROJ_CAM_MOD_leg4,tVP_PROJ_CAM_MOD_leg4,[1,.2,-.4]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg4,tVP_PROJ_CAM_MOD_leg4,[.4,.7,.8])
            return tVP_PROJ_CAM_MOD_leg4
        } 
        this.modlegs_l4bottom = function(modVP) { //front left bottom half
            var tVP_PROJ_CAM_MOD_leg4B = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg4B,modVP,tVP_PROJ_CAM_MOD_leg4B)
            mat4.translate(tVP_PROJ_CAM_MOD_leg4B,tVP_PROJ_CAM_MOD_leg4B,[1,.2,-.4]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg4B,tVP_PROJ_CAM_MOD_leg4B,[.4,.7,.8])
            mat4.translate(tVP_PROJ_CAM_MOD_leg4B,tVP_PROJ_CAM_MOD_leg4B,[0,-.8,0]);
            mat4.rotate(tVP_PROJ_CAM_MOD_leg4B,tVP_PROJ_CAM_MOD_leg4B,-Math.PI/4,[-.2,0,-.5]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg4B,tVP_PROJ_CAM_MOD_leg4B,[.7,.9,1]);
            return tVP_PROJ_CAM_MOD_leg4B
        } 
        this.modlegs_l3top = function(modVP) { //back right top
            var tVP_PROJ_CAM_MOD_leg3 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg3,modVP,tVP_PROJ_CAM_MOD_leg3)
            mat4.translate(tVP_PROJ_CAM_MOD_leg3,tVP_PROJ_CAM_MOD_leg3,[-.2,.2,.65]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg3,tVP_PROJ_CAM_MOD_leg3,[.4,1,.8])
            return tVP_PROJ_CAM_MOD_leg3
        }
        this.modlegs_l3bottom = function(modVP) { //back right bottom half
            var tVP_PROJ_CAM_MOD_leg3B = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg3B,modVP,tVP_PROJ_CAM_MOD_leg3B)
            mat4.translate(tVP_PROJ_CAM_MOD_leg3B,tVP_PROJ_CAM_MOD_leg3B,[-.2,.2,.65]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg3B,tVP_PROJ_CAM_MOD_leg3B,[.4,1,.8])
            mat4.translate(tVP_PROJ_CAM_MOD_leg3B,tVP_PROJ_CAM_MOD_leg3B,[0,-.8,0]);
            mat4.rotate(tVP_PROJ_CAM_MOD_leg3B,tVP_PROJ_CAM_MOD_leg3B,Math.PI/4,[-.2,0,-.5]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg3B,tVP_PROJ_CAM_MOD_leg3B,[.7,.9,1]);
            return tVP_PROJ_CAM_MOD_leg3B
        } 
        this.modlegs_l2top = function(modVP) { //mid right top half
            var tVP_PROJ_CAM_MOD_leg2 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg2,modVP,tVP_PROJ_CAM_MOD_leg2)
            mat4.translate(tVP_PROJ_CAM_MOD_leg2,tVP_PROJ_CAM_MOD_leg2,[.3,.2,.6]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg2,tVP_PROJ_CAM_MOD_leg2,[.4,1,.8])
            return tVP_PROJ_CAM_MOD_leg2
        } 
        this.modlegs_l2bottom = function(modVP) { //mid right bottom half
            var tVP_PROJ_CAM_MOD_leg2B = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg2B,modVP,tVP_PROJ_CAM_MOD_leg2B)
            mat4.translate(tVP_PROJ_CAM_MOD_leg2B,tVP_PROJ_CAM_MOD_leg2B,[.3,.2,.6]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg2B,tVP_PROJ_CAM_MOD_leg2B,[.4,1,.8])
            mat4.translate(tVP_PROJ_CAM_MOD_leg2B,tVP_PROJ_CAM_MOD_leg2B,[0,-.8,0]);
            mat4.rotate(tVP_PROJ_CAM_MOD_leg2B,tVP_PROJ_CAM_MOD_leg2B,Math.PI/4,[-.2,0,-.5]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg2B,tVP_PROJ_CAM_MOD_leg2B,[.7,.9,1]);
            return tVP_PROJ_CAM_MOD_leg2B
        } 
        this.modlegs_l1top = function(modVP) { //front right top
            var tVP_PROJ_CAM_MOD_leg1 = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg1,modVP,tVP_PROJ_CAM_MOD_leg1)
            mat4.translate(tVP_PROJ_CAM_MOD_leg1,tVP_PROJ_CAM_MOD_leg1,[1,.2,.4]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg1,tVP_PROJ_CAM_MOD_leg1,[.4,.7,.8])
            return tVP_PROJ_CAM_MOD_leg1
        }
        this.modlegs_l1bottom = function(modVP) { //front right bottom half
            var tVP_PROJ_CAM_MOD_leg1B = mat4.create();
            mat4.multiply(tVP_PROJ_CAM_MOD_leg1B,modVP,tVP_PROJ_CAM_MOD_leg1B)
            mat4.translate(tVP_PROJ_CAM_MOD_leg1B,tVP_PROJ_CAM_MOD_leg1B,[1,.2,.4]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg1B,tVP_PROJ_CAM_MOD_leg1B,[.4,.7,.8])
            mat4.translate(tVP_PROJ_CAM_MOD_leg1B,tVP_PROJ_CAM_MOD_leg1B,[0,-.8,0]);
            mat4.rotate(tVP_PROJ_CAM_MOD_leg1B,tVP_PROJ_CAM_MOD_leg1B,Math.PI/4,[-.2,0,-.5]);
            mat4.scale(tVP_PROJ_CAM_MOD_leg1B,tVP_PROJ_CAM_MOD_leg1B,[.7,.9,1]);
            return tVP_PROJ_CAM_MOD_leg1B
        } 

        this.organizeTxCalls = function() {
                    //build Tx calls this only needs to get done once
                    this.bodyTxCalls = [];
                    this.bodyTxCalls.push(this.modlegs_l6top);
                    this.bodyTxCalls.push(this.modlegs_l6bottom);
                    this.bodyTxCalls.push(this.modlegs_l5top);
                    this.bodyTxCalls.push(this.modlegs_l5bottom);
                    this.bodyTxCalls.push(this.modlegs_l4top);
                    this.bodyTxCalls.push(this.modlegs_l4bottom);
                    this.bodyTxCalls.push(this.modlegs_l3top);
                    this.bodyTxCalls.push(this.modlegs_l3bottom);
                    this.bodyTxCalls.push(this.modlegs_l2top);
                    this.bodyTxCalls.push(this.modlegs_l2bottom);
                    this.bodyTxCalls.push(this.modlegs_l1top);
                    this.bodyTxCalls.push(this.modlegs_l1bottom);
                    this.bodyTxCalls.push(this.modLeftWing);
                    this.bodyTxCalls.push(this.modRightWing);
                    this.bodyTxCalls.push(this.modAbdomenTop);
                    this.bodyTxCalls.push(this.modAbdomenBottom);
                    this.bodyTxCalls.push(this.modThoraxTop);
                    this.bodyTxCalls.push(this.modThoraxBottom);
                    this.bodyTxCalls.push(this.modHeadTop);
                    this.bodyTxCalls.push(this.modHeadBottom);
        } //end organizeTxCalls
        this.organizeTxCalls(); //call this once to build the list of Tx calls

        this.drawInOrder = function(t,cam) {
            //get model transform
            var modVPTX = this.modelTransform(t,cam); 
            //drawAxes1unit("black",cam);  
            //drawAxes("blue",modVPTX);
            //makepath(cam);  
            if (t>2) {var beg = t-2} else {var beg = 0}
            drawPath("#5A3851",beg,t,100,cam,Hermite,this.bigP,[20,4,4]);

            this.drawOrder=[]; //clear draw order before adding to list
            // determine distance approximator for each part of the bee
            for (var i=0; i < this.bodyTxCalls.length; i++) {
                var transfM = this.bodyTxCalls[i](modVPTX);
                var distAprox = distance([0,0,0],transfM); //this isn't perfect but should largely be good enough for my example
                this.drawOrder.push({dist: distAprox,key: i, Tx:transfM});
            }

            //sort draw order
            this.drawOrder.sort((a,b) => a.dist-b.dist);

            //ary of draw calls
            for (let j=0; j<this.drawOrder.length; j++) {
                var keyRef = this.drawOrder[j].key;
                if (keyRef == 0) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 1) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 2) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 3) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 4) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 5) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 6) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 7) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 8) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 9) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 10) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 11) {legs(this.drawOrder[j].Tx)}
                else if (keyRef == 12) {wingshape(this.drawOrder[j].Tx)}
                else if (keyRef == 13) {wingshape(this.drawOrder[j].Tx)}
                else if (keyRef == 14) {drawEllipseHalf("yellow",-.7,0.7,-0.5,0.5,0.6,20,this.drawOrder[j].Tx)}
                else if (keyRef == 15) {drawEllipseHalf("yellow",-.7,0.7,-0.5,0.5,0.5,20,this.drawOrder[j].Tx)}
                else if (keyRef == 16) {drawEllipseHalf("orange",-.3,0.3,-0.3,0.3,0.7,20,this.drawOrder[j].Tx)}
                else if (keyRef == 17) {drawEllipseHalf("orange",-.3,0.3,-0.3,0.3,0.7,20,this.drawOrder[j].Tx)}
                else if (keyRef == 18) {drawEllipseHalf("grey",-.2,0.2,-0.2,0.2,0.2,20,this.drawOrder[j].Tx)}
                else if (keyRef == 19) {drawEllipseHalf("grey",-.2,0.2,-0.2,0.2,0.4,20,this.drawOrder[j].Tx)}
                else {console.log("error: invalid keyRef")}
            }

        } //end drawInOrder


    } // end Bee

    //___________________________________________________END BEE OBJECT _________________________________________________________
/*
code below generates bees and defines their control points/vectors 
right now these controls are randomized but will all start and end in the same place with C1 continuity for a hermite based curve
*/
    function makebees(count) {
        var scaleBy = 20 //points get scaled by this amount after using Math random
        var bees = []
        for (let j=0; j < count; j++) {
            //randomly generated set of control points unique to each bee
            var controls = [];
            var p0 = [((Math.random()+1)*(Math.random()-.5)*(Math.random())),Math.random()*(Math.random()),(Math.random()-.5)*(Math.random())];
            var d0 =[((Math.random()+1)*(Math.random()-.5)*(scaleBy*Math.random())),((Math.random()+1)*(Math.random()-.5)*(scaleBy*Math.random())),((Math.random()+1)*(Math.random()-.5)*(scaleBy*Math.random()))] //works well for hermite
            //var d0 = [(Math.random()*canvas.width),(Math.random()*canvas.height),(Math.random()*canvas.height)]; //testing for for bezier
            controls.push(p0)
            controls.push(d0)
            for (let i=0; i < duration-2; i++) { //this works for hermite doesn't end in right spot for bezier
                var pnext=[((Math.random()+1)*(Math.random()-.5)*(scaleBy*Math.random())),Math.random()*(scaleBy*Math.random()),(Math.random()-.5)*(scaleBy*Math.random())] //choose points on the sceen
                controls.push(pnext)
                var dnext=[((Math.random()+1)*(Math.random()-.5)*(scaleBy*Math.random())),((Math.random()+1)*(Math.random()-.5)*(scaleBy*Math.random())),(Math.random()-.5)*(scaleBy*Math.random())]; //works well for hermite (in 2d yet to be tested in 3d)
                //var dnext=[(Math.random()*canvas.width),(Math.random()*canvas.height)]; //testing for for bezier
                controls.push(dnext);
            }
            controls.push(p0);
            controls.push(d0); //comment out for bezier
            //console.log(controls);
            var pMatrices = generateBigP(controls,"Hermite");

            bees.push(new Bee(controls,pMatrices,Hermite,TangentHermite))
        }
        return bees;
    } //end makebees
    
    //___________________________________________________END makebees_________________________________________________________
   
    //___________________________________________________Cubic Function_________________________________________________________

/*the cubic function represents the sum of uBP*/
    function Cubic(B,pset,t) { //need to update from vec2 to vec3
        var b = B(t);
        var result=vec3.create();
        vec3.scale(result,[pset[0][0],pset[0][1],pset[0][2]],b[0]); //1st point
        vec3.scaleAndAdd(result,result,[pset[1][0],pset[1][1],pset[1][2]],b[1]); //1st deriv
        vec3.scaleAndAdd(result,result,[pset[2][0],pset[2][1],pset[2][2]],b[2]); //2nd point 
        vec3.scaleAndAdd(result,result,[pset[3][0],pset[3][1],pset[3][2]],b[3]); //2nd deriv
        return result;
    }
    //___________________________________________________END Cubic Function_______________________________________________________

    //___________________________________________________piece C for bees then for other things not stored in bees________________________________________________________ 
    //LHR: IF I HAVE TIME I REALLY SHOULD MAKE THIS MORE REUSABLE/CONSOLIDATE   
    var generatePiecewiseC = function(B,i,t,whichBee) {
        //B in my example will be either the basis or the tangent basis (trying to make this reusable
        //t is time, whichBee is which bee we are generating the path for, and i is the ith piece of the piecewise function we are building
        var piecewiseC =(Cubic(B,bees[whichBee].bigP[i-1],t)); //bigP[i] is a set of 4 sets of 2: 2 points/2 tangents if in 2d or 4 sets of 3 since 3 coordinates
        return piecewiseC;
    }
    var generatePiecewiseC4ShapePath = function(B,i,t,bigP) {
        var piecewiseC4shape =(Cubic(B,bigP[i-1],t));
        return piecewiseC4shape;
    }
    //___________________________________________________END piece C ________________________________________________________

    //___________________________________________________Generate Piecewise restraint C for bees then for other things not stored in bees_________________________________________________________
    //LHR: IF I HAVE TIME I REALLY SHOULD MAKE THIS MORE REUSABLE/CONSOLIDATE   
    var compRestraintCPath = function(B,t,whichBee) {
        var len = bees[whichBee].bigP.length;
        if (t>=len) {
            var u = t-(len-1);
            var pieceC = 0;//generatePiecewiseC(B,len,u,whichBee);
        } else {
            var j = Math.floor(t); //my step is always 1 in this scenario, u will be between 0 &1
            var u = t-j
            var pieceC = generatePiecewiseC(B,j+1,u,whichBee);
        }
        return pieceC;
    } 

    var compC4ShapePath = function(B,t,bigP) {
        var len = bigP.length;
        if (t>=len) {
            var u = t-(len-1);
            var pieceC = 0;//generatePiecewiseC(B,len,u,whichBee);
        } else {
            var j = Math.floor(t); //my step is always 1 in this scenario, u will be between 0 &1
            var u = t-j
            var pieceC = generatePiecewiseC4ShapePath(B,j+1,u,bigP);
        }
        //console.log(pieceC);
        return pieceC;
    }
    //___________________________________________________END Generate Piecewise restraint C ________________________________________________________

    //___________________________________________________Draw path/trajectory(bee) fill shape based off basis funcs_________________________________________________________
    //LHR: IF I HAVE TIME I REALLY SHOULD MAKE THIS MORE REUSABLE/CONSOLIDATE
      function makeshape(color,Tx) {
        context.beginPath();
        context.fillStyle=color;
        moveToTx([-12,0,-12],Tx);lineToTx([12,0,-12],Tx);lineToTx([12,0,12],Tx);lineToTx([-12,0,12],Tx);
        context.closePath();context.fill();

    }
    function drawPath(color,t_begin,t_end,intervals,Tx,basis,P,dash) {
        context.strokeStyle=color;
        context.beginPath();
        context.lineWidth=1;
        context.setLineDash(dash)
        moveToTx(compC4ShapePath(basis,t_begin,P),Tx);
            for(var interval=1;interval<=intervals;interval++){
                var t=((intervals-interval)/intervals)*t_begin+(interval/intervals)*t_end;
                lineToTx(compC4ShapePath(basis,t,P),Tx);
            }
        context.stroke();
        context.setLineDash([])
    };


    function fillFreeFormShape(color, t_begin, t_end, intervals, Tx, basis, P) {
        context.strokeStyle=color;
        context.fillStyle=color;
        context.beginPath();
        context.lineWidth=1;
        moveToTx(compC4ShapePath(basis,t_begin,P),Tx);
            for(var interval=1;interval<=intervals;interval++){
                var t=((intervals-interval)/intervals)*t_begin+(interval/intervals)*t_end;
                lineToTx(compC4ShapePath(basis,t,P),Tx);
            }
        context.closePath();
        context.fill();
        context.stroke();
        context.setLineDash([])
    };


    //___________________________________________________END Draw path/trajectory(bee) fill shape based off basis funcs_________________________________________________________

    //___________________________________________________Ellipse_________________________________________________________

    function ellipse_ypos(x,z,a,b,c) {
        if (x === a || z === c) {
            var yval = 0;
        }
        else {
            if ((1-(x*x)/(a*a)-(z*z)/(c*c)) < 0) {
                var yval = 0;
            } else {
                var yval = Math.sqrt(b*b*(1-(x*x)/(a*a)-(z*z)/(c*c)));
            }
        }
        //console.log("yval is: "+yval);
        //console.log("x is "+x+",z is "+z+", a is "+a+", b is "+b+", c is "+c);
        return yval
    }
    /*function cone_ypos(x,z,a,b,c) {
        return Math.sqrt(b*b*((z*z)/(c*c)-(x*x)/(a*a)));
    }*/

    function drawEllipseHalf(color,xstart,xend,zstart,zend,rad_b,resolution,Tx) {
        /* initiallize x & y initial points and end points, 
        this will be used to determine radii a & c as needed, 
        b represents the radius for y which will impact our vertical y coords.
        x_int will represent the steps along the x axis & y_int will represent the steps along the z axis
        this will impact the smoothness of the overall elliptoid */
        var x_int = (xend-xstart)/resolution
        var z_int = (zend-zstart)/resolution
        var rad_a = (xend-xstart)/2;
        var rad_c = (zend-zstart)/2;
        var ystart = ellipse_ypos(xstart,zstart,rad_a,rad_b,rad_c);
        //console.log("y start is: "+ystart);
        var shapeStartCoord = [];
        var count = 0;
        for (var x=xstart; x <= xend; x+=x_int) {
            for (var z=zstart; z < zend; z+=z_int) {
                
                var y = ellipse_ypos(x,z,rad_a,rad_b,rad_c);
                var y2=ellipse_ypos(x2,z,rad_a,rad_b,rad_c); // for x2 z
                var y3 = ellipse_ypos(x2,z2,rad_a,rad_b,rad_c) //for x2 z2
                var y4 = ellipse_ypos(x,z2,rad_a,rad_b,rad_c) //for x z2
                var x2 = x+x_int;
                var z2 = z+z_int
                if (z*z <= (1-(x*x)/(rad_a*rad_a)) && y3!=0) { //if I get rid of theis it will be solid but have wierd square points at y =0 :(
                    context.strokeStyle=color;
                    context.fillStyle=color;
                    context.beginPath();
                    context.lineWidth=1;
                    moveToTx([x,y,z],Tx); //x,y,z
                    lineToTx([x2,y2,z],Tx)
                    lineToTx([x2,y3,z2],Tx);
                    lineToTx([x,y4,z2],Tx); 
                    lineToTx([x,y,z],Tx); //x,y,z
                    context.closePath();
                    context.stroke();
                    context.fill();
                }
            
            }//end drawing a rectangle section of the ellipse
        }//end drawing ellipseQuad
    } //end drawEllipseHalf

    //___________________________________________________END Ellipse_________________________________________________________

    //___________________________________________________Shape Wing_________________________________________________________

    function wingshape(Tx) {
        var wingControls = [];
        wingControls.push([0,0,0]); //p0
        wingControls.push([.1,.3,0]); //d0
        wingControls.push([.2,.6,0]); //p1
        wingControls.push([.1,.3,0]); //d1
        wingControls.push([.1,.97,0]); //p2
        wingControls.push([-.2,.1,0]); //d2
        wingControls.push([0,1,0]); //p3
        wingControls.push([-.1,0,0]); //d3
        wingControls.push([-.1,.97,0]); //p4
        wingControls.push([-.2,-.1,0]); //d4
        wingControls.push([-.2,.6,0]);//p5
        wingControls.push([.1,-.3,0]);// d5
        wingControls.push([0,0,0]); //p6
        wingControls.push([-.1,.3,0]); //d6
        var pMatrix = generateBigP(wingControls,"Hermite"); //this is my bigP
        fillFreeFormShape("black",0,6,20,Tx,Hermite,pMatrix);
    }

    //___________________________________________________END Shape Wing_________________________________________________________
    //___________________________________________________Shape Legs_________________________________________________________
    function legs(Tx) {
        var legControls_left = [];
        var legControls_top = [];
        var legControls_front = [];
        legControls_left.push([-.1,0,0]); //p0 //start left side of leg
        legControls_left.push([0,0,-.1]); //d0
        legControls_left.push([-0.1,0,-.1]); //p1
        legControls_left.push([0,-.1,0]); //d1
        legControls_left.push([-.1,-.8,-.1]); //p2
        legControls_left.push([0,0,.1]); //d2
        legControls_left.push([-.1,-.8,0]); //p3
        legControls_left.push([0,.1,0]); //d3 
        legControls_left.push([-.1,0,0]); //p4 
        legControls_left.push([.10,0,0]); //d4
        legControls_top.push([-.1,0,0]); //p4 //start top of leg
        legControls_top.push([.10,0,0]); //d4
        legControls_top.push([.1,0,0]); //p5
        legControls_top.push([0,0,-.1]); //d5
        legControls_top.push([.1,0,-.1]); //p6
        legControls_top.push([-.1,0,0]); //d6
        legControls_top.push([-.1,0,-.1]); //p7
        legControls_top.push([0,0,.1]); //d7
        legControls_top.push([-.1,0,0]); //p8
        legControls_top.push([0,-.1,0]); //d8 

        legControls_front.push([-.1,0,0]); //p8
        legControls_front.push([0,-.1,0]); //d8 
        legControls_front.push([-.1,-.8,0]); //p9
        legControls_front.push([.1,0,0]); //d9
        legControls_front.push([.1,-.8,0]); //p10
        legControls_front.push([0,.1,0]); //d10
        legControls_front.push([.1,0,0]); //p11
        legControls_front.push([-.1,0,0]) //d11
        legControls_front.push([-.1,0,0]); //p12
        legControls_front.push([0,0,0]); //d12

        var pMatrixLegs_left = generateBigP(legControls_left,"Hermite"); //this is my bigP
        var pMatrixLegs_top = generateBigP(legControls_top,"Hermite"); //this is my bigP
        var pMatrixLegs_front = generateBigP(legControls_front,"Hermite"); //this is my bigP
        fillFreeFormShape("black",0,5,5,Tx,Hermite,pMatrixLegs_left);
        fillFreeFormShape("black",0,5,5,Tx,Hermite,pMatrixLegs_top);
        fillFreeFormShape("black",0,5,5,Tx,Hermite,pMatrixLegs_front);
        var flipTx=mat4.create();
        mat4.multiply(flipTx,Tx,flipTx);
        mat4.translate(flipTx,flipTx,[0,-.8,-.1]);
        mat4.rotate(flipTx,flipTx,2*Math.PI,[1,0,1]);
        mat4.scale(flipTx,flipTx,[-1,-1,-1]);
        fillFreeFormShape("black",0,5,5,flipTx,Hermite,pMatrixLegs_left);
        fillFreeFormShape("black",0,5,5,flipTx,Hermite,pMatrixLegs_top);
        fillFreeFormShape("black",0,5,5,flipTx,Hermite,pMatrixLegs_front);

    }

//___________________________________________________END Shape Legs_________________________________________________________

//___________________________________________________Set up bees & Canvas transforms for Camera_________________________________________________________
bees = makebees(3);

//___________________________________________________Function to actually draw! - LHR REDO_________________________________________________________
    function drawthings(){
        canvas.width = canvas.width;
        var tCanvasNeeded = getCanvastoVPmatrix();
        var beeorder = [];
        for (let i=0; i < bees.length; i++) {
            beeorder.push({dist: bees[i].sampledistance,key: i});
        }
        beeorder.sort((a,b) => a.dist-b.dist);
        for (let j=0; j<beeorder.length; j++) {
            var keyRef = beeorder[j].key;
            bees[keyRef].drawInOrder(tParam,tCanvasNeeded);
        }
        
    } //end drawthings

    //___________________________________________________ACTUALLY DRAW_________________________________________________________
    function animate() {
            drawthings();
        slider1.oninput = function() {
            slider1.value = this.value;
            viewAngle = slider1.value*0.02*Math.PI;
            drawthings();
        }
            tParam = tParam+0.01;
            if (tParam > duration) {
                tParam = 0;
            }
            drawthings();
        requestAnimationFrame(animate);
    } //end animate
    animate();
    

   

} //end of setup 
window.onload = setup;