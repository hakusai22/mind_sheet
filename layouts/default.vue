<template>
  <div class="layout">
    <nav class="navbar">
      <NuxtLink to="/" class="logo">Mind Sheet</NuxtLink>
      <div class="nav-links">
        <NuxtLink to="/excel">Excel</NuxtLink>
        <NuxtLink to="/canvas">画布</NuxtLink>
        <NuxtLink to="/mindmap">思维导图</NuxtLink>
      </div>
    </nav>
    <main class="main-content">
      <slot />
    </main>
  </div>
</template>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}



.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 2rem;
  height: 60px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: #667eea;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: #666;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: #667eea;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}
</style>
