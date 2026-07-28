# RH Mobile Guide

Foundations (done):

- `viewportFit: "cover"`, `themeColor: #020617`, `appleWebApp` capable
- `app/manifest.ts` → standalone PWA
- `-webkit-tap-highlight-color: transparent`, `overscroll-behavior-y: none`, inputs ≥16px, `min-h-dvh`
- Protected shell: `pb-24` + safe-area top under slim top bar
- Bottom tab bar (5 items + More sheet) `lg:hidden`; desktop sidebar with collapse
- Brand wordmark: `whitespace-nowrap` on sidebar + mobile top bar
- Video overlay: full `dvh` on mobile; withdraw ad always visible (flex column)
- No floating global WelcomePopup; offers live in banners / More sheet / sidebar

Verify on iPhone SE (375), Pro Max (430), and Android (~412) before shipping.
