import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async () => {
  const storageDir = join(process.cwd(), 'storage', 'mindmaps')
  
  // 如果目录不存在，返回空列表
  if (!existsSync(storageDir)) {
    return []
  }
  
  const files = await readdir(storageDir)
  const jsonFiles = files.filter(f => f.endsWith('.json'))
  
  // 获取文件详细信息
  const fileList = await Promise.all(
    jsonFiles.map(async (filename) => {
      const filePath = join(storageDir, filename)
      const fileStat = await stat(filePath)
      
      // 解析文件名获取原始名称
      const isXmind = filename.includes('.xmind.json')
      const displayName = filename
        .replace(/_\d+\.xmind\.json$/, '')
        .replace(/_\d+\.json$/, '')
      
      return {
        filename,
        displayName,
        type: isXmind ? 'xmind' : 'json',
        size: fileStat.size,
        createdAt: fileStat.birthtime,
        modifiedAt: fileStat.mtime
      }
    })
  )
  
  // 按修改时间倒序排列
  fileList.sort((a, b) => new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime())
  
  return fileList
})
