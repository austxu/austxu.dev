import { PortfolioDashboard } from "./components/portfolio-dashboard";
import { getPosts } from "../lib/content";

export default function Home() {
  const latestPost = getPosts()[0];
  return <PortfolioDashboard latestPost={latestPost} />;
}
