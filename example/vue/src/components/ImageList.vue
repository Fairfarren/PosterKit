<template>
  <div class="image-list">
    <template v-if="loading">
      <div v-for="index in 5" :key="`loading-${index}`" class="image-item loading-placeholder">
        <div class="skeleton-image" />
      </div>
    </template>
    <template v-else>
      <div v-for="(item, index) in list" :key="index" class="image-item">
        <img :src="item.type === 'image' ? item.image.src : ''" :alt="`Image ${index + 1}`" @click="add(item)" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { CardData } from 'poster-kit'
import { defineEmits, onMounted, ref } from 'vue'

const emits = defineEmits({
  add: (_data: CardData) => true,
})

const imageAssets = [
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
]

const list = ref<CardData[]>([])
const loading = ref(true)

function add(data: CardData) {
  emits('add', {
    ...data,
    id: Math.random().toString(36),
  })
}

async function init() {
  loading.value = true
  const arr: typeof list.value = []
  for (const imageAsset of imageAssets) {
    const image = new Image()
    image.src = imageAsset
    image.crossOrigin = 'anonymous'
    await new Promise((resolve, reject) => {
      image.onload = () => {
        arr.push({
          id: '',
          image,
          width: image.width,
          height: image.height,
          x: 0,
          y: 0,
          type: 'image',
        })
        resolve(null)
      }
      image.onerror = (err) => {
        console.error('Image load error:', err)
        reject(err)
      }
    })
  }
  list.value = arr
  loading.value = false
}

onMounted(() => {
  init()
})
</script>
