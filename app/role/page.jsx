"use client";
import { Button} from "@nextui-org/react";
import React, {useState} from 'react';
import { useSession } from "next-auth/react"
import RoleSelect from '@/components/roleselect/RoleSelect';


const api = {
  updateRole:async(up)=>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/users/updaterole`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: up }),
  });
  const checkUser = await res.json();
  return checkUser
  }
}

const Role = () => {
    const { data: session,status,update} = useSession();
    const [role, setRole] = useState('user');

    const handleOnSubmit = async (e) => {
      e.preventDefault();
      try {
        let uptRole = {"id":session.user.id,"role":role};
          const res = await api.updateRole(uptRole);
          if (res) {
            await update({role:res.userRole});
            //ไม่ใช้ route เพื่อให้วิ่งเข้า server 
            switch (res.userRole){
              case "admin":
                window.location =`${process.env.NEXT_PUBLIC_BASE_URL}/admin`;
                break;
              case "restaurant":
                window.location =`${process.env.NEXT_PUBLIC_BASE_URL}/restaurant/${res._id}`;
              break;
              default:
                window.location =`${process.env.NEXT_PUBLIC_BASE_URL}/admin`;
            }

          } 
      } catch (error) {
          console.log(error);
      }

    };

    if(status=="loading" && session?.user?.role==''){
        return (
            <div>Load...</div>
        )
    }
    if(session?.user?.role=='') {
      return (
        <main className="md:w-[80rem] md:px-6">
          <div className="md:flex m-auto h-100vh">
          <div className="grid items-center grid-cols-1 justify-center w-full md:w-3/4 m-auto text-center h-30vh">
            <div>
                <p className="text-4xl">Joyfulwait </p>
                <p className="mt-2">
                <span className="ml-2 "><span  className="text-hiligh">Hi, </span> We require you to clearly specify the type of use. </span>
                </p>
            </div>          
          </div>
            <div className="grid items-center grid-cols-1 justify-center w-full md:w-1/3 px-2">
            <div className="w-full m-auto card-default">
            <form className="py-8 grid items-center grid-cols-1 justify-center" onSubmit={handleOnSubmit}>
            <p className="text-2xl my-4 text-center">Select your user type </p>
              <RoleSelect role={role} setRole={setRole}/>
                <div className="my-3">
                  <Button className="w-full" type="submit">Next</Button>
                </div>
                </form>
                </div>
            </div>
          </div>
        </main>
      );
    }
};

export default Role;
