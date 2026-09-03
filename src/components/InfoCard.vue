<script setup lang="ts">
defineProps<{
  title: string
  delay?: number
}>()
</script>

<template>
  <div class="info-card" :style="{ animationDelay: `${delay || 0}ms` }">
    <div class="info-card__header">
      <div class="info-card__icon">
        <slot name="icon" />
      </div>
      <h3 class="info-card__title">{{ title }}</h3>
    </div>
    <div class="info-card__body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.info-card {
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 24px;
  box-shadow: var(--shadow-sm);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.info-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.info-card__header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.info-card__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  flex-shrink: 0;
}

.info-card__title {
  margin: 0;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--gray-800);
}
</style>
