<template>
  <a-row :gutter="16" class="row-wrap">
    <!-- Cột trái -->
    <UploadBox v-model="mainFileUrl" :fileName="mainDocumentFileName ?? undefined" class="upload-box"
      @uploaded="(val: string) => console.log('File uploaded:', val)"
      @fileNameChanged="(val: string) => mainDocumentFileName = val" />

    <!-- Cột phải -->
    <a-col :span="12" class="upload-document">
      <div class="form-upload">

        <!-- Sổ văn bản và Loại văn bản -->
        <div class="form-row">
          <!-- Sổ văn bản -->
          <div class="form-group">
            <label class="label required">Sổ văn bản</label>
            <a-select v-model:value="selectedBook" placeholder="Vui lòng chọn" style="width: 100%">
              <a-select-option v-for="item in bookOptions" :key="item" :value="item">
                {{ item }}
              </a-select-option>
            </a-select>
          </div>
          <!-- Loại văn bản -->
          <div class="form-group">
            <label class="label required">Loại văn bản</label>
            <a-select v-model:value="selectedType" placeholder="Vui lòng chọn" style="width: 100%"
              :disabled="!selectedBook" />
          </div>
        </div>

        <!-- Sổ đến và Độ khẩn -->
        <div class="form-row">
          <!-- Sổ đến -->
          <div class="form-group">
            <label class="label required">Số đến</label>
            <a-input-number v-model:value="arrivalNumber" :min="autoNumber || 1" placeholder="Nhập số đến"
              style="width: 100%" />
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

        <!-- Số và ký hiệu văn bản, Ngày đến -->
        <div class="form-row">
          <!-- Nhập Số và ký hiệu văn bản -->
          <div class="form-group">
            <label class="label required">Số và ký hiệu văn bản</label>
            <a-input v-model:value="documentSymbol" placeholder="Nhập số và ký hiệu" style="width: 100%" />
          </div>
          <!-- Chọn Ngày đến (không được lớn hơn hôm nay) -->
          <div class="form-group">
            <label class="label required">Ngày đến</label>
            <a-date-picker v-model:value="arrivalDate" :disabled-date="disableFutureDates" placeholder="Chọn ngày"
              style="width: 100%" />
          </div>
        </div>

        <!-- Hạn trả lời và Ngày ban hành -->
        <div class="form-row">
          <!-- Hạn trả lời: chỉ chọn từ hôm nay trở đi -->
          <div class="form-group">
            <label class="label">Hạn trả lời</label>
            <a-date-picker v-model:value="replyDeadline" :disabled-date="disablePastDates"
              placeholder="Chọn hạn trả lời" style="width: 100%" />
          </div>
          <!-- Ngày ban hành: không giới hạn -->
          <div class="form-group">
            <label class="label">Ngày ban hành</label>
            <a-date-picker v-model:value="issuedDate" placeholder="Chọn ngày ban hành" style="width: 100%" />
          </div>
        </div>

        <!-- Đơn vị ban hành -->
        <div class="form-row">
          <div class="form-group">
            <label class="label required">Đơn vị ban hành</label>
            <!-- Ô chọn đơn vị ban hành -->
            <div class="flex items-center border rounded px-3 py-2 cursor-pointer w-full bg-white"
              @click="showModal = true">
              <!-- Văn bản hiển thị -->
              <div class="flex-1 text-gray-400">
                {{ selectedIssuerInfo?.name || 'Chọn đơn vị ban hành' }}
              </div>
              <!-- Nút chọn bên phải -->
              <a-button type="primary" class="rounded px-4 py-1 ml-3" @click.stop="showModal = true">
                Chọn
              </a-button>
            </div>
            <!-- Modal popup -->
            <!-- </div class = "">  -->
            <SelectIssuerModal v-model:visible="showModal" v-model:selected="selectedIssuerInfo" />
          </div>
          <div class="form-group">
          </div>
        </div>

        <!-- File văn bản + Ký file văn bản -->
        <div class="form-row">
          <!-- File văn bản -->
          <div class="form-group file-group">
            <label class="label required">File văn bản</label>

            <!-- Vùng click chọn file -->
            <div class="file-box" @click="triggerFileUpload">
              <span class="file-placeholder">
                {{ mainDocumentFileName || 'File văn bản' }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#999"
                  d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 14h-2v2h-2v-2H9l3-3 3 3zm-3-5c-.55 0-1 .45-1 1h2c0-.55-.45-1-1-1zm2-4V9h5.5L13 3.5z" />
              </svg>
            </div>
          </div>

          <!-- Tách input ra ngoài để không trigger click nhiều lần -->
          <input ref="fileInput" type="file" class="hidden" accept="*" @change="handleFileChange" />
          <!-- Radio chọn ký -->
          <div class="form-group flex justify-around pt-5">
            <div class="radio-group">
              <label class="radio-label">Ký số file văn bản</label>
              <div class="radio-options font-bold text-[var(--primary-color)]">
                <label><input type="radio" name="attachmentSign" value="false " /> Không</label>
                <label><input type="radio" name="attachmentSign" value="true" /> Có</label>
              </div>
            </div>
          </div>
        </div>

        <!-- File phụ lục và ký -->
        <div class="form-row">
          <!-- File phụ lục -->
          <div class="form-group file-group">
            <label class="label required">File phụ lục</label>
            <!-- Vùng click chọn file -->
            <div class="file-box" @click="triggerAttachmentFileUpload">
              <span class="file-placeholder">
                {{ attachmentPlaceholder }}
              </span>
              <svg xmlns="http://www.w3.org/2000/svg" class="upload-icon" viewBox="0 0 24 24" width="18" height="18">
                <path fill="#999"
                  d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm1 14h-2v2h-2v-2H9l3-3 3 3zm-3-5c-.55 0-1 .45-1 1h2c0-.55-.45-1-1-1zm2-4V9h5.5L13 3.5z" />
              </svg>
            </div>
            <!-- input bị ẩn hoàn toàn -->
            <input ref="attachmentFileInput" type="file" class="hidden" accept="*" multiple
              @change="handleAttachmentFileChange" />
          </div>
          <!-- Radio chọn ký phụ lục -->
          <div class="form-group flex justify-around pt-5">
            <div class="radio-group">
              <label class="radio-label">Ký số file phụ lục</label>
              <div class="radio-options font-bold text-[var(--primary-color)]">
                <label><input type="radio" name="attachmentSign" value="false" /> Không</label>
                <label><input type="radio" name="attachmentSign" value="true" /> Có</label>
              </div>
            </div>
          </div>
        </div>
        <!-- Xác nhận -->
        <div class="form-row flex justify-end">
          <!-- Danh sách file đã chọn -->
          <ul v-if="attachmentFiles.length" class="mt-2 text-sm text-gray-700">
            <li v-for="(file, index) in attachmentFiles" :key="index">
              {{ file.name }}
            </li>
          </ul>
          <ul v-else class="mt-2 text-sm text-gray-400">
            <div></div>
          </ul>
          <a-button type="primary"
            class="flex relative justify-center items-center transition-all duration-500 outline-none border-none rounded-[25px] text-[14px] font-bold px-6 py-2 text-white font-semibold"
            style="background-color: var(--primary-color)">
            Xác nhận
          </a-button>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import './create.css'
import UploadBox from './UploadBox/UploadBox.vue'
import SelectIssuerModal from './PopUp/SelectIssuerModal.vue'
import { computed, ref, watch } from 'vue'

const selectedBook = ref<string | null>(null)
const selectedType = ref<string | null>(null)
const arrivalNumber = ref<number | null>(null) // so den nguoi dung nhin thay
const autoNumber = ref<number | null>(null) // so den do backend tra ve 
const numberError = ref<string | null>(null)
const urgencyOptions = ['Bình thường', 'Khẩn', 'Thượng khẩn', 'Hỏa tốc']
const selectedUrgency = ref<string | null>(null)
const bookOptions = ['Sổ 1', 'Sổ 2', 'Sổ 3']
// const uploadedFileName = ref<string | null>(null) 

const documentSymbol = ref<string | null>(null)
const arrivalDate = ref<Date | null>(null)

const replyDeadline = ref<Date | null>(null)
const issuedDate = ref<Date | null>(null)

const showModal = ref(false)
const selectedIssuerInfo = ref<{
  type: 'internal' | 'external'
  code: string
  name: string
} | null>(null)

const mainDocumentFileName = ref<string | null>(null)
const mainDocumentFile = ref<File | null>(null)
const mainFileUrl = ref<string>('')

// Thêm biến cho file phụ lục

const attachmentFiles = ref<File[]>([]) // dùng mảng thay vì 1 file
const attachmentFileName = ref<string | null>(null)
// const attachmentFileUrl = ref<string>('') 

const fileInput = ref<HTMLInputElement | null>(null)
const attachmentFileInput = ref<HTMLInputElement | null>(null)

const attachmentPlaceholder = computed(() => {
  if (attachmentFiles.value.length === 0) return 'File phụ lục'
  return `Đã chọn ${attachmentFiles.value.length} file`
})

watch(mainFileUrl, (newUrl) => {
  if (newUrl && !mainDocumentFileName.value) {
    const fileName = newUrl.split('/').pop() || 'File văn bản'
    mainDocumentFileName.value = fileName
  }
})

watch(mainDocumentFileName, (newFileName) => {
  if (newFileName && !mainFileUrl.value) {
    console.log('File name changed in form:', newFileName)
  }
})

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

// Function cho file văn bản chính
function triggerFileUpload() {
  fileInput.value?.click()
}

function handleFileChange(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (file) {
    mainDocumentFileName.value = file.name
    mainDocumentFile.value = file

    // Đồng bộ với UploadBox - tạo URL preview
    if (file.type === 'application/pdf') {
      mainFileUrl.value = URL.createObjectURL(file)
    }

    console.log('File văn bản selected:', file)
  } else {
    mainDocumentFileName.value = null
    mainDocumentFile.value = null
    mainFileUrl.value = '' // Xóa URL khi không có file
  }
}

// Function cho file phụ lục
function triggerAttachmentFileUpload() {
  attachmentFileInput.value?.click()
}

function handleAttachmentFileChange(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (files) {
    const newFiles = Array.from(files)

    for (const file of newFiles) {
      const alreadyExists = attachmentFiles.value.some(
        (f) => f.name === file.name && f.size === file.size
      )
      if (!alreadyExists) {
        attachmentFiles.value.push(file)
      }
    }

    // Reset để cho phép chọn lại file khác nếu cần
    (event.target as HTMLInputElement).value = ''
  }
}

function disableFutureDates(current: Date) {
  return current && current > new Date()
}

function disablePastDates(current: Date) {
  return current && current < new Date()
}
</script>
