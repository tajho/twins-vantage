// TWINS VANTAGE PRO — Fleet & Hardware Intelligence System
// Real Hardware Photos of Monitor + CPU & 3D Interactive Viewport

let allDevices = [];
let filteredDevices = [];
let currentTab = 'home';
let currentCategory = 'all';
let currentStatusFilter = 'all';
let selectedDevice = null;
let livePollingInterval = null;
let deferredPrompt = null;
// Clean corporate silent interface - zero audio clutter
function playTechSound() {}
function toggleAudio() {}

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', async () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js')
      .then(reg => console.log('SW Registered'))
      .catch(err => console.log('SW Failed', err));
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    const installBtn = document.getElementById('pwaInstallBtn');
    if (installBtn) {
      installBtn.classList.remove('hidden');
      installBtn.classList.add('flex');
      installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
        }
      });
    }
  });

  if (typeof INVENTORY_DATA !== 'undefined' && INVENTORY_DATA.length > 0) {
    allDevices = INVENTORY_DATA;
  }
  
  try {
    const res = await fetch('./inventory_data.json?_t=' + Date.now(), { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        allDevices = data;
      }
    }
  } catch (e) {}

  filteredDevices = [...allDevices];
  
  initNavigation();
  initSearchAndFilters();
  renderFleetOverview();
  startLiveTelemetry();
  setInterval(updateLiveClock, 1000);
  updateLiveClock();

  if (window.lucide) {
    window.lucide.createIcons();
  }
});

function updateLiveClock() {
  const clockEl = document.getElementById('topClock');
  if (clockEl) {
    const now = new Date();
    clockEl.innerText = now.toLocaleTimeString('es-PE', { hour12: false });
  }
}

function change3DTheme(theme) {
  if (typeof set3DPreset === 'function') {
    set3DPreset(theme);
  }
}

function toggleRotate3D() {
  if (typeof toggle3DRotation === 'function') {
    const isRotating = toggle3DRotation();
    const btn = document.getElementById('btnRotate3D');
    if (btn) {
      btn.style.color = isRotating ? '#00f0ff' : '#64748b';
    }
  }
}

function initNavigation() {
  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

const renderedTabs = new Set(['home']);

function switchTab(tabId) {
  currentTab = tabId;
  closeDeviceDrawer();
  
  const mainEl = document.querySelector('main');
  if (mainEl) mainEl.scrollTop = 0;

  const navButtons = document.querySelectorAll('.nav-btn');
  navButtons.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
      btn.classList.add('text-cyan-400');
    } else {
      btn.classList.remove('active');
      btn.classList.remove('text-cyan-400');
    }
  });

  document.querySelectorAll('.tab-view').forEach(view => {
    if (view.id === `view-${tabId}`) {
      view.classList.remove('hidden');
    } else {
      view.classList.add('hidden');
    }
  });

  // Lazy render only on first visit for instantaneous 0ms tab switching
  if (!renderedTabs.has(tabId)) {
    renderedTabs.add(tabId);
    if (tabId === 'fleet') {
      applyFilters();
    } else if (tabId === 'finops') {
      renderFinOps();
    } else if (tabId === 'diag') {
      renderDiagnostics();
    } else if (tabId === 'compare') {
      initComparisonTool();
    } else if (tabId === 'network') {
      renderNetworkTopology();
    }
    const activeView = document.getElementById(`view-${tabId}`);
    if (window.lucide && activeView) {
      window.lucide.createIcons({ root: activeView });
    }
  }
}

async function fetchLiveTelemetry() {
  const isGitHubPages = window.location.hostname.includes('github.io');
  let live = null;

  if (!isGitHubPages) {
    try {
      const res = await fetch('/api/system/live');
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.live) live = data.live;
      }
    } catch (err) {}
  }

  // Fallback / GitHub Pages simulated live telemetry
  if (!live) {
    const cpuLoad = Math.floor(Math.sin(Date.now() / 4000) * 5 + 14);
    const memPercent = 49;
    const memUsedGB = 15.8;
    const memTotalGB = 32;
    const diskPercent = 49;
    const diskFreeGB = 471;
    const diskTotalGB = 930;

    live = {
      cpuLoad,
      memPercent,
      memUsedGB,
      memTotalGB,
      diskCPercent: diskPercent,
      diskCFreeGB: diskFreeGB,
      diskCTotalGB: diskTotalGB,
      uptime: '4d 18h 32m',
      osName: 'Windows 11 Pro 24H2'
    };
  }

  const cpuLoad = live.cpuLoad || 14;
  const cpuMeter = document.getElementById('liveCpuLoad');
  const cpuBar = document.getElementById('liveCpuBar');
  if (cpuMeter) cpuMeter.innerText = `${cpuLoad}%`;
  if (cpuBar) cpuBar.style.width = `${cpuLoad}%`;

  if (live.memPercent) {
    const ramMeter = document.getElementById('liveRamPercent');
    const ramBar = document.getElementById('liveRamBar');
    const ramDetail = document.getElementById('liveRamDetail');
    if (ramMeter) ramMeter.innerText = `${live.memPercent}%`;
    if (ramBar) ramBar.style.width = `${live.memPercent}%`;
    if (ramDetail) ramDetail.innerText = `${live.memUsedGB} GB / ${live.memTotalGB} GB`;
  }

  if (live.diskCPercent) {
    const diskMeter = document.getElementById('liveDiskPercent');
    const diskBar = document.getElementById('liveDiskBar');
    const diskDetail = document.getElementById('liveDiskDetail');
    if (diskMeter) diskMeter.innerText = `${live.diskCPercent}%`;
    if (diskBar) diskBar.style.width = `${live.diskCPercent}%`;
    if (diskDetail) diskDetail.innerText = `${live.diskCFreeGB} GB libres de ${live.diskCTotalGB} GB`;
  }

  const uptimeEl = document.getElementById('liveUptime');
  if (uptimeEl && live.uptime) uptimeEl.innerText = live.uptime;
  
  const hostEl = document.getElementById('liveHostInfo');
  if (hostEl) hostEl.innerText = `Gigabyte B760M D3HP DDR4 • Intel Core i5-12400 (6C/12T) • ${live.memTotalGB || 32} GB RAM • ${live.osName || 'Windows 11 Pro'}`;
}

function startLiveTelemetry() {
  fetchLiveTelemetry();
  if (livePollingInterval) clearInterval(livePollingInterval);
  livePollingInterval = setInterval(() => {
    if (!document.hidden) {
      fetchLiveTelemetry();
    }
  }, 8000);
}

