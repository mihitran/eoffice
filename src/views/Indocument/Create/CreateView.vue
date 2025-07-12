<template>
  <a-row :gutter="16" class="row-wrap">
    <!-- Cột trái -->
    <UploadBox v-model="mainFileUrl" :fileName="mainDocumentFileName ?? undefined" class="upload-box"
      @uploaded="(val: string) => console.log('File uploaded:', val)"
      @fileNameChanged="(val: string) => mainDocumentFileName = val" />

    <!-- Cột phải -->
    <a-col :span="12" class="upload-document">
      <Form v-slot="{ handleSubmit }" @submit="handleSubmit(onSubmit)" class="form-upload">
        <!-- Sổ văn bản và Loại văn bản -->
        <div class="form-row">
          <!-- Sổ văn bản -->
          <SelectField v-model="selectedBook" :label="'Sổ văn bản'" :Options="books" />
          <!-- Loại văn bản -->
          <SelectField v-model="selectedType" :label="'Loại văn bản'" :Options="['Công văn', 'Quyết định', 'Thông báo']"
            :disabled="!selectedBook" />
        </div>

        <!-- Sổ đến và Độ khẩn -->
        <div class="form-row">
          <!-- Sổ đến -->
          <InputNumberField v-model="arrivalNumber" :label="'Số đến'" :autoNumber="autoNumber"
            :numberError="numberError" />
          <!-- Độ khẩn -->
          <SelectField v-model="selectedUrgency" :label="'Độ khẩn'" :Options="urgencyOptions" />
        </div>

        <!-- Số và ký hiệu văn bản, Ngày đến -->
        <div class="form-row">
          <!-- Nhập Số và ký hiệu văn bản -->
          <InputeTextField label="Số và ký hiệu văn bản" />
          <!-- Chọn Ngày đến (không được lớn hơn hôm nay) -->
          <DateField v-model="arrivalDate" label="Ngày đến" :disabledDate="disableFutureDates" />
        </div>

        <!-- Hạn trả lời và Ngày ban hành -->
        <div class="form-row">
          <!-- Hạn trả lời: chỉ chọn từ hôm nay trở đi -->
          <DateField v-model="answerDeadline" label="Hạn trả lời" :disabledDate="disablePastDates" />
          <!-- Ngày ban hành: không giới hạn -->
          <DateField v-model="issueDate" label="Ngày ban hành" />
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
          <RadioGroupField label="Ký số file văn bản" />
        </div>

        <!-- File phụ lục và ký -->
        <div class="form-row">
          <!-- File phụ lục -->
          <AttachmentUpload label="File phụ lục" ref="attachmentUpload" fileType="attachment" v-model="attachmentFiles"
            :attachmentPlaceholder="`Đã chọn ${attachmentFiles.length} file`" />
          <!-- Radio chọn ký phụ lục -->
          <RadioGroupField label="Ký số file phụ lục" />
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
      </Form>
    </a-col>
  </a-row>
</template>

<script lang="ts" setup>
import './create.css'
import UploadBox from '../../../components/common/InputForm/UploadBox.vue'
import SelectIssuerModal from '../../../components/common/PopUp/SelectIssuerModal.vue'
import { ref, watch } from 'vue'
import { useForm, Form } from 'vee-validate'
import * as yup from 'yup'

import { disableFutureDates, disablePastDates } from '@/utils/InputForm/dateHelpers'
import DateField from '@/components/common/InputForm/InputDate.vue'
import RadioGroupField from '@/components/common/InputForm/InputRadio.vue'
import InputeTextField from '@/components/common/InputForm/InputText.vue'
import SelectField from '@/components/common/InputForm/InputSelect.vue'
import InputNumberField from '@/components/common/InputForm/InputNumber.vue'
import AttachmentUpload from '@/components/common/InputForm/InputFile.vue'

const selectedType = ref<string | null>(null)
const arrivalNumber = ref<number | null>(null) // so den nguoi dung nhin thay
const autoNumber = ref<number | null>(null) // so den do backend tra ve 
const numberError = ref<string | null>(null)
const urgencyOptions = ['Bình thường', 'Khẩn', 'Thượng khẩn', 'Hỏa tốc']
const selectedUrgency = ref<string | null>(null)
const books = ['Sổ 1', 'Sổ 2', 'Sổ 3']
const selectedBook = ref<string | null>(null)
// Khai báo các biến cho ngày tháng
const answerDeadline = ref<Date | null>(null)
const arrivalDate = ref<Date | null>(null)
const issueDate = ref<Date | null>(null)

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
const attachmentFiles = ref<File[]>([])

const fileInput = ref<HTMLInputElement | null>(null)

// Khai báo schema
const schema = yup.object({
  documentSymbol: yup.string().required('Bạn cần nhập số và ký hiệu văn bản'),
})

// Khai báo kiểu từ schema
type FormValues = yup.InferType<typeof schema>

// Tạo form instance với schema
const { handleSubmit } = useForm<FormValues>({
  validationSchema: schema,
})

const onSubmit = (values: { documentSymbol: string }) => {
  console.log('Dữ liệu hợp lệ:', values)
}

watch(mainFileUrl, (newUrl) => {
  if (newUrl && !mainDocumentFileName.value) {
    const fileName = newUrl.split('/').pop() || 'File văn bản'
    mainDocumentFileName.value = fileName // Cập nhật tên file
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
</script>
