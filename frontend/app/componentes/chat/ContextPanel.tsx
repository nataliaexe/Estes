"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass, Library, MessageSquareText, Radar, Camera, Users,
} from "lucide-react";
import type { ChatMessage, SavedItem } from "../../lib/chat/types";
import {
  RECENT_CASES,
  EVIDENCE_LABEL,
  EVIDENCE_COLOR,
} from "../../lib/chat/mockData";

interface ContextPanelProps {
  messages: ChatMessage[];
  savedItems: SavedItem[];
  onJumpTo: (messageId: string) => void;
}

const EXPLORE_LINKS = [
  { href: "/atlas", label: "View Atlas", icon: Library },
  { href: "/explorar", label: "Investigate new material", icon: Radar },
  { href: "/medir", label: "Measure with camera", icon: Camera },
  { href: "/contribuir", label: "Contribute a case", icon: Users },
];

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof Compass;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-b border-elfo-verde-escuro/10 px-5 py-5 last:border-b-0">
      <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold text-elfo-verde-escuro/70">
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
        {title}
      </h3>
      {children}
    </section>
  );
}

export function ContextPanel({
  messages,
  savedItems,
  onJumpTo,
}: ContextPanelProps) {
  const userTurns = messages.filter((m) => m.role === "user");

  return (
    <aside
      className="flex h-full flex-col overflow-y-auto bg-white/60"
      aria-label="Context panel"
    >
      <Section icon={MessageSquareText} title="Current conversation">
        {userTurns.length === 0 ? (
          <p className="text-sm text-elfo-verde-escuro/50">
            Your questions appear here.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {userTurns.map((m) => (
              <li key={m.id}>
                <button
                  onClick={() => onJumpTo(m.id)}
                  className="w-full truncate rounded-md px-2 py-1.5 text-left text-sm text-elfo-verde-escuro/80 transition-colors hover:bg-elfo-verde-vivo/15 hover:text-elfo-verde-escuro"
                  title={m.content}
                >
                  {m.content || "Photo attached"}
                </button>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={Library} title="Saved library">
        {savedItems.length === 0 ? (
          <p className="text-sm text-elfo-verde-escuro/50">Nothing saved yet.</p>
        ) : (
          <ul className="space-y-2">
            {savedItems.map((item) => (
              <motion.li
                key={item.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-lg border border-elfo-dourado/30 bg-elfo-creme/50 px-3 py-2"
              >
                <p className="truncate text-sm font-medium text-elfo-verde-escuro">
                  {item.title}
                </p>
                {item.subtitle && (
                  <p className="truncate text-xs text-elfo-verde-escuro/55">
                    {item.subtitle}
                  </p>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </Section>

      <Section icon={Compass} title="Explore">
        <div className="grid grid-cols-2 gap-2">
          {EXPLORE_LINKS.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-start gap-1.5 rounded-xl border border-ia-roxo-escuro/15 bg-ia-roxo-escuro/5 px-3 py-2.5 text-left transition-transform hover:scale-[1.02] hover:bg-ia-roxo-escuro/10"
              aria-label={label}
            >
              <Icon className="h-4 w-4 text-ia-roxo-escuro" aria-hidden="true" />
              <span className="text-xs font-medium text-ia-roxo-escuro">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section icon={Radar} title="Recent cases">
        <ul className="space-y-2">
          {RECENT_CASES.map((c) => (
            <li
              key={c.numero}
              className="rounded-xl border border-elfo-verde-escuro/10 bg-white/50 px-3 py-2.5 transition-transform hover:scale-[1.01]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-elfo-verde-escuro/50">
                  #{c.numero} · {c.uf} · {c.categoria}
                </span>
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium text-elfo-verde-escuro"
                  style={{ backgroundColor: `${EVIDENCE_COLOR[c.evidencia]}55` }}
                >
                  {EVIDENCE_LABEL[c.evidencia]}
                </span>
              </div>
              <p className="mt-1 text-sm text-elfo-verde-escuro">{c.titulo}</p>
            </li>
          ))}
        </ul>
      </Section>
    </aside>
  );
}
