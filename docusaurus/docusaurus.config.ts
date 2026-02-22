import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";

const config: Config = {
  title: "Physical AI & Humanoid Robotics",
  tagline: "Bridging the gap between digital AI and the physical world",
  favicon: "img/favicon.ico",

  future: {
    v4: true,
  },

  url: "https://physical-ai-textbook.vercel.app",
  baseUrl: "/",

  organizationName: "panaversity",
  projectName: "physical-ai-textbook",

  onBrokenLinks: "warn",

  i18n: {
    defaultLocale: "en",
    locales: ["en"],
  },

  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: "./sidebars.ts",
          routeBasePath: "/",
          editUrl:
            "https://github.com/panaversity/physical-ai-textbook/tree/main/docusaurus/",
        },
        blog: false,
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      defaultMode: "light",
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Physical AI & Humanoid Robotics",
      logo: {
        alt: "Physical AI Textbook Logo",
        src: "img/logo.svg",
      },
      items: [
        {
          type: "docSidebar",
          sidebarId: "textbookSidebar",
          position: "left",
          label: "Textbook",
        },
        {
          to: "/podcasts",
          label: "Podcasts",
          position: "left",
        },
        {
          type: "custom-personalize",
          position: "right",
        },
        {
          type: "custom-translate",
          position: "right",
        },
        {
          type: "custom-auth",
          position: "right",
        },
        {
          href: "https://github.com/Noor7086",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Textbook",
          items: [
            {
              label: "Introduction",
              to: "/introduction-to-physical-ai",
            },
            {
              label: "ROS 2 Fundamentals",
              to: "/ros2-fundamentals",
            },
            {
              label: "NVIDIA Isaac",
              to: "/nvidia-isaac-platform",
            },
          ],
        },
        {
          title: "Resources",
          items: [
            {
              label: "Hardware Guide",
              to: "/hardware-guide",
            },
            {
              label: "Capstone Project",
              to: "/capstone-project",
            },
          ],
        },
        {
          title: "Community",
          items: [
            {
              label: "Panaversity",
              href: "https://panaversity.org",
            },
            {
              label: "GitHub",
              href: "https://github.com/panaversity",
            },
          ],
        },
      ],
      copyright: `Copyright ${new Date().getFullYear()} Panaversity. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ["python", "bash", "yaml", "json", "markup"],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
