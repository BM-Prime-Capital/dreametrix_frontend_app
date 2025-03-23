import { generalImages } from "@/constants/images";
import Image from "next/image";
import React from "react";

function NoData() {
  return (
    <div className="flex flex-col justify-center items-center p-8">
      <Image
        src={generalImages.no_data}
        alt="no-data"
        height={100}
        width={100}
        className="h-16 w-16"
      />
      <label className="text-muted-foreground">No Data</label>
    </div>
  );
}

export default NoData;
