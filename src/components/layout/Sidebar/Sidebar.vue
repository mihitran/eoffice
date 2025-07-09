<script lang="ts" setup>
import TitleSubItem from '@/components/common/TitleSubItem/TitleSubItem.vue';
import './sidebar.css'
import TitleHeader from '@/components/common/TitleHeader/TitleHeader.vue';
const dashboardIcon = `
  M6.50059 14.0002L10.7006 9.8002L13.7006 12.8002L17.3006 9.2002
  M4.4 21.2C3.07451 21.2 2 20.1255 2 18.8V4.4C2 3.07452 3.07452 2 4.4 2H18.8
  C20.1255 2 21.2 3.07452 21.2 4.4V18.8C21.2 20.1255 20.1255 21.2 18.8 21.2H4.4Z`
</script>

<template>
  <div class="nav_list">
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Dashboard" :has-dropdown="false" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Tìm kiếm văn bản" :has-dropdown="false" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Văn bản đến" :has-dropdown="true">
      <!-- Nội dung dropdown con -->
      <TitleSubItem to="/indocument/create" :iconPath="dashboardIcon" text="Nhập văn bản đến giấy" :has-dropdown="false" />
      <TitleSubItem to="/indocument/internet-add-book" :iconPath="dashboardIcon" text="Nhập văn bản đến nội bộ" :has-dropdown="false" />
    </TitleHeader>

    <TitleHeader to="/" :iconPath="dashboardIcon" text="Văn bản đi" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Văn bản nội bộ" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Công việc" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Hồ sơ công việc" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Quản lý đăng ký xe" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Văn thư" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Quản lý ký số" :has-dropdown="true" />
    <TitleHeader to="/" :iconPath="dashboardIcon" text="Hệ thống eDiploma" :has-dropdown="false" />
  </div>
</template>
