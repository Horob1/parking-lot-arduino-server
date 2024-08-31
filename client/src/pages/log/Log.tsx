import { useState } from 'react'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import './Log.css'
import Papa from 'papaparse'
import { instance } from '../../utils/axios'
import toast from 'react-hot-toast'
type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

export const Log = () => {
  const [value, onChange] = useState<Value>(new Date())
  const handleButtonDownload = async () => {
    try {
      const date = new Date(value as Date)
      const year = date.getFullYear()
      const month = date.getMonth() + 1 // Months are zero-based (0 = January, 1 = February, etc.)
      const day = date.getDate()

      const { data } = await instance.get(`/api/v1/logs/logsByDate/${year}-${month}-${day}`)
      // Dynamically import json2csv
      // Convert JSON to CSV using PapaParse
      if (!data.result) return toast.error("NO DATA!")
         const csv = Papa.unparse(data.result || [])

      // Create a Blob from the CSV data

      // Create a Blob from the CSV data
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })

      // Create a link element to trigger the download
      const link = document.createElement('a')
      const url = URL.createObjectURL(blob)
      link.href = url
      link.setAttribute('download', `${year}-${month}-${day}.csv`)

      // Append the link to the body and trigger the download
      document.body.appendChild(link)
      link.click()

      // Clean up the link
      document.body.removeChild(link)
      toast.success('Đã tải xuống file log thành công!')
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      //do something
    }
  }
  return (
    <div className='log-container'>
      <h1>Lịch sử ra/vào </h1>
      <div className='log-card'>
        <DatePicker onChange={onChange} value={value} />
        <button onClick={handleButtonDownload}>Tải xuống</button>
      </div>
    </div>
  )
}
