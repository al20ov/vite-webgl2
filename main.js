import "./style.css";
import { load } from "@loaders.gl/core";
import { OBJLoader } from "@loaders.gl/obj";
import PicoGL from "picogl";

const obj = await load("assets/models/weirdplane.obj", OBJLoader);

console.log([...obj.attributes.POSITION.value]);

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
const positions = app.createVertexBuffer(PicoGL.FLOAT, 3, obj.attributes.POSITION.value);

const triangleArray = app.createVertexArray()
  .vertexAttributeBuffer(0, positions);

let image = new Image();

image.onload = () => {
  const texture = app.createTexture2D(image, { flipY: true });
  const drawCall = app.createDrawCall(program, triangleArray)
    .texture("tex", texture);

  app.clear();

  drawCall.draw();
};

image.src = "assets/textures/webgl-logo.png";
