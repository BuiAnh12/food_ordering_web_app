'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Dropdown from "../Dropdown";
import DateRangePicker from "../DateRangePicker";
import generateOrderNumber from "../../utils/generateOrderNumber"
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
  return (<>

    <div className="border rounded-lg shadow-md p-4 bg-white mb-4">
      {/* Order Header */}
      <Link href={`orders/${order._id}/verify`} passHref>
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <div className="bg-[#fc6011] text-white font-bold text-lg w-10 h-10 flex items-center justify-center rounded-sm">
              {/* {order._id} */}
              01
            </div>
            <div className="ml-2 text-sm text-gray-700">
              <span className="font-bold text-[#fc6011] text-lg">#{generateOrderNumber(order._id)}</span>
              {/* <p className="text-sm text-gray-400 text-light">Giao lúc {order.deliveryTime} ({order.remainingTime})</p> */}
            </div>
          </div>
          {/* <span className="text-sm text-gray-600">{order.remainingTime}</span> */}
        </div>

        {/* Order Details */}
        <div className="mb-3">
          <p className="text-sm font-medium text-gray-800">{order.user.name}</p>
          <p className="text-sm text-gray-600">
            {/* {order.status} */}
            Đang tìm tài xế
          </p>
        </div>
      </Link>
      {/* Footer */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">{cartQuantity} món</div>
        {/* <div className="text-sm text-gray-600">{cartPrice.toFixed(0)}đ</div> */}
        <button className="px-4 py-2 text-white bg-[#fc6011] rounded-sm hover:bg-[#e9550f]">
          Thông báo tài xế
        </button>
      </div>
    </div>
  </>
  );
};


const VerifyOrderTab = ({ storeId }) => {
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
        <OrderCard key={index} order={order} />
      ))}
    </div>
  );
};

export default VerifyOrderTab;