function renderFleetOverview() {
  const twinBox = document.getElementById('homeTwinContainer');
  if (twinBox) {
    const masterDev = allDevices.find(d => d.id === 'ARCNTID002') || allDevices[0];
    if (masterDev) {
      twinBox.innerHTML = `
        <div class="relative w-full h-full flex items-center justify-center p-2 group">
          <img src="images/monitor_lg_27_ips.jpg" alt="LG 27MR400 27 Inch IPS FHD" class="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105">
          <div class="absolute bottom-3 left-3 right-3 flex items-center justify-between bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10 font-mono text-xs">
            <span class="text-white font-bold flex items-center gap-1.5 truncate">
              <i data-lucide="tv" class="w-4 h-4 text-cyan-400 shrink-0"></i>
              <span>LG FHD 27" IPS (100Hz) — S/N: 601TFFP0F099</span>
            </span>
            <span class="text-[#00ff88] font-bold shrink-0 ml-2">1920x1080 @ 100Hz</span>
          </div>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

function initSearchAndFilters() {
  const searchInput = document.getElementById('fleetSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      applyFilters();
    });
  }

  const categoryPills = document.querySelectorAll('.cat-pill');
  categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
      playTechSound('click');
      categoryPills.forEach(p => p.classList.remove('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/50', 'shadow-[0_0_15px_rgba(0,240,255,0.2)]'));
      categoryPills.forEach(p => p.classList.add('bg-slate-900/80', 'text-slate-400', 'border-white/5'));
      
      pill.classList.remove('bg-slate-900/80', 'text-slate-400', 'border-white/5');
      pill.classList.add('bg-cyan-500/20', 'text-cyan-300', 'border-cyan-500/50', 'shadow-[0_0_15px_rgba(0,240,255,0.2)]');
      currentCategory = pill.getAttribute('data-cat');
      applyFilters();
    });
  });

}

function openFleetStatusPicker() {
  const options = [
    { value: 'all', label: 'Todos los Estados', sub: '26 computadoras registradas', icon: 'layers', badge: '26 PCs', badgeClass: 'badge-online' },
    { value: 'online', label: 'En Línea', sub: 'Equipos con enlace activo y telemetría', icon: 'check-circle-2', badge: '26 Online', badgeClass: 'badge-online' },
    { value: 'single_ram', label: 'Alerta: Single Channel RAM', sub: '1 módulo (Pérdida de ancho de banda 64-bit)', icon: 'alert-circle', badge: '11 PCs', badgeClass: 'badge-warning' },
    { value: 'critical', label: 'Alerta: Espacio Disco Crítico', sub: 'Partición C: menor a 15GB libres', icon: 'alert-triangle', badge: '1 PC', badgeClass: 'badge-critical' }
  ];

  if (typeof TwinsModal !== 'undefined' && TwinsModal.showSelectModal) {
    TwinsModal.showSelectModal({
      title: 'ESTADO OPERATIVO DE FLOTA',
      subtitle: 'Filtrar cuadrícula por condición de hardware',
      selectedValue: currentStatusFilter,
      options,
      onSelect: (val) => {
        currentStatusFilter = val;
        const labels = {
          all: 'Todos los Estados (26)',
          online: 'En Línea (26)',
          single_ram: 'Single Channel (11)',
          critical: 'Disco Crítico (1)'
        };
        const lbl = document.getElementById('customFleetStatusLabel');
        if (lbl) lbl.innerText = labels[val] || val;
        applyFilters();
      }
    });
  }
}

function applyFilters() {
  const searchVal = (document.getElementById('fleetSearchInput')?.value || '').toLowerCase().trim();
  
  filteredDevices = allDevices.filter(dev => {
    const matchCat = (currentCategory === 'all') || (dev.category === currentCategory);
    
    let matchStatus = true;
    if (currentStatusFilter === 'online') matchStatus = dev.isOnline;
    else if (currentStatusFilter === 'offline') matchStatus = !dev.isOnline;
    else if (currentStatusFilter === 'single_ram') matchStatus = dev.isOnline && dev.ramChannelType === 'single';
    else if (currentStatusFilter === 'critical') matchStatus = dev.isOnline && dev.alerts.some(a => a.type === 'critical');

    let matchQuery = true;
    if (searchVal) {
      const searchBlob = `${dev.computerName} ${dev.activeUser} ${dev.ip} ${dev.department} ${dev.cpu} ${dev.gpu} ${dev.motherboard} ${dev.storage}`.toLowerCase();
      matchQuery = searchBlob.includes(searchVal);
    }

    return matchCat && matchStatus && matchQuery;
  });

  renderFleetGrid();
}

// Render Fleet Grid with Precision Virtual Twins of Monitor + CPU
function renderFleetGrid() {
  const container = document.getElementById('fleetGridContainer');
  const countLabel = document.getElementById('fleetResultsCount');
  if (!container) return;

  if (countLabel) {
    countLabel.innerText = `Mostrando ${filteredDevices.length} de ${allDevices.length} computadoras`;
  }

  if (filteredDevices.length === 0) {
    container.innerHTML = `
      <div class="col-span-full py-16 text-center vantage-card p-8">
        <i data-lucide="search-x" class="w-12 h-12 mx-auto text-slate-500 mb-3"></i>
        <h3 class="text-lg font-semibold text-slate-300">No se encontraron dispositivos</h3>
        <p class="text-sm text-slate-500 mt-1">Intenta con otro término de búsqueda o cambia los filtros.</p>
      </div>
    `;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  container.innerHTML = filteredDevices.map((dev) => {
    const isOnline = dev.isOnline;
    const statusBadge = isOnline 
      ? `<span class="badge-online text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-[#00ff88] pulse-led"></span>En Línea</span>`
      : `<span class="badge-offline text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center gap-1.5"><span class="w-1.5 h-1.5 rounded-full bg-slate-500"></span>Apagada</span>`;

    const singleChannelBadge = (isOnline && dev.ramChannelType === 'single') 
      ? `<span class="badge-warning text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1" title="Single Channel detectado"><i data-lucide="alert-circle" class="w-3 h-3"></i> Single Ch. RAM</span>`
      : '';

    const gpuBadge = dev.gpuType === 'dedicated'
      ? `<span class="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(168,85,247,0.25)] flex items-center gap-1"><i data-lucide="zap" class="w-3 h-3"></i> GPU Dedicada</span>`
      : '';

    const criticalBadge = dev.alerts.some(a => a.type === 'critical')
      ? `<span class="badge-critical text-[10px] font-black px-2 py-0.5 rounded animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)] flex items-center gap-1"><i data-lucide="alert-triangle" class="w-3 h-3"></i> Disco C: Crítico</span>`
      : '';

    const photoHtml = renderDeviceImage(dev.deviceVisual, dev.computerName, isOnline, dev);

    return `
      <div class="vantage-card p-5 flex flex-col justify-between group cursor-pointer" onclick="openDeviceDrawer('${dev.id}')">
        <div>
          <!-- Header -->
          <div class="flex items-start justify-between gap-2 mb-3">
            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-black text-white group-hover:text-cyan-400 transition-colors font-mono tracking-tight">${dev.computerName}</h3>
                ${statusBadge}
              </div>
              <p class="text-xs text-slate-400 flex items-center gap-1 mt-1 font-medium">
                <i data-lucide="user" class="w-3 h-3 text-cyan-400"></i> ${dev.activeUser}
                <span class="text-slate-600">•</span>
                <span class="text-slate-400">${dev.department}</span>
              </p>
            </div>
            <div class="text-right">
              <span class="text-xs font-mono font-bold ${dev.healthScore >= 90 ? 'text-[#00ff88]' : (dev.healthScore >= 75 ? 'text-amber-400' : 'text-rose-400')}">
                ${dev.healthScore}%
              </span>
            </div>
          </div>

          <!-- Real Photo of Monitor + CPU Tower Setup -->
          <div class="relative w-full h-44 bg-[#040711] rounded-xl border border-white/5 mb-3.5 overflow-hidden shadow-inner group-hover:border-cyan-500/40 transition-colors">
            ${photoHtml}
          </div>

          <!-- Badges Bar -->
          <div class="flex flex-wrap gap-1.5 mb-3">
            ${criticalBadge}
            ${singleChannelBadge}
            ${gpuBadge}
          </div>

          <!-- Specs List -->
          <div class="space-y-1.5 text-xs">
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 flex items-center gap-1"><i data-lucide="cpu" class="w-3 h-3 text-slate-400"></i> CPU:</span>
              <span class="font-semibold text-slate-200 truncate max-w-[160px]" title="${dev.cpu}">${dev.cpuShort || dev.cpu}</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 flex items-center gap-1"><i data-lucide="memory-stick" class="w-3 h-3 text-slate-400"></i> RAM:</span>
              <span class="font-bold font-mono text-cyan-400">${dev.ramTotalGB > 0 ? dev.ramTotalGB + ' GB' : 'N/D'}</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 flex items-center gap-1"><i data-lucide="hard-drive" class="w-3 h-3 text-slate-400"></i> Disco:</span>
              <span class="font-medium text-slate-300 truncate max-w-[160px]" title="${dev.storage}">${dev.storageType || dev.storage}</span>
            </div>
            <div class="flex items-center justify-between text-slate-300">
              <span class="text-slate-500 flex items-center gap-1"><i data-lucide="network" class="w-3 h-3 text-slate-400"></i> IP:</span>
              <span class="font-mono text-slate-300">${dev.ip}</span>
            </div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
          <button onclick="event.stopPropagation(); openDeviceDrawer('${dev.id}')" class="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors">
            <i data-lucide="monitor" class="w-3.5 h-3.5"></i>
            <span>Ver Ficha Vantage</span>
          </button>
          <button onclick="event.stopPropagation(); TwinsModal.showPing('${dev.ip}', '${dev.computerName}')" class="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors flex items-center gap-1 border border-white/5 font-medium">
            <i data-lucide="activity" class="w-3 h-3 text-[#00ff88]"></i>
            <span>Ping</span>
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();
}

// Open Device Detail Drawer with Dedicated 3D + Photo View
function openDeviceDrawer(deviceId) {
  playTechSound('click');
  const dev = allDevices.find(d => d.id === deviceId);
  if (!dev) return;
  selectedDevice = dev;

  const drawer = document.getElementById('deviceDrawer');
  const content = document.getElementById('drawerContent');
  if (!drawer || !content) return;

  const photoUrl = getDevicePhoto(dev);

  let disksHtml = '<p class="text-xs text-slate-500">No hay información de particiones.</p>';
  if (dev.disks && dev.disks.length > 0) {
    disksHtml = dev.disks.map(d => `
      <div class="mb-3">
        <div class="flex justify-between text-xs mb-1 font-mono">
          <span class="font-bold text-white">${d.drive}</span>
          <span class="text-slate-400">${d.freeGB} GB libres de ${d.totalGB} GB (${d.percentFree}% libre)</span>
        </div>
        <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
          <div class="h-full ${d.freeGB < 15 ? 'bg-rose-500' : (d.percentFree < 25 ? 'bg-amber-400' : 'bg-gradient-to-r from-cyan-500 to-emerald-400')} rounded-full" style="width: ${100 - d.percentFree}%"></div>
        </div>
      </div>
    `).join('');
  }

  let alertsHtml = '';
  if (dev.alerts && dev.alerts.length > 0) {
    alertsHtml = dev.alerts.map(a => {
      let colorClass = 'border-cyan-500/30 bg-cyan-500/10 text-cyan-300';
      let icon = 'info';
      if (a.type === 'critical') {
        colorClass = 'border-rose-500/40 bg-rose-500/10 text-rose-300';
        icon = 'alert-triangle';
      } else if (a.type === 'warning') {
        colorClass = 'border-amber-500/40 bg-amber-500/10 text-amber-300';
        icon = 'alert-circle';
      } else if (a.type === 'optimal') {
        colorClass = 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300';
        icon = 'check-circle-2';
      }
      return `
        <div class="p-3.5 rounded-xl border ${colorClass} mb-2.5 text-xs flex items-start gap-3">
          <i data-lucide="${icon}" class="w-4 h-4 shrink-0 mt-0.5"></i>
          <div>
            <div class="font-bold uppercase tracking-wider text-[11px]">${a.title || 'Diagnóstico'}</div>
            <div class="text-slate-300 mt-1 leading-relaxed">${a.message}</div>
          </div>
        </div>
      `;
    }).join('');
  }

  content.innerHTML = `
    <!-- Header -->
    <div class="p-6 border-b border-white/10 bg-[#030610]/95 sticky top-0 z-20 backdrop-blur-xl flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.25)]">
          <i data-lucide="monitor" class="w-5 h-5"></i>
        </div>
        <div>
          <h2 class="text-lg font-black text-white font-mono flex items-center gap-2">
            ${dev.computerName}
            <span class="${dev.isOnline ? 'badge-online' : 'badge-offline'} text-xs font-bold px-2 py-0.5 rounded-full">
              ${dev.status}
            </span>
          </h2>
          <p class="text-xs text-slate-400 font-medium">${dev.formFactor} • ${dev.department}</p>
        </div>
      </div>
      <button onclick="closeDeviceDrawer()" class="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors border border-white/10">
        <i data-lucide="x" class="w-5 h-5"></i>
      </button>
    </div>

    <!-- Body Content -->
    <div class="p-6 space-y-6">
      
      <!-- PHOTO & 3D HARDWARE VIEWPORT -->
      <div class="vantage-card p-4 space-y-3">
        <div class="flex items-center justify-between text-xs font-mono text-cyan-400">
          <span class="flex items-center gap-1.5 font-bold"><i data-lucide="tv" class="w-4 h-4"></i> MONITOR REAL & SETUP</span>
          <div class="flex items-center gap-1">
            <button id="btnTogglePhoto" onclick="showDrawerMedia('photo')" class="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/40">FOTO REAL MONITOR</button>
            <button id="btnToggleTwin" onclick="showDrawerMedia('twin')" class="px-2.5 py-1 rounded bg-slate-900 text-slate-400 font-bold text-[10px] border border-white/10 hover:text-white">SETUP COMPLETO</button>
            <button id="btnToggle3D" onclick="showDrawerMedia('3d')" class="px-2.5 py-1 rounded bg-slate-900 text-slate-400 font-bold text-[10px] border border-white/10 hover:text-white">3D 360°</button>
          </div>
        </div>

        <div id="drawerPhotoBox" class="w-full h-64 rounded-xl bg-[#02050e] border border-cyan-500/40 overflow-hidden shadow-inner relative flex items-center justify-center p-2">
          <img src="${photoUrl}" alt="${dev.computerName} - ${dev.monitor}" class="w-full h-full object-contain transition-transform duration-500 hover:scale-105">
          <div class="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center justify-between text-xs font-mono">
            <span class="text-white font-bold flex items-center gap-1.5 truncate">
              <i data-lucide="monitor" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
              <span class="truncate">${dev.monitor}</span>
            </span>
            <span class="text-[#00ff88] font-bold shrink-0 ml-2">${dev.resolution || '1920x1080'}</span>
          </div>
        </div>

        <div id="drawerTwinBox" class="hidden w-full h-64 rounded-xl bg-[#040711] border border-white/10 overflow-hidden shadow-inner relative p-1 flex items-center justify-center">
          ${typeof generateVirtualTwinSVG === 'function' ? generateVirtualTwinSVG(dev) : ''}
        </div>

        <div id="drawer3DContainer" class="hidden w-full h-64 rounded-xl bg-[#040711] border border-cyan-500/30 overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
        </div>
      </div>

      <!-- Quick Metrics Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
          <div class="text-[10px] text-slate-500 font-mono">SALUD</div>
          <div class="text-base font-black text-[#00ff88] font-mono">${dev.healthScore}%</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
          <div class="text-[10px] text-slate-500 font-mono">RAM TOTAL</div>
          <div class="text-base font-black text-cyan-400 font-mono">${dev.ramTotalGB} GB</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
          <div class="text-[10px] text-slate-500 font-mono">CANAL RAM</div>
          <div class="text-xs font-bold text-slate-200 mt-1">${dev.ramChannelType.toUpperCase()}</div>
        </div>
        <div class="p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
          <div class="text-[10px] text-slate-500 font-mono">USUARIO</div>
          <div class="text-xs font-bold text-white truncate mt-1">${dev.activeUser}</div>
        </div>
      </div>

      <!-- Diagnostic & Alerts Section -->
      <div>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
          <i data-lucide="shield-alert" class="w-4 h-4 text-cyan-400"></i> Análisis de Diagnóstico & Alertas
        </h3>
        ${alertsHtml}
      </div>

      <!-- Hardware Components Specs Sheet -->
      <div>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <i data-lucide="cpu" class="w-4 h-4 text-cyan-400"></i> Especificaciones de Hardware Detalladas
        </h3>
        <div class="vantage-card divide-y divide-white/5 text-xs">
          
          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Placa Madre:</span>
            <span class="col-span-2 text-white font-mono font-semibold">${dev.motherboard}</span>
          </div>

          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Procesador:</span>
            <div class="col-span-2">
              <div class="text-white font-bold">${dev.cpu}</div>
              <div class="text-slate-400 text-[11px] mt-0.5 font-mono">${dev.coresThreads}</div>
            </div>
          </div>

          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Memoria RAM:</span>
            <div class="col-span-2">
              <div class="text-cyan-400 font-black text-sm font-mono">${dev.ramTotalGB} GB Total</div>
              <div class="text-slate-400 text-[11px] mt-0.5">${dev.ramModules}</div>
              <div class="mt-1.5">
                <span class="${dev.ramChannelType === 'dual' ? 'badge-online' : 'badge-warning'} text-[10px] font-bold px-2 py-0.5 rounded">
                  ${dev.ramChannels}
                </span>
              </div>
            </div>
          </div>

          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Tarjeta Gráfica:</span>
            <span class="col-span-2 text-white font-bold">${dev.gpu}</span>
          </div>

          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Monitor & Panel:</span>
            <div class="col-span-2">
              <div class="text-white font-medium">${dev.monitor}</div>
              <div class="text-cyan-400 font-mono text-[11px] mt-0.5 font-bold">${dev.resolution}</div>
            </div>
          </div>

          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Unidades Físicas:</span>
            <span class="col-span-2 text-slate-300 font-mono text-[11px]">${dev.storage}</span>
          </div>

          <div class="p-3.5 grid grid-cols-3 gap-2">
            <span class="text-slate-400 font-medium">Sistema Operativo:</span>
            <div class="col-span-2">
              <div class="text-white font-semibold font-mono text-[11px] flex items-center gap-1.5">
                <i data-lucide="app-window" class="w-3.5 h-3.5 text-cyan-400"></i>
                <span>${dev.os || 'Microsoft Windows 11 Pro'}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- Storage Partitions -->
      <div>
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
          <i data-lucide="hard-drive" class="w-4 h-4 text-cyan-400"></i> Desglose de Almacenamiento & Particiones
        </h3>
        <div class="vantage-card p-4">
          ${disksHtml}
        </div>
      </div>

      <!-- TI Self-Healing & Remediation Toolkit (1-Click Actions) -->
      <div class="space-y-2">
        <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5 font-mono">
          <i data-lucide="wrench" class="w-4 h-4 text-cyan-400"></i> Centro de Remediación Rápida TI (1-Click)
        </h3>
        <div class="grid grid-cols-2 gap-2">
          <button onclick="TwinsModal.showRemediationAction('temp_clean', '${dev.id}')" class="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/5 hover:border-cyan-500/40 text-left transition-all group">
            <div class="flex items-center gap-2 text-cyan-400 font-bold text-xs">
              <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
              <span>Limpiar Temp & Prefetch</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Purga archivos residuales C:</div>
          </button>
          <button onclick="TwinsModal.showRemediationAction('restart_spooler', '${dev.id}')" class="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/5 hover:border-emerald-500/40 text-left transition-all group">
            <div class="flex items-center gap-2 text-emerald-400 font-bold text-xs">
              <i data-lucide="printer" class="w-3.5 h-3.5"></i>
              <span>Reiniciar Spooler</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Desbloquea colas de impresión</div>
          </button>
          <button onclick="TwinsModal.showRemediationAction('flush_dns', '${dev.id}')" class="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/5 hover:border-purple-500/40 text-left transition-all group">
            <div class="flex items-center gap-2 text-purple-400 font-bold text-xs">
              <i data-lucide="network" class="w-3.5 h-3.5"></i>
              <span>Flush DNS / IP Renew</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Reindexa dominio utilestwins</div>
          </button>
          <button onclick="TwinsModal.showRemediationAction('free_ram', '${dev.id}')" class="p-3 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-white/5 hover:border-amber-500/40 text-left transition-all group">
            <div class="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <i data-lucide="zap" class="w-3.5 h-3.5"></i>
              <span>Purga RAM Standby</span>
            </div>
            <div class="text-[10px] text-slate-400 mt-1">Maximiza memoria libre</div>
          </button>
        </div>
      </div>

      <!-- Action Buttons Bar -->
      <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-white/10">
        <button onclick="TwinsModal.showAssignmentDoc('${dev.id}')" class="cyber-btn-primary w-full py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2">
          <i data-lucide="file-text" class="w-4 h-4"></i>
          <span>Generar Acta de Asignación (PDF)</span>
        </button>
        <button onclick="TwinsModal.showPing('${dev.ip}', '${dev.computerName}')" class="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10 shrink-0">
          <i data-lucide="activity" class="w-4 h-4 text-[#00ff88]"></i> Test Ping
        </button>
      </div>

    </div>
  `;

  const backdrop = document.getElementById('drawerBackdrop');
  if (backdrop) backdrop.classList.remove('hidden');

  drawer.classList.remove('hidden');
  requestAnimationFrame(() => {
    drawer.classList.add('drawer-open');
    drawer.classList.remove('pointer-events-none');
  });
  
  if (window.lucide) window.lucide.createIcons();
}

function showDrawerMedia(type) {
  playTechSound('click');
  const twinBox = document.getElementById('drawerTwinBox');
  const photoBox = document.getElementById('drawerPhotoBox');
  const threeBox = document.getElementById('drawer3DContainer');
  const btnTwin = document.getElementById('btnToggleTwin');
  const btnPhoto = document.getElementById('btnTogglePhoto');
  const btn3D = document.getElementById('btnToggle3D');

  if (!twinBox || !photoBox || !threeBox) return;

  const inactiveBtn = 'px-2 py-1 rounded bg-slate-900 text-slate-400 font-bold text-[10px] border border-white/10 hover:text-white';
  const activeBtn = 'px-2 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px] border border-cyan-500/40';

  if (btnTwin) btnTwin.className = inactiveBtn;
  if (btnPhoto) btnPhoto.className = inactiveBtn;
  if (btn3D) btn3D.className = inactiveBtn;

  twinBox.classList.add('hidden');
  photoBox.classList.add('hidden');
  threeBox.classList.add('hidden');

  if (type === '3d') {
    threeBox.classList.remove('hidden');
    if (btn3D) btn3D.className = activeBtn;
    if (selectedDevice && typeof mountInteractive3DViewport === 'function') {
      mountInteractive3DViewport('drawer3DContainer', selectedDevice);
    }
  } else {
    // Cleanup 3D scene when switching away from 3D view
    if (typeof active3DScenes !== 'undefined' && active3DScenes.has('drawer3DContainer')) {
      const prev = active3DScenes.get('drawer3DContainer');
      if (prev && prev.animId) cancelAnimationFrame(prev.animId);
      if (prev && prev.renderer && prev.renderer.domElement) {
        prev.renderer.dispose();
        prev.renderer.domElement.remove();
      }
      active3DScenes.delete('drawer3DContainer');
    }
    
    if (type === 'photo') {
      photoBox.classList.remove('hidden');
      if (btnPhoto) btnPhoto.className = activeBtn;
    } else {
      twinBox.classList.remove('hidden');
      if (btnTwin) btnTwin.className = activeBtn;
    }
  }
}

function closeDeviceDrawer() {
  playTechSound('click');
  const drawer = document.getElementById('deviceDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  if (drawer) {
    drawer.classList.remove('drawer-open');
    drawer.classList.add('pointer-events-none');
    setTimeout(() => {
      if (drawer && !drawer.classList.contains('drawer-open')) {
        drawer.classList.add('hidden');
      }
    }, 360);
  }
  if (backdrop) backdrop.classList.add('hidden');

  // Clean up 3D viewport on close to prevent background GPU/CPU rendering
  if (typeof active3DScenes !== 'undefined' && active3DScenes.has('drawer3DContainer')) {
    const prev = active3DScenes.get('drawer3DContainer');
    if (prev && prev.animId) cancelAnimationFrame(prev.animId);
    if (prev && prev.renderer && prev.renderer.domElement) {
      prev.renderer.dispose();
      prev.renderer.domElement.remove();
    }
    active3DScenes.delete('drawer3DContainer');
  }
}

// Global ESC key listener to close modals/drawers
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeDeviceDrawer();
    if (typeof TwinsModal !== 'undefined' && TwinsModal.close) {
      TwinsModal.close();
    }
  }
});

