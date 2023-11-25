export default async function getStaffByServiceId(serId: string) {
  const response = await fetch(
    `https://housevn.azurewebsites.net/api/v1/staffs/serviceid?serviceid=${serId}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch data get services by id");
  }

  const getStaffByServiceIdSuccess = response.json();

  return getStaffByServiceIdSuccess;
}
