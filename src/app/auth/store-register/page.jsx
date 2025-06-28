"use client";

import { Stepper, Step } from "react-form-stepper";
import StoreAddressStep from "../../../components/register/StoreAddressStep";
import StoreBasicInfoStep from "../../../components/register/StoreBasicInfoStep";
import StoreDocumentsStep from "../../../components/register/StoreDocumentsStep";
import StoreAccountStep from "../../../components/register/StoreAccountStep";
import StoreOwnerLoginStep from "../../../components/register/StoreOwnerLoginStep";
import React, { useState, useEffect } from "react";
import { useRegisterStoreOwnerMutation } from "../../../redux/features/auth/authApi";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import { useGetAllFoodTypeQuery } from "../../../redux/features/foodType/foodTypeApi";
import Modal from "../../../components/Modal";
import { useRegisterStoreMutation } from "../../../redux/features/store/storeApi";
import { useUploadImagesMutation } from "../../../redux/features/upload/uploadApi";
import { useUpdateStoreInformationMutation } from "../../../redux/features/store/storeApi";
import { ThreeDots } from "react-loader-spinner";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 placeholder-gray-400";

const StoreRegistrationPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const router = useRouter();
  const [storeInfo, setStoreInfo] = useState({});
  const [preview, setPreview] = useState({});
  const [loading, setLoading] = useState(false);
  const [registerOwner, { data, error, isLoading }] =
    useRegisterStoreOwnerMutation();
  const [updateStoreInfoOnBackend] = useUpdateStoreInformationMutation(); // Mutation for updating store information
  const { data: foodTypes } = useGetAllFoodTypeQuery();
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility state
  const [ownerId, setUserId] = useState(null); // State to store the owner ID
  const [registerStore] = useRegisterStoreMutation(); // Mutation for store registration
  const [uploadImages] = useUploadImagesMutation();
  const nextStep = () => setCurrentStep((prev) => prev + 1);
  const prevStep = () => setCurrentStep((prev) => prev - 1);
  const uploadStoreImages = async (storeInfo) => {
    const uploadFile = async (file) => {
      if (!file || typeof file === "string" || file instanceof String)
        return null;
      const formData = new FormData();
      formData.append("file", file);
      const response = await uploadImages(formData).unwrap();
      return {
        filePath: response[0].filePath,
        url: response[0].url,
      };
    };

    const uploadedStoreInfo = { ...storeInfo };

    // Upload avatar
    if (storeInfo?.avatar?.file) {
      const uploaded = await uploadFile(storeInfo.avatar.file);
      if (uploaded) uploadedStoreInfo.avatar = uploaded;
    }

    // Upload cover
    if (storeInfo?.cover?.file) {
      const uploaded = await uploadFile(storeInfo.cover.file);
      if (uploaded) uploadedStoreInfo.cover = uploaded;
    }

    // Upload paperWork images
    if (storeInfo?.paperWork) {
      const paperWork = { ...storeInfo.paperWork };

      for (const key of ["ICFront", "ICBack", "businessLicense"]) {
        if (paperWork[key]?.file) {
          const uploaded = await uploadFile(paperWork[key].file);
          if (uploaded) paperWork[key] = uploaded;
        }
      }

      // Upload multiple store pictures
      if (Array.isArray(paperWork.storePicture)) {
        const uploadedPictures = [];
        for (const pic of paperWork.storePicture) {
          if (pic?.file) {
            const uploaded = await uploadFile(pic.file);
            if (uploaded) uploadedPictures.push(uploaded);
          }
        }
        paperWork.storePicture = uploadedPictures;
      }

      uploadedStoreInfo.paperWork = paperWork;
    }

    return uploadedStoreInfo;
  };
  const updateStoreInfo = (data) => {
    setStoreInfo((prev) => ({ ...prev, ...data }));
  };

  const updatePreview = (name, fileUrl) => {
    setPreview((prev) => ({ ...prev, [name]: fileUrl }));
  };

  const registerAccount = async (id, email, password, isExsited) => {
    try {
      setLoading(true);
      if (isExsited) {
        setUserId(id); // Set the user ID if the email already exists
        toast.info("Thiết lập cửa hàng sử dụng email này!");
        nextStep();
        setLoading(false);
        return;
      }
      console.log(
        "Registering account with email:",
        email,
        "and password:",
        password
      );
      const accountInfo = {
        ...storeInfo,
        email,
        password,
        name: email.split("@")[0],
      };

      try {
        const result = await registerOwner(accountInfo).unwrap();
        console.log("Account registration result:", result);
        setUserId(result?.data?._id); // Store the owner ID from the response
        toast.success("Tạo tài khoản thành công!");
        nextStep();
      } catch (err) {
        toast.error(err);
        console.error("Account registration error:", err);
      }

      console.log("Form Submitted");
    } catch (error) {
      console.error("Error during account registration:", error);
      toast.error("Đã xảy ra lỗi trong quá trình đăng ký tài khoản.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Food Types:", foodTypes);
  }, [foodTypes]);

  useEffect(() => {
    console.log("userId", ownerId);
    if (ownerId) {
      setStoreInfo((prev) => ({ ...prev, owner: ownerId })); // Update storeInfo with the ownerId
    }
  }, [ownerId]);
  useEffect(() => {
    console.log("Store Info Updated:", storeInfo);
  }, [storeInfo]);

  // This function triggers the modal
  const registerStoreTrigger = () => {
    setIsModalOpen(true);
  };

  // Handle confirmation in the modal
  const handleConfirmRegistration = async () => {
    try {
      setLoading(true);
      console.log("Registering store with info:", storeInfo);
      // Add your store registration logic here
      setIsModalOpen(false); // Close the modal after confirming
      const result = registerStore(storeInfo)
        .unwrap()
        .then((res) => {
          console.log("Store registration result:", res);
          toast.success("Cửa hàng đã được đăng ký thành công!");
          nextStep();
          console.log("Store ID:", res?.data?._id);
        })
        .catch((err) => {
          console.error("Store registration error:", err);
          toast.error("Đăng ký cửa hàng thất bại!");
        });
    } catch (error) {
      console.error("Error during store registration:", error);
      toast.error("Đã xảy ra lỗi trong quá trình đăng ký cửa hàng.");
    } finally {
      setLoading(false);
    }
  };

  const submitUploadImage = async () => {
    setLoading(true);
    try {
      const uploadedStoreInfo = await uploadStoreImages(storeInfo);
      console.log("Uploaded Store Info:", uploadedStoreInfo);
  
      const store = JSON.parse(localStorage.getItem("store"));
      console.log("Store ID:", store._id);
  
      const result = await updateStoreInfoOnBackend({storeId: store._id, updates:uploadedStoreInfo});
      console.log("Store Info Updated:", result);
  
      if (result) {
        toast.success("Cập nhật thông tin cửa hàng thành công!");
        router.push("/auth/verification-pending");
      }
    } catch (error) {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin cửa hàng.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StoreAccountStep
            onSubmit={registerAccount}
            inputClass={inputClass}
          />
        );
      case 1:
        return (
          <StoreBasicInfoStep
            storeInfo={storeInfo}
            foodTypes={foodTypes}
            preview={preview}
            updateStoreInfo={updateStoreInfo}
            updatePreview={updatePreview}
            nextStep={nextStep}
            prevStep={prevStep}
            inputClass={inputClass}
          />
        );
      case 2:
        return (
          <StoreAddressStep
            storeInfo={storeInfo}
            updateStoreInfo={updateStoreInfo}
            registerStore={registerStoreTrigger}
            nextStep={nextStep}
            inputClass={inputClass}
            prevStep={prevStep}
          />
        );
      case 3:
        return <StoreOwnerLoginStep onSuccess={nextStep} />;
      case 4:
        return (
          <StoreDocumentsStep
            storeInfo={storeInfo}
            preview={preview}
            updateStoreInfo={updateStoreInfo}
            updatePreview={updatePreview}
            submitUploadImage={submitUploadImage}
            prevStep={prevStep}
            inputClass={inputClass}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 w-full h-full z-50 bg-black bg-opacity-40 flex justify-center items-center">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="#fc6011"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      )}
      <div className="max-w-4xl mx-auto px-4 py-8 mt-10">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
          Đăng ký cửa hàng
        </h2>

        {/* Stepper */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <Stepper
            activeStep={currentStep}
            styleConfig={{
              activeBgColor: "#fc6011",
              activeTextColor: "#fff",
              completedBgColor: "#fc6011",
              completedTextColor: "#fff",
              inactiveBgColor: "#e0e0e0",
              inactiveTextColor: "#000",
              size: "1.5em",
              circleFontSize: "1rem",
              labelFontSize: "1rem",
              borderRadius: "50%",
            }}
          >
            <Step label="Tài khoản" />
            <Step label="Thông tin" />
            <Step label="Địa chỉ" />
            <Step label="Đăng nhập" />
            <Step label="Hồ sơ" />
          </Stepper>
        </div>

        {/* Step Content (as a Card) */}
        <div className="bg-gray-100 p-6 rounded-lg shadow-md">
          {renderStep()}
        </div>

        {/* Modal for Store Registration Confirmation */}
        <Modal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title="Xác nhận đăng ký cửa hàng"
          onConfirm={handleConfirmRegistration}
          confirmTitle="Đăng ký"
          closeTitle="Hủy"
        >
          <p>Bạn có chắc chắn muốn đăng ký cửa hàng này?</p>
        </Modal>
      </div>
    </>
  );
};

export default StoreRegistrationPage;
