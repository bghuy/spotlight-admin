import type React from "react"

interface ChartProps {
  data: { name: string; value: number }[]
  index: string
  categories: string[]
  colors: string[]
  valueFormatter?: (value: number) => string
  className?: string
}

export const BarChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      {/* Placeholder for BarChart */}
      <div>BarChart Placeholder</div>
    </div>
  )
}

export const LineChart: React.FC<ChartProps> = ({ data, index, categories, colors, valueFormatter, className }) => {
  return (
    <div className={className}>
      {/* Placeholder for LineChart */}
      <div>LineChart Placeholder</div>
    </div>
  )
}
