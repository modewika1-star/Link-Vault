import { useLayoutEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import useDemoAuthStore from '../features/auth/store/useDemoAuthStore.js'

export default function LogoutPage() {
  const navigate = useNavigate()
  const signOut = useDemoAuthStore((state) => state.signOut)

  useLayoutEffect(() => {
    signOut()
    navigate('/', { replace: true })
  }, [navigate, signOut])

  return null
}
