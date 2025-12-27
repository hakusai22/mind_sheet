<template>
  <div class="excel-page">
    <div class="toolbar">
      <button @click="addRow">➕ 添加行</button>
      <button @click="addColumn">➕ 添加列</button>
      <button @click="exportData">📥 导出</button>
      <button @click="clearData">🗑️ 清空</button>
    </div>
    <div class="spreadsheet-container">
      <ClientOnly>
        <div ref="hotContainer" class="hot-container"></div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

definePageMeta({
  layout: 'default'
})

useHead({
  title: 'Excel 表格 - Mind Sheet'
})

const hotContainer = ref<HTMLElement | null>(null)
let hotInstance: any = null

// 初始数据
const initialData = [
  ['', 'A', 'B', 'C', 'D', 'E'],
  ['1', '', '', '', '', ''],
  ['2', '', '', '', '', ''],
  ['3', '', '', '', '', ''],
  ['4', '', '', '', '', ''],
  ['5', '', '', '', '', ''],
  ['6', '', '', '', '', ''],
  ['7', '', '', '', '', ''],
  ['8', '', '', '', '', ''],
  ['9', '', '', '', '', ''],
  ['10', '', '', '', '', ''],
]

onMounted(async () => {
  if (import.meta.client && hotContainer.value) {
    const { default: Handsontable } = await import('handsontable')
    await import('handsontable/dist/handsontable.full.min.css')
    
    hotInstance = new Handsontable(hotContainer.value, {
      data: initialData,
      rowHeaders: true,
      colHeaders: true,
      width: '100%',
      height: '100%',
      licenseKey: 'non-commercial-and-evaluation',
      contextMenu: true,
      manualColumnResize: true,
      manualRowResize: true,
      formulas: false,
      autoWrapRow: true,
      autoWrapCol: true,
      minRows: 20,
      minCols: 10,
      mergeCells: true,
      comments: true,
      undo: true,
      copyPaste: true,
      fillHandle: true,
      stretchH: 'all',
    })
  }
})

onUnmounted(() => {
  if (hotInstance) {
    hotInstance.destroy()
  }
})

const addRow = () => {
  if (hotInstance) {
    hotInstance.alter('insert_row_below')
  }
}

const addColumn = () => {
  if (hotInstance) {
    hotInstance.alter('insert_col_end')
  }
}

const exportData = () => {
  if (hotInstance) {
    const data = hotInstance.getData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'spreadsheet-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}

const clearData = () => {
  if (hotInstance && confirm('确定要清空所有数据吗？')) {
    hotInstance.loadData(initialData)
  }
}
</script>

<style scoped>
.excel-page {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f5f5;
}

.toolbar {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border-bottom: 1px solid #e5e5e5;
}

.toolbar button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.toolbar button:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.spreadsheet-container {
  flex: 1;
  padding: 1rem;
  overflow: hidden;
}

.hot-container {
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
