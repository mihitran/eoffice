<template>
  <div>
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
        <a-select
          v-model:value="selectedType"
          placeholder="Vui lòng chọn"
          style="width: 100%"
          :disabled="!selectedBook"
        />
      </div>
    </div>

    <div class="form-row">
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { LooseRequired } from '@vue/shared';
import { ref, watch, toRefs, type DefineProps } from 'vue'

// Props + v-model
const props = defineProps<{
  selectedBook: string | null
  selectedType: string | null
  arrivalNumber: number | null
  autoNumber: number | null
  numberError: string | null
  bookOptions: string[]
}>()
const emits = defineEmits<{
  'update:selectedBook': [string | null]
  'update:selectedType': [string | null]
  'update:arrivalNumber': [number | null]
  'update:autoNumber': [number | null]
  'update:numberError': [string | null]
}>()

const selectedBook = useVModel(props, 'selectedBook', emits)
const selectedType = useVModel(props, 'selectedType', emits)
const arrivalNumber = useVModel(props, 'arrivalNumber', emits)
const autoNumber = useVModel(props, 'autoNumber', emits)
const numberError = useVModel(props, 'numberError', emits)

watch(selectedType, async (newType) => {
  if (newType && selectedBook.value) {
    const res = await fetch(`/api/next-arrival?book=${encodeURIComponent(selectedBook.value)}&type=${encodeURIComponent(newType)}`)
    const data = await res.json()
    autoNumber.value = data.nextNumber
    arrivalNumber.value = data.nextNumber
    numberError.value = null
  }
})

async function validateArrival(val: number) {
  if (autoNumber.value !== null && val < autoNumber.value) {
    numberError.value = 'Số phải lớn hơn hoặc bằng ' + autoNumber.value
    return
  }

  try {
    const res = await fetch(`/api/check-arrival-used?book=${encodeURIComponent(selectedBook.value!)}&type=${encodeURIComponent(selectedType.value!)}&number=${val}`)
    const data = await res.json()
    numberError.value = data.used ? 'Số đến đã được sử dụng' : null
  } catch (err) {
    console.error('Lỗi kiểm tra số đến:', err)
  }
}

function useVModel(props: DefineProps<LooseRequired<__VLS_Props>, never>, arg1: string, emits: ((evt: "update:selectedBook", args_0: string | null) => void) & ((evt: "update:selectedType", args_0: string | null) => void) & ((evt: "update:arrivalNumber", args_0: number | null) => void) & ((evt: "update:autoNumber", args_0: number | null) => void) & ((evt: "update:numberError", args_0: string | null) => void)) {
    throw new Error('Function not implemented.');
}
</script>
