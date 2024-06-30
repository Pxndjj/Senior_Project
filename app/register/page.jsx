"use client";
import { Button, Card, Input } from "@nextui-org/react";
import imgeGoogle from "@/public/google.svg";
import React, { useState } from "react";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import userImage from "@/public/user.png";

export default function Register() {
    const { type } = useParams();
    const { data: session } = useSession();
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        userId: "",
        userName: "",
        userPass: "",
        userPhone: "",
        userEmail: "",
        userRole: "",
        userRegisBy: "",
        userImage: "default",
        userStatus: "W",
    });
    const [error, setError] = useState("");
    const [registerError, setRegisterError] = useState("");

    const api = {
        checkUserRegister: async (objCredentials) => {
            const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND}/users/checkuserregister?userEmail=${objCredentials.userEmail}&userPhone=${objCredentials.userPhone}`;
            const response = await fetch(apiUrl);
            const result = await response.json();
            return result;
        },
        register: async (objCredentials) => {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND}/users/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(objCredentials),
                }
            );
            return res;
        },
    };

    //state emit update
    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
        console.log(value)
    };
    //state event
    const handleRegister = async (e) => {
        e.preventDefault();
        if (
            !credentials.userEmail ||
            !credentials.userName ||
            !credentials.userPass ||
            !credentials.userPhone

        ) {
            console.log("Please fill out all the fields completely!!!")
            setRegisterError("Please fill out all the fields completely!!!");
            return;
        }
        try {
            const checkUser = await api.checkUserRegister(credentials);
            if (checkUser && checkUser.userPhone == credentials.userPhone) {
                console.log("This phone has already been used.")
                setRegisterError("This phone has already been used.");
                return;
            }
            if (checkUser && checkUser.userEmail == credentials.userEmail) {
                console.log("This email has already been used.")
                setRegisterError("This email has already been used.");
                return;
            }
            const res = await api.register(credentials);
            if (res.ok) {
                await signIn("credentials", credentials);
            } else {
                alert("Register unsuccessful");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleLogin = () => {
        router.push('/login');
    }

    if (session) {
        return (
            <div>
                <Image
                    src={
                        session.userImage == "default"
                            ? userImage
                            : session.userImage
                    }
                    width={50}
                    height={100}
                />
                <p>Welcome {session.userName}. Signed In As</p>
                <p>{session.userEmail}</p>
                <button onClick={() => signOut()}>Sign out </button>
            </div>
        );
    }

    return (
        <div className="bg-image-default h-screen flex justify-center items-end">
            <div className="flex gap-6 w-[70%] h-[85%] text-white">
                {/* left */}
                <div id="left" className="flex-1">
                    <div className="flex flex-col justify-between h-[60%] ">
                        <div className="text-4xl font-extrabold mt-20">
                            JoyfulWait
                        </div>
                        <div className="flex flex-col gap-6">
                            <div className="text-3xl font-semibold">
                                No more queue line
                            </div>
                            <div className="text-gray-200 font-extralight w-[80%]">
                                Quickly and conveniently search and book
                                restaurant tables online. With just one click,
                                you can check table availability.
                            </div>
                        </div>
                    </div>
                </div>
                {/* right */}

                <div id="right" className="flex-1">

                    <Card className="h-full w-full rounded-b-none p-8 overflow-auto">

                        <form onSubmit={handleRegister}>
                            <div className="mb-2">
                                <p className="text-xs">LET'S GET YOU STARTED</p>
                            </div>
                            <div className="mb-5">
                                <h1 className="font-bold text-2xl">Create an Account </h1>
                            </div>
                            <div className="my-3">
                                <Input type="text" name="userName" value={credentials.userName} onChange={handleChange} label="User Name" variant="bordered" placeholder="name" className="m-auto" />
                            </div>
                            <div className="my-3">
                                <Input
                                    type="text"
                                    name="userPhone"
                                    value={credentials.userPhone}
                                    onChange={handleChange}
                                    label="Phone"
                                    variant="bordered"
                                    placeholder="phone-number"
                                    className="m-auto"
                                    inputMode="numeric"
                                    pattern="[0-9]*"
                                    errorMessage="Please enter only number"
                                />
                            </div>
                            <div className="my-3">
                                <Input type="email" name="userEmail" value={credentials.userEmail} onChange={handleChange} label="E-mail" variant="bordered" placeholder="@gmail.com" className="m-auto" />
                            </div>
                            <div className="my-3">
                                <Input type="password" name="userPass" value={credentials.userPass} onChange={handleChange} label="Password" variant="bordered" placeholder="password" className="m-auto" />
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
                        <div className="mt-4 text-center">
                            <p className="w-full" style={{ transition: "color 0.3s" }}>
                                Already have an account? <span className="cursor-pointer" onClick={handleLogin} style={{ color: "#1E90FF", transition: "color 0.3s" }}
                                    onMouseEnter={(e) => e.target.style.color = "#104E8B"}
                                    onMouseLeave={(e) => e.target.style.color = "#1E90FF"}>Login</span>
                            </p>
                        </div>

                    </Card>

                </div>

            </div>
        </div>
    );
}
