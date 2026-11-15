<template>
  <footer class="bg-white border-t border-gray-100 pt-16 pb-8">
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        <!-- Brand -->
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-4">
            <div
              class="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white"
            >
              <FileTextOutlined class="text-lg" />
            </div>
            <span class="text-lg font-bold text-gray-900">大学生简历</span>
          </div>
          <p class="text-gray-500 text-sm leading-relaxed">
            专为大学生打造的专业简历制作平台。免费制作，AI辅助，助你轻松获得心仪Offer。
          </p>
        </div>

        <!-- Links -->
        <div>
          <h4 class="font-semibold text-gray-900 mb-4">产品</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >首页</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >简历模板</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >定价方案</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >帮助中心</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-4">法律</h4>
          <ul class="space-y-2">
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >用户协议</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >隐私政策</a
              >
            </li>
            <li>
              <a href="#" class="text-gray-500 hover:text-primary-600 text-sm transition-colors"
                >Cookie政策</a
              >
            </li>
          </ul>
        </div>

        <div>
          <h4 class="font-semibold text-gray-900 mb-4">联系我们</h4>
          <ul class="space-y-2">
            <li class="flex items-center gap-2 text-gray-500 text-sm">
              <MailOutlined /> 3134504258@qq.com
            </li>
            <li class="flex items-center gap-4 mt-4">
              <!-- Social Icons -->
              <a
                href="#"
                class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <WechatOutlined />
              </a>
              <a
                href="#"
                class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <WeiboOutlined />
              </a>
              <a
                href="#"
                class="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-primary-50 hover:text-primary-600 transition-colors"
              >
                <GithubOutlined />
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-8 text-center">
        <p class="text-gray-400 text-sm">
          © {{ new Date().getFullYear() }} 大学生简历. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import {
  FileTextOutlined,
  MailOutlined,
  WechatOutlined,
  WeiboOutlined,
  GithubOutlined,
} from "@ant-design/icons-vue";
</script>
