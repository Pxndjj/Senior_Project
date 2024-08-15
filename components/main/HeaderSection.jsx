import Image from "next/image";
import bannerImage from '@/public/images/preview-img.jpg';

const HeaderSection = () => (
  <div className="relative">
    <Image src={bannerImage} alt="Banner" className="w-full h-80 object-cover" />
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-white text-center px-4 md:px-8">
        <h1 className="text-4xl font-bold md:text-5xl">No More Queue Line, For You</h1>
        <p className="mt-2 text-lg md:text-xl">Quickly and conveniently search and book restaurant tables online. With just one click, you can check table availability.</p>
      </div>
    </div>
  </div>
);

export default HeaderSection;
