import FloatingBadge from "@/components/floating-badge";
import { Hero } from "@/components/hero";
import PageWrapper from "@/components/wrapper/page-wrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Hero />
      <FloatingBadge />
    </PageWrapper>
  );
}
