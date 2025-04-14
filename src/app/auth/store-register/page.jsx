'use client';
import React, { useState, useEffect } from 'react';
import MapboxComponent from '../../../components/MapBoxComponent';
import { Stepper, Step } from 'react-form-stepper';
import { toast } from "react-toastify";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as yup from "yup";
import { useRouter } from 'next/navigation';
const StoreRegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [preview, setPreview] = useState({
    avatar: null,
    cover: null,
    ICFront: null,
    ICBack: null,
    businessLicense: null,
    storePictures: [],
  });
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [googleToken, setGoogleToken] = useState("");
  const schema = yup.object().shape({
    password: yup.string().required("Vui lòng nhập mật khẩu!").min(6, "Tối thiểu 6 ký tự!"),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Mật khẩu không khớp!")
      .required("Vui lòng xác nhận lại mật khẩu!"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      if (!googleToken || !email) {
        toast.error("Vui lòng đăng nhập bằng Google trước!");
        return;
      }

      // Use this callback to send data to parent or backend
      onSubmit({
        email,
        password: values.password,
        token: googleToken,
      });

      formik.resetForm();
    },
  });
  const inputClass =
    'w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400';
  const validateStep = () => {
    if (currentStep === 0) {
      const { name, description, category, address } = storeInfo;
      return name && description && category && address;
    }

    if (currentStep === 1) {
      const { latitude, longitude } = storeInfo;
      return latitude !== null && longitude !== null;
    }

    if (currentStep === 2) {
      const { avatar, cover, ICFront, ICBack, businessLicense, storePictures } = storeInfo;
      return avatar && cover && ICFront && ICBack && businessLicense && storePictures.length > 0;
    }

    return true;
  };

  const [storeInfo, setStoreInfo] = useState({
    name: '',
    description: '',
    category: '',
    address: '',
    latitude: null,
    longitude: null,
    avatar: null,
    cover: null,
    ICFront: null,
    ICBack: null,
    businessLicense: null,
    storePictures: [],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          setStoreInfo((prev) => ({ ...prev, latitude, longitude }));
        },
        (error) => {
          console.error('Lỗi lấy vị trí hiện tại:', error);
        }
      );
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo({ ...storeInfo, [name]: value });
  };

  const handleFileChange = (e) => {

    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const newPreview = URL.createObjectURL(file);
      setPreview((prev) => ({
        ...prev,
        [name]: newPreview,
      }));
    }
    setStoreInfo({ ...storeInfo, [name]: files[0] });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreview((prev) => ({
      ...prev,
      storePictures: newPreviews,
    }));
    setStoreInfo({
      ...storeInfo,
      storePictures: [...storeInfo.storePictures, ...Array.from(e.target.files)],
    });
  };

  const handleLocationSelect = (lat, lng) => {
    setStoreInfo({ ...storeInfo, latitude: lat, longitude: lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.entries(storeInfo).forEach(([key, value]) => {
      if (key === 'storePictures') {
        value.forEach((file, index) => {
          formData.append(`storePictures[${index}]`, file);
        });
      } else if (value !== null) {
        formData.append(key, value);
      }
    });

    // Send formData via fetch or Axios here
    console.log('Form Submitted');
  };

  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-md mt-10">
      <h2 className="text-3xl font-semibold mb-6 text-center">Đăng ký cửa hàng</h2>

      <Stepper
        activeStep={currentStep}
        styleConfig={{
          activeBgColor: '#fc6011',
          activeTextColor: '#fff',
          completedBgColor: '#fc6011',
          completedTextColor: '#fff',
          inactiveBgColor: '#e0e0e0',
          inactiveTextColor: '#000',
          size: '1.5em',
          circleFontSize: '1rem',
          labelFontSize: '1rem',
          borderRadius: '50%',
        }}
      >
        <Step label="Thông tin" />
        <Step label="Vị trí" />
        <Step label="Tải ảnh" />
        <Step label='Tài khoản' />
      </Stepper>


      <form onSubmit={handleSubmit} className="space-y-6 mt-6">
        {currentStep === 0 && (
          <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-lg shadow">
            <div>
              <label className="font-medium block mb-1">Tên cửa hàng</label>
              <input type="text" name="name" placeholder="Nhập tên cửa hàng" value={storeInfo.name} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className="font-medium block mb-1">Mô tả</label>
              <input type="text" name="description" placeholder="Mô tả ngắn về cửa hàng" value={storeInfo.description} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className="font-medium block mb-1">Danh mục</label>
              <input type="text" name="category" placeholder="Ví dụ: Đồ ăn nhanh, Cà phê..." value={storeInfo.category} onChange={handleInputChange} className={inputClass} />
            </div>
            <div>
              <label className="font-medium block mb-1">Địa chỉ</label>
              <input type="text" name="address" placeholder="Số nhà, đường, quận/huyện..." value={storeInfo.address} onChange={handleInputChange} className={inputClass} />
            </div>
          </div>
        )}

        {currentStep === 1 && (
          <div className="bg-gray-50 p-6 rounded-lg shadow">
            <label className="font-medium block mb-2">Chọn vị trí trên bản đồ</label>
            <MapboxComponent
              currentLatitude={storeInfo.latitude}
              currentLongitude={storeInfo.longitude}
              onLocationSelect={handleLocationSelect}
            />
          </div>
        )}


        {currentStep === 2 && (
          <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-lg shadow">
            <div>
              <label className="font-medium block mb-1">Ảnh đại diện</label>
              <input type="file" name="avatar" accept="image/*" onChange={handleFileChange} className={inputClass} />
              {preview.avatar && (
                <img src={preview.avatar} alt="Avatar Preview" className="mt-2 w-32 h-32 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="font-medium block mb-1">Ảnh bìa</label>
              <input type="file" name="cover" accept="image/*" onChange={handleFileChange} className={inputClass} />
              {preview.cover && (
                <img src={preview.cover} alt="Cover Preview" className="mt-2 w-full h-40 object-cover rounded-lg" />
              )}
            </div>

            <div>
              <label className="font-medium block mb-1">CMND Mặt trước</label>
              <input type="file" name="ICFront" onChange={handleFileChange} className={`${inputClass} mb-2`} />
              {preview.ICFront && <img src={preview.ICFront} alt="CMND Mặt trước" className="mb-2 w-60 rounded" />}

              <label className="font-medium block mb-1">CMND Mặt sau</label>
              <input type="file" name="ICBack" onChange={handleFileChange} className={`${inputClass} mb-2`} />
              {preview.ICBack && <img src={preview.ICBack} alt="CMND Mặt sau" className="mb-2 w-60 rounded" />}

              <label className="font-medium block mb-1">Giấy phép kinh doanh</label>
              <input type="file" name="businessLicense" onChange={handleFileChange} className={inputClass} />
              {preview.businessLicense && <img src={preview.businessLicense} alt="Giấy phép KD" className="mt-2 w-40 rounded" />}
            </div>
            <div>
              <label className="font-medium block mb-1">Ảnh cửa hàng</label>
              <input type="file" name="storePictures" multiple onChange={handleImageUpload} className={inputClass} />
              <div className="flex flex-wrap gap-2 mt-2">
                {preview.storePictures.map((src, index) => (
                  <img key={index} src={src} alt={`Ảnh cửa hàng ${index + 1}`} className="w-auto h-auto object-cover rounded" />
                ))}
              </div>
            </div>
          </div>

        )}

        {currentStep === 3 && (
          <div className="flex flex-col items-start justify-center min-h-[60vh]">
            <p className="mb-4 text-gray-600 w-full text-center">
              Hãy đăng nhập bằng Google để sử dụng email làm thông tin tài khoản và tạo mật khẩu.
            </p>

            {!email && (
              <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    const token = credentialResponse.credential;
                    const decoded = jwtDecode(token);
                    const gmail = decoded?.email;

                    if (!gmail) {
                      toast.error("Không lấy được email từ tài khoản Google!");
                      return;
                    }

                    setEmail(gmail);
                    setGoogleToken(token);
                    toast.success("Đăng nhập bằng Google thành công!");
                  }}
                  onError={() => {
                    toast.error("Đăng nhập bằng Google thất bại!");
                  }}
                  shape="pill"
                  width="100%"
                />
              </GoogleOAuthProvider>
            )}

            {email && (
              <form
                onSubmit={formik.handleSubmit}
                className="flex flex-col items-center justify-center w-full mt-6"
              >
                <div className="w-[80%] mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-600">Email</label>
                  <input
                    type="email"
                    value={email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="w-[80%] mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-600">Mật khẩu</label>
                  <input
                    type="password"
                    name="password"
                    className={inputClass}
                    placeholder='Nhập mật khẩu'
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
                  )}
                </div>

                <div className="w-[80%] mb-4">
                  <label className="block mb-1 text-sm font-medium text-gray-600">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    placeholder='Nhập lại mật khẩu'
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={inputClass}
                  />
                  {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                    <div className="text-red-500 text-sm mt-1">{formik.errors.confirmPassword}</div>
                  )}
                </div>
              </form>
            )}
          </div>
        )}



        <div className="flex justify-between mt-8">
          {currentStep > 0 && (
            <button type="button" onClick={prevStep} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
              Quay lại
            </button>
          )}
          {currentStep < 3 ? (
            <button
              type="button"
              onClick={() => {
                if (validateStep()) {
                  nextStep();
                } else {
                  toast.error('Vui lòng điền đầy đủ thông tin trước khi tiếp tục.');
                }
              }}
              className="ml-auto px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Tiếp theo
            </button>
          ) : (
            <button
              className={`ml-auto px-4 py-2 text-white rounded ${formik.isValid && formik.dirty
                ? "bg-[#fc6011] cursor-pointer"
                : "bg-[#f5854d] cursor-not-allowed"
                }`}
            >
              Hoàn tất
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default StoreRegistrationPage;
