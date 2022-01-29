export function PricingCard({
  product,
  priceString = '',
  billingInterval = '',
  onClick,
  buttonLabel,
}) {
  const { name, description } = product

  return (
    <div className="ring-2 ring-gray-700 p-2">
      <h2>{name}</h2>
      <p>{description}</p>
      {priceString && (
        <p>
          <span>{priceString}</span>
          <span>/{billingInterval}</span>
        </p>
      )}

      <button
        // variant="slim"
        type="button"
        // disabled={session && !userLoaded}
        // loading={priceIdLoading === price.id}
        onClick={onClick}
      >
        {buttonLabel}
      </button>
    </div>
  )
}
