import { useContext } from "react";
import SocialLogin from "../shared/SocialLogin";
import AuthContext from "../../context/AuthContext/AuthContext";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";



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
            <div className="hero bg-base-100 min-h-[60vh] mt-10 mb-20">

                <Helmet>
                    <title>Elkano64 - Register</title>
                </Helmet>

                <div className="hero-content flex-col lg:flex-row gap-8">

                    <div className="text-center lg:text-left">
                        <h1 className="text-4xl font-bold">Please Sign Up</h1>
                    </div>

                    <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">

                        <form onSubmit={handleRegister} className="card-body">
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Name</span>
                                </label>
                                <input type="text" name="name" placeholder="name" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Email</span>
                                </label>
                                <input type="email" name='email' placeholder="email" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">photoURL</span>
                                </label>
                                <input type="text" name="photoURL" placeholder="photoURL" className="input input-bordered" required />
                            </div>
                            <div className="form-control">
                                <label className="label">
                                    <span className="label-text">Password</span>
                                </label>
                                <input type="password" name='password' placeholder="password" className="input input-bordered" required />
                            </div>
                            <div className="form-control mt-6">
                                <button className="btn btn-primary">Register</button>
                            </div>
                        </form>
                        <div className="text-center">
                            <p>Already have an account?</p>
                            <Link to="/signIn">
                                <button className="mt-1.5 btn bg-base-300 text-base-content px-8">Login</button>
                            </Link>
                        </div>
                        <SocialLogin></SocialLogin>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;