<template>
  <div class="content">
    <div class="box">
      <kit-box
        ref="kitBoxRef"
        :width="1080"
        :height="1920"
        @onCurrentDataChange="currentDataChange"
      />
    </div>
    <div>
      <ImageList @add="addImage" />
    </div>
    <div>
      <button @click="addText">添加文字</button>
    </div>
    <div>
      <button @click="createPoster">生成海报</button>
    </div>
    <div v-if="currentData?.id">
      <div key="{key}" v-for="[key, value] in Object.entries(currentData)">
        {{ key }}:
        <input
          type="text"
          :value="value"
          :disabled="['id', 'type', 'image'].includes(key)"
          @Change="updateData"
        />
      </div>
    </div>
    )}
    <div>
      <img
        :style="{
          width: '500px',
          height: '500px',
          objectFit: 'contain',
        }"
        :src="url"
        alt=""
      />
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { CardData } from 'designkit'
import { ref } from 'vue'
import ImageList from './components/ImageList.vue'

const kitBoxRef = ref<HTMLKitBoxElement | null>(null)
const currentData = ref<CardData | null>(null)
const url = ref('')

function currentDataChange(e: CustomEvent<CardData>) {
  // e.detail 即为 CardData
  console.log('currentDataChange', e.detail)
  currentData.value = e.detail
}

function addImage(data: CardData) {
  kitBoxRef.value?.add(data)
}

function addText() {
  kitBoxRef.value?.add({
    id: Math.random().toString(36),
    width: 1080,
    height: 500,
    x: 0,
    y: 0,
    text: '你好世界你好世界1234567890🤔abcdefghijklmnopqrstuvwxyz',
    type: 'text',
    fontSize: 32,
    fontFamily: 'cursive',
    color: '#db3f9178',
    fontWeight: 'bold',
    fontStyle: 'italic',
    decoration: 'line-through',
  })
}

function createPoster() {
  kitBoxRef.value
    ?.createPoster()
    .then((canvas) => {
      const src = canvas.toDataURL('image/png')
      url.value = src
    })
    .catch((err) => {
      console.error('Error creating poster:', err)
    })
}

function updateData(data: CardData) {
  kitBoxRef.value?.updateCurrentData(data)
}
</script>

<style></style>
