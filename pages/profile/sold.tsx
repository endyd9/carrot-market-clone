import { NextPage } from "next";
import Layout from "@components/layout";
import Item from "@components/item";
import useSWR from "swr";
import { ProductWithCount } from "pages";
import ProductList from "@components/product-list";

const Sold: NextPage = () => {
  return (
    <Layout canGoBack title="판매내역">
      <div className="flex flex-col space-y-5 py-10">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};
export default Sold;
