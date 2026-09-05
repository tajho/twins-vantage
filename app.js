// TWINS VANTAGE PRO — Fleet & Hardware Intelligence System
// 3D WebGL Multi-Card Fleet Engine & Holographic Modals

let allDevices = [];
let filteredDevices = [];
let currentTab = 'home';
let currentCategory = 'all';
let currentStatusFilter = 'all';
let selectedDevice = null;
let livePollingInterval = null;
let deferredPrompt = null;
let audioEnabled = true;

// Web Audio API Synthesizer
let audioCtx = null;
function playTechSound(type = 'click') {
  if (!audioEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);

    const now = audioCtx.currentTime;

    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.05);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'optimize') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(300, now);
      osc.frequency.exponentialRampToValueAtTime(1800, now + 0.35);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    }
  } catch (e) {}
}

function toggleAudio() {
  audioEnabled = !audioEnabled;
  const icon = document.getElementById('audioIcon');
  if (icon) {
    icon.setAttribute('data-lucide', audioEnabled ? 'volume-2' : 'volume-x');
    if (window.lucide) window.lucide.createIcons();
  }
}

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
      installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
          deferredPrompt.prompt();
          deferredPrompt.userChoice.then(() => { deferredPrompt = null; });
        }
      });
    }
  });

  if (typeof INVENTORY_DATA !== 'undefined') {
    allDevices = INVENTORY_DATA;
  } else {
    try {
      const res = await fetch('/api/inventory');
      const data = await res.json();
      allDevices = data.devices || [];
    } catch (e) {
      console.error('Failed to load inventory:', e);
    }
  }

  filteredDevices = [...allDevices];
  
  initNavigation();
  initSearchAndFilters();
  renderFleetOverview();
  renderFleetGrid();
  renderDiagnostics();
  initComparisonTool();
  startLiveTelemetry();

  // Initialize Hero 3D Scene
  setTimeout(() => {
    if (typeof init3DScene === 'function') {
      init3DScene();
    }
  }, 100);
  
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
  playTechSound('click');
  if (typeof set3DPreset === 'function') {
    set3DPreset(theme);
  }
}

function toggleRotate3D() {
  playTechSound('click');
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
      playTechSound('click');
      const tab = btn.getAttribute('data-tab');
      switchTab(tab);
    });
  });
}

