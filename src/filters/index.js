import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'
import relativeTime from 'dayjs/plugin/relativeTime'
dayjs.locale('zh-cn')
dayjs.extend(relativeTime)
export const dateFormat = (time) => {
  return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
}