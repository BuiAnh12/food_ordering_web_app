import NavBar from "../../components/NavBar";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Header from "../../components/Header"
import HomeContent from "../../components/HomeContent"
const page = () => {
  return (
    <>

      <Header title = "Tên cửa hàng"/>
      <div className='pt-[30px] pb-[100px] px-[20px]'>
      
      <HomeContent/>

      </div>
      <NavBar page='home' />
    </>
  );
};

export default page;
