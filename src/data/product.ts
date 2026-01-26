import earbudsImg from "../assets/products/earbuds.jpg";
import LogitechImg from "../assets/products/Logitech Keyboard.jpg";
import iphonegreenImg from "../assets/products/iphonegreen.jpg";
import iphonePromaxImg from "../assets/products/iphonePromax.jpg";
import ipadImg from "../assets/products/ipad.jpg";
import CameraUltraImg from "../assets/products/Camera Ultra.jpg";
import laptopImg from "../assets/products/laptop.jpg";
import speakerImg from "../assets/products/speaker.jpg";

export type Product = {
  id: string;
  title: string;
  price: number;
  category: "Laptops" | "Phones" | "Audio" | "Accessories" | "Keyboard";
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: "p1",
    title: "UltraSlim Laptop 14”",
    price: 899,
    category: "Keyboard",
    image: laptopImg,
    description: "Lightweight laptop for work and study.",
  },
  {
    id: "p2",
    title: "5G Smartphone (128GB)",
    price: 2599,
    category: "Phones",
    image: iphonegreenImg,
    description: "Fast performance, sharp camera, 5G ready.",
  },
  {
    id: "p3",
    title: "Pro Wireless Earbuds",
    price: 2229.99,
    category: "Audio",
    image: iphonePromaxImg,
    description: "Clear sound, comfortable fit, compact case.",
  },

  {
    id: "p4",
    title: "Pro Wireless Earbuds",
    price: 129.99,
    category: "Audio",
    image: ipadImg,
    description: "Clear sound, comfortable fit, compact case.",
  },
  {
    id: "p5",
    title: "Pro Wireless Earbuds",
    price: 1029.99,
    category: "Audio",
    image: CameraUltraImg,
    description: "Clear shot, compact lens.",
  },
  {
    id: "p6",
    title: "Pro Wireless Earbuds",
    price: 250,
    category: "Audio",
    image: earbudsImg,
    description: "Clear sound, comfortable fit, compact case.",
  },
  {
    id: "p7",
    title: "Pro Wireless Earbuds",
    price: 129.99,
    category: "Audio",
    image: speakerImg,
    description: "Clear sound, comfortable fit, compact case.",
  },

  {
    id: "p8",
    title: "Pro Wireless Earbuds",
    price: 129.99,
    category: "Audio",
    image: LogitechImg,
    description: "Clear sound, comfortable fit, compact case.",
  },
];
