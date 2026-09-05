// TWINS VANTAGE - Visual Hardware SVG Renderer
// Genera renders gráficos vectoriales de alta definición según el tipo de chasis y hardware

const DEVICE_RENDERERS = {
  gaming_tower_rgb: (name, active) => `
    <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="device-svg">
      <defs>
        <linearGradient id="caseDarkRGB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <linearGradient id="glassRGB" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#00f0ff" stop-opacity="0.15"/>
          <stop offset="50%" stop-color="#8b5cf6" stop-opacity="0.2"/>
          <stop offset="100%" stop-color="#ec4899" stop-opacity="0.1"/>
        </linearGradient>
        <linearGradient id="neonRGB" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#00f0ff"/>
          <stop offset="50%" stop-color="#a855f7"/>
          <stop offset="100%" stop-color="#ec4899"/>
        </linearGradient>
        <filter id="glowRGB" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <!-- Base Shadow -->
      <ellipse cx="200" cy="290" rx="140" ry="18" fill="#000000" opacity="0.45" filter="blur(8px)"/>
      
      <!-- Tower Case Outline -->
      <rect x="110" y="30" width="180" height="245" rx="12" fill="url(#caseDarkRGB)" stroke="#334155" stroke-width="2.5"/>
      
      <!-- Front Mesh Bezel -->
      <rect x="250" y="38" width="32" height="230" rx="4" fill="#090d16" stroke="#1e293b" stroke-width="1.5"/>
      <line x1="258" y1="50" x2="274" y2="50" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="65" x2="274" y2="65" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="80" x2="274" y2="80" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="95" x2="274" y2="95" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="110" x2="274" y2="110" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="125" x2="274" y2="125" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="140" x2="274" y2="140" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      <line x1="258" y1="155" x2="274" y2="155" stroke="#38bdf8" stroke-width="2" stroke-linecap="round"/>
      
      <!-- Power Button with Active LED -->
      <circle cx="266" cy="245" r="5" fill="${active ? '#10b981' : '#64748b'}" filter="${active ? 'url(#glowRGB)' : 'none'}"/>
      <circle cx="266" cy="245" r="2" fill="#ffffff"/>

      <!-- Tempered Glass Side Window -->
      <rect x="120" y="42" width="122" height="220" rx="6" fill="url(#glassRGB)" stroke="#38bdf8" stroke-width="1.5" stroke-opacity="0.4"/>
      
      <!-- Motherboard & Internal Hardware (ASUS TUF / MSI MAG) -->
      <rect x="128" y="52" width="106" height="150" rx="4" fill="#0b1120" stroke="#1e293b" stroke-width="1"/>
      
      <!-- CPU Liquid Cooler / RGB Fan Block -->
      <circle cx="165" cy="95" r="22" fill="#0f172a" stroke="url(#neonRGB)" stroke-width="3" filter="${active ? 'url(#glowRGB)' : 'none'}"/>
      <circle cx="165" cy="95" r="14" fill="#020617"/>
      <path d="M165 83 L165 107 M153 95 L177 95" stroke="#00f0ff" stroke-width="2" stroke-linecap="round"/>
      
      <!-- RAM Slots with RGB Glowing Bars -->
      <rect x="195" y="75" width="4" height="40" rx="1.5" fill="#00f0ff" filter="${active ? 'url(#glowRGB)' : 'none'}"/>
      <rect x="203" y="75" width="4" height="40" rx="1.5" fill="#a855f7" filter="${active ? 'url(#glowRGB)' : 'none'}"/>
      <rect x="211" y="75" width="4" height="40" rx="1.5" fill="#ec4899" filter="${active ? 'url(#glowRGB)' : 'none'}"/>
      <rect x="219" y="75" width="4" height="40" rx="1.5" fill="#00f0ff" filter="${active ? 'url(#glowRGB)' : 'none'}"/>

      <!-- Dedicated GPU (GeForce RTX) -->
      <rect x="128" y="145" width="106" height="32" rx="4" fill="#1e1b4b" stroke="#6366f1" stroke-width="1.5"/>
      <circle cx="152" cy="161" r="9" fill="#090d16" stroke="#38bdf8" stroke-width="1.5"/>
      <circle cx="185" cy="161" r="9" fill="#090d16" stroke="#38bdf8" stroke-width="1.5"/>
      <text x="210" y="165" fill="#38bdf8" font-size="8" font-family="monospace" font-weight="bold">RTX</text>
      
      <!-- Power Supply Shroud -->
      <rect x="120" y="215" width="122" height="47" rx="3" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      <text x="140" y="242" fill="#475569" font-size="9" font-family="sans-serif" font-weight="600" letter-spacing="1">TWINS PRO</text>

      <!-- Feet -->
      <rect x="122" y="275" width="24" height="6" rx="2" fill="#334155"/>
      <rect x="254" y="275" width="24" height="6" rx="2" fill="#334155"/>
    </svg>
  `,

  server_rack_tower: (name, active) => `
    <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="device-svg">
      <defs>
        <linearGradient id="serverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <filter id="glowServer" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <!-- Base Shadow -->
      <ellipse cx="200" cy="292" rx="145" ry="16" fill="#000000" opacity="0.5" filter="blur(8px)"/>
      
      <!-- Server Chassis -->
      <rect x="105" y="25" width="190" height="255" rx="8" fill="url(#serverGrad)" stroke="#475569" stroke-width="2.5"/>
      
      <!-- Dual Hot-Swap Drive Bays (Top & Middle) -->
      <!-- Bay 1 (Samsung 990 PRO & WD NVMe) -->
      <rect x="120" y="40" width="160" height="34" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
      <rect x="128" y="48" width="42" height="18" rx="2" fill="#1e293b"/>
      <circle cx="134" cy="57" r="2.5" fill="#10b981" filter="url(#glowServer)"/>
      <rect x="178" y="48" width="42" height="18" rx="2" fill="#1e293b"/>
      <circle cx="184" cy="57" r="2.5" fill="#10b981" filter="url(#glowServer)"/>
      <rect x="228" y="48" width="42" height="18" rx="2" fill="#1e293b"/>
      <circle cx="234" cy="57" r="2.5" fill="#38bdf8" filter="url(#glowServer)"/>

      <!-- Bay 2 (WD Purple 8TB Mass Storage) -->
      <rect x="120" y="82" width="160" height="34" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
      <rect x="128" y="90" width="70" height="18" rx="2" fill="#1e293b"/>
      <circle cx="136" cy="99" r="2.5" fill="#a855f7" filter="url(#glowServer)"/>
      <text x="145" y="103" fill="#94a3b8" font-size="8" font-family="monospace">8TB PURPLE</text>
      <rect x="206" y="90" width="64" height="18" rx="2" fill="#1e293b"/>
      <circle cx="214" cy="99" r="2.5" fill="#10b981" filter="url(#glowServer)"/>

      <!-- High-Density Server Airflow Honeycomb Grid -->
      <rect x="120" y="125" width="160" height="95" rx="4" fill="#050811" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Grid pattern lines -->
      <line x1="125" y1="140" x2="275" y2="140" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/>
      <line x1="125" y1="155" x2="275" y2="155" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/>
      <line x1="125" y1="170" x2="275" y2="170" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/>
      <line x1="125" y1="185" x2="275" y2="185" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/>
      <line x1="125" y1="200" x2="275" y2="200" stroke="#1e293b" stroke-width="2" stroke-dasharray="4,4"/>

      <!-- Front Status Panel (DC & Active Directory LEDs) -->
      <rect x="120" y="230" width="160" height="38" rx="4" fill="#090d16" stroke="#334155" stroke-width="1.5"/>
      <circle cx="138" cy="249" r="5" fill="#10b981" filter="url(#glowServer)"/>
      <text x="148" y="252" fill="#38bdf8" font-size="8" font-family="sans-serif" font-weight="bold">DOMAIN CONTROLLER</text>
      <circle cx="260" cy="249" r="4" fill="#00f0ff" filter="url(#glowServer)"/>

      <!-- Server Rugged Rubber Feet -->
      <rect x="115" y="280" width="30" height="8" rx="2" fill="#0f172a" stroke="#334155"/>
      <rect x="255" y="280" width="30" height="8" rx="2" fill="#0f172a" stroke="#334155"/>
    </svg>
  `,

  office_tower: (name, active) => `
    <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="device-svg">
      <defs>
        <linearGradient id="officeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#334155"/>
          <stop offset="100%" stop-color="#0f172a"/>
        </linearGradient>
        <filter id="glowOffice" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <!-- Base Shadow -->
      <ellipse cx="200" cy="288" rx="130" ry="14" fill="#000000" opacity="0.4" filter="blur(6px)"/>
      
      <!-- Tower Case -->
      <rect x="120" y="35" width="160" height="240" rx="8" fill="url(#officeGrad)" stroke="#475569" stroke-width="2"/>
      
      <!-- Front Bezel Trim -->
      <rect x="130" y="45" width="140" height="220" rx="6" fill="#0f172a" stroke="#1e293b" stroke-width="1"/>
      
      <!-- Optical / Drive Bay Area (Top) -->
      <rect x="142" y="58" width="116" height="28" rx="3" fill="#1e293b" stroke="#334155" stroke-width="1"/>
      <line x1="150" y1="72" x2="240" y2="72" stroke="#475569" stroke-width="1"/>

      <!-- Front I/O Ports & Power Button -->
      <rect x="142" y="96" width="116" height="24" rx="3" fill="#090d16"/>
      <circle cx="155" cy="108" r="4.5" fill="${active ? '#10b981' : '#64748b'}" filter="${active ? 'url(#glowOffice)' : 'none'}"/>
      <rect x="175" y="105" width="8" height="6" rx="1" fill="#38bdf8"/>
      <rect x="188" y="105" width="8" height="6" rx="1" fill="#38bdf8"/>
      <circle cx="210" cy="108" r="2.5" fill="#334155"/>
      <circle cx="222" cy="108" r="2.5" fill="#334155"/>

      <!-- Lower Ventilation Slits -->
      <rect x="142" y="135" width="116" height="115" rx="4" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      <line x1="152" y1="155" x2="248" y2="155" stroke="#1e293b" stroke-width="2"/>
      <line x1="152" y1="170" x2="248" y2="170" stroke="#1e293b" stroke-width="2"/>
      <line x1="152" y1="185" x2="248" y2="185" stroke="#1e293b" stroke-width="2"/>
      <line x1="152" y1="200" x2="248" y2="200" stroke="#1e293b" stroke-width="2"/>
      <line x1="152" y1="215" x2="248" y2="215" stroke="#1e293b" stroke-width="2"/>
      <line x1="152" y1="230" x2="248" y2="230" stroke="#1e293b" stroke-width="2"/>

      <!-- Logo Badge -->
      <text x="180" y="240" fill="#64748b" font-size="8" font-family="sans-serif" font-weight="bold">TWINS</text>

      <!-- Feet -->
      <rect x="130" y="275" width="22" height="6" rx="2" fill="#1e293b"/>
      <rect x="248" y="275" width="22" height="6" rx="2" fill="#1e293b"/>
    </svg>
  `,

  workstation_tower: (name, active) => `
    <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="device-svg">
      <defs>
        <linearGradient id="workstationGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e293b"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <filter id="glowWS" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <!-- Base Shadow -->
      <ellipse cx="200" cy="290" rx="138" ry="16" fill="#000000" opacity="0.45" filter="blur(7px)"/>
      
      <!-- Tower Case -->
      <rect x="115" y="30" width="170" height="248" rx="10" fill="url(#workstationGrad)" stroke="#38bdf8" stroke-width="2" stroke-opacity="0.8"/>
      
      <!-- Front Brushed Aluminum Plate -->
      <rect x="125" y="40" width="150" height="228" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1.5"/>
      
      <!-- Power Switch & Diagnostics Bar -->
      <rect x="138" y="52" width="124" height="28" rx="4" fill="#111827" stroke="#334155" stroke-width="1"/>
      <circle cx="152" cy="66" r="5" fill="${active ? '#00f0ff' : '#64748b'}" filter="${active ? 'url(#glowWS)' : 'none'}"/>
      <rect x="170" y="62" width="12" height="7" rx="1" fill="#38bdf8"/>
      <rect x="188" y="62" width="12" height="7" rx="1" fill="#38bdf8"/>
      <rect x="206" y="62" width="8" height="7" rx="1" fill="#ec4899"/>
      <circle cx="230" cy="66" r="3" fill="#10b981" filter="url(#glowWS)"/>
      
      <!-- Center High-Airflow Hex Ventilation Grid -->
      <rect x="138" y="90" width="124" height="120" rx="4" fill="#020617" stroke="#1e293b" stroke-width="1.5"/>
      <!-- Dual Internal Cooling Fans -->
      <circle cx="200" cy="125" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2" stroke-opacity="0.6" filter="${active ? 'url(#glowWS)' : 'none'}"/>
      <circle cx="200" cy="175" r="22" fill="#0f172a" stroke="#00f0ff" stroke-width="2" stroke-opacity="0.6" filter="${active ? 'url(#glowWS)' : 'none'}"/>

      <!-- Lower System Status Screen Display -->
      <rect x="138" y="220" width="124" height="38" rx="4" fill="#030712" stroke="#0284c7" stroke-width="1.5"/>
      <text x="146" y="234" fill="#38bdf8" font-size="8" font-family="monospace" font-weight="bold">IT OPERATIONS</text>
      <text x="146" y="248" fill="#10b981" font-size="7" font-family="monospace">NVMe GEN4 1TB OK</text>
      <circle cx="248" cy="239" r="4" fill="#10b981" filter="url(#glowWS)"/>

      <!-- Rugged Feet -->
      <rect x="126" y="278" width="26" height="7" rx="2" fill="#334155"/>
      <rect x="248" y="278" width="26" height="7" rx="2" fill="#334155"/>
    </svg>
  `,

  creator_tower: (name, active) => `
    <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="device-svg">
      <defs>
        <linearGradient id="creatorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#1e1b4b"/>
          <stop offset="50%" stop-color="#0f172a"/>
          <stop offset="100%" stop-color="#020617"/>
        </linearGradient>
        <filter id="glowCreator" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" result="blur"/>
          <feComposite in="SourceGraphic" in2="blur" operator="over"/>
        </filter>
      </defs>
      <!-- Base Shadow -->
      <ellipse cx="200" cy="288" rx="135" ry="15" fill="#000000" opacity="0.4" filter="blur(6px)"/>
      
      <!-- Tower Case -->
      <rect x="115" y="32" width="170" height="245" rx="10" fill="url(#creatorGrad)" stroke="#6366f1" stroke-width="2"/>
      
      <!-- Front Minimalist Matte Panel -->
      <rect x="125" y="42" width="150" height="225" rx="6" fill="#090d16" stroke="#1e293b" stroke-width="1.5"/>
      
      <!-- Subtle Violet Creator Glow Strip -->
      <line x1="140" y1="42" x2="140" y2="267" stroke="#8b5cf6" stroke-width="3" filter="${active ? 'url(#glowCreator)' : 'none'}"/>
      
      <!-- Front I/O Ports -->
      <circle cx="245" cy="58" r="5" fill="${active ? '#10b981' : '#64748b'}" filter="${active ? 'url(#glowCreator)' : 'none'}"/>
      <rect x="215" y="55" width="8" height="6" rx="1" fill="#38bdf8"/>
      <rect x="227" y="55" width="8" height="6" rx="1" fill="#38bdf8"/>

      <!-- Dual Intake Fans Area -->
      <rect x="155" y="85" width="105" height="160" rx="4" fill="#020617" stroke="#1e293b" stroke-width="1"/>
      <circle cx="207" cy="125" r="26" fill="#0f172a" stroke="#8b5cf6" stroke-width="2" stroke-opacity="0.8" filter="${active ? 'url(#glowCreator)' : 'none'}"/>
      <circle cx="207" cy="185" r="26" fill="#0f172a" stroke="#ec4899" stroke-width="2" stroke-opacity="0.8" filter="${active ? 'url(#glowCreator)' : 'none'}"/>

      <!-- Feet -->
      <rect x="126" y="277" width="24" height="6" rx="2" fill="#334155"/>
      <rect x="246" y="277" width="24" height="6" rx="2" fill="#334155"/>
    </svg>
  `,

  legacy_tower: (name, active) => `
    <svg viewBox="0 0 400 320" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" class="device-svg">
      <rect x="125" y="40" width="150" height="235" rx="4" fill="#334155" stroke="#64748b" stroke-width="2"/>
      <rect x="135" y="50" width="130" height="215" rx="3" fill="#1e293b"/>
      <rect x="145" y="60" width="110" height="25" rx="2" fill="#475569"/>
      <rect x="145" y="92" width="110" height="25" rx="2" fill="#475569"/>
      <circle cx="155" cy="135" r="5" fill="${active ? '#10b981' : '#64748b'}"/>
      <rect x="145" y="155" width="110" height="95" rx="2" fill="#0f172a"/>
    </svg>
  `
};

function renderDeviceImage(visualType, computerName, isOnline) {
  const renderer = DEVICE_RENDERERS[visualType] || DEVICE_RENDERERS.office_tower;
  return renderer(computerName, isOnline);
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { renderDeviceImage, DEVICE_RENDERERS };
}
