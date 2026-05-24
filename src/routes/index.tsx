import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Flame, ShieldCheck, Star, Truck, Lock, Clock, ChevronRight } from "lucide-react";
import heroImg from "@/assets/hero-kit.jpg";
import heroImg2 from "@/assets/hero-kit-2.jpg";
import heroImg3 from "@/assets/hero-kit-3.jpg";
import camisaImg from "@/assets/camisa-brasil.jpg";
import camisaImg2 from "@/assets/camisa-brasil-2.jpg";
import camisaImg3 from "@/assets/camisa-brasil-3.jpg";
import copoImg from "@/assets/copo-termico.jpg";
import copoImg2 from "@/assets/copo-termico-2.jpg";
import copoImg3 from "@/assets/copo-termico-3.jpg";

function ProductGallery({ images, alt, fit = "cover" }: { images: string[]; alt: string; fit?: "cover" | "contain" }) {
  const [active, setActive] = useState(0);
  return (
    <div className="flex flex-col">
      <div className={`relative aspect-square overflow-hidden ${fit === "contain" ? "p-6" : ""}`}>
        <img
          src={images[active]}
          alt={alt}
          loading="lazy"
          className={`w-full h-full ${fit === "cover" ? "object-cover" : "object-contain"} transition duration-500`}
        />
      </div>
      <div className="flex gap-2 px-4 pb-4 pt-3 bg-background/40">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => setActive(i)}
            aria-label={`Ver foto ${i + 1}`}
            className={`relative h-16 w-16 shrink-0 rounded-xl overflow-hidden border-2 transition ${
              active === i ? "border-primary shadow-glow" : "border-border opacity-70 hover:opacity-100"
            }`}
          >
            <img src={src} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kit Brasil — Camisa + Copo Térmico Edição Limitada" },
      {
        name: "description",
        content:
          "Garanta a Camisa do Brasil e o Copo Térmico Edição Limitada com desconto exclusivo. Estoque limitado para a Copa do Mundo.",
      },
      { property: "og:title", content: "Kit Brasil — Edição Limitada Copa do Mundo" },
      {
        property: "og:description",
        content: "Camisa + Copo Térmico estilo Stanley com desconto. Edição Limitada.",
      },
    ],
  }),
  component: LandingPage,
});

// ============================================================
//  Compra → leva para a página de endereço (/checkout)
//  e em seguida redireciona para o gateway KatorzePay.
// ============================================================

function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <FontsLink />
      <Header />
      <Hero />
      <ScarcityBanner />
      <Products />
      <SocialProof />
      <Guarantees />
      <Footer />
    </div>
  );
}

function FontsLink() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
    </>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/85 border-b border-border">
      <div className="mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-brasil shadow-glow grid place-items-center font-display font-black text-primary-foreground">
            B
          </div>
          <span className="font-display font-extrabold text-lg tracking-tight">
            Kit<span className="text-gradient-brasil">Brasil</span>
          </span>
        </a>
        <a
          href="#produtos"
          className="inline-flex items-center gap-1 rounded-full bg-foreground text-background px-4 py-2 text-sm font-semibold hover:opacity-90 transition"
        >
          Ver Ofertas <ChevronRight className="h-4 w-4" />
        </a>
      </div>
    </header>
  );
}

function Hero() {
  const navigate = useNavigate();
  return (
    <section id="top" className="relative overflow-hidden bg-gradient-hero">
      <div className="mx-auto max-w-6xl px-4 pt-10 pb-16 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary/80 text-secondary-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider">
            <Flame className="h-3.5 w-3.5" /> Edição Limitada Copa do Mundo
          </span>
          <h1 className="mt-4 text-4xl md:text-6xl font-black leading-[1.05]">
            O Kit Definitivo para o <span className="text-gradient-brasil">Torcedor Brasileiro</span>
          </h1>
          <p className="mt-5 text-base md:text-lg text-muted-foreground max-w-xl">
            Camisa Oficial + Copo Térmico Edição Limitada juntos com desconto exclusivo.
            Vista o amarelinho, brinde a vitória e leve o Brasil com você.
          </p>
          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-sm text-muted-foreground line-through">R$ 399,80</span>
            <span className="text-4xl md:text-5xl font-display font-black text-gradient-brasil">R$ 279,90</span>
          </div>
          <p className="mt-1 text-xs font-semibold text-primary">Economize R$ 119,90 levando o kit completo</p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate({ to: "/checkout", search: { produto: "kit" } })}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brasil text-primary-foreground px-6 py-4 font-bold text-base shadow-glow hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Garantir Meu Kit <ChevronRight className="h-5 w-5" />
            </button>
            <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" /> Compra 100% Segura
            </div>
          </div>
          <div className="mt-6 flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex -space-x-1">
              {[0,1,2,3,4].map(i => <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />)}
            </div>
            <span><b className="text-foreground">+2.000</b> torcedores já garantiram</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -inset-6 bg-gradient-brasil opacity-20 blur-3xl rounded-full" />
          <img
            src={heroImg}
            alt="Camisa do Brasil e Copo Térmico Edição Limitada"
            width={1600}
            height={1200}
            className="relative w-full rounded-3xl shadow-card"
          />
        </div>
      </div>
    </section>
  );
}

