import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Mail, MessageCircle, CheckCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useContactMessages } from "@/hooks/useContactMessages";

const AdminContactMessages = () => {
  const { data: messages, isLoading } = useContactMessages();
  const queryClient = useQueryClient();
  const [savingId, setSavingId] = useState<string | null>(null);

  const updateMessage = async (id: string, updates: { status?: string; admin_notes?: string | null }) => {
    setSavingId(id);
    const { error } = await supabase.from("contact_messages").update(updates).eq("id", id);

    if (error) {
      toast.error(error.message);
      setSavingId(null);
      return;
    }

    toast.success("Message updated");
    queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
    setSavingId(null);
  };

  if (isLoading) return <div className="text-muted-foreground">Loading messages...</div>;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-lg text-foreground">Contact Messages</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Messages sent from the Contact page are stored here for admin follow-up.
        </p>
      </div>

      {messages && messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => {
            const waNumber = message.phone?.replace(/[^0-9]/g, "") || "";

            return (
              <div key={message.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold text-foreground">{message.name}</h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          message.status === "new"
                            ? "bg-primary/20 text-primary"
                            : message.status === "read"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                        }`}
                      >
                        {message.status}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{message.email}</p>
                    {message.phone && <p className="text-sm text-muted-foreground">{message.phone}</p>}
                    <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {message.region_id ? `Region: ${message.region_id.toUpperCase()}` : "Region not provided"} · {new Date(message.created_at).toLocaleString()}
                    </p>
                    <p className="max-w-3xl whitespace-pre-wrap text-sm leading-6 text-foreground">{message.message}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`mailto:${message.email}?subject=${encodeURIComponent("Reply from Tembo Premium Spirits")}`}
                      className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-secondary"
                    >
                      <Mail size={15} /> Email
                    </a>
                    {waNumber && (
                      <a
                        href={`https://wa.me/${waNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 rounded-md border border-green-500/30 px-4 py-2 text-sm font-semibold text-green-400 transition-colors hover:bg-green-500/10"
                      >
                        <MessageCircle size={15} /> WhatsApp
                      </a>
                    )}
                    {message.status !== "closed" && (
                      <button
                        onClick={() => updateMessage(message.id, { status: message.status === "new" ? "read" : "closed" })}
                        disabled={savingId === message.id}
                        className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/10 disabled:opacity-60"
                      >
                        <CheckCheck size={15} /> {message.status === "new" ? "Mark Read" : "Close"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-4 border-t border-border pt-4">
                  <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    Admin Notes
                  </label>
                  <textarea
                    defaultValue={message.admin_notes || ""}
                    rows={3}
                    className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground"
                    placeholder="Add private notes about follow-up, delivery questions, wholesale interest, etc."
                    onBlur={(event) => {
                      if ((message.admin_notes || "") !== event.target.value) {
                        updateMessage(message.id, { admin_notes: event.target.value || null });
                      }
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border p-6 text-sm text-muted-foreground">
          No contact messages yet.
        </div>
      )}
    </div>
  );
};

export default AdminContactMessages;
