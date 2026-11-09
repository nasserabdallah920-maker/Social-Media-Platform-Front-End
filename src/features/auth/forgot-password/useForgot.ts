import { useMutation } from "@tanstack/react-query"
import { authServices } from "../services/authSerivces"

export const useForgot=()=>{
    const forgotMutation=useMutation({
        mutationFn:({email}:{email:string})=>authServices.forgotPassword(email),
        mutationKey:['forgot-password']
    })
    return {forgotMutation}
}