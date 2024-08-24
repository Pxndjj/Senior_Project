"use client"; // Ensure the component is treated as a Client Component

import React, { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  Dropdown,
  DropdownTrigger,
  Avatar,
  AvatarIcon,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import Image from "next/image";
import bannerApp from "@/public/images/logo.png";
import { usePathname, useRouter } from "next/navigation";

const NavbarComponent = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const excludedPaths = ["/login", "/register", "/restaurant", "/admin", "/role"];
  const excludedPaths1 = ["/restaurant", "/admin", "/"];

  useEffect(() => {
    if (!session && !excludedPaths.some((path) => pathname.startsWith(path))) {
      localStorage.setItem("previousPath", pathname);
    }
  }, [pathname, session, excludedPaths]);

  useEffect(() => {
    if (excludedPaths1.some((path) => pathname.startsWith(path))) {
      return;
    }
    if (session && status === "authenticated") {
      const previousPath = localStorage.getItem("previousPath");
      if (previousPath && previousPath !== pathname) {
        router.push(previousPath);
      }
    }
  }, [session, status, pathname, router]);

  if (excludedPaths.some((path) => pathname.startsWith(path))) {
    return null;
  }

  return (
    <Navbar isBordered maxWidth="full" className="z-[4000]">
      <NavbarContent justify="start">
        <NavbarBrand className="mr-4">
          <Image src={bannerApp} alt="bannerApp" width={60} height={60} />
          <p
            className="hidden sm:block font-semibold text-xl text-gray-800 cursor-pointer transition-colors duration-300 ease-in-out"
            onClick={() => router.push("/")}
          >
            JoyfulWait
          </p>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent as="div" className="items-center" justify="end">
        {session?.user ? (
          <>
            <div className="text-right">
              <p className="text-sm font-semibold">Hi</p>
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
                {session?.user?.role === "restaurant" ? (
                  <DropdownItem
                    startContent={<span className="material-symbols-outlined">restaurant_menu</span>}
                    key="go-to-restaurant"
                    onClick={() => router.push(`/restaurant/${session?.user?.id}`)}
                  >
                    Go to Restaurant
                  </DropdownItem>
                ) : null}
                {session?.user?.role === "admin" ? (
                  <DropdownItem
                    startContent={<span className="material-symbols-outlined">shield_person</span>}
                    key="go-to-restaurant"
                    onClick={() => router.push(`/admin/${session?.user?.id}`)}
                  >
                    Go to admin
                  </DropdownItem>
                ) : null}

                <DropdownItem
                  startContent={<span className="material-symbols-outlined">logout</span>}
                  key="logout"
                  color="danger"
                  onClick={() => signOut()}
                >
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <div className="flex space-x-4">
            <button
              onClick={() => router.push("/login")}
              className="border border-black text-black font-semibold py-2 px-4 rounded-full hover:bg-black hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </button>
            <button
              onClick={() => router.push("/register")}
              className="border border-black text-black font-semibold py-2 px-4 rounded-full hover:bg-black hover:text-white transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register
            </button>
          </div>

        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
