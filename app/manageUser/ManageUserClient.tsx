"use client";

import { BsPeople } from "react-icons/bs";

import { useRouter } from "next/navigation";

import Heading from "../components/Heading";
import UserInfoListing from "../components/listings/UserInfoListing";
import useVerifyToken from "../hooks/useVerifyToken";
import { useCallback, useEffect, useState } from "react";
import ClientOnly from "../components/ClientOnly";
import EmptyState from "../components/EmptyState";
import { useDebouncedState } from "@mantine/hooks";
import useDeleteModal from "../hooks/useDeleteModal";
import DeleteModal from "../components/DeleteModal";
import useDeleteUserModal from "../hooks/useDeleteUserModal";
import axios from "axios";
import { toast } from "react-hot-toast";

interface ManageUserClientProps {
  studentsInfo: any;
  getRole: any | null;
}

const ManageUserClient: React.FC<ManageUserClientProps> = ({
  studentsInfo,
  getRole,
}) => {
  const [search, setSearch] = useDebouncedState("", 200, { leading: true });
  // const useResultVerifyToken: any = useVerifyToken();
  const router = useRouter();
  const deleteUseModal = useDeleteUserModal();
  const [deleteId, setDeleteId] = useState("");
  const [deleteName, setDeleteName] = useState("");
  const [deleteMail, setDeleteMail] = useState("");
  const [disabled, setDisabled] = useState(false);

  // useEffect(() => {
  //   if (useResultVerifyToken && useResultVerifyToken.role !== "Admin") {
  //     router.push("/");
  //     console.log(useResultVerifyToken);
  //   }
  // }, [router, useResultVerifyToken]);

  useEffect(() => {
    if (getRole && getRole.role !== "Admin") {
      router.push("/");
      // console.log(getRole);
    }
  }, [router, getRole]);

  const openDeleteUserModal = useCallback(
    (id: string) => {
      setDeleteId(id);

      deleteUseModal.onOpen();
    },
    [deleteUseModal]
  );

  const closeDeleteUserModal = useCallback(() => {
    setDeleteId("");
    setDeleteName("");
    setDeleteMail("");
    deleteUseModal.onClose();
  }, [deleteUseModal]);

  const onCancel = useCallback(() => {
    // setDeleteId(id);
    // console.log(deleteId);
    setDisabled(true);
    axios
      .delete("/api/deleteStudent", { data: { deleteId } })
      .then(() => {
        toast.success("Delete staff successfully");
        closeDeleteUserModal();
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
  }, [router, deleteId, closeDeleteUserModal]);

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
        <Heading title="Manage Users" center />
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
            Search User
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
          {/* 
             grid
            lg:grid-cols-2
            md:grid-cols-1
            gap-4
            
            */}

          {studentsInfo
            .filter((value: any) => {
              return search.toLowerCase() === ""
                ? value
                : value.applicationUserTableData.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase());
            })
            .map((item: any) => {
              return (
                !item.studentTableData.isDelete && (
                  <UserInfoListing
                    key={item.applicationUserTableData.id}
                    id={item.studentTableData.id}
                    fullName={item.applicationUserTableData.fullName}
                    email={item.applicationUserTableData.email}
                    date={item.studentTableData.created}
                    openDeleteUserModal={openDeleteUserModal}
                    setDeleteName={setDeleteName}
                    setDeleteMail={setDeleteMail}
                  />
                )
              );
            })}

          <DeleteModal
            isOpen={deleteUseModal.isOpen}
            onConfirmDelete={onCancel}
            onClose={closeDeleteUserModal}
            deleteName={deleteName}
            disabled={disabled}
            user
            deleteMail={deleteMail}
          />
        </div>
      </div>
    </>
  );
};

export default ManageUserClient;
