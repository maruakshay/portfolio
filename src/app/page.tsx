"use client";
import { Phone, Mail, Linkedin } from "lucide-react";
import { useRef, useEffect } from "react";
import { LayoutGroup, motion, useAnimation, useInView } from "framer-motion";

import StackingCards, {
  StackingCardItem,
} from "@/fancy/components/blocks/stacking-cards";

import TextRotate from "@/fancy/components/text/text-rotate";

export default function Home() {
  const data = [
    {
      number: "01",
      title: "Outward-Inward Strategy",
      desc: "Begin with deep external insights—market trends, competitive landscape, and user behavior—then align internal teams to execute efficiently.",
      color: "#FFF9E3", // pastel yellow
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80", // strategy/landscape
    },
    {
      number: "02",
      title: "Market & Competitive Analysis",
      desc: "Systematically identify market gaps, emerging trends, and areas for differentiation to de-risk product decisions and sharpen positioning.",
      color: "#E3FCEC", // pastel green
      image:
        "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80", // analysis/data
    },
    {
      number: "03",
      title: "Target & Niche Customer Understanding",
      desc: "Define key user personas and uncover their unmet needs through interviews, data, and behavioral patterns to tailor the product experience.",
      color: "#E3F0FF", // pastel blue
      image:
        "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80", // people/customers
    },
    {
      number: "04",
      title: "Stakeholder Collaboration",
      desc: "Work closely with cross-functional teams—engineering, design, marketing, sales—to ensure alignment on goals, timelines, and value delivery.",
      color: "#FFE3E9", // pastel red/pink
      image:
        "https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?auto=format&fit=crop&w=600&q=80", // collaboration/teamwork
    },
    {
      number: "05",
      title: "Value-Driven Feature Development",
      desc: "Turn customer pain points into clear value propositions and prioritize features that deliver measurable impact and user delight.",
      color: "#FFF3E3", // pastel orange
      image:
        "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80", // product/feature
    },
    {
      number: "06",
      title: "Agile Execution",
      desc: "Deliver iteratively with agile methods—incorporating feedback, improving velocity, and adapting rapidly to user and market changes.",
      color: "#E3F7FB", // pastel cyan
      image:
        "https://images.unsplash.com/photo-1465101178521-c1a9136a3b99?auto=format&fit=crop&w=600&q=80", // agile/process
    },
  ];
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
          className="font-serif md:text-4xl text-xl text-secondary"
          style={{ display: "inline-block", whiteSpace: "pre-wrap" }}
        >
          {"Building impactful products is my ikigai. I’m driven by the mission to create solutions that help people save both time and money. From the spark of an idea to the thrill of launching — I truly love every step of the product journey. Ideation, research, prototyping, iteration — it all brings me joy and keeps me inspired. For me, product management isn’t just a role; it’s a craft and a calling to make a meaningful mark on the world."
            .split(" ")
            .map((word, wi) => (
              <motion.span
                key={wi}
                initial={{
                  fontWeight: 400,
                  fontStyle: "normal",
                  color: "text-secondary",
                }}
                animate={{
                  fontWeight: [400, 700, 400],
                  fontStyle: ["normal", "italic", "normal"],
                }}
                transition={{
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 2,
                  delay: wi * 0.12,
                  ease: "easeInOut",
                }}
                style={{ display: "inline-block", marginRight: "0.7em" }}
              >
                {word}
              </motion.span>
            ))}
        </motion.p>
      </motion.section>
    );
  };
  const experiences = [
    {
      company: "Remote Leaps",
      description:
        "AI career transformation platform that helps job seekers get hired. Handled as Founder & Product Owner from ideation to market analysis, targeting customers, coding, and launch. Led a team of 5.",
      jobTitle: "Founder & Product Owner",
      skillsAndMethodologies: [
        "Product Ideation",
        "Market Analysis",
        "Customer Segmentation",
        "Team Leadership",
        "Agile Development",
        "Full-stack Coding",
        "Go-to-Market Strategy",
        "Cross-functional Team Management",
      ],
    },
    {
      company: "Virtual Internships",
      description:
        "Platform offering internships worldwide. Managed as Senior Software Engineer from concept to product launch, handled bug fixes and customer issue resolution with rapid turnaround.",
      jobTitle: "Senior Software Engineer",
      skillsAndMethodologies: [
        "Product Development Lifecycle",
        "Bug Tracking & Resolution",
        "Customer Support & Issue Management",
        "Agile Methodology",
        "Collaboration with Cross-functional Teams",
        "Rapid Problem Solving",
        "Continuous Deployment",
      ],
    },
    {
      company: "Rapid Innovation",
      description:
        "Service-based blockchain company. Worked as a Tech Lead managing a team of 10, building blockchain-based products, and independently creating NFT-related Instagram content.",
      jobTitle: "Tech Lead",
      skillsAndMethodologies: [
        "Team Leadership",
        "Blockchain Architecture",
        "Smart Contract Development",
        "NFT Design & Integration",
        "Solidity",
        "Agile Execution",
        "Content Creation",
      ],
    },
    {
      company: "KGN Technologies",
      description:
        "Web and mobile app development company. Contributed primarily to frontend development, improving UI/UX and implementing responsive designs.",
      jobTitle: "Frontend Developer (Contributor)",
      skillsAndMethodologies: [
        "HTML/CSS/JavaScript",
        "React.js",
        "Tailwind CSS",
        "Responsive Design",
        "Cross-browser Compatibility",
        "Frontend Optimization",
      ],
    },
  ];

  // Then use <FadeSection /> in place of the original section:
  return (
    <>
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
                  "Product Manager",
                  "Founder",
                  "Techie",
                  "Builder of cool stuff",
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
            className="text-base md:text-xl text-quaternary mt-2"
          >
            Building communities. Leaving impact.
          </motion.p>
        </section>

        <FadeSection />
        <div className="w-full flex justify-center my-10">
          <div className="h-1 w-32 bg-primary rounded-full opacity-60" />
        </div>
        <section className="space-y-6">
          <h2 className="text-lg">what to expect</h2>

          <p className="text-primary text-3xl mb-10">
            My approach balances outward strategy with internal collaboration,
            reducing risk and maximizing market impact.
          </p>
          <div className="space-y-10 text-gray-800 text-base">
            <StackingCards
              totalCards={data.length}
              scrollOptons={{ container: { current: null } }}
            >
              {data.map(({ number, title, desc, color }, index) => (
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
          {experiences.map((exp, idx) => (
            <motion.div
              key={idx}
              className="border rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              whileHover={{
                scale: 1.08,
                zIndex: 10,
                boxShadow: "0 12px 40px rgba(59,130,246,0.18)",
                y: -10,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              style={{ position: "relative" }}
            >
              <h3 className="text-primary text-2xl font-semibold">
                {exp.jobTitle}
              </h3>
              <p className="text-quaternary text-lg font-medium mb-3">
                {exp.company}
              </p>
              <p className="text-quaternary mb-4">{exp.description}</p>

              <div className="flex flex-wrap gap-2">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: <Phone className="text-secondary w-8 h-8 mb-2" />,
                href: "tel:+917069275229",
                label: "+91-7069275229",
              },
              {
                icon: <Mail className="text-secondary w-8 h-8 mb-2" />,
                href: "mailto:maruakshay4@gmail.com",
                label: "maruakshay4@gmail.com",
              },
              {
                icon: <Linkedin className="text-secondary w-8 h-8 mb-2" />,
                href: "https://www.linkedin.com/in/akshaymaru61",
                label: "www.linkedin.com/in/akshaymaru61",
                target: "_blank",
              },
            ].map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{
                  y: -6,
                  scale: 1.03,
                  boxShadow: "0 8px 24px rgba(59,130,246,0.08)",
                }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="border border-primary/30 p-6 rounded-2xl flex flex-col items-center gap-4 "
              >
                {item.icon}
                <a
                  href={item.href}
                  target={item.target || "_self"}
                  rel="noopener noreferrer"
                  className="hover:underline text-quaternary text-lg font-medium text-center"
                >
                  {item.label}
                </a>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
