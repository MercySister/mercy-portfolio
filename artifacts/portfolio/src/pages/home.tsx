import React, { useState, useEffect, useRef, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Eye, MessageSquare, X, Send } from "lucide-react";
import {
  useGetStats,
  useRecordVisit,
  useAddLike,
  useCreateMessage,
  getGetStatsQueryKey,
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

/* ─── LANG CONTEXT ──────────────────────────── */
type Lang = "cn" | "en";
const LangContext = createContext<{ lang: Lang; setLang: (l: Lang) => void }>({
  lang: "cn",
  setLang: () => {},
});
const useLang = () => useContext(LangContext);

/* ─── TRANSLATIONS ──────────────────────────── */
const T = {
  tabs: {
    cn: ["关于", "经历", "项目", "教育", "兴趣"],
    en: ["ABOUT", "EXPERIENCE", "PROJECTS", "EDUCATION", "INTERESTS"],
  },
  hero: {
    subtitle: { cn: "产品经理", en: "Product Manager" },
    portfolio: { cn: "// 作品集", en: "// Portfolio" },
    meta: {
      cn: ["自主设计", "第001版", "限本人"],
      en: ["Design by Self", "Generation #001", "Valid For One"],
    },
    active: { cn: "在线", en: "Active" },
  },
  bottomBar: {
    leave: { cn: "留言_给我", en: "Leave_Message" },
  },
  modal: {
    title: { cn: "给我留言", en: "LEAVE A MESSAGE" },
    label: { cn: "Message_Protocol", en: "Message_Protocol" },
    namePlaceholder: { cn: "你的名字...", en: "your name..." },
    msgPlaceholder: { cn: "写点什么...", en: "write something..." },
    nameLabel: { cn: "Name_Identifier", en: "Name_Identifier" },
    msgLabel: { cn: "Message_Data", en: "Message_Data" },
    submit: { cn: "发送 → 已授权", en: "Submit → Access Granted" },
    submitting: { cn: "发送中...", en: "Transmitting..." },
    done: { cn: "Transmission_Complete", en: "Transmission_Complete" },
  },
  about: {
    sectionId: { cn: "01 // 身份_档案", en: "01 // Identity_Record" },
    access: { cn: "访问", en: "ACCESS" },
    rows: {
      name: { cn: "姓名", en: "Name" },
      born: { cn: "出生", en: "Born" },
      languages: { cn: "语言", en: "Languages" },
      phone: { cn: "电话", en: "Phone" },
      email: { cn: "邮件", en: "Email" },
    },
    coreDirective: { cn: "02 // 核心_理念", en: "02 // Core_Directive" },
    headline: { cn: "挑战型\n工作思维", en: "Challenge-Driven\nMindset" },
    summary: {
      cn: "在快速迭代的市场环境中始终保持高度工作激情与高效输出。",
      en: "Always maintaining high passion and efficient output in rapidly iterating market environments.",
    },
    caps: { cn: "03 // 核心_能力 // 索引", en: "03 // Core_Capabilities // Index" },
    capabilities: [
      {
        num: "01",
        title: { cn: "精准商业研判能力", en: "Sharp Business Judgment" },
        desc: {
          cn: "具备敏锐的行业趋势洞察与高潜力企业识别能力，多次于企业发展初期入局，深度参与并见证其成长为行业头部标杆。",
          en: "Keen industry trend insights and high-potential company identification. Joined multiple companies in early stages, witnessing their growth to industry leaders.",
        },
      },
      {
        num: "02",
        title: { cn: "全链路项目操盘实力", en: "Full-Cycle Product Leadership" },
        desc: {
          cn: "拥有丰富的从0到1复杂系统产品独立主导经验，包括用户端、业务系统及中台全平台的横向产品能力，擅长统筹跨业务、跨职能团队协同推进。",
          en: "Rich experience independently leading complex systems from 0 to 1, spanning user-facing, business systems and platform-wide horizontal product capabilities, skilled at cross-functional coordination.",
        },
      },
      {
        num: "03",
        title: { cn: "敏捷抗压的职业素养", en: "Agile & Resilient Professional" },
        desc: {
          cn: "秉持挑战型工作思维，在快速迭代的市场环境中始终保持高度工作激情与高效输出，具备极强的适应性与问题解决能力。",
          en: "Challenge-driven mindset, maintaining high passion and efficient output in rapidly iterating markets, with strong adaptability and problem-solving capabilities.",
        },
      },
      {
        num: "04",
        title: { cn: "持续学习的创新意识", en: "Continuous Learning & Innovation" },
        desc: {
          cn: "在快速变化的AI时代，时刻关注最新动向，拥抱并实践最新技术，很强的抽象思维，擅长总结出个人方法和知识库。",
          en: "Staying attuned to the latest AI trends, embracing and practicing new technologies, with strong abstract thinking and the ability to distill personal methodologies.",
        },
      },
    ],
  },
  experience: {
    entries: [
      {
        num: "01",
        period: "2022.4 – 至今 / Present",
        company: "阿维塔 (Avatr)",
        role: { cn: "产品专家（平台技术开发部 – 智能空间）", en: "Product Expert (Platform Tech – Intelligent Space)" },
        status: "ACTIVE",
        statusColor: "#1500ff",
        tags: ["AI Agent", { cn: "情感陪伴", en: "Emotional Companion" }, { cn: "车载机器人", en: "In-vehicle Robot" }, { cn: "车控设置", en: "Vehicle Control" }, { cn: "充电桩", en: "Charging" }, { cn: "销交系统", en: "Sales System" }],
        tagBlue: true,
        content: [
          {
            t: { cn: "智能座舱创新线", en: "Smart Cockpit Innovation" },
            d: {
              cn: "主导座舱生态 AI Agent、虚拟陪伴 Chatbot 及车载机器人从 0 到 1 产品定义，定义核心交互形态与能力架构，构建多模态交互能力、原子能力库与场景化服务体系（如音乐律动等），推动 AI 能力在车载场景中的产品化落地。",
              en: "Led AI Agent, virtual companion chatbot and in-vehicle robot from 0→1 product definition, defining core interaction patterns and capability architecture, building multimodal interaction, atomic capability library and scenario-based services (e.g. music rhythm), driving AI capabilities into production in automotive scenarios.",
            },
          },
          {
            t: { cn: "座舱车控与底盘", en: "Cockpit Controls & Chassis" },
            d: {
              cn: "负责国内及海外市场产品规划，设计车辆控制及底盘（太行平台）功能体系，提升整车智能化体验与一致性。",
              en: "Responsible for domestic and overseas product planning, designing vehicle control and chassis (Taiháng platform) feature systems, enhancing overall vehicle intelligence and consistency.",
            },
          },
          {
            t: { cn: "公充桩与家充桩", en: "Public & Home Charging" },
            d: {
              cn: "主导充电业务从 0 到 1 建设，覆盖公桩与私桩车桩互联、充电地图、APP 远程控制、桩云平台搭建，对接多运营商实现互联互通，构建完整充电生态与用户服务闭环，并获得公司级优秀项目。",
              en: "Led charging business from 0→1, covering public/private charger connectivity, charging maps, APP remote control, cloud platform, multi-operator interoperability, building a complete charging ecosystem. Received company-level Outstanding Project Award.",
            },
          },
          {
            t: { cn: "销交侧业务", en: "Sales & Delivery" },
            d: {
              cn: "负责试乘试驾与大客户业务平台设计，打通销售端与用户端系统链路，提升一线销售效率与用户服务体验，获得杰出贡献奖。",
              en: "Responsible for test-drive and key-account platform design, connecting sales and user system chains, improving front-line sales efficiency and user service experience. Received Outstanding Contribution Award.",
            },
          },
        ],
      },
      {
        num: "02",
        period: "2021.4 – 2022.2",
        company: "达能亚太 (Danone APAC)",
        role: { cn: "产品经理（数字工具创新）", en: "Product Manager (Digital Tool Innovation)" },
        status: "ARCHIVED",
        statusColor: "rgba(0,0,0,0.35)",
        tags: [{ cn: "创新应用", en: "Innovation App" }, { cn: "健康管理", en: "Health Mgmt" }, { cn: "会员体系", en: "Membership" }],
        tagBlue: false,
        content: [
          {
            t: { cn: "母婴及健康管理平台", en: "Maternal & Health Platform" },
            d: {
              cn: "作为「喂自由」与「敢迈」小程序产品Owner，主导饮食记录与分析、智能食谱推荐及家庭健康档案等功能设计，构建会员成长激励体系，引入数据驱动的任务打卡与健康数据分析机制，实现个性化健康管理与推荐。",
              en: "As Product Owner of mini-programs, led dietary recording/analysis, smart recipe recommendations and family health records design, building a member growth incentive system with data-driven task check-ins and health data analysis for personalized health management.",
            },
          },
          {
            t: { cn: "AI探索", en: "AI Exploration" },
            d: {
              cn: "参与AI能力在健康管理场景中的应用探索（如智能推荐、数据分析辅助决策等），推动产品从规则驱动向数据驱动与智能化演进。",
              en: "Participated in AI capability exploration in health management scenarios (smart recommendations, data-driven decision support), driving product evolution from rule-based to data-driven and intelligent.",
            },
          },
          {
            t: { cn: "供应商管理", en: "Vendor Management" },
            d: {
              cn: "管理外部供应商与技术团队协作，协调系统开发进度，把控项目质量与交付节奏，确保产品按期上线并达成预期效果。",
              en: "Managed external vendors and technical team collaboration, coordinating development progress, controlling project quality and delivery rhythm to ensure on-time product launches.",
            },
          },
        ],
      },
      {
        num: "03",
        period: "2018.3 – 2019.4",
        company: "喜茶 (HEYTEA)",
        role: { cn: "商业产品经理", en: "Commercial Product Manager" },
        status: "ARCHIVED",
        statusColor: "rgba(0,0,0,0.35)",
        tags: ["HEYTEA GO", { cn: "点单链路", en: "Order Flow" }, { cn: "会员体系", en: "Membership" }, { cn: "境外支付", en: "Overseas Payment" }],
        tagBlue: false,
        content: [
          {
            t: { cn: "用户端", en: "User App" },
            d: {
              cn: "从0到1参与打造品牌+工具型应用「喜茶GO」，实现线上线下一体化闭环，累计用户千万级，日活达30w+。担任APP大陆及海外版本产品负责人，构建多语言能力及境外支付，支撑品牌国际化拓展。",
              en: "Participated 0→1 in building 'HEYTEA GO', achieving online-offline integration with tens of millions of users and 300k+ daily actives. As product lead for mainland and overseas versions, built multilingual capability and overseas payment, supporting brand internationalization.",
            },
          },
          {
            t: { cn: "点单链路", en: "Order Flow" },
            d: {
              cn: "点单、外卖、退款、评价等模块，持续优化转化路径与用户体验。",
              en: "Managed ordering, delivery, refunds and reviews modules, continuously optimizing conversion paths and user experience.",
            },
          },
          {
            t: { cn: "会员体系 & 中后台", en: "Membership & Back Office" },
            d: {
              cn: "主导会员系统从0到1搭建。付费会员上线1个月突破35万+。参与经营管理后台、营销系统、内容管理系统及门店助手等系统设计。",
              en: "Led membership system from 0→1. Paid membership exceeded 350k+ within one month of launch. Participated in operations management, marketing systems, CMS and store assistant system design.",
            },
          },
        ],
      },
      {
        num: "04",
        period: "2016.11 – 2018.2",
        company: "Cleen/可印 (美国)",
        role: { cn: "产品经理（产品部）", en: "Product Manager (Product Department)" },
        status: "ARCHIVED",
        statusColor: "rgba(0,0,0,0.35)",
        tags: [{ cn: "时代杂志十佳应用", en: "TIME Top 10 Apps" }, { cn: "AI人脸识别专利", en: "AI Face Recognition Patent" }, { cn: "内容社区", en: "Content Community" }, { cn: "营销活动", en: "Marketing" }],
        tagBlue: false,
        content: [
          {
            t: { cn: "用户端", en: "User App" },
            d: {
              cn: "独立负责 Cleen APP iOS 与 Android 双端产品设计与 UI 设计，主导基于 AI 图像处理算法能力的人像照片书生成产品体验设计，确保算法能力与用户体验的高效融合，优化照片筛选、智能排版与内容生成逻辑，提升用户生成效率与成品质量。",
              en: "Independently responsible for Cleen APP iOS and Android product and UI design. Led AI image processing-based portrait photo book experience design, optimizing photo selection, smart layout and content generation logic to improve efficiency and output quality.",
            },
          },
          {
            t: { cn: "内容社区", en: "Content Community" },
            d: {
              cn: "从 0 到 1 主导内容社区「氢故事」模块的建设与上线，打造以用户内容为核心的社区生态模块。策划并执行 KOL 招募及激励机制，重点引入内容创作者，构建创作者生态，驱动用户增长与社区内容活跃度提升。",
              en: "Led 0→1 build of content community module, building a user content-driven community. Planned and executed KOL recruitment and incentive mechanisms, cultivating a creator ecosystem to drive user growth and content engagement.",
            },
          },
          {
            t: { cn: "营销活动", en: "Marketing Campaigns" },
            d: {
              cn: "协同运营团队策划多项基于用户内容的营销活动（如智能照片书分享、创作挑战等），提升产品曝光度与用户参与度。",
              en: "Collaborated with operations on user content-based marketing campaigns (e.g. smart photo book sharing, creation challenges), improving product exposure and user engagement.",
            },
          },
        ],
      },
    ],
  },
  projects: {
    p1: {
      label: { cn: "项目档案 // 01 // 2022.4 – 至今", en: "Project_Record // 01 // 2022.4 – Present" },
      title: { cn: "车载AI智能体", en: "In-Vehicle AI Agent" },
      sub: { cn: "AI 智能体 + 聊天机器人 // 单程票", en: "AI Agent + Chatbot // One Way Ticket" },
      descLabel: { cn: "项目描述", en: "Project_Description" },
      desc: {
        cn: "构建车载AI智能体，提供品牌IP化、拟人化交互、情感陪伴及场景化服务能力。",
        en: "Build an in-vehicle AI agent providing brand IP personification, human-like interaction, emotional companionship, and scenario-based services.",
      },
      respLabel: { cn: "核心职责", en: "Core_Responsibilities" },
      resps: [
        { cn: "定义智能体世界观、角色人设设定与交互逻辑", en: "Define the agent's world-view, character persona and interaction logic" },
        { cn: "设计拟人化交互方式（TTS风格、实时对话、行为表达）", en: "Design personified interaction (TTS style, real-time dialogue, behavior expression)" },
        { cn: "构建情感陪伴能力（情绪识别、反馈策略）", en: "Build emotional companionship capability (emotion recognition, response strategies)" },
        { cn: "设计用户记忆机制（偏好、行为习惯）", en: "Design user memory mechanisms (preferences, behavioral habits)" },
      ],
      resultsLabel: { cn: "关键结果", en: "Key_Results" },
      results: [
        { cn: "提升用户交互自然度与粘性，构建品牌IP化", en: "Improved interaction naturalness and stickiness, building a brand IP identity" },
        { cn: "强化用户对车载智能体的人设感知", en: "Strengthened users' perception of the in-vehicle agent's persona" },
      ],
    },
    p2: {
      label: { cn: "项目档案 // 02 // 2022.4 – 至今", en: "Project_Record // 02 // 2022.4 – Present" },
      title: { cn: "车载机器人", en: "In-Vehicle Robot" },
      sub: { cn: "AI 智能体 + 硬件 // 实体智能", en: "AI Agent + Hardware // Physical Intelligence" },
      descLabel: { cn: "项目描述", en: "Project_Description" },
      desc: {
        cn: "从 0 到 1 打造车载机器人产品，实现 AI 能力与硬件结合。",
        en: "Build an in-vehicle robot product from scratch, combining AI capabilities with hardware.",
      },
      respLabel: { cn: "核心职责", en: "Core_Responsibilities" },
      resps: [
        { cn: "定义机器人交互形式与核心能力", en: "Define the robot's interaction forms and core capabilities" },
        { cn: "构建原子能力库，可复用的多层结构设计，并利用 AI 能力自主完成表现形式设计", en: "Build an atomic capability library with reusable multi-layer structure, using AI to autonomously generate expression designs" },
        { cn: "设计场景服务体系，包括不限于音乐律动算法设计", en: "Design scenario service systems including music rhythm algorithm design" },
      ],
    },
  },
  education: {
    label: { cn: "教育档案 // 2012 – 2016", en: "Education_Record // 2012 – 2016" },
    school: { cn: "西安邮电大学", en: "Xi'an University of Posts & Telecom" },
    college: { cn: "通信与信息工程学院", en: "School of Communications & Information Engineering" },
    major: { cn: "信息安全专业（本科）", en: "Information Security (Bachelor's)" },
    period: "2012.9 – 2016.7",
    focusLabel: { cn: "学术方向", en: "Academic_Focus" },
    focus: {
      blue: ["C / C++", { cn: "安全数据库", en: "Security Database" }, { cn: "数字图像加密", en: "Digital Image Encryption" }],
      normal: [{ cn: "辅修: UI设计", en: "Minor: UI Design" }, { cn: "辅修: 工业设计", en: "Minor: Industrial Design" }],
    },
    campusLabel: { cn: "校园经历", en: "Campus_Experience" },
    campus: [
      {
        cn: "校级社团副主席、班级团支书，具备扎实的组织协调能力。",
        en: "Vice President of student clubs and class secretary, with solid organizational coordination capabilities.",
      },
      {
        cn: "加入Tarpas-web开发实验室，负责校园网WEB前端开发，打下扎实的技术基础。",
        en: "Joined Tarpas-web development lab, responsible for campus web frontend development, building a solid technical foundation.",
      },
    ],
  },
  interests: {
    activities: [
      { en: "MUAY THAI", cn: "泰拳", num: "01" },
      { en: "SKIING", cn: "滑雪", num: "02" },
      { en: "ROCK CLIMBING", cn: "攀岩", num: "03" },
      { en: "DANCING", cn: "跳舞", num: "04" },
      { en: "HIKING", cn: "徒步", num: "05" },
    ],
    profileLabel: { cn: "活动档案", en: "Activity_Profile" },
    headline: { cn: "探险精神 勇往直前", en: "Fierce Adventurous Spirit" },
    p1title: { cn: "广泛兴趣爱好涉猎：", en: "Wide-ranging hobbies:" },
    p1: {
      cn: "热爱户外运动，喜欢挑战自己，坚持泰拳、滑雪、攀岩、跳舞、徒步等运动。",
      en: "Passionate about outdoor sports, embracing challenges, consistently practicing Muay Thai, skiing, rock climbing, dancing, and hiking.",
    },
    p2title: { cn: "多元活动策划经验：", en: "Diverse event planning experience:" },
    p2: {
      cn: "热衷组织策划工作，拥有丰富的俱乐部及各类活动统筹策划经验。擅长活动全流程设计与落地执行，具备良好的组织协调与沟通能力。",
      en: "Enthusiastic about organizing activities, with rich experience in club and event coordination, skilled in full-process design and execution with excellent organizational and communication skills.",
    },
  },
};

type TabId = "ABOUT" | "EXPERIENCE" | "PROJECTS" | "EDUCATION" | "INTERESTS";
const TAB_IDS: TabId[] = ["ABOUT", "EXPERIENCE", "PROJECTS", "EDUCATION", "INTERESTS"];

/* ─── UTILITIES ─────────────────────────────── */
function maskName(name: string) {
  if (name.length <= 2) return name;
  return name[0] + "*".repeat(name.length - 2) + name[name.length - 1];
}
function maskPhone(phone: string) {
  if (phone.length <= 2) return phone;
  return phone[0] + "*".repeat(phone.length - 2) + phone[phone.length - 1];
}
function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  if (local.length <= 2) return email;
  return local[0] + "*".repeat(local.length - 2) + local[local.length - 1] + "@" + domain;
}
function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  useEffect(() => {
    if (started.current || !target) return;
    started.current = true;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min((Date.now() - t0) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);
  return count;
}

/* ─── SCROLL PROGRESS BAR ───────────────────── */
function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? scrollTop / docHeight : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px]" style={{ background: "rgba(255,255,255,0.06)" }}>
      <motion.div
        className="h-full origin-left"
        style={{ background: "#1500ff", scaleX: progress, transformOrigin: "0% 50%" }}
        transition={{ type: "tween", duration: 0.05 }}
      />
    </div>
  );
}

