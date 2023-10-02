"use client";

import { signOut } from "next-auth/react";

import { AiOutlineMenu } from "react-icons/ai";
import { useCallback, useState } from "react";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { BsSearch } from "react-icons/bs";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";

import Modal from "../modals/Modal";
import useLoginModal from "@/app/hooks/useLoginModal";
import useRegisterModal from "@/app/hooks/useRegisterModal";
import useSearchModal from "@/app/hooks/useSearchModal";

interface UserMenuProps {
  currentUser?: any | null;
}

const UserMenu: React.FC<UserMenuProps> = ({ currentUser }) => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const searchModal = useSearchModal();

  const toggleOpen = useCallback(() => {
    setIsOpen((value) => !value);
  }, []);

  const onEscClose = useCallback(() => {}, []);

  // console.log(loginModal.onOpen);

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <div
          onClick={searchModal.onOpen}
          className={`
            flex
            flex-row
            items-center 
            cursor-pointer
            rounded-md 
            p-1
            hover:text-neutral-500
            transition
            duration-300
            translate
            hover:scale-150
            font-medium
            `}
        >
          <BsSearch size={21} />
        </div>
        <div
          className={`text-2xl font-light after:content-["|"]  before:pr-4 bg-white`}
        ></div>

        <div
          className="
            
            hidden
            md:block
            text-sm 
            font-semibold 
            py-3 
            px-4
            md:px-2
            md:py-1 
            rounded-full 
            hover:bg-neutral-100 
            transition 
            cursor-pointer
          "
        >
          <div
            className="
            flex
            flex-row
            items-center
            gap-3
            p-1
            md:p-0
            lg:p-1
            "
          >
            <AiOutlineShoppingCart size={21} />
            <div>Your cart</div>
          </div>
        </div>
        <div
          onClick={toggleOpen}
          className="
          p-4
          md:py-1
          md:px-2
          border-[1px] 
          border-neutral-200 
          flex 
          flex-row 
          items-center 
          gap-3 
          rounded-full 
          cursor-pointer 
          hover:shadow-md 
          transition
          "
        >
          <AiOutlineMenu />
          <div className="hidden md:block">
            <Avatar src="/images/avatarPlaceHolder.jpg" />
          </div>
        </div>
      </div>
      {isOpen && (
        <div
          className="
            absolute 
            rounded-xl 
            shadow-md
            w-[40vw]
            md:w-3/4 
            bg-white 
            overflow-hidden 
            right-0 
            top-12 
            text-sm
          "
        >
          <div className="flex flex-col cursor-pointer">
            <>
              {/* first click login and register will be set true to show */}
              <MenuItem label="Login" onClick={loginModal.onOpen} />
              <MenuItem label="Sign up" onClick={registerModal.onOpen} />
              <MenuItem label="Log out" onClick={() => signOut()} />
              {currentUser && <div>currentUser</div>}
            </>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
