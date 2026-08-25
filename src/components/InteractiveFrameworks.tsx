import React, { useState } from 'react';
import { FrameworkData } from '../types';
import { Calculator, CheckCircle, AlertTriangle, Sparkles, DollarSign, Scale } from 'lucide-react';

interface Props {
  framework: FrameworkData;
}

export const InteractiveFrameworks: React.FC<Props> = ({ framework }) => {
  // PMF Score State
  const [veryDisappointed, setVeryDisappointed] = useState<number>(34);
  const [somewhatDisappointed, setSomewhatDisappointed] = useState<number>(45);
  const [notDisappointed, setNotDisappointed] = useState<number>(21);

  // Runway Calc State
  const [cashBalance, setCashBalance] = useState<number>(250000);
  const [monthlyExpenses, setMonthlyExpenses] = useState<number>(30000);
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(8000);
  const [growthRate, setGrowthRate] = useState<number>(10);

  // LTV CAC State
  const [arpu, setArpu] = useState<number>(99); // Monthly ARPU
  const [churnRate, setChurnRate] = useState<number>(4.5); // %
  const [grossMargin, setGrossMargin] = useState<number>(80); // %
  const [cac, setCac] = useState<number>(650);

  // Equity Split State
  const [f1Commit, setF1Commit] = useState<number>(100);
  const [f2Commit, setF2Commit] = useState<number>(100);
  const [f1Tech, setF1Tech] = useState<number>(90);
  const [f2Tech, setF2Tech] = useState<number>(20);
  const [f1Biz, setF1Biz] = useState<number>(30);
  const [f2Biz, setF2Biz] = useState<number>(85);
  const [f1Capital, setF1Capital] = useState<number>(25000);
  const [f2Capital, setF2Capital] = useState<number>(10000);

  // Render Sean Ellis PMF Test
  if (framework.type === 'pmf-score') {
    const total = veryDisappointed + somewhatDisappointed + notDisappointed || 1;
    const pmfPercent = Math.round((veryDisappointed / total) * 100);
    const hasPmf = pmfPercent >= 40;

    return (
      <div id="framework-pmf-scorecard" className="my-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-2xs font-sans">
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] tracking-widest uppercase">
          <Sparkles className="w-4 h-4" />
          Interactive Founder Diagnostic
        </div>
        <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100 font-serif">{framework.title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">{framework.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">
              "Very Disappointed" Users
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                type="range"
                min="0"
                max="200"
                value={veryDisappointed}
                onChange={(e) => setVeryDisappointed(Number(e.target.value))}
                className="w-full accent-emerald-600"
              />
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[32px] text-right">{veryDisappointed}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Core superfans</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-blue-700 dark:text-blue-400 mb-1">
              "Somewhat Disappointed" Users
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                type="range"
                min="0"
                max="200"
                value={somewhatDisappointed}
                onChange={(e) => setSomewhatDisappointed(Number(e.target.value))}
                className="w-full accent-blue-600"
              />
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[32px] text-right">{somewhatDisappointed}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Potential converters</span>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              "Not Disappointed" Users
            </label>
            <div className="flex items-center justify-between gap-2">
              <input
                type="range"
                min="0"
                max="200"
                value={notDisappointed}
                onChange={(e) => setNotDisappointed(Number(e.target.value))}
                className="w-full accent-slate-500"
              />
              <span className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 min-w-[32px] text-right">{notDisappointed}</span>
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">Lukewarm / Wrong ICP</span>
          </div>
        </div>

        {/* Score Display Banner */}
        <div className={`p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between gap-4 ${
          hasPmf 
            ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800' 
            : 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg ${
              hasPmf ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {pmfPercent}%
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                {hasPmf ? <CheckCircle className="w-4 h-4 text-emerald-600" /> : <AlertTriangle className="w-4 h-4 text-rose-600" />}
                {hasPmf ? 'Target Benchmark Reached (PMF Active)' : 'Pre-PMF Zone (<40% Threshold)'}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                {hasPmf 
                  ? 'Your core retention is robust. You are ready to accelerate deliberate acquisition channels.' 
                  : 'Do not scale paid marketing or hire bloated teams yet. Focus on interviewing your "Very Disappointed" cohort.'}
              </p>
            </div>
          </div>
          <div className="text-xs font-mono px-3 py-1.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            Total Sample: <span className="font-bold">{total}</span>
          </div>
        </div>
      </div>
    );
  }

  // Runway & Default Alive Calculator
  if (framework.type === 'runway-calc') {
    const netBurn = Math.max(0, monthlyExpenses - monthlyRevenue);
    const runwayMonths = netBurn > 0 ? (cashBalance / netBurn).toFixed(1) : 'Infinite (Profitable)';
    const numericMonths = netBurn > 0 ? cashBalance / netBurn : 999;
    const isDefaultAlive = numericMonths > 18 || (monthlyRevenue > 0 && growthRate > 12 && numericMonths > 10);

    return (
      <div id="framework-runway-calculator" className="my-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-2xs font-sans">
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] tracking-widest uppercase">
          <Calculator className="w-4 h-4" />
          Financial Health Diagnostic
        </div>
        <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100 font-serif">{framework.title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">{framework.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Cash in Bank ($)</label>
            <input
              type="number"
              value={cashBalance}
              onChange={(e) => setCashBalance(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Expenses ($)</label>
            <input
              type="number"
              value={monthlyExpenses}
              onChange={(e) => setMonthlyExpenses(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Revenue ($)</label>
            <input
              type="number"
              value={monthlyRevenue}
              onChange={(e) => setMonthlyRevenue(Math.max(0, Number(e.target.value)))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">MoM Growth Rate (%)</label>
            <input
              type="number"
              value={growthRate}
              onChange={(e) => setGrowthRate(Number(e.target.value))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Net Monthly Burn</div>
            <div className="text-xl font-bold font-mono text-rose-600 dark:text-rose-400 mt-0.5">
              ${netBurn.toLocaleString()}/mo
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estimated Runway</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              {runwayMonths} {typeof runwayMonths === 'string' && runwayMonths.includes('Infinite') ? '' : 'Months'}
            </div>
          </div>

          <div className={`p-4 rounded-lg border flex items-center gap-3 ${
            isDefaultAlive 
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800 text-emerald-900 dark:text-emerald-300' 
              : 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800 text-rose-900 dark:text-rose-300'
          }`}>
            {isDefaultAlive ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />}
            <div>
              <div className="font-bold text-sm">{isDefaultAlive ? 'Default Alive' : 'Default Dead'}</div>
              <p className="text-[11px] opacity-80 leading-snug">
                {isDefaultAlive ? 'Strong runway position. You control your fate.' : 'Must cut burn or accelerate monetization.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LTV:CAC Unit Economics Tool
  if (framework.type === 'ltv-cac') {
    const monthlyChurnDecimal = Math.max(0.1, churnRate) / 100;
    const customerLifetimeMonths = 1 / monthlyChurnDecimal;
    const ltv = arpu * customerLifetimeMonths * (grossMargin / 100);
    const ltvCacRatio = cac > 0 ? (ltv / cac).toFixed(2) : '0';
    const paybackMonths = arpu * (grossMargin / 100) > 0 
      ? (cac / (arpu * (grossMargin / 100))).toFixed(1) 
      : '∞';

    const numericRatio = Number(ltvCacRatio);
    const isHealthy = numericRatio >= 3.0 && Number(paybackMonths) <= 12;

    return (
      <div id="framework-ltv-cac-diagnostic" className="my-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-2xs font-sans">
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] tracking-widest uppercase">
          <DollarSign className="w-4 h-4" />
          Unit Economics Diagnostic
        </div>
        <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100 font-serif">{framework.title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">{framework.description}</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly ARPU ($)</label>
            <input
              type="number"
              value={arpu}
              onChange={(e) => setArpu(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Monthly Churn (%)</label>
            <input
              type="number"
              step="0.5"
              value={churnRate}
              onChange={(e) => setChurnRate(Math.max(0.1, Number(e.target.value)))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Gross Margin (%)</label>
            <input
              type="number"
              value={grossMargin}
              onChange={(e) => setGrossMargin(Math.min(100, Math.max(1, Number(e.target.value))))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>

          <div className="bg-white dark:bg-slate-800 p-3.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Blended CAC ($)</label>
            <input
              type="number"
              value={cac}
              onChange={(e) => setCac(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-1.5 text-sm font-mono border rounded-lg dark:bg-slate-900 dark:border-slate-700 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">Customer Lifetime Value (LTV)</div>
            <div className="text-xl font-bold font-mono text-emerald-600 dark:text-emerald-400 mt-0.5">
              ${Math.round(ltv).toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Lifetime: {customerLifetimeMonths.toFixed(1)} mo</div>
          </div>

          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
            <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">CAC Payback Period</div>
            <div className="text-xl font-bold font-mono text-slate-900 dark:text-slate-100 mt-0.5">
              {paybackMonths} Months
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Target: &lt; 12 months</div>
          </div>

          <div className={`p-4 rounded-lg border flex items-center gap-3 ${
            isHealthy 
              ? 'bg-emerald-50 border-emerald-300 dark:bg-emerald-950/40 dark:border-emerald-800' 
              : 'bg-rose-50 border-rose-300 dark:bg-rose-950/40 dark:border-rose-800'
          }`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
              isHealthy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}>
              {ltvCacRatio}x
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900 dark:text-slate-100">
                {isHealthy ? 'SaaS Gold Standard (≥3.0x)' : 'Sub-Optimal Unit Economics'}
              </div>
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                {isHealthy ? 'Unit economics support aggressive expansion.' : 'Raise pricing or reduce churn before scaling paid ads.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Equity Split Alignment
  if (framework.type === 'equity-split') {
    const f1Score = (f1Commit * 0.4) + (f1Tech * 0.3) + (f1Biz * 0.2) + ((f1Capital / 50000) * 10);
    const f2Score = (f2Commit * 0.4) + (f2Tech * 0.3) + (f2Biz * 0.2) + ((f2Capital / 50000) * 10);
    const totalScore = f1Score + f2Score || 1;
    const f1Share = Math.round((f1Score / totalScore) * 100);
    const f2Share = 100 - f1Share;

    return (
      <div id="framework-equity-matrix" className="my-8 p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shadow-2xs font-sans">
        <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 font-bold text-[11px] tracking-widest uppercase">
          <Scale className="w-4 h-4" />
          Co-Founder Equity Alignment Matrix
        </div>
        <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-slate-100 font-serif">{framework.title}</h3>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-6">{framework.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Founder 1 */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-3 flex items-center justify-between">
              <span>Founder A (Technical / Product)</span>
              <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">
                {f1Share}% Suggested
              </span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Full-Time Commitment</span>
                  <span className="font-mono font-bold">{f1Commit}%</span>
                </div>
                <input type="range" min="20" max="100" value={f1Commit} onChange={(e) => setF1Commit(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Technical / Engineering Execution</span>
                  <span className="font-mono font-bold">{f1Tech} pts</span>
                </div>
                <input type="range" min="0" max="100" value={f1Tech} onChange={(e) => setF1Tech(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Sales & GTM / Fundraising</span>
                  <span className="font-mono font-bold">{f1Biz} pts</span>
                </div>
                <input type="range" min="0" max="100" value={f1Biz} onChange={(e) => setF1Biz(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
            </div>
          </div>

          {/* Founder 2 */}
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
            <h4 className="font-bold text-sm text-blue-900 dark:text-blue-300 mb-3 flex items-center justify-between">
              <span>Founder B (GTM / Commercial)</span>
              <span className="font-mono text-xs bg-blue-100 dark:bg-blue-900/50 px-2 py-0.5 rounded text-blue-700 dark:text-blue-300">
                {f2Share}% Suggested
              </span>
            </h4>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Full-Time Commitment</span>
                  <span className="font-mono font-bold">{f2Commit}%</span>
                </div>
                <input type="range" min="20" max="100" value={f2Commit} onChange={(e) => setF2Commit(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Technical / Engineering Execution</span>
                  <span className="font-mono font-bold">{f2Tech} pts</span>
                </div>
                <input type="range" min="0" max="100" value={f2Tech} onChange={(e) => setF2Tech(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
              <div>
                <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1">
                  <span>Sales & GTM / Fundraising</span>
                  <span className="font-mono font-bold">{f2Biz} pts</span>
                </div>
                <input type="range" min="0" max="100" value={f2Biz} onChange={(e) => setF2Biz(Number(e.target.value))} className="w-full accent-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-400">
          <span className="font-bold text-slate-900 dark:text-slate-100">Critical Takeaway:</span> Regardless of split, ensure both founders sign a standard 4-year vesting schedule with a 1-year cliff and 10% unallocated employee stock option pool (ESOP) reserved for early hires.
        </div>
      </div>
    );
  }

  return null;
};

