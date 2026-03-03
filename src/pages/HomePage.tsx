import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="flex-1">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-3xl space-y-6">
          <h1 className="text-5xl font-bold tracking-tight">
            Brand Assets in Seconds
          </h1>
          <p className="text-xl text-muted-foreground">
            Enter your company name, pick from 30 unique logo variations, and download
            production-ready SVG files. Favicons, doc headers, and more coming soon. Free, no sign-up required.
          </p>
          <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/create">Create Your Logo</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold text-lg">Enter Your Name</h3>
              <p className="text-muted-foreground text-sm">
                Type your company or brand name and hit generate.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold text-lg">Browse & Customize</h3>
              <p className="text-muted-foreground text-sm">
                Pick from 30 variations. Change the icon, font, and colors to
                match your brand.
              </p>
            </div>
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold text-lg">Download SVGs</h3>
              <p className="text-muted-foreground text-sm">
                Export horizontal and vertical layouts for both light and dark
                backgrounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { title: '30+ Variations', desc: 'Different combinations of fonts, icons, and color palettes.' },
              { title: 'Per-Letter Colors', desc: 'Each letter can have its own color from curated palettes.' },
              { title: '200,000+ Icons', desc: 'Search and browse icons from Iconify\'s massive library.' },
              { title: 'Curated Fonts', desc: 'Hand-picked display fonts from Google Fonts that look great in logos.' },
              { title: 'Dark & Light Mode', desc: 'Export SVGs optimized for both dark and light backgrounds.' },
              { title: 'Self-Contained SVGs', desc: 'Text is converted to paths. No font dependencies in exports.' },
            ].map((f) => (
              <div key={f.title} className="border rounded-lg p-4">
                <h3 className="font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-muted/50">
        <div className="container mx-auto text-center space-y-4">
          <h2 className="text-3xl font-bold">Ready to Build Your Brand?</h2>
          <p className="text-muted-foreground">
            Start with a logo in under 30 seconds. No sign-up, no payment.
          </p>
          <Button asChild size="lg">
            <Link to="/create">Get Started</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
