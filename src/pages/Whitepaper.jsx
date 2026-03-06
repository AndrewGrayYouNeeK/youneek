import React, { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileDown, ShieldCheck, Coins, PieChart, Heart, CheckCircle2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function Whitepaper() {
  const printRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    setError('');
    setDownloading(true);
    try {
      const element = printRef.current;
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#0f172a' });
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgProps = { width: canvas.width, height: canvas.height };
      const imgRatio = imgProps.width / imgProps.height;
      const pageWidth = pdfWidth;
      const pageHeight = pageWidth / imgRatio;

      let position = 0;
      let heightLeft = pageHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pageHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      while (heightLeft > -pdfHeight) {
        position = heightLeft - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pageWidth, pageHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
      }

      pdf.save('YouNeeK-Whitepaper.pdf');
    } catch (e) {
      console.error('PDF export failed', e);
      setError('Could not generate the PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const Section = ({ icon: Icon, title, children }) => (
    <Card className="bg-white/5 border-white/10 text-white">
      <CardHeader className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center">
          <Icon className="h-5 w-5" />
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-white/80 leading-relaxed space-y-3">{children}</CardContent>
    </Card>
  );

  const Pill = ({ children }) => (
    <span className="inline-flex items-center rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/20 text-xs px-2 py-1">{children}</span>
  );

  return (
    <div className="min-h-screen bg-slate-950 py-16">
      <div className="max-w-5xl mx-auto px-6">
        <header className="text-center mb-10">
          <Badge className="bg-purple-500/20 text-purple-300 border-purple-400/30 mb-3">Whitepaper</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">YouNeeK (YNK) Vision & Tokenomics</h1>
          <p className="text-white/70 max-w-2xl mx-auto">Complete transparency for potential holders — our mission, mechanics, and roadmap to fund urgent veterinary care.</p>
        </header>

        <div className="flex justify-center mb-8">
          <Button onClick={handleDownload} disabled={downloading} className="bg-emerald-600 hover:bg-emerald-700">
            <FileDown className="h-4 w-4 mr-2" /> {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </Button>
        </div>
        {error && <p className="text-center text-amber-300 mb-6">{error}</p>}

        <div ref={printRef} className="space-y-6">
          <Section icon={Heart} title="Mission Statement">
            <p>
              YouNeeK (YNK) is a community-driven token with a single purpose: fund lifesaving veterinary care
              for pets in crisis. Every trade helps build a transparent treasury that goes directly to real-world
              treatment costs and recovery stories.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Transparent on-chain tracking of wallet inflows and vet payments</li>
              <li>Impact-first operations with published case outcomes</li>
              <li>Simple donation options: crypto and card (USD)</li>
            </ul>
          </Section>

          <Section icon={PieChart} title="Tokenomics Overview">
            <p>
              The token supply and mechanics are designed to create sustainable impact while protecting holders.
              Below is a high-level structure; consult official announcements for any parameter updates.
            </p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-white/60 text-sm">Total Supply</div>
                <div className="text-white text-2xl font-semibold">TBA</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-white/60 text-sm">Circulating Supply</div>
                <div className="text-white text-2xl font-semibold">TBA</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-white/60 text-sm">Initial Liquidity</div>
                <div className="text-white text-2xl font-semibold">TBA</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="text-white/60 text-sm">Locks & Vesting</div>
                <div className="text-white text-2xl font-semibold">TBA</div>
              </div>
            </div>
            <div className="text-xs text-white/50 mt-2">Note: Replace "TBA" with finalized numbers.</div>
          </Section>

          <Section icon={Coins} title="Tax Distribution">
            <p>
              A portion of each trade funds the Vet Care Treasury. Distribution example (update to your exact
              parameters):
            </p>
            <ul className="grid md:grid-cols-2 gap-3">
              <li className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Vet Care Treasury</span>
                <Pill>TBA%</Pill>
              </li>
              <li className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Liquidity</span>
                <Pill>TBA%</Pill>
              </li>
              <li className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Operations</span>
                <Pill>TBA%</Pill>
              </li>
              <li className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                <span>Marketing/Community</span>
                <Pill>TBA%</Pill>
              </li>
            </ul>
            <div className="text-xs text-white/50 mt-2">Ensure these match the contract and public docs.</div>
          </Section>

          <Section icon={ShieldCheck} title="Utility & Transparency">
            <ul className="space-y-2">
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-300" /> Live wallet transparency with on-chain explorer links</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-300" /> Community governance over case prioritization</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-300" /> Success stories published after funded treatments</li>
              <li className="flex items-start gap-2"><CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-300" /> Simple donations flow: crypto and Base44 Payments (USD)</li>
            </ul>
          </Section>

          <Section icon={Heart} title="Future Vet Care Initiatives">
            <p>
              Our roadmap expands direct financial support to pets in need and builds partnerships for discounts
              and faster treatment approvals.
            </p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Emergency micro-grants for urgent procedures</li>
              <li>Clinic partnerships for reduced pricing and priority slots</li>
              <li>Public dashboard for case pipeline and funding progress</li>
              <li>Regional ambassador program to vet (no pun intended) applications</li>
            </ul>
          </Section>
        </div>
      </div>
    </div>
  );
}