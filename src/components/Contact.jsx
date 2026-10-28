import { Helmet } from "react-helmet-async";
import Swal from "sweetalert2";
import {
    FaBowlFood,
    FaLeaf,
    FaLocationDot,
    FaPhone,
    FaRegClock,
    FaRegCommentDots,
    FaRegEnvelope,
    FaRegHeart,
    FaUsers,
} from "react-icons/fa6";

// dark-green headings in light mode, light text in dark mode
const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

const labelClass = "mb-1.5 block text-sm font-semibold text-base-content";
const fieldClass =
    "w-full rounded-lg border border-base-300 bg-base-200/50 px-4 text-sm text-base-content outline-none transition placeholder:text-base-content/50 focus:border-primary focus:bg-base-100 focus:ring-2 focus:ring-primary/15";

const contactItems = [
    {
        Icon: FaLocationDot,
        title: "Our Location",
        lines: ["Musterstraße 25, 10115", "Berlin, Germany"],
    },
    {
        Icon: FaPhone,
        title: "Phone Number",
        lines: ["+880 1234 567890"],
        href: "tel:+8801234567890",
        note: "Mon - Sun, 10:00 AM - 10:00 PM",
    },
    {
        Icon: FaRegEnvelope,
        title: "Email Address",
        lines: ["hello@elkano64.com"],
        href: "mailto:hello@elkano64.com",
        note: "We reply within 24 hours",
    },
    {
        Icon: FaRegClock,
        title: "Working Hours",
        lines: ["Mon - Sun: 10:00 AM - 10:00 PM", "(Kitchen closes at 9:30 PM)"],
    },
];

const reasons = [
    {
        Icon: FaBowlFood,
        title: "Ask Questions",
        text: "Get answers about our menu, reservations, or anything else.",
    },
    {
        Icon: FaRegCommentDots,
        title: "Share Feedback",
        text: "Your thoughts help us serve you better.",
    },
    {
        Icon: FaUsers,
        title: "Work Together",
        text: "Partnerships, collaborations and special events.",
    },
    {
        Icon: FaRegHeart,
        title: "Just Say Hello",
        text: "We always enjoy hearing from our community.",
    },
];

