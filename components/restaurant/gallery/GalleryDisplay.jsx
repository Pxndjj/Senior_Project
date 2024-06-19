"use client";
import { usePathname } from 'next/navigation'
import { actionRevalidatePath } from '@/actions/action-revalidate-path';

const GalleryDisplay = ({ isOpen, onClose, item }) => {
  const pathname = usePathname();
  const imgSrc = `${process.env.NEXT_PUBLIC_BACKEND}/gallery/preview/${item.fileName}`;
  const actionDelete = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/gallery/del/${item._id}`, {
      method: 'DELETE',
    });
    onClose();
    actionRevalidatePath(pathname);
  }
  const eventClose = () => {
    onClose();
  }
  if (!isOpen) return null;
  return (
    <div className={isOpen ? "img-pre open" : "img-pre"}>
      <img src={imgSrc} />
      <span onClick={eventClose} className="material-symbols-outlined close">close</span>
      <span onClick={actionDelete} className="material-symbols-outlined delete">delete</span>
    </div>
  );
};
export default GalleryDisplay;
