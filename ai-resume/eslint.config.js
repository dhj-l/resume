import js from "@eslint/js/src/index.js";
import vue from "eslint-plugin-vue";
import vueParser from "vue-eslint-parser";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  js.configs.recommended,
  ...vue.configs["flat/recommended"],
  {
    files: ["src/**/*.{js,mjs,cjs,ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: vueParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        parser: tsParser,
      },
      globals: {
        // Browser globals
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        localStorage: "readonly",
        sessionStorage: "readonly",
        Alert: "readonly",
        confirm: "readonly",
        prompt: "readonly",
        console: "readonly",
        URL: "readonly",
        URLSearchParams: "readonly",
        Blob: "readonly",
        File: "readonly",
        FileReader: "readonly",
        Image: "readonly",
        Request: "readonly",
        Response: "readonly",
        fetch: "readonly",
        Headers: "readonly",
        FormData: "readonly",
        WebSocket: "readonly",
        Event: "readonly",
        CustomEvent: "readonly",
        MessageChannel: "readonly",
        BroadcastChannel: "readonly",
        Worker: "readonly",
        postMessage: "readonly",
        performance: "readonly",
        History: "readonly",
        Location: "readonly",
        history: "readonly",
        location: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        requestAnimationFrame: "readonly",
        cancelAnimationFrame: "readonly",
        IntersectionObserver: "readonly",
        ResizeObserver: "readonly",
        MutationObserver: "readonly",
        Intl: "readonly",
        TextEncoder: "readonly",
        TextDecoder: "readonly",
        AbortController: "readonly",
        AbortSignal: "readonly",
        crypto: "readonly",
        Crypto: "readonly",
        SubtleCrypto: "readonly",
        CryptoKey: "readonly",

        // Node.js globals
        process: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        exports: "readonly",
        module: "readonly",
        require: "readonly",
        global: "readonly",
        Buffer: "readonly",
        setImmediate: "readonly",
        clearImmediate: "readonly",

        // ES globals
        Map: "readonly",
        Set: "readonly",
        WeakMap: "readonly",
        WeakSet: "readonly",
        Promise: "readonly",
        Symbol: "readonly",
        Proxy: "readonly",
        Reflect: "readonly",
        BigInt: "readonly",

        // Vue globals
        defineProps: "readonly",
        defineEmits: "readonly",
        defineExpose: "readonly",
        defineOptions: "readonly",
        defineSlots: "readonly",
        withDefaults: "readonly",
        ref: "readonly",
        reactive: "readonly",
        computed: "readonly",
        watch: "readonly",
        watchEffect: "readonly",
        watchPostEffect: "readonly",
        watchSyncEffect: "readonly",
        onMounted: "readonly",
        onUpdated: "readonly",
        onUnmounted: "readonly",
        onBeforeMount: "readonly",
        onBeforeUpdate: "readonly",
        onBeforeUnmount: "readonly",
        onActivated: "readonly",
        onDeactivated: "readonly",
        onBeforeActivate: "readonly",
        onBeforeDeactivate: "readonly",
        onRenderTracked: "readonly",
        onRenderTriggered: "readonly",
        onErrorCaptured: "readonly",
        onServerPrefetch: "readonly",
        provide: "readonly",
        inject: "readonly",
        nextTick: "readonly",
        shallowRef: "readonly",
        triggerRef: "readonly",
        toRef: "readonly",
        toRefs: "readonly",
        toValue: "readonly",
        markRaw: "readonly",
        shallowReactive: "readonly",
        shallowReadonly: "readonly",
        readonly: "readonly",
        getCurrentInstance: "readonly",
        useSlots: "readonly",
        useAttrs: "readonly",
        useModel: "readonly",
        HMR: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": tsPlugin,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      // ESLint recommended rules
      ...js.configs.recommended.rules,

      // Vue recommended rules
      ...vue.configs["flat/recommended"][0].rules,

      // TypeScript ESLint rules
      ...tsPlugin.configs.recommended.rules,

      // Prettier integration
      ...prettierConfig.rules,
      "prettier/prettier": "warn",

      // ===== 基础规则 =====
      "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
      "no-unused-vars": "off", // 由 TypeScript 检查
      "no-undef": "off", // 由 TypeScript 检查

      // ===== TypeScript 特定规则 =====
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-require-imports": "off",

      // ===== Vue 特定规则 =====
      "vue/multi-word-component-names": "off", // 允许单字组件名
      "vue/no-mutating-props": "warn",
      "vue/require-default-prop": "off",
      "vue/require-prop-types": "warn",
      "vue/no-v-html": "warn",
      "vue/no-unused-refs": "warn",
      "vue/no-unused-components": "warn",
      // 由于从同名 .ts 文件导入函数可能导致误判，禁用此规则
      "vue/no-dupe-keys": "off",

      // ===== 导入规则 =====
      "import/first": "error",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "error",
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "vue",
              group: "external",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
        },
      ],

      // ===== 代码风格规则 =====
      "prettier/prettier": [
        "warn",
        {
          endOfLine: "auto",
        },
      ],

      // ===== 最佳实践 =====
      "no-var": "error",
      "prefer-const": "warn",
      "no-const-assign": "error",
      "no-dupe-keys": "error",
      "no-empty": "warn",
      "no-extra-boolean-cast": "warn",
      "no-irregular-whitespace": "warn",
      "no-unreachable": "error",
      "valid-typeof": "error",

      // ===== 自定义规则 =====
      "no-unused-expressions": "off", // 由 TypeScript 检查
    },
    settings: {
      "import/resolver": {
        node: {
          extensions: [".js", ".jsx", ".ts", ".tsx", ".vue"],
        },
      },
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      "**/build/**",
      "**/public/**",
      "**/*.min.js",
      "**/coverage/**",
      "**/.git/**",
      "**/package-lock.json",
      "**/pnpm-lock.yaml",
      // 忽略 src 目录以外的所有文件
      "!src/**",
    ],
  },
];