const Contact = () => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;

        // TODO: connect this to your backend / email service later.
        // For now the form only validates and shows a confirmation – nothing is sent anywhere.
        const message = {
            name: form.fullName.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value,
        };
        console.log("Contact form (not sent anywhere yet):", message);

        Swal.fire({
            title: "Message received!",
            text: "Thanks for reaching out. We’ll get back to you within 24 hours.",
            icon: "success",
            confirmButtonText: "Great",
        });
        form.reset();
    };

    return (
        // flex column + min-h-screen: the bottom band stretches (flex-1), so a short page never leaves a gap above the footer
        <div className="flex min-h-screen flex-col bg-base-100">
            <Helmet>
                <title>Elkano64 - Contact</title>
            </Helmet>

            {/* ================= Contact info + form ================= */}
            <section className="relative overflow-hidden pb-12 pt-10 lg:pb-16 lg:pt-12">
                {/* decorative leaf */}
                <FaLeaf className="pointer-events-none absolute -bottom-2 -left-4 hidden rotate-[20deg] text-8xl text-accent/40 sm:block lg:text-9xl" />

                {/* same container width as the navbar */}
                <div className="relative mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                    <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-0">

                        {/* ===== Left : contact information ===== */}
                        <div className="lg:border-r lg:border-base-300 lg:pr-12">
                            <div className="flex items-center gap-4">
                                <h1 className={`font-serif text-2xl font-bold sm:text-3xl ${headingColor}`}>
                                    Contact Information
                                </h1>
                                <span className="hidden h-px w-12 bg-primary/40 sm:block" />
                            </div>

                            <p className="mt-4 max-w-sm text-sm leading-relaxed text-base-content/80 sm:text-base">
                                We’re always here for you. Reach out to us through any of the following ways.
                            </p>

                            <ul className="mt-8 space-y-7">
                                {contactItems.map(({ Icon, title, lines, href, note }) => (
                                    <li key={title} className="flex items-start gap-4 sm:gap-5">
                                        <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full border border-base-300 bg-base-300/50 text-xl text-primary shadow-inner sm:h-[58px] sm:w-[58px]">
                                            <Icon />
                                        </span>

                                        <div className="min-w-0 pt-0.5">
                                            <h3 className={`font-serif text-base font-semibold sm:text-lg ${headingColor}`}>
                                                {title}
                                            </h3>
                                            {lines.map((line) =>
                                                href ? (
                                                    <a
                                                        key={line}
                                                        href={href}
                                                        className="block break-words text-sm text-base-content/85 transition-colors hover:text-primary"
                                                    >
                                                        {line}
                                                    </a>
                                                ) : (
                                                    <p key={line} className="break-words text-sm text-base-content/85">
                                                        {line}
                                                    </p>
                                                )
                                            )}
                                            {note && <p className="mt-1 text-xs text-base-content/60">{note}</p>}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* ===== Right : message form ===== */}
                        <div className="lg:pl-12">
                            <div className="rounded-xl border border-base-300 bg-base-100 p-5 shadow-sm sm:p-8">
                                <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-base-content/80">
                                    Send us a message
                                    <span className="h-px w-12 bg-primary/40" />
                                </div>

                                <h2 className={`mt-2 font-serif text-2xl font-bold sm:text-3xl lg:text-4xl ${headingColor}`}>
                                    We’d Love to Hear From You
                                </h2>

                                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                                    <div>
                                        <label htmlFor="fullName" className={labelClass}>
                                            Full Name <span aria-hidden="true">*</span>
                                        </label>
                                        <input
                                            id="fullName"
                                            type="text"
                                            name="fullName"
                                            autoComplete="name"
                                            placeholder="Your Name"
                                            className={`${fieldClass} h-11`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="email" className={labelClass}>
                                            Email Address <span aria-hidden="true">*</span>
                                        </label>
                                        <input
                                            id="email"
                                            type="email"
                                            name="email"
                                            autoComplete="email"
                                            placeholder="Your Email"
                                            className={`${fieldClass} h-11`}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="subject" className={labelClass}>
                                            Subject
                                        </label>
                                        <input
                                            id="subject"
                                            type="text"
                                            name="subject"
                                            placeholder="Discussion Topic"
                                            className={`${fieldClass} h-11`}
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="message" className={labelClass}>
                                            Message <span aria-hidden="true">*</span>
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            rows={5}
                                            placeholder="Tell us about your query, or just say hello..."
                                            className={`${fieldClass} min-h-[130px] resize-y py-3`}
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn btn-primary h-12 w-full gap-2 rounded-lg text-sm normal-case"
                                    >
                                        Send Message <FaRegEnvelope />
                                    </button>

                                    <p className="text-center text-xs text-base-content/70">
                                        We’ll get back to you within 24 hours…
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= Why reach out ================= */}
            <section className="flex-1 bg-base-200 py-10 lg:py-12">
                <div className="mx-auto max-w-screen-2xl px-3 md:px-8 lg:px-16">
                    <div className="flex items-center justify-center gap-4">
                        <span className="h-px w-8 bg-primary/40 sm:w-14" />
                        <h2 className={`text-center font-serif text-xl font-bold sm:text-2xl lg:text-3xl ${headingColor}`}>
                            Why Reach Out To Us?
                        </h2>
                        <span className="h-px w-8 bg-primary/40 sm:w-14" />
                    </div>

                    <div className="mt-8 grid grid-cols-1 gap-y-8 sm:grid-cols-2 lg:mt-10 lg:grid-cols-4 lg:gap-y-0">
                        {reasons.map(({ Icon, title, text }, index) => (
                            <div
                                key={title}
                                className={`flex flex-col items-center px-6 text-center ${index !== 0 ? "lg:border-l lg:border-base-300" : ""
                                    }`}
                            >
                                <span className="grid h-14 w-14 place-items-center rounded-full border border-base-300 bg-base-300/50 text-2xl text-primary shadow-inner sm:h-[58px] sm:w-[58px]">
                                    <Icon />
                                </span>
                                <h3 className={`mt-4 font-serif text-base font-semibold sm:text-lg ${headingColor}`}>
                                    {title}
                                </h3>
                                <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-base-content/75">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Contact;