import { useEffect, useState } from 'react'
import { Card } from './Card'
import './CardList.css'
import { instance } from '../../../utils/axios'
export interface ICard {
  _id?: string
  uid: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any
  type: string
  createdAt?: Date
}
export const CardList = () => {
  const [cards, setCards] = useState<ICard[]>([])
  useEffect(() => {
    const controller = new AbortController()
    const fetchData = async () => {
      try {
        const { data } = await instance.get('/api/v1/cards', {
          signal: controller.signal
        })
        setCards(data.result)
      } catch (error) {
        // Ignore
        console.log(error)
      }
    }
    fetchData()
    return () => {
      controller.abort()
    }
  }, [])

  return (
    <div className='card-list-container'>
      {cards.map((card) => (
        <Card key={card._id} card={card}></Card>
      ))}
    </div>
  )
}
