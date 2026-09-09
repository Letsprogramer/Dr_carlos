import { MessageCircle } from 'lucide-react'

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5519992516000?text=Olá%2C%20gostaria%20de%20marcar%20um%20diagnóstico"
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-50 flex h-14 w-14 items-center justify-center rounded-none bg-[#25D366] text-white shadow-lg transition hover:scale-105"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  )
}

export default WhatsAppButton
