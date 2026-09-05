// TWINS VANTAGE 3D HARDWARE VIEWER
// Three.js Interactive 3D Setup (Chassis, Curved Screen, GPU, RAM, Cooler, Lighting)

let scene, camera, renderer, controls;
let container3D;
let isRotating = true;
let rgbFans = [];
let fanBlades = [];
let monitorTexture, monitorCanvas, monitorCtx;
let currentPreset = 'rgb';

const PRESET_COLORS = {
  rgb: { main: 0x00f0ff, accent: 0xa855f7, fan: 0xec4899, light: 0x00f0ff },
  it: { main: 0x00f0ff, accent: 0x0284c7, fan: 0x38bdf8, light: 0x00d2ff },
  server: { main: 0x3b82f6, accent: 0x1d4ed8, fan: 0x60a5fa, light: 0x2563eb },
  stealth: { main: 0x10b981, accent: 0x059669, fan: 0x34d399, light: 0x00ff88 }
};

function init3DScene() {
  container3D = document.getElementById('threeCanvasContainer');
  if (!container3D) return;

  // Scene setup
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040711);
  scene.fog = new THREE.FogExp2(0x040711, 0.035);

  const width = container3D.clientWidth || 500;
  const height = container3D.clientHeight || 360;

  // Camera setup
  camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
  camera.position.set(4.5, 2.8, 5.2);

  // Renderer setup
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  container3D.innerHTML = '';
  container3D.appendChild(renderer.domElement);

  // Controls setup
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // don't go below floor
    controls.minDistance = 2.5;
    controls.maxDistance = 10;
    controls.target.set(0, 0.9, 0);
  }

  // Lighting
  setupLighting();

  // Build Objects (Desk, Tower, Curved Monitor, Keyboard, Mouse)
  buildEnvironment();
  buildCurvedMonitor();
  buildPCTower();
  buildPeripherals();

  // Window resize handler
  window.addEventListener('resize', onWindowResize);

  // Animation Loop
  animate3D();
}

function setupLighting() {
  // Ambient Soft Light
  const ambientLight = new THREE.AmbientLight(0x0f172a, 1.8);
  scene.add(ambientLight);

  // Key Directional Light
  const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
  keyLight.position.set(5, 8, 4);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  scene.add(keyLight);

  // Cyber Neon Point Lights
  const cyanPoint = new THREE.PointLight(0x00f0ff, 3.5, 6);
  cyanPoint.position.set(0.8, 1.2, 0.4);
  scene.add(cyanPoint);

  const purplePoint = new THREE.PointLight(0xa855f7, 3.0, 6);
  purplePoint.position.set(-0.8, 1.0, -0.4);
  scene.add(purplePoint);

  const rimLight = new THREE.DirectionalLight(0x00d2ff, 1.5);
  rimLight.position.set(-5, 4, -4);
  scene.add(rimLight);
}

function buildEnvironment() {
  // Cyber Desk Surface
  const deskGeo = new THREE.BoxGeometry(6.5, 0.12, 3.2);
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x0b0f19,
    roughness: 0.25,
    metalness: 0.8
  });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.y = -0.06;
  desk.receiveShadow = true;
  scene.add(desk);

  // Desk Front Bevel Strip (Glowing Neon Edge)
  const stripGeo = new THREE.BoxGeometry(6.52, 0.02, 0.02);
  const stripMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(0, -0.01, 1.6);
  scene.add(strip);

  // Desk Mat (Extended Mousepad)
  const padGeo = new THREE.BoxGeometry(3.6, 0.01, 1.4);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.9 });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(-0.3, 0.005, 0.3);
  scene.add(pad);

  // Cyber Floor Grid
  const gridHelper = new THREE.GridHelper(20, 30, 0x00f0ff, 0x1e293b);
  gridHelper.position.y = -1.2;
  scene.add(gridHelper);
}

