precision mediump float;

varying vec3 v_position;

uniform samplerCube u_cubemap;

void main()	
{

  vec3 col = textureCube(u_cubemap, vec3(-1.*v_position.x, v_position.y, v_position.z)).rgb;

  gl_FragColor = vec4(col, 1.0);
}
