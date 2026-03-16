import Link from "next/link";

const features = [
  {
    title: "Transactions",
    description: "Add and view your income and expenses.",
    href: "/transactions",
    icon: "💸",
  },
  {
    title: "Summary",
    description: "See your total income, expenses, and balance.",
    href: "/summary",
    icon: "📊",
  },
  {
    title: "Insights",
    description: "Understand your spending habits over time.",
    href: "/insights",
    icon: "💡",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full text-center mb-16">
        <h1 className="text-6xl font-bold tracking-tight text-gray-900 mb-5">Budgies</h1>
        <p className="text-lg text-gray-500 leading-relaxed max-w-md mx-auto">
          A simple way to track your money, understand your spending, and stay
          on top of your finances.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-2xl">
        {features.map((feature) => (
          <Link
            key={feature.href}
            href={feature.href}
            className="bg-white rounded-2xl border border-gray-200 p-7 flex flex-col gap-4 hover:shadow-md hover:border-gray-300 transition-all"
          >
            <span className="text-3xl">{feature.icon}</span>
            <div className="flex flex-col gap-1">
              <h2 className="text-base font-semibold text-gray-900">{feature.title}</h2>
              <p className="text-sm text-gray-500 leading-snug">{feature.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
