uniform sampler2D uTexture;
uniform vec2 uPlaneSizes;
uniform vec2 uImagePosition;

varying vec2 vUv;



void main() {
  vec2 uv = uImagePosition + .5 + (vUv - .5) / uPlaneSizes;

  vec4 texel = texture2D(uTexture, uv);
  gl_FragColor = texel;
}