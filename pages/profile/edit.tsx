import { NextPage } from "next";
import Layout from "../../components/layout";
import Button from "../../components/button";
import Input from "../../components/input";

const EditProfile: NextPage = () => {
  return (
    <Layout canGoBack>
      <form className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              type="file"
              id="picture"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input label="이메일" name="email" kind="text" />
        <Input label="전화번호" name="phone" kind="phone" />
        <Button text="프로필 저장" />
      </form>
    </Layout>
  );
};
export default EditProfile;
