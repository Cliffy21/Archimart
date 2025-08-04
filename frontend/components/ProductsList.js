import { useEffect, useState } from 'react';

function ProductsList() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProducts(data.data);
                } else {
                    console.error('Failed to fetch products');
                }
            });
    }, []);

    return (

        <><div> <h1>Welcome to Our Store</h1> <ProductsList /> </div><div>
            <h1>Product List</h1>
            <ul>
                {products.map(product => (
                    <li key={product.productId}>{product.name} - ${product.price}</li>
                ))}
            </ul>
        </div></>
    );
}

export default ProductsList;
