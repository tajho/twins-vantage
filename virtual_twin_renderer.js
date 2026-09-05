// TWINS VANTAGE PRO — Precision Virtual Digital Twin Renderer
// Genera una réplica virtual exacta del Setup (Monitor específico + Chasis + Componentes reales)

function generateVirtualTwinSVG(dev) {
  const isOnline = dev.isOnline;
  const name = dev.computerName;
  const user = dev.activeUser || 'N/D';
  const ip = dev.ip || '0.0.0.0';
  const cpu = dev.cpuShort || dev.cpu || 'CPU';
  const gpu = dev.gpu || 'Gráficos Integrados';
  const ramGB = dev.ramTotalGB || 16;
  const ramSlots = dev.ramModules || '16 GB';
  const mobo = dev.motherboard || 'Placa Base';
  const monitorName = dev.monitor || 'Monitor';
  const resolution = dev.resolution || '1920x1080';
  const isSingleRam = dev.ramChannelType === 'single';
  const isDualRam = dev.ramChannelType === 'dual';
  const isCriticalDisk = dev.alerts && dev.alerts.some(a => a.type === 'critical');

  // Determine Monitor Type & Stand
  const isProArt = monitorName.includes('PA278CV') || monitorName.includes('ProArt');
  const isSamsung = monitorName.includes('S24R35') || monitorName.includes('Samsung');
  const isLG = monitorName.includes('LG');
  const isUltrawide = resolution.includes('2560x1080') || monitorName.includes('Ultrawide');
  const isServerConsole = dev.id === 'SERVIDOR';

  // Determine Chassis & GPU
  const hasRTX4060Ti = gpu.includes('4060 Ti');
  const hasRTX4060 = gpu.includes('4060') && !gpu.includes('Ti');
  const hasRTX3060Ti = gpu.includes('3060 Ti');
  const hasRTX3060 = gpu.includes('3060') && !gpu.includes('Ti');
  const hasGTX1050Ti = gpu.includes('1050 Ti');
  const hasDedicatedGPU = dev.gpuType === 'dedicated';
  const isServerChassis = dev.id === 'SERVIDOR';
  const isLegacyCase = dev.id === 'ARCNADM007' || dev.id === 'ARCNMRKD009';

  // Theme Accent Colors
  let accentColor = '#00f0ff';
  let themeGlow = 'rgba(0, 240, 255, 0.4)';
  if (hasRTX4060Ti || hasRTX4060) {
    accentColor = '#10b981'; // NVIDIA RTX Emerald
    themeGlow = 'rgba(16, 185, 129, 0.4)';
  } else if (hasRTX3060Ti || hasRTX3060) {
    accentColor = '#a855f7'; // Cyber Violet
    themeGlow = 'rgba(168, 85, 247, 0.4)';
  } else if (isServerChassis) {
    accentColor = '#3b82f6'; // Cobalt Blue
    themeGlow = 'rgba(59, 130, 246, 0.4)';
  } else if (isSingleRam) {
    accentColor = '#f59e0b'; // Amber warning for single channel
    themeGlow = 'rgba(245, 158, 11, 0.3)';
  }

  if (!isOnline) {
    accentColor = '#64748b';
    themeGlow = 'rgba(100, 116, 139, 0.1)';
  }

  // ==========================================
  // MONITOR GEOMETRY & STAND
  // ==========================================
  let monX = 30;
  let monY = 40;
  let monW = 280;
  let monH = 175;
  let standSvg = '';

  if (isUltrawide) {
    monW = 320;
    monH = 150;
    monX = 15;
  }

  if (isProArt) {
    // ASUS ProArt Heavy Ergonomic Square Base
    standSvg = `
      <!-- ProArt Heavy Base -->
      <rect x="${monX + monW/2 - 45}" y="${monY + monH + 35}" width="90" height="12" rx="2" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <!-- ProArt Sturdy Neck -->
      <rect x="${monX + monW/2 - 12}" y="${monY + monH}" width="24" height="38" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <rect x="${monX + monW/2 - 4}" y="${monY + monH + 8}" width="8" height="20" rx="4" fill="#020617"/>
      <!-- ASUS ProArt Logo -->
      <text x="${monX + 10}" y="${monY + 12}" fill="#d97706" font-size="8" font-family="sans-serif" font-weight="bold" letter-spacing="1">ASUS ProArt</text>
    `;
  } else if (isSamsung) {
    // Samsung V-Shape / Y-Shape Stand
    standSvg = `
      <!-- Samsung Slim Neck -->
      <polygon points="${monX + monW/2 - 6},${monY + monH} ${monX + monW/2 + 6},${monY + monH} ${monX + monW/2 + 10},${monY + monH + 38} ${monX + monW/2 - 10},${monY + monH + 38}" fill="#334155"/>
      <!-- Samsung Y-Base -->
      <polygon points="${monX + monW/2},${monY + monH + 35} ${monX + monW/2 - 55},${monY + monH + 46} ${monX + monW/2 + 55},${monY + monH + 46}" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
      <text x="${monX + monW/2}" y="${monY + monH - 3}" fill="#64748b" font-size="7" font-family="sans-serif" text-anchor="middle">SAMSUNG IPS</text>
    `;
  } else if (isLG) {
    // LG ArcLine Curved Stand
    standSvg = `
      <!-- LG Arc Base -->
      <rect x="${monX + monW/2 - 10}" y="${monY + monH}" width="20" height="36" fill="#1e293b" stroke="#334155"/>
      <path d="M${monX + monW/2 - 50} ${monY + monH + 44} Q ${monX + monW/2} ${monY + monH + 32} ${monX + monW/2 + 50} ${monY + monH + 44}" fill="none" stroke="#475569" stroke-width="4" stroke-linecap="round"/>
      <text x="${monX + monW/2}" y="${monY + monH - 3}" fill="#64748b" font-size="7" font-family="sans-serif" text-anchor="middle">LG FHD 100Hz</text>
    `;
  } else if (isServerConsole) {
    standSvg = `
      <rect x="${monX + monW/2 - 35}" y="${monY + monH + 20}" width="70" height="15" rx="3" fill="#0f172a" stroke="#3b82f6"/>
      <rect x="${monX + monW/2 - 12}" y="${monY + monH}" width="24" height="22" fill="#1e293b"/>
      <text x="${monX + 12}" y="${monY + 14}" fill="#3b82f6" font-size="8" font-family="monospace" font-weight="bold">DATACENTER CONSOLE</text>
    `;
  } else {
    // Standard Office Stand
    standSvg = `
      <rect x="${monX + monW/2 - 35}" y="${monY + monH + 30}" width="70" height="10" rx="2" fill="#1e293b" stroke="#334155"/>
      <rect x="${monX + monW/2 - 10}" y="${monY + monH}" width="20" height="32" fill="#0f172a"/>
    `;
  }

  // ==========================================
  // CPU TOWER GEOMETRY & INTERNALS
  // ==========================================
  let towerX = 345;
  let towerY = 30;
  let towerW = 185;
  let towerH = 240;

  let towerSvg = '';

  if (isServerChassis) {
    // Enterprise Server Chassis
    towerSvg = `
      <!-- Server Metal Chassis -->
      <rect x="${towerX}" y="${towerY}" width="${towerW}" height="${towerH}" rx="6" fill="#0a0f1d" stroke="#3b82f6" stroke-width="2"/>
      
      <!-- Hot-Swap SAS/SATA Bays (Samsung 990 PRO + 8TB WD Purple) -->
      <rect x="${towerX + 12}" y="${towerY + 15}" width="${towerW - 24}" height="70" rx="4" fill="#02050e" stroke="#1e293b"/>
      
      <!-- Bay slots with LEDs -->
      <rect x="${towerX + 18}" y="${towerY + 22}" width="36" height="56" rx="2" fill="#111827" stroke="#334155"/>
      <circle cx="${towerX + 26}" cy="${towerY + 30}" r="3" fill="#10b981"/>
      <text x="${towerX + 22}" y="${towerY + 68}" fill="#64748b" font-size="7" font-family="monospace">990PRO</text>

      <rect x="${towerX + 60}" y="${towerY + 22}" width="36" height="56" rx="2" fill="#111827" stroke="#334155"/>
      <circle cx="${towerX + 68}" cy="${towerY + 30}" r="3" fill="#10b981"/>
      <text x="${towerX + 64}" y="${towerY + 68}" fill="#64748b" font-size="7" font-family="monospace">SN350</text>

      <rect x="${towerX + 102}" y="${towerY + 22}" width="58" height="56" rx="2" fill="#111827" stroke="#334155"/>
      <circle cx="${towerX + 110}" cy="${towerY + 30}" r="3" fill="#a855f7"/>
      <text x="${towerX + 106}" y="${towerY + 68}" fill="#a855f7" font-size="7" font-family="monospace">8TB PURPLE</text>

      <!-- High Density Honeycomb Fan Vents -->
      <rect x="${towerX + 12}" y="${towerY + 95}" width="${towerW - 24}" height="90" rx="4" fill="#020617" stroke="#1e293b"/>
      <circle cx="${towerX + towerW/2}" cy="${towerY + 140}" r="32" fill="#090d16" stroke="#1e293b" stroke-width="2"/>
      <circle cx="${towerX + towerW/2}" cy="${towerY + 140}" r="16" fill="#0b1329" stroke="#3b82f6" stroke-width="1.5"/>
      
      <!-- Server Badge & Status -->
      <rect x="${towerX + 12}" y="${towerY + 195}" width="${towerW - 24}" height="32" rx="3" fill="#090d16" stroke="#1e293b"/>
      <text x="${towerX + 20}" y="${towerY + 215}" fill="#3b82f6" font-size="9" font-family="monospace" font-weight="bold">ACTIVE DIRECTORY DC</text>
      <circle cx="${towerX + towerW - 25}" cy="${towerY + 211}" r="4" fill="#10b981"/>
    `;
  } else if (hasDedicatedGPU) {
    // Creator & Gaming Workstation with Glass Window, RGB Liquid Cooler & RTX GPU
    towerSvg = `
      <!-- Tower Frame -->
      <rect x="${towerX}" y="${towerY}" width="${towerW}" height="${towerH}" rx="8" fill="#070c18" stroke="${accentColor}" stroke-width="2"/>
      
      <!-- Front Mesh Bezel -->
      <rect x="${towerX + towerW - 32}" y="${towerY + 8}" width="24" height="${towerH - 16}" rx="3" fill="#02050e" stroke="#1e293b"/>
      <circle cx="${towerX + towerW - 20}" cy="${towerY + 25}" r="4" fill="${isOnline ? '#10b981' : '#475569'}"/>
      <line x1="${towerX + towerW - 26}" y1="${towerY + 45}" x2="${towerX + towerW - 14}" y2="${towerY + 45}" stroke="#1e293b" stroke-width="2"/>
      <line x1="${towerX + towerW - 26}" y1="${towerY + 65}" x2="${towerX + towerW - 14}" y2="${towerY + 65}" stroke="#1e293b" stroke-width="2"/>
      <line x1="${towerX + towerW - 26}" y1="${towerY + 85}" x2="${towerX + towerW - 14}" y2="${towerY + 85}" stroke="#1e293b" stroke-width="2"/>

      <!-- Tempered Glass Side Window -->
      <rect x="${towerX + 8}" y="${towerY + 8}" width="${towerW - 46}" height="${towerH - 16}" rx="4" fill="#0b1120" stroke="#1e293b" stroke-width="1.5"/>
      
      <!-- Motherboard Label -->
      <text x="${towerX + 16}" y="${towerY + 24}" fill="#64748b" font-size="7" font-family="monospace">${mobo.split(' ')[0]} ${mobo.split(' ')[1] || ''}</text>

      <!-- Liquid Cooler Pump / RGB Fan -->
      <circle cx="${towerX + 55}" cy="${towerY + 65}" r="22" fill="#02050e" stroke="${accentColor}" stroke-width="2.5"/>
      <circle cx="${towerX + 55}" cy="${towerY + 65}" r="12" fill="#070c1b"/>
      <text x="${towerX + 55}" y="${towerY + 68}" fill="${accentColor}" font-size="7" font-family="sans-serif" font-weight="bold" text-anchor="middle">CPU</text>

      <!-- RAM Slots (Shows 1, 2 or 4 sticks) -->
      <rect x="${towerX + 90}" y="${towerY + 45}" width="5" height="38" rx="1.5" fill="${isSingleRam ? '#f59e0b' : accentColor}"/>
      <rect x="${towerX + 98}" y="${towerY + 45}" width="5" height="38" rx="1.5" fill="${isDualRam ? accentColor : '#1e293b'}"/>
      <rect x="${towerX + 106}" y="${towerY + 45}" width="5" height="38" rx="1.5" fill="${ramSlots.includes('4 modulos') ? accentColor : '#1e293b'}"/>
      <rect x="${towerX + 114}" y="${towerY + 45}" width="5" height="38" rx="1.5" fill="${ramSlots.includes('4 modulos') ? accentColor : '#1e293b'}"/>

      <!-- Dedicated GPU Card (GeForce RTX) -->
      <rect x="${towerX + 16}" y="${towerY + 110}" width="${towerW - 62}" height="42" rx="4" fill="#1e1b4b" stroke="#4f46e5" stroke-width="1.5"/>
      <circle cx="${towerX + 45}" cy="${towerY + 131}" r="12" fill="#02050e" stroke="#38bdf8" stroke-width="1.5"/>
      <circle cx="${towerX + 85}" cy="${towerY + 131}" r="12" fill="#02050e" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="${towerX + 105}" y="${towerY + 135}" fill="#a5b4fc" font-size="8" font-family="monospace" font-weight="bold">${hasRTX4060Ti ? 'RTX 4060Ti' : (hasRTX4060 ? 'RTX 4060' : (hasRTX3060Ti ? 'RTX 3060Ti' : (hasRTX3060 ? 'RTX 3060' : 'GTX 1050Ti')))}</text>

      <!-- Power Supply Shroud -->
      <rect x="${towerX + 12}" y="${towerY + 175}" width="${towerW - 54}" height="45" rx="3" fill="#020617" stroke="#1e293b"/>
      <text x="${towerX + 24}" y="${towerY + 202}" fill="#475569" font-size="8" font-family="sans-serif" font-weight="bold" letter-spacing="1">TWINS CREATOR</text>
    `;
  } else {
    // Corporate Office Workstation (MSI PRO / ThinkCentre Style)
    towerSvg = `
      <!-- Tower Case -->
      <rect x="${towerX}" y="${towerY}" width="${towerW}" height="${towerH}" rx="6" fill="#090e1a" stroke="#334155" stroke-width="2"/>
      
      <!-- Front Brushed Aluminum Bezel -->
      <rect x="${towerX + 10}" y="${towerY + 10}" width="${towerW - 20}" height="${towerH - 20}" rx="4" fill="#030712" stroke="#1e293b"/>
      
      <!-- Top Drive / Port Bay -->
      <rect x="${towerX + 22}" y="${towerY + 22}" width="${towerW - 44}" height="32" rx="3" fill="#0f172a" stroke="#1e293b"/>
      <circle cx="${towerX + 38}" cy="${towerY + 38}" r="4.5" fill="${isOnline ? '#10b981' : '#475569'}"/>
      <rect x="${towerX + 55}" y="${towerY + 34}" width="10" height="7" rx="1" fill="#38bdf8"/>
      <rect x="${towerX + 70}" y="${towerY + 34}" width="10" height="7" rx="1" fill="#38bdf8"/>

      <!-- Center Kingston NVMe Gen4 Badge -->
      <rect x="${towerX + 22}" y="${towerY + 68}" width="${towerW - 44}" height="40" rx="3" fill="#070c1b" stroke="#1e293b"/>
      <text x="${towerX + 30}" y="${towerY + 84}" fill="#38bdf8" font-size="8" font-family="monospace" font-weight="bold">KINGSTON NVMe</text>
      <text x="${towerX + 30}" y="${towerY + 98}" fill="${isSingleRam ? '#f59e0b' : '#10b981'}" font-size="7" font-family="monospace">${ramGB}GB ${isSingleRam ? 'SINGLE CH' : 'DUAL CH'}</text>

      <!-- Ventilation Lower Slits -->
      <rect x="${towerX + 22}" y="${towerY + 120}" width="${towerW - 44}" height="90" rx="3" fill="#02050e" stroke="#1e293b"/>
      <line x1="${towerX + 30}" y1="${towerY + 140}" x2="${towerX + towerW - 30}" y2="${towerY + 140}" stroke="#1e293b" stroke-width="2"/>
      <line x1="${towerX + 30}" y1="${towerY + 155}" x2="${towerX + towerW - 30}" y2="${towerY + 155}" stroke="#1e293b" stroke-width="2"/>
      <line x1="${towerX + 30}" y1="${towerY + 170}" x2="${towerX + towerW - 30}" y2="${towerY + 170}" stroke="#1e293b" stroke-width="2"/>
      <line x1="${towerX + 30}" y1="${towerY + 185}" x2="${towerX + towerW - 30}" y2="${towerY + 185}" stroke="#1e293b" stroke-width="2"/>

      <text x="${towerX + towerW/2}" y="${towerY + 200}" fill="#475569" font-size="8" font-family="sans-serif" font-weight="bold" text-anchor="middle">UTILES TWINS</text>
    `;
  }

  // ==========================================
  // COMPLETE VIRTUAL TWIN SVG RENDER
  // ==========================================
  return `
    <svg viewBox="0 0 560 300" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="w-full h-full select-none">
      <defs>
        <filter id="twinGlow_${name}" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
        <linearGradient id="screenGrad_${name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#070d1e"/>
          <stop offset="100%" stop-color="#02050c"/>
        </linearGradient>
      </defs>

      <!-- Desk Base & Ambient Floor Glow -->
      <ellipse cx="280" cy="275" rx="240" ry="16" fill="#000000" opacity="0.6" filter="blur(8px)"/>
      <line x1="20" y1="275" x2="540" y2="275" stroke="#1e293b" stroke-width="2"/>

      <!-- MONITOR STAND -->
      ${standSvg}

      <!-- MONITOR BEZEL & SCREEN -->
      <rect x="${monX}" y="${monY}" width="${monW}" height="${monH}" rx="6" fill="#020617" stroke="#334155" stroke-width="2.5"/>
      <rect x="${monX + 6}" y="${monY + 6}" width="${monW - 12}" height="${monH - 12}" rx="3" fill="url(#screenGrad_${name})"/>

      <!-- MONITOR LIVE SCREEN INTERFACE (DIGITAL TWIN) -->
      ${isOnline ? `
        <!-- Top Title Bar -->
        <rect x="${monX + 12}" y="${monY + 12}" width="${monW - 24}" height="22" rx="2" fill="#0b1329"/>
        <text x="${monX + 18}" y="${monY + 27}" fill="${accentColor}" font-size="9" font-family="monospace" font-weight="bold">${name}</text>
        <text x="${monX + monW - 20}" y="${monY + 27}" fill="#10b981" font-size="8" font-family="monospace" text-anchor="end">${ip}</text>

        <!-- User & Department Box -->
        <rect x="${monX + 12}" y="${monY + 38}" width="${(monW - 30)/2}" height="60" rx="3" fill="#080e22" stroke="#1e293b"/>
        <text x="${monX + 18}" y="${monY + 52}" fill="#64748b" font-size="7" font-family="sans-serif">USUARIO ACTIVO:</text>
        <text x="${monX + 18}" y="${monY + 68}" fill="#ffffff" font-size="11" font-family="monospace" font-weight="bold">${user}</text>
        <text x="${monX + 18}" y="${monY + 84}" fill="#38bdf8" font-size="8" font-family="sans-serif">${dev.department}</text>

        <!-- CPU & GPU Box -->
        <rect x="${monX + 18 + (monW - 30)/2}" y="${monY + 38}" width="${(monW - 30)/2}" height="60" rx="3" fill="#080e22" stroke="#1e293b"/>
        <text x="${monX + 24 + (monW - 30)/2}" y="${monY + 52}" fill="#64748b" font-size="7" font-family="sans-serif">HARDWARE:</text>
        <text x="${monX + 24 + (monW - 30)/2}" y="${monY + 66}" fill="#00f0ff" font-size="8" font-family="monospace" font-weight="bold">${cpu.substring(0, 18)}</text>
        <text x="${monX + 24 + (monW - 30)/2}" y="${monY + 79}" fill="#a855f7" font-size="8" font-family="monospace" font-weight="bold">${gpu.substring(0, 18)}</text>
        <text x="${monX + 24 + (monW - 30)/2}" y="${monY + 92}" fill="${isSingleRam ? '#f59e0b' : '#10b981'}" font-size="7" font-family="monospace">${ramGB} GB (${isSingleRam ? 'SINGLE CH' : 'DUAL CH'})</text>

        <!-- Storage Bar Bottom -->
        <rect x="${monX + 12}" y="${monY + 104}" width="${monW - 24}" height="55" rx="3" fill="#050a18" stroke="#1e293b"/>
        <text x="${monX + 18}" y="${monY + 118}" fill="#64748b" font-size="7" font-family="monospace">DISCO C: ${dev.storage.substring(0, 32)}</text>
        
        <rect x="${monX + 18}" y="${monY + 125}" width="${monW - 36}" height="10" rx="2" fill="#1e293b"/>
        <rect x="${monX + 18}" y="${monY + 125}" width="${isCriticalDisk ? 20 : (monW - 36)*0.7}" height="10" rx="2" fill="${isCriticalDisk ? '#ef4444' : '#00f0ff'}"/>
        
        <text x="${monX + 18}" y="${monY + 148}" fill="${isCriticalDisk ? '#ef4444' : '#94a3b8'}" font-size="7" font-family="monospace">${dev.diskSpace || 'Partición C: Óptima'}</text>
      ` : `
        <rect x="${monX + 20}" y="${monY + 50}" width="${monW - 40}" height="65" rx="3" fill="#0a0f1d"/>
        <text x="${monX + monW/2}" y="${monY + 82}" fill="#475569" font-size="13" font-family="monospace" font-weight="bold" text-anchor="middle">STANDBY / APAGADO</text>
        <text x="${monX + monW/2}" y="${monY + 100}" fill="#334155" font-size="9" font-family="monospace" text-anchor="middle">${name}</text>
      `}

      <!-- CPU TOWER CHASSIS -->
      ${towerSvg}

      <!-- Bottom Connection Cable -->
      <path d="M${monX + monW - 15} ${monY + monH - 10} Q ${monX + monW + 20} ${monY + monH + 20} ${towerX + 20} ${towerY + towerH - 20}" fill="none" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateVirtualTwinSVG };
}
