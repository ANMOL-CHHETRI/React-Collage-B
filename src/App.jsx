import Router from "./Router";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <CartProvider>
      <Router/>
    </CartProvider>
  );
}

export default App;
