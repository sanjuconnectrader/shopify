export default function Hero() {
  return (
    <section className="relative min-h-[620px] w-full overflow-hidden md:min-h-[720px]">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url("/images/hero-banner.webp")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex min-h-[620px] max-w-[1920px] items-center md:min-h-[720px]">
        <div className="w-full px-6 py-20 md:px-12 lg:px-20 xl:px-32">
          <div className="max-w-[620px]">
            <span className="mb-8 block text-[13px] font-semibold uppercase tracking-[4px] text-white/90 md:text-[15px] md:tracking-[6px]">
              Timeless Elegance. Modern Style.
            </span>

            <h1 className="mb-10 font-serif text-[38px] font-light leading-[1.18] text-white md:text-[54px] lg:text-[62px]">
              Define Your
              <span className="block font-semibold italic">
                Signature Look
              </span>
            </h1>

            <p className="max-w-[560px] text-[16px] leading-[1.75] text-white/90 md:text-[18px]">
              Discover curated collections that blend contemporary design with
              timeless craftsmanship. From everyday essentials to statement
              pieces, elevate your wardrobe with our premium clothing.
            </p>

            {/* Buttons */}
            <div className="mt-10 flex flex-col gap-5 sm:flex-row sm:items-center md:mt-12">
              <button className="group relative min-w-[170px] overflow-hidden bg-white px-8 py-4 text-[14px] font-semibold uppercase tracking-[1.5px] text-black transition-all duration-300 hover:bg-black hover:text-white md:text-[15px]">
                <span className="relative z-10">Shop Now</span>
                <span className="absolute inset-0 -translate-x-full bg-black transition-transform duration-300 group-hover:translate-x-0" />
              </button>

              <button className="group relative min-w-[250px] overflow-hidden border-2 border-white px-8 py-4 text-[14px] font-semibold uppercase tracking-[1.5px] text-white transition-all duration-300 hover:bg-white hover:text-black md:text-[15px]">
                <span className="relative z-10">Explore Collections</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}