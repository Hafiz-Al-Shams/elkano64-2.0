import { useContext, useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import AuthContext from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";



const Navbar = () => {

    const { user, signOutUser } = useContext(AuthContext);

    // console.log(user?.email);
    // const navigate = useNavigate();

    const [profilePhoto, setProfilePhoto] = useState('');
    const [userName, setUserName] = useState('');

    useEffect(() => {
        if (user) {
            setProfilePhoto(user.photoURL);
            setUserName(user.displayName);
        }
    }, [user]);


    const handleLogOut = () => {
        signOutUser()
            .then(() => {
                // console.log('user signOut successful');
                Swal.fire({
                    position: "center",
                    icon: 'warning',
                    title: 'Log out done!',
                    showConfirmButton: false,
                    timer: 2000

                    // confirmButtonText: 'ok'
                });
                // setProfilePhoto('');
                // setUserName('');
            })
            .catch(error => console.log('ERROR', error.message))
    }


    const links = <>
        <li><NavLink to="/">Home</NavLink></li>
        <li><NavLink to="/all-foods">All Foods</NavLink></li>
        <li><NavLink to="/gallery">Gallery</NavLink></li>
    </>

    const links2 = <>
        <li><NavLink to={`/my-foods/${user?.email}`}>My Foods</NavLink></li>
        <li><NavLink to="/add-food">Add food</NavLink></li>
        <li><NavLink to="/my-orders">My Orders</NavLink></li>
    </>


    const [theme, setTheme] = useState("light");

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        document.documentElement.setAttribute("data-theme", newTheme);
    };


    return (
        <>
            <div className="sticky top-0 z-10 navbar font-medium md:py-0.5 lg:py-3 px-2.5 md:px-12 lg:px-24 bg-base-300 text-base-content">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-xs md:menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow space-y-2">
                            {links}
                        </ul>
                    </div>
                    <Link to="/" className="text-sm md:text-xl lg:text-2xl font-bold">Elkano64</Link>
                </div>

                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1 space-x-2 md:space-x-4 font-semibold">
                        {links}
                    </ul>
                </div>

                <div className="navbar-end space-x-4 md:space-x-6 lg:space-x-8">


                    {/* theme change */}
                    <div className="w-14 sm:w-16 md:w-20">
                        <select
                            className="w-full text-[9px] sm:text-[10px] md:text-xs px-1 py-0 lg:py-3 h-auto min-h-7 sm:min-h-8 border border-gray-300 rounded-md"
                            value={theme}
                            onChange={(e) => handleThemeChange(e.target.value)}
                        >
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                            <option value="dim">Dim</option>
                            <option value="luxury">Luxury</option>
                        </select>
                    </div>




                    {
                        user ?
                            <div className="flex items-center gap-2 md:gap-3">
                                <div className="dropdown dropdown-end">
                                    <div tabIndex={0} role="button" className="btn bg-transparent rounded-full p-0">
                                        <img
                                            className="w-7 min-w-7 sm:w-6 md:w-8 lg:w-10 rounded-full cursor-pointer"
                                            src={profilePhoto}
                                            alt="photo"
                                        />
                                    </div>

                                    <ul
                                        tabIndex={0}
                                        className="menu menu-xs md:menu-sm lg:menu-md dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-40 md:w-52 p-3 md:p-4 shadow space-y-2">
                                        {links2}
                                    </ul>
                                </div>
                                <a onClick={handleLogOut} data-tooltip-id="my-tooltip"
                                    data-tooltip-content={userName}
                                    data-tooltip-place="bottom-start"
                                    className="btn btn-xs md:btn-sm lg:btn-md bg-neutral-400/40 text-base-content text-[8px] md:text-xs lg:text-sm px-1.5 md:px-3 lg:px-4">
                                    Log Out
                                </a>
                            </div>
                            :
                            <NavLink to="/signIn">
                                <button className="btn btn-xs md:btn-sm lg:btn-md bg-neutral-400/40 text-base-content text-[9px] md:text-xs lg:text-sm px-2 md:px-3 lg:px-4">
                                    Login
                                </button>
                            </NavLink>
                    }

                    <Tooltip id="my-tooltip" />
                </div>
            </div>

        </>
    );
};

export default Navbar;