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

    // Error state for validation
    const [errors, setErrors] = useState({
        userPhone: "",
        userEmail: "",
    });

    const handleClick = (loginType) => {
        setActionLogin(loginType);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Validation for phone input (only 10-digit numbers)
        if (name === "userPhone") {
            const phoneRegex = /^[0-9]{0,10}$/;
            if (phoneRegex.test(value)) {
                setCredentials((prev) => ({
                    ...prev,
                    [name]: value,
                }));

                // Remove error if input is valid
                if (value.length === 10) {
                    setErrors((prev) => ({
                        ...prev,
                        userPhone: "",
                    }));
                } else {
                    setErrors((prev) => ({
                        ...prev,
                        userPhone: "Phone number must be 10 digits",
                    }));
                }
            }
        }

        // Validation for email input (basic email format)
        else if (name === "userEmail") {
            setCredentials((prev) => ({
                ...prev,
                [name]: value,
            }));

            // Basic email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                setErrors((prev) => ({
                    ...prev,
                    userEmail: "Invalid email format",
                }));
            } else {
                setErrors((prev) => ({
                    ...prev,
                    userEmail: "",
                }));
            }
        }

        // General input for other fields
        else {
            setCredentials((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        if (
            (credentials.userEmail === "" && credentials.userPhone === "") ||
            credentials.userPass === ""
        ) {
            setMessageInput("Please enter complete information!");
        } else if (errors.userPhone || errors.userEmail) {
            setMessageInput("Please fix the errors before submitting.");
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
        <div className="bg-image-default h-screen flex flex-col lg:flex-row justify-center items-center lg:items-end">
            <div className="flex flex-col lg:flex-row gap-6 w-full lg:w-[70%] h-auto lg:h-[85%] text-white px-4 lg:px-0">
                {/* left */}
                <div id="left" className="flex-1 flex items-center justify-center transform lg:-translate-y-10">
                    <div className="flex flex-col justify-start space-y-6 text-center lg:text-left">
                        <div className="text-4xl font-extrabold cursor-pointer" onClick={goHome}>
                            JoyfulWait
                        </div>
                        <div className="flex flex-col space-y-4">
                            <div className="text-3xl font-semibold">
                                No more queue line
                            </div>
                            <div className="text-gray-200 font-extralight lg:w-[80%]">
                                Quickly and securely search and book restaurant tables online. With just one click, you can check table availability.
                            </div>
                        </div>
                    </div>
                </div>

                {/* right */}
                <div id="right" className="flex-1">
                    <Card className="h-full w-full rounded-lg p-8 overflow-auto shadow-lg">
                        <form onSubmit={handleLogin}>
                            <div className="mb-2">
                                <p className="text-xs">LET'S GET YOU STARTED <span className="text-green-500 text-sm">{messagelogin}</span></p>
                            </div>
                            <div className="mb-5">
                                <h1 className="font-bold text-2xl">Create an Account</h1>
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
                                        className="m-auto w-full"
                                    />
                                    {errors.userPhone && (
                                        <p className="text-red-500 text-sm">{errors.userPhone}</p>
                                    )}
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
                                        className="m-auto w-full"
                                    />
                                    {errors.userEmail && (
                                        <p className="text-red-500 text-sm">{errors.userEmail}</p>
                                    )}
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
                                    className="m-auto w-full"
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
                                Don't have an account yet? <span className="cursor-pointer" onClick={handleRegister} style={{ color: "#1E90FF", transition: "color 0.3s" }}
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