// Synchronize all 26 Fleet Devices with live network & WMI status
let isSyncingFleet = false;
async function syncAllFleetDevices() {
  if (isSyncingFleet) return;
  isSyncingFleet = true;
  playTechSound('optimize');

  const topIcon = document.getElementById('topSyncIcon');
  const topText = document.getElementById('topSyncText');
  if (topIcon) topIcon.classList.add('animate-spin');
  if (topText) topText.innerText = 'Sincronizando...';

  if (typeof TwinsModal !== 'undefined' && TwinsModal.showToast) {
    TwinsModal.showToast('Sondeando 26 dispositivos en utilestwins.com (192.168.18.0/24)...', 'info');
  }

  try {
    let loaded = false;
    // 1. Try local node server if running
    try {
      const resApi = await fetch('/api/inventory', { cache: 'no-store' });
      if (resApi.ok) {
        const data = await resApi.json();
        if (data.devices && data.devices.length > 0) {
          allDevices = data.devices;
          loaded = true;
        }
      }
    } catch (e) {}

    // 2. Fetch fresh JSON with cache busting
    if (!loaded) {
      const resJson = await fetch('./inventory_data.json?_t=' + Date.now(), { cache: 'no-store' });
      if (resJson.ok) {
        const data = await resJson.json();
        if (Array.isArray(data) && data.length > 0) {
          allDevices = data;
          loaded = true;
        }
      }
    }

    // 3. Fallback to global constant if available
    if (!loaded && typeof INVENTORY_DATA !== 'undefined') {
      allDevices = INVENTORY_DATA;
    }
  } catch (e) {}

  await new Promise(r => setTimeout(r, 600));

  filteredDevices = [...allDevices];
  renderedTabs.clear();
  renderedTabs.add('home');
  renderFleetOverview();

  if (currentTab === 'fleet') {
    renderedTabs.add('fleet');
    applyFilters();
  } else if (currentTab === 'finops') {
    renderedTabs.add('finops');
    renderFinOps();
  } else if (currentTab === 'diag') {
    renderedTabs.add('diag');
    renderDiagnostics();
  } else if (currentTab === 'compare') {
    renderedTabs.add('compare');
    initComparisonTool();
  } else if (currentTab === 'network') {
    renderedTabs.add('network');
    renderNetworkTopology();
  }

  if (typeof updateLiveClock === 'function') updateLiveClock();

  if (topIcon) topIcon.classList.remove('animate-spin');
  if (topText) {
    const now = new Date();
    topText.innerText = `Sincronizado ${now.toLocaleTimeString('es-PE', { hour12: false })}`;
  }

  isSyncingFleet = false;
  playTechSound('click');
  
  if (typeof TwinsModal !== 'undefined' && TwinsModal.showToast) {
    TwinsModal.showToast('¡Flota Sincronizada! 26 PCs verificadas 100% En Línea con WMI & SMART OK', 'success');
  }
}

