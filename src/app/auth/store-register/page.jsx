'use client';
import React, { useState } from 'react';
import MapboxComponent from '../../../components/MapBoxComponent';

const StoreRegistrationPage = () => {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setStoreInfo({ ...storeInfo, [name]: value });
  };

  const handleLocationSelect = (lat, lng) => {
    setStoreInfo({ ...storeInfo, latitude: lat, longitude: lng });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setStoreInfo({ ...storeInfo, [name]: files[0] });
  };

  const handleImageUpload = (e) => {
    const { name, files } = e.target;
    setStoreInfo({
      ...storeInfo,
      storePictures: [...storeInfo.storePictures, ...Array.from(files)],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append('name', storeInfo.name);
    formData.append('description', storeInfo.description);
    formData.append('category', storeInfo.category);
    formData.append('address', storeInfo.address);
    formData.append('latitude', storeInfo.latitude);
    formData.append('longitude', storeInfo.longitude);

    // Append images
    if (storeInfo.avatar) formData.append('avatar', storeInfo.avatar);
    if (storeInfo.cover) formData.append('cover', storeInfo.cover);
    if (storeInfo.ICFront) formData.append('ICFront', storeInfo.ICFront);
    if (storeInfo.ICBack) formData.append('ICBack', storeInfo.ICBack);
    if (storeInfo.businessLicense)
      formData.append('businessLicense', storeInfo.businessLicense);

    storeInfo.storePictures.forEach((file, index) => {
      formData.append(`storePictures[${index}]`, file);
    });

    // Call the API to submit the form data
    console.log(formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-semibold mb-6 text-center">Đăng ký cửa hàng</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Tên cửa hàng</label>
          <input
            type="text"
            name="name"
            value={storeInfo.name}
            onChange={handleInputChange}
            placeholder="Nhập tên cửa hàng"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Mô tả</label>
          <input
            type="text"
            name="description"
            value={storeInfo.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả cửa hàng"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Danh mục</label>
          <input
            type="text"
            name="category"
            value={storeInfo.category}
            onChange={handleInputChange}
            placeholder="Nhập danh mục cửa hàng"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Địa chỉ</label>
          <input
            type="text"
            name="address"
            value={storeInfo.address}
            onChange={handleInputChange}
            placeholder="Nhập địa chỉ cửa hàng"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Chọn vị trí trên bản đồ</label>
          <MapboxComponent
            currentLatitude={storeInfo.latitude}
            currentLongitude={storeInfo.longitude}
            onLocationSelect={handleLocationSelect}
          />
        </div>

        {/* File upload inputs */}
        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Ảnh đại diện</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Ảnh bìa</label>
          <input
            type="file"
            name="cover"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Giấy tờ (IC trước, IC sau, Giấy phép kinh doanh)</label>
          <input
            type="file"
            name="ICFront"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
          <input
            type="file"
            name="ICBack"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          />
          <input
            type="file"
            name="businessLicense"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full p-3 border border-gray-300 rounded-md mt-2"
          />
        </div>

        <div className="form-group">
          <label className="block text-lg font-medium mb-2">Hình ảnh cửa hàng</label>
          <input
            type="file"
            name="storePictures"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="w-full p-3 border border-gray-300 rounded-md"
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Đăng ký cửa hàng
        </button>
      </form>
    </div>
  );
};

export default StoreRegistrationPage;
