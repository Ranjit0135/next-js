
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs"
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import { handleClientScriptLoad } from "next/script";

export async function POST(req: Request, res: Response){
    await dbConnect()

    try {
        const {username,email,password} = await req.json()
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "username already taken",
            },{status: 400})

        }
      const existingUserByEmail = await UserModel.findOne({email})
        const verifyCode = Math.floor(Math.random() *900000).toString()
      if(existingUserByEmail){
        if(existingUserByEmail.isVerified){
            return Response.json({
                success: false,
                message:"username already exists with this email",
                },{status:400})
        }else {
            const hasedPassword = await bcrypt.hash(password,10)
            existingUserByEmail.password = hasedPassword
            existingUserByEmail.verifiedCode = verifyCode
            existingUserByEmail.verifiedCodeExpiry = new Date(Date.now() + 3600000)
            await existingUserByEmail.save()
        }
      }else{
    const hasedPassword =  await bcrypt.hash(password,10)
    const expiryDate = new Date()
    expiryDate.setHours(expiryDate.getHours()+1)

 const newUser =    new UserModel({
        username,
        email,
        password:hasedPassword,
        verifyCode,
        verifiedCodeExpiry: expiryDate,
        isVerified: false,
        isAcceptingMessage: true,
        messages:[],
    })
    await newUser.save()
      }
      //send verification email
   const emailResponse = await sendVerificationEmail(
    email,
    username,
    verifyCode,
   )
   if(!emailResponse.success){
return Response.json({
success: false,
message:emailResponse.message
},{status:500})
   }
   return Response.json({
    success: true,
    message:"User registered successfully.please verify your email"
    },{status:201})
    } catch (error) {
        console.error("Error registering user",error)
        return Response.json({
            success: false,
            message:"Error registering user"
        },
    {
        status:500
    })
    }
}