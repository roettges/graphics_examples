function start() {

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = 0;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    
    
    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
   
    // this gives us access to the matrix uniform
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    // Attach samplers to texture units
    shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
    gl.uniform1i(shaderProgram.texSampler1, 0);

    // Data ...
    
    // vertex positions
    var phi = (1+Math.sqrt(5))/2;
    var vertexPos = new Float32Array(
        [  0, 1, phi,  1, phi, 0,  -1, phi, 0, //side 1
        0, 1, -phi,  -1, phi, 0,  1, phi, 0, //side 2
        1, phi, 0,  0, 1, phi,  phi, 0, 1,  //side 3
        0, 1, -phi,  -phi, 0, -1,  -1, phi, 0, //side 4
        -1, phi, 0,  -phi, 0, -1,  -phi, 0, 1, //side 5
        -1, phi, 0,  -phi, 0, 1,  0, 1, phi, //side 6
        0, 1, phi,  -phi, 0, 1,  0, -1, phi, //side 7
        phi, 0, 1,  0, 1, phi,  0, -1, phi, //side 8
        0, 1, -phi,  1, phi, 0, phi, 0, -1,//side 9
        0, -1, -phi,  -phi, 0, -1,  0, 1, -phi, //side 10
        -1, -phi, 0,  0, -1, -phi,  1, -phi, 0, //side 11
        0, -1, phi,  -1, -phi, 0,  1, -phi, 0,  //side 12
        0, -1, -phi,  -1, -phi, 0,  -phi, 0, -1, //side 13
        0, -1, phi,  1, -phi, 0,  phi, 0, 1, //side 14
        phi, 0, 1,  1, -phi, 0,  phi, 0, -1, //side 15
        1, -phi, 0,  0, -1, -phi,  phi, 0, -1, //side 16
        phi, 0, 1,  phi, 0, -1,  1, phi, 0, //side 17
        0, -1, phi,  -phi, 0, 1,  -1, -phi, 0, //side 18
        -1, -phi, 0,  -phi, 0, 1,  -phi, 0, -1, //side 19
        phi, 0, -1,  0, -1, -phi,  0, 1, -phi //side 20  
        ]);
    
    // vertex normals
    function genNormals(vPos) {
        var vNormals = [];
        for (var i = 0; i < vPos.length; i+=9) {
            var v1 = vec3.fromValues(vPos[i], vPos[i+1], vPos[i+2]);
            var v2 = vec3.fromValues(vPos[i+3], vPos[i+4], vPos[i+5]);
            var v3 = vec3.fromValues(vPos[i+6], vPos[i+7], vPos[i+8]);
            var difV1V2 = vec3.create();
            var difV1V3 = vec3.create();
            vec3.subtract(difV1V2, v2, v1);
            vec3.subtract(difV1V3, v3, v1);
            var normal = vec3.create();
            vec3.cross(normal, difV1V2, difV1V3);
            if (i == 18) {
                for (var k = 0; k < 3; k++) {
                console.log("side 3 normal", normal[0], normal[1], normal[2]);
                vNormals.push(-normal[0]);
                vNormals.push(normal[1]);
                vNormals.push(normal[2]);
                } 
            } else if (i == 108) {
                for (var m = 0; m < 3; m++) {
                    console.log("side 3 normal", normal[0], normal[1], normal[2]);
                    vNormals.push(-normal[0]);
                    vNormals.push(normal[1]);
                    vNormals.push(normal[2]);
                }
            } else {
            for (var j = 0; j < 3; j++) {
                //vec3.normalize(normal, normal);
                vNormals.push(normal[0]);
                vNormals.push(normal[1]);
                vNormals.push(normal[2]);
            }
            }
        }
        return new Float32Array(vNormals);
    }
    var vertexNormals = genNormals(vertexPos);
    console.log(vertexNormals);
    //side 3 normal 0, 3.2360680103302, 1.2360680103302002,

    // vertex base colors
    var vertexColors = new Float32Array(
        [ 0.902, 0.098, 0.294,  0.902, 0.098, 0.294,  0.902, 0.098, 0.294, //side 1 - red
        0.96, 0.188, 0.188,  0.96, 0.188, 0.188,  0.96, 0.188, 0.188, //side 2 - orange
        1, 0.882, 0.098,  1, 0.882, 0.098,  1, 0.882, 0.098, //side 3 - yellow
        0.235, 0.706, 0.294, 0.235, 0.706, 0.294,  0.235, 0.706, 0.294, //side 4 - green
        0.275, 0.941, 0.941,  0.275, 0.941, 0.941,  0.275, 0.941, 0.941, //side 5 - cyan
        0, 0.509, 0.784,   0, 0.509, 0.784,   0, 0.509, 0.784, //side 6 - blue
        0.568, 0.117, 0.706,  0.568, 0.117, 0.706,  0.568, 0.117, 0.706, //side 7 - purple
        0.941, 0.196, 0.902,  0.941, 0.196, 0.902,  0.941, 0.196, 0.902, //side 8 - magenta
        0.501, 0.501, 0.501,  0.501, 0.501, 0.501,  0.501, 0.501, 0.501, //side 9 - gray
        0.980, 0.745, 0.831,  0.980, 0.745, 0.831,  0.980, 0.745, 0.831, //side 10 - pink
        1, 0.843, 0.706,  1, 0.843, 0.706,  1, 0.843, 0.706, //side 11 - peach/apricot
        0.667, 1, 0.765,   0.667, 1, 0.765,   0.667, 1, 0.765, //side 12 - mint
        0.862, 0.745, 1,  0.862, 0.745, 1,  0.862, 0.745, 1, //side 13 - lavender
        1, 0.98, 0.784,  1, 0.98, 0.784,  1, 0.98, 0.784, //side 14 - beige
        0.502, 0, 0,  0.502, 0, 0,  0.502, 0, 0, //side 15 - maroon
        0.667, 0.431, 0.157,  0.667, 0.431, 0.157,  0.667, 0.431, 0.157, //side 16 - brown
        0, 0.502, 0.502,  0, 0.502, 0.502,  0, 0.502, 0.502, //side 17 - teal
        0, 0, 0.502,  0, 0, 0.502,  0, 0, 0.502, //side 18 - navy
        0, 0.819, 0.545,  0, 0.819, 0.545,  0, 0.819, 0.545, //side 19 - turquoise
        0, 0.333, 0.4,   0, 0.333, 0.4,   0, 0.333, 0.4 //side 20 - dark turquoise
    ]);

   //triangle corners for texture mapping
   var tex_coordsX = [];
   var tex_coordsY = [];
   var intervalwidth = 1/8.085;
   var intervalheight = 1/4.5;
   var heightoffset = 0.008; 
   for (var i = 0; i < 9; i+=1) {
       var posx = 0.01 + (i*intervalwidth);
       tex_coordsX.push(posx); 
   }
   for (var j = 0; j < 5; j+=1) {
        //var posy = heightoffset+(j*intervalheight)
        if (j == 0) {
            var posy = heightoffset+(j*intervalheight);
        } else if (j == 1){ var posy = (j*intervalheight) - 0.002;}
        else if (j == 2){ var posy = (j*intervalheight)- 0.0075;}
        else if (j == 3){ var posy = (j*intervalheight)- 0.018;}
        else {var posy = j*intervalheight-.025;}
        tex_coordsY.push(posy);
   }
   
   console.log(tex_coordsX); 
   console.log(tex_coordsY); 
   
    // vertex texture coordinates
    var vertexTextureCoords = new Float32Array([
        tex_coordsX[0],tex_coordsY[0],  tex_coordsX[1],tex_coordsY[1],  tex_coordsX[2],tex_coordsY[0], //value 1 on side 1 - red
        tex_coordsX[2],tex_coordsY[1],  tex_coordsX[1],tex_coordsY[2],  tex_coordsX[3],tex_coordsY[2], //value 7 - side 2 - orange
        tex_coordsX[1],tex_coordsY[4],  tex_coordsX[3],tex_coordsY[4],  tex_coordsX[2],tex_coordsY[3], //value 19 - side 3 - yellow
        tex_coordsX[5],tex_coordsY[3],  tex_coordsX[4],tex_coordsY[2],  tex_coordsX[3],tex_coordsY[3], //value 15 - side 4 - green
        tex_coordsX[4],tex_coordsY[0],  tex_coordsX[5],tex_coordsY[1],  tex_coordsX[6],tex_coordsY[0], //value 5 - side 5 - cyan
        tex_coordsX[4],tex_coordsY[2],  tex_coordsX[5],tex_coordsY[3],  tex_coordsX[6],tex_coordsY[2], //value 13 - side 6 - blue
        tex_coordsX[2],tex_coordsY[2],  tex_coordsX[0],tex_coordsY[2],  tex_coordsX[1],tex_coordsY[3], //value 11 - side 7 - purple
        tex_coordsX[3],tex_coordsY[2],  tex_coordsX[5],tex_coordsY[2],  tex_coordsX[4],tex_coordsY[1], //value 9 - side 8 - magenta
        tex_coordsX[5],tex_coordsY[2],  tex_coordsX[7],tex_coordsY[2],  tex_coordsX[6],tex_coordsY[1], //value 17 - side 9 - gray
        tex_coordsX[4],tex_coordsY[2],  tex_coordsX[2],tex_coordsY[2],  tex_coordsX[3],tex_coordsY[3], //value 12 - side 10 - pink
        tex_coordsX[4],tex_coordsY[3],  tex_coordsX[3],tex_coordsY[4],  tex_coordsX[5],tex_coordsY[4], //value 20 - side 11 - peach/apricot
        tex_coordsX[2],tex_coordsY[2],  tex_coordsX[1],tex_coordsY[3],  tex_coordsX[3],tex_coordsY[3], //value 14 - side 12 - mint
        tex_coordsX[1],tex_coordsY[1],  tex_coordsX[3],tex_coordsY[1],  tex_coordsX[2],tex_coordsY[0], //value 2 - side 13 - lavender
        tex_coordsX[2],tex_coordsY[1],  tex_coordsX[0],tex_coordsY[1],  tex_coordsX[1],tex_coordsY[2], //value 6 - side 14 - beige
        tex_coordsX[6],tex_coordsY[0],  tex_coordsX[5],tex_coordsY[1],  tex_coordsX[7],tex_coordsY[1], //value 16 - side 15 - maroon
        tex_coordsX[4],tex_coordsY[1],  tex_coordsX[2],tex_coordsY[1],  tex_coordsX[3],tex_coordsY[2], //value 8 - side 16 - brown
        tex_coordsX[2],tex_coordsY[0],  tex_coordsX[3],tex_coordsY[1],  tex_coordsX[4],tex_coordsY[0], //value 3 - side 17 - teal
        tex_coordsX[5],tex_coordsY[1],  tex_coordsX[3],tex_coordsY[1],  tex_coordsX[4],tex_coordsY[0], //value 4 - side 18 - navy
        tex_coordsX[7],tex_coordsY[3],  tex_coordsX[6],tex_coordsY[2],  tex_coordsX[5],tex_coordsY[3], //value 18 - side 19 - turquoise
        tex_coordsX[6],tex_coordsY[1], tex_coordsX[4],tex_coordsY[1],  tex_coordsX[5],tex_coordsY[2]   //value 10 - side 20 - dark turquoise
    ]);

    // element index array          
    var triangleIndices = new Uint8Array(
        [ 0, 1, 2,
        3, 4, 5,
        6, 7, 8, 
        9, 10, 11,
        12, 13, 14,
        15, 16, 17, 
        18, 19, 20, 
        21, 22, 23,
        24, 25, 26,
        27, 28, 29, 
        30, 31, 32,
        33, 34, 35,
        36,37,38,
        39,40,41,
        42,43,44,
        45, 46, 47,
        48, 49, 50,
        51, 52, 53,
        54, 55, 56,
        57, 58, 59
        ]);

    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 60;
    
    // a buffer for normals
    var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 60;
    
    // a buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 60;

    // a buffer for textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 60;

    // a buffer for indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);
    
    // Set up texture
    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image1 = new Image();


    function initTextureThenDraw()
  {
      image1.onload = function() { loadTexture(image1,texture1); };
      image1.crossOrigin = "anonymous";
      image1.src = "https://live.staticflickr.com/65535/53371817542_babfb2d809_o.jpg";

      window.setTimeout(draw,200);
    }

    function loadTexture(image,texture)
    {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // Option 1 : Use mipmap, select interpolation mode
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }

    // Scene (re-)draw routine
    function draw() {
    
        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
    
        // Circle around the y-axis
        var eye = [400.0*Math.sin(angle1),150.0,400.0*Math.cos(angle1)];
        var target = [0,1,0];
        var up = [0,1,0];
    
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[50,50,50]);
        mat4.rotate(tModel,tModel,angle2,[1,1,1]);
      
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/4,1,10,1000);
      
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
      
        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
          gl.FLOAT,false, 0, 0);
          gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
          gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
            gl.FLOAT, false, 0, 0);

        // Bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture1);

        // Do the drawing
        gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);

    }

    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
    initTextureThenDraw();
}

window.onload=start;