import { useEffect, useState } from 'react'
import { Trash2, Users } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAxiosSecure } from '../../../hooks/useAxiosSecure'
import { useAuth } from '../../../contexts/AuthContext'

const PAGE_SIZE = 10

const ROLE_STYLE = {
  user: 'bg-info/10 text-info',
  librarian: 'bg-warning/10 text-warning',
  admin: 'bg-error/10 text-error',
}

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

  if (loading) return <div className="space-y-3">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-14 bg-base-200 rounded-2xl animate-pulse" />)}</div>

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-base-content">Manage Users</h1>
        <span className="text-sm text-base-content/40">{total} users</span>
      </div>

      <div className="bg-base-100 border border-base-200 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-base-200 border-b border-base-300">
                {['User', 'Email', 'Role', 'Joined', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-5 py-3.5 text-xs font-semibold uppercase tracking-wide text-base-content/50">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-base-200">
              {users.map((u) => {
                const isSelf = u._id === currentUser?._id
                const initials = u.name?.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2) || 'U'
                return (
                  <tr key={u._id} className={`transition-colors ${isSelf ? 'bg-primary/5' : 'hover:bg-base-200/40'}`}>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-primary text-xs font-bold shrink-0">
                          {u.photoURL ? <img src={u.photoURL} alt={u.name} className="w-full h-full object-cover" /> : initials}
                        </div>
                        <span className="font-medium text-base-content">
                          {u.name}
                          {isSelf && <span className="text-xs text-base-content/40 ml-1.5">(you)</span>}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-base-content/60 max-w-[180px] truncate">{u.email}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium capitalize ${ROLE_STYLE[u.role] || 'bg-base-200 text-base-content'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-base-content/50">
                      {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '-'}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          disabled={isSelf}
                          className="border border-base-300 focus:border-primary rounded-lg px-2 py-1.5 text-xs bg-base-100 outline-none focus:ring-1 focus:ring-primary/20 disabled:opacity-40 cursor-pointer"
                        >
                          <option value="user">user</option>
                          <option value="librarian">librarian</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          onClick={() => !isSelf && setDeleteId(u._id)}
                          disabled={isSelf}
                          className="w-8 h-8 rounded-lg bg-error/10 text-error/70 hover:bg-error/20 hover:text-error flex items-center justify-center transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
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

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-5">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`w-9 h-9 rounded-xl text-sm font-medium transition-colors cursor-pointer ${p === page ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content/60 hover:bg-base-300'}`}
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {deleteId && (
        <div className="modal modal-open">
          <div className="modal-box rounded-2xl bg-base-100">
            <h3 className="font-display text-lg text-base-content mb-2">Delete User</h3>
            <p className="text-base-content/60 text-sm mb-6">Are you sure? All their data will be permanently removed.</p>
            <div className="flex justify-end gap-3">
              <button className="border border-base-300 text-base-content/60 px-5 py-2 rounded-xl text-sm cursor-pointer" onClick={() => setDeleteId(null)}>Cancel</button>
              <button className="bg-error text-white px-5 py-2 rounded-xl text-sm cursor-pointer hover:opacity-90" onClick={handleDelete}>Delete</button>
            </div>
          </div>
          <div className="modal-backdrop" onClick={() => setDeleteId(null)} />
        </div>
      )}
    </div>
  )
}

export default ManageUsers
