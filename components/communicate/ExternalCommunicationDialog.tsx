"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import ExternalComposeMsgWrapper from "./ExternalComposeMsgWrapper";

const externalEmailComposeMsg = {
  visibleContent: (
    <span onClick={() => document.getElementById("radio1")?.click()}>
      <input id="radio1" type="radio" name="externalCompose" /> Send an email to
      an external address
    </span>
  ),
  hiddenContent: (
    <form className="flex flex-col gap-2 border-[1px] border-[#eee] p-2 rounded-md">
      <input
        type="email"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
        placeholder="to..(email)"
      />
      <input
        type="text"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
        placeholder="Subject"
      />
      <input
        type="file"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
      />
      <textarea
        rows={3}
        className="border-[1px] border-[#eee] rounded-lg px-2 py-1"
        placeholder="message..."
      />
      <input
        type="datetime-local"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
      />
      <button
        type="submit"
        className="flex p-2 px-8 mt-2 items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
      >
        SEND
      </button>
    </form>
  ),
};

const externalTextComposeMsg = {
  visibleContent: (
    <span onClick={() => document.getElementById("radio2")?.click()}>
      <input id="radio2" type="radio" name="externalCompose" /> Send an text
      message
    </span>
  ),
  hiddenContent: (
    <form className="flex flex-col gap-2 border-[1px] border-[#eee] p-2 rounded-md">
      <input
        type="text"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
        placeholder="to..(phone number)"
      />
      <textarea
        rows={3}
        className="border-[1px] border-[#eee] rounded-lg px-2 py-1"
        placeholder="message..."
      />
      <input
        type="datetime-local"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
      />
      <button
        type="submit"
        className="flex p-2 px-8 mt-2 items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
      >
        SEND
      </button>
    </form>
  ),
};

const externalRecordComposeMsg = {
  visibleContent: (
    <span onClick={() => document.getElementById("radio3")?.click()}>
      <input id="radio3" type="radio" name="externalCompose" /> Record a message
      for sending via call
    </span>
  ),
  hiddenContent: (
    <form className="flex flex-col gap-4 border-[1px] border-[#eee] p-2 rounded-md">
      <input
        type="text"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
        placeholder="to..(phone number)"
      />
      <span className="flex gap-2">
        <button
          type="button"
          className="flex justify-center items-center border-[1px] border-[#eee] w-10 h-10 rounded-full"
        >
          <Image
            src={teacherImages.voice_note}
            alt="voice note"
            width={12}
            height={12}
          />
        </button>
        <audio controls />
      </span>
      <input
        type="datetime-local"
        className="border-[1px] border-[#eee] rounded-full px-2 py-1"
      />
      <button
        type="submit"
        className="flex p-2 px-8 mt-2 items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white rounded-full"
      >
        SEND
      </button>
    </form>
  ),
};

export function ExternalCommunicationDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center text-lg bg-bgPink hover:bg-bgPinkHover rounded-md  px-2 py-4 lg:px-4 lg:py-6">
          <Image
            src={teacherImages.external}
            alt="report"
            width={100}
            height={100}
            className="w-8 h-8"
          />
          <span>External</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-8 w-fit">
        <h2 className="pb-2 font-bold border-b-[1px] border-[#eee]">
          External
        </h2>
        <div className="flex flex-col gap-2 text-gray-600">
          <label>You want to:</label>

          <div className="flex flex-col">
            <ExternalComposeMsgWrapper
              externalComposeMsg={externalEmailComposeMsg}
            />
            <ExternalComposeMsgWrapper
              externalComposeMsg={externalTextComposeMsg}
            />
            <ExternalComposeMsgWrapper
              externalComposeMsg={externalRecordComposeMsg}
            />
          </div>
        </div>
        <div className="flex justify-between gap-2">
          <button
            className="rounded-full px-4 py-2 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
