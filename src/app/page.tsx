import Schedule from "@/components/template/schedule";

export default function Home() {
  return (
    <div className="container mx-auto min-h-screen">
      <main className="min-h-screen flex flex-col items-center justify-center">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-6xl font-bold mb-4">The Big Schedule Agenda</h1>
        </div>
        <Schedule />
      </main>
    </div>
  );
}
