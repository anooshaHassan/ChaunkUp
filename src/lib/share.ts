export function isEmailContact(contact: string): boolean {
  return contact.includes("@");
}

export function whatsappNumber(contact: string): string {
  return contact.replace(/\D/g, "");
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
