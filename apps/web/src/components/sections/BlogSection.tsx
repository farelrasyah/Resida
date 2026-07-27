import React from 'react';
import { Button } from '../common/Button';

export const BlogSection: React.FC = () => {
  const posts = [
    {
      title: 'Philly Real Estate: A Winter Chill or a Spring Opportunity?',
      date: 'April 1, 2026',
      brief:
        'Record-low listings and steady price growth define a unique market environment for the Philadelphia Metropolitan area as spring approaches.',
      category: 'Real Estate',
      image: '/assets/images/1.f6e8f2e8.jpg',
      slug: 'philly-real-estate-spring-opportunity',
    },
    {
      title: 'What $1M Buys in Different NYC Neighborhoods',
      date: 'March 9, 2026',
      brief:
        'Curious what $1M can still buy in today’s NYC market? Explore a comparative snapshot of available listings across Manhattan and Brooklyn.',
      category: 'Lifestyle',
      image: '/assets/images/2.41633fa6.jpg',
      slug: 'what-1m-buys-nyc-neighborhoods',
    },
    {
      title: 'Navigating Mortgage Rate Fluctuation in 2026',
      date: 'February 23, 2026',
      brief:
        'Key financial strategies for prospective buyers looking to lock in favorable mortgage rates before the spring seasonal inventory surge.',
      category: 'Finance',
      image: '/assets/images/mortgage-services.e92904b1.jpg',
      slug: 'mortgage-rate-fluctuation-2026',
    },
  ];

  return (
    <section className="py-24 lg:py-40 bg-[#F7F7F6] border-t border-[#151717]/10 overflow-hidden">
      <div className="container-main">
        <div className="assymetric-row items-center mb-16">
          <div className="assymetric-col-left">
            <div className="text-[1.4rem] font-semibold uppercase tracking-wider text-[#151717]/50 mb-4">
              Market Insights & Articles
            </div>
            <h2 className="text-[4.4rem] lg:text-[7.2rem] font-medium leading-[1] tracking-[-0.04em] text-[#151717]">
              Blog & Resources.
            </h2>
          </div>

          <div className="assymetric-col-right flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="text-[1.8rem] lg:text-[2.2rem] text-[#151717]/70 font-medium leading-[1.4] max-w-xl">
              See how we’ve helped clients achieve their real estate dreams, one successful move at a
              time.
            </p>
            <div>
              <Button variant="secondary" href="/blog">
                Visit Our Blog
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <a
              key={idx}
              href={`/blog/${post.slug}`}
              className="bg-white rounded-3xl overflow-hidden border border-[#151717]/10 flex flex-col justify-between group"
            >
              <div className="relative h-64 lg:h-72 w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute top-6 left-6">
                  <span className="px-3.5 py-1 rounded-full bg-white/90 text-[#151717] text-[1.2rem] font-semibold">
                    {post.category}
                  </span>
                </div>
              </div>

              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[1.4rem] text-[#151717]/50 font-medium">{post.date}</span>
                  <h3 className="text-[2.2rem] font-medium text-[#151717] group-hover:opacity-80 transition-opacity leading-[1.3]">
                    {post.title}
                  </h3>
                  <p className="text-[1.6rem] text-[#151717]/70 font-medium leading-[1.5]">
                    {post.brief}
                  </p>
                </div>

                <div className="pt-4 border-t border-[#151717]/10 text-[1.6rem] font-semibold text-[#151717]">
                  Read Article →
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
