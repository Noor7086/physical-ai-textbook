import type { SidebarsConfig } from "@docusaurus/plugin-content-docs";

const sidebars: SidebarsConfig = {
  textbookSidebar: [
    {
      type: "category",
      label: "Module 1: Introduction to Physical AI",
      link: {
        type: "doc",
        id: "introduction-to-physical-ai/index",
      },
      items: [
        "introduction-to-physical-ai/embodied-intelligence",
        "introduction-to-physical-ai/humanoid-landscape",
        "introduction-to-physical-ai/sensor-systems",
      ],
    },
    {
      type: "category",
      label: "Module 2: ROS 2 Fundamentals",
      link: {
        type: "doc",
        id: "ros2-fundamentals/index",
      },
      items: [
        "ros2-fundamentals/nodes-topics-services",
        "ros2-fundamentals/python-packages",
        "ros2-fundamentals/launch-files",
        "ros2-fundamentals/urdf-humanoids",
      ],
    },
    {
      type: "category",
      label: "Module 3: Gazebo Simulation",
      link: {
        type: "doc",
        id: "gazebo-simulation/index",
      },
      items: [
        "gazebo-simulation/physics-simulation",
        "gazebo-simulation/sensor-simulation",
        "gazebo-simulation/unity-integration",
      ],
    },
    {
      type: "category",
      label: "Module 4: NVIDIA Isaac Platform",
      link: {
        type: "doc",
        id: "nvidia-isaac-platform/index",
      },
      items: [
        "nvidia-isaac-platform/isaac-sim",
        "nvidia-isaac-platform/perception-manipulation",
        "nvidia-isaac-platform/reinforcement-learning",
        "nvidia-isaac-platform/sim-to-real",
      ],
    },
    {
      type: "category",
      label: "Module 5: Humanoid Development",
      link: {
        type: "doc",
        id: "humanoid-development/index",
      },
      items: [
        "humanoid-development/kinematics-dynamics",
        "humanoid-development/bipedal-locomotion",
        "humanoid-development/manipulation-grasping",
      ],
    },
    {
      type: "category",
      label: "Module 6: Conversational Robotics",
      link: {
        type: "doc",
        id: "conversational-robotics/index",
      },
      items: [
        "conversational-robotics/speech-recognition",
        "conversational-robotics/voice-to-action",
        "conversational-robotics/multimodal-interaction",
      ],
    },
    {
      type: "category",
      label: "Capstone Project",
      link: {
        type: "doc",
        id: "capstone-project/index",
      },
      items: [
        "capstone-project/project-requirements",
        "capstone-project/implementation-guide",
      ],
    },
    {
      type: "category",
      label: "Hardware Guide",
      link: {
        type: "doc",
        id: "hardware-guide/index",
      },
      items: [
        "hardware-guide/workstation-setup",
        "hardware-guide/jetson-kit",
        "hardware-guide/robot-options",
      ],
    },
    {
      type: "doc",
      id: "podcasts/index",
      label: "Podcasts",
    },
  ],
};

export default sidebars;
