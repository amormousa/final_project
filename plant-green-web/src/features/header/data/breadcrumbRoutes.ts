export interface BreadcrumbRoute {
  path: string
  labelKey: string
}

export const BREADCRUMB_ROUTES: BreadcrumbRoute[] = [
  { path: 'dashboard', labelKey: 'header.breadcrumb.home' },
  { path: 'farms', labelKey: 'header.breadcrumb.farms' },
  { path: 'farms/details', labelKey: 'header.breadcrumb.details' },
  { path: 'farms/zones', labelKey: 'header.breadcrumb.zones' },
  { path: 'soil', labelKey: 'header.breadcrumb.soil' },
  { path: 'weather', labelKey: 'header.breadcrumb.weather' },
  { path: 'devices', labelKey: 'header.breadcrumb.devices' },
  { path: 'canopy', labelKey: 'header.breadcrumb.canopy' },
  { path: 'ai', labelKey: 'header.breadcrumb.ai' },
  { path: 'irrigation', labelKey: 'header.breadcrumb.irrigation' },
  { path: 'marketplace', labelKey: 'header.breadcrumb.marketplace' },
  { path: 'orders', labelKey: 'header.breadcrumb.orders' },
  { path: 'returns', labelKey: 'header.breadcrumb.returns' },
  { path: 'finance', labelKey: 'header.breadcrumb.finance' },
  { path: 'subscriptions', labelKey: 'header.breadcrumb.subscriptions' },
  { path: 'services', labelKey: 'header.breadcrumb.services' },
  { path: 'academy', labelKey: 'header.breadcrumb.academy' },
  { path: 'account', labelKey: 'header.breadcrumb.account' },
  { path: 'account/profile', labelKey: 'header.breadcrumb.myAccount' },
  { path: 'account/team', labelKey: 'header.breadcrumb.team' },
  { path: 'account/policies', labelKey: 'header.breadcrumb.policies' },
  { path: 'settings', labelKey: 'header.breadcrumb.settings' },
  { path: 'support', labelKey: 'header.breadcrumb.support' },
]
