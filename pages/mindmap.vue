<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col">
    <!-- 工具栏 -->
    <div class="bg-white border-b shadow-sm px-4 py-3">
      <div class="flex flex-wrap items-center gap-4">
        <!-- 节点操作 -->
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">节点操作</span>
          <div class="flex gap-1.5">
            <Button size="sm" @click="addChild">
              <Plus class="w-4 h-4" />
              子节点
            </Button>
            <Button size="sm" @click="addSibling">
              <Plus class="w-4 h-4" />
              同级
            </Button>
            <Button size="sm" variant="destructive" @click="removeNode">
              <Trash2 class="w-4 h-4" />
              删除
            </Button>
            <Button size="sm" variant="outline" @click="editNode">
              <Pencil class="w-4 h-4" />
              编辑
            </Button>
          </div>
        </div>

        <div class="w-px h-10 bg-border hidden sm:block" />

        <!-- 视图 -->
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">视图</span>
          <div class="flex gap-1.5">
            <Button size="sm" variant="outline" @click="toCenter">
              <Target class="w-4 h-4" />
              居中
            </Button>
            <select 
              v-model="currentTheme" 
              @change="changeTheme"
              class="h-8 px-3 text-sm rounded-md border border-input bg-background hover:bg-accent cursor-pointer"
            >
              <option value="default">🎨 默认</option>
              <option value="dark">🌙 暗色</option>
              <option value="latenight">🌃 深夜</option>
              <option value="colorful">🌈 彩色</option>
              <option value="green">🌿 绿色</option>
              <option value="purple">💜 紫色</option>
              <option value="pink">🌸 粉色</option>
            </select>
          </div>
        </div>

        <div class="w-px h-10 bg-border hidden sm:block" />

        <!-- 文件 -->
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">文件</span>
          <div class="flex gap-1.5 flex-wrap">
            <Button size="sm" @click="showSaveDialog">
              <Save class="w-4 h-4" />
              保存
            </Button>
            <Button size="sm" variant="secondary" @click="exportData">
              <Download class="w-4 h-4" />
              导出
            </Button>
            <Button size="sm" variant="secondary" @click="showPathViewer">
              <Eye class="w-4 h-4" />
              路径
            </Button>
            <Button size="sm" variant="outline" @click="triggerImportXMind">
              <FileUp class="w-4 h-4" />
              XMind
            </Button>
            <Button size="sm" variant="outline" @click="triggerImportJSON">
              <FileJson class="w-4 h-4" />
              JSON
            </Button>
            <Button size="sm" variant="outline" @click="showFileList">
              <FolderOpen class="w-4 h-4" />
              文件
            </Button>
            <input ref="xmindFileInput" type="file" accept=".xmind" class="hidden" @change="importXMindFile" />
            <input ref="jsonFileInput" type="file" accept=".json" class="hidden" @change="importJSONFile" />
          </div>
        </div>

        <div class="w-px h-10 bg-border hidden sm:block" />

        <!-- 插入 -->
        <div class="flex flex-col gap-1">
          <span class="text-xs font-medium text-muted-foreground uppercase tracking-wide">插入</span>
          <div class="flex gap-1.5">
            <Button size="sm" variant="secondary" @click="openVariableSelector">
              <AtSign class="w-4 h-4" />
              变量
            </Button>
          </div>
        </div>
      </div>
    </div>

    <!-- 提示栏 -->
    <div class="bg-blue-50 border-b border-blue-100 px-4 py-2">
      <div class="flex items-center gap-2 text-sm text-blue-700">
        <Lightbulb class="w-4 h-4" />
        <span>快捷键：<kbd class="px-1.5 py-0.5 text-xs bg-white border rounded">Tab</kbd> 子节点 | 
        <kbd class="px-1.5 py-0.5 text-xs bg-white border rounded">Enter</kbd> 同级 | 
        <kbd class="px-1.5 py-0.5 text-xs bg-white border rounded">Delete</kbd> 删除 | 
        <kbd class="px-1.5 py-0.5 text-xs bg-white border rounded">空格+@</kbd> 插入变量 | 双击编辑</span>
      </div>
    </div>

    <!-- 思维导图容器 -->
    <div class="flex-1 m-4">
      <div class="bg-white rounded-xl shadow-lg overflow-hidden h-full min-h-[600px]">
        <ClientOnly>
          <div ref="mindMapContainer" id="mind-map" class="w-full h-full"></div>
        </ClientOnly>
      </div>
    </div>

    <!-- 保存对话框 -->
    <Dialog v-model:open="saveDialogVisible">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Save class="w-5 h-5" />
            保存思维导图
          </DialogTitle>
        </DialogHeader>
        <div class="space-y-4 py-4">
          <div class="space-y-2">
            <label class="text-sm font-medium">文件名称</label>
            <Input v-model="saveFileName" placeholder="输入文件名称..." @keyup.enter="saveCurrentMindmap" />
            <p class="text-xs text-muted-foreground">留空则使用根节点名称</p>
          </div>
          <div class="bg-muted/50 rounded-lg p-3 space-y-2">
            <p class="text-xs font-medium text-muted-foreground uppercase">预览</p>
            <div class="space-y-1 text-sm">
              <div class="flex items-center gap-2">
                <span>🌳</span>
                <span>根节点：{{ currentRootTopic }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>📊</span>
                <span>节点数量：{{ currentNodeCount }}</span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="closeSaveDialog">取消</Button>
          <Button @click="saveCurrentMindmap" :disabled="saving">
            <Loader2 v-if="saving" class="w-4 h-4 animate-spin" />
            {{ saving ? '保存中...' : '保存' }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 文件列表对话框 -->
    <Dialog v-model:open="fileListVisible">
      <DialogContent class="sm:max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <FolderOpen class="w-5 h-5" />
            已保存的思维导图
            <Badge variant="secondary" class="ml-2">{{ savedFiles.length }} 个文件</Badge>
          </DialogTitle>
        </DialogHeader>
        <div class="py-4">
          <div v-if="loadingFiles" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <Loader2 class="w-8 h-8 animate-spin mb-2" />
            <p>加载中...</p>
          </div>
          <div v-else-if="savedFiles.length === 0" class="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <FolderOpen class="w-12 h-12 mb-2 opacity-50" />
            <p>还没有保存的文件</p>
            <p class="text-xs mt-1">导入 XMind 或 JSON 文件后会自动保存到这里</p>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
            <Card 
              v-for="file in savedFiles" 
              :key="file.filename"
              class="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
              @click="loadSavedFile(file.filename)"
            >
              <CardContent class="p-4 flex items-center gap-3">
                <div class="text-2xl">{{ file.type === 'xmind' ? '🧠' : '📄' }}</div>
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">{{ file.displayName }}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <Badge :variant="file.type === 'xmind' ? 'warning' : 'secondary'" class="text-xs">
                      {{ file.type === 'xmind' ? 'XMind' : 'JSON' }}
                    </Badge>
                    <span class="text-xs text-muted-foreground">{{ formatDate(file.modifiedAt) }}</span>
                  </div>
                </div>
                <Button 
                  size="icon-sm" 
                  variant="ghost" 
                  @click.stop="deleteSavedFile(file.filename)"
                  class="opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive"
                >
                  <Trash2 class="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" @click="refreshFileList">
            <RefreshCw class="w-4 h-4" />
            刷新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- 路径查看器对话框 -->
    <Dialog v-model:open="pathViewerVisible">
      <DialogContent class="sm:max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <Eye class="w-5 h-5" />
            路径数据预览
            <Badge variant="secondary" class="ml-2">{{ pathData.length }} 条记录</Badge>
          </DialogTitle>
        </DialogHeader>
        <div class="flex items-center gap-3 py-2 flex-wrap">
          <Input 
            v-model="pathSearchKeyword" 
            placeholder="🔍 搜索路径..."
            class="flex-1 min-w-[200px]"
          />
          <select 
            v-model="pathViewMode" 
            class="h-9 px-3 text-sm rounded-md border border-input bg-background"
          >
            <option value="table">📊 表格</option>
            <option value="tree">🌳 树形</option>
            <option value="json">📄 JSON</option>
          </select>
          <div class="flex gap-1.5">
            <Button size="sm" variant="outline" @click="expandAllNodes" title="展开所有节点">
              <ChevronsDownUp class="w-4 h-4" />
              全部展开
            </Button>
            <Button size="sm" variant="outline" @click="collapseAllNodes" title="收起所有节点">
              <ChevronsUpDown class="w-4 h-4" />
              全部收起
            </Button>
          </div>
          <div class="flex gap-1.5">
            <Button size="sm" variant="outline" @click="copyPathData">
              <Copy class="w-4 h-4" />
              复制
            </Button>
            <Button size="sm" @click="downloadPathData">
              <Download class="w-4 h-4" />
              下载
            </Button>
          </div>
        </div>
        <div class="overflow-auto max-h-96 border rounded-lg">
          <!-- 表格视图 -->
          <table v-if="pathViewMode === 'table'" class="w-full text-sm">
            <thead class="bg-muted/50 sticky top-0">
              <tr>
                <th class="text-left p-3 font-medium">#</th>
                <th class="text-left p-3 font-medium">节点名称</th>
                <th class="text-left p-3 font-medium">完整路径</th>
                <th class="text-left p-3 font-medium">深度</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in filteredPathData" :key="item.id" class="border-t hover:bg-muted/30">
                <td class="p-3 text-muted-foreground">{{ index + 1 }}</td>
                <td class="p-3 font-medium">{{ item.topic }}</td>
                <td class="p-3">
                  <div class="flex flex-wrap gap-1">
                    <span 
                      v-for="(seg, i) in item.path" 
                      :key="i"
                      class="inline-flex items-center"
                    >
                      <Badge :variant="i === item.path.length - 1 ? 'default' : 'outline'" class="text-xs">
                        {{ seg }}
                      </Badge>
                      <span v-if="i < item.path.length - 1" class="mx-1 text-muted-foreground">›</span>
                    </span>
                  </div>
                </td>
                <td class="p-3">
                  <Badge variant="secondary">{{ item.depth }}</Badge>
                </td>
              </tr>
            </tbody>
          </table>
          <!-- 树形视图 -->
          <div v-else-if="pathViewMode === 'tree'" class="p-4 font-mono text-sm space-y-2">
            <div v-for="(item, index) in filteredPathData" :key="item.id" class="border-b pb-2">
              <span class="text-muted-foreground">{{ index + 1 }}.</span>
              <div v-for="(seg, i) in item.path" :key="i" :style="{ marginLeft: i * 20 + 'px' }">
                <span class="text-muted-foreground">{{ i === item.path.length - 1 ? '└─' : '├─' }}</span>
                <span :class="i === item.path.length - 1 ? 'text-primary font-semibold' : ''">{{ seg }}</span>
              </div>
            </div>
          </div>
          <!-- JSON视图 -->
          <pre v-else class="p-4 bg-slate-900 text-slate-100 text-xs overflow-auto">{{ JSON.stringify({
            exportTime: new Date().toISOString(),
            rootTopic: pathData[0]?.path[0] || '',
            totalRecords: filteredPathData.length,
            records: filteredPathData
          }, null, 2) }}</pre>
        </div>
      </DialogContent>
    </Dialog>

    <!-- 变量/工具选择器弹窗 -->
    <Dialog v-model:open="variableSelectorVisible">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="flex items-center gap-2">
            <AtSign class="w-5 h-5" />
            插入变量/工具
          </DialogTitle>
        </DialogHeader>
        <div class="py-2">
          <Input 
            v-model="variableSearchKeyword" 
            placeholder="搜索变量或工具..."
            class="mb-3"
            ref="variableSearchInput"
            @keydown="handleVariableKeydown"
          />
          <div class="space-y-1 max-h-64 overflow-y-auto">
            <div 
              v-for="(category, catIndex) in filteredVariables" 
              :key="category.name"
              class="mb-3"
            >
              <div class="text-xs font-medium text-muted-foreground uppercase mb-2 px-2">
                {{ category.icon }} {{ category.name }}
              </div>
              <div 
                v-for="(item, itemIndex) in category.items" 
                :key="item.value"
                @click="insertVariable(item)"
                :class="[
                  'flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors',
                  selectedVariableIndex === getGlobalIndex(catIndex, itemIndex) 
                    ? 'bg-primary text-primary-foreground' 
                    : 'hover:bg-muted'
                ]"
              >
                <span class="text-lg">{{ item.icon }}</span>
                <div class="flex-1">
                  <div class="font-medium text-sm">{{ item.label }}</div>
                  <div :class="[
                    'text-xs',
                    selectedVariableIndex === getGlobalIndex(catIndex, itemIndex)
                      ? 'text-primary-foreground/70'
                      : 'text-muted-foreground'
                  ]">{{ item.description }}</div>
                </div>
                <Badge variant="outline" class="text-xs font-mono">{{ item.value }}</Badge>
              </div>
            </div>
            <div v-if="filteredVariables.length === 0" class="text-center py-8 text-muted-foreground">
              <span class="text-2xl">🔍</span>
              <p class="mt-2">没有找到匹配的变量</p>
            </div>
          </div>
        </div>
        <DialogFooter class="text-xs text-muted-foreground">
          <span>使用 <kbd class="px-1 py-0.5 bg-muted rounded">↑↓</kbd> 选择，<kbd class="px-1 py-0.5 bg-muted rounded">Enter</kbd> 确认</span>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import JSZip from 'jszip'
