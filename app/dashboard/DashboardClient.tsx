"use client";

import React, { useState, useEffect } from "react";

// import { data } from "./data.js";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { FaShoppingBag } from "react-icons/fa";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useRouter } from "next/navigation";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

type ListingBookingOneDayProps = {
  id: string;
  studentName: string;
  totalPay: number;
  apartmentId: string;
  apartmentData: any;
  statusContract: string;
  created: string;
};

type ChartData = {
  totalPrice: number;
  bookings: ListingBookingOneDayProps[];
};

interface DashboardClientProps {
  //   getNumber: any;
  //   numericTotalPriceOneYear: any;
  //   numericTotalPriceOneDay: any;
  //   listBookingOneDay: any;
  //   getChartData: any;
  getNumber: any;
  numericTotalPriceOneYear: number;
  numericTotalPriceOneDay: number;
  listBookingOneDay: ListingBookingOneDayProps[];
  getChartData: ChartData;
  getRole: any | null;
}

const DashboardClient: React.FC<DashboardClientProps> = ({
  getNumber,
  numericTotalPriceOneYear,
  numericTotalPriceOneDay,
  listBookingOneDay,
  getChartData,
  getRole,
}) => {
  const router = useRouter();
  useEffect(() => {
    if (getRole && getRole.role !== "Admin") {
      router.push("/");
      // console.log(getRole);
    }
  }, [router, getRole]);

  const [chartOptions, setChartOptions] = useState({
    plugins: {
      legend: {
        position: "top" as "top", // Set the position to "top"
      },
      title: {
        display: true,
        text: "Daily Revenue",
      },
    },
    maintainAspectRatio: false,
    responsive: true,
  });

  const [ChartData, setChartData] = useState({
    labels: ["Mon", "Tue", "Web", "Thurs", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales $",
        data: [0, 0, 0, 0, 0, 0, 0], // Khởi tạo dữ liệu ban đầu
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.4)",
      },
    ],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { totalPrice, bookings } = await getChartData;

        if (!Array.isArray(bookings) || bookings.length === 0) {
          console.error("Invalid bookings data format or empty array");
          return;
        }

        const weeklyData = Array(7).fill(0);

        bookings.forEach((booking: any) => {
          const date = new Date(booking.created);
          const dayOfWeek = date.getDay();

          weeklyData[dayOfWeek] += booking.totalPay;
        });

        // console.log("Weekly Data:", weeklyData);

        setChartData((prevChartData) => ({
          ...prevChartData,
          datasets: [
            {
              ...prevChartData.datasets[0],
              data: weeklyData,
            },
          ],
        }));
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    fetchData();
  }, [getChartData]);

  //   console.log(getRole);

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
    <main className="bg-gray-100 min-h-screen">
      {/* Đây là các TopCart 3 cái ở phía trên */}
      <div className="flex flex-col lg:flex-row gap-4 p-8 pt-24">
        <div
          className="
            lg:w-1/3
            w-full
            bg-white
            flex
            justify-between
            border
            p-4
            rounded-lg
            mb-0"
        >
          <div
            className="
                flex
                flex-col
                w-full
                pb-4"
          >
            <p className="text-2xl font-bold">
              {numericTotalPriceOneDay.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p className="text-gray-600">Daily Revenue</p>
          </div>
          <p
            className="
                bg-green-200
                flex
                justify-center
                items-center
                p-2
                rounded-lg"
          >
            <span className="text-green-700 text-lg">+18%</span>
          </p>
        </div>
        <div
          className="
                lg:w-1/3
                w-full
                bg-white
                flex
                justify-between
                border
                p-4
                rounded-lg
                mb-0"
        >
          <div className="flex flex-col w-full pb-4">
            <p className="text-2xl font-bold">
              {numericTotalPriceOneYear.toLocaleString("vi-VN", {
                style: "currency",
                currency: "VND",
              })}
            </p>
            <p className="text-gray-600">YTD Revenue</p>
          </div>
          <p
            className="
                    bg-green-200
                    flex
                    justify-center
                    items-center
                    p-2
                    rounded-lg"
          >
            <span className="text-green-700 text-lg">+11%</span>
          </p>
        </div>
        <div
          className="
                lg:w-1/3
                w-full
                bg-white
                flex
                justify-between
                border
                p-4
                rounded-lg
                mb-0"
        >
          <div
            className="
                flex
                flex-col
                w-full
                pb-4"
          >
            <p className="text-2xl font-bold">+{getNumber.totalNumber}</p>
            <p className="text-gray-600">Students</p>
          </div>
          <p className="bg-green-200 flex justify-center items-center p-2 rounded-lg">
            <span className="text-green-700 text-lg">+17%</span>
          </p>
        </div>
      </div>

      {/* Đây là BarCart và các OrderRecent, biểu đồ và các order gần nhất -> cài đặt: npm install --save chart.js react-chartjs-2 */}
      <div className="p-8 grid md:grid-cols-3 grid-cols-1 gap-4 pt-0">
        {/* BarCart, biểu đồ */}
        <div
          className="
                w-full
                md:col-span-2
                relative
                lg:h-[70vh]
                h-[50vh]
                m-auto
                p-4
                border
                rounded-lg
                bg-white"
        >
          {/* <Bar data={ChartData} options={chartOptions} /> */}
          <Bar data={ChartData} options={chartOptions} />
        </div>

        {/* OrderRecent, order gần nhất */}
        <div
          className="
                w-full
                col-span-1
                relative
                lg:h-[70vh]
                h-[50vh]
                m-auto
                p-4
                border
                rounded-lg
                bg-white
                overflow-scroll"
        >
          <h1>Recent Orders</h1>
          <ul>
            {listBookingOneDay.map((booking: any, id: any) => (
              <li
                key={id}
                className="
                        bg-gray-50
                        hover:bg-gray-100
                        rounded-lg
                        my-3
                        p-2
                        flex
                        items-center
                        cursor-pointer"
              >
                <div className="bg-purple-100 rounded-lg p-3">
                  <FaShoppingBag className="text-purple-800" />
                </div>
                <div className="pl-4">
                  <p className="text-gray-800 font-bold">
                    {booking.totalPay.toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })}
                  </p>
                  <p className="text-gray-400 text-sm">{booking.studentName}</p>
                </div>
                <p className="lg:flex md:hidden absolute right-6 text-sm">
                  {/* import npm install date-fns @date-io/date-fns */}
                  {formatDistanceToNow(
                    parseISO(booking.created.split("T")[0]),
                    {
                      addSuffix: true,
                    }
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
};

export default DashboardClient;
