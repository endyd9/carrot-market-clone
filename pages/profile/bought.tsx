import type { NextPage } from "next";
import Layout from "@components/layout";
import Item from "@components/item";

const Bought: NextPage = () => {
  return (
    <Layout canGoBack>
      <div className="flex flex-col space-y-5 py-10">
        {[1, 1, 1, 1].map((_, i) => (
          <Item
            id={i}
            key={i}
            title="MacBook Pro"
            price={247000}
            comments={5}
            hearts={332}
          />
        ))}
      </div>
    </Layout>
  );
};

export default Bought;
