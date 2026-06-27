export const uploadImage = async (file) => {
  const formData = new FormData()
  formData.append('image', file)
  const res = await fetch(
    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`,
    { method: 'POST', body: formData }
  )
  const data = await res.json()
  if (!data.success) throw new Error('Image upload failed')
  return data.data.url
}
