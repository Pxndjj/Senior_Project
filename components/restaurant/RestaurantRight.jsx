"use server";
import NavbarUser from "./NavbarUser";
const RestaurantRight = async ({ dataPackage, params }) => {
  return (
    <div className="right-section">
      <NavbarUser />
    </div>
  );
};

export default RestaurantRight;
