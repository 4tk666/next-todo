import { format, isValid, parse, startOfDay } from 'date-fns'

type DateFormatType = 'yyyy/MM/dd HH:mm:ss' | 'yyyy/MM/dd' | 'yyyy/MM'

/**
 * 統一された日付オブジェクトを作成する
 * 将来的にタイムゾーンやロケール設定を統一的に適用するための抽象化レイヤー
 */
export function createDate(): Date {
  return new Date()
}

type FormatDateToString = {
  date: Date
  formatType?: DateFormatType
}

type FormatStringToDate = {
  dateString: string
  formatType?: DateFormatType
}

export function parseStringToDate({
  dateString,
  formatType = 'yyyy/MM/dd',
}: FormatStringToDate): Date | undefined {

  const parsedDate = parse(dateString, formatType, new Date())
  if (!isValid(parsedDate)) return
  return parsedDate
}

export function formatDateToString({
  date,
  formatType = 'yyyy/MM/dd',
}: FormatDateToString): string {
  if (!isValid(date)) return 'error: Invalid date'
  return format(date, formatType)
}

/**
 * 日付の時刻部分をリセットして日付のみを取得する関数
 * @param date 対象の日付
 * @returns 時刻がリセットされた日付（その日の0時0分0秒）
 */
export function getDateOnly(date: Date): Date {
  return startOfDay(date)
}