import { 
  Plus, Trash2, Pencil, Target, Save, Download, Eye, 
  FileUp, FileJson, FolderOpen, Lightbulb, Copy, RefreshCw,
  Loader2, ChevronsDownUp, ChevronsUpDown, AtSign
} from 'lucide-vue-next'

// Shadcn components
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import { Card, CardContent } from '~/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '~/components/ui/dialog'

definePageMeta({
  layout: 'default'
})

useHead({
  title: '思维导图 - Mind Sheet'
})

const mindMapContainer = ref<HTMLElement | null>(null)
const xmindFileInput = ref<HTMLInputElement | null>(null)
const jsonFileInput = ref<HTMLInputElement | null>(null)
const currentTheme = ref('default')

// 路径查看器相关
const pathViewerVisible = ref(false)
const pathData = ref<any[]>([])
const pathSearchKeyword = ref('')
const pathViewMode = ref<'table' | 'tree' | 'json'>('table')

// 文件列表相关
const fileListVisible = ref(false)
const savedFiles = ref<any[]>([])
const loadingFiles = ref(false)

// 保存对话框相关
const saveDialogVisible = ref(false)
const saveFileName = ref('')
const saving = ref(false)

// 变量选择器相关
const variableSelectorVisible = ref(false)
const variableSearchKeyword = ref('')
const variableSearchInput = ref<HTMLInputElement | null>(null)
const selectedVariableIndex = ref(0)
let lastKeyWasSpace = false

