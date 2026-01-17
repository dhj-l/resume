<template>
  <span class="inline-block font-mono">
    {{ displayedText }}
    <span class="animate-pulse text-primary-600">|</span>
  </span>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  words: string[]
  typingSpeed?: number
  deletingSpeed?: number
  pauseTime?: number
}>()

const displayedText = ref('')
const currentWordIndex = ref(0)
const isDeleting = ref(false)
let timer: ReturnType<typeof setTimeout>

const type = () => {
  const currentWord = props.words[currentWordIndex.value] ?? ''
  const speed = isDeleting.value 
    ? (props.deletingSpeed || 50) 
    : (props.typingSpeed || 100)

  if (isDeleting.value) {
    displayedText.value = currentWord.substring(0, displayedText.value.length - 1)
  } else {
    displayedText.value = currentWord.substring(0, displayedText.value.length + 1)
  }

  if (!isDeleting.value && displayedText.value === currentWord) {
    timer = setTimeout(() => {
      isDeleting.value = true
      type()
    }, props.pauseTime || 2000)
  } else if (isDeleting.value && displayedText.value === '') {
    isDeleting.value = false
    currentWordIndex.value = (currentWordIndex.value + 1) % props.words.length
    timer = setTimeout(type, 500)
  } else {
    timer = setTimeout(type, speed)
  }
}

onMounted(() => {
  type()
})

onUnmounted(() => {
  clearTimeout(timer)
})
</script>
