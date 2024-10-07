import React, { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody, Input, DatePicker, RadioGroup, Radio, useDisclosure } from "@nextui-org/react";
import { now, getLocalTimeZone, toCalendarDateTime, today } from "@internationalized/date";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import MessageBox from "@/components/messagebox/MessageBox";

const AddQueue = ({ restaurantID }) => {
    const router = useRouter();
    const { data: session } = useSession();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [partySize, setPartySize] = useState("");
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

    const { isOpen: isOpenVerification, onOpen: onOpenVerification, onOpenChange: onOpenChangeVerification } = useDisclosure();
    const [verifyCode, setVerifyCode] = useState("");

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

    const [imageSrc, setImageSrc] = useState('');
    const [blobLine, setBlobLine] = useState('');

    const saveQueue = async () => {
        modelAdd.time_of_booking = valueDateTime;
        modelAdd.party_size = partySize;
        modelAdd.customer_name = session?.user?.name;
        const check = {
            customer_name: modelAdd.customer_name !== "",
            customer_number: modelAdd.customer_number !== "",
            party_size: modelAdd.party_size !== ""
        };

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

        const responseData = await res.json();

        const responsegenqr = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue/genqrcode/${responseData._id}`, {
            method: "GET",
            headers: {
                Accept: "image/png",
            },
        });

        const blob = await responsegenqr.blob();
        setBlobLine(blob);
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);

        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async function () {
            const base64data = reader.result;

            const sendEmailRes = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue/sendemail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: session?.user?.email,
                    qrcode: base64data,
                }),
            });

            if (sendEmailRes.ok) {
                console.log('Email sent successfully');
            } else {
                console.error('Failed to send email');
            }
        };

        if (res.ok) {
            showMessage("Operation succeeded!", "success");
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
        }
    };

    const generateVerificationCode = () => {
        const numericCode = Math.floor(100000 + Math.random() * 900000).toString();

        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const randomLetters = Array.from({ length: 2 }, () => letters.charAt(Math.floor(Math.random() * letters.length))).join('');

        const verificationCode = randomLetters + numericCode;
        return verificationCode;
    };

    const verification = async () => {
        const codeVerify = generateVerificationCode();

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/notificationmessage/generateVerificationCode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userID: session?.user?.id,
                    generatedCode: codeVerify,
                    status: "W",
                    lineID: "",
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to generate verification code');
            }

            const code = await response.json();
            setVerifyCode(code.generatedCode);
            onOpenVerification();

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const [checkVerify, setCheckVerify] = useState(false);
    const [lineID, setLineID] = useState("");

    const checkVerification = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/notificationmessage/checkverification/${session?.user?.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to check verification status');
            }

            const verificationData = await response.json();
            if (verificationData && verificationData.status === 'A') {
                setLineID(verificationData.lineID);
                setCheckVerify(true);
            } else {
                console.log('Not verified yet. Proceed with verification process.');
                setCheckVerify(false);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const sendImageToLine = async () => {
        try {
            const reader = new FileReader();
            reader.readAsDataURL(blobLine);
            reader.onloadend = async function () {
                const base64data = reader.result;

                const sendImageResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/notificationmessage/send/${lineID}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        email: session?.user?.email,
                        qrcode: base64data,
                    }),
                });

                if (!sendImageResponse.ok) {
                    const errorData = await sendImageResponse.json();
                    throw new Error(errorData.message || 'Failed to send image');
                }

                console.log('Image sent successfully');
            };
        } catch (error) {
            console.error('Error sending image:', error);
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
            router.push('/login');
        } else {
            onOpen();
        }
    };

    const handleModalChange = (isOpen) => {
        onOpenChangeVerification(isOpen);
        if (!isOpen) {
            checkVerification();
        }
    };

    const handleDateChange = (date) => {
        const nowDateTime = toCalendarDateTime(now(getLocalTimeZone(), new Date() * 60000));
        if (date < nowDateTime) {
            setAlertMessage("Please select the correct date and time.");
        } else {
            setAlertMessage("");
            setValueDateTime(date);
        }
    };


    useEffect(() => {
        checkVerification();
    }, []);

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
                    <ModalHeader className="flex flex-col gap-1">Detail Queue{checkVerify}</ModalHeader>
                    <ModalBody>
                        {imageSrc ? (
                            <>
                                <div className="flex justify-center">
                                    <img src={imageSrc} alt="QR Code" />
                                </div>
                                <p className="text-center">
                                    {checkVerify ? (
                                        <Button onClick={() => sendImageToLine()}>Send QR Code via line</Button>
                                    ) : (
                                        <>
                                            <span>Want to send booking information via Line </span>
                                            <span onClick={verification} className="text-red-400 border-b-1 border-red-600 cursor-pointer">
                                                Verify !!!
                                            </span>
                                        </>
                                    )}
                                </p>
                            </>
                        ) : (
                            <div className="flex flex-col gap-4 mb-4">
                                <Input value={partySize} onValueChange={setPartySize} placeholder="Other" variant="bordered" size="md" type="text" label="Party Size" className="custom-input" />
                                <Input name="customer_number" value={modelAdd.customer_number} onChange={handleChangeData} placeholder="Enter your contact number" variant="bordered" size="md" label="Contact Number" />
                                {!dataError.customer_number && <span className="text-red-500 text-sm">Please enter your phone number.</span>}
                                <DatePicker label="Booking Date" name="time_of_booking" value={valueDateTime} onChange={handleDateChange} variant="bordered" hourCycle={24} placeholderValue={now("Asia/Bangkok")} showMonthAndYearPickers minValue={today(getLocalTimeZone())}
                                defaultValue={today(getLocalTimeZone()).subtract({ days: 1 })} />

                            </div>
                        )}
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => { clearData(); onOpenChange(false); }}>Close</Button>
                        {!imageSrc && <Button color="primary" onPress={saveQueue}>Add</Button>}
                    </ModalFooter>
                </ModalContent>
            </Modal>

            <Modal
                isOpen={isOpenVerification}
                onOpenChange={onOpenChangeVerification}
                backdrop={"blur"}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
                hideCloseButton={true}
            >
                <ModalContent className="p-6 rounded-lg shadow-lg bg-white">
                    <ModalHeader className="text-2xl font-bold text-center text-gray-800">Verification</ModalHeader>
                    <ModalBody className="flex flex-col items-center">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-3 px-10 rounded-lg border border-blue-300 shadow-md mb-4">
                            <span className="text-2xl font-bold text-blue-800">{verifyCode}</span>
                        </div>
                        <img src="/line_joyfulwait.png" alt="QR Code for verification" className="h-[10rem] mb-4 rounded-md shadow-md" />
                        <p className="mt-2 text-center text-gray-600">
                        Please open the LINE application and send this verification code.
                            <strong className="text-blue-600"> {verifyCode} </strong>
                            Allow us to verify your identity.
                        </p>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="danger" variant="light" onPress={() => handleModalChange(false)}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>



            {message && <MessageBox message={message} status={status} />}
            <Button className="mx-3 w-full" onClick={checkLogin}>Booking</Button>
        </>
    );

};

export default AddQueue;
