import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { translateToUrdu } from "../services/api";
import { marked } from "marked";

interface TranslationContextValue {
  isUrdu: boolean;
  isTranslating: boolean;
  error: string;
  toggleTranslation: () => Promise<void>;
}

const TranslationContext = createContext<TranslationContextValue>({
  isUrdu: false,
  isTranslating: false,
  error: "",
  toggleTranslation: async () => {},
});

export function useTranslation() {
  return useContext(TranslationContext);
}

const STORAGE_KEY = "app_language";

// Static Urdu translations for UI elements
const UI_TRANSLATIONS: Record<string, string> = {
  // Navbar
  "Physical AI & Humanoid Robotics": "فزیکل اے آئی اور ہیومنائیڈ روبوٹکس",
  Textbook: "نصابی کتاب",
  Podcasts: "پوڈ کاسٹ",
  "Log In": "لاگ ان",
  "Sign Up": "سائن اپ",
  GitHub: "گٹ ہب",
  Personalize: "ذاتی بنائیں",
  "Log Out": "لاگ آؤٹ",
  Reset: "ری سیٹ",

  // Sidebar module labels
  "Module 1: Introduction to Physical AI": "ماڈیول 1: فزیکل اے آئی کا تعارف",
  "Module 2: ROS 2 Fundamentals": "ماڈیول 2: آر او ایس 2 بنیادیات",
  "Module 3: Gazebo Simulation": "ماڈیول 3: گیزیبو سمولیشن",
  "Module 4: NVIDIA Isaac Platform": "ماڈیول 4: این ویڈیا آئزک پلیٹ فارم",
  "Module 5: Humanoid Development": "ماڈیول 5: ہیومنائیڈ ڈیولپمنٹ",
  "Module 6: Conversational Robotics": "ماڈیول 6: بات چیت کرنے والے روبوٹکس",
  "Capstone Project": "کیپ اسٹون پروجیکٹ",
  "Hardware Guide": "ہارڈ ویئر گائیڈ",

  // Sidebar chapter labels
  "Embodied Intelligence": "مجسم ذہانت",
  "Humanoid Landscape": "ہیومنائیڈ منظرنامہ",
  "Sensor Systems": "سینسر سسٹمز",
  "Nodes, Topics & Services": "نوڈز، ٹاپکس اور سروسز",
  "Python Packages": "پائتھون پیکجز",
  "Launch Files": "لانچ فائلز",
  "URDF for Humanoids": "ہیومنائیڈز کے لیے یو آر ڈی ایف",
  "Physics Simulation": "فزکس سمولیشن",
  "Sensor Simulation": "سینسر سمولیشن",
  "Unity Integration": "یونٹی انٹیگریشن",
  "Isaac Sim Basics": "آئزک سم بنیادیات",
  "Perception & Manipulation": "ادراک اور ہیرا پھیری",
  "Reinforcement Learning": "ریانفورسمنٹ لرننگ",
  "Sim-to-Real Transfer": "سم ٹو ریئل ٹرانسفر",
  "Kinematics & Dynamics": "کائنے میٹکس اور ڈائنامکس",
  "Bipedal Locomotion": "دو پاؤں چلنا",
  "Manipulation & Grasping": "ہیرا پھیری اور پکڑنا",
  "Speech Recognition": "تقریر کی شناخت",
  "Voice-to-Action Pipelines": "آواز سے عمل پائپ لائنز",
  "Multimodal Interaction": "ملٹی موڈل انٹریکشن",
  "Project Requirements": "پروجیکٹ کی ضروریات",
  "Implementation Guide": "نفاذ کی رہنمائی",
  "Workstation Setup": "ورک سٹیشن سیٹ اپ",
  "Jetson Developer Kit": "جیٹسن ڈویلپر کٹ",
  "Robot Options": "روبوٹ کے اختیارات",

  // Index page titles
  "Introduction to Physical AI": "فزیکل اے آئی کا تعارف",
  "ROS 2 Fundamentals": "آر او ایس 2 بنیادیات",
  "Gazebo Simulation": "گیزیبو سمولیشن",
  "NVIDIA Isaac Platform": "این ویڈیا آئزک پلیٹ فارم",
  "Humanoid Development": "ہیومنائیڈ ڈیولپمنٹ",
  "Conversational Robotics": "بات چیت کرنے والے روبوٹکس",

  // Footer
  Resources: "وسائل",
  Community: "کمیونٹی",
  Panaversity: "پاناورسٹی",
  Introduction: "تعارف",
  "NVIDIA Isaac": "این ویڈیا آئزک",

  // Common UI
  Next: "اگلا",
  Previous: "پچھلا",
  Search: "تلاش",
  "Dark mode": "ڈارک موڈ",
  "Light mode": "لائٹ موڈ",

  // Homepage
  "Bridging the gap between digital AI and the physical world":
    "ڈیجیٹل اے آئی اور حقیقی دنیا کے درمیان پل",
  "Start Learning": "سیکھنا شروع کریں",
  "Read Module": "ماڈیول پڑھیں",
  "Understand embodied intelligence, sensor systems, and the humanoid robotics landscape.":
    "مجسم ذہانت، سینسر سسٹمز، اور ہیومنائیڈ روبوٹکس کے منظرنامے کو سمجھیں۔",
  "Master nodes, topics, services, Python packages, launch files, and URDF for humanoids.":
    "نوڈز، ٹاپکس، سروسز، پائتھون پیکجز، لانچ فائلز، اور ہیومنائیڈز کے لیے URDF میں مہارت حاصل کریں۔",
  "Learn physics simulation, sensor simulation, and Unity integration for robotics.":
    "فزکس سمولیشن، سینسر سمولیشن، اور روبوٹکس کے لیے یونٹی انٹیگریشن سیکھیں۔",
  "Explore Isaac Sim, perception, manipulation, reinforcement learning, and sim-to-real transfer.":
    "آئزک سم، ادراک، ہیرا پھیری، ریانفورسمنٹ لرننگ، اور سم ٹو ریئل ٹرانسفر کی کھوج کریں۔",
  "Dive into kinematics, dynamics, bipedal locomotion, and manipulation/grasping.":
    "کائنے میٹکس، ڈائنامکس، دو پاؤں چلنا، اور ہیرا پھیری/پکڑنے میں غوطہ لگائیں۔",
  "Build speech recognition, voice-to-action pipelines, and multimodal interaction.":
    "تقریر کی شناخت، آواز سے عمل پائپ لائنز، اور ملٹی موڈل تعامل بنائیں۔",
  "Apply everything in a complete humanoid robotics project.":
    "ایک مکمل ہیومنائیڈ روبوٹکس پروجیکٹ میں سب کچھ لاگو کریں۔",
  "Set up your workstation, Jetson kit, and choose the right robot platform.":
    "اپنا ورک سٹیشن، جیٹسن کٹ سیٹ اپ کریں، اور صحیح روبوٹ پلیٹ فارم چنیں۔",

  // Login page
  "Log In": "لاگ ان",
  "Welcome back! Log in to access personalized content.":
    "واپسی پر خوش آمدید! ذاتی مواد تک رسائی کے لیے لاگ ان کریں۔",
  Email: "ای میل",
  Password: "پاس ورڈ",
  "Logging in...": "لاگ ان ہو رہا ہے...",
  "Don't have an account?": "اکاؤنٹ نہیں ہے؟",
  "Already Logged In": "پہلے سے لاگ ان ہیں",
  "You are already logged in.": "آپ پہلے سے لاگ ان ہیں۔",
  "Go to Textbook": "نصابی کتاب پر جائیں",
  "Logged In Successfully!": "کامیابی سے لاگ ان ہو گئے!",
  "Welcome back! You are now logged in.":
    "واپسی پر خوش آمدید! آپ اب لاگ ان ہیں۔",

  // Signup page
  "Create an account to get personalized learning content.":
    "ذاتی نوعیت کا تعلیمی مواد حاصل کرنے کے لیے اکاؤنٹ بنائیں۔",
  "Step 1: Account Details": "مرحلہ 1: اکاؤنٹ کی تفصیلات",
  "Step 2: Your Background": "مرحلہ 2: آپ کا پس منظر",
  "Password (min 8 characters)": "پاس ورڈ (کم از کم 8 حروف)",
  "Next: Your Background": "اگلا: آپ کا پس منظر",
  "This helps us personalize content to your experience level.":
    "اس سے ہمیں آپ کے تجربے کی سطح کے مطابق مواد کو ذاتی بنانے میں مدد ملتی ہے۔",
  "Software Experience": "سافٹ ویئر کا تجربہ",
  "Python Level": "پائتھون کی سطح",
  "ROS Experience": "آر او ایس کا تجربہ",
  "Machine Learning Experience": "مشین لرننگ کا تجربہ",
  "Hardware Experience": "ہارڈ ویئر کا تجربہ",
  "Arduino / Microcontroller Experience": "آرڈوینو / مائیکرو کنٹرولر کا تجربہ",
  "NVIDIA Jetson Experience": "این ویڈیا جیٹسن کا تجربہ",
  "Physical Robot Experience": "فزیکل روبوٹ کا تجربہ",
  "Learning Goals (optional)": "سیکھنے کے اہداف (اختیاری)",
  Back: "واپس",
  "Create Account": "اکاؤنٹ بنائیں",
  "Creating Account...": "اکاؤنٹ بنایا جا رہا ہے...",
  "Already have an account?": "پہلے سے اکاؤنٹ ہے؟",
  "Account Created Successfully!": "اکاؤنٹ کامیابی سے بن گیا!",
  "Welcome! Your account has been created and you are now logged in.":
    "خوش آمدید! آپ کا اکاؤنٹ بن گیا ہے اور آپ اب لاگ ان ہیں۔",
  "You can now personalize textbook content based on your experience level.":
    "اب آپ اپنے تجربے کی سطح کی بنیاد پر نصابی مواد کو ذاتی بنا سکتے ہیں۔",
  "Already Signed In": "پہلے سے سائن ان ہیں",
  "No Experience": "کوئی تجربہ نہیں",
  Beginner: "ابتدائی",
  Intermediate: "درمیانی",
  Expert: "ماہر",
  Home: "ہوم",
  "Please enter a valid email address.":
    "براہ کرم ایک درست ای میل ایڈریس درج کریں۔",
  "Password must be at least 8 characters.":
    "پاس ورڈ کم از کم 8 حروف کا ہونا چاہیے۔",

  // ===== MODULE 1: Introduction to Physical AI =====
  "What is Physical AI?": "فزیکل اے آئی کیا ہے؟",
  "Why Physical AI Matters": "فزیکل اے آئی کیوں اہم ہے",
  "The Human-Robot Partnership": "انسان اور روبوٹ کی شراکت داری",
  "Key Insight": "اہم بصیرت",
  "Learning Objectives": "سیکھنے کے مقاصد",
  "Module Overview": "ماڈیول کا جائزہ",
  Prerequisites: "پیش شرائط",
  "Next Steps": "اگلے اقدامات",
  Summary: "خلاصہ",
  Exercises: "مشقیں",

  // Embodied Intelligence
  "The Embodiment Hypothesis": "تجسیم کا مفروضہ",
  "From Digital to Physical": "ڈیجیٹل سے فزیکل تک",
  "The Perception-Action Loop": "ادراک-عمل لوپ",
  "Morphological Computation": "شکلیاتی حساب",
  "Implications for Robot Design": "روبوٹ ڈیزائن کے لیے مضمرات",

  // Humanoid Landscape
  "Humanoid Robotics Landscape": "ہیومنائیڈ روبوٹکس کا منظرنامہ",
  "Why Humanoid Form?": "ہیومنائیڈ شکل کیوں؟",
  "Major Industry Players": "صنعت کے اہم کھلاڑی",
  "Technology Comparison": "ٹیکنالوجی کا موازنہ",
  "Key Technologies": "اہم ٹیکنالوجیز",
  "Market Projections": "مارکیٹ کے تخمینے",
  "Challenges Ahead": "آگے چیلنجز",

  // Sensor Systems
  "Sensor Systems for Humanoid Robots": "ہیومنائیڈ روبوٹس کے لیے سینسر سسٹمز",
  "Sensor Categories": "سینسر کی اقسام",
  "Vision Systems": "وژن سسٹمز",
  "LiDAR (Light Detection and Ranging)": "لائیڈار (لائٹ ڈیٹیکشن اینڈ رینجنگ)",
  "Inertial Measurement Unit (IMU)": "انرشیل میژرمنٹ یونٹ (آئی ایم یو)",
  "Force/Torque Sensors": "فورس/ٹارک سینسرز",
  "Tactile Sensors": "ٹیکٹائل سینسرز",
  "Sensor Fusion": "سینسر فیوژن",

  // ===== MODULE 2: ROS 2 Fundamentals =====
  "What is ROS 2?": "آر او ایس 2 کیا ہے؟",
  "Why ROS 2 for Humanoids?": "ہیومنائیڈز کے لیے آر او ایس 2 کیوں؟",
  "ROS 2 Architecture": "آر او ایس 2 فن تعمیر",
  "Module Contents": "ماڈیول کے مندرجات",
  "Quick ROS 2 Installation": "آر او ایس 2 کی فوری تنصیب",
  "Key Concepts Preview": "اہم تصورات کا جائزہ",

  // Nodes, Topics & Services
  "Nodes, Topics, and Services": "نوڈز، ٹاپکس، اور سروسز",
  Nodes: "نوڈز",
  Topics: "ٹاپکس",
  Services: "سروسز",
  "Common Message Types": "عام پیغام کی اقسام",
  "Quality of Service (QoS)": "کوالٹی آف سروس (QoS)",
  "CLI Tools": "سی ایل آئی ٹولز",

  // Python Packages
  "Building ROS 2 Python Packages": "آر او ایس 2 پائتھون پیکجز بنانا",
  "Package Structure": "پیکج کا ڈھانچہ",
  "Creating a Package": "پیکج بنانا",
  "package.xml": "package.xml",
  "setup.py": "setup.py",
  "Example: Complete Robot Controller": "مثال: مکمل روبوٹ کنٹرولر",
  "Building and Running": "بنانا اور چلانا",
  "Using Parameters": "پیرامیٹرز کا استعمال",

  // Launch Files
  "ROS 2 Launch Files": "آر او ایس 2 لانچ فائلز",
  "Python Launch Files": "پائتھون لانچ فائلز",
  "Advanced Launch Features": "ایڈوانسڈ لانچ فیچرز",
  "Complete Humanoid Launch Example": "مکمل ہیومنائیڈ لانچ مثال",

  // URDF for Humanoids
  "URDF for Humanoid Robots": "ہیومنائیڈ روبوٹس کے لیے یو آر ڈی ایف",
  "URDF Basics": "یو آر ڈی ایف کی بنیادیں",
  "Basic Structure": "بنیادی ڈھانچہ",
  "Joint Types": "جوائنٹ کی اقسام",
  "Humanoid Kinematic Chain": "ہیومنائیڈ کائنے میٹک چین",
  "Complete Humanoid Leg URDF": "مکمل ہیومنائیڈ ٹانگ یو آر ڈی ایف",
  "Using Xacro": "Xacro کا استعمال",
  "Visualizing in RViz": "RViz میں تصور",

  // ===== MODULE 3: Gazebo Simulation =====
  "Gazebo Simulation for Humanoid Robotics":
    "ہیومنائیڈ روبوٹکس کے لیے گیزیبو سمولیشن",
  "What is Gazebo?": "گیزیبو کیا ہے؟",
  "Gazebo Classic vs. Gazebo (Harmonic)":
    "گیزیبو کلاسک بمقابلہ گیزیبو (ہارمونک)",
  "Why Simulation Matters": "سمولیشن کیوں اہم ہے",
  "Setting Up Gazebo": "گیزیبو سیٹ اپ کرنا",
  "Your First Simulation": "آپ کی پہلی سمولیشن",
  "Loading a Robot Model": "روبوٹ ماڈل لوڈ کرنا",
  "Key Terminology": "اہم اصطلاحات",

  // Physics Simulation
  "Physics Simulation in Gazebo": "گیزیبو میں فزکس سمولیشن",
  "Physics Engines in Gazebo": "گیزیبو میں فزکس انجنز",
  "Rigid Body Dynamics": "سخت جسم کی حرکیات",
  "Joint Dynamics": "جوائنٹ حرکیات",
  "Collision Detection": "تصادم کی شناخت",
  "Friction and Contact Models": "رگڑ اور رابطے کے ماڈلز",
  "Gravity and Environmental Forces": "کشش ثقل اور ماحولیاتی قوتیں",
  "Simulation Step Size and Solver Configuration":
    "سمولیشن سٹیپ سائز اور سولور کنفیگریشن",
  "Common Physics Problems and Solutions": "عام فزکس مسائل اور حل",
  "Building a Complete Humanoid World": "مکمل ہیومنائیڈ دنیا بنانا",

  // Sensor Simulation
  "Sensor Simulation in Gazebo": "گیزیبو میں سینسر سمولیشن",
  "Sensor Simulation Architecture": "سینسر سمولیشن فن تعمیر",
  "Camera Sensors": "کیمرہ سینسرز",
  "Depth Sensors": "ڈیپتھ سینسرز",
  "LiDAR Sensors": "لائیڈار سینسرز",
  "IMU (Inertial Measurement Unit)": "آئی ایم یو (انرشیل میژرمنٹ یونٹ)",
  "Bridging Gazebo to ROS 2": "گیزیبو کو آر او ایس 2 سے جوڑنا",
  "Sensor Performance and Fidelity Trade-offs":
    "سینسر کارکردگی اور وفاداری کے تبادلے",

  // Unity Integration
  "Unity Integration for Robotics Simulation":
    "روبوٹکس سمولیشن کے لیے یونٹی انٹیگریشن",
  "Architecture Overview": "فن تعمیر کا جائزہ",
  "Setting Up the Unity Robotics Hub": "یونٹی روبوٹکس ہب سیٹ اپ کرنا",
  "Importing URDF into Unity": "یونٹی میں یو آر ڈی ایف درآمد کرنا",
  "ROS 2 Communication from Unity": "یونٹی سے آر او ایس 2 مواصلات",
  "Sensor Simulation in Unity": "یونٹی میں سینسر سمولیشن",
  "Unity vs Gazebo: When to Use Each":
    "یونٹی بمقابلہ گیزیبو: کب کون سا استعمال کریں",
  "Building a Digital Twin": "ڈیجیٹل ٹوئن بنانا",

  // ===== MODULE 4: NVIDIA Isaac Platform =====
  "What is the NVIDIA Isaac Platform?": "این ویڈیا آئزک پلیٹ فارم کیا ہے؟",
  "Why Isaac Matters for Humanoid Robotics":
    "ہیومنائیڈ روبوٹکس کے لیے آئزک کیوں اہم ہے",
  "GPU-Accelerated Simulation: The Core Advantage":
    "جی پی یو ایکسلریٹڈ سمولیشن: بنیادی فائدہ",
  "Hardware Recommendations": "ہارڈ ویئر کی سفارشات",

  // Isaac Sim
  "NVIDIA Isaac Sim": "این ویڈیا آئزک سم",
  "Installation and Setup": "تنصیب اور سیٹ اپ",
  "The Omniverse Platform": "اومنی ورس پلیٹ فارم",
  "Universal Scene Description (USD)": "یونیورسل سین ڈسکرپشن (USD)",
  "Creating a Scene Programmatically": "پروگرامی طور پر سین بنانا",
  "Loading URDF and MJCF Models": "یو آر ڈی ایف اور MJCF ماڈلز لوڈ کرنا",
  "PhysX 5 Physics Engine": "PhysX 5 فزکس انجن",
  "Configuring Physics Parameters": "فزکس پیرامیٹرز کی ترتیب",
  "Articulation API for Humanoid Robots":
    "ہیومنائیڈ روبوٹس کے لیے آرٹیکولیشن API",
  "The GPU Simulation Pipeline": "جی پی یو سمولیشن پائپ لائن",
  "Isaac Lab for Reinforcement Learning": "ریانفورسمنٹ لرننگ کے لیے آئزک لیب",
  "Defining an Isaac Lab Environment": "آئزک لیب ماحول کی تعریف",
  "Working with Cameras and Sensors": "کیمروں اور سینسرز کے ساتھ کام",
  "Common Isaac Sim Patterns": "عام آئزک سم پیٹرنز",

  // Perception & Manipulation
  "Perception and Manipulation in Isaac": "آئزک میں ادراک اور ہیرا پھیری",
  "The Synthetic Data Advantage": "مصنوعی ڈیٹا کا فائدہ",
  "Setting Up Isaac Replicator": "آئزک ریپلیکیٹر سیٹ اپ کرنا",
  "Domain Randomization": "ڈومین رینڈمائزیشن",
  "Camera and Sensor Simulation": "کیمرہ اور سینسر سمولیشن",
  "Training Object Detection on Synthetic Data":
    "مصنوعی ڈیٹا پر آبجیکٹ ڈیٹیکشن کی تربیت",
  "Grasp Planning in Simulation": "سمولیشن میں گراسپ پلاننگ",
  "Batch Grasp Evaluation": "بیچ گراسپ ایویلوایشن",
  "Manipulation Task Design": "مینیپولیشن ٹاسک ڈیزائن",

  // Reinforcement Learning
  "Reinforcement Learning for Robotics in Isaac":
    "آئزک میں روبوٹکس کے لیے ریانفورسمنٹ لرننگ",
  "RL Fundamentals for Robotics": "روبوٹکس کے لیے آر ایل بنیادیات",
  "Setting Up Isaac Gym Environments": "آئزک جم ماحول سیٹ اپ کرنا",
  "PPO vs SAC: Algorithm Selection": "PPO بمقابلہ SAC: الگورتھم کا انتخاب",
  "Reward Shaping for Humanoid Walking": "ہیومنائیڈ واکنگ کے لیے ریوارڈ شیپنگ",
  "Training Pipeline": "ٹریننگ پائپ لائن",
  "Evaluating Trained Policies": "تربیت یافتہ پالیسیوں کا جائزہ",

  // Sim-to-Real Transfer
  "The Reality Gap": "حقیقت کا فاصلہ",
  "System Identification": "سسٹم شناخت",
  "Transfer Learning Techniques": "ٹرانسفر لرننگ تکنیکیں",
  "Deployment Pipeline": "ڈپلائمنٹ پائپ لائن",
  "Validation Strategies": "توثیق کی حکمت عملیاں",

  // ===== MODULE 5: Humanoid Development =====
  "Why Humanoid Form Factor?": "ہیومنائیڈ فارم فیکٹر کیوں؟",
  "The Core Challenges": "بنیادی چیلنجز",
  "Module Structure": "ماڈیول کا ڈھانچہ",
  "Tools and Libraries": "ٹولز اور لائبریریز",
  "A Roadmap of the Module": "ماڈیول کا روڈ میپ",

  // Kinematics & Dynamics
  "Rigid-Body Transformations": "سخت جسم کی تبدیلیاں",
  "Denavit-Hartenberg (DH) Parameters": "ڈیناویٹ-ہارٹنبرگ (DH) پیرامیٹرز",
  "Forward Kinematics": "فارورڈ کائنے میٹکس",
  "Inverse Kinematics": "انورس کائنے میٹکس",
  "The Jacobian": "جیکوبین",
  Dynamics: "ڈائنامکس",
  "Newton-Euler Method": "نیوٹن-آئلر طریقہ",
  "Lagrangian Mechanics": "لاگرینجین میکانکس",

  // Bipedal Locomotion
  "Gait Patterns": "چال کے انداز",
  "Zero Moment Point (ZMP)": "زیرو مومنٹ پوائنٹ (ZMP)",
  "Capture Point": "کیپچر پوائنٹ",
  "Walking Controller": "واکنگ کنٹرولر",
  "Balance Recovery": "توازن کی بحالی",

  // Manipulation & Grasping
  "Grasp Types": "پکڑ کی اقسام",
  "Grasp Planning": "گراسپ پلاننگ",
  "Force Control": "فورس کنٹرول",

  // ===== MODULE 6: Conversational Robotics =====
  "Why Robots Need to Communicate": "روبوٹس کو بات چیت کی ضرورت کیوں ہے",
  "Speech as a Natural Interface": "قدرتی انٹرفیس کے طور پر تقریر",

  // Speech Recognition
  "Automatic Speech Recognition (ASR)": "خودکار تقریر کی شناخت (ASR)",
  "ASR Architecture": "ASR فن تعمیر",
  "Noise Handling": "شور سے نمٹنا",

  // Voice-to-Action
  "Natural Language Understanding": "قدرتی زبان کی سمجھ",
  "Intent Classification": "ارادے کی درجہ بندی",
  "Action Mapping": "عمل کی نقشہ بندی",

  // Multimodal Interaction
  "Gesture Recognition": "اشارے کی شناخت",
  "Emotion Detection": "جذبات کی شناخت",
  "Context Management": "سیاق و سباق کا انتظام",

  // ===== CAPSTONE PROJECT =====
  "Project Vision": "پروجیکٹ کا وژن",
  Objectives: "مقاصد",
  "Project Timeline": "پروجیکٹ ٹائم لائن",
  Deliverables: "نتائج",
  "Evaluation Overview": "تشخیص کا جائزہ",
  "Team Structure": "ٹیم کا ڈھانچہ",
  "Getting Started": "شروع کرنا",

  // ===== HARDWARE GUIDE =====
  "Why Hardware Matters in Physical AI":
    "فزیکل اے آئی میں ہارڈ ویئر کیوں اہم ہے",
  "Recommended Hardware Tiers": "تجویز کردہ ہارڈ ویئر درجات",

  // ===== PODCASTS =====
  Podcasts: "پوڈ کاسٹ",
  "Available Languages": "دستیاب زبانیں",
  Episodes: "اقساط",
  "Coming Soon": "جلد آ رہا ہے",
  "How to Use These Podcasts": "ان پوڈ کاسٹ کا استعمال کیسے کریں",

  // ===== COMMON HEADINGS & LABELS =====
  "Module Contents": "ماڈیول کے مندرجات",
  "On this page": "اس صفحے پر",
  Contents: "مندرجات",
  Note: "نوٹ",
  Warning: "انتباہ",
  Tip: "ٹپ",
  Info: "معلومات",
  Danger: "خطرہ",
  Caution: "احتیاط",
  Overview: "جائزہ",
  Example: "مثال",
  Output: "آؤٹ پٹ",
  "Read more": "مزید پڑھیں",
  "Edit this page": "اس صفحے میں ترمیم کریں",
  "Last updated on": "آخری تازہ کاری",
  by: "از",
};

