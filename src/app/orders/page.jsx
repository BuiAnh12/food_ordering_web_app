'use client';

import NavBar from "../../components/NavBar";
import React, { useEffect, useState } from "react";
import Header from "../../components/Header"
import Tabs from "../../components/Tabs"
import PreOrderTab from "../../components/tabs/PreOrderTab"
import LatestTab from "../../components/tabs/LatestOrderTab"
import VerifyTab from "../../components/tabs/VerifyOrderTab"
import HistoryTab from "../../components/tabs/HistoryOrderTab"
import { ThreeDots } from "react-loader-spinner";

const page = () => {
  const storeData = localStorage.getItem("store");
  const [storeId, setStoreId] = useState(null);
  const [tabData, setTabData] = useState([]);
  const [activeTab, setActiveTab] = useState(0); // Default tab index


  // Load the stored active tab index from localStorage when the page loads
  useEffect(() => {
    const savedTab = localStorage.getItem("activeTab");
    if (savedTab !== null) {
      setActiveTab(parseInt(savedTab)); // Convert to integer before setting state
    }
  }, []);

  useEffect(() => {
    if (storeData) {
      const store = JSON.parse(storeData);
      setStoreId(store?._id);
    } else {
      console.log("No store data found in localStorage");
    }
  }, []);

  useEffect(() => {
    setTabData([
      // { label: "Đặt trước", component: <PreOrderTab storeId={storeId} /> },
      { label: "Mới", component: <LatestTab storeId={storeId} /> },
      { label: "Đã xác nhận", component: <VerifyTab storeId={storeId} /> },
      { label: "Lịch sử", component: <HistoryTab storeId={storeId} /> },
    ]);
  }, [storeId]);

  // Handle tab change and save the active tab index to localStorage
  const handleTabChange = (index) => {
    setActiveTab(index);
    localStorage.setItem("activeTab", index); // Save tab index
  };

  if (!storeId) {
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#fc6011"
          radius="9"
          ariaLabel="three-dots-loading"
        />
      </div>
    );
  }

  return (
    <>
      <Header title="Đơn hàng" goBack={true}/>
      <div className='pt-[70px] pb-[10px] bg-gray-100'>
        {/* SEARCH BAR */}
        <div className="w-full flex items-center justify-center py-1 px-1 bg-transparent">
          {/* Search Bar Container */}
          <div className="w-full flex items-center gap-2 bg-white border border-gray-300 rounded-lg shadow-md px-3 py-2">
            {/* Input Field */}
            <input
              type="text"
              placeholder="Tìm kiếm ..."
              className="flex-1 border-none outline-none text-sm text-gray-700"
            />
            {/* Search Button */}
            <button
              type="button"
              className="p-2 bg-[#fc6011] text-white rounded-md hover:bg-[#e4550b] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-4.35-4.35m2.1-5.4a7.5 7.5 0 11-15 0 7.5 7.5 0 0115 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <Tabs
          tabs={tabData}
          defaultActiveTab={activeTab} // Load saved tab index
          onTabChange={handleTabChange} // Save new tab index when changed
        />
      </div>

      <NavBar page='orders' />
    </>
  );
};

export default page;
