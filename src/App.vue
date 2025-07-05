<script setup lang="ts">
import Calendar from "@/components/Calendar.vue";
</script>

<template>
  <header>
  </header>

  <main>
    <section class="calendar-section">
      <h1 class="main-title">Calendar</h1>
      <Calendar />
    </section>
  </main>
</template>

<style scoped>
  .calendar-section {
    background-color: #F0F0F7;
    padding: 100px 75px;
  }

  .main-title {
    margin: 32px 0;
  }

</style>

