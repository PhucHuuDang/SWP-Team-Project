"use client";

import { DetailsProps } from "@/app/types";
import Button from "../Button";
import useAssignModal from "@/app/hooks/useAssignModal";
import { useCallback, memo } from "react";

interface AssignTaskListingProps {
  dataBookingDetail: DetailsProps;
  //   dataStaffs: any;
  openAssignModal: (bookingDetailId: string) => void;
}

const AssignTaskListing: React.FC<AssignTaskListingProps> = ({
  dataBookingDetail,
  //   dataStaffs,
  openAssignModal,
}) => {
  //   const assignModal = useAssignModal();

  const handleOpenAssignModal = useCallback(() => {
    openAssignModal(dataBookingDetail.serviceId);
  }, [dataBookingDetail, openAssignModal]);

  //   console.log(dataBookingDetail);

  return (
    <div
      className="
            col-span-1
            gap-5
            group
            "
    >
      <div
        className="
                flex
                flex-col
                gap-3
                w-full
                p-4
                rounded-xl
                cursor-pointer
                border-[1px]
                hover:scale-105
                hover:shadow-lg
                duration-200
    
            "
      >
        <div
          className="
                bg-red-599
                text-center
                min-h-[130px]
                flex-wrap
                pr-4
                text-xl
                font-semibold"
        >
          {dataBookingDetail.bookingDetailTittle}
        </div>
        <div>
          Working term:{" "}
          <span className="font-bold text-green-500">
            {dataBookingDetail.timeDoService}
          </span>
        </div>
        <div>
          StartDateDoService:{" "}
          <span className="font-bold text-green-500">
            {dataBookingDetail.startDateDoService}
          </span>
        </div>
        <div>
          EndDateDoService:{" "}
          <span className="font-bold text-green-500">
            {dataBookingDetail.endDateDoService}
          </span>
        </div>

        {/* <div className="flex items-center">
              <div className="w-[100px] text-center">
                <Button label="Assign" onClick={() => {}} />
              </div>
            </div> */}
        <Button label="Assign" onClick={handleOpenAssignModal} />
      </div>
    </div>
  );
};

export default memo(AssignTaskListing);
