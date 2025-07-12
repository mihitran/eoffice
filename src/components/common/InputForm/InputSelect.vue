<template>
    <div class="form-group">
        <label class="label required">{{ label }}</label>
        <a-select v-model:value="selected" placeholder="Vui lòng chọn" style="width: 100%" :disabled="disabled">
            <a-select-option v-for="item in Options" :key="item" :value="item">
                {{ item }}
            </a-select-option>
        </a-select>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
    const props = defineProps<{
        label: string;
        Options: string[];
        modelValue: string | null;
        disabled?: boolean;
    }>();
    const emits = defineEmits<{
        (e: 'update:modelValue', value: string): void;
    }>();
    const selected = computed({
        get: () => props.modelValue,
        set: (value: string) => {
            emits('update:modelValue', value);
        }
    })
</script>
