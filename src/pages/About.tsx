const About = () => (
  <div className="pt-16 min-h-screen">
    <div className="bg-secondary border-b border-border py-12">
      <div className="container mx-auto px-4 text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-2">Our Heritage</p>
        <h1 className="font-display text-4xl text-foreground">About Tembo Spirits</h1>
        <div className="w-16 h-0.5 bg-primary mx-auto mt-4" />
      </div>
    </div>

    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img src="/images/about/about-distillery.jpg" alt="Tembo Distillery" className="rounded-lg w-full" loading="lazy" />
        </div>
        <div>
          <h2 className="font-display text-2xl text-foreground mb-4">Our Story</h2>
          <p className="text-muted-foreground mb-4">
            Tembo Spirits is born from a passion for crafting exceptional spirits that celebrate African heritage and innovation. 
            Each bottle in our collection represents the perfect blend of tradition and creativity.
          </p>
          <p className="text-muted-foreground">
            From our refreshing Watermelon and Tropical Gins to the rich depth of Funga and Mshale Caramel Brandies, 
            and the smooth warmth of Risasi Vanilla Whisky — every spirit is crafted with care and pride.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="order-2 md:order-1">
          <h2 className="font-display text-2xl text-foreground mb-4">Our Collection</h2>
          <ul className="space-y-3 text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Watermelon Gin — Refreshing, vibrant, summer in a glass</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Tropical Gin — Exotic botanicals, paradise flavours</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Soulicto Gin — Smooth, soulful, refined</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Ginsky — Bold gin-whisky fusion, one of a kind</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Funga Caramel Brandy — Rich, warm, luxurious</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Mshale Caramel Brandy — Deep, toasted, exquisite</li>
            <li className="flex items-start gap-2"><span className="text-primary">•</span> Risasi Vanilla Whisky — Smooth, aromatic, unforgettable</li>
          </ul>
        </div>
        <div className="order-1 md:order-2">
          <img src="/images/about/about-barrels.jpg" alt="Aging Barrels" className="rounded-lg w-full" loading="lazy" />
        </div>
      </div>

      <div className="text-center bg-card border border-border rounded-lg p-10">
        <h2 className="font-display text-2xl text-foreground mb-4">Crafted for Every Moment</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Whether you're celebrating with friends, enjoying a quiet evening, or exploring new flavours — 
          Tembo has a spirit for every occasion. Available in 750ml bottles and convenient 50ml tasters.
        </p>
      </div>
    </div>
  </div>
);

export default About;
