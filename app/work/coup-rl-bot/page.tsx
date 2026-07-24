import type { Metadata } from "next";
import { PageFrame } from "../../components/page-frame";
import CoupRedirect from "./redirect-client";

export const metadata: Metadata = { title: "Coup RL Bot", description: "A Gen5 1v1 Coup bot for decision-making under hidden information." };

export default function CoupCaseStudy() {
  return <PageFrame eyebrow="02 / strategic deception / Gen5 / production rollout" title={<>The tell is<br /><em>in the timing.</em></>} intro="Opening the live 1v1 bot. The playable experience now lives at its own production origin so the game can keep its real-time connection and wake-up behavior intact."><CoupRedirect /></PageFrame>;
}
