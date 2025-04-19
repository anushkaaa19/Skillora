import React from 'react';
import logo from "../../assets/logo/logo-Full-Light.png";
import { Link, useLocation, matchPath } from 'react-router-dom';
import { NavbarLinks } from "../../data/navbar-Links";
import { useSelector } from 'react-redux'; // Added missing import

import { AiOutlineShoppingCart } from "react-icons/ai"; // Fixed icon import
import ProfileDropDown from "../core/Auth/ProfileDropDown"



const Navbar = () => {
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalitems } = useSelector((state) => state.cart); // Note: using totalitems (lowercase)

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700'>
            <div className='flex w-11/12 max-w-maxContent items-center justify-between'>
                {/* Logo */}
                <Link to="/">
                    <img src={logo} alt="Logo" width={160} height={42} loading='lazy' />
                </Link>

                {/* Navigation Links */}
                <nav>
                    <ul className='flex gap-x-6 text-richblack-25'>
                        {NavbarLinks.map((link, index) => (
                            <li key={index}>
                                {link.title === "Catalog" ? (
                                    <div>
                                        
                                    </div> // Placeholder for dropdown (if needed)
                                ) : (
                                    <Link to={link?.path}>
                                        <p
                                            className={`${matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"
                                                }`}
                                        >
                                            {link.title}
                                        </p>
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
                {/* Login/SignUp/ dashboard */}
                <div className="flex gap-x-4 items-center">
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart />
                            {totalItems > 0 && (
                                <span>{totalItems}</span>
                            )}
                        </Link>
                    )}
                    {token == null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-[8px] text-richblack-100 rounded-md'>
                                Log in
                            </button>
                        </Link>
                    )}

                    {token == null && (
                        <Link to="/signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-[8px] text-richblack-100 rounded-md'>
                                Sign Up
                            </button>
                        </Link>
                    )}
                                        {token !== null && <ProfileDropDown />} {/* Fixed syntax */}

                </div>
            </div>
        </div>
    );
};

export default Navbar;