// 变量/工具定义
const variableCategories = [
  {
    name: '日期时间',
    icon: '📅',
    items: [
      { icon: '📆', label: '当前日期', value: '{{date}}', description: '插入当前日期 YYYY-MM-DD' },
      { icon: '🕐', label: '当前时间', value: '{{time}}', description: '插入当前时间 HH:mm:ss' },
      { icon: '📅', label: '日期时间', value: '{{datetime}}', description: '完整日期时间' },
      { icon: '📆', label: '年份', value: '{{year}}', description: '当前年份' },
      { icon: '📅', label: '月份', value: '{{month}}', description: '当前月份' },
      { icon: '📅', label: '星期', value: '{{weekday}}', description: '当前星期几' },
    ]
  },
  {
    name: '用户信息',
    icon: '👤',
    items: [
      { icon: '👤', label: '用户名', value: '{{user}}', description: '当前用户名称' },
      { icon: '📧', label: '邮箱', value: '{{email}}', description: '用户邮箱地址' },
      { icon: '🏢', label: '部门', value: '{{department}}', description: '所属部门' },
    ]
  },
  {
    name: '项目信息',
    icon: '📁',
    items: [
      { icon: '📁', label: '项目名', value: '{{project}}', description: '当前项目名称' },
      { icon: '🔢', label: '版本号', value: '{{version}}', description: '项目版本号' },
      { icon: '🏷️', label: '标签', value: '{{tag}}', description: '版本标签' },
    ]
  },
  {
    name: '状态标记',
    icon: '🎯',
    items: [
      { icon: '✅', label: '已完成', value: '✅', description: '标记为已完成' },
      { icon: '⏳', label: '进行中', value: '⏳', description: '标记为进行中' },
      { icon: '❌', label: '已取消', value: '❌', description: '标记为已取消' },
      { icon: '⚠️', label: '注意', value: '⚠️', description: '需要注意的内容' },
      { icon: '🔥', label: '紧急', value: '🔥', description: '紧急/重要事项' },
      { icon: '💡', label: '想法', value: '💡', description: '灵感/想法' },
      { icon: '❓', label: '疑问', value: '❓', description: '待确认的问题' },
      { icon: '📌', label: '重点', value: '📌', description: '重点关注' },
    ]
  },
  {
    name: '优先级',
    icon: '🎖️',
    items: [
      { icon: '🔴', label: 'P0 最高', value: '[P0]', description: '最高优先级' },
      { icon: '🟠', label: 'P1 高', value: '[P1]', description: '高优先级' },
      { icon: '🟡', label: 'P2 中', value: '[P2]', description: '中等优先级' },
      { icon: '🟢', label: 'P3 低', value: '[P3]', description: '低优先级' },
    ]
  },
  {
    name: '链接模板',
    icon: '🔗',
    items: [
      { icon: '🔗', label: '链接', value: '[链接文字](url)', description: 'Markdown 链接' },
      { icon: '📎', label: '附件', value: '📎 附件: ', description: '附件引用' },
      { icon: '📝', label: '文档', value: '📝 文档: ', description: '文档引用' },
    ]
  },
]

