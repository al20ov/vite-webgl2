import "./style.css";
import { load } from "@loaders.gl/core";
import { OBJLoader } from "@loaders.gl/obj";
import PicoGL from "picogl";
import { mat4, vec3 } from "gl-matrix";

const obj = await load("assets/models/monke.obj", OBJLoader);

const canvas = document.getElementById("canvas");
canvas.width = 1600;
canvas.height = 900;

const gl = canvas.getContext("webgl2");

gl.enable(gl.DEPTH_TEST);
gl.depthFunc(gl.LESS);

const app = PicoGL.createApp(canvas)
  .clearColor(0.0, 0.0, 0.0, 1);

const vSource = document.getElementById("vertex-shader").text.trim();
const fSource = document.getElementById("fragment-shader").text.trim();

const program = app.createProgram(vSource, fSource);

// deno-fmt-ignore
const positions = app.createVertexBuffer(PicoGL.FLOAT, 3, obj.attributes.POSITION.value);

const normals = app.createVertexBuffer(
  PicoGL.FLOAT,
  3,
  obj.attributes.NORMAL.value,
);

const triangleArray = app.createVertexArray()
  .vertexAttributeBuffer(0, positions)
  .vertexAttributeBuffer(1, normals);

// let image = new Image();

let angle = 0;

function getMVP() {
  // const camPos = vec3.fromValues(Math.sin(angle) * 10.0, Math.cos(angle) * 10.0, 10.0);
  const camPos = vec3.fromValues(Math.sin(angle / 10.0) * 10.0, 0.0, 7.0);
  const model = mat4.create();
  mat4.identity(model);
  mat4.fromTranslation(model, vec3.fromValues(1.0, 0.0, 0.0));
  angle += Math.PI / 128;

  const view = mat4.create();
  mat4.lookAt(view, camPos, [0.0, 0.0, 0.0], [0.0, 1.0, 0.0])

  const projection = mat4.create();
  mat4.perspective(projection, 20 * (Math.PI / 180), 16.0 / 9.0, 0.01, 100);
  return [
    camPos,
    model,
    view,
    projection,
  ];
}

function draw() {
  // const texture = app.createTexture2D(image, { flipY: true });
  const [camPos, model, view, projection] = getMVP();

  const drawCall = app.createDrawCall(program, triangleArray)
    .uniform("model", model)
    .uniform("view", view)
    .uniform("projection", projection)
    .uniform("camPos", camPos)
    .uniform("albedo", [0.1, 0.5, 0.0])
    .uniform("metallic", 0.0)
    .uniform("roughness", 0.6)
    .uniform("ao", 0.6)
    .uniform("lightPositions[0]", [
      Math.cos(angle) * 10.0,
      Math.sin(angle) * 10.0,
      8.0,
    ]);

  // .texture("tex", texture);

  app.clear();

  drawCall.draw();
  mat4.translate(model, model, vec3.fromValues(-2.0, 0.0, 0.0));
  drawCall.uniform("roughness", 0.06).uniform("albedo", [1.0, 0.0, 0.2])
  drawCall.draw();

  setTimeout(draw, 16.67);
}

// image.onload = () => {
draw();
// };

// image.src = "assets/textures/webgl-logo.png";
