import burgerImage from '../assets/burger-3.png';

export default function InstagramGrid() {
  const stream = [burgerImage, burgerImage, burgerImage, burgerImage, burgerImage];

  return (
    <section className="grid grid-cols-5 max-w-full h-32 border-b border-neutral-200">
      {stream.map((img, i) => (
        <img key={i} src={img} alt="Insta Stream" className="w-full h-full object-contain bg-neutral-950 filter brightness-90 hover:brightness-110 cursor-pointer transition" />
      ))}
    </section>
  );
}
