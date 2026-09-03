<script setup lang="ts">
import Icon from './Icon.vue'

defineProps<{
  photoUrl: string | null
  name: string
  deliveries: number
  rating: number
}>()
</script>

<template>
  <div class="driver">
    <div class="driver__avatar">
      <img v-if="photoUrl" :src="photoUrl" :alt="name" class="driver__avatar-img" />
      <Icon v-else name="user" :size="28" color="var(--gray-400)" />
    </div>
    <div class="driver__info">
      <span class="driver__label">Your courier</span>
      <span class="driver__name">{{ name }}</span>
      <div class="driver__stats">
        <span class="driver__stat">
          <Icon name="package" :size="14" color="var(--gray-500)" />
          {{ deliveries }} deliveries
        </span>
        <span v-if="rating > 0" class="driver__stat">
          <Icon name="star" :size="14" color="#f59e0b" />
          {{ rating.toFixed(1) }}
        </span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.driver {
  display: flex;
  align-items: center;
  gap: 16px;
}

.driver__avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: var(--gray-100);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
  border: 2px solid var(--gray-200);
}

.driver__avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.driver__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.driver__label {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--gray-500);
}

.driver__name {
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--gray-800);
}

.driver__stats {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-top: 4px;
}

.driver__stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  color: var(--gray-600);
  font-weight: 500;
}
</style>
