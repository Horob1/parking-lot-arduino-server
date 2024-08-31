import React, { useState, useEffect } from 'react'
import Modal from 'react-modal'
import './User.css'
import { instance } from '../../utils/axios'
import toast from 'react-hot-toast'

interface User {
  _id?: string
  name: string
  cccd: string
  phone: string
  createdAt?: Date
  updatedAt?: Date
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  card: any
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
    const controller = new AbortController()
    const fetchUsers = async () => {
      try {
        const response = await instance.get('/api/v1/users', { signal: controller.signal })
        setUsers(response.data.result)
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }
    fetchUsers()
    return () => {
      controller.abort()
    }
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
    setEditUser({ ...user, card: user?.card?.uid || '' })
    setIsUpdateModalOpen(true)
  }

  const handleCreateUser = async () => {
    try {
      if (newUser.name !== '' && newUser.cccd !== '' && newUser.phone !== '') {
        await instance.post(`/api/v1/users`, { ...newUser })
        const newUserWithId = {
          ...newUser,
          _id: String(users.length + 1),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        setUsers([...users, newUserWithId])
        setIsCreateModalOpen(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      //
      toast.error('Có lỗi!')
    }
  }

  const handleUpdateUser = async () => {
    try {
      if (editUser) {
        const oldCard = users.find((user) => user._id === editUser._id)?.card?.uid || ''
        await instance.patch(`/api/v1/users/${editUser._id}`, { ...editUser, oldCard })
        setUsers(users.map((user) => (user._id === editUser._id ? { ...user, card: { uid: editUser.card } } : user)))
        setIsUpdateModalOpen(false)
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      //
      toast.error('Có lỗi!')
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
          {users &&
            users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.cccd}</td>
                <td>{user.phone}</td>
                <td>{user?.card?.uid || ''}</td>
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
