import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiBookmark, FiEye, FiEyeOff, FiCheck, FiMail, FiLock } from 'react-icons/fi'
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from '../features/auth/validation/authSchemas.js'
import useDemoAuthStore from '../features/auth/store/useDemoAuthStore.js'
import usePreferencesStore from '../features/settings/store/usePreferencesStore.js'
import './AuthPage.css'

const modeConfig = {
  login: {
    title: 'Welcome back',
    subtitle: 'Sign in to your LinkVault demo workspace.',
    submit: 'Sign in',
  },
  register: {
    title: 'Create your account',
    subtitle: 'Set up a demo profile to personalize this workspace.',
    submit: 'Create account',
  },
  'forgot-password': {
    title: 'Reset your password',
    subtitle: 'Enter the email address associated with your demo profile.',
    submit: 'Continue',
  },
}

export default function AuthPage({ mode = 'login' }) {
  const navigate = useNavigate()
  const signIn = useDemoAuthStore((state) => state.signIn)
  const register = useDemoAuthStore((state) => state.register)
  const theme = usePreferencesStore((state) => state.theme)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [notice, setNotice] = useState('')
  const [complete, setComplete] = useState(false)
  const config = modeConfig[mode] || modeConfig.login
  const isRegister = mode === 'register'
  const isForgot = mode === 'forgot-password'

  const formik = useFormik({
    initialValues: isRegister
      ? { fullName: '', email: '', password: '', confirmPassword: '' }
      : isForgot
        ? { email: '' }
        : { email: '', password: '' },
    validationSchema: isRegister
      ? registerSchema
      : isForgot
        ? forgotPasswordSchema
        : loginSchema,
    onSubmit: async (values) => {
      setNotice('')
      if (isForgot) {
        setComplete(true)
        setNotice('This is a visual demo. No reset email was sent.')
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

  useEffect(() => {
    setComplete(false)
    setNotice('')
  }, [mode])

  const fieldError = (name) =>
    formik.touched[name] && formik.errors[name]
      ? <small className="auth-field-error">{formik.errors[name]}</small>
      : null

  return (
    <main className="auth-page" data-theme={theme}>
      <section className="auth-shell">
        <div className="auth-side-panel">
          <Link className="auth-brand" to="/">
            <span className="auth-brand-mark"><FiBookmark /></span>
            <span>LinkVault</span>
          </Link>
          <div className="auth-side-copy">
            <span className="auth-side-eyebrow">YOUR PERSONAL LIBRARY</span>
            <h1>Every useful link, right where you need it.</h1>
            <p>Keep your references, ideas, and favorite resources together in one calm workspace.</p>
          </div>
          <div className="auth-side-foot">
            <span className="auth-side-dot" />
            A focused space for your digital life
          </div>
        </div>

        <div className="auth-form-panel">
          <Link className="auth-back-link" to="/">
            <FiArrowLeft /> Back to library
          </Link>

          <div className="auth-form-content">
            <div className="auth-mobile-brand">
              <span className="auth-brand-mark"><FiBookmark /></span>
              <span>LinkVault</span>
            </div>

            <div className="auth-heading">
              <span className="auth-overline">
                {isForgot ? 'ACCOUNT RECOVERY' : isRegister ? 'GET STARTED' : 'YOUR WORKSPACE'}
              </span>
              <h2>{complete ? 'Check your details' : config.title}</h2>
              <p>{complete ? 'Your demo request has been recorded on this screen.' : config.subtitle}</p>
            </div>

            {complete ? (
              <div className="auth-success-panel" role="status">
                <span className="auth-success-icon"><FiCheck /></span>
                <strong>Request preview complete</strong>
                <p>{notice}</p>
                <Link className="auth-primary-link" to="/login">Return to sign in</Link>
              </div>
            ) : (
              <form className="auth-form" onSubmit={formik.handleSubmit} noValidate>
                {isRegister && (
                  <label className="auth-field">
                    <span>Full name</span>
                    <input
                      name="fullName"
                      autoComplete="name"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Your name"
                      aria-invalid={Boolean(formik.touched.fullName && formik.errors.fullName)}
                    />
                    {fieldError('fullName')}
                  </label>
                )}

                <label className="auth-field">
                  <span>Email address</span>
                  <span className="auth-input-wrap">
                    <FiMail />
                    <input
                      name="email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="name@example.com"
                      aria-invalid={Boolean(formik.touched.email && formik.errors.email)}
                    />
                  </span>
                  {fieldError('email')}
                </label>

                {!isForgot && (
                  <label className="auth-field">
                    <span>Password</span>
                    <span className="auth-input-wrap">
                      <FiLock />
                      <input
                        name="password"
                        type={showPassword ? 'text' : 'password'}
                        autoComplete={isRegister ? 'new-password' : 'current-password'}
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder={isRegister ? 'At least 8 characters' : 'Enter your password'}
                        aria-invalid={Boolean(formik.touched.password && formik.errors.password)}
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowPassword((value) => !value)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </span>
                    {fieldError('password')}
                  </label>
                )}

                {isRegister && (
                  <label className="auth-field">
                    <span>Confirm password</span>
                    <span className="auth-input-wrap">
                      <FiLock />
                      <input
                        name="confirmPassword"
                        type={showConfirmation ? 'text' : 'password'}
                        autoComplete="new-password"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Enter your password again"
                        aria-invalid={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
                      />
                      <button
                        type="button"
                        className="auth-password-toggle"
                        onClick={() => setShowConfirmation((value) => !value)}
                        aria-label={showConfirmation ? 'Hide confirmation' : 'Show confirmation'}
                      >
                        {showConfirmation ? <FiEyeOff /> : <FiEye />}
                      </button>
                    </span>
                    {fieldError('confirmPassword')}
                  </label>
                )}

                {notice && <p className="auth-inline-notice" role="status">{notice}</p>}

                {!isRegister && !isForgot && (
                  <div className="auth-inline-row">
                    <span className="auth-remember-hint">Demo account preview</span>
                    <Link to="/forgot-password">Forgot password?</Link>
                  </div>
                )}

                <button className="auth-submit-button" type="submit" disabled={formik.isSubmitting}>
                  {formik.isSubmitting ? 'Please wait...' : config.submit}
                </button>
              </form>
            )}

            {!complete && (
              <div className="auth-switch-row">
                {isForgot ? (
                  <>Remember your password? <Link to="/login">Sign in</Link></>
                ) : isRegister ? (
                  <>Already have a profile? <Link to="/login">Sign in</Link></>
                ) : (
                  <>New to LinkVault? <Link to="/register">Create an account</Link></>
                )}
              </div>
            )}

            <div className="auth-demo-note">
              <strong>Demo mode</strong>
              <span>These forms demonstrate the interface only. No real account is created and no email is sent.</span>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
