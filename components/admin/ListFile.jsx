import React, { useState, useEffect } from "react";
import { Button, Modal, ModalFooter, ModalHeader, ModalContent, ModalBody, useDisclosure } from "@nextui-org/react";

const api = {
    fetchData: async (id) => {
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
            return null;
        }
    },
};

function ListFile({ _id }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [dataFile, setDataFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const data = await api.fetchData(_id);
            setDataFile(data);
            setLoading(false);
        };

        fetchData();
    }, [_id]);

    const handleViewClick = (fileName) => {
        const fileUrl = `${process.env.NEXT_PUBLIC_BACKEND}/uploadfile/preview/${fileName}`;
        setSelectedFile(fileUrl);
        onOpen();
    };

    return (
        <>
            <Modal size={"4xl"} isOpen={isOpen} placement={"bottom-center"} onOpenChange={onOpenChange} backdrop={"blur"} isDismissable={false} isKeyboardDismissDisabled={true} hideCloseButton={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">File List</ModalHeader>
                            <ModalBody>
                                {loading ? (
                                    <p>Loading...</p>
                                ) : (
                                    <div>
                                        <table className="min-w-full bg-white border border-gray-200 rounded-md shadow-md">
                                            <thead className="bg-gray-100 border-b">
                                                <tr>
                                                    <th className="py-2 px-4 text-left text-gray-600">No.</th>
                                                    <th className="py-2 px-4 text-left text-gray-600">File</th>
                                                    <th className="py-2 px-4"></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {dataFile && dataFile.map((file, index) => (
                                                    <tr key={file.fileName} className="border-b hover:bg-gray-50">
                                                        <td className="py-2 px-4 text-center">{index + 1}</td>
                                                        <td className="py-2 px-4 text-left">{file.fileName}</td>
                                                        <td className="py-2 px-4">
                                                            <Button auto size="sm" color="primary" onPress={() => handleViewClick(file.fileName)}>View</Button>
                                                        </td>
                                                    </tr>
                                                ))}
                                                {!dataFile && (
                                                    <tr>
                                                        <td colSpan="3" className="py-4 text-center text-gray-500">No files available</td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                        {selectedFile && (
                                            <div className="mt-4">
                                                <iframe
                                                    src={selectedFile}
                                                    className="w-full h-96"
                                                    title="PDF Viewer"
                                                ></iframe>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>Close</Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>

            <Button startContent={<span className="material-symbols-outlined">article</span>} className="bg-blue-300 mx-3 w-full" onPress={onOpen}>
                File Restaurant
            </Button>
        </>
    );
}

export default ListFile;
