'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdown from "../Dropdown";
import generateOrderNumber from "../../utils/generateOrderNumber"
import ReactPaginate from "react-paginate";
import { useGetAllOrdersQuery } from "../../redux/features/order/orderApi";
import { ThreeDots } from 'react-loader-spinner'

const OrderCard = ({ order, orderIndex }) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);

  const calculateCartPrice = () => {
    const { totalPrice, totalQuantity } = order.items.reduce(
      (acc, item) => {
        const dishPrice = (item.dish?.price || 0) * item.quantity;
        const toppingsPrice =
          (Array.isArray(item.toppings) ? item.toppings.reduce((sum, topping) => sum + (topping.price || 0), 0) : 0) *
          item.quantity;

        acc.totalPrice += dishPrice + toppingsPrice;
        acc.totalQuantity += item.quantity;

        return acc;
      },
      { totalPrice: 0, totalQuantity: 0 }
    );

    setCartPrice(totalPrice);
    setCartQuantity(totalQuantity);
  };

  useEffect(() => {
    calculateCartPrice();
  }, []);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white mb-4">
      <Link href={`orders/${order._id}`} passHref>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-[#fc6011] text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-sm">
              {orderIndex}
            </div>
            <div className="ml-2 text-sm text-gray-700">
              <span className="font-bold text-[#fc6011] text-lg">#{generateOrderNumber(order._id)}</span>
            </div>
          </div>
        </div>

        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800">{order.user.name}</p>
          <p className="text-sm text-gray-600">Đang tìm tài xế</p>
        </div>
      </Link>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">{cartQuantity} món</div>
        {order.status === "finished" ? (
          <button className="px-4 py-2 text-white bg-gray-400 rounded-sm cursor-not-allowed" disabled>
            Đã thông báo tài xế
          </button>
        ) : (
          <button className="px-4 py-2 text-white bg-[#fc6011] rounded-sm hover:bg-[#e9550f]">
            Thông báo tài xế
          </button>
        )}
      </div>
    </div>
  );
};

const VerifyOrderTab = ({ storeId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const { data, error, isLoading } = useGetAllOrdersQuery({
    storeId,
    status: ["confirmed", "finished"],
    limit: ordersPerPage,
    page: currentPage,
  });

  // Extract orders safely
  const orders = (data?.data ?? []).toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const pageCount = data?.totalPages || 1;

  useEffect(() => {
    console.log(data);
  }, [data]);

  // Handle loading & error
  if (isLoading) return <div className="flex justify-center items-center h-screen w-screen">
    <ThreeDots
      visible={true}
      height="80"
      width="80"
      color="#fc6011"
      radius="9"
      ariaLabel="three-dots-loading"
      wrapperStyle={{}}
      wrapperClass=""
    />
  </div>
  if (error) return <p className="text-center py-5 text-red-500">Error loading orders</p>;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };
  const options = ["Quán xác nhận", "Xác nhận tự động", "Đang chuẩn bị", "Chờ đến lấy"];
  const handleDropdownChange = (value, id) => {
    console.log("Selected Value:", value);
    console.log("Assigned ID:", id);
  };
  return (

    <div className="w-full px-4 py-2">
      <Dropdown
        options={options}
        onChange={handleDropdownChange}
      />
      {orders.map((order, index) => (
        <OrderCard
          order={order}
          orderIndex={(index + (currentPage - 1) * ordersPerPage + 1).toString().padStart(2, "0")}
        />
      ))}
      <div className="flex items-center justify-center w-full h-max mt-10 mb-20">
        <ReactPaginate
          previousLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          }
          nextLabel={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          }
          breakLabel={"..."}
          pageCount={pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={3}
          onPageChange={handlePageClick}
          containerClassName={"pagination flex space-x-2"}
          activeClassName={"bg-orange-500 text-white"}
          pageClassName={"border px-3 py-1 rounded-lg cursor-pointer"}
          previousClassName={"border px-3 py-1 rounded-lg cursor-pointer"}
          nextClassName={"border px-3 py-1 rounded-lg cursor-pointer"}
          disabledClassName={"opacity-50 cursor-not-allowed"}
        />
      </div>
    </div>

  );
};

export default VerifyOrderTab;