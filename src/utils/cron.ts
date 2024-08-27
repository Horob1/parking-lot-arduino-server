import { exec } from 'child_process'
import { unlinkSync, writeFileSync } from 'fs'
import json2xls from 'json2xls'
import path from 'path'
import { LOG_COLLECTION_NAME, STATUS_LOG_COLLECTION_NAME } from '~/config/collections'
import { getDB } from '~/config/mongodb'
import { sendEmail } from './mailer'

export const sendLogAtEndOfDays = async () => {
  try {
    const currentDate = new Date()

    // Tính toán thời gian bắt đầu và kết thúc của ngày hôm qua
    const startOfYesterday = new Date(currentDate)
    startOfYesterday.setDate(currentDate.getDate() - 1)
    startOfYesterday.setHours(0, 0, 0, 0) // Đặt giờ về 00:00:00.000

    const endOfYesterday = new Date(startOfYesterday)
    endOfYesterday.setHours(23, 59, 59, 999) // Đặt giờ về 23:59:59.999

    const year = startOfYesterday.getFullYear()
    const month = String(startOfYesterday.getMonth() + 1).padStart(2, '0') // Tháng bắt đầu từ 0
    const day = String(startOfYesterday.getDate()).padStart(2, '0')

    const formattedDate = `${year}-${month}-${day}`

    const logs = await getDB()
      .collection(LOG_COLLECTION_NAME)
      .find({
        createdAt: {
          $gte: startOfYesterday,
          $lt: endOfYesterday
        }
      })
      .toArray()
    const statusLogs = await getDB()
      .collection(STATUS_LOG_COLLECTION_NAME)
      .find({
        createdAt: {
          $gte: startOfYesterday,
          $lt: endOfYesterday
        }
      })
      .toArray()

    const xls = json2xls(logs)
    const statusXls = json2xls(statusLogs)
    const statusXlsFileName = path.join('logs', `status-${formattedDate}`)
    const logsXlsFileName = path.join('logs', `logs-${formattedDate}`)
    writeFileSync(logsXlsFileName, xls, 'binary')
    writeFileSync(statusXlsFileName, statusXls, 'binary')
    //gửi file
    await sendEmail(logsXlsFileName, statusXlsFileName, formattedDate)
    //xoá
    unlinkSync(logsXlsFileName)
    unlinkSync(statusXlsFileName)
  } catch (error) {
    console.error('Error sending log at end of days: ', error)
  }
}
