import React, { useState } from "react";
import { Button, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody, Input, DatePicker, RadioGroup, Radio, useDisclosure } from "@nextui-org/react";
import { now, getLocalTimeZone, toCalendarDateTime } from "@internationalized/date";
import { useSession } from "next-auth/react";
import { cn } from "@nextui-org/react";
import { useRouter } from "next/navigation";

const CustomRadio = (props) => {
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

const AddQueue = ({ restaurantID }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [partySize, setPartySize] = useState("Enter number");
    const [valueDateTime, setValueDateTime] = useState(toCalendarDateTime(now(getLocalTimeZone(), new Date())));
    const [modelAdd, setModelsAdd] = useState({
        restaurant: "",
        refID: restaurantID,
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

    const [dataError, setDataError] = useState({
        customer_name: true,
        customer_number: true,
        party_size: true,
    });

    const handleChangeData = (e) => {
        const { name, value } = e.target;
        setModelsAdd((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const showMessage = (msg, statusType) => {
        setMessage(msg);
        setStatus(statusType);
        setTimeout(() => {
            setMessage("");
            setStatus("");
        }, 3000);
    };

    const saveQueue = async () => {
        modelAdd.time_of_booking = valueDateTime;
        modelAdd.party_size = partySize;

        modelAdd.customer_name = session?.user?.name

        const check = { customer_name: modelAdd.customer_name !== "", customer_number: modelAdd.customer_number !== "", party_size: modelAdd.party_size !== "" };
        setDataError(check);
        if (!check.customer_name || !check.customer_number || !check.party_size) {
            return;
        }
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue/usedAdd`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ data: modelAdd }),
        });

        if (res.ok) {
            showMessage("Operation succeeded!", "success")
            setModelsAdd({
                restaurant: "",
                refID: restaurantID,
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
        }
    };

    const clearData = () => {
        setModelsAdd({
            restaurant: "",
            refID: restaurantID,
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

    const checkLogin = () => {
        if (!session) {
            console.log("login");
            router.push('/login');
        } else {
            onOpen();
        }
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop={"blur"}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                hideCloseButton={true}
            >
                <ModalContent>
                    <ModalHeader className="flex flex-col gap-1">Detail Queue</ModalHeader>
                    <ModalBody>
                        <div className="flex flex-col gap-4 mb-4">
                            <Input
                                value={partySize}
                                onValueChange={setPartySize}
                                placeholder="Enter number"
                                variant="bordered"
                                size="md"
                                type="text"
                                label="Party Size"
                                className="custom-input"
                            />

                            <Input
                                name="customer_number"
                                value={modelAdd.customer_number}
                                onChange={handleChangeData}
                                placeholder="Enter your contact number"
                                variant="bordered"
                                size="md"
                                label="Contact Number"
                            />
                            {!dataError.customer_number && <span className="text-red-500 text-sm">Please enter your phone number.</span>}

                            <DatePicker
                                label="Booking Date"
                                name="time_of_booking"
                                value={valueDateTime}
                                onChange={setValueDateTime}
                                variant="bordered"
                                hourCycle={24}
                                placeholderValue={now("Asia/Bangkok")}
                                showMonthAndYearPickers
                            />
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => { clearData(); onOpenChange(false); }}>
                            Close
                        </Button>
                        <Button color="primary" onPress={saveQueue}>
                            Add
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <Button className="mx-3 w-full" onClick={checkLogin}>Booking</Button>
        </>
    );
};

export default AddQueue;
