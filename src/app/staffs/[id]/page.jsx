"use client";
import NavBar from "../../../components/NavBar";
import Header from "../../../components/Header";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useGetStaffQuery, useUpdateStaffMutation } from "../../../redux/features/staff/staffApi";
import { useParams } from "next/navigation";

const roleOptions = [
  { label: "Nhân viên", value: "staff" },
  { label: "Quản lý", value: "manager" },
];

const StaffDetailPage = () => {
  const { id } = useParams();
  const storeData = localStorage.getItem("store");
  const storeId = JSON.parse(storeData)._id;

  const { data: staffData, isLoading, refetch } = useGetStaffQuery({ storeId, staffId: id });
  const [updateStaff] = useUpdateStaffMutation();

  const [staff, setStaff] = useState({
    name: "",
    email: "",
    phonenumber: "",
    gender: "male",
    role: "staff",
  });

  const [isEditing, setIsEditing] = useState({
    name: false,
    email: false,
    phonenumber: false,
    gender: false,
    role: false,
  });

  useEffect(() => {
    refetch()
  }, [refetch])

  useEffect(() => {
    if (staffData) {
      // Extract only the manager role if multiple roles exist
      const roleList = Array.isArray(staffData.role) ? staffData.role : [staffData.role];
      const role = roleList.includes("manager") ? "manager" : "staff";

      setStaff({
        name: staffData.name || "",
        email: staffData.email || "",
        phonenumber: staffData.phonenumber || "",
        gender: staffData.gender || "male",
        role: role,
      });
    }
  }, [staffData]);

  const handleChange = (field, value) => {
    setStaff((prev) => ({ ...prev, [field]: value }));
  };

  const toggleEdit = (field) => {
    setIsEditing((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSave = async () => {
    const updatedData = {
      _id: id,
      name: staff.name,
      email: staff.email,
      phonenumber: staff.phonenumber,
      gender: staff.gender,
      role: staff.role, // Ensuring only "staff" or "manager" is saved
    };
    console.log(storeId)

    await updateStaff({ storeId: storeId, staffData: updatedData });

    setIsEditing({
      name: false,
      email: false,
      phonenumber: false,
      gender: false,
      role: false,
    });

    alert("Thông tin nhân viên đã được cập nhật!");
  };

  if (isLoading) return <p>Đang tải dữ liệu...</p>;

  return (
    <>
      <Header title="Cập nhật Nhân Viên" goBack={true} />
      <div className="pt-8 pb-24 px-5 space-y-6 mt-12">
        {/* 🔹 Họ và Tên */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Họ và tên</p>
          <div className="flex items-center space-x-2">
            {isEditing.name ? (
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={staff.name}
                onChange={(e) => handleChange("name", e.target.value)}
              />
            ) : (
              <p className="text-lg font-semibold flex-1">{staff.name}</p>
            )}
            <button onClick={() => toggleEdit("name")}>
              <Image src="/assets/editing.png" alt="Edit" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* 🔹 Email */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Email</p>
          <div className="flex items-center space-x-2">
            {isEditing.email ? (
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={staff.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            ) : (
              <p className="text-lg font-semibold flex-1">{staff.email}</p>
            )}
            <button onClick={() => toggleEdit("email")}>
              <Image src="/assets/editing.png" alt="Edit" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* 🔹 Số điện thoại */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Số điện thoại</p>
          <div className="flex items-center space-x-2">
            {isEditing.phonenumber ? (
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={staff.phonenumber}
                onChange={(e) => handleChange("phonenumber", e.target.value)}
              />
            ) : (
              <p className="text-lg font-semibold flex-1">{staff.phonenumber}</p>
            )}
            <button onClick={() => toggleEdit("phonenumber")}>
              <Image src="/assets/editing.png" alt="Edit" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* 🔹 Giới tính */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Giới tính</p>
          <div className="flex items-center space-x-2">
            {isEditing.gender ? (
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={staff.gender}
                onChange={(e) => handleChange("gender", e.target.value)}
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
              </select>
            ) : (
              <p className="text-lg font-semibold flex-1">
                {staff.gender === "male" ? "Nam" : "Nữ"}
              </p>
            )}
            <button onClick={() => toggleEdit("gender")}>
              <Image src="/assets/editing.png" alt="Edit" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* 🔹 Vai trò */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <p className="text-gray-500 text-sm mb-1">Vai trò</p>
          <div className="flex items-center space-x-2">
            {isEditing.role ? (
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                value={staff.role}
                onChange={(e) => handleChange("role", e.target.value)}
              >
                {roleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-lg font-semibold flex-1">
                {staff.role === "manager" ? "Quản lý" : "Nhân viên"}
              </p>
            )}
            <button onClick={() => toggleEdit("role")}>
              <Image src="/assets/editing.png" alt="Edit" width={24} height={24} />
            </button>
          </div>
        </div>

        {/* 🔹 Nút Lưu */}
        <button
          className="w-full bg-green-500 text-white py-3 rounded-md text-lg font-semibold hover:bg-green-600"
          onClick={handleSave}
        >
          Lưu thông tin
        </button>
      </div>

      <NavBar page="home" />
    </>
  );
};

export default StaffDetailPage;
