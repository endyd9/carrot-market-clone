import { NextPage } from "next";
import Layout from "@components/layout";
import Button from "@components/button";
import Input from "@components/input";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import useUser from "@libs/client/useUser";
import useMutation from "@libs/client/useMutatuin";

interface EditProfileForm {
  name?: string;
  email?: string;
  phone?: string;
  formErrors?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<EditProfileForm>();

  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user, setValue]);

  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>(`/api/users/me`);

  const onVilid = ({ email, phone, name }: EditProfileForm) => {
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", { message: "둘 중 하나는 입력하십셔" });
    }
    editProfile({ email, phone, name });
  };

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("formErrors", { message: data.error });
    }
  }, [data]);

  return (
    <Layout canGoBack>
      <form onSubmit={handleSubmit(onVilid)} className="py-10 px-4 space-y-4">
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
        <Input
          required={false}
          register={register("name")}
          label="이름"
          type="text"
          name="name"
          kind="text"
        />
        <Input
          required={false}
          register={register("email")}
          label="이메일"
          type="text"
          name="email"
          kind="text"
        />
        <Input
          required={false}
          register={register("phone")}
          type="text"
          label="전화번호"
          name="phone"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-500 font-medium text-center block">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "로딩중..." : "프로필 저장"} />
      </form>
    </Layout>
  );
};
export default EditProfile;
