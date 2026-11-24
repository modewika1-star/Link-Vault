import test from 'node:test'
import assert from 'node:assert/strict'
import {
  loginSchema,
  registerSchema,
  forgotPasswordSchema,
} from '../src/features/auth/validation/authSchemas.js'

test('login accepts a valid email and a password with minimum length', async () => {
  await assert.doesNotReject(() => loginSchema.validate({
    email: 'mody@example.com',
    password: 'DemoPass123',
  }))
})

test('login rejects malformed email and short password', async () => {
  await assert.rejects(() => loginSchema.validate({
    email: 'not-an-email',
    password: '123',
  }))
})

test('registration requires a valid name, email, strong password and matching confirmation', async () => {
  await assert.doesNotReject(() => registerSchema.validate({
    fullName: 'Mohamed Ali',
    email: 'mody@example.com',
    password: 'DemoPass123',
    confirmPassword: 'DemoPass123',
  }))
  await assert.rejects(() => registerSchema.validate({
    fullName: 'M',
    email: 'not-an-email',
    password: '12345678',
    confirmPassword: '12345678x',
  }))
})

test('forgot password accepts only a valid email shape', async () => {
  await assert.doesNotReject(() => forgotPasswordSchema.validate({ email: 'user@example.com' }))
  await assert.rejects(() => forgotPasswordSchema.validate({ email: 'bad-email' }))
})
