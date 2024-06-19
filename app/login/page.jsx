"use client";
import { Button, Input } from "@nextui-org/react";
import logoGoogle from "@/public/google.svg";
import React, { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";

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
  const params = useParams();
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
      (credentials.userEmail == "" || credentials.userPhone == "") &&
      credentials.userPass == ""
    ) {
      setMessageInput("Please enter complete information!");
    } else {
      const resUser = await signIn("credentials", {
        userPass: credentials.userPass,
        userPhone: credentials.userPhone,
        userEmail: credentials.userEmail,
        redirect: false,
      });

      console.log(resUser);
      if (resUser.ok) {
        setMessagelogin("Success");
        const resModels = await fetch(`http://localhost:3000/api/auth/session`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        const data = await resModels.json();

        router.push(`${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${data.user.id}`);
      } else {
        setMessageInput("Please check your information is correct!");
      }
    }
  };

  const handleRegister = () => {
    router.push('/register');
  }

  return (
    <main>
      <div className="flex w-[50rem] m-auto">
        <div className="w-2/4 m-auto">
          <div className="text-3xl"><p>Joyfulwait</p></div>
        </div>
        <div className="w-1/5"></div>
        <div className="w-2/5">
          <div className="m-auto mt-5">
            <>
              <form onSubmit={handleLogin}>
                <div className="mb-2">
                  <p className="text-xs">WELCOME BACK <span className="text-green-500 text-sm">{messagelogin}</span></p>
                </div>
                <div className="mb-5">
                  <h1 className="font-bold text-2xl">Log In to your Account </h1>
                </div>
                {actionLogin == "phone" ? (
                  <div className="my-3">
                    <Input type="text" name="userPhone" value={credentials.userPhone} onChange={handleChange} label="Phone" variant="bordered" placeholder="phone-number" className="max-w-xs m-auto" />
                  </div>
                ) :
                  <div className="my-3">
                    <Input type="email" name="userEmail" value={credentials.userEmail} onChange={handleChange} label="E-mail" variant="bordered" placeholder="@gmail.com" className="max-w-xs m-auto" />
                  </div>
                }
                <div className="my-3">
                  <Input type="password" name="userPass" value={credentials.userPass} onChange={handleChange} label="Password" variant="bordered" placeholder="password" className="max-w-xs m-auto" />
                </div>
                <div className="my-3">
                  <p className="text-red-500 text-sm">{messageInput}</p>
                </div>
                <div className="my-3">
                  {actionLogin == "phone" ? (
                    <p>Login with E-mail <span className="text-blue-500 cursor-pointer" onClick={() => handleClick("email")}>Click!!</span></p>
                  ) : (
                    <p>Login with Phone <span className="text-blue-500 cursor-pointer" onClick={() => handleClick("phone")}>Click!!</span></p>
                  )}
                </div>
                <div className="my-3">
                  <Button className="w-full" type="submit" style={{ backgroundColor: "#1E90FF", color: "#fff" }}>CONTINUE</Button>
                </div>
              </form>
            </>
            <div className="flex">
              <div className="w-2/4"><h2 className="w-full text-center border-b leading-3 mt-3"></h2></div>
              <div className="w-1/4 text-center"><h1>or</h1></div>
              <div className="w-2/4"><h2 className="w-full text-center border-b leading-3 mt-3"></h2></div>
            </div>
            <div className="mt-4 text-center">
              <Button className="w-full" onClick={() => { signIn("google"); }}
                variant="bordered" startContent={<Image src={logoGoogle} width={35} height={35} alt="123" />}>Continue with Google</Button>
            </div>
            <div className="mt-4 text-center">
              <p className="w-full" style={{transition: "color 0.3s" }}>
                No account? <span className="cursor-pointer" onClick={handleRegister} style={{ color: "#1E90FF", transition: "color 0.3s" }}
                  onMouseEnter={(e) => e.target.style.color = "#104E8B"}
                  onMouseLeave={(e) => e.target.style.color = "#1E90FF"}>Register</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
