'use client';

import NavBar from "../../../components/NavBar";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Header from "../../../components/Header";
import LabelWithIcon from "../../../components/LableWithIcon";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities"; 
import Modal from "../../../components/Modal";
import { useGetAllCategoriesQuery, useCreateCategoryMutation } from "../../../redux/features/category/categoryApi";
import { useDispatch } from "react-redux";

const Page = () => {
    const dispatch = useDispatch();
    const storeData = localStorage.getItem("store");
    const storeId = JSON.parse(storeData)?._id;

    // Fetch categories from Redux
    const { data: categoryData, isLoading, error, refetch } = useGetAllCategoriesQuery({ storeId });
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    
    const [categories, setCategories] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [categoryName, setCategoryName] = useState("");

    useEffect(() => {
        refetch(); // Automatically refetch categories when the component mounts
    }, [refetch]);

    useEffect(() => {
        if (categoryData?.data) {
            setCategories(categoryData.data);
        }
    }, [categoryData]);

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over || active.id === over.id) return;

        setCategories((prevCategories) => {
            const oldIndex = prevCategories.findIndex((item) => item._id === active.id);
            const newIndex = prevCategories.findIndex((item) => item._id === over.id);
            return arrayMove(prevCategories, oldIndex, newIndex).map((item, index) => ({
                ...item,
                displayOrder: index + 1,
            }));
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!categoryName.trim()) return;

        try {
            await createCategory({ storeId, name: categoryName }).unwrap();
            setIsModalOpen(false);
            setCategoryName("");
            await refetch();
        } catch (err) {
            console.error("Failed to create category:", err);
        }
    };

    return (
        <>
            <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleSubmit} title="Thêm Danh Mục" confirmTitle={isCreating ? "Đang lưu..." : "Lưu"} closeTitle="Hủy">
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Nhập tên danh mục"
                        className="w-full p-2 border rounded-md mb-4"
                        required
                    />
                </form>
            </Modal>
            <Header title="Chỉnh sửa danh mục" goBack={true} />
            <div className="flex justify-between items-center border-b pb-2 mx-4 mt-24">
                <LabelWithIcon title="Thêm" iconPath="/assets/plus.png" onClick={() => setIsModalOpen(true)} />
            </div>
            <div className="pt-4 pb-4 bg-gray-100 mt-4 h-full">
                {isLoading ? (
                    <p className="text-center text-gray-500">Đang tải danh mục...</p>
                ) : error ? (
                    <p className="text-center text-red-500">Lỗi khi tải danh mục</p>
                ) : (
                    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={categories.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                            <div className="bg-white rounded-md p-2">
                                {categories.map((item) => (
                                    <SortableItem key={item._id} item={item} />
                                ))}
                            </div>
                        </SortableContext>
                    </DndContext>
                )}
            </div>
            <NavBar page="" />
        </>
    );
};


const SortableItem = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            style={style}
            className="flex items-center justify-between bg-white p-3 rounded-md shadow-md cursor-grab my-2"
        >
            <div className="flex items-center space-x-3">
                <Image src="/assets/menu.png" alt="Drag" width={20} height={20} />
                <p className="font-semibold">{item.name}</p>
            </div>
        </div>
    );
};

export default Page;
