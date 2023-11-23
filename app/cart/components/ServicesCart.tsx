"use client";

import { AiOutlinePlus } from "react-icons/ai";
import { AiOutlineMinus } from "react-icons/ai";
import { IoMdClose } from "react-icons/io";
import { MdOutlinePayment } from "react-icons/md";
import { BsFillHouseAddFill } from "react-icons/bs";

import Image from "next/image";
import { PackageProps, PaymentMethodProps, ServiceProp } from "@/app/types";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useBooking } from "@/providers/BookingProvider";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import axios from "axios";
import useApartmentModal from "@/app/hooks/useApartmentModal";
import ClientOnly from "@/app/components/ClientOnly";
import EmptyState from "@/app/components/EmptyState";
import Logo from "@/app/components/navbar/Logo";
import Heading from "@/app/components/Heading";
import DoServiceApartmentSelect from "@/app/components/inputs/DoServiceApartmentSelect";
import PaymentSelect from "@/app/components/inputs/PaymentSelect";
import { set } from "date-fns";
import { ServiceArrayProps } from "../MainCart";
import { useRouter } from "next/navigation";

interface ServicesCartProps {
  data?: PackageProps | undefined;
  getApartmentByStudentId: any | null;
  getStudentId: any | null;
  paymentMethods?: PaymentMethodProps[];
  setPriceServices: (price: number) => void;
  setServiceArray: (value: ServiceArrayProps[]) => void;
  setCheckLengthService: (value: ServiceProp[]) => void;
}

