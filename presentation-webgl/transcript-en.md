Links:
https://www.khronos.org/

https://habr.com/ru/companies/2gis/articles/273735/

WebGL Introduction
WebGL (Web Graphics Library) is a JavaScript API for rendering interactive 2D and 3D graphics within any compatible web browser without the need for plugins. WebGL brings 3D graphics to the web by providing an API based on OpenGL ES 2.0, which can be used within HTML5 <canvas> elements.

Source: MDN WebGL API Documentation

Why WebGL is Challenging
Unlike JavaScript, WebGL has a steep learning curve, and few developers use it—even fewer write about it.

Most tutorials or articles jump straight into using some library. But as we know, large, universal tools aren’t always suitable for our tasks—they might be too slow, come with unnecessary baggage, etc.

With this article, I aim to lower the entry barrier into pure WebGL, provide a basic understanding, and guide you on where to go next.

What WebGL Does
WebGL allows rendering graphics in the browser using the GPU, whereas previously, we could only rely on the CPU. If you don’t understand why this matters, check out this short demo:
YouTube Demo

WebGL is supported by most modern browsers and available to 83% of users.

Misconception: WebGL is for 3D
If you think WebGL draws 3D, you’re mistaken. WebGL knows nothing about 3D—it’s a low-level 2D API, and all it does is draw triangles. But it can draw a lot of them, very quickly.

Want to draw a square? Combine two triangles.

Need a line? Just a few connected triangles.

Drawing a Triangle
Since all shapes in WebGL consist of triangles, let’s break down how to render a single triangle step by step.

Unlike OpenGL, WebGL uses shaders exclusively for rendering. Shaders aren’t related to shadows or shading, as you might think. They were perhaps originally intended for that, but now they’re used for rendering everything.

A shader is a program that runs on the GPU and is written in GLSL (OpenGL Shading Language), which is relatively simple to learn.

There are two types of shaders:

Vertex Shader – Processes vertex data (position, transformations).

Fragment Shader – Determines pixel colors.

Both are required to render any shape.

Vertex Shader Basics
Imagine you want to draw a cube (or any shape with many vertices). You need to define its geometry by specifying vertex coordinates. Calculating new coordinates for every vertex manually when the cube moves would be inefficient. Instead, offload this work to the GPU using the vertex shader.

The vertex shader takes vertex coordinates and their local coordinate system, computes their position in the global space, and passes the data to the fragment shader.

It can also perform additional tasks, like calculating light angles. Enthusiasts create amazing effects using vertex shaders.

Fragment Shader Basics
Knowing a shape’s position isn’t enough—you also need to determine how it should be colored. The fragment shader runs for every pixel on the shape’s surface and computes its final color.

Illustration
If the vertex shader defines geometry, the fragment shader defines color.

Writing Shaders in GLSL
Shader code is written in GLSL. Here’s an example for a triangle:

Vertex Shader Example:
glsl
attribute vec3 a_position;
attribute vec3 a_color;
uniform vec3 u_position;
varying vec3 v_color;

void main(void) {
    v_color = a_color;
    gl_Position = vec4(u_position + a_position, 1.0);
}
Fragment Shader Example:
glsl
precision mediump float;
varying vec3 v_color;

void main(void) {
    gl_FragColor = vec4(v_color.rgb, 1.0);
}
The code consists of variables and a main() function that returns the shader’s output:

gl_Position – Outputs vertex coordinates.

gl_FragColor – Sets the pixel color.

Shader variables come in three types:

Attributes – Only in vertex shaders, unique per vertex.

Uniforms – Available in both shaders, constant across all calls.

Varying – Pass data from vertex to fragment shader (interpolated between vertices).

Initializing Shaders in JavaScript
First, get the WebGL context:

javascript
var gl = canvas.getContext('webgl');
Shader code is compiled from strings:

javascript
// Vertex Shader
var vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, document.getElementById('vertexShader').text);
gl.compileShader(vertexShader);

// Fragment Shader
var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, document.getElementById('fragmentShader').text);
gl.compileShader(fragmentShader);

// Link into a program
var program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
Buffers: Storing Data on the GPU
Unlike uniforms, attributes require buffers, which store data in GPU memory for faster rendering.

For our triangle, we need:

A vertex buffer (stores vertex positions).

A color buffer (stores vertex colors).

Setting Up the Vertex Buffer
Triangle Geometry

Key points about buffers:

Data is passed as a flat array (e.g., [0, 0, 0, 0.5, 1, 0, 1, 0, 0]).

Only typed arrays (e.g., Float32Array) can be used.

Bind the buffer before uploading data.

Code:

