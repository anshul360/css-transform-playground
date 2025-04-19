import TransformPlayground from "@/components/matrix-manipulation";

export default function Home() {
  return (
    <div className="flex items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      {/* <main className="flex  row-start-2 items-center sm:items-start"> */}
        <TransformPlayground />
      {/* </main> */}
    </div>
  );
}
