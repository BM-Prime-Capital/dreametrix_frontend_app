import { generalImages } from "@/constants/images";
import Image from "next/image";
import React from "react";

function UserAvatar({ className }: { className?: string }) {
  return (
    <div
      className={`rounded-full object-cover ${
        className ? className : "h-6 w-6"
      }`}
    >
      <Image
        src={generalImages.default_user}
        alt="user"
        height={100}
        width={100}
      />
    </div>
  );
}

export default UserAvatar;
