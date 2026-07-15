import { useCart } from "../context/CartContext"
import OutOfStockModal from "./OutOfStockModal"

const GlobalOutOfStockModal = () => {
  const { outOfStockAlert, setOutOfStockAlert } = useCart()

  return (
    <OutOfStockModal
      productName={outOfStockAlert}
      onClose={() => setOutOfStockAlert(null)}
    />
  )
}

export default GlobalOutOfStockModal