"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Calculator, CheckCircle2 } from "lucide-react";

export default function SavingsCalculator() {
  const [teamSize, setTeamSize] = useState<number>(4);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(12);
  const [hourlyRate, setHourlyRate] = useState<number>(18);

  // Calculations
  const weeklyHoursLost = teamSize * hoursPerWeek;
  const annualHoursLost = weeklyHoursLost * 50; // 50 working weeks
  const annualPayrollWasted = annualHoursLost * hourlyRate;

  // A planning assumption, not a guaranteed automation result.
  const reclaimedHours = Math.round(annualHoursLost * 0.85);
  const annualSavings = Math.round(annualPayrollWasted * 0.85);

  return (
    <div className="studio-tool p-6 sm:p-10 lg:p-12 relative">
      {/* Background radial accent */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        {/* Left: Interactive Controls */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Automation savings estimate</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-semibold text-ink tracking-tight">
            See where automation could save time
          </h3>

          <p className="text-muted text-sm leading-relaxed">
            Adjust your team size, time spent and hourly cost to estimate the value of work that could be automated.
          </p>

          <div className="space-y-6 pt-2">
            {/* Slider 1: Team Size */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm font-medium">
                <label htmlFor="team-size" className="text-muted">Team members</label>
                <span className="font-mono text-accent font-semibold text-base px-2.5 py-0.5 rounded bg-surface-muted border border-line">
                  {teamSize} {teamSize === 1 ? "person" : "people"}
                </span>
              </div>
              <input
                id="team-size"
                type="range"
                min="1"
                max="25"
                step="1"
                value={teamSize}
                onChange={(e) => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-subtle">
                <span>1 operator</span>
                <span>12 team</span>
                <span>25+ enterprise</span>
              </div>
            </div>

            {/* Slider 2: Hours per week */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm font-medium">
                <label htmlFor="hours-per-week" className="text-muted">Manual hours per person / week</label>
                <span className="font-mono text-accent font-semibold text-base px-2.5 py-0.5 rounded bg-surface-muted border border-line">
                  {hoursPerWeek} hrs / week
                </span>
              </div>
              <input
                id="hours-per-week"
                type="range"
                min="4"
                max="30"
                step="1"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-subtle">
                <span>4 hrs (minimal)</span>
                <span>15 hrs (typical)</span>
                <span>30 hrs (severe bottleneck)</span>
              </div>
            </div>

            {/* Slider 3: Blended Hourly Cost */}
            <div className="space-y-2">
              <div className="flex flex-wrap justify-between items-center gap-2 text-sm font-medium">
                <label htmlFor="hourly-rate" className="text-muted">Hourly cost (USD)</label>
                <span className="font-mono text-accent font-semibold text-base px-2.5 py-0.5 rounded bg-surface-muted border border-line">
                  ${hourlyRate} / hour
                </span>
              </div>
              <input
                id="hourly-rate"
                type="range"
                min="8"
                max="60"
                step="2"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                className="w-full h-2 bg-surface-muted rounded-lg appearance-none cursor-pointer accent-accent"
              />
              <div className="flex justify-between text-xs text-subtle">
                <span>$8/hr</span>
                <span>$30/hr</span>
                <span>$60/hr</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Calculated Yield Card */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl bg-canvas border border-accent/30 p-6 sm:p-8 space-y-6 shadow-sm relative">
            <div className="flex items-center justify-between pb-4 border-b border-line">
              <span className="text-xs text-muted">
                Estimated annual capacity
              </span>
              <span className="text-xs text-accent font-semibold px-2 py-0.5 rounded bg-accent/10">
                85% assumption
              </span>
            </div>

            {/* Big Metrics */}
            <div className="space-y-4" aria-live="polite" aria-atomic="true">
              <div>
                <span className="text-xs text-muted block mb-1">Recoverable Team Hours:</span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-semibold text-ink">
                    {reclaimedHours.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-accent">hours / year</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-muted block mb-1">Estimated time value:</span>
                <div className="flex flex-wrap items-baseline gap-2">
                  <span className="text-4xl font-semibold text-accent">
                    ${annualSavings.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted">/ year in payroll capacity</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-surface-muted/90 border border-line text-xs text-muted space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Based on 50 working weeks and an assumed 85% reduction in the selected manual work.</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent shrink-0" />
                <span>Recovered time is capacity, not guaranteed cash savings. Project costs and ongoing fees are not included.</span>
              </div>
            </div>

            <Link
              href={`/contact?service=business-automation&message=We%20currently%20have%20${teamSize}%20team%20members%20spending%20approximately%20${hoursPerWeek}%20hours%20per%20week%20on%20manual%20workflows.`}
              className="motion-btn group w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-full font-semibold text-on-accent bg-accent hover:bg-accent-strong transition-colors text-sm shadow-sm"
            >
              Discuss this workflow
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
