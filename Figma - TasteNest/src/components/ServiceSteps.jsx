const steps = [
  {
    title: "Cooking With Care",
    desc: "Its the perfect dining experience where Experience quick and efficient",
  },
  {
    title: "QUICKLY DELIVERY",
    desc: "Its the perfect dining experience where Experience quick and efficient",
    featured: true,
  },
  {
    title: "CHOOSE FOOD",
    desc: "Its the perfect dining experience where Experience quick and efficient",
  },
];

export default function ServicesSteps() {
  return (
    <section className="bg-[#f4f1ea] py-12 md:py-20 lg:py-[110px] px-4 overflow-hidden">
      <div className="max-w-[1280px] mx-auto text-center">

        {/* Subtitle */}
        <span className="block text-[12px] font-black uppercase text-[#00a84f]">
          FOOD PROCESSING
        </span>

        {/* Title */}
        <h2 className="mt-3 text-[42px] md:text-[58px] font-black uppercase leading-none text-[#222]">
          HOW WE SERVE YOU?
        </h2>

        {/* Steps */}
        <div className="relative mt-[70px]">

          {/* Dashed Line */}
          <div className="hidden md:block absolute top-1/2 left-[16%] right-[16%] -translate-y-1/2 border-t border-dashed border-[#bcbcbc]" />

          <div className="grid justify-center grid-cols-1 md:grid-cols-[1fr_1fr_1fr] xl:grid-cols-[414px_414px_414px] items-center gap-8 md:gap-0">

            {/* Left */}
            <div className="relative z-10 text-center">
              <h3 className="text-[20px] font-black text-[#222]">
                Cooking With Care
              </h3>

              <p className="mt-3 mx-auto max-w-[220px] text-[11px] leading-[1.7] text-[#666]">
                Its the perfect dining experience where Experience quick and efficient
              </p>
            </div>

            {/* Center */}
            <div className="relative z-20 flex justify-center">
              <div
                className="
                  w-full
                  max-w-[280px]
                  h-[120px]
                  bg-white
                  rounded-[12px]
                  border
                  border-[#d5d5d5]
                  flex
                  flex-col
                  justify-center
                  items-center
                  px-6
                "
              >
                <h3 className="text-[22px] font-black text-[#222]">
                  QUICKLY DELIVERY
                </h3>

                <p className="mt-3 max-w-[220px] text-[11px] leading-[1.7] text-[#666]">
                  Its the perfect dining experience where Experience quick and efficient
                </p>
              </div>
            </div>

            {/* Right */}
            <div className="relative z-10 text-center">
              <h3 className="text-[20px] font-black text-[#222]">
                CHOOSE FOOD
              </h3>

              <p className="mt-3 mx-auto max-w-[220px] text-[11px] leading-[1.7] text-[#666]">
                Its the perfect dining experience where Experience quick and efficient
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}