javascript
var vertexBuffer = gl.createBuffer();
var vertices = [0, 0, 0, 0.5, 1, 0, 1, 0, 0];
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
Setting Up the Color Buffer
Colors are in RGB format (each component 0–1):

javascript
var colorBuffer = gl.createBuffer();
var colors = [1, 0, 0, 0, 1, 0, 0, 0, 1]; // Red, Green, Blue
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
Drawing the Triangle
Link buffer data to shader variables and render:

javascript
// Get variable locations
var uPosition = gl.getUniformLocation(program, 'u_position');
var aPosition = gl.getAttribLocation(program, 'a_position');
var aColor = gl.getAttribLocation(program, 'a_color');

// Use the shader program
gl.useProgram(program);

// Set uniform (position)
gl.uniform3fv(uPosition, [0, 0, 0]);

// Bind color buffer
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.enableVertexAttribArray(aColor);
gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

// Bind vertex buffer
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.enableVertexAttribArray(aPosition);
gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);

// Clear the screen (white)
gl.clearColor(1.0, 1.0, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Draw the triangle (3 vertices)
gl.drawArrays(gl.TRIANGLES, 0, 3);
Result:
Rendered Triangle

Full code: JSFiddle Example

Drawing a Rotating Cube
Now, let’s render a 3D cube that rotates. A cube has 6 faces, each made of 2 triangles (12 triangles total).

Defining the Cube’s Geometry
javascript
var vertexBuffer = gl.createBuffer();
var vertices = [
    // Front face
    -1, -1, -1,  1, -1, -1,  -1, -1, 1,
    1, -1, 1,    -1, -1, 1,   1, -1, -1,
    // Back face
    -1, 1, -1,   -1, 1, 1,    1, 1, -1,
    1, 1, 1,     1, 1, -1,    -1, 1, 1,
    // ... (other faces)
];
gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
Color Buffer (3 colors for faces)
javascript
var colorBuffer = gl.createBuffer();
var colors = [
    // Front face (red)
    1, 0.5, 0.5,  1, 0.5, 0.5,  ...,
    // Bottom face (blue)
    0.5, 0.7, 1,  0.5, 0.7, 1,  ...,
    // ... (other faces)
];
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
Matrices: Position, Rotation, and Camera
Instead of a 3D position vector, we use a 4×4 matrix (combines rotation, scale, and position).

For matrix operations, we’ll use glMatrix:

javascript
var cubeMatrix = mat4.create(); // Identity matrix
Camera and Perspective
A camera defines what’s visible on screen and simulates 3D perspective.

Create a perspective matrix:

javascript
var cameraMatrix = mat4.create();
mat4.perspective(cameraMatrix, 0.785, window.innerWidth / window.innerHeight, 0.1, 1000);
Parameters:

fov – Field of view (radians).

aspect – Screen aspect ratio.

near / far – Clipping planes.

Move the camera back:

javascript
mat4.translate(cameraMatrix, cameraMatrix, [0, 0, -5]);
Updated Shaders
Vertex Shader:

glsl
attribute vec3 a_position;
attribute vec3 a_color;
uniform mat4 u_cube;    // Cube’s transform
uniform mat4 u_camera;  // Camera’s transform
varying vec3 v_color;
void main() {
    v_color = a_color;
    gl_Position = u_camera * u_cube * vec4(a_position, 1.0);
}
Fragment Shader: (Same as before)

Animation Loop
Use requestAnimationFrame for smooth rotation:

javascript
var lastRenderTime = Date.now();
function render() {
    requestAnimationFrame(render);
    var dt = Date.now() - lastRenderTime;

    // Rotate cube
    mat4.rotateY(cubeMatrix, cubeMatrix, dt / 1000);
    mat4.rotateZ(cubeMatrix, cubeMatrix, dt / 1000);

    // Clear screen
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.enable(gl.DEPTH_TEST);

    // Draw cube (36 vertices)
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    lastRenderTime = Date.now();
}
render();
Result:
Rotating Cube
Full code: JSFiddle Example

Debugging WebGL
Debugging is tricky because shaders run on the GPU. Here are some tips:

Check shader compilation errors:

javascript
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
    console.log(gl.getShaderInfoLog(vertexShader));
}
Use WebGL-Inspector (GitHub) to inspect buffers, textures, and calls.

Shader Editor (built into Firefox DevTools; Chrome extension here) lets you edit shaders live.

Where to Go Next
I’ve covered the basics to help you start with WebGL. While vectors, matrices, and projections are involved, you don’t need to master them immediately. WebGL is powerful beyond gamedev—don’t hesitate to experiment!
