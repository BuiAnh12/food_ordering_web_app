'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGetAllOrdersQuery } from "../../redux/features/order/orderApi";
import ReactPaginate from "react-paginate";
import generateOrderNumber from "../../utils/generateOrderNumber";
import { ThreeDots } from "react-loader-spinner";

const OrderCard = ({ order, orderIndex }) => {
  const [cartPrice, setCartPrice] = useState(0);
  const [cartQuantity, setCartQuantity] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (order.items) {
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
    }
  }, [order.items]);

  return (
    <div className="border rounded-lg shadow-md p-4 bg-white mb-4" onClick={() => router.push(`orders/${order._id}`)}>
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <div className="text-sm text-gray-700">
            <p className="text-gray-700 text-md font-bold">{order.user?.name || "Unknown User"}</p>
            <p className="text-sm text-gray-400 text-light">{generateOrderNumber(order._id)}</p>
          </div>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-12 gap-4">
        <div className="col-span-3">
          <p className="text-sm font-medium text-gray-400">Lấy đơn</p>
          {order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) : "--:--"}
          </div>
        <div className="col-span-3">
          <p className="text-sm font-medium text-gray-400">Món</p>
          <p className="text-sm font-medium text-[#fc6011]">{cartQuantity}</p>
        </div>
        <div className="col-span-6">
          <p className="text-sm font-medium text-gray-400">Khoảng cách</p>
          <p className="text-sm font-medium text-gray-800">{order.distance ?? "n/a"} Km</p>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="flex justify-start items-center">
          <div className="text-sm text-gray-400 font-light">{order.paymentMethod || "Thanh toán khi nhận hàng"}</div>
        </div>
        <div className="flex justify-end items-center">
          <div className="text-sm text-[#fc6011] font-bold">{cartPrice.toFixed(0)}đ</div>
        </div>
      </div>
    </div>
  );
};

const HistoryOrder = ({ storeId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const { data, error, isLoading } = useGetAllOrdersQuery({
    storeId,
    status: ["delivered", "cancelled"],
    limit: ordersPerPage,
    page: currentPage,
  });

  const orders = (data?.data ?? []).toSorted((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  const pageCount = data?.totalPages || 1;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen w-screen">
        <ThreeDots visible={true} height="80" width="80" color="#fc6011" radius="9" ariaLabel="three-dots-loading" />
      </div>
    );
  if (error) return <p className="text-center py-5 text-red-500">Error loading orders</p>;

  const handlePageClick = (event) => {
    setCurrentPage(event.selected + 1);
  };

  return (
    <div className="w-full px-4 py-2">
      {orders.map((order, index) => (
        <div key={index} className="bg-transparency flex flex-col">
          <OrderCard order={order} orderIndex={(index + (currentPage - 1) * ordersPerPage + 1).toString().padStart(2, "0")} />
        </div>
      ))}
      <div className="flex items-center justify-center w-full h-max mt-10 mb-20">
        <ReactPaginate
          previousLabel={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>}
          nextLabel={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>}
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

export default HistoryOrder;
