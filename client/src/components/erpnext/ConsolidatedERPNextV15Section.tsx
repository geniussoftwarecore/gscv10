import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose 
} from "@/components/ui/sheet";
import { useLanguage } from "@/i18n/lang";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import {
  Zap,
  Shield,
  Globe,
  BarChart3,
  DollarSign,
  Users,
  Package,
  ShoppingCart,
  Factory,
  FileText,
  Building,
  Smartphone,
  Cloud,
  Server,
  Database,
  Award,
  Star,
  CheckCircle,
  ArrowRight,
  Settings,
  Target,
  TrendingUp,
  Layers,
  Workflow,
  MessageSquare,
  Clock,
  Bot,
  HeadphonesIcon,
  CreditCard,
  Calculator,
  ChevronDown,
  Phone,
  Mail,
  Crown,
  Check,
  Warehouse,
  Calendar,
  UserCog,
  FolderKanban,
  Monitor,
  Wrench,
  Eye,
  Filter,
  Search,
  X,
  ChevronRight,
  ExternalLink,
  Banknote,
  Heart,
  GraduationCap,
  Wheat,
  HandHeart
} from "lucide-react";

interface ERPModule {
  id: string;
  name: { en: string; ar: string };
  category: 'core' | 'industry';
  icon: any;
  color: string;
  overview: { en: string; ar: string };
  features: { en: string; ar: string };
}

interface PricingTier {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: React.ComponentType<any>;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlyDiscount: number;
  users: string;
  usersEn: string;
  popular?: boolean;
  enterprise?: boolean;
  features: string[];
  featuresEn: string[];
  technicalSpecs: string[];
  technicalSpecsEn: string[];
  includes: string[];
  includesEn: string[];
}

const erpModules: ERPModule[] = [
  // Core Modules
  {
    id: 'accounting',
    name: { en: 'Accounting', ar: 'المحاسبة' },
    category: 'core',
    icon: Calculator,
    color: 'bg-blue-500',
    overview: {
      en: 'Comprehensive finance core for invoicing, journals, taxes, banking, and multi-company/multi-currency reporting.',
      ar: 'نواة مالية شاملة لإدارة الفوترة، القيود، الضرائب، المصارف، والتقارير متعددة الشركات والعملات.'
    },
    features: {
      en: 'Chart of Accounts; Sales/Purchase Invoices & Notes; Cost Centers & Accounting Dimensions; Manual/Auto Journal Entries; Tax Templates & Bank Reconciliation; Aging & Financial Statements (P&L/Balance Sheet/Cash Flow).',
      ar: 'دليل حسابات متعدد الشركات والعملات؛ فواتير بيع/شراء، إشعارات مدينة/دائنة؛ مراكز تكلفة وأبعاد محاسبية وتحليلات؛ قيود يومية يدوية/تلقائية وسندات قيد؛ قوالب ضرائب وتسويات ومطابقات بنكية؛ أعمار الديون وتقارير مالية (دخل/ميزانية/تدفق نقدي).'
    }
  },
  {
    id: 'selling',
    name: { en: 'Selling', ar: 'المبيعات' },
    category: 'core',
    icon: ShoppingCart,
    color: 'bg-green-500',
    overview: {
      en: 'From quotations to sales orders with smart pricing/discounts and tight stock/billing integration.',
      ar: 'من العروض حتى أوامر البيع، تسعير ذكي وخصومات، وربط كامل بالمخزون والفوترة.'
    },
    features: {
      en: 'Quotations; Sales Orders; Price Lists; Pricing Rules; Taxes & Shipping; Stock availability checks.',
      ar: 'عروض أسعار؛ أوامر بيع؛ قوائم أسعار؛ قواعد خصم؛ ضرائب وشحن؛ فحص توافر المخزون.'
    }
  },
  {
    id: 'crm',
    name: { en: 'CRM', ar: 'إدارة علاقات العملاء' },
    category: 'core',
    icon: Users,
    color: 'bg-purple-500',
    overview: {
      en: 'Leads, Opportunities, pipeline stages; Email integration; Assignments & timeline; Performance reports.',
      ar: 'عملاء محتملون وفرص ومراحل مبيعات؛ بريد مدمج؛ مهام وسجل نشاط زمني؛ تقارير أداء.'
    },
    features: {
      en: 'Lead management; Opportunity tracking; Sales pipeline; Email integration; Activity timeline; Performance analytics.',
      ar: 'إدارة العملاء المحتملين؛ تتبع الفرص؛ خط أنابيب المبيعات؛ تكامل البريد الإلكتروني؛ الجدول الزمني للأنشطة؛ تحليلات الأداء.'
    }
  },
  {
    id: 'buying',
    name: { en: 'Buying', ar: 'المشتريات' },
    category: 'core',
    icon: Package,
    color: 'bg-orange-500',
    overview: {
      en: 'Suppliers; RFQs; Supplier Quotations; Comparisons; Purchase Orders; Receipts; Purchase Invoices.',
      ar: 'موردون؛ RFQs؛ عروض المورد؛ مقارنة؛ أوامر شراء؛ استلام؛ فواتير المورد.'
    },
    features: {
      en: 'Supplier management; Request for quotation; Supplier quotations; Price comparison; Purchase orders; Material receipts; Purchase invoicing.',
      ar: 'إدارة الموردين؛ طلب عروض أسعار؛ عروض أسعار الموردين؛ مقارنة الأسعار؛ أوامر الشراء؛ إيصالات المواد؛ فوترة المشتريات.'
    }
  },
  {
    id: 'stock',
    name: { en: 'Stock', ar: 'المخزون' },
    category: 'core',
    icon: Warehouse,
    color: 'bg-indigo-500',
    overview: {
      en: 'Multi-warehouse inventory tracking with serial/batch numbers; Stock movements and reorder levels.',
      ar: 'تتبع مخزون متعدد المستودعات مع أرقام التسلسل/الدفعة؛ حركات المخزون ومستويات الطلب المسبق.'
    },
    features: {
      en: 'Item master; Warehouses; Serial/Batch tracking; Stock movements; Reorder levels; Inventory reports.',
      ar: 'دليل الأصناف؛ المستودعات؛ تتبع التسلسل/الدفعة؛ حركات المخزون؛ مستويات الطلب المسبق؛ تقارير الجرد.'
    }
  },
  {
    id: 'projects',
    name: { en: 'Projects', ar: 'المشاريع' },
    category: 'core',
    icon: FolderKanban,
    color: 'bg-teal-500',
    overview: {
      en: 'Project management with tasks, timesheets, expenses, and profitability tracking.',
      ar: 'إدارة المشاريع مع المهام وجداول الأوقات والمصروفات وتتبع الربحية.'
    },
    features: {
      en: 'Project planning; Task management; Timesheet tracking; Expense tracking; Project profitability; Resource allocation.',
      ar: 'تخطيط المشاريع؛ إدارة المهام؛ تتبع الأوقات؛ تتبع المصروفات؛ ربحية المشاريع؛ تخصيص الموارد.'
    }
  },
  {
    id: 'hrms',
    name: { en: 'HR & Payroll', ar: 'الموارد البشرية والرواتب' },
    category: 'core',
    icon: UserCog,
    color: 'bg-pink-500',
    overview: {
      en: 'Employee lifecycle management from recruitment to payroll processing.',
      ar: 'إدارة دورة حياة الموظف من التوظيف إلى معالجة الرواتب.'
    },
    features: {
      en: 'Employee records; Attendance tracking; Leave management; Payroll processing; Performance management; Recruitment.',
      ar: 'سجلات الموظفين؛ تتبع الحضور؛ إدارة الإجازات؛ معالجة الرواتب؛ إدارة الأداء؛ التوظيف.'
    }
  },
  {
    id: 'support',
    name: { en: 'Support', ar: 'الدعم الفني' },
    category: 'core',
    icon: HeadphonesIcon,
    color: 'bg-cyan-500',
    overview: {
      en: 'Customer support ticketing system with SLA tracking and knowledge base.',
      ar: 'نظام تذاكر دعم العملاء مع تتبع اتفاقية مستوى الخدمة وقاعدة المعرفة.'
    },
    features: {
      en: 'Issue tracking; SLA management; Knowledge base; Customer portal; Performance metrics; Escalation rules.',
      ar: 'تتبع المشاكل؛ إدارة اتفاقية مستوى الخدمة؛ قاعدة المعرفة؛ بوابة العملاء؛ مقاييس الأداء؛ قواعد التصعيد.'
    }
  },
  {
    id: 'website',
    name: { en: 'Website', ar: 'الموقع الإلكتروني' },
    category: 'core',
    icon: Globe,
    color: 'bg-emerald-500',
    overview: {
      en: 'Content management system with blog, e-commerce, and portal features.',
      ar: 'نظام إدارة المحتوى مع المدونة والتجارة الإلكترونية وميزات البوابة.'
    },
    features: {
      en: 'Web pages; Blog; E-commerce; Customer portal; SEO tools; Analytics integration.',
      ar: 'صفحات الويب؛ المدونة؛ التجارة الإلكترونية؛ بوابة العملاء؛ أدوات تحسين محركات البحث؛ تكامل التحليلات.'
    }
  },
  // Industry Modules
  {
    id: 'manufacturing',
    name: { en: 'Manufacturing', ar: 'التصنيع' },
    category: 'industry',
    icon: Factory,
    color: 'bg-slate-500',
    overview: {
      en: 'Complete manufacturing suite with work orders, routing, and quality control.',
      ar: 'مجموعة تصنيع كاملة مع أوامر العمل والتوجيه ومراقبة الجودة.'
    },
    features: {
      en: 'Work orders; Bill of materials; Production planning; Work centers; Job cards; Quality inspection.',
      ar: 'أوامر العمل؛ قائمة المواد؛ تخطيط الإنتاج؛ مراكز العمل؛ بطاقات الوظائف؛ فحص الجودة.'
    }
  },
  {
    id: 'assets',
    name: { en: 'Assets', ar: 'الأصول' },
    category: 'industry',
    icon: Monitor,
    color: 'bg-amber-500',
    overview: {
      en: 'Fixed asset management with depreciation, maintenance, and tracking.',
      ar: 'إدارة الأصول الثابتة مع الاستهلاك والصيانة والتتبع.'
    },
    features: {
      en: 'Asset register; Depreciation; Maintenance schedules; Asset movements; Disposal; Valuation.',
      ar: 'سجل الأصول؛ الاستهلاك؛ جداول الصيانة؛ حركات الأصول؛ التخلص؛ التقييم.'
    }
  },
  {
    id: 'quality',
    name: { en: 'Quality', ar: 'الجودة' },
    category: 'industry',
    icon: Award,
    color: 'bg-violet-500',
    overview: {
      en: 'Quality management system with inspections, goals, and procedures.',
      ar: 'نظام إدارة الجودة مع الفحوصات والأهداف والإجراءات.'
    },
    features: {
      en: 'Quality procedures; Inspection templates; Goals and reviews; Non-conformance; Corrective actions.',
      ar: 'إجراءات الجودة؛ قوالب الفحص؛ الأهداف والمراجعات؛ عدم المطابقة؛ الإجراءات التصحيحية.'
    }
  },
  {
    id: 'maintenance',
    name: { en: 'Maintenance', ar: 'الصيانة' },
    category: 'industry',
    icon: Wrench,
    color: 'bg-red-500',
    overview: {
      en: 'Preventive and corrective maintenance scheduling with asset tracking.',
      ar: 'جدولة الصيانة الوقائية والتصحيحية مع تتبع الأصول.'
    },
    features: {
      en: 'Maintenance schedules; Work orders; Asset downtime; Spare parts; Maintenance costs; Performance metrics.',
      ar: 'جداول الصيانة؛ أوامر العمل؛ توقف الأصول؛ قطع الغيار؛ تكاليف الصيانة؛ مقاييس الأداء.'
    }
  },
  {
    id: 'agriculture',
    name: { en: 'Agriculture', ar: 'الزراعة' },
    category: 'industry',
    icon: Wheat,
    color: 'bg-lime-500',
    overview: {
      en: 'Agricultural management for crops, livestock, and land records.',
      ar: 'الإدارة الزراعية للمحاصيل والثروة الحيوانية وسجلات الأراضي.'
    },
    features: {
      en: 'Crop cycles; Land records; Weather tracking; Disease management; Harvest planning; Agricultural analytics.',
      ar: 'دورات المحاصيل؛ سجلات الأراضي؛ تتبع الطقس؛ إدارة الأمراض؛ تخطيط الحصاد؛ التحليلات الزراعية.'
    }
  },
  {
    id: 'healthcare',
    name: { en: 'Healthcare', ar: 'الرعاية الصحية' },
    category: 'industry',
    icon: Heart,
    color: 'bg-rose-500',
    overview: {
      en: 'Healthcare management with patient records, appointments, and billing.',
      ar: 'إدارة الرعاية الصحية مع سجلات المرضى والمواعيد والفوترة.'
    },
    features: {
      en: 'Patient records; Appointment scheduling; Medical history; Prescription management; Healthcare billing; Reports.',
      ar: 'سجلات المرضى؛ جدولة المواعيد؛ التاريخ الطبي؛ إدارة الوصفات الطبية؛ فوترة الرعاية الصحية؛ التقارير.'
    }
  },
  {
    id: 'education',
    name: { en: 'Education', ar: 'التعليم' },
    category: 'industry',
    icon: GraduationCap,
    color: 'bg-sky-500',
    overview: {
      en: 'Educational institution management with student records and academics.',
      ar: 'إدارة المؤسسات التعليمية مع سجلات الطلاب والأكاديميات.'
    },
    features: {
      en: 'Student admissions; Academic records; Course management; Fee collection; Examinations; Reports.',
      ar: 'قبول الطلاب؛ السجلات الأكاديمية؛ إدارة المقررات؛ تحصيل الرسوم؛ الامتحانات؛ التقارير.'
    }
  },
  {
    id: 'non-profit',
    name: { en: 'Non Profit', ar: 'المنظمات غير الربحية' },
    category: 'industry',
    icon: HandHeart,
    color: 'bg-orange-400',
    overview: {
      en: 'Non-profit organization management with donor tracking and grants.',
      ar: 'إدارة المنظمات غير الربحية مع تتبع المتبرعين والمنح.'
    },
    features: {
      en: 'Donor management; Grant tracking; Volunteer management; Program management; Impact measurement; Fundraising.',
      ar: 'إدارة المتبرعين؛ تتبع المنح؛ إدارة المتطوعين؛ إدارة البرامج؛ قياس التأثير؛ جمع التبرعات.'
    }
  }
];

