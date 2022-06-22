import "./style.css";
import { load } from "@loaders.gl/core";
import { OBJLoader } from "@loaders.gl/obj";
import PicoGL from "picogl";
import { mat4 } from "gl-matrix";

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

let angle = 0;

function draw() {
  const texture = app.createTexture2D(image, { flipY: true });
  let rotation = mat4.create();
  mat4.fromZRotation(rotation, angle);
  const drawCall = app.createDrawCall(program, triangleArray)
    .uniform("rotation", rotation)
    .texture("tex", texture);

  app.clear();

  drawCall.draw();

  angle += 0.02;
  setTimeout(draw, 16);
}

image.onload = () => {
  draw();
};

image.src = "assets/textures/webgl-logo.png";
