"use client"; 
import React, { useEffect, useState } from "react";
import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useParams } from "next/navigation";
import moment from 'moment';
import 'moment/locale/th'; // นำเข้า locale ภาษาไทย

//api
const api = {
  fetchNotifications:async(_id)=>{
    try {
      const resModels = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/notifications/${_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
      });
      const result = await resModels.json();
      return result;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  changeStatusReadNotification:async(obj)=>{
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/notificationmessage/${obj._id}`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json',},
        body: JSON.stringify({ data: obj }),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  }
}

//component
const ListNotification = () => {
  const params = useParams();
  const [notifications, setNotifications] = useState([]);
  const [msg, setMsg] = useState({});  
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const showIcon = (_type) => {
    switch (_type) {
      case 'wait':
        return <span className="material-symbols-outlined"> hourglass</span>;
      case 'confirm':
        return <span className="material-symbols-outlined">done</span>;
      default:
        return <span className="material-symbols-outlined">speaker_notes</span>;
    }
  };
  const showIconClassName = (_type) => {
    switch (_type) {
      case 'wait':
        return 'notification msg-warn';
      case 'confirm':
        return 'notification';
      default:
        return 'notification';
    }
  };
  const showDateTime = (_date)=>{
    return moment(_date).format('YYYY-MM-DD HH:mm');
  }
  const handleModal = (obj) => {
    setMsg({});
    setMsg(obj);
    onOpen();
  }
  const updateAndLoadNotification = async(obj,onclose)=>{
    let objUpdate = obj;
    objUpdate.read = true;
    await api.changeStatusReadNotification(objUpdate);
    let result = await api.fetchNotifications(params.id);
    setNotifications(result);
    onclose();

  }
//onMounted
useEffect(() => {
  (async ()=>{
    let _noti = await api.fetchNotifications(params.id);
    setNotifications(_noti);
  })();

}, []);

return ( 
  <>
  <div className="reminders">
  <div className="header">
    <h2>Messages</h2>
    <span className="material-symbols-outlined">notifications</span>
  </div>
  {notifications.map((noti, index) => (
  <div  onClick={()=>handleModal(noti)} key={index} className={showIconClassName(noti.type)}>
         <div className="icon">{showIcon(noti.type)}</div>
         <div className="content">
      <div className="info">
        <h3 className="title-msg">{noti.title}</h3>
        <small className="text_muted">{showDateTime(noti.timestamp)}</small>
      </div>
    </div>
  </div>
    ))}
</div> 
  <Modal 
  backdrop="opaque" 
  isOpen={isOpen} 
  onOpenChange={onOpenChange}
  classNames={{backdrop: "blur"}}
  >
  <ModalContent>
    {(onClose) => (
      <>
        <ModalHeader className="flex flex-col gap-1">{msg.type}</ModalHeader>
        <ModalBody>
          <h5> {msg.title}</h5>
          <p>{msg.message}</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={()=>updateAndLoadNotification(msg,onClose)}>Close</Button>
        </ModalFooter>
      </>
    )}
  </ModalContent>
  </Modal>
  </>
)
}
export default ListNotification;
  