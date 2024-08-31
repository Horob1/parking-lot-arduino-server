import { FiEdit } from 'react-icons/fi'
import sim from './../../../assets/sim.svg'
import './Card.css'
import { ICard } from './CardList'
import toast from 'react-hot-toast'
import { instance } from '../../../utils/axios'
interface CardProps {
  card: ICard
}
export const Card = ({ card }: CardProps) => {
  const handleUpdateCard = async () => {
    // TODO: Update card and remove user from it
    try {
      await instance.patch('/api/v1/cards/' + card.uid)
      window.location.reload()
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Có lỗi')
    }
  }
  return (
    <div className='modal-content card-display'>
      <div className='card-title'>
        <h3>PARKING LOT CARD</h3>
      </div>
      <div className='main-card'>
        <div className='sim'>
          <img src={sim} alt='chip' />
        </div>
        <div className='card-details'>
          <p>UID: {card.uid}</p>
          <p>
            TYPE: {card.type} {card?.user?.name || ''}
          </p>
        </div>
      </div>
      {card.type === 'user' && card?.user?.name && (
        <button className='edit tooltip' onClick={handleUpdateCard}>
          <span className='tooltiptext'>Xoá user trên card này</span>
          <FiEdit />
        </button>
      )}
    </div>
  )
}
