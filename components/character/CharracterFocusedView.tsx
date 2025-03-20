import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { CharacterTable } from "./character-table";
import { ReportAttendanceDialog } from "./ReportAttendanceDialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import Link from "next/link";
import CharacterFiltersPopUp from "./CharacterFiltersPopUp";
import ClassSelect from "../ClassSelect";
import { views } from "@/constants/global";

export default function CharacterFocusedView({
  changeView,
}: {
  changeView: Function;
}) {
  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="CHARACTER FOCUSED VIEW" />
        <div className="flex items-center flex-wrap gap-2">
          <ClassSelect />

          <CharacterFiltersPopUp />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex gap-2">
          <ReportAttendanceDialog />
          <Link
            target="_blank"
            href={"/assets/google_search.pdf"}
            className="flex gap-2 items-center text-lg bg-blue-500 hover:bg-blue-600 rounded-md px-4"
          >
            <Image
              src={teacherImages.print}
              alt="print"
              width={100}
              height={100}
              className="w-8 h-8"
            />
          </Link>
        </div>

        <Link
          href={"#"}
          className="whitespace-nowrap text-bgPurple underline"
          onClick={() => changeView(views.GENERAL_VIEW)}
        >
          go to the general view
        </Link>
      </div>
      <Card className="rounded-md">
        <CharacterTable />
      </Card>
    </section>
  );
}
