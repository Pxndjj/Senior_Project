"use client";

import {
  Dropdown,
  DropdownMenu,
  DropdownTrigger,
  DropdownItem,
  Button,
  Pagination,
  useDisclosure,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalContent,
  ModalBody,
  Input,
  Checkbox,
  DatePicker,
} from "@nextui-org/react";
import moment from "moment-timezone";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { now, getLocalTimeZone, toCalendarDateTime } from "@internationalized/date";
import { useDateFormatter } from "@react-aria/i18n";
moment.tz.setDefault("Asia/Bangkok");

export default function Queue() {
  const params = useParams();
  const [showUsed, setShowUsed] = useState(true);
  const [showStatus, setShowStatus] = useState("ALL");

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [valueDateTime, setValueDateTime] = useState(toCalendarDateTime(now(getLocalTimeZone(), new Date())))

  const [models, setModels] = useState([
    {
      restaurant: "",
      refID: "",
      customer_name: "",
      time_of_booking: "",
      party_size: "",
      promotion: "",
      queue_status: "",
      queue_number: "",
      queue_no: "",
      queue_used: 0,
      queue_date: "",
    },
  ]);

  const [modelAdd, setModelsAdd] = useState({
    restaurant: "",
    refID: params.id,
    customer_name: "",
    time_of_booking: now(getLocalTimeZone(), new Date()),
    party_size: "",
    promotion: "S",
    queue_status: "W",
    queue_number: "",
    queue_no: "",
    queue_used: 0,
    queue_date: "",
  });

  const handleDateChange = (date) => {
    setModelsAdd((prev) => ({
      ...prev,
      time_of_booking: date,
    }));
  };

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setModelsAdd((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const [selectedKeys, setSelectedKeys] = React.useState(new Set(["Wait"]));

  const selectedValue = React.useMemo(
    () => Array.from(selectedKeys).join(", ").replaceAll("_", " "),
    [selectedKeys]
  );

  const actionUsed = (action) => {
    setShowUsed(!action);
  };

  const updateStatus = async (status, obj) => {
    try {
      obj.queue_status = status;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND}/queue/updateQueue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: obj }),
        }
      );

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.log("update error", error);
    }
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
      console.error("Error fetching data:");
    }
  };

  useEffect(() => {
    fetchData();
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  const saveQueue = async () => {
    modelAdd.time_of_booking = valueDateTime

    console.log(modelAdd.time_of_booking)
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ data: modelAdd }),
    });
    if (res.ok) {
      fetchData();
    }
  };

  const nextQueue = async (refID, queue_status) => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND}/queue/nextqueue`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          refID: refID,
          queue_status: queue_status,
        }),
      }
    );
    if (res.ok) {
      fetchData();
    }
  };

  const queueStatus = (status) => {
    switch (status) {
      case "W":
        return <span className="q-waiting">wait</span>;
      case "C":
        return <span className="q-confirm">confirm</span>;
      case "S":
        return <span className="q-succeed">succeed</span>;
      case "X":
        return <span className="q-cancel">cancel</span>;
    }
  };

  const filteredModels = models
    .filter((o) => (showUsed ? o.queue_used === 0 : o.queue_used === 1))
    .filter((o) =>
      showStatus === "ALL" || o.queue_used === 0
        ? true
        : showStatus === o.queue_status
    );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModels.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <main className="main-content">
      <div className="queue-list">
        <div className="flex justify-between pb-5">
          <h2>Queue List</h2>
          <div className="text-right">
            {showUsed ? (
              <>
                <Modal
                  isOpen={isOpen}
                  placement={"bottom-center"}
                  onOpenChange={onOpenChange}
                  backdrop={"blur"}
                  isDismissable={false}
                  isKeyboardDismissDisabled={true}
                  hideCloseButton={true}
                >
                  <ModalContent>
                    {(onClose) => (
                      <>
                        <ModalHeader className="flex flex-col gap-1">
                          Detail Queue
                        </ModalHeader>
                        <ModalBody>
                          <Input
                            name="customer_name"
                            value={modelAdd.customer_name}
                            onChange={handleChangeData}
                            labelPlacement={"outside"}
                            placeholder="enter your sustomer name"
                            variant="bordered"
                            size={"sm"}
                            type="text"
                            label="Customer Name"
                            className="custom-input"
                          />
                          <Input
                            name="queue_number"
                            value={modelAdd.queue_number}
                            onChange={handleChangeData}
                            labelPlacement={"outside"}
                            placeholder="enter your customer number"
                            variant="bordered"
                            size={"sm"}
                            type="number"
                            label="Customer Number"
                            className="custom-input"
                          />
                          <Input
                            type="number"
                            name="party_size"
                            value={modelAdd.party_size}
                            onChange={handleChangeData}
                            labelPlacement={"outside"}
                            placeholder="enter your party size"
                            variant="bordered"
                            size={"sm"}
                            label="Party Size"
                            className="custom-input"
                          />
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
                          <Dropdown>
                            <DropdownTrigger>
                              <Button
                                className={
                                  selectedValue === "confirm"
                                    ? "text-green-300 capitalize"
                                    : "text-orange-300 capitalize"
                                }
                                startContent={
                                  selectedValue === "confirm" ? (
                                    <span className="material-symbols-outlined">
                                      check_circle
                                    </span>
                                  ) : (
                                    <span className="material-symbols-outlined">
                                      hourglass_top
                                    </span>
                                  )
                                }
                                variant="bordered"
                              >
                                {selectedValue}
                              </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Single selection example"
                              variant="flat"
                              disallowEmptySelection
                              selectionMode="single"
                              selectedKeys={selectedKeys}
                              onSelectionChange={setSelectedKeys}
                            >
                              <DropdownItem
                                startContent={
                                  <span className="material-symbols-outlined">
                                    check_circle
                                  </span>
                                }
                                key="confirm"
                                onClick={() =>
                                  setModelsAdd((prev) => ({
                                    ...prev,
                                    queue_status: "C",
                                  }))
                                }
                                className="text-green-300"
                              >
                                Confirm
                              </DropdownItem>
                              <DropdownItem
                                startContent={
                                  <span className="material-symbols-outlined">
                                    hourglass_top
                                  </span>
                                }
                                key="wait"
                                onClick={() =>
                                  setModelsAdd((prev) => ({
                                    ...prev,
                                    queue_status: "W",
                                  }))
                                }
                                className="text-orange-300"
                              >
                                Wait
                              </DropdownItem>
                            </DropdownMenu>
                          </Dropdown>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            color="danger"
                            variant="light"
                            onPress={onClose}
                          >
                            Close
                          </Button>
                          <Button
                            color="primary"
                            onPress={onClose}
                            onClick={() => saveQueue()}
                          >
                            Add
                          </Button>
                        </ModalFooter>
                      </>
                    )}
                  </ModalContent>
                </Modal>

                <Button
                  startContent={
                    <span className="material-symbols-outlined">
                      add_to_queue
                    </span>
                  }
                  className="bg-blue-300 mx-3"
                  onPress={onOpen}
                >
                  Add Queue
                </Button>
              </>
            ) : (
              <Dropdown>
                <DropdownTrigger>
                  <Button
                    startContent={
                      <span className="material-symbols-outlined">tune</span>
                    }
                    variant="bordered"
                  >
                    Status Queue
                  </Button>
                </DropdownTrigger>
                <DropdownMenu variant="faded" aria-label="Static Actions">
                  <DropdownItem
                    startContent={
                      <span className="material-symbols-outlined">
                        select_all
                      </span>
                    }
                    key="all"
                    className="text-blue-300"
                    onClick={() => setShowStatus("ALL")}
                  >
                    All Status
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <span className="material-symbols-outlined">
                        check_circle
                      </span>
                    }
                    key="confirm"
                    className="text-green-300"
                    onClick={() => setShowStatus("C")}
                  >
                    Confirm
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <span className="material-symbols-outlined">cancel</span>
                    }
                    key="succeed"
                    className="text-red-300"
                    onClick={() => setShowStatus("X")}
                  >
                    Cancel
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <span className="material-symbols-outlined">
                        recommend
                      </span>
                    }
                    key="cancel"
                    className="text-gray-400"
                    onClick={() => setShowStatus("S")}
                  >
                    Succeed
                  </DropdownItem>
                  <DropdownItem
                    startContent={
                      <span className="material-symbols-outlined">
                        hourglass_top
                      </span>
                    }
                    key="wait"
                    className="text-orange-300"
                    onClick={() => setShowStatus("W")}
                  >
                    Wait
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            )}

            <Button
              startContent={
                <span className="material-symbols-outlined">history</span>
              }
              className="bg-orange-200 mx-3"
              onClick={() => actionUsed(showUsed)}
            >
              Previous Queue
            </Button>
          </div>
        </div>
        <div className="card-table">
          <table>
            <thead>
              <tr>
                <th className="w-[3%]">#</th>
                <th className="name w-3/12">Name</th>
                <th className="w-1/12">Queue</th>
                <th className="w-1/12">Seat</th>
                <th className="w-1/12">Date</th>
                <th className="w-1/12">Time</th>
                <th className="w-1/12">Status</th>
                <th className="w-1/12"></th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((item, index) => (
                <tr key={index}>
                  <td>{indexOfFirstItem + index + 1}</td>
                  <td className="name">
                    {item.customer_name} {queueStatus(item.queue_status)}
                  </td>
                  <td>{item.queue_no}</td>
                  <td>{item.party_size}</td>
                  <td>{moment(item.time_of_booking).format("YYYY-MM-DD")}</td>
                  <td>{moment(item.time_of_booking).format("HH:MM")}</td>
                  <td>
                    <Dropdown backdrop="blur">
                      <DropdownTrigger>
                        <span className="material-symbols-outlined cursor-pointer">
                          more_vert
                        </span>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Static Actions">
                        {item.queue_status === "C" ? (
                          ""
                        ) : (
                          <DropdownItem
                            className="text-green-300"
                            onClick={() => updateStatus("C", item)}
                          >
                            confirm
                          </DropdownItem>
                        )}
                        {item.queue_status === "X" ? (
                          ""
                        ) : (
                          <DropdownItem
                            className="text-red-300"
                            onClick={() => updateStatus("X", item)}
                          >
                            cancel
                          </DropdownItem>
                        )}
                        {item.queue_status === "S" ? (
                          ""
                        ) : (
                          <DropdownItem
                            className="text-gray-400"
                            onClick={() => updateStatus("S", item)}
                          >
                            succeed
                          </DropdownItem>
                        )}
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                  <td>
                    {item.queue_used === 0 ? (
                      indexOfFirstItem + index === 0 ? (
                        <Button
                          startContent={
                            <span className="material-symbols-outlined cursor-pointer">
                              skip_previous
                            </span>
                          }
                          className="bg-slate-300 mx-3"
                          onClick={() =>
                            nextQueue(item.refID, item.queue_status)
                          }
                        >
                          Next Queue
                        </Button>
                      ) : (
                        ""
                      )
                    ) : (
                      <span className="used-pastdue">PAST DUE</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentItems.length === 0 && (
            <div className="text-center my-10">
              <h1>NO DATA</h1>
            </div>
          )}
          <div className="flex justify-end mt-5">
            <Pagination
              showControls
              total={Math.ceil(filteredModels.length / itemsPerPage)}
              initialPage={1}
              page={currentPage}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
