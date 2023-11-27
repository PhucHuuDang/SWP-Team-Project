"use client";

import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";

import Image from "next/image";
import { PackageProps, PaymentMethodProps, ServiceProp } from "@/app/types";
import { memo, use, useCallback, useEffect, useMemo, useState } from "react";
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
import { ServiceArrayProps } from "./MainCart";
import TimeSelect from "../components/inputs/TimeSelect";
import { useRouter } from "next/navigation";
import numeral from "numeral";

interface CartClientProps {
  data?: PackageProps | undefined;
  getApartmentByStudentId: any | null;
  getStudentId: any | null;
  priceServices: number;
  serviceArray: ServiceArrayProps[];
  // setCheckLengthDataCombo: (value: PackageProps[]) => void;
  checkLengthService: ServiceProp[];

  // paymentMethods: PaymentMethodProps[];
}

const CartClient: React.FC<CartClientProps> = ({
  getApartmentByStudentId,
  getStudentId,
  priceServices,
  serviceArray,
  // setCheckLengthDataCombo,
  checkLengthService,

  // paymentMethods,
}) => {
  const router = useRouter();

  const { storeBookingData, setStoreBookingData } = useBooking();
  const [updateStoreBookingData, setUpdateStoreBookingData] = useState<
    PackageProps[]
  >([]);

  const [isCartEmpty, setIsCartEmpty] = useState(false);

  const [disabled, setDisabled] = useState(false);
  const useApartment = useApartmentModal();
  const currentDate = new Date();

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0"); // Pad with 0 if needed.

  const formattedDate = `${year}-${month}-${day}`;

  // console.log(formattedDate);

  const totalPrice = useMemo(() => {
    const calculatePrice = updateStoreBookingData.reduce((total, price) => {
      return (
        total +
        price.totalPrice +
        (priceServices !== undefined ? priceServices : 0)
      );
    }, 0);

    // return calculatePrice.toFixed(3);
    return calculatePrice;
  }, [priceServices, updateStoreBookingData]);

  const formattedTotalPrice = useMemo(() => {
    const defaultPrice = 0;
    return totalPrice !== undefined ? totalPrice : defaultPrice; // Set a default value if totalPrice is undefined
  }, [totalPrice]);
  const displayedPrice = formattedTotalPrice.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  const formattedPrice = (price: number): string => {
    return numeral(price).format("0,0 đ");
  };

  console.log(formattedPrice(totalPrice));

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
  } = useForm<FieldValues>({
    defaultValues: {
      // requiredAmount: totalPrice !== 0 ? totalPrice : priceServices,
      requiredAmount: totalPrice,
      newBooking: {},
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
  const endDate = watch("endDate");

  const newBooking = watch("newBooking");
  // console.log(newBooking);

  // console.log(serviceArray);

  useEffect(() => {
    setCustomValue("listPackage", updateStoreBookingData);
  }, [updateStoreBookingData, setCustomValue]);

  const listPackage = watch("listPackage");

  //   console.log(listPackage);

  //   console.log("apartmentId: ", apartmentId);

  //   console.log("paymentMethodId: ", paymentMethodId);
  useEffect(() => {
    const listPackage = updateStoreBookingData.map((item) => {
      return {
        packageId: item.id,
        quantityOfPackageOrdered: item.packageItem,
      };
    });

    setValue("listPackage", listPackage);
  }, [updateStoreBookingData, setValue]);

  const newBookingValue = useMemo(
    () => ({
      startDate: formattedDate,
      endDate: endDate,
      apartmentId: apartmentId,
      totalPrice:
        formattedPrice(totalPrice) === "0"
          ? formattedPrice(priceServices)
          : formattedPrice(totalPrice),
      listPackage: listPackage,
      listService: serviceArray,
    }),
    [formattedDate, endDate, apartmentId, totalPrice, listPackage, serviceArray]
  );

  useEffect(() => {
    setCustomValue("newBooking", newBookingValue);

    // setCustomValue("requiredAmount", totalPrice);
    setCustomValue(
      "requiredAmount",
      formattedPrice(totalPrice) === "0"
        ? formattedPrice(priceServices)
        : formattedPrice(totalPrice)
    );
  }, [newBookingValue, setCustomValue, formattedTotalPrice, priceServices]);

  console.log(newBookingValue);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!getStudentId) {
        window.localStorage.removeItem("cart");
        window.localStorage.removeItem("updateCart");
        console.log("Removed 'cart' from localStorage.");
        setStoreBookingData([]);
        setUpdateStoreBookingData([]);
        // router.refresh();

        setIsCartEmpty(
          storeBookingData.length === 0 && checkLengthService.length === 0
        );
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

  // check length combo data
  // useEffect(() => {
  //   setCheckLengthDataCombo(updateStoreBookingData);
  // }, [updateStoreBookingData, setCheckLengthDataCombo]);

  // console.log(updateStoreBookingData);

  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  const onSubmit = useCallback<SubmitHandler<FieldValues>>(
    async (data) => {
      console.log(data);
      setDisabled(true);

      axios
        .post("/api/payment", data)

        .then((callback) => {
          const getCurrentTime = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes: number = now.getMinutes();
            const ampm = hours >= 12 ? "pm" : "am";
            hours = hours % 12 || 12;
            minutes = minutes < 10 ? minutes : minutes;
            const currentTime = `${hours}:${minutes}${ampm}`;

            return currentTime;
          };
          const currentTime = getCurrentTime();

          toast.custom((t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <Image
                      className="h-10 w-10 rounded-full"
                      src="/images/logo-primary.svg"
                      width={10}
                      height={10}
                      alt="logo-primary"
                    />
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      Thanks ${getStudentId?.sub} for your payment!
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Your payment is successful at ${currentTime} , we will
                      contact you as soon as
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex border-l border-gray-200">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  Close
                </button>
              </div>
            </div>
          ));
          // console.log(callback);
          // console.log(callback.data);

          if (callback.data.paymentUrl) {
            router.push(callback.data.paymentUrl);
            router.refresh();
          } else {
            console.error("Invalid payment URL:", callback.data.paymentUrl);
          }
        })

        .catch(() => {
          toast.error("Please check your information again");
        })
        .finally(() => {
          setDisabled(false);
        });
    },
    [router, getStudentId]
  );

  const validateSubmit = useCallback(async () => {
    if (!apartmentId || !endDate) {
      return toast.error(
        "Let me know your apartment or day time your are desire!"
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
    endDate,
    handleSubmit,
    onSubmit,
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
          const newTotalPrice = item.totalPrice - originalItem.totalPrice;
          return {
            ...item,
            // numberOfPerWeekDoPackage: newNumberOfPerWeekDoPackage,
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

  // console.log(storeBookingData);

  if (storeBookingData.length === 0 && checkLengthService.length === 0) {
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

  if (isCartEmpty) {
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

      {storeBookingData.length !== 0 && (
        <div className="pt-10">
          <hr className="mb-8" />
          <Heading title="Your Combos(packages) you booked!" center />
        </div>
      )}
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
              <span>₫</span>
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
              )}{" "}
              ₫
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
              Price: {formattedPrice(item.totalPrice)} ₫
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
        <div className="container mx-auto flex items-center justify-end gap-20 mr-52">
          {/* <div className="text-lg text-neutral-800 ">
            Total payment: {totalPrice}
          </div> */}

          <div className="flex items-center gap-2 text-lg">
            Total payment:
            <p className="text-[#ff6347] font-semibold">
              {/* {totalPrice !== 0 ? totalPrice : priceServices} ₫ */}
              {formattedPrice(totalPrice) === "0"
                ? formattedPrice(priceServices)
                : formattedPrice(totalPrice)}
              {/* {displayedPrice}{" "} */}
            </p>
          </div>

          {/* <div> */}
          {/* <PaymentSelect
            onChange={(value) => setCustomValue("paymentMethodId", value)}
            paymentMethod={paymentMethods}
          /> */}
          <TimeSelect onChange={(value) => setCustomValue("endDate", value)} />
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

export default memo(CartClient);
