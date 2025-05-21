import Schedule from "@/components/template/schedule";
export default function Home() {
  return (
    <div className="container sm:mx-auto min-h-screen">
      <main className="min-h-screen flex flex-col items-center justify-center mx-4 sm:mx-0 py-15 sm:py-20">
        <Schedule />
      </main>
    </div>
  );
};