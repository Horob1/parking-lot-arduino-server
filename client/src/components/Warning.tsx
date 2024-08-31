import './Warning.css'

import React from 'react'

interface FireAlertModalProps {
  isOpen: boolean
  onClose: () => void
}

const FireAlertModal: React.FC<FireAlertModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null

  return (
    <div className='modal-overlay-warning'>
      <div className='modal-content-warning'>
        <h2
          style={{
            fontSize: '20px'
          }}
        >
          Đã phát hiện nhiệt độ cao. Hãy rời khỏi khu vực ngay lập tức!
        </h2>
        <button onClick={onClose} className='close-button-warning'>
          X
        </button>
      </div>
    </div>
  )
}

export default FireAlertModal