/* ─── MESSAGE MODAL ──────────────────────────── */
function MessageModal({ onClose }: { onClose: () => void }) {
  const { lang } = useLang();
  const queryClient = useQueryClient();
  const createMessage = useCreateMessage();
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    createMessage.mutate({ data: { name, content } }, {
      onSuccess: () => {
        setSent(true);
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
        setTimeout(() => { setSent(false); onClose(); }, 2500);
      },
    });
  };

  const m = T.modal;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6" onClick={onClose}>
      <motion.div className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.24, ease: "easeOut" }}
        className="relative w-full max-w-md ticket-card p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="font-mono text-[10px] tracking-[0.20em] text-black/30 uppercase">
            {m.label[lang]}
          </span>
          <button onClick={onClose} className="text-black/30 hover:text-black/60 transition-colors -mt-1">
            <X className="w-4 h-4" />
          </button>
        </div>
        <h2 className="font-sans font-bold text-lg text-black/82 mb-1" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
          {m.title[lang]}
        </h2>
        <div className="dot-sep mb-6" />

        {sent ? (
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <div className="w-10 h-10 border border-black/20 flex items-center justify-center">
              <Send className="w-4 h-4 text-black/60" />
            </div>
            <p className="font-mono text-[10px] text-black/40 tracking-[0.20em] uppercase animate-pulse">
              {m.done[lang]}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="section-label">{m.nameLabel[lang]}</span>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full bg-white/60 border border-black/14 focus:border-black/32 focus:outline-none px-3 py-2.5 text-black/72 text-sm placeholder:text-black/22 transition-colors"
                placeholder={m.namePlaceholder[lang]} />
            </div>
            <div>
              <span className="section-label">{m.msgLabel[lang]}</span>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} required rows={5}
                className="w-full bg-white/60 border border-black/14 focus:border-black/32 focus:outline-none px-3 py-2.5 text-black/72 text-sm resize-none placeholder:text-black/22 transition-colors"
                placeholder={m.msgPlaceholder[lang]} />
            </div>
            <button type="submit" disabled={createMessage.isPending}
              className="w-full py-2.5 bg-black text-white font-mono text-[10px] uppercase tracking-[0.18em] hover:bg-black/80 transition-colors disabled:opacity-40">
              {createMessage.isPending ? m.submitting[lang] : m.submit[lang]}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-black/08 flex justify-between items-end">
          <div className="flex gap-px">
            {Array.from({ length: 40 }).map((_, i) => (
              <div key={i} className="bg-black/60"
                style={{ width: i % 3 === 0 ? 2 : 1, height: i % 5 === 0 ? 18 : i % 2 === 0 ? 14 : 10 }} />
            ))}
          </div>
          <span className="font-mono text-[10px] text-black/28 tracking-widest">8902 1104 2293</span>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── WAVE CANVAS ────────────────────────────── */
function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let t = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = canvas.offsetWidth * dpr;
      canvas.height = canvas.offsetHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;
      ctx.clearRect(0, 0, W, H);

      const base = ctx.createLinearGradient(0, 0, W, H);
      base.addColorStop(0, "#111");
      base.addColorStop(0.4, "#2a2a2a");
      base.addColorStop(0.7, "#555");
      base.addColorStop(1, "#1a1a1a");
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, W, H);

      const waves = [
        { amp: 10, freq: 0.012, speed: 0.018, y: H * 0.22, opacity: 0.18, width: 1.2 },
        { amp: 14, freq: 0.009, speed: 0.012, y: H * 0.38, opacity: 0.22, width: 1.0 },
        { amp: 8,  freq: 0.016, speed: 0.025, y: H * 0.52, opacity: 0.16, width: 0.8 },
        { amp: 18, freq: 0.007, speed: 0.009, y: H * 0.65, opacity: 0.28, width: 1.5 },
        { amp: 10, freq: 0.013, speed: 0.020, y: H * 0.78, opacity: 0.14, width: 0.9 },
        { amp: 6,  freq: 0.020, speed: 0.030, y: H * 0.88, opacity: 0.12, width: 0.7 },
      ];

      waves.forEach((w) => {
        ctx.beginPath();
        ctx.moveTo(0, w.y + Math.sin(t * w.speed) * w.amp);
        for (let x = 0; x <= W; x += 2) {
          const y = w.y + Math.sin(x * w.freq + t * w.speed) * w.amp;
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = `rgba(255,255,255,${w.opacity})`;
        ctx.lineWidth = w.width;
        ctx.stroke();
      });

      const sweepX = ((Math.sin(t * 0.004) + 1) / 2) * W;
      const sweep = ctx.createRadialGradient(sweepX, H * 0.4, 0, sweepX, H * 0.4, W * 0.4);
      sweep.addColorStop(0, "rgba(255,255,255,0.07)");
      sweep.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = sweep;
      ctx.fillRect(0, 0, W, H);

      t += 1;
      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="w-full" style={{ height: 96, display: "block" }} />
  );
}

