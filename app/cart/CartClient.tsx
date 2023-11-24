"use client";

import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";

import Image from "next/image";
import { PackageProps, PaymentMethodProps, ServiceProp } from "@/app/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import { useBooking } from "@/providers/BookingProvider";
import Heading from "../components/Heading";
import Logo from "../components/navbar/Logo";
import useApartmentModal from "../hooks/useApartmentModal";
import Button from "../components/Button";
import PaymentSelect from "../components/inputs/PaymentSelect";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import DoServiceApartmentSelect from "../components/inputs/DoServiceApartmentSelect";
import { toast } from "react-hot-toast";
import axios from "axios";
import numeral from "numeral";

interface CartClientProps {
  data?: PackageProps | undefined;
  getApartmentByStudentId: any | null;
  getStudentId: any | null;
  // paymentMethods: PaymentMethodProps[];
}

const CartClient: React.FC<CartClientProps> = ({
  data,
  getApartmentByStudentId,
  getStudentId,
  // paymentMethods,
}) => {
  const { storeBookingData, setStoreBookingData } = useBooking();
  const [updateStoreBookingData, setUpdateStoreBookingData] = useState<
    PackageProps[]
  >([]);
  const [disabled, setDisabled] = useState(false);
  const useApartment = useApartmentModal();

  const vietnamTimeZone = "Asia/Ho_Chi_Minh";

  const currentDate = new Date();

  const options = { timeZone: vietnamTimeZone };

  //   const formattedDate = currentDate.toLocaleDateString("en-US", options);
  //   const formattedTime = currentDate.toLocaleTimeString("en-US", options);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1 and pad with 0 if needed.
  const day = String(currentDate.getDate()).padStart(2, "0"); // Pad with 0 if needed.

  const formattedDate = `${year}-${month}-${day}`;
  const formattedPrice = (price: number): string => {
    return numeral(price).format("0,0 ₫");
  };

  //   const dateTimeString = `${formattedDate}`;
  const dateTimeString = formattedDate;
  //   const dateTimeString = `${formattedDate} ${formattedTime}`;

  //   console.log(storeBookingData);

  //   console.log("getApartmentByStudentId: ", getApartmentByStudentId);

  //   if (typeof window !== "undefined") {
  //     if (!getStudentId) {
  //       console.log("Removing 'cart' from localStorage.");
  //       window.localStorage.removeItem("cart");
  //     }
  //   }

  //   console.log(getApartmentByStudentId);

  // console.log(getStudentId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      startDate: dateTimeString,
      apartmentId: "",
      createBy: getStudentId ? getStudentId.sub : "",
      paymentMethodId: "",
      listPackage: [
        {
          packageId: "",
          quantityOfPackageOrdered: 1,
        },
      ],
    },
  });

  const setCustomValue = useCallback(
    (id: string, value: any) => {
      if (id === "listPackage") {
        const updateListPackage = value.map(
          (item: PackageProps, index: number) => ({
            packageId: item.id,
            quantityOfPackageOrdered: item.packageItem,
          })
        );

        setValue(id, updateListPackage, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      } else {
        setValue(id, value, {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    },
    [setValue]
  );

  const paymentMethodId = watch("paymentMethodId");
  const apartmentId = watch("apartmentId");

  useEffect(() => {
    setCustomValue("listPackage", updateStoreBookingData);
  }, [updateStoreBookingData, setCustomValue]);

  const listPackage = watch("listPackage");

  //   console.log(listPackage);

  //   console.log("apartmentId: ", apartmentId);

  //   console.log("paymentMethodId: ", paymentMethodId);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!getStudentId) {
        window.localStorage.removeItem("cart");
        window.localStorage.removeItem("updateCart");
        console.log("Removed 'cart' from localStorage.");
        setStoreBookingData([]);
        setUpdateStoreBookingData([]);
      }
    }
  }, [getStudentId, setStoreBookingData]);

  // store updateCart to localStorage

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("updateCart", JSON.stringify(storeBookingData));
    }
  }, [storeBookingData]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateCartStored = JSON.parse(
        localStorage.getItem("updateCart") || "[]"
      );
      setUpdateStoreBookingData(updateCartStored);
    }
  }, []);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    // console.log(data);
    setDisabled(true);

    axios
      .post("/api/payment", data)

      .then(() => {
        toast.success("Payment successfully!");
      })

      .catch(() => {
        toast.error("Please check your information again");
      })
      .finally(() => {
        setDisabled(false);
      });
  };

  const validateSubmit = useCallback(async () => {
    if (!apartmentId || !paymentMethodId) {
      return toast.error(
        "Let me know your apartment or payment method desire!"
      );
      //   return;
    } else if (!getApartmentByStudentId) {
      toast.error("Please register your apart to us ");
      return useApartment.onOpen();
    } else {
      try {
        await handleSubmit(onSubmit)();
      } catch (error) {
        toast.error("have something went wrong with submit");
      }
    }
  }, [
    apartmentId,
    paymentMethodId,
    handleSubmit,
    getApartmentByStudentId,
    useApartment,
  ]);

  //   console.log(updateStoreBookingData);

  //   console.log(getStudentId.sub);

  const removeCart = (id: string) => {
    const updatedStoreBookingDataChild = updateStoreBookingData.filter(
      (item) => {
        return item.id !== id;
      }
    );

    const updatedStoreBookingDataParent = storeBookingData.filter((item) => {
      return item.id !== id;
    });

    setUpdateStoreBookingData(updatedStoreBookingDataChild);

    // Also, ensure that the parent state (`storeBookingData`) is updated
    setStoreBookingData(updatedStoreBookingDataParent);
  };

  const formatDays = (days: string[]) => {
    return days
      .map((day, index) => {
        if (index < days.length - 1) {
          return day + " ";
        }
        return day;
      })
      .join(", ");
  };

  const totalPrice = updateStoreBookingData.reduce((total, price) => {
    return total + price.totalPrice;
  }, 0);

  //   console.log(totalPrice);

  const handleMinusItem = (id: string) => {
    const updatedStoreBookingData = updateStoreBookingData.map((item) => {
      if (item.id === id) {
        // Increment the value of numberOfPerWeekDoPackage by 1

        if (item.packageItem <= 1) {
          return {
            ...item,
          };
        }

        const originalItem = storeBookingData.find(
          (original) => original.id === id
        );
        if (originalItem) {
          // Increment the value of numberOfPerWeekDoPackage and totalPrice based on the original item
          const newNumberOfPerWeekDoPackage =
            item.numberOfPerWeekDoPackage -
            originalItem.numberOfPerWeekDoPackage;
          const newTotalPrice = item.totalPrice - originalItem.totalPrice;

          return {
            ...item,
            numberOfPerWeekDoPackage: newNumberOfPerWeekDoPackage,
            weekNumberBooking:
              item.weekNumberBooking - originalItem.weekNumberBooking,
            totalPrice: newTotalPrice,
            packageItem: item.packageItem - 1,
          };
        }
      }
      return item;
    });

    setUpdateStoreBookingData(updatedStoreBookingData);
  };

  const handlePlusItem = (id: string) => {
    const updatedStoreBookingData = updateStoreBookingData.map((item) => {
      if (item.id === id) {
        // Increment the value of numberOfPerWeekDoPackage by 1

        // const oldPrice
        // return {
        //   ...item,
        //   numberOfPerWeekDoPackage:
        //     item.numberOfPerWeekDoPackage + item.numberOfPerWeekDoPackage,
        //   weekNumberBooking: item.weekNumberBooking + item.weekNumberBooking,
        //   totalPrice: item.totalPrice + item.totalPrice,
        //   packageItem: item.packageItem + 1,
        // };

        const originalItem = storeBookingData.find(
          (original) => original.id === id
        );
        if (originalItem) {
          // Increment the value of numberOfPerWeekDoPackage and totalPrice based on the original item
          const newNumberOfPerWeekDoPackage =
            item.numberOfPerWeekDoPackage +
            originalItem.numberOfPerWeekDoPackage;
          const newTotalPrice = item.totalPrice + originalItem.totalPrice;

          return {
            ...item,
            numberOfPerWeekDoPackage: newNumberOfPerWeekDoPackage,
            weekNumberBooking:
              item.weekNumberBooking + originalItem.weekNumberBooking,
            totalPrice: newTotalPrice,
            packageItem: item.packageItem + 1,
          };
        }
      }
      return item;
    });

    setUpdateStoreBookingData(updatedStoreBookingData);
  };

  if (storeBookingData.length === 0) {
    return (
      <ClientOnly>
        <EmptyState
          title="Your cart is empty"
          subtitle="Let turn back and add some product you want our serve"
          showReset
          booking
        />
      </ClientOnly>
    );
  }

  return (
    <>
      <div className="my-8 flex flex-row justify-center items-center gap-4">
        <Logo />
        <Heading
          title="SpaceT Cart"
          subtitle="Hope you guys give us a chance to serve for you!"
        />
        {/* <div className="flex items-center justify-center gap-4">
            <Logo />
            <Heading
              title="SpaceT Cart"
              subtitle="Hope you guys give us a chance to serve for you!"
            />
          </div> */}

        <div
          className="
                    flex
                    flex-col
                    justify-center
                    items-center
                    absolute 
                    right-0
                    mr-36
                    gap-4   
                    "
        >
          {/* relative left-96  */}
          <div className="text-lg text-neutral-700 font-semibold">
            {!getApartmentByStudentId ? (
              <>Look likes you have nothing any apartment info</>
            ) : (
              <>
                You already have {getApartmentByStudentId.length} apartments, do
                you want to register another?
              </>
            )}
          </div>

          <div className="flex flex-row gap-3">
            <div
              onClick={useApartment.onOpen}
              className="
                flex
                flex-row
                items-center
                gap-1
                p-2
                px-4
                bg-[#f58470]
                rounded-lg
                hover:bg-[#f34728]
                hover:shadow-lg
                cursor-pointer
                transition
                duration-200

                "
            >
              <BsFillHouseAddFill size={25} /> Register Apartment
            </div>
            {getApartmentByStudentId ? (
              <>
                <DoServiceApartmentSelect
                  getApartmentByStudentId={getApartmentByStudentId}
                  onChange={(value) => setCustomValue("apartmentId", value)}
                />
              </>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      {/* {storeBookingData.map((item) => { */}

      <div className="pt-10">
        <hr className="mb-8" />
        <Heading title="Your Combos(packages) you booked!" center />
      </div>
      {updateStoreBookingData.map((item) => {
        return (
          <div
            key={item.id}
            className="
                flex
                cursor-pointer
                flex-row
                items-center
                justify-between
                rounded-lg
                bg-gray-200
                p-2
                transition
                duration-200
                hover:scale-105
                hover:bg-gray-300
                hover:shadow-lg
                "
          >
            <div className="flex items-center gap-2 w-[327px]">
              <Image
                src={item.image as any}
                width={0}
                height={0}
                className="w-16 rounded-md object-cover"
                alt=""
              />

              <div className="flex flex-col gap-1">
                {/* <div className="text-lg font-semibold">{data.packageName}</div> */}
                <div className="text-lg font-semibold">{item.packageName}</div>
                {/* <div className="font-light text-gray-600">{data.dayDoInWeek}</div> */}
                <div className="font-light text-gray-600">
                  {/* {formatDays(item.dayDoInWeek)} */}
                  test
                </div>
              </div>
            </div>
            {/* <div className="flex items-center gap-2">
              Week booking:{" "}
              <p className="text-[#ff6347] font-semibold">
                {item.weekNumberBooking}
              </p>
            </div> */}
            <div className="flex flex-row items-center gap-2 mr-4">
              <span>Original Price: </span>
              <del className="font-light text-[#ed9080]">
                {formattedPrice(item.totalOriginalPrice)}
              </del>{" "}
              <span>đ</span>
            </div>
            {/* <div>week booking: {data.weekNumberBooking}</div> */}
            <div className="flex flex-row items-center gap-2 mr-4">
              <span>Discounted Percent: </span>
              {item.discountPercent}%
            </div>
            {/* <div>times do per week: {data.numberOfPerWeekDoPackage}</div> */}
            {/* <div>price: {item.totalPrice}</div> */}
            {/* <div>price: {data.totalPrice}</div> */}
            <div key={item.id} className="mr-4">
              Price:{" "}
              {formattedPrice(
                storeBookingData.find(
                  (priceInitial) => priceInitial.id === item.id
                )?.totalPrice ?? 0
              )}
              đ
            </div>
            <div className="flex items-center gap-5">
              <div
                onClick={() => handleMinusItem(item.id)}
                className="
                        bg-neutral-300
                        p-2
                        rounded-lg
                        hover:bg-neutral-400
                        hover:shadow-lg
                        transition
                        duration-200"
              >
                <AiOutlineMinus />
              </div>
              {item.packageItem}
              <div
                onClick={() => handlePlusItem(item.id)}
                className="
                    bg-neutral-300
                    p-2
                    rounded-lg
                    hover:bg-neutral-400
                    hover:shadow-lg
                    transition
                    duration-200"
              >
                <AiOutlinePlus />
              </div>
            </div>
            <div className="text-[#ff6347] font-semibold">
              Price: {formattedPrice(item.totalPrice)}đ
            </div>
            <div
              onClick={() => removeCart(item.id)}
              className="hover:cursor-pointer p-1"
            >
              <IoMdClose size={25} />
            </div>
            <div className="mr-3">
              <MdOutlinePayment size={25} />
            </div>
          </div>
        );
      })}

      {/* <div className="flex justify-end mt-10 pr-44">
        <DoServiceApartmentSelect
          getApartmentByStudentId={getApartmentByStudentId}
          onChange={(value) => setCustomValue("apartmentId", value)}
        />
      </div> */}

      <div
        className="
            z-29
            fixed
            bottom-0
            flex
            w-full
            items-center
            border-t-[1px]
            bg-white py-4
            mr-28
            "
      >
        {/* <div className=""></div> */}
        <div className="container mx-auto flex items-center justify-end gap-40 mr-80">
          {/* <div className="text-lg text-neutral-800 ">
            Total payment: {totalPrice}
          </div> */}

          <div className="flex items-center gap-2 text-lg">
            Total payment:
            <p className="text-[#ff6347] font-semibold">
              {formattedPrice(totalPrice)}đ
            </p>
          </div>

          {/* <div> */}
          {/* <PaymentSelect
            onChange={(value) => setCustomValue("paymentMethodId", value)}
            paymentMethod={paymentMethods}
          /> */}
          {/* </div> */}

          <div
            // onClick={handleSubmit(onSubmit)}
            onClick={validateSubmit}
            className={`
                mr-20
                rounded-lg
                flex
                items-center
                gap-1
                bg-[#ff6347]
                p-2
                px-5
                text-2xl
                font-semibold
                text-neutral-800
                hover:text-neutral-900
                transition
                duration-200
                ${
                  disabled
                    ? "disabled opacity-75 cursor-not-allowed text-neutral-700"
                    : "hover:bg-[#f34728] hover:shadow-lg cursor-pointer"
                }

            
            `}
          >
            <MdOutlinePayment size={30} />
            Payment
          </div>
          {/* <Button icon={MdOutlinePayment} onClick={() => {}} label="Payment" /> */}
        </div>
      </div>
    </>
  );
};

export default CartClient;
