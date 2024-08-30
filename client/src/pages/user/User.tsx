import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import './User.css'

interface User {
  _id?: string
  name: string
  cccd: string
  phone: string
  createdAt?: Date
  updatedAt?: Date
  card: string
}

export const User: React.FC = () => {

  const [users, setUsers] = useState<User[]>([])

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<User>({
    name: '',
    cccd: '',
    phone: '',
    card: ''
  })

  useEffect(() => {
    // Sử dụng dữ liệu giả thay vì gọi API
    const fakeUsers: User[] = [
      {
        _id: '1',
        name: 'Nguyễn Văn A',
        cccd: '012345678901',
        phone: '0909123456',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-08-01'),
        card: '1234567890'
      },
      {
        _id: '2',
        name: 'Trần Thị B',
        cccd: '987654321012',
        phone: '0909765432',
        createdAt: new Date('2023-02-01'),
        updatedAt: new Date('2023-08-02'),
        card: '2345678901'
      },
      {
        _id: '3',
        name: 'Lê Văn C',
        cccd: '123456789098',
        phone: '0909345678',
        createdAt: new Date('2023-03-01'),
        updatedAt: new Date('2023-08-03'),
        card: '3456789012'
      },
      // Thêm nhiều user hơn nếu cần
      {
        _id: '4',
        name: 'Phạm Thị D',
        cccd: '111122223333',
        phone: '0911222333',
        createdAt: new Date('2023-04-01'),
        updatedAt: new Date('2023-08-04'),
        card: '4567890123'
      },
      {
        _id: '5',
        name: 'Hoàng Văn E',
        cccd: '444455556666',
        phone: '0933444555',
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-08-05'),
        card: '5678901234'
      },
      {
        _id: '6',
        name: 'Nguyễn Văn F',
        cccd: '777788889999',
        phone: '0909999888',
        createdAt: new Date('2023-06-01'),
        updatedAt: new Date('2023-08-06'),
        card: '6789012345'
      },
      {
        _id: '7',
        name: 'Trần Thị G',
        cccd: '888899990000',
        phone: '0900888999',
        createdAt: new Date('2023-07-01'),
        updatedAt: new Date('2023-08-07'),
        card: '7890123456'
      }
      // Và nhiều người dùng khác...
    ]
    setUsers(fakeUsers)
  }, [])

  const openCreateModal = () => {
    setNewUser({
      name: '',
      cccd: '',
      phone: '',
      card: ''
    })
    setIsCreateModalOpen(true)
  }

  const openUpdateModal = (user: User) => {
    setEditUser(user)
    setIsUpdateModalOpen(true)
  }

  const handleCreateUser = () => {
    const newUserWithId = { ...newUser, _id: String(users.length + 1) }
    setUsers([...users, newUserWithId])
    setIsCreateModalOpen(false)
  }

  const handleUpdateUser = () => {
    if (editUser) {
      setUsers(users.map((user) => (user._id === editUser._id ? editUser : user)))
      setIsUpdateModalOpen(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const { name, value } = e.target
    if (isEdit && editUser) {
      setEditUser({ ...editUser, [name]: value })
    } else {
      setNewUser({ ...newUser, [name]: value })
    }
  }

  return (
    <div className='user-list'>
      <h2>Danh Sách Người Dùng</h2>
      <button onClick={openCreateModal} className='create-button'>
        Tạo Người Dùng
      </button>
      <table className='user-table'>
        <thead>
          <tr>
            <th>Tên</th>
            <th>CCCD</th>
            <th>Điện Thoại</th>
            <th>Thẻ</th>
            <th>Ngày Tạo</th>
            <th>Ngày Cập Nhật</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.cccd}</td>
              <td>{user.phone}</td>
              <td>{user.card}</td>
              <td>{user.createdAt?.toLocaleString()}</td>
              <td>{user.updatedAt?.toLocaleString()}</td>
              <td>
                <button onClick={() => openUpdateModal(user)} className='edit-button'>
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Tạo Người Dùng */}
      <Modal isOpen={isCreateModalOpen} onRequestClose={() => setIsCreateModalOpen(false)} className='modal'>
        <h2>Tạo Người Dùng</h2>
        <form>
          <label>Tên:</label>
          <input type='text' name='name' value={newUser.name} onChange={handleInputChange} />
          <label>CCCD:</label>
          <input type='text' name='cccd' value={newUser.cccd} onChange={handleInputChange} />
          <label>Điện Thoại:</label>
          <input type='text' name='phone' value={newUser.phone} onChange={handleInputChange} />
          <label>Thẻ:</label>
          <input type='text' name='card' value={newUser.card} onChange={handleInputChange} />
          <button type='button' onClick={handleCreateUser} className='save-button'>
            Lưu
          </button>
          <button type='button' onClick={() => setIsCreateModalOpen(false)} className='cancel-button'>
            Hủy
          </button>
        </form>
      </Modal>

      {/* Modal Cập Nhật Người Dùng */}
      <Modal isOpen={isUpdateModalOpen} onRequestClose={() => setIsUpdateModalOpen(false)} className='modal'>
        <h2>Cập Nhật Người Dùng</h2>
        <form>
          <label>Tên:</label>
          <input type='text' name='name' value={editUser?.name} onChange={(e) => handleInputChange(e, true)} />
          <label>CCCD:</label>
          <input type='text' name='cccd' value={editUser?.cccd} onChange={(e) => handleInputChange(e, true)} />
          <label>Điện Thoại:</label>
          <input type='text' name='phone' value={editUser?.phone} onChange={(e) => handleInputChange(e, true)} />
          <label>Thẻ:</label>
          <input type='text' name='card' value={editUser?.card} onChange={(e) => handleInputChange(e, true)} />
          <button type='button' onClick={handleUpdateUser} className='save-button'>
            Lưu
          </button>
          <button type='button' onClick={() => setIsUpdateModalOpen(false)} className='cancel-button'>
            Hủy
          </button>
        </form>
      </Modal>
    </div>
  )
}
