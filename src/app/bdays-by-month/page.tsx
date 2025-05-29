"use client";

import { trpc } from "@/utils/trpc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/ui/select";
import { useState } from "react";

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function BirthdaysByMonth() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const { data: people, isLoading } =
    trpc.person.getByMonth.useQuery(selectedMonth);

  return (
    <div>
      <h1 className="text-2xl font-bold">Birthdays by Month</h1>
      <div className="mt-8">
        <Select
          value={selectedMonth.toString()}
          onValueChange={(value) => setSelectedMonth(parseInt(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a month" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month, index) => (
              <SelectItem key={month} value={index.toString()}>
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="mt-6">
          {isLoading ? (
            <p>Loading...</p>
          ) : !people?.length ? (
            <p className="text-gray-500">
              No birthdays in {months[selectedMonth]}
            </p>
          ) : (
            <div className="grid gap-4">
              {people.map((person) => (
                <div
                  key={person.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <span className="font-medium">{person.name}</span>
                  <span className="text-gray-600">
                    {person.dayOfMonth}
                    {getOrdinalSuffix(person.dayOfMonth)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function getOrdinalSuffix(day: number): string {
  if (day > 3 && day < 21) return "th";
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
