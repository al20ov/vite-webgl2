import "./style.css";
import PicoGL from "picogl";

import { mat4 } from "gl-matrix";

const canvas = document.getElementById("canvas");
canvas.width = 1600;
canvas.height = 900;

const gl = canvas.getContext("webgl2");

const app = PicoGL.createApp(canvas)
  .clearColor(0, 0, 0, 1);

const vSource = document.getElementById("vertex-shader").text.trim();
const fSource = document.getElementById("fragment-shader").text.trim();

const program = app.createProgram(vSource, fSource);

// deno-fmt-ignore
const positions = app.createVertexBuffer(PicoGL.FLOAT, 2, new Float32Array([
  -0.2, -0.2,
  0.2, -0.2,
  0.0, 0.2
]));

const triangleArray = app.createVertexArray()
  .vertexAttributeBuffer(0, positions);

const rotationMatrix = mat4.create();
mat4.fromZRotation(rotationMatrix, Math.PI / 12);
const uniformColor = new Float32Array([1.0, 0.5, 1.0, 1.0]);

const uniformBuffer = app.createUniformBuffer([
  PicoGL.FLOAT_MAT4,
  PicoGL.FLOAT_VEC4,
])
  .set(0, rotationMatrix)
  .set(1, uniformColor)
  .update();

const drawCall = app.createDrawCall(program, triangleArray)
  .uniformBlock("SceneUniforms", uniformBuffer);

app.clear();
drawCall.draw();
