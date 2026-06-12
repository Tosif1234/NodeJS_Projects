import feedbackImage from '../assets/feedback-image.png';
import blogImage1 from '../assets/news1.png';
import blogImage2 from '../assets/news2.png';
import blogImage3 from '../assets/news3.png';

const posts = [
  {
    image: blogImage1,
    category: 'Burger',
    comments: 'Comments (0)',
    title: 'Quick Cravings: Unraveling Fast Food Delights',
  },
  {
    image: blogImage2,
    category: 'Hot New',
    comments: 'Comments (0)',
    title: 'Veggie Vibes: Garden Fresh Delightful Creations',
  },
  {
    image: blogImage3,
    category: 'Pasta',
    comments: 'Comments (2)',
    title: 'Bold Bite: Exotic Flavors, Global Adventure',
  },
];

const patternSvg =
  "url(\"data:image/svg+xml,%3Csvg width='140' height='140' viewBox='0 0 140 140' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23232323' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M19 30c13-13 32-9 40 4 7 13 1 29-14 35-15 7-33 1-40-12-5-10 1-22 14-27Z'/%3E%3Cpath d='M15 44h48M25 26c4 9 4 20 0 31M43 26c-4 9-4 20 0 31'/%3E%3Cpath d='M91 21h25l-4 31H95L91 21Z'/%3E%3Cpath d='M96 15l4 21M105 14l1 22M114 15l-3 21'/%3E%3Cpath d='M82 92c8-12 25-15 38-8 9 5 13 14 10 22H75c-1-5 1-10 7-14Z'/%3E%3Cpath d='M78 106h51M86 89c6 6 15 8 25 7M28 104c9-9 25-7 32 2 4 6 3 15-4 20H21c-6-7-4-16 7-22Z'/%3E%3Cpath d='M22 118h40'/%3E%3C/g%3E%3C/svg%3E\")";

function FoodPattern({ className = '' }) {
  return (
    <div
      aria-hidden="true"
      className={['pointer-events-none absolute inset-0 opacity-[0.035]', className].join(' ')}
      style={{ backgroundImage: patternSvg, backgroundSize: '140px 140px' }}
    />
  );
}

function RatingStars() {
  return (
    <div className="mt-5 flex justify-center gap-1 text-[13px] leading-none text-[#ffbe12]" aria-label="5 star rating">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>&#9733;</span>
      ))}
    </div>
  );
}

function SliderDots() {
  return (
    <div className="mt-7 inline-flex h-[24px] items-center rounded-full border border-[#d8d8d8] bg-white px-3">
      <span className="mr-2 h-[2px] w-4 bg-[#b9b9b9]" />
      <span className="grid h-[12px] w-[12px] place-items-center rounded-full border border-[#00a84f]">
        <span className="h-[6px] w-[6px] rounded-full bg-[#00a84f]" />
      </span>
      <span className="ml-2 h-[6px] w-[6px] rounded-full bg-[#222]" />
      <span className="ml-2 h-[6px] w-[6px] rounded-full bg-[#222]" />
    </div>
  );
}

