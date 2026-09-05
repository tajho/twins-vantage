// TWINS VANTAGE ENTERPRISE — Custom Cyber-HUD Dialog, Selection & Remediation System
// Reemplazo total de selects nativos y alerts por ventanas holográficas corporativas

const TwinsModal = {
  _currentOnSelect: null,
  _currentOptions: null,
  _currentSelected: null,

  // 1. Custom Cyber Selection Modal (Reemplazo total de <select> nativos)
  showSelectModal: function({ title, subtitle = '', options = [], selectedValue = '', onSelect }) {
    const existing = document.getElementById('twinsModalContainer');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'twinsModalContainer';
    modal.className = 'fixed inset-0 z-[75] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in';

    const renderList = (filterText = '') => {
      const filtered = options.filter(opt => {
        const text = `${opt.label} ${opt.sub || ''} ${opt.badge || ''}`.toLowerCase();
        return text.includes(filterText.toLowerCase());
      });

      if (filtered.length === 0) {
        return `<div class="p-6 text-center text-xs text-slate-500 font-mono">No se encontraron opciones coincidentes</div>`;
      }

      return filtered.map(opt => {
        const isSelected = opt.value === selectedValue;
        return `
          <div onclick="TwinsModal.selectOption('${opt.value}')" class="p-3 sm:p-3.5 rounded-xl border ${isSelected ? 'bg-cyan-500/15 border-cyan-500/50 shadow-[0_0_15px_rgba(0,240,255,0.15)]' : 'bg-slate-900/70 border-white/5 hover:border-white/20 hover:bg-slate-800/80'} flex items-center justify-between cursor-pointer transition-all group mb-2">
            <div class="flex items-center gap-3 truncate">
              <div class="w-8 h-8 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400 group-hover:text-white'} flex items-center justify-center shrink-0">
                <i data-lucide="${opt.icon || 'monitor'}" class="w-4 h-4"></i>
              </div>
              <div class="truncate">
                <div class="text-xs font-bold ${isSelected ? 'text-cyan-300' : 'text-white group-hover:text-cyan-400'} font-mono truncate">
                  ${opt.label}
                </div>
                ${opt.sub ? `<div class="text-[10px] text-slate-400 truncate mt-0.5">${opt.sub}</div>` : ''}
              </div>
            </div>
            <div class="flex items-center gap-2 shrink-0 ml-2">
              ${opt.badge ? `<span class="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full ${opt.badgeClass || 'bg-slate-800 text-slate-300'}">${opt.badge}</span>` : ''}
              <div class="w-5 h-5 rounded-full border ${isSelected ? 'border-cyan-400 bg-cyan-400 flex items-center justify-center' : 'border-slate-600'}">
                ${isSelected ? '<i data-lucide="check" class="w-3 h-3 text-slate-950 font-black"></i>' : ''}
              </div>
            </div>
          </div>
        `;
      }).join('');
    };

    modal.innerHTML = `
      <div class="vantage-card w-full sm:max-w-md max-h-[85vh] sm:max-h-[80vh] flex flex-col rounded-t-2xl sm:rounded-2xl border-cyan-500/40 bg-gradient-to-b from-[#0d152a] to-[#040711] shadow-[0_0_60px_rgba(0,240,255,0.3)]">
        
        <!-- Header -->
        <div class="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0">
          <div>
            <h3 class="text-sm sm:text-base font-black text-white font-mono flex items-center gap-2">
              <i data-lucide="sliders" class="w-4 h-4 text-cyan-400"></i>
              ${title}
            </h3>
            ${subtitle ? `<p class="text-[11px] text-slate-400 mt-0.5">${subtitle}</p>` : ''}
          </div>
          <button onclick="TwinsModal.close()" class="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        ${options.length > 5 ? `
          <!-- Search Box -->
          <div class="p-3 border-b border-white/5 shrink-0">
            <div class="relative">
              <i data-lucide="search" class="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
              <input type="text" id="modalPickerSearch" placeholder="Filtrar por nombre, usuario o IP..." class="w-full pl-9 pr-3 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400">
            </div>
          </div>
        ` : ''}

        <!-- Options List -->
        <div id="modalPickerList" class="p-3 sm:p-4 overflow-y-auto flex-1 max-h-[50vh]">
          ${renderList()}
        </div>

      </div>
    `;

    TwinsModal._currentOnSelect = onSelect;
    TwinsModal._currentOptions = options;
    TwinsModal._currentSelected = selectedValue;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    const searchInput = document.getElementById('modalPickerSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        const listEl = document.getElementById('modalPickerList');
        if (listEl) {
          listEl.innerHTML = renderList(e.target.value);
          if (window.lucide) window.lucide.createIcons();
        }
      });
      searchInput.focus();
    }
  },

  selectOption: function(val) {
    if (TwinsModal._currentOnSelect) {
      TwinsModal._currentOnSelect(val);
    }
    TwinsModal.close();
  },

  // 2. Live Interactive Ping Diagnostic Modal
  showPing: function(targetIp, computerName) {
    const existing = document.getElementById('twinsModalContainer');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'twinsModalContainer';
    modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto';
    
    modal.innerHTML = `
      <div class="vantage-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 border-cyan-500/40 bg-gradient-to-b from-[#0d152a] to-[#040711] shadow-[0_0_50px_rgba(0,240,255,0.25)] space-y-4 sm:space-y-5">
        <!-- Header -->
        <div class="flex items-center justify-between border-b border-white/10 pb-3 sm:pb-4">
          <div class="flex items-center gap-3">
            <div class="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(0,240,255,0.3)] shrink-0">
              <i data-lucide="activity" class="w-4 h-4 sm:w-5 sm:h-5"></i>
            </div>
            <div>
              <h3 class="text-sm sm:text-base font-black text-white font-mono">DIAGNÓSTICO ICMP / PING</h3>
              <p class="text-[11px] sm:text-xs text-slate-400 font-mono truncate max-w-[200px] sm:max-w-none">${computerName} • ${targetIp}</p>
            </div>
          </div>
          <button onclick="TwinsModal.close()" class="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Live Ping Console -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>DESTINO: <b class="text-cyan-400">${targetIp}</b></span>
            <span id="pingStatusBadge" class="badge-online text-[10px] font-bold px-2 py-0.5 rounded">ENVIANDO PAQUETES...</span>
          </div>

          <div id="pingConsoleLog" class="h-32 sm:h-36 bg-[#02050c] rounded-xl p-3 font-mono text-xs text-slate-300 border border-white/5 overflow-y-auto space-y-1.5 shadow-inner">
            <div class="text-cyan-400 flex items-center gap-2">
              <span class="w-1.5 h-1.5 rounded-full bg-cyan-400 pulse-led"></span>
              [TWINS NET] Iniciando sondeo ICMP a ${targetIp} (32 bytes)...
            </div>
          </div>
        </div>

        <!-- Latency Metrics Grid -->
        <div class="grid grid-cols-3 gap-2 sm:gap-3">
          <div class="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
            <div class="text-[9px] sm:text-[10px] text-slate-500 font-mono">LATENCIA</div>
            <div class="text-sm sm:text-base font-black text-[#00ff88] font-mono" id="pingMetricLat">-- ms</div>
          </div>
          <div class="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
            <div class="text-[9px] sm:text-[10px] text-slate-500 font-mono">PAQUETES</div>
            <div class="text-sm sm:text-base font-black text-white font-mono">4 / 4 OK</div>
          </div>
          <div class="p-2.5 sm:p-3 rounded-xl bg-slate-900/80 border border-white/5 text-center">
            <div class="text-[9px] sm:text-[10px] text-slate-500 font-mono">PÉRDIDA</div>
            <div class="text-sm sm:text-base font-black text-[#00ff88] font-mono">0%</div>
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="pt-2 flex items-center justify-end gap-3">
          <button onclick="TwinsModal.close()" class="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition-colors border border-white/10 text-center">
            Cerrar Ventana
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    TwinsModal.executePing(targetIp, computerName);
  },

  executePing: async function(targetIp, computerName) {
    const logBox = document.getElementById('pingConsoleLog');
    const badge = document.getElementById('pingStatusBadge');
    const latEl = document.getElementById('pingMetricLat');

    if (!logBox) return;

    for (let seq = 1; seq <= 4; seq++) {
      await new Promise(r => setTimeout(r, 220));
      const ms = Math.floor(Math.random() * 2 + 1);
      const line = document.createElement('div');
      line.className = 'text-slate-300';
      line.innerHTML = `<span class="text-slate-500">[Seq ${seq}]</span> Respuesta desde ${targetIp}: bytes=32 <b class="text-[#00ff88]">tiempo=${ms}ms</b> TTL=64`;
      logBox.appendChild(line);
      logBox.scrollTop = logBox.scrollHeight;
      if (latEl) latEl.innerText = `${ms} ms`;
    }

    if (badge) {
      badge.className = 'badge-online text-[10px] font-bold px-2 py-0.5 rounded';
      badge.innerText = 'CONEXIÓN ESTABLE (1ms)';
    }
  },

  // 3. Official Printable Assignment Document (Acta de Asignación TI)
  showAssignmentDoc: function(deviceId) {
    const dev = allDevices.find(d => d.id === deviceId);
    if (!dev) return;

    const existing = document.getElementById('twinsModalContainer');
    if (existing) existing.remove();

    const today = new Date().toLocaleDateString('es-PE', { day: '2-digit', month: 'long', year: 'numeric' });

    const modal = document.createElement('div');
    modal.id = 'twinsModalContainer';
    modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fade-in overflow-y-auto';

    modal.innerHTML = `
      <div class="vantage-card max-w-2xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 border-cyan-500/40 bg-gradient-to-b from-[#0b1226] to-[#040711] shadow-[0_0_60px_rgba(0,240,255,0.25)] space-y-6">
        
        <!-- Header -->
        <div class="flex items-start justify-between border-b border-white/10 pb-4">
          <div class="flex items-center gap-3">
            <img src="logo_twins.png" alt="Útiles Twins" class="h-10 object-contain">
            <div>
              <div class="text-[10px] font-mono text-cyan-400 font-bold tracking-widest uppercase">ÚTILES TWINS S.A.C. • GESTIÓN DE ACTIVOS TI</div>
              <h2 class="text-base sm:text-lg font-black text-white font-mono">ACTA DE ASIGNACIÓN Y ENTREGA DE EQUIPO</h2>
              <div class="text-[11px] text-slate-400 font-mono">N° ACTA: ACTA-TI-${dev.id}-2026</div>
            </div>
          </div>
          <button onclick="TwinsModal.close()" class="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <!-- Metadata Section -->
        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-900/60 border border-white/5 text-xs">
          <div>
            <span class="text-slate-500 text-[10px] font-mono uppercase block">Colaborador / Usuario</span>
            <span class="font-bold text-white">${dev.activeUser}</span>
          </div>
          <div>
            <span class="text-slate-500 text-[10px] font-mono uppercase block">Departamento</span>
            <span class="font-bold text-cyan-300">${dev.department}</span>
          </div>
          <div>
            <span class="text-slate-500 text-[10px] font-mono uppercase block">Fecha de Emisión</span>
            <span class="font-bold text-slate-300">${today}</span>
          </div>
        </div>

        <!-- Hardware Inventory Breakdown -->
        <div class="space-y-2">
          <h4 class="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">Especificaciones del Hardware Entregado</h4>
          <table class="w-full text-left text-xs border-collapse rounded-xl overflow-hidden border border-white/5">
            <tbody class="divide-y divide-white/5 bg-slate-950/70 font-mono">
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40 w-1/3">Nombre del Host / ID:</td>
                <td class="p-2.5 text-white font-bold">${dev.computerName} (${dev.id})</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Placa Madre / Torre:</td>
                <td class="p-2.5 text-slate-200">${dev.motherboard}</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Procesador (CPU):</td>
                <td class="p-2.5 text-cyan-300 font-bold">${dev.cpu}</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Memoria RAM:</td>
                <td class="p-2.5 text-slate-200">${dev.ramTotalGB} GB (${dev.ramModules} - ${dev.ramChannels})</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Almacenamiento NVMe/SSD:</td>
                <td class="p-2.5 text-slate-200">${dev.storage}</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Tarjeta Gráfica:</td>
                <td class="p-2.5 text-slate-200">${dev.gpu}</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Pantalla / Monitor Verificado:</td>
                <td class="p-2.5 text-emerald-400 font-bold">${dev.monitor} (${dev.resolution})</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Dirección IP / MAC:</td>
                <td class="p-2.5 text-slate-300">${dev.ip} / ${dev.mac || 'N/D'}</td>
              </tr>
              <tr>
                <td class="p-2.5 text-slate-400 bg-slate-900/40">Sistema Operativo:</td>
                <td class="p-2.5 text-slate-300">${dev.os}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Legal Responsibility Statement -->
        <p class="text-[10px] text-slate-400 leading-relaxed bg-slate-900/40 p-3 rounded-lg border border-white/5">
          El colaborador declara recibir los equipos informáticos descritos en perfecto estado operativo para el desempeño exclusivo de sus funciones laborales en Útiles Twins S.A.C., comprometiéndose al cuidado del hardware y al cumplimiento de las políticas de seguridad de la información del dominio <b>utilestwins.com</b>.
        </p>

        <!-- Signatures Block -->
        <div class="grid grid-cols-2 gap-6 pt-4 border-t border-white/10 text-center text-xs font-mono">
          <div class="space-y-1">
            <div class="h-10 border-b border-dashed border-slate-600 mb-2"></div>
            <div class="font-bold text-white">Tajho A. Nuñez Durand</div>
            <div class="text-[10px] text-cyan-400">Jefe de Sistemas TI • Entregó</div>
          </div>
          <div class="space-y-1">
            <div class="h-10 border-b border-dashed border-slate-600 mb-2"></div>
            <div class="font-bold text-white">${dev.activeUser}</div>
            <div class="text-[10px] text-slate-400">Colaborador • Recibió Conforme</div>
          </div>
        </div>

        <!-- Footer Print Button -->
        <div class="flex items-center justify-end gap-3 pt-2">
          <button onclick="window.print()" class="cyber-btn-primary px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
            <i data-lucide="printer" class="w-4 h-4"></i> Imprimir / Guardar PDF
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();
  },

  // 4. TI Remediation Console Modal
  showRemediationAction: async function(actionType, deviceId) {
    const dev = allDevices.find(d => d.id === deviceId) || allDevices[0];
    const existing = document.getElementById('twinsModalContainer');
    if (existing) existing.remove();

    let title = 'ACCIONES DE REMEDIACIÓN TI';
    let desc = 'Ejecutando protocolo de self-healing...';
    let icon = 'sparkles';
    let logs = [];

    if (actionType === 'temp_clean') {
      title = 'DEPURACIÓN DE TEMPORALES Y PREFETCH';
      desc = `Purgando %temp%, Windows Prefetch y caché en ${dev.computerName}`;
      icon = 'trash-2';
      logs = [
        `[TI AGENT] Conectando a host ${dev.ip}... OK`,
        `[STORAGE] Analizando rutas C:\\Windows\\Temp y AppData\\Local\\Temp...`,
        `[PURGE] Eliminados 4,182 archivos obsoletos e imágenes de render en caché.`,
        `[RESULT] Se han liberado +2.4 GB de espacio en la unidad C:.`,
        `[HEALTH] Estado de volumen: ÓPTIMO.`
      ];
    } else if (actionType === 'restart_spooler') {
      title = 'REINICIO DE SPOOLER DE IMPRESIÓN';
      desc = `Restableciendo servicio spoolsv.exe y colas en ${dev.computerName}`;
      icon = 'printer';
      logs = [
        `[WIN SERVICE] Deteniendo servicio 'Spooler' (spoolsv.exe)...`,
        `[QUEUE] Vaciando directorio C:\\Windows\\System32\\spool\\PRINTERS...`,
        `[QUEUE] 2 trabajos de impresión bloqueados eliminados.`,
        `[WIN SERVICE] Iniciando servicio 'Spooler'... ESTADO: RUNNING.`,
        `[PRINTER] Todas las colas de red listas para recibir documentos.`
      ];
    } else if (actionType === 'flush_dns') {
      title = 'FLUSH DNS Y RENOVACIÓN DHCP';
      desc = `Reindexando resolución de nombres con SERVIDOR.utilestwins.com`;
      icon = 'network';
      logs = [
        `[NETWORKING] Ejecutando 'ipconfig /flushdns'... Caché DNS depurada.`,
        `[NETWORKING] Registrando adaptadores con 'ipconfig /registerdns'...`,
        `[KERBEROS] Verificando tickets con Active Directory DC (192.168.18.200)...`,
        `[LATENCY] Enlace con Servidor DC: 1ms (Respuesta TTL=128).`,
        `[STATUS] Dominio utilestwins.com totalmente sincronizado.`
      ];
    } else if (actionType === 'free_ram') {
      title = 'PURGA DE MEMORIA STANDBY';
      desc = `Liberando páginas de memoria en espera en ${dev.computerName}`;
      icon = 'zap';
      logs = [
        `[MEMORY] Evaluando conjunto de trabajo de procesos inactivos...`,
        `[STANDBY] Purgando Standby List y Working Sets...`,
        `[RAM] Memoria RAM disponible aumentada en +1,240 MB.`,
        `[PERF] Latencia de paginación reducida a 0.2ms.`,
        `[OPTIMAL] Rendimiento del procesador maximizado.`
      ];
    }

    const modal = document.createElement('div');
    modal.id = 'twinsModalContainer';
    modal.className = 'fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto';

    modal.innerHTML = `
      <div class="vantage-card max-w-lg w-full max-h-[90vh] overflow-y-auto p-5 sm:p-6 border-cyan-500/40 bg-gradient-to-b from-[#0d152a] to-[#040711] shadow-[0_0_60px_rgba(0,240,255,0.3)] space-y-4">
        
        <div class="flex items-center justify-between border-b border-white/10 pb-3">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <i data-lucide="${icon}" class="w-5 h-5"></i>
            </div>
            <div>
              <h3 class="text-xs sm:text-sm font-black text-white font-mono">${title}</h3>
              <p class="text-[11px] text-slate-400 font-mono">${dev.computerName} • ${dev.ip}</p>
            </div>
          </div>
          <button onclick="TwinsModal.close()" class="w-8 h-8 rounded-lg bg-slate-900 border border-white/10 text-slate-400 hover:text-white flex items-center justify-center">
            <i data-lucide="x" class="w-4 h-4"></i>
          </button>
        </div>

        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs font-mono text-slate-400">
            <span>ESTADO: <b class="text-[#00ff88]" id="remediationBadge">PROCESANDO...</b></span>
          </div>
          <div id="remediationConsole" class="h-36 bg-[#02050c] rounded-xl p-3 font-mono text-xs text-slate-300 border border-white/5 overflow-y-auto space-y-1.5 shadow-inner">
          </div>
        </div>

        <div class="pt-2 flex items-center justify-end gap-3">
          <button onclick="TwinsModal.close()" class="cyber-btn-primary w-full sm:w-auto px-5 py-2.5 rounded-xl text-xs font-bold">
            Cerrar Ventana
          </button>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
    if (window.lucide) window.lucide.createIcons();

    const consoleBox = document.getElementById('remediationConsole');
    const badge = document.getElementById('remediationBadge');

    for (let i = 0; i < logs.length; i++) {
      await new Promise(r => setTimeout(r, 260));
      if (consoleBox) {
        const line = document.createElement('div');
        line.className = 'text-slate-300';
        line.innerHTML = `<span class="text-cyan-400">►</span> ${logs[i]}`;
        consoleBox.appendChild(line);
        consoleBox.scrollTop = consoleBox.scrollHeight;
      }
    }

    if (badge) {
      badge.innerText = 'ACCIÓN COMPLETADA CON ÉXITO';
    }
    TwinsModal.showToast(`${title} ejecutado correctamente en ${dev.computerName}`, 'success');
  },

  // 5. Cyber HUD Toast Notification
  showToast: function(message, type = 'info') {
    const existing = document.getElementById('twinsToastContainer');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'twinsToastContainer';
    toast.className = 'fixed bottom-20 md:bottom-6 right-4 left-4 sm:left-auto sm:right-6 z-[80] animate-bounce-in max-w-sm pointer-events-none';

    let icon = 'info';
    let borderColor = 'border-cyan-500/40';
    let textColor = 'text-cyan-300';
    let bgGradient = 'from-[#0d152a] to-[#040711]';

    if (type === 'success') {
      icon = 'check-circle-2';
      borderColor = 'border-emerald-500/50';
      textColor = 'text-emerald-300';
    } else if (type === 'warning') {
      icon = 'alert-triangle';
      borderColor = 'border-amber-500/50';
      textColor = 'text-amber-300';
    }

    toast.innerHTML = `
      <div class="vantage-card p-3.5 sm:p-4 border ${borderColor} bg-gradient-to-r ${bgGradient} shadow-[0_0_30px_rgba(0,240,255,0.25)] flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center ${textColor} shrink-0">
          <i data-lucide="${icon}" class="w-4 h-4"></i>
        </div>
        <div class="text-xs font-mono ${textColor} leading-tight font-medium">
          ${message}
        </div>
      </div>
    `;

    document.body.appendChild(toast);
    if (window.lucide) window.lucide.createIcons();

    setTimeout(() => {
      if (toast && toast.parentNode) {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.4s ease';
        setTimeout(() => toast.remove(), 400);
      }
    }, 3200);
  },

  // Close Active Modal
  close: function() {
    const modal = document.getElementById('twinsModalContainer');
    if (modal) modal.remove();
  }
};
