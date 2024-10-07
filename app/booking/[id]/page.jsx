"use server";

import Table from "@/components/main/booking/Table";

export default async function Page({ params }) {
    let data = [];
    let error = null;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue/getbyuserid/${params.id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            cache: 'no-store',
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        data = await response.json();

    } catch (err) {
        error = err.message;
    }

    return (
        <div className="p-10 bg-white">
            <Table modelBooking={data} />
        </div>
    );
}
