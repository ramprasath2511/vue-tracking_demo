<script setup lang="ts">
import { computed } from 'vue'
import type { DeliveryViewModel } from '../types/tracking'
import { STATUS_META, ACTIVE_STATUSES } from '../constants/tracking'
import StatusBadge from './StatusBadge.vue'
import TrackingTimeline from './TrackingTimeline.vue'
import MapView from './MapView.vue'
import DriverCard from './DriverCard.vue'
import InfoCard from './InfoCard.vue'
import Icon from './Icon.vue'

const props = defineProps<{ delivery: DeliveryViewModel }>()

const statusMeta = computed(() => STATUS_META[props.delivery.status] ?? STATUS_META['status-unknown'])
const isDelivered = computed(() => props.delivery.status === 'delivered')
const isActive = computed(() => ACTIVE_STATUSES.includes(props.delivery.status))

function formatTime(timestamp: string | null): string {
  if (!timestamp) return '—'
  const dt = new Date(timestamp.replace(' ', 'T'))
  return dt.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function formatDate(date: string): string {
  const dt = new Date(date + 'T00:00:00')
  return dt.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

const fullAddress = computed(() => {
  const lines = props.delivery.address.lines
  return lines.join(', ')
})

</script>

<template>
  <div class="result">
    <!-- Hero header -->
    <section class="result__hero" :class="{ 'result__hero--delivered': isDelivered, 'result__hero--active': isActive }">
      <div class="result__hero-bg" />
      <div class="result__hero-content">
        <div class="result__hero-top">
          <div class="result__brand">
            <img v-if="delivery.sender.logoUrl" :src="delivery.sender.logoUrl" :alt="delivery.sender.name" class="result__brand-logo" />
            <div v-else class="result__brand-placeholder">
              <Icon name="building" :size="20" />
            </div>
            <span class="result__brand-name">{{ delivery.sender.name }}</span>
          </div>
          <StatusBadge :status="delivery.status" size="lg" />
        </div>

        <h1 class="result__title">{{ statusMeta.title }}</h1>
        <p class="result__subtitle">{{ statusMeta.description }}</p>

        <div class="result__meta-bar">
          <div class="result__meta-item">
            <Icon name="package" :size="16" />
            <div>
              <span class="result__meta-label">Tracking ID</span>
              <span class="result__meta-value result__meta-value--mono">{{ delivery.code }}</span>
            </div>
          </div>
          <div class="result__meta-item">
            <Icon name="calendar" :size="16" />
            <div>
              <span class="result__meta-label">Delivery date</span>
              <span class="result__meta-value">{{ formatDate(delivery.fulfilmentDate) }}</span>
            </div>
          </div>
          <div v-if="delivery.deliveredAt" class="result__meta-item">
            <Icon name="check-circle" :size="16" />
            <div>
              <span class="result__meta-label">Delivered at</span>
              <span class="result__meta-value">{{ formatTime(delivery.deliveredAt) }}</span>
            </div>
          </div>
          <div v-else-if="delivery.driverEta" class="result__meta-item">
            <Icon name="clock" :size="16" />
            <div>
              <span class="result__meta-label">Expected arrival</span>
              <span class="result__meta-value">{{ formatTime(delivery.driverEta.from) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Main content grid -->
    <div class="result__grid">
      <!-- Left column: timeline -->
      <div class="result__col result__col--main">
        <InfoCard title="Tracking Progress" :delay="100">
          <template #icon><Icon name="truck" :size="20" /></template>
          <TrackingTimeline :steps="delivery.timeline" :current-status="delivery.status" />
        </InfoCard>

        <InfoCard title="Delivery Location" :delay="200">
          <template #icon><Icon name="map-pin" :size="20" /></template>
          <MapView
            :latitude="delivery.address.latitude"
            :longitude="delivery.address.longitude"
            :label="fullAddress"
          />
          <div class="result__address">
            <Icon name="home" :size="18" color="var(--gray-500)" />
            <div>
              <p class="result__address-text">{{ fullAddress }}</p>
              <p class="result__address-postcode">{{ delivery.address.postcode }}</p>
            </div>
          </div>
        </InfoCard>
      </div>

      <!-- Right column: details -->
      <div class="result__col result__col--side">
        <InfoCard v-if="delivery.driver" title="Courier" :delay="150">
          <template #icon><Icon name="user" :size="20" /></template>
          <DriverCard
            :photo-url="delivery.driver.photoUrl"
            :name="delivery.driver.name"
            :deliveries="delivery.driver.deliveries"
            :rating="delivery.driver.rating"
          />
        </InfoCard>

        <InfoCard title="Recipient" :delay="250">
          <template #icon><Icon name="user" :size="20" /></template>
          <div class="result__details">
            <div class="result__detail-row">
              <Icon name="user" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Name</span>
                <span class="result__detail-value">{{ delivery.recipient.contactName }}</span>
              </div>
            </div>
            <div class="result__detail-row">
              <Icon name="phone" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Phone</span>
                <span class="result__detail-value">{{ delivery.recipient.phoneNumber }}</span>
              </div>
            </div>
            <div class="result__detail-row">
              <Icon name="mail" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Email</span>
                <span class="result__detail-value result__detail-value--truncate">{{ delivery.recipient.email }}</span>
              </div>
            </div>
            <div v-if="delivery.recipient.companyName" class="result__detail-row">
              <Icon name="building" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Company</span>
                <span class="result__detail-value">{{ delivery.recipient.companyName }}</span>
              </div>
            </div>
          </div>
        </InfoCard>

        <InfoCard title="Delivery Info" :delay="350">
          <template #icon><Icon name="file-check" :size="20" /></template>
          <div class="result__details">
            <div class="result__detail-row">
              <Icon name="map-pin" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Instructions</span>
                <span class="result__detail-value">{{ delivery.instruction || 'Standard delivery' }}</span>
              </div>
            </div>
            <div v-if="delivery.instructionDetails" class="result__detail-row">
              <Icon name="file-check" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Details</span>
                <span class="result__detail-value">{{ delivery.instructionDetails }}</span>
              </div>
            </div>
            <div class="result__detail-row">
              <Icon name="calendar" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Fulfilment date</span>
                <span class="result__detail-value">{{ formatDate(delivery.fulfilmentDate) }}</span>
              </div>
            </div>
            <div v-if="delivery.attemptedAt" class="result__detail-row">
              <Icon name="clock" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Last attempt</span>
                <span class="result__detail-value">{{ formatTime(delivery.attemptedAt) }}</span>
              </div>
            </div>
            <div class="result__detail-row">
              <Icon name="clock" :size="16" color="var(--gray-400)" />
              <div>
                <span class="result__detail-label">Time zone</span>
                <span class="result__detail-value">{{ delivery.timeZone }}</span>
              </div>
            </div>
          </div>
        </InfoCard>

        <a :href="delivery.webTrackingUrl" target="_blank" rel="noopener" class="result__web-link">
          <Icon name="external-link" :size="18" />
          Open web tracking page
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.result {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Hero */
.result__hero {
  position: relative;
  border-radius: var(--radius-xl);
  padding: 36px 36px 32px;
  overflow: hidden;
  color: white;
  opacity: 0;
  animation: fadeInUp 0.6s ease forwards;
}

.result__hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%);
  z-index: 0;
}

.result__hero--delivered .result__hero-bg {
  background: linear-gradient(135deg, var(--color-success) 0%, #047857 100%);
}

.result__hero--active .result__hero-bg {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
}

.result__hero-content {
  position: relative;
  z-index: 1;
}

.result__hero-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.result__brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result__brand-logo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  background: white;
}

.result__brand-placeholder {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
}

.result__brand-name {
  font-size: 0.9375rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
}

.result__title {
  margin: 0;
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.15;
}

.result__subtitle {
  margin: 8px 0 0;
  font-size: 1.0625rem;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.5;
}

.result__meta-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
}

.result__meta-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.result__meta-item > :first-child {
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.result__meta-item div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.result__meta-label {
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 500;
}

.result__meta-value {
  font-size: 0.9375rem;
  font-weight: 600;
  color: white;
}

.result__meta-value--mono {
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

/* Grid */
.result__grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 24px;
}

.result__col {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* Address */
.result__address {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-top: 16px;
  padding: 14px 16px;
  background: var(--gray-50);
  border-radius: var(--radius-md);
}

.result__address-text {
  margin: 0;
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--gray-700);
}

.result__address-postcode {
  margin: 2px 0 0;
  font-size: 0.8125rem;
  color: var(--gray-500);
  font-family: var(--font-mono);
}

/* Detail rows */
.result__details {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.result__detail-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.result__detail-row > :first-child {
  flex-shrink: 0;
  margin-top: 1px;
}

.result__detail-row div {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.result__detail-label {
  font-size: 0.75rem;
  color: var(--gray-500);
  font-weight: 500;
}

.result__detail-value {
  font-size: 0.9375rem;
  color: var(--gray-800);
  font-weight: 500;
  word-break: break-word;
}

.result__detail-value--truncate {
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Web link */
.result__web-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  color: var(--color-primary);
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
}

.result__web-link:hover {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

/* Responsive */
@media (max-width: 900px) {
  .result__grid {
    grid-template-columns: 1fr;
  }
  .result__hero {
    padding: 28px 24px;
  }
  .result__title {
    font-size: 1.625rem;
  }
  .result__meta-bar {
    gap: 20px;
  }
}

@media (max-width: 560px) {
  .result__hero-top {
    flex-direction: column;
    align-items: flex-start;
  }
  .result__meta-bar {
    flex-direction: column;
    gap: 16px;
  }
  .result__title {
    font-size: 1.375rem;
  }
}
</style>
