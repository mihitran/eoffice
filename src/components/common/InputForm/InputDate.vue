<template>
    <!-- Chọn Ngày đến (không được lớn hơn hôm nay) -->
    <div class="form-group">
        <label class="label" :class="{ required }">{{ label }}</label>
        <a-date-picker v-model:value="modelValue" :disabled-date="disabledDate" placeholder="Chọn ngày"
            style="width: 100%" />
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps < {
    label: string
    modelValue: Date | null
    required ?: boolean
    disabledDate ?: (current: Date) => boolean
}> ()

const emit = defineEmits<{
    (e: 'update:modelValue', value: Date | null): void
}>()

const modelValue = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value),
})
</script>
