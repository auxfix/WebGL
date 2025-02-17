let vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'',
'void main()',
'{',
' fragColor = vertColor;',
' gl_Position = vec4(vertPosition, 0.0, 1.0);',
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


window.initTriangleScene = function () {
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
  let triangleVerticies = [
    // X, Y
    0.0, 0.5, 1.0, 1.0, 0.0,
    -0.5, -0.5, 0.7, 0.0, 1.0,
    0.5, -0.5, 0.1, 1.0, 0.6
  ]

  let triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVerticies), gl.STATIC_DRAW);

  let positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
  let colorAttribLocation = gl.getAttribLocation(program, 'vertColor');

  gl.vertexAttribPointer(
    positionAttribLocation, // Attribute location
    2, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    0 // Offset from the beggining of a single vertext to this attribute
  );

  gl.vertexAttribPointer(
    colorAttribLocation, // Attribute location
    3, // Number of elements per attribute
    gl.FLOAT, // Type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT, // Offset from the beggining of a single vertext to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  //
  // Main loop
  //
  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
}