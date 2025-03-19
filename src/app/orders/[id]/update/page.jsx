'use client'
import NavBar from "../../../../components/NavBar";
import React, { useState } from "react";
import Header from "../../../../components/Header";

const allDishes = [
    { name: "Trà Cây Thập Cẩm", price: 30000, toppings: ["Thêm trân châu", "Thêm sữa đặc"] },
    { name: "Đùi gà rán", price: 45000, toppings: ["Thêm sốt cay"] },
    { name: "Cơm gà xối mỡ", price: 55000, toppings: ["Thêm nước sốt", "Thêm trứng"] },
    { name: "Bánh mì thịt nướng", price: 25000, toppings: ["Thêm pate", "Thêm chả lụa"] },
    { name: "Nước ép cam", price: 20000, toppings: ["Thêm mật ong", "Thêm chanh"] },
];

const initialData = {
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
        totalOriginal: 0,
        discount: 0,
        packagingFee: 6000,
        totalFinal: 0,
    },
    metadata: {
        orderId: "30124-509192124",
        orderTime: "Hôm nay 14:08",
        distance: "2.2km",
        pickupTime: "Hôm nay 14:38",
    },
};

const Page = () => {
    const [order, setOrder] = useState(initialData);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDish, setSelectedDish] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [selectedToppings, setSelectedToppings] = useState([]);

    const handleDeleteDish = (index) => {
        const newOrderItems = order.orderItems.filter((_, i) => i !== index);
        setOrder({ ...order, orderItems: newOrderItems });
    };

    const handleAddDish = () => {
        if (selectedDish) {
            const dish = allDishes.find(d => d.name === selectedDish);
            const newToppings = selectedToppings.map(topping => ({ name: topping, price: 5000 }));

            // Find if this dish name already exists
            let updatedOrderItems = [...order.orderItems];

            const dishIndex = updatedOrderItems.findIndex(item => item.name === dish.name);
            if (dishIndex !== -1) {
                // Check if the exact toppings exist in the group
                const existingVariantIndex = updatedOrderItems[dishIndex].variants.findIndex(variant =>
                    variant.toppings.length === newToppings.length &&
                    variant.toppings.every((t, i) => t.name === newToppings[i].name)
                );

                if (existingVariantIndex !== -1) {
                    // Increase quantity of existing variant
                    updatedOrderItems[dishIndex].variants[existingVariantIndex].quantity += quantity;
                } else {
                    // Add a new variant under the same dish name
                    updatedOrderItems[dishIndex].variants.push({
                        quantity,
                        toppings: newToppings,
                        price: dish.price
                    });
                }
            } else {
                // Create new dish group
                updatedOrderItems.push({
                    name: dish.name,
                    variants: [{ quantity, toppings: newToppings, price: dish.price }]
                });
            }

            // Update state
            setOrder({ ...order, orderItems: updatedOrderItems });
            setSelectedDish(null);
            setQuantity(1);
            setSelectedToppings([]);
        }
    };



    return (
        <>
            <Header title={order.title} goBack={true} />

            <div className="w-full px-4 py-2 mt-20 mb-20">
                <div className="w-full p-4 bg-gray-50">
                    <div className="p-2 bg-yellow-100 text-yellow-800 text-sm rounded-md mb-4">
                        Khách ghi chú: <span className="font-semibold">{order.customerNote}</span>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow-md mb-4">
                        <ul className="text-sm text-gray-700">
                            {order.orderItems.map((dish, index) => (
                                <li key={index} className="mb-4 rounded-lg border border-gray-200 shadow-sm">
                                    {/* Dish Group Header */}
                                    <div className="bg-gray-100 px-3 py-2 rounded-t-lg font-semibold text-gray-800">
                                        {dish.name}
                                    </div>

                                    {/* Variants of the dish (different toppings) */}
                                    <div className="p-2">
                                        {dish.variants.map((variant, vIndex) => (
                                            <div key={vIndex} className="grid grid-cols-12 gap-2 items-center p-2 border-b last:border-0">
                                                {/* Quantity & Name */}
                                                <div className="col-span-6 flex items-center font-medium text-gray-900">
                                                    {variant.quantity} x {dish.name}
                                                </div>

                                                {/* Toppings */}
                                                <div className="col-span-4 text-xs text-gray-500">
                                                    {variant.toppings.length > 0 && (
                                                        <ul>
                                                            {variant.toppings.map((topping, i) => (
                                                                <li key={i} className="whitespace-nowrap">
                                                                    + {topping.name} ({topping.price}₫)
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>

                                                {/* Delete Button */}
                                                <div className="col-span-2 flex justify-end">
                                                    <button
                                                        onClick={() => handleDeleteDish(index, vIndex)}
                                                        className="py-1 px-3 bg-red-500 text-white rounded-md text-xs hover:bg-red-600 transition">
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>



                    <div className="bg-white p-4 rounded-lg shadow-md">
                        <h3 className="text-md font-bold mb-2">Thêm món mới</h3>
                        <input type="text" className="w-full p-2 border rounded-md mb-2" placeholder="Tìm món" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                        <select className="w-full p-2 border rounded-md mb-2" value={selectedDish || ""} onChange={(e) => setSelectedDish(e.target.value)}>
                            <option value="">Chọn món</option>
                            {allDishes.filter(dish => dish.name.toLowerCase().includes(searchTerm.toLowerCase())).map((dish, index) => (
                                <option key={index} value={dish.name}>{dish.name} - {dish.price}₫</option>
                            ))}
                        </select>
                        <input type="number" className="w-full p-2 border rounded-md mb-2" placeholder="Số lượng" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                        {selectedDish && (
                            <div className="mb-2">
                                <h4 className="text-sm font-bold mb-1">Chọn topping:</h4>
                                {allDishes.find(dish => dish.name === selectedDish)?.toppings.map((topping, index) => (
                                    <label key={index} className="block text-sm">
                                        <input type="checkbox" value={topping} checked={selectedToppings.includes(topping)} onChange={(e) => {
                                            const newToppings = e.target.checked ? [...selectedToppings, topping] : selectedToppings.filter(t => t !== topping);
                                            setSelectedToppings(newToppings);
                                        }} /> {topping} (+5000₫)
                                    </label>
                                ))}
                            </div>
                        )}
                        <button onClick={handleAddDish} className="w-full p-2 bg-green-500 text-white rounded-md">Thêm món</button>
                    </div>
                </div>
            </div>
            <NavBar page='orders' />
        </>
    );
};

export default Page;
