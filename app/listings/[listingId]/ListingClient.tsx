"use client";

import { ServiceProp } from "@/app/types";
import Container from "../../components/Container";
import ListingHead from "../../components/listings/ListingHead";
import ListingInfo from "@/app/components/listings/ListingInfo";
import numeral from "numeral";

interface ListingClientProps {
  listingServiceById: ServiceProp;
}

const ListingClient: React.FC<ListingClientProps> = ({
  listingServiceById,
}) => {
  // console.log("listingServiceById: ", listingServiceById);

  const formattedPrice = (price: number): string => {
    return numeral(price).format("0,0 ₫");
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pt-24">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={listingServiceById.serviceName}
            imageSrc={listingServiceById.image}
            id={listingServiceById.id}
            subtitle="Some detail about the service"
          />

          {/* <div
            className="
              grid
              grid-cols-1
              md:grid-cols-7
              md:gap-10
              mt-6
          "
          > */}
          <ListingInfo
            createdBy={listingServiceById.createBy}
            serviceDescription={listingServiceById.serviceDescription}
            price={Number(formattedPrice(listingServiceById.price))}
          />
          {/* </div> */}
        </div>
      </div>
    </Container>
  );
};

export default ListingClient;
