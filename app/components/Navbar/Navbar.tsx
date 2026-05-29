import {Suspense, useEffect, useState} from 'react';
import {Await, Link, NavLink, useAsyncValue} from 'react-router';
import {
  type CartViewPayload,
  useAnalytics,
  useOptimisticCart,
} from '@shopify/hydrogen';
import type {HeaderQuery, CartApiQueryFragment} from 'storefrontapi.generated';
import {useAside} from '~/components/Aside';

interface NavbarProps {
  header: HeaderQuery;
  cart: Promise<CartApiQueryFragment | null>;
  isLoggedIn: Promise<boolean>;
  publicStoreDomain: string;
}

const offers = [
  'MEMBERS SAVE 10% TODAY — JOIN AURELLE CLUB',
  'FREE SHIPPING ON ORDERS OVER $99',
  'NEW COLLECTION JUST ARRIVED',
];

export default function Navbar({
  header,
  cart,
  isLoggedIn,
  publicStoreDomain,
}: NavbarProps) {
  const [offerIndex, setOfferIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  const {open} = useAside();
  const {shop, menu} = header;

  const primaryDomainUrl = header.shop.primaryDomain.url;

  const shopifyMenuItems =
    menu?.items?.filter((item) => Boolean(item.url)) ?? [];

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);

      setTimeout(() => {
        setOfferIndex((prev) => (prev + 1) % offers.length);
        setFade(true);
      }, 350);
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const normalizeShopifyUrl = (url: string) => {
    if (
      url.includes('myshopify.com') ||
      url.includes(publicStoreDomain) ||
      url.includes(primaryDomainUrl)
    ) {
      return new URL(url).pathname;
    }

    return url;
  };

  return (
    <>
      <div className="h-[150px] md:h-[150px]" />

      <header
        className={`fixed top-0 z-50 w-full text-black transition-all duration-500 ${
          scrolled ? 'bg-white/95 shadow-lg backdrop-blur-md' : 'bg-white'
        }`}
      >
        <div className="relative flex h-[67px] items-center justify-between bg-black px-4 text-white md:px-[60px]">
          <div className="hidden items-center gap-6 md:flex">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <FacebookIcon />
            </a>

            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <InstagramIcon />
            </a>

            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[22px] font-light"
            >
              𝕏
            </a>

            <span className="text-[22px] font-light">◎</span>
            <span className="text-[22px] font-light">♪</span>
          </div>

          <div className="absolute left-1/2 w-full -translate-x-1/2 px-4 text-center md:w-auto md:px-0">
            <p
              className={`text-[12px] font-semibold uppercase tracking-[-0.5px] transition-all duration-300 md:text-[16px] ${
                fade ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'
              }`}
            >
              {offers[offerIndex]}
            </p>
          </div>

          <div className="invisible md:hidden">
            <div className="w-6" />
          </div>
        </div>

        <nav
          className={`relative flex items-center justify-between px-4 transition-all duration-500 md:px-[60px] ${
            scrolled ? 'h-[70px]' : 'h-[83px]'
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="block md:hidden"
              onClick={() => open('mobile')}
              aria-label="Open menu"
            >
              <MenuIcon />
            </button>

            <Link
              to="/"
              className={`text-[28px] font-light leading-none tracking-[-2px] transition-all duration-500 md:tracking-[-3px] ${
                scrolled ? 'md:text-[42px]' : 'md:text-[54px]'
              }`}
              style={{fontFamily: 'serif'}}
            >
              <span className="font-semibold italic">
                {shop?.name?.charAt(0) || 'A'}
              </span>
              {shop?.name?.slice(1) || 'urelle'}
            </Link>
          </div>

          <div className="hidden items-center gap-8 md:flex">
            {shopifyMenuItems.map((item) => {
              if (!item.url) return null;

              const url = normalizeShopifyUrl(item.url);

              return (
                <NavLink
                  key={item.id}
                  to={url}
                  prefetch="intent"
                  className={({isActive}) =>
                    `text-[15px] font-medium uppercase tracking-wide transition hover:text-[#c9a96e] ${
                      isActive ? 'text-[#c9a96e]' : 'text-black'
                    }`
                  }
                >
                  {item.title}
                </NavLink>
              );
            })}
          </div>

          <div className="hidden items-center gap-8 text-[18px] font-medium uppercase md:flex">
            <button
              type="button"
              onClick={() => open('search')}
              className="flex items-center gap-2 transition hover:text-gray-600"
            >
              <SearchIcon />
              Search
            </button>

            <NavLink
              to="/account"
              prefetch="intent"
              className="flex items-center gap-2 transition hover:text-gray-600"
            >
              <UserCircleIcon />
              <Suspense fallback="Sign in">
                <Await resolve={isLoggedIn} errorElement="Sign in">
                  {(loggedIn) => (loggedIn ? 'Account' : 'Sign in')}
                </Await>
              </Suspense>
            </NavLink>

            <CartToggle cart={cart} />
          </div>

          <div className="flex items-center gap-4 md:hidden">
            <button
              type="button"
              onClick={() => open('search')}
              aria-label="Open search"
            >
              <SearchIcon />
            </button>

            <MobileCartToggle cart={cart} />
          </div>
        </nav>
      </header>
    </>
  );
}

function CartToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<CartButton count={0} />}>
      <Await resolve={cart}>
        <CartBanner />
      </Await>
    </Suspense>
  );
}

function CartBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);

  return <CartButton count={cart?.totalQuantity ?? 0} />;
}

function CartButton({count}: {count: number}) {
  const {open} = useAside();
  const {publish, shop, cart, prevCart} = useAnalytics();

  return (
    <button
      type="button"
      onClick={() => {
        open('cart');

        publish('cart_viewed', {
          cart,
          prevCart,
          shop,
          url: window.location.href || '',
        } as CartViewPayload);
      }}
      className="flex items-center gap-2 transition hover:text-gray-600"
    >
      <ShoppingCartIcon />
      Cart | <span>{count}</span>
    </button>
  );
}

function MobileCartToggle({cart}: {cart: Promise<CartApiQueryFragment | null>}) {
  return (
    <Suspense fallback={<MobileCartIconButton count={0} />}>
      <Await resolve={cart}>
        <MobileCartIconBanner />
      </Await>
    </Suspense>
  );
}

function MobileCartIconBanner() {
  const originalCart = useAsyncValue() as CartApiQueryFragment | null;
  const cart = useOptimisticCart(originalCart);

  return <MobileCartIconButton count={cart?.totalQuantity ?? 0} />;
}

function MobileCartIconButton({count}: {count: number}) {
  const {open} = useAside();

  return (
    <button
      type="button"
      onClick={() => open('cart')}
      className="relative"
      aria-label="Open cart"
    >
      <ShoppingCartIcon />
      <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-black text-[10px] text-white">
        {count}
      </span>
    </button>
  );
}

function FacebookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function UserCircleIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="8" r="4" />
      <path d="M5.5 20.5v-2a7 7 0 0 1 13 0v2" />
    </svg>
  );
}

function ShoppingCartIcon() {
  return (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}