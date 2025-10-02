// Main routes file for frontend
import React from "react";
import { Route, Routes, useParams } from "react-router-dom";
import HomePage from "../pages/Home/HomePage";
import AboutPage from "../pages/AboutPage";
import ContactPage from "../pages/ContactPage";
import Shop from "../pages/shop/Shop";
import ShopProductDetails from "../pages/shop/ShopProductDetails";
import CategoryProducts from "../pages/shop/CategoryProducts";
import Cart from "../pages/shop/Cart";
import Checkout from "../pages/shop/Checkout";
import DoctorList from "../pages/doctor/DoctorList";
import DoctorDetails from "../pages/doctor/DoctorDetails";
import NurseList from "../pages/nurse/NurseList";
import NurseDetails from "../pages/nurse/NurseDetails";
import CaregiverList from "../pages/caregiver/CaregiverList";
import CaregiverDetails from "../pages/caregiver/CaregiverDetails";
import TestList from "../pages/labTest/TestList";
import TestDetails from "../pages/labTest/TestDetails";
import CombinedTests from "../pages/labTest/CombinedTests";
import TestBooking from "../pages/labTest/TestBooking";

import PaymentSuccess from "../pages/payment/PaymentSuccess";
import OrderSuccess from "../pages/payment/OrderSuccess";
import PaymentFail from "../pages/payment/PaymentFail";

import UserRegistration from "../components/UserRegistration";
import UserLogin from "../components/UserLogin";
import UserLogout from "../components/UserLogout";
import DoctorAppointments from "../pages/DoctorAppointments";
import BookingPage from "../pages/BookingPage";

import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

import BlogList from "../pages/blog/BlogList";
import BlogDetails from "../pages/blog/BlogDetails";

// profile
import UserProfile from "../pages/profile/UserProfile";
import ProfileDetails from "../pages/profile/ProfileDetails";
import MyOrders from "../pages/profile/MyOrders";
import VendorOrders from "../pages/profile/VendorOrders";
import VendorOrderDetail from "../pages/profile/VendorOrderDetail";
import OrderDetails from "../pages/profile/OrderDetails";
import MyAppointments from "../pages/profile/MyAppointments";
import MyBooking from "../pages/profile/MyBooking";
import BookingDetails from "../pages/profile/BookingDetails";
import MyTestBooking from "../pages/profile/MyTestBooking";
import TestBookingDetails from "../pages/profile/TestBookingDetails";
import DoctorHistory from "../pages/profile/DoctorHistory";
import AppointmentDetailsDoctor from "../pages/profile/AppointmentDetailsDoctor";
import AppointmentDetailsPatient from "../pages/profile/AppointmentDetailsPatient";
import MyProducts from "../pages/profile/MyProducts";
import CreateProduct from "../pages/profile/CreateProduct";
import ProductDetails from "../pages/profile/ProductDetails";
import MyStock from "../pages/profile/MyStock";

// ✅ Wrapper to inject serviceType param into BookingPage
function BookingPageWrapper() {
    const { serviceType } = useParams();
    return <BookingPage serviceType={serviceType.toUpperCase()} />;
}

function MainRoutes() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about-us" element={<AboutPage />} />
            <Route path="/contact-us" element={<ContactPage />} />

            <Route
                path="/register"
                element={
                    <PublicRoute>
                        <UserRegistration />
                    </PublicRoute>
                }
            />
            <Route
                path="/login"
                element={
                    <PublicRoute>
                        <UserLogin />
                    </PublicRoute>
                }
            />
            <Route path="/logout" element={<UserLogout />} />

            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<ShopProductDetails />} />
            <Route
                path="/category-products/:category"
                element={<CategoryProducts />}
            />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />

            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctors/:slug" element={<DoctorDetails />} />
            <Route path="/nurses" element={<NurseList />} />
            <Route path="/nurses/:slug" element={<NurseDetails />} />
            <Route path="/caregivers" element={<CaregiverList />} />
            <Route path="/caregivers/:slug" element={<CaregiverDetails />} />
            
            <Route path="/tests" element={<TestList />} />
            <Route path="/packages/:slug" element={<TestDetails type="package" />} />
            <Route path="/tests/:slug" element={<TestDetails type="test" />} />
            <Route path="/tests/combined" element={<CombinedTests />} />
            <Route path="/labtests/booking" element={<TestBooking />} />

            <Route path="/education" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogDetails />} />

            {/* ✅ Booking route with dynamic serviceType param */}
            <Route
                path="/booking/:serviceType/:slug"
                element={
                    <PrivateRoute>
                        <BookingPageWrapper />
                    </PrivateRoute>
                }
            />

            <Route
                path="/doctor-appointments/:slug"
                element={<DoctorAppointments />}
            />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/order-success" element={<OrderSuccess />} />
            <Route path="/payment/fail" element={<PaymentFail />} />

            {/* ✅ Protected Profile Routes with nested routes inside */}
            <Route
                path="/profile"
                element={
                    <PrivateRoute>
                        <UserProfile />
                    </PrivateRoute>
                }
            >
                <Route index element={<ProfileDetails />} />
                <Route path="orders" element={<MyOrders />} />
                <Route path="vendor-orders" element={<VendorOrders />} />
                <Route path="orders/:id" element={<OrderDetails />} />
                <Route path="vendor/orders/:id" element={<VendorOrderDetail />} />
                <Route path="appointments" element={<MyAppointments />} />
                <Route path="bookings" element={<MyBooking />} />
                <Route path="bookings/:bookingId" element={<BookingDetails />} />
                <Route path="test-bookings/" element={<MyTestBooking />} />
                <Route path="test-booking/:id" element={<TestBookingDetails />} />
                <Route path="doctor-history" element={<DoctorHistory />} />
                <Route
                    path="appointments-doctor/:appointmentId"
                    element={<AppointmentDetailsDoctor />}
                />
                <Route
                    path="appointments-patient/:appointmentId"
                    element={<AppointmentDetailsPatient />}
                />
                <Route path="products" element={<MyProducts />} />
                <Route path="stock" element={<MyStock />} />
                <Route path="create-product" element={<CreateProduct />} />
                <Route path="create-product/:slug" element={<CreateProduct />} />
                <Route path="products/:slug" element={<ProductDetails />} />
            </Route>
        </Routes>
    );
}

export default MainRoutes;
