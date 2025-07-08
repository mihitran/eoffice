<script setup lang="ts">
import Header from '@/components/layout/Header/Header.vue';
import Sidebar from '@/components/layout/Sidebar/Sidebar.vue';
</script>

<template>
  <div class="layout-container">
    <Header />
    <div class="layout-content">
      <Sidebar />
      <main>
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100vw;
}

/* Bố cục body nằm dưới header, chia 2 cột */
.layout-content {
  background-color: #F5F5F5;
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Main content nằm bên phải */
main {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  background-color: #f5f5f5;
}
</style>
