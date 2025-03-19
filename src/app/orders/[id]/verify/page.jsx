import NavBar from "../../../../components/NavBar";
import React from "react";
import Header from "../../../../components/Header";

const data = {
    title: "Đặt trước",
    customerNote: "Cung cấp đúng các dụng cụ ăn",
    customer: {
        name: "Khách đặt đơn",
        phone: "0337950404",
    },
    driver: "Chưa chỉ định tài xế",
    orderItems: [
        {
            name: "Trà Cây Thập Cẩm",
            quantity: 1,
            price: 30000,
            toppings: [
                { name: "Thêm trân châu", price: 5000 },
                { name: "Thêm sữa đặc", price: 3000 },
            ],
        },
        {
            name: "Đùi gà rán",
            quantity: 1,
            price: 45000,
            toppings: [{ name: "Thêm sốt cay", price: 7000 }],
        },
    ],
    summary: {
        totalOriginal: 75000,
        discount: -22500,
        packagingFee: 6000,
    },
    metadata: {
        orderId: "30124-509192124",
        orderTime: "Hôm nay 14:08",
        distance: "2.2km",
        pickupTime: "Hôm nay 14:38",
    },
};

data.summary.totalFinal = data.summary.totalOriginal + data.summary.discount + data.summary.packagingFee + data.orderItems.reduce((sum, item) => sum + item.toppings.reduce((tSum, topping) => tSum + topping.price, 0), 0);



const page = () => {
    return (
        <>
            <Header title={data.title} goBack={true} />

            <div className="w-full px-4 py-2 mt-20 mb-20">
                <div className="w-full p-4 bg-gray-50">
                    <div className="p-2 bg-yellow-100 text-yellow-800 text-sm rounded-md mb-4">
                        Khách ghi chú: <span className="font-semibold">{data.customerNote}</span>
                    </div>

                    <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-md mb-4">
                        <div className="flex items-center">
                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center" />
                            <div className="ml-3">
                                <h3 className="text-gray-800 font-medium">{data.customer.name}</h3>
                                <p className="text-sm text-gray-600">{data.customer.phone}</p>
                            </div>
                        </div>
                        <button className="py-1 px-3 bg-[#fc6011] text-white rounded-md hover:bg-[#e9550f]">
                            Gọi
                        </button>
                    </div>

                    <div className="flex items-center bg-white p-4 rounded-lg shadow-md mb-4">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center" />
                        <div className="ml-3">
                            <h3 className="text-gray-800 font-medium">{data.driver}</h3>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <ul className="mb-4 text-sm text-gray-700">
                            {data.orderItems.map((item, index) => (
                                <li key={index} className="py-2">
                                    <div className="flex justify-between">
                                        <span>{item.quantity} x {item.name}</span>
                                        <span>{item.price.toLocaleString()}₫</span>
                                    </div>
                                    {item.toppings.length > 0 && (
                                        <ul className="ml-4 text-gray-600 text-xs">
                                            {item.toppings.map((topping, tIndex) => (
                                                <li key={tIndex} className="flex justify-between">
                                                    <span>+ {topping.name}</span>
                                                    <span>{topping.price.toLocaleString()}₫</span>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            ))}
                        </ul>
                        <div className="text-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700 font-bold">Tổng tiền món (giá gốc)</span>
                                <span className="text-gray-800 font-medium">{data.summary.totalOriginal.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Chiết khấu (30%)</span>
                                <span className="text-gray-800 font-medium">{data.summary.discount.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-700">Phí đóng gói</span>
                                <span className="text-gray-800 font-medium">{data.summary.packagingFee.toLocaleString()}₫</span>
                            </div>
                            <div className="flex justify-between">
                                <span className=" text-md font-bold">Tổng tiền quán nhận</span>
                                <span className="text-md font-bold text-[#fc6011]">{data.summary.totalFinal.toLocaleString()}₫</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Mã đơn hàng</span>
                            <a href="/" className="text-blue-500 underline">
                                {data.metadata.orderId}
                            </a>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Thời gian đặt hàng</span>
                            <span className="text-gray-800">{data.metadata.orderTime}</span>
                        </div>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-gray-600">Khoảng cách</span>
                            <span className="text-gray-800">{data.metadata.distance}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Thời gian lấy hàng dự kiến</span>
                            <span className="text-gray-800">{data.metadata.pickupTime}</span>
                        </div>
                    </div>
                    
                    <div className="flex w-full space-x-4 justify-between my-4 p-1">
                        <button className="py-2 px-4 bg-gray-200 text-md text-gray-700 rounded-md hover:bg-gray-300 w-full">
                            Hủy
                        </button>
                        <button className="py-2 px-4 bg-[#fc6011] text-md text-white rounded-md hover:bg-[#e9550f] w-full">
                            Sửa
                        </button>
                    </div>

                </div>
            </div>
            <NavBar page='orders' />
        </>
    );
};

export default page;