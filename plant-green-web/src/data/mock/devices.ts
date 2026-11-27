import type { Device } from '../../features/header/types'

const northFarmDevices: Device[] = [
  { id: 'north-gateway', farmId: 'farm-north', nameKey: 'header.devices.northGateway', zoneKey: 'header.zones.north', controlsKeys: ['header.controls.soilSensors', 'header.controls.irrigationPumps'], status: 'online', lastSeen: '2026-11-28T00:50:00Z' },
  { id: 'north-soil-1', farmId: 'farm-north', nameKey: 'header.devices.soilNode', zoneKey: 'header.zones.north', controlsKeys: ['header.controls.soilSensors'], status: 'online', lastSeen: '2026-11-28T00:49:00Z' },
  { id: 'north-soil-2', farmId: 'farm-north', nameKey: 'header.devices.soilNode', zoneKey: 'header.zones.south', controlsKeys: ['header.controls.soilSensors'], status: 'online', lastSeen: '2026-11-28T00:48:00Z' },
  { id: 'north-pump-1', farmId: 'farm-north', nameKey: 'header.devices.pumpController', zoneKey: 'header.zones.north', controlsKeys: ['header.controls.irrigationPumps'], status: 'online', lastSeen: '2026-11-28T00:47:00Z' },
  { id: 'north-weather', farmId: 'farm-north', nameKey: 'header.devices.weatherStation', zoneKey: 'header.zones.north', controlsKeys: ['header.controls.weatherSensors'], status: 'online', lastSeen: '2026-11-28T00:46:00Z' },
  { id: 'north-greenhouse', farmId: 'farm-north', nameKey: 'header.devices.climateNode', zoneKey: 'header.zones.greenhouse', controlsKeys: ['header.controls.climateSensors'], status: 'online', lastSeen: '2026-11-28T00:45:00Z' },
  { id: 'north-pump-2', farmId: 'farm-north', nameKey: 'header.devices.pumpController', zoneKey: 'header.zones.south', controlsKeys: ['header.controls.irrigationPumps'], status: 'online', lastSeen: '2026-11-28T00:44:00Z' },
  { id: 'north-gateway-2', farmId: 'farm-north', nameKey: 'header.devices.gateway', zoneKey: 'header.zones.south', controlsKeys: ['header.controls.soilSensors'], status: 'online', lastSeen: '2026-11-28T00:43:00Z' },
  { id: 'north-pump-3', farmId: 'farm-north', nameKey: 'header.devices.pumpController', zoneKey: 'header.zones.greenhouse', controlsKeys: ['header.controls.irrigationPumps'], status: 'offline', lastSeen: '2026-11-27T23:10:00Z' },
  { id: 'north-soil-3', farmId: 'farm-north', nameKey: 'header.devices.soilNode', zoneKey: 'header.zones.south', controlsKeys: ['header.controls.soilSensors'], status: 'offline', lastSeen: '2026-11-27T23:04:00Z' },
]

const greenhouseDevices: Device[] = [
  { id: 'greenhouse-climate', farmId: 'farm-greenhouse', nameKey: 'header.devices.climateNode', zoneKey: 'header.zones.greenhouse', controlsKeys: ['header.controls.climateSensors'], status: 'online', lastSeen: '2026-11-28T00:50:00Z' },
  { id: 'greenhouse-pump', farmId: 'farm-greenhouse', nameKey: 'header.devices.pumpController', zoneKey: 'header.zones.greenhouse', controlsKeys: ['header.controls.irrigationPumps'], status: 'online', lastSeen: '2026-11-28T00:49:00Z' },
  { id: 'greenhouse-gateway', farmId: 'farm-greenhouse', nameKey: 'header.devices.gateway', zoneKey: 'header.zones.greenhouse', controlsKeys: ['header.controls.soilSensors'], status: 'online', lastSeen: '2026-11-28T00:48:00Z' },
  { id: 'greenhouse-weather', farmId: 'farm-greenhouse', nameKey: 'header.devices.weatherStation', zoneKey: 'header.zones.greenhouse', controlsKeys: ['header.controls.weatherSensors'], status: 'online', lastSeen: '2026-11-28T00:47:00Z' },
]

const westDevices: Device[] = [
  { id: 'west-gateway', farmId: 'farm-west', nameKey: 'header.devices.gateway', zoneKey: 'header.zones.west', controlsKeys: ['header.controls.soilSensors'], status: 'offline', lastSeen: '2026-11-27T22:30:00Z' },
  { id: 'west-pump', farmId: 'farm-west', nameKey: 'header.devices.pumpController', zoneKey: 'header.zones.west', controlsKeys: ['header.controls.irrigationPumps'], status: 'offline', lastSeen: '2026-11-27T22:20:00Z' },
]

export const MOCK_DEVICES: Device[] = [...northFarmDevices, ...greenhouseDevices, ...westDevices]
