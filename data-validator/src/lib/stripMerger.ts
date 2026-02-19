/**
 * 短冊切り結果の重複排除・結合 (merger.py の TypeScript 移植)
 */

export interface CellValue {
    value: string
    confidence: 'high' | 'medium' | 'low'
    reason?: string
}

export interface Row {
    [key: string]: CellValue | { page?: number; strip?: number; y_offset?: number }
}

export interface StripResult {
    rows: Row[]
    warnings: string[]
    _meta?: { page: number; strip: number; y_offset?: number }
}

export interface MergeStats {
    totalRaw: number
    duplicatesMerged: number
    finalCount: number
}

function normalizeSchoolName(name: string): string {
    if (!name) return ''
    // NFKC正規化
    name = name.normalize('NFKC')
    // 全角/半角スペース除去
    name = name.replace(/\s+/g, '')
    // 中学校/中学/中等教育学校 を除去して比較
    name = name.replace(/(中学校|中学|中等教育学校)$/, '')
    // 大学附属/大学付属/大附属 の統一
    name = name.replace(/大学附属$/, '大附属')
    name = name.replace(/大学付属$/, '大附属')
    return name
}

function normalizeRound(roundVal: string): string {
    if (!roundVal) return ''
    roundVal = roundVal.normalize('NFKC')
    roundVal = roundVal.replace(/\s+/g, '')
    return roundVal
}

function getCellValue(cell: unknown): CellValue {
    if (cell && typeof cell === 'object' && 'value' in cell) {
        const c = cell as CellValue
        return {
            value: String(c.value ?? ''),
            confidence: c.confidence || 'low',
            reason: c.reason,
        }
    }
    if (cell == null) return { value: '', confidence: 'low' }
    return { value: String(cell), confidence: 'medium' }
}

function rowsMatch(rowA: Row, rowB: Row): boolean {
    const nameA = normalizeSchoolName(getCellValue(rowA['学校名']).value)
    const nameB = normalizeSchoolName(getCellValue(rowB['学校名']).value)
    const roundA = normalizeRound(getCellValue(rowA['回']).value)
    const roundB = normalizeRound(getCellValue(rowB['回']).value)

    if (!nameA || !nameB) return false
    return nameA === nameB && roundA === roundB
}

function pickBetterValue(cellA: CellValue, cellB: CellValue): CellValue {
    const confOrder: Record<string, number> = { high: 3, medium: 2, low: 1 }
    const confA = confOrder[cellA.confidence] ?? 0
    const confB = confOrder[cellB.confidence] ?? 0

    // 片方が空で他方に値がある場合は値のある方を優先
    if (cellA.value && !cellB.value) return cellA
    if (cellB.value && !cellA.value) return cellB

    return confA >= confB ? cellA : cellB
}

function mergeDuplicateRows(rowA: Row, rowB: Row): Row {
    const merged: Row = {}
    const allKeys = new Set([...Object.keys(rowA), ...Object.keys(rowB)])

    for (const key of allKeys) {
        if (key.startsWith('_')) continue
        const cellA = getCellValue(rowA[key])
        const cellB = getCellValue(rowB[key])
        merged[key] = pickBetterValue(cellA, cellB)
    }
    return merged
}

/**
 * 全短冊の結果を重複排除しながら結合
 */
export function mergeStripResults(allResults: StripResult[]): { rows: Row[]; stats: MergeStats } {
    const mergedRows: Row[] = []
    const stats: MergeStats = { totalRaw: 0, duplicatesMerged: 0, finalCount: 0 }

    for (const stripResult of allResults) {
        const rows = stripResult.rows || []
        stats.totalRaw += rows.length

        for (const row of rows) {
            let foundDup = false
            const checkRange = Math.min(mergedRows.length, 10)
            const startIdx = mergedRows.length - checkRange

            for (let i = startIdx; i < mergedRows.length; i++) {
                if (i < 0) continue
                if (rowsMatch(mergedRows[i], row)) {
                    mergedRows[i] = mergeDuplicateRows(mergedRows[i], row)
                    stats.duplicatesMerged++
                    foundDup = true
                    break
                }
            }

            if (!foundDup) {
                mergedRows.push(row)
            }
        }
    }

    stats.finalCount = mergedRows.length
    return { rows: mergedRows, stats }
}

/**
 * 全短冊のwarningsを収集
 */
export function collectWarnings(allResults: StripResult[]): string[] {
    const warnings: string[] = []
    for (const result of allResults) {
        const meta = result._meta
        const prefix = `p${meta?.page ?? '?'}-s${meta?.strip ?? '?'}`
        for (const w of result.warnings || []) {
            warnings.push(`[${prefix}] ${w}`)
        }
    }
    return warnings
}

/**
 * confidence情報を収集してレポート用データを生成
 */
export interface ConfidenceIssue {
    row: number
    school: string
    round: string
    column: string
    value: string
    confidence: string
    reason: string
}

export function collectConfidenceIssues(mergedRows: Row[]): ConfidenceIssue[] {
    const issues: ConfidenceIssue[] = []
    for (let i = 0; i < mergedRows.length; i++) {
        const row = mergedRows[i]
        const school = getCellValue(row['学校名']).value
        const roundVal = getCellValue(row['回']).value

        for (const [colName, cell] of Object.entries(row)) {
            if (colName.startsWith('_')) continue
            if (!cell || typeof cell !== 'object' || !('confidence' in cell)) continue
            const c = cell as CellValue
            if (c.confidence === 'medium' || c.confidence === 'low') {
                issues.push({
                    row: i + 1,
                    school,
                    round: roundVal,
                    column: colName,
                    value: c.value,
                    confidence: c.confidence,
                    reason: c.reason || '',
                })
            }
        }
    }
    return issues
}
