import {useLoaderData, Link} from 'react-router';
import type {Route} from './+types/products.$handle';
import {
  getSelectedProductOptions,
  Analytics,
  useOptimisticVariant,
  getProductOptions,
  getAdjacentAndFirstAvailableVariants,
  useSelectedOptionInUrlParam,
} from '@shopify/hydrogen';

import {ProductPrice} from '~/components/ProductPrice';
import {ProductForm} from '~/components/ProductForm';
import {redirectIfHandleIsLocalized} from '~/lib/redirect';
import {useState} from 'react';

export const meta: Route.MetaFunction = ({data}) => {
  return [
    {title: `Aurelle | ${data?.product.title ?? ''}`},
    {
      rel: 'canonical',
      href: `/products/${data?.product.handle}`,
    },
  ];
};

export async function loader(args: Route.LoaderArgs) {
  const criticalData = await loadCriticalData(args);
  return {...criticalData};
}

async function loadCriticalData({context, params, request}: Route.LoaderArgs) {
  const {handle} = params;
  const {storefront} = context;

  if (!handle) {
    throw new Error('Expected product handle to be defined');
  }

  const {product} = await storefront.query(PRODUCT_QUERY, {
    variables: {
      handle,
      selectedOptions: getSelectedProductOptions(request),
    },
  });

  if (!product?.id) {
    throw new Response(null, {status: 404});
  }

  redirectIfHandleIsLocalized(request, {handle, data: product});

  return {product};
}

