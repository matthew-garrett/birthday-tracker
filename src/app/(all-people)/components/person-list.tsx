"use client";

import { useState } from "react";
import { Input } from "@/app/ui/input";
import { DatePicker } from "@/app/components/date-picker";
import { Button } from "@/app/ui/button";
import { trpc } from "@/utils/trpc";
import { format } from "date-fns";
import { Pencil, X, Check, Trash2 } from "lucide-react";

type Person = {
  id: string;
  name: string;
  birthDate: Date;
};

export default function PersonList() {
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [error, setError] = useState<string>();
  const utils = trpc.useUtils();
  const { data: people, isLoading } = trpc.person.getAll.useQuery();

  const updatePerson = trpc.person.update.useMutation({
    onError: (err) => setError(err.message),
    onSuccess: () => {
      // clear editing person
      setEditingPerson(null);
      // refetch the list
      utils.person.getAll.invalidate();
    },
  });

  const deletePerson = trpc.person.delete.useMutation({
    onError: (err) => setError(err.message),
    onSuccess: () => {
      // refetch the list
      utils.person.getAll.invalidate();
    },
  });

  const handleStartEdit = (person: Person) => {
    setEditingPerson(person);
  };

  const handleCancelEdit = () => {
    setEditingPerson(null);
  };

  const handleSaveEdit = () => {
    if (!editingPerson) return;

    // update person in db
    updatePerson.mutate({
      id: editingPerson.id,
      name: editingPerson.name,
      birthDate: editingPerson.birthDate.toISOString(),
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this birthday?")) {
      // delete person in db
      deletePerson.mutate({ id });
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">Birthday List</h2>
      {error && <p className="text-red-500">{error}</p>}
      {isLoading ? (
        <p>Loading...</p>
      ) : !people?.length ? (
        <p className="text-gray-500">No birthdays added yet</p>
      ) : (
        <div className="grid gap-4">
          {people.map((person) => (
            <div
              key={person.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              {editingPerson?.id === person.id ? (
                <>
                  <div className="flex items-center gap-4 flex-1">
                    <Input
                      value={editingPerson.name}
                      onChange={(e) =>
                        setEditingPerson({
                          ...editingPerson,
                          name: e.target.value,
                        })
                      }
                      className="w-1/3"
                    />
                    <DatePicker
                      date={editingPerson.birthDate}
                      setDate={(date) =>
                        setEditingPerson({
                          ...editingPerson,
                          birthDate: date || editingPerson.birthDate,
                        })
                      }
                    />
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleCancelEdit}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={handleSaveEdit}
                      disabled={updatePerson.isPending}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-1">
                    <span className="font-medium">{person.name}</span>
                    <span className="ml-4">
                      {format(new Date(person.birthDate), "PPP")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleStartEdit(person)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDelete(person.id)}
                      disabled={deletePerson.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
