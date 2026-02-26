export function onlyDigits(v: string) {
  return (v ?? "").replace(/\D/g, "");
}

export function normalizeCPF(v: string) {
  return onlyDigits(v).slice(0, 11);
}

export function formatCPF(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const p1 = d.slice(0, 3);
  const p2 = d.slice(3, 6);
  const p3 = d.slice(6, 9);
  const p4 = d.slice(9, 11);

  if (d.length <= 3) return p1;
  if (d.length <= 6) return `${p1}.${p2}`;
  if (d.length <= 9) return `${p1}.${p2}.${p3}`;
  return `${p1}.${p2}.${p3}-${p4}`;
}

export function formatPhoneBR(v: string) {
  const d = onlyDigits(v).slice(0, 11);
  const a = d.slice(0, 2);
  const p1 = d.slice(2, 7);
  const p2 = d.slice(7, 11);

  if (d.length <= 2) return `(${a}`;
  if (d.length <= 7) return `(${a}) ${d.slice(2)}`;
  return `(${a}) ${p1}-${p2}`;
}