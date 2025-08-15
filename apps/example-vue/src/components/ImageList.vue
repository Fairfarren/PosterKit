<template>
  <div class="image-list">
    <div v-for="(item, index) in list" :key="index">
      <img
        :src="item.type === 'image' ? item.image.src : ''"
        alt=""
        @click="add(item)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, defineEmits } from 'vue'
import type { CardData } from 'designkit'

const emits = defineEmits({
  add: (_data: CardData) => true,
})

const imageAssets = [
  'https://material-center.meitudata.com/material/image/62fa22ac354485399.png',
]

const list = ref<CardData[]>([])

function add(data: CardData) {
  emits('add', data)
}

async function init() {
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
}

onMounted(() => {
  init()
})
</script>
