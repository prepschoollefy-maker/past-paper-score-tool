'use client'

import { useMemo } from 'react'
import type { UserExamSelection } from '@/types/database'
import { TrendingUp, AlertTriangle, ChevronRight } from 'lucide-react'

interface ArrowConn { from: string; to: string; type: 'pass' | 'fail' }

interface Step {
    sel: UserExamSelection
    outcome: 'pass' | 'fail' | 'start'
}

interface Scenario {
    id: string
    steps: Step[]
    totalCost: number
    deferralCost: number
    finalSchool: string
    enrolled: boolean
}

interface Props {
    sels: UserExamSelection[]
    arrowConns: ArrowConn[]
    hoveredSelId: string | null
    onHover: (selId: string | null) => void
    printMode: boolean
}

export default function ScenarioPanel({ sels, arrowConns, hoveredSelId, onHover, printMode }: Props) {
    const scenarios = useMemo(() => {
        if (arrowConns.length === 0) return []

        // child map: parentId -> [{sel, type}]
        const cm = new Map<string, { sel: UserExamSelection; type: 'pass' | 'fail' }[]>()
        for (const s of sels) {
            if (s.condition_source_id && s.condition_type) {
                if (!cm.has(s.condition_source_id)) cm.set(s.condition_source_id, [])
                cm.get(s.condition_source_id)!.push({ sel: s, type: s.condition_type as 'pass' | 'fail' })
            }
        }

        const roots = sels.filter(s => !s.condition_source_id && cm.has(s.id))
        const result: Scenario[] = []
        let idx = 0

        function walk(sel: UserExamSelection, path: Step[]) {
            const children = cm.get(sel.id) || []
            const passChild = children.find(c => c.type === 'pass')
            const failChild = children.find(c => c.type === 'fail')

            // PASS branch
            if (sel.on_pass_action === 'end' || !passChild) {
                // pass this exam = enrolled here
                const steps = [...path, { sel, outcome: 'pass' as const }]
                result.push(buildScenario(steps, true, idx++))
            } else {
                walk(passChild.sel, [...path, { sel, outcome: 'pass' as const }])
            }

            // FAIL branch
            if (!failChild) {
                const steps = [...path, { sel, outcome: 'fail' as const }]
                // If this is a fail leaf, check if any earlier step was a pass
                const hasPassBefore = path.some(s => s.outcome === 'pass')
                result.push(buildScenario(steps, hasPassBefore, idx++))
            } else {
                walk(failChild.sel, [...path, { sel, outcome: 'fail' as const }])
            }
        }

        for (const root of roots) walk(root, [])
        return result
    }, [sels, arrowConns])

    if (scenarios.length === 0) return null

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            <div className="px-5 py-3 border-b border-gray-100 bg-gradient-to-r from-teal-50/80 to-transparent">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <h3 className="text-sm font-bold text-gray-700">シナリオ一覧</h3>
                    <span className="text-xs text-gray-400">{scenarios.length}パターン</span>
                </div>
                {!printMode && (
                    <p className="text-[10px] text-gray-400 mt-0.5 print:hidden">
                        合否フローから想定される全パターンと費用
                    </p>
                )}
            </div>

            <div className="divide-y divide-gray-50">
                {scenarios.map((sc, i) => {
                    const isHov = sc.steps.some(s => s.sel.id === hoveredSelId)
                    return (
                        <div
                            key={sc.id}
                            className={`px-5 py-3 transition-colors ${isHov ? 'bg-teal-50/50' : 'hover:bg-gray-50/50'}`}
                            onMouseEnter={() => onHover(sc.steps[0]?.sel.id || null)}
                            onMouseLeave={() => onHover(null)}
                        >
                            <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-1 flex-wrap min-w-0">
                                    <span className="text-xs font-bold text-gray-300 w-5 flex-shrink-0">
                                        {String.fromCharCode(65 + i)}
                                    </span>
                                    {sc.steps.map((step, j) => (
                                        <span key={`${sc.id}-${j}`} className="flex items-center gap-0.5">
                                            {j > 0 && (
                                                <span className={`text-[11px] font-bold flex items-center ${
                                                    step.outcome === 'pass' ? 'text-green-500' : 'text-red-400'
                                                }`}>
                                                    {step.outcome === 'pass' ? '○' : '×'}
                                                    <ChevronRight className="w-3 h-3" />
                                                </span>
                                            )}
                                            <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
                                                {step.sel.exam_session?.school?.name}
                                            </span>
                                        </span>
                                    ))}
                                    {sc.enrolled && (
                                        <span className="text-[11px] font-bold text-teal-600 whitespace-nowrap ml-1">
                                            → {sc.finalSchool}
                                        </span>
                                    )}
                                    {!sc.enrolled && (
                                        <span className="text-[11px] text-gray-400 ml-1">→ 再検討</span>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 flex-shrink-0">
                                    {sc.deferralCost > 0 && (
                                        <span className="flex items-center gap-0.5 text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                                            <AlertTriangle className="w-3 h-3" />延納
                                        </span>
                                    )}
                                    {sc.totalCost > 0 && (
                                        <div className="text-right">
                                            <div className="text-xs font-bold text-gray-700 whitespace-nowrap">
                                                ¥{sc.totalCost.toLocaleString()}
                                            </div>
                                            {sc.deferralCost > 0 && (
                                                <div className="text-[9px] text-gray-400">
                                                    含延納¥{sc.deferralCost.toLocaleString()}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function buildScenario(steps: Step[], enrolled: boolean, idx: number): Scenario {
    let enrollmentFee = 0
    let deferralCost = 0
    let finalSchool = ''

    if (enrolled) {
        // Find last passed exam → that's the final school
        for (let i = steps.length - 1; i >= 0; i--) {
            if (steps[i].outcome === 'pass' || steps[i].outcome === 'start') {
                const es = steps[i].sel.exam_session
                finalSchool = es?.school?.name || ''
                enrollmentFee = es?.enrollment_fee || 0
                break
            }
        }
        // Check if earlier passed schools need deferral deposits
        const passedIndices = steps
            .map((s, i) => (s.outcome === 'pass' || s.outcome === 'start') ? i : -1)
            .filter(i => i >= 0)
        if (passedIndices.length > 1) {
            for (const pi of passedIndices.slice(0, -1)) {
                const es = steps[pi].sel.exam_session
                if (es?.deferral_available && es.deferral_deposit) {
                    deferralCost += es.deferral_deposit
                }
            }
        }
    }

    return {
        id: `sc-${idx}`,
        steps,
        totalCost: enrollmentFee + deferralCost,
        deferralCost,
        finalSchool,
        enrolled,
    }
}