export default function Product() {
  const {product} = useLoaderData<typeof loader>();
  const [selectedImage, setSelectedImage] = useState(0);

  const selectedVariant = useOptimisticVariant(
    product.selectedOrFirstAvailableVariant,
    getAdjacentAndFirstAvailableVariants(product),
  );

  useSelectedOptionInUrlParam(selectedVariant.selectedOptions);

  const productOptions = getProductOptions({
    ...product,
    selectedOrFirstAvailableVariant: selectedVariant,
  });

  const {descriptionHtml, images} = product;

  const productImages = images?.nodes || [];
  const allImages =
    productImages.length > 0
      ? productImages
      : selectedVariant?.image
        ? [selectedVariant.image]
        : [];

  const compareAmount = selectedVariant?.compareAtPrice?.amount
    ? Number(selectedVariant.compareAtPrice.amount)
    : null;

  const priceAmount = selectedVariant?.price?.amount
    ? Number(selectedVariant.price.amount)
    : null;

  const savePercent =
    compareAmount && priceAmount
      ? (((compareAmount - priceAmount) / compareAmount) * 100).toFixed(0)
      : null;

  return (
    <>
      <div className="mx-auto max-w-[2000px] px-4 pt-8 sm:px-6 md:px-8 lg:px-12">
        <nav className="mb-8 flex items-center gap-2 text-xs font-light uppercase tracking-wider text-gray-500">
          <Link to="/" className="transition hover:text-[#c9a96e]">
            Home
          </Link>
          <span>/</span>
          <Link to="/collections" className="transition hover:text-[#c9a96e]">
            Collections
          </Link>
          <span>/</span>
          <span className="text-[#c9a96e]">{product.title}</span>
        </nav>
      </div>

      <div className="mx-auto max-w-[2000px] px-4 pb-20 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#f8f8f6]">
              {allImages[selectedImage] && (
                <img
                  src={allImages[selectedImage].url}
                  alt={allImages[selectedImage].altText || product.title}
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              )}

              {!selectedVariant?.availableForSale && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                  <span className="border border-white/30 bg-white/10 px-6 py-3 text-sm font-light uppercase tracking-[4px] text-white backdrop-blur-md">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((image, index) => (
                  <button
                    key={image.id || index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`relative aspect-[3/4] w-20 flex-shrink-0 overflow-hidden border-2 transition-all duration-300 sm:w-24 ${
                      selectedImage === index
                        ? 'border-[#c9a96e] opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={image.url}
                      alt={image.altText || `${product.title} ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col space-y-6">
            <div className="space-y-3">
              <span className="text-[11px] font-light uppercase tracking-[6px] text-[#c9a96e]">
                {product.vendor || 'Aurelle'}
              </span>

              <h1 className="font-serif text-3xl font-light leading-tight tracking-wide text-[#1c1c1a] md:text-4xl lg:text-5xl">
                {product.title}
              </h1>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

            <div className="space-y-2">
              <ProductPrice
                price={selectedVariant?.price}
                compareAtPrice={selectedVariant?.compareAtPrice}
              />

              {savePercent && (
                <p className="text-sm font-light text-green-600">
                  Save {savePercent}%
                </p>
              )}
            </div>

            {product.description && (
              <p className="text-sm font-light leading-relaxed text-gray-600">
                {product.description.substring(0, 200)}
                {product.description.length > 200 ? '...' : ''}
              </p>
            )}

            <div className="space-y-6">
              <ProductForm
                productOptions={productOptions}
                selectedVariant={selectedVariant}
              />
            </div>

            <div className="space-y-3 border-t border-gray-100 pt-6">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <CheckIcon />
                <span className="font-light">Free shipping on orders over $99</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <ClockIcon />
                <span className="font-light">30-day easy returns</span>
              </div>

              <div className="flex items-center gap-3 text-sm text-gray-600">
                <PaymentIcon />
                <span className="font-light">Secure payment</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-gray-100 pt-16 md:mt-24 lg:mt-32">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
            <div className="md:col-span-1">
              <h3 className="text-[11px] font-light uppercase tracking-[6px] text-[#c9a96e]">
                Description
              </h3>
              <div className="mt-4 h-px w-12 bg-[#c9a96e]/30" />
            </div>

            <div className="md:col-span-3">
              <div
                className="prose prose-lg max-w-none font-light leading-relaxed text-gray-600 prose-headings:font-serif prose-strong:text-[#1c1c1a]"
                dangerouslySetInnerHTML={{__html: descriptionHtml}}
              />
            </div>
          </div>
        </div>

        {selectedVariant?.sku && (
          <div className="mt-16 border-t border-gray-100 pt-16">
            <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
              <div className="md:col-span-1">
                <h3 className="text-[11px] font-light uppercase tracking-[6px] text-[#c9a96e]">
                  Details
                </h3>
                <div className="mt-4 h-px w-12 bg-[#c9a96e]/30" />
              </div>

              <div className="md:col-span-3">
                <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="border-b border-gray-100 py-2">
                    <dt className="text-xs font-light uppercase tracking-wider text-gray-500">
                      SKU
                    </dt>
                    <dd className="mt-1 font-light">{selectedVariant.sku}</dd>
                  </div>

                  {selectedVariant.selectedOptions?.map((option) => (
                    <div
                      key={option.name}
                      className="border-b border-gray-100 py-2"
                    >
                      <dt className="text-xs font-light uppercase tracking-wider text-gray-500">
                        {option.name}
                      </dt>
                      <dd className="mt-1 font-light">{option.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          </div>
        )}
      </div>

      <Analytics.ProductView
        data={{
          products: [
            {
              id: product.id,
              title: product.title,
              price: selectedVariant?.price.amount || '0',
              vendor: product.vendor,
              variantId: selectedVariant?.id || '',
              variantTitle: selectedVariant?.title || '',
              quantity: 1,
            },
          ],
        }}
      />
    </>
  );
}

function CheckIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
    </svg>
  );
}

function PaymentIcon() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}

const PRODUCT_VARIANT_FRAGMENT = `#graphql
  fragment ProductVariant on ProductVariant {
    availableForSale
    compareAtPrice {
      amount
      currencyCode
    }
    id
    image {
      __typename
      id
      url
      altText
      width
      height
    }
    price {
      amount
      currencyCode
    }
    product {
      title
      handle
    }
    selectedOptions {
      name
      value
    }
    sku
    title
    unitPrice {
      amount
      currencyCode
    }
  }
` as const;

const PRODUCT_FRAGMENT = `#graphql
  fragment Product on Product {
    id
    title
    vendor
    handle
    descriptionHtml
    description
    encodedVariantExistence
    encodedVariantAvailability
    images(first: 10) {
      nodes {
        id
        url
        altText
        width
        height
      }
    }
    options {
      name
      optionValues {
        name
        firstSelectableVariant {
          ...ProductVariant
        }
        swatch {
          color
          image {
            previewImage {
              url
            }
          }
        }
      }
    }
    selectedOrFirstAvailableVariant(
      selectedOptions: $selectedOptions
      ignoreUnknownOptions: true
      caseInsensitiveMatch: true
    ) {
      ...ProductVariant
    }
    adjacentVariants(selectedOptions: $selectedOptions) {
      ...ProductVariant
    }
    seo {
      description
      title
    }
  }
  ${PRODUCT_VARIANT_FRAGMENT}
` as const;

const PRODUCT_QUERY = `#graphql
  query Product(
    $country: CountryCode
    $handle: String!
    $language: LanguageCode
    $selectedOptions: [SelectedOptionInput!]!
  ) @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...Product
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;