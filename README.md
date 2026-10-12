# AZURA Hotel & Spa — Portfolio Website

Hotel (mehmonxona) mavzusida portfolio / taqdimot sayti.

## ✨ Xususiyatlar

- **Liquid Glass dizayn** — Apple uslubidagi shisha (glassmorphism) panellar, yaltiroq chiziqlar, suzuvchi gradient sharlar
- **Tun / Kun rejimi** — qorong'i (to'q ko'k) va yorug' (och ko'k) tema, `localStorage` bilan saqlanadi, tizim sozlamasiga moslashadi
- **To'q ko'k + och ko'k** asosiy rang palitrasi
- **Hotel rasmlari** — xonalar, basseyn, SPA, restoran, lobby, rooftop
- Responsive (mobil, planshet, desktop)
- Scroll animatsiyalar, raqamli hisoblagichlar
- Sharhlar slideri (drag / swipe qo'llab-quvvatlaydi)
- Galereya lightbox
- Bron qilish formasi + toast bildirishnomasi

## 🗂 Struktura

```
hotel/
├── index.html        # Asosiy sahifa
├── css/style.css     # Liquid glass dizayn tizimi (kun/tun)
├── js/main.js        # Interaktivlik
└── images/           # Hotel rasmlari
```

## 🚀 Ishga tushirish

```bash
# Oddiy statik server (Python)
python3 -m http.server 3000

# yoki
npx serve .
```

Brauzerda `http://localhost:3000` ni oching.

## 🎨 Dizayn tizimi

| Token        | Tun (dark)   | Kun (light) |
| ------------ | ------------ | ----------- |
| Fon          | `#040b1c`    | `#eaf3fd`   |
| Accent       | `#4ea8ff`    | `#4ea8ff`   |
| Accent 2     | `#7dd3fc`    | `#7dd3fc`   |
| Shisha       | rgba ko'k    | oq 48-66%   |

Shriftlar: **Manrope** (asosiy) + **Playfair Display** (aksent).

---

## 🏛 AZURA Architects — Arxitektura portfolio (SOFT UI)

`architecture/` papkasida — **SOFT UI (neumorfizm)** uslubidagi arxitektura
portfolio sayti. Hotel saytidan mustaqil, o‘z `index.html`, `css/`, `js/` va
`images/` to‘plamiga ega.

- **Soft UI / neumorphism** — yumshoq ikki tomonlama soyalar, bosilgan (inset) sirtlar
- **Tun / Kun rejimi** — to‘q ko‘k (tun) va och ko‘k (kun), `localStorage` + tizim sozlamasi
- **Asosiy ranglar** — och ko‘k `#e8f0fa` / to‘q ko‘k `#101c2e`, aksent `#2f80d9` / `#5fb2ff`
- AI generatsiya qilingan 10 ta arxitektura rasmi (minoralar, muzey, pavilon, interyer, studiya)
- Loyihalar filtri (Madaniy / Turar-joy / Ofis / Interer), galereya lightbox,
  animatsion hisoblagichlar, aloqa formasi + toast

```bash
cd architecture && python3 -m http.server 3000
```
