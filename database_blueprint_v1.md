# 🧠 Database Blueprint — Nutrition + Fitness + AI Platform  
Version 1.0 · Stand: 23.11.2025  

---

## 🎯 Ziel der Struktur

Diese Datenbankarchitektur ermöglicht:

- Lebensmitteltracking (Kalorien + Makros + Mikros, USDA + OpenFoodFacts)
- Fitnessübungen & Trainingspläne (strukturierter Aufbau + Variation)
- KI-basierte Empfehlungen, Health Score & personalisierte Meal- und Workout-Pläne
- Erweiterbarkeit ohne chaotisches Wachstum der Tabellenstruktur

Daten sind in **Schemas** organisiert, nicht als flache Tabellenliste.

---

## 🏗 Schema-Übersicht

| Schema | Inhalt | Status |
|--------|--------|--------|
| `auth` | Supabase Auth-System | unverändert |
| `app` | User Profile, Einstellungen, Restriktionen | aktiv |
| `fitness` | Übungen, Logs, Körperdaten, Trainingspläne | aktiv |
| `food_data` | USDA + OpenFoodFacts Nährwerte & Kategorien | aktiv |
| `ml` | Embeddings, KI-Kontext und generierte Inhalte | aktiv |
| `commerce` | Stripe Produkte, Abonnements (später) | optional |

---

## 📁 Schema: `app`

Zweck: **Benutzerverwaltung & Personalisierung**

| Tabelle | Beschreibung |
|---------|--------------|
| `user_profile` | Grunddaten (Alter, Gewicht, Ziel, Aktivitätslevel) |
| `preferences` | Ernährungstyp (vegan, halal, keto…), Geschmack |
| `restrictions` | Allergien, medizinische Einschränkungen |
| `premium_status` | Abo-Status für Freemium / Premium Model |

### Beziehungen

