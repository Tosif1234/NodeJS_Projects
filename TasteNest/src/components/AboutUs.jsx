import burgerImage from '../assets/burger-3.png';

export default function AboutUs() {
  const images = [burgerImage, burgerImage, burgerImage];

  return (
    <section className="grid grid-cols-3 max-w-full h-72">
      {images.map((img, idx) => (
        <div key={idx} className="w-full h-full overflow-hidden">
          <img src={img} alt="Showcase" className="w-full h-full object-contain bg-neutral-950 hover:scale-110 transition duration-700" />
        </div>
      ))}
    </section>
  );
}
