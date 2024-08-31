import { useEffect, useState } from 'react'
import { instance } from '../../utils/axios'
import './Warning.css'
export interface IWarning {
  _id: string
  card: string
  desc: string
  createdAt: string
}

const WarningPage = () => {
  const [warnings, setWarnings] = useState<IWarning[]>([])
  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const { data } = await instance.get('/api/v1/warnings/getWarnings', {
          signal: controller.signal
        })
        setWarnings(data.result)
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        // Ignore
      }
    }
    fetchData()
    return () => {
      controller.abort()
    }
  }, [])

  const handleDelete = async (id: string) => {
    try {
      await instance.delete(`/api/v1/warnings/deleteWarning/${id}`)
      setWarnings(warnings.filter((item) => item._id !== id))
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      //
    }
  }
  return (
    <div>
      <h1>CẢNH BÁO</h1>
      <table cellPadding='10'>
        <thead>
          <tr>
            <th>TIME</th>
            <th>Message</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {warnings.map((item) => (
            <tr key={item._id}>
              <td>{item.createdAt}</td>
              <td>{item.desc}</td>
              <td>
                <button className='warning-button' onClick={() => handleDelete(item._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
export default WarningPage
