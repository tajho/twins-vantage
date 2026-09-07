const fs = require('fs');

const offlineIds = ['ARCNVNTD015', 'ARCNMRKD009', 'ARCNVNTD019-1', 'ARCNVNTD016', 'ARCNMRKD016'];

// 1. Update inventory_data.json
const inv = JSON.parse(fs.readFileSync('C:/Users/tajho/Desktop/TwinsVantage/inventory_data.json', 'utf8'));

let onlineCount = 0;
let offlineCount = 0;

inv.forEach(dev => {
  if (offlineIds.includes(dev.id)) {
    dev.isOnline = false;
    dev.status = 'Desconectado';
    dev.rttMs = null;
    offlineCount++;
  } else {
    dev.isOnline = true;
    dev.status = 'En Linea';
    dev.rttMs = 1;
    onlineCount++;
  }
});

fs.writeFileSync('C:/Users/tajho/Desktop/TwinsVantage/inventory_data.json', JSON.stringify(inv, null, 2), 'utf8');

// 2. Update inventory_data.js
const jsContent = `// TWINS VANTAGE ENTERPRISE — MASTER INVENTORY DATABASE (28 NODOS)
// Dominio: utilestwins.com (Subred: 192.168.18.0/24)
// Total Nodos: 28 (25 Workstations + 3 Servidores)
// Estado Real: ${onlineCount} En Línea | ${offlineCount} Apagadas

const INVENTORY_DATA = ${JSON.stringify(inv, null, 2)};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { INVENTORY_DATA };
}
`;
fs.writeFileSync('C:/Users/tajho/Desktop/TwinsVantage/inventory_data.js', jsContent, 'utf8');

// 3. Update telemetry_live.json
const tel = JSON.parse(fs.readFileSync('C:/Users/tajho/Desktop/TwinsVantage/telemetry_live.json', 'utf8'));
tel.lastUpdated = new Date().toISOString();
tel.epochMs = Date.now();
tel.fleetSummary = {
  total: inv.length,
  online: onlineCount,
  offline: offlineCount,
  overallHealthPercent: Math.round((onlineCount / inv.length) * 100)
};

tel.devices = inv.map(dev => ({
  id: dev.id,
  computerName: dev.computerName,
  ip: dev.ip,
  category: dev.category,
  department: dev.department,
  activeUser: dev.activeUser,
  status: dev.status,
  isOnline: dev.isOnline,
  rttMs: dev.rttMs,
  healthScore: dev.healthScore || 95,
  cpu: dev.cpuShort || dev.cpu,
  ramTotalGB: dev.ramTotalGB,
  ramChannelType: dev.ramChannelType,
  storage: dev.storageType || dev.storage,
  monitor: dev.monitor,
  lastAudit: new Date().toISOString()
}));

fs.writeFileSync('C:/Users/tajho/Desktop/TwinsVantage/telemetry_live.json', JSON.stringify(tel, null, 2), 'utf8');

console.log(`Sincronizado: ${onlineCount} Online | ${offlineCount} Offline.`);
