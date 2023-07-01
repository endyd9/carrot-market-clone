import type { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import useSWR from "swr";
import { useRouter } from "next/router";
import { ChatRoom, Message as Messages, Product, User } from "@prisma/client";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutatuin";
import { useForm } from "react-hook-form";
import { MessageForm } from "pages/streams/[id]";

interface MessageWithUser extends Messages {
  user: User;
}
interface ChatRoomWithProductAndMessage extends ChatRoom {
  product: Product;
  messages: MessageWithUser[];
}
interface ChatRoomResponse {
  ok: boolean;
  chat: ChatRoomWithProductAndMessage;
}

const ChatDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { data, mutate } = useSWR<ChatRoomResponse>(
    router.query.id ? `/api/chats/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );

  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/chats/${router.query.id}`
  );
  const onValid = (form: MessageForm) => {
    if (loading) return;
    reset();
    mutate(
      (prev) =>
        prev &&
        ({
          ...prev,
          stream: {
            ...prev.chat,
            Message: [
              ...prev.chat.messages,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };
  return (
    <Layout canGoBack title={`${data?.chat.product.name}`}>
      <div className="py-12 px-4 space-y-5">
        {data?.chat?.messages.map((message) => (
          <Message
            key={message.id}
            message={message.message}
            reversed={message.userId === user?.id}
            avatarUrl={`https://imagedelivery.net/e47gKtH1bqlCtb8hOWHyxQ/${message?.user?.avatar}/avatar`}
          />
        ))}
        <form
          onSubmit={handleSubmit(onValid)}
          className="fixed w-full mx-auto max-w-md bottom-2 inset-x-0"
        >
          <div className="flex relative items-center">
            <input
              type="text"
              {...register("message", { required: true })}
              className="shadow-sm rounded-full w-full border-gray-300 pr-12 focus:ring-orange-500 focus:outline-none focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
