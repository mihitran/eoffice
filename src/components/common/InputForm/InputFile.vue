<template>
  <div class="form-group file-group">
    <label class="label required">{{ label }}</label>

    <!-- Vùng click chọn file -->
    <div class="file-box" @click="triggerFileUpload">
      <span class="file-placeholder">
        {{ attachmentPlaceholder }}
      </span>
      <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" viewBox="0 0 24 24" width="18" height="18">
        <path fill="#999"
          d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 14h-2v2h-2v-2H9l3-3 3 3zm-3-5c-.55 0-1 .45-1 1h2c0-.55-.45-1-1-1zm2-4V9h5.5L13 3.5z" />
      </svg>
    </div>

    <!-- input bị ẩn hoàn toàn -->
    <input ref="attachmentFileInput" type="file" class="hidden" accept="*" :multiple="fileType === 'attachment'"
      @change="handleFileChange" />
  </div>
</template>

<script lang="ts" setup>
import {
  handleAttachmentFileChange,
  handleFileChange as handleMainFileChange,
  triggerAttachmentFileUpload
} from '@/utils/InputForm/handleChange'

import { ref, type Ref } from 'vue'

const props = defineProps<{
  label: string
  attachmentPlaceholder: string
  modelValue: File[] | File | null
  fileType: 'main' | 'attachment'
  fileRef?: Ref<File | null> | null
  fileNameRef?: Ref<string | null> | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', files: File[] | File | null): void
}>()

const attachmentFileInput = ref<HTMLInputElement | null>(null)
const attachmentFiles = ref<File[]>(Array.isArray(props.modelValue) ? props.modelValue : [])

function triggerFileUpload() {
  triggerAttachmentFileUpload(attachmentFileInput.value)
}

function handleFileChange(event: Event) {
  if (props.fileType === 'attachment') {
    handleAttachmentFileChange(event, attachmentFiles, (files) => {
      emit('update:modelValue', files)
    })
  } else if (props.fileType === 'main' && props.fileRef && props.fileNameRef) {
    handleMainFileChange(event, props.fileRef, props.fileNameRef)
    emit('update:modelValue', props.fileRef.value)
  }
}

</script>
