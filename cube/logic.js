import { mat4, glMatrix } from 'gl-matrix';

let vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'}'
].join('\n');

let fragmentShaderText = 
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
' gl_FragColor = vec4(fragColor, 0.9);',
'}'
].join('\n');


window.initCubeScene = function () {
  console.log('i am inited');

  let canvas = document.getElementById('game-surface');
  let gl = canvas.getContext('webgl');

  console.log(gl);

  if(!gl) {
    console.log('Your browser does not support WebGL');
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

  let vertexShader = gl.createShader(gl.VERTEX_SHADER);
  let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
    return;
  }

  gl.compileShader(fragmentShader);
  if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)){
    console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
    return;
  }

  let program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  if(!gl.getProgramParameter(program, gl.LINK_STATUS)){
    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
    return;
  }

  gl.validateProgram(program);
  if(!gl.getProgramParameter(program, gl.VALIDATE_STATUS)){
    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
    return;
  }

  // 
  // Create buffer
  //
  let cubeVerticies = [
    // X, Y, Z            R, G, B

    // Top
    -1.0, 1.0, -1.0,      0.5, 0.5, 0.5,
    -1.0, 1.0, 1.0,       0.5, 0.5, 0.5,
    1.0, 1.0, 1.0,        0.5, 0.5, 0.5,
    1.0, 1.0, -1.0,       0.5, 0.5, 0.5,

    // Left
    -1.0, 1.0, 1.0,       0.75, 0.25, 0.5,
    -1.0, -1.0, 1.0,      0.75, 0.25, 0.5,
    -1.0, -1.0, -1.0,     0.75, 0.25, 0.5,
    -1.0, 1.0, -1.0,      0.75, 0.25, 0.5,

    // Right
    1.0, 1.0, 1.0,        0.25, 0.25, 0.75,
    1.0, -1.0, 1.0,       0.25, 0.25, 0.75,
    1.0, -1.0, -1.0,      0.25, 0.25, 0.75,
    1.0, 1.0, -1.0,       0.25, 0.25, 0.75,

    // Front
    1.0, 1.0, 1.0,        1.0, 0.0, 0.15,
    1.0, -1.0, 1.0,       1.0, 0.0, 0.15,
    -1.0, -1.0, 1.0,      1.0, 0.0, 0.15,
    -1.0, 1.0, 1.0,       1.0, 0.0, 0.15,

    // Back
    1.0, 1.0, -1.0,       0.0, 1.0, 0.15,
    1.0, -1.0, -1.0,      0.0, 1.0, 0.15,
    -1.0, -1.0, -1.0,     0.0, 1.0, 0.15,
    -1.0, 1.0, -1.0,      0.0, 1.0, 0.15,

    // Bottom
    -1.0, -1.0, -1.0,     0.5, 0.5, 0.1,
    -1.0, -1.0, 1.0,      0.5, 0.5, 0.1,
    1.0, -1.0, 1.0,       0.5, 0.5, 0.1,
    1.0, 1.0, 1.0,        0.5, 0.5, 0.1,
  ]

  let triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticies), gl.STATIC_DRAW);

  let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    0 // Offset from the beggining of a single vertext to this attribute
  );

  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    6 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    3 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beggining of a single vertext to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  
  gl.useProgram(program);

  let matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
  let matViewUniformLocation = gl.getUniformLocation(program, 'mView');
  let matProjUniformLocation = gl.getUniformLocation(program, 'mProj');

  let worldMatrix = new Float32Array(16);
  let viewMatrix = new Float32Array(16);
  let projMatrix = new Float32Array(16);

  mat4.identity(worldMatrix);
  mat4.lookAt(viewMatrix, [0, 0, -3], [0, 0, 0], [0, 1, 0]);
  mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 1.0, 1000);


  gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
  gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
  gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);

  //
  // Main loop
  //
  let identityMatrix = new Float32Array(16);
  mat4.identity(identityMatrix);

  let angle = 0;
  let loop = function() {
    angle = performance.now() / 1000 / 6 * 2 * Math.PI;
    mat4.rotate(worldMatrix, identityMatrix, angle, [0, 1, 0]);
    gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

    gl.clearColor(0.75, 0.85, 0.8, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop); 
}