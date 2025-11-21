import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { CreditCard, Shield, CheckCircle, AlertCircle, Calendar, User } from "lucide-react";
import { SubscriptionPlan } from "@shared/schema";

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: SubscriptionPlan;
  onSubscribe?: (planId: string, paymentMethod: string) => void;
}

export function SubscriptionModal({ isOpen, onClose, plan, onSubscribe }: SubscriptionModalProps) {
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const paymentMethods = [
    {
      id: "credit-card",
      name: "بطاقة ائتمانية",
      icon: CreditCard,
      description: "Visa, MasterCard, American Express"
    },
    {
      id: "bank-transfer",
      name: "تحويل بنكي",
      icon: Shield,
      description: "تحويل مباشر من البنك"
    },
    {
      id: "installments",
      name: "أقساط",
      icon: Calendar,
      description: "دفع على أقساط شهرية"
    }
  ];

  const formatPrice = (price: string, duration: string) => {
    const formattedPrice = new Intl.NumberFormat("ar-SA").format(parseInt(price));
    const durationMap = {
      "monthly": "شهرياً",
      "yearly": "سنوياً", 
      "one-time": "دفعة واحدة"
    };
    return `${formattedPrice} ر.س ${durationMap[duration as keyof typeof durationMap] || ""}`;
  };

  const handleSubscribe = async () => {
    if (!selectedPayment || !customerInfo.name || !customerInfo.email) {
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onSubscribe && onSubscribe(plan.id, selectedPayment);
      setIsProcessing(false);
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            الاشتراك في: {plan.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Summary */}
          <Card className="bg-gradient-to-r from-primary to-primary-dark text-white">
            <CardContent className="p-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-xl mb-4">{formatPrice(plan.price, plan.duration)}</p>
                <p className="opacity-90">{plan.description}</p>
              </div>
              
              <div className="mt-6">
                <h4 className="font-semibold mb-3">المميزات المشمولة:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {plan.features?.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <CheckCircle size={16} className="text-green-300 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Customer Information */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User size={20} className="text-primary" />
                معلومات العميل
              </h4>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    الاسم الكامل *
                  </label>
                  <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    البريد الإلكتروني *
                  </label>
                  <input
                    type="email"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="example@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    رقم الهاتف
                  </label>
                  <input
                    type="tel"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+967 735158003"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Payment Methods */}
          <Card>
            <CardContent className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <CreditCard size={20} className="text-primary" />
                طريقة الدفع
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {paymentMethods.map((method) => (
                  <motion.div
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      selectedPayment === method.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedPayment(method.id)}
                  >
                    <div className="flex items-center gap-3">
                      <method.icon 
                        size={24} 
                        className={selectedPayment === method.id ? "text-primary" : "text-gray-500"} 
                      />
                      <div className="flex-1">
                        <h5 className="font-semibold">{method.name}</h5>
                        <p className="text-sm text-gray-600">{method.description}</p>
                      </div>
                      {selectedPayment === method.id && (
                        <CheckCircle size={20} className="text-primary" />
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Security Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <h5 className="font-semibold text-blue-900 mb-1">الأمان والخصوصية</h5>
                <p className="text-sm text-blue-700">
                  جميع معلوماتك محمية بتشفير SSL 256-bit ولن يتم مشاركتها مع أطراف ثالثة.
                  يمكنك إلغاء الاشتراك في أي وقت من لوحة التحكم.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isProcessing}
            >
              إلغاء
            </Button>
            <Button
              className="flex-1"
              onClick={handleSubscribe}
              disabled={!selectedPayment || !customerInfo.name || !customerInfo.email || isProcessing}
            >
              {isProcessing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  جاري المعالجة...
                </div>
              ) : (
                `اشترك الآن - ${formatPrice(plan.price, plan.duration)}`
              )}
            </Button>
          </div>

          {(!selectedPayment || !customerInfo.name || !customerInfo.email) && (
            <div className="flex items-center gap-2 text-amber-600 text-sm">
              <AlertCircle size={16} />
              يرجى ملء جميع الحقول المطلوبة واختيار طريقة الدفع
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}