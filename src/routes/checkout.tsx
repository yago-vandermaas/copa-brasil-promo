import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { z } from "zod";
import { ChevronLeft, ChevronRight, Lock, ShieldCheck, Truck } from "lucide-react";
import camisaImg from "@/assets/camisa-brasil.jpg";
import copoImg from "@/assets/copo-termico.jpg";
import heroImg from "@/assets/hero-kit.jpg";

const CHECKOUT_LINKS = {
  camisa: "https://app.katorzepay.com/checkout/pay/camisa-brasil-2026-tailandesa",
  copo: "https://app.katorzepay.com/checkout/pay/copo-termico-brasil-edicao-limitada",
  // TODO: substituir pelo link do Kit Completo no KatorzePay
  kit: "https://app.katorzepay.com/checkout/pay/kit-brasil-camisa-copo",
};

const PRODUCTS = {
  camisa: {
    nome: "Camisa Oficial Brasil",
    preco: "R$ 149,90",
    img: camisaImg,
    link: CHECKOUT_LINKS.camisa,
  },
  copo: {
    nome: "Copo Térmico Brasil — Edição Limitada",
    preco: "R$ 149,90",
    img: copoImg,
    link: CHECKOUT_LINKS.copo,
  },
  kit: {
    nome: "Kit Definitivo Brasil — Camisa + Copo Térmico",
    preco: "R$ 279,90",
    img: heroImg,
    link: CHECKOUT_LINKS.kit,
  },
} as const;

type ProductKey = keyof typeof PRODUCTS;

const searchSchema = z.object({
  produto: z.enum(["camisa", "copo", "kit"]).catch("kit"),
});

export const Route = createFileRoute("/checkout")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [
      { title: "Checkout — Endereço de Entrega | KitBrasil" },
      { name: "description", content: "Informe o endereço de entrega para finalizar a compra." },
    ],
  }),
  component: CheckoutPage,
});

function onlyDigits(s: string) {
  return s.replace(/\D/g, "");
}

