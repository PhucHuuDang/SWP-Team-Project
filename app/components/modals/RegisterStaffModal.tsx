"use client";

import { toast } from "react-hot-toast";

import { FieldValues, SubmitHandler, set, useForm } from "react-hook-form";

import { useCallback, useState } from "react";
import useRegisterStaffModal from "@/app/hooks/useRegisterStaffModal";

import { FcGoogle } from "react-icons/fc";
import { AiFillGithub } from "react-icons/ai";

import Modal from "./Modal";
import Heading from "../Heading";
import Input from "../inputs/Input";
import Button from "../Button";
import useLoginModal from "@/app/hooks/useLoginModal";
import axios from "axios";
import { useRouter } from "next/navigation";

const RegisterStaffModal = () => {
  const registerStaffModal = useRegisterStaffModal();
  const loginModal = useLoginModal();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      fullName: "",
      email: "",
      userName: "",
      password: "",
    },
  });

  const toggle = useCallback(() => {
    registerStaffModal.onClose();
    router.refresh();
  }, [registerStaffModal, router]);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    // console.log(data);
    // const test = JSON.stringify(data)
    // console.log(test);
    axios
      .post("/api/registerStaff", data)
      .then(() => {
        toast.success("Register Successfully!");
        router.refresh();
        registerStaffModal.onClose();
      })
      .catch(() => {
        toast.error("Please check username or password again!");
        // toast.error("Register failed, please check it again");
      })
      .finally(() => {
        setIsLoading(false);
      });

    // console.log(JSON.stringify(data));
    // const { name, email, password } = data;
    // console.log(name, email, password);
    // console.log(data);
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading title="Welcome to SpaceT" subtitle="Create an account!" center />
      {/* <Input
        id="firstName"
        label="First Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      /> */}

      <Input
        id="fullName"
        label="Full Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="email"
        label="Email"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="userName"
        label="Name"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />

      <Input
        id="password"
        label="Password"
        type="password"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
    </div>
  );

  const footerContent = (
    <div className="flex flex-col gap-4 mt-3">
      <hr />

      <Button
        outline
        label="Continue with Google"
        icon={FcGoogle}
        onClick={() => {}}
      />

      <Button
        outline
        label="Continue with GitHub"
        icon={AiFillGithub}
        onClick={() => {}}
      />
      <div className="text-neutral-500 text-center mt-4 font-light">
        <div className="justify-center flex flex-row items-center gap-2">
          <div>Already have accounts</div>
          {/* <div
            onClick={toggle}
            className="text-neutral-500 cursor-pointer hover:underline"
          >
            Login
          </div> */}
        </div>
      </div>
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerStaffModal.isOpen}
      title="Register"
      body={bodyContent}
      footer={footerContent}
      actionLabel="Continue"
      onClose={registerStaffModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
    />
  );
};

export default RegisterStaffModal;