function buildCurvedMonitor() {
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(-0.6, 0, 0);

  // Monitor Stand Base
  const baseGeo = new THREE.CylinderGeometry(0.35, 0.4, 0.03, 32);
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(baseGeo, metalMat);
  base.position.set(0, 0.015, 0);
  monitorGroup.add(base);

  // Stand Arm
  const armGeo = new THREE.BoxGeometry(0.08, 0.9, 0.08);
  const arm = new THREE.Mesh(armGeo, metalMat);
  arm.position.set(0, 0.45, -0.1);
  arm.rotation.x = -0.1;
  monitorGroup.add(arm);

  // Curved Screen Frame (Bezel)
  const bezelGeo = new THREE.BoxGeometry(2.4, 1.25, 0.06);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(0, 1.05, 0);
  bezel.castShadow = true;
  monitorGroup.add(bezel);

  // Dynamic Animated Canvas for the Screen
  monitorCanvas = document.createElement('canvas');
  monitorCanvas.width = 1024;
  monitorCanvas.height = 512;
  monitorCtx = monitorCanvas.getContext('2d');

  monitorTexture = new THREE.CanvasTexture(monitorCanvas);
  const screenGeo = new THREE.PlaneGeometry(2.32, 1.18);
  const screenMat = new THREE.MeshBasicMaterial({ map: monitorTexture });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 1.05, 0.032);
  monitorGroup.add(screen);

  // Bottom RGB Ambient Glow beneath the Monitor
  const glowGeo = new THREE.BoxGeometry(2.2, 0.02, 0.02);
  const glowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.position.set(0, 0.42, 0);
  monitorGroup.add(glow);

  scene.add(monitorGroup);
}

function updateMonitorCanvas() {
  if (!monitorCtx) return;

  const w = monitorCanvas.width;
  const h = monitorCanvas.height;
  const time = Date.now() * 0.002;

  // Background
  monitorCtx.fillStyle = '#050a18';
  monitorCtx.fillRect(0, 0, w, h);

  // Grid Lines
  monitorCtx.strokeStyle = 'rgba(0, 210, 255, 0.08)';
  monitorCtx.lineWidth = 1;
  for (let x = 0; x < w; x += 40) {
    monitorCtx.beginPath();
    monitorCtx.moveTo(x, 0);
    monitorCtx.lineTo(x, h);
    monitorCtx.stroke();
  }

  // Header Bar
  monitorCtx.fillStyle = 'rgba(15, 23, 42, 0.85)';
  monitorCtx.fillRect(20, 20, w - 40, 50);
  monitorCtx.fillStyle = '#00f0ff';
  monitorCtx.font = 'bold 22px monospace';
  monitorCtx.fillText('TWINS VANTAGE PRO • FLEET TELEMETRY 2026', 40, 52);

  // Telemetry Rings / Gauges
  drawTelemetryGauge(monitorCtx, 160, 200, 70, (Math.sin(time) * 0.3 + 0.5), 'CPU LOAD', '#00f0ff');
  drawTelemetryGauge(monitorCtx, 340, 200, 70, 0.38, 'RAM 32GB', '#a855f7');
  drawTelemetryGauge(monitorCtx, 520, 200, 70, 0.28, 'NVMe C:', '#10b981');

  // Mini Network Radar Chart
  monitorCtx.fillStyle = '#0b1329';
  monitorCtx.fillRect(640, 100, 340, 200);
  monitorCtx.strokeStyle = '#1e293b';
  monitorCtx.strokeRect(640, 100, 340, 200);

  monitorCtx.fillStyle = '#94a3b8';
  monitorCtx.font = '14px monospace';
  monitorCtx.fillText('ACTIVE DIRECTORY (utilestwins.com)', 660, 130);
  monitorCtx.fillStyle = '#10b981';
  monitorCtx.fillText('STATUS: ONLINE • DC PING: 1ms', 660, 155);

  // Live Pulse Line
  monitorCtx.strokeStyle = '#00f0ff';
  monitorCtx.lineWidth = 3;
  monitorCtx.beginPath();
  for (let i = 0; i < 300; i += 10) {
    const y = 240 + Math.sin(time * 3 + i * 0.05) * 20;
    if (i === 0) monitorCtx.moveTo(660 + i, y);
    else monitorCtx.lineTo(660 + i, y);
  }
  monitorCtx.stroke();

  // Bottom Status
  monitorCtx.fillStyle = '#64748b';
  monitorCtx.font = '13px monospace';
  monitorCtx.fillText('ARCNTID002 | INTEL CORE I5-12400 | RTX 4060 TI | WIN 11 PRO', 40, 480);

  if (monitorTexture) monitorTexture.needsUpdate = true;
}

