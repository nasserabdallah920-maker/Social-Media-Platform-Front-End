import {z} from "zod"

export const loginSchema = z.object({
    email:z.email(),
    password:z.string().min(8,'the password at least 8 character')
})

