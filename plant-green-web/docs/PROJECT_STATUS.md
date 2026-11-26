# Plant Green Project Status

**Status date:** 2026-11-26

## 1. Project summary

Plant Green is a smart-agriculture platform for Egypt. The repository contains:

- The Blueprint in `index.html`
- A React, TypeScript, and Vite web application in `plant-green-web/`
- Existing prototype and hardware/software folders outside the web application

The current implementation is at the end of Phase 2. No feature screens or mock business data have been implemented.

## 2. Completed phases

### Phase 0 - Pre-flight

- Confirmed 46 Blueprint screens, IDs `01-46`
- Confirmed the README's 38-screen statement is outdated
- Recorded the approved open decisions
- Identified missing business contracts and logic

### Phase 1 - Scaffold

- Scaffolded `plant-green-web/` with Vite, React, and TypeScript
- Added the required source, feature, test, and documentation folders
- Added the four layout shells:
  - `AuthLayout`
  - `AppLayout`
  - `SupplierLayout`
  - `AdminLayout`
- Added the lazy route skeleton
- Added the reserved `/support` route under `/app` and `/admin`
- Added the Farm Switcher architecture decision
- Replaced old role names with the approved role ids
- Added empty `index.ts` files for all feature folders

### Phase 2 - Core

- Added fetch-based API client infrastructure
- Added typed `ApiError`
- Added in-memory access-token session handling
- Added single-flight token refresh behavior
- Added application role and staff role types
- Added permissions, policies, `can()`, `<Can/>`, and `usePermission()`
- Added real private, role, and permission route guards
- Added Arabic and English i18n resources
- Added language switching that updates `<html>.lang` and `<html>.dir`
- Added feedback components
- Added `useDebounce` and `useMediaQuery`
- Added Vitest and permission, refresh, and language tests

## 3. Phase 1 commit

- Commit: `3e2309e6ee618c3be3212a3e6ba2bcae73002a3d`
- Message: `Phase 1: scaffold, layouts, route skeleton`

Phase 2 changes remain in the working tree and should be committed only after approval.

## 4. Approved roles

Application roles:

- `owner`
- `business`
- `supplier`
- `admin`
- `insurance_officer`

Staff sub-roles under admin:

- `sales`
- `account_manager`
- `accounts`

Canonical role types are defined in `src/core/permissions/roles.ts`.
`src/app/config/roles.ts` re-exports those types.

## 5. Permissions

Core permission ids:

- `irrigation.control`
- `canopy.control`
- `devices.command`
- `farms.view`
- `admin.view`

Current policy defaults:

- Owner and business may receive irrigation, canopy, and device control permissions
- Supplier, insurance officer, and admin receive no IoT control permissions
- Admin has `admin.view` and `farms.view`
- All staff sub-roles have an empty permission bundle
- Staff sub-roles never receive irrigation, canopy, or device command permissions

Backend enforcement remains mandatory; frontend permission checks are not security boundaries.

## 6. RBAC contradiction

The Blueprint RBAC matrix marks Platform Admin as `Limited` on irrigation and canopy control.
Screens 42 and 44 explicitly prohibit irrigation, canopy, and device controls for all staff.

Current decision: **DENIED** for admin and all staff sub-roles.

## 7. Architecture

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- i18next and react-i18next
- React Hook Form
- Vitest

No Axios or additional Phase 2 libraries are used.

### API client

- Uses the browser `fetch` API
- Supports typed success and error responses
- Sends the in-memory access token as a Bearer header
- Uses a single refresh promise for concurrent 401 responses
- Retries concurrent requests after a successful refresh
- Uses `credentials: 'include'` for refresh requests

### Session

- The access token exists in memory only
- No access token is stored in `localStorage` or `sessionStorage`
- Refresh tokens are not owned by the frontend

### Routing

Primary layouts:

- `/auth`
- `/app`
- `/supplier`
- `/admin`

Reserved routes:

- `/app/support`
- `/admin/support`

The support routes use the existing placeholder component and have no page or UI.

## 8. Farm selection decision

The active farm comes from global Farm Switcher state, not the URL.

This intentionally deviates from the Blueprint route tree, which includes `/:farmId`.
The decision is documented in `docs/architecture/ADR-farm-selection.md`.

## 9. Internationalization

- Languages: Arabic (`ar`) and English (`en`)
- Arabic is the initial locale
- `setLanguage()` updates `document.documentElement.lang`
- `setLanguage()` updates `document.documentElement.dir`
- Arabic uses `rtl`
- English uses `ltr`
- No reload is required

## 10. RTL and CSS rules

- CSS logical properties are used
- The forbidden horizontal physical properties are not used in `src`
- Targeted grep checks found no:
  - `localStorage`
  - `sessionStorage`
  - `margin-left`
  - `margin-right`
  - `padding-left`
  - `padding-right`
  - `border-left`
  - `border-right`
  - `text-align: left`
  - `text-align: right`

## 11. Feedback components

Available shared feedback components:

- `LoadingSpinner`
- `Skeleton`
- `ErrorState`
- `EmptyState`
- `OfflineState`
- `PermissionRestricted`
- `NotFound`

## 12. Tests

Vitest test suites:

- Permission and staff-role control test
- Single-flight refresh test
- Language direction test

Current test status:

- 3 test files passed
- 8 tests passed

Required permission coverage includes:

- `admin`
- `sales`
- `account_manager`
- `accounts`
- `irrigation.control`
- `canopy.control`
- `devices.command`

## 13. Validation status

- `npx tsc --noEmit`: passed
- `npm run build`: passed
- `npm test`: passed

## 14. Current working tree

The working tree contains Phase 2 changes not included in the Phase 1 commit.
The existing `tech/softwear/plantGreen/` folder remains outside the web application commit scope.

## 15. Missing or placeholder logic

The following backend contracts are not defined in the Blueprint and remain placeholders:

- Refresh endpoint request and response contract
- Base API URL beyond `.env.example`
- Authentication login, logout, and session establishment endpoints
- Farm and zone contracts
- IoT command acknowledgement and timeout contracts
- Real-time WebSocket/SSE contract
- Polling fallback interval
- Device offline and last-seen thresholds
- User permission response shape
- Backend CSRF and CORS configuration details

No mock agricultural, financial, marketplace, or device business values were added.
