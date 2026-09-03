<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  latitude: number
  longitude: number
  label?: string
}>()

const mapSrc = computed(() => {
  const lat = props.latitude.toFixed(6)
  const lng = props.longitude.toFixed(6)
  return `https://www.openstreetmap.org/export/embed.html?bbox=${(props.longitude - 0.01).toFixed(6)},${(props.latitude - 0.006).toFixed(6)},${(props.longitude + 0.01).toFixed(6)},${(props.latitude + 0.006).toFixed(6)}&layer=mapnik&marker=${lat},${lng}`
})

const mapLink = computed(() => {
  return `https://www.openstreetmap.org/?mlat=${props.latitude}&mlon=${props.longitude}#map=16/${props.latitude}/${props.longitude}`
})
</script>

<template>
  <div class="map-view">
    <iframe
      :src="mapSrc"
      class="map-view__iframe"
      loading="lazy"
      title="Delivery location map"
    />
    <div class="map-view__overlay">
      <div class="map-view__pin">
        <span class="map-view__pin-dot" />
      </div>
    </div>
    <a :href="mapLink" target="_blank" rel="noopener" class="map-view__link">
      View larger map
    </a>
  </div>
</template>

<style scoped>
.map-view {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--gray-200);
  background: var(--gray-100);
  aspect-ratio: 16 / 10;
}

.map-view__iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.map-view__overlay {
  position: absolute;
  inset: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-view__pin {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.map-view__pin-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: var(--color-primary);
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: pin-pulse 2s ease-in-out infinite;
}

@keyframes pin-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.map-view__link {
  position: absolute;
  bottom: 12px;
  right: 12px;
  background: white;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 6px 14px;
  border-radius: 100px;
  text-decoration: none;
  box-shadow: var(--shadow-md);
  transition: all 0.2s ease;
}

.map-view__link:hover {
  background: var(--color-primary);
  color: white;
}
</style>
