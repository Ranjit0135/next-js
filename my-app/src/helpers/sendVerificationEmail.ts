import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

 export async function sendVerificationEmail(email:string,username:string,verifyCode:string):Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Verification email code',
            react: VerificationEmail({username, otp: verifyCode}),
          });
        return {success: true,message:" verification email send successfully"}
        
    } catch (emailError) {
        console.log("error sending verification email",emailError);
        return {success: false,message:"failed to send verification email"}
    }
 }