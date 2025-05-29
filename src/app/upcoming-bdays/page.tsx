"use client";

import { trpc } from "@/utils/trpc";
import { format } from "date-fns";

export default function UpcomingBirthdays() {
  const { data: people, isLoading } = trpc.person.getUpcoming.useQuery();

  return (
    <div>
      <h1 className="text-2xl font-bold">Upcoming Birthdays</h1>
      <div className="mt-8">
        {isLoading ? (
          <p>Loading...</p>
        ) : !people?.length ? (
          <p className="text-gray-500">
            No upcoming birthdays in the next 30 days
          </p>
        ) : (
          <div className="grid gap-4">
            {people.map((person) => (
              <div
                key={person.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <span className="font-medium">{person.name}</span>
                  <span className="ml-4 text-gray-600">
                    {format(new Date(person.birthDate), "PPP")}
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-semibold">
                    {person.daysUntil === 0
                      ? "Today!"
                      : person.daysUntil === 1
                      ? "Tomorrow!"
                      : `${person.daysUntil} days away`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
