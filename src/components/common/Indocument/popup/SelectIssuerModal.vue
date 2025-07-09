<!-- SelectIssuerModal.vue -->
<template>
  <a-modal
    :open="visible"
    title="Chọn đơn vị ban hành"
    width="800px"
    :footer="null"
    @update:open="emit('update:visible', $event)"
  >
    <!-- Tabs -->
    <div class="flex mb-4">
      <button
        class="flex-1 py-2 font-semibold rounded-l"
        :class="activeTab === 'internal' ? 'bg-blue-600 text-white' : 'bg-gray-100'"
        @click="activeTab = 'internal'"
      >
        Đơn vị nội bộ
      </button>
      <button
        class="flex-1 py-2 font-semibold rounded-r"
        :class="activeTab === 'external' ? 'bg-blue-600 text-white' : 'bg-gray-100'"
        @click="activeTab = 'external'"
      >
        Đơn vị bên ngoài
      </button>
    </div>

    <!-- Search -->
    <a-input
      v-model:value="searchKeyword"
      placeholder="Tìm kiếm"
      allow-clear
      class="mb-4"
    />

    <!-- Danh sách cây -->
    <div class="border rounded overflow-y-auto max-h-[400px]">
      <UnitTree :data="filteredUnits" v-model:selected="selectedIssuer" />
    </div>

    <!-- Footer -->
    <div class="flex justify-end mt-4 gap-4">
      <a-button @click="reset"> Đặt lại </a-button>
      <a-button type="primary" @click="confirm"> Chọn </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import UnitTree from './UnitTree.vue'

const props = defineProps<{ visible: boolean }>()
const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'selected', val: string | null): void
}>()

const searchKeyword = ref('')
const activeTab = ref<'internal' | 'external'>('internal')
const selectedIssuer = ref<string | null>(null)

const units = ref([
  {
    id: 'bk',
    name: 'Đại học Bách khoa Hà Nội',
    children: [
      { id: 'bgd', name: 'Ban Giám đốc' },
      {
        id: 'hanhchinh',
        name: 'Khối Đơn vị hành chính',
        children: [
          { id: 'vp', name: 'Văn phòng trường' },
          { id: 'kt', name: 'Phòng Kế toán' },
        ],
      },
    ],
  },
])

const filteredUnits = computed(() => {
  if (!searchKeyword.value) return units.value
  const keyword = searchKeyword.value.toLowerCase()
  const filterTree = (nodes: any[]): any[] => {
    return nodes
      .map((node) => {
        const match = node.name.toLowerCase().includes(keyword)
        const children = node.children ? filterTree(node.children) : []
        if (match || children.length > 0) {
          return { ...node, children }
        }
        return null
      })
      .filter(Boolean)
  }
  return filterTree(units.value)
})

function reset() {
  selectedIssuer.value = null
  searchKeyword.value = ''
}

function confirm() {
  emit('selected', selectedIssuer.value)
  emit('update:visible', false)
}
</script>
