import './Warning.css'

import React from 'react'

interface FireAlertModalProps {
  isOpen: boolean

}

const FireAlertModal: React.FC<FireAlertModalProps> = ({ isOpen }) => {
  if (!isOpen) return null

  return (
    <div className='modal-overlay'>
      <div className='modal-content'>
        <h2>Cảnh Báo Cháy!</h2>
        <p>Đã phát hiện nhiệt độ cao. Hãy rời khỏi khu vực ngay lập tức!</p>
      </div>
    </div>
  )
}

export default FireAlertModal
