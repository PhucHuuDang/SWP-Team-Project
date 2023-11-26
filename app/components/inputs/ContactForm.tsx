"use client";
import { BsSend } from "react-icons/bs";
import { BiMailSend } from "react-icons/bi";
import { useRef, useState } from "react";
import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";

const ContactForm = () => {
  const service_id = process.env.NEXT_PUBLIC_SERVICE_ID as string;
  const template_id = process.env.NEXT_PUBLIC_TEMPLATE_ID as string;
  const public_key = process.env.NEXT_PUBLIC_PUBLIC_KEY as string;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      user_name: "",
      user_mail: "",
      message: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const dataSend = {
      service_id: service_id,
      template_id: template_id,
      user_id: public_key,
      template_params: {
        user_name: data.user_name,
        user_mail: data.user_mail,
        message: data.message,
      },
    };

    axios
      .post("https://api.emailjs.com/api/v1.0/email/send", dataSend)
      .then((data) => {
        toast.success("successful");
        reset();
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to send");
      });
  };

  return (
    <div className="flex flex-col gap-[40px] lg:max-w-2xl xl:max-w-3xl mx-auto px-4">
      <div className="flex flex-row gap-2 items-center justify-center">
        <BiMailSend size={24} />
        <span className="font-bold text-md">Send us your desire!</span>
      </div>
      <div className="relative">
        <input
          id="user_name"
          {...register("user_name", { required: true })}
          className={`
          
          peer
          w-[400px]
          rounded-3xl
          text-lg
          font-bold
          py-4
          px-3
          border-b-[2px]
          shadow-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-2
          ${errors["user_name"] ? "border-rose-500" : "border-neutral-300"}
          ${
            errors["user_name"] ? "focus:border-rose-500" : "focus:border-black"
          }

          `}
        />
        <label
          className={`
                absolute
                text-md
                font-semibold
                duration-150
                transform
                left-0
                ml-4
                bg-white
                top-8
                z-40
                origin-[0]
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                // peer-focus:-translate-y-[2.85rem]
                -translate-y-[2.91rem]
          ${errors["user_name"] ? "text-rose-500" : "text-zinc-400"}

          `}
        >
          Write your name...
        </label>
      </div>

      <div className="relative">
        <input
          id="user_email"
          {...register("user_mail", { required: true })}
          className={`
          
          peer
          w-[400px]
          rounded-3xl
          text-lg
          font-bold
          py-4
          px-3
          border-b-[2px]
          shadow-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          border-2

          ${errors["user_mail"] ? "border-rose-500" : "border-neutral-300"}
          ${
            errors["user_mail"] ? "focus:border-rose-500" : "focus:border-black"
          }
          
          `}
        />
        <label
          htmlFor="user_email"
          className={`
                absolute
                text-md
                font-semibold
                duration-150
                transform
                left-0
                ml-4
                bg-white
                top-8
                z-40
                origin-[0]
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                // peer-focus:-translate-y-[2.85rem]
                -translate-y-[2.91rem]
              ${errors["user_mail"] ? "text-rose-500" : "text-zinc-400"}

          `}
        >
          Write your email...
        </label>
      </div>

      <div className="relative ">
        <textarea
          id="message"
          {...register("message", { required: true })}
          className={`
              peer
              w-[400px]
              rounded-3xl
              text-lg
              font-bold
              py-4
              px-3
              border-b-[2px]
              shadow-md
              outline-none
              transition
              disabled:opacity-70
              disabled:cursor-not-allowed
              border-2
              resize-none
              h-[200px]

              ${errors["message"] ? "border-rose-500" : "border-neutral-300"}
              ${
                errors["message"]
                  ? "focus:border-rose-500"
                  : "focus:border-black"
              }
              
          `}
        />
        <label
          htmlFor="message"
          className={`
                absolute
                text-md
                font-semibold
                duration-150
                transform
                left-0
                ml-4
                bg-white
                top-8
                z-40
                origin-[0]
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                // peer-focus:-translate-y-[2.85rem]
                -translate-y-[2.91rem]
                ${errors["message"] ? "text-rose-500" : "text-zinc-400"}

          `}
        >
          Your content...
        </label>
      </div>

      <div
        onClick={handleSubmit(onSubmit)}
        className="
          relative
          text-[30px]
          cursor-pointer
          text-neutral-600
          hover:text-neutral-800
          hover:scale-105
          flex
          flex-row
          gap-2
          w-[100px]
          duration-300

          "
      >
        Send <BsSend size={18} className="absolute right-0" />
      </div>
    </div>
  );
};

export default ContactForm;
