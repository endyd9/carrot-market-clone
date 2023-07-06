import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Layout from "@components/layout";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import Link from "next/link";
import { ChatRoom, Product, User } from "@prisma/client";
import useMutation from "@libs/client/useMutatuin";
import { cls } from "@libs/client/utils";
import useUser from "@libs/client/useUser";
import Image from "next/image";
import { useEffect } from "react";
import client from "@libs/server/client";

interface ProductWithUser extends Product {
  user: User;
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProduct: Product[];
  isLiked: boolean;
}

interface CreateChatRoomResponse {
  ok: boolean;
  chatRoom?: ChatRoom;
  allReadyExist?: ChatRoom;
}

const ItemDetail: NextPage<ItemDetailResponse> = ({
  product,
  relatedProduct,
  isLiked,
}) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);

  const onFavClick = () => {
    if (data && data?.product.userId === user?.id) {
      return alert("자기건 좋아요 못 누름ㅅㄱ");
    }
    if (!data) return;
    boundMutate((priv: any) => ({ ...priv, isLiked: !priv.isLiked }), false);
    // mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false);
    toggleFav({});
  };

  const [createChatRoom, { loading, data: chatRoomData }] =
    useMutation<CreateChatRoomResponse>(`/api/chats`);

  const onChatClick = () => {
    const chatData = {
      product: data?.product.id,
      seller: data?.product.user.id,
      buyer: user?.id,
    };
    createChatRoom(chatData);
  };
  useEffect(() => {
    if (chatRoomData && chatRoomData.chatRoom) {
      router.push(`/chats/${chatRoomData.chatRoom.id}`);
    } else if (chatRoomData && chatRoomData.allReadyExist) {
      router.push(`/chats/${chatRoomData.allReadyExist.id}`);
    }
  }, [chatRoomData, router]);

  return (
    <Layout canGoBack title="상품 상세보기" seoTitle={product?.name}>
      <div className="px-4 py-10">
        <div className="mb-8">
          <div className="relative pb-80 -z-10">
            <Image
              fill
              src={`https://imagedelivery.net/e47gKtH1bqlCtb8hOWHyxQ/${product.imgUrl}/public`}
              className="bg-slate-300 object-cover"
              alt="상품 이미지"
            />
          </div>
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <Image
              src={`https://imagedelivery.net/e47gKtH1bqlCtb8hOWHyxQ/${product?.user?.avatar}/avatar`}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full bg-slate-300"
              alt="프로필 사진"
            />
            <div>
              <p className="text-sm font-medium text-gray-700">
                {product?.user?.name}
              </p>
              <p className="text-xs font-medium text-gray-500">
                <Link href={`/users/profiles/${product?.user?.id}`}>
                  프로필 보기 &rarr;
                </Link>
              </p>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">
              {product?.name}
            </h1>
            <p className="block text-3xl mt-3 text-gray-900">
              ₩{product?.price}
            </p>
            <p className="text-base my-6 text-gray-700">
              {product?.description}
            </p>
            <div className="flex items-center justify-between space-x-2">
              {product.userId === user?.id ? (
                <button className="flex-1 bg-orange-500 text-white py-3 rounded-md focus:outline-none focus:ring-offset-2 font-medium hover:bg-orange-600 focus:ring-orange-500">
                  상품정보 수정하기
                </button>
              ) : (
                <button
                  onClick={onChatClick}
                  className="flex-1 bg-orange-500 text-white py-3 rounded-md focus:outline-none focus:ring-offset-2 font-medium hover:bg-orange-600 focus:ring-orange-500"
                >
                  판매자와 채팅하기
                </button>
              )}
              <button
                onClick={onFavClick}
                className={cls(
                  "p-3 rounded-full focus:outline-none flex items-center justify-center hover:bg-gray-100",
                  isLiked
                    ? "text-red-500 hover:text-red-600"
                    : "text-gray-400  hover:text-gray-500"
                )}
              >
                {isLiked ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-6 h-6"
                  >
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
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
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">비슷한 상품</h2>
          <div className="mt-6 grid grid-cols-2 gap-4">
            {relatedProduct?.map((product: Product) => (
              <Link href={`${product.id}`} key={product.id}>
                <div>
                  <img
                    src={`https://imagedelivery.net/e47gKtH1bqlCtb8hOWHyxQ/${product?.imgUrl}/public`}
                    className="h-56 w-full mb-4 bg-slate-300 "
                  />
                  <h3 className="text-sm text-gray-700 -mb-1">
                    {product.name}
                  </h3>
                  <span className="text-sm font-medium text-gray-900">
                    ₩{product.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  console.log("정적페이지 생성 딱 대");
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }
  const product = await client.product.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));
  const relatedProduct = await client.product.findMany({
    take: 10,
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = false;
  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProduct: JSON.parse(JSON.stringify(relatedProduct)),
      isLiked,
    },
  };
};

export default ItemDetail;
