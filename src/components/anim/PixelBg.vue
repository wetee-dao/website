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
  /**
   * 内部画布最大逻辑尺寸（px）。小于父元素时按比例缩小 buffer，再 CSS 拉伸铺满；
   * 仅在超大屏上降采样以控 CPU，常见 1080p 及以下保持 1:1 观感。
   */
  maxCanvasWidth?: number
  maxCanvasHeight?: number
  /** 目标帧率上限；0 表示跟随显示器、不做节流 */
  maxFps?: number
}>(), {
  tileSize: 5,
  gap: 3,
  color: '255,255,255',
  maxOpacity: 0.18,
  waveSpeed: 0.002,
  density: 0.4,
  maxCanvasWidth: 1920,
  maxCanvasHeight: 1080,
  maxFps: 50,
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
let lastFrameAt = 0
let visible = true
let inView = true
let reduceMotion = false
let io: IntersectionObserver | null = null
let ro: ResizeObserver | null = null
let onVis: (() => void) | null = null
let ctx2d: CanvasRenderingContext2D | null = null
let mqCleanup: (() => void) | null = null

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
  const parent = canvas.parentElement
  if (!parent) return

  const pw = parent.clientWidth
  const ph = parent.clientHeight
  if (pw <= 0 || ph <= 0) return

  const sx = Math.min(1, props.maxCanvasWidth / pw)
  const sy = Math.min(1, props.maxCanvasHeight / ph)
  const scale = Math.min(sx, sy, 1)

  canvas.width = Math.max(1, Math.floor(pw * scale))
  canvas.height = Math.max(1, Math.floor(ph * scale))
  buildGrid(canvas)
}

function shouldRunFrame() {
  if (typeof document !== 'undefined' && document.hidden) return false
  if (!visible || !inView) return false
  return true
}

function effectiveFpsCap() {
  if (reduceMotion) return 8
  return props.maxFps > 0 ? props.maxFps : 0
}

function loop(now: number) {
  rafId = requestAnimationFrame(loop)

  if (!shouldRunFrame()) return

  const cap = effectiveFpsCap()
  if (cap > 0) {
    const minDt = 1000 / cap
    if (now - lastFrameAt < minDt) return
  }
  lastFrameAt = now

  const canvas = canvasRef.value
  if (!canvas || !ctx2d) return

  tick()
  draw(ctx2d)
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  ctx2d = ctx

  resize(canvas)

  const parent = canvas.parentElement
  if (parent) {
    ro = new ResizeObserver(() => resize(canvas))
    ro.observe(parent)
  }

  if (typeof window !== 'undefined' && 'IntersectionObserver' in window && parent) {
    io = new IntersectionObserver(
      (entries) => {
        const e = entries[0]
        inView = e ? e.isIntersecting : true
      },
      { root: null, rootMargin: '80px', threshold: 0 },
    )
    io.observe(parent)
  }

  if (typeof window !== 'undefined' && window.matchMedia) {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduceMotion = mq.matches
    const onMq = () => {
      reduceMotion = mq.matches
    }
    mq.addEventListener?.('change', onMq)
    mqCleanup = () => mq.removeEventListener?.('change', onMq)
  }

  onVis = () => {
    visible = !document.hidden
  }
  document.addEventListener('visibilitychange', onVis)

  lastFrameAt = 0
  rafId = requestAnimationFrame(loop)
})

onUnmounted(() => {
  cancelAnimationFrame(rafId)
  ro?.disconnect()
  io?.disconnect()
  if (onVis) document.removeEventListener('visibilitychange', onVis)
  mqCleanup?.()
  mqCleanup = null
  ctx2d = null
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
  image-rendering: pixelated;
  image-rendering: crisp-edges;
}
</style>
