import React, { useState } from "react";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button, useDisclosure, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody, Input, DatePicker, } from "@nextui-org/react";
import { now, getLocalTimeZone, toCalendarDateTime, } from "@internationalized/date";
import { Radio, cn } from "@nextui-org/react";

export const CustomRadio = (props) => {
  const { children, ...otherProps } = props;

  return (
    <Radio
      {...otherProps}
      classNames={{
        base: cn(
          "group inline-flex items-center hover:opacity-70 active:opacity-50 justify-between flex-row-reverse tap-highlight-transparent",
          "cursor-pointer border-2 border-default rounded-lg gap-4 p-2 m-auto",
          "data-[selected=true]:border-primary",
        ),
      }}
    >
      {children}
    </Radio>
  );
};

function AddQueue({ userID, fetchData }) {

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedKeys, setSelectedKeys] = useState(new Set(["Wait"]));
  const [partySize, setPartySize] = useState("");

  const [valueDateTime, setValueDateTime] = useState(
    toCalendarDateTime(now(getLocalTimeZone(), new Date() * 60000))
  );

  const [modelAdd, setModelsAdd] = useState({
    restaurant: "",
    refID: userID,
    customer_name: "",
    customer_number: "",
    time_of_booking: now(getLocalTimeZone(), new Date()),
    party_size: "",
    promotion: "S",
    queue_status: "W",
    queue_number: "",
    queue_no: "",
    queue_used: 0,
    queue_date: "",
  });

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setModelsAdd((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePartySizeChange = (e) => {
    const value = e.target.value;
    if (!isNaN(value) && (value === "" || value > 0)) {
      setPartySize(value);
      setModelsAdd((prev) => ({
        ...prev,
        party_size: value,
      }));
    }
  };

  const [dataError, setDataError] = useState({
    customer_name: true,
    customer_number: true,
    party_size: true,
  });

  const saveQueue = async () => {
    modelAdd.time_of_booking = valueDateTime;

    modelAdd.party_size = partySize;

    const check = {
      customer_name: modelAdd.customer_name !== "",
      customer_number: modelAdd.customer_number !== "",
      party_size: modelAdd.party_size !== "",
    };

    setDataError(check);

    if (!check.customer_name || !check.customer_number || !check.party_size) {
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ data: modelAdd }),
    });

    if (res.ok) {
      setModelsAdd({
        restaurant: "",
        refID: userID,
        customer_name: "",
        customer_number: "",
        time_of_booking: now(getLocalTimeZone(), new Date()),
        party_size: "",
        promotion: "S",
        queue_status: "W",
        queue_number: "",
        queue_no: "",
        queue_used: 0,
        queue_date: "",
      });

      onOpenChange(false);
      fetchData();
    }
  };

  const today = now("Asia/Bangkok");
  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const clearData = async () => {
    setModelsAdd({
      restaurant: "",
      refID: userID,
      customer_name: "",
      customer_number: "",
      time_of_booking: now(getLocalTimeZone(), new Date()),
      party_size: "",
      promotion: "S",
      queue_status: "W",
      queue_number: "",
      queue_no: "",
      queue_used: 0,
      queue_date: "",
    });
  };

  return (
    <>
      <Modal isOpen={isOpen} placement={"bottom-center"} onOpenChange={onOpenChange} backdrop={"blur"} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Detail Queue</ModalHeader>
              <ModalBody>
                <div className="flex mt-1">
                  <div className="w-[22%]">
                    <Input value={partySize} onChange={handlePartySizeChange} placeholder="other" variant="bordered" size={"md"} type="text" label="Party Size" className="custom-input" />
                  </div>
                  <div className="w-[4%]"></div>
                  <div className="w-[74%]">
                    <DatePicker label="Booking Date" name="time_of_booking" value={valueDateTime} onChange={setValueDateTime} variant="bordered" hourCycle={24} placeholderValue={now("Asia/Bangkok")} showMonthAndYearPickers minValue={today} />
                  </div>
                </div>

                <div className="flex ">
                  <div className="w-[57%]">
                    <Input name="customer_name" value={modelAdd.customer_name} onChange={handleChangeData} placeholder="enter your customer name" variant="bordered" size={"md"} type="text" label="Customer Name" className="custom-input" />
                    <h3 className="text-[13px] text-red-500">{dataError.customer_name ? "" : "Please enter first and last name."}</h3>
                  </div>
                  <div className="w-[4%]"></div>
                  <div className="w-[39%]">
                    <Input name="customer_number" value={modelAdd.customer_number} onChange={handleChangeData} placeholder="enter your contact number" variant="bordered" size={"md"} type="text" label="Contact number" className="custom-input" />
                    <h3 className="text-[13px] text-red-500">{dataError.customer_number ? "" : "Please enter your phone."}</h3>
                  </div>
                </div>

                <Dropdown>
                  <DropdownTrigger>
                    <Button className={selectedValue === "confirm" ? "text-green-300 capitalize" : "text-orange-300 capitalize"} startContent={selectedValue === "confirm" ? (<span className="material-symbols-outlined">check_circle</span>) : (<span className="material-symbols-outlined">hourglass_top</span>)} variant="bordered">
                      {selectedValue}
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu aria-label="Single selection example" variant="flat" disallowEmptySelection selectionMode="single" selectedKeys={selectedKeys} onSelectionChange={setSelectedKeys}>
                    <DropdownItem startContent={<span className="material-symbols-outlined">check_circle</span>} key="confirm" onClick={() => setModelsAdd((prev) => ({ ...prev, queue_status: "C", }))} className="text-green-300">
                      Confirm
                    </DropdownItem>
                    <DropdownItem startContent={<span className="material-symbols-outlined">hourglass_top</span>} key="wait" onClick={() => setModelsAdd((prev) => ({ ...prev, queue_status: "W", }))} className="text-orange-300">
                      Wait
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose} onClick={() => clearData()}>Close</Button>
                <Button color="primary" onPaste={onClose} onClick={() => { saveQueue(); }}>Add</Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Button startContent={<span className="material-symbols-outlined">add_to_queue</span>} className="bg-blue-300 mx-3" onPress={onOpen}>New Booking</Button>
    </>
  );
}

export default AddQueue;
