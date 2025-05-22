"use client";
import { Phone, Mail, Linkedin } from "lucide-react";
import { useRef, useEffect } from "react";
import { motion, useAnimation, useInView } from "framer-motion";

export default function Home() {
  const data: any = [
    {
      number: "01",
      title: "Outward-Inward Strategy",
      desc: "Begin with deep external insights—market trends, competitive landscape, and user behavior—then align internal teams to execute efficiently.",
    },
    {
      number: "02",
      title: "Market & Competitive Analysis",
      desc: "Systematically identify market gaps, emerging trends, and areas for differentiation to de-risk product decisions and sharpen positioning.",
    },
    {
      number: "03",
      title: "Target & Niche Customer Understanding",
      desc: "Define key user personas and uncover their unmet needs through interviews, data, and behavioral patterns to tailor the product experience.",
    },
    {
      number: "04",
      title: "Stakeholder Collaboration",
      desc: "Work closely with cross-functional teams—engineering, design, marketing, sales—to ensure alignment on goals, timelines, and value delivery.",
    },
    {
      number: "05",
      title: "Value-Driven Feature Development",
      desc: "Turn customer pain points into clear value propositions and prioritize features that deliver measurable impact and user delight.",
    },
    {
      number: "06",
      title: "Agile Execution",
      desc: "Deliver iteratively with agile methods—incorporating feedback, improving velocity, and adapting rapidly to user and market changes.",
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
        <p className="font-serif md:text-4xl text-xl text-white">
          Building impactful products is my ikigai. I’m driven by the mission to
          create solutions that help people save both time and money. From the
          spark of an idea to the thrill of launching — I truly love every step
          of the product journey. Ideation, research, prototyping, iteration —
          it all brings me joy and keeps me inspired. For me, product management
          isn’t just a role; it’s a craft and a calling to make a meaningful
          mark on the world.
        </p>
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

        <section className="flex flex-col items-center justify-center min-h-svh w-full text-center">
          <h1 className="md:text-4xl text-3xl font-medium mb-2">
            Product Manager&nbsp;|&nbsp;Founder&nbsp;|&nbsp;Tech Enthusiast
          </h1>
          <h2 className="md:text-2xl text-xl text-quaternary">
            Building lasting communities and making a mark in the market.
          </h2>
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
            {data?.map((item: any) => (
              <motion.div
                key={item.number}
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="border border-primary text-primary rounded-xl p-6"
                style={{ willChange: "transform" }}
              >
                <div className="font-semibold text-3xl">
                  <span className="mr-6">{item.number}</span>
                  {item.title}
                </div>
                <div className="mt-2 text-quaternary">{item.desc}</div>
              </motion.div>
            ))}
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
            <div
              key={idx}
              className="border  rounded-xl p-6 hover:shadow-lg transition-shadow duration-300"
            >
              <h3 className="text-primary text-2xl font-semibold">
                {exp.jobTitle}
              </h3>
              <p className="text-secondary text-lg font-medium mb-3">
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
            </div>
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
                className="border border-primary/30 p-6 rounded-2xl flex flex-col items-center gap-4 bg-white"
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
