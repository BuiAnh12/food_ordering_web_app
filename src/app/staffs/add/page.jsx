"use client";
import NavBar from "../../../components/NavBar";
import Header from "../../../components/Header";
import { useState, useEffect } from "react";
import {
  useGetStaffQuery,
  useCreateStaffMutation,
  useUpdateStaffMutation,
} from "../../../redux/features/staff/staffApi";
import { useParams } from "next/navigation";

const roleOptions = [
  { label: "Nhân viên", value: "staff" },
  { label: "Quản lý", value: "manager" },
];

const StaffDetailPage = () => {
  const { id } = useParams(); // Staff ID from URL
  const storeData = localStorage.getItem("store");
  const storeId = JSON.parse(storeData)._id;

  const isNew = !id; // If no ID, we're adding a new staff member

  const { data: staffData, isLoading, refetch } = useGetStaffQuery(
    { storeId, staffId: id },
    { skip: isNew }
  );
  const [createStaff] = useCreateStaffMutation();
  const [updateStaff] = useUpdateStaffMutation();

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phonenumber: "",
    gender: "male",
    password: "", // ✅ Added password field
    role: "staff",
  });

  useEffect(() => {
    if (!isNew) {
      refetch();
    }
  }, [refetch, isNew]);

  useEffect(() => {
    if (staffData) {
      const roleList = Array.isArray(staffData.role) ? staffData.role : [staffData.role];
      const role = roleList.includes("manager") ? "manager" : "staff";

      setStaff({
        name: staffData.name || "",
        email: staffData.email || "",
        phonenumber: staffData.phonenumber || "",
        gender: staffData.gender || "male",
        password: "", // ✅ Reset password when loading existing staff
        role: role,
      });
    }
  }, [staffData]);

  const handleChange = (field, value) => {
    setStaff((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    const staffData = {
      name: staff.name,
      email: staff.email,
      phonenumber: staff.phonenumber,
      gender: staff.gender,
      role: staff.role,
    };

    if (staff.password) {
      staffData.password = staff.password; // ✅ Only send password if it's not empty
    }

    try {
      if (isNew) {
        await createStaff({ storeId, staffData }).unwrap();
        alert("Nhân viên mới đã được thêm!");
      } else {
        await updateStaff({ storeId, staffData: { ...staffData, staff_id: id } }).unwrap();
        alert("Thông tin nhân viên đã được cập nhật!");
      }
    } catch (error) {
      console.error("Lỗi khi lưu nhân viên:", error);
      alert(error.data?.message || "Có lỗi xảy ra khi lưu nhân viên!");
    }
  };

  if (isLoading && !isNew) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <Header title={isNew ? "Thêm Nhân Viên" : "Cập nhật Nhân Viên"} goBack={true} />
      <div className="pt-8 pb-24 px-5 space-y-6 mt-12">
        {/* 🔹 Họ và Tên */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Họ và tên</p>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2"
            value={staff.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>

        {/* 🔹 Email */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Email</p>
          <input
            type="email"
            className="w-full p-2 border rounded-md focus:ring-2"
            value={staff.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        {/* 🔹 Password */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Mật khẩu (để trống nếu không thay đổi)</p>
          <input
            type="password"
            className="w-full p-2 border rounded-md focus:ring-2"
            value={staff.password}
            onChange={(e) => handleChange("password", e.target.value)}
          />
        </div>

        {/* 🔹 Số điện thoại */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
          <input
            type="text"
            className="w-full p-2 border rounded-md focus:ring-2"
            value={staff.phonenumber}
            onChange={(e) => handleChange("phonenumber", e.target.value)}
          />
        </div>

        {/* 🔹 Giới tính */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Giới tính</p>
          <select
            className="w-full p-2 border rounded-md focus:ring-2"
            value={staff.gender}
            onChange={(e) => handleChange("gender", e.target.value)}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
          </select>
        </div>

        {/* 🔹 Vai trò */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Vai trò</p>
          <select
            className="w-full p-2 border rounded-md focus:ring-2"
            value={staff.role}
            onChange={(e) => handleChange("role", e.target.value)}
          >
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* 🔹 Nút Lưu */}
        <button
          className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-600"
          onClick={handleSave}
        >
          {isNew ? "Thêm Nhân Viên" : "Lưu thông tin"}
        </button>
      </div>

      <NavBar page="home" />
    </>
  );
};

export default StaffDetailPage;