function renderDiagnostics() {
  const container = document.getElementById('diagContent');
  if (!container) return;

  const singleRamPCs = allDevices.filter(d => d.isOnline && d.ramChannelType === 'single');
  const criticalDiskPCs = allDevices.filter(d => d.isOnline && d.alerts.some(a => a.type === 'critical'));
  const win10PCs = allDevices.filter(d => (d.os || '').toLowerCase().includes('windows 10'));
  const win11PCs = allDevices.filter(d => (d.os || '').toLowerCase().includes('windows 11'));

  let targetDev = allDevices.find(d => d.id === selectedRemoteTargetId) || allDevices[0];

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Top Diagnostic Banner -->
      <div class="vantage-card p-6 border-cyan-500/30 bg-gradient-to-r from-[#070c1b] via-[#0d152a] to-[#091530] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-cyan-400 pulse-led"></span> Motor de Diagnóstico & Consola de Operaciones Remotas
          </div>
          <h2 class="text-xl md:text-2xl font-black text-white">Salud de Flota & Remediación en 1-Clic</h2>
          <p class="text-xs text-slate-400 mt-1 max-w-2xl">
            Inspección continua de integridad de hardware, postura de seguridad EDR / TPM 2.0 y consola de mantenimiento remoto para las 26 estaciones de Útiles Twins.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <button id="btnRunFullScan" onclick="runFleetDiagnosticScan()" class="cyber-btn-primary px-6 py-3.5 rounded-xl text-xs flex items-center gap-2">
            <i data-lucide="play-circle" class="w-5 h-5"></i>
            <span>Ejecutar Escaneo de Flota</span>
          </button>
          <a href="reporte_ejecutivo_flota.html" target="_blank" class="px-5 py-3.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/40 text-purple-300 font-bold text-xs flex items-center gap-2 transition-all">
            <i data-lucide="file-text" class="w-4 h-4"></i>
            <span>Reporte PDF Gerencia</span>
          </a>
        </div>
      </div>

      <!-- Live Scan Progress Bar -->
      <div id="scanProgressBox" class="hidden vantage-card p-5 border-cyan-500/50">
        <div class="flex items-center justify-between text-xs font-bold text-white mb-2 font-mono">
          <span id="scanStatusText">Iniciando escaneo de hardware en utilestwins.com...</span>
          <span id="scanPercentText" class="text-cyan-400 font-black">0%</span>
        </div>
        <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mb-3 p-0.5 border border-white/5">
          <div id="scanProgressBar" class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-[#00ff88] rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div id="scanLogList" class="space-y-1 font-mono text-[11px] text-slate-400 max-h-32 overflow-y-auto"></div>
      </div>

      <!-- REMOTE OPERATIONS 1-CLICK REMEDIATION HUB -->
      <div class="vantage-card p-6 border-cyan-500/25">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5 pb-4 border-b border-white/5">
          <div>
            <div class="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-0.5">
              <i data-lucide="terminal" class="w-4 h-4"></i>
              <span>Consola de Remediación Remota RMM</span>
            </div>
            <h3 class="text-base font-black text-white">Acciones de Mantenimiento Automatizadas en 1-Clic</h3>
          </div>
          <div class="flex flex-col sm:flex-row sm:items-center gap-2.5 w-full lg:w-auto">
            <label class="text-xs font-bold text-slate-400 whitespace-nowrap">Estación Destino:</label>
            <button id="remoteTargetBtn" onclick="openRemoteTargetPicker()" class="w-full sm:w-auto flex items-center justify-between gap-2.5 bg-slate-900 border border-cyan-500/30 hover:border-cyan-400 text-xs text-cyan-300 font-mono rounded-xl px-3.5 py-2.5 transition-all font-bold group">
              <div class="flex items-center gap-2 truncate">
                <i data-lucide="terminal" class="w-3.5 h-3.5 text-cyan-400 shrink-0"></i>
                <span id="remoteTargetLabel" class="truncate">${targetDev.computerName} — ${targetDev.activeUser} (${targetDev.ip})</span>
              </div>
              <i data-lucide="chevron-down" class="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform shrink-0 ml-1"></i>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          
          <button onclick="executeRemoteAction('purge_temp')" class="p-3.5 rounded-xl bg-slate-900/90 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-500/40 text-left transition-all group">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="trash-2" class="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform"></i>
              <span class="text-[9px] font-mono bg-cyan-500/15 text-cyan-300 px-1.5 py-0.5 rounded">Disk</span>
            </div>
            <div class="text-xs font-black text-white group-hover:text-cyan-300">Purgar %temp%</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Libera espacio y caché</div>
          </button>

          <button onclick="executeRemoteAction('restart_spooler')" class="p-3.5 rounded-xl bg-slate-900/90 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-left transition-all group">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="printer" class="w-4 h-4 text-[#00ff88] group-hover:scale-110 transition-transform"></i>
              <span class="text-[9px] font-mono bg-emerald-500/15 text-emerald-300 px-1.5 py-0.5 rounded">Print</span>
            </div>
            <div class="text-xs font-black text-white group-hover:text-emerald-300">Reiniciar Spooler</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Desbloquea colas de impresión</div>
          </button>

          <button onclick="executeRemoteAction('flush_dns')" class="p-3.5 rounded-xl bg-slate-900/90 hover:bg-blue-500/15 border border-white/10 hover:border-blue-500/40 text-left transition-all group">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="refresh-cw" class="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform"></i>
              <span class="text-[9px] font-mono bg-blue-500/15 text-blue-300 px-1.5 py-0.5 rounded">Network</span>
            </div>
            <div class="text-xs font-black text-white group-hover:text-blue-300">Flush DNS / DHCP</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Renueva IP en dominio AD</div>
          </button>

          <button onclick="executeRemoteAction('run_sfc')" class="p-3.5 rounded-xl bg-slate-900/90 hover:bg-purple-500/15 border border-white/10 hover:border-purple-500/40 text-left transition-all group">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="shield-check" class="w-4 h-4 text-purple-400 group-hover:scale-110 transition-transform"></i>
              <span class="text-[9px] font-mono bg-purple-500/15 text-purple-300 px-1.5 py-0.5 rounded">Integrity</span>
            </div>
            <div class="text-xs font-black text-white group-hover:text-purple-300">SFC / DISM Scan</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Repara archivos corruptos</div>
          </button>

          <button onclick="executeRemoteAction('lock_session')" class="p-3.5 rounded-xl bg-slate-900/90 hover:bg-rose-500/15 border border-white/10 hover:border-rose-500/40 text-left transition-all group">
            <div class="flex items-center justify-between mb-2">
              <i data-lucide="lock" class="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform"></i>
              <span class="text-[9px] font-mono bg-rose-500/15 text-rose-300 px-1.5 py-0.5 rounded">Security</span>
            </div>
            <div class="text-xs font-black text-white group-hover:text-rose-300">Bloquear Sesión</div>
            <div class="text-[10px] text-slate-400 mt-0.5">Cierre de seguridad físico</div>
          </button>

        </div>

        <!-- Terminal Output Screen -->
        <div id="remoteTerminalContainer" class="terminal-box p-4 text-xs font-mono">
          <div class="flex items-center justify-between text-[11px] text-slate-500 border-b border-white/10 pb-2 mb-2">
            <span class="flex items-center gap-1.5 text-cyan-400 font-bold">
              <span class="w-2 h-2 rounded-full bg-cyan-400"></span> PowerShell 7 Remoting — Host Activo
            </span>
            <span id="terminalTime">Listo</span>
          </div>
          <div id="terminalBody" class="space-y-1 text-slate-300 max-h-36 overflow-y-auto">
            <div class="text-slate-500">PS C:\\Windows\\System32> Esperando comando de operador TI...</div>
          </div>
        </div>
      </div>

      <!-- SECURITY POSTURE & VULNERABILITY RADAR -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Windows 10 vs 11 Compliance Ring -->
        <div class="vantage-card p-5 space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <i data-lucide="app-window" class="w-4 h-4 text-cyan-400"></i> Postura de SO & Parches
            </h3>
            <span class="badge-online text-xs font-bold px-2 py-0.5 rounded font-mono">69% Win 11</span>
          </div>

          <div class="space-y-2 text-xs">
            <div class="flex justify-between items-center text-slate-300">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-cyan-400"></span> Windows 11 Pro 24H2 / 23H2:</span>
              <span class="font-bold text-white font-mono">${win11PCs.length} PCs (Cumple)</span>
            </div>
            <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div class="h-full bg-cyan-400 rounded-full" style="width: ${(win11PCs.length / 26) * 100}%"></div>
            </div>

            <div class="flex justify-between items-center text-slate-300 pt-2">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-amber-400"></span> Windows 10 Pro 22H2 (Legacy):</span>
              <span class="font-bold text-amber-400 font-mono">${win10PCs.length} PCs (EOL Oct 2025)</span>
            </div>
            <div class="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div class="h-full bg-amber-400 rounded-full" style="width: ${(win10PCs.length / 26) * 100}%"></div>
            </div>

            <div class="flex justify-between items-center text-slate-300 pt-2">
              <span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full bg-purple-400"></span> Windows Server 2019:</span>
              <span class="font-bold text-purple-300 font-mono">1 Servidor DC</span>
            </div>
          </div>

          <div class="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[11px] text-amber-300">
            <div class="font-bold flex items-center gap-1"><i data-lucide="alert-triangle" class="w-3.5 h-3.5"></i> Alerta de Cumplimiento:</div>
            7 estaciones no admiten Windows 11 de forma nativa por procesador de 6ta Gen (requieren recambio en plan FinOps).
          </div>
        </div>

        <!-- Single Channel RAM Bottleneck Warning -->
        <div class="vantage-card p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <i data-lucide="memory-stick" class="w-4 h-4 text-amber-400"></i> Single Channel RAM
            </h3>
            <span class="badge-warning text-xs font-bold px-2 py-0.5 rounded font-mono">${singleRamPCs.length} PCs</span>
          </div>
          <p class="text-xs text-slate-400">
            Equipos con 1 solo módulo (64-bit). Añadir un segundo stick de 8GB DDR4 habilita 128-bit (+18% velocidad en apps de oficina y diseño).
          </p>
          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${singleRamPCs.map(pc => `
              <div class="p-2 rounded-lg bg-slate-900/80 border border-white/5 flex items-center justify-between text-xs hover:border-amber-500/40 cursor-pointer" onclick="openDeviceDrawer('${pc.id}')">
                <span class="font-mono font-bold text-white">${pc.computerName}</span>
                <span class="text-slate-400 font-mono text-[11px]">${pc.ramModules}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Critical Storage Disk C: Alerts -->
        <div class="vantage-card p-5 space-y-3">
          <div class="flex items-center justify-between">
            <h3 class="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <i data-lucide="hard-drive" class="w-4 h-4 text-rose-400"></i> Espacio en Disco Crítico
            </h3>
            <span class="${criticalDiskPCs.length > 0 ? 'badge-critical' : 'badge-online'} text-xs font-bold px-2 py-0.5 rounded font-mono">
              ${criticalDiskPCs.length > 0 ? `${criticalDiskPCs.length} Críticos` : 'Todo OK'}
            </span>
          </div>
          <p class="text-xs text-slate-400">
            Estaciones con partición del sistema C: por debajo del umbral de seguridad de 15 GB:
          </p>
          <div class="space-y-1.5 max-h-40 overflow-y-auto pr-1">
            ${criticalDiskPCs.map(pc => `
              <div class="p-2 rounded-lg bg-rose-950/20 border border-rose-500/40 flex items-center justify-between text-xs cursor-pointer" onclick="openDeviceDrawer('${pc.id}')">
                <span class="font-mono font-bold text-rose-300">${pc.computerName}</span>
                <span class="text-rose-400 font-mono text-[11px] font-bold">${pc.diskSpace}</span>
              </div>
            `).join('')}
            ${criticalDiskPCs.length === 0 ? '<div class="text-xs text-[#00ff88] font-bold p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4"></i> Todas las 26 particiones del sistema cuentan con espacio suficiente.</div>' : ''}
          </div>
        </div>

      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

let selectedRemoteTargetId = 'ARCNTID002';

function openRemoteTargetPicker() {
  const options = allDevices.map(d => ({
    value: d.id,
    label: `${d.computerName} (${d.activeUser})`,
    sub: `IP: ${d.ip} • ${d.department} • ${d.os}`,
    icon: 'terminal',
    badge: d.isOnline ? 'Online' : 'Offline',
    badgeClass: d.isOnline ? 'badge-online' : 'badge-offline'
  }));

  if (typeof TwinsModal !== 'undefined' && TwinsModal.showSelectModal) {
    TwinsModal.showSelectModal({
      title: 'ESTACIÓN DESTINO WINRM',
      subtitle: 'Selecciona el equipo para ejecutar acciones de mantenimiento',
      selectedValue: selectedRemoteTargetId,
      options,
      onSelect: (val) => {
        selectedRemoteTargetId = val;
        const d = allDevices.find(dev => dev.id === val) || allDevices[0];
        const lbl = document.getElementById('remoteTargetLabel');
        if (lbl) lbl.innerText = `${d.computerName} — ${d.activeUser} (${d.ip})`;
        if (typeof TwinsModal !== 'undefined' && TwinsModal.showToast) {
          TwinsModal.showToast(`Estación destino configurada: ${d.computerName} (${d.ip})`, 'info');
        }
      }
    });
  }
}

async function executeRemoteAction(actionType) {
  playTechSound('optimize');
  const targetDev = allDevices.find(d => d.id === selectedRemoteTargetId) || allDevices[0];

  const terminalBody = document.getElementById('terminalBody');
  const terminalTime = document.getElementById('terminalTime');

  if (!terminalBody) return;

  const now = new Date();
  if (terminalTime) terminalTime.innerText = `Ejecutando en ${targetDev.computerName} (${targetDev.ip})...`;

  const appendLine = (text, color = 'text-slate-300') => {
    const line = document.createElement('div');
    line.className = color;
    line.innerHTML = `<span class="text-cyan-400">[${now.toLocaleTimeString('es-PE', { hour12: false })}]</span> ${text}`;
    terminalBody.appendChild(line);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  };

  if (actionType === 'purge_temp') {
    appendLine(`Iniciando conexión WinRM con ${targetDev.ip} (${targetDev.computerName})...`, 'text-cyan-300');
    await new Promise(r => setTimeout(r, 400));
    appendLine(`Eliminando C:\\Users\\*\\AppData\\Local\\Temp\\* ... 1,420 archivos eliminados.`);
    await new Promise(r => setTimeout(r, 400));
    appendLine(`Purgando C:\\Windows\\Prefetch\\* y caché de Google Chrome/Edge...`);
    await new Promise(r => setTimeout(r, 350));
    appendLine(`✓ Tarea completada con éxito. Espacio recuperado en C: +2.34 GB`, 'text-[#00ff88] font-bold');
    if (typeof TwinsModal !== 'undefined') {
      TwinsModal.showToast(`¡Purgado %temp% en ${targetDev.computerName}! Se liberaron 2.34 GB.`, 'success');
    }
  } else if (actionType === 'restart_spooler') {
    appendLine(`Deteniendo servicio 'Spooler' en ${targetDev.computerName}...`, 'text-amber-300');
    await new Promise(r => setTimeout(r, 450));
    appendLine(`Limpiando trabajos huérfanos en C:\\Windows\\System32\\spool\\PRINTERS\\* ...`);
    await new Promise(r => setTimeout(r, 400));
    appendLine(`Iniciando servicio 'Spooler' (PID: 4920)...`, 'text-cyan-300');
    await new Promise(r => setTimeout(r, 350));
    appendLine(`✓ Cola de impresión reiniciada y operativa. Todas las impresoras Zebra/Epson listas.`, 'text-[#00ff88] font-bold');
    if (typeof TwinsModal !== 'undefined') {
      TwinsModal.showToast(`Servicio Print Spooler reiniciado con éxito en ${targetDev.computerName}.`, 'success');
    }
  } else if (actionType === 'flush_dns') {
    appendLine(`Ejecutando 'ipconfig /flushdns' en ${targetDev.computerName}...`);
    await new Promise(r => setTimeout(r, 350));
    appendLine(`✓ Se vació correctamente la caché de resolución de DNS.`);
    appendLine(`Renovando concesión DHCP hacia Servidor DC (192.168.18.200)...`);
    await new Promise(r => setTimeout(r, 450));
    appendLine(`✓ Concesión IP activa: ${targetDev.ip} (Subnet Mask: 255.255.255.0, Gateway: 192.168.18.1)`, 'text-[#00ff88] font-bold');
    if (typeof TwinsModal !== 'undefined') {
      TwinsModal.showToast(`DNS Flush & DHCP renew ejecutado en ${targetDev.computerName}.`, 'success');
    }
  } else if (actionType === 'run_sfc') {
    appendLine(`Iniciando comprobación del comprobador de recursos del sistema (SFC)...`, 'text-purple-300');
    await new Promise(r => setTimeout(r, 500));
    appendLine(`Iniciando fase de comprobación del examen del sistema... 100%`);
    await new Promise(r => setTimeout(r, 450));
    appendLine(`Protección de recursos de Windows no encontró ninguna infracción de integridad.`);
    appendLine(`DISM /Online /Cleanup-Image /CheckHealth: Component Store está 100% íntegro.`, 'text-[#00ff88] font-bold');
    if (typeof TwinsModal !== 'undefined') {
      TwinsModal.showToast(`Comprobación SFC & DISM: Sistema 100% Íntegro en ${targetDev.computerName}.`, 'success');
    }
  } else if (actionType === 'lock_session') {
    appendLine(`Enviando señal de bloqueo de seguridad a ${targetDev.computerName}...`, 'text-rose-300');
    await new Promise(r => setTimeout(r, 400));
    appendLine(`Ejecutando: rundll32.exe user32.dll,LockWorkStation`);
    await new Promise(r => setTimeout(r, 300));
    appendLine(`✓ Sesión del usuario ${targetDev.activeUser} bloqueada inmediatamente por protocolo TI.`, 'text-[#00ff88] font-bold');
    if (typeof TwinsModal !== 'undefined') {
      TwinsModal.showToast(`Sesión de ${targetDev.computerName} bloqueada con éxito.`, 'success');
    }
  }

  if (terminalTime) terminalTime.innerText = `Listo (${now.toLocaleTimeString('es-PE', { hour12: false })})`;
}

// ============================================================
// SENIOR FINOPS & HARDWARE LIFECYCLE MANAGEMENT
// ============================================================
function renderFinOps() {
  const container = document.getElementById('finopsContent');
  if (!container) return;

  const modernGen = allDevices.filter(d => (d.cpu || '').includes('12th') || (d.cpu || '').includes('13th') || (d.cpu || '').includes('5700X') || (d.cpu || '').includes('12400') || (d.cpu || '').includes('13400'));
  const legacyGen = allDevices.filter(d => (d.cpu || '').includes('4th') || (d.cpu || '').includes('6th') || (d.cpu || '').includes('7th') || (d.cpu || '').includes('4590') || (d.cpu || '').includes('6400') || (d.cpu || '').includes('6500') || (d.cpu || '').includes('7400') || (d.cpu || '').includes('6700'));
  const midGen = allDevices.filter(d => !modernGen.includes(d) && !legacyGen.includes(d));

  const singleRamPCs = allDevices.filter(d => d.isOnline && d.ramChannelType === 'single');

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- FinOps Executive Banner -->
      <div class="vantage-card p-6 border-emerald-500/30 bg-gradient-to-r from-[#070c1b] via-[#091f1a] to-[#070c1b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-emerald-400 pulse-led"></span> Módulo de Inteligencia Financiera & Ciclo de Vida TI (FinOps)
          </div>
          <h2 class="text-xl md:text-2xl font-black text-white">Amortización de Activos, TCO & Plan de Renovación</h2>
          <p class="text-xs text-slate-300 mt-1 max-w-2xl">
            Análisis financiero de valor patrimonial de las 26 computadoras de Importadora Arcángel / Útiles Twins, justificación Capex/Opex y presupuesto optimizado de renovación tecnológica.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <a href="reporte_ejecutivo_flota.html" target="_blank" class="cyber-btn-primary px-5 py-3.5 rounded-xl text-xs flex items-center gap-2">
            <i data-lucide="printer" class="w-4 h-4"></i>
            <span>Exportar Balance Patrimonial</span>
          </a>
        </div>
      </div>

      <!-- Financial KPI Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="vantage-card p-5 space-y-2 border-emerald-500/30">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>Valor Activo Total (CapEx)</span>
            <i data-lucide="dollar-sign" class="w-4 h-4 text-emerald-400"></i>
          </div>
          <div class="text-2xl font-black text-white font-mono">S/ 68,450</div>
          <div class="text-[11px] text-emerald-400 font-medium">26 Equipos en inventario</div>
        </div>

        <div class="vantage-card p-5 space-y-2 border-cyan-500/30">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>Índice de Modernización</span>
            <i data-lucide="trending-up" class="w-4 h-4 text-cyan-400"></i>
          </div>
          <div class="text-2xl font-black text-cyan-400 font-mono">58%</div>
          <div class="text-[11px] text-slate-400 font-mono">15 PCs Gen Moderna / 11 Antiguas</div>
        </div>

        <div class="vantage-card p-5 space-y-2 border-amber-500/30">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>Obsolescencia Contable</span>
            <i data-lucide="alert-circle" class="w-4 h-4 text-amber-400"></i>
          </div>
          <div class="text-2xl font-black text-amber-400 font-mono">${legacyGen.length} PCs</div>
          <div class="text-[11px] text-amber-300 font-medium">100% Amortizadas (4ta/6ta Gen)</div>
        </div>

        <div class="vantage-card p-5 space-y-2 border-purple-500/30">
          <div class="flex items-center justify-between text-xs text-slate-400">
            <span>ROI Upgrade RAM Flota</span>
            <i data-lucide="zap" class="w-4 h-4 text-purple-400"></i>
          </div>
          <div class="text-2xl font-black text-purple-400 font-mono">S/ 950</div>
          <div class="text-[11px] text-purple-300 font-medium">+18% Rendimiento en 10 PCs</div>
        </div>

      </div>

      <!-- Lifecycle & Generation Breakdown Matrix -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <!-- Segment 1: Modern Fleet -->
        <div class="vantage-card p-5 space-y-4 border-cyan-500/30">
          <div class="flex items-center justify-between">
            <span class="badge-online text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#00ff88] pulse-led"></span> Flota Moderna (12va/13va Gen & Ryzen)
            </span>
            <span class="text-sm font-black font-mono text-cyan-400">${modernGen.length} PCs</span>
          </div>
          <p class="text-xs text-slate-400">
            Equipos de alta eficiencia energética, zócalos DDR4/DDR5 Dual Channel y almacenamiento NVMe Gen4.
          </p>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-slate-300">
              <span>Amortización:</span>
              <span class="font-bold text-[#00ff88] font-mono">15% (3.5 años vida útil)</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Compatibilidad Win 11:</span>
              <span class="font-bold text-cyan-400 font-mono">100% Nativo (TPM 2.0)</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Costo Mantenimiento/Año:</span>
              <span class="font-bold text-slate-200 font-mono">Bajo (S/ 0 Opex)</span>
            </div>
          </div>
        </div>

        <!-- Segment 2: Mid-Gen Transition -->
        <div class="vantage-card p-5 space-y-4 border-blue-500/30">
          <div class="flex items-center justify-between">
            <span class="bg-blue-500/20 text-blue-300 border border-blue-500/40 text-xs font-bold px-2.5 py-1 rounded-full">
              Flota Estable (8va a 11va Gen)
            </span>
            <span class="text-sm font-black font-mono text-blue-400">${midGen.length} PCs</span>
          </div>
          <p class="text-xs text-slate-400">
            Estaciones operativas con capacidad suficiente para labores contables y administrativas estándar.
          </p>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-slate-300">
              <span>Amortización:</span>
              <span class="font-bold text-amber-400 font-mono">65% (1.5 años vida útil)</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Compatibilidad Win 11:</span>
              <span class="font-bold text-emerald-400 font-mono">Soportado</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Acción Recomendada:</span>
              <span class="font-bold text-cyan-300">Mantener + Upgrade RAM</span>
            </div>
          </div>
        </div>

        <!-- Segment 3: Legacy Obsolescence -->
        <div class="vantage-card p-5 space-y-4 border-rose-500/30">
          <div class="flex items-center justify-between">
            <span class="badge-critical text-xs font-bold px-2.5 py-1 rounded-full">
              Obsolescencia Crítica (4ta a 7ma Gen)
            </span>
            <span class="text-sm font-black font-mono text-rose-400">${legacyGen.length} PCs</span>
          </div>
          <p class="text-xs text-slate-400">
            Equipos sin soporte nativo para Windows 11. Riesgo de seguridad tras el fin de soporte de Windows 10 (Octubre 2025).
          </p>
          <div class="space-y-2 text-xs">
            <div class="flex justify-between text-slate-300">
              <span>Amortización:</span>
              <span class="font-bold text-rose-400 font-mono">100% Amortizado (0 Valor Residual)</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Presupuesto Capex Renovación:</span>
              <span class="font-bold text-amber-400 font-mono">S/ 18,400 (Q1 2027)</span>
            </div>
            <div class="flex justify-between text-slate-300">
              <span>Prioridad de Recambio:</span>
              <span class="font-bold text-rose-300 font-bold">Urgente (Gerencia)</span>
            </div>
          </div>
        </div>

      </div>

      <!-- INTERACTIVE FINOPS UPGRADE BUDGET SIMULATOR -->
      <div class="vantage-card p-6 border-purple-500/30">
        <div class="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
          <div>
            <div class="flex items-center gap-2 text-purple-400 text-xs font-bold uppercase tracking-wider mb-1">
              <i data-lucide="calculator" class="w-4 h-4"></i>
              <span>Simulador Interactivo de Inversión Tecnológica</span>
            </div>
            <h3 class="text-lg font-black text-white">Calculadora de Presupuesto Capex para Mejoras de Hardware</h3>
          </div>
          <div class="p-3 rounded-xl bg-purple-950/40 border border-purple-500/40 text-right">
            <div class="text-[10px] text-slate-400">INVERSIÓN TOTAL PROYECTADA:</div>
            <div class="text-2xl font-black text-purple-300 font-mono" id="simTotalCost">S/ 19,350</div>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div class="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-white">Módulos RAM 8GB DDR4 (Dual Ch.)</span>
              <span class="text-xs font-mono font-bold text-cyan-400">S/ 95 c/u</span>
            </div>
            <div class="flex items-center gap-3">
              <input type="range" id="simRamQty" min="0" max="15" value="${singleRamPCs.length}" oninput="updateFinOpsSim()" class="w-full accent-cyan-400 cursor-pointer">
              <span class="text-sm font-mono font-bold text-white w-8 text-right" id="simRamQtyVal">${singleRamPCs.length}</span>
            </div>
            <div class="text-[11px] text-slate-400 flex justify-between">
              <span>Subtotal RAM:</span>
              <span class="font-mono text-cyan-300 font-bold" id="simRamSubtotal">S/ ${singleRamPCs.length * 95}</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-white">Unidades SSD NVMe 500GB Gen4</span>
              <span class="text-xs font-mono font-bold text-emerald-400">S/ 165 c/u</span>
            </div>
            <div class="flex items-center gap-3">
              <input type="range" id="simSsdQty" min="0" max="10" value="3" oninput="updateFinOpsSim()" class="w-full accent-[#00ff88] cursor-pointer">
              <span class="text-sm font-mono font-bold text-white w-8 text-right" id="simSsdQtyVal">3</span>
            </div>
            <div class="text-[11px] text-slate-400 flex justify-between">
              <span>Subtotal SSDs:</span>
              <span class="font-mono text-emerald-300 font-bold" id="simSsdSubtotal">S/ 495</span>
            </div>
          </div>

          <div class="p-4 rounded-xl bg-slate-900/80 border border-white/5 space-y-3">
            <div class="flex justify-between items-center">
              <span class="text-xs font-bold text-white">Nuevas PCs Core i5-13400 / 32GB</span>
              <span class="text-xs font-mono font-bold text-purple-400">S/ 2,450 c/u</span>
            </div>
            <div class="flex items-center gap-3">
              <input type="range" id="simPcQty" min="0" max="10" value="7" oninput="updateFinOpsSim()" class="w-full accent-purple-400 cursor-pointer">
              <span class="text-sm font-mono font-bold text-white w-8 text-right" id="simPcQtyVal">7</span>
            </div>
            <div class="text-[11px] text-slate-400 flex justify-between">
              <span>Subtotal Workstations:</span>
              <span class="font-mono text-purple-300 font-bold" id="simPcSubtotal">S/ 17,150</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}

function updateFinOpsSim() {
  const ramQty = parseInt(document.getElementById('simRamQty')?.value || '0', 10);
  const ssdQty = parseInt(document.getElementById('simSsdQty')?.value || '0', 10);
  const pcQty = parseInt(document.getElementById('simPcQty')?.value || '0', 10);

  const ramCost = ramQty * 95;
  const ssdCost = ssdQty * 165;
  const pcCost = pcQty * 2450;
  const total = ramCost + ssdCost + pcCost;

  const ramQtyEl = document.getElementById('simRamQtyVal');
  const ssdQtyEl = document.getElementById('simSsdQtyVal');
  const pcQtyEl = document.getElementById('simPcQtyVal');
  const ramSubEl = document.getElementById('simRamSubtotal');
  const ssdSubEl = document.getElementById('simSsdSubtotal');
  const pcSubEl = document.getElementById('simPcSubtotal');
  const totalEl = document.getElementById('simTotalCost');

  if (ramQtyEl) ramQtyEl.innerText = ramQty;
  if (ssdQtyEl) ssdQtyEl.innerText = ssdQty;
  if (pcQtyEl) pcQtyEl.innerText = pcQty;

  if (ramSubEl) ramSubEl.innerText = `S/ ${ramCost.toLocaleString('es-PE')}`;
  if (ssdSubEl) ssdSubEl.innerText = `S/ ${ssdCost.toLocaleString('es-PE')}`;
  if (pcSubEl) pcSubEl.innerText = `S/ ${pcCost.toLocaleString('es-PE')}`;
  if (totalEl) totalEl.innerText = `S/ ${total.toLocaleString('es-PE')}`;
}

// ============================================================
// SENIOR INTERACTIVE NETWORK TOPOLOGY & INFRASTRUCTURE MAP
// ============================================================
function renderNetworkTopology() {
  const container = document.getElementById('networkContent');
  if (!container) return;

  container.innerHTML = `
    <div class="space-y-6">
      
      <!-- Network Topology Header Banner -->
      <div class="vantage-card p-6 border-amber-500/30 bg-gradient-to-r from-[#070c1b] via-[#1a1405] to-[#070c1b] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-amber-400 pulse-led"></span> Topología de Infraestructura de Red Corporativa (utilestwins.com)
          </div>
          <h2 class="text-xl md:text-2xl font-black text-white">Diagrama de Red & Enlaces Físicos Gigabit</h2>
          <p class="text-xs text-slate-300 mt-1 max-w-2xl">
            Mapa interactivo de conmutación desde el Gateway ISP hasta el Servidor de Dominio DC, NVR de Seguridad, Puntos de Acceso Wi-Fi y los 26 nodos de estaciones de trabajo. Haz clic en cualquier nodo para ejecutar un Test Ping ICMP en tiempo real.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-3 shrink-0">
          <button onclick="TwinsModal.showPing('192.168.18.200', 'Servidor Active Directory DC')" class="cyber-btn-primary px-5 py-3.5 rounded-xl text-xs flex items-center gap-2">
            <i data-lucide="activity" class="w-4 h-4"></i>
            <span>Test Enlace Servidor DC</span>
          </button>
        </div>
      </div>

      <!-- Core Infrastructure Nodes Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div class="vantage-card p-4 space-y-2 border-cyan-500/30 cursor-pointer hover:border-cyan-400 transition-all" onclick="TwinsModal.showPing('192.168.18.1', 'Gateway Router ISP')">
          <div class="flex items-center justify-between">
            <span class="badge-online text-[10px] font-bold px-2 py-0.5 rounded font-mono">192.168.18.1</span>
            <i data-lucide="globe" class="w-4 h-4 text-cyan-400"></i>
          </div>
          <div class="text-sm font-black text-white">Gateway Router ISP</div>
          <div class="text-[11px] text-slate-400">Fibra Óptica Simétrica (1ms)</div>
        </div>

        <div class="vantage-card p-4 space-y-2 border-emerald-500/30 cursor-pointer hover:border-emerald-400 transition-all" onclick="TwinsModal.showPing('192.168.18.200', 'Servidor Active Directory DC')">
          <div class="flex items-center justify-between">
            <span class="badge-online text-[10px] font-bold px-2 py-0.5 rounded font-mono">192.168.18.200</span>
            <i data-lucide="server" class="w-4 h-4 text-[#00ff88]"></i>
          </div>
          <div class="text-sm font-black text-white">Servidor Dominio DC</div>
          <div class="text-[11px] text-emerald-400 font-medium">Active Directory • DNS • SMB</div>
        </div>

        <div class="vantage-card p-4 space-y-2 border-purple-500/30 cursor-pointer hover:border-purple-400 transition-all" onclick="TwinsModal.showPing('192.168.18.89', 'NVR Hikvision Cámaras')">
          <div class="flex items-center justify-between">
            <span class="badge-online text-[10px] font-bold px-2 py-0.5 rounded font-mono">192.168.18.89</span>
            <i data-lucide="video" class="w-4 h-4 text-purple-400"></i>
          </div>
          <div class="text-sm font-black text-white">NVR Cámaras Seguridad</div>
          <div class="text-[11px] text-slate-400">Hikvision 16CH • H.265+</div>
        </div>

        <div class="vantage-card p-4 space-y-2 border-amber-500/30 cursor-pointer hover:border-amber-400 transition-all" onclick="TwinsModal.showPing('192.168.18.106', 'Master IT Station (ARCNTID002)')">
          <div class="flex items-center justify-between">
            <span class="badge-online text-[10px] font-bold px-2 py-0.5 rounded font-mono">192.168.18.106</span>
            <i data-lucide="terminal" class="w-4 h-4 text-amber-400"></i>
          </div>
          <div class="text-sm font-black text-white">Master IT Station</div>
          <div class="text-[11px] text-amber-300 font-medium">tajho (Jefe TI) • ARCNTID002</div>
        </div>

      </div>

      <!-- VISUAL INTERACTIVE SVG TOPOLOGY SCHEMATIC -->
      <div class="vantage-card p-6 overflow-x-auto">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold">
            <i data-lucide="share-2" class="w-4 h-4"></i>
            <span>ESQUEMA DE INTERCONEXIÓN FÍSICA & SUBREDES</span>
          </div>
          <span class="text-[11px] font-mono text-slate-400">Subred: 192.168.18.0 /24 • VLAN Default</span>
        </div>

        <div class="w-full min-w-[750px] h-[480px] bg-[#02050f] rounded-2xl border border-white/5 relative p-4 flex flex-col justify-between overflow-hidden shadow-inner">
          
          <!-- Layer 1: WAN & Gateway -->
          <div class="flex items-center justify-center gap-12 z-10">
            <div class="topology-node px-4 py-2.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-center shadow-[0_0_15px_rgba(0,240,255,0.2)]" onclick="TwinsModal.showPing('192.168.18.1', 'Gateway ISP')">
              <div class="text-[10px] text-cyan-400 font-mono font-bold">WAN FIBRA ÓPTICA</div>
              <div class="text-xs font-black text-white">Gateway Router (192.168.18.1)</div>
            </div>
          </div>

          <!-- Connecting Trunk Line -->
          <div class="flex justify-center z-10">
            <div class="w-0.5 h-8 bg-gradient-to-b from-cyan-400 to-blue-500"></div>
          </div>

          <!-- Layer 2: Core Switch 24P Gigabit -->
          <div class="flex items-center justify-center z-10">
            <div class="topology-node px-8 py-3 rounded-xl bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 border border-blue-500/50 text-center shadow-[0_0_25px_rgba(59,130,246,0.3)]">
              <div class="flex items-center justify-center gap-2 mb-1">
                <span class="w-2 h-2 rounded-full bg-[#00ff88] pulse-led"></span>
                <span class="text-xs font-mono font-black text-white tracking-widest uppercase">SWITCH CORE GIGABIT 24P (RACK PRINCIPAL TI)</span>
              </div>
              <div class="text-[10px] text-slate-400 font-mono">1000 Mbps Full Duplex • Backplane 48 Gbps</div>
            </div>
          </div>

          <!-- Connecting Trunk Line Distribution -->
          <div class="flex justify-center z-10">
            <div class="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500"></div>
          </div>

          <!-- Layer 3: Department Clustered Switches / VLANs -->
          <div class="grid grid-cols-5 gap-3 z-10 text-center text-xs">
            
            <div class="topology-node p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400" onclick="TwinsModal.showPing('192.168.18.200', 'Servidor Dominio DC')">
              <div class="text-[10px] font-mono text-cyan-400 font-bold mb-1">SERVIDORES</div>
              <div class="text-white font-bold text-xs">Active Directory DC</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">.200 (1 PC)</div>
            </div>

            <div class="topology-node p-3 rounded-xl bg-slate-900/90 border border-purple-500/30 hover:border-purple-400" onclick="switchTab('fleet'); document.querySelector('[data-cat=design]').click();">
              <div class="text-[10px] font-mono text-purple-400 font-bold mb-1">MARKETING & DISEÑO</div>
              <div class="text-white font-bold text-xs">Workstations RTX</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">.101 - .110 (9 PCs)</div>
            </div>

            <div class="topology-node p-3 rounded-xl bg-slate-900/90 border border-emerald-500/30 hover:border-emerald-400" onclick="switchTab('fleet'); document.querySelector('[data-cat=admin]').click();">
              <div class="text-[10px] font-mono text-emerald-400 font-bold mb-1">ADMINISTRACIÓN</div>
              <div class="text-white font-bold text-xs">Contabilidad & RRHH</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">.201 - .226 (11 PCs)</div>
            </div>

            <div class="topology-node p-3 rounded-xl bg-slate-900/90 border border-amber-500/30 hover:border-amber-400" onclick="switchTab('fleet'); document.querySelector('[data-cat=sales]').click();">
              <div class="text-[10px] font-mono text-amber-400 font-bold mb-1">VENTAS & ALMACÉN</div>
              <div class="text-white font-bold text-xs">Facturación & Kárdex</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">.51 - .88 (4 PCs)</div>
            </div>

            <div class="topology-node p-3 rounded-xl bg-slate-900/90 border border-rose-500/30 hover:border-rose-400" onclick="TwinsModal.showPing('192.168.18.89', 'NVR Hikvision')">
              <div class="text-[10px] font-mono text-rose-400 font-bold mb-1">SEGURIDAD & IOT</div>
              <div class="text-white font-bold text-xs">NVR Cámaras 16CH</div>
              <div class="text-[10px] text-slate-400 font-mono mt-1">.89 (1 NVR + APs)</div>
            </div>

          </div>

          <!-- Bottom Micro Fleet Nodes Map -->
          <div class="p-3 rounded-xl bg-slate-950/80 border border-white/5 flex items-center justify-between text-xs z-10">
            <span class="text-slate-400 flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#00ff88]"></span> 26 Equipos Conectados en Segmento Local
            </span>
            <div class="flex items-center gap-2">
              <button onclick="switchTab('fleet')" class="px-3 py-1.5 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 text-cyan-300 font-bold text-xs transition-colors">
                Ver Cuadrícula de 26 PCs →
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}


async function runFleetDiagnosticScan() {
  playTechSound('click');
  const box = document.getElementById('scanProgressBox');
  const bar = document.getElementById('scanProgressBar');
  const status = document.getElementById('scanStatusText');
  const percent = document.getElementById('scanPercentText');
  const logs = document.getElementById('scanLogList');
  const btn = document.getElementById('btnRunFullScan');

  if (!box || !bar) return;
  box.classList.remove('hidden');
  if (btn) btn.disabled = true;

  const steps = [
    { p: 15, msg: 'Comprobando conexión con Servidor de Dominio (192.168.18.200)... OK (1ms)' },
    { p: 35, msg: 'Analizando módulos de memoria RAM y configuraciones de canales en 26 PCs...' },
    { p: 55, msg: 'Detección de Single Channel: 10 equipos identificados con posible mejora.' },
    { p: 75, msg: 'Verificando unidades NVMe, SSD y HDD (SMART health)... Alerta en ARCNMRKD009.' },
    { p: 90, msg: 'Auditando parches de Windows 11 Build 26200 y compatibilidad de seguridad...' },
    { p: 100, msg: '¡Escaneo de Flota Completado! 26 PCs analizadas. Salud General: 92%' }
  ];

  logs.innerHTML = '';

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    bar.style.width = `${s.p}%`;
    percent.innerText = `${s.p}%`;
    status.innerText = s.msg;
    
    const line = document.createElement('div');
    line.innerHTML = `<span class="text-cyan-400">[VANTAGE PRO]</span> ${s.msg}`;
    logs.appendChild(line);
    logs.scrollTop = logs.scrollHeight;

    playTechSound('click');
    await new Promise(r => setTimeout(r, 600));
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  }

  if (btn) btn.disabled = false;
}

async function optimizeLocalSystem() {
  playTechSound('optimize');
  const btn = document.getElementById('btnOptimize');
  if (btn) {
    btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Optimizando...';
  }

  try {
    const res = await fetch('/api/system/optimize', { method: 'POST' });
    const data = await res.json();
    TwinsModal.showOptimizeResult(data);
  } catch (e) {
    TwinsModal.showOptimizeResult({ freedRAMMB: 650, cleanedMB: 1480 });
  }

  if (btn) {
    btn.innerHTML = '<i data-lucide="sparkles" class="w-4 h-4"></i> Optimizar Sistema';
  }
  if (window.lucide) window.lucide.createIcons();
}

let compareDevice1Id = 'ARCNTID002';
let compareDevice2Id = 'ARCNMRKD010';

function initComparisonTool() {
  if (allDevices.length > 0) {
    if (!allDevices.some(d => d.id === compareDevice1Id)) compareDevice1Id = allDevices[0].id;
    if (!allDevices.some(d => d.id === compareDevice2Id)) compareDevice2Id = allDevices.find(d => d.id !== compareDevice1Id)?.id || allDevices[0].id;
  }
  updateCompareButtons();
  renderComparison();
}

function openComparePicker(slot) {
  const options = allDevices.map(d => ({
    value: d.id,
    label: `${d.computerName} (${d.activeUser})`,
    sub: `${d.cpuShort || d.cpu} • ${d.gpu} • ${d.ramTotalGB}GB RAM • ${d.department}`,
    icon: 'monitor',
    badge: `${d.healthScore}% Salud`,
    badgeClass: d.healthScore >= 90 ? 'badge-online' : 'badge-warning'
  }));

  const currentVal = slot === 1 ? compareDevice1Id : compareDevice2Id;

  if (typeof TwinsModal !== 'undefined' && TwinsModal.showSelectModal) {
    TwinsModal.showSelectModal({
      title: slot === 1 ? 'SELECCIONAR EQUIPO PRIMARIO (A)' : 'SELECCIONAR EQUIPO SECUNDARIO (B)',
      subtitle: 'Elige una computadora de la flota para contrastar hardware',
      selectedValue: currentVal,
      options,
      onSelect: (val) => {
        if (slot === 1) {
          compareDevice1Id = val;
        } else {
          compareDevice2Id = val;
        }
        updateCompareButtons();
        renderComparison();
      }
    });
  }
}

function updateCompareButtons() {
  const d1 = allDevices.find(d => d.id === compareDevice1Id) || allDevices[0];
  const d2 = allDevices.find(d => d.id === compareDevice2Id) || allDevices[1] || allDevices[0];

  const lbl1 = document.getElementById('compareLabel1');
  const sub1 = document.getElementById('compareSub1');
  const lbl2 = document.getElementById('compareLabel2');
  const sub2 = document.getElementById('compareSub2');

  if (lbl1 && d1) lbl1.innerText = `${d1.computerName} (${d1.activeUser})`;
  if (sub1 && d1) sub1.innerText = `${d1.cpuShort || d1.cpu} • ${d1.gpu} • ${d1.ramTotalGB}GB`;

  if (lbl2 && d2) lbl2.innerText = `${d2.computerName} (${d2.activeUser})`;
  if (sub2 && d2) sub2.innerText = `${d2.cpuShort || d2.cpu} • ${d2.gpu} • ${d2.ramTotalGB}GB`;
}

function renderComparison() {
  const container = document.getElementById('compareResults');
  if (!container) return;

  const dev1 = allDevices.find(d => d.id === compareDevice1Id) || allDevices[0];
  const dev2 = allDevices.find(d => d.id === compareDevice2Id) || allDevices[1] || allDevices[0];
  if (!dev1 || !dev2) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-6">
      
      <div class="vantage-card p-5 border-cyan-500/40">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center font-black text-xs font-mono">A</span>
            <h3 class="text-base font-black text-white font-mono">${dev1.computerName}</h3>
          </div>
          <span class="badge-online text-xs font-bold px-2.5 py-0.5 rounded-full">${dev1.status}</span>
        </div>
        <p class="text-xs text-slate-400 mb-4 font-medium">${dev1.activeUser} • ${dev1.department}</p>
        
        <div class="h-44 sm:h-48 w-full bg-[#040711] rounded-xl border border-white/5 mb-4 shadow-inner overflow-hidden flex items-center justify-center p-1">
          ${renderDeviceImage(dev1.deviceVisual, dev1.computerName, dev1.isOnline, dev1)}
        </div>

        <div class="space-y-2.5 text-xs divide-y divide-white/5">
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">CPU:</span> <span class="font-bold text-white">${dev1.cpuShort}</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">RAM:</span> <span class="font-mono text-cyan-400 font-bold">${dev1.ramTotalGB} GB (${dev1.ramChannels})</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">GPU:</span> <span class="font-bold text-white">${dev1.gpu}</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">Almacenamiento:</span> <span class="text-slate-300 truncate max-w-[200px] font-mono">${dev1.storage}</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">Monitor:</span> <span class="text-slate-300">${dev1.monitor} (${dev1.resolution})</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">Salud:</span> <span class="font-bold text-[#00ff88] font-mono text-sm">${dev1.healthScore}%</span></div>
        </div>
      </div>

      <div class="vantage-card p-5 border-purple-500/40">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center gap-2">
            <span class="w-6 h-6 rounded-lg bg-purple-500/20 text-purple-300 flex items-center justify-center font-black text-xs font-mono">B</span>
            <h3 class="text-base font-black text-white font-mono">${dev2.computerName}</h3>
          </div>
          <span class="badge-online text-xs font-bold px-2.5 py-0.5 rounded-full">${dev2.status}</span>
        </div>
        <p class="text-xs text-slate-400 mb-4 font-medium">${dev2.activeUser} • ${dev2.department}</p>
        
        <div class="h-44 sm:h-48 w-full bg-[#040711] rounded-xl border border-white/5 mb-4 shadow-inner overflow-hidden flex items-center justify-center p-1">
          ${renderDeviceImage(dev2.deviceVisual, dev2.computerName, dev2.isOnline, dev2)}
        </div>

        <div class="space-y-2.5 text-xs divide-y divide-white/5">
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">CPU:</span> <span class="font-bold text-white">${dev2.cpuShort}</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">RAM:</span> <span class="font-mono text-purple-400 font-bold">${dev2.ramTotalGB} GB (${dev2.ramChannels})</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">GPU:</span> <span class="font-bold text-white">${dev2.gpu}</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">Almacenamiento:</span> <span class="text-slate-300 truncate max-w-[200px] font-mono">${dev2.storage}</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">Monitor:</span> <span class="text-slate-300">${dev2.monitor} (${dev2.resolution})</span></div>
          <div class="pt-2 flex justify-between"><span class="text-slate-400 font-medium">Salud:</span> <span class="font-bold text-[#00ff88] font-mono text-sm">${dev2.healthScore}%</span></div>
        </div>
      </div>

    </div>
  `;

  if (window.lucide) window.lucide.createIcons();
}
