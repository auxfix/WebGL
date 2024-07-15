let vertexShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'',
'void main()',
'{',
' gl_Position = vec4(vertPosition, 0.0, 1.0);',
'}'
].join('\n');

let fragmentShaderText = 
[
'precision mediump float;',
'',
'attribute vec2 vertPosition;',
'',
'void main()',
'{',
' gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);',
'}'
].join('\n');


window.initDemo = function () {
  console.log('i am inited');

  let canvas = document.getElementById('game-surface');
  let gl = canvas.getContext('webgl');

  console.log(gl);

  if(!gl) {
    console.log('Your browser does not support WebGL');
  }

  gl.clearColor(0.75, 0.85, 0.8, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)
}
