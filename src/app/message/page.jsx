"use client";
import { useSelector } from "react-redux";
import Header from "../../components/Header";
import ChatItem from "../../components/message/ChatItem";
import NavBar from "../../components/NavBar";
import React, { useEffect } from "react";
import { useGetAllChatsQuery } from "../../redux/features/chat/chatApi";

const page = () => {
  const chatState = useSelector((state) => state.chat);
  const { allChats } = chatState;
  const userState = useSelector((state) => state.user);

  const { refetch: refetchAllChats } = useGetAllChatsQuery();

  useEffect(() => {
    refetchAllChats();
  }, []);

  return (
    <div className='pt-[30px] pb-[100px] ] lg:w-[60%] md:w-[80%] md:mx-auto md:pt-[100px] md:mt-[20px] md:px-0'>
      <Header title='Tin nhắn' goBack={true} />


      <div className='p-[10px] flex flex-col gap-0 md:gap-[10px]'>
        {allChats && allChats.map((chat, index) => <ChatItem chat={chat} key={index} />)}
      </div>

      <div className=''>
        <NavBar page='message' />
      </div>
    </div>
  );
};

export default page;