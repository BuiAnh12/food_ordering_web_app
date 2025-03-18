"use client";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLogoutUserMutation } from "../redux/features/auth/authApi";
import { useSelector } from "react-redux";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";

const Header = ({ title, goBack }) => {
    const router = useRouter();
    const [logoutUser] = useLogoutUserMutation();
    return (
        <>
            <div className="flex items-center justify-between shadow-lg py-4 px-5 fixed top-0 left-0 right-0 z-50 bg-white">
                {goBack ? (
                    <div className="flex items-center justify-start">
                        <div className="w-6 h-6 bg-transparent mr-6" onClick={() => router.back()}>
                            <Image src="/assets/back.png" alt="Back Icon" width={32} height={32} className="cursor-pointer" />
                        </div>
                        <h3 className="text-[#4A4B4D] text-xl">{title}</h3>
                    </div>
                ) : (
                    <div>
                        <h3 className="text-[#4A4B4D] text-xl">{title}</h3>
                    </div>
                )}

                {/* Icons Section */}
                <div className="flex items-center space-x-7">
                    {/* Notification Icon */}
                    <Link href="#" aria-label="Notifications">
                        <Image src="/assets/notification.png" alt="Notification Icon" width={24} height={24} className="cursor-pointer" />
                    </Link>

                    {/* User Profile Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="focus:outline-none">
                                <Image src="/assets/user.png" alt="User Icon" width={24} height={24} className="cursor-pointer" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-white border rounded-lg shadow-md w-40 p-2 mt-2">
                            <DropdownMenuItem className="p-2 hover:bg-gray-100 cursor-pointer">
                                <Link href="/account">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="p-2 hover:bg-gray-100 cursor-pointer text-red-500"
                                onClick={() => logoutUser()}
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </>
    );
};

export default Header;
