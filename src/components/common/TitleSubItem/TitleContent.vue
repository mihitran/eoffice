<template>
  <div class="inner-left">
    <div class="title_icon" style="display:flex">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d="M4.4 21.2H18.8C20.1255 21.2 21.2 20.1255 21.2 18.8V4.4C21.2 3.07452 20.1255 2 18.8 2H4.4C3.07452 2 2 3.07452 2 4.4V18.8C2 20.1255 3.07451 21.2 4.4 21.2Z"
          fill="white"
        />
        <path
          :d="iconPath"
          stroke="var(--primary-color)"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>
    <div class="title_content" style="font-size: 14px">
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  iconPath: string
  text: string
}>()
</script>
