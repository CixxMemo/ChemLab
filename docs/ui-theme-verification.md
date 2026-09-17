# Arayüz ve tema doğrulaması — 17 Eylül 2026

Laboratuvar başlığı sadeleştirildi; paylaşım ve grup filtreleri açılır alanlara taşındı. Masaüstündeki 60/40 tablo/simülasyon düzeni korundu. Mobil gezinme ve oynatma kontrolleri taşmadan kullanılabilir. Açık/koyu tema, ayrı bir Zustand store üzerinden saklanır; Tailwind renkleri ortak CSS değişkenlerini kullanır.

## Mimari ve kapsam kontrolü

- `.agents/agents.md` okundu ve uygulandı. Kimya verileri, hesapları, stratejiler ve Canvas motorları değiştirilmedi; yeni `/lib/chemistry` veya `/lib/canvas` fonksiyonu yok.
- Tema store'u yalnızca tema tercihinden sorumlu. Tema düğmesi ayrı bileşen; mevcut store'lara tema durumu eklenmedi. React Context veya yeni bağımlılık yok.
- Paylaşılan, değişebilir render motoru örneği eklenmedi. Her mevcut Canvas tüketicisinin kendi motor örneği korundu. Uygulama genelindeki tema tercihi Zustand'da tutuluyor; storage adaptörü tüketiciye özel render durumu taşımıyor.
- Yeni yerleşim ölçüleri açıklamalı CSS değişkenleriyle tanımlı. Kontroller standart Tailwind ölçüleri ve en az 40px dokunma hedeflerini kullanıyor. Tablo minimum genişliği 18 × 40px + 17 × 4px olarak tanımlı.
- `git diff --check` temiz. Ham `any` eklenmedi. Tema saklama/geri yükleme, geçersiz tercih ve engelli storage için üç test eklendi.
- Canvas ve elektronegatiflik haritası, mevcut çizim renkleriyle kontrastı korumak için açık temada da koyu yüzey kullanıyor.

## Kimlik karşılaştırmaları denetimi

Dokunulan dosyalardaki bütün `symbol ===` / `id ===` eşleşmeleri:

```text
src/components/table/ElementCell.tsx:18:  const isSelected = selectedElements.some(e => e.symbol === element.symbol);
src/components/table/ElementCell.tsx:19:  const isHovered = hoveredElement?.symbol === element.symbol;
src/components/simulation/SimulationModal.tsx:197:              const isActive = activeScenario?.id === sc.id;
src/components/simulation/SimulationModal.tsx:389:                    activeScenario?.id === sc.id
src/components/teacher/TeacherShareControls.tsx:12:  const validTaskId = tasks.some(task => task.id === taskId) ? taskId : null;
src/components/pages/LaboratoryPage.tsx:22:  const exists = scenarioId === null || scenarios.some(scenario => scenario.id === scenarioId);
src/components/table/CategoryLegend.tsx:22:      <summary className="touch-target flex cursor-pointer list-none items-center gap-2 text-slate-400 [&::-webkit-details-marker]:hidden"><SlidersHorizontal className="h-3.5 w-3.5" /> Element grupları <span className="ml-auto text-slate-300">{CATEGORIES.find(category => category.id === filterCategory)?.nameTR ?? (filterCategory ? 'Aktinitler' : 'Tümü')}</span><ChevronDown className="h-3.5 w-3.5 group-open:rotate-180" /></summary>

```

- `ElementCell`: mevcut seçili/üzerine gelinen hücreyi işaretleyen iki sunum karşılaştırması; kimya sonucu hesaplamıyor.
- `SimulationModal`: mevcut aktif senaryoyu vurgulayan iki sunum karşılaştırması.
- `LaboratoryPage`: mevcut URL'deki deneyin katalogda bulunup bulunmadığını kontrol ediyor.
- `TeacherShareControls`: mevcut paylaşım görevinin listede olup olmadığını kontrol ediyor.
- `CategoryLegend`: seçili filtrenin Türkçe etiketini bulmak için sunum karşılaştırması; yeni kimya sınıflandırması yok.

## Tarayıcı doğrulaması

