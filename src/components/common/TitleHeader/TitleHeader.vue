<script setup lang="ts">
import { computed, defineProps, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import TitleContent from './TitleContent.vue'

const props = defineProps<{
  to: string
  iconPath: string
  text: string
  hasDropdown?: boolean
}>()

const router = useRouter()
const route = useRoute()

const isActive = computed(() => route.path === props.to)

const isOpen = ref(false)

function handleClick() {
  if (props.hasDropdown) {
    isOpen.value = !isOpen.value
  }
}
</script>

<template>
  <div class="title-header-container">
    <div class="title_header" :class="{ active: isActive }" @click="handleClick">
      <!-- Router-link -->
      <router-link
        v-if="!hasDropdown"
        :to="to"
        class="router-link-wrapper"
        custom
        v-slot="{ navigate }"
      >
        <div @click="navigate">
          <TitleContent :iconPath="iconPath" :text="text" />
        </div>
      </router-link>

      <!-- Nếu là dropdown thì không cần router-link -->
      <template v-else>
        <TitleContent :iconPath="iconPath" :text="text" />
      </template>

      <svg
        v-if="hasDropdown"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.7998 9.5999L11.9998 14.3999L7.19981 9.5999"
          stroke="#FFFF"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </div>

    <!-- Dropdown content -->
    <div v-if="hasDropdown && isOpen" class="dropdown-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.title-header-container {
  display: flex;
  flex-direction: column;
}

.title_header {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  color: white;
}

.router-link-wrapper {
  display: flex;
  align-items: center;
}

.inner-left {
  display: flex;
  justify-content: center;
  align-items: center;
}

.title_icon {
  display: flex;
}

.title_header.active {
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.1) 3.18%, rgba(255, 255, 255, 0.04) 100%);
  border-radius: 16px;
  cursor: pointer;
  width: 100%;
}
</style>
