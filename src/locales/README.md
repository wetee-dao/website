# 多语言 (i18n) 维护说明

## 目录结构（模块化，便于维护）

```
locales/
├── index.ts              # i18n 实例、持久化、setLocale/getLocale
├── README.md
└── messages/
    ├── en/               # 英文
    │   ├── index.ts      # 合并所有模块
    │   ├── common.ts     # 通用文案
    │   ├── nav.ts        # 导航
    │   ├── home.ts       # 首页
    │   ├── footer.ts     # 页脚
    │   ├── chain.ts      # 链上列表
    │   ├── chainDetail.ts
    │   ├── products.ts   # 产品名称（SectionHead 等）
    │   ├── productsCloud.ts
    │   ├── productsStore.ts
    │   ├── productsMpc.ts
    │   ├── gov.ts
    │   ├── govDetail.ts
    │   ├── launch.ts
    │   └── pods.ts
    └── zh-CN/            # 简体中文（与 en 同结构）
        ├── index.ts
        └── ... 同上
```

## 使用方式

在组件中：

```ts
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
// 模板: {{ t('common.viewAll') }}
// 或脚本: t('nav.blockchain')
```

切换语言：

```ts
import { setLocale, getLocale, type LocaleId } from '@/locales'
setLocale('zh-CN')  // 或 'en'
```

## 添加/修改文案

1. **只改某一模块**：打开对应小文件即可，例如：
   - 改导航 → `messages/en/nav.ts` 与 `messages/zh-CN/nav.ts`
   - 改产品云页面 → `messages/en/productsCloud.ts` 与 `messages/zh-CN/productsCloud.ts`
2. 在 **同一模块文件** 的英文与中文里添加**相同 key**。
3. 在组件中用 `t('模块.key')` 引用，如 `t('productsCloud.title')`。

## 新增模块（新页面/新命名空间）

1. 在 `messages/en/` 下新建 `xxx.ts`，`export default { key: 'value', ... }`。
2. 在 `messages/en/index.ts` 中 `import xxx from './xxx'`，并在导出对象中加入 `xxx`。
3. 对 `messages/zh-CN/` 做同样操作。

## 新增语言

1. 新建 `messages/xx/`，按 `en` 目录复制所有模块文件并翻译。
2. 新建 `messages/xx/index.ts`，与 `en/index.ts` 结构一致。
3. 在 `locales/index.ts` 中：`import xx from './messages/xx'`，在 `messages` 中加入 `'xx': xx`，在 `supportedLocales` 和 `LocaleId` 类型中加入 `'xx'`。
