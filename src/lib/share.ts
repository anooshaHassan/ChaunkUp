export function isEmailContact(contact: string): boolean {
  return contact.includes("@");
}

export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPhone(phone: string): boolean {
  return /^\+?\d{10,15}$/.test(phone);
}

export function normalizePhone(phone: string): string {
  return phone.replace(/\D/g, "");
}

export function validateContact(contact: string): { valid: boolean; error?: string } {
  const trimmed = contact.trim();
  if (trimmed.length === 0) {
    return { valid: false, error: "Contact is required." };
  }
  if (isEmailContact(trimmed)) {
    return isValidEmail(trimmed)
      ? { valid: true }
      : { valid: false, error: "Please enter a valid email address." };
  }
  if (isValidPhone(trimmed)) {
    return { valid: true };
  }
  return {
    valid: false,
    error: "Contact must be a valid email or a phone number with 10 to 15 digits (optional leading +).",
  };
}

export function whatsappNumber(contact: string): string {
  return normalizePhone(contact);
}

export function buildShareLinks(contact: string, text: string) {
  const encodedText = encodeURIComponent(text);

  if (isEmailContact(contact)) {
    const subject = encodeURIComponent("ChaunkUp scam alert");
    return {
      type: "email" as const,
      url: `mailto:${contact}?subject=${subject}&body=${encodedText}`,
      label: "Email",
    };
  }

  const phone = whatsappNumber(contact);
  return {
    type: "whatsapp" as const,
    url: `https://wa.me/${encodeURIComponent(phone)}?text=${encodedText}`,
    label: phone ? "WhatsApp" : "Share",
  };
}
