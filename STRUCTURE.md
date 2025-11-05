# 📁 Cấu trúc Thư mục Dự án ChatGPT Clone

## 🎯 Tổng quan
Dự án được tổ chức theo **Feature-based Architecture** để dễ dàng quản lý, mở rộng và maintain.

## 📂 Cấu trúc Chi tiết

```
src/
├── main.tsx                          # Entry point của ứng dụng
├── App.tsx                           # Root component
├── index.css                         # Global styles
├── vite-env.d.ts                     # TypeScript definitions
│
├── assets/                           # Static assets (images, fonts, etc.)
│
├── components/                       # Shared/reusable components
│   ├── ui/                          # UI library components (Chakra UI wrappers)
│   │   ├── button.tsx
│   │   ├── tooltip.tsx
│   │   └── ...
│   └── common/                      # Common shared components
│       └── StreamingText.tsx        # Text streaming animation component
│
├── features/                         # Feature-based modules
│   │
│   ├── chat/                        # Chat feature
│   │   ├── index.ts                # Barrel export
│   │   ├── components/
│   │   │   ├── ChatView.tsx        # Main chat view
│   │   │   ├── ChatMessages.tsx    # Messages display
│   │   │   ├── ChatInput.tsx       # Input component
│   │   │   └── sections/
│   │   │       ├── TopSection.tsx
│   │   │       ├── MiddleSection.tsx
│   │   │       └── BottomSection.tsx
│   │   └── context/
│   │       └── ChatContext.tsx     # Chat state management
│   │
│   ├── sidebar/                     # Sidebar feature
│   │   ├── index.ts                # Barrel export
│   │   ├── components/
│   │   │   ├── Sidebar.tsx
│   │   │   └── ChatGPTMenu.tsx
│   │   ├── context/
│   │   │   └── SidebarContext.tsx
│   │   └── icons/
│   │       └── sidebar-icons.tsx
│   │
│   └── data-management/             # Data management feature
│       ├── index.ts                # Barrel export
│       └── components/
│           └── DataManagement.tsx
│
├── contexts/                         # Global contexts
│   └── AppContext.tsx               # App-level state (current view)
│
├── hooks/                           # Global custom hooks
│   └── useStreamingText.ts         # Hook for text streaming
│
├── services/                        # API/Service layer
│   └── demo-response-service.ts    # Demo response service
│
└── icons/                           # Global icons
    └── other-icons.tsx
```

## 🔑 Nguyên tắc Tổ chức

### 1. **Feature-based Structure**
- Mỗi feature là một module độc lập
- Chứa components, contexts, hooks riêng
- Dễ dàng tách thành package riêng nếu cần

### 2. **Barrel Exports (index.ts)**
- Mỗi feature có file `index.ts` export các thành phần public
- Import ngắn gọn: `import { ChatView } from '@/features/chat'`
- Ẩn implementation details

### 3. **Path Aliases**
- `@/` → trỏ đến `src/`
- Ví dụ: `@/components/ui/button` thay vì `../../../components/ui/button`

### 4. **Separation of Concerns**
- `components/ui/` - UI components tái sử dụng
- `components/common/` - Business components chung
- `features/` - Feature-specific components
- `contexts/` - Global state management
- `services/` - API & external services

## 📝 Ví dụ Import

```typescript
// ❌ Cũ (đường dẫn tương đối phức tạp)
import { ChatView } from '../../features/chat/components/ChatView';
import { useChatContext } from '../../features/chat/context/ChatContext';

// ✅ Mới (path alias + barrel exports)
import { ChatView, useChatContext } from '@/features/chat';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/contexts/AppContext';
```

## 🚀 Lợi ích

1. **Dễ tìm kiếm**: Biết ngay feature nào ở đâu
2. **Dễ maintain**: Mỗi feature độc lập
3. **Dễ scale**: Thêm feature mới không ảnh hưởng cũ
4. **Dễ test**: Test từng feature riêng biệt
5. **Dễ onboard**: Cấu trúc rõ ràng cho dev mới

## 🔧 Thêm Feature Mới

Khi cần thêm feature mới, làm theo template:

```
features/
└── new-feature/
    ├── index.ts                    # Barrel exports
    ├── components/
    │   └── NewFeature.tsx
    ├── context/
    │   └── NewFeatureContext.tsx
    ├── hooks/
    │   └── useNewFeature.ts
    └── services/
        └── newFeatureService.ts
```

## 📌 Notes

- **Không** import trực tiếp từ implementation files
- **Luôn** sử dụng barrel exports qua `index.ts`
- **Luôn** sử dụng path alias `@/` thay vì relative paths
- **Giữ** mỗi file nhỏ gọn, tập trung vào một nhiệm vụ
