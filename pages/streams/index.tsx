import { NextPage } from "next";
import Layout from "@components/layout";
import FloatingButton from "@components/floating-button";
import Link from "next/link";
import { Stream } from "@prisma/client";
import useSWR from "swr";
import Image from "next/image";

interface StreamsResponse {
  ok: boolean;
  streams: Stream[];
}

const Stream: NextPage = () => {
  const { data } = useSWR<StreamsResponse>(`/api/streams?page=1`);
  return (
    <Layout title="라이브" hasTabBar>
      <div className="py-8 block  px-4">
        {data?.streams.map((stream) => (
          <Link
            href={`streams/${stream.id}`}
            className="pt-4 px-4"
            key={stream.id}
          >
            <div className="w-full relative overflow-hidden -z-10 rounded-md shadow-sm bg-slate-300 aspect-video">
              <Image
                fill
                src={`https://videodelivery.net/${stream?.cloudflareId}/thumbnails/thumbnail.jpg?height=320`}
                alt=""
              />
            </div>
            <h1 className=" text-gray-700 text-lg mt-2">{stream.name}</h1>
          </Link>
        ))}
        <FloatingButton href="/streams/create">
          <svg
            className="h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  );
};

export default Stream;
