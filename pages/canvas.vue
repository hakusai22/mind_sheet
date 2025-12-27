<template>
  <div class="canvas-page">
    <div class="toolbar">
      <button @click="addNode">➕ 添加节点</button>
      <button @click="clearCanvas">🗑️ 清空画布</button>
      <button @click="fitView">🔍 适应视图</button>
      <button @click="exportCanvas">📥 导出</button>
    </div>
    <div class="canvas-container">
      <ClientOnly>
        <VueFlow
          v-model:nodes="nodes"
          v-model:edges="edges"
          :default-viewport="{ zoom: 1 }"
          :min-zoom="0.2"
          :max-zoom="4"
          fit-view-on-init
          @connect="onConnect"
          @node-drag-stop="onNodeDragStop"
        >
          <Background pattern-color="#aaa" :gap="16" />
          <Controls />
          <MiniMap />
          
          <template #node-custom="{ data }">
            <div class="custom-node" :style="{ background: data.color }">
              <input 
                v-model="data.label" 
                class="node-input"
                @click.stop
              />
              <button class="delete-btn" @click.stop="deleteNode(data.id)">×</button>
            </div>
          </template>
        </VueFlow>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'
import type { Node, Edge, Connection } from '@vue-flow/core'

import '@vue-flow/core/dist/style.css'
import '@vue-flow/core/dist/theme-default.css'
import '@vue-flow/controls/dist/style.css'
import '@vue-flow/minimap/dist/style.css'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '节点画布 - Mind Sheet'
})

const { fitView } = useVueFlow()

const nodeColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe', '#43e97b']
let nodeId = 0

const nodes = ref<Node[]>([
  {
    id: '1',
    type: 'custom',
    position: { x: 250, y: 100 },
    data: { id: '1', label: '开始节点', color: '#667eea' },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 100, y: 250 },
    data: { id: '2', label: '处理A', color: '#764ba2' },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 400, y: 250 },
    data: { id: '3', label: '处理B', color: '#f5576c' },
  },
])

const edges = ref<Edge[]>([
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
])

nodeId = 3

const addNode = () => {
  nodeId++
  const id = String(nodeId)
  const color = nodeColors[Math.floor(Math.random() * nodeColors.length)]
  
  nodes.value.push({
    id,
    type: 'custom',
    position: { 
      x: Math.random() * 400 + 100, 
      y: Math.random() * 300 + 100 
    },
    data: { id, label: `节点 ${nodeId}`, color },
  })
}

const deleteNode = (id: string) => {
  nodes.value = nodes.value.filter(n => n.id !== id)
  edges.value = edges.value.filter(e => e.source !== id && e.target !== id)
}

const onConnect = (connection: Connection) => {
  if (connection.source && connection.target) {
    edges.value.push({
      id: `e${connection.source}-${connection.target}`,
      source: connection.source,
      target: connection.target,
      animated: true,
    })
  }
}

const onNodeDragStop = () => {
  // 可以在这里保存节点位置
}

const clearCanvas = () => {
  if (confirm('确定要清空画布吗？')) {
    nodes.value = []
    edges.value = []
    nodeId = 0
  }
}

const exportCanvas = () => {
  const data = {
    nodes: nodes.value,
    edges: edges.value,
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'canvas-data.json'
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<style scoped>
.canvas-page {
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

.canvas-container {
  flex: 1;
  margin: 1rem;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-node {
  padding: 10px 15px;
  border-radius: 8px;
  color: white;
  min-width: 120px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.node-input {
  background: transparent;
  border: none;
  color: white;
  font-size: 14px;
  width: 100%;
  outline: none;
}

.node-input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.delete-btn {
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: rgba(255, 255, 255, 0.4);
}
</style>
