// TWINS VANTAGE - Verified Enterprise Hardware Inventory Database
const INVENTORY_DATA = [
  {
    "id": "ARCNADMD007",
    "computerName": "ARCNADMD007",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.43",
    "mac": "30-56-0f-54-8b-3e",
    "activeUser": "hugo",
    "fullUser": "UTILESTWINS\\hugo",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB)",
    "diskSpace": "C: (785 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 785,
        "totalGB": 930,
        "percentFree": 84
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 16GB). Se recomienda agregar 1 módulo de 8GB/16GB para habilitar Dual Channel 128-bit."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "PC de Hugo (Administración General)"
  },
  {
    "id": "ARCNADM007",
    "computerName": "ARCNADM007",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.220",
    "mac": "60-45-cb-6e-ef-35",
    "activeUser": "luis",
    "fullUser": "UTILESTWINS\\luis",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. H110M-E/M.2",
    "cpu": "Intel(R) Core(TM) i5-6400 CPU @ 2.70GHz",
    "cpuShort": "Intel Core i5-6400 (6th Gen)",
    "coresThreads": "4 Nucleos / 4 Hilos",
    "ramTotalGB": 11.9,
    "ramModules": "8 GB @ 2133MHz (CRUCIAL) + 4 GB @ 2133MHz (CRUCIAL)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "Intel(R) HD Graphics 530",
    "gpuType": "integrated",
    "storage": "KINGSTON SA400S37480G (447 GB)",
    "diskSpace": "C: (162 GB libre de 243 GB) | D: (203 GB libre de 203 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 162,
        "totalGB": 243,
        "percentFree": 67
      },
      {
        "drive": "D:",
        "freeGB": 203,
        "totalGB": 203,
        "percentFree": 100
      }
    ],
    "monitor": "Monitor ASUS/Generic 22\" FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 10 Pro (Build 19045)",
    "healthScore": 95,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Todos los parámetros de hardware y almacenamiento están en rangos saludables."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "Estación de Luis"
  },
  {
    "id": "ARCNADMD001-1",
    "computerName": "ARCNADMD001-1",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.17",
    "mac": "d8-43-ae-9d-cb-1f",
    "activeUser": "roberto",
    "fullUser": "UTILESTWINS\\roberto",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4 (MS-7E44)",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB)",
    "diskSpace": "C: (799 GB libre de 930 GB) | G: (0 GB libre de 0 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 799,
        "totalGB": 930,
        "percentFree": 86
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 15.8GB). Se pierde hasta 20% de rendimiento de CPU/iGPU por no aprovechar ancho de banda dual."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "ROBERTO C. ROJAS FARFÁN"
  },
  {
    "id": "ARCNADMD002",
    "computerName": "ARCNADMD002",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.221",
    "mac": "d8-43-ae-9d-cb-26",
    "activeUser": "fiorela",
    "fullUser": "UTILESTWINS\\fiorela",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4 (MS-7E44)",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB)",
    "diskSpace": "C: (796 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 796,
        "totalGB": 930,
        "percentFree": 86
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 15.8GB). Se pierde hasta 20% de rendimiento de CPU/iGPU por no aprovechar ancho de banda dual."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "FIORELA L. QUISPE CRUZ"
  },
  {
    "id": "ARCNADMD003",
    "computerName": "ARCNADMD003",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.22",
    "mac": "04-7c-16-ee-2d-11",
    "activeUser": "aranda",
    "fullUser": "UTILESTWINS\\aranda",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME B460M-A R2.0",
    "cpu": "Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz",
    "cpuShort": "Intel Core i5-10400 (10th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 7.8,
    "ramModules": "8 GB @ 2666MHz (CRUCIAL)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 630",
    "gpuType": "integrated",
    "storage": "KINGSTON SNVS500G (466 GB)",
    "diskSpace": "C: (79 GB libre de 195 GB) | D: (270 GB libre de 270 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 79,
        "totalGB": 195,
        "percentFree": 41
      },
      {
        "drive": "D:",
        "freeGB": 270,
        "totalGB": 270,
        "percentFree": 100
      }
    ],
    "monitor": "Monitor ASUS 24\" FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 10 Pro (Build 19045)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 7.8GB). Se pierde hasta 20% de rendimiento de CPU/iGPU por no aprovechar ancho de banda dual."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "MAYRA I. ARANDA LLAUCE"
  },
  {
    "id": "ARCNADMD004-1",
    "computerName": "ARCNADMD004-1",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.222",
    "mac": "d8-43-ae-9d-cb-29",
    "activeUser": "maribel",
    "fullUser": "UTILESTWINS\\maribel",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4 (MS-7E44)",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB NVMe)",
    "diskSpace": "C: (780 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 780,
        "totalGB": 930,
        "percentFree": 84
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 16GB). Se recomienda añadir 1 módulo para habilitar Dual Channel."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "MARIBEL M. MENDOZA CISNEROS"
  },
  {
    "id": "ARCNADMD005",
    "computerName": "ARCNADMD005",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.223",
    "mac": "d8-43-ae-5f-58-8a",
    "activeUser": "kelly",
    "fullUser": "UTILESTWINS\\kelly",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME A520M-A II",
    "cpu": "AMD Ryzen 5 5600GT with Radeon Graphics",
    "cpuShort": "AMD Ryzen 5 5600GT (6C/12T)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.3,
    "ramModules": "8 GB @ 3200MHz (Kingston) + 8 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "AMD Radeon(TM) Graphics (512 MB)",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV2S500G (466 GB NVMe)",
    "diskSpace": "C: (320 GB libre de 465 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 320,
        "totalGB": 465,
        "percentFree": 69
      }
    ],
    "monitor": "LG FHD 24\" IPS 100Hz (B450M Setup)",
    "resolution": "1920x1080 @ 100Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 96,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Dual Channel activo y almacenamiento con SMART 100% saludable."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "KELLY V. SÁMBALA CARLOS"
  },
  {
    "id": "ARCNADMD006",
    "computerName": "ARCNADMD006",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.224",
    "mac": "04-7c-16-ee-2d-36",
    "activeUser": "martha",
    "fullUser": "UTILESTWINS\\martha",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME A520M-A II",
    "cpu": "AMD Ryzen 5 5600G with Radeon Graphics",
    "cpuShort": "AMD Ryzen 5 5600G (6C/12T)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.3,
    "ramModules": "8 GB @ 3200MHz (Kingston) + 8 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "AMD Radeon(TM) Graphics (512 MB)",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV2S500G (466 GB NVMe)",
    "diskSpace": "C: (315 GB libre de 465 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 315,
        "totalGB": 465,
        "percentFree": 68
      }
    ],
    "monitor": "LG FHD 24\" IPS 100Hz (B450M Setup)",
    "resolution": "1920x1080 @ 100Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 96,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Dual Channel activo y almacenamiento saludable."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "MARTHA S. PLACIDO ESCATE"
  },
  {
    "id": "ARCNADMD008",
    "computerName": "ARCNADMD008",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.225",
    "mac": "d8-43-ae-9d-cb-37",
    "activeUser": "liz",
    "fullUser": "UTILESTWINS\\liz",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4 (MS-7E44)",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB NVMe)",
    "diskSpace": "C: (812 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 812,
        "totalGB": 930,
        "percentFree": 87
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 16GB). Se recomienda añadir 1 módulo."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "Estación de Liz (Administración)"
  },
  {
    "id": "ARCNADMD009",
    "computerName": "ARCNADMD009",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.227",
    "mac": "74-56-3c-54-1b-b8",
    "activeUser": "tania",
    "fullUser": "UTILESTWINS\\tania",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME A520M-A II",
    "cpu": "AMD Ryzen 5 5600G with Radeon Graphics",
    "cpuShort": "AMD Ryzen 5 5600G (6C/12T)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.3,
    "ramModules": "8 GB @ 3200MHz (Kingston) + 8 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "AMD Radeon(TM) Graphics (512 MB)",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV2S500G (466 GB NVMe)",
    "diskSpace": "C: (318 GB libre de 465 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 318,
        "totalGB": 465,
        "percentFree": 68
      }
    ],
    "monitor": "LG FHD 24\" IPS 100Hz (B450M Setup)",
    "resolution": "1920x1080 @ 100Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 96,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Dual Channel activo y almacenamiento saludable."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "TANIA TARAZONA TARAZONA"
  },
  {
    "id": "ARCNADMD010",
    "computerName": "ARCNADMD010",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.226",
    "mac": "04-7c-16-ee-2d-45",
    "activeUser": "maritza",
    "fullUser": "UTILESTWINS\\maritza",
    "department": "Administracion",
    "category": "admin",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME H410M-E",
    "cpu": "Intel(R) Core(TM) i5-10400 CPU @ 2.90GHz",
    "cpuShort": "Intel Core i5-10400 (10th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "8 GB @ 2666MHz + 8 GB @ 2666MHz",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "Intel(R) UHD Graphics 630",
    "gpuType": "integrated",
    "storage": "KINGSTON SA400S37480G (447 GB)",
    "diskSpace": "C: (195 GB libre de 447 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 195,
        "totalGB": 447,
        "percentFree": 44
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 22631)",
    "healthScore": 94,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Operatividad estable en red."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "Estación de Facturación / Contabilidad"
  },
  {
    "id": "ARCNALMD001",
    "computerName": "ARCNALMD001",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.79",
    "mac": "4c-ed-fb-41-49-40",
    "activeUser": "angelo",
    "fullUser": "UTILESTWINS\\angelo",
    "department": "Almacen",
    "category": "warehouse",
    "formFactor": "Torre de Oficina",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME H310M-E R2.0",
    "cpu": "Intel(R) Core(TM) i3-8100 CPU @ 3.60GHz",
    "cpuShort": "Intel Core i3-8100 (8th Gen)",
    "coresThreads": "4 Nucleos / 4 Hilos",
    "ramTotalGB": 7.9,
    "ramModules": "8 GB @ 2400MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 630",
    "gpuType": "integrated",
    "storage": "KINGSTON SA400S37480G (447 GB)",
    "diskSpace": "C: (140 GB libre de 223 GB) | D: (223 GB libre de 223 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 140,
        "totalGB": 223,
        "percentFree": 63
      },
      {
        "drive": "D:",
        "freeGB": 223,
        "totalGB": 223,
        "percentFree": 100
      }
    ],
    "monitor": "Monitor 22\" FHD Almacén",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 10 Pro (Build 19045)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 7.9GB). Se pierde hasta 20% de rendimiento de CPU/iGPU por no aprovechar ancho de banda dual."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "Estación de Despacho y Kárdex Almacén"
  },
  {
    "id": "ARCNMRKD008",
    "computerName": "ARCNMRKD008",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.70",
    "mac": "74-56-3c-54-21-aa",
    "activeUser": "frank",
    "fullUser": "UTILESTWINS\\frank",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Torre de Diseño",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME A520M-A II",
    "cpu": "AMD Ryzen 5 5600G with Radeon Graphics",
    "cpuShort": "AMD Ryzen 5 5600G (6C/12T)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.3,
    "ramModules": "8 GB @ 3200MHz (Kingston) + 8 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "AMD Radeon(TM) Graphics (512 MB)",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV2S500G (466 GB NVMe)",
    "diskSpace": "C: (193 GB libre de 465 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 193,
        "totalGB": 465,
        "percentFree": 42
      }
    ],
    "monitor": "LG UltraWide 29\" IPS (2560x1080)",
    "resolution": "2560x1080 @ 60Hz",
    "os": "Microsoft Windows 10 Pro (Build 19045)",
    "healthScore": 95,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Todos los parámetros de hardware y almacenamiento están en rangos saludables."
      }
    ],
    "deviceVisual": "creator_tower",
    "notes": "FRANK J. LA CHIRA GATICA"
  },
  {
    "id": "ARCNMRKD009",
    "computerName": "ARCNMRKD009",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.71",
    "mac": "2c-4d-54-55-3d-b1",
    "activeUser": "roberto_mkt",
    "fullUser": "UTILESTWINS\\roberto_mkt",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Torre de Diseño",
    "motherboard": "ASUSTeK COMPUTER INC. PRIME B250M-PLUS",
    "cpu": "Intel(R) Core(TM) i7-7700 CPU @ 3.60GHz",
    "cpuShort": "Intel Core i7-7700 (7th Gen)",
    "coresThreads": "4 Nucleos / 8 Hilos",
    "ramTotalGB": 15.9,
    "ramModules": "8 GB @ 2400MHz (Kingston) + 8 GB @ 2400MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce GTX 1050 Ti (4 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SA400S37240G (224 GB) + WDC WD10EZEX-00WN4A0 (932 GB)",
    "diskSpace": "C: (13 GB libre de 223 GB) | D: (872 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 13,
        "totalGB": 223,
        "percentFree": 6
      },
      {
        "drive": "D:",
        "freeGB": 872,
        "totalGB": 931,
        "percentFree": 94
      }
    ],
    "monitor": "Monitor 24\" FHD (1920x1080)",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 10 Pro (Build 19045)",
    "healthScore": 75,
    "alerts": [
      {
        "type": "critical",
        "title": "Espacio en Disco Crítico",
        "message": "Unidad C: con solo 13 GB libres (6% disponible). Requiere limpieza inmediata o migración a SSD más grande."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "Estación de Diseño Gráfico y Renderizado"
  },
  {
    "id": "ARCNMRKD010",
    "computerName": "ARCNMRKD010",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.72",
    "mac": "c8-7f-54-ac-96-fa",
    "activeUser": "luz",
    "fullUser": "UTILESTWINS\\luz",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Workstation de Creación",
    "motherboard": "ASUSTeK COMPUTER INC. TUF GAMING B550M-PLUS",
    "cpu": "AMD Ryzen 7 5700X 8-Core Processor",
    "cpuShort": "AMD Ryzen 7 5700X (8C/16T)",
    "coresThreads": "8 Nucleos / 16 Hilos",
    "ramTotalGB": 31.9,
    "ramModules": "16 GB @ 3200MHz (Kingston) + 16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce RTX 4060 (8 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNV2S1000G (932 GB NVMe)",
    "diskSpace": "C: (640 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 640,
        "totalGB": 931,
        "percentFree": 69
      }
    ],
    "monitor": "ASUS ProArt PA278CV 27\" 2K IPS",
    "resolution": "2560x1440 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 98,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Hardware de alto rendimiento con RTX 4060 y 32GB RAM en estado impecable."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "LUZ (Edición de Video y 3D)"
  },
  {
    "id": "ARCNMRKD011",
    "computerName": "ARCNMRKD011",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.73",
    "mac": "d8-bb-c1-56-bc-e1",
    "activeUser": "adrian",
    "fullUser": "UTILESTWINS\\adrian",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Workstation de Creación",
    "motherboard": "ASUSTeK COMPUTER INC. TUF GAMING B560M-PLUS",
    "cpu": "11th Gen Intel(R) Core(TM) i5-11400F @ 2.60GHz",
    "cpuShort": "Intel Core i5-11400F (11th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.9,
    "ramModules": "8 GB @ 3200MHz (Kingston) + 8 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce GTX 1660 SUPER (6 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNVS500G (466 GB NVMe) + ST1000DM010-2EP102 (932 GB)",
    "diskSpace": "C: (126 GB libre de 465 GB) | D: (911 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 126,
        "totalGB": 465,
        "percentFree": 27
      },
      {
        "drive": "D:",
        "freeGB": 911,
        "totalGB": 931,
        "percentFree": 98
      }
    ],
    "monitor": "ASUS ProArt PA278CV 27\" 2K IPS",
    "resolution": "2560x1440 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 95,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Todos los parámetros de hardware y almacenamiento están en rangos saludables."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "ADRIAN (Diseño Gráfico)"
  },
  {
    "id": "ARCNMRKD012",
    "computerName": "ARCNMRKD012",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.74",
    "mac": "c8-7f-54-a8-d2-84",
    "activeUser": "anjali",
    "fullUser": "UTILESTWINS\\anjali",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Workstation de Creación",
    "motherboard": "ASUSTeK COMPUTER INC. TUF GAMING B550M-PLUS",
    "cpu": "AMD Ryzen 7 5700X 8-Core Processor",
    "cpuShort": "AMD Ryzen 7 5700X (8C/16T)",
    "coresThreads": "8 Nucleos / 16 Hilos",
    "ramTotalGB": 31.9,
    "ramModules": "16 GB @ 3200MHz (Kingston) + 16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce RTX 4060 (8 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNV2S1000G (932 GB NVMe)",
    "diskSpace": "C: (590 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 590,
        "totalGB": 931,
        "percentFree": 63
      }
    ],
    "monitor": "ASUS ProArt PA278CV 27\" 2K IPS",
    "resolution": "2560x1440 @ 75Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 98,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Hardware de alto rendimiento con RTX 4060 y 32GB RAM en estado impecable."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "ANJALI N. RAMOS RAMIREZ"
  },
  {
    "id": "ARCNMRKD013",
    "computerName": "ARCNMRKD013",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.75",
    "mac": "c8-7f-54-a8-d2-2a",
    "activeUser": "zahir",
    "fullUser": "UTILESTWINS\\zahir",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Workstation de Creación",
    "motherboard": "ASUSTeK COMPUTER INC. TUF GAMING B550M-PLUS",
    "cpu": "AMD Ryzen 7 5700X 8-Core Processor",
    "cpuShort": "AMD Ryzen 7 5700X (8C/16T)",
    "coresThreads": "8 Nucleos / 16 Hilos",
    "ramTotalGB": 31.9,
    "ramModules": "16 GB @ 3200MHz (Kingston) + 16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce RTX 4060 (8 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNV2S1000G (932 GB NVMe)",
    "diskSpace": "C: (612 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 612,
        "totalGB": 931,
        "percentFree": 66
      }
    ],
    "monitor": "ASUS ProArt PA278CV 27\" 2K IPS",
    "resolution": "2560x1440 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 98,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Hardware de alto rendimiento con RTX 4060 y 32GB RAM en estado impecable."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "ZAHIR (Audiovisual y Redes)"
  },
  {
    "id": "ARCNMRKD014",
    "computerName": "ARCNMRKD014",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.76",
    "mac": "c8-7f-54-a8-d2-19",
    "activeUser": "sergio",
    "fullUser": "UTILESTWINS\\sergio",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Workstation de Creación",
    "motherboard": "ASUSTeK COMPUTER INC. TUF GAMING B550M-PLUS",
    "cpu": "AMD Ryzen 7 5700X 8-Core Processor",
    "cpuShort": "AMD Ryzen 7 5700X (8C/16T)",
    "coresThreads": "8 Nucleos / 16 Hilos",
    "ramTotalGB": 31.9,
    "ramModules": "16 GB @ 3200MHz (Kingston) + 16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce RTX 3060 (12 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNV2S1000G (932 GB NVMe)",
    "diskSpace": "C: (520 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 520,
        "totalGB": 931,
        "percentFree": 56
      }
    ],
    "monitor": "Monitor 24\" FHD (1920x1080)",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 98,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Hardware con RTX 3060 12GB y 32GB RAM en estado impecable."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "SERGIO A. VIVAS AZABACHE"
  },
  {
    "id": "ARCNMRKD015",
    "computerName": "ARCNMRKD015",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.77",
    "mac": "10-ff-e0-71-5e-87",
    "activeUser": "adby",
    "fullUser": "UTILESTWINS\\adby",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Workstation de Creación",
    "motherboard": "ASUSTeK COMPUTER INC. TUF GAMING B550M-PLUS",
    "cpu": "AMD Ryzen 7 5700X 8-Core Processor",
    "cpuShort": "AMD Ryzen 7 5700X (8C/16T)",
    "coresThreads": "8 Nucleos / 16 Hilos",
    "ramTotalGB": 31.9,
    "ramModules": "16 GB @ 3200MHz (Kingston) + 16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "NVIDIA GeForce RTX 4060 (8 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNV2S1000G (932 GB NVMe)",
    "diskSpace": "C: (580 GB libre de 931 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 580,
        "totalGB": 931,
        "percentFree": 62
      }
    ],
    "monitor": "Monitor Gaming 24\" FHD 100Hz",
    "resolution": "1920x1080 @ 100Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 98,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Hardware de alto rendimiento con RTX 4060 y 32GB RAM en estado impecable."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "ADBY (Diseño y Packaging)"
  },
  {
    "id": "ARCNMRKD016",
    "computerName": "ARCNMRKD016",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.78",
    "mac": "d8-43-ae-9d-cb-99",
    "activeUser": "danna",
    "fullUser": "UTILESTWINS\\danna",
    "department": "Marketing y Diseno",
    "category": "design",
    "formFactor": "Torre de Diseño",
    "motherboard": "Gigabyte Technology Co., Ltd. B760M DS3H DDR4",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400F",
    "cpuShort": "Intel Core i5-12400F (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.9,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "NVIDIA GeForce GTX 1650 (4 GB)",
    "gpuType": "dedicated",
    "storage": "KINGSTON SNV2S500G (466 GB NVMe)",
    "diskSpace": "C: (210 GB libre de 465 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 210,
        "totalGB": 465,
        "percentFree": 45
      }
    ],
    "monitor": "ASUS ProArt PA278CV 27\" 2K IPS",
    "resolution": "2560x1440 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 15.9GB). Se recomienda agregar 1 módulo de 16GB."
      }
    ],
    "deviceVisual": "gaming_creator",
    "notes": "DANNA (Community Manager & Creativa)"
  },
  {
    "id": "ARCNTID002",
    "computerName": "ARCNTID002",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.88",
    "mac": "10-ff-e0-65-c4-9f",
    "activeUser": "tajho",
    "fullUser": "UTILESTWINS\\tajho",
    "department": "Sistemas TI",
    "category": "it",
    "formFactor": "Master Workstation TI",
    "motherboard": "Gigabyte Technology Co., Ltd. B760M D3HP DDR4",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 31.8,
    "ramModules": "16 GB @ 3200MHz (Kingston) + 16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB NVMe)",
    "diskSpace": "C: (673 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 673,
        "totalGB": 930,
        "percentFree": 72
      }
    ],
    "monitor": "LG FHD 27\" IPS (601TFFP0F099)",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 98,
    "alerts": [
      {
        "type": "optimal",
        "title": "Sistema en Estado Óptimo",
        "message": "Estación Central de Administración TI con telemetría en tiempo real activa."
      }
    ],
    "deviceVisual": "it_workstation",
    "notes": "TAJHO A. NUÑEZ DURAND (Jefe de Sistemas TI)"
  },
  {
    "id": "ARCNVNTD015",
    "computerName": "ARCNVNTD015",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.12",
    "mac": "d8-43-ae-9d-cb-33",
    "activeUser": "paula",
    "fullUser": "UTILESTWINS\\paula",
    "department": "Ventas",
    "category": "sales",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB NVMe)",
    "diskSpace": "C: (790 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 790,
        "totalGB": 930,
        "percentFree": 85
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 16GB). Se recomienda añadir 1 módulo."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "PAULA P. GARCIA CHAVEZ (Ventas Corporativas)"
  },
  {
    "id": "ARCNVNTD016",
    "computerName": "ARCNVNTD016",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.23",
    "mac": "de-95-0a-e4-d3-ad",
    "activeUser": "jhayro",
    "fullUser": "UTILESTWINS\\jhayro",
    "department": "Ventas",
    "category": "sales",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB NVMe)",
    "diskSpace": "C: (805 GB libre de 930 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 805,
        "totalGB": 930,
        "percentFree": 87
      }
    ],
    "monitor": "Samsung S24R350 24\" IPS FHD",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 16GB). Se recomienda añadir 1 módulo."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "JHAYRO S. MAURICIO CIRIACO (Ventas y Cotizaciones)"
  },
  {
    "id": "ARCNVNTD019-1",
    "computerName": "ARCNVNTD019-1",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.100",
    "mac": "d8-43-ae-9d-cb-27",
    "activeUser": "jhenyfer",
    "fullUser": "UTILESTWINS\\jhenyfer",
    "department": "Ventas",
    "category": "sales",
    "formFactor": "Torre de Oficina",
    "motherboard": "Micro-Star International Co., Ltd. PRO H610M-S DDR4 (MS-7E44)",
    "cpu": "12th Gen Intel(R) Core(TM) i5-12400",
    "cpuShort": "Intel Core i5-12400 (12th Gen)",
    "coresThreads": "6 Nucleos / 12 Hilos",
    "ramTotalGB": 15.8,
    "ramModules": "16 GB @ 3200MHz (Kingston)",
    "ramChannels": "Single Channel (1 modulo)",
    "ramChannelType": "single",
    "gpu": "Intel(R) UHD Graphics 730",
    "gpuType": "integrated",
    "storage": "KINGSTON SNV3S1000G (932 GB NVMe)",
    "diskSpace": "C: (774 GB libre de 930 GB) | G: (0 GB libre de 0 GB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 774,
        "totalGB": 930,
        "percentFree": 83
      }
    ],
    "monitor": "LG FHD 24\" IPS (Ventas)",
    "resolution": "1920x1080 @ 60Hz",
    "os": "Microsoft Windows 11 Pro (Build 26200)",
    "healthScore": 89,
    "alerts": [
      {
        "type": "warning",
        "title": "Cuello de Botella de Memoria",
        "message": "Memoria en Single Channel (1 módulo de 15.8GB). Se pierde hasta 20% de rendimiento de CPU/iGPU por no aprovechar ancho de banda dual."
      }
    ],
    "deviceVisual": "office_tower",
    "notes": "JHENYFER P. BARRANTES ZELADA (Ventas Retail)"
  },
  {
    "id": "SERVIDOR",
    "computerName": "SERVIDOR",
    "status": "En Linea",
    "isOnline": true,
    "ip": "192.168.18.200",
    "mac": "04-7c-16-df-be-6a",
    "activeUser": "Sin sesion interactiva",
    "fullUser": "UTILESTWINS\\Administrator",
    "department": "Servidores",
    "category": "servers",
    "formFactor": "Servidor 4U en Rack",
    "motherboard": "ASUSTeK COMPUTER INC. Pro WS W680-ACE",
    "cpu": "Intel(R) Core(TM) i7-14700 @ 2.10GHz (20 Cores / 28 Threads)",
    "cpuShort": "Intel Core i7-14700 (14th Gen - 20C/28T)",
    "coresThreads": "20 Nucleos / 28 Hilos",
    "ramTotalGB": 63.8,
    "ramModules": "32 GB @ 4800MHz ECC + 32 GB @ 4800MHz ECC (Kingston Server Premier)",
    "ramChannels": "Dual Channel (2 modulos)",
    "ramChannelType": "dual",
    "gpu": "Intel(R) UHD Graphics 770",
    "gpuType": "integrated",
    "storage": "2x SAMSUNG 990 PRO 2TB NVMe (RAID 1 Espejo) + 4x 4TB WD Red Pro (RAID 10)",
    "diskSpace": "C: (1.4 TB libre de 1.8 TB) | D: Datos (5.8 TB libre de 7.2 TB)",
    "disks": [
      {
        "drive": "C:",
        "freeGB": 1420,
        "totalGB": 1860,
        "percentFree": 76
      },
      {
        "drive": "D: Datos",
        "freeGB": 5800,
        "totalGB": 7200,
        "percentFree": 80
      }
    ],
    "monitor": "Monitor Consola Rack 19\" (1366x768)",
    "resolution": "1366x768 @ 60Hz",
    "os": "Windows Server 2019 Standard (Build 17763)",
    "healthScore": 99,
    "alerts": [
      {
        "type": "optimal",
        "title": "Controlador de Dominio en Estado Óptimo",
        "message": "Active Directory, DNS, DHCP y File Server operando con 99.9% de Uptime sin errores de réplica."
      }
    ],
    "deviceVisual": "server_rack",
    "notes": "SERVIDOR.utilestwins.com (Controlador de Dominio Active Directory)"
  }
];
