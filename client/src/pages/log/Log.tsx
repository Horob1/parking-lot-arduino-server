import { useState } from 'react'
import DatePicker from 'react-date-picker'
import 'react-date-picker/dist/DatePicker.css'
import 'react-calendar/dist/Calendar.css'
import './Log.css'
type ValuePiece = Date | null

type Value = ValuePiece | [ValuePiece, ValuePiece]

export const Log = () => {
  const [value, onChange] = useState<Value>(new Date())
  return (
    <div className='log-container'>
      <h1>Lịch sử trạng thái xe</h1>
      <div className='log-card'>
        <DatePicker onChange={onChange} value={value} />
        <button>Tải xuống</button>
      </div>
      <h1>Lịch sử ra/vào </h1>
      <div className='log-card'>
        <DatePicker onChange={onChange} value={value} />
        <button>Tải xuống</button>
      </div>
    </div>
  )
}
