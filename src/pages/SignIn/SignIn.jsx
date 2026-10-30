import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowRight, FaBell, FaBellConcierge, FaCalendarDays, FaRegEnvelope } from "react-icons/fa6";
import { MdOutlineLock } from "react-icons/md";
import AuthContext from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import SocialLogin from "../shared/SocialLogin";
import AuthLayout from "../../components/AuthLayout";
import loginImage from "../../assets/login_image.webp";
import { getRedirectPath } from "../../utils/authRedirect";

const labelClass = "mb-1.5 block text-sm font-semibold text-base-content";
const inputClass =
    "h-11 w-full rounded-lg border border-base-300 bg-base-200/50 pl-10 pr-3 text-sm text-base-content outline-none transition placeholder:text-base-content/50 focus:border-primary focus:bg-base-100";
const iconClass = "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-base-content/60";

const panel = {
    eyebrow: "Welcome back to",
    title: "Elkano64",
    tagline: "Your next great meal is just a moment away.",
    iconClass: "border-neutral-content/60 text-neutral-content",
    leafClass: "-left-4 bottom-0 rotate-[20deg]",
    features: [
        { icon: <FaBellConcierge />, title: "Order your favorites", text: "Delicious meals, fresh ingredients." },
        { icon: <FaCalendarDays />, title: "Manage your reservations", text: "Book your table with ease." },
        { icon: <FaBell />, title: "Stay updated on every order", text: "Real-time notifications & updates." },
    ],
};

const SignIn = () => {


    const { signInUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignIn = e => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        // console.log(email, password);

        signInUser(email, password)
            .then(result => {
                // console.log('Login successful: ', result.user.email);

                Swal.fire({
                    position: "center",
                    icon: "success",
                    title: 'Login Successful',
                    showConfirmButton: false,
                    timer: 2000
                });
                e.target.reset();
                // go back to the page the visitor wanted before login (default: /my-orders)
                navigate(getRedirectPath(location.state?.from), { replace: true });
            })
            .catch(error => {
                console.log('ERROR from Firebase', error.message);
                Swal.fire({
                    title: 'Error!',
                    text: 'Invalid Email or Password!!',
                    icon: 'error',
                    confirmButtonText: 'Try again'
                });
                // e.target.reset();
            })

    }




    return (
        <>
            <Helmet>
                <title>Elkano64 - Login</title>
            </Helmet>

            <AuthLayout
                image={loginImage}
                wideLeft
                panel={panel}
                eyebrow="Welcome back"
                heading="Login to your account"
                subtitle="Please enter your email and password to continue to your Elkano64 account."
            >
                <form onSubmit={handleSignIn} className="space-y-4">
                    <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <div className="relative">
                            <FaRegEnvelope className={iconClass} />
                            <input id="email" type="email" name="email" autoComplete="email" placeholder="Enter your email address" className={inputClass} required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <div className="relative">
                            <MdOutlineLock className={iconClass} />
                            <input id="password" type="password" name="password" autoComplete="current-password" placeholder="Enter your password" className={inputClass} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-2 h-12 w-full gap-2 rounded-lg text-base normal-case">
                        Login <FaArrowRight />
                    </button>
                </form>

                <SocialLogin></SocialLogin>

                <p className="mt-5 text-center text-sm text-base-content">
                    New to Elkano64?{" "}
                    <Link to="/register" state={{ from: location.state?.from }} className="font-semibold text-primary underline underline-offset-2 hover:opacity-80">
                        Create an account
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
};

export default SignIn;