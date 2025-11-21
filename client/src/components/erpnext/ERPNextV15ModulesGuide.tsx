import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/i18n/lang';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription,
  SheetClose 
} from '@/components/ui/sheet';
import { 
  Calculator, 
  ShoppingCart, 
  Users, 
  Package, 
  Warehouse, 
  Settings, 
  FolderKanban, 
  UserCog, 
  Headphones, 
  Monitor, 
  Award, 
  Wrench, 
  Calendar, 
  CreditCard, 
  Globe, 
  Banknote, 
  MessageSquare,
  Heart,
  GraduationCap,
  Wheat,
  HandHeart,
  Search,
  Filter,
  ExternalLink,
  ArrowRight,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Module {
  id: string;
  name: {
    en: string;
    ar: string;
  };
  category: 'core' | 'industry';
  icon: any;
  color: string;
  overview: {
    en: string;
    ar: string;
  };
  features: {
    en: string;
    ar: string;
  };
}

const modules: Module[] = [
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
      ar: 'إدارة الموردين؛ طلب عروض الأسعار؛ عروض أسعار الموردين؛ مقارنة الأسعار؛ أوامر الشراء؛ إيصالات المواد؛ فوترة المشتريات.'
    }
  },
  {
    id: 'stock',
    name: { en: 'Stock', ar: 'المخزون' },
    category: 'core',
    icon: Warehouse,
    color: 'bg-indigo-500',
    overview: {
      en: 'Warehouses & Transfers; Batches & Serials; FIFO/Moving Average valuation; Reorder levels & alerts.',
      ar: 'مستودعات وتحويلات؛ دفعات وأرقام تسلسلية؛ تقييم FIFO/متوسط متحرك؛ إعادة الطلب وتنبيهات.'
    },
    features: {
      en: 'Multi-warehouse management; Stock transfers; Batch and serial tracking; Inventory valuation; Reorder alerts; Stock reconciliation.',
      ar: 'إدارة المستودعات المتعددة؛ تحويلات المخزون؛ تتبع الدفعات والأرقام التسلسلية؛ تقييم المخزون؛ تنبيهات إعادة الطلب؛ مطابقة المخزون.'
    }
  },
  {
    id: 'manufacturing',
    name: { en: 'Manufacturing', ar: 'التصنيع' },
    category: 'core',
    icon: Settings,
    color: 'bg-red-500',
    overview: {
      en: 'Multi-level BOMs; Work Orders; Job Cards; MRP/Production Plans; Workstations; Manufacturing costing.',
      ar: 'BOM متعددة المستويات؛ أوامر تصنيع؛ بطاقات عمل؛ تخطيط مواد (MRP)؛ محطات عمل؛ كلفة الإنتاج.'
    },
    features: {
      en: 'Bill of materials; Work order management; Job card tracking; Material planning; Workstation setup; Production costing.',
      ar: 'فاتورة المواد؛ إدارة أوامر العمل؛ تتبع بطاقات العمل؛ تخطيط المواد؛ إعداد محطة العمل؛ تكلفة الإنتاج.'
    }
  },
  {
    id: 'projects',
    name: { en: 'Projects', ar: 'المشاريع' },
    category: 'core',
    icon: FolderKanban,
    color: 'bg-teal-500',
    overview: {
      en: 'Projects, Tasks, Timesheets; Milestone/Time billing; Gantt/Kanban; Cost tracking & documents.',
      ar: 'مشاريع ومهام وTimesheets؛ فوترة وقت/معالم؛ جانت/كانبان؛ تتبّع التكلفة والمستندات.'
    },
    features: {
      en: 'Project management; Task tracking; Time logging; Milestone billing; Gantt charts; Kanban boards; Cost tracking.',
      ar: 'إدارة المشاريع؛ تتبع المهام؛ تسجيل الوقت؛ فوترة المعالم؛ مخططات جانت؛ لوحات كانبان؛ تتبع التكلفة.'
    }
  },
  {
    id: 'hr-payroll',
    name: { en: 'HR & Payroll', ar: 'الموارد البشرية والرواتب' },
    category: 'core',
    icon: UserCog,
    color: 'bg-pink-500',
    overview: {
      en: 'Employee records; Attendance & Leave; Shift scheduling; Salary Structures & Slips; Expense Claims; Appraisals.',
      ar: 'ملفات موظفين؛ حضور وإجازات؛ جداول عمل؛ هياكل/سلالم ورواتب؛ مطالبات؛ تقييم أداء.'
    },
    features: {
      en: 'Employee database; Attendance tracking; Leave management; Shift scheduling; Payroll processing; Expense claims; Performance appraisals.',
      ar: 'قاعدة بيانات الموظفين؛ تتبع الحضور؛ إدارة الإجازات؛ جدولة المناوبات؛ معالجة كشوف المرتبات؛ مطالبات المصروفات؛ تقييمات الأداء.'
    }
  },
  {
    id: 'support-helpdesk',
    name: { en: 'Support/Helpdesk', ar: 'الدعم الفني' },
    category: 'core',
    icon: Headphones,
    color: 'bg-cyan-500',
    overview: {
      en: 'Tickets & SLAs; Priorities & escalation; Knowledge Base; Email integration; Satisfaction metrics.',
      ar: 'تذاكر Issues؛ SLA وأولويات وتصعيد؛ قاعدة معرفة؛ بريد مدمج؛ تقارير الرضا.'
    },
    features: {
      en: 'Ticket management; SLA tracking; Priority handling; Knowledge base; Email integration; Customer satisfaction surveys.',
      ar: 'إدارة التذاكر؛ تتبع SLA؛ التعامل مع الأولوية؛ قاعدة المعرفة؛ تكامل البريد الإلكتروني؛ استطلاعات رضا العملاء.'
    }
  },
  {
    id: 'assets',
    name: { en: 'Assets', ar: 'الأصول' },
    category: 'core',
    icon: Monitor,
    color: 'bg-gray-500',
    overview: {
      en: 'Asset registry; Depreciation schedules; Transfers; Maintenance & Warranty; Revaluation/Disposal; Reports.',
      ar: 'تسجيل أصول؛ جداول إهلاك؛ نقل؛ صيانة وضمان؛ إعادة تقييم/تخلّص؛ تقارير.'
    },
    features: {
      en: 'Asset tracking; Depreciation management; Asset transfers; Maintenance scheduling; Warranty tracking; Disposal management.',
      ar: 'تتبع الأصول؛ إدارة الاستهلاك؛ تحويلات الأصول؛ جدولة الصيانة؛ تتبع الضمان؛ إدارة التخلص.'
    }
  },
  {
    id: 'quality',
    name: { en: 'Quality', ar: 'الجودة' },
    category: 'core',
    icon: Award,
    color: 'bg-yellow-500',
    overview: {
      en: 'Quality Plans; Incoming/In-process/Final inspections; Sampling & AQL; Nonconformance & CAPA.',
      ar: 'خطط جودة؛ فحوصات قبل/أثناء/بعد؛ عينات ومعايير قبول؛ عدم مطابقة وإجراءات تصحيحية.'
    },
    features: {
      en: 'Quality planning; Inspection management; Sampling procedures; Non-conformance tracking; Corrective actions; Quality reports.',
      ar: 'تخطيط الجودة؛ إدارة التفتيش؛ إجراءات أخذ العينات؛ تتبع عدم المطابقة؛ الإجراءات التصحيحية؛ تقارير الجودة.'
    }
  },
  {
    id: 'maintenance',
    name: { en: 'Maintenance', ar: 'الصيانة' },
    category: 'core',
    icon: Wrench,
    color: 'bg-stone-500',
    overview: {
      en: 'Preventive schedules; Field visits; Work Orders; Spare parts; Failure logs & planning.',
      ar: 'صيانة وقائية؛ زيارات ميدانية؛ أوامر شغل؛ قطع غيار؛ سجل أعطال وجدولة.'
    },
    features: {
      en: 'Preventive maintenance; Field service; Work order management; Spare parts inventory; Failure tracking; Maintenance planning.',
      ar: 'الصيانة الوقائية؛ الخدمة الميدانية؛ إدارة أوامر العمل؛ مخزون قطع الغيار؛ تتبع الأعطال؛ تخطيط الصيانة.'
    }
  },
  {
    id: 'subscriptions',
    name: { en: 'Subscriptions', ar: 'الاشتراكات' },
    category: 'core',
    icon: Calendar,
    color: 'bg-emerald-500',
    overview: {
      en: 'Monthly/Yearly plans; Auto-invoicing & renewals; Pause/Resume; Proration/Credits; Due reminders.',
      ar: 'خطط شهرية/سنوية؛ فواتير آلية وتجديد؛ إيقاف/استئناف؛ Proration/Credit؛ تنبيهات استحقاق.'
    },
    features: {
      en: 'Subscription plans; Automated billing; Renewal management; Pause/resume functionality; Pro-ration; Credit management.',
      ar: 'خطط الاشتراك؛ الفوترة الآلية؛ إدارة التجديد؛ وظيفة الإيقاف/الاستئناف؛ التناسب؛ إدارة الائتمان.'
    }
  },
  {
    id: 'pos-retail',
    name: { en: 'POS/Retail', ar: 'نقطة البيع/التجزئة' },
    category: 'core',
    icon: CreditCard,
    color: 'bg-violet-500',
    overview: {
      en: 'POS Profiles; POS Invoices; Offline mode; Returns; Cashier closing; Sync.',
      ar: 'ملفات POS؛ فواتير نقطة البيع؛ وضع Offline؛ إرجاعات؛ إقفال صندوق؛ مزامنة.'
    },
    features: {
      en: 'Point of sale interface; Offline functionality; Return processing; Cashier management; Inventory sync; Payment processing.',
      ar: 'واجهة نقطة البيع؛ الوظيفة غير المتصلة بالإنترنت؛ معالجة الإرجاع؛ إدارة أمين الصندوق؛ مزامنة المخزون؛ معالجة الدفع.'
    }
  },
  {
    id: 'website-ecommerce',
    name: { en: 'Website & eCommerce', ar: 'الموقع والتجارة الإلكترونية' },
    category: 'core',
    icon: Globe,
    color: 'bg-blue-600',
    overview: {
      en: 'Pages/Content; Blog; Product Catalog; Cart/Checkout; Customer portal; SEO basics.',
      ar: 'صفحات ومحتوى؛ مدونة؛ كتالوج؛ سلة/دفع؛ حساب عميل؛ أساسيات SEO.'
    },
    features: {
      en: 'Website builder; Blog management; Product catalog; Shopping cart; Customer portal; SEO optimization; Content management.',
      ar: 'منشئ المواقع؛ إدارة المدونة؛ كتالوج المنتجات؛ عربة التسوق؛ بوابة العملاء؛ تحسين SEO؛ إدارة المحتوى.'
    }
  },
  {
    id: 'payments-banking',
    name: { en: 'Payments & Banking', ar: 'المدفوعات والخدمات المصرفية' },
    category: 'core',
    icon: Banknote,
    color: 'bg-green-600',
    overview: {
      en: 'Payment Entries; Payment Requests; Bank Accounts; Reconciliation; Collections & dunning.',
      ar: 'قيود مدفوعات؛ طلبات دفع؛ حسابات بنكية؛ مطابقة بنكية؛ تحصيلات ومتابعة.'
    },
    features: {
      en: 'Payment processing; Payment requests; Bank account management; Bank reconciliation; Collection management; Dunning process.',
      ar: 'معالجة المدفوعات؛ طلبات الدفع؛ إدارة الحسابات المصرفية؛ المطابقة المصرفية؛ إدارة التحصيل؛ عملية المطالبة.'
    }
  },
  {
    id: 'communication',
    name: { en: 'Communication', ar: 'التواصل' },
    category: 'core',
    icon: MessageSquare,
    color: 'bg-indigo-600',
    overview: {
      en: 'Email Accounts; Templates & auto-replies; Assignments & @mentions; Unified communication log.',
      ar: 'حسابات بريد؛ قوالب وردود تلقائية؛ تعيينات و@mentions؛ سجل تواصل موحّد.'
    },
    features: {
      en: 'Email integration; Email templates; Auto-responses; Assignment management; Mention system; Communication tracking.',
      ar: 'تكامل البريد الإلكتروني؛ قوالب البريد الإلكتروني؛ الردود التلقائية؛ إدارة المهام؛ نظام الإشارة؛ تتبع التواصل.'
    }
  },
  // Industry Domains
  {
    id: 'healthcare',
    name: { en: 'Healthcare', ar: 'الرعاية الصحية' },
    category: 'industry',
    icon: Heart,
    color: 'bg-rose-500',
    overview: {
      en: 'Patients; Appointments; Encounters; Lab/Prescriptions; Pharmacy; Billing.',
      ar: 'ملفات مرضى؛ مواعيد؛ Encounter؛ مختبر/وصفات؛ صيدلية؛ فواتير.'
    },
    features: {
      en: 'Patient management; Appointment scheduling; Medical encounters; Laboratory management; Prescription tracking; Healthcare billing.',
      ar: 'إدارة المرضى؛ جدولة المواعيد؛ اللقاءات الطبية؛ إدارة المختبر؛ تتبع الوصفات؛ فواتير الرعاية الصحية.'
    }
  },
  {
    id: 'education',
    name: { en: 'Education', ar: 'التعليم' },
    category: 'industry',
    icon: GraduationCap,
    color: 'bg-amber-500',
    overview: {
      en: 'Students; Courses; Program Enrollment; Attendance; Assessment; Fees.',
      ar: 'طلاب؛ مقررات؛ تسجيل برامج؛ حضور؛ تقييم؛ رسوم.'
    },
    features: {
      en: 'Student management; Course catalog; Program enrollment; Attendance tracking; Assessment tools; Fee management.',
      ar: 'إدارة الطلاب؛ كتالوج الدورات؛ تسجيل البرنامج؛ تتبع الحضور؛ أدوات التقييم؛ إدارة الرسوم.'
    }
  },
  {
    id: 'agriculture',
    name: { en: 'Agriculture', ar: 'الزراعة' },
    category: 'industry',
    icon: Wheat,
    color: 'bg-lime-500',
    overview: {
      en: 'Crops & Cycles; Fields & activity tracking; Inputs & yields; Reports.',
      ar: 'محاصيل ودورات؛ حقول وتتبّع عمليات؛ مدخلات وإنتاجية؛ تقارير.'
    },
    features: {
      en: 'Crop management; Field tracking; Activity monitoring; Input management; Yield tracking; Agricultural reporting.',
      ar: 'إدارة المحاصيل؛ تتبع الحقول؛ مراقبة النشاط؛ إدارة المدخلات؛ تتبع الإنتاجية؛ التقارير الزراعية.'
    }
  },
  {
    id: 'non-profit',
    name: { en: 'Non Profit', ar: 'غير الربحية' },
    category: 'industry',
    icon: HandHeart,
    color: 'bg-red-400',
    overview: {
      en: 'Members & Donors; Grants; Campaigns; Donation Receipts; Impact reports.',
      ar: 'أعضاء ومتبرعون؛ منح؛ حملات؛ إيصالات تبرّع؛ تقارير أثر.'
    },
    features: {
      en: 'Member management; Donor tracking; Grant management; Campaign tracking; Donation receipts; Impact measurement.',
      ar: 'إدارة الأعضاء؛ تتبع المتبرعين؛ إدارة المنح؛ تتبع الحملات؛ إيصالات التبرع؛ قياس الأثر.'
    }
  }
];

