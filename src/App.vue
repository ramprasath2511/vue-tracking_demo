<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getDeliveryByCode } from './api/tracking'
import type { DeliveryViewModel } from './types/tracking'
import TrackingSearch from './components/TrackingSearch.vue'
import TrackingResult from './components/TrackingResult.vue'
import LoadingState from './components/LoadingState.vue'
import ErrorState from './components/ErrorState.vue'
import Icon from './components/Icon.vue'

const trackingCode = ref('')
const delivery = ref<DeliveryViewModel | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const isNotFound = ref(false)
const searchRef = ref<InstanceType<typeof TrackingSearch> | null>(null)
const hasSearched = ref(false)

async function handleSearch() {
  const code = trackingCode.value.trim()
  if (!code) return

  loading.value = true
  error.value = null
  isNotFound.value = false
  delivery.value = null
  hasSearched.value = true

  try {
    delivery.value = await getDeliveryByCode(code)
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'An unexpected error occurred.'
    error.value = msg
    isNotFound.value = msg.includes('not found') || msg.includes('No delivery')
  } finally {
    loading.value = false
  }
}

function handleReset() {
  trackingCode.value = ''
  delivery.value = null
  error.value = null
  isNotFound.value = false
  hasSearched.value = false
  searchRef.value?.resetValidation()
}

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const code = params.get('code')
  if (code) {
    trackingCode.value = code
    handleSearch()
  }
})

watch(trackingCode, () => {
  if (error.value) {
    error.value = null
    isNotFound.value = false
  }
})
</script>

<template>
  <div class="app">
    <!-- Header -->
    <header class="header">
      <div class="header__inner">
        <div class="header__brand" @click="handleReset">
          <div class="header__logo">
            <Icon name="truck" :size="22" />
          </div>
          <span class="header__name">TrackIT</span>
        </div>
      </div>
    </header>

    <!-- Hero section with search -->
    <section class="hero" :class="{ 'hero--compact': hasSearched && (delivery || loading || error) }">
      <div class="hero__bg-grid" />
      <div class="hero__bg-glow" />
      <div class="hero__content">
        <template v-if="!hasSearched">
          <h1 class="hero__title">
            Track your delivery
            <span class="hero__title-accent">in real time</span>
          </h1>
          <p class="hero__subtitle">
            Enter your tracking code to see live status, delivery timeline,
            courier details, and proof of delivery — all in one place.
          </p>
        </template>
        <template v-else>
          <h2 class="hero__title hero__title--sm">Track another delivery</h2>
        </template>

        <TrackingSearch
          ref="searchRef"
          v-model="trackingCode"
          :loading="loading"
          :error="error"
          @submit="handleSearch"
        />

        <div v-if="!hasSearched" class="hero__example">
          <button class="hero__example-btn" @click="trackingCode = 'RE4E7M7H-36519-99252919'; handleSearch()">
            <Icon name="search" :size="14" />
            Try example: RE4E7M7H-36519-99252919
          </button>
        </div>
      </div>
    </section>

    <!-- Results area -->
    <main class="main">
      <Transition name="fade-up" mode="out-in">
        <LoadingState v-if="loading" key="loading" />
        <ErrorState
          v-else-if="error && !delivery"
          key="error"
          :message="error"
          :is-not-found="isNotFound"
        />
        <TrackingResult
          v-else-if="delivery"
          key="result"
          :delivery="delivery"
        />
        <div v-else key="empty" class="main__empty">
          <div class="main__features">
            <div class="main__feature">
              <div class="main__feature-icon"><Icon name="truck" :size="24" /></div>
              <h3>Live tracking</h3>
              <p>Follow your package from pickup to delivery with real-time updates.</p>
            </div>
            <div class="main__feature">
              <div class="main__feature-icon"><Icon name="clock" :size="24" /></div>
              <h3>Delivery ETA</h3>
              <p>Know exactly when your package will arrive with accurate time windows.</p>
            </div>
            <div class="main__feature">
              <div class="main__feature-icon"><Icon name="check-circle" :size="24" /></div>
              <h3>Proof of delivery</h3>
              <p>Get confirmation with timestamps and location when your package is delivered.</p>
            </div>
          </div>
        </div>
      </Transition>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <p class="footer__text">TrackIT — Real-time delivery tracking</p>
    </footer>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Header */
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--gray-200);
}

.header__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__brand {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  transition: opacity 0.2s ease;
}

.header__brand:hover {
  opacity: 0.7;
}

.header__logo {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--gray-900);
  letter-spacing: -0.02em;
}

/* Hero */
.hero {
  position: relative;
  padding: 80px 24px 60px;
  overflow: hidden;
  background: linear-gradient(180deg, var(--gray-50) 0%, #ffffff 100%);
  transition: padding 0.4s ease;
}

.hero--compact {
  padding: 48px 24px 40px;
}

.hero__bg-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(var(--gray-100) 1px, transparent 1px),
    linear-gradient(90deg, var(--gray-100) 1px, transparent 1px);
  background-size: 40px 40px;
  mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%);
  -webkit-mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 30%, transparent 80%);
  opacity: 0.5;
  z-index: 0;
}

.hero__bg-glow {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  height: 400px;
  background: radial-gradient(ellipse, rgba(37, 99, 235, 0.08) 0%, transparent 70%);
  z-index: 0;
}

.hero__content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.hero__title {
  margin: 0;
  font-size: 3rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
  color: var(--gray-900);
  animation: fadeInUp 0.6s ease;
}

.hero__title--sm {
  font-size: 1.75rem;
}

.hero__title-accent {
  display: block;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero__subtitle {
  margin: 0;
  font-size: 1.125rem;
  color: var(--gray-600);
  line-height: 1.6;
  max-width: 560px;
  animation: fadeInUp 0.6s ease 0.1s both;
}

.hero__example {
  animation: fadeInUp 0.6s ease 0.3s both;
}

.hero__example-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: var(--gray-100);
  color: var(--gray-600);
  font-size: 0.8125rem;
  font-weight: 500;
  padding: 8px 16px;
  border-radius: 100px;
  transition: all 0.2s ease;
}

.hero__example-btn:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

/* Main */
.main {
  flex: 1;
  max-width: 1100px;
  width: 100%;
  margin: 0 auto;
  padding: 0 24px 60px;
}

.main__empty {
  padding: 20px 0;
}

.main__features {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  animation: fadeInUp 0.6s ease 0.2s both;
}

.main__feature {
  text-align: center;
  padding: 36px 24px;
  background: white;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-lg);
  transition: all 0.3s ease;
}

.main__feature:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--gray-300);
}

.main__feature-icon {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
}

.main__feature h3 {
  margin: 0 0 8px;
  font-size: 1.0625rem;
  font-weight: 600;
  color: var(--gray-800);
}

.main__feature p {
  margin: 0;
  font-size: 0.9375rem;
  color: var(--gray-500);
  line-height: 1.5;
}

/* Footer */
.footer {
  border-top: 1px solid var(--gray-200);
  padding: 24px;
  text-align: center;
}

.footer__text {
  margin: 0;
  font-size: 0.8125rem;
  color: var(--gray-400);
}

/* Responsive */
@media (max-width: 768px) {
  .hero {
    padding: 56px 20px 40px;
  }
  .hero__title {
    font-size: 2.25rem;
  }
  .main__features {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .hero__title {
    font-size: 1.75rem;
  }
  .hero__subtitle {
    font-size: 1rem;
  }
}
</style>
