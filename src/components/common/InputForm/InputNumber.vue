<template>
    <div class="form-group">
        <label class="label required">{{ label }}</label>
        <a-input-number v-model:value="arrivalNumber" :min="autoNumber || 1" placeholder="Nhập số đến"
            style="width: 100%" />
        <div v-if="numberError" class="error-msg">{{ numberError }}</div>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

    const props = defineProps<{
        label: string;
        modelValue: number | null;
        autoNumber?: number | null;
        numberError?: string | null;
    }>()

    const emit = defineEmits<{
        (e: 'update:modelValue', value: number | null): void;
    }>()

    const arrivalNumber = computed({
        get: ()=> props.modelValue,
        set: (val) => emit('update:modelValue', val)
    })
</script>