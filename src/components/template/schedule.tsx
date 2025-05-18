import ScheduleCreate from "@/components/template/schedule-create";

export default function Schedule() {
    return (
        <div className="flex flex-col items-center gap-4 sm:w-auto ">
            <div className="flex justify-center w-full">
                <ScheduleCreate />
            </div>

            {/* <Card>
                <ScheduleItem />
            </Card> */}
        </div>
    );
}
