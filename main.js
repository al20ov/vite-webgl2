import "./style.css";
import PicoGL from "picogl";

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
  -0.5, -0.5,
  0.5, -0.5,
  0.0, 0.5
]));

// deno-fmt-ignore
const colors = app.createVertexBuffer(PicoGL.FLOAT, 3, new Float32Array([
  1.0, 0.0, 0.0,
  0.0, 1.0, 0.0,
  0.0, 0.0, 1.0
]));

const triangleArray = app.createVertexArray()
  .vertexAttributeBuffer(0, positions)
  .vertexAttributeBuffer(1, colors);

const drawCall = app.createDrawCall(program, triangleArray);

app.clear();

drawCall.draw();
