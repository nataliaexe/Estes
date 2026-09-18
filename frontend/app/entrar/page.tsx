"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Leaf, Mail, Lock, User, MapPin } from "lucide-react";
import { Button } from "../componentes/ui/button";
import { useAuth } from "../contextos/AuthContext";
import { toast } from "sonner";

const PERFIS = [
  { id: "cidadao", label: "Cidadão" },
  { id: "indigena", label: "Indígena" },
  { id: "quilombola", label: "Quilombola" },
  { id: "agricultor", label: "Agricultor" },
  { id: "pesquisador", label: "Pesquisador" },
  { id: "agente_saude", label: "Agente de saúde" },
  { id: "gestor_publico", label: "Gestor público" },
  { id: "curador", label: "Curador" },
];

const UFS = [
  "AC", "AL", "AM", "AP", "BA", "CE", "DF", "ES", "GO", "MA",
  "MG", "MS", "MT", "PA", "PB", "PE", "PI", "PR", "RJ", "RN",
  "RO", "RR", "RS", "SC", "SE", "SP", "TO",
];

export default function EntrarPage() {
  const router = useRouter();
  const { entrar, registrar } = useAuth();
  const [modo, setModo] = useState<"login" | "registro">("login");
  const [carregando, setCarregando] = useState(false);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    perfil: "cidadao",
    uf: "MG",
    municipio: "",
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    try {
      if (modo === "login") {
        await entrar(form.email, form.senha);
        toast.success("Bem-vindo de volta!");
      } else {
        await registrar(form);
        toast.success("Conta criada. Bem-vindo ao Estes!");
      }
      router.push("/");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-elfo-creme via-elfo-creme to-elfo-verde-vivo/10 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <Leaf className="w-10 h-10 text-elfo-verde-vivo" />
            <span className="font-display font-black text-3xl text-elfo-verde-escuro">
              Estes
            </span>
          </div>
          <h1 className="font-display font-black text-2xl text-elfo-verde-escuro mb-1">
            {modo === "login" ? "Entrar na plataforma" : "Criar sua conta"}
          </h1>
          <p className="text-sm text-elfo-cinza">
            {modo === "login"
              ? "Continue de onde parou"
              : "Contribua com conhecimento e participe"}
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl p-8 border border-elfo-dourado/10">
          {/* Tabs */}
          <div className="flex bg-elfo-creme rounded-xl p-1 mb-6">
            <button
              type="button"
              onClick={() => setModo("login")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                modo === "login"
                  ? "bg-white text-elfo-verde-escuro shadow-sm"
                  : "text-elfo-cinza"
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setModo("registro")}
              className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
                modo === "registro"
                  ? "bg-white text-elfo-verde-escuro shadow-sm"
                  : "text-elfo-cinza"
              }`}
            >
              Criar conta
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === "registro" && (
              <>
                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                    Nome
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-elfo-cinza"
                    />
                    <input
                      type="text"
                      required
                      minLength={2}
                      value={form.nome}
                      onChange={(e) =>
                        setForm({ ...form, nome: e.target.value })
                      }
                      placeholder="Seu nome"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                    Perfil
                  </label>
                  <select
                    value={form.perfil}
                    onChange={(e) =>
                      setForm({ ...form, perfil: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
                  >
                    {PERFIS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                      UF
                    </label>
                    <select
                      value={form.uf}
                      onChange={(e) =>
                        setForm({ ...form, uf: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
                    >
                      {UFS.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                      Município
                    </label>
                    <div className="relative">
                      <MapPin
                        size={16}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-elfo-cinza"
                      />
                      <input
                        type="text"
                        value={form.municipio}
                        onChange={(e) =>
                          setForm({ ...form, municipio: e.target.value })
                        }
                        placeholder="Opcional"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                Email
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-elfo-cinza"
                />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  placeholder="voce@exemplo.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-bold text-elfo-dourado mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-elfo-cinza"
                />
                <input
                  type="password"
                  required
                  minLength={8}
                  value={form.senha}
                  onChange={(e) =>
                    setForm({ ...form, senha: e.target.value })
                  }
                  placeholder={
                    modo === "registro"
                      ? "Mínimo 8 caracteres"
                      : "Sua senha"
                  }
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-elfo-dourado/30 bg-white focus:outline-none focus:ring-2 focus:ring-elfo-verde-vivo/50 text-sm"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={carregando}
            >
              {carregando
                ? "Processando..."
                : modo === "login"
                ? "Entrar"
                : "Criar conta"}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs text-elfo-cinza mt-6">
          Ao continuar, você concorda em contribuir para uma plataforma{" "}
          <Link href="/" className="text-elfo-verde-escuro underline">
            open source e aberta
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
