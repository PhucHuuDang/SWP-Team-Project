import ClientOnly from "../components/ClientOnly";
import Heading from "../components/Heading";
import getAllStaffs from "../components/actions/getAllStaffs";
import getRoleUser from "../components/actions/getRoleUser";
import ManageStaffClient from "./ManageStaffClient";

const ManageStaffPage = async () => {
  const getAllStaffInfo = await getAllStaffs();
  const getRole = await getRoleUser();

  //   console.log(getAllStaffInfo);

  return (
    <ClientOnly>
      {/* <Heading title="Manage Staffs" /> */}
      <div className="pt-10">
        <ManageStaffClient staffsInfo={getAllStaffInfo} getRole={getRole} />
      </div>
    </ClientOnly>
  );
};

export default ManageStaffPage;
