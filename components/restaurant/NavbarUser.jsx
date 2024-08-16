"use client";
import { useSession, signOut } from "next-auth/react"
import React, { useEffect, useState } from 'react';
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@nextui-org/react";

const NavbarUser = () => {
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      localStorage.setItem('darkMode', !prevMode);
      document.body.classList.toggle('dark-mode-variables', !prevMode);
      return !prevMode;
    });
  };
  useEffect(() => {
    const savedTheme = localStorage.getItem('darkMode');
    document.body.classList.toggle('dark-mode-variables', savedTheme === 'true');
    setDarkMode(savedTheme === 'true' || false);
  }, []);
  const clickMenu = () => {
    const sideMenu = document.querySelector('aside');
    sideMenu.style.animation = "showMenu 0.4s ease forwards";
    sideMenu.style.display = 'block';
  }
  if (session?.user?.name !== '') {
    return (
      <div className="nav">
        <button onClick={clickMenu}>
          <span className="material-symbols-outlined">menu</span>
        </button>
        {/* <div onClick={toggleDarkMode} className="dark-mode ext-active">
          <span className={darkMode ? "material-symbols-outlined" : "material-symbols-outlined active"}>light_mode</span>
          <span className={darkMode ? "material-symbols-outlined active" : "material-symbols-outlined"}>dark_mode</span>
        </div> */}

        <div className="profile" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="info">
            <p>Welcome , <b>{session?.user?.name}</b></p>
            <small className="text-muted">{session?.user?.role}</small>
          </div>
          <div className="profile-photo" style={{ width: '50px', height: '50px' }}>
            <img
              src={(session?.user.image == 'default') ? "/images/user-g.svg" : session?.user.image}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
            />
          </div>
        </div>
      </div>
    )
  }
}
export default NavbarUser;
