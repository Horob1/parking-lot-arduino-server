import { MONEY_PER_HOUR } from '~/constants/common'

export const getBill = (date: string) => {
  const isoTimestamp = new Date(date).getTime()
  const nowTimestamp = Date.now()
  const difference = nowTimestamp - isoTimestamp

  const money = Math.ceil(difference / 3600000) * MONEY_PER_HOUR

  return money
}
