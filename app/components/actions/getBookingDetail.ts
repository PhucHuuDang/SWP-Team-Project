// http://3.27.132.94/api/v1/bookingdetail
export default async function getBookingDetail() {
  // const getData = await fetch("http://13.210.56.232/api/v1/bookingdetail", {
  const getData = await fetch(
    "https://housevn.azurewebsites.net/api/v1/bookings/attendsdonotassignbefore",
    {
      cache: "no-store",
    }
  );

  if (!getData.ok) {
    throw new Error("Failed to get data booking detail");
  }

  const getDataBookingDetail = getData.json();

  return getDataBookingDetail;
}
