import { IconType } from "react-icons";

export type ServiceProp = {
  id: string;
  serviceName: string;
  serviceDescription: string;
  price: number;
  unit: string;
  originalPrice: number;
  image: string;
  categoryId: string;
  created: string;
  createBy: string;
  lastModified: string;
  lastModifiedBy: null;
  isDelete: boolean;
  quantity?: number;
  discountPercent: number;
};

export type PackageProps = {
  id: string;
  packageName: string;
  weekNumberBooking: number;
  numberOfPerWeekDoPackage: number;
  image: string | undefined;
  totalPrice: number;
  discountPercent: number;
  totalOriginalPrice: number;
  packageDescription: string;
  created: string;
  packageItem: number;
  createBy: null;
  lastModified: null;
  lastModifiedBy: null;
  isDelete: boolean;
};

export type GetCategory = {
  id: string;
  categoryName: string;
  created: string;
  createBy: string;
  lastModified: string;
  lastModifiedBy: null;
  isDelete: boolean;
  image: IconType;
};

export type getServicesInAPackage = {
  packageData: PackageProps;
  listServiceData: ServiceProp[];
};

export type RegionsProps = {
  id: string;
  regionName: string;
};

export type PaymentMethodProps = {
  id: string;
  paymentMethodName: string;
  createBy: string;
  created: string;
  lastModified: string;
  lastModifiedBy: null;
  isDelete: boolean;
};

export type AttendReport = {
  id: string;
  dateDoPackage: string;
  bookingDetailId: string;
  reportWorkId: string;
  attendenceStatus: number;
  created: string;
  isDeleted: boolean;
  feedbackAvailable: string;
};

export type AttendanceReport = {
  dateDoPackage: string;
  bookingDetailId: string;
  reportWorkId: null;
  attendenceStatus: number;
  bookingDetail: null;
  feedBack: {
    feedBackName: null;
    feedBackDescription: null;
    feedBackImage: null;
    feedBackRating: null;
    feedBackStatus: number;
    studentId: string;
    attendReportId: string;
    students: null;
    attendReports: null;
    created: string;
    createBy: null;
    lastModified: string;
    lastModifiedBy: null;
    isDelete: false;
    id: string;
    domainEvents: [];
  };
  created: string;
  createBy: null;
  lastModified: string;
  lastModifiedBy: null;
  isDelete: boolean;
  id: string;
  domainEvents: [];
};

export type DetailsProps = {
  // id: string;
  // bookingDetailName: string;
  // totalPriceQtity: number;
  // isRe_Newed: boolean;
  // remainingTaskDuration: number;
  // quantityOfPackageOrdered: number;
  // bookingDetailStatus: null;
  // bookingId: string;
  // packageId: string;
  // created: string;
  // createBy: string;
  // booking?: null;
  // lastModified: string;
  // lastModifiedBy: null;
  // isDelete: boolean;
  // attendReport
  bookingDetailTittle: string;
  startDateDoService: string;
  endDateDoService: string;
  timeDoService: string;
  serviceId: string;
  bookingDetailId: string;
  bookingDetailType: string;
  note: string;
};

export type BookingByStuIdProps = {
  id: string;
  studentName: string;
  contract: string;
  totalPay: number;
  apartmentId: string;
  apartmentData: {
    id: string;
    address: string;
    studentId: string;
    regionId: string;
  };

  statusContract: string;
  created: string;
  isDeleted: boolean;
  details: DetailsProps[];
};

export type AttendanceByDetailId = {
  bookingDetail: {
    totalPriceOfQuantity: number;
    isRe_Newed: boolean;
    renewStartDate: null;
    remainingTaskDuration: number;
    quantityOfPackageOrdered: number;
    bookingDetailStatus: number;
    bookingId: string;
    packageId: string;
    booking: null;
    package: null;
    attendReport: AttendanceReport[];
    bookingDetailStaff: null;
    created: string;
    createBy: string;
    lastModified: string;
    lastModifiedBy: null;
    isDelete: false;
    id: string;
    domainEvents: [];
  };

  attendReports: AttendReport[];
};

export type BookingsProps = {
  bookingDetailData: DetailsProps;
};

export type ReviewFeedbackProps = {
  feedBackName: string | null;
  feedBackDescription: string | null;
  feedBackImage: string | null;
  feedBackRating: string | null;
  feedBackStatus: number;
};

// {
//   "id": "437ad544-b85c-427c-a109-19ca76706a56",
//   "studentName": null,
//   "contract": "Hợp đồng test user 2023/10/30",
//   "totalPay": 108000000,
//   "apartmentId": "f93ec696-1e9f-4bf2-a7b4-2bd1f4785e3f",
//   "apartmentData": {
//     "id": "f93ec696-1e9f-4bf2-a7b4-2bd1f4785e3f",
//     "address": "Vinhomes Grand Park",
//     "studentId": "00bf5134-b150-45eb-820a-e7b4b5178cc7",
//     "regionId": "9ffbfc1a-45d7-42d1-b216-00f328fe1638"
//   },
//   "statusContract": "On Going",
//   "created": "2023-10-30T00:41:33.3335659",
//   "isDeleted": false,
//   "details": [
//     {
//       "id": "47dd9c5d-1e63-466f-bce8-ab0ffac4b629",
//       "totalPriceQtity": 0,
//       "isRe_Newed": false,
//       "remainingTaskDuration": 4,
//       "quantityOfPackageOrdered": 0,
//       "bookingDetailStatus": null,
//       "bookingId": "437ad544-b85c-427c-a109-19ca76706a56",
//       "packageId": "ab1f7f89-2536-4d23-84ac-914670551fed",
//       "created": "2023-10-30T00:41:34.3902571",
//       "createBy": "testuser01",
//       "lastModified": "2023-10-30T00:41:34.3902566",
//       "lastModifiedBy": null,
//       "isDelete": false
//     }
//   ]
// },

// "id": "b17c9d4c-b164-4097-8d5f-03d2246da758",
//     "packageName": "Vận chuyên giao vận package",
//     "weekNumberBooking": 6,
//     "numberOfPerWeekDoPackage": 2,
//     "dayDoInWeek": [
//       "Thứ 3",
//       "Thứ 7"
//     ],
//     "image": null,
//     "totalPrice": 0,
//     "created": "2023-10-11T01:30:40.5956316",
//     "createBy": null,
//     "lastModified": null,
//     "lastModifiedBy": null,
//     "isDelete": false
