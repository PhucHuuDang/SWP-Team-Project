export default async function getAllStaffs() {
  const response = await fetch("http://13.210.56.232/api/v1/staffs/staffs", {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch api Staffs");
  }

  const staff = await response.json();

  return staff;
}
