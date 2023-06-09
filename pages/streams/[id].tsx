import { NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Stream } from "@prisma/client";
import { useForm } from "react-hook-form";
import useMutation from "@libs/client/useMutatuin";
import Message from "@components/message";
import { Session } from "inspector";
import useUser from "@libs/client/useUser";
import { useEffect } from "react";

interface StreamMessage {
  message: string;
  id: number;
  user: {
    avatar?: string;
    id: number;
  };
}
interface StreamWithMessage extends Stream {
  Message: StreamMessage[];
}
interface StreamResponse {
  ok: boolean;
  stream: StreamWithMessage;
}

export interface MessageForm {
  message: string;
}

const StreamDetail: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  const { register, handleSubmit, reset } = useForm<MessageForm>();
  const { data, mutate } = useSWR<StreamResponse>(
    router.query.id ? `/api/streams/${router.query.id}` : null,
    {
      refreshInterval: 1000,
    }
  );
  const [sendMessage, { loading, data: sendMessageData }] = useMutation(
    `/api/streams/${router.query.id}/messages`
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
            ...prev.stream,
            Message: [
              ...prev.stream.Message,
              { id: Date.now(), message: form.message, user: { ...user } },
            ],
          },
        } as any),
      false
    );
    sendMessage(form);
  };

  return (
    <Layout canGoBack title={data?.stream?.name} seoTitle="라이브">
      <div className="py-10 px-4 space-y-4">
        {data?.stream.cloudflareId ? (
          <iframe
            className="w-full rounded-md shadow-sm aspect-video"
            src={`https://iframe.videodelivery.net/${data?.stream?.cloudflareId}`}
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;"
            allowFullScreen={true}
          ></iframe>
        ) : null}
        <h1 className=" text-gray-800 font-semibold  text-2xl mt-2">
          {data?.stream?.name}
        </h1>
        <span className="text-2xl block mt-3 text-gray-900">
          ₩ {data?.stream?.price}
        </span>
        <p className="my-6 text-gray-700">{data?.stream?.description}</p>
        {data?.stream.userId === user?.id ? (
          <div className="bg-orange-300 p-5 rounded-md overflow-scroll flex flex-col space-y-3">
            <span>비밀</span>
            <span>URL : {data?.stream.cloudflareUrl}</span>
            <span>Key : {data?.stream.cloudflareKey}</span>
          </div>
        ) : null}
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Live Chat</h2>
          <div className="py-10 pb-16 h-[50vh] overflow-y-scroll  px-4 space-y-4">
            {data?.stream.Message.map((message) => (
              <Message
                key={message.id}
                message={message.message}
                reversed={message?.user?.id === user?.id}
              />
            ))}
          </div>
          <div className="fixed py-2 bg-white  bottom-0 inset-x-0">
            <form
              onSubmit={handleSubmit(onValid)}
              className="flex relative max-w-md items-center  w-full mx-auto"
            >
              <input
                type="text"
                {...register("message", { required: true })}
                className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
              />
              <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
                <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                  &rarr;
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StreamDetail;
