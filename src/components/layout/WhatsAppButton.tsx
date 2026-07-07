import { siteConfig } from "@/lib/site-config";

export function WhatsAppButton() {
  const message = encodeURIComponent(
    "Hi Car Edits! I'd like to know more about booking a shoot.",
  );

  return (
    <a
      href={`https://wa.me/${siteConfig.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed right-6 bottom-24 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_8px_24px_rgba(0,0,0,0.35)] transition-transform hover:scale-105 lg:bottom-6"
    >
      <svg viewBox="0 0 24 24" className="size-7 fill-white">
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2Zm5.8 14.16c-.24.68-1.4 1.32-1.93 1.4-.5.08-1.1.11-1.79-.11a16.6 16.6 0 0 1-1.59-.59c-2.8-1.21-4.63-4.04-4.77-4.22-.14-.19-1.14-1.51-1.14-2.88 0-1.37.72-2.04.97-2.32.25-.28.55-.35.73-.35h.53c.17 0 .4-.06.63.48.24.56.81 1.94.88 2.08.07.14.11.3.02.49-.09.19-.14.3-.28.46-.14.16-.29.36-.42.48-.14.14-.28.29-.12.57.16.28.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.28.37-.23.63-.14.26.09 1.63.77 1.91.91.28.14.47.21.53.33.07.12.07.68-.17 1.36Z" />
      </svg>
    </a>
  );
}
