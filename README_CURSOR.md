# Fitness App - Cursor Übergabe

## 📋 Schnellübersicht

Diese Fitness-App ist eine vollständig funktionale React/TypeScript Anwendung mit 14 Screens, konsistentem Design-System und ruhiger, minimaler Ästhetik.

## 🎯 Was ist fertig implementiert

### ✅ Core Features
- ✅ Complete UI/UX für alle 14 Screens
- ✅ Responsive Design (Desktop + Mobile)
- ✅ Navigation System (Desktop Horizontal + Mobile Bottom)
- ✅ Design System mit Tokens in `/styles/globals.css`
- ✅ Reusable Components (Button, Card, Input, ProgressBar)
- ✅ Workout Tracking Flow
- ✅ Nutrition Tracking
- ✅ Progress Visualization (Recharts)
- ✅ Schedule System mit 3 View-Modi
- ✅ AI Coach Chat Interface (UI ready, mock responses)
- ✅ Workout History mit Calendar
- ✅ Profile Management
- ✅ Settings Panel
- ✅ Fitness Tools (BMI, 1RM, Macro Calculator)

### 🔄 Ready for Implementation
- ⏳ Backend API Integration (alle Screens bereit)
- ⏳ Ollama AI Coach Connection (Interface fertig)
- ⏳ Data Persistence (LocalStorage oder Backend)
- ⏳ User Authentication (UI fertig, Backend offen)

## 📁 Wichtige Dateien für Cursor

### Dokumentation (UNBEDINGT LESEN!)
1. **`/CURSOR_HANDOFF.md`** - Vollständige Projekt-Dokumentation
   - Design-Philosophie & Tokens
   - Alle 14 Screens im Detail
   - User Flows
   - Komponenten-Struktur
   - Nächste Schritte

2. **`/IMPLEMENTATION_GUIDE.md`** - Praktischer Coding Guide
   - Code Patterns & Conventions
   - Component Templates
   - Häufige Use Cases
   - Best Practices
   - Troubleshooting

### Core Files
3. **`/App.tsx`** - Main Router & State Manager
4. **`/styles/globals.css`** - Design Tokens & Typography
5. **`/components/Navigation.tsx`** - App Navigation
6. **`/components/screens/`** - Alle Screen Components

## 🚀 Quick Start

```bash
# Dependencies installieren
npm install

# Dev Server starten
npm run dev

# App läuft auf http://localhost:5173 (oder ähnlich)
```

## 🎨 Design System TL;DR

### Farben
```css
Primary:     #4B75FF
Background:  #F3F4F6
Cards:       #FAFBFC
Text:        #1D1F21
Muted:       #6B7280
Success:     #8BC6A8
```

### Typografie
- **H1**: 56px - Nur für Hero
- **H2**: 32px - Screen Titel
- **H3**: 22px - Section Titel
- **Body**: 16px - Normaler Text
- **Font**: Inter / SF Pro

### Spacing
- Sections: 80px
- Components: 24-32px
- Cards: 12px gap
- Border Radius: 8-12px

### Tone of Voice
⚠️ **WICHTIG**: Ruhig, sachlich, neutral
- ❌ KEINE Ausrufezeichen
- ❌ KEINE motivierende Sprache
- ✅ Unterstützend und klar

## 📱 Alle Screens

1. **Landing Page** - Hero + Feature Cards
2. **Auth Screen** - Login/Register
3. **Dashboard** - Overview + Quick Actions
4. **Workout Overview** - Workout Selection
5. **Workout Session** - Active Workout Tracking
6. **Workout Complete** - Success Screen
7. **Schedule** - 3-Day/Week/Month Views + Add Workout
8. **Nutrition** - Macro Tracking + Meal Logging
9. **Progress** - Stats + Charts (Recharts)
10. **Workout History** - Calendar + Filtered List
11. **Profile** - User Info + Achievements
12. **Settings** - Preferences + Account
13. **Tools** - BMI/1RM/Macro Calculators
14. **AI Coach** - Chat Interface (Ready for Ollama)

## 🔧 Tech Stack

- **Framework**: React + TypeScript
- **Styling**: Tailwind CSS v4.0
- **Icons**: lucide-react
- **Charts**: recharts
- **Animations**: motion/react (Framer Motion successor)
- **UI Components**: Custom + shadcn/ui library available

## 📦 Projektstruktur

