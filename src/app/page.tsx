import Schedule from "@/components/template/schedule";

export default function Home() {
  return (
    <div className="container sm:mx-auto min-h-screen">
      <main className="min-h-screen flex flex-col items-center justify-center mx-4 sm:mx-0">
        <div className="mb-12">
          <h4 className="text-lg sm:text-2xl font-normal mb-4">The Big Schedule Agenda</h4>
          <h1 className="text-3xl sm:text-6xl font-light">What schedule would you like to create today?</h1>
        </div>
        <div className="w-full flex flex-col justify-center">
          <Schedule />
        </div>
      </main>
    </div>
  );
}