const pricingTiers: PricingTier[] = [
  {
    id: "essential",
    name: "باقة الأعمال الصغيرة",
    nameEn: "Small Business Package",
    description: "مثالية للشركات الناشئة والأعمال الصغيرة",
    descriptionEn: "Perfect for startups and small businesses",
    icon: Users,
    monthlyPrice: 2500,
    yearlyPrice: 24000,
    yearlyDiscount: 20,
    users: "حتى 10 مستخدمين",
    usersEn: "Up to 10 users",
    features: [
      "إدارة المحاسبة الأساسية",
      "إدارة العملاء والموردين", 
      "إدارة المخزون الأساسية",
      "تقارير مالية شهرية",
      "إدارة المبيعات والمشتريات",
      "دعم فني أساسي"
    ],
    featuresEn: [
      "Basic Accounting Management",
      "Customer & Supplier Management",
      "Basic Inventory Management", 
      "Monthly Financial Reports",
      "Sales & Purchase Management",
      "Basic Technical Support"
    ],
    technicalSpecs: [
      "2 vCPU، 4-8 جيجا RAM",
      "40+ جيجا SSD",
      "ويب + تطبيق جوال أساسي",
      "SSL أساسي + نسخ احتياطية يومية"
    ],
    technicalSpecsEn: [
      "2 vCPU, 4-8 GB RAM",
      "40+ GB SSD", 
      "Web + Basic Mobile App",
      "Basic SSL + Daily Backups"
    ],
    includes: [
      "تنفيذ وإعداد النظام",
      "تدريب أساسي للفريق",
      "دعم فني لمدة 3 أشهر"
    ],
    includesEn: [
      "System Implementation & Setup",
      "Basic Team Training",
      "3 Months Technical Support"
    ]
  },
  {
    id: "professional", 
    name: "باقة الأعمال المتوسطة",
    nameEn: "Growing Business Package",
    description: "مناسبة للشركات المتوسطة النمو",
    descriptionEn: "Suitable for medium-sized growing companies",
    icon: Building,
    monthlyPrice: 6500,
    yearlyPrice: 62400,
    yearlyDiscount: 20,
    users: "11-50 مستخدم",
    usersEn: "11-50 users",
    popular: true,
    features: [
      "جميع مميزات الباقة الأساسية",
      "إدارة الموارد البشرية",
      "إدارة المشاريع وتتبع المهام",
      "تقارير متقدمة وتحليلات ذكية",
      "إدارة الجودة والمطابقة",
      "نظام نقاط البيع (POS)",
      "التكامل مع البنوك",
      "أتمتة سير العمل",
      "دعم فني محسن (24/5)"
    ],
    featuresEn: [
      "All Basic Package Features",
      "Human Resource Management",
      "Project Management & Task Tracking",
      "Advanced Reports & Smart Analytics",
      "Quality Management & Compliance",
      "Point of Sale (POS) System",
      "Banking Integration",
      "Workflow Automation",
      "Enhanced Technical Support (24/5)"
    ],
    technicalSpecs: [
      "4 vCPU، 8-16 جيجا RAM",
      "80+ جيجا SSD + تخزين إضافي",
      "ويب + تطبيق جوال متقدم",
      "SSL محسن + نسخ احتياطية كل 6 ساعات",
      "مراقبة النظام 24/7"
    ],
    technicalSpecsEn: [
      "4 vCPU, 8-16 GB RAM",
      "80+ GB SSD + Additional Storage",
      "Web + Advanced Mobile App", 
      "Enhanced SSL + 6-hour Backups",
      "24/7 System Monitoring"
    ],
    includes: [
      "تنفيذ وإعداد متقدم",
      "تدريب شامل للفريق",
      "دعم فني لمدة 6 أشهر",
      "تخصيص النظام حسب الحاجة"
    ],
    includesEn: [
      "Advanced Implementation & Setup",
      "Comprehensive Team Training",
      "6 Months Technical Support",
      "System Customization as Needed"
    ]
  },
  {
    id: "enterprise",
    name: "باقة الشركات الكبيرة",
    nameEn: "Enterprise Package",
    description: "للمؤسسات الكبيرة والشركات متعددة الفروع",
    descriptionEn: "For large corporations and multi-branch companies",
    icon: Crown,
    monthlyPrice: 15000,
    yearlyPrice: 144000,
    yearlyDiscount: 20,
    users: "مستخدمون غير محدودون",
    usersEn: "Unlimited users",
    enterprise: true,
    features: [
      "جميع مميزات الباقات السابقة",
      "إدارة متعددة الشركات والفروع",
      "أتمتة متقدمة وذكاء اصطناعي",
      "تحليلات تنبؤية ولوحات متقدمة",
      "التكامل مع الأنظمة الخارجية",
      "أمان متقدم ومراجعة الامتثال",
      "نسخ احتياطية جغرافية متعددة",
      "SLA مضمون 99.9%",
      "دعم فني مخصص 24/7",
      "مدير حساب مخصص"
    ],
    featuresEn: [
      "All Previous Package Features",
      "Multi-Company & Multi-Branch Management",
      "Advanced Automation & AI",
      "Predictive Analytics & Advanced Dashboards",
      "External Systems Integration",
      "Advanced Security & Compliance Auditing",
      "Multi-Geographic Backups",
      "Guaranteed 99.9% SLA",
      "Dedicated 24/7 Technical Support",
      "Dedicated Account Manager"
    ],
    technicalSpecs: [
      "8+ vCPU، 32+ جيجا RAM",
      "200+ جيجا SSD + تخزين سحابي",
      "ويب + تطبيق جوال مؤسسي",
      "SSL متقدم + نسخ احتياطية كل ساعة",
      "خوادم متخصصة + CDN",
      "مراقبة وتحليلات أداء متقدمة"
    ],
    technicalSpecsEn: [
      "8+ vCPU, 32+ GB RAM",
      "200+ GB SSD + Cloud Storage",
      "Web + Enterprise Mobile App",
      "Advanced SSL + Hourly Backups", 
      "Dedicated Servers + CDN",
      "Advanced Performance Monitoring & Analytics"
    ],
    includes: [
      "تنفيذ مؤسسي متكامل",
      "تدريب مكثف متخصص",
      "دعم فني مدى الحياة",
      "تطوير مخصص حسب الطلب",
      "استشارات إدارية"
    ],
    includesEn: [
      "Complete Enterprise Implementation",
      "Intensive Specialized Training",
      "Lifetime Technical Support",
      "Custom Development on Request",
      "Management Consulting"
    ]
  }
];

