<template>
  <a-modal
    :open="open"
    title="AI 智能简历生成"
    :width="680"
    :footer="null"
    class="ai-create-modal"
    @cancel="handleCancel"
  >
    <div class="pt-4 pb-2">
      <!-- Steps -->
      <div class="mb-8 px-4">
        <a-steps :current="currentStep" size="small">
          <a-step
            v-for="step in stepsConfig"
            :key="step.key"
            :title="step.title"
            :description="step.description"
          />
        </a-steps>
      </div>

      <!-- Content Area -->
      <div class="min-h-[320px] px-4">
        <div v-if="currentStepConfig" class="animate-fade-in">
          <div class="mb-4">
            <h3 class="text-lg font-bold text-slate-800 mb-2">
              {{ currentStepConfig.content.title }}
            </h3>
            <p class="text-slate-500 text-sm mb-4">
              {{ currentStepConfig.content.desc }}
            </p>
          </div>

          <!-- Step 1: Job Description -->
          <a-form v-if="currentStep === 0" layout="vertical">
            <a-form-item>
              <a-textarea
                v-model:value="formData.jd"
                :placeholder="jdPlaceholder"
                :rows="8"
                class="rounded-xl !border-slate-200 focus:!border-primary-500 focus:!shadow-none resize-none text-base leading-relaxed"
              />
            </a-form-item>

            <!-- Reserved slot for file upload or other input methods -->
            <div
              class="mt-4 p-4 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center cursor-pointer hover:border-primary-400 hover:bg-primary-50 transition-colors"
            >
              <p class="text-slate-500 text-sm">
                <span class="text-primary-600 font-medium">点击上传</span>
                职位描述文件 (支持 PDF/Word/Image)
              </p>
              <p class="text-xs text-slate-400 mt-1">此功能开发中，敬请期待</p>
            </div>
          </a-form>

          <!-- Step 2: User Info -->
          <a-form
            v-else-if="currentStep === 1"
            ref="userInfoFormRef"
            :model="formData.userInfo"
            :rules="userInfoRules"
            layout="vertical"
            class="grid grid-cols-2 gap-x-6 gap-y-2"
          >
            <template v-for="field in userInfoFields" :key="field.name">
              <a-form-item :label="field.label" :name="field.name">
                <component
                  :is="componentMap[field.component as keyof typeof componentMap]"
                  v-model:value="formData.userInfo[field.name as keyof typeof formData.userInfo]"
                  :placeholder="field.placeholder"
                  :min="field.min"
                  :max="field.max"
                  class="rounded-lg w-full"
                >
                  <template v-if="field.component === 'Select'">
                    <a-select-option v-for="opt in field.options" :key="opt" :value="opt">
                      {{ opt }}
                    </a-select-option>
                  </template>
                </component>
              </a-form-item>
            </template>
          </a-form>

          <!-- Step 3: Supplementary Info -->
          <a-form v-else-if="currentStep === 2" layout="vertical">
            <a-form-item>
              <a-textarea
                v-model:value="formData.supplementary"
                :placeholder="supplementaryPlaceholder"
                :rows="10"
                class="rounded-xl !border-slate-200 focus:!border-primary-500 focus:!shadow-none resize-none text-base leading-relaxed"
              />
            </a-form-item>
          </a-form>
        </div>
      </div>

      <!-- Footer Actions -->
      <div class="flex justify-between items-center px-4 mt-8 pt-4 border-t border-slate-100">
        <a-button v-if="currentStep > 0" class="rounded-lg" @click="prevStep"> 上一步 </a-button>
        <div v-else></div>
        <!-- Spacer -->

        <div class="flex gap-3">
          <a-button class="rounded-lg" @click="handleCancel">取消</a-button>

          <a-button v-if="currentStep < 2" type="primary" class="rounded-lg px-6" @click="nextStep">
            下一步
          </a-button>

          <a-button
            v-else
            type="primary"
            :loading="loading"
            class="rounded-lg px-8 bg-gradient-to-r from-primary-500 to-indigo-600 border-none hover:shadow-lg hover:shadow-primary-500/30"
            @click="handleSubmit"
          >
            <template #icon>
              <Sparkles class="w-4 h-4 mr-1 inline-block" />
            </template>
            开始生成
          </a-button>
        </div>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { Sparkles } from "lucide-vue-next";

