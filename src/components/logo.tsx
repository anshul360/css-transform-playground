import Image from "next/image";
import logo_image from "../../public/logo.png"

export default function Logo() {
    return <Image src={logo_image} alt="Banner Bun Home" className=" size-10"/>
}