// app/restaurant/RestaurantPage.jsx (Server Component)
import RestaurantDashboard from "@/components/restaurant/dashboard/RestaurantDashboard";

export default async function RestaurantPage({ params }) {
  // Fetch restaurant data
  const restaurantResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/getRefID/${params.id}`, { cache: "no-store" });
  const restaurant = await restaurantResponse.json();

  // Fetch queue data
  const queueResponse = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/queue/all/${restaurant._id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  const queueData = await queueResponse.json();

  return (
    <main className="main-content">
      <h1>Restaurant/dashboard</h1>
      <RestaurantDashboard data={queueData} />
    </main>
  );
}
