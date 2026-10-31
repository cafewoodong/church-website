/**
 * 올리기 전에 사진을 적당한 크기로 줄인다.
 *
 * 주보를 휴대폰으로 찍거나 스캔해서 올리면 2000px, 1.3MB 짜리 PNG 가 그대로
 * 저장된다. 카카오톡 미리보기 수집기가 이 파일을 직접 받아가기 때문에 공유할
 * 때마다 느리고, 교인들이 주보를 볼 때도 그만큼을 내려받는다.
 *
 * Supabase 의 이미지 변환 기능은 유료라 쓸 수 없어서, 브라우저에서 줄여
 * 올린다. 주보는 글씨를 읽어야 하므로 너무 줄이지 않는다.
 */

/** 긴 변 기준 최대 크기. 주보 글씨가 읽혀야 해서 넉넉히 둔다. */
const MAX_EDGE = 1800

/** 이보다 작으면 그대로 올린다 */
const SKIP_UNDER_BYTES = 400 * 1024

/** webp 를 만들 수 있는 브라우저인지 (사파리 구버전 대비) */
function pickType() {
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = 1
  return canvas.toDataURL('image/webp').startsWith('data:image/webp')
    ? { type: 'image/webp', ext: 'webp', quality: 0.85 }
    : { type: 'image/jpeg', ext: 'jpg', quality: 0.88 }
}

function toBlob(canvas, type, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
}

/**
 * @param {File} file 사용자가 고른 원본
 * @returns {Promise<File>} 줄인 파일. 줄일 수 없거나 이득이 없으면 원본 그대로.
 */
export async function resizeImage(file) {
  if (!file.type.startsWith('image/') || file.type === 'image/gif') return file

  let bitmap
  try {
    bitmap = await createImageBitmap(file)
  } catch {
    return file // 못 읽는 형식이면 원본을 올린다
  }

  const { width, height } = bitmap
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height))

  // 이미 작고 가벼우면 손대지 않는다
  if (scale === 1 && file.size <= SKIP_UNDER_BYTES) {
    bitmap.close?.()
    return file
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
  bitmap.close?.()

  const { type, ext, quality } = pickType()
  const blob = await toBlob(canvas, type, quality)

  // 줄였는데 오히려 커졌다면 원본이 낫다
  if (!blob || blob.size >= file.size) return file

  const base = file.name.replace(/\.[^.]+$/, '')
  return new File([blob], `${base}.${ext}`, { type })
}
