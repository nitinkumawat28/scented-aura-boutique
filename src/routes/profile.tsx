import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { useUser, User } from "@/store/user";
import { User as UserIcon, Package, Settings, LogOut, ChevronRight, CheckCircle2, Truck } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "My Profile — The Scented Aura" }] }),
  component: ProfilePage,
});

type Tab = "orders" | "profile" | "addresses";

function ProfilePage() {
  const user = useUser((s) => s.user);
  const orders = useUser((s) => s.orders);
  const logout = useUser((s) => s.logout);
  const updateProfile = useUser((s) => s.updateProfile);
  const addAddress = useUser((s) => s.addAddress);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("profile");
  
  // Profile Edits
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [email, setEmail] = useState(user?.email || "");
  const [mobile, setMobile] = useState(user?.mobile || "");

  // Address Edits
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({ name: "", street: "", city: "", state: "", pincode: "", mobile: "" });

  // Order Tracking
  const [trackingOrder, setTrackingOrder] = useState<string | null>(null);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleLogout = () => {
    logout();
    navigate({ to: "/" });
  };

  const saveInfo = () => {
    updateProfile({ firstName, lastName, gender: gender as User['gender'], email, mobile });
    setIsEditingInfo(false);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    addAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({ name: "", street: "", city: "", state: "", pincode: "", mobile: "" });
  };

  return (
    <div className="pt-32 pb-24 min-h-screen bg-[var(--color-secondary)]/30">
      <div className="mx-auto max-w-[1200px] px-4 lg:px-8 flex flex-col md:flex-row gap-6">
        
        {/* Sidebar */}
        <div className="w-full md:w-72 flex-shrink-0 space-y-4">
          <div className="bg-[var(--color-cream)] p-4 flex items-center gap-4 border border-border shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[var(--color-gold-deep)]/10 flex items-center justify-center text-[var(--color-gold-deep)]">
              <UserIcon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">Hello,</p>
              <p className="font-semibold text-foreground text-lg">{user.firstName} {user.lastName}</p>
            </div>
          </div>

          <div className="bg-[var(--color-cream)] border border-border shadow-sm">
            <div className="flex flex-col text-sm">
              <button 
                onClick={() => setActiveTab("orders")}
                className={`flex items-center justify-between p-4 border-b border-border/50 transition-colors ${activeTab === "orders" ? "text-[var(--color-gold-deep)] font-semibold bg-muted/30" : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"}`}
              >
                <span className="flex items-center gap-4 uppercase tracking-widest"><Package size={18} /> My Orders</span>
                <ChevronRight size={16} />
              </button>

              <div className="p-4 border-b border-border/50">
                <span className="flex items-center gap-4 text-muted-foreground mb-4 uppercase tracking-widest font-semibold"><Settings size={18} /> Account Settings</span>
                <div className="flex flex-col ml-8 space-y-4 text-[13px] tracking-wide">
                  <button 
                    onClick={() => setActiveTab("profile")}
                    className={`text-left transition-colors ${activeTab === "profile" ? "text-[var(--color-gold-deep)] font-medium" : "text-foreground hover:text-[var(--color-gold-hover)]"}`}
                  >
                    Profile Information
                  </button>
                  <button 
                    onClick={() => setActiveTab("addresses")}
                    className={`text-left transition-colors ${activeTab === "addresses" ? "text-[var(--color-gold-deep)] font-medium" : "text-foreground hover:text-[var(--color-gold-hover)]"}`}
                  >
                    Manage Addresses
                  </button>
                </div>
              </div>

              <button 
                onClick={handleLogout}
                className="flex items-center gap-4 p-4 text-muted-foreground hover:text-destructive transition-colors text-left uppercase tracking-widest font-semibold"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 bg-[var(--color-cream)] border border-border shadow-sm p-6 lg:p-10">
          
          {activeTab === "profile" && (
            <div className="space-y-10 animate-in fade-in duration-300">
              <div className="flex justify-between items-center pb-4 border-b border-border">
                <h2 className="font-semibold text-lg text-foreground tracking-wide">Profile Details</h2>
                {!isEditingInfo ? (
                  <button onClick={() => setIsEditingInfo(true)} className="text-[var(--color-gold-deep)] text-sm font-medium hover:underline">Edit Info</button>
                ) : (
                  <button onClick={saveInfo} className="bg-[var(--color-gold-deep)] text-white px-4 py-1.5 text-xs font-medium tracking-widest uppercase hover:bg-[var(--color-gold-hover)] transition-colors">
                    Save Changes
                  </button>
                )}
              </div>
              
              <div className="space-y-6 max-w-lg">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      disabled={!isEditingInfo}
                      className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] disabled:opacity-70 disabled:bg-muted/20 text-foreground" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      disabled={!isEditingInfo}
                      className="w-full bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] disabled:opacity-70 disabled:bg-muted/20 text-foreground" 
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-3">Your Gender</label>
                  <div className="flex items-center gap-8">
                    <label className={`flex items-center gap-2 ${isEditingInfo ? 'cursor-pointer' : 'cursor-default opacity-70'}`}>
                      <input type="radio" name="gender" value="Male" checked={gender === "Male"} onChange={() => isEditingInfo && setGender("Male")} disabled={!isEditingInfo} className="accent-[var(--color-gold-deep)] w-4 h-4" />
                      <span className="text-sm text-foreground">Male</span>
                    </label>
                    <label className={`flex items-center gap-2 ${isEditingInfo ? 'cursor-pointer' : 'cursor-default opacity-70'}`}>
                      <input type="radio" name="gender" value="Female" checked={gender === "Female"} onChange={() => isEditingInfo && setGender("Female")} disabled={!isEditingInfo} className="accent-[var(--color-gold-deep)] w-4 h-4" />
                      <span className="text-sm text-foreground">Female</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <div className="mb-4">
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Email Address</label>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={!isEditingInfo} className="w-full max-w-lg bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] disabled:opacity-70 disabled:bg-muted/20 text-foreground" />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-muted-foreground mb-2">Mobile Number</label>
                  <input type="tel" value={mobile} onChange={(e) => setMobile(e.target.value)} disabled={!isEditingInfo} className="w-full max-w-lg bg-transparent border border-border px-4 py-3 outline-none focus:border-[var(--color-gold)] disabled:opacity-70 disabled:bg-muted/20 text-foreground" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "addresses" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="font-semibold text-lg text-foreground pb-4 border-b border-border tracking-wide">Manage Addresses</h2>
              
              {!isAddingAddress ? (
                <button onClick={() => setIsAddingAddress(true)} className="w-full py-4 border border-dashed border-[var(--color-gold-deep)] text-[var(--color-gold-deep)] font-medium flex items-center justify-center gap-2 hover:bg-[var(--color-gold-deep)]/5 transition-colors">
                  <span className="text-xl">+</span> Add a new address
                </button>
              ) : (
                <form onSubmit={handleAddAddress} className="border border-border p-5 space-y-4 bg-muted/10 animate-in fade-in">
                  <h3 className="font-medium text-foreground mb-4">Add New Address</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input required type="text" placeholder="Full Name" value={newAddr.name} onChange={(e) => setNewAddr({...newAddr, name: e.target.value})} className="w-full bg-transparent border border-border px-4 py-2 outline-none focus:border-[var(--color-gold)] text-foreground" />
                    <input required type="tel" placeholder="Mobile Number" value={newAddr.mobile} onChange={(e) => setNewAddr({...newAddr, mobile: e.target.value})} className="w-full bg-transparent border border-border px-4 py-2 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  </div>
                  <input required type="text" placeholder="Street Address" value={newAddr.street} onChange={(e) => setNewAddr({...newAddr, street: e.target.value})} className="w-full bg-transparent border border-border px-4 py-2 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <input required type="text" placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({...newAddr, city: e.target.value})} className="w-full bg-transparent border border-border px-4 py-2 outline-none focus:border-[var(--color-gold)] text-foreground" />
                    <input required type="text" placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({...newAddr, state: e.target.value})} className="w-full bg-transparent border border-border px-4 py-2 outline-none focus:border-[var(--color-gold)] text-foreground" />
                    <input required type="text" placeholder="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr({...newAddr, pincode: e.target.value})} className="w-full bg-transparent border border-border px-4 py-2 outline-none focus:border-[var(--color-gold)] text-foreground" />
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="submit" className="bg-[var(--color-gold-deep)] text-white px-6 py-2 text-sm uppercase tracking-widest hover:bg-[var(--color-gold-hover)] transition-colors">Save</button>
                    <button type="button" onClick={() => setIsAddingAddress(false)} className="text-muted-foreground hover:text-foreground text-sm uppercase tracking-widest">Cancel</button>
                  </div>
                </form>
              )}
              
              <div className="space-y-4 mt-6">
                {user.addresses.map((addr) => (
                  <div key={addr.id} className="border border-border p-5 relative hover:shadow-sm transition-shadow bg-background">
                    <div className="flex items-center gap-4 mb-3">
                      <span className="font-semibold text-foreground text-sm uppercase tracking-wide">{addr.name}</span>
                      <span className="text-[10px] tracking-widest font-semibold bg-muted px-2 py-0.5 rounded text-muted-foreground uppercase">HOME</span>
                      <span className="text-sm font-medium text-foreground">{addr.mobile}</span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-lg">
                      {addr.street}, {addr.city}, {addr.state} - <span className="font-medium text-foreground">{addr.pincode}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "orders" && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <h2 className="font-semibold text-lg text-foreground pb-4 border-b border-border tracking-wide">My Orders</h2>
              {orders.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">You haven't placed any orders yet.</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {orders.map((order) => (
                    <div key={order.id} className="border border-border hover:shadow-sm transition-shadow bg-background overflow-hidden">
                      <div className="bg-muted/30 p-5 border-b border-border flex flex-col sm:flex-row justify-between sm:items-center gap-3">
                        <div>
                          <p className="font-semibold text-foreground tracking-wide">{order.id}</p>
                          <p className="text-xs text-muted-foreground mt-1 tracking-wider uppercase">Placed on {order.date}</p>
                        </div>
                        <div className="text-left sm:text-right">
                          <p className="font-medium text-foreground">₹{order.total}</p>
                          <p className="text-xs font-semibold text-[var(--color-gold-deep)] uppercase tracking-wider mt-1">{order.status}</p>
                        </div>
                      </div>
                      
                      <div className="p-5 space-y-4">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-5">
                            <div className="w-16 h-20 bg-muted/50 flex-shrink-0" />
                            <div className="flex-1">
                              <p className="font-medium text-foreground text-sm tracking-wide">{item.name}</p>
                              <p className="text-xs text-muted-foreground mt-2 tracking-wider">Qty: {item.qty}</p>
                            </div>
                            <div className="text-sm font-medium text-foreground">₹{item.price}</div>
                          </div>
                        ))}
                      </div>

                      <div 
                        className="p-4 border-t border-border text-center hover:bg-[var(--color-gold-deep)]/5 transition-colors cursor-pointer"
                        onClick={() => setTrackingOrder(trackingOrder === order.id ? null : order.id)}
                      >
                        <button className="text-sm font-semibold text-[var(--color-gold-deep)] uppercase tracking-widest flex items-center justify-center gap-2 w-full">
                          {trackingOrder === order.id ? "Hide Tracking" : "Track Order"} <ChevronRight size={14} strokeWidth={2} className={`transition-transform duration-300 ${trackingOrder === order.id ? "rotate-90" : ""}`} />
                        </button>
                      </div>

                      {trackingOrder === order.id && (
                        <div className="p-6 border-t border-border bg-muted/10 animate-in slide-in-from-top-2 duration-300">
                          <h4 className="text-sm font-medium text-foreground mb-6 uppercase tracking-widest">Tracking Details</h4>
                          <div className="relative pl-6 space-y-6 before:absolute before:inset-y-2 before:left-[11px] before:w-px before:bg-border">
                            <div className="relative">
                              <span className="absolute -left-[30px] w-5 h-5 rounded-full bg-[var(--color-gold-deep)] text-white flex items-center justify-center border-4 border-background"><CheckCircle2 size={12} /></span>
                              <p className="font-medium text-foreground text-sm">Order Confirmed</p>
                              <p className="text-xs text-muted-foreground mt-1">{order.date} - 10:30 AM</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[30px] w-5 h-5 rounded-full bg-[var(--color-gold-deep)] text-white flex items-center justify-center border-4 border-background"><CheckCircle2 size={12} /></span>
                              <p className="font-medium text-foreground text-sm">Shipped from Warehouse</p>
                              <p className="text-xs text-muted-foreground mt-1">Delhi Facility</p>
                            </div>
                            <div className="relative">
                              <span className="absolute -left-[30px] w-5 h-5 rounded-full bg-background border-2 border-[var(--color-gold-deep)] text-[var(--color-gold-deep)] flex items-center justify-center"><Truck size={10} /></span>
                              <p className="font-medium text-foreground text-sm">In Transit</p>
                              <p className="text-xs text-muted-foreground mt-1">Expected delivery in 2-3 days</p>
                            </div>
                          </div>
                        </div>
                      )}

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
