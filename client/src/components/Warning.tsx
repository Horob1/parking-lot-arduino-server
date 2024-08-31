import './Warning.css'

import React from 'react'

interface FireAlertModalProps {
  isOpen: boolean

}

const FireAlertModal: React.FC<FireAlertModalProps> = ({ isOpen }) => {
  if (!isOpen) return null

  return (
    <div className='modal-overlay-warning'>
      <div className='modal-content-warning'>
        
        <h2 style={{
          fontSize: '20px',
        }}>Đã phát hiện nhiệt độ cao. Hãy rời khỏi khu vực ngay lập tức!</h2>
      </div>
    </div>
  )
}

export default FireAlertModal
