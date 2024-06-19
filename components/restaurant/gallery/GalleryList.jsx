"use server";
import GalleryPreview from "./GalleryPreview";
const GalleryList = async ({dataGallery}) => {
return ( 
<div className="card-standard pt-5">
<div className="grid grid-cols-2 gap-5 items-start">
        {dataGallery.map((photo, index) => (
            <div key={index} className="img-container">
                <img
                className="img-card"
                key={index}
                src={`${process.env.NEXT_PUBLIC_BACKEND}/gallery/preview/${photo.fileName}`}
                alt={`Photo ${photo.fileName}`}
                />
                <GalleryPreview filePreview={photo}/>
            </div>
        ))}
</div>
</div>
)
}
export default GalleryList;
  