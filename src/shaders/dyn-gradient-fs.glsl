precision highp float;

uniform float u_time;
uniform vec2 u_resolution;

void main()	
{
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv = (uv * 2.0) - 1.0;
  uv.x *= u_resolution.x / u_resolution.y;

  float brightness = distance(uv, vec2(-1., 0.9) ) * 0.8;
  brightness *= 0.8;
  
  vec3 lowCol = vec3(59,64,86) / vec3(255.0);
  vec3 hiCol = vec3(71, 88, 163) / vec3(255.0);
  
  vec3 col = mix(hiCol, lowCol, sin(length(uv)+u_time*0.05)*1.2*brightness);
  //col = vec3(brightness);
  //col = vec3(u_resolution, 0.0);
  gl_FragColor = vec4(col,1.0);
}