const ServicesCart: React.FC<ServicesCartProps> = ({
  data,
  getApartmentByStudentId,
  getStudentId,
  paymentMethods,
  setPriceServices,
  setServiceArray,
  setCheckLengthService,
}) => {
  const { servicesBooked, setServicesBooked } = useBooking();
  const router = useRouter();

  const [updateStoreBookingData, setUpdateStoreBookingData] = useState<
    ServiceProp[]
  >([]);

  const [isCartEmpty, setIsCartEmpty] = useState(false);

  // const [serviceBooked, setServicesBooked] = useState<ServiceProp[]>([]);

  const [disabled, setDisabled] = useState(false);
  const useApartment = useApartmentModal();

  const vietnamTimeZone = "Asia/Ho_Chi_Minh";

  const currentDate = new Date();

  const options = { timeZone: vietnamTimeZone };

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so we add 1 and pad with 0 if needed.
  const day = String(currentDate.getDate()).padStart(2, "0"); // Pad with 0 if needed.

  const formattedDate = `${year}-${month}-${day}`;
  const formattedPrice = (price: number): string => {
    return numeral(price).format("0,0 ₫");
  };

  const dateTimeString = formattedDate;

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

  useEffect(() => {
    setCustomValue("listPackage", updateStoreBookingData);
  }, [updateStoreBookingData, setCustomValue]);

  const listPackage = watch("listPackage");

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!getStudentId) {
        window.localStorage.removeItem("serviceCart");
        window.localStorage.removeItem("updateServiceCart");
        // console.log("Removed 'cart' from localStorage.");
        // setStoreBookingData([]);
        setServicesBooked([]);
        setUpdateStoreBookingData([]);

        setIsCartEmpty(updateStoreBookingData.length === 0);
        // router.refresh();
      }
    }
  }, [getStudentId, setServicesBooked]);

  // store updateCart to localStorage

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("updateServiceCart", JSON.stringify(servicesBooked));
    }
  }, [servicesBooked]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const updateCartStored = JSON.parse(
        localStorage.getItem("updateServiceCart") || "[]"
      );
      setUpdateStoreBookingData(updateCartStored);
    }
  }, []);
  // console.log(updateStoreBookingData.length);

  useEffect(() => {
    setCheckLengthService(updateStoreBookingData);
  }, [setCheckLengthService, updateStoreBookingData]);
  // console.log(serviceBooked);

  // check service data length

  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //   // console.log(data);
  //   setDisabled(true);

  //   axios
  //     .post("/api/payment", data)

  //     .then(() => {
  //       toast.success("Payment successfully!");
  //     })

  //     .catch(() => {
  //       toast.error("Please check your information again");
  //     })
  //     .finally(() => {
  //       setDisabled(false);
  //     });
  // };

  // const validateSubmit = useCallback(async () => {
  //   if (!apartmentId || !paymentMethodId) {
  //     return toast.error(
  //       "Let me know your apartment or payment method desire!"
  //     );
  //     //   return;
  //   } else if (!getApartmentByStudentId) {
  //     toast.error("Please register your apart to us ");
  //     return useApartment.onOpen();
  //   } else {
  //     try {
  //       await handleSubmit(onSubmit)();
  //     } catch (error) {
  //       toast.error("have something went wrong with submit");
  //     }
  //   }
  // }, [
  //   apartmentId,
  //   paymentMethodId,
  //   handleSubmit,
  //   getApartmentByStudentId,
  //   useApartment,
  // ]);

  //   console.log(updateStoreBookingData);

  //   console.log(getStudentId.sub);

  const removeCart = (id: string) => {
    const updatedStoreBookingDataChild = updateStoreBookingData.filter(
      (item) => {
        return item.id !== id;
      }
    );

    const updatedStoreBookingDataParent = servicesBooked.filter((item) => {
      return item.id !== id;
    });

    setUpdateStoreBookingData(updatedStoreBookingDataChild);

    // Also, ensure that the parent state (`storeBookingData`) is updated
    setServicesBooked(updatedStoreBookingDataParent);
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

  // set price services
  useEffect(() => {
    const totalPrice = updateStoreBookingData.reduce((total, price) => {
      return total + price.price;
    }, 0);

    // console.log(totalPrice);

    setPriceServices?.(totalPrice);
  }, [setPriceServices, updateStoreBookingData]);

  useEffect(() => {
    const updateServiceArray = updateStoreBookingData.map((item) => {
      return {
        serviceId: item.id,
        quantityOfServiceOrdered: item.quantity as number,
      };
    });

    setServiceArray?.(updateServiceArray);
  }, [updateStoreBookingData, setServiceArray]);

  // console.log(totalPrice);

  const handleMinusItem = (id: string) => {
    const updatedStoreBookingData = updateStoreBookingData.map((item) => {
      if (item.id === id) {
        if (item.quantity !== undefined && item.quantity <= 1) {
          return {
            ...item,
          };
        }

        const originalItem = servicesBooked.find(
          (original) => original.id === id
        );
        if (originalItem) {
          const newTotalPrice = item.price - originalItem.price;

          return {
            ...item,
            // numberOfPerWeekDoPackage: newNumberOfPerWeekDoPackage,
            // weekNumberBooking:
            //   item.weekNumberBooking - originalItem.weekNumberBooking,
            price: newTotalPrice,
            quantity: item.quantity !== undefined ? item.quantity - 1 : 1,
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
        const originalItem = servicesBooked.find(
          (original) => original.id === id
        );
        if (originalItem) {
          // Increment the value of numberOfPerWeekDoPackage and totalPrice based on the original item

          const newTotalPrice = item.price + originalItem.price;

          return {
            ...item,
            // numberOfPerWeekDoPackage: newNumberOfPerWeekDoPackage,
            // weekNumberBooking:
            //   item.weekNumberBooking + originalItem.weekNumberBooking,
            price: newTotalPrice,
            quantity: item.quantity !== undefined ? item.quantity + 1 : 1,
          };
        }
      }
      return item;
    });

    setUpdateStoreBookingData(updatedStoreBookingData);
  };

  const totalPriceOfPackage = useMemo(() => {
    return updateStoreBookingData.reduce((total, price) => {
      return total + price.price;
    }, 0);
  }, [updateStoreBookingData]);

  // console.log(totalPriceOfPackage);

  // if (servicesBooked.length === 0) {
  //   return (
  //     <ClientOnly>
  //       <EmptyState
  //         title="Your cart is empty"
  //         subtitle="Let turn back and add some product you want our serve"
  //         showReset
  //         booking
  //       />
  //     </ClientOnly>
  //   );
  // }

  // console.log(updateStoreBookingData);

  if (isCartEmpty) {
    return <div></div>;
  }

  return (
    <>
      {updateStoreBookingData.length !== 0 && (
        <div className="pt-10">
          <hr className="mb-8" />
          <Heading title="Your Services you booked!" center />
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
                <div className="text-lg font-semibold">{item.serviceName}</div>
                <div className="font-light text-gray-600">
                  {/* {formatDays(item.dayDoInWeek)} */}
                  test
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center gap-1">
              <span>Original Price: </span>
              <del className="font-light text-[#ed9080]">
                {item.originalPrice.toFixed(2)}
              </del>{" "}
              <span>₫/{item.unit}</span>
            </div>

            <div key={item.id}>
              Price:{" "}
              {servicesBooked
                .find((priceInitial) => priceInitial.id === item.id)
                ?.price.toFixed(2)}
              ₫/{item.unit}
            </div>
            <div className="flex items-center gap-5">
              <div
                // onClick={() => handleMinusItem(item.id)}
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
              {item.quantity}
              <div
                // onClick={() => handlePlusItem(item.id)}
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
              Price: {item.price.toFixed(2)} ₫
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

      {/* <div
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
        <div className="container mx-auto flex items-center justify-end gap-40 mr-80">
        

          <div className="flex items-center gap-2 text-lg">
            Total payment:
            <p className="text-[#ff6347] font-semibold">{totalPrice}</p>
          </div>

          <PaymentSelect
            onChange={(value) => setCustomValue("paymentMethodId", value)}
            paymentMethod={paymentMethods}
          />

          <div
            onClick={validateSubmit}
            className={`
                mr-20
                cursor-pointer
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
                hover:bg-[#f34728]
                hover:shadow-lg
                ${disabled ? "opacity-75 pointer-events-none" : ""}

            
            `}
          >
            <MdOutlinePayment size={30} />
            Payment
          </div>
        </div>
      </div> */}
    </>
  );
};

export default memo(ServicesCart);
