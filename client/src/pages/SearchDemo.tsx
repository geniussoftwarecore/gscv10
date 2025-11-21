import { GlobalSearchBar } from '@/components/search/GlobalSearchBar';

export default function SearchDemo() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              نظام البحث الشامل
            </h1>
            <p className="text-gray-600">
              ابحث في جميع البيانات: جهات الاتصال، الشركات، الصفقات، والتذاكر
            </p>
          </div>

          {/* Global Search Bar */}
          <div className="mb-8">
            <GlobalSearchBar />
          </div>

          {/* Demo Instructions */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h2 className="text-lg font-semibold mb-4">تعليمات التجريب:</h2>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">1</span>
                <span>اكتب أي نص في شريط البحث لتجربة البحث السريع (أكثر من حرفين)</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">2</span>
                <span>استخدم زر "تصفية" لاختيار الأنواع التي تريد البحث فيها</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">3</span>
                <span>احفظ عمليات البحث المفضلة لديك باستخدام زر "المحفوظة"</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-xs font-medium">4</span>
                <span>النقر على أي نتيجة بحث سينقلك إلى صفحة التفاصيل</span>
              </div>
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                ⚡
              </div>
              <h3 className="font-semibold mb-2">بحث سريع</h3>
              <p className="text-sm text-gray-600">
                نتائج فورية خلال 300 مللي ثانية مع تقنية الـ debouncing
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                🎯
              </div>
              <h3 className="font-semibold mb-2">بحث ذكي</h3>
              <p className="text-sm text-gray-600">
                يبحث في الأسماء، الايميلات، الهواتف، والعناوين الوظيفية
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                💾
              </div>
              <h3 className="font-semibold mb-2">حفظ الفلاتر</h3>
              <p className="text-sm text-gray-600">
                احفظ عمليات البحث المتكررة لاستخدامها لاحقاً
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}