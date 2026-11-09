const USER_COLORS = [
  { text: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  { text: "text-violet-700", bg: "bg-violet-50", border: "border-violet-200" },
  { text: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  { text: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  { text: "text-cyan-700", bg: "bg-cyan-50", border: "border-cyan-200" },
  { text: "text-indigo-700", bg: "bg-indigo-50", border: "border-indigo-200" },
  { text: "text-fuchsia-700", bg: "bg-fuchsia-50", border: "border-fuchsia-200" },
  { text: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200" },
  { text: "text-teal-700", bg: "bg-teal-50", border: "border-teal-200" },
  { text: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
];

export function getUserColor(userId: number | null | undefined) {
  if (!userId) return USER_COLORS[0];
  const index = Math.abs(userId) % USER_COLORS.length;
  return USER_COLORS[index];
}

