import React from "react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { TrustedFor } from "@/components/marketing/trusted-for";
import { Problems } from "@/components/marketing/problems";
import { ProductOverview } from "@/components/marketing/product-overview";
import { Showcase } from "@/components/marketing/showcase";
import { Benefits } from "@/components/marketing/benefits";
import { FAQ } from "@/components/marketing/faq";
import { CTA } from "@/components/marketing/cta";
import { Footer } from "@/components/marketing/footer";

export default async function Homepage() {
  let isLoggedIn = false;
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    isLoggedIn = !!user;
  } catch (error) {
    // Suppress cookies/session errors during build-time static rendering
    isLoggedIn = false;
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans antialiased">
      <Header isLoggedIn={isLoggedIn} />
      <main className="flex-1">
        <Hero isLoggedIn={isLoggedIn} />
        <TrustedFor />
        <Problems />
        <ProductOverview />
        <Showcase />
        <div id="pricing" className="scroll-mt-14">
          <Benefits />
        </div>
        <FAQ />
        <CTA isLoggedIn={isLoggedIn} />
      </main>
      <Footer />
    </div>
  );
}
export const dynamic = "force-dynamic";
export const revalidate = 0;
