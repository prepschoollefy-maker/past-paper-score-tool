/**
 * pdfjs-dist でPDFを読み込み、各ページを300dpi Canvasに描画し、
 * 800px高 + 150pxオーバーラップで短冊切りしてbase64 PNGに変換する。
 */

import * as pdfjsLib from 'pdfjs-dist'

if (typeof window !== 'undefined') {
    pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'
}

export interface Strip {
    pageNum: number   // 1-based
    stripNum: number  // 1-based
    yOffset: number
    base64: string    // data URI なし、純粋な base64
    width: number
    height: number
}

export interface PageInfo {
    pageNum: number
    totalStrips: number
}

const DPI = 300
const PDF_DEFAULT_DPI = 72
const SCALE = DPI / PDF_DEFAULT_DPI

const STRIP_HEIGHT = 800
const OVERLAP = 150

/**
 * PDFファイルを読み込み、全ページの情報を返す
 */
export async function loadPdf(file: File): Promise<{ totalPages: number; pdf: pdfjsLib.PDFDocumentProxy }> {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise
    return { totalPages: pdf.numPages, pdf }
}

/**
 * 1ページを300dpi Canvasに描画し、短冊切りする
 */
export async function renderPageStrips(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageNum: number,  // 1-based
    onStrip?: (strip: Strip) => void,
): Promise<Strip[]> {
    const page = await pdf.getPage(pageNum)
    const viewport = page.getViewport({ scale: SCALE })

    // オフスクリーンCanvas作成
    const canvas = document.createElement('canvas')
    canvas.width = viewport.width
    canvas.height = viewport.height
    const ctx = canvas.getContext('2d')!

    await page.render({ canvasContext: ctx, viewport }).promise

    // 短冊切り
    const strips: Strip[] = []
    let y = 0
    let stripIdx = 1

    while (y < canvas.height) {
        const bottom = Math.min(y + STRIP_HEIGHT, canvas.height)
        const stripHeight = bottom - y

        // 短冊用の一時Canvas
        const stripCanvas = document.createElement('canvas')
        stripCanvas.width = canvas.width
        stripCanvas.height = stripHeight
        const stripCtx = stripCanvas.getContext('2d')!
        stripCtx.drawImage(canvas, 0, y, canvas.width, stripHeight, 0, 0, canvas.width, stripHeight)

        const dataUrl = stripCanvas.toDataURL('image/png')
        const base64 = dataUrl.replace(/^data:image\/png;base64,/, '')

        const strip: Strip = {
            pageNum,
            stripNum: stripIdx,
            yOffset: y,
            base64,
            width: canvas.width,
            height: stripHeight,
        }
        strips.push(strip)
        onStrip?.(strip)

        stripIdx++
        if (bottom >= canvas.height) break
        y += STRIP_HEIGHT - OVERLAP
    }

    // メモリ解放
    canvas.width = 0
    canvas.height = 0
    page.cleanup()

    return strips
}

/**
 * ページの短冊数を事前計算
 */
export function estimateStripCount(pageHeightPx: number): number {
    if (pageHeightPx <= STRIP_HEIGHT) return 1
    let y = 0
    let count = 0
    while (y < pageHeightPx) {
        count++
        const bottom = y + STRIP_HEIGHT
        if (bottom >= pageHeightPx) break
        y += STRIP_HEIGHT - OVERLAP
    }
    return count
}

/**
 * 全ページの短冊数合計を事前計算（プログレス表示用）
 */
export async function estimateTotalStrips(
    pdf: pdfjsLib.PDFDocumentProxy,
    pageRange: number[],  // 1-based
): Promise<{ perPage: PageInfo[]; total: number }> {
    const perPage: PageInfo[] = []
    let total = 0

    for (const pageNum of pageRange) {
        const page = await pdf.getPage(pageNum)
        const viewport = page.getViewport({ scale: SCALE })
        const stripCount = estimateStripCount(viewport.height)
        perPage.push({ pageNum, totalStrips: stripCount })
        total += stripCount
        page.cleanup()
    }

    return { perPage, total }
}
