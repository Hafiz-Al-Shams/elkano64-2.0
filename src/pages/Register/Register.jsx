import { useContext } from "react";
import SocialLogin from "../shared/SocialLogin";
import AuthContext from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { FaArrowRight, FaBox, FaCalendarDays, FaRegEnvelope, FaRegImage, FaRegUser, FaUtensils } from "react-icons/fa6";
import { MdOutlineLock } from "react-icons/md";
import AuthLayout from "../../components/AuthLayout";
import registerImage from "../../assets/register_image.webp";

const labelClass = "mb-1.5 block text-sm font-semibold text-base-content";
const inputClass =
    "h-11 w-full rounded-lg border border-base-300 bg-base-200/50 pl-10 pr-3 text-sm text-base-content outline-none transition placeholder:text-base-content/50 focus:border-primary focus:bg-base-100";
const iconClass = "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-base text-base-content/60";

const panel = {
    title: "Join Elkano64",
    tagline: "Good food. Great moments.\nMake them yours.",
    iconClass: "border-accent/80 text-accent",
    leafClass: "-left-3 -top-2 rotate-[160deg]",
    features: [
        { icon: <FaUtensils />, title: "Order your favorites", text: "Delicious food, right at your fingertips." },
        { icon: <FaCalendarDays />, title: "Book tables with ease", text: "Your perfect seat, just a click away." },
        { icon: <FaBox />, title: "Keep track of every order", text: "Stay updated, always." },
    ],
};

const Register = () => {


    const { createUser, updateUserProfile, signOutUser } = useContext(AuthContext);

    const navigate = useNavigate();




    const handleRegister = e => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value;
        const photo = form.photoURL.value;
        const email = form.email.value;
        const password = form.password.value;
        // console.log(email, password);

        // password validation
        if (password.length < 6) {
            // alert('Password must be 6 characters or longer');

            Swal.fire({
                // title: 'Error!',
                text: 'Password must be 6 characters or longer',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            return;
        }

        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,15}$/;

        if (!passRegex.test(password)) {
            // alert('at least One Number, One Uppercase & One Lowercase is needed');

            Swal.fire({
                // title: 'Error!',
                text: 'at least One Number, One Uppercase & One Lowercase is needed [DO NOT input Special Character!!!!]',
                icon: 'error',
                confirmButtonText: 'Try Again'
            });
            return;
        }

        createUser(email, password)
            .then(result => {
                // console.log('Registration successful: ', result.user.email);

                updateUserProfile({ displayName: name, photoURL: photo })
                    .then(() => {
                        signOutUser()
                            .then(() => {
                                // console.log('user signOut successful');
                                Swal.fire({
                                    title: 'Registration Successful',
                                    text: 'Now please Login to Continue',
                                    icon: 'success',
                                    confirmButtonText: 'ok'
                                });
                                e.target.reset();
                                navigate('/signIn');
                            })
                            .catch(error => console.log('ERROR', error.message))


                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire({
                            title: 'Error!',
                            icon: 'error',
                            confirmButtonText: 'Try Again'
                        });
                    })
            })
            .catch(error => {
                console.log('ERROR from Firebase', error.message);
            })


    }


    return (
        <>
            <Helmet>
                <title>Elkano64 - Register</title>
            </Helmet>

            <AuthLayout
                image={registerImage}
                panel={panel}
                eyebrow="Create your account"
                eyebrowBothLines
                heading="Become part of the table"
                subtitle="Create your account to make every visit easier."
            >
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className={labelClass}>Name</label>
                        <div className="relative">
                            <FaRegUser className={iconClass} />
                            <input id="name" type="text" name="name" autoComplete="name" placeholder="Your full name" className={inputClass} required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className={labelClass}>Email</label>
                        <div className="relative">
                            <FaRegEnvelope className={iconClass} />
                            <input id="email" type="email" name="email" autoComplete="email" placeholder="your@email.com" className={inputClass} required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="photoURL" className={labelClass}>Photo URL</label>
                        <div className="relative">
                            <FaRegImage className={iconClass} />
                            <input id="photoURL" type="text" name="photoURL" placeholder="https://example.com/photo.jpg" className={inputClass} required />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className={labelClass}>Password</label>
                        <div className="relative">
                            <MdOutlineLock className={iconClass} />
                            <input id="password" type="password" name="password" autoComplete="new-password" placeholder="Create a strong password" className={inputClass} required />
                        </div>
                    </div>

                    <button type="submit" className="btn btn-primary mt-2 h-12 w-full gap-2 rounded-lg text-base normal-case">
                        Create Account <FaArrowRight />
                    </button>
                </form>

                <SocialLogin></SocialLogin>

                <p className="mt-5 text-center text-sm text-base-content">
                    Already have an account?{" "}
                    <Link to="/signIn" className="font-semibold text-primary underline underline-offset-2 hover:opacity-80">
                        Log in
                    </Link>
                </p>
            </AuthLayout>
        </>
    );
};

export default Register;