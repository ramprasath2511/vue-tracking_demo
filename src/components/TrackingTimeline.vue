<script setup lang="ts">
import { computed } from 'vue'
import type { TimelineStep } from '../types/tracking'
import { STATUS_META } from '../constants/tracking'
import Icon from './Icon.vue'

const props = defineProps<{
  steps: TimelineStep[]
  currentStatus: string
}>()

const completedCount = computed(() => props.steps.filter((s) => s.completed).length)
const progressPercent = computed(() => {
  if (props.steps.length === 0) return 0
  return Math.round((completedCount.value / props.steps.length) * 100)
})

function formatTime(timestamp: string | null): string {
  if (!timestamp) return ''
  const dt = new Date(timestamp.replace(' ', 'T'))
  return dt.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(timestamp: string | null): string {
  if (!timestamp) return ''
  const dt = new Date(timestamp.replace(' ', 'T'))
  return dt.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function formatTimeOnly(timestamp: string | null): string {
  if (!timestamp) return ''
  const dt = new Date(timestamp.replace(' ', 'T'))
  return dt.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
  <div class="timeline">
    <div class="timeline__header">
      <span class="timeline__progress-label">{{ completedCount }} of {{ steps.length }} steps</span>
      <span class="timeline__progress-percent">{{ progressPercent }}%</span>
    </div>
    <div class="timeline__progress-track">
      <div
        class="timeline__progress-fill"
        :style="{ width: `${progressPercent}%` }"
      />
    </div>

    <div class="timeline__list">
      <div
        v-for="(step, i) in steps"
        :key="step.key"
        class="timeline-step"
        :class="{
          'timeline-step--completed': step.completed,
          'timeline-step--active': !step.completed && i === completedCount,
          'timeline-step--pending': !step.completed && i !== completedCount,
        }"
        :style="{ animationDelay: `${i * 120}ms` }"
      >
        <div class="timeline-step__line timeline-step__line--top" />
        <div class="timeline-step__line timeline-step__line--bottom" />

        <div class="timeline-step__icon-wrap">
          <div v-if="step.completed" class="timeline-step__pulse" />
          <div class="timeline-step__icon">
            <Icon
              :name="STATUS_META[step.key]?.icon || 'help-circle'"
              :size="20"
            />
          </div>
        </div>

        <div class="timeline-step__content">
          <div class="timeline-step__label">{{ step.label }}</div>
          <p class="timeline-step__desc">{{ step.description }}</p>

          <div v-if="step.completed && step.timestamp" class="timeline-step__meta">
            <span class="timeline-step__date">{{ formatDate(step.timestamp) }}</span>
            <span class="timeline-step__time">{{ formatTimeOnly(step.timestamp) }}</span>
          </div>

          <div v-if="step.driverEta" class="timeline-step__eta">
            <Icon name="clock" :size="14" color="var(--color-primary)" />
            <span>Expected {{ formatTime(step.driverEta.from) }} – {{ formatTimeOnly(step.driverEta.to) }}</span>
          </div>

          <div v-if="!step.completed && i === completedCount" class="timeline-step__pending-badge">
            <span class="timeline-step__pending-dot" />
            In progress
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.timeline {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.timeline__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.timeline__progress-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--gray-600);
}

.timeline__progress-percent {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
}

.timeline__progress-track {
  height: 6px;
  background: var(--gray-100);
  border-radius: 100px;
  overflow: hidden;
}

.timeline__progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-success));
  border-radius: 100px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline__list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-top: 8px;
}

.timeline-step {
  display: flex;
  gap: 20px;
  padding: 8px 0;
  position: relative;
  opacity: 0;
  animation: slideInRight 0.5s ease forwards;
}

.timeline-step__line {
  position: absolute;
  left: 21px;
  width: 2px;
  background: var(--gray-200);
  z-index: 0;
}
.timeline-step__line--top {
  top: -8px;
  height: 28px;
}
.timeline-step__line--bottom {
  top: 36px;
  bottom: -8px;
  height: auto;
}

.timeline-step:first-child .timeline-step__line--top {
  display: none;
}
.timeline-step:last-child .timeline-step__line--bottom {
  display: none;
}

.timeline-step--completed .timeline-step__line--bottom {
  background: var(--color-success);
}

.timeline-step__icon-wrap {
  position: relative;
  z-index: 1;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timeline-step__icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.timeline-step--completed .timeline-step__icon {
  background: var(--color-success);
  color: white;
  box-shadow: 0 2px 8px rgba(5, 150, 105, 0.25);
}

.timeline-step--active .timeline-step__icon {
  background: var(--color-primary);
  color: white;
  box-shadow: 0 2px 12px rgba(37, 99, 235, 0.35);
}

.timeline-step--pending .timeline-step__icon {
  background: var(--gray-100);
  color: var(--gray-400);
}

.timeline-step__pulse {
  position: absolute;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--color-primary);
  animation: pulse-ring 2s ease-out infinite;
}

.timeline-step__content {
  flex: 1;
  padding-bottom: 28px;
}

.timeline-step__label {
  font-size: 1rem;
  font-weight: 600;
  color: var(--gray-800);
  transition: color 0.3s ease;
}

.timeline-step--pending .timeline-step__label {
  color: var(--gray-400);
}

.timeline-step__desc {
  margin: 4px 0 0;
  font-size: 0.875rem;
  color: var(--gray-500);
  line-height: 1.45;
}

.timeline-step--pending .timeline-step__desc {
  color: var(--gray-400);
}

.timeline-step__meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.timeline-step__date {
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--gray-700);
}

.timeline-step__time {
  font-size: 0.8125rem;
  color: var(--gray-500);
  font-family: var(--font-mono);
}

.timeline-step__eta {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  font-size: 0.8125rem;
  color: var(--color-primary);
  font-weight: 500;
}

.timeline-step__pending-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  padding: 4px 12px;
  border-radius: 100px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
}

.timeline-step__pending-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--color-primary);
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.7); }
}
</style>
