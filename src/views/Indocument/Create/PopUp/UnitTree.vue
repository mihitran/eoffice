<!-- UnitTree.vue -->
<template>
  <template v-for="node in data" :key="node.id">
    <tr class="hover:bg-gray-100 border-b">
      <!-- Cột đơn vị -->
      <td :style="{ paddingLeft: `${depth * 16}px` }" class="px-4 py-2 flex">
        <span v-if="node.children?.length" @click="toggle(node)" class="cursor-pointer flex items-center mr-[8px] ml-[8px]">
          <!-- icon mở rộng -->
          <svg v-if="isExpanded(node)" width="10" height="10" viewBox="0 0 10 6" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M9 1L5 5L1 1" stroke="#555555" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
            <svg v-else width="10" height="10" viewBox="0 0 6 10" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L1 9" stroke="#555555" stroke-width="2" stroke-linecap="round"
                stroke-linejoin="round" />
            </svg>
        </span>
        {{ node.name }}
      </td>

      <!-- Cột chọn -->
      <td class="text-center px-4 py-2">
        <input 
          type="radio" 
          name="unit" 
          :value="node.id" 
          :checked="selected === node.id"
          :disabled="!!node.children?.length"
          @change="$emit('update:selected', node.id)" />
      </td>
    </tr>

    <!-- Đệ quy nếu có con -->
    <UnitTree
      v-if="node.children && isExpanded(node)"
      :data="node.children"
      :depth="depth + 1"
      :selected="selected"
      @update:selected="$emit('update:selected', $event)"
    />
  </template>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  data: { id: string; name: string; children?: any[] }[]
  selected: string | null
  depth?: number
}>()

const emit = defineEmits(['update:selected'])

const expandedMap = ref<Record<string, boolean>>({})
const depth = props.depth ?? 0

function toggle(node: any) {
  expandedMap.value[node.id] = !expandedMap.value[node.id]
}
function isExpanded(node: any) {
  return expandedMap.value[node.id]
}
</script>

