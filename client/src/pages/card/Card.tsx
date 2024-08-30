import { useState } from 'react'
import './Card.css'
import CreateCardModal from './components/CreateCardModal'
import { CardList } from './components/CardList'

export const Card = () => {
  const [isModalOpen, setModalOpen] = useState(false)

  const openModal = () => {
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
  }

  return (
    <>
      <div>
        <button className='plus-button' onClick={openModal}>
          Thêm CARD 💳
        </button>
        <CreateCardModal isOpen={isModalOpen} onClose={closeModal} />
      </div>
      <CardList></CardList>
    </>
  )
}
