import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { useRegion } from "@/context/RegionContext";
import { useAuth } from "@/context/AuthContext";
import { Minus, Plus, Trash2, CreditCard, Banknote } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { buildShopifyCheckoutUrl, getShopifySetupStatus } from "@/lib/shopify";

type PaymentMethod = "manual" | "shopify";

const Cart = () => {
  const { items, updateQuantity, removeItem, clearCart, totalPrice } = useCart();
  const { formatPrice, region } = useRegion();
  const { user } = useAuth();
  const { data: settings } = useSiteSettings();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("manual");
  const [isProcessing, setIsProcessing] = useState(false);
  const shopifySetup = getShopifySetupStatus(settings || {});

  const orderItemSummary = items
    .map((item) => `${item.quantity} x ${item.product.name} (${item.size === "full" ? "750ml" : "50ml"})`)
    .join(", ");

  const createOrderRecord = async (notes: string, status = "pending") => {
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        user_id: user?.id,
        customer_name: user?.user_metadata?.full_name || user?.email || "",
        customer_email: user?.email || "",
        region_id: region.id,
        currency: region.currency,
        total_amount: totalPrice,
        status,
        notes,
      })
      .select()
      .single();

    if (error || !order) {
      throw new Error("Failed to create order. Please try again.");
    }

    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.product.id,
      size: item.size,
      quantity: item.quantity,
      unit_price: item.size === "full" ? item.product.price_full : item.product.price_mini,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) {
      throw new Error("Failed to save order items.");
    }

    return order;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.info("Please sign in to complete your order.");
      navigate("/auth");
      return;
    }

    setIsProcessing(true);

    try {
      if (paymentMethod === "shopify") {
        const checkout = buildShopifyCheckoutUrl(settings || {}, items, user.email);

        if (!checkout.ok) {
          toast.error(
            checkout.missingProducts.length > 0
              ? `Shopify is missing variant IDs for: ${checkout.missingProducts.join(", ")}`
              : "Shopify checkout is not configured yet.",
          );
          return;
        }

        try {
          await createOrderRecord(
            `Shopify checkout started. ${orderItemSummary}`,
            "awaiting_shopify_payment",
          );
        } catch (error) {
          console.error("Failed to save Shopify checkout attempt", error);
        }

        window.location.assign(checkout.url);
        return;
      }

      await createOrderRecord(`Manual payment (Cash/EFT). ${orderItemSummary}`);
      toast.success(
        "Order placed! We'll contact you with EFT/cash payment details and arrange delivery to " +
          region.name +
          ".",
      );
      clearCart();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-6">Browse our collection and add your favourite spirits.</p>
          <Link to="/shop" className="bg-primary text-primary-foreground px-8 py-3 rounded font-semibold uppercase text-sm tracking-wider">
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-16 min-h-screen">
      <div className="container mx-auto px-4 py-10">
        <h1 className="font-display text-3xl text-foreground mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => {
              const price = item.size === "full" ? item.product.price_full : item.product.price_mini;
              return (
                <div key={`${item.product.id}-${item.size}`} className="flex gap-4 bg-card border border-border rounded-lg p-4">
                  <img src={item.product.image_url || "/placeholder.svg"} alt={item.product.name} className="w-20 h-28 object-cover rounded" />
                  <div className="flex-1">
                    <h3 className="font-display text-foreground">{item.product.name}</h3>
                    <p className="text-xs text-muted-foreground uppercase">{item.size === "full" ? "750ml" : "50ml"}</p>
                    <p className="text-primary font-semibold mt-1">{formatPrice(price)}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)} className="p-1 bg-secondary rounded hover:bg-muted transition-colors">
                        <Minus size={14} className="text-foreground" />
                      </button>
                      <span className="text-sm text-foreground font-semibold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)} className="p-1 bg-secondary rounded hover:bg-muted transition-colors">
                        <Plus size={14} className="text-foreground" />
                      </button>
                      <button onClick={() => removeItem(item.product.id, item.size)} className="p-1 text-destructive hover:text-destructive/80 ml-auto">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="bg-card border border-border rounded-lg p-6 h-fit space-y-4">
            <h3 className="font-display text-lg text-foreground">Order Summary</h3>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment Method</p>
              <button
                onClick={() => setPaymentMethod("manual")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-colors ${
                  paymentMethod === "manual"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <Banknote size={18} className={paymentMethod === "manual" ? "text-primary" : ""} />
                <div>
                  <p className="font-semibold">Cash / EFT</p>
                  <p className="text-xs text-muted-foreground">We'll send you payment details after ordering</p>
                </div>
              </button>
              <button
                onClick={() => setPaymentMethod("shopify")}
                className={`w-full flex items-center gap-3 p-3 rounded-lg border text-left text-sm transition-colors ${
                  paymentMethod === "shopify"
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                <CreditCard size={18} className={paymentMethod === "shopify" ? "text-primary" : ""} />
                <div>
                  <p className="font-semibold">Shopify Secure Checkout</p>
                  <p className="text-xs text-muted-foreground">
                    {shopifySetup.isConfigured
                      ? "Redirects to Shopify hosted checkout with Shop Pay support"
                      : "Set your Shopify store domain and variant IDs in Admin Settings"}
                  </p>
                </div>
              </button>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Delivery to {region.name} {region.flag}</span>
                <span className="text-foreground">TBC</span>
              </div>
              <div className="border-t border-border pt-2 flex justify-between text-foreground font-semibold">
                <span>Total</span>
                <span className="text-primary">{formatPrice(totalPrice)}</span>
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{region.deliveryInfo}</p>
            <p className="text-xs text-muted-foreground">Est. {region.deliveryDays}</p>
            <button
              onClick={handleCheckout}
              disabled={isProcessing || (paymentMethod === "shopify" && !shopifySetup.isConfigured)}
              className="w-full bg-primary text-primary-foreground py-3 rounded font-semibold uppercase text-sm tracking-wider hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {!user
                ? "Sign In to Order"
                : isProcessing
                  ? "Processing..."
                  : paymentMethod === "shopify"
                    ? "Continue to Shopify"
                    : "Place Order"}
            </button>
            <button onClick={clearCart} className="w-full text-muted-foreground text-xs hover:text-foreground transition-colors">
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
