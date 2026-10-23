"use client";

import { useState, useMemo } from "react";
import { formatUsd } from "@/config/site";
import type { ApartmentUnit } from "@/data/launch-offer";
import { depositAmount, monthlyAmount } from "@/data/launch-offer";

interface PaymentCalculatorProps {
  /** Pre-selected unit to init with, or null for custom price */
  initialUnit?: ApartmentUnit;
  /** All units for the tabs */
  units?: ApartmentUnit[];
}

export function PaymentCalculator({ initialUnit, units = [] }: PaymentCalculatorProps) {
  const [selectedUnit, setSelectedUnit] = useState<ApartmentUnit | null>(initialUnit ?? units[0] ?? null);
  const [customPrice, setCustomPrice] = useState<number>(selectedUnit?.price_usd ?? 114900);
  const [useCustom, setUseCustom] = useState(false);

  const price = useCustom ? customPrice : (selectedUnit?.price_usd ?? 0);
  const depositPct = selectedUnit?.deposit_pct ?? 10;
  const monthlyPct = selectedUnit?.monthly_pct ?? 2;
  const months = selectedUnit?.months ?? 45;

  const deposit = useMemo(() => Math.round(price * (depositPct / 100)), [price, depositPct]);
  const monthly = useMemo(() => Math.round(price * (monthlyPct / 100)), [price, monthlyPct]);
  const total = useMemo(() => deposit + monthly * months, [deposit, monthly, months]);

  return (
    <div className="bg-card border border-border rounded-2xl p-6 sm:p-8">
      <h2 className="text-xl font-bold text-foreground mb-6">Calculateur de paiement</h2>

      {/* Unit tabs */}
      {units.length > 0 && (
        <div className="flex gap-2 mb-6 flex-wrap">
          {units.map((u) => (
            <button
              key={u.id}
              onClick={() => { setSelectedUnit(u); setUseCustom(false); }}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                !useCustom && selectedUnit?.id === u.id
                  ? "bg-navy text-white border-navy"
                  : "bg-background text-foreground border-border hover:border-navy"
              }`}
            >
              {u.label}
            </button>
          ))}
          <button
            onClick={() => setUseCustom(true)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              useCustom
                ? "bg-navy text-white border-navy"
                : "bg-background text-foreground border-border hover:border-navy"
            }`}
          >
            Prix personnalisé
          </button>
        </div>
      )}

      {/* Custom price input */}
      {useCustom && (
        <div className="mb-6">
          <label htmlFor="custom-price" className="block text-sm font-medium text-foreground mb-2">
            Prix du bien ($)
          </label>
          <input
            id="custom-price"
            type="number"
            min={10000}
            step={1000}
            value={customPrice}
            onChange={(e) => setCustomPrice(Number(e.target.value))}
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-cta"
          />
        </div>
      )}

      {/* Result grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <ResultCard label="Prix du bien" value={formatUsd(price)} accent={false} />
        <ResultCard label={`Acompte (${depositPct} %)`} value={formatUsd(deposit)} accent={true} />
        <ResultCard label={`Mensualité (${monthlyPct} %)`} value={formatUsd(monthly)} accent={false} />
        <ResultCard label={`Durée`} value={`${months} mois`} accent={false} />
      </div>

      {/* Total check */}
      <div className="mt-4 p-4 bg-secondary rounded-xl flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Total vérifié : {depositPct}% + {months} × {monthlyPct}% = {depositPct + months * monthlyPct}%
        </span>
        <span className="font-bold text-foreground">{formatUsd(total)}</span>
      </div>

      <p className="text-xs text-muted-foreground mt-3">
        * Calcul indicatif. Acompte = {depositPct}% du prix. Mensualités = {monthlyPct}% × {months} mois.
      </p>
    </div>
  );
}

function ResultCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent: boolean;
}) {
  return (
    <div className="bg-background rounded-xl p-4 border border-border text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`font-bold text-lg ${accent ? "text-cta" : "text-foreground"}`}>{value}</p>
    </div>
  );
}
