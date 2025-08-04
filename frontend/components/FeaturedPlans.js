export default function FeaturedPlans({ plans }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map(plan => (
                <div key={plan.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                    <img 
                        src={plan.image} 
                        alt={plan.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <h3 className="text-lg font-semibold">{plan.name}</h3>
                    <p className="text-gray-600">${plan.price}</p>
                    <Link 
                        href={`/products/${plan.id}`}
                        className="mt-4 inline-block text-blue-600 hover:text-blue-800"
                    >
                        View Details →
                    </Link>
                </div>
            ))}
        </div>
    );
}