export default function ERPNextV15ModulesGuide() {
  const { dir } = useLanguage();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'core' | 'industry'>('all');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [expandedContent, setExpandedContent] = useState(false);

  // Filter modules based on search and category
  const filteredModules = useMemo(() => {
    return modules.filter(module => {
      const matchesSearch = searchQuery === '' || 
        module.name.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.name.ar.includes(searchQuery) ||
        module.overview.en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.overview.ar.includes(searchQuery);
      
      const matchesFilter = activeFilter === 'all' || module.category === activeFilter;
      
      return matchesSearch && matchesFilter;
    });
  }, [searchQuery, activeFilter]);

  // Handle module card click
  const handleModuleClick = (module: Module) => {
    setSelectedModule(module);
    setIsDrawerOpen(true);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'module_card_click', {
        module_name: module.id,
        category: module.category
      });
    }

    // Update URL with module anchor
    if (typeof window !== 'undefined') {
      window.history.pushState(null, '', `#module-${module.id}`);
    }
  };

  // Handle CTA clicks
  const handleCTAClick = (type: 'demo' | 'quote' | 'docs') => {
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', `cta_${type}_click`, {
        module_name: selectedModule?.id,
        category: selectedModule?.category
      });
    }

    if (type === 'demo' || type === 'quote') {
      // Scroll to lead form
      const leadForm = document.getElementById('erpnext-lead-form');
      if (leadForm) {
        setIsDrawerOpen(false);
        setTimeout(() => {
          leadForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      }
    } else if (type === 'docs') {
      // Open ERPNext documentation
      window.open('https://docs.erpnext.com/', '_blank');
    }
  };

  // Handle search
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    // Analytics tracking
    if (typeof window !== 'undefined' && (window as any).gtag && query.length > 0) {
      (window as any).gtag('event', 'module_search_used', {
        search_query: query
      });
    }
  };

  // Deep linking support
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash;
      if (hash.startsWith('#module-')) {
        const moduleId = hash.replace('#module-', '');
        const module = modules.find(m => m.id === moduleId);
        if (module) {
          handleModuleClick(module);
        }
      }
    }
  }, []);

  return (
    <section id="erpnext-modules" className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center max-w-4xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {dir === 'rtl' ? 'وحدات ERPNext v15 التفاعلية' : 'Interactive ERPNext v15 Modules'}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {dir === 'rtl' 
              ? 'اكتشف جميع وحدات ERPNext v15 الشاملة. انقر على أي وحدة للحصول على نظرة عامة مفصلة والميزات الرئيسية.'
              : 'Explore all comprehensive ERPNext v15 modules. Click on any module for detailed overview and key features.'
            }
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          className="flex flex-col sm:flex-row gap-4 mb-8 max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {/* Filter Chips */}
          <div className="flex gap-2 flex-wrap">
            {[
              { id: 'all', label: dir === 'rtl' ? 'جميع الوحدات' : 'All Modules' },
              { id: 'core', label: dir === 'rtl' ? 'الوحدات الأساسية' : 'Core' },
              { id: 'industry', label: dir === 'rtl' ? 'المجالات الصناعية' : 'Industry Domains' }
            ].map((filter) => (
              <Button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id as any)}
                variant={activeFilter === filter.id ? "default" : "outline"}
                size="sm"
                className={cn(
                  "rounded-full transition-all duration-200",
                  activeFilter === filter.id && "bg-primary text-white shadow-md"
                )}
                data-testid={`filter-${filter.id}`}
              >
                <Filter className="w-4 h-4 mr-2" />
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder={dir === 'rtl' ? 'البحث في الوحدات...' : 'Search modules...'}
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 rounded-xl"
              data-testid="module-search"
            />
          </div>
        </motion.div>

        {/* Modules Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <AnimatePresence>
            {filteredModules.map((module, index) => {
              const IconComponent = module.icon;
              return (
                <motion.div
                  key={module.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => handleModuleClick(module)}
                  className="cursor-pointer"
                  data-testid={`module-card-${module.id}`}
                >
                  <Card className="h-full border-2 border-gray-200 hover:border-primary hover:shadow-xl transition-all duration-300 group">
                    <CardContent className="p-6 text-center">
                      {/* Module Icon */}
                      <div className={cn(
                        "w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300",
                        module.color
                      )}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>

                      {/* Module Name */}
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-300">
                        {dir === 'rtl' ? module.name.ar : module.name.en}
                      </h3>

                      {/* Category Badge */}
                      <Badge 
                        variant={module.category === 'core' ? 'default' : 'secondary'}
                        className="mb-3"
                      >
                        {module.category === 'core' 
                          ? (dir === 'rtl' ? 'أساسي' : 'Core')
                          : (dir === 'rtl' ? 'صناعي' : 'Industry')
                        }
                      </Badge>

                      {/* Brief Overview */}
                      <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                        {dir === 'rtl' ? module.overview.ar : module.overview.en}
                      </p>

                      {/* Click indicator */}
                      <div className="mt-4 text-primary group-hover:translate-x-1 transition-transform duration-200">
                        <ArrowRight className={cn(
                          "w-5 h-5 mx-auto",
                          dir === 'rtl' && "rotate-180"
                        )} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredModules.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {dir === 'rtl' ? 'لم يتم العثور على نتائج' : 'No modules found'}
            </h3>
            <p className="text-gray-500">
              {dir === 'rtl' 
                ? 'جرب تغيير مصطلحات البحث أو الفلاتر'
                : 'Try adjusting your search terms or filters'
              }
            </p>
          </motion.div>
        )}
      </div>

      {/* Module Details Drawer */}
      <Sheet open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
        <SheetContent 
          side={dir === 'rtl' ? 'left' : 'right'} 
          className="w-full sm:w-[600px] overflow-y-auto"
          dir={dir}
        >
          {selectedModule && (
            <>
              <SheetHeader className="pb-6 border-b">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0",
                    selectedModule.color
                  )}>
                    <selectedModule.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <SheetTitle className="text-xl font-bold">
                      {dir === 'rtl' ? selectedModule.name.ar : selectedModule.name.en}
                    </SheetTitle>
                    <Badge 
                      variant={selectedModule.category === 'core' ? 'default' : 'secondary'}
                      className="mt-1"
                    >
                      {selectedModule.category === 'core' 
                        ? (dir === 'rtl' ? 'وحدة أساسية' : 'Core Module')
                        : (dir === 'rtl' ? 'مجال صناعي' : 'Industry Domain')
                      }
                    </Badge>
                  </div>
                </div>
              </SheetHeader>

              <div className="py-6 space-y-6">
                {/* Overview */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
                    {dir === 'rtl' ? 'نظرة عامة' : 'Overview'}
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {dir === 'rtl' ? selectedModule.overview.ar : selectedModule.overview.en}
                  </p>
                </div>

                {/* Key Features */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <div className="w-5 h-5 bg-green-500 rounded-full"></div>
                      {dir === 'rtl' ? 'الميزات الرئيسية' : 'Key Features'}
                    </h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setExpandedContent(!expandedContent)}
                      className="text-primary"
                    >
                      {expandedContent ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      {expandedContent 
                        ? (dir === 'rtl' ? 'طي' : 'Collapse')
                        : (dir === 'rtl' ? 'توسيع' : 'Expand')
                      }
                    </Button>
                  </div>
                  
                  <div className={cn(
                    "text-gray-700 leading-relaxed transition-all duration-300",
                    !expandedContent && "line-clamp-4"
                  )}>
                    {dir === 'rtl' ? selectedModule.features.ar : selectedModule.features.en}
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-6 border-t space-y-3">
                  <Button
                    onClick={() => handleCTAClick('demo')}
                    className="w-full bg-primary hover:bg-primary-dark text-white rounded-xl h-12"
                    data-testid="cta-demo"
                  >
                    <ArrowRight className={cn(
                      "w-5 h-5 mr-2",
                      dir === 'rtl' && "rotate-180 mr-0 ml-2"
                    )} />
                    {dir === 'rtl' ? 'اطلب عرضًا توضيحيًا' : 'Request a Demo'}
                  </Button>
                  
                  <Button
                    onClick={() => handleCTAClick('quote')}
                    variant="outline"
                    className="w-full border-primary text-primary hover:bg-primary hover:text-white rounded-xl h-12"
                    data-testid="cta-quote"
                  >
                    <ArrowRight className={cn(
                      "w-5 h-5 mr-2",
                      dir === 'rtl' && "rotate-180 mr-0 ml-2"
                    )} />
                    {dir === 'rtl' ? 'اطلب عرض سعر' : 'Request a Quote'}
                  </Button>

                  <Button
                    onClick={() => handleCTAClick('docs')}
                    variant="ghost"
                    className="w-full text-gray-600 hover:text-primary hover:bg-gray-50 rounded-xl h-12"
                    data-testid="cta-docs"
                  >
                    <ExternalLink className={cn(
                      "w-5 h-5 mr-2",
                      dir === 'rtl' && "mr-0 ml-2"
                    )} />
                    {dir === 'rtl' ? 'الوثائق' : 'Documentation'}
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </section>
  );
}