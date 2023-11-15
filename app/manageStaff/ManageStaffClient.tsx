"use client";

import { BsPeople } from "react-icons/bs";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import useVerifyToken from "../hooks/useVerifyToken";
import Heading from "../components/Heading";
import StaffInfoListing from "../components/listings/StaffInfoListing";
import { useDebouncedState } from "@mantine/hooks";
import useDeleteModal from "../hooks/useDeleteModal";
import axios from "axios";
import { toast } from "react-hot-toast";
import DeleteModal from "../components/DeleteModal";

interface ManageStaffClientProps {
  staffsInfo: any;
  getRole: any | null;
}

const ManageStaffClient: React.FC<ManageStaffClientProps> = ({
  staffsInfo,
  getRole,
}) => {
  const [search, setSearch] = useDebouncedState("", 200, { leading: true });
  // const useResultVerifyToken: any = useVerifyToken();
  const router = useRouter();
  const deleteModal = useDeleteModal();
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [deleteMail, setDeleteMail] = useState("");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (getRole && getRole.role !== "Admin") {
      router.push("/");
      // console.log(getRole);
    }
  }, [router, getRole]);

  const openDeleteModal = (id: string) => {
    // console.log(id);
    setDeleteId(id);
    deleteModal.onOpen();
  };

  // console.log(deleteId);

  const closeDeleteModal = useCallback(() => {
    setDeleteId("");
    setDeleteName("");
    setDeleteMail("");

    // onClose();
    deleteModal.onClose();
  }, [deleteModal]);

  const onCancel = useCallback(() => {
    // setDeleteId(id);
    // console.log(deleteId);
    setDisabled(true);
    axios
      .delete("/api/deleteStaff", { data: { deleteId } })
      .then(() => {
        toast.success("Delete staff successfully");
        closeDeleteModal();
        router.refresh();
      })
      .catch(() => {
        toast.error("Failed to delete staff");
      })
      .finally(() => {
        // setDeleteId("");
        setDisabled(false);
        setDeleteName("");
        setDeleteMail("");

        // setDeleteStaff(false);
      });
  }, [router, deleteId, closeDeleteModal]);

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
    <>
      <div className="pt-20">
        <Heading title="Manage Staffs" center />
      </div>
      <div className="flex flex-row items-center justify-center w-auto gap-2 pt-5">
        <BsPeople size={30} />
        <div className="relative">
          <input
            onChange={(e) => setSearch(e.target.value)}
            id="search"
            className="
                peer
                w-[400px]
                rounded-md
                text-md
                font-semibold
                py-2
                px-4
                border-b-[2px]
                shadow-md
                outline-none
                transition
                disabled:opacity-70
                disabled:cursor-not-allowed
                
          
          "
          />
          <label
            className={`
                absolute
                text-md
                font-semibold
                duration-150
                transform
                left-0
                top-5
                px-4
                -translate-y-3
                z-10
                origin-[0]
                peer-placeholder-shown:scale-100
                peer-placeholder-shown:translate-y-0
                peer-focus:scale-75
                peer-focus:-translate-y-10
          `}
          >
            Search Staff
          </label>
        </div>
      </div>
      <div
        className="
              flex
              flex-row
              items-center
              gap-3
              md:gap-1
              p-10
              w-full
              h-auto
          "
      >
        <div
          className="
              flex
              flex-col
              flex-1
              mt-5 
  
          "
        >
          {staffsInfo
            .filter((value: any) => {
              return search.toLowerCase() === ""
                ? value
                : value.inforOfStaffData.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
            .map((item: any) => {
              return (
                !item.staffData.isDelete && (
                  <StaffInfoListing
                    key={item.staffData.id}
                    id={item.staffData.id}
                    fullName={item.inforOfStaffData.fullName}
                    email={item.inforOfStaffData.email}
                    date={item.staffData.created}
                    setDeleteName={setDeleteName}
                    openDeleteModal={openDeleteModal}
                    setDeleteMail={setDeleteMail}
                  />
                )
              );
            })}
        </div>
      </div>
      <DeleteModal
        isOpen={deleteModal.isOpen}
        disabled={disabled}
        deleteName={deleteName}
        onConfirmDelete={onCancel}
        onClose={closeDeleteModal}
        deleteMail={deleteMail}
      />
    </>
  );
};

export default ManageStaffClient;
