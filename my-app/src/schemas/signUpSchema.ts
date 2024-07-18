import {z} from "zod"

export const userNameValidation = z
.string()
.min(2,"username must be at least 2 characters")
.max(20,"username must be not more than 20 characters")
.regex( /^(?!.*__)(?!.*\.\.)(?!.*\_$)(?!.*\.$)[a-zA-Z0-9._-]{3,20}$/,"invalid username")

export const signUpSchema = z.object({
username: userNameValidation,
email: z.string().email({message:"invalid email"}),
password: z.string().min(6,"`password must be at least 6 characters")
})