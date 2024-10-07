"use client";
import { Button, Card, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter();
    const [credentials, setCredentials] = useState({
        userPass: "",
        userPhone: "",
        userEmail: "",
    });
    const [messageInput, setMessageInput] = useState("");
    const [messagelogin, setMessagelogin] = useState("");
    const [actionLogin, setActionLogin] = useState("phone");

    const handleClick = (loginType) => {
        setActionLogin(loginType);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (
            (credentials.userEmail === "" && credentials.userPhone === "") ||
            credentials.userPass === ""
        ) {
            setMessageInput("Please enter complete information!");
        } else {
            const resUser = await signIn("credentials", {
                userPass: credentials.userPass,
                userPhone: credentials.userPhone,
                userEmail: credentials.userEmail,
                redirect: false,
            });

            if (resUser.ok) {
                setMessagelogin("Success");
                router.push('/');
            } else {
                setMessageInput("Please check your information is correct!");
            }
        }
    };

    const handleRegister = () => {
        router.push('/register');
    };

    const goHome = () => {
        router.push('/');
    };

    return (
        <div className="bg-image-default h-screen flex justify-center items-end">
            <div className="flex gap-6 w-[70%] h-[85%] text-white">
                {/* left */}
                <div id="left" className="flex-1 flex items-center justify-center transform -translate-y-10">
                    <div className="flex flex-col justify-start space-y-6">
                        <div className="text-4xl font-extrabold cursor-pointer" onClick={goHome}>
                            JoyfulWait
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="text-3xl font-semibold">
                                Welcome back!
                            </div>
                            <div className="text-gray-200 font-extralight w-[80%]">
                                Quickly and securely log in to your account to access restaurant reservations.
                            </div>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div id="right" className="flex-1">
                    <Card className="h-full w-full rounded-b-none p-8 overflow-auto">
                        <form onSubmit={handleLogin}>
                            <div className="mb-2">
                                <p className="text-xs">WELCOME BACK <span className="text-green-500 text-sm">{messagelogin}</span></p>
                            </div>
                            <div className="mb-5">
                                <h1 className="font-bold text-2xl">Log In to your Account</h1>
                            </div>

                            {actionLogin === "phone" ? (
                                <div className="my-3">
                                    <Input
                                        type="text"
                                        name="userPhone"
                                        value={credentials.userPhone}
                                        onChange={handleChange}
                                        label="Phone"
                                        variant="bordered"
                                        placeholder="Enter your phone number"
                                        className="m-auto"
                                    />
                                </div>
                            ) : (
                                <div className="my-3">
                                    <Input
                                        type="email"
                                        name="userEmail"
                                        value={credentials.userEmail}
                                        onChange={handleChange}
                                        label="E-mail"
                                        variant="bordered"
                                        placeholder="Enter your email"
                                        className="m-auto"
                                    />
                                </div>
                            )}

                            <div className="my-3">
                                <Input
                                    type="password"
                                    name="userPass"
                                    value={credentials.userPass}
                                    onChange={handleChange}
                                    label="Password"
                                    variant="bordered"
                                    placeholder="Enter your password"
                                    className="m-auto"
                                />
                            </div>

                            <div className="my-3">
                                <p className="text-red-500 text-sm">{messageInput}</p>
                            </div>

                            <div className="my-3">
                                {actionLogin === "phone" ? (
                                    <p>
                                        Login with E-mail <span className="text-blue-500 cursor-pointer" onClick={() => handleClick("email")}>Click here</span>
                                    </p>
                                ) : (
                                    <p>
                                        Login with Phone <span className="text-blue-500 cursor-pointer" onClick={() => handleClick("phone")}>Click here</span>
                                    </p>
                                )}
                            </div>

                            <div className="my-3">
                                <Button className="w-full" type="submit">CONTINUE</Button>
                            </div>
                        </form>

                        <div className="mt-4 text-center">
                            <p className="w-full" style={{ transition: "color 0.3s" }}>
                                No account? <span className="cursor-pointer" onClick={handleRegister} style={{ color: "#1E90FF", transition: "color 0.3s" }}
                                    onMouseEnter={(e) => e.target.style.color = "#104E8B"}
                                    onMouseLeave={(e) => e.target.style.color = "#1E90FF"}>Register</span>
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
