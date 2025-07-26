import React from 'react';
import { Link } from 'react-router-dom';
import { Card, AdvancedAnimatedSection } from '../common';
import './FeaturedProducts.css';



const staticFeaturedProducts = [
  {
    _id: '1',
    name: 'Produit 1',
    description: 'Description for Produit 1. This is a high-quality textile product.',
    images: ['/produit.png'],
    link: '/products/1'
  },
  {
    _id: '2',
    name: 'Produit 2',
    description: 'Description for Produit 2. Another excellent textile product.',
    images: ['/produit2.png'],
    link: '/products/2'
  },
  {
    _id: '3',
    name: 'Still Life Fashion',
    description: 'A stylish textile product from our collection. Say no to fast fashion.',
    images: ['/still-life-say-no-fast-fashion.jpg'],
    link: '/products/3'
  },
];

const FeaturedProducts = () => {
  const products = staticFeaturedProducts;

  if (products.length === 0) {
    return null; // Don't show the section if there are no featured products
  }

  return (
    <section className="featured-products">
      <div className="container">
        <div className="section-header">
          <AdvancedAnimatedSection
            animationType="slideFromTop"
            duration={1.0}
            delay={0}
          >
            <h2 className="section-title">
              Featured Products
            </h2>
          </AdvancedAnimatedSection>
          
          <AdvancedAnimatedSection
            animationType="slideFromLeft"
            duration={1.0}
            delay={0.2}
          >
            <p className="section-subtitle">
              Discover our selection of high-quality textile products
            </p>
          </AdvancedAnimatedSection>
        </div>

        <AdvancedAnimatedSection
          animationType="fadeIn"
          duration={1.0}
          delay={0.4}
          staggerChildren={0.1}
          className="products-grid"
        >
          {products.map((product, index) => (
            <AdvancedAnimatedSection
              key={product._id}
              animationType="slideFromRight"
              duration={1.0}
              delay={0.1 * index}
              parallax={true}
              parallaxSpeed={0.2}
              className="product-item"
            >
              <Card
                title={product.name}
                image={product.images[0]}
                content={<p>{product.description.substring(0, 100)}...</p>}
                linkTo={`/products/${product._id}`}
                linkText="View Details"
              />
            </AdvancedAnimatedSection>
          ))}
        </AdvancedAnimatedSection>

        <AdvancedAnimatedSection
          animationType="slideFromBottom"
          duration={1.0}
          delay={0.8}
          className="view-all-container"
        >
          <Link to="/products" className="view-all-link">
            View All Products
          </Link>
        </AdvancedAnimatedSection>
      </div>
    </section>
  );
};

export default FeaturedProducts;