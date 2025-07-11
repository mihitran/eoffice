<template>
    <!-- Cột trái -->
    <a-col :span="12" class="upload-box" @click="triggerInput" @drop.prevent="handleDrop">
        <input type="file" ref="fileInput" class="hidden-input" @change="handleChange" accept=".doc,.docx,.pdf" />
        <div v-if="isPending" class="loading-msg">Đang xử lý...</div>
        <div v-else-if="!fileURL" class="upload-placeholder" style="display: flex; align-items: center; justify-content: center; height: 100%;">
            <p>Kéo thả hoặc bấm để chọn file văn bản tải lên</p>
        </div>
        <div v-else class="preview">
            <!-- <h4>Preview:</h4> -->
            <iframe :src="fileURL" width="100%" height="400px" style="border: none">
            </iframe>
        </div>
    </a-col>
</template>

<script setup lang="ts">

const props = defineProps<{
    modelValue: string  // Url cuar file đã upload
    fileName?: string  // Tên file hiện tại
}>()

const emit = defineEmits<{
    (e: 'update:modelValue', val: string): void // Cập nhật URL file
    (e: 'uploaded', val: string): void // Thông báo upload thành công
    (e: 'fileNameChanged', val: string): void  // Cập nhật tên file
}>()

import { useMutation } from '@tanstack/vue-query'
import { ref, watch } from 'vue'

const fileInput = ref<HTMLInputElement | null>(null)
const fileURL = ref<string | null>(null)
// const loading = ref(false)

watch(
    () => props.modelValue,
    (val) => {
        if (val && val !== fileURL.value) {
            fileURL.value = val
        }
    },
    { immediate: true }
)

const uploadFileAPI = async (formData: FormData) => {
    const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
    })
    const data = await response.json()
    if (!data.fileURL) {
        throw new Error('Không có fileURL trong phản hồi từ server.')
    }
    return data
}

const { mutate: uploadFile, isPending } = useMutation({
    mutationFn: uploadFileAPI,
    onSuccess: (data) => {
        fileURL.value = data.fileURL
        emit('update:modelValue', data.fileURL)
        emit('uploaded', data.fileURL)
        console.log('File uploaded successfully:', data)
    },
    onError: (error) => {
        console.error('Upload failed:', error)
        alert('Tải file thất bại. Vui lòng thử lại.')
    }
})

function triggerInput() {
    fileInput.value?.click()
}

function handleChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0]
    if (file) handleUpload(file)
}

function handleDrop(event: DragEvent) {
    const file = event.dataTransfer?.files?.[0]
    if (file) handleUpload(file)
}

// Khi user upload file trong UploadBox
function handleUpload(file: File) {
    if (file.type === 'application/pdf') {
        fileURL.value = URL.createObjectURL(file) // Tạo preview
    }
    const formData = new FormData()
    formData.append('file', file)

    // loading.value = true

    // Thêm emit tên file
    emit('fileNameChanged', file.name) // Gửi tên file về form
    
    uploadFile(formData)
}

</script>

<style scoped>
.upload-box {
    position: relative;
    border: 2px dashed #d0d0d0;
    border-radius: 16px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s ease;
    background: #fff;
    box-shadow: 0 0 12px rgba(0, 0, 0, 0.06);
    width: 100%;
    height: 300px;
    overflow: hidden;
}

.preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: white;
    z-index: 10;
    border-radius: 16px;
    overflow: hidden;
}

.preview iframe {
    width: 100%;
    height: 100%;
    border: none;
}

.hidden-input {
    display: none;
}

.upload-placeholder {
    color: #007bff;
    font-size: 16px;
}

.preview {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 10;
}
</style>