"use client";

import { Phone, Mail, Linkedin, Sparkles, ExternalLink } from "lucide-react";
import { useRef, useEffect } from "react";
import { LayoutGroup, motion, useAnimation, useInView } from "framer-motion";
import StackingCards, {
    StackingCardItem,
} from "@/fancy/components/blocks/stacking-cards";
import TextRotate from "@/fancy/components/text/text-rotate";

interface ProcessStep {
    number: string;
    title: string;
    desc: string;
    color: string;
    image: string;
}

interface Experience {
    company: string;
    description: string;
    jobTitle: string;
    skillsAndMethodologies: string[];
    link?: string;
}

interface PhilosophyCard {
    title: string;
    description: string;
}

interface SocialLink {
    href: string;
    label: string;
    type: string;
    target?: string;
    icon?: React.ReactNode;
}

interface HomeClientProps {
    processSteps: ProcessStep[];
    experiences: Experience[];
    philosophyCards: PhilosophyCard[];
    socialLinks: SocialLink[];
}

export default function HomeClient({
    processSteps,
    experiences,
    philosophyCards,
    socialLinks,
}: HomeClientProps) {
    const FadeSection = () => {
        const ref = useRef(null);
        const inView = useInView(ref, { amount: 0.5, once: false });
        const controls = useAnimation();

        useEffect(() => {
            if (inView) {
                controls.start({ opacity: 1, y: 0, transition: { duration: 0.8 } });
            } else {
                controls.start({ opacity: 0, y: 40, transition: { duration: 0.8 } });
            }
        }, [inView, controls]);

        return (
            <motion.section
                ref={ref}
                initial={{ opacity: 0, y: 40 }}
                animate={controls}
                className="min-h-svh py-16 px-10 text-center flex justify-center flex-col bg-primary rounded-2xl"
            >
                <motion.p
                    className="md:text-2xl text-lg font-serif text-secondary font-medium flex flex-wrap justify-center"
                    style={{ whiteSpace: "pre-wrap" }}
                >
                    {`I believe in the power of first principles thinking. No problem is too complex when you break it down to its fundamentals and address the root cause. I constantly ask "why" to uncover deeper insights and use imagination and visualization to craft effective solutions. With over 6 years of experience building products, I’ve learned the importance of truly understanding problems at their core. My journey spans startups and established companies, where I’ve contributed across the entire product development lifecycle—from ideation to launch.`
                        .split(" ")
                        .map((word, idx) => (
                            <motion.span
                                key={idx}
                                className="relative"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    delay: 0.15 * idx,
                                    duration: 0.5,
                                }}
                                style={{ marginRight: "0.25em" }}
                            >
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        bottom: 0,
                                        width: "100%",
                                        height: "40%",
                                        background: "#ff5941",
                                        opacity: 0.18,
                                        borderRadius: "0.2em",
                                        zIndex: 0,
                                        pointerEvents: "none",
                                    }}
                                />
                                {word}
                            </motion.span>
                        ))}
                </motion.p>
            </motion.section>
        );
    };

    const getIcon = (type: string) => {
        switch (type) {
            case "phone":
                return <Phone className="w-5 h-5 text-primary" />;
            case "mail":
                return <Mail className="w-5 h-5 text-primary" />;
            case "linkedin":
                return <Linkedin className="w-5 h-5 text-primary" />;
            default:
                return null;
        }
    };

    return (
        <>
            <motion.a
                href="/files/akshay_maru_resume.pdf" // Replace with actual resume path
                target="_blank"
                download
                rel="noopener noreferrer"
                className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:shadow-xl transition-shadow"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <span className="font-medium text-sm">Resume</span>
                <motion.div
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                >
                    <ExternalLink className="w-4 h-4" />
                </motion.div>
            </motion.a>

            <div className="space-y-6 container mx-auto px-4">
                {/* has the intro in this  */}

                <section className="flex flex-col items-center justify-center min-h-svh w-full text-center px-4">
                    <LayoutGroup>
                        <motion.h1
                            className="flex flex-wrap whitespace-pre text-center items-center justify-center"
                            layout
                        >
                            <motion.span
                                className="text-2xl md:text-4xl font-semibold tracking-tight"
                                layout
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                            >
                                I’m a{" "}
                            </motion.span>
                            <TextRotate
                                texts={[
                                    "AI Product Developer",
                                    "Ex-Founder",
                                    "Techie",
                                    "Strategy nerd",
                                    "Pixel pusher",
                                    "Coffee-powered",
                                    "Quirk enthusiast",
                                ]}
                                mainClassName="text-white text-2xl md:text-4xl font-semibold tracking-tight px-2 sm:px-2 md:px-3 bg-[#ff5941] overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
                                staggerFrom={"last"}
                                initial={{ y: "100%" }}
                                animate={{ y: 0 }}
                                exit={{ y: "-120%" }}
                                staggerDuration={0.01}
                                splitLevelClassName="overflow-hidden pb-0.5 sm:pb-1 md:pb-1"
                                transition={{ type: "spring", damping: 30, stiffness: 400 }}
                                rotationInterval={3000}
                            />
                        </motion.h1>
                    </LayoutGroup>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                        className="text-base relative md:text-xl text-quaternary mt-2"
                    >
                        Building communities. Making impact.
                        <span
                            style={{
                                position: "absolute",
                                left: 0,
                                bottom: 0,
                                width: "100%",
                                height: "40%",
                                background: "#ff5941",
                                opacity: 0.18,
                                borderRadius: "0.2em",
                                zIndex: 0,
                                pointerEvents: "none",
                            }}
                        />
                    </motion.p>
                </section>

                <FadeSection />
                <div className="w-full flex justify-center my-10">
                    <div className="h-1 w-32 bg-primary rounded-full opacity-60" />
                </div>
                <section className="space-y-6">
                    <h2 className="text-lg">How I think</h2>
                    <p className="text-primary text-3xl mb-10">
                        I believe in a holistic approach to product management, where
                        strategy meets execution, and customer needs drive innovation.
                    </p>
                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: false, amount: 0.3 }}
                        variants={{
                            hidden: { opacity: 0, y: 40 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: { staggerChildren: 0.15 },
                            },
                        }}
                    >
                        {philosophyCards.map((card, idx) => (
                            <motion.div
                                key={idx}
                                variants={{
                                    hidden: { opacity: 0, y: 30 },
                                    visible: { opacity: 1, y: 0 },
                                }}
                                transition={{ duration: 0.6 }}
                                className="p-6 rounded-2xl bg-gray-50 border-gray-200  shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-center gap-2 text-primary  mb-2">
                                    <Sparkles className="w-5 h-5" />
                                    <h3 className="text-lg font-medium">{card.title}</h3>
                                </div>
                                <p className="text-quaternary dark:text-gray-300 text-sm">
                                    {card.description}
                                </p>
                            </motion.div>
                        ))}
                    </motion.div>
                </section>
                <div className="w-full flex justify-center my-10">
                    <div className="h-1 w-32 bg-primary rounded-full opacity-60" />
                </div>
                <section className="space-y-6">
                    <h2 className="text-lg">What to expect</h2>

                    <p className="text-primary text-3xl mb-10">
                        My approach balances outward strategy with internal collaboration,
                        reducing risk and maximizing market impact.
                    </p>
                    <div className="space-y-10 min-h-svh text-gray-800 text-base">
                        <StackingCards
                            totalCards={processSteps.length}
                            scrollOptons={{ container: { current: null } }}
                        >
                            {processSteps.map(({ number, title, desc, color }, index) => (
                                <StackingCardItem
                                    key={index}
                                    index={index}
                                    className="h-[250px]"
                                >
                                    <div
                                        className="border border-primary text-primary rounded-xl p-6 min-h-[200px]"
                                        style={{ backgroundColor: color }}
                                    >
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-bold text-2xl mb-5 flex items-center">
                                                <span className="mr-6 text-primary text-3xl">
                                                    {number}
                                                </span>
                                                {title}
                                            </h3>
                                            <p className="text-quaternary">{desc}</p>
                                        </div>
                                    </div>
                                </StackingCardItem>
                            ))}
                        </StackingCards>
                    </div>
                </section>
                <div className="w-full flex justify-center my-10">
                    <div className="h-1 w-32 bg-primary rounded-full opacity-60" />
                </div>
                <section className="space-y-6">
                    <h2 className="text-lg text-primary ">
                        Featured Projects & Experience
                    </h2>
                    <p className="text-primary text-3xl mb-10">
                        My journey spans roles from UI developer and designer to senior
                        software engineer, founder, and product owner. Each experience has
                        deepened my understanding of building products that truly serve
                        customers and create meaningful impact.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
                        {experiences.map((exp, idx) => (
                            <motion.div
                                key={idx}
                                className={`
                  border rounded-2xl p-6 bg-white hover:shadow-2xl transition-shadow duration-300 cursor-pointer flex flex-col
                  md:col-span-3
                `}
                                whileHover={{
                                    scale: 1.04,
                                    zIndex: 10,
                                    boxShadow: "0 12px 40px rgba(59,130,246,0.18)",
                                    y: -6,
                                }}
                                whileTap={{ scale: 0.98 }}
                                transition={{ type: "spring", stiffness: 300, damping: 22 }}
                                style={{ position: "relative" }}
                            >
                                <h3 className="text-primary text-2xl font-semibold mb-1">
                                    {exp.jobTitle}
                                </h3>
                                <div className="flex items-center gap-2 mb-2">
                                    <p className="text-quaternary text-lg font-medium">
                                        {exp.company}
                                    </p>
                                    {exp.link && (
                                        <a
                                            href={exp.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-primary  transition-colors"
                                            aria-label={`Visit ${exp.company} website`}
                                        >
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                <p className="text-quaternary mb-4">{exp.description}</p>
                                <div className="flex flex-wrap gap-2 mt-auto">
                                    {exp.skillsAndMethodologies.map((skill, i) => (
                                        <span
                                            key={i}
                                            className="bg-blue-100 text-quaternary text-xs font-semibold px-3 py-1 rounded-full"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
                <div className="w-full flex justify-center my-10">
                    <div className="h-1 w-32 bg-primary rounded-full opacity-60" />
                </div>
                <section className="space-y-6 mb-10">
                    <h2 className="text-lg text-primary">Let’s Connect</h2>

                    <p className="text-primary text-3xl mb-6">
                        I believe in the power of collaboration and am always open to new
                        opportunities. If you’re looking to connect, share ideas, or explore
                        potential collaborations, feel free to reach out. I’m just a message
                        away!
                    </p>

                    <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
                        {socialLinks.map((item, idx) => (
                            <motion.a
                                key={idx}
                                href={item.href}
                                target={item.target || "_self"}
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.05 }}
                                transition={{ type: "spring", stiffness: 220, damping: 18 }}
                                className="flex items-center gap-2 border border-primary/10 rounded-lg py-2 px-4 bg-white  transition-colors duration-150"
                                style={{ textDecoration: "none" }}
                            >
                                {getIcon(item.type)}
                                <span className="text-primary text-sm font-medium">
                                    {item.label}
                                </span>
                            </motion.a>
                        ))}
                    </div>
                </section>
            </div>
        </>
    );
}
