import "./style.css";
import PicoGL from "picogl";

const canvas = document.getElementById("canvas");
canvas.width = 1600;
canvas.height = 900;

const gl = canvas.getContext("webgl2");

const app = PicoGL.createApp(canvas)
  .clearColor(0, 0, 0, 1);

const vSource = document.getElementById("vertex-shader").text.trim();
const vertexShader = app.createShader(PicoGL.VERTEX_SHADER, vSource);

const fSourceMRT = document.getElementById("fragment-shader-mrt").text.trim();
const programMRT = app.createProgram(vertexShader, fSourceMRT);

const fSourceBlend = document.getElementById("fragment-shader-blend").text
  .trim();
const programBlend = app.createProgram(vertexShader, fSourceBlend);

// deno-fmt-ignore
const trianglePositions = app.createVertexBuffer(PicoGL.FLOAT, 2, new Float32Array([
  -0.5, -0.5,
  0.5, -0.5,
  0.0, 0.5
]));

const triangleArray = app.createVertexArray()
  .vertexAttributeBuffer(0, trianglePositions);

// deno-fmt-ignore
const quadPositions = app.createVertexBuffer(PicoGL.FLOAT, 2, new Float32Array([
  -1.0, 1.0,
  -1.0, -1.0,
  1.0, -1.0,
  -1.0, 1.0,
  1.0, -1.0,
  1.0, 1.0
]));

const quadArray = app.createVertexArray()
  .vertexAttributeBuffer(0, quadPositions);

const colorTarget1 = app.createTexture2D(app.width, app.height);
const colorTarget2 = app.createTexture2D(app.width, app.height);

const framebuffer = app.createFramebuffer()
  .colorTarget(0, colorTarget1)
  .colorTarget(1, colorTarget2);

const drawCallMRT = app.createDrawCall(programMRT, triangleArray);
const drawCallBlend = app.createDrawCall(programBlend, quadArray)
  .texture("texture1", framebuffer.colorAttachments[0])
  .texture("texture2", framebuffer.colorAttachments[1]);

app.drawFramebuffer(framebuffer).clear();
drawCallMRT.draw();

app.defaultDrawFramebuffer().clear();
drawCallBlend.draw();
