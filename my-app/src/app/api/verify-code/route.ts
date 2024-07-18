import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User"

export async function POST(request:Request) {
    await dbConnect()
    try {
        const {username , code } = await request.json()
      const decodedUsername =   decodeURIComponent(username)
      const user = await UserModel.findOne({username: decodedUsername})
        

      if(!user) {
        return Response.json({
            success: false,
            message: 'User not found'
        },{status:500})
      }

const isCodeValid = user.verifiedCode === code
const isCodeNotExpired =new Date(user.verifiedCodeExpiry) > new Date()

if(isCodeValid && isCodeNotExpired){
    user.isVerified = true
    await user.save()

    return Response.json({
        success: true,
        message:"account verified successfully"
    },{status:200})
}else if(!isCodeNotExpired){ 

    return Response.json({
        success: false,
        message:"verification code is expired"
    },{status:400})
}else{
    return Response.json({
        success: false,
        message:"incorrect verification code"
    },{status:400})
}

    } catch (error) {
        console.error(error,"error verifying user")
        return Response.json({
            success: false,
            message:"error verifying user"
        },{status:500})
    }
}