/* Niyet sayfalarının metinlerindeki fiyatlar: js/pricing.mjs'ten okunur, elle yazılmaz. */
import { PRICE_DATA } from '../../../js/pricing.mjs';

const usd = (n) => `$${n.toLocaleString('tr-TR')}`;

/* p('rec', 'voice') → "$300" */
export const p = (agent, opt) => {
  const a = PRICE_DATA.agents.find((x) => x.id === agent);
  const o = a && a.opts.find((x) => x.k === opt);
  if (!o) throw new Error(`fiyat yok: ${agent}/${opt}`);
  return usd(o.price);
};

export const INCLUDED = `${PRICE_DATA.includedMessages.toLocaleString('tr-TR')} mesaj ya da ${PRICE_DATA.includedMinutes.toLocaleString('tr-TR')} dakika`;
export const OVERAGE = `dakika başına $${PRICE_DATA.overage.minute}, mesaj başına $${PRICE_DATA.overage.message}`;
export const ANNUAL = `%${PRICE_DATA.annualDiscount * 100}`;
export const TRIO = { text: usd(PRICE_DATA.trioDiscount.text), voice: usd(PRICE_DATA.trioDiscount.voice) };
