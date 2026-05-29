import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/collections._index';
import {getPaginationVariables, Image} from '@shopify/hydrogen';
import type {CollectionFragment} from 'storefrontapi.generated';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {useState} from 'react';

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context, request}: Route.LoaderArgs) {
  const paginationVariables = getPaginationVariables(request, {
    pageBy: 12,
  });

  const {collections} = await context.storefront.query(COLLECTIONS_QUERY, {
    variables: paginationVariables,
  });

  return {collections};
}

export default function Collections() {
  const {collections} = useLoaderData<typeof loader>();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const bannerCollection = collections.nodes.find(
    (collection) => collection.image,
  );

  return (
    <>
      <section className="bg-white px-4 pb-8 pt-10 sm:px-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-[2000px]">
          <div className="mb-8 text-center">
            <div className="mb-4 flex items-center justify-center gap-3">
              <div className="h-px w-8 bg-[#c9a96e]" />
          
              <div className="h-px w-8 bg-[#c9a96e]" />
            </div>

        

        
          </div>

          {bannerCollection?.image && (
            <Link
              to={`/collections/${bannerCollection.handle}`}
              prefetch="intent"
              className="group relative block h-[280px] w-full overflow-hidden rounded-[26px] bg-[#1c1c1a] sm:h-[340px] md:h-[430px] lg:h-[520px]"
            >
              <Image
                alt={bannerCollection.image.altText || bannerCollection.title}
                data={bannerCollection.image}
                loading="eager"
                sizes="100vw"
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />

              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
                <span className="mb-4 text-[11px] font-light uppercase tracking-[5px] text-[#c9a96e]">
                  Featured Collection
                </span>

                <h2 className="font-serif text-4xl font-light tracking-wide md:text-6xl lg:text-7xl">
                  {bannerCollection.title}
                </h2>

                <span className="mt-6 border border-white/70 px-8 py-3 text-[11px] font-light uppercase tracking-[4px] transition duration-300 group-hover:bg-white group-hover:text-black">
                  Explore Collection
                </span>
              </div>
            </Link>
          )}
        </div>
      </section>

      <div className="mx-auto max-w-[2000px] px-4 py-16 sm:px-6 md:px-8 lg:px-12">
        <PaginatedResourceSection<CollectionFragment>
          connection={collections}
          resourcesClassName="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
        >
          {({node: collection, index}) => (
            <CollectionItem
              key={collection.id}
              collection={collection}
              index={index}
              isHovered={hoveredIndex === index}
              onHover={() => setHoveredIndex(index)}
              onLeave={() => setHoveredIndex(null)}
            />
          )}
        </PaginatedResourceSection>
      </div>

      <style>{`
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
      `}</style>
    </>
  );
}

function CollectionItem({
  collection,
  index,
  isHovered,
  onHover,
  onLeave,
}: {
  collection: CollectionFragment;
  index: number;
  isHovered: boolean;
  onHover: () => void;
  onLeave: () => void;
}) {
  return (
    <Link
      to={`/collections/${collection.handle}`}
      prefetch="intent"
      className="group relative block"
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      style={{
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${(index % 12) * 0.05}s`,
        opacity: 0,
      }}
    >
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#f8f8f6]">
        {collection.image ? (
          <>
            <Image
              alt={collection.image.altText || collection.title}
              aspectRatio="4/5"
              data={collection.image}
              loading={index < 6 ? 'eager' : undefined}
              sizes="(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="h-full w-full object-cover transition-all duration-[1.2s] ease-out group-hover:scale-105"
            />

            <div
              className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-700 ${
                isHovered ? 'opacity-100' : 'opacity-0'
              }`}
            />

            <div
              className={`absolute inset-x-0 bottom-0 transform p-6 transition-all duration-700 ${
                isHovered
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              }`}
            >
              <div className="space-y-3 text-white">
                <h3 className="font-serif text-2xl font-light tracking-wide">
                  {collection.title}
                </h3>

                <div className="flex items-center gap-2">
                  <div className="h-px w-8 bg-[#c9a96e]" />
                  <span className="text-[10px] font-light uppercase tracking-[4px]">
                    Discover
                  </span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <svg
              className="h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>

            <p className="mt-3 text-sm font-light text-gray-500">
              {collection.title}
            </p>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 -translate-x-full transform bg-gradient-to-r from-white/0 via-white/15 to-white/0 opacity-0 transition-all duration-700 group-hover:translate-x-full group-hover:opacity-100" />
      </div>

      <div
        className={`mt-5 text-center transition-all duration-500 ${
          isHovered ? 'translate-y-2 opacity-0' : 'translate-y-0 opacity-100'
        }`}
      >
        <h3 className="font-serif text-lg font-light tracking-wide text-[#1c1c1a]">
          {collection.title}
        </h3>
      </div>
    </Link>
  );
}

const COLLECTIONS_QUERY = `#graphql
  fragment Collection on Collection {
    id
    title
    handle
    image {
      id
      url
      altText
      width
      height
    }
  }

  query StoreCollections(
    $country: CountryCode
    $endCursor: String
    $first: Int
    $language: LanguageCode
    $last: Int
    $startCursor: String
  ) @inContext(country: $country, language: $language) {
    collections(
      first: $first
      last: $last
      before: $startCursor
      after: $endCursor
    ) {
      nodes {
        ...Collection
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
` as const;