/**
 * Translate all text nodes matching the dictionary within a container.
 * Works on any page — scans common selectors plus does a broad sweep.
 */
function applyUITranslations() {
  // Broad selectors that cover navbar, sidebar, footer, homepage, login/signup
  const selectors = [
    // Navbar
    ".navbar__link",
    ".navbar__title",
    ".navbar__item",
    // Sidebar
    ".menu__link",
    ".menu__list-item-collapsible .menu__link--sublist",
    // Footer
    ".footer__title",
    ".footer__link-item",
    // Pagination
    ".pagination-nav__sublabel",
    ".pagination-nav__label",
    // Homepage
    ".hero__title",
    ".hero__subtitle",
    ".hero .button",
    ".card__header h3",
    ".card__body p",
    ".card__footer a",
    // ToC
    ".table-of-contents__link",
    // Generic page content (login, signup, doc headings, etc.)
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "label",
    "button",
    "p",
    "a",
    "option",
    "span",
    "li",
    "strong",
    "th",
    "td",
  ];

  const elements = document.querySelectorAll(selectors.join(", "));
  elements.forEach((el) => {
    // If element has child elements, translate its direct text nodes individually
    if (el.children.length > 0) {
      // Still try full textContent match first (e.g. for simple wrapper elements)
      if (!el.querySelector(selectors.join(", "))) {
        const text = el.textContent?.trim();
        if (text && UI_TRANSLATIONS[text]) {
          el.setAttribute("data-original-text", text);
          el.textContent = UI_TRANSLATIONS[text];
          return;
        }
      }
      // Walk direct text nodes for mixed content like "Don't have an account? <a>Sign Up</a>"
      el.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          const originalText = node.textContent;
          const text = originalText?.trim();
          if (text && UI_TRANSLATIONS[text]) {
            // Store original innerHTML on parent for restoration
            if (!el.getAttribute("data-original-html")) {
              el.setAttribute("data-original-html", el.innerHTML);
            }
            (node as Text).textContent = originalText!.replace(
              text,
              UI_TRANSLATIONS[text],
            );
          }
        }
      });
      return;
    }
    const text = el.textContent?.trim();
    if (text && UI_TRANSLATIONS[text]) {
      el.setAttribute("data-original-text", text);
      el.textContent = UI_TRANSLATIONS[text];
    }
  });

  // Set RTL on page
  document.documentElement.setAttribute("dir", "rtl");
  document.documentElement.setAttribute("lang", "ur");
}