function drawTelemetryGauge(ctx, cx, cy, radius, percent, label, color) {
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, radius, -Math.PI / 2, -Math.PI / 2 + (Math.PI * 2 * percent));
  ctx.strokeStyle = color;
  ctx.lineWidth = 10;
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 20px monospace';
  ctx.textAlign = 'center';
  ctx.fillText(Math.round(percent * 100) + '%', cx, cy + 6);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '12px monospace';
  ctx.fillText(label, cx, cy + 30);
  ctx.textAlign = 'start';
}

function buildPCTower() {
  const towerGroup = new THREE.Group();
  towerGroup.position.set(1.4, 0, -0.1);

  // Tower Metal Frame (Black Brushed Titanium)
  const caseGeo = new THREE.BoxGeometry(0.85, 1.7, 1.55);
  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    metalness: 0.85,
    roughness: 0.25
  });
  const pcCase = new THREE.Mesh(caseGeo, caseMat);
  pcCase.position.y = 0.85;
  pcCase.castShadow = true;
  pcCase.receiveShadow = true;
  towerGroup.add(pcCase);

  // Tempered Glass Window (Left Side)
  const glassGeo = new THREE.BoxGeometry(0.02, 1.45, 1.4);
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x00d2ff,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.85,
    ior: 1.5
  });
  const glass = new THREE.Mesh(glassGeo, glassMat);
  glass.position.set(-0.43, 0.85, 0);
  towerGroup.add(glass);

  // Front Mesh Panel
  const frontMeshGeo = new THREE.BoxGeometry(0.83, 1.65, 0.04);
  const meshMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.8 });
  const frontMesh = new THREE.Mesh(frontMeshGeo, meshMat);
  frontMesh.position.set(0, 0.85, 0.78);
  towerGroup.add(frontMesh);

  // Dual RGB Front Fans
  for (let i = 0; i < 2; i++) {
    const fanRingGeo = new THREE.TorusGeometry(0.24, 0.025, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
    const ring = new THREE.Mesh(fanRingGeo, ringMat);
    ring.position.set(0, 0.55 + (i * 0.6), 0.77);
    towerGroup.add(ring);
    rgbFans.push(ring);
  }

  // Motherboard (Interior)
  const moboGeo = new THREE.BoxGeometry(0.04, 1.1, 1.1);
  const moboMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.5 });
  const mobo = new THREE.Mesh(moboGeo, moboMat);
  mobo.position.set(0.25, 0.95, 0);
  towerGroup.add(mobo);

  // CPU Liquid Cooler Pump Head (RGB Infinite Mirror)
  const pumpGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.08, 32);
  const pumpMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2 });
  const pump = new THREE.Mesh(pumpGeo, pumpMat);
  pump.rotation.z = Math.PI / 2;
  pump.position.set(0.2, 1.15, -0.1);
  towerGroup.add(pump);

  // Pump Center Glowing Ring
  const pumpRingGeo = new THREE.TorusGeometry(0.09, 0.015, 16, 32);
  const pumpRingMat = new THREE.MeshBasicMaterial({ color: 0xa855f7 });
  const pumpRing = new THREE.Mesh(pumpRingGeo, pumpRingMat);
  pumpRing.rotation.y = Math.PI / 2;
  pumpRing.position.set(0.15, 1.15, -0.1);
  towerGroup.add(pumpRing);
  rgbFans.push(pumpRing);

  // Dual Glowing RAM Sticks
  for (let i = 0; i < 2; i++) {
    const ramGeo = new THREE.BoxGeometry(0.03, 0.32, 0.05);
    const ramMat = new THREE.MeshBasicMaterial({ color: i === 0 ? 0x00f0ff : 0xec4899 });
    const ram = new THREE.Mesh(ramGeo, ramMat);
    ram.position.set(0.18, 1.15, 0.08 + (i * 0.08));
    towerGroup.add(ram);
    rgbFans.push(ram);
  }

  // Dedicated GeForce RTX Graphics Card (Heavy Heatsink & Fans)
  const gpuGeo = new THREE.BoxGeometry(0.28, 0.22, 0.85);
  const gpuMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9, roughness: 0.2 });
  const gpu = new THREE.Mesh(gpuGeo, gpuMat);
  gpu.position.set(0.05, 0.72, -0.05);
  towerGroup.add(gpu);

  // GPU Side Glowing LED Bar (GEFORCE RTX)
  const gpuLedGeo = new THREE.BoxGeometry(0.02, 0.03, 0.7);
  const gpuLedMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const gpuLed = new THREE.Mesh(gpuLedGeo, gpuLedMat);
  gpuLed.position.set(-0.1, 0.72, -0.05);
  towerGroup.add(gpuLed);
  rgbFans.push(gpuLed);

  // Power Supply Shroud (Bottom)
  const psuGeo = new THREE.BoxGeometry(0.8, 0.35, 1.45);
  const psuMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.4 });
  const psu = new THREE.Mesh(psuGeo, psuMat);
  psu.position.set(0, 0.18, 0);
  towerGroup.add(psu);

  // PSU Cutout Twins Badge
  const badgeGeo = new THREE.PlaneGeometry(0.35, 0.1);
  const badgeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const badge = new THREE.Mesh(badgeGeo, badgeMat);
  badge.rotation.y = -Math.PI / 2;
  badge.position.set(-0.41, 0.18, 0.2);
  towerGroup.add(badge);

  scene.add(towerGroup);
}

