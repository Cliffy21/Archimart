// MongoDB Playground
// Use Ctrl+Space inside a snippet or a string literal to trigger completions.

// The current database to use.
use("theplancave");

db.products.aggregate([
    { $match: { category: "Residentials" } },
    { $project: { name: 1, category: 1, price: 1, image: 1, bedrooms: 1, bathrooms: 1, floors: 1, area: 1 } },
    { $sort: { price: 1 } }
]).pretty();

db.products.aggregate([
    { $match: { category: "Apartments" } },
    { $project: { name: 1, category: 1, price: 1, image: 1, bedrooms: 1, bathrooms: 1, floors: 1, area: 1 } },
    { $sort: { price: 1 } }
]).pretty();

db.products.aggregate([
    { $match: { category: "Luxury villas" } },
    { $project: { name: 1, category: 1, price: 1, image: 1, bedrooms: 1, bathrooms: 1, floors: 1, area: 1 } },
    { $sort: { price: 1 } }
]).pretty();
