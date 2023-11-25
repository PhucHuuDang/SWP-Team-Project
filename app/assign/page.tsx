import ClientOnly from "../components/ClientOnly";
import Heading from "../components/Heading";
import getAllStaffs from "../components/actions/getAllStaffs";
import getBookingDetail from "../components/actions/getBookingDetail";
import getRoleUser from "../components/actions/getRoleUser";
import getStaffByServiceId from "../components/actions/getStaffByServiceId";
import { DetailsProps } from "../types";
import AssignTaskClient from "./AssignTaskClient";

const AssignPage = async () => {
  const getRole = await getRoleUser();
  const allBookingDetail = await getBookingDetail();
  //const dataStaffs = await getAllStaffs();

  const dataStaffs = await getStaffByServiceId(
    "f101c500-1092-44ac-bd8f-62668a4c8920"
  );

  //   console.log(adminName);

  return (
    <ClientOnly>
      <div className="pt-32">
        <Heading
          title="Assign Task"
          subtitle="The list package(combo) was booked by user, you can assign task for staff"
          center
        />
      </div>
      <AssignTaskClient
        dataStaffs={dataStaffs}
        dataBookingDetail={allBookingDetail}
        getRole={getRole}
      />

      {/* <div
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
        {allBookingDetail.map((item: DetailsProps) => {
          return (
            <>
              <AssignTaskClient key={item.id} dataBookingDetail={item} />
            </>
          );
        })}
      </div> */}
    </ClientOnly>
  );
};

export default AssignPage;