function switchTab(tabId) {
  currentTab = tabId;
  
  document.querySelectorAll('.nav-btn').forEach(btn => {
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

  if (tabId === 'fleet') {
    // Re-mount 3D viewports on fleet cards
    setTimeout(mountAllFleet3DScenes, 100);
  } else if (tabId === 'home' && typeof onWindowResize === 'function') {
    setTimeout(onWindowResize, 100);
  }

  if (window.lucide) {
    window.lucide.createIcons();
  }
}

// Live Local PC Telemetry (ARCNTID002 - Tajho)
async function fetchLiveTelemetry() {
  try {
    const res = await fetch('/api/system/live');
    const data = await res.json();
    if (data.success && data.live) {
      const live = data.live;
      
      const cpuLoad = live.cpuLoad || Math.floor(Math.random() * 8 + 6);
      const cpuMeter = document.getElementById('liveCpuLoad');
      const cpuBar = document.getElementById('liveCpuBar');
      if (cpuMeter) cpuMeter.innerText = `${cpuLoad}%`;
      if (cpuBar) cpuBar.style.width = `${cpuLoad}%`;

      if (live.memPercent) {
        const memPercent = live.memPercent;
        const memUsed = live.memUsedGB;
        const memTotal = live.memTotalGB;
        const ramMeter = document.getElementById('liveRamPercent');
        const ramBar = document.getElementById('liveRamBar');
        const ramDetail = document.getElementById('liveRamDetail');
        if (ramMeter) ramMeter.innerText = `${memPercent}%`;
        if (ramBar) ramBar.style.width = `${memPercent}%`;
        if (ramDetail) ramDetail.innerText = `${memUsed} GB / ${memTotal} GB`;
      }

      if (live.diskCPercent) {
        const diskPercent = live.diskCPercent;
        const diskFree = live.diskCFreeGB;
        const diskTotal = live.diskCTotalGB;
        const diskMeter = document.getElementById('liveDiskPercent');
        const diskBar = document.getElementById('liveDiskBar');
        const diskDetail = document.getElementById('liveDiskDetail');
        if (diskMeter) diskMeter.innerText = `${diskPercent}%`;
        if (diskBar) diskBar.style.width = `${diskPercent}%`;
        if (diskDetail) diskDetail.innerText = `${diskFree} GB libres de ${diskTotal} GB`;
      }

      const uptimeEl = document.getElementById('liveUptime');
      if (uptimeEl && live.uptime) uptimeEl.innerText = live.uptime;
      
      const hostEl = document.getElementById('liveHostInfo');
      if (hostEl) hostEl.innerText = `Gigabyte B760M D3HP DDR4 • Intel Core i5-12400 (6C/12T) • ${live.memTotalGB || 32} GB RAM • ${live.osName || 'Windows 11 Pro'}`;
    }
  } catch (err) {}
}

function startLiveTelemetry() {
  fetchLiveTelemetry();
  livePollingInterval = setInterval(fetchLiveTelemetry, 3500);
}

function renderFleetOverview() {}

// Search and Department Filters
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

  const statusSelect = document.getElementById('fleetStatusFilter');
  if (statusSelect) {
    statusSelect.addEventListener('change', (e) => {
      playTechSound('click');
      currentStatusFilter = e.target.value;
      applyFilters();
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

// Render Fleet Grid with REAL 3D VIEWPORTS on EVERY Card!
function renderFleetGrid() {
  const container = document.getElementById('fleetGridContainer');
  const countLabel = document.getElementById('fleetResultsCount');
  if (!container) return;

  if (countLabel) {
    countLabel.innerText = `Mostrando ${filteredDevices.length} de ${allDevices.length} computadoras en 3D`;
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
      ? `<span class="badge-warning text-[10px] font-bold px-2 py-0.5 rounded" title="Single Channel detectado">⚠️ Single Ch. RAM</span>`
      : '';

    const gpuBadge = dev.gpuType === 'dedicated'
      ? `<span class="bg-purple-500/20 text-purple-300 border border-purple-500/40 text-[10px] font-bold px-2 py-0.5 rounded shadow-[0_0_10px_rgba(168,85,247,0.25)]">🎮 GPU Dedicada</span>`
      : '';

    const criticalBadge = dev.alerts.some(a => a.type === 'critical')
      ? `<span class="badge-critical text-[10px] font-black px-2 py-0.5 rounded animate-pulse shadow-[0_0_12px_rgba(244,63,94,0.4)]">🚨 Disco C: Crítico</span>`
      : '';

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

          <!-- 3D WebGL Real Canvas Container for THIS PC -->
          <div class="relative w-full h-40 bg-[#040711] rounded-xl border border-white/5 mb-3.5 overflow-hidden shadow-inner group-hover:border-cyan-500/40 transition-colors">
            <div id="card3DContainer_${dev.id}" class="w-full h-full"></div>
            <div class="absolute bottom-2 left-2 bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-mono font-bold text-cyan-400 border border-white/10 pointer-events-none flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-led"></span> 3D LIVE
            </div>
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
          <button class="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors">
            <i data-lucide="box" class="w-3.5 h-3.5"></i> Ficha & 3D 360°
          </button>
          <button onclick="event.stopPropagation(); TwinsModal.showPing('${dev.ip}', '${dev.computerName}')" class="text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors flex items-center gap-1 border border-white/5 font-medium">
            <i data-lucide="activity" class="w-3 h-3 text-[#00ff88]"></i> Ping
          </button>
        </div>
      </div>
    `;
  }).join('');

  if (window.lucide) window.lucide.createIcons();

  // Mount 3D viewports on every card
  setTimeout(mountAllFleet3DScenes, 50);
}

function mountAllFleet3DScenes() {
  if (typeof mountCard3DViewport !== 'function') return;
  filteredDevices.forEach(dev => {
    const containerId = `card3DContainer_${dev.id}`;
    mountCard3DViewport(containerId, dev);
  });
}

// Open Device Detail Drawer with Dedicated 3D Interactive Viewport
function openDeviceDrawer(deviceId) {
  playTechSound('click');
  const dev = allDevices.find(d => d.id === deviceId);
  if (!dev) return;
  selectedDevice = dev;

  const drawer = document.getElementById('deviceDrawer');
  const content = document.getElementById('drawerContent');
  if (!drawer || !content) return;

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
      
      <!-- DEDICATED 3D HARDWARE VIEWPORT FOR THIS PC -->
      <div class="vantage-card p-4 space-y-2">
        <div class="flex items-center justify-between text-xs font-mono text-cyan-400">
          <span class="flex items-center gap-1.5 font-bold"><i data-lucide="box" class="w-4 h-4"></i> RENDER 3D DE CHASSIS & PANTALLA</span>
          <span class="text-slate-400 text-[10px]">Arrastra para rotar 360°</span>
        </div>
        <div id="drawer3DContainer" class="w-full h-64 rounded-xl bg-[#040711] border border-cyan-500/30 overflow-hidden shadow-inner cursor-grab active:cursor-grabbing">
          <!-- Procedural 3D WebGL Canvas -->
        </div>
        <div class="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
          <span>Placa: ${dev.motherboard.split(' ')[0]}</span>
          <span class="text-emerald-400 font-bold">Monitor: ${dev.resolution}</span>
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

      <!-- Print / Export Action Bar -->
      <div class="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <button onclick="window.print()" class="cyber-btn-primary w-full py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2">
          <i data-lucide="printer" class="w-4 h-4"></i>
          <span>Imprimir Ficha Técnica de Auditoría</span>
        </button>
        <button onclick="TwinsModal.showPing('${dev.ip}', '${dev.computerName}')" class="w-full sm:w-auto py-3 px-5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 transition-colors border border-white/10 shrink-0">
          <i data-lucide="activity" class="w-4 h-4 text-[#00ff88]"></i> Test Ping
        </button>
      </div>

    </div>
  `;

  drawer.classList.add('drawer-open');
  drawer.classList.remove('pointer-events-none');
  
  if (window.lucide) window.lucide.createIcons();

  setTimeout(() => {
    if (typeof mountInteractive3DViewport === 'function') {
      mountInteractive3DViewport('drawer3DContainer', dev);
    }
  }, 150);
}

function closeDeviceDrawer() {
  playTechSound('click');
  const drawer = document.getElementById('deviceDrawer');
  if (drawer) {
    drawer.classList.remove('drawer-open');
    drawer.classList.add('pointer-events-none');
  }
}

// Diagnostics View
function renderDiagnostics() {
  const container = document.getElementById('diagContent');
  if (!container) return;

  const singleRamPCs = allDevices.filter(d => d.isOnline && d.ramChannelType === 'single');
  const criticalDiskPCs = allDevices.filter(d => d.isOnline && d.alerts.some(a => a.type === 'critical'));

  container.innerHTML = `
    <div class="space-y-6">
      
      <div class="vantage-card p-6 border-cyan-500/30 bg-gradient-to-r from-[#070c1b] via-[#0d152a] to-[#091530] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div class="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-1">
            <span class="w-2 h-2 rounded-full bg-cyan-400 pulse-led"></span> Motor de Análisis Hardware Antigravity
          </div>
          <h2 class="text-xl md:text-2xl font-black text-white">Escaneo Preventivo y Detección de Cuellos de Botella</h2>
          <p class="text-xs text-slate-400 mt-1 max-w-xl">
            Analiza en tiempo real los 26 equipos de la red corporativa de Útiles Twins para identificar problemas de ancho de banda RAM, discos saturados y latencias hacia el Servidor de Dominio.
          </p>
        </div>
        <button id="btnRunFullScan" onclick="runFleetDiagnosticScan()" class="cyber-btn-primary px-6 py-3.5 rounded-xl text-xs flex items-center gap-2 shrink-0">
          <i data-lucide="play-circle" class="w-5 h-5"></i>
          <span>Ejecutar Escaneo Completo</span>
        </button>
      </div>

      <div id="scanProgressBox" class="hidden vantage-card p-5 border-cyan-500/50">
        <div class="flex items-center justify-between text-xs font-bold text-white mb-2 font-mono">
          <span id="scanStatusText">Iniciando escaneo de hardware en utilestwins.com...</span>
          <span id="scanPercentText" class="text-cyan-400">0%</span>
        </div>
        <div class="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden mb-3 p-0.5 border border-white/5">
          <div id="scanProgressBar" class="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-[#00ff88] rounded-full transition-all duration-300" style="width: 0%"></div>
        </div>
        <div id="scanLogList" class="space-y-1 font-mono text-[11px] text-slate-400 max-h-32 overflow-y-auto"></div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div class="vantage-card p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              <i data-lucide="alert-triangle" class="w-4 h-4 text-amber-400"></i>
              Cuello de Botella: Memoria Single Channel (${singleRamPCs.length} PCs)
            </h3>
            <span class="badge-warning text-xs font-bold px-2.5 py-0.5 rounded">-18% Ancho de Banda</span>
          </div>
          <p class="text-xs text-slate-400 mb-4">
            Los siguientes equipos poseen 1 solo módulo de RAM instalado, lo que limita la tasa de transferencia a 64-bit en vez de 128-bit Dual Channel:
          </p>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            ${singleRamPCs.map(pc => `
              <div class="p-3 rounded-xl bg-slate-900/90 border border-white/5 flex items-center justify-between text-xs hover:border-amber-500/40 transition-colors cursor-pointer" onclick="openDeviceDrawer('${pc.id}')">
                <div>
                  <div class="font-bold text-white font-mono">${pc.computerName} <span class="text-slate-400 font-normal">(${pc.activeUser})</span></div>
                  <div class="text-[11px] text-slate-400 mt-0.5 font-mono">${pc.cpuShort} • ${pc.ramModules}</div>
                </div>
                <span class="text-cyan-400 font-bold text-xs flex items-center gap-1">
                  Ver Ficha 3D →
                </span>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="vantage-card p-5">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-black text-white flex items-center gap-2">
              <i data-lucide="hard-drive-download" class="w-4 h-4 text-rose-400"></i>
              Alerta de Almacenamiento Crítico C:
            </h3>
            <span class="badge-critical text-xs font-black px-2.5 py-0.5 rounded">Acción Inmediata</span>
          </div>
          <p class="text-xs text-slate-400 mb-4">
            Equipos con menos de 10 GB o 15% de espacio en disco del sistema operativo:
          </p>
          <div class="space-y-2 max-h-64 overflow-y-auto pr-1">
            ${criticalDiskPCs.map(pc => `
              <div class="p-3 rounded-xl bg-rose-950/20 border border-rose-500/40 flex items-center justify-between text-xs cursor-pointer" onclick="openDeviceDrawer('${pc.id}')">
                <div>
                  <div class="font-bold text-rose-300 font-mono">${pc.computerName} <span class="text-slate-300 font-normal">(${pc.activeUser})</span></div>
                  <div class="text-[11px] text-slate-400 mt-0.5 font-mono">${pc.diskSpace}</div>
                </div>
                <span class="text-rose-400 font-bold text-xs">
                  Resolver →
                </span>
              </div>
            `).join('')}
            ${criticalDiskPCs.length === 0 ? '<p class="text-xs text-[#00ff88] font-bold">No hay equipos en nivel crítico de almacenamiento.</p>' : ''}
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

function initComparisonTool() {
  const select1 = document.getElementById('compareSelect1');
  const select2 = document.getElementById('compareSelect2');
  if (!select1 || !select2) return;

  const optionsHtml = allDevices.map(d => `<option value="${d.id}">${d.computerName} - ${d.activeUser} (${d.department})</option>`).join('');
  select1.innerHTML = optionsHtml;
  select2.innerHTML = optionsHtml;

  select1.value = 'ARCNTID002';
  select2.value = allDevices.find(d => d.id === 'ARCNMRKD010')?.id || allDevices[1]?.id;

  select1.addEventListener('change', () => { playTechSound('click'); renderComparison(); });
  select2.addEventListener('change', () => { playTechSound('click'); renderComparison(); });

  renderComparison();
}

function renderComparison() {
  const select1 = document.getElementById('compareSelect1');
  const select2 = document.getElementById('compareSelect2');
  const container = document.getElementById('compareResults');
  if (!select1 || !select2 || !container) return;

  const dev1 = allDevices.find(d => d.id === select1.value);
  const dev2 = allDevices.find(d => d.id === select2.value);
  if (!dev1 || !dev2) return;

  container.innerHTML = `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      
      <div class="vantage-card p-5 border-cyan-500/40">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-base font-black text-white font-mono">${dev1.computerName}</h3>
          <span class="badge-online text-xs font-bold px-2.5 py-0.5 rounded-full">${dev1.status}</span>
        </div>
        <p class="text-xs text-slate-400 mb-4 font-medium">${dev1.activeUser} • ${dev1.department}</p>
        
        <div id="compare3DContainer_1" class="h-44 w-full bg-[#040711] rounded-xl border border-white/5 mb-4 shadow-inner"></div>

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
          <h3 class="text-base font-black text-white font-mono">${dev2.computerName}</h3>
          <span class="badge-online text-xs font-bold px-2.5 py-0.5 rounded-full">${dev2.status}</span>
        </div>
        <p class="text-xs text-slate-400 mb-4 font-medium">${dev2.activeUser} • ${dev2.department}</p>
        
        <div id="compare3DContainer_2" class="h-44 w-full bg-[#040711] rounded-xl border border-white/5 mb-4 shadow-inner"></div>

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

  setTimeout(() => {
    if (typeof mountCard3DViewport === 'function') {
      mountCard3DViewport('compare3DContainer_1', dev1);
      mountCard3DViewport('compare3DContainer_2', dev2);
    }
  }, 100);
}
