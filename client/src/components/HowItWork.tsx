
const steps = [
  {
    number: "01",
    title: "Describe",
    description: "Type your idea or pick a quick tag.",
  },
  {
    number: "02",
    title: "Generate",
    description: "AI designs and builds it, live in the preview.",
  },
  {
    number: "03",
    title: "Launch",
    description: "Tweak by chat, then publish in one click.",
  },
];

export default function HowItWork() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-14">
      <h2 className="text-center text-3xl font-semibold text-white">
        How it works
      </h2>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {steps.map((step) => (
          <div
            key={step.number}
            className="rounded-[32px] border border-white/10 bg-surface p-9"
          >
            <p className="text-sm font-semibold text-crimson">
              {step.number}
            </p>

            <h3 className="mt-4 text-xl font-semibold text-white">
              {step.title}
            </h3>

            <p className="mt-3 text-base leading-7 text-muted">
              {step.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
