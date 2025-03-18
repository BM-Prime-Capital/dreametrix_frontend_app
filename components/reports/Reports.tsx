"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import Image from "next/image";
import { generalImages, teacherImages } from "@/constants/images";
import Link from "next/link";
import { Button } from "../ui/button";
import ClassSelect from "../ClassSelect";
import { useSelector } from "react-redux";
import LineChartComponent from "../ui/line-chart";
import DoughnutChartComponent from "../ui/pie-chart";

export default function Reports() {
  const { selectedClass } = useSelector((state: any) => state.generalInfo);

  return (
    <section className="flex flex-col gap-2 w-full p-6">
      <div className="flex justify-between items-center">
        <PageTitleH1 title="REPORTS" />
        <div className="flex flex-wrap items-center justify-end gap-2">
          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">From: </span>
            <input
              className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
              type="date"
            />
          </label>

          <label className="flex items-center gap-2">
            <span className="text-muted-foreground">To: </span>
            <input
              className="bg-white hover:bg-gray-50 rounded-md p-0.5 cursor-pointer"
              type="date"
            />
          </label>

          <ClassSelect />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <div className="flex gap-4">
          <Button className="flex gap-2 items-center text-lg bg-[#c586d1] hover:bg-[#A36EAD] rounded-md  px-2 py-4 lg:px-4 lg:py-6">
            <Image
              src={teacherImages.save}
              alt="report"
              width={100}
              height={100}
              className="w-8 h-8"
            />
            <span>Save</span>
          </Button>
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

        <select className="bg-white font-bold p-1 rounded-md">
          <option>Prince Ilunga</option>
          <option>Josue Clever</option>
          <option>Jordan Wise</option>
          <option>Nehemie Intelo</option>
          <option>Henock Preso</option>
        </select>
      </div>
      <Card className="rounded-md">
        <div className="flex flex-col p-4">
          <div className="flex flex-wrap justify-between mb-4  border-b-[1px] border-[#eee] ">
            <div className="flex gap-4 items-center">
              <label className="font-bold">CHARACTER SCORE REPORT</label>
              <span className="text-muted-foreground">07/03 - 14/03</span>
            </div>
            <div className="flex gap-8 items-center">
              <div className="flex items-center gap-1">
                <Image
                  src={generalImages.student}
                  alt="Student"
                  height={100}
                  width={100}
                  className="h-16 w-16 border-[1px] border-[#eee] rounded-full"
                />
                <div className="flex flex-col">
                  <label>Prince Ilunga</label>
                  <label className="text-muted-foreground">
                    {selectedClass}
                  </label>
                </div>
              </div>
              <span className="text-[3em] text-[#b9d63c] font-bold">A</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-8">
            <div className="flex flex-col gap-8">
              <div className="flex gap-8">
                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-4">
                    Character Domain Breakdown:
                  </label>
                  <div className="flex gap-4">
                    <span className="bg-[#65be4d] text-white font-bold rounded-md p-2 h-8 w-8 flex items-center justify-center">
                      A+
                    </span>
                    <span className="bg-[#fbe809] text-white font-bold rounded-md p-2 h-8 w-8 flex items-center justify-center">
                      B
                    </span>
                    <span className="bg-[#fcc144] text-white font-bold rounded-md p-2 h-8 w-8 flex items-center justify-center">
                      C
                    </span>
                    <span className="bg-[#f38053] text-white font-bold rounded-md p-2 h-8 w-8 flex items-center justify-center">
                      D
                    </span>
                    <span className="bg-[#ef4c4c] text-white font-bold rounded-md p-2 h-8 w-8 flex items-center justify-center">
                      F
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold mb-4">Overview:</label>
                  <table className="text-center shadow-md rounded-md">
                    <thead>
                      <tr className="bg-[#faf9f9]">
                        <th className="font-normal px-4">Score</th>
                        <th className="font-normal px-4">Rating</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="text-[#65be4d]">100 - 90</td>
                        <td>A+</td>
                      </tr>
                      <tr>
                        <td className="text-[#fbe809]">89 - 80</td>
                        <td>B</td>
                      </tr>
                      <tr>
                        <td className="text-[#fcc144]">79 - 70</td>
                        <td>C</td>
                      </tr>

                      <tr>
                        <td className="text-[#f38053]">69 - 55</td>
                        <td>C</td>
                      </tr>
                      <tr>
                        <td className="text-[#ef4c4c]">54 - 0</td>
                        <td>C</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-4">Score History:</label>
                <div className="flex justify-center items-center h-[300px] bg-white rounded-md">
                  <LineChartComponent />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold mb-4">Log:</label>
                <div className="flex gap-8 text-sm">
                  <label className="flex gap-2">
                    <span>11/03/25</span> <span>09:55 am</span>
                  </label>
                  <label>Ms. Leontine</label>
                  <label className="flex gap-2">
                    <span className="text-green-500">
                      Emotional Intelligence (+)
                    </span>
                    <span>You helped Susan when...</span>
                  </label>
                </div>
                <div className="flex gap-8 text-sm">
                  <label className="flex gap-2">
                    <span>12/03/25</span> <span>10:15 am</span>
                  </label>
                  <label>Ms. Susan</label>
                  <label className="flex gap-2">
                    <span className="text-red-500">Self-Control (-)</span>
                    <span>It wasn't nice of you when...</span>
                  </label>
                </div>
                <div className="flex gap-8 text-sm">
                  <label className="flex gap-2">
                    <span>14/03/25</span> <span>11:23 am</span>
                  </label>
                  <label>Ms. Susan</label>
                  <label className="flex gap-2">
                    <span className="text-green-500">Integrity (+)</span>
                    <span>You helped Patrick when...</span>
                  </label>
                </div>
                <div className="flex gap-8 text-sm">
                  <label className="flex gap-2">
                    <span>14/03/25</span> <span>11:23 am</span>
                  </label>
                  <label>Ms. Susan</label>
                  <label className="flex gap-2">
                    <span className="text-green-500">Optimism (+)</span>
                    <span>You helped Patrick when...</span>
                  </label>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-8">
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-4">Score:</label>
                <div className="flex justify-center items-center h-[200px] bg-white relative">
                  <DoughnutChartComponent />
                  <div className="text-2xl text-[#b9d63c] font-bold h-[60px] w-[60px] flex flex-col items-center justify-center border-[2px] border-[#b9d63c] rounded-full absolute">
                    84
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-4">
                  Domains I did well in:
                </label>
                <div className="flex border-[4px] border-[#55efc4] rounded-md">
                  <div className="bg-[#55efc4] flex items-center justify-center px-4">
                    <Image
                      src={teacherImages.up}
                      alt="up"
                      height={100}
                      width={100}
                      className="h-8 w-8"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4 text-sm">
                    <label>Emotional Inteligence</label>
                    <label>Integrity</label>
                    <label>Optimism</label>
                  </div>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-sm font-bold mb-4">
                  Domains I need to focus on:
                </label>
                <div className="flex border-[4px] border-[#ff7675] rounded-md">
                  <div className="bg-[#ff7675] flex items-center justify-center px-4">
                    <Image
                      src={teacherImages.down}
                      alt="up"
                      height={100}
                      width={100}
                      className="h-8 w-8"
                    />
                  </div>
                  <div className="flex flex-col gap-1 p-4 text-sm">
                    <label>Self-Control</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
