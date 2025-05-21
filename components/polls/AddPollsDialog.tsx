"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Image from "next/image";
import { generalImages } from "@/constants/images";
import { Pencil } from "lucide-react";

export function AddPollsDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(1);

  const handleSubmit = () => {
    if (currentStep === 3) {
      // Save the Poll
    }
    setCurrentStep((prev) => (prev === 4 ? 4 : prev + 1));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
          <Button className="flex gap-3 items-center text-lg bg-[#f59e0b] hover:bg-[#f59e0b]/90 text-white rounded-xl px-5 py-4 shadow-lg hover:shadow-xl transition-all transform hover:scale-[1.02] group">
            <div className="relative flex items-center justify-center">
              <svg 
                width="24" 
                height="24" 
                viewBox="0 0 24 24" 
                fill="none" 
                className="w-7 h-7 transform group-hover:rotate-180 transition-transform duration-300"
              >
                <path 
                  d="M12 5V19M5 12H19" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 5V19M5 12H19" 
                  stroke="white" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  className="opacity-30"
                />
              </svg>
            </div>
            <span className="font-semibold tracking-wide">Add New</span>
          </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            New Poll
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col">
          <ul className="list-none flex gap-2 border-b-[1px] border-[#eee]">
            {currentStep === 4 ? (
              <li
                className={`${
                  currentStep === 4 ? "border-b-[2px] border-blue-500" : ""
                }`}
                onClick={() => setCurrentStep(4)}
              >
                Share
              </li>
            ) : (
              <>
                <li
                  className={`cursor-pointer ${
                    currentStep === 1 ? "border-b-[2px] border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentStep(1)}
                >
                  Step 1
                </li>
                <li
                  className={`cursor-pointer ${
                    currentStep === 2 ? "border-b-[2px] border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentStep(2)}
                >
                  Step 2
                </li>
                <li
                  className={`cursor-pointer ${
                    currentStep === 3 ? "border-b-[2px] border-blue-500" : ""
                  }`}
                  onClick={() => setCurrentStep(3)}
                >
                  Finish
                </li>
              </>
            )}
          </ul>

          <div className="py-4">
            {currentStep === 1 ? (
              <div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option disabled selected>
                        Select Subject
                      </option>
                      <option>Math</option>
                      <option>Language</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <select className="rounded-full flex h-10 w-full border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
                      <option disabled selected>
                        Select Class
                      </option>
                      <option></option>
                      <option>Class 3 Math</option>
                      <option>Class 4 Math</option>
                      <option>Grade 3 Language</option>
                      <option>Grade 4 Language</option>
                    </select>{" "}
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      type="text"
                      className="rounded-full"
                      placeholder="title"
                    />
                  </div>
                  <div className="flex-1 min-w-[200px]">
                    <Input
                      type="datetime-local"
                      className="rounded-full"
                      placeholder="title"
                    />
                  </div>
                </div>

                <div className="flex-1 w-full">
                  <textarea
                    rows={3}
                    className="rounded-md w-full border-[1px] border-[#eee] p-2"
                    placeholder="description"
                  />
                </div>
              </div>
            ) : currentStep === 2 ? (
              <div className="flex flex-col gap-4">
                <label>Question 1</label>
                <Input
                  type="text"
                  className="rounded-full"
                  placeholder="Question title"
                />
                <div className="flex flex-col gap-1">
                  <label className="flex gap-1">
                    <input type="radio" name="questionType" />
                    Make it Multiple Choice
                  </label>
                  <label className="flex gap-1">
                    <input type="radio" name="questionType" />
                    Make it Single Choice
                  </label>
                  <label className="flex gap-1">
                    <input type="radio" name="questionType" />
                    Be able to write the answer
                  </label>
                </div>

                <textarea
                  rows={3}
                  className="rounded-md w-full border-[1px] border-[#eee] p-2"
                  placeholder="description"
                />

                <input type="file" />

                <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                  Save and add another question
                </Button>
              </div>
            ) : currentStep === 3 ? (
              <div className="flex flex-col">
                <label className="flex gap-2 items-center">
                  Question 1{" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50"
                    onClick={() => setCurrentStep(2)}
                  >
                    <Pencil className="h-4 w-4 text-[#25AAE1]" />
                  </Button>
                </label>
                <label className="flex gap-2 items-center">
                  Question 2{" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50"
                    onClick={() => setCurrentStep(2)}
                  >
                    <Pencil className="h-4 w-4 text-[#25AAE1]" />
                  </Button>
                </label>
                <label className="flex gap-2 items-center">
                  Question 3{" "}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-50"
                    onClick={() => setCurrentStep(2)}
                  >
                    <Pencil className="h-4 w-4 text-[#25AAE1]" />
                  </Button>
                </label>
              </div>
            ) : currentStep === 4 ? (
              <div className="flex flex-col gap-2 items-center">
                <label className="text-muted-foreground">Calss 5 - Math</label>
                <label className="text-muted-foreground">What is better</label>
                <Image
                  src={"/assets/images/general/qr_code.png"}
                  alt="qr code"
                  height={250}
                  width={250}
                />
              </div>
            ) : (
              ""
            )}
          </div>

          <div className="flex justify-between mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setCurrentStep(1);
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            {currentStep === 4 ? (
              <div className="flex gap-4">
                <Button
                  onClick={() => {
                    setCurrentStep(1);
                    setOpen(false);
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  SAVE QR
                </Button>
                <Button
                  onClick={() => {
                    setCurrentStep(1);
                    setOpen(false);
                  }}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  COPY LINK
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  onClick={() =>
                    setCurrentStep((prev) => (prev === 1 ? 1 : prev - 1))
                  }
                  className="bg-gray-500 hover:bg-gray-600 text-white"
                >
                  PREVIOUS
                </Button>
                <Button
                  onClick={() => handleSubmit()}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  {currentStep === 3 ? "FINISH THE POLL" : "NEXT"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
