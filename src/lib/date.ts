/** 図面の日付欄と同じ YYYY-MM-DD 形式（日本時間）で表示する */
export const formatDate = (iso: string): string =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
