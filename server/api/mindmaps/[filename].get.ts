import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  let filename = getRouterParam(event, 'filename')
  
  if (!filename) {
    throw createError({
      statusCode: 400,
      message: '缺少文件名'
    })
  }
  
  // URL 解码文件名
  filename = decodeURIComponent(filename)
  
  const storageDir = join(process.cwd(), 'storage', 'mindmaps')
  const filePath = join(storageDir, filename)
  
  // 安全检查：确保文件路径在存储目录内
  if (!filePath.startsWith(storageDir)) {
    throw createError({
      statusCode: 403,
      message: '无权访问该文件'
    })
  }
  
  if (!existsSync(filePath)) {
    throw createError({
      statusCode: 404,
      message: '文件不存在'
    })
  }
  
  const content = await readFile(filePath, 'utf-8')
  
  return {
    filename,
    content: JSON.parse(content)
  }
})