function CheckoutPage() {
  const { produto } = Route.useSearch();
  const navigate = useNavigate();
  const item = PRODUCTS[produto as ProductKey];
  const needsSize = produto === "camisa" || produto === "kit";
  const needsNome = produto === "copo" || produto === "kit";

  const [form, setForm] = useState({
    nome: "",
    email: "",
    telefone: "",
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    tamanhoCamisa: "" as "" | "P" | "M" | "G" | "GG",
    nomeCopo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadingCep, setLoadingCep] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const set = (k: keyof typeof form, v: string) => {
    setForm(p => ({ ...p, [k]: v }));
    if (errors[k]) setErrors(p => ({ ...p, [k]: "" }));
  };

  const buscarCep = async (cep: string) => {
    const cleaned = onlyDigits(cep);
    if (cleaned.length !== 8) return;
    setLoadingCep(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cleaned}/json/`);
      const d = await r.json();
      if (!d.erro) {
        setForm(p => ({
          ...p,
          rua: d.logradouro || p.rua,
          bairro: d.bairro || p.bairro,
          cidade: d.localidade || p.cidade,
          estado: d.uf || p.estado,
        }));
      }
    } catch {
      // silencioso
    } finally {
      setLoadingCep(false);
    }
  };

  const validate = () => {
    const schema = z.object({
      nome: z.string().trim().min(3, "Informe seu nome completo").max(100),
      email: z.string().trim().email("Email inválido").max(255),
      telefone: z.string().transform(onlyDigits).pipe(z.string().min(10, "Telefone inválido").max(11)),
      cep: z.string().transform(onlyDigits).pipe(z.string().length(8, "CEP inválido")),
      rua: z.string().trim().min(2, "Informe a rua").max(150),
      numero: z.string().trim().min(1, "Nº").max(10),
      complemento: z.string().max(80).optional().or(z.literal("")),
      bairro: z.string().trim().min(2, "Informe o bairro").max(100),
      cidade: z.string().trim().min(2, "Informe a cidade").max(100),
      estado: z.string().trim().length(2, "UF").toUpperCase(),
      tamanhoCamisa: needsSize
        ? z.enum(["P", "M", "G", "GG"], { errorMap: () => ({ message: "Selecione o tamanho" }) })
        : z.string().optional(),
      nomeCopo: needsNome
        ? z.string().trim().min(1, "Informe o nome para gravar no copo").max(15, "Máximo de 15 caracteres")
        : z.string().optional(),
    });
    const res = schema.safeParse(form);
    if (!res.success) {
      const errs: Record<string, string> = {};
      for (const issue of res.error.issues) {
        const key = String(issue.path[0]);
        if (!errs[key]) errs[key] = issue.message;
      }
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) {
      const first = document.querySelector("[data-error='true']") as HTMLElement | null;
      first?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSubmitting(true);
    // Os dados do endereço ficam salvos localmente para referência.
    // O gateway KatorzePay coletará os dados oficialmente no próximo passo.
    try {
      sessionStorage.setItem(
        "kitbrasil:endereco",
        JSON.stringify({ produto, ...form, at: new Date().toISOString() }),
      );
    } catch {}
    // Redireciona para o link de checkout do gateway (nova aba)
    window.open(item.link, "_blank", "noopener,noreferrer");
    setTimeout(() => setSubmitting(false), 800);
  };

  const inputBase =
    "w-full rounded-xl border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

  const fieldErr = (k: string) =>
    errors[k] ? (
      <p data-error="true" className="mt-1 text-xs font-medium text-destructive">
        {errors[k]}
      </p>
    ) : null;

// --- ADICIONA ESTE BLOCO AQUI ---
  const valorFrete = 9.99;
  // Converte "R$ 149,90" para 149.90
  const precoProdutoNum = parseFloat(item.preco.replace("R$ ", "").replace(",", ".")); 
  const totalSoma = precoProdutoNum + valorFrete;
  // Formata o resultado para exibir como Moeda (ex: "R$ 159,89")
  const totalFormatado = totalSoma.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  // --------------------------------


  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-lg border-b border-border">
        <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between">
          <Link to="/" className="inline-flex items-center gap-1 text-sm font-semibold text-muted-foreground hover:text-foreground">
            <ChevronLeft className="h-4 w-4" /> Voltar à loja
          </Link>
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground">
            <Lock className="h-4 w-4 text-primary" /> Checkout Seguro
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 md:py-12">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Etapa 1 de 2</span>
          <h1 className="mt-1 text-2xl md:text-4xl font-black">Endereço de entrega</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Preencha seus dados para entregarmos o seu pedido. Na próxima etapa você finaliza o pagamento de forma segura.
          </p>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8">
          {/* Formulário */}
          <form onSubmit={handleSubmit} className="bg-card rounded-3xl border border-border shadow-card p-6 md:p-8 space-y-6">
            <section>
              <h2 className="font-display text-lg font-extrabold mb-4">Dados pessoais</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Nome completo</label>
                  <input className={inputBase} value={form.nome} onChange={e => set("nome", e.target.value)} maxLength={100} placeholder="Como está no documento" />
                  {fieldErr("nome")}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <input className={inputBase} type="email" value={form.email} onChange={e => set("email", e.target.value)} maxLength={255} placeholder="voce@email.com" />
                  {fieldErr("email")}
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Telefone / WhatsApp</label>
                  <input className={inputBase} value={form.telefone} onChange={e => set("telefone", onlyDigits(e.target.value).slice(0, 11))} placeholder="(11) 99999-9999" inputMode="numeric" />
                  {fieldErr("telefone")}
                </div>
              </div>
            </section>

            <section>
              <h2 className="font-display text-lg font-extrabold mb-4">Endereço de entrega</h2>
              <div className="grid sm:grid-cols-6 gap-4">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">CEP</label>
                  <input
                    className={inputBase}
                    value={form.cep}
                    onChange={e => {
                      const v = onlyDigits(e.target.value).slice(0, 8);
                      set("cep", v);
                      if (v.length === 8) buscarCep(v);
                    }}
                    placeholder="00000-000"
                    inputMode="numeric"
                  />
                  {loadingCep && <p className="mt-1 text-xs text-muted-foreground">Buscando endereço…</p>}
                  {fieldErr("cep")}
                </div>
                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-muted-foreground">Rua / Logradouro</label>
                  <input className={inputBase} value={form.rua} onChange={e => set("rua", e.target.value)} maxLength={150} />
                  {fieldErr("rua")}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Número</label>
                  <input className={inputBase} value={form.numero} onChange={e => set("numero", e.target.value)} maxLength={10} />
                  {fieldErr("numero")}
                </div>
                <div className="sm:col-span-4">
                  <label className="text-xs font-semibold text-muted-foreground">Complemento <span className="font-normal opacity-60">(opcional)</span></label>
                  <input className={inputBase} value={form.complemento} onChange={e => set("complemento", e.target.value)} maxLength={80} placeholder="Apto, bloco, referência" />
                </div>
                <div className="sm:col-span-3">
                  <label className="text-xs font-semibold text-muted-foreground">Bairro</label>
                  <input className={inputBase} value={form.bairro} onChange={e => set("bairro", e.target.value)} maxLength={100} />
                  {fieldErr("bairro")}
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-muted-foreground">Cidade</label>
                  <input className={inputBase} value={form.cidade} onChange={e => set("cidade", e.target.value)} maxLength={100} />
                  {fieldErr("cidade")}
                </div>
                <div className="sm:col-span-1">
                  <label className="text-xs font-semibold text-muted-foreground">UF</label>
                  <input className={inputBase + " uppercase"} value={form.estado} onChange={e => set("estado", e.target.value.toUpperCase().slice(0, 2))} maxLength={2} />
                  {fieldErr("estado")}
                </div>
              </div>
            </section>

            <button
              type="submit"
              disabled={submitting}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brasil text-primary-foreground px-6 py-5 font-black text-base md:text-lg shadow-glow hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {submitting ? "Redirecionando…" : "Ir para pagamento seguro"} <ChevronRight className="h-5 w-5" />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              Você será redirecionado para o checkout seguro da <b>KatorzePay</b> para finalizar o pagamento.
            </p>
          </form>

          {/* Resumo do pedido */}
          <aside className="lg:sticky lg:top-24 h-fit space-y-4">
            <div className="bg-card rounded-3xl border border-border shadow-card p-6">
              <h2 className="font-display text-lg font-extrabold mb-4">Seu pedido</h2>
              <div className="flex gap-4">
                <div className="h-24 w-24 shrink-0 rounded-2xl overflow-hidden bg-muted">
                  <img src={item.img} alt={item.nome} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-bold leading-tight">{item.nome}</p>
                  <p className="mt-1 text-xs text-muted-foreground">Qtd: 1</p>
                  <p className="mt-2 font-display font-black text-lg text-gradient-brasil">{item.preco}</p>
                </div>
              </div>
              <div className="mt-5 border-t border-border pt-4 space-y-1 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span><span>{item.preco}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Frete fixo</span><span className="text-primary font-semibold">R$ 9,99</span>
                </div>
                <div className="flex justify-between pt-2 mt-2 border-t border-border font-display font-black text-base">
                  <span>Total</span><span>{totalFormatado}</span>
                </div>

              </div>
              <button
                type="button"
                onClick={() => navigate({ to: "/", hash: "produtos" })}
                className="mt-4 w-full text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
              >
                Trocar produto
              </button>
            </div>

            <div className="bg-card rounded-3xl border border-border shadow-card p-5 space-y-3 text-sm">
              <div className="flex items-center gap-3"><ShieldCheck className="h-5 w-5 text-primary" /> Compra 100% garantida</div>
              <div className="flex items-center gap-3"><Lock className="h-5 w-5 text-primary" /> Pagamento criptografado</div>
              <div className="flex items-center gap-3"><Truck className="h-5 w-5 text-primary" /> Envio para todo o Brasil</div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
