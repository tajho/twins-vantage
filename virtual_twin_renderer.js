// TWINS VANTAGE PRO — Precision Virtual Digital Twin Renderer
// Genera una réplica virtual exacta del Setup PC y de Dispositivos Móviles (Chasis + Silicio + Batería)

function generateVirtualTwinSVG(dev) {
  if (!dev) return '';
  const isOnline = dev.isOnline !== false;
  const name = dev.computerName || 'PC';
  const ip = dev.ip || '0.0.0.0';
  const cpu = dev.cpuShort || dev.cpu || 'CPU';
  const gpu = dev.gpu || 'Gráficos Integrados';
  const ramGB = dev.ramTotalGB || 16;
  const monitorName = dev.monitor || 'Monitor';
  const resolution = dev.resolution || '1920x1080';
  const isSingleRam = dev.ramChannelType === 'single';

  // Determine Monitor Type & Stand
  const isProArt = monitorName.includes('PA278CV') || monitorName.includes('ProArt');
  const isSamsung = monitorName.includes('S24R35') || monitorName.includes('Samsung');
  const isUltrawide = resolution.includes('2560x1080') || monitorName.includes('Ultrawide');
  const isServerConsole = dev.id === 'SERVIDOR';

  // Determine Chassis & GPU
  const hasRTX = gpu.toLowerCase().includes('rtx');
  const isServerChassis = dev.id === 'SERVIDOR';

  let accentColor = '#00f0ff';
  if (hasRTX) accentColor = '#10b981';
  else if (isServerChassis) accentColor = '#3b82f6';
  else if (isSingleRam) accentColor = '#f59e0b';
  if (!isOnline) accentColor = '#64748b';

  let monX = 30, monY = 40, monW = 280, monH = 175;
  if (isUltrawide) { monW = 320; monH = 150; monX = 15; }

  let standSvg = `
    <rect x="${monX + monW/2 - 35}" y="${monY + monH + 30}" width="70" height="10" rx="2" fill="#1e293b" stroke="#334155"/>
    <rect x="${monX + monW/2 - 10}" y="${monY + monH}" width="20" height="32" fill="#0f172a"/>
  `;
  if (isProArt) {
    standSvg = `
      <rect x="${monX + monW/2 - 45}" y="${monY + monH + 35}" width="90" height="12" rx="2" fill="#1e293b" stroke="#334155" stroke-width="1.5"/>
      <rect x="${monX + monW/2 - 12}" y="${monY + monH}" width="24" height="38" fill="#0f172a" stroke="#334155" stroke-width="1.5"/>
      <text x="${monX + 10}" y="${monY + 12}" fill="#d97706" font-size="8" font-family="sans-serif" font-weight="bold">ASUS ProArt</text>
    `;
  } else if (isSamsung) {
    standSvg = `
      <polygon points="${monX + monW/2 - 6},${monY + monH} ${monX + monW/2 + 6},${monY + monH} ${monX + monW/2 + 10},${monY + monH + 38} ${monX + monW/2 - 10},${monY + monH + 38}" fill="#334155"/>
      <polygon points="${monX + monW/2},${monY + monH + 35} ${monX + monW/2 - 55},${monY + monH + 46} ${monX + monW/2 + 55},${monY + monH + 46}" fill="#1e293b" stroke="#475569" stroke-width="1.5"/>
    `;
  }

  let towerX = 345, towerY = 30, towerW = 185, towerH = 240;

  return `
    <svg viewBox="0 0 540 280" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="monGrad_${dev.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#060e22"/>
          <stop offset="100%" stop-color="#02050e"/>
        </linearGradient>
        <linearGradient id="towerGrad_${dev.id}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#0a1226"/>
          <stop offset="100%" stop-color="#040814"/>
        </linearGradient>
      </defs>

      <!-- MONITOR STAND & CHASSIS -->
      ${standSvg}

      <!-- MONITOR DISPLAY -->
      <rect x="${monX}" y="${monY}" width="${monW}" height="${monH}" rx="8" fill="url(#monGrad_${dev.id})" stroke="${accentColor}" stroke-width="1.5"/>
      <rect x="${monX + 6}" y="${monY + 6}" width="${monW - 12}" height="${monH - 12}" rx="4" fill="#030712" stroke="#1e293b"/>

      <!-- MONITOR HUD CONTENT -->
      <text x="${monX + 15}" y="${monY + 25}" fill="${accentColor}" font-size="10" font-family="monospace" font-weight="bold">${name}</text>
      <text x="${monX + 15}" y="${monY + 40}" fill="#94a3b8" font-size="8" font-family="monospace">IP: ${ip}</text>
      <text x="${monX + 15}" y="${monY + 54}" fill="#64748b" font-size="7" font-family="monospace">${resolution} • ${monitorName}</text>
      
      <circle cx="${monX + monW - 20}" cy="${monY + 22}" r="4" fill="${isOnline ? '#00ff88' : '#64748b'}"/>

      <!-- CPU TOWER CHASSIS -->
      <rect x="${towerX}" y="${towerY}" width="${towerW}" height="${towerH}" rx="6" fill="url(#towerGrad_${dev.id})" stroke="${accentColor}" stroke-width="1.5"/>
      
      <!-- Tower Interior Glass Window -->
      <rect x="${towerX + 8}" y="${towerY + 8}" width="${towerW - 16}" height="${towerH - 16}" rx="4" fill="#020612" stroke="#1e293b"/>
      
      <!-- Motherboard -->
      <rect x="${towerX + 15}" y="${towerY + 15}" width="${towerW - 30}" height="140" rx="3" fill="#0a1020" stroke="#334155"/>
      
      <!-- CPU Socket & Cooler -->
      <rect x="${towerX + 25}" y="${towerY + 25}" width="45" height="45" rx="3" fill="#111c38" stroke="${accentColor}"/>
      <text x="${towerX + 47}" y="${towerY + 50}" fill="${accentColor}" font-size="8" font-family="monospace" font-weight="bold" text-anchor="middle">CPU</text>
      
      <!-- RAM Slots -->
      <rect x="${towerX + 78}" y="${towerY + 25}" width="6" height="45" rx="1" fill="${accentColor}"/>
      <rect x="${towerX + 88}" y="${towerY + 25}" width="6" height="45" rx="1" fill="${isSingleRam ? '#334155' : accentColor}"/>
      <text x="${towerX + 82}" y="${towerY + 80}" fill="#94a3b8" font-size="7" font-family="monospace">${ramGB}GB</text>

      <!-- GPU Block -->
      <rect x="${towerX + 20}" y="${towerY + 95}" width="${towerW - 40}" height="32" rx="3" fill="#0d1b33" stroke="${hasRTX ? '#10b981' : '#334155'}"/>
      <text x="${towerX + 30}" y="${towerY + 115}" fill="${hasRTX ? '#10b981' : '#94a3b8'}" font-size="8" font-family="monospace" font-weight="bold">${gpu.substring(0, 18)}</text>

      <!-- PSU & Drive Bays -->
      <rect x="${towerX + 15}" y="${towerY + 165}" width="${towerW - 30}" height="55" rx="3" fill="#080e1c" stroke="#1e293b"/>
      <text x="${towerX + 25}" y="${towerY + 195}" fill="#64748b" font-size="8" font-family="monospace">PSU 80+ • SSD NVMe</text>
    </svg>
  `;
}

