export default async function getNumberAccountStudent() {
  const response = await fetch(
    // "http://13.210.56.232/api/v1/students/gettotalstudentregistered",
    "https://housevn.azurewebsites.net/api/v1/students/gettotalstudentregistered",
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch api Staffs");
  }

  const totalNumber = await response.json();

  return totalNumber;
}
