<script setup lang="ts">
import { ref } from 'vue'
import Icon from './Icon.vue'

const props = defineProps<{
  modelValue: string
  loading: boolean
  error: string | null
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  submit: []
}>()

const touched = ref(false)

function onSubmit() {
  touched.value = true
  emit('submit')
}

function onInput(e: Event) {
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}

defineExpose({
  resetValidation: () => { touched.value = false },
})
</script>

<template>
  <div class="search">
    <div class="search__inner">
      <div class="search__field" :class="{ 'search__field--error': props.error && touched }">
        <Icon name="search" :size="22" color="var(--gray-400)" />
        <input
          :value="modelValue"
          @input="onInput"
          @keydown.enter="onSubmit"
          type="text"
          placeholder="Enter your tracking code, e.g. RE4E7M7H-36519-99252919"
          class="search__input"
          spellcheck="false"
          autocomplete="off"
        />
        <button class="search__btn" @click="onSubmit" :disabled="loading || !modelValue.trim()">
          <span v-if="loading" class="search__spinner" />
          <template v-else>
            <span class="search__btn-text">Track</span>
            <Icon name="arrow-right" :size="18" />
          </template>
        </button>
      </div>
      <Transition name="error-slide">
        <p v-if="props.error && touched" class="search__error">{{ props.error }}</p>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.search {
  width: 100%;
  max-width: 680px;
  margin: 0 auto;
}

.search__inner {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.search__field {
  display: flex;
  align-items: center;
  gap: 12px;
  background: white;
  border: 2px solid var(--gray-200);
  border-radius: var(--radius-lg);
  padding: 6px 6px 6px 20px;
  transition: all 0.25s ease;
  box-shadow: var(--shadow-md);
}

.search__field:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.12);
}

.search__field--error {
  border-color: var(--color-error);
  box-shadow: 0 0 0 4px rgba(220, 38, 38, 0.08);
}

.search__input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 1rem;
  background: transparent;
  color: var(--gray-900);
  padding: 12px 0;
  min-width: 0;
}

.search__input::placeholder {
  color: var(--gray-400);
}

.search__btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--color-primary);
  color: white;
  font-weight: 600;
  font-size: 0.9375rem;
  padding: 14px 24px;
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.search__btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.search__btn:active:not(:disabled) {
  transform: translateY(0);
}

.search__btn:disabled {
  background: var(--gray-300);
  cursor: not-allowed;
}

.search__btn-text {
  white-space: nowrap;
}

.search__spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

.search__error {
  margin: 0;
  color: var(--color-error);
  font-size: 0.875rem;
  font-weight: 500;
  padding-left: 8px;
}

.error-slide-enter-active,
.error-slide-leave-active {
  transition: all 0.3s ease;
}
.error-slide-enter-from,
.error-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

@media (max-width: 560px) {
  .search__btn-text {
    display: none;
  }
  .search__btn {
    padding: 14px 18px;
  }
}
</style>
