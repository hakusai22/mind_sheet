<template>
  <div class="home">
    <h1>Mind Sheet</h1>
    <p class="subtitle">多功能在线工具集</p>
    
    <div class="feature-cards">
      <NuxtLink to="/excel" class="card">
        <div class="icon">📊</div>
        <h2>Excel 表格</h2>
        <p>在线电子表格，支持公式计算、数据编辑等功能</p>
      </NuxtLink>
      
      <NuxtLink to="/canvas" class="card">
        <div class="icon">🔗</div>
        <h2>节点画布</h2>
        <p>创建节点并建立关联关系，可视化流程图</p>
      </NuxtLink>
      
      <NuxtLink to="/mindmap" class="card">
        <div class="icon">🧠</div>
        <h2>思维导图</h2>
        <p>在线 XMind 风格思维导图编辑器</p>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Mind Sheet - 多功能在线工具'
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

h1 {
  font-size: 3rem;
  color: white;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: rgba(255, 255, 255, 0.8);
  font-size: 1.2rem;
  margin-bottom: 3rem;
}

.feature-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1000px;
  width: 100%;
}

.card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s, box-shadow 0.3s;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
}

.icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.card h2 {
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 0.5rem;
}

.card p {
  color: #666;
  line-height: 1.6;
}
</style>
