"use client";
import { Button } from "@nextui-org/react";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import RoleSelect from '@/components/roleselect/RoleSelect';

const api = {
  updateRole: async (up) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/updaterole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: up }),
    });
    const checkUser = await res.json();
    return checkUser;
  }
}

const AcceptAdmin = () => {
  const { data: session, status, update } = useSession();
  const [role, setRole] = useState('admin');

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try {
      let uptRole = { "id": session.user.id, "role": role };
      const res = await api.updateRole(uptRole);
      if (res) {
        await update({ role: res.userRole });
        //ไม่ใช้ route เพื่อให้วิ่งเข้า server 
        window.location = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/${res._id}`;
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (status == "loading" && session?.user?.role == '') {
    return (
      <div>Load...</div>
    );
  }
  
  if (session?.user?.role == '') {
    return (
      <main className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="text-3xl mb-4">
            <p>JoyfulWait</p>
          </div>
          <div><h2>Hi, {session.user.name} welcome to new admin</h2></div>   
          <div className="flex flex-col items-center">
            <div className="mb-4">
              <img src="/images/admin-img.svg" className="mx-auto"/>
            </div>
            <div>
              <form onSubmit={handleOnSubmit}>
                <div className="my-3">
                  <Button className="w-full" type="submit">Go to admin page</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    );
  }
};

export default AcceptAdmin;
