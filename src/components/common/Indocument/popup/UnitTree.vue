<!-- UnitTree.vue -->
<template>
  <ul class="pl-4 space-y-1">
    <li v-for="node in data" :key="node.id">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-2">
          <span v-if="node.children?.length" @click="toggle(node)" class="cursor-pointer text-blue-500">
            {{ isExpanded(node) ? '▼' : '▶' }}
          </span>
          <span>{{ node.name }}</span>
        </div>
        <input
          type="radio"
          name="unit"
          :value="node.id"
          :checked="selected === node.id"
          @change="$emit('update:selected', node.id)"
        />
      </div>
      <UnitTree
        v-if="node.children && isExpanded(node)"
        :data="node.children"
        :selected="selected"
        @update:selected="$emit('update:selected', $event)"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const props = defineProps<{
  data: { id: string; name: string; children?: any[] }[]
  selected: string | null
}>()
const emit = defineEmits(['update:selected'])

const expandedMap = ref<Record<string, boolean>>({})

function toggle(node: any) {
  expandedMap.value[node.id] = !expandedMap.value[node.id]
}

function isExpanded(node: any) {
  return expandedMap.value[node.id]
}
</script>
