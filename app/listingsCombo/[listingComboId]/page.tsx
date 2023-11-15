import getServicesInPackageId from "@/app/components/actions/getServicesInPackageById";
import ClientOnly from "../../components/ClientOnly";
import Container from "../../components/Container";
import ListingComboClient from "./ListingComboClient";
import EmptyState from "@/app/components/EmptyState";

type Params = {
  params: {
    listingComboId: string;
  };
};

const ListingsComboPage = async ({ params: { listingComboId } }: Params) => {
  const getServicesInAPackage = await getServicesInPackageId(listingComboId);

  if (getServicesInAPackage.length === 0) {
    return (
      <EmptyState
        title="The Combo has no any service"
        subtitle="Please back to another combo"
      />
    );
  }

  return (
    <ClientOnly>
      <ListingComboClient data={getServicesInAPackage} />
    </ClientOnly>
  );
};

export default ListingsComboPage;
