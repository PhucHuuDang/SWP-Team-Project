"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "../components/Button";
import ClientOnly from "../components/ClientOnly";
import Heading from "../components/Heading";
import AssignTaskListing from "../components/listings/AssignTaskListing";
import AssignModal from "../components/modals/AssignModal";
import { DetailsProps } from "../types";
import useAssignModal from "../hooks/useAssignModal";
import EmptyState from "../components/EmptyState";
import { useRouter } from "next/navigation";

interface AssignTaskClientProps {
  dataBookingDetail: DetailsProps[];
  dataStaffs: any;
  getRole: any | null;
}

const AssignTaskClient: React.FC<AssignTaskClientProps> = ({
  dataBookingDetail,
  dataStaffs,
  getRole,
}) => {
  const [bookingDetailId, setBookingDetailId] = useState("");
  const assignModal = useAssignModal();
  const router = useRouter();

  const openAssignModal = useCallback(
    (id: string) => {
      setBookingDetailId(id);
      assignModal.onOpen();
    },
    [assignModal]
  );

  console.log("bookingDetailId: ", bookingDetailId);

  useEffect(() => {
    if (getRole && getRole.role !== "Admin") {
      router.push("/");
      // console.log(getRole);
    }
  }, [router, getRole]);

  if (getRole && getRole.role !== "Admin") {
    // console.log("first");
    return (
      <ClientOnly>
        <EmptyState
          title="You are not authorized to access"
          subtitle="Redirect to your page"
        />
      </ClientOnly>
    );
  }

  return (
    // <div
    //   className="
    //     col-span-1
    //     gap-5
    //     group
    //     "
    // >
    //   <div
    //     className="
    //         flex
    //         flex-col
    //         gap-3
    //         w-full
    //         p-4
    //         rounded-xl
    //         cursor-pointer
    //         border-[1px]
    //         hover:scale-105
    //         hover:shadow-lg
    //         duration-200

    //     "
    //   >
    //     <div
    //       className="
    //         bg-red-599
    //         text-center
    //         min-h-[130px]
    //         flex-wrap
    //         pr-4
    //         text-xl
    //         font-semibold"
    //     >
    //       {dataBookingDetail.bookingDetailName}
    //     </div>
    //     <div>
    //       Working term:{" "}
    //       <span className="font-bold text-green-500">
    //         {dataBookingDetail.remainingTaskDuration}
    //       </span>
    //     </div>
    //     <div>
    //       Quantity package:{" "}
    //       <span className="font-bold text-green-500">
    //         {dataBookingDetail.quantityOfPackageOrdered}
    //       </span>
    //     </div>
    //     <div>
    //       Total price quantity:{" "}
    //       <span className="font-bold text-green-500">
    //         {dataBookingDetail.totalPriceQtity}$
    //       </span>
    //     </div>

    //     <Button label="Assign" onClick={() => {}} />
    //   </div>
    // </div>
    <ClientOnly>
      <div
        className="
                 p-20
                 grid
                 gird-cols-1
                 sm:grid-cols-2
                 md:grid-cols-3
                 lg:grid-cols-4
                 xl:grid-cols-5
                 2xl:grid-cols-6
                 gap-8
        
        "
      >
        {dataBookingDetail.map((item: DetailsProps) => {
          return (
            <AssignTaskListing
              // dataStaffs={dataStaffs}
              key={item.serviceId}
              dataBookingDetail={item}
              openAssignModal={openAssignModal}
            />
          );
        })}
      </div>
      <AssignModal dataStaffs={dataStaffs} bookingDetailId={bookingDetailId} />
      {/* <AssignTaskListing /> */}
    </ClientOnly>
  );
};

export default AssignTaskClient;
