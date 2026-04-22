const About = () => (
  <div className="min-h-screen bg-background pt-16">
    <div className="border-b border-border bg-secondary py-16">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">Our Heritage</p>
        <h1 className="font-display text-5xl font-bold text-foreground md:text-6xl">About Tembo Premium Spirits</h1>
        <div className="mx-auto mt-6 h-0.5 w-20 bg-primary" />
      </div>
    </div>

    <div className="container mx-auto max-w-5xl px-4 py-20">
      <div className="mb-20 grid items-center gap-12 md:grid-cols-2">
        <div>
          <img
            src="/images/about/about-distillery.jpg"
            alt="Tembo Distillery"
            className="w-full rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
        <div>
          <h2 className="mb-6 font-display text-3xl text-foreground">Our Story</h2>
          <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
            Tembo Premium Spirits is born from a deep passion for crafting exceptional spirits
            that celebrate African heritage, tradition, and modern innovation.
          </p>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Every bottle reflects our commitment to quality, authenticity, and excellence -
            from carefully selected ingredients to masterful distillation and aging processes.
          </p>
        </div>
      </div>

      <div className="mb-20 grid items-center gap-12 md:grid-cols-2">
        <div className="order-2 md:order-1">
          <h2 className="mb-6 font-display text-3xl text-foreground">Our Collection</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Watermelon Gin - Refreshing, vibrant, and full of summer energy
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Tropical Gin - Exotic botanicals bringing paradise flavours
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Soulicto Gin - Smooth, soulful, and elegantly refined
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Ginsky - A bold and unique gin-whisky fusion
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Funga Caramel Brandy - Rich, warm, and luxurious
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Mshale Caramel Vodka - Deep, toasted, and exquisite
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-1 text-primary">*</span>
              Risasi Vanilla Whisky - Smooth, aromatic, and unforgettable
            </li>
          </ul>
        </div>
        <div className="order-1 md:order-2">
          <img
            src="/images/about/about-barrels.jpg"
            alt="Aging Barrels"
            className="w-full rounded-2xl shadow-lg"
            loading="lazy"
          />
        </div>
      </div>

      <div className="mb-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <img
              src="/images/about/about-team.jpg"
              alt="Our Team"
              className="w-full rounded-2xl shadow-lg"
              loading="lazy"
            />
          </div>
          <div>
            <h2 className="mb-6 font-display text-3xl text-foreground">Crafted with Pride</h2>
            <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
              Our dedicated team brings together generations of distilling knowledge
              with a modern vision to create spirits that stand out in every glass.
            </p>
            <p className="text-lg leading-relaxed text-muted-foreground">
              Whether you're enjoying a refreshing gin, a smooth brandy, or a warm whisky,
              every sip tells the story of passion, heritage, and uncompromising quality.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-12 text-center">
        <h2 className="mb-4 font-display text-3xl text-foreground">Crafted for Every Moment</h2>
        <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
          From celebrations with friends to quiet evenings of reflection -
          Tembo Premium Spirits are made to enhance life's finest moments.
        </p>
        <p className="mt-6 text-sm text-muted-foreground">
          Available in 750ml full bottles and convenient 50ml tasters.
        </p>
      </div>
    </div>
  </div>
);

export default About;
