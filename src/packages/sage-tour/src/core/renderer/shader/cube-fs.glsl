precision mediump float;

varying vec3 v_uv;

uniform samplerCube u_cubemap;
uniform float u_opacity;

void main()	
{
  //gl_FragColor = vec4(vec3(1.0, 0.0, 0.0), 1.0);
  gl_FragColor = vec4(textureCube(u_cubemap, vec3(-1.*v_uv.x, v_uv.yz)).rgb, u_opacity);
}
