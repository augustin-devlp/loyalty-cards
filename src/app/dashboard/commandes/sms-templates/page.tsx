"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import DashboardNav from "@/components/DashboardNav";
import Toggle from "@/components/ui/Toggle";
import { RIALTO_ID } from "@/lib/constants";
import {
  TEMPLATE_KEYS,
  TEMPLATE_META,
  TEMPLATE_VARIABLES,
  renderTemplate,
  type TemplateKey,
} from "@/lib/smsTemplates";

type TemplateRow = {
  id: string;
  restaurant_id: string;
  template_key: TemplateKey;
  content: string;
  enabled: boolean;
};

const PREVIEW_CTX: Record<string, string> = {
  order_number: "R-2026-042",
  pickup_time: "21:30",
  customer_name: "Augustin",
  total: "47.50",
  order_url: "https://rialto-lausanne.ch/order/abc123",
  reason: "Plat indisponible. ",
  restaurant_name: "Rialto",
  restaurant_phone: "021 312 64 60",
  restaurant_address: "Av. de Béthusy 29, Lausanne",
};

export default function SmsTemplatesPage() {
  const [templates, setTemplates] = useState<TemplateRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/restaurants/${RIALTO_ID}/sms-templates`);
        if (res.ok) {
          const body = (await res.json()) as { templates: TemplateRow[] };
          setTemplates(body.templates);
        }
      } catch {
        /* ignore */
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />
      <main className="md:ml-64 pb-28 md:pb-8 p-4 md:p-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-2xl font-black tracking-tight">
            Messages SMS aux clients
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            Personnalisez les messages envoyés automatiquement à chaque étape
            de la commande. Les variables {"{{entre accolades}}"} sont
            remplacées par les vraies données.
          </p>

          {loading ? (
            <div className="mt-10 text-sm text-gray-500">Chargement…</div>
          ) : (
            <div className="mt-6 space-y-4">
              {TEMPLATE_KEYS.map((key) => {
                const tmpl = templates.find((t) => t.template_key === key);
                if (!tmpl) return null;
                return (
                  <TemplateCard
                    key={key}
                    template={tmpl}
                    onSaved={(next) =>
                      setTemplates((list) =>
                        list.map((t) => (t.template_key === key ? next : t)),
                      )
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TemplateCard({
  template,
  onSaved,
}: {
  template: TemplateRow;
  onSaved: (next: TemplateRow) => void;
}) {
  const [content, setContent] = useState(template.content);
  const [enabled, setEnabled] = useState(template.enabled);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const meta = TEMPLATE_META[template.template_key];

  const preview = useMemo(() => renderTemplate(content, PREVIEW_CTX), [content]);
  const smsCount = Math.ceil(content.length / 160) || 1;

  const insertVariable = (variable: string) => {
    const el = textareaRef.current;
    if (!el) {
      setContent((c) => c + ` {{${variable}}}`);
      return;
    }
    const start = el.selectionStart ?? content.length;
    const end = el.selectionEnd ?? content.length;
    const next = content.slice(0, start) + `{{${variable}}}` + content.slice(end);
    setContent(next);
    setSaved(false);
    requestAnimationFrame(() => {
      const pos = start + variable.length + 4;
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  async function save() {
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch(
        `/api/restaurants/${template.restaurant_id}/sms-templates/${template.template_key}`,
        {
          method: "PATCH",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ content, enabled }),
        },
      );
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        alert((body as { error?: string }).error ?? "Échec");
      } else {
        const next = (body as { template: TemplateRow }).template;
        onSaved(next);
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } finally {
      setSaving(false);
    }
  }

  async function resetToDefault() {
    if (!confirm("Réinitialiser ce message au texte par défaut ?")) return;
    setSaving(true);
    try {
      const res = await fetch(
        `/api/restaurants/${template.restaurant_id}/sms-templates/${template.template_key}`,
        { method: "DELETE" },
      );
      const body = await res.json().catch(() => ({}));
      if (res.ok) {
        const next = (body as { template: TemplateRow }).template;
        setContent(next.content);
        setEnabled(next.enabled);
        onSaved(next);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5">
      <header className="mb-3 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-gray-900">{meta.title}</h2>
          <p className="mt-0.5 text-xs text-gray-500">{meta.description}</p>
        </div>
        <Toggle checked={enabled} onChange={setEnabled} showStateText />
      </header>

      <div className="grid gap-4 md:grid-cols-[1fr_180px]">
        <div>
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              setSaved(false);
            }}
            rows={4}
            className="w-full resize-none rounded-lg border border-gray-200 p-3 text-sm outline-none focus:border-gray-400"
          />
          <div className="mt-1 flex items-center justify-between text-[11px] text-gray-500">
            <span>
              {content.length} caractères · {smsCount} SMS
              {smsCount > 1 ? " (multi-parts)" : ""}
            </span>
            <span>Limite 160 caractères par SMS</span>
          </div>

          <div className="mt-3 rounded-lg bg-gray-50 p-3">
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500">
              Aperçu
            </div>
            <div className="whitespace-pre-wrap text-sm text-gray-800">
              {preview}
            </div>
          </div>
        </div>

        <aside>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-gray-500">
            Variables
          </div>
          <div className="mt-2 space-y-1">
            {TEMPLATE_VARIABLES.map((v) => (
              <button
                key={v.key}
                type="button"
                onClick={() => insertVariable(v.key)}
                className="block w-full rounded-md bg-gray-100 px-2 py-1 text-left text-[11px] font-mono text-gray-700 hover:bg-gray-200"
                title={v.label}
              >
                {"{{" + v.key + "}}"}
              </button>
            ))}
          </div>
        </aside>
      </div>

      <footer className="mt-4 flex items-center justify-end gap-3 border-t border-gray-100 pt-3">
        <button
          type="button"
          onClick={resetToDefault}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Réinitialiser au défaut
        </button>
        {saved && (
          <span className="text-xs font-semibold text-emerald-600">✓ Enregistré</span>
        )}
        <button
          type="button"
          disabled={saving}
          onClick={save}
          className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white hover:bg-black disabled:opacity-50"
        >
          {saving ? "…" : "Enregistrer"}
        </button>
      </footer>
    </section>
  );
}
