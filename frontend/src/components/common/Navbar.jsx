import React from 'react';
import logo from "../../assets/logo/logo-Full-Light.png";
import { Link, useLocation, matchPath } from 'react-router-dom';
import { NavbarLinks } from "../../data/navbar-Links";

const Navbar = () => {
  const location = useLocation();

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
                  <div></div> // Placeholder for dropdown (if needed)
                ) : (
                  <Link to={link?.path}>
                    <p
                      className={`${
                        matchRoute(link?.path) ? "text-yellow-25" : "text-richblack-25"
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
        <div>
            
        </div>
      </div>
    </div>
  );
};

export default Navbar;