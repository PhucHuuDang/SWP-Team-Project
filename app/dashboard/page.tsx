import ClientOnly from "../components/ClientOnly";
import getBookingMoneyByOneYear from "../components/actions/getBookingMoneyByOneYear";
import getNumberAccountStudent from "../components/actions/getNumberAccountStudent";
import getRoleUser from "../components/actions/getRoleUser";
import DashboardClient from "./DashboardClient";

const DashboardPage = async () => {
  const getRole = await getRoleUser();
  // console.log(getRole);
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
  };
  const endDate = new Date(); // Ngày hiện tại
  const startDate = new Date(endDate);
  startDate.setDate(endDate.getDate() - 6); // Lấy dữ liệu trong 7 ngày
  // Format ngày tháng để truyền vào API
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);
  const getChartData = await getBookingMoneyByOneYear(
    formattedStartDate,
    formattedEndDate
  );

  //
  const totalPriceOneYear = await getBookingMoneyByOneYear(
    "11/2/2022",
    "11/2/2023"
  );
  const totalPriceOneDay = await getBookingMoneyByOneYear(
    "11/1/2023",
    "11/2/2023"
  );
  const getNumber = await getNumberAccountStudent();
  //   Extract the numeric value from totalPrice objects
  const numericTotalPriceOneYear = totalPriceOneYear.totalPrice;
  const numericTotalPriceOneDay = totalPriceOneDay.totalPrice;
  const listBookingOneDay = totalPriceOneDay.bookings;
  return (
    <ClientOnly>
      <DashboardClient
        getNumber={getNumber}
        numericTotalPriceOneYear={numericTotalPriceOneYear}
        numericTotalPriceOneDay={numericTotalPriceOneDay}
        listBookingOneDay={listBookingOneDay}
        getChartData={getChartData}
        getRole={getRole}
      />
    </ClientOnly>
  );
};

export default DashboardPage;
