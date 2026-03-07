<template>
  <a-modal
    :open="open"
    title="修改密码"
    :width="480"
    :footer="null"
    @cancel="handleCancel"
    class="change-password-modal"
  >
    <a-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      layout="vertical"
      class="mt-4"
    >
      <a-form-item label="当前密码" name="oldPassword">
        <a-input-password
          v-model:value="formData.oldPassword"
          placeholder="请输入当前密码"
          size="large"
        />
      </a-form-item>

      <a-form-item label="新密码" name="newPassword">
        <a-input-password
          v-model:value="formData.newPassword"
          placeholder="请输入新密码（至少6位）"
          size="large"
        />
      </a-form-item>

      <a-form-item label="确认新密码" name="confirmPassword">
        <a-input-password
          v-model:value="formData.confirmPassword"
          placeholder="请再次输入新密码"
          size="large"
        />
      </a-form-item>

      <div class="flex justify-end gap-3 mt-6">
        <a-button @click="handleCancel" size="large"> 取消 </a-button>
        <a-button
          type="primary"
          :loading="loading"
          @click="handleSubmit"
          size="large"
          class="min-w-[100px]"
        >
          确认修改
        </a-button>
      </div>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { message } from "ant-design-vue";
import type { FormInstance } from "ant-design-vue";
import { changePasswordAPI } from "@/api/user/user";

interface Props {
  open: boolean;
}

interface Emits {
  (e: "update:open", value: boolean): void;
  (e: "success"): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const formRef = ref<FormInstance>();
const loading = ref(false);

const formData = ref({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});

const rules = {
  oldPassword: [
    { required: true, message: "请输入当前密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
  newPassword: [
    { required: true, message: "请输入新密码", trigger: "blur" },
    { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
  ],
  confirmPassword: [
    { required: true, message: "请确认新密码", trigger: "blur" },
    {
      validator: (_rule: any, value: string) => {
        if (value !== formData.value.newPassword) {
          return Promise.reject("两次输入的密码不一致");
        }
        return Promise.resolve();
      },
      trigger: "blur",
    },
  ],
};

const handleCancel = () => {
  emit("update:open", false);
  resetForm();
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    loading.value = true;

    await changePasswordAPI({
      oldPassword: formData.value.oldPassword,
      newPassword: formData.value.newPassword,
      confirmPassword: formData.value.confirmPassword,
    });

    message.success("密码修改成功");
    emit("success");
    handleCancel();
  } catch (error: any) {
    if (error.errorFields) {
      message.warning("请检查表单填写是否正确");
    }
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  formData.value = {
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  };
  formRef.value?.resetFields();
};

watch(
  () => props.open,
  (newVal) => {
    if (!newVal) {
      resetForm();
    }
  },
);
</script>

<style scoped>
.change-password-modal :deep(.ant-modal-content) {
  border-radius: 1rem;
  overflow: hidden;
}

.change-password-modal :deep(.ant-modal-header) {
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 1rem;
  margin-bottom: 0;
}

.change-password-modal :deep(.ant-form-item-label > label) {
  font-weight: 500;
  color: #334155;
}

.change-password-modal :deep(.ant-input-password) {
  border-radius: 0.5rem;
}

.change-password-modal :deep(.ant-btn) {
  border-radius: 0.5rem;
  font-weight: 500;
}
</style>
