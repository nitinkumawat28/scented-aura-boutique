import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useProductStore } from "@/store/products";
import { useSiteInfoStore } from "@/store/siteInfo";
import { useOrderStore } from "@/store/orders";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  Plus,
  Image as ImageIcon,
  Video,
  Settings,
  LogOut,
  Menu,
  X
} from "lucide-react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard — The Scented Aura" }] }),
  component: AdminPage,
});

const detailedSalesData = Array.from({ length: 30 }, (_, i) => ({
  date: `May ${i + 1}`,
  revenue: Math.floor(Math.random() * 40000) + 15000,
  orders: Math.floor(Math.random() * 20) + 5,
}));

const mockOrders = [
  { id: "ORD-1092", customer: "Aarav Sharma", date: "2026-04-12", total: 10500, status: "Delivered", items: 1 },
  { id: "ORD-1154", customer: "Priya Patel", date: "2026-05-02", total: 20500, status: "Processing", items: 2 },
  { id: "ORD-1155", customer: "Rahul Verma", date: "2026-05-14", total: 15500, status: "Shipped", items: 1 },
  { id: "ORD-1156", customer: "Neha Gupta", date: "2026-05-15", total: 32000, status: "Pending", items: 3 },
];
function AdminPage() {
  const productsList = useProductStore((s) => s.products);
  const addProduct = useProductStore((s) => s.addProduct);
  const updateProduct = useProductStore((s) => s.updateProduct);
  const deleteProduct = useProductStore((s) => s.deleteProduct);
  const fetchProducts = useProductStore((s) => s.fetchProducts);
  
  const ordersList = useOrderStore((s) => s.orders);
  const fetchOrders = useOrderStore((s) => s.fetchOrders);
  const updateOrderStatus = useOrderStore((s) => s.updateOrderStatus);

  const siteInfo = useSiteInfoStore();
  const updateSiteInfo = useSiteInfoStore((s) => s.updateSiteInfo);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const totalRevenue = ordersList.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = ordersList.length;

  const [activeTab, setActiveTab] = useState("dashboard");
  const [showUpload, setShowUpload] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  
  const [newName, setNewName] = useState("");
  const [newCat, setNewCat] = useState("Oriental");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState("");
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [draftSiteInfo, setDraftSiteInfo] = useState({
    aboutTitle: siteInfo.aboutTitle,
    aboutSubtitle: siteInfo.aboutSubtitle,
    aboutBody: siteInfo.aboutBody,
    philosophyQuote: siteInfo.philosophyQuote,
    philosophyAuthor: siteInfo.philosophyAuthor,
    contactTitle: siteInfo.contactTitle,
    contactSubtitle: siteInfo.contactSubtitle,
    contactBody: siteInfo.contactBody,
    locationUrl: siteInfo.locationUrl || "",
    boutiqueAddress: siteInfo.boutiqueAddress.join(', '),
    correspondenceEmails: siteInfo.correspondenceEmails.join(', '),
    phoneLines: siteInfo.phoneLines.join(', ')
  });
  const [isSiteInfoSaved, setIsSiteInfoSaved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSaveSiteInfo = () => {
    updateSiteInfo({
      aboutTitle: draftSiteInfo.aboutTitle,
      aboutSubtitle: draftSiteInfo.aboutSubtitle,
      aboutBody: draftSiteInfo.aboutBody,
      philosophyQuote: draftSiteInfo.philosophyQuote,
      philosophyAuthor: draftSiteInfo.philosophyAuthor,
      contactTitle: draftSiteInfo.contactTitle,
      contactSubtitle: draftSiteInfo.contactSubtitle,
      contactBody: draftSiteInfo.contactBody,
      locationUrl: draftSiteInfo.locationUrl,
      boutiqueAddress: draftSiteInfo.boutiqueAddress.split(',').map(s => s.trim()),
      correspondenceEmails: draftSiteInfo.correspondenceEmails.split(',').map(s => s.trim()),
      phoneLines: draftSiteInfo.phoneLines.split(',').map(s => s.trim()),
    });
    setIsSiteInfoSaved(true);
    setTimeout(() => setIsSiteInfoSaved(false), 3000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setMediaFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setMediaFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "admin@scented-aura.com" && password === "admin123") {
      setIsAuthenticated(true);
    } else {
      setError("Invalid admin credentials. (Hint: admin@scented-aura.com / admin123)");
    }
  };

  const handlePublish = async () => {
    if (!newName) return;
    
    let imageUrl = undefined;
    if (mediaFiles.length > 0) {
      imageUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(mediaFiles[0]);
      });
    }
    
    if (editingProductId) {
      updateProduct(editingProductId, {
        name: newName,
        category: newCat,
        price: Number(newPrice) || 0,
        stock: Number(newStock) || 0,
        ...(imageUrl && { image: imageUrl }),
      });
    } else {
      addProduct({
        name: newName,
        category: newCat,
        price: Number(newPrice) || 0,
        stock: Number(newStock) || 0,
        ...(imageUrl && { image: imageUrl }),
      });
    }
    
    setNewName("");
    setNewPrice("");
    setNewStock("");
    setNewCat("Oriental");
    setMediaFiles([]);
    setShowUpload(false);
    setEditingProductId(null);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-[var(--color-cream)] p-10 border border-border shadow-[var(--shadow-soft)] w-full max-w-md animate-in fade-in zoom-in duration-300">
          <div className="text-center mb-8">
            <h1 className="font-display text-3xl text-foreground uppercase tracking-widest">Admin Portal</h1>
            <p className="text-xs text-muted-foreground mt-2 uppercase tracking-widest">Restricted Access</p>
          </div>
          
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
              <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Password</label>
              <input required type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
            </div>
            
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            
            <button type="submit" className="w-full bg-[var(--color-gold-deep)] text-white py-4 text-sm font-medium uppercase tracking-widest hover:bg-[var(--color-gold-hover)] transition-colors mt-2">
              Login to Dashboard
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Admin Sidebar */}
      <div className={`w-64 bg-[var(--color-cream)] border-r border-border flex flex-col fixed h-screen z-50 transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <button className="lg:hidden absolute top-6 right-4 text-muted-foreground" onClick={() => setIsSidebarOpen(false)}>
          <X size={20} />
        </button>
        <div className="p-6 border-b border-border bg-muted/10">
          <h2 className="font-display text-xl text-foreground uppercase tracking-widest">Admin Portal</h2>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <button onClick={() => { setActiveTab("dashboard"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wide transition-colors ${activeTab === 'dashboard' ? 'bg-[var(--color-gold-deep)]/10 text-[var(--color-gold-deep)]' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => { setActiveTab("products"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wide transition-colors ${activeTab === 'products' ? 'bg-[var(--color-gold-deep)]/10 text-[var(--color-gold-deep)]' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
            <Package size={18} /> Products & Media
          </button>
          <button onClick={() => { setActiveTab("orders"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wide transition-colors ${activeTab === 'orders' ? 'bg-[var(--color-gold-deep)]/10 text-[var(--color-gold-deep)]' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
            <ShoppingCart size={18} /> Order History
          </button>
          <button onClick={() => { setActiveTab("customers"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wide transition-colors ${activeTab === 'customers' ? 'bg-[var(--color-gold-deep)]/10 text-[var(--color-gold-deep)]' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
            <Users size={18} /> Customers
          </button>
          <button onClick={() => { setActiveTab("site-info"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wide transition-colors ${activeTab === 'site-info' ? 'bg-[var(--color-gold-deep)]/10 text-[var(--color-gold-deep)]' : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'}`}>
            <Settings size={18} /> Site Settings
          </button>
        </nav>
        <div className="p-4 border-t border-border">
          <button onClick={() => {
            setIsAuthenticated(false);
            navigate({ to: "/" });
          }} className="w-full flex items-center gap-4 px-4 py-3 text-sm font-medium tracking-wide text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full lg:ml-64 p-4 sm:p-8 lg:p-12 overflow-y-auto overflow-x-hidden min-h-screen">
        
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8 pb-4 border-b border-border">
          <h1 className="font-display text-2xl text-foreground">Admin Portal</h1>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-foreground">
            <Menu size={24} />
          </button>
        </div>

        {activeTab === "dashboard" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h1 className="font-display text-4xl text-foreground">Overview</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-[var(--color-cream)] p-6 border border-border shadow-sm">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Total Revenue</p>
                <p className="text-4xl font-display text-foreground">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-xs font-semibold tracking-wider text-[var(--color-gold-deep)] mt-3 bg-[var(--color-gold-deep)]/10 w-fit px-2 py-1 rounded">Live from Supabase</p>
              </div>
              <div className="bg-[var(--color-cream)] p-6 border border-border shadow-sm">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Total Orders</p>
                <p className="text-4xl font-display text-foreground">{totalOrders}</p>
                <p className="text-xs font-semibold tracking-wider text-[var(--color-gold-deep)] mt-3 bg-[var(--color-gold-deep)]/10 w-fit px-2 py-1 rounded">Live from Supabase</p>
              </div>
              <div className="bg-[var(--color-cream)] p-6 border border-border shadow-sm">
                <p className="text-sm text-muted-foreground uppercase tracking-widest mb-2">Active Customers</p>
                <p className="text-4xl font-display text-foreground">2,405</p>
                <p className="text-xs font-semibold tracking-wider text-[var(--color-gold-deep)] mt-3 bg-[var(--color-gold-deep)]/10 w-fit px-2 py-1 rounded">+15.3% vs last month</p>
              </div>
            </div>

            <div className="bg-[var(--color-cream)] p-8 border border-border shadow-sm h-[450px]">
              <div className="flex justify-between items-center mb-8">
                <h3 className="font-medium text-foreground uppercase tracking-widest text-sm">30-Day Revenue Trend</h3>
                <span className="text-xs text-muted-foreground">May 1 - May 30</span>
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={detailedSalesData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-gold-deep)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--color-gold-deep)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <Area type="monotone" dataKey="revenue" stroke="var(--color-gold-deep)" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} activeDot={{ r: 6 }} />
                  <CartesianGrid stroke="#e5e7eb" strokeDasharray="5 5" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} dy={15} interval={4} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value / 1000}k`} dx={-10} />
                  <Tooltip cursor={{ stroke: "var(--color-gold-deep)", strokeWidth: 1, strokeDasharray: "5 5" }} contentStyle={{ backgroundColor: "var(--color-cream)", borderColor: "var(--color-border)", fontSize: "13px", padding: "10px" }} formatter={(value: number) => [`₹${value.toLocaleString()}`, "Revenue"]} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h1 className="font-display text-4xl text-foreground">Products & Media</h1>
              <button onClick={() => {
                if (showUpload) {
                  setShowUpload(false);
                  setEditingProductId(null);
                  setNewName(""); setNewPrice(""); setNewStock(""); setNewCat("Oriental");
                } else {
                  setShowUpload(true);
                }
              }} className="bg-[var(--color-gold-deep)] text-white px-6 py-2.5 text-sm uppercase tracking-widest hover:bg-[var(--color-gold-hover)] transition-colors flex items-center gap-2">
                {showUpload ? "Cancel" : <><Plus size={18} /> Add Product</>}
              </button>
            </div>

            {showUpload && (
              <div className="bg-[var(--color-cream)] p-8 border border-border shadow-sm animate-in slide-in-from-top-4 duration-300">
                <h3 className="font-medium text-foreground mb-6 uppercase tracking-widest text-sm">
                  {editingProductId ? "Edit Product Details" : "Upload New Product & Media"}
                </h3>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Product Name</label>
                      <input type="text" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                    </div>
                    <div>
                      <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Category</label>
                      <select value={newCat} onChange={(e) => setNewCat(e.target.value)} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground">
                        <option>Oriental</option>
                        <option>Floral</option>
                        <option>Gourmand</option>
                        <option>Chypre</option>
                        <option>Woody</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Price (₹)</label>
                        <input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Stock</label>
                        <input type="number" value={newStock} onChange={(e) => setNewStock(e.target.value)} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Media Upload (Photos & Videos)</label>
                    <label 
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed p-10 text-center transition-colors cursor-pointer flex flex-col items-center justify-center h-40 relative overflow-hidden group w-full ${isDragging ? 'border-[var(--color-gold-deep)] bg-[var(--color-gold-deep)]/5' : 'border-border hover:bg-muted/10 bg-background/50'}`}
                    >
                      <input type="file" multiple accept="image/jpeg,image/png,video/mp4" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                      
                      {mediaFiles.length > 0 ? (
                        <div className="flex flex-col items-center justify-center w-full z-10 pointer-events-none">
                          <p className="text-xl font-semibold text-[var(--color-gold-deep)] mb-1">{mediaFiles.length} file(s) attached</p>
                          <p className="text-xs text-muted-foreground uppercase tracking-widest">Click or drag to add more</p>
                        </div>
                      ) : (
                        <>
                          <div className={`flex gap-4 mb-4 text-[var(--color-gold-deep)] transition-transform duration-300 ${isDragging ? 'scale-110' : 'group-hover:scale-110'}`}>
                            <ImageIcon size={32} />
                            <Video size={32} />
                          </div>
                          <p className="text-sm font-medium text-foreground">Click or drag to upload photos & videos</p>
                          <p className="text-xs text-muted-foreground mt-2 tracking-wide uppercase">JPG, PNG, MP4 (Max 50MB)</p>
                        </>
                      )}
                    </label>

                    {mediaFiles.length > 0 && (
                      <div className="space-y-2 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                        {mediaFiles.map((f, i) => (
                          <div key={i} className="flex justify-between items-center text-xs bg-muted/30 p-3 border border-border">
                            <span className="truncate max-w-[200px] text-foreground font-medium">{f.name}</span>
                            <span className="text-muted-foreground font-medium">{(f.size / 1024 / 1024).toFixed(2)} MB</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      onClick={handlePublish}
                      className="w-full bg-foreground text-background py-3.5 text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors mt-2"
                    >
                      {editingProductId ? "Update Product" : "Save & Publish Product"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[var(--color-cream)] border border-border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Product</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Category</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Price</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Stock</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {productsList.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/10 transition-colors bg-background">
                      <td className="px-6 py-5 font-medium text-foreground">{p.name}</td>
                      <td className="px-6 py-5 text-muted-foreground uppercase tracking-wide text-xs">{p.category}</td>
                      <td className="px-6 py-5 font-medium">₹{p.price.toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded text-[10px] uppercase tracking-widest font-bold ${(p.stock || 0) < 20 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                          {p.stock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right space-x-4">
                        <button 
                          onClick={() => {
                            setEditingProductId(p.id);
                            setNewName(p.name);
                            setNewCat(p.category);
                            setNewPrice(p.price.toString());
                            setNewStock(p.stock?.toString() || "0");
                            setShowUpload(true);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                          }}
                          className="text-muted-foreground hover:text-foreground uppercase tracking-widest text-[10px] font-bold"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={async () => {
                            if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                              await deleteProduct(p.id);
                            }
                          }}
                          className="text-red-500 hover:text-red-700 uppercase tracking-widest text-[10px] font-bold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h1 className="font-display text-4xl text-foreground pb-4 border-b border-border">Order History</h1>
            
            <div className="bg-[var(--color-cream)] border border-border shadow-sm overflow-x-auto">
              <table className="w-full text-left text-sm min-w-[600px]">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Order ID</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Customer</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Date</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Total</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs">Status</th>
                    <th className="px-6 py-5 font-semibold uppercase tracking-widest text-xs text-right">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ordersList.map((o) => (
                    <tr key={o.id} className="hover:bg-muted/10 transition-colors bg-background">
                      <td className="px-6 py-5 font-medium text-foreground">{o.id}</td>
                      <td className="px-6 py-5">{o.customer}</td>
                      <td className="px-6 py-5 text-muted-foreground">
                        {new Date(o.created_at || o.date).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </td>
                      <td className="px-6 py-5 font-medium">₹{o.total.toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <select
                          value={o.status}
                          onChange={(e) => updateOrderStatus(o.id, e.target.value)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded border-none outline-none cursor-pointer ${
                            o.status === "Delivered" ? "bg-green-100 text-green-700" :
                            o.status === "Shipped" ? "bg-blue-100 text-blue-700" :
                            o.status === "Processing" ? "bg-amber-100 text-amber-700" :
                            "bg-[var(--color-gold-deep)]/20 text-[var(--color-gold-deep)]"
                          }`}
                        >
                          <option value="Pending" className="text-foreground bg-background">Pending</option>
                          <option value="Processing" className="text-foreground bg-background">Processing</option>
                          <option value="Shipped" className="text-foreground bg-background">Shipped</option>
                          <option value="Delivered" className="text-foreground bg-background">Delivered</option>
                        </select>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <button className="text-[var(--color-gold-deep)] hover:underline uppercase tracking-widest text-[10px] font-bold">View</button>
                      </td>
                    </tr>
                  ))}

                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <h1 className="font-display text-4xl text-foreground pb-4 border-b border-border">Customers</h1>
            <div className="bg-[var(--color-cream)] p-20 border border-border shadow-sm text-center text-muted-foreground uppercase tracking-widest text-sm">
              Select a customer to view their detailed profile
            </div>
          </div>
        )}
        {activeTab === "site-info" && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-border">
              <h1 className="font-display text-4xl text-foreground">Site Settings</h1>
              <button 
                onClick={handleSaveSiteInfo}
                className="bg-[var(--color-gold-deep)] text-white px-6 py-2.5 text-sm uppercase tracking-widest hover:bg-[var(--color-gold-hover)] transition-colors flex items-center gap-2"
              >
                {isSiteInfoSaved ? "Saved" : "Save Information"}
              </button>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-8">
              {/* About Page Settings */}
              <div className="bg-[var(--color-cream)] p-8 border border-border shadow-sm">
                <h2 className="font-display text-2xl text-foreground mb-6 uppercase tracking-widest text-sm">About Page Content</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Title</label>
                    <input type="text" value={draftSiteInfo.aboutTitle} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, aboutTitle: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Subtitle (Italic)</label>
                    <input type="text" value={draftSiteInfo.aboutSubtitle} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, aboutSubtitle: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Body Text</label>
                    <textarea rows={4} value={draftSiteInfo.aboutBody} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, aboutBody: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground resize-none" />
                  </div>
                  
                  <div className="pt-4 border-t border-border mt-6">
                    <h3 className="font-medium text-xs uppercase tracking-widest text-muted-foreground mb-4">Philosophy Section</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Quote</label>
                        <textarea rows={3} value={draftSiteInfo.philosophyQuote} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, philosophyQuote: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground resize-none" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Author</label>
                        <input type="text" value={draftSiteInfo.philosophyAuthor} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, philosophyAuthor: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Page Settings */}
              <div className="bg-[var(--color-cream)] p-8 border border-border shadow-sm">
                <h2 className="font-display text-2xl text-foreground mb-6 uppercase tracking-widest text-sm">Contact Page Content</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Title</label>
                    <input type="text" value={draftSiteInfo.contactTitle} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, contactTitle: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Subtitle (Italic)</label>
                    <input type="text" value={draftSiteInfo.contactSubtitle} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, contactSubtitle: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Body Text</label>
                    <textarea rows={3} value={draftSiteInfo.contactBody} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, contactBody: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground resize-none" />
                  </div>

                  <div className="pt-4 border-t border-border mt-6">
                    <h3 className="font-medium text-xs uppercase tracking-widest text-muted-foreground mb-4">Contact Details</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Location Map Embed URL</label>
                        <input type="text" placeholder="https://www.google.com/maps/embed?..." value={draftSiteInfo.locationUrl} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, locationUrl: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Boutique Address (Comma Separated)</label>
                        <input type="text" value={draftSiteInfo.boutiqueAddress} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, boutiqueAddress: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Emails (Comma Separated)</label>
                        <input type="text" value={draftSiteInfo.correspondenceEmails} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, correspondenceEmails: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Phone Lines (Comma Separated)</label>
                        <input type="text" value={draftSiteInfo.phoneLines} onChange={(e) => setDraftSiteInfo({ ...draftSiteInfo, phoneLines: e.target.value })} className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] text-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end">
              <button 
                onClick={handleSaveSiteInfo}
                className="bg-foreground text-background px-8 py-3.5 text-sm uppercase tracking-widest hover:bg-foreground/90 transition-colors"
              >
                {isSiteInfoSaved ? "Settings Saved Successfully" : "Save Information"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
