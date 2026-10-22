// Validation returns translation keys (not messages) so errors re-translate
// instantly when the visitor switches language.

const INDIAN_MOBILE = /^(?:\+?91)?[6-9]\d{9}$/

export function normalizePhone(value) {
  return value.replace(/[\s-]/g, '')
}

export function isValidIndianMobile(value) {
  return INDIAN_MOBILE.test(normalizePhone(value))
}

export function isValidAge(value, min = 10, max = 60) {
  if (value === '' || value == null) return false
  const age = Number(value)
  return Number.isFinite(age) && age >= min && age <= max
}

export function validateEnquiry(values) {
  const errors = {}
  const name = values.name.trim()

  if (!name) errors.name = 'contact.errors.nameRequired'
  else if (name.length < 2 || name.length > 60) errors.name = 'contact.errors.nameInvalid'

  if (values.age === '') errors.age = 'contact.errors.ageRequired'
  else if (!isValidAge(values.age) || !Number.isInteger(Number(values.age))) errors.age = 'contact.errors.ageInvalid'

  if (!values.phone.trim()) errors.phone = 'contact.errors.phoneRequired'
  else if (!isValidIndianMobile(values.phone)) errors.phone = 'contact.errors.phoneInvalid'

  if (!values.course) errors.course = 'contact.errors.courseRequired'
  if (!values.branch) errors.branch = 'contact.errors.branchRequired'
  if (!values.residence) errors.residence = 'contact.errors.residenceRequired'
  if (values.message.length > 500) errors.message = 'contact.errors.messageTooLong'

  return errors
}
