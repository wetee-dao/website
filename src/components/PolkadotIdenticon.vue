<template>
  <div class="polkadot-identicon" v-html="svgContent" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { decodeAddress } from '@polkadot/util-crypto'
import { blake2AsU8a } from '@polkadot/util-crypto'

interface Props {
  address: string
  size?: number
  isAlternative?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  size: 64,
  isAlternative: false
})

// 固定背景颜色 - 不可修改
const BACKGROUND_COLOR = '#000'

// 图标大小常量
const S = 64
const C = S / 2
const Z = (S / 64) * 5

// 颜色方案
interface Scheme {
  freq: number
  colors: readonly number[]
}

const SCHEMES: readonly Scheme[] = [
  /* target  */ { colors: [0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 0, 28, 0, 1], freq: 1 },
  /* cube    */ { colors: [0, 1, 3, 2, 4, 3, 0, 1, 3, 2, 4, 3, 0, 1, 3, 2, 4, 3, 5], freq: 20 },
  /* quazar  */ { colors: [1, 2, 3, 1, 2, 4, 5, 5, 4, 1, 2, 3, 1, 2, 4, 5, 5, 4, 0], freq: 16 },
  /* flower  */ { colors: [0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 0, 1, 2, 3], freq: 32 },
  /* cyclic  */ { colors: [0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 0, 1, 2, 3, 4, 5, 6], freq: 32 },
  /* vmirror */ { colors: [0, 1, 2, 3, 4, 5, 3, 4, 2, 0, 1, 6, 7, 8, 9, 7, 8, 6, 10], freq: 128 },
  /* hmirror */ { colors: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 8, 6, 7, 5, 3, 4, 2, 11], freq: 128 }
]

const SCHEMES_TOTAL = SCHEMES.map((s) => s.freq).reduce((a, b) => a + b)

// 计算旋转参数
function getRotation(isSixPoint: boolean) {
  const r = isSixPoint ? (C / 8) * 5 : (C / 4) * 3
  const rroot3o2 = r * Math.sqrt(3) / 2
  const ro2 = r / 2
  const rroot3o4 = r * Math.sqrt(3) / 4
  const ro4 = r / 4
  const r3o4 = (r * 3) / 4
  return { r, r3o4, ro2, ro4, rroot3o2, rroot3o4 }
}

// 获取圆的位置
function getCircleXY(isSixPoint = false): [number, number][] {
  const { r, r3o4, ro2, ro4, rroot3o2, rroot3o4 } = getRotation(isSixPoint)
  return [
    [C, C - r],
    [C, C - ro2],
    [C - rroot3o4, C - r3o4],
    [C - rroot3o2, C - ro2],
    [C - rroot3o4, C - ro4],
    [C - rroot3o2, C],
    [C - rroot3o2, C + ro2],
    [C - rroot3o4, C + ro4],
    [C - rroot3o4, C + r3o4],
    [C, C + r],
    [C, C + ro2],
    [C + rroot3o4, C + r3o4],
    [C + rroot3o2, C + ro2],
    [C + rroot3o4, C + ro4],
    [C + rroot3o2, C],
    [C + rroot3o2, C - ro2],
    [C + rroot3o4, C - ro4],
    [C + rroot3o4, C - r3o4],
    [C, C]
  ]
}

// 查找颜色方案
function findScheme(d: number): Scheme {
  let cum = 0
  const schema = SCHEMES.find((schema) => {
    cum += schema.freq
    return d < cum
  })
  if (!schema) {
    throw new Error('Unable to find schema')
  }
  return schema
}

// 零哈希缓存
let zeroHash: Uint8Array | null = null

function getZeroHash(): Uint8Array {
  if (!zeroHash) {
    zeroHash = blake2AsU8a(new Uint8Array(32), 512)
  }
  return zeroHash
}

// 地址转ID
function addressToId(address: string): Uint8Array {
  const zh = getZeroHash()
  return blake2AsU8a(decodeAddress(address), 512).map((x, i) => (x + 256 - zh[i]) % 256)
}

// 获取颜色
function getColors(address: string): string[] {
  const id = addressToId(address)
  const d = Math.floor((id[30] + id[31] * 256) % SCHEMES_TOTAL)
  const rot = (id[28] % 6) * 3
  const sat = (Math.floor((id[29] * 70) / 256 + 26) % 80) + 30
  const scheme = findScheme(d)
  
  const palette = Array.from(id).map((x, i): string => {
    const b = (x + (i % 28) * 58) % 256
    if (b === 0) {
      return '#444'
    } else if (b === 255) {
      return 'transparent'
    }
    const h = Math.floor(((b % 64) * 360) / 64)
    const l = [53, 15, 35, 75][Math.floor(b / 64)]
    return `hsl(${h}, ${sat}%, ${l}%)`
  })
  
  return scheme.colors.map((_, i) => palette[scheme.colors[i < 18 ? (i + rot) % 18 : 18]])
}

// 生成图标圆
interface Circle {
  cx: number
  cy: number
  fill: string
  r: number
}

function polkadotIcon(address: string, isAlternative: boolean): Circle[] {
  const xy = getCircleXY(isAlternative)
  let colors: string[]
  
  try {
    colors = getColors(address)
  } catch {
    colors = new Array<string>(xy.length).fill('#ddd')
  }
  
  const outerCircle: Circle = { cx: C, cy: C, fill: BACKGROUND_COLOR, r: C }
  
  return [outerCircle].concat(
    xy.map(([cx, cy], index): Circle => ({
      cx,
      cy,
      fill: colors[index],
      r: Z
    }))
  )
}

// 生成SVG
const svgContent = computed(() => {
  if (!props.address) {
    return ''
  }
  
  try {
    const circles = polkadotIcon(props.address, props.isAlternative)
    const size = props.size
    const scale = size / S
    
    const circlesSvg = circles
      .map((c) => `<circle cx="${c.cx}" cy="${c.cy}" fill="${c.fill}" r="${c.r}"/>`)
      .join('')
    
    return `<svg viewBox="0 0 ${S} ${S}" width="${size}" height="${size}">${circlesSvg}</svg>`
  } catch (error) {
    console.error('Failed to generate identicon:', error)
    return ''
  }
})
</script>

<style scoped>
.polkadot-identicon {
  display: inline-block;
  line-height: 0;
}

.polkadot-identicon :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}
</style>
