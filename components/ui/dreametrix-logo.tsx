import Image from "next/image";
import Link from "next/link";
import React from "react";

function DreaMetrixLogo({
  width,
  height,
}: {
  width?: number;
  height?: number;
}) {
  return (
    <Link href={"/"}>
      <Image
        src="/assets/img/logo.png"
        alt="Dreametrix Logo"
        width={width ? width : 150}
        height={height ? height : 40}
        priority
        className="w-32 sm:w-[150px]"
      />
    </Link>
  );
}

export default DreaMetrixLogo;
