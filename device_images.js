// TWINS VANTAGE PRO — Official Isolated Hardware Renders
// Modelos oficiales de Pantalla + CPU sin fondos de oficina ni distracciones

const VANTAGE_RENDERS = {
  creator: 'images/vantage_tuf_creator.jpg',
  office: 'images/vantage_office_pc.jpg',
  server: 'images/vantage_server_pc.jpg'
};

function getDevicePhoto(dev) {
  if (dev.id === 'SERVIDOR') return VANTAGE_RENDERS.server;
  if (dev.category === 'design' || (dev.department && dev.department.includes('Marketing')) || (dev.gpu && dev.gpu.includes('RTX'))) {
    return VANTAGE_RENDERS.creator;
  }
  return VANTAGE_RENDERS.office;
}

function renderDeviceImage(visualType, computerName, isOnline, dev) {
  if (dev && typeof generateVirtualTwinSVG === 'function') {
    return generateVirtualTwinSVG(dev);
  }
  const photoUrl = dev ? getDevicePhoto(dev) : (visualType.includes('creator') || visualType.includes('gaming') ? VANTAGE_RENDERS.creator : (visualType.includes('server') ? VANTAGE_RENDERS.server : VANTAGE_RENDERS.office));
  
  return `
    <div class="relative w-full h-full bg-[#02050e] rounded-xl overflow-hidden group/img flex items-center justify-center p-1">
      <img src="${photoUrl}" alt="${computerName}" class="w-full h-full object-contain object-center transition-transform duration-500 group-hover/img:scale-105 ${!isOnline ? 'grayscale opacity-40' : ''}" loading="lazy">
      <div class="absolute bottom-2 left-2 right-2 flex items-center justify-between">
        <span class="text-[10px] font-mono font-bold text-white bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          ${computerName}
        </span>
        <span class="${isOnline ? 'text-[#00ff88]' : 'text-slate-400'} text-[10px] font-mono font-bold bg-black/80 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#00ff88] pulse-led' : 'bg-slate-500'}"></span>
          ${isOnline ? 'ONLINE' : 'STANDBY'}
        </span>
      </div>
    </div>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderDeviceImage, getDevicePhoto, VANTAGE_RENDERS };
}
