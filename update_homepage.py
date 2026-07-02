import sys

with open('src/pages/HomePage.jsx', 'r', encoding='utf-8') as f:
    content = f.read()

carousel_code = """
const HeroCarousel = ({ products, addToCart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [products.length]);

  if (!products.length) return null;
  const product = products[currentIndex];

  return (
    <section className="relative pt-24 pb-24 md:pt-32 md:pb-32 overflow-hidden bg-white dark:bg-slate-950 transition-colors duration-300">
       <div className="absolute inset-0 z-0 overflow-hidden">
          <img src={product.image || "https://i.pinimg.com/736x/72/3a/c3/723ac3b4ac5a703b76570cdf966ea068.jpg"} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover opacity-15 dark:opacity-20 blur-2xl scale-110" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white dark:from-slate-950/80 dark:to-slate-950" />
       </div>
       <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 space-y-6 text-center md:text-left">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Featured Product
                </span>
             </div>
             <h1 className="text-[44px] md:text-[60px] font-extrabold text-slate-900 dark:text-white leading-[1.08] tracking-tight line-clamp-2">
               {product.name}
             </h1>
             <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-normal leading-relaxed max-w-xl line-clamp-3 mx-auto md:mx-0">
               {product.description}
             </p>
             <div className="text-3xl font-extrabold text-amber-600 dark:text-amber-500 pt-2">
                Rs. {product.price.toLocaleString()}
             </div>
             <div className="pt-4 flex justify-center md:justify-start gap-4">
               <button onClick={() => addToCart(product)} className="bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold px-8 py-4 rounded-xl shadow-lg transition duration-200 cursor-pointer transform hover:-translate-y-0.5">
                 Add to Cart
               </button>
               <Link to={`/product/${product.id}`} className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold px-8 py-4 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition duration-200 cursor-pointer">
                 View Details
               </Link>
             </div>
          </div>
          <div className="flex-1 w-full max-w-md mx-auto">
             <div className="relative rounded-3xl overflow-hidden aspect-square shadow-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
                 <ImageWithSkeleton src={product.image} alt={product.name} className="w-full h-full object-cover transform hover:scale-105 transition duration-700" />
                 {product.badge && (
                    <div className="absolute top-6 left-6 bg-red-600 text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase shadow-md shadow-red-900/20">
                       {product.badge}
                    </div>
                 )}
             </div>
          </div>
       </div>

       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2.5 z-20 overflow-x-auto max-w-[90vw] px-4 py-2 hide-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {products.map((_, i) => (
             <button 
               key={i} 
               onClick={() => setCurrentIndex(i)} 
               className={`h-2.5 shrink-0 rounded-full transition-all duration-300 cursor-pointer shadow-sm ${i === currentIndex ? 'bg-amber-500 w-8' : 'bg-slate-300 dark:bg-slate-700 w-2.5 hover:bg-slate-400 dark:hover:bg-slate-600'}`} 
               aria-label={`Go to slide ${i + 1}`}
             />
          ))}
       </div>
    </section>
  );
};

const HomePage = () => {
"""

content = content.replace("const HomePage = () => {", carousel_code)

start_str = '<section className="relative pt-12 pb-24 md:pt-20 md:pb-32 overflow-hidden bg-white dark:bg-slate-950">'
end_str = '</section>'

start_idx = content.find(start_str)
if start_idx != -1:
    end_idx = content.find(end_str, start_idx) + len(end_str)
    
    hero_replacement = "<HeroCarousel products={products} addToCart={addToCart} />"
    content = content[:start_idx] + hero_replacement + content[end_idx:]
else:
    print("Could not find hero section to replace")
    sys.exit(1)

with open('src/pages/HomePage.jsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("HomePage.jsx updated successfully.")
