'use client';

import { useGetStoreInformationQuery } from "../../redux/features/store/storeApi";
import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "../../components/Header";
import ExpandSetting from "../../components/ExpandSetting";
import { useParams } from "next/navigation";

const Page = () => {
  const storeData = localStorage.getItem("store");
  const storeId = JSON.parse(storeData)._id;
  const { data, isLoading, error } = useGetStoreInformationQuery(storeId);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading store data</div>;

  const store = data?.data;

  return (
    <>
      <Header title="Cài đặt" goBack={true} />
      <div className="pt-[30px] pb-[100px] px-[20px] mt-12">
        <div className="bg-white shadow-md rounded-lg p-4 mb-4 flex items-center justify-between border border-orange-500">
          <div className="flex items-center space-x-3">
            <Image
              src={store?.avatar?.url || "/assets/shop_logo.png"}
              alt="Partner"
              width={62}
              height={62}
              className="rounded-full"
            />
            <div>
              <h2 className="text-lg font-semibold">{store?.name || "Cửa hàng"}</h2>
              <p className="text-gray-500 text-sm">{store?.address?.full_address || "Chưa có địa chỉ"}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow-md rounded-lg p-4">
          <ExpandSetting store={store}/>
        </div>
      </div>
      <NavBar page="home" />
    </>
  );
};

export default Page;
