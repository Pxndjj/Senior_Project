import RestaurantMenu from "@/components/restaurant/RestaurantMenu";
import RestaurantRight from "@/components/restaurant/RestaurantRight";
import { ToastContainer} from 'react-toastify';
import "../../style/admin.css";
export const metadata = {
  title: "่joyfulwait",
  description: "search nearby restuarant",
};
// const fetchDataLayout = async (refID) => {
//   try {
//     const respons = await fetch(`${process.env.NEXT_PUBLIC_BACKEND}/restaurant/getdatapagebyrefid/${refID}`, {
//       cache: 'no-store',
//       method: 'GET',
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json'
//       },
//     });
//     const dataJson = await respons.json();
//     return dataJson;
//   } catch (error) {
//     console.error('Error fetching data:', error);
//   }
// };

export default async function RootLayout({ children,params}) {
  // await fetchDataLayout(params.id);
  const dataLayout = {};
  return (
    <div className="container-admin">
        {/* Sidebar Section */}
        <RestaurantMenu/>
        {children}
        <RestaurantRight dataPackage={dataLayout} params={params}/>
        <ToastContainer />
    </div>
  );
}
