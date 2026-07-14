import Link from "next/link";
import { ROUTES } from "@/src/lib/constants";
import { NOT_FOUND } from "@/src/data/placeholder-content";
import { ArrowLeftIcon } from "@/src/components/icons";

export default function NotFoundPage() {
  return (
    <section className="not-found page-shell">
      <p className="section-index">HTTP / 404</p>
      <div>
        <p className="not-found__number" aria-hidden="true">404</p>
        <h1>{NOT_FOUND.title}</h1>
        <p>{NOT_FOUND.description}</p>
        <Link href={ROUTES.home} className="button-primary"><ArrowLeftIcon size={17} /> {NOT_FOUND.backHome}</Link>
      </div>
    </section>
  );
}
