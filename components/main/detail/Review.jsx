import React, { useState } from "react";
import { Button, Modal, ModalHeader, ModalContent, ModalBody, Input, useDisclosure } from "@nextui-org/react";
import { CameraIcon } from "@/components/icon/CameraIcon";
import { useSession } from "next-auth/react";
import MessageBox from "@/components/messagebox/MessageBox";

function Review({ dataRestaurant, onReviewSubmit }) {
    const { data: session } = useSession();
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [rating, setRating] = useState(0);
    const [serve, setServe] = useState(0);
    const [food, setFood] = useState(0);
    const [atmosphere, setAtmosphere] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    // const [hoverServe, setHoverServe] = useState(0);
    // const [hoverFood, setHoverFood] = useState(0);
    // const [hoverAtmosphere, setHoverAtmosphere] = useState(0);
    const [images, setImages] = useState([]);
    const [imageFiles, setImageFiles] = useState([]);
    const [comment, setComment] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState("");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files.map(file => URL.createObjectURL(file)));
        setImageFiles(files);
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
    };

    const handleSubmit = async () => {

        if (comment.trim() === "") {
            showMessage("Please fill in your comment before posting.", "error");
            return;
        }

        if (rating <= 0) {
            showMessage("Please fill in your comment before posting.", "error");
            return;
        }


        const formData = new FormData();
        const models = {
            rating,
            serve,
            food,
            atmosphere,
            comment,
            restaurantID: dataRestaurant.refID,
            userID: session?.user?.id
        };

        if (models.comment == "") return

        imageFiles.forEach((file) => {
            formData.append('images', file);
        });

        formData.append('modelData', JSON.stringify(models));

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/review/insert`, {
                method: 'POST',
                body: formData
            });
            if (res.ok) {
                const newReview = await res.json();
                showMessage("Review submitted successfully!", "success");
                onReviewSubmit(newReview);
                onOpenChange(false);

                setRating(0);
                setServe(0);
                setFood(0);
                setAtmosphere(0);
                setComment("");
                setImages([]);
                setImageFiles([]);

            }
        } catch (error) {
            console.error('Error uploading files: ', error);
        }
    };

    const showMessage = (msg, statusType) => {
        setMessage(msg);
        setStatus(statusType);
        setTimeout(() => {
            setMessage("");
            setStatus("");
        }, 3000);
    };

    return (
        <>
            <Modal
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                backdrop={"blur"}
                isDismissable={false}
                isKeyboardDismissDisabled={true}
            >
                <ModalContent>
                    <ModalHeader className="justify-center">
                        <span className="text-2xl">{dataRestaurant.name}</span>
                    </ModalHeader>
                    <ModalBody>
                        <div className="flex justify-center">
                            {[...Array(5)].map((_, index) => {
                                index += 1;
                                return (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`text-5xl mx-3 ${index <= (hoverRating || rating) ? 'text-yellow-500' : 'text-gray-400'}`}
                                        onClick={() => setRating(index)}
                                        onMouseEnter={() => setHoverRating(index)}
                                        onMouseLeave={() => setHoverRating(rating)}
                                    >
                                        &#9733;
                                    </button>
                                );
                            })}
                        </div>
                        <div className="flex justify-center mt-4">
                            <label className="cursor-pointer flex items-center gap-2">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    multiple
                                    className="hidden"
                                />
                                <div className="border border-blue-500 rounded-full px-4 py-2 flex items-center">
                                    <CameraIcon className="w-5 h-5 text-gray-700" />
                                    <span className="text-gray-700 ml-2">Add image</span>
                                </div>
                            </label>
                        </div>
                        {images.length > 0 && (
                            <div className="flex justify-center mt-4 gap-2">
                                <img src={images[0]} alt="First Image" className="h-36 object-cover rounded-md" />
                                {images.length > 1 && (
                                    <div className="flex flex-col justify-center items-center">
                                        <span>{`+${images.length - 1} more`}</span>
                                    </div>
                                )}
                            </div>
                        )}
                        <div className="flex justify-center mt-4">
                            <Input
                                value={comment}
                                onChange={handleCommentChange}
                                type="text"
                                variant={"underlined"}
                                label="Review Restaurant"
                            />
                        </div>
                        <Button onClick={handleSubmit} className="mt-[10px]" color="primary">Post</Button>
                        <div className="flex my-4">
                            <div className="w-1/4"><h2 className="w-full text-center border-b leading-3 mt-3"></h2></div>
                            <div className="w-3/4 text-center"><h1>Thank you for your review.</h1></div>
                            <div className="w-1/4"><h2 className="w-full text-center border-b leading-3 mt-3"></h2></div>
                        </div>
                    </ModalBody>
                </ModalContent>
            </Modal>
            <div className="border-t-2 border-gray-300 mt-6 pt-4">
                <Button className="mt-[10px] w-full" onClick={onOpen} startContent={<span className="material-symbols-outlined">edit_square</span>} color="primary" variant="ghost">
                    Write a restaurant review
                </Button>
            </div>
            {message && <MessageBox message={message} status={status} />}
        </>
    );
}

export default Review;
