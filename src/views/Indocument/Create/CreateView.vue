<template>
  <a-row :gutter="16" class="row-wrap">
    <!-- Cột trái -->
    <UploadBox />
    <!-- Cột phải -->
    <a-col :span="12" class="upload-document">
      <div class="form-upload">
        <!-- Selects -->
        <div class="form-row">
          <div class="form-group">
            <label class="label required">Sổ văn bản</label>
            <a-select v-model:value="selectedBook" placeholder="Vui lòng chọn" style="width: 100%">
              <a-select-option v-for="item in bookOptions" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <div class="form-group">
            <label class="label required">Loại văn bản</label>
            <a-select v-model:value="selectedType" placeholder="Vui lòng chọn" style="width: 100%"
              :disabled="!selectedBook" />
          </div>

        </div>
        <div class="form-row">
          <!-- Sổ đến -->
          <div class="form-group">
            <label class="label required">Số đến</label>
            <a-input-number 
              v-model:value="arrivalNumber" 
              :min="autoNumber || 1" 
              placeholder="Nhập số đến"
              style="width: 100%" 
              @change="validateArrival" 
            />
            <div v-if="numberError" class="error-msg">{{ numberError }}</div>
          </div>

          <!-- Độ khẩn -->
          <div class="form-group">
            <label class="label required">Độ khẩn</label>
            <a-select v-model:value="selectedUrgency" placeholder="Vui lòng chọn" style="width: 100%">
              <a-select-option v-for="option in urgencyOptions" :key="option" :value="option">
                {{ option }}
              </a-select-option>
            </a-select>
          </div>
        </div>

        <!-- Upload + Radio -->
        <div class="form-row">
          <!-- Upload thực sự -->
          <div class="form-group file-group">
            <label class="label required">File văn bản</label>
            <div class="file-box" @click="triggerFileUpload">
              <span class="file-placeholder">
                {{ uploadedFileName || 'File văn bản' }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#999"
                  d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 14h-2v2h-2v-2H9l3-3 3 3zm-3-5c-.55 0-1 .45-1 1h2c0-.55-.45-1-1-1zm2-4V9h5.5L13 3.5z" />
              </svg>
              <input ref="fileInput" type="file" class="file-hidden-input" accept="*" @change="handleFileChange" />
            </div>
          </div>

          <!-- Radio chọn ký số -->
          <div class="form-group">
            <div class="radio-group">
              <label class="radio-label">Ký số file văn bản</label>
              <div class="radio-options">
                <label><input type="radio" name="attachmentSign" value="false" /> Không</label>
                <label><input type="radio" name="attachmentSign" value="true" /> Có</label>
              </div>
            </div>
          </div>
        </div>
      </div>

    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import UploadBox from '@/components/common/UploadBox/UploadBox.vue'
import { ref, watch } from 'vue'
import { errorMessages } from 'vue/compiler-sfc'

const selectedBook = ref<string | null>(null)
const selectedType = ref<string | null>(null)
const arrivalNumber = ref<number | null>(null) // so den nguoi dung nhin thay
const autoNumber = ref<number | null>(null) // so den do backend tra ve 
const numberError = ref<string | null>(null)
const urgencyOptions = ['Bình thường', 'Khẩn', 'Thượng khẩn', 'Hỏa tốc']
const selectedUrgency = ref<string | null>(null)
const bookOptions = ['Sổ 1', 'Sổ 2', 'Sổ 3']
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFileName = ref<string | null>(null)

watch(selectedType, async (newType) => {
  if (newType && selectedBook.value) {
    // Giả sử gọi API để lấy số đến dựa trên sổ và loại văn bản
    const res = await fetch(`/api/next-arrival?book=${encodeURIComponent(selectedBook.value)}&type=${encodeURIComponent(newType)}`)
    const data = await res.json()
    autoNumber.value = data.nextNumber
    arrivalNumber.value = data.nextNumber
    numberError.value = null
  } else {
    console.error('Không thể lấy số')
    autoNumber.value = null
    arrivalNumber.value = null
  }
})

function validateArrival(val: number) {
  if (autoNumber.value !== null && val < autoNumber.value) {
    numberError.value = 'Số phải lớn hơn hoặc bằng ' + autoNumber.value
  } else {
    numberError.value = null
  }
}

function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    uploadedFileName.value = file.name
    // Xử lý upload file nếu cần
    console.log('File selected:', file)
  } else {
    uploadedFileName.value = null
  }
}
</script>

<style scoped>
.row-wrap {
  display: flex;
  flex-wrap: nowrap;
  align-items: flex-start;
}

.dropzone {
  border: 1px dashed #ccc;
  padding: 24px;
  text-align: center;
  border-radius: 8px;
  background-color: transparent;
  color: var(--primary-color);
  width: 100%;
  box-sizing: border-box;
}

.file-input {
  margin-top: 10px;
}

.form-upload {
  padding: 16px;
  background-color: transparent;
  /* border-radius: 8px; */
  font-family: Arial, sans-serif;
  /* border: 1px solid #eee; */
}

.form-row {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  color: black;
  flex: 1;
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
}

.label {
  font-weight: bold;
  margin-bottom: 4px;
  color: #0050b3;
}

.required::after {
  content: '*';
  color: red;
  margin-left: 4px;
}

.file-box {
  position: relative;
  height: 40px;
  border: 1px solid #d9d9d9;
  background-color: #f5f5f5;
  border-radius: 4px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  color: #999;
  font-size: 14px;
  cursor: pointer;
}

.file-placeholder {
  flex-grow: 1;
  user-select: none;
}

.upload-icon {
  margin-left: 8px;
  flex-shrink: 0;
}

.file-hidden-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.radio-group {
  display: flex;
  align-items: center;
  gap: 12px;
}

.radio-label {
  font-weight: bold;
  color: #0050b3;
  white-space: nowrap;
  margin-right: 8px;
}

.radio-options {
  display: flex;
  gap: 16px;
}

.radio-group input[type='radio'] {
  margin-right: 4px;
}
</style>
