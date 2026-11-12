/* Niyet sayfaları (yalnız TR). Ürün sayfalarıyla aynı şablonla üretilir: tools/build-seo.mjs */
import core from './core.mjs';
import saglikTurizmi from './saglik-turizmi.mjs';
import brans from './brans.mjs';
import sozluk from './sozluk.mjs';

export const TOPICS = [...core, ...saglikTurizmi, ...brans, ...sozluk];
