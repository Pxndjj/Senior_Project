"use client"
import React, { useEffect, useState } from "react";
import { Button, Image, Input, Checkbox } from "@nextui-org/react";
import { TimeInput } from "@nextui-org/react";
import { Time } from "@internationalized/date"
import { useParams } from "next/navigation";
import moment from "moment";

export default function Setup() {
  const params = useParams();
  const [showImage, setShowImage] = useState("");
  const [fileImageError, setFileImageError] = useState("");
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
    refID: "",
    _id: "",
  });

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

  useEffect(() => {
    fetchData();
    return () => {
      console.log('Component unmounted');
    };
  }, []);

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

  const deleteConditions = () => {
    const updatedModels = { ...models };
    updatedModels.conditions.pop()
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
    models.conditions = models.conditions.filter((o) => o !== "");
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
        setActionEdit(true)
      }
    } catch (error) {
      console.error('Error uploading file: ', error);
    }
  }

  const actionCancekData = async () => {
    fetchData();
    setActionEdit(true)
  }

  const handleChange = async (event) => {
    setFileImageError("")
    event.preventDefault();
    const updatedModels = { ...models };
    const selectedFile = event.target.files[0];
    if (!selectedFile || !selectedFile.name.match(/\.(jpg|jpeg|png)$/)) {
      setFileImageError("Invalid file type. Please upload an image (jpg, jpeg, png)");
      return;
    }
    updatedModels.logo = selectedFile.name;
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

  const imageStyle = {
    height: "300px",
    width: "1150px"
  }

  return (
    <main className="main-content mt-1 card-standard">
      <div className="flex justify-between pb-5">
        <h2>Restaurant/Setup</h2>
        <div className="text-right w-full">
          {
            actionEdit ?
              <>
                <div className="flex items-end justify-end ">
                  <label className="relative cursor-pointer hover:bg-gray-500 bg-gray-300 text-gray-700 hover:text-white font-semibold py-2 px-4 rounded-2xl flex items-center">
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
                  <input className="absolute hidden" onClick={() => actionCancekData()} />
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
      {fileImageError && (
        <div className="text-red-500 text-sm">{fileImageError}</div>
      )}
      <div className="grid items-center grid-cols-1 justify-center w-full md:w-4/4 px-2">
        <div className="w-full m-auto card-default">
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
              {models.conditions.length > 0 && (
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
              )}

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
                <Input name="address" value={models.address} onChange={handleChangeData} key={"outside"} labelPlacement={"outside"} placeholder="enter your restaurant=address" variant="bordered" size={"sm"} type="text" label="Restaurant Address" className="custom-input" />
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
              <Button className="bg-red-100 border-1" onClick={() => deleteConditions()} size={"sm"} startContent={<span className="material-symbols-outlined text-sm">delete</span>}>Delete Conditions</Button>
              <p className="text-[12.5px] mx-1 mt-3">Restaurant Open</p>

              <div className="flex my-1">
                <Checkbox isSelected={models.openingHours.sunday.open === "on"} onValueChange={(value) => handleCheckboxChange(value, "sunday")} radius="full">
                  <p className="text-[13px] w-[5rem]">Sunday</p>
                </Checkbox>
                {models.openingHours.sunday.open === "on" ? (
                  <>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="sunday" size={"sm"} defaultValue={new Time(models.openingHours.sunday.start)} onChange={(value) => handleTimeChange("sunday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="sunday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.sunday.to)} onChange={(value) => handleTimeChange("sunday", 'to', value)} variant="bordered" />
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
                      <TimeInput hourCycle={24} aria-label="wednesday" size={"sm"} defaultValue={new Time(models.openingHours.wednesday.start)} onChange={(value) => handleTimeChange("wednesday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="wednesday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.wednesday.to)} onChange={(value) => handleTimeChange("wednesday", 'to', value)} variant="bordered" />
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
                      <TimeInput hourCycle={24} aria-label="thursday" size={"sm"} defaultValue={new Time(models.openingHours.thursday.start)} onChange={(value) => handleTimeChange("thursday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="thursday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.thursday.to)} onChange={(value) => handleTimeChange("thursday", 'to', value)} variant="bordered" />
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
                      <TimeInput hourCycle={24} aria-label="friday" size={"sm"} defaultValue={new Time(models.openingHours.friday.start)} onChange={(value) => handleTimeChange("friday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="friday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.friday.to)} onChange={(value) => handleTimeChange("friday", 'to', value)} variant="bordered" />
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
                      <TimeInput hourCycle={24} aria-label="saturday" size={"sm"} defaultValue={new Time(models.openingHours.saturday.start)} onChange={(value) => handleTimeChange("saturday", 'start', value)} variant="bordered" />
                    </div>
                    <div className="w-auto mx-1">
                      <TimeInput hourCycle={24} aria-label="saturday" labelPlacement="outside-left" label="TO" size={"sm"} defaultValue={new Time(models.openingHours.saturday.to)} onChange={(value) => handleTimeChange("saturday", 'to', value)} variant="bordered" />
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
      </div>
    </main >
  );
}
