import { useEffect, useState } from 'react'
import { Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import { useAuth } from '../../../contexts/AuthContext'

const PAGE_SIZE = 10

const roleBadge = { user: 'badge-primary', librarian: 'badge-secondary', admin: 'badge-accent' }

const ManageUsers = () => {
  const axiosSecure = useAxiosSecure()
  const { user: currentUser } = useAuth()
  const [users, setUsers] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [deleteId, setDeleteId] = useState(null)

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const fetchUsers = (p = 1) => {
    setLoading(true)
    axiosSecure.get(`/api/admin/users?page=${p}&limit=${PAGE_SIZE}`)
      .then((res) => {
        setUsers(res.data?.users || res.data || [])
        setTotal(res.data?.total || 0)
      })
      .catch(() => toast.error('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchUsers(page) }, [page])

  const handleRoleChange = async (userId, newRole) => {
    if (userId === currentUser?._id) return toast.error("You can't change your own role")
    try {
      await axiosSecure.patch(`/api/admin/users/${userId}/role`, { role: newRole })
      setUsers((u) => u.map((usr) => usr._id === userId ? { ...usr, role: newRole } : usr))
      toast.success('Role updated')
    } catch {
      toast.error('Role update failed')
    }
  }

  const handleDelete = async () => {
    try {
      await axiosSecure.delete(`/api/admin/users/${deleteId}`)
      fetchUsers(page)
      toast.success('User deleted')
    } catch {
      toast.error('Delete failed')
    }
    setDeleteId(null)
  }

  if (loading) return <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 bg-base-200 rounded-xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-display font-bold">Manage Users</h1>
        <span className="badge badge-neutral">{total} total</span>
      </div>

      <div className="card bg-base-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const isSelf = u._id === currentUser?._id
                const initials = u.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'U'
                return (
                  <tr key={u._id} className={`hover ${isSelf ? 'bg-base-300/50' : ''}`}>
                    <td>
                      <div className="flex items-center gap-2">
                        {u.photoURL ? (
                          <img src={u.photoURL} alt={u.name} className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">{initials}</div>
                        )}
                        <span className="font-medium text-sm">{u.name}{isSelf && <span className="text-xs text-base-content/40 ml-1">(you)</span>}</span>
                      </div>
                    </td>
                    <td className="text-sm text-base-content/70 max-w-[160px] truncate">{u.email}</td>
                    <td>
                      <span className={`badge badge-sm ${roleBadge[u.role] || 'badge-ghost'} capitalize`}>{u.role}</span>
                    </td>
                    <td className="text-xs text-base-content/50">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={isSelf}
                          className="select select-bordered select-xs"
                        >
                          <option value="user">user</option>
                          <option value="librarian">librarian</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          onClick={() => !isSelf && setDeleteId(u._id)}
                          disabled={isSelf}
                          className={`btn btn-ghost btn-xs text-error ${isSelf ? 'opacity-30 cursor-not-allowed' : ''}`}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button key={p} onClick={() => setPage(p)} className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-ghost'}`}>{p}</button>
          ))}
        </div>
      )}

      {/* Delete modal */}
      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-2">Delete User</h3>
            <p className="text-base-content/60 mb-6">Are you sure? All their data will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button className="btn btn-ghost" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="btn btn-error" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </div>
      )}
    </div>
  )
}

export default ManageUsers
