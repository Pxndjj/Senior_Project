"use client";
import React, {useState } from "react";
import GalleryDisplay from "./GalleryDisplay";

const GalleryPreview = ({filePreview}) => {
    const [showDetail, setShowDetail] = useState(false);
    const handleItemClick = () => {
        setShowDetail(true);
      };
    
      const handleCloseItem = () => {
        setShowDetail(false);
      };
    return ( 
        <div className="container-overlay">
            <div onClick={handleItemClick} className="overlay"></div>
           <GalleryDisplay isOpen={showDetail} onClose={handleCloseItem} item={filePreview} />
        </div>
    )
    }  
    export default GalleryPreview;
      