import { Link } from "react-router-dom";
import { FaFacebookF, FaInstagram, FaLeaf, FaTwitter, FaYoutube } from "react-icons/fa6";

const footerLinks = [
    { label: "Home", to: "/" },
    { label: "All Foods", to: "/all-foods" },
    { label: "Gallery", to: "/gallery" },
    { label: "About", to: "/about" },
    { label: "Contact", to: "/contact" },
];

const socials = [
    { label: "Facebook", href: "https://www.facebook.com", Icon: FaFacebookF },
    { label: "Twitter", href: "https://twitter.com", Icon: FaTwitter },
    { label: "Instagram", href: "https://www.instagram.com", Icon: FaInstagram },
    { label: "YouTube", href: "https://www.youtube.com", Icon: FaYoutube },
];

const Footer = () => {
    return (
        <footer id="contact" className="relative scroll-mt-24 overflow-hidden bg-neutral text-neutral-content">
            <FaLeaf className="pointer-events-none absolute -left-3 bottom-2 rotate-[20deg] text-7xl text-secondary/40" />
            <FaLeaf className="pointer-events-none absolute -right-3 bottom-4 -rotate-[30deg] text-7xl text-secondary/40" />

            <div className="relative mx-auto grid max-w-screen-2xl items-center gap-8 px-3 pb-6 pt-10 md:px-8 lg:grid-cols-3 lg:px-16">
                {/* brand */}
                <div className="text-center lg:text-left">
                    <p className="font-serif text-3xl font-bold">Elkano64</p>
                    <p className="mt-1 text-xs text-neutral-content/70">
                        Good Food <span className="mx-1 text-primary">•</span> Great Moments
                    </p>
                </div>

                {/* links */}
                <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs md:text-sm">
                    {footerLinks.map((l) => (
                        <Link key={l.label} to={l.to} className="transition-colors hover:text-primary">
                            {l.label}
                        </Link>
                    ))}
                </nav>

                {/* socials */}
                <div className="flex items-center justify-center gap-5 lg:justify-end">
                    {socials.map(({ label, href, Icon }) => (
                        <a
                            key={label}
                            href={href}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={label}
                            className="text-lg transition-colors hover:text-primary"
                        >
                            <Icon />
                        </a>
                    ))}
                </div>
            </div>

            <div className="relative border-t border-white/10 py-4 text-center">
                <p className="text-[10px] text-neutral-content/70 md:text-xs">
                    Copyright © {new Date().getFullYear()} - Elkano64. All rights reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;