import React, { useEffect, useState } from "react";
import { Dropdown, DropdownMenu, DropdownTrigger, DropdownItem, Pagination, Button } from "@nextui-org/react";
import _ from 'lodash';

function TableQueue({ userID, showUsed, showStatus, models, fetchData }) {
  const itemsPerPage = 5;

  // สร้าง state สำหรับการจัดการหน้าของแต่ละตาราง
  const [pageStates, setPageStates] = useState({});

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
      default:
        return null;
    }
  };

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
      return res.ok;
    }
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

  const filteredModels = models
    .filter((o) => (showUsed ? o.queue_used === 0 : o.queue_used === 1))
    .filter((o) => (showStatus === "ALL" || o.queue_used === 0 ? true : showStatus === o.queue_status));

  const groupedBy = _.groupBy(filteredModels, 'queue_date');

  const sortedEntries = Object.entries(groupedBy).sort(([date1], [date2]) => new Date(date2) - new Date(date1));

  const handlePageChange = (queueDate, page) => {
    setPageStates((prevState) => ({
      ...prevState,
      [queueDate]: page,
    }));
  };

  return (
    <>
      {sortedEntries.map(([queueDate, data]) => {
        const currentPage = pageStates[queueDate] || 1;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = data.slice(indexOfFirstItem, indexOfLastItem);
        const totalPages = Math.ceil(data.length / itemsPerPage);

        return (
          <div key={queueDate} className="mb-6 p-6 border border-gray-200 rounded-lg shadow-md">
            <div>
              <h2>{queueDate}</h2>
            </div>
            <div>
              <table>
                <thead>
                  <tr>
                    <th className="w-[5%]">#</th>
                    <th className="name w-[16%]">Name</th>
                    <th className="w-[10%]"></th>
                    <th className="w-[7%]">Queue</th>
                    <th className="w-[7%]">Seat</th>
                    <th className="w-[15%]">Booking Date</th>
                    <th className="w-[15%]">BookingTime</th>
                    <th className="w-[10%]">Status</th>
                    <th className="w-[25px]">123</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1 + (currentPage - 1) * itemsPerPage}</td>
                      <td className="name">
                        <p className="text-lg m-0 mb-0 font-bold">{item.customer_name}</p>
                        <p className="text-[17px] text-gray-400">{item.customer_number}</p>
                      </td>
                      <td>{queueStatus(item.queue_status)}</td>
                      <td>{item.queue_no}</td>
                      <td>{item.party_size}</td>
                      <td>{setTimeShow(item.time_of_booking)?.date}</td>
                      <td>{setTimeShow(item.time_of_booking)?.time}</td>
                      <td>
                        <Dropdown backdrop="blur">
                          <DropdownTrigger><span className="material-symbols-outlined cursor-pointer">more_vert</span></DropdownTrigger>
                          <DropdownMenu aria-label="Static Actions">
                            {item.queue_status === "C" ? ("") : (<DropdownItem className="text-green-300" onClick={() => updateStatus("C", item)}>confirm</DropdownItem>)}
                            {item.queue_status === "X" ? ("") : (<DropdownItem className="text-red-300" onClick={() => updateStatus("X", item)}>cancel</DropdownItem>)}
                            {item.queue_status === "S" ? ("") : (<DropdownItem className="text-gray-400" onClick={() => updateStatus("S", item)}>succeed</DropdownItem>)}
                          </DropdownMenu>
                        </Dropdown>
                      </td>
                      <td>
                        {item.queue_used === 0 && setTimeShow(new Date())?.date === setTimeShow(queueDate)?.date ? (
                          indexOfFirstItem + index === 0 ? (
                            <Button startContent={<span className="material-symbols-outlined cursor-pointer">skip_previous</span>} className="bg-slate-300 mx-3" onClick={() => nextQueue(item.refID, item.queue_status)}>
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
              <hr className="border-t-1 border-gray-200 my-4"></hr>
              <div className="flex justify-end">
                <Pagination total={totalPages} initialPage={1} page={currentPage} onChange={(page) => handlePageChange(queueDate, page)} />
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default TableQueue;
