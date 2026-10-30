import * as THREE from 'three'

/**
 * "Voice Field" — rows of sound-wave ridges rendered as occluding strips + lines.
 * Idle: the field murmurs as if someone is mid-speech.
 * Pointer: a swell follows the cursor. Click: a ripple, like applause.
 * Mic (opt-in): the visitor's own voice drives the ridges.
 */

const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`

const HEIGHT = /* glsl */ `
uniform float uTime;
uniform float uScroll;
uniform float uVoice;
uniform float uSpeak;
uniform vec2 uMouse;
uniform float uMouseStrength;
uniform vec4 uRipples[4];
uniform sampler2D uAudio;
uniform float uWidth;
${NOISE}
float fieldHeight(float x, float z){
  float center = exp(-x*x*0.9);
  float n = snoise(vec3(x*1.4, z*2.4, uTime*0.16))*0.5+0.5;
  float n2 = snoise(vec3(x*4.2, z*3.6 + uTime*0.5, uTime*0.45))*0.5+0.5;
  float audio = texture2D(uAudio, vec2(clamp(abs(x)/uWidth, 0.0, 1.0), 0.5)).r;
  float rowJit = snoise(vec3(z*9.0, 0.0, uTime*0.3))*0.5+0.5;
  float h = n*0.045;
  h += center * (n*n*0.38*(0.35+uSpeak) + n2*n2*0.2*uSpeak*rowJit);
  h += center * audio * (0.55 + n2*0.6) * uVoice;
  float dm = distance(vec2(x, z), uMouse);
  h += exp(-dm*dm*5.0) * 0.32 * uMouseStrength * (0.55 + 0.45*n2);
  for (int i = 0; i < 4; i++) {
    vec4 r = uRipples[i];
    float age = uTime - r.z;
    if (age > 0.0 && age < 4.0) {
      float d = distance(vec2(x, z), r.xy);
      float front = d - age*1.35;
      h += sin(front*14.0) * exp(-front*front*10.0) * (1.0 - age/4.0) * 0.14 * r.w;
    }
  }
  return h * (1.0 - uScroll*0.85);
}`

const LINE_VERT = /* glsl */ `
${HEIGHT}
attribute float aRow;
varying float vH;
varying float vRow;
varying float vX;
void main(){
  vec3 p = position;
  float h = fieldHeight(p.x, p.z);
  p.y = h;
  vH = h; vRow = aRow; vX = p.x;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const LINE_FRAG = /* glsl */ `
uniform vec3 uLow;
uniform vec3 uHigh;
uniform vec3 uHot;
uniform float uWidth;
varying float vH;
varying float vRow;
varying float vX;
void main(){
  float k = smoothstep(0.02, 0.34, vH);
  vec3 col = mix(uLow, uHigh, k);
  col = mix(col, uHot, smoothstep(0.32, 0.55, vH));
  float edge = 1.0 - smoothstep(0.72, 1.0, abs(vX)/uWidth);
  float a = mix(0.32, 1.0, pow(vRow, 1.2)) * edge;
  gl_FragColor = vec4(col, a);
}`

const STRIP_VERT = /* glsl */ `
${HEIGHT}
attribute float aTop;
void main(){
  vec3 p = position;
  float h = fieldHeight(p.x, p.z);
  p.y = mix(-0.6, h - 0.002, aTop);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
}`

const STRIP_FRAG = /* glsl */ `
uniform vec3 uBg;
void main(){ gl_FragColor = vec4(uBg, 1.0); }`

export type VoiceField = {
  setMic: (on: boolean) => Promise<boolean>
  onLevel: (fn: (level: number) => void) => void
  destroy: () => void
}

export function createVoiceField(canvas: HTMLCanvasElement, opts: { reduced?: boolean; bg?: string } = {}): VoiceField {
  const ROWS = 56
  const COLS = 200
  const WIDTH = 2.7
  const Z0 = -2.6
  const Z1 = 1.1

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false, powerPreference: 'high-performance' })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  const bg = new THREE.Color(opts.bg ?? '#05080d')
  renderer.setClearColor(bg, 1)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 30)
  camera.position.set(0, 1.05, 3.1)
  camera.lookAt(0, 0.05, -0.4)

  const audioData = new Uint8Array(64)
  const audioTex = new THREE.DataTexture(audioData, 64, 1, THREE.RedFormat, THREE.UnsignedByteType)
  audioTex.magFilter = THREE.LinearFilter
  audioTex.minFilter = THREE.LinearFilter
  audioTex.needsUpdate = true

  const uniforms = {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uVoice: { value: 0 },
    uSpeak: { value: 0.6 },
    uMouse: { value: new THREE.Vector2(0, -10) },
    uMouseStrength: { value: 0 },
    uRipples: { value: [0, 1, 2, 3].map(() => new THREE.Vector4(0, 0, -100, 0)) },
    uAudio: { value: audioTex },
    uWidth: { value: WIDTH },
    uLow: { value: new THREE.Color('#5a7486') },
    uHigh: { value: new THREE.Color('#f2df74') },
    uHot: { value: new THREE.Color('#ff6b5e') },
    uBg: { value: bg },
  }

  // Geometry: line segments per row + vertical strips for occlusion.
  const linePos: number[] = []
  const lineRow: number[] = []
  const stripPos: number[] = []
  const stripTop: number[] = []
  const stripIdx: number[] = []
  for (let r = 0; r < ROWS; r++) {
    const t = r / (ROWS - 1)
    const z = Z0 + (Z1 - Z0) * t
    for (let c = 0; c < COLS - 1; c++) {
      const x0 = -WIDTH + (2 * WIDTH * c) / (COLS - 1)
      const x1 = -WIDTH + (2 * WIDTH * (c + 1)) / (COLS - 1)
      linePos.push(x0, 0, z, x1, 0, z)
      lineRow.push(t, t)
    }
    const base = stripPos.length / 3
    for (let c = 0; c < COLS; c++) {
      const x = -WIDTH + (2 * WIDTH * c) / (COLS - 1)
      stripPos.push(x, 0, z, x, 0, z)
      stripTop.push(1, 0)
      if (c < COLS - 1) {
        const a = base + c * 2
        stripIdx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
      }
    }
  }

  const lineGeo = new THREE.BufferGeometry()
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePos, 3))
  lineGeo.setAttribute('aRow', new THREE.Float32BufferAttribute(lineRow, 1))
  const lineMat = new THREE.ShaderMaterial({ uniforms, vertexShader: LINE_VERT, fragmentShader: LINE_FRAG, transparent: true, depthWrite: false })
  const lines = new THREE.LineSegments(lineGeo, lineMat)
  lines.frustumCulled = false
  lines.renderOrder = 2

  const stripGeo = new THREE.BufferGeometry()
  stripGeo.setAttribute('position', new THREE.Float32BufferAttribute(stripPos, 3))
  stripGeo.setAttribute('aTop', new THREE.Float32BufferAttribute(stripTop, 1))
  stripGeo.setIndex(stripIdx)
  const stripMat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: STRIP_VERT,
    fragmentShader: STRIP_FRAG,
    side: THREE.DoubleSide,
    polygonOffset: true,
    polygonOffsetFactor: 1,
    polygonOffsetUnits: 1,
  })
  const strips = new THREE.Mesh(stripGeo, stripMat)
  strips.frustumCulled = false
  strips.renderOrder = 1

  scene.add(strips, lines)

  // Sizing
  const resize = () => {
    const w = canvas.clientWidth
    const h = canvas.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h, false)
    camera.aspect = w / h
    // keep the field filling the width on portrait screens
    camera.fov = w / h < 1 ? 52 : 36
    camera.updateProjectionMatrix()
  }
  const ro = new ResizeObserver(resize)
  ro.observe(canvas)
  resize()

  // Pointer → plane y=0
  const ray = new THREE.Raycaster()
  const plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0)
  const ndc = new THREE.Vector2()
  const hit = new THREE.Vector3()
  const mouseTarget = new THREE.Vector2(0, -10)
  let mouseActive = 0
  const toWorld = (e: PointerEvent) => {
    const r = canvas.getBoundingClientRect()
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1)
    ray.setFromCamera(ndc, camera)
    return ray.ray.intersectPlane(plane, hit) ? hit : null
  }
  const onMove = (e: PointerEvent) => {
    const p = toWorld(e)
    if (p) {
      mouseTarget.set(p.x, p.z)
      mouseActive = 1
    }
  }
  const onLeave = () => (mouseActive = 0)
  let rippleIdx = 0
  const onDown = (e: PointerEvent) => {
    const p = toWorld(e)
    if (!p) return
    uniforms.uRipples.value[rippleIdx % 4].set(p.x, p.z, uniforms.uTime.value, 1)
    rippleIdx++
  }
  const target = canvas.parentElement ?? canvas
  target.addEventListener('pointermove', onMove)
  target.addEventListener('pointerleave', onLeave)
  target.addEventListener('pointerdown', onDown)

  // Scroll fade
  const onScroll = () => {
    const r = canvas.getBoundingClientRect()
    uniforms.uScroll.value = Math.min(1, Math.max(0, -r.top / (r.height || 1)))
  }
  window.addEventListener('scroll', onScroll, { passive: true })

  // Mic
  let audioCtx: AudioContext | null = null
  let analyser: AnalyserNode | null = null
  let stream: MediaStream | null = null
  let freq: Uint8Array<ArrayBuffer> | null = null
  let micOn = false
  let levelFn: ((l: number) => void) | null = null

  const setMic = async (on: boolean) => {
    if (on && !micOn) {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: true, noiseSuppression: true } })
        audioCtx = new AudioContext()
        const src = audioCtx.createMediaStreamSource(stream)
        analyser = audioCtx.createAnalyser()
        analyser.fftSize = 512
        analyser.smoothingTimeConstant = 0.78
        src.connect(analyser)
        freq = new Uint8Array(analyser.frequencyBinCount)
        micOn = true
        return true
      } catch {
        return false
      }
    }
    if (!on && micOn) {
      stream?.getTracks().forEach((t) => t.stop())
      audioCtx?.close()
      audioCtx = null
      analyser = null
      stream = null
      micOn = false
      audioData.fill(0)
      audioTex.needsUpdate = true
    }
    return micOn
  }

  // Visibility
  let visible = true
  const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
  io.observe(canvas)

  const clock = new THREE.Clock()
  let raf = 0
  let destroyed = false
  const speakSeed = Math.random() * 100

  const frame = () => {
    if (destroyed) return
    raf = requestAnimationFrame(frame)
    if (!visible || document.hidden) return
    const dt = Math.min(clock.getDelta(), 0.05)
    const t = (uniforms.uTime.value += opts.reduced ? dt * 0.15 : dt)

    // Simulated speech cadence: phrases of syllables with breaths between.
    const phrase = Math.sin(t * 0.42 + speakSeed) * 0.5 + 0.5
    const syll = Math.pow(Math.abs(Math.sin(t * 5.3 + Math.sin(t * 1.7) * 2.0)), 3)
    const idle = 0.25 + phrase * 0.55 + syll * 0.35 * phrase
    uniforms.uSpeak.value += (idle * (micOn ? 0.35 : 1) - uniforms.uSpeak.value) * 0.08

    const um = uniforms.uMouse.value
    um.lerp(mouseTarget, 0.08)
    uniforms.uMouseStrength.value += (mouseActive - uniforms.uMouseStrength.value) * 0.05

    if (micOn && analyser && freq) {
      analyser.getByteFrequencyData(freq)
      let sum = 0
      // Voice lives roughly in the first ~90 bins at 48kHz/512; spread over 64 texels.
      for (let i = 0; i < 64; i++) {
        const src = Math.floor(2 + i * 1.3)
        const v = freq[src] ?? 0
        audioData[i] = v
        sum += v
      }
      audioTex.needsUpdate = true
      const level = sum / (64 * 255)
      levelFn?.(level)
      uniforms.uVoice.value += (1 - uniforms.uVoice.value) * 0.1
    } else {
      uniforms.uVoice.value += (0 - uniforms.uVoice.value) * 0.1
    }

    renderer.render(scene, camera)
  }
  frame()

  return {
    setMic,
    onLevel: (fn) => (levelFn = fn),
    destroy: () => {
      destroyed = true
      cancelAnimationFrame(raf)
      setMic(false)
      ro.disconnect()
      io.disconnect()
      target.removeEventListener('pointermove', onMove)
      target.removeEventListener('pointerleave', onLeave)
      target.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
      lineGeo.dispose()
      stripGeo.dispose()
      lineMat.dispose()
      stripMat.dispose()
      audioTex.dispose()
      renderer.dispose()
    },
  }
}
