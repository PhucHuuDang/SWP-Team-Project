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

export type ServicesBelongToBookingDetail = {
  bookingDetailId: string;
  bookingDetailName: string;
  startDate: string;
  endDate: string;
  bookingDetailType: string;
  remainingTaskDuration: number;
};

export type ServiceOfBookingDetails = {
  serviceName: string;
  serviceId: string;
  unit: string;
  bookingDetailThatServiceIsBelongTo: ServicesBelongToBookingDetail[];
};
