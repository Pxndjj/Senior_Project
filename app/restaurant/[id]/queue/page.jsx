"use client";

import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Button, Pagination, useDisclosure, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody, Input, DatePicker, } from "@nextui-org/react";

import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";


import TableQueue from '@/components/restaurant/queue/TableQueue'
import AddQueue from '@/components/restaurant/queue/AddQueue'

export default function Queue() {
  const params = useParams();
  const [showUsed, setShowUsed] = useState(true);
  const [showStatus, setShowStatus] = useState("ALL");
  const [filterData, setFilterData] = useState("");
  const [models, setModels] = useState([]);

  const handleChangeData = (e) => {
    const { value } = e.target;
    setFilterData(value);
  };

  const actionUsed = (action) => {
    setShowUsed(!action);
  };

  const fetchData = async () => {
    try {
      const resModels = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/queue/all/${params.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        }
      );

      const data = await resModels.json();
      setModels(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filterData, showStatus]);

  const filteredModels = models.filter((model) => {
    return (
      (model.customer_name && model.customer_name.toLowerCase().includes(filterData.toLowerCase())) ||
      (model.customer_number && model.customer_number.toLowerCase().includes(filterData.toLowerCase())) &&
      (showUsed ? model.queue_used === 0 : true) &&
      (showStatus === "ALL" ? true : model.queue_status === showStatus)
    );
  });


  return (
    <main className="main-content">
      <div className="queue-list">
        <div className="flex pb-5">
          <div className="justify-start w-[50%]">
            <h2>Queue List</h2>
          </div>
          <div className="justify-end w-[20%]">
            <Input type="text" size={"sm"} label="Search" variant="bordered"
              name="filterData"
              value={filterData}
              onChange={handleChangeData}
              className="max-w-xs"
            />
          </div>

          <div className="flex justify-end w-[30%]">
            {showUsed ? (
              <AddQueue userID={params.id} fetchData={fetchData} />
            ) : (
              <Dropdown>
                <DropdownTrigger>
                  <Button startContent={<span className="material-symbols-outlined">tune</span>} variant="bordered">Status Queue</Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem startContent={<span className="material-symbols-outlined">select_all</span>} key="all" className="text-blue-300" onClick={() => setShowStatus("ALL")}>All Status</DropdownItem>
                  <DropdownItem startContent={<span className="material-symbols-outlined">check_circle</span>} key="confirm" className="text-green-300" onClick={() => setShowStatus("C")}>Confirm</DropdownItem>
                  <DropdownItem startContent={<span className="material-symbols-outlined">cancel</span>} key="succeed" className="text-red-300" onClick={() => setShowStatus("X")}>Cancel</DropdownItem>
                  <DropdownItem startContent={<span className="material-symbols-outlined">recommend</span>} key="cancel" className="text-gray-400" onClick={() => setShowStatus("S")}>Succeed</DropdownItem>
                  <DropdownItem startContent={<span className="material-symbols-outlined">hourglass_top</span>} key="wait" className="text-orange-300" onClick={() => setShowStatus("W")}>Wait</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}
            <Button startContent={<span className="material-symbols-outlined">history</span>} className="bg-orange-200 mx-3" onClick={() => actionUsed(showUsed)}>Previous Queue</Button>

          </div>
        </div>
        <div className="card-table">
          <TableQueue userID={params.id} showUsed={showUsed} showStatus={showStatus} models={filteredModels} fetchData={fetchData} />
        </div>
      </div>
    </main>
  );
}

