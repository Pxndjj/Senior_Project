"use client";
import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Navbar, NavbarBrand, NavbarContent, Dropdown, DropdownTrigger, Avatar, AvatarIcon, DropdownMenu, DropdownItem } from "@nextui-org/react";
import Image from "next/image";
// import bannerApp from '@/public/j.png';
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const NavbarComponent = () => {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const excludedPaths = ['/login', '/register', '/restaurant', '/admin'];

  useEffect(() => {
    if (!session || !excludedPaths.some(path => pathname.startsWith(path))) {
      localStorage.setItem("previousPath", pathname);
    }
  }, [pathname, session]);

  if ((excludedPaths.some(path => pathname.startsWith(path))) || (!session)) {
    return null;
  }

  return (
    <Navbar isBordered maxWidth="full" className="z-[4000]">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          {/* <Image src={bannerApp} alt="bannerApp" width={60} height={60} /> */}
          <p className="hidden sm:block font-bold text-inherit">JoyfulWait</p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        {session?.user && (
          <>
            <div className="text-right">
              <p className="text-sm font-semibold">Welcome</p>
              <p className="text-lg font-bold text-gray-300">{session?.user?.name}</p>
            </div>
            <Dropdown placement="bottom-end">
              <DropdownTrigger>
                <Avatar
                  icon={<AvatarIcon />}
                  classNames={{
                    base: "bg-gradient-to-br from-[#FFB457] to-[#FF705B]",
                    icon: "text-black/80",
                  }}
                />
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem key="logout" color="danger" onClick={() => signOut()}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
