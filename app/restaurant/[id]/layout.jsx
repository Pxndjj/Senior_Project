import RestaurantMenu from "@/components/restaurant/RestaurantMenu";
import { ToastContainer} from 'react-toastify';
import "../../style/admin.css";
export const metadata = {
  title: "่joyfulwait",
  description: "search nearby restuarant",
};

export default async function RootLayout({ children,params}) {
  return (
    <div className="container-admin">
        <RestaurantMenu/>
        {children}
    </div>
  );
}