/* ─── HOME ───────────────────────────────────── */
export default function Home() {
  const [lang, setLang] = useState<Lang>("cn");
  const [activeTab, setActiveTab] = useState<TabId>("ABOUT");
  const [showMessage, setShowMessage] = useState(false);
  const queryClient = useQueryClient();
  const { data: stats } = useGetStats();
  const recordVisit = useRecordVisit();
  const addLike = useAddLike();
  const [hasLiked, setHasLiked] = useState(() => localStorage.getItem("mercy_liked") === "true");

  const visitorCount = useCountUp(stats?.visitorCount ?? 0);
  const likeCount = useCountUp(stats?.likeCount ?? 0);

  useEffect(() => {
    recordVisit.mutate(undefined, {
      onSuccess: () => queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() }),
    });
  }, []);

  const handleLike = () => {
    if (hasLiked) return;
    addLike.mutate(undefined, {
      onSuccess: () => {
        setHasLiked(true);
        localStorage.setItem("mercy_liked", "true");
        queryClient.invalidateQueries({ queryKey: getGetStatsQueryKey() });
      },
    });
  };

  const tabLabels = lang === "cn" ? T.tabs.cn : T.tabs.en;

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      <ScrollProgress />
      <div className="min-h-screen flex flex-col" style={{ paddingLeft: 28, paddingRight: 36, paddingBottom: 72, paddingTop: 2 }}>

        {/* ── HERO TICKET CARD ─────────────────── */}
        <motion.div
          className="ticket-card perf-right mx-auto w-full max-w-4xl mt-8 mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="relative">
            <WaveCanvas />
            <div className="blue-dot-lg absolute" style={{ bottom: 16, right: 80, zIndex: 2 }} />
          </div>

          <div className="px-7 pt-5 pb-6" style={{ paddingRight: 44 }}>
            <div className="flex justify-between items-center mb-1">
              <span className="font-mono text-black/52 font-bold text-lg">01</span>
              <span className="font-mono text-black/52 font-bold text-lg">86</span>
            </div>

            <div className="flex items-center gap-4 mb-1">
              <div className="font-sans font-black text-black leading-none whitespace-nowrap flex items-center gap-4"
                style={{ fontSize: "clamp(42px, 8vw, 72px)", fontFamily: "'Space Grotesk',sans-serif", letterSpacing: "-0.02em" }}>
                MERCY MU
                <span className="blue-dot-lg" style={{ flexShrink: 0 }} />
              </div>
            </div>

            <div className="dot-sep my-4" />

            <div className="flex justify-between items-start flex-wrap gap-4">
              <div>
                <div className="flex items-baseline gap-2 mb-1">
                  <span className="font-serif italic text-black/70 text-2xl"
                    style={{ fontFamily: "'Playfair Display', serif" }}>
                    𝒜ccess
                  </span>
                  <span className="font-mono text-[9px] text-black/35 tracking-widest uppercase">
                    {T.hero.portfolio[lang]}
                  </span>
                </div>
                <p className="font-mono text-[10px] tracking-[0.18em] text-black/52 uppercase">
                  {T.hero.subtitle[lang]}
                </p>
              </div>
              <div className="text-right">
                <div className="font-mono text-[9px] text-black/30 uppercase tracking-wider leading-relaxed">
                  {T.hero.meta[lang].map((m, i) => <div key={i}>{m}</div>)}
                </div>
                <span className="status-pill mt-2 block" style={{ color: "#1500ff", width: "fit-content", marginLeft: "auto" }}>
                  {T.hero.active[lang]}
                </span>
              </div>
            </div>

            <div className="dot-sep mt-5 mb-4" />
            <div className="flex flex-wrap gap-1.5">
              {TAB_IDS.map((tabId, idx) => (
                <button key={tabId} onClick={() => setActiveTab(tabId)}
                  className={`tab-btn ${activeTab === tabId ? "active" : ""}`}>
                  {tabLabels[idx]}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── TAB CONTENT ──────────────────────── */}
        <div className="mx-auto w-full max-w-4xl flex-1">
          <AnimatePresence mode="wait">
            <motion.div key={activeTab + lang}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25, ease: "easeOut" }}>
              {activeTab === "ABOUT" && <AboutTab />}
              {activeTab === "EXPERIENCE" && <ExperienceTab />}
              {activeTab === "PROJECTS" && <ProjectsTab />}
              {activeTab === "EDUCATION" && <EducationTab />}
              {activeTab === "INTERESTS" && <InterestsTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)", background: "rgba(10,10,10,0.96)", backdropFilter: "blur(16px)" }}>
        <div className="flex items-center justify-between px-10 py-3">
          <button onClick={() => setShowMessage(true)}
            className="flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-white/65 hover:text-white/90 transition-colors group">
            <MessageSquare className="w-3 h-3 group-hover:text-blue-400 transition-colors" />
            <span>{T.bottomBar.leave[lang]}</span>
          </button>

          <div className="flex items-center gap-5">
            {/* Lang toggle */}
            <div className="flex items-center gap-px font-mono text-[10px] tracking-[0.14em] uppercase">
              <button
                onClick={() => setLang("cn")}
                className={`px-2 py-0.5 transition-colors ${lang === "cn" ? "text-[#1500ff] border border-[#1500ff]/60" : "text-white/30 hover:text-white/60"}`}>
                CN
              </button>
              <span className="text-white/15 px-0.5">/</span>
              <button
                onClick={() => setLang("en")}
                className={`px-2 py-0.5 transition-colors ${lang === "en" ? "text-[#1500ff] border border-[#1500ff]/60" : "text-white/30 hover:text-white/60"}`}>
                EN
              </button>
            </div>

            <div className="flex items-center gap-1.5 font-mono text-xs text-white/35">
              <Eye className="w-3.5 h-3.5 text-blue-500" />
              <motion.span key={visitorCount} className="tabular-nums font-medium text-blue-400"
                initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
                {visitorCount}
              </motion.span>
            </div>
            <button onClick={handleLike} disabled={hasLiked}
              className={`flex items-center gap-1.5 font-mono text-xs transition-all ${hasLiked ? "text-pink-400 cursor-default" : "text-white/35 hover:text-pink-400"}`}>
              <Heart className={`w-3.5 h-3.5 ${hasLiked ? "fill-pink-500" : ""}`} />
              <span className="tabular-nums font-medium">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showMessage && <MessageModal onClose={() => setShowMessage(false)} />}
      </AnimatePresence>
    </LangContext.Provider>
  );
}

