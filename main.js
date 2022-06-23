import "./style.css";
import { load } from "@loaders.gl/core";
import { OBJLoader } from "@loaders.gl/obj";
import PicoGL from "picogl";
import { mat4 } from "gl-matrix";

const obj = await load("assets/models/sphere.obj", OBJLoader);

const canvas = document.getElementById("canvas");
canvas.width = 1600;
canvas.height = 900;

const gl = canvas.getContext("webgl2");

gl.enable(gl.DEPTH_TEST);

const app = PicoGL.createApp(canvas)
  .clearColor(0, 0, 0, 1);

const vSource = document.getElementById("vertex-shader").text.trim();
const fSource = document.getElementById("fragment-shader").text.trim();

const program = app.createProgram(vSource, fSource);

// deno-fmt-ignore
const positions = app.createVertexBuffer(PicoGL.FLOAT, 3, obj.attributes.POSITION.value);

const normals = app.createVertexBuffer(PicoGL.FLOAT, 3, obj.attributes.NORMAL.value);

const triangleArray = app.createVertexArray()
  .vertexAttributeBuffer(0, positions)
  .vertexAttributeBuffer(1, normals);

let image = new Image();

let angle = 0;

function getMVP() {
  const model = mat4.create();
  // mat4.fromZRotation(model, angle);
  mat4.fromScaling(model, [1.0, 1.0, 1.0])
  // mat4.rotateY(model, model, angle);
  // mat4.rotateX(model, model, angle);
  angle += 0.02;

  const view = mat4.create();
  mat4.translate(view, view, [0, 0, -2.5]);
  mat4.rotateX(view, view, angle / 2.0);
  mat4.rotateY(view, view, angle);

  const projection = mat4.create();
  mat4.perspective(projection, 90 * (Math.PI / 180), 16.0 / 9.0, 0.01, 100);
  return [
    model,
    view,
    projection,
  ];
}

function draw() {
  const texture = app.createTexture2D(image, { flipY: true });
  const [model, view, projection] = getMVP();
  const drawCall = app.createDrawCall(program, triangleArray)
    .uniform("model", model)
    .uniform("view", view)
    .uniform("projection", projection)
    .texture("tex", texture);

  app.clear();

  drawCall.draw();

  setTimeout(draw, 16);
}

image.onload = () => {
  draw();
};

image.src = "assets/textures/webgl-logo.png";
