import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Login from "./Login";
import Home from "./Dashboard/Home";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import ProtectedRoute from "./ProtectedRoutes";
import "./fonts.css";
import OrganizationSetup from "./Organization Setup Module/OrganizationSetup";
import AssetRegistry from "./Asset Module/AssetRegistry";
import AllocationTransfer from "./Allocation Module/AllocationTransfer";
import ResourceBooking from "./Booking Module/ResourceBooking";
import Maintenance from "./Maintenance Module/Maintenance";
import Audit from "./Audit Module/Audit";
import Reports from "./Reports Module/Reports";
import Notifications from "./Notifications Module/Notifications";
import "./App.css";

function AppLayout() {
    return (
        <div className="app-layout">
            <Topbar />
            <div className="app-body">
                <Sidebar />
                <main className="app-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Login />} />

                {/* Authenticated app routes.
                    NOTE: Organization Setup is Admin-only per the problem statement —
                    once real auth/roles land, gate that single route with an
                    allowedRole="admin" check inside ProtectedRoute/OrganizationSetup. */}
                <Route element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }>
                    <Route path="/home" element={<Home />} />
                    <Route path="/organization-setup" element={<OrganizationSetup />} />
                    <Route path="/assets" element={<AssetRegistry />} />
                    <Route path="/allocation" element={<AllocationTransfer />} />
                    <Route path="/booking" element={<ResourceBooking />} />
                    <Route path="/maintenance" element={<Maintenance />} />
                    <Route path="/audit" element={<Audit />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;