// Helper function to get module benefits
const getModuleBenefits = (moduleId: string, language: string): string[] => {
  const benefits: Record<string, { en: string[], ar: string[] }> = {
    accounting: {
      en: [
        "Automated financial reporting and compliance",
        "Real-time financial insights and analytics", 
        "Multi-currency and multi-company support",
        "Integrated tax management and VAT compliance",
        "Streamlined accounts payable and receivable"
      ],
      ar: [
        "تقارير مالية آلية ومطابقة للمعايير",
        "رؤى مالية وتحليلات فورية",
        "دعم العملات والشركات المتعددة", 
        "إدارة ضرائب متكاملة ومطابقة ضريبة القيمة المضافة",
        "تبسيط الحسابات المدينة والدائنة"
      ]
    },
    selling: {
      en: [
        "Increase sales efficiency and customer satisfaction",
        "Automated pricing and discount management",
        "Real-time inventory availability checking",
        "Streamlined order processing workflow",
        "Comprehensive sales analytics and reporting"
      ],
      ar: [
        "زيادة كفاءة المبيعات ورضا العملاء",
        "إدارة آلية للتسعير والخصومات",
        "فحص توافر المخزون الفوري",
        "تبسيط سير عمل معالجة الطلبات",
        "تحليلات وتقارير مبيعات شاملة"
      ]
    },
    crm: {
      en: [
        "Improve customer relationship management",
        "Track sales pipeline and conversion rates",
        "Automate lead nurturing and follow-ups",
        "Centralize customer communication history",
        "Increase sales team productivity"
      ],
      ar: [
        "تحسين إدارة علاقات العملاء",
        "تتبع خط أنابيب المبيعات ومعدلات التحويل",
        "أتمتة رعاية العملاء المحتملين والمتابعة",
        "مركزية تاريخ التواصل مع العملاء",
        "زيادة إنتاجية فريق المبيعات"
      ]
    },
    buying: {
      en: [
        "Optimize procurement processes and costs",
        "Automated supplier evaluation and selection",
        "Streamlined purchase order management",
        "Better vendor relationship management",
        "Improved inventory planning and control"
      ],
      ar: [
        "تحسين عمليات الشراء والتكاليف",
        "تقييم واختيار المورد الآلي",
        "إدارة أوامر الشراء المبسطة",
        "إدارة أفضل لعلاقات الموردين",
        "تحسين تخطيط ومراقبة المخزون"
      ]
    },
    stock: {
      en: [
        "Real-time inventory tracking and control",
        "Minimize stockouts and overstock situations",
        "Automated reorder point management",
        "Comprehensive inventory analytics",
        "Multi-warehouse management capabilities"
      ],
      ar: [
        "تتبع ومراقبة المخزون الفوري",
        "تقليل نفاد المخزون وحالات التخزين الزائد",
        "إدارة نقاط إعادة الطلب الآلية",
        "تحليلات مخزون شاملة",
        "قدرات إدارة مستودعات متعددة"
      ]
    },
    projects: {
      en: [
        "Improved project delivery and profitability",
        "Better resource allocation and planning",
        "Real-time project tracking and monitoring",
        "Enhanced team collaboration and communication",
        "Accurate project cost and time estimation"
      ],
      ar: [
        "تحسين تسليم المشاريع والربحية",
        "تخصيص وتخطيط أفضل للموارد",
        "تتبع ومراقبة المشاريع الفورية",
        "تحسين التعاون والتواصل بين الفرق",
        "تقدير دقيق لتكلفة ووقت المشروع"
      ]
    },
    hrms: {
      en: [
        "Streamlined HR processes and compliance",
        "Automated payroll processing and accuracy",
        "Improved employee engagement and retention",
        "Comprehensive performance management",
        "Reduced administrative overhead"
      ],
      ar: [
        "تبسيط عمليات الموارد البشرية والامتثال",
        "معالجة الرواتب الآلية والدقة",
        "تحسين مشاركة الموظفين والاحتفاظ بهم",
        "إدارة أداء شاملة",
        "تقليل النفقات الإدارية"
      ]
    },
    support: {
      en: [
        "Improved customer satisfaction and response times",
        "Automated ticket routing and escalation",
        "Comprehensive support analytics and insights",
        "Knowledge base for self-service support",
        "SLA compliance and performance tracking"
      ],
      ar: [
        "تحسين رضا العملاء وأوقات الاستجابة",
        "توجيه وتصعيد التذاكر الآلي",
        "تحليلات ورؤى دعم شاملة",
        "قاعدة معرفة للدعم الذاتي",
        "امتثال اتفاقية مستوى الخدمة وتتبع الأداء"
      ]
    },
    website: {
      en: [
        "Professional online presence and branding",
        "Integrated e-commerce capabilities",
        "SEO optimization for better visibility",
        "Mobile-responsive design",
        "Content management system integration"
      ],
      ar: [
        "وجود مهني عبر الإنترنت والعلامة التجارية",
        "قدرات التجارة الإلكترونية المتكاملة",
        "تحسين محركات البحث لرؤية أفضل",
        "تصميم متجاوب مع الأجهزة المحمولة",
        "تكامل نظام إدارة المحتوى"
      ]
    },
    // Industry Modules
    manufacturing: {
      en: [
        "Streamlined production processes and efficiency",
        "Real-time work order tracking and management",
        "Quality control and compliance assurance",
        "Optimized resource allocation and planning",
        "Reduced waste and improved cost control"
      ],
      ar: [
        "تبسيط عمليات الإنتاج والكفاءة",
        "تتبع وإدارة أوامر العمل الفورية",
        "ضمان مراقبة الجودة والامتثال",
        "تحسين تخصيص الموارد والتخطيط",
        "تقليل الهدر وتحسين مراقبة التكاليف"
      ]
    },
    assets: {
      en: [
        "Comprehensive asset lifecycle management",
        "Automated depreciation calculations",
        "Preventive maintenance scheduling",
        "Accurate asset valuation and reporting",
        "Reduced downtime and maintenance costs"
      ],
      ar: [
        "إدارة شاملة لدورة حياة الأصول",
        "حسابات الاستهلاك الآلية",
        "جدولة الصيانة الوقائية",
        "تقييم وتقارير دقيقة للأصول",
        "تقليل أوقات التوقف وتكاليف الصيانة"
      ]
    },
    quality: {
      en: [
        "Enhanced product quality and standards",
        "Systematic quality control processes",
        "Compliance with industry regulations",
        "Reduced defects and customer complaints",
        "Improved customer satisfaction and trust"
      ],
      ar: [
        "تحسين جودة المنتج والمعايير",
        "عمليات مراقبة الجودة المنهجية",
        "الامتثال للوائح الصناعة",
        "تقليل العيوب وشكاوى العملاء",
        "تحسين رضا العملاء والثقة"
      ]
    },
    maintenance: {
      en: [
        "Proactive maintenance planning and execution",
        "Reduced equipment downtime and failures",
        "Optimized maintenance costs and resources",
        "Extended asset lifespan and reliability",
        "Improved operational efficiency"
      ],
      ar: [
        "تخطيط وتنفيذ الصيانة الاستباقية",
        "تقليل أوقات توقف المعدات والأعطال",
        "تحسين تكاليف وموارد الصيانة",
        "إطالة عمر الأصول والموثوقية",
        "تحسين الكفاءة التشغيلية"
      ]
    },
    agriculture: {
      en: [
        "Optimized crop yields and farming efficiency",
        "Data-driven agricultural decision making",
        "Sustainable farming practices",
        "Reduced resource waste and costs",
        "Improved traceability and compliance"
      ],
      ar: [
        "تحسين غلة المحاصيل وكفاءة الزراعة",
        "اتخاذ قرارات زراعية قائمة على البيانات",
        "ممارسات زراعية مستدامة",
        "تقليل هدر الموارد والتكاليف",
        "تحسين التتبع والامتثال"
      ]
    },
    healthcare: {
      en: [
        "Improved patient care and safety",
        "Streamlined healthcare operations",
        "Enhanced medical record management",
        "Better regulatory compliance",
        "Reduced administrative burden"
      ],
      ar: [
        "تحسين رعاية المرضى والسلامة",
        "تبسيط العمليات الصحية",
        "تحسين إدارة السجلات الطبية",
        "امتثال تنظيمي أفضل",
        "تقليل العبء الإداري"
      ]
    },
    education: {
      en: [
        "Enhanced educational administration",
        "Improved student tracking and performance",
        "Streamlined academic processes",
        "Better parent-teacher communication",
        "Comprehensive reporting and analytics"
      ],
      ar: [
        "تحسين الإدارة التعليمية",
        "تحسين تتبع الطلاب والأداء",
        "تبسيط العمليات الأكاديمية",
        "تحسين التواصل بين الوالدين والمعلمين",
        "تقارير وتحليلات شاملة"
      ]
    },
    "non-profit": {
      en: [
        "Transparent financial management",
        "Enhanced donor relationship management",
        "Improved program tracking and impact",
        "Compliance with non-profit regulations",
        "Better resource allocation and efficiency"
      ],
      ar: [
        "إدارة مالية شفافة",
        "تحسين إدارة علاقات المانحين",
        "تحسين تتبع البرامج والأثر",
        "الامتثال للوائح المنظمات غير الربحية",
        "تحسين تخصيص الموارد والكفاءة"
      ]
    }
  };

  return benefits[moduleId]?.[language] || [];
};