// 过滤后的变量列表
const filteredVariables = computed(() => {
  if (!variableSearchKeyword.value) return variableCategories
  
  const keyword = variableSearchKeyword.value.toLowerCase()
  return variableCategories
    .map(category => ({
      ...category,
      items: category.items.filter(item => 
        item.label.toLowerCase().includes(keyword) ||
        item.value.toLowerCase().includes(keyword) ||
        item.description.toLowerCase().includes(keyword)
      )
    }))
    .filter(category => category.items.length > 0)
})

// 获取全局索引（用于键盘导航）
const getGlobalIndex = (catIndex: number, itemIndex: number): number => {
  let index = 0
  for (let i = 0; i < catIndex; i++) {
    index += filteredVariables.value[i]?.items.length || 0
  }
  return index + itemIndex
}

// 获取所有可选项的总数
const getTotalItems = computed(() => {
  return filteredVariables.value.reduce((sum, cat) => sum + cat.items.length, 0)
})

// 根据全局索引获取对应的变量项
const getItemByGlobalIndex = (globalIndex: number) => {
  let currentIndex = 0
  for (const category of filteredVariables.value) {
    for (const item of category.items) {
      if (currentIndex === globalIndex) return item
      currentIndex++
    }
  }
  return null
}

// 当前思维导图信息
const currentRootTopic = computed(() => {
  if (!mind) return '未加载'
  try {
    const data = mind.getData()
    return data?.nodeData?.topic || '未命名'
  } catch {
    return '未命名'
  }
})

const currentNodeCount = computed(() => {
  if (!mind) return 0
  try {
    const data = mind.getData()
    return countNodes(data?.nodeData)
  } catch {
    return 0
  }
})

// 递归计算节点数量
const countNodes = (node: any): number => {
  if (!node) return 0
  let count = 1
  if (node.children) {
    for (const child of node.children) {
      count += countNodes(child)
    }
  }
  return count
}

// 过滤后的路径数据
const filteredPathData = computed(() => {
  if (!pathSearchKeyword.value) return pathData.value
  const keyword = pathSearchKeyword.value.toLowerCase()
  return pathData.value.filter(item => 
    item.topic.toLowerCase().includes(keyword) ||
    item.pathString.toLowerCase().includes(keyword)
  )
})

let mind: any = null
let MindElixirClass: any = null

