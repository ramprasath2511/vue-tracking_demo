<script setup lang="ts">
</script>

<template>
  <div class="loading">
    <div class="loading__card">
      <div class="loading__hero skeleton" />
      <div class="loading__grid">
        <div class="loading__col">
          <div class="loading__card-item skeleton" />
          <div class="loading__card-item skeleton" />
        </div>
        <div class="loading__col">
          <div class="loading__card-item skeleton" />
          <div class="loading__card-item skeleton" />
          <div class="loading__card-item skeleton" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.loading {
  width: 100%;
  max-width: 960px;
  margin: 0 auto;
  animation: fadeIn 0.3s ease;
}

.loading__hero {
  height: 180px;
  border-radius: var(--radius-xl);
}

.loading__grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
  margin-top: 24px;
}

.loading__col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.loading__card-item {
  height: 220px;
  border-radius: var(--radius-lg);
}

.loading__col:last-child .loading__card-item:last-child {
  height: 180px;
}

@media (max-width: 900px) {
  .loading__grid {
    grid-template-columns: 1fr;
  }
}
</style>
