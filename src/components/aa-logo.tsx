import Image from "next/image";
import logo_image from "../../public/aa-logo.svg"

export default function AALogo() {
    return <Image src={logo_image} alt="Banner Bun Home" className=" size-10"/>
}