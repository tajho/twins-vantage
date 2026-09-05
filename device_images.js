// TWINS VANTAGE PRO — Photorealistic Hardware Image Catalog & 3D Mapper
// Provee las fotos de estudio de alta definición de Pantalla + CPU para cada una de las 26 PCs

const DEVICE_IMAGES = {
  it: 'images/pc_it_operations.jpg',
  server: 'images/pc_server_datacenter.jpg',
  design: 'images/pc_gaming_creator.jpg',
  admin: 'images/pc_office_admin.jpg',
  sales: 'images/pc_office_admin.jpg',
  warehouse: 'images/pc_office_admin.jpg'
};

function getDevicePhoto(dev) {
  if (dev.id === 'ARCNTID002') return DEVICE_IMAGES.it;
  if (dev.id === 'SERVIDOR') return DEVICE_IMAGES.server;
  if (dev.category === 'design' || (dev.department && dev.department.includes('Marketing'))) {
    return DEVICE_IMAGES.design;
  }
  return DEVICE_IMAGES.admin;
}

function renderDeviceImage(visualType, computerName, isOnline, dev) {
  const photoUrl = dev ? getDevicePhoto(dev) : (visualType.includes('gaming') || visualType.includes('creator') ? DEVICE_IMAGES.design : (visualType.includes('server') ? DEVICE_IMAGES.server : DEVICE_IMAGES.admin));
  
  return `
    <div class="relative w-full h-full rounded-xl overflow-hidden group/img">
      <img src="${photoUrl}" alt="${computerName}" class="w-full h-full object-cover object-center transition-transform duration-500 group-hover/img:scale-105 ${!isOnline ? 'grayscale opacity-50' : ''}" loading="lazy">
      <div class="absolute inset-0 bg-gradient-to-t from-[#040711] via-transparent to-transparent opacity-80"></div>
      <div class="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between">
        <span class="text-[10px] font-mono font-bold text-white bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10">
          ${computerName}
        </span>
        <span class="${isOnline ? 'text-[#00ff88]' : 'text-slate-400'} text-[10px] font-mono font-bold bg-black/70 backdrop-blur-md px-2 py-0.5 rounded border border-white/10 flex items-center gap-1">
          <span class="w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-[#00ff88] pulse-led' : 'bg-slate-500'}"></span>
          ${isOnline ? 'ONLINE' : 'STANDBY'}
        </span>
      </div>
    </div>
  `;
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderDeviceImage, getDevicePhoto, DEVICE_IMAGES };
}
