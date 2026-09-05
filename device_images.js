// TWINS VANTAGE PRO — Official Real Monitor Product Photographs
// Imágenes reales de producto aisladas en alta resolución de cada modelo exacto de monitor

const REAL_MONITOR_IMAGES = {
  lg27: 'images/monitor_lg_27_ips.jpg',
  proart: 'images/monitor_asus_proart.jpg',
  samsung: 'images/monitor_samsung_s24r350.jpg',
  ultrawide: 'images/monitor_lg_ultrawide.jpg',
  asus24: 'images/monitor_asus_24_fhd.jpg',
  rack19: 'images/monitor_rack_console.jpg'
};

function getDeviceMonitorPhoto(dev) {
  if (!dev) return REAL_MONITOR_IMAGES.samsung;
  const m = (dev.monitor || '').toLowerCase();
  const id = dev.id || '';

  if (id === 'SERVIDOR' || m.includes('rack') || m.includes('consola') || m.includes('19"')) {
    return REAL_MONITOR_IMAGES.rack19;
  }
  if (m.includes('proart') || m.includes('pa278cv')) {
    return REAL_MONITOR_IMAGES.proart;
  }
  if (m.includes('ultrawide') || m.includes('29"') || (dev.resolution && dev.resolution.includes('2560x1080'))) {
    return REAL_MONITOR_IMAGES.ultrawide;
  }
  if (id === 'ARCNTID002' || m.includes('601tffp0f099') || (m.includes('lg') && m.includes('27"'))) {
    return REAL_MONITOR_IMAGES.lg27;
  }
  if (m.includes('s24r35') || m.includes('samsung')) {
    return REAL_MONITOR_IMAGES.samsung;
  }
  if (m.includes('asus') || m.includes('22"') || m.includes('24"')) {
    return REAL_MONITOR_IMAGES.asus24;
  }
  if (m.includes('lg')) {
    return REAL_MONITOR_IMAGES.lg27;
  }
  return REAL_MONITOR_IMAGES.samsung;
}

function getDevicePhoto(dev) {
  return getDeviceMonitorPhoto(dev);
}

function getMonitorModelLabel(dev) {
  if (!dev) return 'Monitor Full HD';
  const m = (dev.monitor || '').toLowerCase();
  const id = dev.id || '';

  if (id === 'SERVIDOR') return 'Rack Console 19" 1U';
  if (m.includes('proart') || m.includes('pa278cv')) return 'ASUS ProArt PA278CV 27" 2K';
  if (m.includes('ultrawide') || m.includes('29"')) return 'LG UltraWide 29" IPS';
  if (id === 'ARCNTID002' || (m.includes('lg') && m.includes('27"'))) return 'LG FHD 27" IPS (100Hz)';
  if (m.includes('s24r35') || m.includes('samsung')) return 'Samsung S24R350 24" IPS';
  if (m.includes('asus') && m.includes('24"')) return 'ASUS Frameless 24" IPS';
  if (m.includes('asus') || m.includes('22"')) return 'ASUS Eye Care 22" FHD';
  if (m.includes('lg') && m.includes('24"')) return 'LG FHD 24" IPS';
  return dev.monitor || 'Monitor IPS Full HD';
}

function renderDeviceImage(visualType, computerName, isOnline, dev) {
  const photoUrl = getDeviceMonitorPhoto(dev);
  const monitorLabel = getMonitorModelLabel(dev);

  return `
    <div class="relative w-full h-full bg-[#02050e] rounded-xl overflow-hidden group/img flex items-center justify-center p-1.5">
      <img src="${photoUrl}" alt="${computerName} - ${monitorLabel}" class="w-full h-full object-contain object-center transition-transform duration-500 group-hover/img:scale-105 ${!isOnline ? 'grayscale opacity-40' : ''}" loading="lazy">
      
      <!-- Top Monitor Tag Badge -->
      <div class="absolute top-2 left-2 z-10">
        <span class="text-[9px] font-mono font-bold bg-black/85 backdrop-blur-md text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 shadow-sm">
          <i data-lucide="tv" class="w-2.5 h-2.5 text-cyan-400"></i>
          <span>${monitorLabel}</span>
        </span>
      </div>

      <!-- Bottom Status Bar -->
      <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between z-10">
        <span class="text-[10px] font-mono font-bold text-white bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 shadow-sm">
          ${computerName}
        </span>
        <span class="${isOnline ? 'text-[#00ff88]' : 'text-slate-400'} text-[10px] font-mono font-bold bg-black/85 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1 shadow-sm">
          <span class="w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#00ff88] pulse-led' : 'bg-slate-500'}"></span>
          ${isOnline ? 'ONLINE' : 'STANDBY'}
        </span>
      </div>
    </div>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderDeviceImage, getDevicePhoto, getDeviceMonitorPhoto, getMonitorModelLabel, REAL_MONITOR_IMAGES };
}
