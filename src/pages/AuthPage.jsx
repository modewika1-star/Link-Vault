import { useEffect, useRef, useState } from 'react'
import { useFormik } from 'formik'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  FiArrowLeft, FiArrowRight, FiCheckCircle, FiEye, FiEyeOff,
  FiKey, FiLock, FiLogIn, FiMail, FiSend, FiShield,
  FiUser, FiUserPlus,
} from 'react-icons/fi'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../features/auth/validation/authSchemas.js'
import useDemoAuthStore from '../features/auth/store/useDemoAuthStore.js'
import './AuthPage.css'

const pageConfig = {
  register: {
    badge: 'Free Vault Account',
    badgeIcon: 'user',
    title: 'Create your account',
    subtitle: 'Join LinkVault to store, tag, and organize all your essential bookmarks in one secure vault.',
  },
  login: {
    badge: 'Secure Sign In',
    badgeIcon: 'shield',
    title: 'Welcome back',
    subtitle: 'Sign in to your LinkVault account to access your saved links and collections.',
  },
  'forgot-password': {
    badge: 'Password Recovery',
    badgeIcon: 'key',
    title: 'Reset your password',
    subtitle: 'Forgot your password? Enter your email address and we will send you a 6-digit verification code to reset it.',
  },
  'verify-code': {
    badge: 'Identity Verification',
    badgeIcon: 'shield',
    title: 'Enter verification code',
    subtitle: 'We sent a 6-digit confirmation code to your email. Enter it below to verify your identity.',
  },
  'reset-password': {
    badge: 'Security Verification',
    badgeIcon: 'key',
    title: 'Reset Your Password',
    subtitle: 'Enter your 6-digit OTP code and choose a new secure password for your vault.',
  },
}

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const signIn = useDemoAuthStore((state) => state.signIn)
  const register = useDemoAuthStore((state) => state.register)
  const emailFromFlow = location.state?.email || ''
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [notice, setNotice] = useState(location.state?.message || '')
  const [code, setCode] = useState('')
  const [secondsLeft, setSecondsLeft] = useState(36)
  const codeRefs = useRef([])
  const config = pageConfig[mode] || pageConfig.login
  const isRegister = mode === 'register'
  const isLogin = mode === 'login'
  const isForgot = mode === 'forgot-password'
  const isVerify = mode === 'verify-code'
  const isReset = mode === 'reset-password'
  const emailLabel = isReset ? 'Verified Email' : isVerify ? 'Email address' : 'Email address'

  useEffect(() => {
    setNotice(location.state?.message || '')
  }, [mode, location.state])

  useEffect(() => {
    if (!isVerify || secondsLeft <= 0) return undefined
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1))
    }, 1000)
    return () => window.clearInterval(timer)
  }, [isVerify, secondsLeft])

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: isRegister
      ? { fullName: '', email: '', password: '', confirmPassword: '', acceptTerms: false }
      : isForgot
        ? { email: emailFromFlow }
        : isReset
          ? { password: '', confirmPassword: '' }
          : { email: '', password: '', rememberMe: false },
    validationSchema: isRegister
      ? registerSchema
      : isForgot
        ? forgotPasswordSchema
        : isReset
          ? resetPasswordSchema
          : loginSchema,
    onSubmit: async (values) => {
      setNotice('')
      if (isForgot) {
        navigate('/verify-code', { state: { email: values.email.trim().toLowerCase() } })
        return
      }
      if (isReset) {
        navigate('/login', {
          replace: true,
          state: { message: 'Password reset preview completed. No real password or account credentials were changed.' },
        })
        return
      }
      if (isRegister) {
        register({ fullName: values.fullName, email: values.email })
      } else {
        signIn(values.email)
      }
      navigate('/', { replace: true })
    },
  })

  const fieldError = (name) =>
    formik.touched[name] && formik.errors[name]
      ? <small className="auth-field-error">{formik.errors[name]}</small>
      : null

  const handleSocialPreview = (provider) => {
    setNotice(`${provider} sign-in is shown as a design preview. No external authentication is connected.`)
  }

  const submitCode = (event) => {
    event.preventDefault()
    if (code.length !== 6) {
      setNotice('Enter all 6 digits to continue.')
      return
    }
    if (code !== '123456') {
      setNotice('For this demo, enter the preview code 123456.')
      return
    }
    navigate('/reset-password', { state: { email: emailFromFlow } })
  }

  const changeCode = (index, value) => {
    const digits = value.replace(/\D/g, '')
    if (digits.length > 1) {
      const next = digits.slice(0, 6)
      setCode(next)
      codeRefs.current[Math.min(next.length, 5)]?.focus()
      setNotice('')
      return
    }
    const next = code.padEnd(6, ' ').split('')
    next[index] = digits || ''
    const normalized = next.join('').replace(/ /g, '').slice(0, 6)
    setCode(normalized)
    if (digits && index < 5) codeRefs.current[index + 1]?.focus()
    setNotice('')
  }

  const handleCodeKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !code[index] && index > 0) {
      codeRefs.current[index - 1]?.focus()
    }
  }

  const resendCode = () => {
    setSecondsLeft(36)
    setNotice('A new preview code is ready: 123456. No email was sent in demo mode.')
  }

  const badgeIcon = config.badgeIcon === 'shield'
    ? <FiShield />
    : config.badgeIcon === 'key'
      ? <FiKey />
      : <FiUserPlus />

  return (
    <main className="auth-page">
      <div className="auth-content">
        <header className="auth-page-heading">
          <span className="auth-badge">{badgeIcon}{config.badge}</span>
          <h1>{config.title}</h1>
          <p>{config.subtitle}</p>
        </header>

        <section className={isRegister ? 'auth-form-card register-card' : isVerify ? 'auth-form-card verify-card' : isForgot ? 'auth-form-card recovery-card' : 'auth-form-card'}>
          {isRegister && (
            <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
              <label className="auth-field">
                <span>FULL NAME</span>
                <span className="auth-input-wrap">
                  <FiUser />
                  <input name="fullName" autoComplete="name" value={formik.values.fullName} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Sarah Connor" aria-invalid={Boolean(formik.touched.fullName && formik.errors.fullName)} />
                </span>
                {fieldError('fullName')}
              </label>

              <label className="auth-field">
                <span>EMAIL ADDRESS</span>
                <span className="auth-input-wrap">
                  <FiMail />
                  <input name="email" type="email" autoComplete="email" inputMode="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="you@domain.com" aria-invalid={Boolean(formik.touched.email && formik.errors.email)} />
                </span>
                {fieldError('email')}
              </label>

              <label className="auth-field">
                <span>PASSWORD</span>
                <span className="auth-input-wrap">
                  <FiLock />
                  <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="At least 8 characters" aria-invalid={Boolean(formik.touched.password && formik.errors.password)} />
                  <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </span>
                {fieldError('password')}
              </label>

              <label className="auth-field">
                <span>CONFIRM PASSWORD</span>
                <span className="auth-input-wrap">
                  <FiLock />
                  <input name="confirmPassword" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Repeat your password" aria-invalid={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} />
                  <button className="auth-password-toggle" type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? 'Hide confirmation' : 'Show confirmation'}>{showConfirmation ? <FiEyeOff /> : <FiEye />}</button>
                </span>
                {fieldError('confirmPassword')}
              </label>

              <label className="auth-check-row">
                <input type="checkbox" name="acceptTerms" checked={formik.values.acceptTerms} onChange={formik.handleChange} onBlur={formik.handleBlur} />
                <span>I agree to LinkVault's <a href="#terms" onClick={(event) => { event.preventDefault(); setNotice('Terms of Service and Privacy Policy are preview text in this demo.') }}>Terms of Service</a> and <a href="#privacy" onClick={(event) => { event.preventDefault(); setNotice('Terms of Service and Privacy Policy are preview text in this demo.') }}>Privacy Policy</a>.</span>
              </label>
              {fieldError('acceptTerms')}

              <button className="auth-submit-button" type="submit" disabled={formik.isSubmitting}><FiUserPlus /> Create Account</button>
            </form>
          )}

          {isLogin && (
            <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
              <label className="auth-field">
                <span>EMAIL ADDRESS</span>
                <span className="auth-input-wrap">
                  <FiMail />
                  <input name="email" type="email" autoComplete="email" inputMode="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="you@example.com" aria-invalid={Boolean(formik.touched.email && formik.errors.email)} />
                </span>
                {fieldError('email')}
              </label>

              <label className="auth-field">
                <span className="auth-field-label-row"><span>PASSWORD</span><Link to="/forgot-password">Forgot password?</Link></span>
                <span className="auth-input-wrap">
                  <FiLock />
                  <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="••••••••" aria-invalid={Boolean(formik.touched.password && formik.errors.password)} />
                  <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </span>
                {fieldError('password')}
              </label>

              <label className="auth-check-row">
                <input type="checkbox" name="rememberMe" checked={formik.values.rememberMe} onChange={formik.handleChange} />
                <span>Remember me on this device</span>
              </label>

              <button className="auth-submit-button" type="submit" disabled={formik.isSubmitting}><FiLogIn /> Sign In</button>
            </form>
          )}

          {isForgot && (
            <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
              <label className="auth-field">
                <span>REGISTERED EMAIL</span>
                <span className="auth-input-wrap">
                  <FiMail />
                  <input name="email" type="email" autoComplete="email" inputMode="email" value={formik.values.email} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="you@domain.com" aria-invalid={Boolean(formik.touched.email && formik.errors.email)} />
                </span>
                {fieldError('email')}
              </label>
              <button className="auth-submit-button" type="submit" disabled={formik.isSubmitting}><FiSend /> Send Verification Code <FiArrowRight /></button>
              <Link className="auth-back-link" to="/login"><FiArrowLeft /> Back to Sign In</Link>
            </form>
          )}

          {isVerify && (
            <form className="auth-form verify-form" onSubmit={submitCode}>
              <div className="auth-email-confirmation">
                <span><FiMail /> {emailFromFlow || 'you@domain.com'}</span>
                <Link to="/forgot-password">Change</Link>
              </div>
              <div className="auth-code-label">6-DIGIT SECURITY CODE</div>
              <div className="auth-code-inputs" dir="ltr">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    ref={(element) => { codeRefs.current[index] = element }}
                    value={code[index] || ''}
                    onChange={(event) => changeCode(index, event.target.value)}
                    onKeyDown={(event) => handleCodeKeyDown(index, event)}
                    onPaste={(event) => {
                      const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
                      if (pasted) { event.preventDefault(); setCode(pasted); codeRefs.current[Math.min(pasted.length, 5)]?.focus() }
                    }}
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={6}
                    aria-label={`Verification digit ${index + 1}`}
                  />
                ))}
              </div>
              <div className="auth-resend-row">
                {secondsLeft > 0 ? (
                  <span>Didn't get a code? Resend in <strong>00:{String(secondsLeft).padStart(2, '0')}</strong></span>
                ) : (
                  <button type="button" onClick={resendCode}>Didn't get a code? Resend</button>
                )}
              </div>
              <button className="auth-submit-button" type="submit"><FiCheckCircle /> Verify &amp; Continue <FiArrowRight /></button>
              <Link className="auth-back-link" to="/forgot-password"><FiArrowLeft /> Back to Request Code</Link>
            </form>
          )}

          {isReset && (
            <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
              <div className="auth-email-confirmation">
                <span><FiMail /> {emailFromFlow || 'you@domain.com'}</span>
                <span className="auth-verified"><FiShield /> Verified Email</span>
              </div>
              <label className="auth-field">
                <span>NEW PASSWORD</span>
                <span className="auth-input-wrap">
                  <FiLock />
                  <input name="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" value={formik.values.password} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="At least 8 characters" aria-invalid={Boolean(formik.touched.password && formik.errors.password)} />
                  <button className="auth-password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <FiEyeOff /> : <FiEye />}</button>
                </span>
                {fieldError('password')}
              </label>
              <label className="auth-field">
                <span>CONFIRM NEW PASSWORD</span>
                <span className="auth-input-wrap">
                  <FiLock />
                  <input name="confirmPassword" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" value={formik.values.confirmPassword} onChange={formik.handleChange} onBlur={formik.handleBlur} placeholder="Repeat your new password" aria-invalid={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)} />
                  <button className="auth-password-toggle" type="button" onClick={() => setShowConfirmation((value) => !value)} aria-label={showConfirmation ? 'Hide confirmation' : 'Show confirmation'}>{showConfirmation ? <FiEyeOff /> : <FiEye />}</button>
                </span>
                {fieldError('confirmPassword')}
              </label>
              <button className="auth-submit-button" type="submit" disabled={formik.isSubmitting}><FiKey /> Reset Password</button>
              <div className="auth-bottom-prompt">Remember your credentials? <Link to="/login">Sign In</Link></div>
            </form>
          )}

          {notice && <div className="auth-notice" role="status">{notice}</div>}

          {(isRegister || isLogin) && (
            <>
              <div className="auth-divider"><span>{isRegister ? 'OR SIGN UP WITH' : 'OR CONTINUE WITH'}</span></div>
              <div className="auth-social-row">
                <button type="button" onClick={() => handleSocialPreview('Google')}><FcGoogle /> Google</button>
                <button type="button" onClick={() => handleSocialPreview('GitHub')}><FaGithub /> GitHub</button>
              </div>
              <div className="auth-bottom-prompt">
                {isRegister ? <>Already have an account? <Link to="/login">Sign In <FiArrowRight /></Link></> : <>Don't have an account? <Link to="/register">Create one now <FiArrowRight /></Link></>}
              </div>
            </>
          )}
        </section>

        <p className="auth-demo-note">Demo preview: passwords are never saved, and no real email or social sign-in is performed.</p>
      </div>
    </main>
  )
}