agent-browser CLI ortamda bulunmadığı için Codex'in uygulama içi tarayıcısı kullanıldı. Kontrol edilen boyutlar: 1280×720, 1470×956 ve 390×844. Geçici viewport ayarı sonrasında sıfırlandı.

- Açık/koyu tema geçişi ve sayfa yenilemesinde tercihin korunması doğrulandı.
- Öğretmen tahmin görünümü, sıradaki cevabı açma (1/5), tüm cevapları açma (5/5) doğrulandı.
- Öğrenci bağlantısını kopyalama başarılı durum mesajı verdi.
- Büyük ekran deney modalı açıldı ve kapatıldı. Tarayıcının native Fullscreen API geçişi uygulama içi tarayıcıda gerçekleşmedi; bu mevcut kontrolün native tam ekran davranışı burada doğrulanamadı.
- Na araması, aramayı temizleme, Halojenler filtresi, filtreyi temizleme ve EN haritası geçişi doğrulandı.
- Atom kaldırma/yeniden seçme ve NaCl → H₂O deney değişimi doğrulandı.
- Oynatma, başa dönme, %10 ileri adım ve klavyeyle sürgüyü %100'e getirme doğrulandı.
- Mobilde alt oynatma/analiz alanına erişim ve ana sayfaya gezinme doğrulandı.
- Tarayıcı uygulama konsolunda hata/uyarı kaydı: `[]`.

## Gerçek derleme çıktısı

```text

> chemlab@1.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
transforming...
✓ 1911 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.36 kB │ gzip:   0.78 kB
dist/assets/index-CljmHEgo.css   31.10 kB │ gzip:   6.87 kB
dist/assets/index-CLDPlZnG.js   345.92 kB │ gzip: 100.28 kB
✓ built in 1.41s

```

## Gerçek test çıktısı

```text

> chemlab@1.0.0 test
> vitest run


 RUN  v2.1.9 /Users/mehmetcankocakurt/Documents/development/ChemLab

(node:14423) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/store/useLearningProgressStore.test.ts (5 tests) 2ms
 ✓ src/lib/chemistry/strategies/InertReactionStrategy.test.ts (5 tests) 3ms
 ✓ src/lib/chemistry/strategies/IonicReactionStrategy.test.ts (8 tests) 3ms
 ✓ src/lib/chemistry/strategies/CovalentReactionStrategy.test.ts (9 tests) 3ms
 ✓ src/data/teachingExperiments.test.ts (7 tests) 4ms
 ✓ src/lib/chemistry/strategies/ReactionEngine.test.ts (13 tests) 5ms
 ✓ src/lib/canvas/RenderEngine.test.ts (3 tests) 7ms
 ✓ src/lib/canvas/animationPhysics.test.ts (4 tests) 6ms
 ✓ src/navigation/routes.test.ts (6 tests) 7ms
 ✓ src/store/useLessonSessionStore.test.ts (3 tests) 2ms
 ✓ src/store/useChemistryStore.test.ts (4 tests) 3ms
(node:14434) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/store/useThemeStore.test.ts (3 tests) 2ms
 ✓ src/data/learningTopics.test.ts (4 tests) 13ms
 ✓ src/lib/chemistry/taskEvaluation.test.ts (3 tests) 8ms
 ✓ src/lib/chemistry/singleElementGuide.test.ts (2 tests) 2ms
 ✓ src/presentation/revealPolicy.test.ts (4 tests) 2ms
 ✓ src/store/useTaskSessionStore.test.ts (2 tests) 2ms
 ✓ src/lib/chemistry/equationFormatter.test.ts (2 tests) 2ms
 ✓ src/store/useTeacherPresentationStore.test.ts (2 tests) 1ms
 ✓ src/store/useSharedExperimentSessionStore.test.ts (2 tests) 4ms
 ✓ src/data/learningTasks.test.ts (1 test) 5ms
 ✓ src/data/teacherFlows.test.ts (1 test) 2ms
 ✓ src/data/sharedExperiment.test.ts (2 tests) 1ms

 Test Files  23 passed (23)
      Tests  95 passed (95)
   Start at  11:15:43
   Duration  1.26s (transform 538ms, setup 0ms, collect 1.27s, tests 89ms, environment 2ms, prepare 1.38s)


```