// Helper function to get module use cases
const getModuleUseCases = (moduleId: string, language: string): string[] => {
  const useCases: Record<string, { en: string[], ar: string[] }> = {
    accounting: {
      en: [
        "Multi-company financial consolidation",
        "VAT and tax compliance reporting",
        "Budget planning and variance analysis",
        "Fixed asset depreciation management",
        "Cost center profitability analysis"
      ],
      ar: [
        "توحيد مالي متعدد الشركات",
        "تقارير امتثال ضريبة القيمة المضافة والضرائب",
        "تخطيط الميزانية وتحليل التباين",
        "إدارة استهلاك الأصول الثابتة",
        "تحليل ربحية مركز التكلفة"
      ]
    },
    selling: {
      en: [
        "B2B and B2C sales management",
        "Subscription and recurring billing",
        "Territory and commission management",
        "Product bundle and package deals",
        "Customer loyalty program management"
      ],
      ar: [
        "إدارة مبيعات B2B و B2C",
        "الاشتراك والفوترة المتكررة",
        "إدارة المنطقة والعمولة",
        "حزم المنتجات والصفقات",
        "إدارة برنامج ولاء العملاء"
      ]
    },
    crm: {
      en: [
        "Lead qualification and scoring",
        "Sales funnel optimization",
        "Customer segmentation and targeting",
        "Marketing campaign management",
        "Customer support integration"
      ],
      ar: [
        "تأهيل وتسجيل العملاء المحتملين",
        "تحسين قمع المبيعات",
        "تقسيم العملاء والاستهداف",
        "إدارة الحملات التسويقية",
        "تكامل دعم العملاء"
      ]
    },
    buying: {
      en: [
        "Vendor evaluation and approval",
        "Contract and blanket order management",
        "Drop shipping and direct delivery",
        "Quality inspection workflows",
        "Supplier performance analytics"
      ],
      ar: [
        "تقييم واعتماد المورد",
        "إدارة العقود والطلبات الشاملة",
        "الشحن المباشر والتسليم المباشر",
        "سير عمل فحص الجودة",
        "تحليلات أداء المورد"
      ]
    },
    stock: {
      en: [
        "Multi-location inventory management",
        "Serial and batch number tracking",
        "Quality inspection and control",
        "Landed cost calculation",
        "Inventory valuation methods"
      ],
      ar: [
        "إدارة مخزون متعدد المواقع",
        "تتبع الرقم التسلسلي ورقم الدفعة",
        "فحص ومراقبة الجودة",
        "حساب التكلفة المتقدمة",
        "طرق تقييم المخزون"
      ]
    },
    projects: {
      en: [
        "Construction project management",
        "Professional services billing",
        "Resource capacity planning",
        "Project profitability analysis",
        "Gantt chart and milestone tracking"
      ],
      ar: [
        "إدارة مشاريع البناء",
        "فوترة الخدمات المهنية",
        "تخطيط سعة الموارد",
        "تحليل ربحية المشروع",
        "مخطط جانت وتتبع المعالم"
      ]
    },
    hrms: {
      en: [
        "Employee lifecycle management",
        "Performance appraisal systems",
        "Recruitment and onboarding",
        "Training and skill development",
        "Compliance and regulatory reporting"
      ],
      ar: [
        "إدارة دورة حياة الموظف",
        "أنظمة تقييم الأداء",
        "التوظيف والإعداد",
        "التدريب وتطوير المهارات",
        "التقارير التنظيمية والامتثال"
      ]
    },
    support: {
      en: [
        "Customer helpdesk and ticketing",
        "Technical support workflows",
        "Service level agreement tracking",
        "Knowledge base management",
        "Customer satisfaction surveys"
      ],
      ar: [
        "مكتب المساعدة وإصدار التذاكر",
        "سير عمل الدعم الفني",
        "تتبع اتفاقية مستوى الخدمة",
        "إدارة قاعدة المعرفة",
        "استطلاعات رضا العملاء"
      ]
    },
    website: {
      en: [
        "Corporate website management",
        "E-commerce store integration",
        "Blog and content publishing",
        "Product catalog display",
        "Customer portal and self-service"
      ],
      ar: [
        "إدارة موقع الشركة",
        "تكامل متجر التجارة الإلكترونية",
        "نشر المدونة والمحتوى",
        "عرض كتالوج المنتجات",
        "بوابة العملاء والخدمة الذاتية"
      ]
    },
    // Industry Modules
    manufacturing: {
      en: [
        "Production planning and scheduling",
        "Work order management and tracking",
        "Bill of materials (BOM) management",
        "Shop floor control and monitoring",
        "Quality control and inspection workflows"
      ],
      ar: [
        "تخطيط وجدولة الإنتاج",
        "إدارة وتتبع أوامر العمل",
        "إدارة قوائم المواد (BOM)",
        "مراقبة ومتابعة أرضية المصنع",
        "سير عمل مراقبة الجودة والفحص"
      ]
    },
    assets: {
      en: [
        "Fixed asset register and tracking",
        "Depreciation calculation and reporting",
        "Asset maintenance scheduling",
        "Asset transfer and disposal management",
        "Insurance and warranty tracking"
      ],
      ar: [
        "سجل وتتبع الأصول الثابتة",
        "حساب وتقارير الاستهلاك",
        "جدولة صيانة الأصول",
        "إدارة نقل وتصفية الأصول",
        "تتبع التأمين والضمان"
      ]
    },
    quality: {
      en: [
        "Quality procedure documentation",
        "Inspection template creation",
        "Quality goal setting and monitoring",
        "Non-conformance reporting",
        "Corrective and preventive actions"
      ],
      ar: [
        "توثيق إجراءات الجودة",
        "إنشاء قوالب الفحص",
        "وضع ومراقبة أهداف الجودة",
        "تقارير عدم المطابقة",
        "الإجراءات التصحيحية والوقائية"
      ]
    },
    maintenance: {
      en: [
        "Preventive maintenance scheduling",
        "Equipment breakdown management",
        "Spare parts inventory control",
        "Maintenance cost tracking",
        "Equipment performance monitoring"
      ],
      ar: [
        "جدولة الصيانة الوقائية",
        "إدارة أعطال المعدات",
        "مراقبة مخزون قطع الغيار",
        "تتبع تكاليف الصيانة",
        "مراقبة أداء المعدات"
      ]
    },
    agriculture: {
      en: [
        "Crop planning and rotation management",
        "Land and field record keeping",
        "Weather and climate tracking",
        "Pest and disease management",
        "Harvest and yield monitoring"
      ],
      ar: [
        "تخطيط وإدارة دورة المحاصيل",
        "حفظ سجلات الأراضي والحقول",
        "تتبع الطقس والمناخ",
        "إدارة الآفات والأمراض",
        "مراقبة الحصاد والغلة"
      ]
    },
    healthcare: {
      en: [
        "Patient registration and records",
        "Appointment scheduling and management",
        "Medical history and treatment tracking",
        "Prescription and medication management",
        "Healthcare billing and insurance"
      ],
      ar: [
        "تسجيل وسجلات المرضى",
        "جدولة وإدارة المواعيد",
        "تتبع التاريخ الطبي والعلاج",
        "إدارة الوصفات والأدوية",
        "فوترة الرعاية الصحية والتأمين"
      ]
    },
    education: {
      en: [
        "Student admission and enrollment",
        "Academic record management",
        "Course and curriculum planning",
        "Fee collection and financial aid",
        "Examination and grading systems"
      ],
      ar: [
        "قبول وتسجيل الطلاب",
        "إدارة السجلات الأكاديمية",
        "تخطيط المقررات والمناهج",
        "تحصيل الرسوم والمساعدات المالية",
        "أنظمة الامتحانات والدرجات"
      ]
    },
    "non-profit": {
      en: [
        "Donor management and fundraising",
        "Grant tracking and compliance",
        "Volunteer coordination and management",
        "Program planning and impact measurement",
        "Financial transparency and reporting"
      ],
      ar: [
        "إدارة المانحين وجمع التبرعات",
        "تتبع المنح والامتثال",
        "تنسيق وإدارة المتطوعين",
        "تخطيط البرامج وقياس الأثر",
        "الشفافية المالية والتقارير"
      ]
    }
  };

  return useCases[moduleId]?.[language] || [];
};

