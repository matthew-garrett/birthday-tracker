import CreatePerson from "./components/create-person";
import PersonList from "./components/person-list";

export default function AllPeoplePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">All People</h1>
      <div className="flex flex-col gap-4">
        <CreatePerson />
        <PersonList />
      </div>
    </div>
  );
}
