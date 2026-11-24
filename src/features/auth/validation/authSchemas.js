import * as Yup from 'yup'

const emailField = Yup.string()
  .trim()
  .email('Enter a valid email address')
  .required('Email is required')

const passwordField = Yup.string()
  .required('Password is required')
  .min(8, 'Password must be at least 8 characters')

const loginSchema = Yup.object({
  email: emailField,
  password: passwordField,
  rememberMe: Yup.boolean(),
})

const registerSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .required('Your name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be 60 characters or less'),
  email: emailField,
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Use at least 8 characters')
    .matches(/[A-Za-z]/, 'Include at least one letter')
    .matches(/[0-9]/, 'Include at least one number'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
  acceptTerms: Yup.boolean().oneOf([true], 'Please accept the Terms of Service and Privacy Policy'),
})

const forgotPasswordSchema = Yup.object({
  email: emailField,
})

const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Use at least 8 characters')
    .matches(/[A-Za-z]/, 'Include at least one letter')
    .matches(/[0-9]/, 'Include at least one number'),
  confirmPassword: Yup.string()
    .required('Confirm your password')
    .oneOf([Yup.ref('password')], 'Passwords do not match'),
})

export { loginSchema, registerSchema, forgotPasswordSchema, resetPasswordSchema }
