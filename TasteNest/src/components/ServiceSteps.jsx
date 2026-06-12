const steps = [
  {
    title: 'Cooking With Care',
    desc: 'Its the perfect dining experience where Experience quick and efficient',
  },
  {
    title: 'QUICKLY DELIVERY',
    desc: 'Its the perfect dining experience where Experience quick and efficient',
    featured: true,
  },
  {
    title: 'CHOOSE FOOD',
    desc: 'Its the perfect dining experience where Experience quick and efficient',
  },
];

function StepCard({ step }) {
  if (step.featured) {
    return (
      <article className="relative z-10 grid min-h-[180px] w-full max-w-[292px] place-items-center rounded-[10px] border border-dashed border-[#9d9d9d] bg-white px-8 text-center sm:min-h-[184px]">
        <div>
          <h3 className="text-[23px] font-black leading-none text-[#252525] sm:text-[25px]">{step.title}</h3>
          <p className="mx-auto mt-5 max-w-[250px] text-[13px] font-normal leading-[1.6] text-[#555]">{step.desc}</p>
        </div>
      </article>
    );
  }

  return (
    <article className="relative z-10 w-full max-w-[260px] text-center">
      <h3 className="text-[22px] font-black leading-none text-[#252525] sm:text-[24px]">{step.title}</h3>
      <p className="mx-auto mt-5 max-w-[235px] text-[13px] font-normal leading-[1.55] text-[#555]">{step.desc}</p>
    </article>
  );
}

export default function ServicesSteps() {
  return (
    <section className="bg-[#f4f1ea] px-5 py-24 sm:px-8 lg:pb-[158px] lg:pt-[184px]">
      <div className="mx-auto max-w-[920px] text-center">
        <span className="text-[12px] font-black uppercase leading-none text-[#00a84f]">Food Processing</span>
        <h2 className="mt-4 text-[42px] font-black uppercase leading-none text-[#242424] sm:text-[56px]">
          How We Serve You?
        </h2>

        <div className="relative mt-[70px] grid justify-items-center gap-10 md:grid-cols-[1fr_292px_1fr] md:items-center md:gap-0">
          <span className="absolute left-[21%] right-[21%] top-1/2 hidden -translate-y-1/2 border-t border-dashed border-[#9d9d9d] md:block" />
          {steps.map((step) => (
            <StepCard key={step.title} step={step} />
          ))}
        </div>
      </div>
    </section>
  );
}