// 格式化日期
const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)} 分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)} 小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)} 天前`
  
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

// 主题配置 - 仿官网多彩风格
const themes: Record<string, any> = {
  default: {
    name: 'default',
    // 彩虹色调色板 - 每个分支一个颜色
    palette: ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'],
    cssVar: {
      '--main-color': '#374151',
      '--main-bgcolor': '#ffffff',
      '--color': '#4b5563',
      '--bgcolor': '#f5f5f5',
      '--selected': '#667eea',
      '--line-color': '#94a3b8',
      '--line-width': '3px',
    },
  },
  dark: {
    name: 'dark',
    palette: ['#a78bfa', '#60a5fa', '#34d399', '#fbbf24', '#f87171', '#f472b6', '#22d3ee', '#a3e635', '#fb923c', '#818cf8'],
    cssVar: {
      '--main-color': '#f3f4f6',
      '--main-bgcolor': '#374151',
      '--color': '#d1d5db',
      '--bgcolor': '#1f2937',
      '--selected': '#818cf8',
      '--line-color': '#6b7280',
      '--line-width': '3px',
    },
  },
  latenight: {
    name: 'latenight',
    palette: ['#93c5fd', '#c4b5fd', '#6ee7b7', '#fcd34d', '#fca5a5', '#f9a8d4', '#67e8f9', '#bef264', '#fdba74', '#a5b4fc'],
    cssVar: {
      '--main-color': '#f9fafb',
      '--main-bgcolor': '#1e40af',
      '--color': '#e5e7eb',
      '--bgcolor': '#1e3a5f',
      '--selected': '#60a5fa',
      '--line-color': '#3b82f6',
      '--line-width': '3px',
    },
  },
  colorful: {
    name: 'colorful',
    palette: ['#f472b6', '#fb923c', '#facc15', '#4ade80', '#22d3ee', '#a78bfa', '#fb7185', '#34d399', '#fbbf24', '#60a5fa'],
    cssVar: {
      '--main-color': '#1f2937',
      '--main-bgcolor': '#ffffff',
      '--color': '#374151',
      '--bgcolor': '#fef3c7',
      '--selected': '#f472b6',
      '--line-color': '#f472b6',
      '--line-width': '3px',
    },
  },
  green: {
    name: 'green',
    palette: ['#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#22c55e', '#84cc16', '#34d399', '#2dd4bf', '#38bdf8', '#4ade80'],
    cssVar: {
      '--main-color': '#065f46',
      '--main-bgcolor': '#ffffff',
      '--color': '#1f2937',
      '--bgcolor': '#ecfdf5',
      '--selected': '#10b981',
      '--line-color': '#34d399',
      '--line-width': '3px',
    },
  },
  purple: {
    name: 'purple',
    palette: ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f472b6', '#c084fc', '#e879f9', '#f0abfc', '#6366f1', '#818cf8'],
    cssVar: {
      '--main-color': '#581c87',
      '--main-bgcolor': '#ffffff',
      '--color': '#1f2937',
      '--bgcolor': '#faf5ff',
      '--selected': '#8b5cf6',
      '--line-color': '#a855f7',
      '--line-width': '3px',
    },
  },
  pink: {
    name: 'pink',
    palette: ['#ec4899', '#f472b6', '#fb7185', '#f43f5e', '#e11d48', '#be185d', '#db2777', '#c026d3', '#a855f7', '#f97316'],
    cssVar: {
      '--main-color': '#831843',
      '--main-bgcolor': '#ffffff',
      '--color': '#1f2937',
      '--bgcolor': '#fdf2f8',
      '--selected': '#ec4899',
      '--line-color': '#f472b6',
      '--line-width': '3px',
    },
  },
}

onMounted(async () => {
  if (!import.meta.client) return
  
  await nextTick()
  
  if (!mindMapContainer.value) {
    console.error('容器不存在')
    return
  }
  
  try {
    // 动态导入 mind-elixir
    MindElixirClass = (await import('mind-elixir')).default
    
    const options = {
      el: mindMapContainer.value,
      direction: MindElixirClass.SIDE,
      draggable: true,
      contextMenu: true,
      toolBar: true,
      nodeMenu: true,
      keypress: true,
      locale: 'zh_CN',
      theme: themes.default,
    }
    
    mind = new MindElixirClass(options)
    
    // 使用 MindElixir.new() 创建初始数据
    const data = MindElixirClass.new('中心主题')
    mind.init(data)
    
    // 添加全局键盘监听
    document.addEventListener('keydown', handleGlobalKeydown)
    
    console.log('Mind Elixir 初始化成功')
  } catch (error) {
    console.error('Mind Elixir 初始化失败:', error)
  }
})

onUnmounted(() => {
  // 移除全局键盘监听
  document.removeEventListener('keydown', handleGlobalKeydown)
  mind = null
  MindElixirClass = null
})

const addChild = () => {
  if (mind) {
    // 如果没有选中节点，先选中根节点
    if (!mind.currentNode) {
      const root = mind.nodeData
      if (root && MindElixirClass) {
        const rootEl = MindElixirClass.E(root.id)
        if (rootEl) {
          mind.selectNode(rootEl)
        }
      }
    }
    mind.addChild()
  }
}

const addSibling = () => {
  if (mind) {
    if (!mind.currentNode) {
      alert('请先点击选中一个节点')
      return
    }
    mind.insertSibling()
  }
}

const removeNode = () => {
  if (mind) {
    if (!mind.currentNode) {
      alert('请先点击选中一个节点')
      return
    }
    mind.removeNode()
  }
}

const editNode = () => {
  if (mind) {
    if (!mind.currentNode) {
      alert('请先点击选中一个节点')
      return
    }
    mind.beginEdit()
  }
}

const toCenter = () => {
  if (mind) {
    mind.toCenter()
  }
}

const changeTheme = () => {
  if (mind && themes[currentTheme.value]) {
    mind.changeTheme(themes[currentTheme.value])
  }
}

// 递归设置所有节点的展开状态
const setAllNodesExpanded = (node: any, expanded: boolean) => {
  if (node.children && node.children.length > 0) {
    node.expanded = expanded
    node.children.forEach((child: any) => setAllNodesExpanded(child, expanded))
  }
}

// 展开所有节点
const expandAllNodes = () => {
  if (mind) {
    const data = mind.getData()
    if (data && data.nodeData) {
      setAllNodesExpanded(data.nodeData, true)
      mind.refresh(data)
    }
  }
}

// 收起所有节点
const collapseAllNodes = () => {
  if (mind) {
    const data = mind.getData()
    if (data && data.nodeData) {
      // 保持根节点展开，收起其他所有节点
      if (data.nodeData.children) {
        data.nodeData.children.forEach((child: any) => {
          setAllNodesExpanded(child, false)
        })
      }
      mind.refresh(data)
    }
  }
}

// ===== 变量选择器相关函数 =====

// 打开变量选择器
const openVariableSelector = () => {
  variableSelectorVisible.value = true
  variableSearchKeyword.value = ''
  selectedVariableIndex.value = 0
  nextTick(() => {
    variableSearchInput.value?.focus()
  })
}

// 处理变量选择器键盘事件
const handleVariableKeydown = (e: KeyboardEvent) => {
  const total = getTotalItems.value
  if (total === 0) return
  
  switch (e.key) {
    case 'ArrowDown':
      e.preventDefault()
      selectedVariableIndex.value = (selectedVariableIndex.value + 1) % total
      break
    case 'ArrowUp':
      e.preventDefault()
      selectedVariableIndex.value = (selectedVariableIndex.value - 1 + total) % total
      break
    case 'Enter':
      e.preventDefault()
      const selectedItem = getItemByGlobalIndex(selectedVariableIndex.value)
      if (selectedItem) {
        insertVariable(selectedItem)
      }
      break
    case 'Escape':
      variableSelectorVisible.value = false
      break
  }
}

// 插入变量到当前选中的节点
const insertVariable = (item: { icon: string; label: string; value: string; description: string }) => {
  if (!mind) {
    console.log('mind 实例不存在')
    return
  }
  
  const selectedNode = mind.currentNode
  console.log('当前选中的节点:', selectedNode)
  
  if (selectedNode) {
    // 解析变量值
    let insertValue = item.value
    const now = new Date()
    
    // 替换日期时间变量
    insertValue = insertValue
      .replace('{{date}}', now.toISOString().split('T')[0])
      .replace('{{time}}', now.toTimeString().split(' ')[0])
      .replace('{{datetime}}', now.toLocaleString('zh-CN'))
      .replace('{{year}}', String(now.getFullYear()))
      .replace('{{month}}', String(now.getMonth() + 1).padStart(2, '0'))
      .replace('{{weekday}}', ['日', '一', '二', '三', '四', '五', '六'][now.getDay()])
    
    // 获取节点数据对象
    const nodeObj = selectedNode.nodeObj
    if (!nodeObj) {
      console.log('节点数据对象不存在')
      return
    }
    
    // 在节点文字后追加变量
    const currentTopic = nodeObj.topic || ''
    const newTopic = currentTopic.endsWith(' ') 
      ? currentTopic + insertValue 
      : currentTopic + ' ' + insertValue
    
    console.log('更新节点内容:', currentTopic, '->', newTopic)
    
    // 使用 reshapeNode 更新节点
    mind.reshapeNode(selectedNode, { topic: newTopic })
  } else {
    console.log('没有选中任何节点，请先点击选中一个节点')
  }
  
  variableSelectorVisible.value = false
}

// 监听全局键盘事件（空格+@）
const handleGlobalKeydown = (e: KeyboardEvent) => {
  // 如果弹窗已打开，不处理
  if (variableSelectorVisible.value || saveDialogVisible.value || 
      fileListVisible.value || pathViewerVisible.value) {
    return
  }
  
  // 检测空格
  if (e.code === 'Space' || e.key === ' ') {
    lastKeyWasSpace = true
    // 设置超时重置，避免空格和@之间间隔太长
    setTimeout(() => {
      lastKeyWasSpace = false
    }, 1000)
    return
  }
  
  // 检测 @ 键（Shift+2）
  if (e.key === '@' && lastKeyWasSpace) {
    e.preventDefault()
    e.stopPropagation()
    lastKeyWasSpace = false
    openVariableSelector()
    return
  }
  
  // 其他按键重置空格状态
  if (e.key !== 'Shift') {
    lastKeyWasSpace = false
  }
}

// 监听搜索关键词变化，重置选中索引
watch(variableSearchKeyword, () => {
  selectedVariableIndex.value = 0
})

const exportData = () => {
  if (mind) {
    const data = mind.getData()
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindmap-data.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}

// 递归收集所有叶子节点路径
const collectLeafPaths = (node: any, currentPath: string[] = []): any[] => {
  const newPath = [...currentPath, node.topic]
  
  // 如果没有子节点，这是一个叶子节点
  if (!node.children || node.children.length === 0) {
    return [{
      id: node.id,
      topic: node.topic,
      path: newPath,
      pathString: newPath.join(' > '),
      depth: newPath.length,
      // 可以添加更多需要的字段
    }]
  }
  
  // 如果有子节点，递归处理
  const results: any[] = []
  for (const child of node.children) {
    results.push(...collectLeafPaths(child, newPath))
  }
  return results
}

// 导出路径数据 - 每个叶子节点作为一条数据
const exportPathData = () => {
  if (mind) {
    const data = mind.getData()
    const nodeData = data.nodeData
    
    // 收集所有叶子节点的路径
    const leafPaths = collectLeafPaths(nodeData)
    
    // 构建导出数据
    const exportResult = {
      exportTime: new Date().toISOString(),
      rootTopic: nodeData.topic,
      totalRecords: leafPaths.length,
      records: leafPaths
    }
    
    const blob = new Blob([JSON.stringify(exportResult, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'mindmap-paths.json'
    a.click()
    URL.revokeObjectURL(url)
  }
}

// 显示路径查看器
const showPathViewer = () => {
  if (mind) {
    const data = mind.getData()
    pathData.value = collectLeafPaths(data.nodeData)
    pathViewerVisible.value = true
    pathSearchKeyword.value = ''
  }
}

// 关闭路径查看器
const closePathViewer = () => {
  pathViewerVisible.value = false
}

// 下载路径数据
const downloadPathData = () => {
  const exportResult = {
    exportTime: new Date().toISOString(),
    rootTopic: pathData.value[0]?.path[0] || '',
    totalRecords: filteredPathData.value.length,
    records: filteredPathData.value
  }
  
  const blob = new Blob([JSON.stringify(exportResult, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'mindmap-paths.json'
  a.click()
  URL.revokeObjectURL(url)
}

// 复制路径数据
const copyPathData = async () => {
  const exportResult = {
    exportTime: new Date().toISOString(),
    rootTopic: pathData.value[0]?.path[0] || '',
    totalRecords: filteredPathData.value.length,
    records: filteredPathData.value
  }
  
  try {
    await navigator.clipboard.writeText(JSON.stringify(exportResult, null, 2))
    alert('已复制到剪贴板！')
  } catch (err) {
    console.error('复制失败:', err)
    alert('复制失败，请手动复制')
  }
}

// 将 XMind 节点转换为 mind-elixir 格式
const convertXMindNode = (xmindNode: any, isRoot = false): any => {
  const node: any = {
    topic: xmindNode.title || '未命名节点',
    id: xmindNode.id || MindElixirClass.generateUUID(),
  }
  
  // 处理子节点
  const children: any[] = []
  
  // XMind 的子节点可能在 children.attached 或直接在 children
  if (xmindNode.children) {
    if (xmindNode.children.attached) {
      // XMind 8 / Zen 格式
      xmindNode.children.attached.forEach((child: any) => {
        children.push(convertXMindNode(child))
      })
    } else if (Array.isArray(xmindNode.children)) {
      // 其他格式
      xmindNode.children.forEach((child: any) => {
        children.push(convertXMindNode(child))
      })
    }
  }
  
  if (children.length > 0) {
    node.children = children
    // 默认展开所有节点，用户可以手动收缩
    node.expanded = true
  }
  
  return node
}

// 解析 XMind 文件
const parseXMindFile = async (file: File): Promise<any> => {
  const zip = new JSZip()
  const contents = await zip.loadAsync(file)
  
  // XMind 文件中的主要数据在 content.json
  const contentFile = contents.file('content.json')
  if (!contentFile) {
    throw new Error('无法找到 content.json，这可能不是有效的 XMind 文件')
  }
  
  const contentText = await contentFile.async('text')
  const xmindData = JSON.parse(contentText)
  
  // XMind 文件可能包含多个画布，我们取第一个
  if (!Array.isArray(xmindData) || xmindData.length === 0) {
    throw new Error('XMind 文件数据格式无效')
  }
  
  const sheet = xmindData[0]
  const rootTopic = sheet.rootTopic
  
  if (!rootTopic) {
    throw new Error('找不到根节点')
  }
  
  // 转换为 mind-elixir 格式
  const nodeData = convertXMindNode(rootTopic, true)
  
  return {
    nodeData,
    linkData: {}
  }
}

const triggerImportXMind = () => {
  xmindFileInput.value?.click()
}

const triggerImportJSON = () => {
  jsonFileInput.value?.click()
}

// 保存文件到服务器
const saveFileToServer = async (filename: string, content: any, type: 'xmind' | 'json') => {
  try {
    await $fetch('/api/mindmaps/upload', {
      method: 'POST',
      body: { filename, content, type }
    })
  } catch (error) {
    console.error('保存文件失败:', error)
  }
}

const importXMindFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const data = await parseXMindFile(file)
    if (mind && data) {
      mind.refresh(data)
      
      // 保存到服务器
      await saveFileToServer(file.name, data, 'xmind')
      
      alert('导入成功！文件已保存')
    }
  } catch (error: any) {
    console.error('导入失败:', error)
    alert('导入失败: ' + (error.message || '请检查文件格式是否正确'))
  }
  input.value = ''
}

const importJSONFile = async (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  try {
    const content = await file.text()
    const data = JSON.parse(content)
    
    if (!data.nodeData || !data.nodeData.topic) {
      throw new Error('无效的思维导图 JSON 数据格式')
    }
    
    if (mind && data) {
      mind.refresh(data)
      
      // 保存到服务器
      await saveFileToServer(file.name, data, 'json')
      
      alert('导入成功！文件已保存')
    }
  } catch (error: any) {
    console.error('导入失败:', error)
    alert('导入失败: ' + (error.message || '请检查文件格式是否正确'))
  }
  input.value = ''
}

// 显示文件列表
const showFileList = async () => {
  fileListVisible.value = true
  await refreshFileList()
}

// 关闭文件列表
const closeFileList = () => {
  fileListVisible.value = false
}

// 显示保存对话框
const showSaveDialog = () => {
  if (!mind) {
    alert('请先创建或导入思维导图')
    return
  }
  saveFileName.value = ''
  saveDialogVisible.value = true
}

// 关闭保存对话框
const closeSaveDialog = () => {
  saveDialogVisible.value = false
  saveFileName.value = ''
}

// 保存当前思维导图
const saveCurrentMindmap = async () => {
  if (!mind) return
  
  saving.value = true
  try {
    const data = mind.getData()
    const filename = saveFileName.value.trim() || data.nodeData?.topic || '未命名思维导图'
    
    await $fetch('/api/mindmaps/upload', {
      method: 'POST',
      body: { 
        filename: `${filename}.json`, 
        content: data, 
        type: 'json' 
      }
    })
    
    closeSaveDialog()
    alert('保存成功！')
  } catch (error: any) {
    console.error('保存失败:', error)
    alert('保存失败: ' + (error.message || '请稍后重试'))
  } finally {
    saving.value = false
  }
}

// 刷新文件列表
const refreshFileList = async () => {
  loadingFiles.value = true
  try {
    savedFiles.value = await $fetch('/api/mindmaps/list')
  } catch (error) {
    console.error('获取文件列表失败:', error)
    savedFiles.value = []
  } finally {
    loadingFiles.value = false
  }
}

// 加载已保存的文件
const loadSavedFile = async (filename: string) => {
  try {
    const encodedFilename = encodeURIComponent(filename)
    const response = await $fetch<{ filename: string; content: any }>(`/api/mindmaps/${encodedFilename}`)
    if (mind && response.content) {
      mind.refresh(response.content)
      closeFileList()
      alert('加载成功！')
    }
  } catch (error: any) {
    console.error('加载文件失败:', error)
    alert('加载失败: ' + (error.message || '请检查文件是否存在'))
  }
}

// 删除已保存的文件
const deleteSavedFile = async (filename: string) => {
  if (!confirm('确定要删除这个文件吗？')) return
  
  try {
    const encodedFilename = encodeURIComponent(filename)
    await $fetch(`/api/mindmaps/${encodedFilename}`, { method: 'DELETE' })
    await refreshFileList()
  } catch (error: any) {
    console.error('删除文件失败:', error)
    alert('删除失败: ' + (error.message || '请稍后重试'))
  }
}
</script>

<style>
/* mind-elixir 全局样式覆盖 */
#mind-map {
  width: 100% !important;
  height: 100% !important;
}

/* 思维导图容器背景 - 浅灰色 */
.mind-elixir {
  background: #f5f5f5 !important;
}

/* 根节点样式 - 深色圆角矩形 */
me-root > me-wrapper > me-parent > t {
  background: #3d4451 !important;
  border-radius: 12px !important;
  padding: 18px 32px !important;
  font-size: 20px !important;
  font-weight: 600 !important;
  color: #ffffff !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15) !important;
  border: none !important;
}

/* 一级子节点样式 - 白色背景+彩色边框 */
me-main > me-wrapper > me-parent > t {
  background: #ffffff !important;
  border-radius: 20px !important;
  padding: 10px 20px !important;
  font-size: 14px !important;
  font-weight: 500 !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06) !important;
  border: 2px solid currentColor !important;
}

/* 二级及更深节点 - 简洁样式 */
me-main me-wrapper me-parent t {
  background: transparent !important;
  border: none !important;
  padding: 6px 12px !important;
  font-size: 14px !important;
  border-radius: 4px !important;
  box-shadow: none !important;
}

/* 选中状态 */
t.selected {
  outline: 2px solid #667eea !important;
  outline-offset: 2px !important;
  background: #f0f4ff !important;
}

/* 连接线样式 - 更粗更圆滑 */
.mind-elixir svg path {
  stroke-width: 3px !important;
  stroke-linecap: round !important;
}

/* 展开/收缩按钮 */
me-parent > t > .expanded,
me-parent > t > .collapsed {
  background: #667eea !important;
  color: white !important;
  border-radius: 50% !important;
  width: 20px !important;
  height: 20px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 11px !important;
  font-weight: bold !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2) !important;
  cursor: pointer !important;
  transition: transform 0.15s ease !important;
  border: none !important;
}

me-parent > t > .expanded:hover,
me-parent > t > .collapsed:hover {
  transform: scale(1.15) !important;
}

/* 节点悬停效果 */
me-parent > t:hover {
  filter: brightness(0.97) !important;
}

/* 节点编辑状态 */
me-parent > t > input,
me-parent > t > textarea {
  border-radius: 6px !important;
  padding: 8px 12px !important;
  border: 2px solid #667eea !important;
  outline: none !important;
  font-size: inherit !important;
  background: white !important;
}

/* 右键菜单样式 */
.mind-elixir-toolbar,
#cm {
  background: white !important;
  border-radius: 12px !important;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
  border: 1px solid #e5e7eb !important;
  padding: 6px !important;
  min-width: 150px !important;
}

#cm div {
  padding: 8px 14px !important;
  border-radius: 6px !important;
  margin: 2px 0 !important;
  font-size: 13px !important;
  cursor: pointer !important;
  transition: background 0.1s ease !important;
  color: #374151 !important;
}

#cm div:hover {
  background: #f3f4f6 !important;
}

/* 左侧工具栏 */
.mind-elixir-toolbar {
  border-radius: 10px !important;
  padding: 8px 4px !important;
}

.mind-elixir-toolbar span {
  border-radius: 6px !important;
  padding: 8px !important;
  margin: 2px !important;
  transition: background 0.15s ease !important;
}

.mind-elixir-toolbar span:hover {
  background: #f3f4f6 !important;
}
</style>
