import type { Metadata } from "next";
import { ForestLanding } from "./components/forest-landing";

export const metadata: Metadata = {
  title: "Austin's Portfolio",
  description: "Austin Xu's forest-themed portfolio across models, machines, and markets.",
  alternates: { canonical: "https://austxu.dev/" },
};

export default function Home() {
  return <ForestLanding />;
}
