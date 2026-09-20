"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  User as UserIcon, Bell, Bookmark, Settings, LogOut, MapPin,
  FlaskConical, Heart, MessageCircle, ArrowRight,
} from "lucide-react";
import { Button } from "../componentes/ui/button";
import { useAuth } from "../contextos/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

const ABAS = [
  { id: "perfil", label: "Perfil", icone: UserIcon },
  { id: "salvos", label: "Salvos", icone: Bookmark },
  { id: "notificacoes", label: "Notificações", icone: Bell },
  { id: "config", label: "Configurações", icone: Settings },
];

export default function PerfilPage() {
  const { usuario, token, sair } = useAuth();
  const router = useRouter();
  const [aba, setAba] = useState("perfil");

  useEffect(() => {
    if (!usuario) {
      toast.error("Faça login para acessar o perfil");
      router.push("/entrar");
    }
  }, [usuario, router]);

  if (!usuario) return null;

  return (
    <div className="min-h-screen bg-elfo-creme">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <header className="mb-10">
          <h1 className="font-display font-black text-4xl text-elfo-verde-escuro mb-2">
            Sua conta
          </h1>
          <p className="text-elfo-cinza">
            Bem-vindo, {usuario.nome}
          </p>
        </header>

        <div className="grid md:grid-cols-[220px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-1">
            {ABAS.map((a) => (
              <button
                key={a.id}
                onClick={() => setAba(a.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  aba === a.id
                    ? "bg-elfo-verde-escuro text-elfo-off-white"
                    : "text-elfo-verde-escuro hover:bg-white"
                }`}
              >
                <a.icone size={18} />
                {a.label}
              </button>
            ))}
            <button
              onClick={() => {
                sair();
                router.push("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dir-rubi hover:bg-red-50 transition-all mt-4"
            >
              <LogOut size={18} />
              Sair
            </button>
          </aside>

          {/* Conteúdo */}
          <main className="bg-white rounded-2xl p-8 shadow-sm border border-elfo-dourado/10">
            {aba === "perfil" && <PerfilConteudo usuario={usuario} />}
            {aba === "salvos" && <SalvosConteudo />}
            {aba === "notificacoes" && <NotificacoesConteudo />}
            {aba === "config" && <ConfigConteudo />}
          </main>
        </div>
      </div>
    </div>
  );
}

function PerfilConteudo({ usuario }: any) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-elfo-verde-escuro mb-6">
          Informações pessoais
        </h2>
        <div className="space-y-4">
          <Field label="Nome" value={usuario.nome} />
          <Field label="Email" value={usuario.email} />
          <Field label="Perfil" value={usuario.perfil} />
          <Field label="Localização" value={usuario.municipio ? `${usuario.municipio}, ${usuario.uf}` : usuario.uf || "—"} />
        </div>
      </div>
    </div>
  );
}

function SalvosConteudo() {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-elfo-verde-escuro mb-6">
        Posts salvos
      </h2>
      <div className="text-center py-12">
        <Bookmark size={48} className="mx-auto text-elfo-cinza/30 mb-4" />
        <p className="text-elfo-cinza mb-4">
          Você ainda não salvou nenhum post.
        </p>
        <Link href="/atlas">
          <Button variant="primary">Explorar o Atlas</Button>
        </Link>
      </div>
    </div>
  );
}

function NotificacoesConteudo() {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-elfo-verde-escuro mb-6">
        Notificações
      </h2>
      <div className="text-center py-12">
        <Bell size={48} className="mx-auto text-elfo-cinza/30 mb-4" />
        <p className="text-elfo-cinza">
          Você não tem notificações novas.
        </p>
      </div>
    </div>
  );
}

function ConfigConteudo() {
  return (
    <div>
      <h2 className="font-display font-bold text-2xl text-elfo-verde-escuro mb-6">
        Configurações
      </h2>
      <div className="space-y-4">
        <Toggle label="Receber alertas de risco na minha região" defaultChecked />
        <Toggle label="Receber notificações de novas investigações" defaultChecked />
        <Toggle label="Compartilhar minha localização com a comunidade" />
        <Toggle label="Aparecer publicamente no mapa" />
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-3 border-b border-elfo-dourado/10">
      <span className="text-sm text-elfo-cinza">{label}</span>
      <span className="text-sm font-medium text-elfo-verde-escuro">{value}</span>
    </div>
  );
}

function Toggle({ label, defaultChecked }: { label: string; defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked || false);
  return (
    <div className="flex items-center justify-between py-3 border-b border-elfo-dourado/10">
      <span className="text-sm text-elfo-verde-escuro">{label}</span>
      <button
        onClick={() => setOn(!on)}
        className={`w-11 h-6 rounded-full transition-all ${
          on ? "bg-elfo-verde-vivo" : "bg-elfo-cinza/30"
        }`}
      >
        <motion.div
          animate={{ x: on ? 22 : 2 }}
          className="w-5 h-5 rounded-full bg-white shadow-sm"
        />
      </button>
    </div>
  );
}