// GENERATE MOBILE SMARTPHONE VIRTUAL TWIN SVG (ESQUEMA DE PRECISIÓN)
function generateMobileVirtualTwinSVG(dev) {
  if (!dev) return '';
  const isOnline = dev.isOnline !== false;
  const brand = dev.marca || 'Smartphone';
  const model = dev.dispositivo || 'Dispositivo Móvil';
  const soc = dev.soc || 'Procesador Móvil';
  const ram = dev.ramTotalGB || 8;
  const rom = dev.romTotalGB || 256;
  const bat = dev.bateria || '5,000 mAh';
  const imei1 = dev.imei1 || 'N/A';
  const serial = dev.serial || 'N/A';
  const color = dev.colorEquipo || 'Titanio';
  const isApple = brand === 'Apple';
  const isSamsung = brand === 'Samsung';
  const isHuawei = brand === 'Huawei';

  let accentColor = '#00f0ff';
  if (isApple) accentColor = '#38bdf8';
  else if (isSamsung) accentColor = '#a855f7';
  else if (isHuawei) accentColor = '#f43f5e';

  // Phone geometry
  const phX = 35, phY = 20, phW = 125, phH = 240, phR = isApple ? 22 : 16;

  return `
    <svg viewBox="0 0 540 280" class="w-full h-full select-none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="mobGrad_${dev.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#0b1736"/>
          <stop offset="100%" stop-color="#030816"/>
        </linearGradient>
        <linearGradient id="screenGrad_${dev.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0284c7"/>
          <stop offset="50%" stop-color="#030b1e"/>
          <stop offset="100%" stop-color="#00f0ff"/>
        </linearGradient>
        <linearGradient id="socGrad_${dev.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
      </defs>

      <!-- 1. FRONT SMARTPHONE CHASSIS & SCREEN -->
      <rect x="${phX}" y="${phY}" width="${phW}" height="${phH}" rx="${phR}" fill="url(#mobGrad_${dev.id})" stroke="${accentColor}" stroke-width="1.8"/>
      <rect x="${phX + 4}" y="${phY + 4}" width="${phW - 8}" height="${phH - 8}" rx="${phR - 2}" fill="#020612" stroke="#1e293b"/>
      <rect x="${phX + 6}" y="${phY + 6}" width="${phW - 12}" height="${phH - 12}" rx="${phR - 4}" fill="url(#screenGrad_${dev.id})" opacity="0.15"/>

      <!-- Notch / Punch Hole -->
      ${isApple ? `
        <rect x="${phX + phW/2 - 16}" y="${phY + 10}" width="32" height="9" rx="4.5" fill="#000000" stroke="#334155" stroke-width="0.5"/>
        <circle cx="${phX + phW/2 + 8}" cy="${phY + 14.5}" r="2" fill="#0284c7"/>
      ` : `
        <circle cx="${phX + phW/2}" cy="${phY + 14}" r="3" fill="#000000" stroke="#334155" stroke-width="0.5"/>
        <circle cx="${phX + phW/2}" cy="${phY + 14}" r="1.5" fill="#00f0ff"/>
      `}

      <!-- Status Bar UI Icons inside screen -->
      <text x="${phX + 12}" y="${phY + 16}" fill="#94a3b8" font-size="6" font-family="monospace" font-weight="bold">12:00</text>
      <text x="${phX + phW - 14}" y="${phY + 16}" fill="#00ff88" font-size="6" font-family="monospace" text-anchor="end">5G</text>

      <!-- Screen Telemetry text -->
      <text x="${phX + phW/2}" y="${phY + phH/2 - 10}" fill="#ffffff" font-size="9" font-family="sans-serif" font-weight="bold" text-anchor="middle">${model.split(' ')[0]} ${model.split(' ')[1] || ''}</text>
      <text x="${phX + phW/2}" y="${phY + phH/2 + 5}" fill="${accentColor}" font-size="7" font-family="monospace" text-anchor="middle">${dev.modeloExacto || 'OLED 120Hz'}</text>
      <text x="${phX + phW/2}" y="${phY + phH/2 + 20}" fill="#00ff88" font-size="7" font-family="monospace" font-weight="bold" text-anchor="middle">SALUD 100%</text>

      <!-- Home bar indicator -->
      <rect x="${phX + phW/2 - 20}" y="${phY + phH - 12}" width="40" height="2.5" rx="1.25" fill="#ffffff" opacity="0.6"/>

      <!-- 2. SILICON DIE & MOTHERBOARD ARCHITECTURE (RIGHT SECTION) -->
      <rect x="180" y="20" width="335" height="240" rx="8" fill="#070d1e" stroke="#1e293b" stroke-width="1.2"/>
      
      <!-- Title Header -->
      <text x="195" y="42" fill="${accentColor}" font-size="11" font-family="monospace" font-weight="bold">TELEMETRÍA DE SILICIO &amp; ESQUEMA VIRTUAL</text>
      <line x1="195" y1="48" x2="500" y2="48" stroke="#1e293b" stroke-width="1"/>

      <!-- SoC Processor Die -->
      <rect x="195" y="60" width="145" height="75" rx="5" fill="url(#socGrad_${dev.id})" stroke="${accentColor}" stroke-width="1.2"/>
      <rect x="202" y="67" width="131" height="61" rx="3" fill="#030712" stroke="#334155"/>
      <text x="210" y="82" fill="#38bdf8" font-size="8" font-family="monospace" font-weight="bold">PROCESADOR SoC</text>
      <text x="210" y="96" fill="#ffffff" font-size="8" font-family="sans-serif" font-weight="bold">${soc.split('(')[0]}</text>
      <text x="210" y="110" fill="#94a3b8" font-size="7" font-family="monospace">NPU / Ray Tracing / 5G Modem</text>
      <circle cx="320" cy="78" r="3" fill="#00ff88"/>

      <!-- RAM & ROM Module Matrix -->
      <rect x="350" y="60" width="150" height="75" rx="5" fill="#0b1329" stroke="#a855f7" stroke-width="1.2"/>
      <text x="360" y="78" fill="#c084fc" font-size="8" font-family="monospace" font-weight="bold">MEMORIA &amp; FLASH</text>
      <text x="360" y="96" fill="#00f0ff" font-size="12" font-family="monospace" font-weight="black">${ram} GB <tspan fill="#94a3b8" font-size="8">RAM</tspan></text>
      <text x="430" y="96" fill="#a855f7" font-size="12" font-family="monospace" font-weight="black">${rom} GB <tspan fill="#94a3b8" font-size="8">UFS/NVMe</tspan></text>
      <text x="360" y="120" fill="#64748b" font-size="7" font-family="monospace">High-Throughput Bus</text>

      <!-- Battery Module Cell -->
      <rect x="195" y="145" width="305" height="50" rx="5" fill="#06121e" stroke="#00ff88" stroke-width="1.2"/>
      <text x="205" y="163" fill="#00ff88" font-size="8" font-family="monospace" font-weight="bold">MÓDULO DE BATERÍA &amp; GESTIÓN ENERGÉTICA</text>
      <text x="205" y="180" fill="#ffffff" font-size="10" font-family="monospace" font-weight="bold">${bat}</text>
      <!-- Battery Gauge Bar -->
      <rect x="340" y="165" width="150" height="12" rx="3" fill="#02050e" stroke="#1e293b"/>
      <rect x="342" y="167" width="146" height="8" rx="2" fill="url(#screenGrad_${dev.id})"/>
      <text x="415" y="174" fill="#000000" font-size="6" font-family="monospace" font-weight="bold" text-anchor="middle">100% HEALTH</text>

      <!-- Certified Identifiers Barcode & IMEI Box -->
      <rect x="195" y="203" width="305" height="45" rx="5" fill="#030612" stroke="#334155"/>
      <text x="205" y="218" fill="#94a3b8" font-size="7" font-family="monospace">IMEI 1: <tspan fill="#ffffff" font-weight="bold">${imei1}</tspan></text>
      <text x="205" y="232" fill="#94a3b8" font-size="7" font-family="monospace">SERIAL: <tspan fill="#38bdf8" font-weight="bold">${serial}</tspan></text>
      <text x="400" y="225" fill="#f59e0b" font-size="7" font-family="monospace" font-weight="bold">ACTIVO: ${dev.activo || 'HOMOLOGADO'}</text>
      <text x="400" y="237" fill="#64748b" font-size="6" font-family="monospace">Color: ${color}</text>
    </svg>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateVirtualTwinSVG, generateMobileVirtualTwinSVG };
}
