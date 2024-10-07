"use client";

import { useEffect, useState } from "react";
import { Button, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody, Input, DatePicker, RadioGroup, Radio, useDisclosure } from "@nextui-org/react";
import { useSession } from "next-auth/react";

export default function Qrcode({ items }) {
    const { data: session } = useSession();
    const [imageSrc, setImageSrc] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { isOpen: isOpenVerification, onOpen: onOpenVerification, onOpenChange: onOpenChangeVerification } = useDisclosure();
    const [verifyCode, setVerifyCode] = useState("");


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


    useEffect(() => {
        const fetchQRCode = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue/genqrcode/${items._id}`, {
                    method: "GET",
                    headers: {
                        Accept: "image/png",
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const blob = await response.blob(); // ใช้ await ที่นี่
                const imageUrl = URL.createObjectURL(blob);
                setImageSrc(imageUrl);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        checkVerification()
        fetchQRCode();
    }, [items._id]);



    const handleModalChange = (isOpen) => {
        onOpenChangeVerification(isOpen);
        if (!isOpen) {
            checkVerification();
        }
    };

    return (
        <div>
            {loading ? (
                <p>Loading QR Code...</p>
            ) : error ? (
                <p>Error: {error}</p>
            ) : (
                <>
                    <img src={imageSrc} alt="QR Code" />
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

                </>

            )}
        </div>
    );
}
