// TWINS VANTAGE PRO — Dynamic 3D Hardware Modeling Engine
// Procedural WebGL 3D Generator for Screen & CPU Tower for all 26 Corporate PCs

// Cache for active 3D scenes
const active3DScenes = new Map();

function buildComputer3DGroup(dev) {
  const compGroup = new THREE.Group();
  const isOnline = dev.isOnline;
  const isDesign = dev.department && (dev.department.includes('Marketing') || dev.department.includes('Diseno'));
  const isServer = dev.department && dev.department.includes('Servidor');
  const isIT = dev.department && dev.department.includes('Sistemas');
  const hasRTX = dev.gpu && (dev.gpu.includes('RTX') || dev.gpu.includes('GeForce'));
  const hasSingleRam = dev.ramChannelType === 'single';

  // Theme Accent Colors
  let mainColor = 0x00f0ff;
  let accentColor = 0x3b82f6;
  let fanColor = 0x00f0ff;
  
  if (isDesign) {
    mainColor = 0xa855f7;
    accentColor = 0xec4899;
    fanColor = 0x00f0ff;
  } else if (isServer) {
    mainColor = 0x2563eb;
    accentColor = 0x1d4ed8;
    fanColor = 0x60a5fa;
  } else if (isIT) {
    mainColor = 0x00f0ff;
    accentColor = 0x0284c7;
    fanColor = 0x00ff88;
  } else {
    // Admin / Sales / Warehouse
    mainColor = 0x38bdf8;
    accentColor = 0x1e293b;
    fanColor = 0x38bdf8;
  }

  if (!isOnline) {
    mainColor = 0x475569;
    accentColor = 0x334155;
    fanColor = 0x334155;
  }

  // ==========================================
  // 1. DESK BASE
  // ==========================================
  const deskGeo = new THREE.BoxGeometry(4.8, 0.08, 2.6);
  const deskMat = new THREE.MeshStandardMaterial({
    color: 0x0b0f19,
    roughness: 0.3,
    metalness: 0.8
  });
  const desk = new THREE.Mesh(deskGeo, deskMat);
  desk.position.y = -0.04;
  desk.receiveShadow = true;
  compGroup.add(desk);

  // Desk Front Glow Bezel
  const stripGeo = new THREE.BoxGeometry(4.82, 0.015, 0.015);
  const stripMat = new THREE.MeshBasicMaterial({ color: isOnline ? mainColor : 0x1e293b });
  const strip = new THREE.Mesh(stripGeo, stripMat);
  strip.position.set(0, -0.01, 1.3);
  compGroup.add(strip);

  // Extended Mousepad
  const padGeo = new THREE.BoxGeometry(2.8, 0.008, 1.2);
  const padMat = new THREE.MeshStandardMaterial({ color: 0x05070d, roughness: 0.9 });
  const pad = new THREE.Mesh(padGeo, padMat);
  pad.position.set(-0.35, 0.004, 0.25);
  compGroup.add(pad);

  // ==========================================
  // 2. MONITOR (TAILORED TO SPEC)
  // ==========================================
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(-0.55, 0, 0);

  // Stand Base
  const baseGeo = new THREE.CylinderGeometry(0.28, 0.32, 0.025, 32);
  const standMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.9, roughness: 0.2 });
  const base = new THREE.Mesh(baseGeo, standMat);
  base.position.set(0, 0.0125, 0);
  monitorGroup.add(base);

  // Stand Arm
  const armGeo = new THREE.BoxGeometry(0.06, 0.75, 0.06);
  const arm = new THREE.Mesh(armGeo, standMat);
  arm.position.set(0, 0.38, -0.08);
  arm.rotation.x = -0.08;
  monitorGroup.add(arm);

  // Screen Aspect Ratio & Size
  let screenW = 1.9;
  let screenH = 1.05;
  if (isDesign) {
    screenW = 2.1; // 27" 2K 1440p ProArt
    screenH = 1.15;
  } else if (isServer) {
    screenW = 1.5; // Compact 4:3 / 16:9 console
    screenH = 1.0;
  }

  // Bezel
  const bezelGeo = new THREE.BoxGeometry(screenW + 0.06, screenH + 0.06, 0.05);
  const bezelMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.3 });
  const bezel = new THREE.Mesh(bezelGeo, bezelMat);
  bezel.position.set(0, 0.95, 0);
  bezel.castShadow = true;
  monitorGroup.add(bezel);

  // Dynamic Texture on Screen with PC Specific Info
  const monCanvas = document.createElement('canvas');
  monCanvas.width = 1024;
  monCanvas.height = 512;
  const mCtx = monCanvas.getContext('2d');

  // Draw Screen UI
  mCtx.fillStyle = isOnline ? '#040814' : '#0a0d14';
  mCtx.fillRect(0, 0, 1024, 512);

  if (isOnline) {
    // Header
    mCtx.fillStyle = '#0f172a';
    mCtx.fillRect(20, 20, 984, 50);
    mCtx.fillStyle = isDesign ? '#ec4899' : '#00f0ff';
    mCtx.font = 'bold 22px monospace';
    mCtx.fillText(`TWINS VANTAGE • ${dev.computerName}`, 40, 52);

    mCtx.fillStyle = '#10b981';
    mCtx.font = 'bold 16px monospace';
    mCtx.fillText(`ONLINE • ${dev.ip}`, 780, 52);

    // Active User Box
    mCtx.fillStyle = '#0b132b';
    mCtx.fillRect(40, 100, 440, 180);
    mCtx.strokeStyle = '#1e293b';
    mCtx.strokeRect(40, 100, 440, 180);

    mCtx.fillStyle = '#94a3b8';
    mCtx.font = '16px sans-serif';
    mCtx.fillText('USUARIO ASIGNADO:', 60, 135);
    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 24px monospace';
    mCtx.fillText(dev.activeUser.toUpperCase(), 60, 175);

    mCtx.fillStyle = '#38bdf8';
    mCtx.font = '15px sans-serif';
    mCtx.fillText(`Depto: ${dev.department}`, 60, 210);
    mCtx.fillStyle = '#64748b';
    mCtx.font = '13px monospace';
    mCtx.fillText(dev.os, 60, 245);

    // Hardware Specs Box
    mCtx.fillStyle = '#0b132b';
    mCtx.fillRect(510, 100, 470, 180);
    mCtx.strokeStyle = '#1e293b';
    mCtx.strokeRect(510, 100, 470, 180);

    mCtx.fillStyle = '#94a3b8';
    mCtx.font = '16px sans-serif';
    mCtx.fillText('PROCESADOR & GRÁFICOS:', 530, 135);
    mCtx.fillStyle = '#00f0ff';
    mCtx.font = 'bold 16px monospace';
    mCtx.fillText(dev.cpuShort || dev.cpu, 530, 170);

    mCtx.fillStyle = '#a855f7';
    mCtx.font = 'bold 16px monospace';
    mCtx.fillText(dev.gpu, 530, 205);

    mCtx.fillStyle = '#10b981';
    mCtx.font = 'bold 15px monospace';
    mCtx.fillText(`RAM: ${dev.ramTotalGB} GB (${dev.ramChannels})`, 530, 240);

    // Telemetry Waveform Bottom
    mCtx.fillStyle = '#070d1e';
    mCtx.fillRect(40, 310, 940, 160);
    mCtx.strokeStyle = '#1e2c4a';
    mCtx.strokeRect(40, 310, 940, 160);

    mCtx.fillStyle = '#64748b';
    mCtx.font = '14px monospace';
    mCtx.fillText('DISCO & ALMACENAMIENTO: ' + dev.storage, 60, 345);

    // Disk progress bar
    mCtx.fillStyle = '#1e293b';
    mCtx.fillRect(60, 365, 900, 20);
    mCtx.fillStyle = dev.alerts.some(a => a.type === 'critical') ? '#ef4444' : '#00f0ff';
    mCtx.fillRect(60, 365, 650, 20);

    mCtx.fillStyle = '#ffffff';
    mCtx.font = 'bold 14px monospace';
    mCtx.fillText(dev.diskSpace || 'Partición C: Óptima', 60, 420);
  } else {
    mCtx.fillStyle = '#334155';
    mCtx.font = 'bold 36px monospace';
    mCtx.textAlign = 'center';
    mCtx.fillText('EQUIPO EN STANDBY / OFFLINE', 512, 240);
    mCtx.font = '20px monospace';
    mCtx.fillText(dev.computerName, 512, 290);
    mCtx.textAlign = 'start';
  }

  const monTexture = new THREE.CanvasTexture(monCanvas);
  const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
  const screenMat = new THREE.MeshBasicMaterial({ map: monTexture });
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, 0.95, 0.026);
  monitorGroup.add(screen);

  compGroup.add(monitorGroup);

  // ==========================================
  // 3. CPU TOWER CHASSIS (TAILORED TO SPEC)
  // ==========================================
  const towerGroup = new THREE.Group();
  towerGroup.position.set(1.15, 0, -0.05);

  let towerW = 0.72;
  let towerH = 1.45;
  let towerD = 1.35;

  if (isServer) {
    towerW = 0.85;
    towerH = 1.6;
    towerD = 1.55;
  } else if (isDesign) {
    towerW = 0.78;
    towerH = 1.55;
    towerD = 1.45;
  }

  // Chassis Metal Case
  const caseGeo = new THREE.BoxGeometry(towerW, towerH, towerD);
  const caseMat = new THREE.MeshStandardMaterial({
    color: isServer ? 0x090d16 : 0x0f172a,
    metalness: 0.85,
    roughness: 0.25
  });
  const pcCase = new THREE.Mesh(caseGeo, caseMat);
  pcCase.position.y = towerH / 2;
  pcCase.castShadow = true;
  towerGroup.add(pcCase);

  // Tempered Glass Window (Left Side)
  if (!isServer) {
    const glassGeo = new THREE.BoxGeometry(0.015, towerH - 0.2, towerD - 0.15);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: mainColor,
      transparent: true,
      opacity: isOnline ? 0.35 : 0.15,
      roughness: 0.05,
      metalness: 0.1,
      transmission: 0.85,
      ior: 1.5
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(-towerW / 2 - 0.005, towerH / 2, 0);
    towerGroup.add(glass);
  }

  // Front Mesh & Fans
  const frontGeo = new THREE.BoxGeometry(towerW - 0.04, towerH - 0.06, 0.03);
  const frontMat = new THREE.MeshStandardMaterial({ color: 0x020617, roughness: 0.8 });
  const front = new THREE.Mesh(frontGeo, frontMat);
  front.position.set(0, towerH / 2, towerD / 2 + 0.01);
  towerGroup.add(front);

  // Dual/Triple RGB Front Rings
  if (isOnline) {
    const fanCount = isDesign || isServer ? 3 : 2;
    for (let i = 0; i < fanCount; i++) {
      const ringGeo = new THREE.TorusGeometry(0.18, 0.02, 16, 32);
      const ringMat = new THREE.MeshBasicMaterial({ color: fanColor });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.set(0, 0.35 + (i * 0.45), towerD / 2 + 0.02);
      towerGroup.add(ring);
    }
  }

  // Internal Hardware (Motherboard + GPU + RAM + Liquid Cooler)
  if (!isServer && isOnline) {
    // Motherboard
    const moboGeo = new THREE.BoxGeometry(0.03, 0.9, 0.9);
    const moboMat = new THREE.MeshStandardMaterial({ color: 0x070c1b, roughness: 0.5 });
    const mobo = new THREE.Mesh(moboGeo, moboMat);
    mobo.position.set(0.18, towerH / 2 + 0.1, 0);
    towerGroup.add(mobo);

    // CPU Liquid Cooler Pump
    const pumpGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.06, 32);
    const pumpMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.2 });
    const pump = new THREE.Mesh(pumpGeo, pumpMat);
    pump.rotation.z = Math.PI / 2;
    pump.position.set(0.14, towerH / 2 + 0.25, -0.08);
    towerGroup.add(pump);

    // Pump Glowing Ring
    const pumpRingGeo = new THREE.TorusGeometry(0.07, 0.012, 16, 32);
    const pumpRingMat = new THREE.MeshBasicMaterial({ color: accentColor });
    const pumpRing = new THREE.Mesh(pumpRingGeo, pumpRingMat);
    pumpRing.rotation.y = Math.PI / 2;
    pumpRing.position.set(0.1, towerH / 2 + 0.25, -0.08);
    towerGroup.add(pumpRing);

    // RAM Sticks (1 or 2 or 4 sticks)
    const numSticks = dev.ramModules.includes('4 modulos') ? 4 : (hasSingleRam ? 1 : 2);
    for (let i = 0; i < numSticks; i++) {
      const ramGeo = new THREE.BoxGeometry(0.02, 0.25, 0.035);
      const ramMat = new THREE.MeshBasicMaterial({ color: hasSingleRam ? 0xf59e0b : mainColor });
      const ram = new THREE.Mesh(ramGeo, ramMat);
      ram.position.set(0.14, towerH / 2 + 0.25, 0.06 + (i * 0.05));
      towerGroup.add(ram);
    }

    // Dedicated GPU (GeForce RTX)
    if (hasRTX) {
      const gpuGeo = new THREE.BoxGeometry(0.24, 0.18, 0.72);
      const gpuMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, metalness: 0.9, roughness: 0.2 });
      const gpu = new THREE.Mesh(gpuGeo, gpuMat);
      gpu.position.set(0.04, towerH / 2 - 0.12, -0.04);
      towerGroup.add(gpu);

      // GPU Side LED (GEFORCE RTX)
      const gpuLedGeo = new THREE.BoxGeometry(0.015, 0.025, 0.6);
      const gpuLedMat = new THREE.MeshBasicMaterial({ color: mainColor });
      const gpuLed = new THREE.Mesh(gpuLedGeo, gpuLedMat);
      gpuLed.position.set(-0.09, towerH / 2 - 0.12, -0.04);
      towerGroup.add(gpuLed);
    }
  }

  // Server Drive Bays Indicator (If Server)
  if (isServer) {
    for (let b = 0; b < 4; b++) {
      const bayGeo = new THREE.BoxGeometry(towerW - 0.1, 0.14, 0.02);
      const bayMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });
      const bay = new THREE.Mesh(bayGeo, bayMat);
      bay.position.set(0, 1.25 - (b * 0.18), towerD / 2 + 0.02);
      towerGroup.add(bay);

      // Status LED
      const ledGeo = new THREE.SphereGeometry(0.015, 8, 8);
      const ledMat = new THREE.MeshBasicMaterial({ color: b === 3 ? 0xa855f7 : 0x00ff88 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(towerW / 2 - 0.1, 1.25 - (b * 0.18), towerD / 2 + 0.035);
      towerGroup.add(led);
    }
  }

  compGroup.add(towerGroup);

  // ==========================================
  // 4. KEYBOARD & MOUSE
  // ==========================================
  const kbGeo = new THREE.BoxGeometry(0.95, 0.03, 0.38);
  const kbMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
  const kb = new THREE.Mesh(kbGeo, kbMat);
  kb.position.set(-0.35, 0.015, 0.45);
  compGroup.add(kb);

  if (isOnline) {
    const kbGlowGeo = new THREE.BoxGeometry(0.97, 0.008, 0.4);
    const kbGlowMat = new THREE.MeshBasicMaterial({ color: mainColor });
    const kbGlow = new THREE.Mesh(kbGlowGeo, kbGlowMat);
    kbGlow.position.set(-0.35, 0.005, 0.45);
    compGroup.add(kbGlow);
  }

  const mouseGeo = new THREE.BoxGeometry(0.1, 0.04, 0.16);
  const mouseMat = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.3 });
  const mouse = new THREE.Mesh(mouseGeo, mouseMat);
  mouse.position.set(0.45, 0.02, 0.45);
  compGroup.add(mouse);

  return compGroup;
}

