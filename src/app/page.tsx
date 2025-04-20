import AALogo from "@/components/aa-logo";
import Logo from "@/components/logo";
import TransformPlayground from "@/components/matrix-manipulation";
import Link from "next/link";

export default function Home() {
  return (
    <div className="text-sm font-semibold flex relative flex-col items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <main className="flex  row-start-2 items-center sm:items-start"> */}
      <style>
        {`@keyframes logo-move {
          0%, 15%  {
            transform: matrix(1, 0, 0, 1, 0, 0);
          }
          25%, 40% {
            transform: matrix(1, 0, 0, 0.3, 0, 0);
          }
          57% {
            transform: matrix(0.3, 0, 0, 1, 30, 0);
          }
          75%, 90% {
            transform: matrix(1, 0, 0, 0.3, 0, 30);
          }
          100% {
            transform: matrix(1, 0, 0, 1, 0, 0);
          }
        }`}
      </style>
      <div className=" absolute top-2 left-2 flex border-2 border-black ">
        <Link className=" bg-black absolute top-0 left-0 z-0" href="https://www.animationapi.com" target="_blank">
          <AALogo />
        </Link>
        <div className=" bg-foreground z-10 origin-top-left [animation:logo-move_5s_cubic-bezier(0.175,0.885,0.32,1.275)_alternate_infinite]">
          <Logo />
        </div>
      </div>
      <div className=" flex flex-col items-center justify-items-center">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          TransformLab
        </h1>
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Play around with different CSS tranforms. See how these imapct the
          transform matrix (2d/3d)
        </p>
      </div>
      <TransformPlayground />
      {/* </main> */}
    </div>
  );
}
