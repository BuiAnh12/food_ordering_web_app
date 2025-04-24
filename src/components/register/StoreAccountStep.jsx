import { useFormik } from "formik";
import * as Yup from "yup";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useLazyCheckStoreOwnerEmailQuery } from "../../redux/features/auth/authApi";
const StoreAccountStep = ({ onSubmit, inputClass, nextStep }) => {
  const [email, setEmail] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const [checkStoreOwnerEmail] = useLazyCheckStoreOwnerEmailQuery();
  const validateStep = () => {
    return (
      email &&
      googleToken &&
      formik.values.password &&
      formik.values.confirmPassword
    );
  };

  const handleClickSubmit = () => {
    if (validateStep()) {
      console.log(
        "Submitting form with email:",
        email,
        "and password:",
        formik.values.password
      );
      onSubmit("", email, formik.values.password, false);
    } else {
      toast.error("Vui lòng điền đầy đủ thông tin trước khi tiếp tục.");
    }
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Email không hợp lệ").required("Bắt buộc"),
      password: Yup.string().min(6, "Ít nhất 6 ký tự").required("Bắt buộc"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password")], "Mật khẩu không khớp")
        .required("Bắt buộc"),
    }),
  });

  return (
    <div className="flex flex-col items-start justify-center min-h-[60vh]">
      <p className="mb-4 text-gray-600 w-full text-center">
        Hãy đăng nhập bằng Google để sử dụng email làm thông tin tài khoản và
        tạo mật khẩu.
      </p>

      {!email && (
        <div className="flex flex-col items-center justify-center w-full mt-6">
          <GoogleOAuthProvider
            clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
          >
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                const token = credentialResponse.credential;
                const decoded = jwtDecode(token);
                const gmail = decoded?.email;

                if (!gmail) {
                  toast.error("Không lấy được email từ tài khoản Google!");
                  return;
                }
                try {
                  const result = await checkStoreOwnerEmail(gmail);
                  const data = result.data;
                  const role = data?.role;
                  console.log(result);
              
                  if (!data.data) {
                    // Tài khoản chưa tồn tại
                    setEmail(gmail);
                    setGoogleToken(token);
                    toast.success("Đăng nhập bằng Google thành công!");
                  } else if (!role) {
                    // Tài khoản tồn tại nhưng chưa có vai trò
                    toast.success("Tài khoản đã tồn tại! Có thể đăng ký tài khoản cho cửa hàng");
                    onSubmit(data.data._id , gmail, "", true);
                  } else if (role) {
                    toast.error(data.message); // ví dụ: "Tài khoản đã được đăng ký làm chủ cửa hàng"
                  } else {
                    toast.error("Đã xảy ra lỗi khi kiểm tra tài khoản.");
                  }
                } catch (error) {
                  toast.error(error?.message || "Lỗi không xác định.");
                }
              }}
              onError={() => {
                toast.error("Đăng nhập bằng Google thất bại!");
              }}
              shape="pill"
              width="100%"
            />
          </GoogleOAuthProvider>
        </div>
      )}

      {email && (
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col items-center justify-center w-full mt-6"
        >
          <div className="w-[80%] mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Email
            </label>
            <input
              type="email"
              value={email}
              disabled
              className={inputClass + " cursor-not-allowed"}
            />
          </div>

          <div className="w-[80%] mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Mật khẩu
            </label>
            <input
              type="password"
              name="password"
              className={inputClass}
              placeholder="Nhập mật khẩu"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          <div className="w-[80%] mb-4">
            <label className="block mb-1 text-sm font-medium text-gray-600">
              Xác nhận mật khẩu
            </label>
            <input
              type="password"
              name="confirmPassword"
              placeholder="Nhập lại mật khẩu"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={inputClass}
            />
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.confirmPassword}
                </div>
              )}
          </div>
          <div className="w-[80%] flex justify-end mt-4">
            <button
              type="button"
              onClick={handleClickSubmit}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Đăng ký tài khoản
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default StoreAccountStep;
