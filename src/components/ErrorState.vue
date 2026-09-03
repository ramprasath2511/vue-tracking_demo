<script setup lang="ts">
defineProps<{ message: string; isNotFound?: boolean }>()
</script>

<template>
  <div class="error-state">
    <div class="error-state__icon" :class="{ 'error-state__icon--not-found': isNotFound }">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="m15 9-6 6" v-if="!isNotFound" />
        <path d="m9 9 6 6" v-if="!isNotFound" />
        <path d="M8 12h8" v-if="isNotFound" />
        <path d="M12 8v8" v-if="isNotFound" />
      </svg>
    </div>
    <h3 class="error-state__title">{{ isNotFound ? 'No tracking found' : 'Something went wrong' }}</h3>
    <p class="error-state__message">{{ message }}</p>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 60px 24px;
  animation: fadeInUp 0.4s ease;
}

.error-state__icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-error-light);
  color: var(--color-error);
  margin-bottom: 24px;
}

.error-state__icon--not-found {
  background: var(--gray-100);
  color: var(--gray-500);
}

.error-state__title {
  margin: 0 0 8px;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--gray-800);
}

.error-state__message {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--gray-500);
  max-width: 400px;
  line-height: 1.5;
}
</style>
