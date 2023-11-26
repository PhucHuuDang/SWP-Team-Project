"use client";

import Container from "../components/Container";
import Maps from "../components/navbar/Maps";
import ContactForm from "../components/inputs/ContactForm";
import ContactInfo from "../components/listings/ContactInfo";
import Heading from "../components/Heading";

interface ContactClientProps {
  email?: string;
  password?: string;
  studentName?: string;
}

const ContactClient = ({ user }: any) => {
  // console.log(user);
  return (
    <>
      <div className="pt-20">
        <Container>
          {/* <div> */}
          <div className="pt-10 text-center">
            <div className="flex flex-col gap-1">
              <div className="font-bold text-[30px] mb-auto">Contact Us</div>
              <div className="font-semibold text-md text-neutral-500">
                Get in touch
              </div>
            </div>
          </div>
          <div className="pt-24 flex flex-col items-center lg:flex-row lg:justify-between">
            <ContactInfo />
            <ContactForm />
          </div>
          {/* </div> */}
          <hr className="mt-16 border-t-2 border-neutral-300" />
        </Container>
      </div>
      <div
        className="
              h-auto
              w-auto
              "
      >
        <Maps />
      </div>
    </>
  );
};

export default ContactClient;
