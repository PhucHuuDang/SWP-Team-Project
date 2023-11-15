export default async function getPackages() {
  const getPackage = await fetch(
    "http://13.210.56.232/api/v1/packages/packages",
    {
      cache: "no-store",
    }
  );

  if (!getPackage.ok) {
    throw new Error("Failed to fetch data get packages");
  }

  const getPackageSuccess = await getPackage.json();

  return getPackageSuccess;
}
