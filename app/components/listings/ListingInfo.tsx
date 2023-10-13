interface ListingInfoProps {
  createdBy: string;
  serviceDescription: string;
  price: number;
}

const ListingInfo: React.FC<ListingInfoProps> = ({
  createdBy,
  serviceDescription,
  price,
}) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl
            font-semibold
            flex
            flex-row
            items-center
            gap-2
        "
        >
          <div>Hosted by</div>
          <div className="text-lg text-neutral-700">Avatar</div>
        </div>
        <div
          className="
            flex
            flex-row
            items-center
            gap-4
            font-light
            text-neutral-500
        "
        >
          <div>name</div>
          <div>name</div>
          <div>name</div>
        </div>
      </div>
      <hr />
      <div>{serviceDescription}</div>
    </div>
  );
};

export default ListingInfo;
