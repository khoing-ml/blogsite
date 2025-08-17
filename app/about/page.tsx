// Deprecated About page placeholder; redirecting users to Projects.
import { redirect } from "next/navigation";

export const metadata = { title: "About (Moved to Projects)" };

export default function AboutPage() {
  redirect('/projects');
}
