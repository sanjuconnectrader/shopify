import { Link } from 'react-router';
import { Image, Money } from '@shopify/hydrogen';
import type {
  ProductItemFragment,
  CollectionItemFragment,
  RecommendedProductFragment,
} from 'storefrontapi.generated';
import { useVariantUrl } from '~/lib/variants';
import { useState } from 'react';

export function ProductItem({
  product,
  loading,
  variant = 'default',
}: {
  product:
    | CollectionItemFragment
    | ProductItemFragment
    | RecommendedProductFragment;
  loading?: 'eager' | 'lazy';
  variant?: 'default' | 'luxury';
}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage;
  const [isHovered, setIsHovered] = useState(false);

  // Luxury-specific classes for the museum grid variant
  const isLuxury = variant === 'luxury';

  return (
    <Link
      className={`group block w-full focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e] focus-visible:ring-offset-2 ${
        isLuxury ? 'h-full' : ''
      }`}
      key={product.id}
      prefetch="intent"
      to={variantUrl}
    >
      <article
        className={`relative w-full transition-all duration-700 ease-out ${
          isLuxury ? 'h-full p-4 sm:p-6 md:p-8' : ''
        }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Card Container - Elegant, minimal with subtle depth */}
        <div
          className={`relative w-full ${
            !isLuxury &&
            'overflow-hidden rounded-sm bg-white transition-all duration-500 hover:shadow-2xl'
          }`}
        >
          {/* Image Container - Refined aspect ratio for editorial feel */}
          <div
            className={`relative w-full overflow-hidden ${
              isLuxury ? 'aspect-[3/4] sm:aspect-[4/5]' : 'aspect-[3/4]'
            } bg-[#f8f8f6]`}
          >
            {image && (
              <Image
                alt={image.altText || product.title}
                aspectRatio={isLuxury ? '4/5' : '3/4'}
                data={image}
                loading={loading}
                sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
                className="h-full w-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-105"
              />
            )}

            {/* Refined overlay gradient on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/0 via-black/0 to-black/0 transition-all duration-700 group-hover:from-black/10 group-hover:via-black/5 group-hover:to-black/0" />

            {/* Ultra-minimal badge - positioned with elegance */}
            <div className="absolute left-4 top-4 z-10 sm:left-6 sm:top-6 md:left-8 md:top-8">
              <div className="overflow-hidden">
                <div
                  className={`transform transition-all duration-700 delay-100 ${
                    isHovered ? 'translate-y-0' : 'translate-y-full'
                  }`}
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="h-px w-4 bg-[#c9a96e] sm:w-6 md:w-8" />
                    <span className="font-sans text-[8px] font-light uppercase tracking-[3px] text-white sm:text-[9px] sm:tracking-[4px] md:text-[10px] md:tracking-[5px]">
                      New Arrival
                    </span>
                    <div className="h-px w-4 bg-[#c9a96e] sm:w-6 md:w-8" />
                  </div>
                </div>
              </div>
            </div>

            {/* White Background "Discover" button - appears on hover */}
            <div className="absolute inset-x-4 bottom-4 z-10 sm:inset-x-6 sm:bottom-6 md:inset-x-8 md:bottom-8">
              <div
                className={`transform transition-all duration-700 ${
                  isHovered
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-10 opacity-0'
                }`}
              >
                <div className="group/btn relative overflow-hidden rounded-full bg-white shadow-lg transition-all duration-500 hover:shadow-xl border border-gray-200">
                  <span className="relative block px-4 py-2.5 text-center font-sans text-[10px] font-semibold uppercase tracking-[3px] text-black transition-all duration-300 group-hover/btn:tracking-[5px] sm:px-6 sm:py-3 sm:text-[11px] sm:tracking-[4px] md:px-8 md:py-3.5">
                    Discover
                  </span>
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 -translate-x-full transform bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 opacity-0 transition-all duration-700 group-hover/btn:translate-x-full group-hover/btn:opacity-100" />
                </div>
              </div>
            </div>

            {/* Subtle shine effect on image hover */}
            <div className="pointer-events-none absolute inset-0 -translate-x-full transform bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
          </div>

          {/* Product Information - Refined typography with careful spacing */}
          <div
            className={`${
              isLuxury 
                ? 'mt-6 space-y-3 px-1 sm:mt-8 sm:space-y-4' 
                : 'mt-4 space-y-2 px-2 pb-4 sm:mt-5 sm:px-3 md:mt-6'
            }`}
          >
            {/* Product Title */}
            <h3
              className={`font-serif font-light leading-tight tracking-wide text-[#1c1c1a] transition-colors group-hover:text-[#c9a96e] ${
                isLuxury 
                  ? 'text-lg sm:text-xl md:text-2xl' 
                  : 'text-sm sm:text-base md:text-lg'
              } line-clamp-2`}
            >
              {product.title}
            </h3>

            {/* Price & Currency with elegant presentation */}
            <div className="flex items-center justify-between">
              <div className="flex items-baseline gap-1 sm:gap-1.5">
                <Money
                  data={product.priceRange.minVariantPrice}
                  as="span"
                  className={`font-sans font-light tracking-wide text-[#3a3a38] ${
                    isLuxury 
                      ? 'text-sm sm:text-base md:text-lg' 
                      : 'text-xs sm:text-sm md:text-base'
                  }`}
                />
                <span className="font-sans text-[8px] font-light uppercase tracking-[1px] text-[#8a8a86] sm:text-[9px] sm:tracking-[1.5px] md:text-[10px]">
                  {product.priceRange.minVariantPrice.currencyCode}
                </span>
              </div>

              {/* Minimal arrow indicator */}
              <div
                className={`transform transition-all duration-500 ${
                  isHovered
                    ? 'translate-x-0 opacity-100'
                    : '-translate-x-1 opacity-0'
                }`}
              >
                <svg
                  className={`text-[#1c1c1a] transition-transform duration-300 group-hover:translate-x-0.5 ${
                    isLuxury ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-3 w-3 sm:h-4 sm:w-4'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="1.2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
            </div>

            {/* Optional: Subtle color dot for luxury variant */}
            {isLuxury && (
              <div className="flex items-center gap-2 pt-1 sm:pt-2">
                <div className="h-px w-4 bg-[#c9a96e]/40 sm:w-6" />
                <span className="font-sans text-[8px] font-light uppercase tracking-[1.5px] text-[#8a8a86] sm:text-[9px] sm:tracking-[2px]">
                  Limited Edition
                </span>
                <div className="h-px w-4 bg-[#c9a96e]/40 sm:w-6" />
              </div>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}

// Refined 3-column grid with generous spacing and elegant container
export function ProductGrid({
  products,
  loading,
}: {
  products: Array<
    CollectionItemFragment | ProductItemFragment | RecommendedProductFragment
  >;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <div className="mx-auto max-w-[2000px] px-4 py-12 sm:px-6 md:px-8 lg:px-12">
      {/* Gentle header separator */}
      <div className="mb-12 flex justify-center md:mb-16">
        <div className="h-px w-12 bg-[#c9a96e]/30 sm:w-16" />
      </div>

      {/* Grid - Exactly 3 columns on desktop with balanced gaps */}
      <div className="grid grid-cols-1 gap-x-4 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16 xl:gap-x-10">
        {products.map((product, index) => (
          <div
            key={product.id}
            className="animate-fadeInUp opacity-0"
            style={{
              animation: `fadeInUp 0.6s ease-out forwards`,
              animationDelay: `${index * 0.05}s`,
            }}
          >
            <ProductItem product={product} loading={loading} />
          </div>
        ))}
      </div>

      {/* Add fadeInUp animation via style tag */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

// Museum-style gallery grid with no gaps and elegant borders
export function LuxuryProductGrid({
  products,
  loading,
}: {
  products: Array<
    CollectionItemFragment | ProductItemFragment | RecommendedProductFragment
  >;
  loading?: 'eager' | 'lazy';
}) {
  return (
    <section className="bg-[#fbfbf9]">
      {/* Decorative top border */}
      <div className="mx-auto h-px w-full max-w-[2000px] bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent" />

      <div className="mx-auto max-w-[2000px] px-4 sm:px-6 lg:px-8">
        {/* 3-column grid with no gaps for gallery-style presentation */}
        <div className="grid grid-cols-1 border-l border-[#e6e4de] md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => {
            // Determine border styles for the gallery layout
            const isLastInRow = (index + 1) % 3 === 0;
            const isLastRow = index >= products.length - 3;

            return (
              <div
                key={product.id}
                className={`
                  relative border-b border-r border-[#e6e4de] bg-white transition-all duration-700 hover:z-10 hover:shadow-2xl
                  ${isLastInRow ? 'lg:border-r-0' : ''}
                  ${isLastRow ? 'lg:border-b-0' : ''}
                  md:even:border-r-0 
                  lg:even:border-r
                `}
              >
                <ProductItem product={product} loading={loading} variant="luxury" />
              </div>
            );
          })}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className="mx-auto mt-12 h-px w-full max-w-[2000px] bg-gradient-to-r from-transparent via-[#c9a96e]/30 to-transparent md:mt-16" />
    </section>
  );
}