```
/
├── App.tsx                      # Main Router
├── styles/globals.css           # Design System
├── components/
│   ├── Button.tsx              # Primary Component
│   ├── Card.tsx                # Container Component
│   ├── Input.tsx               # Form Component
│   ├── Navigation.tsx          # App Navigation
│   ├── ProgressBar.tsx         # Progress Indicator
│   └── screens/                # 14 Screen Components
│       ├── Dashboard.tsx
│       ├── AICoach.tsx
│       ├── Schedule.tsx
│       └── ...
├── CURSOR_HANDOFF.md           # 📖 Vollständige Doku
├── IMPLEMENTATION_GUIDE.md     # 💻 Coding Guide
└── README_CURSOR.md            # 📋 Diese Datei
```

## 🎯 Für Cursor Agents

### Design Guidelines
✅ **Verwende**:
- Design Tokens aus `/styles/globals.css`
- HTML Semantik für Typography (`<h1>`, `<h2>`, `<p>`)
- Reusable Components (Button, Card, Input)
- Lucide Icons mit `size={20}` und `strokeWidth={1.5}`
- Tailwind für Spacing/Layout
- Neutraler Tone (keine Ausrufezeichen!)

❌ **Vermeide**:
- Custom font-size/font-weight classes (nutze HTML Elemente)
- Inline styles (außer für Schatten)
- Harte Farb-Codes (nutze Design Tokens)
- Motivierende/Emotionale Sprache
- Exclamation marks!

### Code Pattern
```tsx
interface ScreenProps {
  onNavigate?: (screen: string) => void;
}

export function Screen({ onNavigate }: ScreenProps) {
  return (
    <div className="min-h-screen bg-[#F3F4F6] px-6 py-12">
      <div className="max-w-[1200px] mx-auto">
        <div className="mb-12">
          <h2 className="mb-2">Screen Titel</h2>
          <p className="text-[#6B7280]">Beschreibung</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>{/* Content */}</Card>
        </div>
      </div>
    </div>
  );
}
```

## 🔗 Navigation Flow

```
Landing → Auth → Dashboard → [All Screens]
                     ↓
              Navigation Bar
           (persistent across app)
```

Navigation erfolgt über Callbacks:
```tsx
<Button onClick={() => onNavigate?.('workout-overview')}>
  Start Workout
</Button>
```

## 🎁 Bonus Features

- ✨ Smooth Animations (motion/react)
- 📊 Professional Charts (recharts mit fixed sizing)
- 📅 Advanced Schedule (3 view modes)
- 🤖 AI Coach Interface (ready for backend)
- 📱 Full Mobile Support
- ♿ Accessibility Basics
- 🎨 Consistent Design System

## 📝 Nächste Tasks für Cursor

### High Priority
1. **Backend Integration**
   - User Auth API
   - Workout Data Persistence
   - Nutrition Tracking Backend

2. **AI Coach Connection**
   - Ollama API Integration
   - Real-time streaming responses
   - Context management

3. **Data Persistence**
   - LocalStorage für offline data
   - API integration für sync

### Medium Priority
4. **Enhanced Features**
   - Workout Templates
   - Custom Exercise Library
   - Social sharing

5. **Performance**
   - Code splitting
   - Lazy loading
   - Image optimization

### Low Priority
6. **PWA Features**
   - Service Worker
   - Offline mode
   - Push notifications

## 🐛 Known Issues / Notes

1. **Recharts Sizing**: Charts benötigen explizite `width` und `height` Props
   ```tsx
   <ResponsiveContainer width={600} height={300}>
   ```

2. **AI Coach**: Verwendet Mock Responses - ready for Ollama integration

3. **State Management**: Aktuell local state - könnte zu Zustand/Redux migriert werden

4. **Data**: Alle Daten sind Mock Data - braucht Persistence Layer

## 🤝 Support

Bei Fragen:
1. Siehe `/CURSOR_HANDOFF.md` für Konzepte
2. Siehe `/IMPLEMENTATION_GUIDE.md` für Code Patterns
3. Siehe `/styles/globals.css` für Design Tokens
4. Siehe `/components/screens/Dashboard.tsx` für Screen Template Beispiel

## ✅ Checklist für neue Features

- [ ] Responsive Design (Mobile + Desktop)
- [ ] Design Tokens verwendet
- [ ] Tone of Voice eingehalten
- [ ] Navigation integriert
- [ ] Loading States
- [ ] Empty States
- [ ] Error Handling
- [ ] TypeScript Types definiert
- [ ] Reusable Components genutzt
- [ ] Hover/Focus States

---

**Die App ist production-ready für Frontend.**
**Backend Integration ist der nächste logische Schritt.**

Viel Erfolg! 🚀
