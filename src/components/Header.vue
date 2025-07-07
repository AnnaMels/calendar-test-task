<template>
  <header class="header">
    <div class="input-wrapper">
      <img width="16" height="16" class="search-icon" src="@/assets/images/search.png" alt="Loupe">
      <input class="search" type="text" placeholder="Search transactions, invoices or help">
    </div>
    <div class="actions">
      <ul class="action-icons">
        <li class="action-item">
          <img width="16" height="16" src="@/assets/images/help.png" alt="Help center" />
        </li>
        <li class="action-item">
          <img width="16" height="18" src="@/assets/images/message.png" alt="Message Bubble" />
        </li>
        <li class="action-item">
          <img width="16" height="18" src="@/assets/images/bell.png" alt="Bell" />
        </li>
      </ul>
      <div class="profile-block">
        <span class="avatar">John Doe</span>
        <img class="arrow-icon" width="11" height="7" src="@/assets/images/arrow.png" alt="Arrow" />
        <img width="38" height="38" src="@/assets/images/avatar.png" alt="Avatar" />
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  background-color: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 20px;
  border-bottom: 1px solid #EAEAEA;
  position: fixed;
  top: 0;
  left: 260px;
  right: 0;
  z-index: 10;
}

.input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search {
  min-width: 300px;
  font-size: 13px;
  color: #4D4F5C;
  border: none;
}

.search::placeholder {
  font-size: 13px;
}

.actions {
  display: flex;
  align-items: center;
}

.action-icons {
  display: flex;
  align-items: center;
  gap: 30px;
}

.action-icons::after {
  content: '';
  display: inline-block;
  width: 1px;
  height: 28px;
  background-color: #EBEBF2;
}

.profile-block {
  display: flex;
  align-items: center;
}

.avatar {
  margin-left: 20px;
  margin-right: 15px;
}

.arrow-icon {
  margin-right: 11px;
}

</style>
<script setup lang="ts">
</script>