function removeUITranslations() {
  // Restore all elements that have data-original-text
  const translated = document.querySelectorAll("[data-original-text]");
  translated.forEach((el) => {
    el.textContent = el.getAttribute("data-original-text") || "";
    el.removeAttribute("data-original-text");
  });

  // Restore elements with translated text nodes (mixed content)
  const mixedContent = document.querySelectorAll("[data-original-html]");
  mixedContent.forEach((el) => {
    el.innerHTML = el.getAttribute("data-original-html") || "";
    el.removeAttribute("data-original-html");
  });

  document.documentElement.removeAttribute("dir");
  document.documentElement.setAttribute("lang", "en");
}

let originalDocContent: string | null = null;
let originalTocContent: string | null = null;
let lastTranslatedPath: string | null = null;

async function translateDocContent(): Promise<void> {
  const docContent = document.querySelector(".theme-doc-markdown");
  if (!docContent) return;

  const currentPath = window.location.pathname;
  // Don't re-translate if we already translated this page
  if (lastTranslatedPath === currentPath && originalDocContent) return;

  originalDocContent = docContent.innerHTML;
  lastTranslatedPath = currentPath;

  const tocContainer = document.querySelector(".table-of-contents");
  if (tocContainer) {
    originalTocContent = tocContainer.innerHTML;
  }

  const parts = currentPath.split("/").filter(Boolean);
  const chapterSlug = parts[parts.length - 1] || "index";

  const response = await translateToUrdu({
    content: docContent.textContent || "",
    chapter_slug: chapterSlug,
  });

  const renderedHtml = await marked.parse(response.translated_content);
  docContent.setAttribute("dir", "rtl");
  docContent.setAttribute("lang", "ur");
  docContent.classList.add("rtl-content");
  docContent.innerHTML = `<div class="urdu-content">${renderedHtml}</div>`;

  // Update ToC to match translated headings
  if (tocContainer) {
    const translatedHeadings = docContent.querySelectorAll("h2, h3");
    const tocLinks = tocContainer.querySelectorAll(".table-of-contents__link");
    tocLinks.forEach((link, index) => {
      if (translatedHeadings[index]) {
        link.setAttribute("data-original-text", link.textContent || "");
        link.textContent = translatedHeadings[index].textContent || "";
      }
    });
  }
}

