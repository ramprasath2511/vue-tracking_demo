<script setup lang="ts">
import { computed } from 'vue'
import type { DeliveryStatus } from '../types/tracking'
import { STATUS_META } from '../constants/tracking'
import Icon from './Icon.vue'

const props = defineProps<{ status: DeliveryStatus; size?: 'sm' | 'md' | 'lg' }>()

const meta = computed(() => STATUS_META[props.status] ?? STATUS_META['status-unknown'])
const sizeClass = computed(() => `badge--${props.size || 'md'}`)
</script>

<template>
  <div class="badge" :class="sizeClass" :style="{ color: meta.color, backgroundColor: meta.bgColor }">
    <span class="badge__dot" :style="{ backgroundColor: meta.color }" />
    <Icon :name="meta.icon" :size="size === 'sm' ? 14 : 18" />
    <span class="badge__label">{{ meta.title }}</span>
  </div>
</template>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  border-radius: 100px;
  white-space: nowrap;
}

.badge--sm {
  padding: 4px 12px;
  font-size: 0.8125rem;
}
.badge--md {
  padding: 8px 16px;
  font-size: 0.9375rem;
}
.badge--lg {
  padding: 10px 20px;
  font-size: 1.0625rem;
}

.badge__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(0.85); }
}
</style>
