import getAllStudents from "../components/actions/getAllStudents";
import getRoleUser from "../components/actions/getRoleUser";
import getServiceById from "../components/actions/getServiceById";

import ClientOnly from "../components/ClientOnly";
import Container from "../components/Container";
import Heading from "../components/Heading";
import ManageUserClient from "./ManageUserClient";

const ManageUserPage = async () => {
  const getAllStudentsInfo = await getAllStudents();
  const getRole = await getRoleUser();

  // console.log(getAllStudentsInfo);
  return (
    <ClientOnly>
      {/* <Heading title="Manage Users" /> */}
      <div className="pt-10">
        <ManageUserClient studentsInfo={getAllStudentsInfo} getRole={getRole} />
      </div>
    </ClientOnly>
  );
};

export default ManageUserPage;
