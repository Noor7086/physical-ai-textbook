"""Generate podcast audio files using OpenAI TTS.

Usage:
  cd /path/to/api
  source venv/bin/activate
  python scripts/generate_podcasts.py
"""
import asyncio
import os
from pathlib import Path
from openai import AsyncOpenAI
from dotenv import load_dotenv

load_dotenv()

client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

PODCASTS_DIR = Path(__file__).parent.parent.parent / "docusaurus" / "static" / "podcasts"

EPISODES = [
    {
        "id": "episode-01",
        "title_en": "Introduction to Physical AI",
        "script_en": """Welcome to the Physical AI and Humanoid Robotics podcast. I'm your host, and today we're exploring what Physical AI means and why it matters.

Physical AI is the bridge between digital intelligence and the real world. Unlike traditional AI that lives in servers processing text and images, Physical AI operates in our physical environment through robots, drones, and autonomous vehicles.

Think about it this way: ChatGPT can write you an essay, but it can't pick up a cup of coffee. Physical AI aims to give machines that capability, understanding and interacting with the messy, unpredictable real world.

The key concept here is embodied intelligence. When an AI has a body, a physical form that can sense and act, it learns differently. It develops an understanding of physics, spatial relationships, and cause and effect that purely digital AI simply cannot achieve.

Today's humanoid robots like Boston Dynamics' Atlas, Tesla's Optimus, and Figure AI's Figure 01 represent the cutting edge of this field. They combine computer vision, reinforcement learning, and sophisticated control systems to walk, manipulate objects, and even have conversations.

The sensor systems that make this possible include cameras for vision, LiDAR for depth perception, IMUs for balance, and force torque sensors for gentle manipulation. Each provides a different window into the physical world.

In our upcoming episodes, we'll dive deep into ROS 2, the Robot Operating System that ties all these components together, simulation environments like Gazebo and NVIDIA Isaac, and the mathematics behind making robots move gracefully.

Thanks for listening, and I'll see you in the next episode where we explore ROS 2 fundamentals.""",
        "script_ur": """فزیکل اے آئی اور ہیومنائیڈ روبوٹکس پوڈکاسٹ میں خوش آمدید۔ آج ہم جانیں گے کہ فزیکل اے آئی کیا ہے اور یہ کیوں اہم ہے۔

فزیکل اے آئی ڈیجیٹل ذہانت اور حقیقی دنیا کے درمیان ایک پل ہے۔ روایتی اے آئی کے برعکس جو سرورز میں ٹیکسٹ اور تصاویر پروسیس کرتی ہے، فزیکل اے آئی ہماری حقیقی دنیا میں روبوٹس، ڈرونز، اور خودکار گاڑیوں کے ذریعے کام کرتی ہے۔

اسے اس طرح سمجھیں: چیٹ جی پی ٹی آپ کے لیے ایک مضمون لکھ سکتا ہے، لیکن وہ کافی کا کپ نہیں اٹھا سکتا۔ فزیکل اے آئی کا مقصد مشینوں کو یہ صلاحیت دینا ہے کہ وہ حقیقی دنیا کو سمجھ سکیں اور اس سے تعامل کر سکیں۔

یہاں اہم تصور مجسم ذہانت کا ہے۔ جب ایک اے آئی کے پاس جسم ہوتا ہے، ایک فزیکل شکل جو محسوس کر سکتی ہے اور عمل کر سکتی ہے، تو وہ مختلف طریقے سے سیکھتی ہے۔

آج کے ہیومنائیڈ روبوٹس جیسے بوسٹن ڈائنامکس کا اٹلس، ٹیسلا کا آپٹیمس، اور فگر اے آئی اس میدان کی جدید ترین مثالیں ہیں۔ یہ کمپیوٹر ویژن، ریانفورسمنٹ لرننگ، اور جدید کنٹرول سسٹمز کو ملا کر چلنے، چیزیں پکڑنے اور بات چیت کرنے کی صلاحیت رکھتے ہیں۔

سننے کا شکریہ۔ اگلی قسط میں ہم آر او ایس 2 کی بنیادیات کا جائزہ لیں گے۔""",
    },
    {
        "id": "episode-02",
        "title_en": "ROS 2 and Robot Communication",
        "script_en": """Welcome back to the Physical AI podcast. Today we're diving into ROS 2, the Robot Operating System version 2, which is the backbone of modern robotics software.

Now, despite its name, ROS is not actually an operating system. It's a middleware framework, a set of tools, libraries, and conventions that help you build robot applications. Think of it as the nervous system of a robot.

ROS 2 is built on top of DDS, the Data Distribution Service, which handles all communication between different parts of your robot software. This is a huge improvement over ROS 1, which relied on a single master node. If that master went down, everything stopped. ROS 2 is decentralized and much more robust.

The three fundamental concepts you need to understand are nodes, topics, and services.

Nodes are individual processes that perform specific tasks. One node might handle camera input, another might process that image to detect objects, and a third might control the robot's arm to pick up what was detected. Each node does one thing well.

Topics are the channels through which nodes communicate asynchronously. A camera node publishes image data to a topic, and any node that needs that data subscribes to it. This publish-subscribe pattern is elegant because nodes don't need to know about each other.

Services provide synchronous, request-response communication. When you need a guaranteed answer, like asking a planning node to calculate a path, you use a service.

Writing your first ROS 2 node in Python is surprisingly straightforward. You create a class that inherits from Node, set up your publishers and subscribers, and implement callback functions. The framework handles all the networking.

In the next episode, we'll explore Gazebo simulation, where you can test your ROS 2 code on virtual robots before touching real hardware. See you then!""",
        "script_ur": """فزیکل اے آئی پوڈکاسٹ میں واپسی پر خوش آمدید۔ آج ہم آر او ایس 2 کے بارے میں بات کریں گے، جو جدید روبوٹکس سافٹ ویئر کی ریڑھ کی ہڈی ہے۔

اپنے نام کے باوجود، آر او ایس دراصل ایک آپریٹنگ سسٹم نہیں ہے۔ یہ ایک مڈل ویئر فریم ورک ہے، ٹولز، لائبریریوں اور قواعد کا ایک مجموعہ جو آپ کو روبوٹ ایپلیکیشنز بنانے میں مدد کرتا ہے۔ اسے روبوٹ کے اعصابی نظام کی طرح سمجھیں۔

آر او ایس 2 ڈی ڈی ایس یعنی ڈیٹا ڈسٹری بیوشن سروس پر بنایا گیا ہے جو آپ کے روبوٹ سافٹ ویئر کے مختلف حصوں کے درمیان تمام مواصلات کو سنبھالتا ہے۔

تین بنیادی تصورات جو آپ کو سمجھنے ہیں وہ ہیں نوڈز، ٹاپکس، اور سروسز۔

نوڈز انفرادی پروسیسز ہیں جو مخصوص کام انجام دیتے ہیں۔ ایک نوڈ کیمرے کی ان پٹ کو سنبھال سکتا ہے، دوسرا اس تصویر کو پروسیس کر سکتا ہے، اور تیسرا روبوٹ کے بازو کو کنٹرول کر سکتا ہے۔

ٹاپکس وہ چینلز ہیں جن کے ذریعے نوڈز غیر مطابقتی طور پر بات چیت کرتے ہیں۔ یہ پبلش سبسکرائب پیٹرن خوبصورت ہے کیونکہ نوڈز کو ایک دوسرے کے بارے میں جاننے کی ضرورت نہیں ہوتی۔

سروسز ہم وقت ساز، درخواست جواب مواصلات فراہم کرتی ہیں۔

اگلی قسط میں ہم گیزیبو سمولیشن کا جائزہ لیں گے جہاں آپ حقیقی ہارڈویئر کو چھونے سے پہلے اپنے آر او ایس 2 کوڈ کو ورچوئل روبوٹس پر ٹیسٹ کر سکتے ہیں۔""",
    },
]


async def generate_audio(text: str, output_path: Path, voice: str = "alloy"):
    """Generate audio using OpenAI TTS."""
    print(f"  Generating: {output_path.name} ({len(text)} chars)...")
    response = await client.audio.speech.create(
        model="tts-1",
        voice=voice,
        input=text,
    )
    response.stream_to_file(str(output_path))
    size_kb = output_path.stat().st_size / 1024
    print(f"  Done: {output_path.name} ({size_kb:.0f} KB)")


async def main():
    PODCASTS_DIR.mkdir(parents=True, exist_ok=True)

    for ep in EPISODES:
        print(f"\nGenerating: {ep['title_en']}")

        # English version
        await generate_audio(
            ep["script_en"],
            PODCASTS_DIR / f"{ep['id']}-en.mp3",
            voice="alloy",
        )

        # Urdu version
        await generate_audio(
            ep["script_ur"],
            PODCASTS_DIR / f"{ep['id']}-ur.mp3",
            voice="alloy",
        )

    print("\nAll podcast episodes generated!")


if __name__ == "__main__":
    asyncio.run(main())