// Helper function to get module technical specifications
const getModuleTechnicalSpecs = (moduleId: string, language: string): string[] => {
  const techSpecs: Record<string, { en: string[], ar: string[] }> = {
    accounting: {
      en: [
        "Multi-currency support with real-time exchange rates",
        "Advanced financial reporting with custom dimensions",
        "Automated bank reconciliation and payment matching",
        "Integration with payment gateways and banks",
        "Audit trail and compliance features"
      ],
      ar: [
        "دعم العملات المتعددة مع أسعار صرف فورية",
        "تقارير مالية متقدمة مع أبعاد مخصصة",
        "تسوية بنكية آلية ومطابقة دفعات",
        "تكامل مع بوابات الدفع والبنوك",
        "مسار التدقيق وميزات الامتثال"
      ]
    },
    selling: {
      en: [
        "Advanced pricing rules and discount structures",
        "Real-time inventory integration",
        "Multiple tax configurations",
        "Territory-based sales management",
        "Sales analytics and forecasting"
      ],
      ar: [
        "قواعد تسعير متقدمة وهياكل خصم",
        "تكامل مخزون فوري",
        "تكوينات ضريبية متعددة",
        "إدارة مبيعات على أساس المنطقة",
        "تحليلات المبيعات والتنبؤ"
      ]
    },
    crm: {
      en: [
        "Email integration with tracking",
        "Lead scoring and qualification workflows",
        "Communication timeline and activity logs",
        "Opportunity probability and pipeline analysis",
        "Customer interaction tracking"
      ],
      ar: [
        "تكامل البريد الإلكتروني مع التتبع",
        "تسجيل العملاء المحتملين وسير عمل التأهيل",
        "الجدول الزمني للتواصل وسجلات النشاط",
        "احتمالية الفرصة وتحليل خط الأنابيب",
        "تتبع تفاعل العملاء"
      ]
    },
    buying: {
      en: [
        "Supplier evaluation and rating system",
        "Purchase order automation and approvals",
        "Quality inspection workflows",
        "Landed cost calculation and allocation",
        "Supplier performance analytics"
      ],
      ar: [
        "نظام تقييم وتصنيف المورد",
        "أتمتة أوامر الشراء والموافقات",
        "سير عمل فحص الجودة",
        "حساب وتخصيص التكلفة المتقدمة",
        "تحليلات أداء المورد"
      ]
    },
    stock: {
      en: [
        "Multi-warehouse inventory tracking",
        "Serial and batch number management",
        "Automated reorder point calculations",
        "Inventory valuation methods (FIFO, LIFO, Moving Average)",
        "Real-time stock level monitoring"
      ],
      ar: [
        "تتبع مخزون مستودعات متعددة",
        "إدارة الرقم التسلسلي ورقم الدفعة",
        "حسابات نقطة إعادة الطلب الآلية",
        "طرق تقييم المخزون (FIFO، LIFO، المتوسط المتحرك)",
        "مراقبة مستوى المخزون الفوري"
      ]
    },
    projects: {
      en: [
        "Gantt chart project visualization",
        "Resource allocation and capacity planning",
        "Timesheet integration and billing",
        "Project costing and profitability analysis",
        "Milestone tracking and reporting"
      ],
      ar: [
        "تصور المشروع بمخطط جانت",
        "تخصيص الموارد وتخطيط السعة",
        "تكامل الجدول الزمني والفوترة",
        "تكلفة المشروع وتحليل الربحية",
        "تتبع المعالم والتقارير"
      ]
    },
    hrms: {
      en: [
        "Biometric attendance integration",
        "Automated payroll calculation and processing",
        "Performance appraisal workflows",
        "Leave management and approval system",
        "Employee self-service portal"
      ],
      ar: [
        "تكامل الحضور البيومتري",
        "حساب ومعالجة الرواتب الآلية",
        "سير عمل تقييم الأداء",
        "نظام إدارة الإجازات والموافقة",
        "بوابة الخدمة الذاتية للموظفين"
      ]
    },
    support: {
      en: [
        "Multi-channel support (email, chat, phone)",
        "SLA tracking and escalation rules",
        "Knowledge base integration",
        "Customer satisfaction surveys",
        "Support analytics and reporting"
      ],
      ar: [
        "دعم متعدد القنوات (البريد الإلكتروني، الدردشة، الهاتف)",
        "تتبع اتفاقية مستوى الخدمة وقواعد التصعيد",
        "تكامل قاعدة المعرفة",
        "استطلاعات رضا العملاء",
        "تحليلات وتقارير الدعم"
      ]
    },
    website: {
      en: [
        "Responsive web design framework",
        "SEO optimization tools",
        "Content management system",
        "E-commerce integration",
        "Social media integration"
      ],
      ar: [
        "إطار تصميم ويب متجاوب",
        "أدوات تحسين محركات البحث",
        "نظام إدارة المحتوى",
        "تكامل التجارة الإلكترونية",
        "تكامل وسائل التواصل الاجتماعي"
      ]
    },
    // Industry Modules
    manufacturing: {
      en: [
        "Work order routing and operations",
        "Bill of materials (BOM) versioning",
        "Production batch tracking",
        "Real-time shop floor monitoring",
        "Quality control checkpoints integration"
      ],
      ar: [
        "توجيه وعمليات أوامر العمل",
        "إصدارات قائمة المواد (BOM)",
        "تتبع دفعة الإنتاج",
        "مراقبة أرضية المصنع الفورية",
        "تكامل نقاط فحص مراقبة الجودة"
      ]
    },
    assets: {
      en: [
        "Asset category and subcategory management",
        "Multiple depreciation methods (SLM, WDV, etc.)",
        "Asset location and custodian tracking",
        "Maintenance scheduling and alerts",
        "Asset valuation and insurance tracking"
      ],
      ar: [
        "إدارة فئات وفئات فرعية للأصول",
        "طرق استهلاك متعددة (SLM، WDV، إلخ)",
        "تتبع موقع الأصول والمسؤول",
        "جدولة الصيانة والتنبيهات",
        "تتبع تقييم الأصول والتأمين"
      ]
    },
    quality: {
      en: [
        "Quality procedure templates and workflows",
        "Inspection criteria and sampling plans",
        "Quality goal tracking and KPIs",
        "Non-conformance root cause analysis",
        "CAPA (Corrective and Preventive Actions) management"
      ],
      ar: [
        "قوالب وسير عمل إجراءات الجودة",
        "معايير الفحص وخطط العينات",
        "تتبع أهداف الجودة ومؤشرات الأداء الرئيسية",
        "تحليل السبب الجذري لعدم المطابقة",
        "إدارة CAPA (الإجراءات التصحيحية والوقائية)"
      ]
    },
    maintenance: {
      en: [
        "Preventive maintenance calendars",
        "Equipment breakdown analysis",
        "Spare parts consumption tracking",
        "Maintenance team scheduling",
        "Equipment performance analytics"
      ],
      ar: [
        "تقاويم الصيانة الوقائية",
        "تحليل أعطال المعدات",
        "تتبع استهلاك قطع الغيار",
        "جدولة فريق الصيانة",
        "تحليلات أداء المعدات"
      ]
    },
    agriculture: {
      en: [
        "Crop cycle planning and monitoring",
        "Weather station integration",
        "Soil testing and analysis tracking",
        "Irrigation and fertilizer scheduling",
        "Harvest quality and yield analytics"
      ],
      ar: [
        "تخطيط ومراقبة دورة المحاصيل",
        "تكامل محطة الطقس",
        "تتبع اختبار وتحليل التربة",
        "جدولة الري والأسمدة",
        "تحليلات جودة وغلة الحصاد"
      ]
    },
    healthcare: {
      en: [
        "Electronic Health Records (EHR)",
        "Medical appointment scheduling system",
        "Prescription and medication tracking",
        "Healthcare billing and insurance claims",
        "Medical equipment and inventory management"
      ],
      ar: [
        "السجلات الصحية الإلكترونية (EHR)",
        "نظام جدولة المواعيد الطبية",
        "تتبع الوصفات والأدوية",
        "فوترة الرعاية الصحية ومطالبات التأمين",
        "إدارة المعدات الطبية والمخزون"
      ]
    },
    education: {
      en: [
        "Student information system (SIS)",
        "Academic calendar and scheduling",
        "Grade book and transcript management",
        "Online learning management system",
        "Fee management and financial aid tracking"
      ],
      ar: [
        "نظام معلومات الطلاب (SIS)",
        "التقويم الأكاديمي والجدولة",
        "إدارة كتاب الدرجات والنسخ",
        "نظام إدارة التعلم عبر الإنترنت",
        "إدارة الرسوم وتتبع المساعدات المالية"
      ]
    },
    "non-profit": {
      en: [
        "Donor management and fundraising campaigns",
        "Grant management and compliance tracking",
        "Volunteer registration and coordination",
        "Program impact measurement and reporting",
        "Financial transparency and audit trails"
      ],
      ar: [
        "إدارة المانحين وحملات جمع التبرعات",
        "إدارة المنح وتتبع الامتثال",
        "تسجيل وتنسيق المتطوعين",
        "قياس وتقارير أثر البرامج",
        "الشفافية المالية ومسارات التدقيق"
      ]
    }
  };

  return techSpecs[moduleId]?.[language] || [];
};

