"use client";
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
import bannerApp from "@/public/j.png";
import { usePathname, useRouter } from "next/navigation";

const NavbarComponent = () => {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const excludedPaths = ["/login", "/register", "/restaurant", "/admin", "/role"];
  const excludedPaths1 = ["/restaurant", "/admin", "/"];

  // บันทึก path ก่อนหน้าหากไม่มี session
  useEffect(() => {
    if (!session && !excludedPaths.some((path) => pathname.startsWith(path))) {
      localStorage.setItem("previousPath", pathname);
    }
  }, [pathname, session, excludedPaths]);

  // ตรวจสอบ session หากเพิ่ง login และนำทางไปยัง path ก่อนหน้า
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
          <p className="hidden sm:block font-bold text-inherit cursor-pointer" onClick={() => router.push("/")}>JoyfulWait</p>
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
                    Go To Restaurant
                  </DropdownItem>
                ) : null}
                {session?.user?.role === "admin" ? (
                  <DropdownItem
                    startContent={<span className="material-symbols-outlined">shield_person</span>}
                    key="go-to-restaurant"
                    onClick={() => router.push(`/admin/${session?.user?.id}`)}
                  >
                    Go To admin
                  </DropdownItem>
                ) : null}

                
                <DropdownItem startContent={<span className="material-symbols-outlined">library_books</span>} key="booking" onClick={() => router.push(`/booking/${session?.user?.id}`)}>My Booking</DropdownItem>
                <DropdownItem startContent={<span className="material-symbols-outlined">logout</span>} key="logout" color="danger" onClick={() => signOut()}>Log Out</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </>
        ) : (
          <button onClick={() => router.push("/login")} className="btn-login">
            Login
          </button>
        )}
      </NavbarContent>
    </Navbar>
  );
};

export default NavbarComponent;
