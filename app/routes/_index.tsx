import {Await, useLoaderData} from 'react-router';
import type {Route} from './+types/_index';
import {Suspense} from 'react';

import type {RecommendedProductsQuery} from 'storefrontapi.generated';
import {ProductItem} from '~/components/ProductItem';
import Hero from '~/components/Hero/Hero';

export const meta: Route.MetaFunction = () => {
  return [{title: 'Hydrogen | Products'}];
};

export async function loader({context}: Route.LoaderArgs) {
  const recommendedProducts = context.storefront
    .query(RECOMMENDED_PRODUCTS_QUERY)
    .catch((error: Error) => {
      console.error(error);
      return null;
    });

  return {
    recommendedProducts,
  };
}

export default function Homepage() {
  const {recommendedProducts} = useLoaderData<typeof loader>();

  return (
    <main className="recommended-products-page">
      <Hero />
      <RecommendedProducts products={recommendedProducts} />
    </main>
  );
}

function RecommendedProducts({
  products,
}: {
  products: Promise<RecommendedProductsQuery | null>;
}) {
  return (
    <section
      className="recommended-products"
      aria-labelledby="recommended-products"
    >
      <Suspense fallback={<div>Loading Products...</div>}>
        <Await resolve={products}>
          {(response) => (
            <div className="recommended-products-grid">
              {response
                ? response.products.nodes.map((product) => (
                    <ProductItem key={product.id} product={product} />
                  ))
                : null}
            </div>
          )}
        </Await>
      </Suspense>
    </section>
  );
}

const RECOMMENDED_PRODUCTS_QUERY = `#graphql
  fragment RecommendedProduct on Product {
    id
    title
    handle

    priceRange {
      minVariantPrice {
        amount
        currencyCode
      }
    }

    featuredImage {
      id
      url
      altText
      width
      height
    }
  }

  query RecommendedProducts(
    $country: CountryCode,
    $language: LanguageCode
  )
  @inContext(country: $country, language: $language) {
    products(first: 8, sortKey: UPDATED_AT, reverse: true) {
      nodes {
        ...RecommendedProduct
      }
    }
  }
` as const;