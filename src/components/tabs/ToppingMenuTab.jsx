"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LabelWithIcon from "../../components/LableWithIcon";
import Modal from "../Modal";
import { useGetAllToppingQuery,  useAddToppingGroupOnlyMutation } from "../../redux/features/topping/toppingApi"; // Import API query hook

const ToppingMenuTab = () => {
    const router = useRouter();
    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)._id;
    // Fetch topping groups from API
    const { data, error, isLoading } = useGetAllToppingQuery({ storeId, limit: 10, page: 1 });
    const [addToppingGroup] = useAddToppingGroupOnlyMutation();
    // Extract actual topping groups array
    const toppingGroups = data?.data || [];

    // Local state for adding new groups
    const [newGroups, setNewGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");

    const handleAddGroup = async () => {
        if (!newGroupName.trim()) return; // Prevent empty names
    
        try {
            const addedGroup = await addToppingGroup({ storeId: storeId, name: newGroupName }).unwrap();
            setNewGroups([...newGroups, addedGroup]);
            setNewGroupName("");
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to add topping group:", error);
        }
    };


    if (isLoading) return <p className="p-4">Loading toppings...</p>;
    if (error) return <p className="p-4 text-red-500">Error loading toppings!</p>;

    // Combine API data with locally added groups
    const allGroups = [...toppingGroups, ...newGroups];

    return (
        <div className="w-full p-4">
            {/* Modal for adding a new topping group */}
            <Modal
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleAddGroup}
                title="Thêm Nhóm Topping"
                confirmTitle="Lưu"
                closeTitle="Hủy"
            >
                <input
                    type="text"
                    value={newGroupName}
                    onChange={(e) => setNewGroupName(e.target.value)}
                    placeholder="Nhập tên nhóm topping"
                    className="w-full p-2 border rounded-md"
                    required
                />
            </Modal>

            {/* Add new topping group button */}
            <div className="flex justify-between items-center border-b pb-2 mx-3">
                <LabelWithIcon title="Thêm nhóm" iconPath="/assets/plus.png" onClick={() => setIsModalOpen(true)} />
            </div>

            {/* Display topping groups */}
            <div className="mt-6">
                {allGroups.length === 0 ? (
                    <p className="text-gray-500 text-center">Không có nhóm topping nào.</p>
                ) : (
                    allGroups.map((group) => (
                        <div
                            key={group._id} // Use `_id` from API
                            className="flex justify-between items-center bg-white p-3 rounded-md shadow-md cursor-pointer my-2 hover:bg-gray-100"
                            onClick={() => router.push(`menu/topping/${group._id}`)}
                        >
                            <p className="font-semibold">{group.name}</p>
                            <p className="text-gray-500">{group.toppings.length} toppings</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ToppingMenuTab;