function restoreDocContent() {
  if (originalDocContent) {
    const docContent = document.querySelector(".theme-doc-markdown");
    if (docContent) {
      docContent.removeAttribute("dir");
      docContent.removeAttribute("lang");
      docContent.classList.remove("rtl-content");
      docContent.innerHTML = originalDocContent;
    }
    originalDocContent = null;
    lastTranslatedPath = null;
  }
  if (originalTocContent) {
    const tocContainer = document.querySelector(".table-of-contents");
    if (tocContainer) {
      tocContainer.innerHTML = originalTocContent;
    }
    originalTocContent = null;
  }
}

function getSavedLanguage(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "ur";
}

function saveLanguage(isUrdu: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, isUrdu ? "ur" : "en");
}

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [isUrdu, setIsUrdu] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const observerRef = useRef<MutationObserver | null>(null);
  const lastAppliedPath = useRef<string>("");

  // Apply Urdu UI translations (no API call, just dictionary swap)
  const applyUrdu = useCallback(async () => {
    // Always re-apply UI translations (navbar, sidebar, footer, page text)
    applyUITranslations();

    // Reset doc content state when path changes
    const currentPath = window.location.pathname;
    if (lastAppliedPath.current !== currentPath) {
      originalDocContent = null;
      originalTocContent = null;
      lastTranslatedPath = null;
      lastAppliedPath.current = currentPath;
    }

    // Translate doc content via API if on a doc page
    const docContent = document.querySelector(".theme-doc-markdown");
    if (docContent) {
      try {
        await translateDocContent();
      } catch {
        // UI is already translated, doc content just stays English
      }
    }
  }, []);

  // On mount: check localStorage and apply if needed
  useEffect(() => {
    const saved = getSavedLanguage();
    if (saved) {
      setIsUrdu(true);
      // Small delay to let the DOM render first
      const timer = setTimeout(() => {
        applyUrdu();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [applyUrdu]);

  // Watch for route changes (Docusaurus SPA navigation)
  useEffect(() => {
    if (!isUrdu) return;

    let currentPath = window.location.pathname;

    // Use MutationObserver to detect when Docusaurus swaps page content
    observerRef.current = new MutationObserver(() => {
      const newPath = window.location.pathname;
      if (newPath !== currentPath) {
        currentPath = newPath;
        // Re-apply translations after a short delay for DOM to settle
        setTimeout(() => {
          applyUrdu();
        }, 150);
      }
    });

    observerRef.current.observe(
      document.querySelector("#__docusaurus") || document.body,
      {
        childList: true,
        subtree: true,
      },
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, [isUrdu, applyUrdu]);

  const toggleTranslation = useCallback(async () => {
    if (isUrdu) {
      // Switch to English
      restoreDocContent();
      removeUITranslations();
      saveLanguage(false);
      setIsUrdu(false);
      setError("");
      return;
    }

    // Switch to Urdu
    setIsTranslating(true);
    setError("");

    try {
      applyUITranslations();

      const docContent = document.querySelector(".theme-doc-markdown");
      if (docContent) {
        await translateDocContent();
      }

      saveLanguage(true);
      setIsUrdu(true);
      lastAppliedPath.current = window.location.pathname;
    } catch (err) {
      // UI translations applied, just doc content failed
      saveLanguage(true);
      setIsUrdu(true);
      setError(
        err instanceof Error ? err.message : "Content translation failed",
      );
    } finally {
      setIsTranslating(false);
    }
  }, [isUrdu]);

  return (
    <TranslationContext.Provider
      value={{ isUrdu, isTranslating, error, toggleTranslation }}
    >
      {children}
    </TranslationContext.Provider>
  );
}
