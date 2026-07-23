import Link from "next/link";

export default function NotFound() { return <main className="not-found"><p className="eyebrow">404 / drift detected</p><h1>Not here.</h1><p>This path wandered outside the field notes.</p><Link className="button button-primary" href="/">Return to the homepage <span aria-hidden="true">↘</span></Link></main>; }
