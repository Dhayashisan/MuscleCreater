/**
 * UTCのtimestamp文字列を日本時間(JST)に変換
 * @param {string} utcString - 例: "2026-02-03T10:12:00.000Z"
 * @returns {string} - "2026/02/03 19:12"
 */
export const toJST = (utcString) => {
  if (!utcString) return ''

  const date = new Date(utcString)

  return date.toLocaleString('ja-JP', {
    timeZone: 'Asia/Tokyo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
}