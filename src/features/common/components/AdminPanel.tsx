"use client";

import { useState } from "react";
import { AdminExperiences } from "@/src/features/experiencias/components/AdminExperiences";
import { AdminComments } from "@/src/features/interacciones/components/AdminComments";
import { AdminRequests } from "@/src/features/propuestas/components/AdminRequests";
import { useToast } from "./Toast";

const TABS = ["experiencias", "propuestas", "comentarios"] as const;
type Tab = (typeof TABS)[number];

export function AdminPanel() {
  const [tab, setTab] = useState<Tab>("experiencias");
  const { notify, toast } = useToast();

  return (
    <div>
      <div role="tablist" aria-label="Secciones del panel" className="flex gap-6 overflow-x-auto border-b border-line font-serif text-lg">
        {TABS.map((t) => (
          <button
            key={t}
            id={`tab-${t}`}
            role="tab"
            type="button"
            aria-selected={tab === t}
            aria-controls={`panel-${t}`}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 pb-2 capitalize ${tab === t ? "border-accent text-text" : "border-transparent text-muted hover:text-text"}`}
          >
            {t}
          </button>
        ))}
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`} className="mt-8">
        {tab === "experiencias" && <AdminExperiences notify={notify} />}
        {tab === "propuestas" && <AdminRequests notify={notify} />}
        {tab === "comentarios" && <AdminComments />}
      </div>
      {toast}
    </div>
  );
}
