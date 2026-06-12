import React from "react";
import { Truck } from "lucide-react";
import bg1 from "../assets/menugrid/bg1.png";
import bg2 from "../assets/menugrid/bg2.png";
import bg3 from "../assets/menugrid/bg3.png";
import bg4 from "../assets/menugrid/bg4.png";
import bg5 from "../assets/menugrid/bg5.png";
import bigPizza from "../assets/menugrid/big-pizza.png";
import txtImg from "../assets/menugrid/txt.png";

const FoodOfferSection = () => {
  return (
    <section className="bg-[#111] py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden">

          {/* LEFT PIZZA */}
          <div
            className="lg:col-span-5 relative min-h-[600px] bg-cover bg-center"
            style={{
              backgroundImage: `url('${bg1}')`,
            }}
          >
            <div className="absolute inset-0 bg-black/40" />

            <div className="relative z-10 flex flex-col items-center pt-16 text-center">
              <span className="text-white font-bold text-[20px] md:text-[28px] uppercase">
                Today
              </span>

              <h2 className="text-white font-extrabold uppercase leading-none text-[42px] md:text-[64px]">
                Special Delicious
              </h2>

              <h3 className="font-bold text-[28px] md:text-[40px] uppercase">
                <span className="text-white">Beef</span>
                <span className="text-[#fbbf24]">chiness Pizza</span>
              </h3>
            </div>

            {/* Discount */}
            <div className="absolute bottom-80 right-8 border-4 border-white rounded-full w-28 h-28 rotate-[-12deg] flex flex-col items-center justify-center">
              <span className="text-white text-sm font-bold">
                UP TO
              </span>

              <span className="text-white text-sm font-bold">
                SAVE
                <span className="text-[#fbbf24] text-4xl ml-1">
                  50
                </span>
                %
              </span>

              <span className="text-white font-bold">
                OFF
              </span>
            </div>

            {/* Pizza */}
            <img
              src={bigPizza}
              alt="Pizza"
              className="absolute bottom-5 left-1/2 -translate-x-1/2 w-[90%] max-w-[650px]"
            />
          </div>

          {/* MIDDLE */}
          <div className="lg:col-span-4 grid grid-rows-2">

            {/* Burger */}
            <div
              className="relative min-h-[300px] bg-cover bg-center"
              style={{
                backgroundImage: `url('${bg2}')`,
              }}
            >
              <div className="p-10">
                <span className="text-[#fbbf24] font-bold text-xl">
                  Delicious
                </span>

                <h3 className="text-white font-extrabold text-5xl leading-tight">
                  Burger Combo
                </h3>

                <p className="text-white font-bold mt-2">
                  This Weekend Only
                </p>

                <div className="mt-6 flex items-center gap-3">
                  <span className="text-white font-bold text-2xl">
                    Limited Offer /
                  </span>

                  <span className="text-white text-6xl font-black">
                    $5
                  </span>
                </div>

                <button className="mt-8 bg-[#fbbf24] px-10 py-5 rounded-md flex items-center gap-3 font-bold hover:scale-105 duration-300">
                  <Truck size={18} />
                  Order Now
                </button>
              </div>
            </div>

            {/* Fries */}
            <div
              className="relative min-h-[300px] bg-cover bg-center"
              style={{
                backgroundImage: `url('${bg4}')`,
              }}
            >
              <div className="p-10">
                <span className="text-white font-bold">
                  Crispy, Every Bite Taste
                </span>

                <h3 className="text-white font-extrabold text-5xl leading-tight mt-3 uppercase">
                  Fash Food
                  <br />
                  Meal
                </h3>

                <p className="text-white mt-3 font-medium">
                  The mouth-watering aroma of
                  <br />
                  sizzling burgers
                </p>

                <button className="mt-8 bg-[#fbbf24] px-10 py-5 rounded-md flex items-center gap-3 font-bold hover:scale-105 duration-300">
                  <Truck size={18} />
                  Order Now
                </button>
              </div>

              <img
                src="/images/fries.png"
                alt="Fries"
                className="absolute right-6 bottom-0 w-[250px]"
              />
            </div>
          </div>

          {/* RIGHT */}
          <div className="lg:col-span-3 grid grid-rows-2">

            {/* Super Delicious */}
            <div
              className="relative min-h-[300px] bg-cover bg-center"
              style={{
                backgroundImage:`url('${bg3}')`,
              }}
            >
              <div className="p-10">
                <span className="text-[#fbbf24] font-bold">
                  Crispy, Every Bite Taste
                </span>

                <h3 className="text-white font-extrabold uppercase text-6xl leading-tight mt-2">
                  Super
                  <br />
                  Delicious
                </h3>

                <div className="mt-10 border-4 border-white rounded-full w-28 h-28 rotate-[-10deg] flex flex-col items-center justify-center">
                  <span className="text-white text-4xl font-bold">
                    50%
                  </span>

                  <span className="text-[#fbbf24] text-3xl font-black">
                    OFF
                  </span>
                </div>
              </div>
            </div>

            {/* Chicken */}
            <div
              className="relative min-h-[300px] bg-cover bg-center"
              style={{
                backgroundImage: `url('${bg5}')`,
              }}
            >
              <div className="p-10">
                <img src="" alt="" />
              </div>

              <img
                src="/images/chicken.png"
                alt="Chicken"
                className="absolute right-3 bottom-2 w-[260px]"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default FoodOfferSection;