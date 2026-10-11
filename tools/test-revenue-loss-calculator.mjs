import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../js/revenue-loss-calculator.js', import.meta.url), 'utf8');

function mount(lang) {
  const nodes = new Map();
  const get = (id) => {
    if (!nodes.has(id)) nodes.set(id, {
      textContent: '', hidden: id === 'field-toast' || id === 'field-toast-link', style: {}, handlers: {},
      addEventListener(name, handler) { this.handlers[name] = handler; },
    });
    return nodes.get(id);
  };
  const fields = Object.fromEntries([
    ['leads', '300'], ['conversion', '6'], ['target', '10'],
    ['value', '2500'], ['currency', 'EUR'],
  ].map(([key, value]) => [key, { value }]));
  const listeners = {};
  const form = {
    elements: { namedItem: (name) => fields[name] },
    addEventListener: (name, handler) => { listeners[name] = handler; },
  };
  const document = {
    documentElement: { lang },
    getElementById: (id) => id === 'loss-form' ? form : get(id),
  };
  vm.runInNewContext(script, { document, Intl, Number });
  return { get, fields, update: (field = 'conversion') => listeners.input({ target: fields[field] }) };
}

for (const lang of ['tr', 'en']) {
  const homepage = readFileSync(new URL(lang === 'tr' ? '../index.html' : '../index-en.html', import.meta.url), 'utf8');
  const embedded = homepage.match(/<section class="loss-calculator"[\s\S]*?<\/section>/)?.[0];
  assert.ok(embedded, `${lang} homepage embeds the calculator`);
  assert.ok(homepage.indexOf('class="pillars-wrap"') < homepage.indexOf('id="revenue-calculator"'));
  assert.ok(homepage.indexOf('id="revenue-calculator"') < homepage.indexOf('id="specification"'));
  assert.match(homepage, /href="#revenue-calculator"/);
  assert.match(homepage, /src="\/js\/revenue-loss-calculator\.js\?v=1"/);
  for (const id of ['loss-form', 'calc-results', 'monthly-value', 'annual-value', 'patient-count', 'rate-explainer', 'formula', 'calc-error', 'field-toast', 'field-toast-close', 'field-toast-label', 'field-toast-title', 'field-toast-body', 'field-toast-link', 'help-leads', 'help-conversion', 'help-target', 'help-value']) {
    assert.ok(embedded.includes(`id="${id}"`), `${lang} homepage includes ${id}`);
  }
  for (const [name, value] of [['leads', '300'], ['conversion', '6'], ['target', '10'], ['value', '2500']]) {
    assert.match(embedded, new RegExp(`name="${name}"[^>]*value="${value}"`));
  }
  const app = mount(lang);
  assert.equal(app.get('monthly-value').textContent, new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(30000));
  assert.match(app.get('annual-value').textContent, /360/);
  assert.equal(app.get('patient-count').textContent, '12');
  assert.match(app.get('rate-explainer').textContent, /6.*10.*4/);
  assert.match(app.get('formula').textContent, /300/);
  assert.equal(app.get('field-toast').hidden, true);

  app.fields.conversion.value = '9';
  app.update();
  assert.equal(app.get('field-toast').hidden, false);
  assert.match(app.get('field-toast-label').textContent, lang === 'tr' ? /DÖNÜŞÜM/ : /CONVERSION/);
  assert.match(app.get('field-toast-body').textContent, lang === 'tr' ? /ödeme yapan hasta/ : /paying patients/);
  assert.equal(app.get('field-toast-link').hidden, false);
  app.get('field-toast-close').handlers.click();
  assert.equal(app.get('field-toast').hidden, true);
  app.get('help-conversion').handlers.click();
  assert.equal(app.get('field-toast').hidden, false);
  assert.equal(app.get('patient-count').textContent, '3');
  assert.equal(app.get('monthly-value').textContent, new Intl.NumberFormat(lang === 'tr' ? 'tr-TR' : 'en-GB', {
    style: 'currency', currency: 'EUR', minimumFractionDigits: 0, maximumFractionDigits: 2,
  }).format(7500));
  app.fields.conversion.value = '6';
  app.update();
  assert.match(app.get('field-toast-label').textContent, lang === 'tr' ? /DÖNÜŞÜM/ : /CONVERSION/);

  app.fields.target.value = '12';
  app.update('target');
  assert.match(app.get('field-toast-label').textContent, lang === 'tr' ? /HEDEF/ : /TARGET/);
  assert.equal(app.get('field-toast-link').hidden, true);
  app.get('field-toast-close').handlers.click();
  app.get('help-target').handlers.click();
  assert.equal(app.get('field-toast').hidden, false);

  app.fields.value.value = '2000';
  app.update('value');
  assert.match(app.get('field-toast-label').textContent, lang === 'tr' ? /HASTA DEĞERİ/ : /PATIENT VALUE/);
  assert.match(app.get('field-toast-body').textContent, lang === 'tr' ? /kâr değildir/ : /not profit/);
  assert.equal(app.get('field-toast-link').hidden, true);
  app.fields.value.value = '2500';
  app.fields.target.value = '10';

  app.fields.leads.value = '0';
  app.update('leads');
  assert.equal(app.get('patient-count').textContent, '0');
  assert.equal(app.get('calc-results').hidden, false);
  assert.match(app.get('field-toast-label').textContent, lang === 'tr' ? /HASTA DEĞERİ/ : /PATIENT VALUE/);

  app.fields.leads.value = '301';
  app.update('leads');
  assert.equal(app.get('field-toast').hidden, false);
  assert.equal(app.get('field-toast-label').textContent, 'STOAIX Ads');
  assert.equal(app.get('field-toast-link').hidden, false);
  assert.equal(app.get('field-toast-link').href, '/stoaix-ads');
  app.get('field-toast-close').handlers.click();
  app.fields.leads.value = '302';
  app.update('leads');
  assert.equal(app.get('field-toast').hidden, true);
  app.get('help-leads').handlers.click();
  assert.equal(app.get('field-toast').hidden, false);
  assert.equal(app.get('field-toast-label').textContent, 'STOAIX Ads');

  app.fields.leads.value = '800';
  app.fields.conversion.value = '99';
  app.fields.target.value = '10';
  app.update();
  assert.equal(app.get('calc-results').hidden, true);
  assert.notEqual(app.get('calc-error').textContent, '');

  app.fields.conversion.value = '6';
  app.fields.currency.value = 'GBP';
  app.update();
  assert.equal(app.get('calc-results').hidden, false);
  assert.match(app.get('monthly-value').textContent, /£/);
  assert.equal(app.get('patient-count').textContent, '32');
}

console.log('Revenue scenario calculator: TR and EN homepage embeds, examples, four field prompts, zero, invalid rates, and currency passed.');
