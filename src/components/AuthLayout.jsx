/* eslint-disable react/prop-types */
import { FaLeaf } from "react-icons/fa6";

const headingColor = "text-neutral [[data-theme=elkanoDark]_&]:text-base-content";

/*
  Shared split-card layout for the Login and Register pages.

  image = the photo shown in the dark left panel (imported by each page)

  panel = {
    eyebrow?: string,            small line + text above the title (optional)
    title: string,
    tagline: string,             use \n for a line break
    features: [{ icon: <Icon/>, title, text }],
    iconClass: string,           border/text colour of the feature icon circles
    leafClass: string,           position + rotation of the leaf inside the dark panel
  }
*/
const AuthLayout = ({
    image,
    panel,
    eyebrow,
    eyebrowBothLines = false,
    heading,
    subtitle,
    wideLeft = false,
    children,
}) => {
    return (
        <section className="relative min-h-screen overflow-hidden bg-base-200 px-4 pb-12 pt-14 sm:px-6 lg:pb-16 lg:pt-20">
            {/* ---------- page decorations ---------- */}
            <FaLeaf className="pointer-events-none absolute -left-6 top-16 hidden rotate-[35deg] text-8xl text-secondary/20 md:block" />
            <FaLeaf className="pointer-events-none absolute -right-8 bottom-10 hidden -rotate-[35deg] text-9xl text-secondary/20 md:block" />
            <FaLeaf className="pointer-events-none absolute left-[7%] top-[32%] hidden rotate-[20deg] text-sm text-primary/70 lg:block" />
            <FaLeaf className="pointer-events-none absolute bottom-[26%] right-[4%] hidden -rotate-[40deg] text-sm text-primary/70 lg:block" />
            <FaLeaf className="pointer-events-none absolute left-[3%] bottom-[14%] hidden rotate-[60deg] text-6xl text-secondary/15 lg:block" />

            {/* ---------- card ---------- */}
            <div
                className={`relative mx-auto grid max-w-6xl overflow-hidden rounded-2xl border border-base-300 bg-base-100 shadow-xl ${wideLeft ? "lg:grid-cols-[11fr_9fr]" : "lg:grid-cols-2"
                    }`}
            >
                {/* ===== left: dark green image panel ===== */}
                <div className="relative isolate overflow-hidden bg-neutral text-neutral-content">
                    <img
                        src={image}
                        alt=""
                        loading="lazy"
                        className="absolute inset-0 -z-10 h-full w-full object-cover object-bottom"
                    />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-neutral/90 via-neutral/60 to-neutral/10" />
                    <div className="absolute inset-0 -z-10 bg-gradient-to-r from-neutral/70 via-neutral/30 to-transparent" />

                    <FaLeaf
                        className={`pointer-events-none absolute text-8xl text-neutral-content/10 lg:text-9xl ${panel.leafClass}`}
                    />

                    <div className="relative flex h-full min-h-[260px] flex-col p-6 sm:p-8 lg:min-h-[620px] lg:p-12">
                        {panel.eyebrow && (
                            <div className="mb-4 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.2em] text-neutral-content/90 sm:text-xs">
                                <span className="h-px w-10 bg-primary" />
                                {panel.eyebrow}
                            </div>
                        )}

                        <h2 className="font-serif text-4xl font-bold leading-tight text-neutral-content sm:text-5xl lg:text-6xl">
                            {panel.title}
                        </h2>

                        <p className="mt-3 whitespace-pre-line font-serif text-lg leading-snug text-neutral-content/95 lg:text-xl">
                            {panel.tagline}
                        </p>

                        <ul className="mt-8 hidden space-y-5 md:block">
                            {panel.features.map((item) => (
                                <li key={item.title} className="flex items-center gap-4">
                                    <span
                                        className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border text-lg lg:h-12 lg:w-12 lg:text-xl ${panel.iconClass}`}
                                    >
                                        {item.icon}
                                    </span>
                                    <div>
                                        <p className="text-sm font-semibold text-neutral-content lg:text-base">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-neutral-content/80 lg:text-sm">
                                            {item.text}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* ===== right: form side ===== */}
                <div className="relative overflow-hidden p-6 sm:p-8 lg:p-12 lg:pt-14">
                    <FaLeaf className="pointer-events-none absolute -right-5 -top-4 rotate-[200deg] text-8xl text-secondary/20" />

                    <div className="relative">
                        <div className="flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary sm:text-xs">
                            <span className="h-px w-8 bg-primary/70 sm:w-10" />
                            {eyebrow}
                            {eyebrowBothLines && <span className="h-px w-8 bg-primary/70 sm:w-10" />}
                        </div>

                        <h1 className={`mt-3 font-serif text-3xl font-bold sm:text-4xl ${headingColor}`}>
                            {heading}
                        </h1>
                        <p className="mt-3 text-sm text-base-content/70 sm:text-base">{subtitle}</p>

                        <div className="mt-6">{children}</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AuthLayout;