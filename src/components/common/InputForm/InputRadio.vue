<template>
    <!-- Radio chọn ký phụ lục -->
    <div class="form-group flex justify-around pt-5">
        <div class="radio-group">
            <label class="radio-label"> {{ label }}</label>
            <div class="radio-options font-bold text-[var(--primary-color)]">
                <label><input type="radio" name="attachmentSign" value="false" /> Không</label>
                <label><input type="radio" name="attachmentSign" value="true" /> Có</label>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const props = defineProps<{
        label: string
    }>()
</script>
