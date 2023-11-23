"use client";

import { toast } from "react-hot-toast";
import { BsCartCheck } from "react-icons/bs";

import { useRouter } from "next/navigation";
import { memo, useCallback, useEffect, useState } from "react";

import { PackageProps, ServiceProp } from "@/app/types";

import Image from "next/image";
import Button from "../Button";
import { IconType } from "react-icons";
import useUpdateComboModal from "@/app/hooks/useUpdateComboModal";
import useUpdateServiceModal from "@/app/hooks/useUpdateServiceModal";

interface ListingCardProps {
  onAction?: (id: string) => void;
  serviceId?: string;
  categoryId?: string;
  actionLabel?: string;
  disabled?: boolean;
  data?: ServiceProp | undefined;
  packageData?: PackageProps;
  actionId?: string;
  combo?: boolean;
  comboBooking?: boolean;
  openModalDeleteProperties?: (
    id: string,
    serviceName: string,
    createdBy: string
  ) => void;
  serviceName?: string;
  createdBy?: string;

  handleBookingService?: (
    e: React.MouseEvent<HTMLButtonElement>,
    value: ServiceProp
  ) => void;
  icon?: IconType;
  dataUpdateFunc?: (packageData: PackageProps) => void;
  dataUpdateServiceFunc?: (serviceData: ServiceProp) => void;
  service?: boolean;
  comboDiscount?: boolean;
  serviceDiscount?: boolean;
}