function buildPeripherals() {
  // Mechanical Keyboard
  const kbGeo = new THREE.BoxGeometry(1.2, 0.04, 0.45);
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
  const kb = new THREE.Mesh(kbGeo, kbMat);
  kb.position.set(-0.35, 0.02, 0.55);
  scene.add(kb);

  // Keyboard RGB Underglow
  const kbGlowGeo = new THREE.BoxGeometry(1.22, 0.01, 0.47);
  const kbGlowMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff });
  const kbGlow = new THREE.Mesh(kbGlowGeo, kbGlowMat);
  kbGlow.position.set(-0.35, 0.005, 0.55);
  scene.add(kbGlow);
  rgbFans.push(kbGlow);

  // Gaming Mouse
  const mouseGeo = new THREE.CapsuleGeometry ? new THREE.CapsuleGeometry(0.06, 0.1, 8, 16) : new THREE.BoxGeometry(0.12, 0.05, 0.2);
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  if (mouse.rotation) mouse.rotation.x = Math.PI / 2;
  mouse.position.set(0.65, 0.03, 0.55);
  scene.add(mouse);
}

function animate3D() {
  requestAnimationFrame(animate3D);

  // Rotate camera gently if auto-rotate is enabled
  if (controls) {
    controls.autoRotate = isRotating;
    controls.autoRotateSpeed = 1.0;
    controls.update();
  }

  // Update animated screen content
  updateMonitorCanvas();

  // Cycle RGB colors dynamically
  const time = Date.now() * 0.003;
  if (currentPreset === 'rgb' && rgbFans.length > 0) {
    const hue = (Math.sin(time) * 0.5 + 0.5);
    const color = new THREE.Color().setHSL(hue, 1, 0.55);
    rgbFans.forEach((mesh, idx) => {
      if (mesh.material) {
        mesh.material.color = color;
      }
    });
  }

  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
}

function onWindowResize() {
  if (!container3D || !camera || !renderer) return;
  const width = container3D.clientWidth;
  const height = container3D.clientHeight;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

// Preset Swapper
function set3DPreset(preset) {
  currentPreset = preset;
  const c = PRESET_COLORS[preset] || PRESET_COLORS.rgb;
  
  rgbFans.forEach((mesh, idx) => {
    if (mesh.material) {
      mesh.material.color = new THREE.Color(idx % 2 === 0 ? c.main : c.accent);
    }
  });
}

function toggle3DRotation() {
  isRotating = !isRotating;
  return isRotating;
}
