"use client";

import Container from "@/app/components/Container";
import CartListing from "@/app/components/listings/CartListing";
import ListingHead from "@/app/components/listings/ListingHead";
import ListingServiceName from "@/app/components/listings/ListingServiceName";
import { PackageProps, getServicesInAPackage } from "@/app/types";
import { useBooking } from "@/providers/BookingProvider";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { BsCartCheck } from "react-icons/bs";

import EmptyState from "@/app/components/EmptyState";
import ClientOnly from "@/app/components/ClientOnly";
import useStoreBooking from "@/app/hooks/useStoreBooking";
import Heading from "@/app/components/Heading";

interface ListingsComboClientProps {
  data: getServicesInAPackage;
}

const ListingComboClient: React.FC<ListingsComboClientProps> = ({ data }) => {
  // const [dataBooking, setDataBooking] = useState<PackageProps[]>([]);
  const [dataBooking, setDataBooking] = useState<PackageProps[]>([]);
  const { storeBookingData, setStoreBookingData } = useBooking();

  const useStoreBookingShow = useStoreBooking();

  const numberOfServices = data.listServiceData.length;

  // console.log(numberOfServices);
  // console.log(data.listServiceData);

  // const handleBooking = () => {
  //   // if (dataBooking.includes(data.packageData)) {
  //   //   dataBooking.filter((item) => {
  //   //     const removed =
  //   //       item.id === data.packageData.id
  //   //         ? { ...dataBooking, ...data.packageData }
  //   //         : { dataBooking };

  //   //     setDataBooking([...removed]);
  //   //   });
  //   // } else {
  //   // }
  //   // setDataBooking((value) => [data.packageData, ...value]);
  //   // if (!dataBooking.some((item) => item.id === data.packageData.id)) {
  //   if (dataBooking?.id !== data.packageData.id) {
  //     setDataBooking(data.packageData);
  //   }

  //   // }
  //   // setDataBooking([...dataBooking, data.packageData]);
  // };

  const handleBooking = (item: PackageProps) => {
    // if (storeBookingData.some((cartItem) => (cartItem.id = item.id))) {
    //   toast("This item already exist in your cart", {
    //     icon: <BsCartCheck size={18} />,
    //   });
    // }

    if (!storeBookingData.some((cartItem) => cartItem.id === item.id)) {
      // setDataBooking([item, ...dataBooking]);
      setStoreBookingData([item, ...storeBookingData]);
      toast.success("Booking successful!");
    } else {
      toast("This item already exist in your cart", {
        icon: <BsCartCheck size={22} />,
      });
    }
  };

  return (
    <Container>
      <div className="max-w-screen-lg mx-auto pt-24">
        <div className="flex flex-col gap-6">
          <ListingHead
            title={data.packageData.packageName}
            // imageSrc={data.packageData.image}
            // imageSrc="/images/glamping.webp"
            subtitle="The listing detail of page"
            imageSrc={data.packageData.image}
            id={data.packageData.id}
          />

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              md:gap-12
              mt-6
          "
          >
            <div className="text-lg font-light">
              {data.packageData.packageDescription}
            </div>

            <div
              className={`
                flex
                flex-row
                sm:justify-center
                ${
                  data.listServiceData.length === 2
                    ? "md:justify-start"
                    : "md:justify-between"
                }
                flex-wrap
                order-first
                gap-3
                mb-10
                md:order-last
                
            `}
            >
              {data.listServiceData.map((item) => {
                return (
                  <ListingServiceName
                    key={item.id}
                    serviceName={item.serviceName}
                    serviceId={item.id}
                  />
                );
              })}
            </div>
          </div>
          <div
            className="
            flex
            flex-row
            items-center
            justify-center
            ml-8
          "
          >
            <div
              // onClick={(e) => console.log(data.packageData)}
              onClick={() => handleBooking(data.packageData)}
              className="
                    
                    p-2
                    px-8
                    ml-36
                    rounded-md
                    cursor-pointer
                    bg-[#e87561]
                    hover:bg-[#ed6047]
                    shadow-md
                    transition

              "
            >
              Booking
            </div>
          </div>
          {/* </>
          )} */}
        </div>

        <hr className="mt-10 border-t-2 border-neutral-300" />

        <div className="flex flex-col gap-6 mt-10">
          <Heading
            title="Description of services that composed in the combo(package) "
            subtitle="The services that you can have when booking the combo(package)"
            center
          />

          {data.listServiceData.map((item) => {
            return (
              <div key={item.id} className="flex flex-col gap-8 justify-center">
                <ListingHead title={item.serviceName} imageSrc={item.image} />
                <div className="text-lg font-light text-center mb-14">
                  {item.serviceDescription}
                </div>
                <hr />
              </div>
            );
          })}
        </div>
      </div>

      {/* <button onClick={useStoreBookingShow.onClose}>Click</button> */}
    </Container>
  );
};

export default ListingComboClient;
