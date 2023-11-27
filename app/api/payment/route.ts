import { NextResponse } from "next/server";
// http://3.27.132.94/api/v1/bookings

import axios from "axios";

export async function POST(request: Request) {
  const body = await request.json();

  const { requiredAmount, newBooking } = body;

  const paymentContent = "test";
  const paymentCurrency = "VND";
  const paymentDestinationId = "VNPAY";

  console.log(body);

  // const formatListPackage = listPackage.map((item: any) => ({
  //   packageId: item.packageId,
  //   quantityOfPackageOrdered: item.quantityOfPackageOrdered,
  // }));

  try {
    const payment = await axios.post(
      "https://housevn.azurewebsites.net/api/v1/payment",
      {
        paymentContent: paymentContent,
        paymentCurrency: paymentCurrency,
        requiredAmount: requiredAmount,
        paymentDestinationId: paymentDestinationId,
        newBooking: newBooking,
      }
    );

    if (payment.status === 200) {
      const paymentSuccess = payment.data;

      return NextResponse.json(paymentSuccess);
    }
  } catch (error: any) {
    console.log("failed");
    throw new Error("Payment was failed!", error);
  }
}
