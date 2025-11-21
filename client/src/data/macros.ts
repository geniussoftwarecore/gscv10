// Canned Replies/Macros for CRM
export interface Macro {
  id: string;
  title: string;
  content: string;
  category: 'greeting' | 'technical' | 'billing' | 'closing' | 'escalation';
  placeholders: string[]; // List of available placeholders
}

const defaultMacros: Macro[] = [
  {
    id: 'macro-1',
    title: 'ترحيب أولي',
    content: 'مرحباً {{customer_name}}،\n\nشكراً لك على التواصل معنا. لقد استلمنا طلبك وسنقوم بمراجعته والرد عليك في أقرب وقت ممكن.\n\nفي حالة وجود أي استفسارات عاجلة، لا تتردد في التواصل معنا.\n\nمع أطيب التحيات،\nفريق Genius Software Core',
    category: 'greeting',
    placeholders: ['{{customer_name}}', '{{ticket_id}}']
  },
  {
    id: 'macro-2',
    title: 'طلب معلومات إضافية',
    content: 'مرحباً {{customer_name}}،\n\nلكي نتمكن من مساعدتك بشكل أفضل، نحتاج إلى بعض المعلومات الإضافية:\n\n- {{additional_info}}\n\nنقدر تعاونك ونتطلع لحل مشكلتك في أقرب وقت.\n\nمع التحية،\n{{agent_name}}',
    category: 'technical',
    placeholders: ['{{customer_name}}', '{{additional_info}}', '{{agent_name}}']
  },
  {
    id: 'macro-3',
    title: 'حل تقني',
    content: 'مرحباً {{customer_name}}،\n\nلقد قمنا بمراجعة مشكلتك وإليك الحل:\n\n{{solution_steps}}\n\nإذا واجهت أي صعوبة في تطبيق هذا الحل، لا تتردد في التواصل معنا.\n\nمع أطيب التحيات،\n{{agent_name}}',
    category: 'technical',
    placeholders: ['{{customer_name}}', '{{solution_steps}}', '{{agent_name}}']
  },
  {
    id: 'macro-4',
    title: 'إغلاق التذكرة',
    content: 'مرحباً {{customer_name}}،\n\nنأمل أن نكون قد تمكنا من حل مشكلتك بنجاح. سنقوم بإغلاق هذه التذكرة الآن.\n\nإذا كنت بحاجة لأي مساعدة إضافية، لا تتردد في إنشاء تذكرة جديدة أو التواصل معنا.\n\nشكراً لاختيارك Genius Software Core.\n\nمع التحية،\n{{agent_name}}',
    category: 'closing',
    placeholders: ['{{customer_name}}', '{{agent_name}}']
  },
  {
    id: 'macro-5',
    title: 'تصعيد للمستوى الأعلى',
    content: 'مرحباً {{customer_name}}،\n\nبعد مراجعة طلبك، قررنا تصعيده إلى المستوى الأعلى من الدعم التقني لضمان حصولك على أفضل حل ممكن.\n\nسيتم التواصل معك من قبل أحد الخبراء المختصين خلال {{escalation_time}}.\n\nنشكرك على صبرك وتفهمك.\n\nمع التحية،\n{{agent_name}}',
    category: 'escalation',
    placeholders: ['{{customer_name}}', '{{escalation_time}}', '{{agent_name}}']
  }
];

// Load macros from localStorage
const loadMacrosFromStorage = (): Macro[] => {
  try {
    const stored = localStorage.getItem("gsc_macros");
    return stored ? JSON.parse(stored) : defaultMacros;
  } catch (error) {
    console.error("Error loading macros:", error);
    return defaultMacros;
  }
};

// Save macros to localStorage
const saveMacrosToStorage = (macros: Macro[]): void => {
  try {
    localStorage.setItem("gsc_macros", JSON.stringify(macros));
  } catch (error) {
    console.error("Error saving macros:", error);
  }
};

let macros: Macro[] = loadMacrosFromStorage();

// Get all macros
export const getMacros = (): Macro[] => {
  return [...macros];
};

// Get macros by category
export const getMacrosByCategory = (category: Macro['category']): Macro[] => {
  return macros.filter(macro => macro.category === category);
};

// Add new macro
export const addMacro = (macro: Omit<Macro, 'id'>): Macro => {
  const newMacro: Macro = {
    ...macro,
    id: `macro-${Date.now()}`
  };
  
  macros.push(newMacro);
  saveMacrosToStorage(macros);
  return newMacro;
};

// Update macro
export const updateMacro = (id: string, updates: Partial<Omit<Macro, 'id'>>): Macro | null => {
  const index = macros.findIndex(m => m.id === id);
  if (index === -1) return null;
  
  macros[index] = { ...macros[index], ...updates };
  saveMacrosToStorage(macros);
  return macros[index];
};

// Delete macro
export const deleteMacro = (id: string): boolean => {
  const index = macros.findIndex(m => m.id === id);
  if (index === -1) return false;
  
  macros.splice(index, 1);
  saveMacrosToStorage(macros);
  return true;
};

// Process macro content with placeholders
export const processMacroContent = (content: string, values: Record<string, string>): string => {
  let processed = content;
  
  Object.entries(values).forEach(([key, value]) => {
    const placeholder = key.startsWith('{{') ? key : `{{${key}}}`;
    processed = processed.replace(new RegExp(placeholder, 'g'), value);
  });
  
  return processed;
};