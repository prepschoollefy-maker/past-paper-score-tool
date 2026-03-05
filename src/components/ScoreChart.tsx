'use client'

import { ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export interface ChartDataPoint {
    year: string
    score: number | null
    passingMin: number | null
    passingMin2: number | null
    passingMax: number | null
    passingAvg: number | null
}

interface ScoreChartProps {
    data: ChartDataPoint[]
    title: string
    subtitle?: string
    theme?: 'light' | 'dark'
    scoreLabel?: string
    barColor?: string
}

export default function ScoreChart({
    data,
    title,
    subtitle,
    theme = 'light',
    scoreLabel = 'あなたの得点',
    barColor = '#4DB8C4',
}: ScoreChartProps) {
    const hasPassingMin2 = data.some(d => d.passingMin2 != null)
    const hasPassingMax = data.some(d => d.passingMax != null)

    const maxScore = Math.max(
        ...data.map(d => Math.max(
            (d.score as number) || 0,
            (d.passingMin as number) || 0,
            (d.passingMin2 as number) || 0,
            (d.passingMax as number) || 0,
            (d.passingAvg as number) || 0
        )),
        100
    )

    const isDark = theme === 'dark'
    const gridColor = isDark ? '#334155' : '#e2e8f0'
    const axisColor = '#94a3b8'
    const tooltipBg = isDark ? '#1e293b' : '#fff'
    const tooltipBorder = isDark ? '#334155' : '#e2e8f0'

    // Rename data keys for display
    const chartData = data.map(d => ({
        year: d.year,
        [scoreLabel]: d.score,
        '合格最低点': d.passingMin,
        '合格最低点※': d.passingMin2,
        '合格最高点': d.passingMax,
        '合格者平均': d.passingAvg,
    }))

    return (
        <div className={`rounded-xl border p-6 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white shadow-md border-teal-200'}`}>
            <h2 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-teal-700'}`}>
                {title}
                {subtitle && (
                    <span className={`ml-2 ${isDark ? 'text-slate-400' : 'text-teal-300'}`}>（{subtitle}）</span>
                )}
            </h2>
            <div className="overflow-x-auto">
                <div className="h-80" style={{ minWidth: `${Math.max(chartData.length * 80, 600)}px` }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={chartData} barCategoryGap="20%">
                            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
                            <XAxis dataKey="year" stroke={axisColor} fontSize={12} />
                            <YAxis
                                domain={[0, Math.ceil(maxScore * 1.1 / 10) * 10]}
                                stroke={axisColor}
                                fontSize={12}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: tooltipBg,
                                    border: `1px solid ${tooltipBorder}`,
                                    borderRadius: '8px',
                                    ...(isDark ? { color: '#f1f5f9' } : {}),
                                }}
                                formatter={(value, name) => [value !== null ? `${value}点` : '-', name]}
                            />
                            <Legend />
                            <Bar dataKey={scoreLabel} fill={barColor} radius={[4, 4, 0, 0]} />
                            <Line type="monotone" dataKey="合格最低点" stroke="#ef4444" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#ef4444', r: 4 }} connectNulls />
                            {hasPassingMin2 && <Line type="monotone" dataKey="合格最低点※" stroke="#2563eb" strokeWidth={2} strokeDasharray="5 5" dot={{ fill: '#2563eb', r: 4 }} connectNulls />}
                            {hasPassingMax && <Line type="monotone" dataKey="合格最高点" stroke="#16a34a" strokeWidth={2} dot={{ fill: '#16a34a', r: 4 }} connectNulls />}
                            <Line type="monotone" dataKey="合格者平均" stroke={isDark ? '#a78bfa' : '#7c3aed'} strokeWidth={2} dot={{ fill: isDark ? '#a78bfa' : '#7c3aed', r: 4 }} connectNulls />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}
