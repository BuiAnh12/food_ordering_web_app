'use client';
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdown from "../Dropdown";
import DateRangePicker from "../DateRangePicker";
import generateOrderNumber from "../../utils/generateOrderNumber"
import { format, isToday, isTomorrow } from "date-fns";
import vi from "date-fns/locale/vi";
import ReactPaginate from "react-paginate";
import { useGetAllOrdersQuery } from "../../redux/features/order/orderApi";
import { ThreeDots } from 'react-loader-spinner'
const OrderCard = ({ order }) => {
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
    const fetchCartPrice = async () => {
      await calculateCartPrice();
    };

    fetchCartPrice();
  }, []);
  return (
    <Link href={`orders/${order.id}/preorder`}>
      <div className="border rounded-lg shadow-md p-4 bg-white mb-4">
        {/* Order Header */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="text-sm text-gray-700">
              <span href={`orders/${order.id}/preorder`} className="text-gray-700 text-md font-bold">
                {order.user?.name ?? "Unknown User"}
              </span>
              <p className="text-sm text-gray-400 text-light">{generateOrderNumber(order._id)}</p>
            </div>
          </div>
        </div>

        {/* Order Details */}
        <div className="mb-3 grid grid-cols-12 gap-4">
          <div className="col-span-3">
            <p className="text-sm font-medium text-gray-400">Lấy đơn</p>
            <p className="text-sm font-medium text-gray-800">
              {/* {order.orderTime || order.orderTime} */}
              12:30
            </p>
          </div>
          <div className="col-span-3">
            <p className="text-sm font-medium text-gray-400">Món</p>
            <p className="text-sm font-medium text-[#fc6011]">{order.items.length}</p>
          </div>
          <div className="col-span-6">
            <p className="text-sm font-medium text-gray-400">Khoảng cách</p>
            <p className="text-sm font-medium text-gray-800">1.2 Km</p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end items-center">
          <div className="text-sm text-[#fc6011] font-bold">{cartPrice.toFixed(0)}đ</div>
        </div>
      </div>
    </Link>
  );
};

const PreOrder = ({ storeId }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const { data, error, isLoading } = useGetAllOrdersQuery({
    storeId,
    status: "",
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

  // Function to render the date header (Hôm nay, Ngày mai, or specific date)
  const renderDateHeader = (time) => {
    const orderDate = new Date(time);
    if (isToday(orderDate)) return "Hôm nay";
    if (isTomorrow(orderDate)) return "Ngày mai";
    return format(orderDate, "dd/MM/yyyy", { locale: vi });
  };

  const options = ["Quán xác nhận", "Xác nhận tự động", "Đang chuẩn bị", "Chờ đến lấy"];
  const handleDropdownChange = (value, id) => {
    console.log("Selected Value:", value);
    console.log("Assigned ID:", id);
  };

  return (
    <div className="w-full px-4 py-2">
      <div className="col-span-6">
        <Dropdown options={options} onChange={handleDropdownChange} />
      </div>

      {orders.length > 0 ?
        (
          orders.map((order, index) => (
            <div key={index}>
              <div className="mb-2 shadow-md bg-white p-2 rounded-sm grid grid-cols-3">
                <p className="text-sm font-medium text-gray-600 col-span-2">
                  {renderDateHeader(order.createdAt)}
                </p>
              </div>
              <OrderCard key={order.id} order={order} />
            </div>
          ))
        )
        :
        (
          <></>
        )}

      {/* <div className="flex items-center justify-center w-full h-max mt-10 mb-20">
        <span>Không còn đơn hàng nào khác</span>
      </div> */}
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

export default PreOrder;

