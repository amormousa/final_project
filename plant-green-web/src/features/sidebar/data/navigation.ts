import {
  Activity, BrainCircuit, Droplets, GraduationCap, LayoutDashboard,
  PackageCheck, Repeat, RotateCcw, Settings, ShieldCheck, Store, UserRound, Users, Wallet,
} from 'lucide-react'
import type { NavSection } from '../types'

export const NAV: NavSection[] = [
  { id: 'main', label: 'sidebar.main', items: [
    { id: 'overview', icon: LayoutDashboard, label: 'sidebar.overview', children: [
      { id: 'dashboard', path: 'dashboard', label: 'sidebar.dashboard' },
      { id: 'farms', path: 'farms', label: 'sidebar.farms' },
      { id: 'farm-details', path: 'farms/details', label: 'sidebar.farmDetails' },
      { id: 'farm-zones', path: 'farms/zones', label: 'sidebar.farmZones' },
    ] },
    { id: 'monitoring', icon: Activity, label: 'sidebar.monitoring', children: [
      { id: 'soil', path: 'soil', label: 'sidebar.soil', icon: Droplets, keywords: ['water', 'moisture', 'soil', 'ماء', 'رطوبة', 'تربة'] },
      { id: 'weather', path: 'weather', label: 'sidebar.weather' },
      { id: 'devices', path: 'devices', label: 'sidebar.devices' },
      { id: 'canopy', path: 'canopy', label: 'sidebar.canopy' },
    ] },
  ] },
  { id: 'intelligence', label: 'sidebar.intelligence', items: [
    { id: 'ai', icon: BrainCircuit, label: 'sidebar.ai', children: [
      { id: 'ai-assistant', path: 'ai', label: 'sidebar.aiAssistant' },
      { id: 'irrigation', path: 'irrigation', label: 'sidebar.irrigation' },
    ] },
  ] },
  { id: 'market', label: 'sidebar.marketplace', items: [
    { id: 'store', icon: Store, label: 'sidebar.store', path: 'marketplace' },
    { id: 'orders', icon: PackageCheck, label: 'sidebar.orders', path: 'orders' },
    { id: 'returns', icon: RotateCcw, label: 'sidebar.returns', path: 'returns' },
  ] },
  { id: 'services', label: 'sidebar.services', items: [
    { id: 'financial', icon: Wallet, label: 'sidebar.financial', children: [
      { id: 'subscriptions', path: 'subscriptions', label: 'sidebar.subscriptions', icon: Repeat, keywords: ['invoice', 'billing', 'payment', 'فاتورة', 'فواتير', 'فوترة'] },
      { id: 'finance', path: 'finance', label: 'sidebar.finance' },
    ] },
    { id: 'insurance', icon: ShieldCheck, label: 'sidebar.insurance', path: 'account/policies' },
    { id: 'academy', icon: GraduationCap, label: 'sidebar.academy', path: 'academy' },
  ] },
  { id: 'account', label: 'sidebar.account', items: [
    { id: 'profile', icon: UserRound, label: 'sidebar.profile', path: 'account' },
    { id: 'team', icon: Users, label: 'sidebar.team', path: 'account/team' },
    { id: 'settings', icon: Settings, label: 'sidebar.settings', path: 'settings' },
  ] },
]
