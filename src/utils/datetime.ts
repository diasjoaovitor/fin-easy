import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export const getTimestamp = () => dayjs().utc().format('YYYY-MM-DDTHH:mm:ss')

export const getPeriod = ({
  year,
  month,
  months
}: {
  year: number
  month: string
  months: string[]
}) => {
  return `${year}-${months.indexOf(month) + 1}`
}
