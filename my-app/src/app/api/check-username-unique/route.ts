import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import {z} from 'zod'
import { userNameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema = z.object({
    username:userNameValidation
})

export async function GET(request:Request){
    //use this in all other routes
    console.log(`Received request with method ${request.method}`)
    if(request.method !=='GET'){
        return Response.json({
            success: false,
            message: 'method  not allowed',
        },{status:405})
    }
    await dbConnect()
    try {
        const {searchParams} = new URL(request.url)
        const queryParam = {
            username: searchParams.get('username')
        }

        // validate with zod
const result = UsernameQuerySchema.safeParse(queryParam)
console.log(result)
if(!result.success) {
    const usernameErrors = result.error.format().username?._errors || []
return Response.json({
    success: false,
    message: usernameErrors?.length > 0 ? usernameErrors.join(', ') :'invalid query parameter'
},{status:400})}

  const {username} = result.data
  const existingVerifiedUser = await UserModel.findOne({username,isVerified:true})

  if(existingVerifiedUser){
    return Response.json({
        success: false,
        message: 'username already taken'
    },{status:400})}
    
    return Response.json({
        success: true,
        message: 'username is unique'
    },{status:400})
  
    } catch (error) {
        console.error(error,"error checking username")
        return Response.json({
            success: false,
            message:"error checking username"
        },{status:500})
    }
}