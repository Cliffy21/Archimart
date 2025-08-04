export function PlanCard({ plan, isPurchased = false, onPurchase }) {
  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <img 
        src={plan.imageUrl || '/default-plan.jpg'} 
        alt={plan.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-bold text-lg">{plan.name}</h3>
        <p className="text-gray-600 text-sm mt-1 line-clamp-2">
          {plan.description}
        </p>
        <div className="mt-4 flex justify-between items-center">
          <span className="font-bold">${plan.price.toFixed(2)}</span>
          {isPurchased ? (
            <button className="text-sm bg-gray-200 px-3 py-1 rounded">
              View Details
            </button>
          ) : (
            <button 
              className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              onClick={onPurchase}
            >
              Purchase
            </button>
          )}
        </div>
      </div>
    </div>
  );
}