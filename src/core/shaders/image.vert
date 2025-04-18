varying vec2 vUv;

void main() {
  vec3 pos = position;

  // Calculate clipspace
  vec4 modelPos = modelMatrix * vec4(position, 1.0);
  vec4 viewPos = viewMatrix * modelPos;
  vec4 clipSpace = projectionMatrix * viewPos;

  //Calculate NDC space coords (-1 / 1)
  float ndcX = clipSpace.x / clipSpace.w;
  float ndcY = clipSpace.y / clipSpace.w;

  // Calculate bump
  float factorY = 1.0 - abs(ndcY);
  // Smooth out bump with smoothstep
  factorY = smoothstep(0.3, 1.0, factorY);

  // Divide PI/2 because -1,1 coordinates from NDC
  float intensity = 1.5;
  pos.z = sin(PI/2.0) * intensity * factorY;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vUv = uv;
}