const ListingCard: React.FC<ListingCardProps> = ({
  onAction,
  actionLabel,
  disabled,
  serviceId,
  categoryId,
  combo,
  comboBooking,
  actionId = "",
  data,
  packageData,
  createdBy = "",
  serviceName = "",
  openModalDeleteProperties,
  handleBookingService,
  icon: Icon,
  dataUpdateFunc,
  dataUpdateServiceFunc,
  service,
  comboDiscount,
  serviceDiscount,
}) => {
  const router = useRouter();
  const updateComboModal = useUpdateComboModal();

  const updateServiceModal = useUpdateServiceModal();

  // const [servicesBooked, setServicesBooked] = useState<ServiceProp[]>([]);

  const routerListing = useCallback(() => {
    packageData
      ? router.push(`/listingsCombo/${packageData.id}`)
      : // console.log(packageData.id)
        // router.push(`/listingsCombo`)
        router.push(`/listings/${data?.id}`);
  }, [router, packageData, data]);

  // console.log(data?.isDelete);

  // console.log(packageData);

  // console.log(data);

  const MAX_LENGTH = 54;

  const handleCancel = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      if (disabled) {
        return;
      }

      onAction?.(actionId);
    },
    [actionId, disabled, onAction]
  );

  const handleOpenDeleteProperties = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      if (disabled) {
        return;
      }
      openModalDeleteProperties?.(actionId, serviceName, createdBy);
    },
    [openModalDeleteProperties, actionId, disabled, serviceName, createdBy]
  );

  const openUpdateModal = useCallback(
    (
      e: React.MouseEvent<SVGElement>,
      actionId: string,
      packageData: any,
      data: any
    ) => {
      e.stopPropagation();
      // console.log(actionId);
      // console.log(packageData);
      // combo
      //   ? dataUpdateFunc?.(packageData) && updateComboModal.onOpen()
      //   : dataUpdateServiceFunc?.(data) && updateServiceModal.onOpen();
      if (combo) {
        dataUpdateFunc?.(packageData);
        updateComboModal.onOpen();
      } else {
        dataUpdateServiceFunc?.(data);
        updateServiceModal.onOpen();
      }
    },
    [
      updateComboModal,
      dataUpdateFunc,
      dataUpdateServiceFunc,
      updateServiceModal,
      combo,
    ]
  );

  // const formatDays = (days: string[]) => {
  //   return days
  //     .map((day, index) => {
  //       if (index < days.length - 1) {
  //         return day + " ";
  //       }
  //       return day;
  //     })
  //     .join(", ");
  // };

  const formattedPrice = (price: number): string => {
    return numeral(price).format("0,0 ₫");
  };

  return (
    <div
      // onClick={() => console.log(data.id)}
      // onClick={() => router.push(`/listings/${data.id}`)}
      onClick={routerListing}
      className="
          col-span-1 
          cursor-pointer 
          group
      
      "
    >
      <div
        className={`
              flex
              flex-col
              gap-2
              w-full
            ${
              combo || service || comboDiscount || serviceDiscount
                ? "relative"
                : ""
            }
      `}
      >
        {combo || service ? (
          Icon && (
            <Icon
              onClick={(e) => openUpdateModal(e, actionId, packageData, data)}
              size={32}
              className="
                absolute
                right-0
                top-0
                z-10
                p-1
                bg-white
                rounded-lg
                hover:bg-neutral-300
                opacity-70
                transition
                duration-200

                "
            />
          )
        ) : comboDiscount ? (
          <div
            className="
                          absolute
                          top-0
                          right-0
                          m-0
                          p-2
                          bg-[#489bee]
                          text-white
                          rounded-bl-xl
                          font-bold
                          text-xs
                          z-20
                          flex  
                          items-center
                          gap-1
                        "
          >
            <span>Sale</span>
            <span>
              {packageData?.discountPercent !== undefined
                ? `-${packageData?.discountPercent}%`
                : "-0%"}
            </span>
          </div>
        ) : (
          <div
            className="
                          absolute
                          top-0
                          right-0
                          m-0
                          p-2
                          bg-[#489bee]
                          text-white
                          rounded-bl-xl
                          font-semibold
                          text-xs
                          z-20
                          flex  
                          items-center
                          gap-1
                        "
          >
            <span>Sale</span>
            <span>
              {data?.discountPercent !== undefined
                ? `-${data?.discountPercent}%`
                : "-0%"}
            </span>
          </div>
        )}
        <div
          className="
                aspect-square 
                w-full 
                relative 
                overflow-hidden 
                rounded-xl"
        >
          <Image
            fill
            alt="Listing"
            src={
              packageData
                ? (packageData.image as string)
                : (data?.image as string) ?? "/images/Image_not_available.png"
            }
            className="
              object-cover
              h-full
              w-full
              group-hover:scale-110
              transition
          "
          />

          {/* can add here the icon cart or not */}
        </div>
        {/* name of services */}

        {packageData ? (
          <div className="font-semibold text-lg min-h-[56px]">
            {packageData?.packageName}
          </div>
        ) : (
          <div className="font-semibold text-lg min-h-[56px]">
            {data?.serviceName}
          </div>
        )}

        {packageData ? (
          <div className="font-light text-neutral-500 h-[65px]">
            {packageData.packageDescription.length > MAX_LENGTH
              ? packageData.packageDescription.slice(0, MAX_LENGTH) + "..."
              : packageData.packageDescription}
          </div>
        ) : (
          <div className="font-light text-neutral-500 h-[65px]">
            {data?.serviceDescription &&
            data.serviceDescription.length > MAX_LENGTH
              ? data.serviceDescription.slice(0, MAX_LENGTH) + "..."
              : data?.serviceDescription}
          </div>
        )}

        {packageData ? (
          <div className="flex text-md flex-row items-center gap-4">
            <div className="flex flex-row items-center gap-2">
              <del className="font-light text-[#ed9080]">
                {packageData.totalOriginalPrice.toFixed(3)}
              </del>{" "}
              <span>₫</span>
            </div>

            <h1
              className="
              font-semibold
              text-neutral-500
              text-xl
              ml-2
              mr-2
            "
            >
              |
            </h1>

            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-[#ff6347] ">
                {packageData.totalPrice.toFixed(3)}
              </span>{" "}
              <span>₫</span>
            </div>
          </div>
        ) : (
          <div className="flex flex-row text-md items-center gap-4 mt-3">
            <div className="flex flex-row items-center gap-2">
              <del className="font-light text-[#ed9080]">
                {formattedPrice(data?.price ?? 0)}
              </del>{" "}
              <span>₫</span>
            </div>

            <h1
              className="
              font-semibold
              text-neutral-500
              text-xl
              ml-2
              mr-2
            "
            >
              |
            </h1>

            <div className="flex flex-row items-center gap-2">
              <span className="font-light text-[#ff6347] ">
                {data?.price.toFixed(3)}
              </span>{" "}
              <span>₫</span>
            </div>
          </div>
        )}

        {onAction && actionLabel && (
          <Button
            label={actionLabel}
            disabled={disabled}
            small
            onClick={handleCancel}
          />
        )}
        {openModalDeleteProperties && actionLabel && (
          <Button
            label={actionLabel}
            disabled={disabled}
            small
            onClick={handleOpenDeleteProperties}
          />
        )}
        {comboBooking && actionLabel && (
          <Button
            label={actionLabel}
            disabled={disabled}
            onClick={(e) => handleBookingService?.(e, data as any)}
          />
        )}
      </div>
    </div>
  );
};

export default memo(ListingCard);
