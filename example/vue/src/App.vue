<template>
  <div class="app-container">
    <div class="content">
      <div class="main-section">
        <div class="canvas-container">
          <h2 class="canvas-title">海报设计画布</h2>
          <div class="box">
            <kit-box
              ref="kitBoxRef"
              :width="1080"
              :height="1920"
              @currentDataChange="currentDataChange"
            />
          </div>
        </div>
        
        <div class="controls-section">
          <h3 class="controls-title">设计工具</h3>
          <ImageList @add="addImage" />
          <div class="button-group">
            <button class="btn btn-primary" @click="addText">
              添加文字
            </button>
            <button class="btn btn-secondary" @click="createPoster">
              生成海报
            </button>
          </div>
        </div>
        
        <div v-if="url" class="result-section">
          <h3 class="result-title">生成结果</h3>
          <img
            class="result-image"
            :src="url"
            alt="Generated poster"
          />
        </div>
      </div>
      
      <div v-if="currentData?.id" class="sidebar">
        <h3 class="sidebar-title">属性编辑器</h3>
        <div :key="key" v-for="[key, value] in Object.entries(currentData)" class="property-group">
          <label class="property-label">{{ key }}</label>
          
          <!-- Color input with alpha -->
          <div v-if="key === 'color' && !['id', 'type', 'image'].includes(key)" class="color-input-group">
            <div class="color-input-wrapper">
              <input
                type="color"
                class="color-input"
                :value="String(value).includes('#') ? String(value).substring(0, 7) : '#000000'"
                @input="
                  (() => {
                    const colorValue = String(value)
                    const hasAlpha = colorValue.includes('#') && colorValue.length > 7
                    const newColor = hasAlpha ? $event.target?.value + colorValue.substring(7) : $event.target?.value
                    updateData({
                      ...currentData,
                      [key]: newColor,
                    })
                  })()
                "
              />
              <div 
                class="color-preview"
                :style="{
                  backgroundColor: String(value)
                }"
              />
              <input
                type="text"
                class="property-input color-text-input"
                :value="String(value)"
                @input="
                  updateData({
                    ...currentData,
                    [key]: $event.target?.value,
                  })
                "
              />
            </div>
            <div class="alpha-slider-wrapper">
              <label class="alpha-label">透明度</label>
              <input
                type="range"
                class="alpha-slider"
                min="0"
                max="255"
                :value="(() => {
                  const colorValue = String(value)
                  if (colorValue.includes('#') && colorValue.length > 7) {
                    return parseInt(colorValue.substring(7), 16)
                  }
                  return 255
                })()"
                @input="
                  (() => {
                    const colorValue = String(value)
                    const baseColor = colorValue.includes('#') ? colorValue.substring(0, 7) : '#000000'
                    const alpha = parseInt($event.target?.value).toString(16).padStart(2, '0')
                    updateData({
                      ...currentData,
                      [key]: baseColor + alpha,
                    })
                  })()
                "
              />
              <span class="alpha-value">
                {{ Math.round((((() => {
                  const colorValue = String(value)
                  if (colorValue.includes('#') && colorValue.length > 7) {
                    return parseInt(colorValue.substring(7), 16)
                  }
                  return 255
                })() / 255) * 100)) }}%
              </span>
            </div>
          </div>
          
          <!-- Number input -->
          <input
            v-else-if="['x', 'y', 'width', 'height', 'fontSize'].includes(key) && !['id', 'type', 'image'].includes(key)"
            type="number"
            class="property-input"
            :value="Number(value) || 0"
            @input="
              updateData({
                ...currentData,
                [key]: Number($event.target?.value),
              })
            "
          />
          
          <!-- Select input for fontWeight -->
          <select
            v-else-if="key === 'fontWeight' && !['id', 'type', 'image'].includes(key)"
            class="property-input property-select"
            :value="String(value)"
            @change="
              updateData({
                ...currentData,
                [key]: $event.target?.value,
              })
            "
          >
            <option value="normal">Normal</option>
            <option value="bold">Bold</option>
            <option value="lighter">Lighter</option>
            <option value="100">100</option>
            <option value="200">200</option>
            <option value="300">300</option>
            <option value="400">400</option>
            <option value="500">500</option>
            <option value="600">600</option>
            <option value="700">700</option>
            <option value="800">800</option>
            <option value="900">900</option>
          </select>
          
          <!-- Default text input -->
          <input
            v-else
            type="text"
            class="property-input"
            :value="String(value)"
            :disabled="['id', 'type', 'image'].includes(key)"
            @input="
              updateData({
                ...currentData,
                [key]: $event.target?.value,
              })
            "
          />
        </div>
      </div>
      
      <div v-if="!currentData?.id" class="sidebar">
        <h3 class="sidebar-title">属性编辑器</h3>
        <div class="empty-state">
          请选择一个元素来编辑属性
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="tsx">
import type { CardData } from 'poster-kit'
import { ref } from 'vue'
import ImageList from './components/ImageList.vue'

const kitBoxRef = ref<HTMLKitBoxElement | null>(null)
const currentData = ref<CardData | null>(null)
const url = ref('')

function currentDataChange(e: CustomEvent<CardData>) {
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
      url.value = canvas.toDataURL('image/png')
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
