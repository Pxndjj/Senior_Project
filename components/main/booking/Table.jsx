"use client";
import React, { useState } from 'react';
import { Button, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody } from "@nextui-org/react";
import Qrcode from './Qrcode';

const setTimeShow = (value) => {
    if (value === "") {
        return null;
    }

    const timeZone = "Asia/Bangkok";
    const localTime = new Date(value);

    if (isNaN(localTime.getTime())) {
        throw new RangeError("Invalid time value");
    }

    const formatterDate = new Intl.DateTimeFormat("th-TH", {
        timeZone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });

    const formatterTime = new Intl.DateTimeFormat("th-TH", {
        timeZone,
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
    });

    const formattedDate = formatterDate.format(localTime).replace(/\//g, "/");
    const formattedTime = formatterTime.format(localTime);

    return { date: formattedDate, time: formattedTime };
};

const queueStatus = (status) => {
    switch (status) {
        case "W":
            return <span className="q-waiting text-yellow-500 font-semibold">Waiting</span>;
        case "C":
            return <span className="q-confirm text-blue-500 font-semibold">Confirm</span>;
        case "S":
            return <span className="q-succeed text-green-500 font-semibold">Succeed</span>;
        case "X":
            return <span className="q-cancel text-red-500 font-semibold">Cancel</span>;
        default:
            return null;
    }
};

function Table({ modelBooking }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [openModalIndex, setOpenModalIndex] = useState(null); // เก็บ index ของโมดาลที่เปิดอยู่
    
    // สำหรับการแบ่งข้อมูลเป็นหน้าต่างๆ
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // จำนวนรายการต่อหน้า
    const totalPages = Math.ceil(modelBooking.length / itemsPerPage);

    const handleOpen = (item, index) => {
        setSelectedItem(item);
        setOpenModalIndex(index); // กำหนด index ที่จะเปิดโมดาล
    };

    const handleClose = () => {
        setOpenModalIndex(null); // ปิดโมดาลเมื่อคลิกปิด
    };

    // การคำนวณข้อมูลที่จะแสดงในแต่ละหน้า
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = modelBooking.slice(startIndex, startIndex + itemsPerPage);

    // ฟังก์ชันสำหรับเปลี่ยนหน้า
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="mb-6 p-6 border border-gray-200 rounded-lg shadow-md h-[40rem]">
            <table className="min-w-full table-auto border-collapse rounded-lg overflow-hidden">
                <thead className="bg-gray-200">
                    <tr>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium w-[5%]">#</th>
                        <th className="px-4 py-2 text-left text-gray-600 font-medium w-[16%]">Name</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[10%]">Phone Number</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[7%]">Status</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[7%]">Queue</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[7%]">Seat</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[15%]">Booking Date</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[15%]">Booking Time</th>
                        <th className="px-4 py-2 text-center text-gray-600 font-medium w-[15%]"></th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((item, index) => (
                        <tr key={index} className="bg-white border-b border-gray-200 hover:bg-gray-50">
                            <td className="px-4 py-2 text-sm text-gray-500">{startIndex + index + 1}</td>
                            <td className="px-4 py-2 text-sm font-semibold text-gray-900">{item.customer_name}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{item.customer_number}</td>
                            <td className="px-4 py-2 text-sm text-center">{queueStatus(item.queue_status)}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{item.queue_no}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{item.party_size}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{setTimeShow(item.time_of_booking)?.date}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 text-center">{setTimeShow(item.time_of_booking)?.time}</td>
                            <td className="px-4 py-2 text-sm text-gray-500 text-center">
                                <Button onPress={() => handleOpen(item, index)}>QR Code</Button>
                                <Modal isOpen={openModalIndex === index} onClose={handleClose}>
                                    <ModalContent>
                                        <ModalHeader className="flex flex-col gap-1">QR CODE</ModalHeader>
                                        <ModalBody>
                                            {selectedItem && <Qrcode items={selectedItem} />}
                                        </ModalBody>
                                    </ModalContent>
                                </Modal>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {/* Pagination */}
            <div className="flex justify-center space-x-2 mt-4">
                {Array.from({ length: totalPages }, (_, i) => (
                    <Button
                        key={i}
                        isDisabled={currentPage === i + 1}
                        onPress={() => handlePageChange(i + 1)}
                        auto
                        light={currentPage !== i + 1}
                        flat={currentPage === i + 1}
                    >
                        {i + 1}
                    </Button>
                ))}
            </div>
        </div>
    );
}

export default Table;
