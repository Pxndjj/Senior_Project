"use client";
import { Button } from "@nextui-org/react";
import React, { useState } from 'react';
import { useSession } from "next-auth/react";
import RoleSelect from '@/components/roleselect/RoleSelect';

const Role = () => {
  const { data: session} = useSession();
  const [role, setRole] = useState('user');

  const handleOnSubmit = async (e) => {
    e
  };

  return (
    <main className="md:w-[92rem] md:px-6">
      <div className="md:flex m-auto h-100vh">
        <div className="grid items-center grid-cols-1 justify-center w-full md:w-2/3 m-auto text-center h-30vh">
          <div className="w-2/4 m-auto">
            <p className="text-3xl">Joyfulwait</p>
            <div><h2>Hello, {session?.user?.name} We want you to specify the type of use.</h2></div>
          </div>
        </div>
        <div className="grid items-center grid-cols-1 justify-center w-full md:w-1/3 px-2">
          <div className="w-full m-auto card-default">
            <form className="py-8 grid items-center grid-cols-1 justify-center" onSubmit={handleOnSubmit}>
              <p className="text-2xl my-4 text-center">Type of user</p>
              <RoleSelect role={role} setRole={setRole} />
              <div className="my-3">
                <Button className="w-full" type="submit">Next</Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Role;
