'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllOrdersQuery, useUpdateOrderMutation } from "../../redux/features/order/orderApi";
import ReactPaginate from "react-paginate";
import generateOrderNumber from "../../utils/generateOrderNumber"
import { ThreeDots } from 'react-loader-spinner'

const OrderCard = ({ order, orderIndex, refetch }) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [updateOrder] = useUpdateOrderMutation();

  const handleUpdateOrder = async () => {
    if (!order) return;
    try {
      const updatedOrder = structuredClone(order); // Create a deep copy
      updatedOrder.status = "confirmed";

      await updateOrder({ orderId: order._id, updatedData: updatedOrder }).unwrap();


      refetch();
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  const router = useRouter();
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
    const fetchCartPrice = async () => {
      await calculateCartPrice();
    };
    fetchCartPrice();
  }, []);


  return (
    <div className="border rounded-lg shadow-md p-4 bg-[#FCF5F4] mb-4">
      {/* Order Header */}
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="bg-[#fc6011] p-2 text-white font-bold text-lg w-auto h-10 flex items-center justify-center rounded-md">
            {/* {generateOrderNumber(order._id)} orderIndex */}
            {orderIndex}
          </div>
          <div className="ml-2 text-sm text-gray-700">
            <p className="font-medium text-gray-800">{order.user?.name}</p>
            <p>{cartQuantity} Món / {cartPrice.toFixed(0)}đ </p>
          </div>
        </div>
      </div>

      {/* Order Details */}
      <div className="mb-3">
        <ul className="text-sm text-gray-700 mb-3">
          {order.items.map((item, idx) => {
            const toppingCount = item.toppings?.length || 0;
            return (
              <li key={idx}>
                {item.quantity} x {item.dish.name}{" "}
                {toppingCount > 0 ? `(${toppingCount} Topping)` : ""}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        {/* Text Section */}
        <p className="font-thin text-sm text-gray-400 flex-shrink-0">
          {/* Lấy đơn trong {order.takenTime} phút */}
        </p>

        {/* Buttons Section */}
        <div className="flex space-x-4">
          <button
            className="py-1 px-2 bg-gray-200 text-sm text-gray-700 rounded-md hover:bg-gray-300"
            onClick={() => router.push(`orders/${order._id}`)}
          >
            Xem thêm
          </button>
          <button className="py-1 px-2 bg-[#fc6011] text-sm text-white rounded-md hover:bg-[#e9550f]"
            onClick={() => {
              handleUpdateOrder()
            }}>
            Xác nhận
          </button>
        </div>
      </div>

    </div>
  );
};

const LatestOrder = ({ storeId }) => {

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const { data, error, isLoading, refetch } = useGetAllOrdersQuery({
    storeId,
    status: "pending",
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

  return (
    <div className="w-full px-4 py-2">
      {orders.map((order, index) => (
        <div key={index} className="bg-transparency flex flex-col">
          <OrderCard
            order={order}
            orderIndex={(index + (currentPage - 1) * ordersPerPage + 1).toString().padStart(2, "0")}
            refetch={refetch}
          />
        </div>
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

export default LatestOrder;