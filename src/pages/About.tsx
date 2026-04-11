const About = () => (
  <div className="pt-16 min-h-screen bg-background">
    {/* Hero Section */}
    <div className="bg-secondary border-b border-border py-16">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3">Our Heritage</p>
        <h1 className="font-display text-5xl md:text-6xl font-bold text-foreground">About Tembo Premium Spirits</h1>
        <div className="w-20 h-0.5 bg-primary mx-auto mt-6" />
      </div>
    </div>

    <div className="container mx-auto px-4 py-20 max-w-5xl">
      {/* Our Story + Distillery */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div>
          <img 
            src="/images/about/about-distillery.jpg" 
            alt="Tembo Distillery" 
            className="rounded-2xl w-full shadow-lg" 
            loading="lazy" 
          />
        </div>
        <div>
          <h2 className="font-display text-3xl text-foreground mb-6">Our Story</h2>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            Tembo Premium Spirits is born from a deep passion for crafting exceptional spirits 
            that celebrate African heritage, tradition, and modern innovation.
          </p>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Every bottle reflects our commitment to quality, authenticity, and excellence — 
            from carefully selected ingredients to masterful distillation and aging processes.
          </p>
        </div>
      </div>

      {/* Collection + Barrels */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="order-2 md:order-1">
          <h2 className="font-display text-3xl text-foreground mb-6">Our Collection</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Watermelon Gin — Refreshing, vibrant, and full of summer energy
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Tropical Gin — Exotic botanicals bringing paradise flavours
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Soulicto Gin — Smooth, soulful, and elegantly refined
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Ginsky — A bold and unique gin-whisky fusion
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Funga Caramel Brandy — Rich, warm, and luxurious
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Mshale Caramel Brandy — Deep, toasted, and exquisite
            </li>
            <li className="flex items-start gap-3">
              <span className="text-primary mt-1">•</span> 
              Risasi Vanilla Whisky — Smooth, aromatic, and unforgettable
            </li>
          </ul>
        </div>
        <div className="order-1 md:order-2">
          <img 
            src="/images/about/about-barrels.jpg" 
            alt="Aging Barrels" 
            className="rounded-2xl w-full shadow-lg" 
            loading="lazy" 
          />
        </div>
      </div>

      {/* Team / Final Section */}
      <div className="mb-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="/images/about/about-team.jpg" 
              alt="Our Team" 
              className="rounded-2xl w-full shadow-lg" 
              loading="lazy" 
            />
          </div>
          <div>
            <h2 className="font-display text-3xl text-foreground mb-6">Crafted with Pride</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              Our dedicated team brings together generations of distilling knowledge 
              with a modern vision to create spirits that stand out in every glass.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Whether you're enjoying a refreshing gin, a smooth brandy, or a warm whisky, 
              every sip tells the story of passion, heritage, and uncompromising quality.
            </p>
          </div>
        </div>
      </div>

      {/* Closing Statement */}
      <div className="text-center bg-card border border-border rounded-2xl p-12">
        <h2 className="font-display text-3xl text-foreground mb-4">Crafted for Every Moment</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          From celebrations with friends to quiet evenings of reflection — 
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