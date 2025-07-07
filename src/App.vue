<script setup lang="ts">
import Calendar from "@/components/Calendar.vue";
import Sidebar from "@/components/Sidebar.vue";
import Header from "@/components/Header.vue";
</script>

<template>
  <Sidebar />
  <Header />

  <main class="main-content">
    <section class="calendar-section">
      <h1 class="main-title">Calendar</h1>
      <Calendar />
    </section>
  </main>
</template>

<style scoped>
  .main-content {
    margin-left: 220px;
    margin-top: 60px;
  }

  .calendar-section {
    padding: 0 75px 103px;
    background-color: #F0F0F7;
  }

  .main-title {
    margin-bottom: 32px;
    padding-top: 32px;
  }

</style>