function DecorativeBurger() {
  return (
    <svg
      aria-hidden="true"
      className="absolute left-6 top-[185px] hidden h-16 w-16 text-[#d0d0d0] md:block xl:left-10"
      viewBox="0 0 80 80"
      fill="none"
    >
      <path d="M16 36c8-16 34-20 48 0H16Z" stroke="currentColor" strokeWidth="2" />
      <path d="M14 42h52M18 49h48M24 57h33" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M25 33h2M35 29h2M46 31h2" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M20 58c4 8 34 8 42 0" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function DecorativeFries() {
  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-12 right-7 hidden h-20 w-20 text-[#bdbdbd] md:block xl:right-12"
      viewBox="0 0 84 84"
      fill="none"
    >
      <path d="M23 32h39l-5 48H29L23 32Z" stroke="currentColor" strokeWidth="2" />
      <path d="M28 26l5 32M38 19l2 40M49 18l-3 41M59 24l-9 35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M31 43c8 5 18 5 25 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function BlogCard({ post }) {
  return (
    <article className="group overflow-hidden rounded-lg bg-[#f3f3f3] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(17,17,17,0.12)]">
      <div className="relative h-[178px] overflow-hidden bg-neutral-950 sm:h-[190px] lg:h-[174px]">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-105"
        />
        <span className="absolute bottom-0 right-3 min-w-[108px] rounded-t-[3px] bg-[#ffbe12] px-5 py-2 text-center text-[11px] font-black leading-none text-black">
          {post.category}
        </span>
      </div>

      <div className="px-5 pb-8 pt-5">
        <div className="flex flex-wrap gap-x-8 gap-y-2 text-[11px] font-black leading-none text-[#232323]">
          <span>15 Feb 2024</span>
          <span>{post.comments}</span>
        </div>

        <div className="mt-5 h-px w-full bg-[#00a84f]/45" />

        <h3 className="mt-5 text-[21px] font-black leading-[1.05] text-[#202020] transition group-hover:text-[#00a84f] sm:text-[22px]">
          {post.title}
        </h3>

        <p className="mt-4 text-[12px] font-normal leading-[1.65] text-[#5f5f5f]">
          There are many variations of passages of Lorem Ipsum available, but majority have suffered Lorem haca
          ullamcorper donec ante hajj believable. If you are going to use a passage...
        </p>
      </div>
    </article>
  );
}

export default function Blog() {
  return (
    <section className="relative overflow-hidden bg-white text-[#222]">
      <div className="relative overflow-hidden bg-[#fbfbfb]">
        <FoodPattern />

        <div className="relative mx-auto grid max-w-[1314px] items-center gap-10 px-5 pb-16 pt-16 sm:px-8 lg:grid-cols-[310px_1fr] lg:gap-16 lg:pb-[74px] lg:pt-[58px]">
          <div className="relative mx-auto w-full max-w-[292px] lg:mx-0 lg:ml-[52px]">
            <img
              src={feedbackImage}
              alt="TasteNest guest feedback"
              className="h-[310px] w-full object-cover shadow-[0_12px_24px_rgba(0,0,0,0.08)] sm:h-[334px]"
            />
            <span className="absolute left-0 top-1/2 grid h-[92px] w-[40px] -translate-x-[54%] -translate-y-1/2 place-items-center bg-[#00a84f] text-[12px] font-black leading-none text-white [writing-mode:vertical-rl] [transform:translate(-54%,-50%)_rotate(180deg)]">
              Feedback
            </span>
          </div>

          <div className="mx-auto max-w-[590px] text-center lg:mx-0 lg:pt-3">
            <h3 className="text-[20px] font-black leading-none text-[#232323]">Piter Bowman</h3>
            <p className="mt-2 text-[12px] font-black leading-none text-[#ffbe12]">Business CEO &amp; Co Founder</p>
            <blockquote className="mt-6 text-[22px] font-black leading-[1.16] text-[#2b2b2b] sm:text-[25px] lg:text-[26px]">
              &ldquo;Thank You For Dinner Last Night. It Was Amazing!! I Have Say It&rsquo;s The Best Meal I Have Had In
              Quite Some Time. Will Definitely Be Seeing More Eating Next Year.&rdquo;
            </blockquote>
            <RatingStars />
            <SliderDots />
          </div>
        </div>
      </div>

      <div className="relative bg-[#fcfcfc] pb-20 pt-16 sm:pb-24 lg:pb-[94px] lg:pt-[70px]">
        <FoodPattern className="opacity-[0.018]" />
        <DecorativeBurger />
        <DecorativeFries />

        <div className="relative mx-auto max-w-[1314px] px-5 sm:px-8">
          <div className="text-center">
            <span className="text-[11px] font-black uppercase leading-none text-[#00a84f]">News &amp; Blog</span>
            <h2 className="mt-3 text-[36px] font-black leading-none text-[#242424] sm:text-[43px]">
              Update News &amp; Blog
            </h2>
          </div>

          <div className="mt-9 grid gap-6 md:grid-cols-3 lg:mx-auto lg:max-w-[930px] lg:gap-7">
            {posts.map((post) => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
