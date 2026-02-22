import type { ReactNode } from "react";
import clsx from "clsx";
import Link from "@docusaurus/Link";
import useDocusaurusContext from "@docusaurus/useDocusaurusContext";
import Layout from "@theme/Layout";
import Heading from "@theme/Heading";

import styles from "./index.module.css";

function HomepageHeader() {
  const { siteConfig } = useDocusaurusContext();
  return (
    <header className={clsx("hero hero--primary", styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to="/introduction-to-physical-ai"
          >
            Start Learning
          </Link>
        </div>
      </div>
    </header>
  );
}

const modules = [
  {
    title: "Introduction to Physical AI",
    description:
      "Understand embodied intelligence, sensor systems, and the humanoid robotics landscape.",
    link: "/introduction-to-physical-ai",
  },
  {
    title: "ROS 2 Fundamentals",
    description:
      "Master nodes, topics, services, Python packages, launch files, and URDF for humanoids.",
    link: "/ros2-fundamentals",
  },
  {
    title: "Gazebo Simulation",
    description:
      "Learn physics simulation, sensor simulation, and Unity integration for robotics.",
    link: "/gazebo-simulation",
  },
  {
    title: "NVIDIA Isaac Platform",
    description:
      "Explore Isaac Sim, perception, manipulation, reinforcement learning, and sim-to-real transfer.",
    link: "/nvidia-isaac-platform",
  },
  {
    title: "Humanoid Development",
    description:
      "Dive into kinematics, dynamics, bipedal locomotion, and manipulation/grasping.",
    link: "/humanoid-development",
  },
  {
    title: "Conversational Robotics",
    description:
      "Build speech recognition, voice-to-action pipelines, and multimodal interaction.",
    link: "/conversational-robotics",
  },
  {
    title: "Capstone Project",
    description: "Apply everything in a complete humanoid robotics project.",
    link: "/capstone-project",
  },
  {
    title: "Hardware Guide",
    description:
      "Set up your workstation, Jetson kit, and choose the right robot platform.",
    link: "/hardware-guide",
  },
];

function ModuleCard({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link: string;
}) {
  return (
    <div className={clsx("col col--3")}>
      <div className="card margin-bottom--lg" style={{ height: "100%" }}>
        <div className="card__header">
          <Heading as="h3">{title}</Heading>
        </div>
        <div className="card__body">
          <p>{description}</p>
        </div>
        <div className="card__footer">
          <Link className="button button--primary button--block" to={link}>
            Read Module
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function Home(): ReactNode {
  const { siteConfig } = useDocusaurusContext();
  return (
    <Layout
      title="Home"
      description="Physical AI & Humanoid Robotics - A comprehensive textbook for building intelligent physical systems"
    >
      <HomepageHeader />
      <main>
        <section style={{ padding: "2rem 0" }}>
          <div className="container">
            <div className="row">
              {modules.map((mod, idx) => (
                <ModuleCard key={idx} {...mod} />
              ))}
            </div>
          </div>
        </section>
      </main>
    </Layout>
  );
}
