/**
 * 投票曲线计算工具
 * 用于计算治理提案的批准阈值和支持阈值
 */

export interface Curve {
  Type: string
  // LinearDecreasing 参数
  LinearBegin: number
  LinearEnd: number
  LinearLength: number
  // SteppedDecreasing 参数
  StepBegin: number
  StepEnd: number
  StepSize: number
  StepPeriod: number
  // Reciprocal 参数
  ReciprocalFactor: number
  ReciprocalXScale: number
  ReciprocalXOffset: number
  ReciprocalYOffset: number
}

export const CurveType = {
  LinearDecreasing: 'LinearDecreasing',
  SteppedDecreasing: 'SteppedDecreasing',
  Reciprocal: 'Reciprocal',
} as const

/**
 * 计算曲线在给定 X（区块号）处的 Y 值（阈值百分比，万分比）
 */
export function curveY(curve: Curve, x: number): number {
  switch (curve.Type) {
    case CurveType.LinearDecreasing:
      return linearDecreasingY(curve, x)
    case CurveType.SteppedDecreasing:
      return steppedDecreasingY(curve, x)
    case CurveType.Reciprocal:
      return reciprocalY(curve, x)
    default:
      return 0
  }
}

function linearDecreasingY(curve: Curve, x: number): number {
  if (x >= curve.LinearLength) {
    return curve.LinearEnd
  }
  if (curve.LinearLength === 0) {
    return curve.LinearEnd
  }
  // slope = (begin - end) * x / length
  const slope = Math.floor(((curve.LinearBegin - curve.LinearEnd) * x) / curve.LinearLength)
  const result = curve.LinearBegin - slope
  return Math.max(result, curve.LinearEnd)
}

function steppedDecreasingY(curve: Curve, x: number): number {
  if (curve.StepPeriod === 0 || x < curve.StepPeriod) {
    return curve.StepBegin
  }
  const numSteps = Math.floor(x / curve.StepPeriod)
  const subValue = numSteps * curve.StepSize

  if (subValue >= curve.StepBegin || curve.StepBegin - subValue <= curve.StepEnd) {
    return curve.StepEnd
  }
  return curve.StepBegin - subValue
}

function reciprocalY(curve: Curve, x: number): number {
  if (curve.ReciprocalXScale === 0) {
    return 0
  }
  // K/(x/S + x_offset) - y_offset
  const xScale = curve.ReciprocalXScale
  let denominator = Math.floor(x / xScale) + curve.ReciprocalXOffset
  if (denominator <= 0) {
    denominator = 1
  }
  const result = Math.floor(curve.ReciprocalFactor / denominator) - curve.ReciprocalYOffset
  return Math.max(result, 0)
}

/**
 * 生成曲线图表数据点
 * @param curve 曲线配置
 * @param maxBlocks 最大区块数
 * @param points 数据点数量
 */
export function generateCurvePoints(curve: Curve, maxBlocks: number, points: number = 50): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = []
  const step = Math.max(1, Math.floor(maxBlocks / points))
  
  for (let x = 0; x <= maxBlocks; x += step) {
    result.push({ x, y: curveY(curve, x) })
  }
  
  // 确保包含最后一个点
  if (result[result.length - 1].x !== maxBlocks) {
    result.push({ x: maxBlocks, y: curveY(curve, maxBlocks) })
  }
  
  return result
}

/**
 * 格式化曲线类型为可读文本
 */
export function formatCurveType(type: string): string {
  switch (type) {
    case CurveType.LinearDecreasing:
      return 'Linear'
    case CurveType.SteppedDecreasing:
      return 'Stepped'
    case CurveType.Reciprocal:
      return 'Reciprocal'
    default:
      return type
  }
}

/**
 * 将万分比转换为百分比显示
 */
export function permilleToPercent(value: number): string {
  return (value / 100).toFixed(2) + '%'
}

function num(v: unknown): number {
  if (typeof v === 'number' && Number.isFinite(v)) return v
  return Number(String(v ?? '').replace(/,/g, '')) || 0
}

/**
 * 解析链上 / contract_query toHuman 返回的 Curve（ink 元数据为扁平 struct：Type + 各参数）
 */
export function parseCurveFromApi(data: any): Curve {
  if (!data) {
    return {
      Type: CurveType.LinearDecreasing,
      LinearBegin: 10000,
      LinearEnd: 5000,
      LinearLength: 1000,
      StepBegin: 10000,
      StepEnd: 5000,
      StepSize: 500,
      StepPeriod: 100,
      ReciprocalFactor: 0,
      ReciprocalXScale: 0,
      ReciprocalXOffset: 0,
      ReciprocalYOffset: 0,
    }
  }

  const linearLength = num(data.LinearLength ?? data.linear_length ?? data.linearLength)
  const stepPeriod = num(data.StepPeriod ?? data.step_period ?? data.stepPeriod)
  const reciprocalFactor = num(data.ReciprocalFactor ?? data.reciprocal_factor ?? data.reciprocalFactor)
  const reciprocalXScale = num(data.ReciprocalXScale ?? data.reciprocal_x_scale ?? data.reciprocalXScale)

  let typeStr = String(data.Type ?? data.type ?? '').trim()
  if (!typeStr) {
    if (linearLength > 0) typeStr = CurveType.LinearDecreasing
    else if (stepPeriod > 0) typeStr = CurveType.SteppedDecreasing
    else if (reciprocalFactor > 0 && reciprocalXScale > 0) typeStr = CurveType.Reciprocal
    else typeStr = CurveType.LinearDecreasing
  }

  return {
    Type: typeStr,
    LinearBegin: num(data.LinearBegin ?? data.linear_begin ?? data.linearBegin),
    LinearEnd: num(data.LinearEnd ?? data.linear_end ?? data.linearEnd),
    LinearLength: linearLength,
    StepBegin: num(data.StepBegin ?? data.step_begin ?? data.stepBegin),
    StepEnd: num(data.StepEnd ?? data.step_end ?? data.stepEnd),
    StepSize: num(data.StepSize ?? data.step_size ?? data.stepSize),
    StepPeriod: stepPeriod,
    ReciprocalFactor: reciprocalFactor,
    ReciprocalXScale: reciprocalXScale,
    ReciprocalXOffset: num(data.ReciprocalXOffset ?? data.reciprocal_x_offset ?? data.reciprocalXOffset),
    ReciprocalYOffset: num(data.ReciprocalYOffset ?? data.reciprocal_y_offset ?? data.reciprocalYOffset),
  }
}