import type { AiCreateFormData } from "../types";

interface Props {
  open: boolean;
  loading?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:open", "submit", "cancel"]);

const currentStep = ref(0);
const userInfoFormRef = ref<FormInstance>();

const stepsConfig = [
  {
    key: "jd",
    title: "职位信息",
    description: "解析JD",
    content: {
      title: "请输入目标岗位 JD (Job Description)",
      desc: "AI 将根据职位描述为您定制简历内容，提高人岗匹配度。",
    },
  },
  {
    key: "userInfo",
    title: "基本资料",
    description: "个人画像",
    content: {
      title: "完善基本资料",
      desc: "请填写真实信息，以便 AI 生成准确的个人经历。",
    },
  },
  {
    key: "supplementary",
    title: "补充信息",
    description: "亮点补充",
    content: {
      title: "补充关键信息",
      desc: "提供更多细节（如核心技能、主要项目、获得奖项等），让简历更出彩。",
    },
  },
];

const currentStepConfig = computed(() => stepsConfig[currentStep.value]);

const jdPlaceholder = `请粘贴职位描述（JD）内容，例如：
1. 负责前端业务开发...
2. 精通 Vue3、TypeScript...
3. 有大型项目经验优先...`;

const supplementaryPlaceholder = `例如：
- 熟练使用 Vue3 全家桶...
- 主导过千万级用户量的电商后台重构...
- 获得过 ACM 区域赛银牌...`;

const componentMap = {
  Input: "a-input",
  Select: "a-select",
  InputNumber: "a-input-number",
};
const userInfoFields = [
  { label: "姓名", name: "name", component: "Input", placeholder: "您的姓名" },
  {
    label: "目标岗位",
    name: "targetRole",
    component: "Input",
    placeholder: "例如：前端工程师",
  },
  {
    label: "最高学历",
    name: "education",
    component: "Select",
    placeholder: "选择学历",
    options: ["大专", "本科", "硕士", "博士"],
  },
  {
    label: "毕业院校",
    name: "school",
    component: "Input",
    placeholder: "学校名称",
  },
  {
    label: "主修专业",
    name: "major",
    component: "Input",
    placeholder: "专业名称",
  },
  {
    label: "工作年限",
    name: "yearsOfExperience",
    component: "Select",
    placeholder: "请选择工作年限",
    options: ["在校生", "1-3年", "3-5年", "5-10年", "10年以上"],
  },
  {
    label: "年龄",
    name: "age",
    component: "InputNumber",
    placeholder: "22",
    min: 16,
    max: 80,
  },
];

const formData = ref<AiCreateFormData>({
  jd: "",
  userInfo: {
    name: "",
    age: undefined,
    education: undefined,
    school: "",
    major: "",
    targetRole: "",
    yearsOfExperience: undefined,
  },
  supplementary: "",
});

const userInfoRules = {
  name: [{ required: true, message: "请输入姓名", trigger: "blur" }],
  targetRole: [{ required: true, message: "请输入目标岗位", trigger: "blur" }],
  education: [{ required: true, message: "请选择学历", trigger: "change" }],
  school: [{ required: true, message: "请输入毕业院校", trigger: "blur" }],
};

const handleCancel = () => {
  emit("update:open", false);
  emit("cancel");
};

const nextStep = async () => {
  if (currentStep.value === 0) {
    if (!formData.value.jd.trim()) {
      message.warning("请先输入职位描述(JD)");
      return;
    }
    currentStep.value++;
  } else if (currentStep.value === 1) {
    try {
      await userInfoFormRef.value?.validate();
      currentStep.value++;
    } catch (error) {
      // Form validation failed
    }
  }
};

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--;
  }
};

const handleSubmit = () => {
  emit("submit", {
    jd: formData.value.jd,
    userInfo: { ...formData.value.userInfo },
    supplementary: formData.value.supplementary,
  });
};
</script>

<style scoped>
.ai-create-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}

.ai-create-modal :deep(.ant-modal-header) {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 0;
}

.ai-create-modal :deep(.ant-steps-item-process .ant-steps-item-icon) {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.ai-create-modal :deep(.ant-steps-item-finish .ant-steps-item-icon) {
  color: #3b82f6;
  border-color: #3b82f6;
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
