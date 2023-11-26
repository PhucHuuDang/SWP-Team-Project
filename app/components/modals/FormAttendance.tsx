"use client";

import { memo, use, useCallback, useEffect, useMemo, useState } from "react";
import { IoMdClose } from "react-icons/io";
import Button from "../Button";
import Image from "next/image";
import { ReviewFeedbackProps, ServiceOfBookingDetails } from "@/app/types";
import ClientOnly from "../ClientOnly";
import EmptyState from "../EmptyState";
import { Rate } from "antd";
import TimeSelect from "../inputs/TimeSelect";
// import { DatePicker, DateTimePicker } from "@mantine/dates";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import FormAttendanceSelect from "../inputs/FormAttendanceSelect";
import { set } from "date-fns";
import Input from "../inputs/Input";
import ServicesFormSelect from "../inputs/ServicesFormSelect";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import { format } from "date-fns-tz";

interface FormAttendanceProps {
  isOpen?: boolean;
  disabled?: boolean;
  onClose: () => void;
  servicesOfBookingDetails: ServiceOfBookingDetails[];
  serviceId: string;
}

const FormAttendance: React.FC<FormAttendanceProps> = ({
  isOpen,
  disabled,
  servicesOfBookingDetails,
  onClose,
  serviceId,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date | string>("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [selectTypeOfBookingDetail, setSelectTypeOfBookingDetail] =
    useState("");
  const [selectRemainingTaskDuration, setSelectRemainingTaskDuration] =
    useState(0);

  const [bookingDetailOptions, setBookingDetailOptions] = useState<any[]>([]);

  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  // console.log(typeof serviceId);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      serviceId: serviceId,
      frequencyDaysPerOccurrence: 0,
      dateDoService: selectedDate,
      workingCycle: 0,
      bookingDetailId: "",
      bookingDetailType: "",
      quantityDoService: 1,
      note: "",
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const frequencyDaysPerOccurrence = watch("frequencyDaysPerOccurrence");
  const quantityDoService = watch("quantityDoService");
  // console.log(frequencyDaysPerOccurrence);

  const frequencyOptions = [
    { value: 1, label: "1 day" },
    { value: 2, label: "2 days" },
    { value: 3, label: "3 days" },
    { value: 4, label: "4 days" },
    { value: 5, label: "5 days" },
    { value: 6, label: "6 days" },
    { value: 7, label: "7 days" },
  ];

  const workingCycleOptions = [
    { value: 1, label: "1 day" },
    { value: 7, label: "7 days" },
    { value: 14, label: "2 weeks" },
    { value: 21, label: "3 weeks" },
    { value: 30, label: "1 month" },
  ];

  const bookingDetailOptionsTest = useMemo(() => {
    const data =
      servicesOfBookingDetails &&
      servicesOfBookingDetails
        .filter((item) => item.serviceId === serviceId)
        .map((item) =>
          item.bookingDetailThatServiceIsBelongTo.map((value) => ({
            value: value.bookingDetailId,
            label: value.bookingDetailName,
            type: value.bookingDetailType,
            remainingTaskDuration: value.remainingTaskDuration,
          }))
        );

    return setBookingDetailOptions(data);
  }, [serviceId, servicesOfBookingDetails]);

  // console.log(bookingDetailOptions);
  // console.log(bookingDetailOptionsTest);

  useEffect(() => {
    setValue("serviceId", serviceId);
    setValue("bookingDetailType", selectTypeOfBookingDetail);
    setValue("dateDoService", selectedDate);
  }, [setValue, selectTypeOfBookingDetail, serviceId, selectedDate]);

  // console.log(bookingDetailOptions);

  const handleClose = useCallback(() => {
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const onSubmit = useCallback<SubmitHandler<FieldValues>>(
    async (data) => {
      setIsLoading(true);
      // console.log(data);

      axios
        .post("/api/attendanceReport", data)

        .then(() => {
          toast.success("Create attendance successfully!");
          router.refresh();
          reset();
          onClose();
        })
        .catch((err) => {
          toast.error("Create attendance failed!");
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [onClose, reset, router]
  );

  const validateSubmit = useCallback(async () => {
    if (
      quantityDoService < 1 ||
      quantityDoService > selectRemainingTaskDuration
    ) {
      return toast.error("Please enter with the number of your services!");
      //   return;
    } else {
      try {
        await handleSubmit(onSubmit)();
      } catch (error) {
        toast.error("have something went wrong with submit");
      }
    }
  }, [handleSubmit, quantityDoService, selectRemainingTaskDuration, onSubmit]);

  // const isValid = isDateValid() && isTimeValid();

  // console.log(isValid);
  const handleDateChange = (value: any) => {
    const selectedDate = value.$d;
    const selectedHours = value.$H;
    const selectedMinutes = value.$m;
    const javascriptDate = value.$d;

    const timeZone = "Asia/Ho_Chi_Minh";
    const formattedDateAndTime = format(
      javascriptDate,
      "yyyy-MM-dd'T'HH:mm:ssXXX",
      { timeZone }
    );
    // const { parseISO, format } = require("date-fns-tz");

    // const clientDateString = "2023-12-01T12:34:56.789Z";
    // const serverDate = parseISO(clientDateString);
    // const formattedDate = format(serverDate, "yyyy-MM-dd HH:mm:ssXXX", {
    //   timeZone: "Asia/Ho_Chi_Minh",
    // });

    console.log(formattedDateAndTime);

    setSelectedDate(formattedDateAndTime);
  };

  if (!isOpen) {
    return null;
  }

  //   console.log(reviewFeedback);

  return (
    <>
      <div
        className="
            fixed 
            inset-0 
            z-50 
            flex
            items-center
            justify-center
            overflow-x-hidden
            overflow-y-hidden
            bg-neutral-800/70
            bg-opacity-10
            focus:outline-none"
      >
        <div
          className="
            relative 
            my-6 
            w-[80%] 
            opacity-1 
            md:h-auto 
            md:w-3/4 
            lg:h-auto 
            lg:w-[80%]
            xl:w-[80%]
            

            "
        >
          <div
            className={`
            translate
            h-full
            bg-white
            rounded-xl 
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
            duration-300
            
            `}
          >
            <button
              onClick={onClose}
              className="
                relative
                flex
                justify-end
                rounded-lg
                items-end
                left-[90%]
                p-3
                cursor-pointer 
                hover:opacity-70
                hover:bg-neutral-200
                hover:shadow-lg
                top-5
                duration-150 
                
                "
            >
              <IoMdClose size={18} className="cursor-pointer" />
            </button>
            <div
              className="
                    translate
                    mt-2
                    flex
                    h-full
                    translate-y-0
                    flex-col
                    gap-2
                    p-4
                    opacity-100
                    duration-300

                    max-h-[60vh]

                    overflow-y-scroll 

                    
                    "
            >
              <div
                className="
                text-center
                text-2xl
                font-semibold
                text-neutral-600
                
                "
              >
                Create Form Attendance
              </div>
              <div className="flex flex-row gap-16 p-4">
                <div className="flex flex-col gap-10">
                  <div className="flex flex-row items-center justify-center gap-6">
                    <span className="font-bold text-lg min-w-[210px]">
                      Date & Time do service:
                    </span>
                    {/* <div> */}
                    {
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={["DateTimePicker"]}>
                          <DateTimePicker
                            label="Choose day & time do service"
                            value={selectedDate}
                            onChange={handleDateChange}
                            className="w-[300px]"
                          />
                          {/* <DateTimePicker
                            label="Basic date time picker"
                            onChange={handleDateChange}
                            // Disable the DateTimePicker if the date or time is not valid
                            disabled={!isValid}
                          /> */}
                        </DemoContainer>
                      </LocalizationProvider>
                    }
                    {/* </div> */}
                  </div>

                  <div className="flex flex-row items-center justify-center gap-6">
                    <span className="font-bold text-lg min-w-[210px]">
                      Working frequency:
                    </span>
                    <div>
                      {
                        <FormAttendanceSelect
                          options={frequencyOptions}
                          title="Choose working frequency"
                          onChange={(value) =>
                            setCustomValue("frequencyDaysPerOccurrence", value)
                          }
                        />
                      }
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-6">
                    <span className="font-bold text-lg min-w-[210px]">
                      working cycle:
                    </span>
                    <div>
                      {
                        <FormAttendanceSelect
                          options={workingCycleOptions}
                          title="Choose working cycle"
                          onChange={(value) =>
                            setCustomValue("workingCycle", value)
                          }
                        />
                      }
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-6">
                    <span className="font-bold text-lg min-w-[210px]">
                      Your services:
                    </span>
                    <div>
                      {/* {
                        <ServicesFormSelect
                          options={bookingDetailOptions}
                          title="Choose your services"
                          onChange={(value) =>
                            setCustomValue("bookingDetailId", value)
                          }
                        />
                      } */}
                      {bookingDetailOptions &&
                        bookingDetailOptions.length > 0 && (
                          <ServicesFormSelect
                            options={bookingDetailOptions[0]} // Assuming bookingDetailOptions is an array
                            title="Choose your services"
                            onChange={(value) =>
                              setCustomValue("bookingDetailId", value)
                            }
                            setSelectTypeOfBookingDetail={
                              setSelectTypeOfBookingDetail
                            }
                            setSelectRemainingTaskDuration={
                              setSelectRemainingTaskDuration
                            }
                          />
                        )}
                    </div>
                  </div>

                  <div className="flex flex-row items-center justify-center gap-6">
                    <span className="font-bold text-lg min-w-[210px]">
                      Number of services
                    </span>
                    <div className="w-[300px]">
                      {
                        <Input
                          id="quantityDoService"
                          type="number"
                          disabled={isLoading}
                          errors={
                            errors ||
                            quantityDoService < 1 ||
                            quantityDoService > selectRemainingTaskDuration
                          }
                          label="Choose quantity to do services"
                          required
                          register={register}
                        />
                      }
                      <p className="mt-1 font-light text-neutral-400">
                        You have number of services:{" "}
                        <span className="text-[#ff6347] font-semibold">
                          {selectRemainingTaskDuration}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-10">
                  <div className="flex flex-col items-center justify-center gap-6">
                    <span className="font-bold text-lg">
                      Note something for us:
                    </span>
                    {/* <div>{<TimeSelect />}</div> */}
                    <div className="relative ">
                      <textarea
                        id="message"
                        {...register("note", { required: true })}
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
                              h-[250px]

                              ${
                                errors["note"]
                                  ? "border-rose-500"
                                  : "border-neutral-300"
                              }
                              ${
                                errors["note"]
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
                              ${
                                errors["note"]
                                  ? "text-rose-500"
                                  : "text-zinc-400"
                              }
                        `}
                      >
                        Your note...
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div className="relative text-center flex justify-center items-center mt-5 ">
                <div
                  onClick={validateSubmit}
                  className={`
                  text-2xl
                  w-[200px]
                  p-3
                  font-bold
                  text-neutral-600
                  rounded-lg
                  duration-200
                  
                  ${
                    isLoading
                      ? "disabled opacity-40 cursor-not-allowed text-neutral-700"
                      : "hover:scale-125 cursor-pointer text-neutral-800"
                  }
                  
                  `}
                >
                  Create
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(FormAttendance);
