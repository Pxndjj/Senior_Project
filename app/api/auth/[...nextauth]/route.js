import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
//const itemSession = { userName: "", userType: "", userRegisBy: "", userPass: "", userPhone: "", userEmail: "", userImage: "" };
const api = {
    checkEmailGoogle:async(credentials)=>{
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/checkemailgoogle?userEmail=${credentials.userEmail}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        return result
    },
    registerGoogle:async(credentials)=>{
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        return res;
    },
    checkUser:async(credentials)=>{
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/checkuserregister?userEmail=${credentials.userEmail}&userPhone=${credentials.userPhone}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        return result;
    },
    checkAdmin:async(credentials)=>{
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/checkadmin?userEmail=${credentials.userEmail}`;
        const response = await fetch(apiUrl);
        const result = await response.json();
        return result;
    }
}

const handler = NextAuth({
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "credentials",
            credentials: {
            },
            async authorize(credentials, req) {
                const resUser = await api.checkUser(credentials);
                if (!resUser) {
                    throw new Error("Not found this user.");
                }
                const checkAdmin = await api.checkAdmin(credentials);
                const isAdmin = checkAdmin?checkAdmin.email:'';
                const checkPass = await bcrypt.compare(credentials.userPass, resUser.userPass);
                // console.log(checkPass)
                if (checkPass) {
                    return  {
                        id: String(resUser._id), 
                        name: resUser.userName, 
                        email: resUser.userEmail, 
                        role: isAdmin!==''?'admin':resUser.userRole, 
                        image:resUser.userImage
                    }
                } else {
                    return null
                }
            }
        }),
        GoogleProvider({
            clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
            clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
        })
    ],
    callbacks: {
        async signIn(data) {
            
            if (data.account.provider === "google") {
                 const res = await api.checkEmailGoogle(data.user.email);
                 if (!res) {
                     let objCredentials={ userName: data.user.name, userRole: "", userRegisBy: data.account.provider, userPass: "", userPhone: "", userEmail: data.user.email, userImage: data.user.image }
                     await api.registerGoogle(objCredentials);
                 }
            }
            return true
        },
        jwt ({token,user,session,trigger}) {
            if(user){
                token.id = user.id;
                token.role = user.role;
                token.email = user.email;
                token.image = user.image;
            }
            //case update session
            if(trigger=="update"&& session) {
                token.role = session.role;      
            }
            return token
        },
        async session({ session, token}) {
            session.user.id = token.id;
            session.user.role = token.role;
            session.user.email = token.email;
            session.user.image = token.image;
            return session;
        },
    },
})

export { handler as GET, handler as POST }