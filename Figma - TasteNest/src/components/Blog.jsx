import React from 'react';
import feedbackImage from '../assets/lib/img1.png';
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
    category: 'Hot Dog', // Updated to match image
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
      className={['pointer-events-none absolute inset-0 opacity-[0.02]', className].join(' ')}
      style={{ backgroundImage: patternSvg, backgroundSize: '140px 140px' }}
    />
  );
}

function DecorativeBurger() {
  return (
    <svg
      aria-hidden="true"
      className="absolute left-4 top-[35%] hidden h-28 w-28 text-[#a0a0a0] opacity-30 md:block xl:left-8"
      viewBox="0 0 80 80"
      fill="none"
    >
      <path d="M16 36c8-16 34-20 48 0H16Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M14 42h52M18 49h48M24 57h33" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M25 33h2M35 29h2M46 31h2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M20 58c4 8 34 8 42 0" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function DecorativeFries() {
  return (
    <svg
      aria-hidden="true"
      className="absolute bottom-16 right-4 hidden h-28 w-28 text-[#a0a0a0] opacity-40 md:block xl:right-8"
      viewBox="0 0 84 84"
      fill="none"
    >
      <path d="M23 32h39l-5 48H29L23 32Z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M28 26l5 32M38 19l2 40M49 18l-3 41M59 24l-9 35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M31 43c8 5 18 5 25 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BlogCard({ post }) {
  return (
    <article className="group overflow-hidden rounded-2xl bg-[#f5f5f5] shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-[220px] w-full overflow-hidden bg-neutral-900 rounded-t-2xl">
        <img
          src={post.image}
          alt={post.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {/* Yellow Category Badge flush with the bottom right */}
        <span className="absolute bottom-0 right-6 min-w-[100px] rounded-t-md bg-[#ffc222] px-6 py-2.5 text-center text-[13px] font-bold leading-none text-black">
          {post.category}
        </span>
      </div>

      <div className="px-6 pb-8 pt-6">
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] font-bold leading-none text-gray-800">
          <span>15 Feb 2024</span>
          <span>{post.comments}</span>
        </div>

        {/* Solid Light Green Divider */}
        <div className="mt-4 mb-5 h-[2px] w-full bg-[#00a84f]/25" />

        <h3 className="text-[20px] font-black leading-tight text-[#222] transition group-hover:text-[#00a84f] sm:text-[22px]">
          {post.title}
        </h3>

        <p className="mt-3.5 text-[14px] font-normal leading-relaxed text-gray-500">
          There are many variations of passages of Lorem Ipsum available, but majority have suffered Lorem haca
          ullamcorper donec ante habi believable. If you are going to use a passage...
        </p>
      </div>
    </article>
  );
}

export default function Blog() {
  return (
    <section className="relative overflow-hidden bg-white text-[#222]">
      {/* Blog Section (Updated to match Figma) */}
      <div className="relative bg-white py-12 md:py-16 lg:pt-24 lg:pb-32">
        <FoodPattern />
        
        {/* Outline Decorative Icons */}
        <DecorativeBurger />
        <DecorativeFries />

        <div className="relative mx-auto max-w-[1240px] px-5 sm:px-8">
          <div className="text-center">
            <span className="text-[13px] font-black uppercase tracking-widest text-[#00a84f]">News & Blog</span>
            <h2 className="mt-3 text-[38px] font-black leading-none text-[#222] sm:text-[46px]">
              Update News & Blog
            </h2>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-3 lg:mx-auto lg:gap-8">
            {posts.map((post) => (
              <BlogCard key={post.title} post={post} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}