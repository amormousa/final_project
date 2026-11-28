import { CircleUserRound, LifeBuoy, LogOut, UserRound } from 'lucide-react'
import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../../../app/providers/useAuth'
import { setLanguage } from '../../../../i18n'
import type { Language } from '../../../../i18n'
import { LanguageToggle } from '../../../sidebar/components/LanguageToggle'
import { NightModeToggle } from '../../../sidebar/components/NightModeToggle'
import type { RailHandlers } from '../../../sidebar/types'
import type { UserSummary } from '../../types'
import { Dropdown } from '../Dropdown'
import './UserMenu.css'

interface UserMenuProps {
  user: UserSummary | null
  loading: boolean
  error: unknown
  retry: () => void
  dark: boolean
  onDarkChange: (dark: boolean) => void
}

const NO_RAIL_HANDLERS: RailHandlers = {
  onMouseEnter: () => undefined,
  onMouseLeave: () => undefined,
  onFocus: () => undefined,
  onBlur: () => undefined,
  onClick: () => undefined,
}

export function UserMenu({
  user,
  loading,
  error,
  retry,
  dark,
  onDarkChange,
}: UserMenuProps) {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { clearSession } = useAuth()
  const language = i18n.resolvedLanguage?.startsWith('ar') ? 'ar' : 'en'
  const menuName = user ? t(user.nameKey) : t('header.user.menu')
  const title = user ? `${menuName}, ${user.email}` : t('header.user.menu')

  const toggleLanguage = useCallback(() => {
    const nextLanguage: Language = language === 'ar' ? 'en' : 'ar'
    setLanguage(nextLanguage)
  }, [language])

  const logOut = useCallback((close: () => void) => {
    close()
    clearSession()
    navigate('/auth', { replace: true })
  }, [clearSession, navigate])

  return (
    <Dropdown
      triggerLabel={title}
      triggerContent={(
        <span className="user-menu__avatar" aria-hidden="true">
          {user?.initials ?? <CircleUserRound size={20} />}
        </span>
      )}
      triggerClassName="user-menu__trigger"
      panelLabel={t('header.user.menu')}
      panelRole="menu"
      panelClassName="user-menu__panel"
    >
      {(close) => (
        <div className="user-menu__content">
          <div className="user-menu__identity">
            {loading && <p role="status">{t('header.user.loading')}</p>}
            {error !== null && (
              <div className="user-menu__error" role="alert">
                <span>{t('header.user.error')}</span>
                <button type="button" role="menuitem" onClick={retry}>{t('header.user.retry')}</button>
              </div>
            )}
            {user && (
              <>
                <strong>{menuName}</strong>
                <span>{user.email}</span>
              </>
            )}
          </div>
          <Link className="user-menu__link" role="menuitem" to="/app/account/profile" onClick={close}>
            <UserRound size={18} aria-hidden="true" />
            {t('header.user.myAccount')}
          </Link>
          <div className="user-menu__toggle">
            <NightModeToggle
              label={t('header.user.nightMode')}
              ariaLabel={t('header.user.nightMode')}
              collapsed={false}
              dark={dark}
              selected={false}
              handlers={NO_RAIL_HANDLERS}
              onChange={() => {
                onDarkChange(!dark)
                close()
              }}
            />
          </div>
          <div className="user-menu__toggle">
            <LanguageToggle
              label={t('header.user.language')}
              ariaLabel={t('header.user.language')}
              collapsed={false}
              selected={false}
              handlers={NO_RAIL_HANDLERS}
              onToggle={() => {
                toggleLanguage()
                close()
              }}
            />
          </div>
          <Link className="user-menu__link" role="menuitem" to="/app/support" onClick={close}>
            <LifeBuoy size={18} aria-hidden="true" />
            {t('header.user.helpSupport')}
          </Link>
          <button
            type="button"
            className="user-menu__link user-menu__logout"
            role="menuitem"
            onClick={() => logOut(close)}
          >
            <LogOut size={18} aria-hidden="true" />
            {t('header.user.logOut')}
          </button>
        </div>
      )}
    </Dropdown>
  )
}
