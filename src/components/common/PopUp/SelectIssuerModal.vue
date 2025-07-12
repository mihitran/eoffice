<!-- SelectIssuerModal.vue -->
<template>
  <a-modal :open="visible" title="Chọn cơ quan ban hành" width="800px" :footer="null"
    @update:open="emit('update:visible', $event)">
    <!-- Tabs -->
    <div class="flex mb-4 bg-transparent">
      <button class="flex-1 py-2 font-semibold rounded-[20px]" :style="{
        backgroundColor: activeTab === 'external' ? 'var(--primary-color)' : 'white',
        color: activeTab === 'external' ? 'white' : 'black'
      }" @click="activeTab = 'external'">
        Đơn vị bên ngoài
      </button>
      <button class="flex-1 py-2 font-semibold rounded-[20px] " :style="{
        backgroundColor: activeTab === 'internal' ? 'var(--primary-color)' : 'white',
        color: activeTab === 'internal' ? 'white' : 'black'
      }" @click="activeTab = 'internal'">
        Đơn vị nội bộ
      </button>
    </div>

    <!-- Search -->
    <a-input-group compact class="mb-4">
      <a-input 
        v-model:value="searchKeyword" 
        placeholder="Tìm kiếm" 
        allow-clear 
        :style="{
          width: activeTab === 'external' ? 'calc(100% - 100px)' : '100%'
        }" 
      />
      <a-button v-if="activeTab === 'external'" type="primary" style="background-color: var(--primary-color)">Thêm mới</a-button>
    </a-input-group>

    <!-- Bảng dữ liệu -->
    <div class="overflow-x-auto rounded border border-gray-300">
      <!-- DỮ LIỆU NGOÀI -->
      <table v-if="activeTab === 'external'" class="w-full text-sm text-left">
        <thead class="text-white" style="background-color: var(--primary-color)">
          <tr>
            <th class="px-4 py-2">Đơn vị</th>
            <th class="px-4 py-2">Mã định danh</th>
            <th class="px-4 py-2 text-center">Chọn</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(unit, index) in externalData" :key="index" class="border-b hover:bg-gray-100">
            <td class="px-4 py-2">{{ unit.name }}</td>
            <td class="px-4 py-2 text-blue-700 font-medium">{{ unit.code }}</td>
            <td class="px-4 py-2 text-center">
              <input type="radio" name="selectedExternalUnit" :value="unit.code" v-model="selectedCode" />
            </td>
          </tr>
        </tbody>
      </table>

      <!-- DỮ LIỆU NỘI BỘ -->
      <div v-else-if="activeTab === 'internal'" class="max-h-[400px] overflow-y-auto">
        <div class="overflow-x-auto rounded border border-gray-300">
          <table class="w-full text-sm text-left">
            <thead class="text-white" style="background-color: var(--primary-color)">
              <tr>
                <th class="px-4 py-2">Đơn vị</th>
                <th class="px-4 py-2 text-center">Chọn</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="node in internalData" :key="node.id">
                <UnitTree :data="[node]" v-model:selected="selectedCode" />
              </template>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div class="flex justify-end mt-4 gap-4">
      <a-button @click="reset"> Đặt lại </a-button>
      <a-button type="primary" @click="confirm"> Chọn </a-button>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import UnitTree from './UnitTree.vue'

const props = defineProps<{ 
  visible: boolean 
  // selected: string | null 
}>()

const emit = defineEmits<{
  (e: 'update:visible', val: boolean): void
  (e: 'update:selected', val: { type: 'internal' | 'external'; code: string; name: string }): void
}>()


const searchKeyword = ref('')
const activeTab = ref<'internal' | 'external'>('internal')
// const selectedIssuer = ref<string | null>(null) 

const externalData = ref([
  { name: 'UBND xã Đại Thành - Ngã Bảy - Hậu Giang', code: 'H30.32.15' },
  { name: 'Ban An toàn Giao thông tỉnh Đồng Nai', code: 'H19.41' },
  { name: 'Liên đoàn Lao động tỉnh Nghệ An - Tỉnh Nghệ An', code: 'I02.36' },
  {
    name: 'Ban CHQS Thành Phố Biên Hòa (UBND TP. Biên Hòa tỉnh Đồng Nai)',
    code: 'H19.22.55',
  },
  {
    name: 'Ban Quản lý dự án đầu tư xây dựng tỉnh Đồng Nai',
    code: 'H19.39',
  },
  {
    name: 'Thành ủy TP Tuy Hòa - Tỉnh Phú Yên',
    code: '000.00.39.A45',
  },
])

const internalData = ref([
  {
    id: 'bk',
    name: 'Đại học Bách khoa Hà Nội',
    children: [
      { id: 'bgd', name: 'Ban Giám đốc' },
      {
        id: 'hc', name: 'Khối Đơn vị hành chính (12)',
        children: [
          { id: 'vpdh', name: 'Văn phòng Đại học' },
          { id: 'dt', name: 'Ban Đào tạo' },
          { id: 'ns', name: 'Ban Tổ chức - Nhân sự' },
          { id: 'khcn', name: 'Ban Khoa học - Công nghệ' },
          { id: 'tckh', name: 'Ban Tài chính - Kế hoạch' },
          { id: 'csvc', name: 'Ban Cơ sở vật chất' },
          { id: 'ctsv', name: 'Ban Công tác sinh viên' },
          { id: 'ts', name: 'Ban Tuyển sinh - Hướng nghiệp' },
          { id: 'qlcl', name: 'Ban Quản lý chất lượng' },
          { id: 'htdn', name: 'Ban Hợp tác đối ngoại' },
          { id: 'ptht', name: 'Ban Xúc tiến đầu tư và Phát triển hạ tầng' },
          { id: 'ttkt', name: 'Ban Thanh tra, Pháp chế và Kiểm toán nội bộ' },
          { id: 'ttnd', name: 'Ban Thanh tra nhân dân' },
        ]
      }
    ]
  }
])

const selectedCode = ref('')

function reset() {
  selectedCode.value = ''
  emit('update:selected', {
    type: activeTab.value,
    code: '',
    name: ''
  })
}

function confirm() {
  const selectedTab = activeTab.value
  let selectedValue = selectedCode.value
  let selectedName = ''

  if (selectedTab === 'external') {
    const unit = externalData.value.find(u => u.code === selectedValue)
    selectedName = unit?.name ?? ''
  } else {
    const findInTree = (nodes: any[]): any | null => {
      for (const node of nodes) {
        if (node.id === selectedValue) return node
        if (node.children) {
          const found = findInTree(node.children)
          if (found) return found
        }
      }
      return null
    }
    const unit = findInTree(internalData.value)
    selectedName = unit?.name ?? ''
  }

  emit('update:selected', {
    type: selectedTab,      // 'internal' hoặc 'external'
    code: selectedValue,    // id hoặc mã
    name: selectedName      // tên hiển thị
  })

  emit('update:visible', false)
}
</script>

<style></style>