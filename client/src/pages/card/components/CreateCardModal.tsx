import React, { useState } from 'react'
import './CreateCardModal.css'
import { IoClose } from 'react-icons/io5'
import sim from './../../../assets/sim.svg'
import toast from 'react-hot-toast'
import { instance } from '../../../utils/axios'

interface CreateCardProps {
  isOpen: boolean
  onClose: () => void
}

const CreateCardModal: React.FC<CreateCardProps> = ({ isOpen, onClose }) => {
  const [newCard, setNewCard] = useState<{ uid: string; type: string }>({
    uid: '',
    type: 'user'
  })
  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCard({ ...newCard, type: event.target.value }) // Update state with the selected value
  }
  const handleCreateCard = async () => {
    try {
      await instance.post('/api/v1/cards', newCard)
      window.location.reload()

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      //
      toast.error('Có lỗi!')
    }
  }
  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div>
        <div className='modal-content'>
          <form>
            <div className='card-title'>
              <h3>PARKING LOT CARD</h3>
            </div>
            <div className='main-card'>
              <div className='sim'>
                <img src={sim} alt='chip' />
              </div>
              <div className='card-uid'>
                <input
                  type='text'
                  onChange={(e) => setNewCard({ ...newCard, uid: e.target.value })}
                  placeholder='Type uid'
                />
              </div>
              <div className='card-type'>
                <select name='card-type' id='create-type' value={newCard.type} onChange={handleTypeChange}>
                  <option value='user'>user</option>
                  <option value='guest'>guest</option>
                </select>
              </div>
            </div>
          </form>
        </div>
        <div className='create-option'>
          <button type='submit' onClick={handleCreateCard}>
            CREATE
          </button>
          <button onClick={onClose}>CANCEL</button>
        </div>
      </div>
      <button className='close-button' onClick={onClose}>
        <IoClose />
      </button>
    </div>
  )
}

export default CreateCardModal
