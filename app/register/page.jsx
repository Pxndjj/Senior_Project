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

    const [registerError, setRegisterError] = useState({
        fieldErrors: {},  // For individual field validation errors
        generalError: "", // For general errors like registration failure
    });

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

    // Handle input changes and validation
    const handleChange = (e) => {
        const { name, value } = e.target;

        let error = "";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*?&])[A-Za-z\d+-_@$!%*?&]{8,}$/;

        if (name === "userEmail") {
            if (!emailRegex.test(value)) {
                error = "Please enter a valid email address.";
            }
        } else if (name === "userPhone") {
            if (!phoneRegex.test(value)) {
                error = "Please enter a valid 10-digit phone number.";
            }
        } else if (name === "userName" && value.trim() === "") {
            error = "User Name cannot be empty.";
        } else if (name === "userPass") {
            if (!passwordRegex.test(value)) {
                error = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.";
            }
        }

        setRegisterError((prev) => ({
            ...prev,
            fieldErrors: {
                ...prev.fieldErrors,
                [name]: error,
            },
            generalError: "", // Clear any general error when user starts typing
        }));

        setCredentials((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle form submission
    const handleRegister = async (e) => {
        e.preventDefault();

        // Perform a final validation check on all fields
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^\d{10}$/;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[-_@$!%*?&])[A-Za-z\d+-_@$!%*?&]{8,}$/;

        let fieldErrors = {};

        if (!credentials.userName.trim()) {
            fieldErrors.userName = "User Name cannot be empty.";
        }

        if (!phoneRegex.test(credentials.userPhone)) {
            fieldErrors.userPhone = "Please enter a valid 10-digit phone number.";
        }

        if (!emailRegex.test(credentials.userEmail)) {
            fieldErrors.userEmail = "Please enter a valid email address.";
        }

        if (!passwordRegex.test(credentials.userPass)) {
            fieldErrors.userPass = "Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a digit, and a special character.";
        }

        // Update the state with any field errors
        setRegisterError((prev) => ({
            ...prev,
            fieldErrors: fieldErrors,
            generalError: "", // Clear any general error
        }));

        // If there are any field errors, stop the submission
        if (Object.keys(fieldErrors).length > 0) {
            setRegisterError((prev) => ({
                ...prev,
                generalError: "Please correct the highlighted errors before proceeding.",
            }));
            return;
        }

        try {
            const checkUser = await api.checkUserRegister(credentials);
            if (checkUser && checkUser.userPhone === credentials.userPhone) {
                setRegisterError((prev) => ({
                    ...prev,
                    generalError: "This phone has already been used.",
                }));
                return;
            }
            if (checkUser && checkUser.userEmail === credentials.userEmail) {
                setRegisterError((prev) => ({
                    ...prev,
                    generalError: "This email has already been used.",
                }));
                return;
            }

            const res = await api.register(credentials);
            if (res.ok) {
                await signIn("credentials", credentials);
            } else {
                setRegisterError((prev) => ({
                    ...prev,
                    generalError: "Registration unsuccessful. Please try again.",
                }));
            }
        } catch (error) {
            setRegisterError((prev) => ({
                ...prev,
                generalError: "An error occurred during registration. Please try again later.",
            }));
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
                        session.userImage === "default"
                            ? userImage
                            : session.userImage
                    }
                    width={50}
                    height={100}
                    alt="User Image"
                />
                <p>Welcome {session.userName}. Signed In As</p>
                <p>{session.userEmail}</p>
                <button onClick={() => signOut()}>Sign out </button>
            </div>
        );
    }

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
                                No more queue line
                            </div>
                            <div className="text-gray-200 font-extralight w-[80%]">
                                Quickly and conveniently search and book restaurant tables online.
                                With just one click, you can check table availability.
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
                                <Input
                                    type="text"
                                    name="userName"
                                    value={credentials.userName}
                                    onChange={handleChange}
                                    label="User Name"
                                    variant="bordered"
                                    placeholder="name"
                                    className="m-auto"
                                />
                                {registerError.fieldErrors.userName && (
                                    <p className="text-red-500 text-xs">{registerError.fieldErrors.userName}</p>
                                )}
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
                                />
                                {registerError.fieldErrors.userPhone && (
                                    <p className="text-red-500 text-xs">{registerError.fieldErrors.userPhone}</p>
                                )}
                            </div>
                            <div className="my-3">
                                <Input
                                    type="email"
                                    name="userEmail"
                                    value={credentials.userEmail}
                                    onChange={handleChange}
                                    label="E-mail"
                                    variant="bordered"
                                    placeholder="@gmail.com"
                                    className="m-auto"
                                />
                                {registerError.fieldErrors.userEmail && (
                                    <p className="text-red-500 text-xs">{registerError.fieldErrors.userEmail}</p>
                                )}
                            </div>
                            <div className="my-3">
                                <Input
                                    type="password"
                                    name="userPass"
                                    value={credentials.userPass}
                                    onChange={handleChange}
                                    label="Password"
                                    variant="bordered"
                                    placeholder="password"
                                    className="m-auto"
                                />
                                {registerError.fieldErrors.userPass && (
                                    <p className="text-red-500 text-xs">{registerError.fieldErrors.userPass}</p>
                                )}
                            </div>
                            <div className="my-3">
                                {registerError.generalError && (
                                    <p className="text-red-500 w-full text-sm">{registerError.generalError}</p>
                                )}
                            </div>
                            <div className="my-3">
                                <Button className="w-full" type="submit">GET STARTED</Button>
                            </div>
                        </form>
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
