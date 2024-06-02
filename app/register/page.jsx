"use client";
import { Button, Input } from "@nextui-org/react";
import imgeGoogle from "@/public/google.svg";
import React, { useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react"
import { useParams, useRouter } from 'next/navigation';
import userImage from "@/public/user.png"

export default function Register() {

    const { type } = useParams();
    const { data: session } = useSession();
    const [credentials, setCredentials] = useState({ userId: '', userName: '', userPass: '', userPhone: '', userEmail: '', userRole: '', userRegisBy: '', userImage: 'default',userStatus:'W' });
    const [error, setError] = useState("");
    const [registerError, setRegisterError] = useState("");

    const api = {
        checkUserRegister:async(objCredentials)=>{
            const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/checkuserregister?userEmail=${objCredentials.userEmail}&userPhone=${objCredentials.userPhone}`;
            const response = await fetch(apiUrl);
            const result = await response.json();
            return result
        },
        register:async(objCredentials)=>{
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(objCredentials)
            });
            return res;            
        }
    }

    
    //state emit update
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    //state event
    const handleRegister = async (e) => {
        e.preventDefault();
        if (credentials.userEmail == "" && credentials.userName == "" && credentials.userPass == "" && credentials.userPhone == "") {
            setError("Please fill out the information completely!!!");
            return;
        }
         try {
             const checkUser = await api.checkUserRegister(credentials);
            if (checkUser && checkUser.userPhone == credentials.userPhone) {
                setRegisterError("This phone has already been used.");
                return;
            }
            if (checkUser && checkUser.userEmail == credentials.userEmail) {
                setRegisterError("This email has already been used.");
                return;
            }
            const res = await api.register(credentials);
            if (res.ok) {
                await signIn('credentials', credentials);
            } else {
                alert("resgiter unsuccessful");
            }
        } catch (error) {
            console.log(error);
        }

    };


    if (session) {
        return (
            <div>
                <Image src={session.userImage == "default" ? userImage : session.userImage} width={50} height={100} alt="123" />
                <p>Welcome {session.userName}. Signed In As</p>
                <p>{session.userEmail}</p>
                <button onClick={() => signOut()}>Sign out </button>
            </div>
        )
    }
    return (
        <main className="md:w-[80rem] md:px-6">
            <div className="md:flex m-auto h-100vh">
                <div className="grid items-center grid-cols-1 justify-center w-full md:w-3/4 m-auto text-center h-30vh">
                    <div>
                        <p className="text-4xl">Joyfulwait </p>
                        <p className="mt-2">
                        <span className="ml-2 "><span className="text-hiligh">No more queue line</span></span>
                        </p>                       
                    </div>
                </div>
                <div className="grid items-center grid-cols-1 justify-center w-full md:w-1/4 px-2">
                    <div className="w-full m-auto card-default">
                            <form onSubmit={handleRegister}>
                                <div className="mb-2">
                                    <p className="text-xs">LET'S GET YOU STARTED</p>
                                </div>
                                <div className="mb-5">
                                    <h1 className="font-bold text-2xl">Create an Account </h1>
                                </div>
                                <div className="my-3">
                                    <Input type="text" name="userName" value={credentials.userName} onChange={handleChange} label="User Name" variant="bordered" placeholder="name" className="max-w-xs m-auto" />
                                </div>
                                <div className="my-3">
                                    <Input type="text" name="userPhone" value={credentials.userPhone} onChange={handleChange} label="Phone" variant="bordered" placeholder="phone-number" className="max-w-xs m-auto" />
                                </div>
                                <div className="my-3">
                                    <Input type="email" name="userEmail" value={credentials.userEmail} onChange={handleChange} label="E-mail" variant="bordered" placeholder="@gmail.com" className="max-w-xs m-auto" />
                                </div>
                                <div className="my-3">
                                    <Input type="password" name="userPass" value={credentials.userPass} onChange={handleChange} label="Password" variant="bordered" placeholder="password" className="max-w-xs m-auto" />
                                </div>
                                <div className="my-3">
                                    <p className="text-red-500 w-full text-sm">{error}</p>
                                </div>
                                <div className="my-3">
                                    <p className="text-red-500 w-full text-sm">{registerError}</p>
                                </div>
                                <div className="my-3">
                                    <Button className="w-full" type="submit">GET STARTED</Button>
                                </div>
                            </form>
                        <div className="flex">
                            <div className="w-2/4"><h2 className="w-full text-center border-b leading-3 mt-3"></h2></div>
                            <div className="w-1/4 text-center"><h1>or</h1></div>
                            <div className="w-2/4"><h2 className="w-full text-center border-b leading-3 mt-3"></h2></div>
                        </div>
                        <div className="mt-4 text-center">
                            <Button className="w-full" onClick={() => { signIn("google"); }} variant="bordered" startContent={<Image src={imgeGoogle} width={35} height={35} alt="123" />}>Continue with Google</Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}