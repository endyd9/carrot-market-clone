import type { NextPage } from "next";
import Layout from "../../components/layout";
import Button from "../../components/button";
import TextArea from "../../components/textarea";

const Write: NextPage = () => {
  return (
    <Layout canGoBack>
      <form className="px-4 py-10">
        <TextArea placeholder="질문하세용" />
        <Button text="질문하기" />
      </form>
    </Layout>
  );
};

export default Write;
