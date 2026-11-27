import { Fragment } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { BREADCRUMB_ROUTES } from '../../data/breadcrumbRoutes'
import './Breadcrumb.css'

interface BreadcrumbItem {
  path: string
  labelKey: string
}

function getBreadcrumbItems(pathname: string): BreadcrumbItem[] {
  const route = pathname.replace(/^\/app\/?/, '').replace(/\/+$/, '')
  if (!route) return []

  const routeLabels = new Map(BREADCRUMB_ROUTES.map(({ path, labelKey }) => [path, labelKey]))
  const segments = route.split('/')
  const items: BreadcrumbItem[] = []

  for (let index = 0; index < segments.length; index += 1) {
    const path = segments.slice(0, index + 1).join('/')
    const labelKey = routeLabels.get(path)
    if (labelKey) items.push({ path, labelKey })
  }
  return items
}

export function Breadcrumb() {
  const { t, i18n } = useTranslation()
  const { pathname } = useLocation()
  const items = getBreadcrumbItems(pathname)
  const rtl = i18n.resolvedLanguage?.startsWith('ar') ?? false
  const Separator = rtl ? ChevronLeft : ChevronRight

  if (items.length === 0) return null

  return (
    <nav className="app-breadcrumb" aria-label={t('header.breadcrumb.label')}>
      <ol>
        {items.map((item, index) => {
          const current = index === items.length - 1
          const label = t(item.labelKey)
          return (
            <Fragment key={item.path}>
              {index > 0 && <li className="app-breadcrumb__separator" aria-hidden="true"><Separator size={14} /></li>}
              <li className="app-breadcrumb__item" aria-current={current ? 'page' : undefined}>
                {current
                  ? <span title={label}>{label}</span>
                  : <Link to={`/app/${item.path}`} title={label}>{label}</Link>}
              </li>
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}
