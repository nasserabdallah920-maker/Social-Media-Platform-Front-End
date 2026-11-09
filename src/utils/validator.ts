import {ZodSchema} from "zod"
export const validator = (schema:ZodSchema,data:unknown)=>{
    const results = schema.safeParse(data)
    return results
}