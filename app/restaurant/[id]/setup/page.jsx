"use client"
import React, { useEffect, useMemo, useState } from "react";
import { Button, Image, Input, Checkbox, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Pagination, getKeyValue } from "@nextui-org/react";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date"
import { useParams } from "next/navigation";
import moment from "moment";
import MessageBox from "@/components/messagebox/MessageBox";

export default function Setup() {
  const params = useParams();
  const [showImage, setShowImage] = useState("");
  const [dataFile, setDataFile] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [models, setModels] = useState({
    name: "",
    address: "",
    phone: "",
    notes: "",
    conditions: [],
    openingHours: {
      monday: { start: "", to: "", open: "" },
      tuesday: { start: "", to: "", open: "" },
      wednesday: { start: "", to: "", open: "" },
      thursday: { start: "", to: "", open: "" },
      friday: { start: "", to: "", open: "" },
      saturday: { start: "", to: "", open: "" },
      sunday: { start: "", to: "", open: "" }
    },
    logo: "",
    latitude: 0,
    longitude: 0,
    reservationRequired: false,
    status: "",
    refID: "123",
    _id: "",
  });


  const handleViewClick = (fileName) => {
    const fileUrl = `${process.env.NEXT_PUBLIC_BACKEND}/uploadfile/preview/${fileName}`;
    setSelectedFile(fileUrl);
  };

  const fetchData = async () => {
    try {
      const resModels = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/get?id=${params.id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      const data = await resModels.json();

      setShowImage(`${process.env.NEXT_PUBLIC_BACKEND}/storage/image/${data._id + data.logo}`);
      setModels(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchDataFile = async (id) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/uploadfile/get/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });

      if (!res.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error('Error fetching data:', error);
      return [];
    }
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
  const fetchFile = async () => {
    const data = await fetchDataFile(models.refID);
    setDataFile(data);
    setLoading(false);
  };

  useEffect(() => {
    const fetchDataAndFile = async () => {
      await fetchData();
      fetchFile();
    };

    fetchDataAndFile();

    return () => {
      console.log('Component unmounted');
    };
  }, [models.refID]);


  const [actionEdit, setActionEdit] = useState(true);
  const [file, setFile] = useState(null);

  const handleCheckboxChange = (value, day) => {
    setModels(prevState => ({
      ...prevState,
      openingHours: {
        ...prevState.openingHours,
        [day]: {
          ...prevState.openingHours[day],
          open: value ? "on" : "off"
        }
      }
    }));
  };

  const handleTimeChange = (day, type, value) => {
    const updatedModels = { ...models };
    if (type === 'start') {
      updatedModels.openingHours[day].start = moment(value).format("HH:mm").toString();
    } else if (type === 'to') {
      updatedModels.openingHours[day].to = moment(value).format("HH:mm").toString();
    }
    setModels(updatedModels);
  };

  const setAddConditions = () => {
    const updatedModels = { ...models };
    updatedModels.conditions.push("")
    setModels(updatedModels);
  }

  const handleChangeData = (e) => {
    const { name, value } = e.target;
    setModels((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleChangeDataConditions = (index, newValue) => {
    const updatedConditions = [...models.conditions];
    updatedConditions[index] = newValue;

    setModels(prevState => ({
      ...prevState,
      conditions: updatedConditions,
    }));
  };

  const actionSaveData = async () => {
    models.conditions.filter((o) => o !== "");
    models.refID = params.id;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('modelData', JSON.stringify(models));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/update`, {
        method: 'POST',
        body: formData
      });
      if (res.ok) {
        showMessage("setup succeeded!", "success")
        setActionEdit(true)
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  }

  const actionCancelData = async () => {
    fetchData();
    setActionEdit(true)
  }

  const handleChange = async (event) => {
    event.preventDefault();
    const updatedModels = { ...models };
    if (!event.target.files || !event.target.files[0].name.match(/\.(jpg|jpeg|png)$/)) {
      setFileImageError("Invalid file type. Please upload an image (jpg, jpeg, png)")
      return;
    }
    updatedModels.logo = event.target.files[0].name;
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setShowImage(URL.createObjectURL(selectedFile));
    setModels(updatedModels);
  };

  const fetchLocation = () => {
    if (navigator.geolocation) {
      const updatedModels = { ...models };
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;

        updatedModels.latitude = latitude;
        updatedModels.longitude = longitude;

        setModels(updatedModels);
      },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  };


  const upload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      console.error('No file selected');
      return;
    }

    // Ensure the file is a PDF
    if (file.type !== "application/pdf") {
      console.error('Invalid file type. Please upload a PDF file.');
      showMessage("Invalid file type. Please upload a PDF file.", "error");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', params.id);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/uploadfile/upload`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        showMessage("Upload succeeded!", "success");
        fetchFile();
        setActionEdit(true);
      } else {
        console.error('Upload failed.');
        showMessage("Upload failed.", "error");
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
      showMessage("Error uploading file.", "error");
    }
  };


  const imageStyle = {
    height: "340px",
  }

  return (
    <main className="main-content mt-1 card-standard">
      {message && <MessageBox message={message} status={status} />}
      <div className="flex justify-between pb-5">
        <h2>
          Restaurant/Setup{" "}
          {models.status === "inactive" ? (
            <span className="text-yellow-400">{models.status}</span>
          ) : models.status === "reject" ? (
            <span className="text-red-400">{models.status}</span>
          ) : (
            <span className="text-green-400">{models.status}</span>
          )}
        </h2>

        <div className="text-right">
          {
            actionEdit ?
              <>
                <div className="flex items-end justify-end">
                  <label className="relative cursor-pointer hover:bg-gray-500 bg-blue-300 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
                    <span className="material-symbols-outlined">upload_file</span>
                    <span className="text-base">Upload File</span>
                    <input
                      type="file"
                      accept="application/pdf" // Accept only PDF files
                      className="absolute hidden"
                      onChange={upload}
                    />
                  </label>
                  <label className="mx-5 relative cursor-pointer hover:bg-gray-500 bg-gray-300 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
                    <span className="material-symbols-outlined mr-2 text-sm">edit</span>
                    <span className="text-base">Edit Page</span>
                    <input className="absolute hidden" onClick={() => setActionEdit(false)} />
                  </label>
                </div>

              </>
              :
              <div className="flex items-end justify-end ">
                <label className="relative cursor-pointer hover:bg-red-700 bg-red-400 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
                  <span className="material-symbols-outlined mr-2 text-sm">cancel</span>
                  <span className="text-base">Cancel</span>
                  <input className="absolute hidden" onClick={() => actionCancelData()} />
                </label>
                <label className="mx-3 relative cursor-pointer hover:bg-green-700 bg-green-400 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
                  <span className="material-symbols-outlined mr-2 text-sm">save</span>
                  <span className="text-base">Save Page</span>
                  <input className="absolute hidden" onClick={() => actionSaveData()} />
                </label>
                <label htmlFor="file-upload" className="relative cursor-pointer hover:bg-blue-500 bg-gray-200 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
                  <span className="material-symbols-outlined mr-2 text-sm">upload</span>
                  <span className="text-base">Upload</span>
                  <input type="file" id="file-upload" accept="image/*" multiple className="absolute hidden" onChange={handleChange} />
                </label>
              </div>

          }
        </div>
      </div>
      <div className="flex justify-center md:w-4/4 px-2">
        <div className="w-[60%] card-default">
          <img style={imageStyle} className="img-card" src={showImage} alt={`Photo ${models.logo}`} />
          {actionEdit ? (
            <>
              <h1 className="mt-3"> {models.name}</h1>
              <p className="flex text-sm my-3">
                <span className="material-symbols-outlined">location_on</span>
                <span className="ml-2 mt-1">{models.address}</span>
              </p>
              <p className="flex text-sm my-3">
                <span className="material-symbols-outlined">call</span>
                <span className="ml-3 mt-1">{models.phone}</span>
              </p>
              <p className="flex text-sm my-3">
                <span className="material-symbols-outlined">description</span>
                <span className="ml-3 mt-1">{models.notes}</span>
              </p>
              <div className="grid grid-flow-col-dense auto-rows-min w-fit my-3">
                <span className="material-symbols-outlined">conditions</span>
                <div className="text-sm">
                  {models.conditions.map((item, index) => (
                    <React.Fragment key={index}>
                      <span className="ml-3 mt-1">{item}</span>
                      {index !== models.conditions.length - 1 && <br />}
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <div className="grid grid-flow-col-dense auto-rows-min w-fit my-3">
                <span className="material-symbols-outlined">event_available</span>
                <div className="text-sm">
                  <p className="ml-3 mt-1">Monday: {models.openingHours.monday.open === "off" ? "Out Of Service" : `${models.openingHours.monday.start} - ${models.openingHours.monday.to}`}</p>
                  <p className="ml-3 mt-1">Tuesday: {models.openingHours.tuesday.open === "off" ? "Out Of Service" : `${models.openingHours.tuesday.start} - ${models.openingHours.tuesday.to}`}</p>
                  <p className="ml-3 mt-1">Wednesday: {models.openingHours.wednesday.open === "off" ? "Out Of Service" : `${models.openingHours.wednesday.start} - ${models.openingHours.wednesday.to}`}</p>
                  <p className="ml-3 mt-1">Thursday: {models.openingHours.thursday.open === "off" ? "Out Of Service" : `${models.openingHours.thursday.start} - ${models.openingHours.thursday.to}`}</p>
                  <p className="ml-3 mt-1">Friday: {models.openingHours.friday.open === "off" ? "Out Of Service" : `${models.openingHours.friday.start} - ${models.openingHours.friday.to}`}</p>
                  <p className="ml-3 mt-1">Saturday: {models.openingHours.saturday.open === "off" ? "Out Of Service" : `${models.openingHours.saturday.start} - ${models.openingHours.saturday.to}`}</p>
                  <p className="ml-3 mt-1">Sunday: {models.openingHours.sunday.open === "off" ? "Out Of Service" : `${models.openingHours.sunday.start} - ${models.openingHours.sunday.to}`}</p>
                </div>
              </div>
            </>
          ) : (
            <>

              <div className="w-2/2 mt-[25px]">
                <Input name="name" value={models.name} onChange={handleChangeData} key={"outside"} labelPlacement={"outside"} placeholder="enter your restaurant-name" variant="bordered" size={"sm"} type="text" label="Restaurant Name" className="custom-input" />
              </div>
              <div className="w-2/2 mt-[25px]">
                <Input name="address" value={models.address} onChange={handleChangeData} key={"outside"} labelPlacement={"outside"} placeholder="enter your restaurant-address" variant="bordered" size={"sm"} type="text" label="Restaurant Address" className="custom-input" />
              </div>
              <div className="flex mt-[5px]">
                <Button className="bg-blue-100 border-1" onClick={fetchLocation} size={"sm"} startContent={<span className="material-symbols-outlined">person_pin_circle</span>}>Add Location</Button>
                <p className="text-[12.5px] mx-1 mt-2">Latitude : {models.latitude}</p>
                <p className="text-[12.5px] mx-1 mt-2">Longitude : {models.longitude}</p>
              </div>
              <div className="w-2/2 mt-[25px]">
                <Input name="phone" value={models.phone} onChange={handleChangeData} key={"outside"} labelPlacement={"outside"} placeholder="enter your restaurant-phone" variant="bordered" size={"sm"} type="text" label="Restaurant Phone" className="custom-input" />
              </div>
              <div className="w-2/2 mt-[25px]">
                <Input name="notes" value={models.notes} onChange={handleChangeData} key={"outside"} labelPlacement={"outside"} placeholder="enter your restaurant-notes" variant="bordered" size={"sm"} type="text" label="Restaurant Notes" className="custom-input" />
              </div>
              <div className="w-2/2 mt-[25px]">
                {models.conditions.map((item, index) => (
                  <Input className="my-1 custom-input" key={index} name={`conditions[${index}]`} value={item} onChange={e => handleChangeDataConditions(index, e.target.value)} labelPlacement="outside" placeholder="enter your restaurant-conditions"
                    variant="bordered" size="sm" type="text" label={index === 0 ? "Restaurant Conditions" : ""} />
                ))}
              </div>
              <Button className="bg-orange-100 border-1" onClick={() => setAddConditions()} size={"sm"} startContent={<span className="material-symbols-outlined text-sm">add_circle</span>}>Add Conditions</Button>
              <p className="text-[12.5px] mx-1 mt-3">Restaurant Open</p>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.sunday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "sunday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Sunday</p>
                </Checkbox>
                {models.openingHours.sunday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="monday" size={"sm"} defaultValue={new Time(models.openingHours.sunday.start)} onChange={(value) => handleTimeChange("sunday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="monday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.sunday.to)} onChange={(value) => handleTimeChange("sunday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.monday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "monday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Monday</p>
                </Checkbox>
                {models.openingHours.monday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="monday" size={"sm"} defaultValue={new Time(models.openingHours.monday.start)} onChange={(value) => handleTimeChange("monday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="monday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.monday.to)} onChange={(value) => handleTimeChange("monday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.tuesday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "tuesday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Tuesday</p>
                </Checkbox>
                {models.openingHours.tuesday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" size={"sm"} defaultValue={new Time(models.openingHours.tuesday.start)} onChange={(value) => handleTimeChange("tuesday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.tuesday.to)} onChange={(value) => handleTimeChange("tuesday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.wednesday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "wednesday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Wednesday</p>
                </Checkbox>
                {models.openingHours.wednesday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" size={"sm"} defaultValue={new Time(models.openingHours.wednesday.start)} onChange={(value) => handleTimeChange("wednesday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.wednesday.to)} onChange={(value) => handleTimeChange("wednesday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.thursday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "thursday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Thursday</p>
                </Checkbox>
                {models.openingHours.thursday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" size={"sm"} defaultValue={new Time(models.openingHours.thursday.start)} onChange={(value) => handleTimeChange("thursday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.thursday.to)} onChange={(value) => handleTimeChange("thursday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.friday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "friday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Friday</p>
                </Checkbox>
                {models.openingHours.friday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" size={"sm"} defaultValue={new Time(models.openingHours.friday.start)} onChange={(value) => handleTimeChange("friday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.friday.to)} onChange={(value) => handleTimeChange("friday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.saturday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "saturday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Saturday</p>
                </Checkbox>
                {models.openingHours.saturday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" size={"sm"} defaultValue={new Time(models.openingHours.saturday.start)} onChange={(value) => handleTimeChange("saturday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="tuesday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.saturday.to)} onChange={(value) => handleTimeChange("saturday", 'to', value)} variant="bordered" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="w-[100px] mt-1 mx-1">
                      <p className="text-red-300 text-[13px]">OFF</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <div className="w-[40%] ml-10 card-default">
          <h1>Upload</h1>
          <p className="text-red-500 text-sm mb-2">Only PDF files are allowed for upload.</p> {/* Warning message */}
          <p className="text-gray-700 text-sm mb-4">Please upload the following files:</p>
          <ul className="list-disc list-inside text-gray-700 text-sm mb-4">
            <li>PDF of your ID card</li>
            <li>PDF of the business license</li>
          </ul> {/* Note about required files */}
          <>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div>
                {dataFile.length <= 0 ? (
                  <>
                    <h1>NO DATA</h1>
                  </>
                ) : (
                  <>
                    <Table
                      aria-label="Example table with client-side pagination"
                      classNames={{
                        base: "max-h-[190px]",
                        table: "min-h-[150px]",
                      }}
                    >
                      <TableHeader>
                        <TableColumn>Name</TableColumn>
                        <TableColumn>View</TableColumn>
                      </TableHeader>
                      <TableBody>
                        {dataFile.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.fileName}</TableCell>
                            <TableCell>
                              <Button auto size="sm" color="primary" onClick={() => handleViewClick(item.fileName)}>
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {selectedFile && (
                      <div className="mt-4">
                        <iframe
                          src={selectedFile}
                          className="w-full h-[30rem]"
                          title="PDF Viewer"
                        ></iframe>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        </div>
      </div>
    </main >
  );
}
