import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Package, Tag, ShoppingCart, LogOut, ArrowLeft, Image, Trophy, Settings } from "lucide-react";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminBanners from "@/components/admin/AdminBanners";
import AdminAwards from "@/components/admin/AdminAwards";
import AdminSettings from "@/components/admin/AdminSettings";
import AdminProducts from "@/components/admin/AdminProducts";
import AdminPromotions from "@/components/admin/AdminPromotions";

const Admin = () => {
  const { user, isAdmin, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>("products");

  if (loading) return <div className="pt-16 min-h-screen flex items-center justify-center text-muted-foreground">Loading...</div>;
  
  if (!user) {
    navigate("/auth");
    return null;
  }

  if (!isAdmin) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-3xl text-foreground mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-6">You do not have admin privileges.</p>
          <Link to="/" className="bg-primary text-primary-foreground px-6 py-2 rounded text-sm font-semibold uppercase">Go Home</Link>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "products", label: "Products", icon: Package },
    { id: "promotions", label: "Promos", icon: Tag },
    { id: "orders", label: "Orders", icon: ShoppingCart },
    { id: "banners", label: "Banners", icon: Image },
    { id: "awards", label: "Awards", icon: Trophy },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors"><ArrowLeft size={20} /></Link>
            <h1 className="font-display text-xl text-foreground">Admin Dashboard</h1>
          </div>
          <button onClick={() => { signOut(); navigate("/"); }} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-1 mb-6 border-b border-border overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </div>

        {tab === "products" && <AdminProducts />}
        {tab === "promotions" && <AdminPromotions />}
        {tab === "orders" && <AdminOrders />}
        {tab === "banners" && <AdminBanners />}
        {tab === "awards" && <AdminAwards />}
        {tab === "settings" && <AdminSettings />}
      </div>
    </div>
  );
};

export default Admin;
