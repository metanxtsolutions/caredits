import { Hero } from "@/components/home/Hero";
import { BrandStory } from "@/components/home/BrandStory";
import { FeaturedServices } from "@/components/home/FeaturedServices";
import { HowItWorks } from "@/components/home/HowItWorks";
import { PortfolioPreview } from "@/components/home/PortfolioPreview";
import { PackagesPreview } from "@/components/home/PackagesPreview";
import { Testimonials } from "@/components/home/Testimonials";
import { BrandsWorkedWith } from "@/components/home/BrandsWorkedWith";
import { InstagramFeed } from "@/components/home/InstagramFeed";
import { LatestVideos } from "@/components/home/LatestVideos";
import { Stats } from "@/components/home/Stats";
import { FaqPreview } from "@/components/home/FaqPreview";
import { CtaSection } from "@/components/home/CtaSection";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Hero />
      <BrandsWorkedWith />
      <BrandStory />
      <FeaturedServices />
      <HowItWorks />
      <Stats />
      <PortfolioPreview />
      <PackagesPreview />
      <Testimonials />
      <LatestVideos />
      <InstagramFeed />
      <FaqPreview />
      <CtaSection />
    </>
  );
}
