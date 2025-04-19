import React, { useState, useEffect } from 'react'; // Fixed imports
import logo from "../../assets/logo/logo-Full-Light.png";
import { Link, useLocation, matchPath } from 'react-router-dom';
import { NavbarLinks } from "../../data/navbar-Links";
import { useSelector } from 'react-redux';
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProfileDropDown from "../core/Auth/ProfileDropDown";
import { categories } from "../../services/apis";
import {MdKeyboardArrowDown} from "react-icons/md"  // Correct import from md packageimport { apiConnector } from "../../services/apiConnector"; // Added missing import

const Navbar = () => {
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const { user } = useSelector((state) => state.profile);
    const { totalItems } = useSelector((state) => state.cart);
    const [subLinks, setSubLinks] = useState([]);
    const [loading, setLoading] = useState(false); // Added loading state
    const [error, setError] = useState(null); // Added error state

    const matchRoute = (route) => {
        return matchPath({ path: route }, location.pathname);
    };

    const fetchSubLinks = async () => {
        try {
            setLoading(true);
            const result = await apiConnector("GET", categories.CATEGORIES_API);
            if (!result?.data?.data) {
                throw new Error("Invalid API response structure");
            }
            setSubLinks(result.data.data);
        } catch (error) {
            console.error("API Error:", error);
            setError(error.message);
            setSubLinks([]); // Ensure we always set some state
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSubLinks();
    }, []);

    // Debugging logs
    console.log("Current state:", {
        token,
        user,
        totalItems,
        subLinks,
        loading,
        error
    });

    return (
        <div className='flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 bg-richblack-800'>
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
                               {
                                    link.title === "Catalog" ? (
                                        <div
                                            className={`group relative flex cursor-pointer items-center gap-1 ${matchRoute("/catalog/:catalogName")
                                                ? "bg-yellow-25 text-black rounded-xl p-1 px-3"
                                                : "text-richblack-25 rounded-xl p-1 px-3"
                                                }`}
                                        >
                                            <p>{link.title}</p>
                                            <MdKeyboardArrowDown />
                                            {/* drop down menu */}
                                            <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] 
                                                    flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible 
                                                    group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]"
                                            >
                                                <div className="absolute left-[50%] top-0 z-[100] h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>
                                                {loading ? (<p className="text-center ">Loading...</p>)
                                                    : subLinks.length ? (
                                                        <>
                                                            {subLinks?.map((subLink, i) => (
                                                                <Link
                                                                    to={`/catalog/${subLink.name
                                                                        .split(" ")
                                                                        .join("-")
                                                                        .toLowerCase()}`}
                                                                    className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                                                                    key={i}
                                                                >
                                                                    <p>{subLink.name}</p>
                                                                </Link>
                                                            ))}
                                                        </>
                                                    ) : (
                                                        <p className="text-center">No Courses Found</p>
                                                    )}
                                            </div>
                                        </div>
                                    ) : (
                                        <Link to={link?.path}>
                                            <p className={`${matchRoute(link?.path) ? "bg-yellow-25 text-black" : "text-richblack-25"} rounded-xl p-1 px-3 `}>
                                                {link.title}
                                            </p>
                                        </Link>)
                                }
                            </li>
                        ))}
                </ul>
                </nav>

                {/* Login/SignUp/Dashboard */}
                <div className="flex gap-x-4 items-center">
                    {user && user?.accountType !== "Instructor" && (
                        <Link to="/dashboard/cart" className="relative">
                            <AiOutlineShoppingCart className="text-white" size={20} />
                            {totalItems > 0 && (
                                <span className="absolute -top-2 -right-2 bg-yellow-100 text-richblack-900 text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Link>
                    )}
                    
                    {token === null && (
                        <Link to="/login">
                            <button className='border border-richblack-700 bg-richblack-800 px-3 py-1 text-richblack-100 rounded-md hover:bg-richblack-700 transition-all'>
                                Log in
                            </button>
                        </Link>
                    )}

                    {token === null && (
                        <Link to="/signup">
                            <button className='border border-richblack-700 bg-richblack-800 px-3 py-1 text-richblack-100 rounded-md hover:bg-richblack-700 transition-all'>
                                Sign Up
                            </button>
                        </Link>
                    )}
                    
                    {token !== null && <ProfileDropDown />}
                </div>
            </div>
        </div>
    );
};

export default Navbar;