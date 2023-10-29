import ClientOnly from "../components/ClientOnly";
import getApartmentByStuId from "../components/actions/getApartmentByStuId";
import getPaymentMethod from "../components/actions/getPaymentMethod";
import getRegions from "../components/actions/getRegions";
import getRoleUser from "../components/actions/getRoleUser";
import ApartmentModal from "../components/modals/ApartmentModal";
import CartClient from "./CartClient";

const CartPage = async () => {
  const regions = await getRegions();
  const getStudentId: any = await getRoleUser();
  const paymentMethods = await getPaymentMethod();

  //   console.log("getStudentId: ", getStudentId);

  //   if (!getStudentId && typeof window !== undefined) {
  //     localStorage.removeItem("cart");
  //   }

  const studentId = getStudentId ? getStudentId.userIdInTableDb : null;

  //   console.log("studentId: ", studentId);

  const getApartmentByStudentId = await getApartmentByStuId(studentId);

  //   console.log(getApartmentByStudentId);

  return (
    <ClientOnly>
      <div className="p-24 flex flex-col gap-5">
        <CartClient
          getApartmentByStudentId={getApartmentByStudentId}
          getStudentId={getStudentId}
          paymentMethods={paymentMethods}
        />
        <ApartmentModal regions={regions} />
      </div>
    </ClientOnly>
  );
};

export default CartPage;
