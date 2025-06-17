import { format, isValid, parse, startOfDay } from 'date-fns'
import { formatInTimeZone, fromZonedTime } from 'date-fns-tz';

type DateFormatType = 'yyyy/MM/dd HH:mm:ss' | 'yyyy/MM/dd' | 'yyyy/MM'

export function getCurrentJSTDate(): Date {
  const now = new Date();
  return fromZonedTime(now, 'Asia/Tokyo');
}



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

/**
 * 指定された期日が現在日時を超過しているかを判定します
 * @param dueDate - 期日の文字列（yyyy/MM/dd形式）
 * @returns 期日を超過している場合はtrue、そうでない場合はfalse
 */
export function isDateOverdue(dueDate: string): boolean {
  if (!dueDate) return false
  
  const parsedDueDate = parseStringToDate({ dateString: dueDate })
  if (!parsedDueDate) return false
  
  const today = getDateOnly(createDate())
  const dueDateOnly = getDateOnly(parsedDueDate)
  
  return dueDateOnly < today
}
