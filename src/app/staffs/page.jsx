"use client";
import NavBar from "../../components/NavBar";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header";
import { useRouter } from "next/navigation";
import { useGetAllStaffQuery } from "../../redux/features/staff/staffApi"; // Import API hook

const Page = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState("");
    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)._id;
    // 🔹 Fetch store staff data from API (Replace "STORE_ID" with actual store ID)
    const { data: staffList, isLoading, error, refetch } = useGetAllStaffQuery(storeId);

    useEffect(()=>{
        refetch()
    },[refetch])

    return (
        <>
            <Header title="Quản lý nhân viên" />
            <div className="pt-[30px] pb-[100px] px-[20px] mt-12">
                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    <input
                        type="text"
                        placeholder="Tìm nhân viên qua tên/vị trí"
                        className="w-full p-2 border rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                    {/* 🔹 Show loading or error state */}
                    {isLoading && <p className="text-gray-500">Đang tải...</p>}
                    {error && <p className="text-red-500">Lỗi khi tải danh sách nhân viên.</p>}

                    {/* 🔹 Render staff list */}
                    {!isLoading && !error && staffList && (
                        <ul>
                            {staffList
                                .filter(staff => staff.name.toLowerCase().includes(searchTerm.toLowerCase()))
                                .map((staff, index) => (
                                    <li 
                                        key={staff._id} 
                                        className="flex justify-between items-center py-2 ring-1 ring-gray-100 p-3"
                                        onClick={() => router.push(`staffs/${staff._id}`)}
                                    >
                                        <div>
                                            <p className="font-semibold">{staff.name}</p>
                                            <p className="text-gray-500 text-sm">{staff.role.includes("manager") ? "Quản lý" : "Nhân viên"}</p>
                                        </div>
                                        <span className="text-green-500 ring ring-green-500/50 px-2 py-1 rounded-sm text-sm">
                                            Hoạt động
                                        </span>
                                    </li>
                                ))}
                        </ul>
                    )}
                </div>

                <div className="flex w-full place-content-end">
                    <button 
                        className="w-full md:w-auto p-4 bg-orange-500 text-white rounded-lg font-semibold shadow-md hover:bg-orange-600"
                        onClick={() => router.push(`staffs/add`)}
                    >
                        + Thêm nhân viên
                    </button>
                </div>
            </div>

            <NavBar page="" />
        </>
    );
};

export default Page;
