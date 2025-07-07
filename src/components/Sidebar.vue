<template>
  <aside class="sidebar">
    <div class="logo">IMPEKABLE</div>
    <nav class="nav">
      <ul>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
          <img width="16" height="16" src="@/assets/images/home.png" alt="Home">
          Home
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/dashboard.png" alt="Dashboard">
            Dashboard
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/envelop.png" alt="Envelop">
            Inbox
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/product.png" alt="Products">
            Products
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/invoice.png" alt="Invoices">
            Invoices
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/customer.png" alt="Customers">
            Customers
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/chat.png" alt="Chat Room">
            Chat Room
          </a>
        </li>
        <li class="sidebar-item active">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/calendar-img.png" alt="Calendar">
            Calendar
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/help-center.png" alt="Help Center">
            Help Center
          </a>
        </li>
        <li class="sidebar-item">
          <a class="sidebar-link" href="#">
            <img width="16" height="16" src="@/assets/images/settings.png" alt="Settings">
            Settings
          </a>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  top: 0;
  width: 260px;
  height: 100vh;
  background-color: #43425D;
  color: #FFF;
  display: flex;
  flex-direction: column;
}

.logo {
  padding: 25px 20px;
  font-size: 15px;
  font-weight: bold;
  letter-spacing: 3px;
  background-color: #3c3b53;
}

.sidebar-item {
  padding: 23px 25px;
}

.sidebar-item.active {
  position: relative;
  background-color: #3c3b53;
}

.sidebar-item.active::before {
  content: '';
  position: absolute;
  display: inline-block;
  top: 0;
  left: 0;
  width: 5px;
  height: 66px;
  background-color: #A3A0FB;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: 11px;
}

.nav ul {
  list-style: none;
  padding: 0;
}

.nav a {
  color: #FFF;
  text-decoration: none;
}

.nav a:hover {
  background-color: #3c3b53;
}
</style>
<script setup lang="ts">
</script>
