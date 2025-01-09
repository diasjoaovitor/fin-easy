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
  return dayjs(`${year}-${months.indexOf(month) + 1}-01`).format('YYYY-MM')
}

export const getCurrentDate = () => dayjs().utc().format('YYYY-MM-DD')

export const getCurrentYear = () => Number(dayjs().utc().format('YYYY'))

export const getCurrentMonth = () => Number(dayjs().utc().format('MM'))

export const getCurrentPeriod = () => dayjs().utc().format('YYYY-MM')
