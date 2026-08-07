/**
 * Browser / standalone SPA stub — real server fns run only inside the Main Start host.
 * Dynamic imports resolve here so Vite client builds do not pull TanStack Start server code.
 */
export const listCustomersFn = async () => {
  throw new Error('db.unavailable')
}
export const getCustomerFn = async () => {
  throw new Error('db.unavailable')
}
export const createCustomerFn = async () => {
  throw new Error('db.unavailable')
}
export const updateCustomerFn = async () => {
  throw new Error('db.unavailable')
}
export const deleteCustomerFn = async () => {
  throw new Error('db.unavailable')
}