function ScarcityBanner() {
  const [time, setTime] = useState({ h: 5, m: 42, s: 17 });
  useEffect(() => {
    const t = setInterval(() => {
      setTime(p => {
        let s = p.s - 1, m = p.m, h = p.h;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 0; m = 0; s = 0; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div className="bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm">
        <span className="inline-flex items-center gap-2 font-semibold">
          <Clock className="h-4 w-4 text-secondary" />
          Oferta encerra em:
        </span>
        <div className="flex items-center gap-1.5 font-display font-bold">
          <TimeBox v={pad(time.h)} l="h" />
          <span className="text-secondary">:</span>
          <TimeBox v={pad(time.m)} l="m" />
          <span className="text-secondary">:</span>
          <TimeBox v={pad(time.s)} l="s" />
        </div>
        <span className="text-background/70">• Restam poucas unidades do Copo Edição Limitada</span>
      </div>
    </div>
  );
}

function TimeBox({ v, l }: { v: string; l: string }) {
  return (
    <span className="bg-secondary text-secondary-foreground rounded-md px-2 py-1 tabular-nums">
      {v}<span className="text-[10px] opacity-70 ml-0.5">{l}</span>
    </span>
  );
}

function Products() {
  const navigate = useNavigate();
  const handleBuyCamisa = () => navigate({ to: "/checkout", search: { produto: "camisa" } });
  const handleBuyCopo = () => navigate({ to: "/checkout", search: { produto: "copo" } });
  const handleBuyKit = () => navigate({ to: "/checkout", search: { produto: "kit" } });
  return (
    <section id="produtos" className="py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-primary">Nossos Produtos</span>
          <h2 className="mt-2 text-3xl md:text-5xl font-black">Escolha o seu favorito</h2>
          <p className="mt-3 text-muted-foreground">Ou leve o kit completo e economize ainda mais.</p>
        </div>

        {/* KIT COMPLETO — OFERTA PRINCIPAL */}
        <article className="relative mb-8 md:mb-10 bg-card rounded-3xl overflow-hidden border-2 border-primary shadow-glow grid md:grid-cols-2">
          <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gradient-brasil text-primary-foreground px-3 py-1.5 text-xs font-black uppercase tracking-wider shadow-glow">
              <Flame className="h-3.5 w-3.5" /> Mais Vendido • Kit Completo
            </span>
            <span className="inline-flex items-center rounded-full bg-foreground text-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
              Economize R$ 119,90
            </span>
          </div>
          <div className="bg-gradient-to-br from-primary/15 to-secondary/15">
            <ProductGallery images={[heroImg, heroImg2, heroImg3]} alt="Kit Definitivo Brasil — Camisa + Copo Térmico" />
          </div>
          <div className="p-6 md:p-10 flex flex-col justify-center">
            <h3 className="font-display text-2xl md:text-3xl font-black">
              Kit Definitivo <span className="text-gradient-brasil">Brasil</span>
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Camisa Oficial + Copo Térmico Edição Limitada. O combo definitivo do torcedor.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {[
                "1x Camisa Oficial Brasil (dry-fit premium) — tamanhos P, M, G, GG",
                "1x Copo Térmico original Stanley (24h gelado) com nome personalizado",
                "Personalização premium gravada no copo (até 15 caracteres)",
                "Frete e envio prioritários",
              ].map(b => (
                <li key={b} className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex items-baseline gap-3">
              <span className="text-sm text-muted-foreground line-through">R$ 399,80</span>
              <span className="text-4xl md:text-5xl font-display font-black text-gradient-brasil">R$ 279,90</span>
            </div>
            <p className="mt-1 text-xs font-semibold text-primary">ou 12x de R$ 27,99 sem juros</p>
            <button
              onClick={handleBuyKit}
              className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brasil text-primary-foreground px-6 py-5 font-black text-lg shadow-glow hover:scale-[1.02] active:scale-[0.98] transition"
            >
              Garantir Kit Completo <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </article>

        <div className="text-center mb-6 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          ou compre separadamente
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          {/* CAMISA */}
          <article className="group bg-card rounded-3xl overflow-hidden shadow-card border border-border flex flex-col">
            <ProductGallery images={[camisaImg, camisaImg2, camisaImg3]} alt="Camisa Oficial Brasil" />
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <h3 className="font-display text-2xl font-extrabold">Camisa Oficial Brasil</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Tecido dry-fit premium, leve e respirável. Conforto absoluto dentro e fora do estádio. Disponível nos tamanhos <b className="text-foreground">P, M, G e GG</b>.
              </p>
              <div className="mt-5 flex items-baseline gap-2">
                <span className="text-3xl font-display font-black">R$ 149,90</span>
                <span className="text-sm text-muted-foreground line-through">R$ 199,90</span>
              </div>
              <button
                onClick={handleBuyCamisa}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground px-6 py-4 font-bold hover:bg-[var(--brasil-green-deep)] transition"
              >
                Comprar Camisa <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </article>

          {/* COPO — DESTAQUE */}
          <article className="group relative bg-card rounded-3xl overflow-hidden border-2 border-secondary shadow-yellow flex flex-col">
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 items-start">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary text-secondary-foreground px-3 py-1.5 text-xs font-black uppercase tracking-wider animate-pulse-glow">
                <Flame className="h-3.5 w-3.5" /> Edição Limitada
              </span>
              <span className="inline-flex items-center rounded-full bg-foreground text-background px-3 py-1 text-[11px] font-bold uppercase tracking-wider">
                -40% Oferta Exclusiva
              </span>
            </div>
            <div className="bg-gradient-to-br from-secondary/15 to-primary/15">
              <ProductGallery images={[copoImg, copoImg2, copoImg3]} alt="Copo Térmico Brasil Edição Limitada" fit="contain" />
            </div>
            <div className="p-6 md:p-8 flex flex-col flex-1">
              <h3 className="font-display text-2xl md:text-3xl font-black">
                Copo Térmico Brasil <span className="text-gradient-brasil">Edição Limitada</span>
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                {[
                  "Gela bebidas por até 24 horas",
                  "Design exclusivo com a bandeira do Brasil",
                  "Aço inox premium — alta durabilidade",
                ].map(b => (
                  <li key={b} className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-sm text-muted-foreground line-through">R$ 249,90</span>
                <span className="text-4xl md:text-5xl font-display font-black text-gradient-brasil">R$ 149,90</span>
              </div>
              <p className="mt-1 text-xs font-semibold text-primary">ou 12x de R$ 14,99 sem juros</p>
              <button
                onClick={handleBuyCopo}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-brasil text-primary-foreground px-6 py-5 font-black text-lg shadow-glow hover:scale-[1.02] active:scale-[0.98] transition"
              >
                Garantir Meu Copo <ChevronRight className="h-5 w-5" />
              </button>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                ⚡ Restam apenas <b className="text-foreground">37 unidades</b> em estoque
              </p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  const reviews = [
    { n: "Lucas M.", t: "Copo sensacional! Mantém a cerveja gelada o jogo inteiro. Vale cada centavo.", r: 5 },
    { n: "Ana P.", t: "Chegou rápido, qualidade impecável. Já comprei outro pra presentear.", r: 5 },
    { n: "Rafael S.", t: "A camisa veste muito bem e o tecido é super confortável. Recomendo demais!", r: 5 },
    { n: "Juliana R.", t: "Comprei o kit completo. O acabamento do copo é de luxo, parece original Stanley.", r: 5 },
  ];
  return (
    <section className="py-16 md:py-20 bg-muted/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-black">Quem comprou, aprovou</h2>
          <p className="mt-2 text-muted-foreground">+2.000 torcedores satisfeitos pelo Brasil</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reviews.map(r => (
            <div key={r.n} className="bg-card rounded-2xl p-5 border border-border shadow-card">
              <div className="flex gap-0.5 mb-2">
                {Array.from({ length: r.r }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                ))}
              </div>
              <p className="text-sm text-foreground/90">"{r.t}"</p>
              <p className="mt-3 text-xs font-bold text-muted-foreground">— {r.n}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guarantees() {
  const items = [
    { i: ShieldCheck, t: "Compra Garantida", d: "7 dias para troca ou devolução" },
    { i: Lock, t: "Pagamento Seguro", d: "Ambiente 100% criptografado" },
    { i: Truck, t: "Envio Rápido", d: "Para todo o Brasil com rastreio" },
  ];
  return (
    <section className="py-12 md:py-16">
      <div className="mx-auto max-w-6xl px-4 grid sm:grid-cols-3 gap-4">
        {items.map(({ i: Icon, t, d }) => (
          <div key={t} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-5 shadow-card">
            <div className="h-12 w-12 rounded-xl bg-gradient-brasil grid place-items-center shrink-0">
              <Icon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <p className="font-bold">{t}</p>
              <p className="text-xs text-muted-foreground">{d}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-6xl px-4 py-10 grid sm:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-brasil grid place-items-center font-display font-black text-primary-foreground">
              B
            </div>
            <span className="font-display font-extrabold text-lg">KitBrasil</span>
          </div>
          <p className="mt-3 text-sm text-background/70 max-w-sm">
            A loja oficial do torcedor brasileiro. Edição Limitada Copa do Mundo.
          </p>
        </div>
        <div className="sm:text-right text-sm text-background/70 space-y-1">
          <p>Política de Privacidade · Termos de Uso</p>
          <p>Contato: suporte@kitbrasil.com</p>
          <p className="text-xs text-background/50">© {new Date().getFullYear()} KitBrasil. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
