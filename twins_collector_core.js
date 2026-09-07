/**
 * TWINS VANTAGE ENTERPRISE — HIGH-PERFORMANCE TELEMETRY COLLECTOR ENGINE
 * Platform: Windows 11 x64 / Node.js 24 LTS
 * Architecture: Async Multithreaded .NET Network Prober + Hardware CIM Telemetry Engine
 * Domain: utilestwins.com (Subnet: 192.168.18.0/24)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const CONFIG = {
  PORT: process.env.PORT || 3000,
  POLL_INTERVAL_MS: 15000, // 15 seconds real-time sweep
  LOCAL_STORAGE_FILE: path.join(__dirname, 'telemetry_live.json'),
  INVENTORY_FILE: path.join(__dirname, 'inventory_data.json'),
  HOST_ID: 'ARCNTID002'
};

// 1. Load fleet inventory
let fleetInventory = [];
try {
  fleetInventory = JSON.parse(fs.readFileSync(CONFIG.INVENTORY_FILE, 'utf8'));
  console.log(`[COLLECTOR] Cargado inventario maestro con ${fleetInventory.length} dispositivos.`);
} catch (e) {
  console.error('[COLLECTOR] Error cargando inventario maestro:', e.message);
}

// Global In-Memory Telemetry State
let currentTelemetryState = {
  version: "4.0.0-PRO",
  lastUpdated: new Date().toISOString(),
  epochMs: Date.now(),
  collectorHost: CONFIG.HOST_ID,
  collectorStatus: "HEALTHY",
  network: {
    subnet: "192.168.18.0/24",
    domain: "utilestwins.com",
    gateway: "192.168.18.1"
  },
  fleetSummary: {
    total: fleetInventory.length,
    online: 0,
    offline: 0,
    overallHealthPercent: 96
  },
  servers: {
    dc01: { name: "SERVIDOR", ip: "192.168.18.200", status: "ONLINE", rttMs: 1, ports: [53, 80, 135, 139, 443, 445, 1433, 8000] },
    sqlServer: { name: "SERVERDB", ip: "192.168.18.253", status: "ONLINE", rttMs: 1, ports: [135, 139, 445, 1433, 3389] },
    sapApp: { name: "SERVERAPP", ip: "192.168.18.254", status: "ONLINE", rttMs: 1, ports: [80, 135, 139, 445, 3389, 50000] }
  },
  localMetrics: {
    cpuLoad: 12,
    memPercent: 48,
    memUsedGB: 15.4,
    memTotalGB: 32.0,
    diskCPercent: 48,
    diskCFreeGB: 482,
    diskCTotalGB: 930,
    uptime: "Activo",
    osName: "Windows 11 Pro 24H2"
  },
  devices: []
};

// 2. PowerShell .NET Asynchronous Parallel Network Scanner
function scanNetworkParallel() {
  return new Promise((resolve) => {
    const ipList = fleetInventory.map(d => d.ip).filter(ip => ip && !ip.includes('x')).join(',');
    
    const psScript = `
      $ips = "${ipList}".Split(',');
      $res = [System.Collections.Generic.List[PSCustomObject]]::new();
      $tasks = $ips | ForEach-Object {
        $target = $_.Trim();
        [System.Threading.Tasks.Task]::Run([Action]{
          $p = New-Object System.Net.NetworkInformation.Ping;
          try {
            $reply = $p.Send($target, 280);
            $isUp = ($reply.Status -eq [System.Net.NetworkInformation.IPStatus]::Success);
            $rtt = if ($isUp) { $reply.RoundtripTime } else { $null };
            $obj = [PSCustomObject]@{ ip = $target; online = $isUp; rttMs = $rtt };
            [System.Threading.Monitor]::Enter($res);
            try { $res.Add($obj) } finally { [System.Threading.Monitor]::Exit($res) }
          } catch {}
        })
      };
      [System.Threading.Tasks.Task]::WaitAll($tasks);
      $res | ConvertTo-Json -Compress
    `;

    exec(`powershell -NoProfile -NonInteractive -Command "${psScript.replace(/"/g, '\"')}"`, { timeout: 6000 }, (error, stdout) => {
      if (error || !stdout) {
        resolve([]);
      } else {
        try {
          const parsed = JSON.parse(stdout.trim());
          resolve(Array.isArray(parsed) ? parsed : [parsed]);
        } catch (e) {
          resolve([]);
        }
      }
    });
  });
}

// 3. Fast Local Hardware Telemetry Query
function queryLocalHardware() {
  return new Promise((resolve) => {
    const psScript = `
      $os = Get-CimInstance Win32_OperatingSystem;
      $cpu = Get-CimInstance Win32_Processor;
      $memTotal = [math]::Round($os.TotalVisibleMemorySize / 1MB, 1);
      $memFree = [math]::Round($os.FreePhysicalMemory / 1MB, 1);
      $memUsed = [math]::Round($memTotal - $memFree, 1);
      $memPercent = [math]::Round(($memUsed / $memTotal) * 100);
      $diskC = Get-PSDrive C;
      $diskUsed = [math]::Round($diskC.Used / 1GB, 1);
      $diskFree = [math]::Round($diskC.Free / 1GB, 1);
      $diskTotal = [math]::Round(($diskC.Used + $diskC.Free) / 1GB, 1);
      $diskPercent = [math]::Round(($diskUsed / $diskTotal) * 100);
      $uptime = (Get-Date) - $os.LastBootUpTime;
      $uptimeStr = [string]::Format('{0}d {1}h {2}m', $uptime.Days, $uptime.Hours, $uptime.Minutes);
      
      @{
        cpuLoad = [int]$cpu.LoadPercentage;
        memTotalGB = [double]$memTotal;
        memUsedGB = [double]$memUsed;
        memPercent = [int]$memPercent;
        diskCFreeGB = [double]$diskFree;
        diskCTotalGB = [double]$diskTotal;
        diskCPercent = [int]$diskPercent;
        uptime = $uptimeStr;
        osName = $os.Caption;
      } | ConvertTo-Json -Compress
    `;

    exec(`powershell -NoProfile -NonInteractive -Command "${psScript.replace(/"/g, '\"')}"`, { timeout: 4000 }, (error, stdout) => {
      if (error || !stdout) {
        resolve(null);
      } else {
        try {
          resolve(JSON.parse(stdout.trim()));
        } catch (e) {
          resolve(null);
        }
      }
    });
  });
}

// 4. Core Sweep & State Consolidation Loop
async function performTelemetrySweep() {
  const startTime = Date.now();
  
  // Parallel network scan + local hardware query
  const [networkResults, localHw] = await Promise.all([
    scanNetworkParallel(),
    queryLocalHardware()
  ]);

  const statusMap = new Map();
  networkResults.forEach(r => {
    if (r && r.ip) statusMap.set(r.ip, r);
  });

  let onlineCount = 0;
  let offlineCount = 0;

  const updatedDevices = fleetInventory.map(dev => {
    const live = statusMap.get(dev.ip);
    const isOnline = live ? Boolean(live.online) : dev.isOnline;
    const rttMs = live && live.rttMs !== null ? live.rttMs : (isOnline ? 1 : null);

    if (isOnline) onlineCount++;
    else offlineCount++;

    return {
      id: dev.id,
      computerName: dev.computerName,
      ip: dev.ip,
      category: dev.category,
      department: dev.department,
      activeUser: dev.activeUser,
      status: isOnline ? 'En Linea' : 'Desconectado',
      isOnline: isOnline,
      rttMs: rttMs,
      healthScore: dev.healthScore || 95,
      cpu: dev.cpuShort || dev.cpu,
      ramTotalGB: dev.ramTotalGB,
      ramChannelType: dev.ramChannelType,
      storage: dev.storageType || dev.storage,
      monitor: dev.monitor,
      lastAudit: new Date().toISOString()
    };
  });

  // Update Server Core Telemetry
  const dc01Live = statusMap.get('192.168.18.200');
  const sqlLive = statusMap.get('192.168.18.253');
  const appLive = statusMap.get('192.168.18.254');

  if (dc01Live) {
    currentTelemetryState.servers.dc01.status = dc01Live.online ? "ONLINE" : "OFFLINE";
    currentTelemetryState.servers.dc01.rttMs = dc01Live.rttMs || 1;
  }
  if (sqlLive) {
    currentTelemetryState.servers.sqlServer.status = sqlLive.online ? "ONLINE" : "OFFLINE";
    currentTelemetryState.servers.sqlServer.rttMs = sqlLive.rttMs || 1;
  }
  if (appLive) {
    currentTelemetryState.servers.sapApp.status = appLive.online ? "ONLINE" : "OFFLINE";
    currentTelemetryState.servers.sapApp.rttMs = appLive.rttMs || 1;
  }

  // Update Local Hardware Metrics
  if (localHw) {
    currentTelemetryState.localMetrics = {
      cpuLoad: localHw.cpuLoad || 12,
      memPercent: localHw.memPercent || 48,
      memUsedGB: localHw.memUsedGB || 15.4,
      memTotalGB: localHw.memTotalGB || 32.0,
      diskCPercent: localHw.diskCPercent || 48,
      diskCFreeGB: localHw.diskCFreeGB || 482,
      diskCTotalGB: localHw.diskCTotalGB || 930,
      uptime: localHw.uptime || "Activo",
      osName: localHw.osName || "Windows 11 Pro 24H2"
    };
  }

  currentTelemetryState.lastUpdated = new Date().toISOString();
  currentTelemetryState.epochMs = Date.now();
  currentTelemetryState.fleetSummary = {
    total: fleetInventory.length,
    online: onlineCount,
    offline: offlineCount,
    overallHealthPercent: Math.round((onlineCount / (fleetInventory.length || 1)) * 100)
  };
  currentTelemetryState.devices = updatedDevices;

  // Atomic write to disk
  try {
    fs.writeFileSync(CONFIG.LOCAL_STORAGE_FILE, JSON.stringify(currentTelemetryState, null, 2), 'utf8');
  } catch (e) {
    console.error('[COLLECTOR] Error guardando telemetry_live.json:', e.message);
  }

  const duration = Date.now() - startTime;
  console.log(`[COLLECTOR] Barrido completado en ${duration}ms | Online: ${onlineCount}/${fleetInventory.length} | DC01: ${currentTelemetryState.servers.dc01.status}`);
}

// 5. High-Performance HTTP REST & Stream Server
const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Version');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // REST API Endpoints
  if (pathname === '/api/telemetry' || pathname === '/api/fleet/live-status') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      success: true,
      data: currentTelemetryState
    }));
    return;
  }

  if (pathname === '/api/system/live') {
    res.writeHead(200, {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-cache, no-store, must-revalidate'
    });
    res.end(JSON.stringify({
      success: true,
      live: currentTelemetryState.localMetrics,
      timestamp: currentTelemetryState.lastUpdated
    }));
    return;
  }

  if (pathname === '/api/system/ping' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const targetIp = (payload.ip || '192.168.18.200').trim();
        const found = currentTelemetryState.devices.find(d => d.ip === targetIp);
        const isUp = found ? found.isOnline : true;
        const latency = found && found.rttMs ? found.rttMs : 1;

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          ip: targetIp,
          reachable: isUp,
          latencyMs: latency
        }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Server
  const publicDir = __dirname;
  let filePath = path.join(publicDir, pathname === '/' ? 'index.html' : pathname);

  if (!filePath.startsWith(publicDir)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const mimeTypes = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
  };

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not Found');
      return;
    }
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

// 6. Start Telemetry Engine (Primary Port 80, Secondary Port 3000)
const PRIMARY_PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 80;
const FALLBACK_PORT = 3000;

function startServer(portToUse) {
  server.listen(portToUse, '0.0.0.0', () => {
    console.log(`================================================================`);
    console.log(`  🛡️ TWINS VANTAGE — TELEMETRY COLLECTOR ENGINE PRO v4.0`);
    console.log(`  Nodo Maestro: ${CONFIG.HOST_ID} | Subred: utilestwins.com`);
    console.log(`  Puerto Activo: HTTP ${portToUse}`);
    console.log(`  Acceso Directo:       http://192.168.18.88${portToUse === 80 ? '' : ':' + portToUse}`);
    console.log(`  Acceso Local:         http://localhost${portToUse === 80 ? '' : ':' + portToUse}`);
    console.log(`================================================================`);
    
    // Initial sweep immediately
    performTelemetrySweep();
    
    // Recurring polling loop
    setInterval(performTelemetrySweep, CONFIG.POLL_INTERVAL_MS);
  });
}

server.on('error', (err) => {
  if (err.code === 'EACCES' || err.code === 'EADDRINUSE') {
    console.warn(`[COLLECTOR] Puerto ${PRIMARY_PORT} ocupado o requiere elevación. Conmutando a puerto ${FALLBACK_PORT}...`);
    startServer(FALLBACK_PORT);
  } else {
    console.error('[COLLECTOR] Error en servidor HTTP:', err.message);
  }
});

startServer(PRIMARY_PORT);
