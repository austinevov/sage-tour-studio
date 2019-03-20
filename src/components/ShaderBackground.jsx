import React, { Component } from 'react';
import styled, { css } from 'styled-components';
import { request } from 'https';

function createShader(gl, src, type) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    throw 'Could not compile shader:' + gl.getShaderInfoLog(shader);
  }

  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
  const fragShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);

  const program = gl.createProgram();

  gl.attachShader(program, vertShader);
  gl.attachShader(program, fragShader);

  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);

  gl.useProgram(program);
  if (!success) {
    throw 'Could not link shader: ' + gl.getProgramInfoLog(program);
  }

  return program;
}

export default class ShaderBackground extends Component {
  state = {
    noWebGL: false
  };
  componentDidMount() {
    if (this.canvas) {
      this.gl = this.canvas.getContext('webgl', { antialias: true });
      if (!this.gl) {
        this.setState({ noWebGL: true });
      }

      const positions = [-1, -1, 1, -1, 1, 1, -1, 1];
      const indices = [0, 2, 1, 2, 0, 3];

      this.positionVBO = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVBO);
      this.gl.bufferData(
        this.gl.ARRAY_BUFFER,
        new Float32Array(positions),
        this.gl.STATIC_DRAW
      );

      this.indexVBO = this.gl.createBuffer();
      this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexVBO);
      this.gl.bufferData(
        this.gl.ELEMENT_ARRAY_BUFFER,
        new Uint16Array(indices),
        this.gl.STATIC_DRAW
      );

      this.program = createProgram(
        this.gl,
        this.props.vertexSource,
        this.props.fragmentSource
      );

      this.gl.useProgram(this.program);
      this.resolutionUniformLoc = this.gl.getUniformLocation(
        this.program,
        'u_resolution'
      );
      this.timeUniformLoc = this.gl.getUniformLocation(this.program, 'u_time');

      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.positionVBO);

      const positionAttribLoc = this.gl.getAttribLocation(
        this.program,
        'a_position'
      );

      this.gl.vertexAttribPointer(
        positionAttribLoc,
        2,
        this.gl.FLOAT,
        false,
        0,
        0
      );
      this.gl.enableVertexAttribArray(positionAttribLoc);

      this.animate();
    } else {
      this.setState({ noWebGL: true });
    }
  }

  animate = () => {
    this.resize();
    this.gl.clearColor(0, 0, 1, 1.0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);

    const time = performance.now() / 500;
    const resolution = [this.canvas.width, this.canvas.height];
    this.gl.useProgram(this.program);
    this.gl.uniform1f(this.timeUniformLoc, time);
    this.gl.uniform2f(this.resolutionUniformLoc, ...resolution);

    this.gl.drawElements(this.gl.TRIANGLES, 6, this.gl.UNSIGNED_SHORT, 0);

    requestAnimationFrame(this.animate);
  };

  resize = () => {
    const displayWidth = this.canvas.clientWidth;
    const displayHeight = this.canvas.clientHeight;

    if (
      this.canvas.width != displayWidth ||
      this.canvas.height != displayHeight
    ) {
      this.canvas.width = displayWidth;
      this.canvas.height = displayHeight;
    }
  };

  render() {
    false;
    return (
      <Container>
        {this.props.children}
        {this.state.noWebGL ? (
          <Fallback />
        ) : (
          <Canvas
            ref={canvas => {
              this.canvas = canvas;
            }}
          />
        )}
      </Container>
    );
  }
}

const Container = styled.div`
  position: relative;
`;
const Fallback = styled.div`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  margin: 0;
  padding: 0;
  z-index: 1;

  background-color: rgb(54, 64, 76);
`;
const Canvas = styled.canvas`
  width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0px;
  margin: 0;
  padding: 0;
  z-index: 1;
`;
