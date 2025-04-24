import React from "react";

const StoreDocumentsStep = ({
  storeInfo,
  updateStoreInfo,
  submitUploadImage,
  prevStep,
  inputClass,
}) => {
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      if (["ICFront", "ICBack", "businessLicense"].includes(name)) {
        updateStoreInfo({
          ...storeInfo,
          paperWork: {
            ...storeInfo.paperWork,
            [name]: { filePath: "", file },
          },
        });
      } else {
        updateStoreInfo({
          ...storeInfo,
          [name]: { filePath: "", file },
        });
      }
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newStorePictures = files.map((file) => ({
      filePath: "",
      file: file,
    }));

    updateStoreInfo({
      ...storeInfo,
      paperWork: {
        ...storeInfo.paperWork,
        storePicture: [
          ...(storeInfo?.paperWork?.storePicture || []),
          ...newStorePictures,
        ],
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-4 bg-gray-50 p-6 rounded-lg shadow">
      <div>
        <label className="font-medium block mb-1">Ảnh đại diện</label>
        <input
          type="file"
          name="avatar"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClass}
        />
        {storeInfo?.avatar?.file && (
          <img
            src={URL.createObjectURL(storeInfo.avatar.file)}
            alt="Avatar Preview"
            className="mt-2 w-32 h-32 object-cover rounded-lg"
          />
        )}
      </div>

      <div>
        <label className="font-medium block mb-1">Ảnh bìa</label>
        <input
          type="file"
          name="cover"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClass}
        />
        {storeInfo?.cover?.file && (
          <img
            src={URL.createObjectURL(storeInfo.cover.file)}
            alt="Cover Preview"
            className="mt-2 w-full h-40 object-cover rounded-lg"
          />
        )}
      </div>

      <div>
        <label className="font-medium block mb-1">CMND Mặt trước</label>
        <input
          type="file"
          name="ICFront"
          accept="image/*"
          onChange={handleFileChange}
          className={`${inputClass} mb-2`}
        />
        {storeInfo?.paperWork?.ICFront?.file && (
          <img
            src={URL.createObjectURL(storeInfo.paperWork.ICFront.file)}
            alt="CMND Mặt trước"
            className="mb-2 w-60 rounded"
          />
        )}

        <label className="font-medium block mb-1">CMND Mặt sau</label>
        <input
          type="file"
          name="ICBack"
          accept="image/*"
          onChange={handleFileChange}
          className={`${inputClass} mb-2`}
        />
        {storeInfo?.paperWork?.ICBack?.file && (
          <img
            src={URL.createObjectURL(storeInfo.paperWork.ICBack.file)}
            alt="CMND Mặt sau"
            className="mb-2 w-60 rounded"
          />
        )}

        <label className="font-medium block mb-1">Giấy phép kinh doanh</label>
        <input
          type="file"
          name="businessLicense"
          accept="image/*"
          onChange={handleFileChange}
          className={inputClass}
        />
        {storeInfo?.paperWork?.businessLicense?.file && (
          <img
            src={URL.createObjectURL(storeInfo.paperWork.businessLicense.file)}
            alt="Giấy phép KD"
            className="mt-2 w-40 rounded"
          />
        )}
      </div>

      <div>
        <label className="font-medium block mb-1">Ảnh cửa hàng</label>
        <input
          type="file"
          name="storePictures"
          multiple
          accept="image/*"
          onChange={handleImageUpload}
          className={inputClass}
        />
        <div className="flex flex-wrap gap-2 mt-2">
          {storeInfo?.paperWork?.storePicture?.map((pic, index) =>
            pic?.file ? (
              <img
                key={index}
                src={URL.createObjectURL(pic.file)}
                alt={`Ảnh cửa hàng ${index + 1}`}
                className="w-auto h-auto object-cover rounded"
              />
            ) : null
          )}
        </div>
      </div>

      <div className="flex justify-between mt-4">
        <button
          type="button"
          onClick={prevStep}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
        >
          Quay lại
        </button>
        <button
          type="button"
          onClick={submitUploadImage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Tiếp theo
        </button>
        </div>
    </div>
  );
};

export default StoreDocumentsStep;
