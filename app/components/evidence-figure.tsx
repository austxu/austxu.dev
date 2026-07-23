export function ConfidenceFigure() {
  const rows = [
    ["Llama 3.1", "12%", "71%", "+2.773 → +3.491%"],
    ["Mistral", "10%", "66%", "+2.425 → +3.330%"],
    ["Llama 2 FA-on", "43%", "79%", "+3.969%"],
  ];
  return <figure className="figure-card"><figcaption className="figure-title">Accepted decode deltas / 95% confidence intervals</figcaption>{rows.map(([name, start, point, value]) => <div className="ci-row" key={name}><span>{name}</span><span className="ci-track"><span className="ci-range" style={{ left: start, width: `${Number.parseInt(point) - Number.parseInt(start)}%` }} /><span className="ci-point" style={{ left: point }} /></span><span>{value}</span></div>)}<p className="figure-foot">Seven samples per invocation · 100,000 deterministic bootstrap replicates · centered at zero</p></figure>;
}

export function ProtocolFigure() {
  return <figure className="figure-card"><figcaption className="figure-title">ABBA / thermal guardrail</figcaption><div className="protocol-grid"><span className="protocol-control">A1 / control</span><span className="protocol-candidate">B1 / candidate</span><span className="protocol-candidate">B2 / candidate</span><span className="protocol-control">A2 / control</span></div><div className="protocol-thermals"><span>ambient</span><i /><span>hotspot ceiling</span></div><p className="figure-foot">The protocol interleaves control and candidate paths while watching temperature, clocks, and instability.</p></figure>;
}

export function EvidenceTable() {
  return <table className="evidence-table"><thead><tr><th>experiment</th><th>result</th><th>decision</th></tr></thead><tbody><tr><td>Llama 3.1 decode</td><td>+3.095% geomean</td><td className="decision-accepted">accepted</td></tr><tr><td>Mistral decode</td><td>+2.425 → +3.330%</td><td className="decision-accepted">accepted</td></tr><tr><td>Prompt processing</td><td>−0.007%</td><td className="decision-accepted">neutral / retained</td></tr><tr><td>Qwen numerical path</td><td>failed correctness gate</td><td className="decision-rejected">rejected</td></tr></tbody></table>;
}
