import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  CreditCard, 
  Wallet, 
  ExternalLink, 
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

// Yemeni e-wallets configuration
const yemeniWallets = [
  {
    id: "jaib",
    name: "محفظة جيب",
    nameEn: "Jaib Wallet",
    url: "http://e-jaib.com/",
    logo: "💳",
    color: "bg-blue-600",
  },
  {
    id: "cash",
    name: "كاش",
    nameEn: "Cash",
    url: "https://www.cash.com.ye/ar",
    logo: "💰",
    color: "bg-green-600",
  },
  {
    id: "jawali",
    name: "جوالي",
    nameEn: "Jawali",
    url: "https://www.jawali.com.ye/",
    logo: "📱",
    color: "bg-purple-600",
  },
  {
    id: "floosak",
    name: "فلوسك",
    nameEn: "Floosak (Kuraimi Bank)",
    url: "https://www.yk-bank.com/ar/Personal/e-wallet/floosak",
    logo: "🏦",
    color: "bg-orange-600",
  },
  {
    id: "onecash",
    name: "ون كاش",
    nameEn: "One Cash",
    url: "https://onecashye.com/",
    logo: "1️⃣",
    color: "bg-indigo-600",
  },
];

// Payment form schema
const paymentSchema = z.object({
  planId: z.string().min(1, "معرف الباقة مطلوب"),
  amount: z.string().min(1, "المبلغ مطلوب"),
  currency: z.enum(["YER", "USD", "SAR"], {
    required_error: "العملة مطلوبة",
  }),
  paymentMethod: z.enum(["credit_card", "jaib", "cash", "jawali", "floosak", "onecash"], {
    required_error: "طريقة الدفع مطلوبة",
  }),
  // Credit card fields
  cardNumber: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  cardHolderName: z.string().optional(),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentFormProps {
  planId: string;
  amount: string;
  onPaymentSubmit?: (data: PaymentFormData) => void;
  onPaymentCancel?: () => void;
}

export const PaymentForm = ({ 
  planId, 
  amount, 
  onPaymentSubmit, 
  onPaymentCancel 
}: PaymentFormProps) => {
  const [paymentMethod, setPaymentMethod] = useState<string>("credit_card");
  const [currency, setCurrency] = useState<"YER" | "USD" | "SAR">("YER");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "pending" | "processing">("idle");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      planId,
      amount,
      currency: "YER",
      paymentMethod: "credit_card",
    },
  });

  const formatCurrency = (value: string, currencyCode: "YER" | "USD" | "SAR") => {
    const currencySymbols = {
      YER: "ر.ي",
      USD: "$",
      SAR: "ر.س",
    };
    
    const formatter = new Intl.NumberFormat("ar-YE", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 0,
    });
    
    try {
      return formatter.format(parseInt(value) || 0);
    } catch {
      return `${value} ${currencySymbols[currencyCode]}`;
    }
  };

  const handlePaymentMethodChange = (method: string) => {
    setPaymentMethod(method);
    setValue("paymentMethod", method as any);
  };

  const handleCurrencyChange = (curr: "YER" | "USD" | "SAR") => {
    setCurrency(curr);
    setValue("currency", curr);
  };

  const onSubmit = (data: PaymentFormData) => {
    console.log("Payment data:", data);
    
    if (data.paymentMethod === "credit_card") {
      setPaymentStatus("processing");
      // Simulate credit card processing
      setTimeout(() => {
        setPaymentStatus("idle");
        onPaymentSubmit?.(data);
      }, 2000);
    } else {
      // Handle e-wallet payments
      const wallet = yemeniWallets.find(w => w.id === data.paymentMethod);
      if (wallet) {
        setPaymentStatus("pending");
        window.open(wallet.url, "_blank");
        // In a real implementation, you would handle the payment confirmation here
      }
      onPaymentSubmit?.(data);
    }
  };

  const handleWalletPayment = (walletId: string) => {
    const wallet = yemeniWallets.find(w => w.id === walletId);
    if (wallet) {
      setPaymentStatus("pending");
      handlePaymentMethodChange(walletId);
      setValue("paymentMethod", walletId as any);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard size={24} />
          معلومات الدفع
        </CardTitle>
        <div className="text-center py-4">
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(amount, currency)}
          </p>
          <p className="text-sm text-gray-600">المبلغ المطلوب</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Currency Selection */}
          <div className="space-y-2">
            <Label>العملة</Label>
            <Select value={currency} onValueChange={handleCurrencyChange}>
              <SelectTrigger>
                <SelectValue placeholder="اختر العملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YER">ريال يمني (YER)</SelectItem>
                <SelectItem value="USD">دولار أمريكي (USD)</SelectItem>
                <SelectItem value="SAR">ريال سعودي (SAR)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <Label>طريقة الدفع</Label>
            
            {/* Credit Card Option */}
            <div className="space-y-4">
              <button
                type="button"
                onClick={() => handlePaymentMethodChange("credit_card")}
                className={`w-full p-4 border-2 rounded-lg transition-all ${
                  paymentMethod === "credit_card"
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <CreditCard size={24} className="text-primary" />
                  <div className="text-right">
                    <p className="font-semibold">بطاقة ائتمانية</p>
                    <p className="text-sm text-gray-600">فيزا، ماستركارد، أمريكان إكسبرس</p>
                  </div>
                  {paymentMethod === "credit_card" && (
                    <CheckCircle size={20} className="text-primary mr-auto" />
                  )}
                </div>
              </button>

              {/* Credit Card Form */}
              {paymentMethod === "credit_card" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 p-4 bg-gray-50 rounded-lg"
                >
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="cardHolderName">اسم حامل البطاقة</Label>
                      <Input
                        id="cardHolderName"
                        {...register("cardHolderName")}
                        placeholder="الاسم كما هو مكتوب على البطاقة"
                      />
                      {errors.cardHolderName && (
                        <p className="text-red-500 text-sm">{errors.cardHolderName.message}</p>
                      )}
                    </div>
                    
                    <div>
                      <Label htmlFor="cardNumber">رقم البطاقة</Label>
                      <Input
                        id="cardNumber"
                        {...register("cardNumber")}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                      {errors.cardNumber && (
                        <p className="text-red-500 text-sm">{errors.cardNumber.message}</p>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="expiryDate">تاريخ الانتهاء</Label>
                        <Input
                          id="expiryDate"
                          {...register("expiryDate")}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                        {errors.expiryDate && (
                          <p className="text-red-500 text-sm">{errors.expiryDate.message}</p>
                        )}
                      </div>
                      
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          {...register("cvv")}
                          placeholder="123"
                          maxLength={4}
                        />
                        {errors.cvv && (
                          <p className="text-red-500 text-sm">{errors.cvv.message}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            <Separator />

            {/* Yemeni E-Wallets */}
            <div>
              <Label className="flex items-center gap-2 mb-4">
                <Wallet size={20} />
                المحافظ الإلكترونية اليمنية
              </Label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {yemeniWallets.map((wallet) => (
                  <button
                    key={wallet.id}
                    type="button"
                    onClick={() => handleWalletPayment(wallet.id)}
                    className={`p-4 border-2 rounded-lg transition-all text-right ${
                      paymentMethod === wallet.id
                        ? "border-primary bg-primary/5"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${wallet.color} flex items-center justify-center text-white text-lg`}>
                        {wallet.logo}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{wallet.name}</p>
                        <p className="text-sm text-gray-600">{wallet.nameEn}</p>
                      </div>
                      {paymentMethod === wallet.id && (
                        <CheckCircle size={20} className="text-primary" />
                      )}
                      <ExternalLink size={16} className="text-gray-400" />
                    </div>
                  </button>
                ))}
              </div>
              
              {paymentMethod !== "credit_card" && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-yellow-600" />
                    <p className="font-semibold text-yellow-800">تعليمات الدفع</p>
                  </div>
                  <p className="text-sm text-yellow-700">
                    سيتم توجيهك إلى موقع المحفظة الإلكترونية لإتمام عملية الدفع. بعد إتمام الدفع، 
                    سيتم تأكيد الطلب يدوياً من قبل فريق الدعم.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Payment Status */}
          {paymentStatus === "pending" && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Clock size={20} className="text-blue-600" />
                <p className="font-semibold text-blue-800">في انتظار تأكيد الدفع</p>
              </div>
              <p className="text-sm text-blue-700 mt-1">
                تم فتح نافذة الدفع. يرجى إتمام عملية الدفع والعودة هنا للمتابعة.
              </p>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3">
            <Button
              type="submit"
              className="flex-1"
              disabled={paymentStatus === "processing"}
            >
              {paymentStatus === "processing" ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  جارٍ المعالجة...
                </div>
              ) : paymentMethod === "credit_card" ? (
                <div className="flex items-center gap-2">
                  <CreditCard size={16} />
                  ادفع الآن
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Wallet size={16} />
                  تأكيد الطلب
                </div>
              )}
            </Button>
            
            {onPaymentCancel && (
              <Button type="button" variant="outline" onClick={onPaymentCancel}>
                إلغاء
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
};