"use client";

import React, { memo, useEffect } from "react";
import { FaShoppingBag } from "react-icons/fa";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useRouter } from "next/navigation";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";

type ListingBookingOneDayProps = {
  id: string;
  studentName: string;
  totalPay: number;
  apartmentId: string;
  apartmentData: any;
  statusContract: string;
  created: string;
};

interface DashboardOrderClientProps {
  listBookingOneDay: ListingBookingOneDayProps[];
  getRole: any | null;
}
const DashboardOrderClient: React.FC<DashboardOrderClientProps> = ({
  listBookingOneDay,
  getRole,
}) => {
  // console.log(listBookingOneDay);
  const router = useRouter();
  useEffect(() => {
    if (getRole && getRole.role !== "Admin") {
      router.push("/");
      // console.log(getRole);
    }
  }, [router, getRole]);

  if (getRole && getRole.role !== "Admin") {
    // console.log("first");
    return (
      <ClientOnly>
        <EmptyState
          title="You are not authorized to access"
          subtitle="Redirect to your page"
        />
      </ClientOnly>
    );
  }

  return (
    <div className="p-20">
      <div
        className="
              w-full
              m-auto
              p-4
              border
              rounded-lg
              bg-white
              overflow-y-auto"
      >
        <div
          className="
            my-3
            p-2
            grid
            md:grid-cols-4
            sm:grid-cols-3
            grid-cols-2
            items-center
            justify-between
            cursor-pointer"
        >
          <span>Order</span>
          <span className="sm:text-left text-right">Status</span>
          <span className="hidden md:grid">Last Order</span>
          <span className="hidden sm:grid">Method</span>
        </div>
        <ul>
          {listBookingOneDay.map((order, id) => (
            <li
              key={id}
              className="
                  bg-gray-50
                  hover:bg-gray-100
                  rounded-lg
                  my-3
                  p-2
                  grid
                  md:grid-cols-4
                  sm:grid-cols-3
                  grid-cols-2
                  items-center
                  justify-between
                  cursor-pointer"
            >
              <div className="flex">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <FaShoppingBag className="text-purple-800" />
                </div>
                <div className="pl-4">
                  <p className="text-gray-800 font-bold">
                    {order.totalPay.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="text-gray-800 text-sm">{order.studentName}</p>
                </div>
              </div>
              <p className="text-gray-600 sm:text-left text-right">
                <span
                  className={
                    order.statusContract == "On going"
                      ? "bg-green-200 p-2 rounded-lg"
                      : order.statusContract == "Finished"
                      ? "bg-blue-200 p-2 rounded-lg"
                      : "bg-yellow-200 p-2 rounded-lg"
                  }
                >
                  {order.statusContract}
                </span>
              </p>
              <p className="hidden md:flex">{order.created.split("T")[0]}</p>
              <div className="sm:flex hidden justify-between items-center">
                <p>{"Banking"}</p>
                <BsThreeDotsVertical />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(DashboardOrderClient);