// Interactive 3D Viewport Launcher for Detail Drawer / Hero
function mountInteractive3DViewport(containerId, deviceData) {
  const container = document.getElementById(containerId);
  if (!container) return null;

  // Cleanup existing scene on this container
  if (active3DScenes.has(containerId)) {
    const prev = active3DScenes.get(containerId);
    if (prev.animId) cancelAnimationFrame(prev.animId);
    if (prev.renderer && prev.renderer.domElement) {
      prev.renderer.dispose();
      prev.renderer.domElement.remove();
    }
    active3DScenes.delete(containerId);
  }

  const width = container.clientWidth || 480;
  const height = container.clientHeight || 320;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x040711);

  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(3.8, 2.4, 4.2);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  container.innerHTML = '';
  container.appendChild(renderer.domElement);

  let controls = null;
  if (THREE.OrbitControls) {
    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 8.0;
    controls.target.set(0, 0.8, 0);
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.2;
  }

  // Lights
  const ambient = new THREE.AmbientLight(0x0f172a, 2.0);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.0);
  keyLight.position.set(5, 7, 4);
  scene.add(keyLight);

  const neonPoint = new THREE.PointLight(0x00f0ff, 3.0, 6);
  neonPoint.position.set(0.6, 1.2, 0.4);
  scene.add(neonPoint);

  const floorGrid = new THREE.GridHelper(15, 20, 0x00f0ff, 0x1e293b);
  floorGrid.position.y = -0.05;
  scene.add(floorGrid);

  // Add 3D Model
  const model = buildComputer3DGroup(deviceData);
  scene.add(model);

  let animId = null;
  function renderLoop() {
    animId = requestAnimationFrame(renderLoop);
    if (controls) controls.update();
    renderer.render(scene, camera);
  }
  renderLoop();

  active3DScenes.set(containerId, { scene, camera, renderer, controls, animId });
  return { scene, camera, renderer, controls };
}
