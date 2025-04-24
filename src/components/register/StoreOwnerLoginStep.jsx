"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import Image from "next/image";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import {
  useLoginUserMutation,
  useGetOwnStoreMutation,
} from "../../redux/features/auth/authApi";

const StoreOwnerLoginStep = ({ onSuccess }) => {
  const router = useRouter();
  const [loginUser, { isSuccess: loginSuccess, error: loginError }] = useLoginUserMutation();
  const [getOwnStore] = useGetOwnStoreMutation();

  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (loginSuccess) {
      toast.success("Xác thực thành công!");
      handlePostLogin();
    }

    if (loginError && "data" in loginError) {
      toast.error(loginError.data.message);
    }
  }, [loginSuccess, loginError]);

  const handlePostLogin = async () => {
    try {
      const { data } = await getOwnStore().unwrap();
      if (data) {
        localStorage.setItem("store", JSON.stringify(data));
      }
      if (onSuccess) onSuccess(); // Notify parent component
    } catch (error) {
      toast.error("Không thể lấy thông tin cửa hàng.");
    }
  };

  const schema = yup.object().shape({
    email: yup.string().email("Email không hợp lệ!").required("Vui lòng nhập Email!"),
    password: yup.string().required("Vui lòng nhập mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      await loginUser(values);
    },
  });

  return (
    <div className="md:bg-[#f9f9f9] md:pt-[50px]">
      <div className="bg-[#fff] lg:w-[60%] md:w-[80%] md:mx-auto md:border md:border-[#a3a3a3a3] md:rounded-[10px] md:shadow-[rgba(0,0,0,0.24)_0px_3px_8px] md:overflow-hidden">
        <div className="flex flex-col items-center justify-between py-[50px] h-screen md:h-full">
          <div className="flex flex-col items-center w-full">
            <h3 className="text-[#4A4B4D] text-[26px] font-bold pb-[20px]">
              Xác thực lại để tiếp tục
            </h3>
            <Image
              src="/assets/app_logo.png"
              alt=""
              height={120}
              width={120}
              className="mb-[10px]"
            />

            <form onSubmit={formik.handleSubmit} className="flex flex-col items-center w-full">
              {/* Email */}
              <div className="w-[80%] my-[10px]">
                <div
                  className={`relative flex items-center bg-[#f5f5f5] text-[#636464] rounded-full gap-[8px] border border-solid overflow-hidden ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-[#7a7a7a]"}`}
                >
                  <Image
                    src="/assets/email.png"
                    alt=""
                    width={25}
                    height={25}
                    className="absolute top-[50%] left-[25px] translate-y-[-50%]"
                  />
                  <input
                    type="email"
                    name="email"
                    value={formik.values.email}
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    placeholder="Nhập email cửa hàng"
                    className="bg-[#f5f5f5] text-[18px] py-[20px] pr-[20px] pl-[60px] w-full"
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm mt-[5px] ml-[20px]">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="w-[80%] my-[10px]">
                <div
                  className={`relative flex items-center bg-[#f5f5f5] text-[#636464] rounded-full gap-[8px] border border-solid overflow-hidden ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-[#7a7a7a]"}`}
                >
                  <Image
                    src="/assets/lock.png"
                    alt=""
                    width={25}
                    height={25}
                    className="absolute top-[50%] left-[25px] translate-y-[-50%]"
                  />
                  <input
                    type={showPass ? "text" : "password"}
                    name="password"
                    value={formik.values.password}
                    onChange={formik.handleChange("password")}
                    onBlur={formik.handleBlur("password")}
                    placeholder="Nhập mật khẩu"
                    className="bg-[#f5f5f5] text-[18px] py-[20px] pr-[20px] pl-[60px] w-full"
                  />
                  <Image
                    src={`/assets/${showPass ? "eye_show" : "eye_hide"}.png`}
                    alt=""
                    width={25}
                    height={25}
                    className="absolute top-[50%] right-[25px] translate-y-[-50%] cursor-pointer"
                    onClick={() => setShowPass(!showPass)}
                  />
                </div>
                {formik.touched.password && formik.errors.password && (
                  <div className="text-red-500 text-sm mt-[5px] ml-[20px]">
                    {formik.errors.password}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className={`text-center text-[#fff] font-semibold w-[80%] p-[20px] rounded-full my-[10px] ${formik.isValid && formik.dirty ? "bg-[#fc6011] cursor-pointer" : "bg-[#f5854d] cursor-not-allowed"}`}
              >
                Xác thực
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreOwnerLoginStep;