/* ─── ABOUT ───────────────────────────────────── */
function AboutTab() {
  const { lang } = useLang();
  const a = T.about;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div className="ticket-card p-6 hover-lift anim-fade-up"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
          <div className="flex justify-between items-center mb-1">
            <span className="section-label mb-0">{a.sectionId[lang]}</span>
            <span className="font-mono text-[10px] text-black/28">{a.access[lang]}</span>
          </div>
          <div className="dot-sep mb-5" />
          <ul className="space-y-0">
            {[
              { label: a.rows.name[lang], value: `${maskName("牧雪")} Mercy`, cls: "text-black/75" },
              { label: a.rows.born[lang], value: "1994.01", cls: "text-black/75 font-mono" },
              { label: a.rows.languages[lang], value: "普通话 / English", cls: "text-black/75" },
              { label: a.rows.phone[lang], value: maskPhone("15091195991"), cls: "font-mono", style: { color: "#1500ff" } },
              { label: a.rows.email[lang], value: maskEmail("mercymu@163.com"), cls: "font-mono text-black/65" },
            ].map((row) => (
              <li key={row.label} className="flex justify-between items-center py-2 border-b border-black/06">
                <span className="text-black/35 text-xs font-mono">{row.label}</span>
                <span className={`text-sm ${row.cls}`} style={row.style}>{row.value}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="ticket-card p-6 hover-lift"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}>
          <div className="flex justify-between items-center mb-1">
            <span className="section-label mb-0">{a.coreDirective[lang]}</span>
          </div>
          <div className="dot-sep mb-5" />
          <p className="font-sans font-bold text-2xl text-black/80 mb-3 leading-tight"
            style={{ fontFamily: "'Space Grotesk',sans-serif", whiteSpace: "pre-line" }}>
            {a.headline[lang]}
          </p>
          <p className="text-black/60 text-sm leading-relaxed mb-5">
            {a.summary[lang]}
          </p>
          <div className="flex gap-2 flex-wrap">
            <span className="tag-chip-blue tag-chip">0 to 1 Builder</span>
            <span className="tag-chip">Agile</span>
            <span className="tag-chip">AI Native</span>
          </div>
        </motion.div>
      </div>

      <motion.div className="ticket-card p-6"
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <span className="section-label">{a.caps[lang]}</span>
        <div className="dot-sep mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {a.capabilities.map((item, i) => (
            <div key={item.num} className={`ticket-card-inner p-5 anim-fade-up anim-delay-${i + 1}`}>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="font-mono text-[10px] font-bold text-black/25">{item.num}</span>
                <h3 className="font-sans font-bold text-sm text-black/75"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{item.title[lang]}</h3>
              </div>
              <p className="text-black/58 text-sm leading-relaxed">{item.desc[lang]}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

/* ─── EXPERIENCE ──────────────────────────────── */
function ExperienceTab() {
  const { lang } = useLang();
  const exps = T.experience.entries;

  return (
    <div className="space-y-4">
      {exps.map((exp, i) => (
        <motion.div key={i} className="ticket-card hover-lift"
          initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35, delay: i * 0.1 }}>
          <div className="px-6 pt-5 pb-2">
            <div className="flex justify-between items-start flex-wrap gap-3 mb-1">
              <div className="flex items-center gap-4">
                <span className="font-mono font-bold text-lg text-black/20">{exp.num}</span>
                <h3 className="font-sans font-bold text-xl text-black/80"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{exp.company}</h3>
              </div>
              <span className="status-pill text-[10px]" style={{ color: exp.statusColor }}>{exp.status}</span>
            </div>
            <p className="font-mono text-[9px] text-black/52 uppercase tracking-wide mb-4 flex items-center gap-2">
              <span>{exp.role[lang]}</span>
              <span className="text-black/25">//</span>
              <span className="text-black/32 tracking-widest">{exp.period}</span>
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {exp.tags.map((tag, ti) => {
                const label = typeof tag === "string" ? tag : tag[lang];
                return (
                  <span key={ti} className={exp.tagBlue ? "tag-chip tag-chip-blue" : "tag-chip"}>{label}</span>
                );
              })}
            </div>
          </div>
          <div className="dot-sep px-6" />
          <div className="px-6 py-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            {exp.content.map((item, j) => (
              <div key={j} className="ticket-card-inner p-4">
                <div className="flex items-baseline gap-2 mb-1.5">
                  <span className="font-mono text-[9px] text-black/22 font-bold">{String(j + 1).padStart(2, "0")} //</span>
                  <h4 className="font-sans font-semibold text-sm text-black/70"
                    style={{ fontFamily: "'Space Grotesk',sans-serif" }}>{item.t[lang]}</h4>
                </div>
                <p className="text-black/58 text-sm leading-relaxed">{item.d[lang]}</p>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ─── PROJECTS ────────────────────────────────── */
function ProjectsTab() {
  const { lang } = useLang();
  const { p1, p2 } = T.projects;

  return (
    <div className="space-y-4">
      {/* Project 01 */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <div className="ticket-card perf-right">
          <div className="px-7 py-5" style={{ paddingRight: 44 }}>
            <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
              <div>
                <span className="section-label">{p1.label[lang]}</span>
                <h2 className="font-sans font-black text-3xl text-black/82 leading-none mb-1"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                  {p1.title[lang]}
                </h2>
                <p className="font-mono text-[9px] text-black/32 tracking-widest uppercase mt-1">
                  {p1.sub[lang]}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="tag-chip tag-chip-blue">阿维塔 (Avatr)</span>
                <span className="status-pill" style={{ color: "#1500ff" }}>CONFIRMED</span>
              </div>
            </div>

            <div className="dot-sep mb-6" />

            <div>
              <span className="section-label">{p1.descLabel[lang]}</span>
              <p className="text-black/62 leading-relaxed border-l-2 border-black/10 pl-4 mb-6">
                {p1.desc[lang]}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="ticket-card-inner p-5">
                <span className="section-label">{p1.respLabel[lang]}</span>
                <ul className="space-y-3">
                  {p1.resps.map((item, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="font-mono text-[9px] text-black/20 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                      <span className="text-black/50 text-sm">{item[lang]}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="ticket-card-inner p-5">
                <span className="section-label">{p1.resultsLabel[lang]}</span>
                {p1.results.map((r, i) => (
                  <div key={i} className="mb-4">
                    <div className="font-mono text-2xl text-black/10 mb-1 font-light">{String(i + 1).padStart(2, "0")}</div>
                    <p className="text-black/50 text-sm">{r[lang]}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-black/08 flex justify-between items-end">
              <div className="flex gap-px">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} className="bg-black/50"
                    style={{ width: i % 3 === 0 ? 2 : 1, height: i % 5 === 0 ? 20 : i % 2 === 0 ? 14 : 10 }} />
                ))}
              </div>
              <span className="font-mono text-[10px] text-black/25 tracking-widest">9102 2204 5566</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project 02 */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}>
        <div className="ticket-card">
          <div className="px-7 py-5">
            <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
              <div>
                <span className="section-label">{p2.label[lang]}</span>
                <h2 className="font-sans font-black text-3xl text-black/82 leading-none mb-1"
                  style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                  {p2.title[lang]}
                </h2>
                <p className="font-mono text-[9px] text-black/32 tracking-widest uppercase mt-1">
                  {p2.sub[lang]}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="tag-chip tag-chip-blue">阿维塔 (Avatr)</span>
                <span className="status-pill" style={{ color: "#1500ff" }}>CONFIRMED</span>
              </div>
            </div>

            <div className="dot-sep mb-6" />

            <div>
              <span className="section-label">{p2.descLabel[lang]}</span>
              <p className="text-black/62 leading-relaxed border-l-2 border-black/10 pl-4 mb-6">
                {p2.desc[lang]}
              </p>
            </div>

            <div className="ticket-card-inner p-5">
              <span className="section-label">{p2.respLabel[lang]}</span>
              <ul className="space-y-3">
                {p2.resps.map((item, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="font-mono text-[9px] text-black/20 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-black/50 text-sm">{item[lang]}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-4 border-t border-black/08 flex justify-between items-end">
              <div className="flex gap-px">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div key={i} className="bg-black/50"
                    style={{ width: i % 5 === 0 ? 2 : 1, height: i % 4 === 0 ? 20 : i % 2 === 0 ? 12 : 8 }} />
                ))}
              </div>
              <span className="font-mono text-[10px] text-black/25 tracking-widest">9102 2204 5567</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ─── EDUCATION ──────────────────────────────── */
function EducationTab() {
  const { lang } = useLang();
  const e = T.education;

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <div className="ticket-card">
        <div className="px-7 pt-6 pb-0">
          <div className="flex justify-between items-start mb-4 flex-wrap gap-4">
            <div>
              <span className="section-label">{e.label[lang]}</span>
              <h2 className="font-sans font-black text-3xl text-black/80 leading-tight"
                style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
                {e.school[lang]}
              </h2>
            </div>
            <div className="text-right font-mono text-[10px] text-black/28 tracking-wide leading-relaxed uppercase">
              <div>{e.college[lang]}</div>
              <div>{e.major[lang]}</div>
              <div className="mt-1 font-bold text-black/40">{e.period}</div>
            </div>
          </div>
          <div className="dot-sep mb-5" />
        </div>
        <div className="px-7 pb-7 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="ticket-card-inner p-5">
            <span className="section-label">{e.focusLabel[lang]}</span>
            <div className="flex flex-wrap gap-2">
              {e.focus.blue.map((s) => {
                const label = typeof s === "string" ? s : s[lang];
                return <span key={label} className="tag-chip tag-chip-blue">{label}</span>;
              })}
              {e.focus.normal.map((s) => {
                const label = typeof s === "string" ? s : s[lang];
                return <span key={label} className="tag-chip">{label}</span>;
              })}
            </div>
          </div>
          <div className="ticket-card-inner p-5">
            <span className="section-label">{e.campusLabel[lang]}</span>
            <ul className="space-y-3">
              {e.campus.map((item, i) => (
                <li key={i} className="flex gap-3">
                  <span className="font-mono text-[9px] text-black/20 mt-0.5 shrink-0">{String(i + 1).padStart(2, "0")} //</span>
                  <span className="text-black/62 text-sm">{item[lang]}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── INTERESTS ──────────────────────────────── */
function InterestsTab() {
  const { lang } = useLang();
  const n = T.interests;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {n.activities.map((act, i) => (
          <motion.div key={act.en}
            className="aspect-square ticket-card flex flex-col items-center justify-center p-4 group cursor-pointer select-none"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.06, boxShadow: "0 8px 32px rgba(21,0,255,0.13)" }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, delay: i * 0.06 }}>
            <div className="font-mono text-xl mb-2 text-black/18 font-light group-hover:text-[#1500ff] transition-colors duration-200">
              {act.num}
            </div>
            <div className="font-mono text-[10px] text-center text-black/60 tracking-[0.14em] uppercase group-hover:text-black/85 transition-colors duration-200">
              {lang === "cn" ? act.cn : act.en}
            </div>
            <div className="mt-2 w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[#1500ff] transition-all duration-200" />
          </motion.div>
        ))}
      </div>

      <motion.div className="ticket-card p-7"
        initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
        <div className="flex justify-between items-start mb-1">
          <span className="section-label mb-0">{n.profileLabel[lang]}</span>
          <span className="status-pill text-[10px]" style={{ color: "#1500ff" }}>ACTIVE</span>
        </div>
        <div className="dot-sep mb-5" />
        <h2 className="font-sans font-black text-2xl text-black/75 mb-5"
          style={{ fontFamily: "'Space Grotesk',sans-serif" }}>
          {n.headline[lang]}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <p className="text-black/60 text-sm leading-relaxed">
            <span className="text-black/68 font-semibold">{n.p1title[lang]}</span>
            {n.p1[lang]}
          </p>
          <p className="text-black/60 text-sm leading-relaxed">
            <span className="text-black/68 font-semibold">{n.p2title[lang]}</span>
            {n.p2[lang]}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
