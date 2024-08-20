import RestaurantMenu from "@/components/admin/RestaurantMenu";
import "@/app/style/admin.css";
export const metadata = {
  title: "่joyfulwait",
  description: "search nearby restuarant",
};

export default function RootLayout({ children }) {
  return (
    <div className="container-admin">
      <RestaurantMenu />
      <div className="space-y-10 mt-10">
        {children}
      </div>
    </div>
  );
}
