// import ClientOnly from "../components/ClientOnly";
// import Heading from "../components/Heading";
// import getBookingMoneyByOneYear from "../components/actions/getBookingMoneyByOneYear";
// import getRoleUser from "../components/actions/getRoleUser";
// import DashboardOrderClient from "./DashboardOrderClient";

// const DashboardOrderPage = async () => {
//   const getRole = await getRoleUser();
//   //   console.log(getRole);

//   const totalPriceOneDay = await getBookingMoneyByOneYear(
//     "11/1/2023",
//     "11/2/2023"
//   );
//   //   console.log(totalPriceOneDay);
//   const listBookingOneDay = totalPriceOneDay.bookings;
//   return (
//     <ClientOnly>
//       <div className="pt-32">
//         <Heading
//           title="Manage order booking from user"
//           subtitle="You can track the detail booking of user compose of package and revenue"
//           center
//         />
//       </div>
//       <DashboardOrderClient
//         getRole={getRole}
//         listBookingOneDay={listBookingOneDay}
//       />
//     </ClientOnly>
//   );
// };

// export default DashboardOrderPage;

import ClientOnly from "../components/ClientOnly";
import Heading from "../components/Heading";
import getBookingMoneyByOneYear from "../components/actions/getBookingMoneyByOneYear";
import getRoleUser from "../components/actions/getRoleUser";
import DashboardOrderClient from "./DashboardOrderClient";

const DashboardOrderPage = async () => {
  try {
    const [getRole, totalPriceOneDay] = await Promise.all([
      getRoleUser(),
      getBookingMoneyByOneYear("11/1/2023", "11/2/2023"),
    ]);

    const listBookingOneDay = totalPriceOneDay.bookings;

    return (
      <ClientOnly>
        <div className="pt-32">
          <Heading
            title="Manage order booking from user"
            subtitle="You can track the detail booking of user compose of package and revenue"
            center
          />
        </div>
        <DashboardOrderClient
          getRole={getRole}
          listBookingOneDay={listBookingOneDay}
        />
      </ClientOnly>
    );
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle or log the error as needed
    return (
      <ClientOnly>
        {/* Render an error state or message to display to the user */}
      </ClientOnly>
    );
  }
};

export default DashboardOrderPage;
