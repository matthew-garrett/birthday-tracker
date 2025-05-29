import Link from "next/link";

export default function Nav() {
  return (
    <div className="flex gap-4 text-black mb-10">
      <Link className="hover:text-blue-500" href="/">
        All People
      </Link>
      <Link className="hover:text-blue-500" href="/bdays-by-month">
        B-days by month
      </Link>
      <Link className="hover:text-blue-500" href="/upcoming-bdays">
        Upcoming b-days
      </Link>
    </div>
  );
}
