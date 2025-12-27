import { readBody } from 'h3'
import { writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join } from 'path'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { filename, content, type } = body
  
  if (!filename || !content) {
    throw createError({
      statusCode: 400,
      message: '缺少文件名或内容'
    })
  }
  
  // 存储目录
  const storageDir = join(process.cwd(), 'storage', 'mindmaps')
  
  // 确保目录存在
  if (!existsSync(storageDir)) {
    await mkdir(storageDir, { recursive: true })
  }
  
  // 生成安全的文件名
  const timestamp = Date.now()
  const safeName = filename.replace(/[^a-zA-Z0-9\u4e00-\u9fa5._-]/g, '_')
  const ext = type === 'xmind' ? '.xmind.json' : '.json'
  const finalName = `${safeName.replace(/\.(xmind|json)$/i, '')}_${timestamp}${ext}`
  
  const filePath = join(storageDir, finalName)
  
  // 写入文件
  await writeFile(filePath, JSON.stringify(content, null, 2), 'utf-8')
  
  return {
    success: true,
    filename: finalName,
    message: '文件保存成功'
  }
})
