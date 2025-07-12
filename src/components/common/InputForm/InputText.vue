<template>
    <div class="form-group">
        <label class="label required">{{ label }}</label>
        <Field name="documentSymbol" v-slot="{ field }">
            <a-input v-bind="field" placeholder="Nhập số và ký hiệu" style="width: 100%" />
        </Field>
        <ErrorMessage name="documentSymbol" class="error-msg" />
    </div>
</template>

<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'
    const props = defineProps<{
        label: string
    }>()
</script>