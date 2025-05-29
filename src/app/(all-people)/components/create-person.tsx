"use client";

import { DatePicker } from "@/app/components/date-picker";
import { Button } from "@/app/ui/button";
import { Input } from "@/app/ui/input";
import { trpc } from "@/utils/trpc";
import { useEffect, useState } from "react";

export default function CreatePerson() {
  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>();
  const [error, setError] = useState<string>();
  const utils = trpc.useUtils();

  useEffect(() => {
    if (date || name) {
      // clear error when user types in name or date
      setError("");
      return;
    }
  }, [date, name]);

  const createPerson = trpc.person.create.useMutation({
    onError: (err) => setError(err.message),
    onSuccess: () => {
      // Reset form
      setName("");
      setDate(undefined);
      // Refetch the list
      utils.person.getAll.invalidate();
    },
  });

  const handleCreateBday = () => {
    if (!date || !name) {
      setError("Please provide both name and date");
      return;
    }
    // clear error when user clicks create
    setError("");
    // create new person in db
    createPerson.mutate({
      name,
      birthDate: date.toISOString(),
    });
  };

  return (
    <>
      <div className="mt-10 flex flex-col md:flex-row gap-4">
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-1/3"
        />
        <DatePicker date={date} setDate={setDate} />
        <Button
          className="w-fit align-self-end"
          onClick={handleCreateBday}
          disabled={createPerson.isPending}
        >
          {createPerson.isPending ? "Creating..." : "Create BDAY"}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