export default function ConsolidatedERPNextV15Section() {
  const { dir, lang } = useLanguage();
  const { toast } = useToast();
  const leadFormRef = useRef<HTMLDivElement>(null);
  
  // State management
  const [selectedModuleCategory, setSelectedModuleCategory] = useState<'all' | 'core' | 'industry'>('all');
  const [selectedModule, setSelectedModule] = useState<ERPModule | null>(null);
  const [isModuleSheetOpen, setIsModuleSheetOpen] = useState(false);
  const [isYearlyBilling, setIsYearlyBilling] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [leadFormData, setLeadFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    industry: "",
    deploymentOption: "",
    users: "",
    message: ""
  });

  // Filter modules based on category
  const filteredModules = erpModules.filter(module => 
    selectedModuleCategory === 'all' || module.category === selectedModuleCategory
  );

  const handleModuleClick = (module: ERPModule) => {
    setSelectedModule(module);
    setIsModuleSheetOpen(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: lang === 'ar' ? "تم إرسال طلبك بنجاح!" : "Request submitted successfully!",
      description: lang === 'ar' 
        ? "سيتواصل معك فريقنا خلال 24 ساعة"
        : "Our team will contact you within 24 hours",
    });

    // Reset form
    setLeadFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      industry: "",
      deploymentOption: "",
      users: "",
      message: ""
    });
  };

  const scrollToLeadForm = () => {
    leadFormRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800" dir={dir}>
      
      {/* Hero Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-grid-gray-100/30 bg-[size:32px_32px] opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/3 to-blue-600/5" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-5xl mx-auto">
            
            {/* Version Badge */}
            <motion.div
              className="inline-flex items-center gap-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge className="bg-primary/10 text-primary border-primary/20 px-6 py-2 text-lg">
                <Star className="w-5 h-5 mr-2" />
                ERPNext v15
              </Badge>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-4 py-2">
                {lang === 'ar' ? 'الإصدار الأحدث' : 'Latest Version'}
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {lang === 'ar' 
                ? 'نظام ERPNext v15 المتكامل'
                : 'Complete ERPNext v15 System'
              }
            </motion.h1>
            
            {/* Subtitle */}
            <motion.p
              className="text-2xl md:text-3xl text-primary font-medium leading-relaxed mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {lang === 'ar' 
                ? 'حلول متكاملة لإدارة موارد المؤسسات'
                : 'Integrated Enterprise Resource Planning Solutions'
              }
            </motion.p>
            
            {/* Description */}
            <motion.p
              className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {lang === 'ar'
                ? 'أحدث إصدار من ERPNext مع تحسينات جذرية، أداء محسّن بنسبة 40%، أمان عالي المستوى، وباقات شاملة تناسب جميع أحجام الأعمال من الشركات الناشئة إلى المؤسسات الكبيرة.'
                : 'Latest ERPNext version with revolutionary improvements, 40% performance boost, enterprise-grade security, and comprehensive packages suitable for all business sizes, from startups to large enterprises.'
              }
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
                onClick={scrollToLeadForm}
                data-testid="button-get-quote"
              >
                {lang === 'ar' ? 'احصل على عرض سعر' : 'Get Quote'}
                <ArrowRight className={cn(
                  "w-5 h-5",
                  dir === 'rtl' ? "mr-2 rotate-180" : "ml-2"
                )} />
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                className="px-8 py-4 text-lg"
                onClick={() => document.getElementById('modules-section')?.scrollIntoView({ behavior: 'smooth' })}
                data-testid="button-explore-modules"
              >
                {lang === 'ar' ? 'استكشف الوحدات' : 'Explore Modules'}
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600 dark:text-gray-400"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{lang === 'ar' ? 'ضمان 30 يوم' : '30-day Guarantee'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{lang === 'ar' ? 'تنفيذ مجاني' : 'Free Setup'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{lang === 'ar' ? 'دعم 24/7' : '24/7 Support'}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span>{lang === 'ar' ? 'مفتوح المصدر' : 'Open Source'}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {lang === 'ar' ? '✨ مميزات ERPNext v15 الجديدة' : '✨ New ERPNext v15 Features'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {lang === 'ar'
                ? 'تحسينات جذرية وميزات متطورة تجعل إدارة أعمالك أكثر سهولة وفعالية'
                : 'Revolutionary improvements and advanced features making your business management easier and more effective'
              }
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: TrendingUp,
                titleAr: "أداء محسّن بنسبة 40%",
                titleEn: "40% Performance Boost",
                descAr: "تسريع توليد التقارير المالية والعمليات الحسابية",
                descEn: "Faster financial report generation and calculations"
              },
              {
                icon: Shield,
                titleAr: "أمان عالي المستوى",
                titleEn: "Enterprise-Grade Security",
                descAr: "تشفير البيانات ونسخ احتياطية آمنة متقدمة",
                descEn: "Advanced data encryption and secure backups"
              },
              {
                icon: Globe,
                titleAr: "واجهة Espresso الجديدة",
                titleEn: "New Espresso UI",
                descAr: "تصميم أكثر وضوحاً وسرعة في التنقل",
                descEn: "Cleaner design with faster navigation"
              },
              {
                icon: BarChart3,
                titleAr: "تحليلات ذكية متقدمة",
                titleEn: "Advanced Smart Analytics",
                descAr: "إحصائيات وتقارير تفاعلية في الوقت الفعلي",
                descEn: "Interactive statistics and real-time reports"
              }
            ].map((feature, index) => {
              const IconComponent = feature.icon;
              
              return (
                <motion.div
                  key={index}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-primary to-blue-600 flex items-center justify-center">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {lang === 'ar' ? feature.titleAr : feature.titleEn}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    {lang === 'ar' ? feature.descAr : feature.descEn}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules-section" className="py-20 bg-gray-50 dark:bg-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {lang === 'ar' ? 'الوحدات والمكونات' : 'Modules & Components'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {lang === 'ar'
                ? 'مجموعة شاملة من الوحدات المتخصصة لإدارة جميع جوانب أعمالك'
                : 'Comprehensive suite of specialized modules to manage all aspects of your business'
              }
            </p>
          </motion.div>

          {/* Module Category Filters */}
          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            {[
              { id: 'all', labelAr: 'جميع الوحدات', labelEn: 'All Modules' },
              { id: 'core', labelAr: 'الوحدات الأساسية', labelEn: 'Core Modules' },
              { id: 'industry', labelAr: 'وحدات القطاعات', labelEn: 'Industry Modules' }
            ].map((category) => (
              <Button
                key={category.id}
                variant={selectedModuleCategory === category.id ? "default" : "outline"}
                className={cn(
                  "px-6 py-3",
                  selectedModuleCategory === category.id && "bg-primary text-white"
                )}
                onClick={() => setSelectedModuleCategory(category.id as any)}
                data-testid={`filter-${category.id}`}
              >
                {lang === 'ar' ? category.labelAr : category.labelEn}
              </Button>
            ))}
          </motion.div>

          {/* Modules Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedModuleCategory}
              className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              {filteredModules.map((module, index) => {
                const IconComponent = module.icon;
                
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                  >
                    <Card 
                      className="h-full hover:shadow-lg transition-all duration-300 cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary"
                      onClick={() => handleModuleClick(module)}
                      data-testid={`module-${module.id}`}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between mb-3">
                          <div className={cn("p-3 rounded-lg", module.color)}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {lang === 'ar' 
                              ? (module.category === 'core' ? 'أساسي' : 'قطاعي')
                              : module.category
                            }
                          </Badge>
                        </div>
                        <CardTitle className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                          {lang === 'ar' ? module.name.ar : module.name.en}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                          {lang === 'ar' ? module.overview.ar : module.overview.en}
                        </p>
                        <div className="flex items-center text-primary text-sm font-medium group-hover:text-primary/80">
                          <span>{lang === 'ar' ? 'اعرف المزيد' : 'Learn more'}</span>
                          <ChevronRight className={cn(
                            "w-4 h-4 transition-transform group-hover:translate-x-1",
                            dir === 'rtl' && "rotate-180 group-hover:-translate-x-1"
                          )} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Pricing Section */}
      <section data-section="pricing" className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {lang === 'ar' ? 'باقات التسعير' : 'Pricing Packages'}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
              {lang === 'ar'
                ? 'اختر الباقة المناسبة لحجم أعمالك وميزانيتك'
                : 'Choose the right package for your business size and budget'
              }
            </p>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4">
              <span className={cn(
                "text-sm",
                !isYearlyBilling ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"
              )}>
                {lang === 'ar' ? 'شهري' : 'Monthly'}
              </span>
              <Switch
                checked={isYearlyBilling}
                onCheckedChange={setIsYearlyBilling}
                data-testid="billing-toggle"
              />
              <span className={cn(
                "text-sm",
                isYearlyBilling ? "text-gray-900 dark:text-white font-medium" : "text-gray-500"
              )}>
                {lang === 'ar' ? 'سنوي' : 'Annual'}
              </span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {lang === 'ar' ? 'وفر 20%' : 'Save 20%'}
              </Badge>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {pricingTiers.map((tier, index) => {
              const IconComponent = tier.icon;
              const currentPrice = isYearlyBilling ? tier.yearlyPrice : tier.monthlyPrice;
              const billingPeriod = isYearlyBilling 
                ? (lang === 'ar' ? 'سنوياً' : 'annually') 
                : (lang === 'ar' ? 'شهرياً' : 'monthly');
              
              return (
                <motion.div
                  key={tier.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className={cn(
                    "relative",
                    tier.popular && "lg:-mt-4"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                      <Badge className="bg-primary text-white px-4 py-1">
                        {lang === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
                      </Badge>
                    </div>
                  )}
                  
                  <Card className={cn(
                    "h-full border-2 transition-all duration-300 hover:shadow-xl",
                    tier.popular ? "border-primary shadow-lg" : "border-gray-200 dark:border-gray-700 hover:border-primary/50",
                    tier.enterprise && "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                  )}>
                    <CardHeader className="text-center pb-4">
                      <div className="flex justify-center mb-4">
                        <div className={cn(
                          "p-4 rounded-2xl",
                          tier.enterprise ? "bg-yellow-500" : "bg-primary/10"
                        )}>
                          <IconComponent className={cn(
                            "w-8 h-8",
                            tier.enterprise ? "text-white" : "text-primary"
                          )} />
                        </div>
                      </div>
                      
                      <CardTitle className="text-2xl font-bold mb-2">
                        {lang === 'ar' ? tier.name : tier.nameEn}
                      </CardTitle>
                      
                      <p className={cn(
                        "text-sm mb-6",
                        tier.enterprise ? "text-gray-300" : "text-gray-600 dark:text-gray-300"
                      )}>
                        {lang === 'ar' ? tier.description : tier.descriptionEn}
                      </p>
                      
                      <div className="space-y-1">
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-4xl font-bold">
                            {currentPrice.toLocaleString()}
                          </span>
                          <span className="text-lg font-medium">
                            {lang === 'ar' ? 'ريال' : 'SAR'}
                          </span>
                        </div>
                        <p className={cn(
                          "text-sm",
                          tier.enterprise ? "text-gray-400" : "text-gray-500"
                        )}>
                          {billingPeriod}
                        </p>
                        {isYearlyBilling && (
                          <p className="text-xs text-green-600 dark:text-green-400">
                            {lang === 'ar' 
                              ? `وفر ${tier.yearlyDiscount}% مع الفوترة السنوية`
                              : `Save ${tier.yearlyDiscount}% with annual billing`
                            }
                          </p>
                        )}
                      </div>
                      
                      <Badge variant="secondary" className="mt-4">
                        {lang === 'ar' ? tier.users : tier.usersEn}
                      </Badge>
                    </CardHeader>
                    
                    <CardContent className="space-y-6">
                      {/* Features */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                          {lang === 'ar' ? 'المميزات' : 'Features'}
                        </h4>
                        <ul className="space-y-2">
                          {(lang === 'ar' ? tier.features : tier.featuresEn).map((feature, featureIndex) => (
                            <li key={featureIndex} className="flex items-start gap-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Technical Specs */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                          {lang === 'ar' ? 'المواصفات التقنية' : 'Technical Specs'}
                        </h4>
                        <ul className="space-y-2">
                          {(lang === 'ar' ? tier.technicalSpecs : tier.technicalSpecsEn).map((spec, specIndex) => (
                            <li key={specIndex} className="flex items-start gap-2 text-sm">
                              <Server className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Includes */}
                      <div>
                        <h4 className="font-semibold mb-3 text-sm uppercase tracking-wide">
                          {lang === 'ar' ? 'يشمل' : 'Includes'}
                        </h4>
                        <ul className="space-y-2">
                          {(lang === 'ar' ? tier.includes : tier.includesEn).map((include, includeIndex) => (
                            <li key={includeIndex} className="flex items-start gap-2 text-sm">
                              <Award className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                              <span>{include}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <Button 
                        className={cn(
                          "w-full py-3",
                          tier.popular 
                            ? "bg-primary hover:bg-primary/90 text-white" 
                            : tier.enterprise
                              ? "bg-yellow-500 hover:bg-yellow-600 text-black"
                              : "bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                        )}
                        onClick={() => {
                          setSelectedPackage(tier.id);
                          scrollToLeadForm();
                        }}
                        data-testid={`select-${tier.id}`}
                      >
                        {lang === 'ar' ? 'اختر هذه الباقة' : 'Choose This Package'}
                        <ArrowRight className={cn(
                          "w-5 h-5",
                          dir === 'rtl' ? "mr-2 rotate-180" : "ml-2"
                        )} />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Lead Form Section */}
      <section 
        id="erpnext-lead-form" 
        ref={leadFormRef}
        className="py-20 bg-gray-50 dark:bg-slate-800"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {lang === 'ar' ? 'احصل على عرض سعر مخصص' : 'Get Custom Quote'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                {lang === 'ar'
                  ? 'املأ النموذج أدناه وسيتواصل معك فريق خبراء ERPNext خلال 24 ساعة لمناقشة احتياجاتك وتقديم عرض سعر مخصص'
                  : 'Fill out the form below and our ERPNext experts will contact you within 24 hours to discuss your needs and provide a custom quote'
                }
              </p>
            </div>

            <Card className="border-2 border-primary/20 shadow-xl">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-blue-600/5">
                <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
                  <MessageSquare className="w-6 h-6 text-primary" />
                  {lang === 'ar' ? 'نموذج طلب العرض' : 'Quote Request Form'}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8">
                <form onSubmit={handleLeadSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        {lang === 'ar' ? 'الاسم *' : 'Full Name *'}
                      </Label>
                      <Input
                        id="name"
                        value={leadFormData.name}
                        onChange={(e) => setLeadFormData(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={lang === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                        required
                        data-testid="input-name"
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label htmlFor="company" className="text-sm font-medium">
                        {lang === 'ar' ? 'اسم الشركة *' : 'Company Name *'}
                      </Label>
                      <Input
                        id="company"
                        value={leadFormData.company}
                        onChange={(e) => setLeadFormData(prev => ({ ...prev, company: e.target.value }))}
                        placeholder={lang === 'ar' ? 'اسم شركتك' : 'Your company name'}
                        required
                        data-testid="input-company"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        {lang === 'ar' ? 'البريد الإلكتروني *' : 'Email Address *'}
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={leadFormData.email}
                        onChange={(e) => setLeadFormData(prev => ({ ...prev, email: e.target.value }))}
                        placeholder={lang === 'ar' ? 'email@company.com' : 'email@company.com'}
                        required
                        data-testid="input-email"
                      />
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        {lang === 'ar' ? 'رقم الهاتف *' : 'Phone Number *'}
                      </Label>
                      <Input
                        id="phone"
                        value={leadFormData.phone}
                        onChange={(e) => setLeadFormData(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder={lang === 'ar' ? '+967 735158003' : '+967 735158003'}
                        required
                        data-testid="input-phone"
                      />
                    </div>

                    {/* Industry */}
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-sm font-medium">
                        {lang === 'ar' ? 'القطاع' : 'Industry'}
                      </Label>
                      <Select value={leadFormData.industry} onValueChange={(value) => setLeadFormData(prev => ({ ...prev, industry: value }))}>
                        <SelectTrigger data-testid="select-industry">
                          <SelectValue placeholder={lang === 'ar' ? 'اختر القطاع' : 'Select industry'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="manufacturing">{lang === 'ar' ? 'التصنيع' : 'Manufacturing'}</SelectItem>
                          <SelectItem value="trading">{lang === 'ar' ? 'التجارة' : 'Trading'}</SelectItem>
                          <SelectItem value="services">{lang === 'ar' ? 'الخدمات' : 'Services'}</SelectItem>
                          <SelectItem value="retail">{lang === 'ar' ? 'التجزئة' : 'Retail'}</SelectItem>
                          <SelectItem value="healthcare">{lang === 'ar' ? 'الرعاية الصحية' : 'Healthcare'}</SelectItem>
                          <SelectItem value="education">{lang === 'ar' ? 'التعليم' : 'Education'}</SelectItem>
                          <SelectItem value="non-profit">{lang === 'ar' ? 'غير ربحي' : 'Non-profit'}</SelectItem>
                          <SelectItem value="other">{lang === 'ar' ? 'أخرى' : 'Other'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Users Count */}
                    <div className="space-y-2">
                      <Label htmlFor="users" className="text-sm font-medium">
                        {lang === 'ar' ? 'عدد المستخدمين' : 'Number of Users'}
                      </Label>
                      <Select value={leadFormData.users} onValueChange={(value) => setLeadFormData(prev => ({ ...prev, users: value }))}>
                        <SelectTrigger data-testid="select-users">
                          <SelectValue placeholder={lang === 'ar' ? 'اختر عدد المستخدمين' : 'Select user count'} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1-10">{lang === 'ar' ? '1-10 مستخدمين' : '1-10 users'}</SelectItem>
                          <SelectItem value="11-25">{lang === 'ar' ? '11-25 مستخدم' : '11-25 users'}</SelectItem>
                          <SelectItem value="26-50">{lang === 'ar' ? '26-50 مستخدم' : '26-50 users'}</SelectItem>
                          <SelectItem value="51-100">{lang === 'ar' ? '51-100 مستخدم' : '51-100 users'}</SelectItem>
                          <SelectItem value="100+">{lang === 'ar' ? 'أكثر من 100 مستخدم' : 'More than 100 users'}</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Deployment Option */}
                  <div className="space-y-2">
                    <Label htmlFor="deployment" className="text-sm font-medium">
                      {lang === 'ar' ? 'خيار النشر المفضل' : 'Preferred Deployment Option'}
                    </Label>
                    <Select value={leadFormData.deploymentOption} onValueChange={(value) => setLeadFormData(prev => ({ ...prev, deploymentOption: value }))}>
                      <SelectTrigger data-testid="select-deployment">
                        <SelectValue placeholder={lang === 'ar' ? 'اختر خيار النشر' : 'Select deployment option'} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cloud">{lang === 'ar' ? 'السحابة (Cloud)' : 'Cloud Hosting'}</SelectItem>
                        <SelectItem value="on-premise">{lang === 'ar' ? 'خوادم داخلية (On-Premise)' : 'On-Premise'}</SelectItem>
                        <SelectItem value="hybrid">{lang === 'ar' ? 'مختلط (Hybrid)' : 'Hybrid'}</SelectItem>
                        <SelectItem value="not-sure">{lang === 'ar' ? 'غير متأكد - أحتاج استشارة' : 'Not sure - need consultation'}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message */}
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-medium">
                      {lang === 'ar' ? 'تفاصيل إضافية أو متطلبات خاصة' : 'Additional Details or Special Requirements'}
                    </Label>
                    <Textarea
                      id="message"
                      value={leadFormData.message}
                      onChange={(e) => setLeadFormData(prev => ({ ...prev, message: e.target.value }))}
                      placeholder={lang === 'ar' 
                        ? 'أخبرنا عن احتياجاتك الخاصة أو أي متطلبات إضافية...'
                        : 'Tell us about your specific needs or any additional requirements...'
                      }
                      rows={4}
                      data-testid="textarea-message"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button 
                    type="submit" 
                    className="w-full bg-primary hover:bg-primary/90 text-white py-4 text-lg"
                    data-testid="button-submit-quote"
                  >
                    <Mail className={cn(
                      "w-5 h-5",
                      dir === 'rtl' ? "ml-2" : "mr-2"
                    )} />
                    {lang === 'ar' ? 'إرسال طلب العرض' : 'Submit Quote Request'}
                  </Button>

                  {/* Contact Information */}
                  <div className="grid md:grid-cols-2 gap-4 mt-8 pt-6 border-t">
                    <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{lang === 'ar' ? 'اتصل بنا مباشرة' : 'Call us directly'}</p>
                        <p className="text-blue-600 font-semibold">+967 735158003</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium text-sm">{lang === 'ar' ? 'راسلنا عبر البريد' : 'Email us'}</p>
                        <p className="text-green-600 font-semibold">erp@geniussoftwarecore.com</p>
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Module Details Sheet */}
      <Sheet open={isModuleSheetOpen} onOpenChange={setIsModuleSheetOpen}>
        <SheetContent 
          side={dir === 'rtl' ? 'left' : 'right'} 
          className="w-full sm:max-w-lg overflow-y-auto"
        >
          {selectedModule && (
            <>
              <SheetHeader className="pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("p-3 rounded-lg", selectedModule.color)}>
                    <selectedModule.icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl font-bold">
                      {lang === 'ar' ? selectedModule.name.ar : selectedModule.name.en}
                    </SheetTitle>
                    <Badge variant="secondary" className="mt-1">
                      {lang === 'ar' 
                        ? (selectedModule.category === 'core' ? 'وحدة أساسية' : 'وحدة قطاعية')
                        : `${selectedModule.category} module`
                      }
                    </Badge>
                  </div>
                </div>
                <SheetDescription className="text-base leading-relaxed">
                  {lang === 'ar' ? selectedModule.overview.ar : selectedModule.overview.en}
                </SheetDescription>
              </SheetHeader>

              <div className="space-y-6">
                {/* Key Features Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    {lang === 'ar' ? 'الميزات الرئيسية' : 'Key Features'}
                  </h3>
                  <div className="bg-gray-50 dark:bg-slate-800 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">
                      {lang === 'ar' ? selectedModule.features.ar : selectedModule.features.en}
                    </p>
                  </div>
                </div>

                {/* Benefits Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    {lang === 'ar' ? 'الفوائد الرئيسية' : 'Key Benefits'}
                  </h3>
                  <div className="space-y-3">
                    {getModuleBenefits(selectedModule.id, lang).map((benefit, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-900/10 rounded-lg">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Use Cases Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Building className="w-5 h-5 text-blue-500" />
                    {lang === 'ar' ? 'حالات الاستخدام' : 'Use Cases'}
                  </h3>
                  <div className="space-y-3">
                    {getModuleUseCases(selectedModule.id, lang).map((useCase, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <ArrowRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{useCase}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Technical Specifications */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-purple-500" />
                    {lang === 'ar' ? 'المواصفات التقنية' : 'Technical Specifications'}
                  </h3>
                  <div className="bg-purple-50 dark:bg-purple-900/10 rounded-lg p-4">
                    <div className="grid grid-cols-1 gap-3">
                      {getModuleTechnicalSpecs(selectedModule.id, lang).map((spec, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <span className="text-sm text-gray-700 dark:text-gray-300">{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Implementation Timeline */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-500" />
                    {lang === 'ar' ? 'جدولة التنفيذ' : 'Implementation Timeline'}
                  </h3>
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded-lg p-4">
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {lang === 'ar' 
                        ? 'يمكن تنفيذ هذه الوحدة خلال 2-4 أسابيع حسب تعقيد المتطلبات والتخصيص المطلوب. يشمل ذلك التثبيت والتكوين والتدريب والاختبار.'
                        : 'This module can be implemented within 2-4 weeks depending on complexity and customization requirements. This includes installation, configuration, training, and testing.'
                      }
                    </p>
                  </div>
                </div>

                {/* Call to Action Buttons */}
                <div className="space-y-3 pt-4 border-t">
                  <Button 
                    onClick={scrollToLeadForm} 
                    className="w-full bg-primary hover:bg-primary/90 text-white"
                    data-testid="button-get-quote-module"
                  >
                    <Mail className={cn("w-4 h-4", dir === 'rtl' ? "ml-2" : "mr-2")} />
                    {lang === 'ar' ? 'احصل على عرض سعر مخصص' : 'Get Custom Quote'}
                  </Button>
                  
                  <div className="flex gap-3">
                    <Button 
                      variant="outline" 
                      onClick={() => setIsModuleSheetOpen(false)}
                      className="flex-1"
                      data-testid="button-close-module"
                    >
                      {lang === 'ar' ? 'إغلاق' : 'Close'}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        // Scroll to pricing section
                        const pricingSection = document.querySelector('[data-section="pricing"]');
                        if (pricingSection) {
                          pricingSection.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                      className="flex-1"
                    >
                      {lang === 'ar' ? 'عرض الأسعار' : 'View Pricing'}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}