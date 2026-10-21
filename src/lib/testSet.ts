export type ExpectedVerdict = "scam" | "safe";

export type TestMessage = {
  id: number;
  text: string;
  expected: ExpectedVerdict;
  language: "en" | "ur" | "roman" | "mixed";
  category: string;
};

/**
 * 30-message accuracy benchmark for ChaunkUp.
 * 20 clear scams and 10 genuine messages, mixing English, Urdu and Roman Urdu.
 */
export const testSet: TestMessage[] = [
  // Scams (20)
  {
    id: 1,
    text: "Congratulations! You have won Rs. 500,000 in our lucky draw. Call now to claim your prize. Send your CNIC and bank details immediately.",
    expected: "scam",
    language: "en",
    category: "fake prize",
  },
  {
    id: 2,
    text: "Dear customer, your bank account has been suspended. Click this link and enter your OTP to verify immediately.",
    expected: "scam",
    language: "en",
    category: "bank impersonation",
  },
  {
    id: 3,
    text: "Your parcel is on hold at customs. Pay Rs. 2,500 clearance fee via Easypaisa to this number 03451234567 to release it.",
    expected: "scam",
    language: "en",
    category: "courier fee",
  },
  {
    id: 4,
    text: "Work from home and earn Rs. 50,000 every week. Send Rs. 2,000 registration fee now to start today.",
    expected: "scam",
    language: "en",
    category: "job scam",
  },
  {
    id: 5,
    text: "This is FIA. Your ID card is involved in money laundering. Pay a penalty of Rs. 10,000 today or an arrest warrant will be issued.",
    expected: "scam",
    language: "en",
    category: "impersonation threat",
  },
  {
    id: 6,
    text: "Double your money in just 3 days with our guaranteed forex investment. Deposit now to this crypto wallet address.",
    expected: "scam",
    language: "en",
    category: "investment scam",
  },
  {
    id: 7,
    text: "Hi uncle, I lost my phone in an accident. Please send Rs. 5,000 to this number urgently, I will explain later.",
    expected: "scam",
    language: "en",
    category: "fake relative",
  },
  {
    id: 8,
    text: "Your WhatsApp number has been selected for a $1,000 gift. Reply with your card number to receive the prize.",
    expected: "scam",
    language: "en",
    category: "fake prize",
  },
  {
    id: 9,
    text: "KElectric notice: your electricity will be disconnected in 30 minutes unless you pay your overdue bill through this link.",
    expected: "scam",
    language: "en",
    category: "utility threat",
  },
  {
    id: 10,
    text: "FBR tax refund of Rs. 12,000 is pending. Confirm your IBAN and ATM PIN so we can transfer the amount.",
    expected: "scam",
    language: "en",
    category: "tax refund",
  },
  {
    id: 11,
    text: "Mubarak ho! Aap ne Rs 1 lakh jeet liye lucky draw mein. Apna CNIC aur bank detail jald bhejien.",
    expected: "scam",
    language: "roman",
    category: "fake prize",
  },
  {
    id: 12,
    text: "Apka bank account block hone wala hai. Apna OTP is number par share karein taake account secure rahe.",
    expected: "scam",
    language: "roman",
    category: "bank impersonation",
  },
  {
    id: 13,
    text: "Aap ka parcel customs mein ruka hua hai. Rs 3,000 Easypaisa karein is number par aur parcel release karwaein.",
    expected: "scam",
    language: "roman",
    category: "courier fee",
  },
  {
    id: 14,
    text: "Ghar bethe har hafte Rs 40,000 kamaien. Rs 1,500 registration fees bhejien aur kaam shuru karain.",
    expected: "scam",
    language: "roman",
    category: "job scam",
  },
  {
    id: 15,
    text: "Your mobile number has won a Honda bike. For delivery send your CNIC copy and Rs 2,000 processing fee to 03001234567.",
    expected: "scam",
    language: "mixed",
    category: "fake prize",
  },
  {
    id: 16,
    text: "مبارک ہو! آپ نے ایک لاکھ روپے جیت لیے۔ انعام وصول کرنے کے لیے اپنا شناختی کارڈ نمبر بھیجیں۔",
    expected: "scam",
    language: "ur",
    category: "fake prize",
  },
  {
    id: 17,
    text: "آپ کا بینک اکاؤنٹ معطل ہونے والا ہے۔ براہ کرم اپنا او ٹی پی شیئر کریں تاکہ تصدیق ہو سکے۔",
    expected: "scam",
    language: "ur",
    category: "bank impersonation",
  },
  {
    id: 18,
    text: "آپ کا پیکج کسٹم میں روک دیا گیا ہے۔ فیس ادا کرنے کے لیے اس نمبر پر رابطہ کریں۔",
    expected: "scam",
    language: "ur",
    category: "courier fee",
  },
  {
    id: 19,
    text: "گھر بیٹھے ہفتے میں 50,000 روپے کمائیں۔ رجسٹریشن فیس جمع کروائیں اور آج سے شروع کریں۔",
    expected: "scam",
    language: "ur",
    category: "job scam",
  },
  {
    id: 20,
    text: "FIA se call hai, aap ka name money laundering case mein hai. Rs 20,000 penalty bhejien warna arrest warrant issue hoga.",
    expected: "scam",
    language: "mixed",
    category: "impersonation threat",
  },

  // Genuine messages (10)
  {
    id: 21,
    text: "Hey, are we still meeting for coffee at 5 today?",
    expected: "safe",
    language: "en",
    category: "friend",
  },
  {
    id: 22,
    text: "Ammi, I am leaving the office now. Should I bring milk on the way home?",
    expected: "safe",
    language: "en",
    category: "family",
  },
  {
    id: 23,
    text: "Please send the meeting notes when you get a chance. Thanks!",
    expected: "safe",
    language: "en",
    category: "work",
  },
  {
    id: 24,
    text: "Your monthly bank statement is now available. Log in to online banking to view it securely.",
    expected: "safe",
    language: "en",
    category: "bank notification",
  },
  {
    id: 25,
    text: "Your Daraz order has been delivered. We hope you enjoy your purchase.",
    expected: "safe",
    language: "en",
    category: "delivery",
  },
  {
    id: 26,
    text: "Bhai, kal cricket khelne chal rahe ho? Ground per 4 baje milte hain.",
    expected: "safe",
    language: "roman",
    category: "friend",
  },
  {
    id: 27,
    text: "Abu, hospital se medicine le aayein? Doctor ne 3 dino ki dose di hai.",
    expected: "safe",
    language: "roman",
    category: "family",
  },
  {
    id: 28,
    text: "کل ملاقات ہوگی؟ ٹھیک ہے، وقت پر آئیں۔",
    expected: "safe",
    language: "ur",
    category: "friend",
  },
  {
    id: 29,
    text: "بیٹا، کب گھر آؤ گے؟ کھانا تیار ہے۔",
    expected: "safe",
    language: "ur",
    category: "family",
  },
  {
    id: 30,
    text: "Hi bhai, can you send the homework pictures? Urdu ka assignment bhi bhej do please.",
    expected: "safe",
    language: "mixed",
    category: "friend",
  },
];
