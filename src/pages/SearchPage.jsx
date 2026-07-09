import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import ProductCard from "../components/ProductCard";
import { Skeleton } from "../components/Skeleton";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const { products } = useProducts();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate slight loading state for smooth UI transition
    const timer = setTimeout(() => {
      setLoading(false);
    }, 400);

    if (products) {
      const lowerQuery = query.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(lowerQuery) ||
          p.category.toLowerCase().includes(lowerQuery) ||
          (p.description && p.description.toLowerCase().includes(lowerQuery))
      );
      setResults(filtered);
    }
    
    return () => clearTimeout(timer);
  }, [query, products]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-4">
            Search Results
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">
            Showing results for <span className="font-bold text-amber-600 dark:text-amber-500">"{query}"</span>
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                <Skeleton className="w-full h-64 rounded-xl mb-4" />
                <Skeleton className="w-3/4 h-6 mb-2" />
                <Skeleton className="w-1/2 h-4 mb-4" />
                <Skeleton className="w-full h-10 rounded-xl" />
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 animate-fade-in-up" style={{animationDelay: '100ms'}}>
            {results.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800 animate-fade-in-up">
            <div className="w-20 h-20 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-400">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No products found</h2>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-md mx-auto">
              We couldn't find any items matching "{query}". Try checking your spelling or searching for a different term.
            </p>
            <Link 
              to="/"
              className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-3.5 rounded-full font-bold hover:bg-slate-800 dark:hover:bg-slate-100 transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              Continue Shopping
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
