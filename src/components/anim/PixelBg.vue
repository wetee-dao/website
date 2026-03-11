<template>
  <canvas ref="canvasRef" class="pixel-bg" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = withDefaults(defineProps<{
  /** Square pixel size in px */
  tileSize?: number
  /** Gap between tiles */
  gap?: number
  /** Tile color r,g,b */
  color?: string
  /** Max opacity a tile can reach */
  maxOpacity?: number
  /** Wave speed */
  waveSpeed?: number
  /** Fraction of tiles that participate */
  density?: number
}>(), {
  tileSize: 5,
  gap: 3,
  color: '255,255,255',
  maxOpacity: 0.18,
  waveSpeed: 0.002,
  density: 0.4,
})

interface Tile {
  x: number
  y: number
  cx: number
  cy: number
  opacity: number
  target: number
  speed: number
  active: boolean
  noise: number
}

const canvasRef = ref<HTMLCanvasElement | null>(null)
let rafId = 0
let tiles: Tile[] = []
let time = 0

function buildGrid(canvas: HTMLCanvasElement) {
  const step = props.tileSize + props.gap
  const cols = Math.ceil(canvas.width / step) + 1
  const rows = Math.ceil(canvas.height / step) + 1
  tiles = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      tiles.push({
        x: c * step,
        y: r * step,
        cx: c / cols,
        cy: r / rows,
        opacity: 0,
        target: 0,
        speed: 0.006 + Math.random() * 0.01,
        active: Math.random() < props.density,
        noise: (Math.random() - 0.5) * 2,
      })
    }
  }
}

function waveAt(cx: number, cy: number, noise: number, t: number): number {
  const dx = cx - 0.5
  const dy = cy - 0.5
  const dist = Math.sqrt(dx * dx + dy * dy)
  const angle = Math.atan2(dy, dx)

  const warp =
    Math.sin(angle * 3 + t * 0.3) * 0.06 +
    Math.sin(angle * 7 - t * 0.18) * 0.035 +
    Math.sin(angle * 11 + t * 0.1) * 0.02

  const distorted = dist + warp + noise * 0.015
  const phase = (distorted * 2.5 - t * 3) % 2
  return (Math.sin(phase * Math.PI) + 1) / 2
}

function tick() {
  time += props.waveSpeed
  for (const tile of tiles) {
    if (!tile.active) continue
    const wave = waveAt(tile.cx, tile.cy, tile.noise, time)
    tile.target = wave > 0.38 ? props.maxOpacity * wave : 0
    tile.opacity += (tile.target - tile.opacity) * tile.speed
  }
}

function draw(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas
  ctx.clearRect(0, 0, width, height)
  const s = props.tileSize
  for (const tile of tiles) {
    if (!tile.active || tile.opacity < 0.004) continue
    ctx.fillStyle = `rgba(${props.color},${tile.opacity.toFixed(3)})`
    ctx.fillRect(tile.x, tile.y, s, s)
  }
}

function resize(canvas: HTMLCanvasElement) {
  const parent = canvas.parentElement!
  canvas.width = parent.clientWidth
  canvas.height = parent.clientHeight
  buildGrid(canvas)
}

onMounted(() => {
  const canvas = canvasRef.value!
  const ctx = canvas.getContext('2d')!
  resize(canvas)

  const ro = new ResizeObserver(() => resize(canvas))
  ro.observe(canvas.parentElement!)

  const loop = () => {
    tick()
    draw(ctx)
    rafId = requestAnimationFrame(loop)
  }
  rafId = requestAnimationFrame(loop)

  onUnmounted(() => {
    cancelAnimationFrame(rafId)
    ro.disconnect()
  })
})
</script>

<style scoped>
.pixel-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}
</style>
