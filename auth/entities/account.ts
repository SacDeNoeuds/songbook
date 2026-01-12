import { x } from 'unhoax'

export type Account = {
  email: string
  name: string | undefined
  createdAt: Date
}

export const Account = x.typed<Account>().object({
  email: x.string,
  name: x.string.optional(),
  createdAt: x.date,
})
