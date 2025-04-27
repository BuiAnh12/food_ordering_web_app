import { toast } from "react-toastify";
import { useLazyCheckStoreNameQuery } from "../../redux/features/store/storeApi";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect } from "react";
import { useGetAllFoodTypeQuery } from "../../redux/features/foodType/foodTypeApi";

const StoreBasicInfoStep = ({
  storeInfo,
  updateStoreInfo,
  inputClass,
  foodTypes,
  nextStep,
  prevStep,
}) => {
  const [checkStoreName] = useLazyCheckStoreNameQuery();

  const formik = useFormik({
    initialValues: {
      name: storeInfo.name || "",
      description: storeInfo.description || "",
      foodType: storeInfo.foodType || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tên cửa hàng là bắt buộc."),
      description: Yup.string().required("Mô tả là bắt buộc."),
      foodType: Yup.string().required("Vui lòng chọn loại món ăn."),
    }),
    validateOnBlur: false,
    validateOnChange: false,
    onSubmit: async (values) => {
      // Final check to see if name exists
      const valid = await validateStoreName(values.name);
      if (!valid) return;

      updateStoreInfo(values);
      nextStep();
    },
  });

  const validateStoreName = async (name) => {
    try {
      await checkStoreName(name).unwrap();
      return true;
    } catch (error) {
      if (error?.status === 400) {
        formik.setFieldError("name", "Tên cửa hàng đã tồn tại.");
      } else {
        toast.error("Lỗi khi kiểm tra tên cửa hàng.");
      }
      return false;
    }
  };

  // Only validate store name once user has interacted with the field and pressed next
  useEffect(() => {
    if (formik.touched.name && formik.values.name) {
      validateStoreName(formik.values.name);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formik.touched.name]);

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid grid-cols-1 gap-4 bg-white p-6 rounded-xl shadow-md"
    >
      <div>
        <label className="font-medium block mb-1">Tên cửa hàng</label>
        <input
          type="text"
          name="name"
          placeholder="Nhập tên cửa hàng"
          value={formik.values.name}
          onChange={(e) => {
            formik.handleChange(e);
            // Clear manual error if user modifies the name
            if (formik.errors.name) {
              formik.setFieldError("name", undefined);
            }
          }}
          onBlur={formik.handleBlur}
          className={inputClass}
        />
        {formik.errors.name && (
          <div className="text-red-600 text-sm mt-1">{formik.errors.name}</div>
        )}
      </div>

      <div>
        <label className="font-medium block mb-1">Mô tả</label>
        <input
          type="text"
          name="description"
          placeholder="Mô tả ngắn về cửa hàng"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass}
        />
        {formik.errors.description && (
          <div className="text-red-600 text-sm mt-1">
            {formik.errors.description}
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 mb-2" htmlFor="foodType">
          Loại món ăn
        </label>
        <select
          id="foodType"
          name="foodType"
          value={formik.values.foodType}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          className={inputClass}
        >
          <option value="">Chọn loại món ăn</option>
          {foodTypes?.map((type) => (
            <option key={type._id} value={type._id}>
              {type.name}
            </option>
          ))}
        </select>
        {formik.errors.foodType && (
          <div className="text-red-600 text-sm mt-1">
            {formik.errors.foodType}
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={prevStep}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
        >
          Quay lại
        </button>

        <button
          type="submit"
          className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition"
        >
          Tiếp theo
        </button>
      </div>
    </form>
  );
};

export default StoreBasicInfoStep;
