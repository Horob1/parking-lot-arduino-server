import nodemailer from 'nodemailer'
import { env } from '~/config/environment'

const transporter = nodemailer.createTransport({
  host: env.EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: env.SENDER_EMAIL, // ---------- my email
    pass: env.EMAIL_PASSWORD // ---------- app password
  }
})

const mailOptions = (logs: string, status: string, date: string) => {
  return {
    from: 'parking-lot@gmail.com',
    to: 'nguyentheanh24102003@gmail.com',
    subject: `Logs of parkinglot ${date}`,
    attachments: [
      {
        filename: 'logs.xlsx', // Tên tệp đính kèm
        path: logs // Đường dẫn đến tệp cần gửi
      },
      {
        filename: 'status-logs.xlsx',
        path: status
      }
    ]
  }
}

export const sendEmail = async (logs: string, status: string, date: string) => {
  const options = mailOptions(logs, status, date)
  await transporter.sendMail(options)
}
