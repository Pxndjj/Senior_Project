"use client";
import React, { useState } from "react";
import { Button, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody } from "@nextui-org/react";
import Qrcode from "./Qrcode";

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

function Table({ modelBooking, fetchData }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModalIndex, setOpenModalIndex] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState(null);
  const [queueItem, setQueueItem] = useState(null);

  // Sort bookings by time_of_booking in descending order (newest first)
  const sortedBookings = [...modelBooking].sort(
    (a, b) => new Date(b.time_of_booking) - new Date(a.time_of_booking)
  );

  const totalPages = Math.ceil(sortedBookings.length / itemsPerPage);

  const handleOpen = (item, index) => {
    setSelectedItem(item);
    setOpenModalIndex(index);
  };

  const handleClose = () => {
    setOpenModalIndex(null);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = sortedBookings.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCancel = (item) => {
    setIsModalOpen(true);
    setStatusToUpdate("X");
    setQueueItem(item);
  };

  const confirmUpdateStatus = async () => {
    setIsLoading(true);
    try {
      queueItem.queue_status = statusToUpdate;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/queue/updateQueue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: queueItem }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Unknown error from server");
      }

      // Refresh data after successful status update
      fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating the queue:", error);
    } finally {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="mb-6 p-6 border border-gray-200 rounded-lg shadow-md overflow-auto h-[40rem]">
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
              <td className="px-4 py-2 text-sm text-gray-500 text-center flex space-x-2">
                <Button onPress={() => handleOpen(item, index)} className="w-full sm:w-auto">QR Code</Button>
                <Button
                  onPress={() => handleCancel(item)}
                  color="danger"
                  className="w-full sm:w-auto"
                  isDisabled={item.queue_status === "X" || isLoading}
                >
                  Cancel
                </Button>
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
            className={`w-full sm:w-auto ${currentPage === i + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          >
            {i + 1}
          </Button>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Status Update</h3>
            <p className="text-sm text-gray-500 mb-4">
              Are you sure you want to cancel this queue?
            </p>
            <div className="flex justify-end">
              <button onClick={() => setIsModalOpen(false)} className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md mr-2">Cancel</button>
              <button onClick={confirmUpdateStatus} className="bg-blue-500 text-white px-4 py-2 rounded-md">Confirm</button>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-blue-500"></div>
              <p className="text-gray-500">Updating...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Table;
