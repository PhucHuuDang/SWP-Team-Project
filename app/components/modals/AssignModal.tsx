"use client";

import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import Heading from "../Heading";
import CategoryInput from "../inputs/CategoryInput";
import useAssignModal from "@/app/hooks/useAssignModal";
import Modal from "./Modal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type StaffType = {
  staffData: {
    id: string;
    staffName: string;
    birthday: string;
    address: string;
    isDelete: boolean;
  };
};

interface AssignModalProps {
  dataStaffs: any;
  bookingDetailId: string;
  bookingDetailType: string;
  bookingDetailTittle: string;
}

const AssignModal: React.FC<AssignModalProps> = ({
  dataStaffs,
  bookingDetailId,
  bookingDetailType,
  bookingDetailTittle,
}) => {
  const assignModal = useAssignModal();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const assignBy = "Admin";

  // console.log("bookingDetailId: ", bookingDetailId);

  // console.log("bookingDetailIdProp: ", bookingDetailIdProp);
  // console.log(dataStaffs);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({
    defaultValues: {
      // bookingDetailId: bookingDetailId,
      staffId: "",
      assignBy: assignBy,
    },
  });

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  const staffId = watch("staffId");

  // console.log("staffId: ", staffId);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    data.bookingDetailId = bookingDetailId;
    data.bookingDetailType = bookingDetailType;
    data.bookingDetailTittle = bookingDetailTittle;
    // console.log(data);
    setIsLoading(true);

    axios
      .post("/api/bookingDetailStaff", data)
      .then(() => {
        toast.success("Assign success");
        router.refresh();
        reset();
        assignModal.onClose();
      })
      .catch(() => {
        toast.error("Assign failed, please check all field again");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setValue("bookingDetailId", bookingDetailId);
  }, [bookingDetailId, setValue]);

  const bodyContent = (
    <div className="flex flex-col gap-8">
      <Heading
        title="Assign tasks for staffs"
        subtitle="The list of staffs you can assign work for staff"
        center
      />

      <div
        className="
        grid
        grid-cols-1
        md:grid-cols-2
        gap-3
        max-h-[50vh]
        overflow-y-auto
        mt-4
      
      "
      >
        {dataStaffs.map((item: StaffType) => {
          // console.log(item);
          return (
            !item.staffData.isDelete && (
              <div key={item.staffData.id} className="col-span-1">
                <CategoryInput
                  onClick={(staffId) => setCustomValue("staffId", staffId)}
                  // icon={GiWashingMachine}
                  // icon={GiWashingMachine || item.image}
                  id={item.staffData.id}
                  selected={staffId === item.staffData.id}
                  label={item.staffData.staffName}
                />
              </div>
            )
          );
        })}
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={assignModal.isOpen}
      onClose={assignModal.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      disabled={isLoading}
      actionLabel="Assign"
      title="Assign work for staff"
    />
  );
};

export default AssignModal;
