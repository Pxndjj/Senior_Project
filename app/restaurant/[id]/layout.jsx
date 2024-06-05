import RestaurantMenu from "@/components/restaurant/RestaurantMenu";
import "../../style/admin.css";
export const metadata = {
  title: "่joyfulwait",
  description: "search nearby restuarant",
};
const fetchDataLayout = async (refID) => {
  try {
    const respons = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/getdatapagebyrefid/${refID}`, {
      cache: 'no-store',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
    });
    const dataJson = await respons.json();
    return dataJson;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export default async function RootLayout({ children,params}) {
  const dataLayout = await fetchDataLayout(params.id);
  return (
    <div className="container-admin">
        {/* Sidebar Section */}
        <RestaurantMenu/>
        {children}
    </div>
  );
}
