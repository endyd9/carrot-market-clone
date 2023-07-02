import type { NextPage } from "next";
import Layout from "@components/layout";
import Link from "next/link";
import useSWR from "swr";
import { ChatRoom, Message, User } from "@prisma/client";
import useUser from "@libs/client/useUser";

interface ChatRoomResponseWhitNamesAndMessage extends ChatRoom {
  seller: User;
  buyer: User;
  messages: [
    {
      message: string;
    }
  ];
}
interface ChatRoomResponse {
  ok: boolean;
  chatRooms: ChatRoomResponseWhitNamesAndMessage[];
  message: string;
}

const Chats: NextPage = () => {
  const { user } = useUser();
  const { data } = useSWR<ChatRoomResponse>(`/api/chats`);
  return (
    <Layout title="채팅" seoTitle="채팅" hasTabBar>
      <div className="py-8 divide-y-[1px] ">
        {data?.chatRooms?.map((chatRoom) => (
          <Link
            href={`chats/${chatRoom?.id}`}
            key={chatRoom?.id}
            className="flex px-4 cursor-pointer py-3 items-center space-x-3"
          >
            <img
              src={`https://imagedelivery.net/e47gKtH1bqlCtb8hOWHyxQ/${
                chatRoom.seller.name === user?.name
                  ? chatRoom.buyer.avatar
                  : chatRoom.seller.avatar
              }/avatar`}
              className="w-12 h-12 rounded-full bg-slate-300"
            />
            <div>
              <p className="text-gray-700">
                {chatRoom.seller.name === user?.name
                  ? chatRoom.buyer.name
                  : chatRoom.seller.name}
              </p>
              <p className="text-sm  text-gray-500">
                {chatRoom?.messages[0]?.message}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
