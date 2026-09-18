# Ana sayfa yenileme doğrulaması

Tarih: 18 Eylül 2026

## Sonuç

Ana sayfa; etkileşimli deney önizlemesi, kullanım akışı, mevcut veriden gelen konu/deney/görev sayıları, tamamlanma durumunu gösteren öğrenme yolu, öğrenci/öğretmen kullanım örnekleri ve açılır sık sorulan sorularla yenilendi.

## Mimari ve kapsam

- LandingPage bölümleri birleştirir ve kendi kaydırma alanındaki bölüm geçişini yönetir. Görsel bölümler components/landing altında ayrıdır.
- Önizleme, mevcut senaryoları ve resolveBond sonucunu kullanır. Kimyasal sonuçlar animasyon süresinden çıkarılmaz; yeni sınıflandırma yazılmadı.
- Her önizleme kendi Zustand store ve çizim motoru örneğine sahiptir. Ana laboratuvar store'una yazan önizleme eylemi yoktur. Bağımsız örnekler ve laboratuvarın değişmemesi test edildi.
- FittedRenderEngine, enjekte edilen IRenderEngine çizimini dar alana ölçekler. Mevcut molekül çizimleri ve kimya stratejileri değiştirilmedi. Canvas dönüşümü save/restore ile sınırlandırılır.
- Yeni bağımlılık, sunucu, Context, CSS dosyası, gölge veya gradyan eklenmedi. Mevcut tema renkleri, Tailwind, SPA yolları ve ders/görev akışları kullanıldı.

## .agents öz denetimi

- Değişen kaynak ve test dosyalarında symbol === / id === taraması: eşleşme yok.
- ExperimentPreview.tsx içindeki scenarioId === karşılaştırmaları yalnızca seçili önizleme verisini ve basılı düğme görünümünü bulur; kimya sonucu üretmez.
- Paylaşılan değişken bir oynatma store'u veya renderer singleton'ı eklenmedi. Dosya düzeyindeki deney tabloları yalnız okunur katalog verisidir.
- Yeni sayısal çalışma parametreleri açıklamalı, adlandırılmış sabitlerdir. Tailwind sınıfları tasarım ölçeğini kullanır.
- Yeni Canvas adaptörünün yanında sınır değerlerini ve bağımsız tüketicileri kapsayan Vitest dosyası bulunur. Yeni store ve katalog entegrasyonu da test edildi.
- git diff --check: geçti. Yeni kaynaklarda ham any: yok.

## Tarayıcı doğrulaması

Yerel Vite uygulaması Codex tarayıcısında kontrol edildi. agent-browser CLI ortamda bulunmadığı için mevcut tarayıcı otomasyonu kullanıldı.

- 320, 375, 768, 1024 ve 1440 piksel görünümler incelendi. Kontrol edilen ana sayfa etkileşim hedefleri en az 40×40 piksel; dar ekranlarda yatay içerik taşması görülmedi.
- Açık/koyu temalar incelendi; kullanıcının başlangıçtaki açık tema tercihi geri yüklendi.
- NaCl, H₂O, O₂ ve He + Ne seçimleri doğru açıklama, çizim ve deney bağlantısını gösterdi.
- Oynatma, duraklatma, başa alma, doğal animasyon tamamlanması, yeniden oynatma ve klavyeyle Home/End zaman çizgisi kontrolü doğrulandı.
- Öğrenme bölümüne geçiş, bölüm odağını ve sayfa içi kaydırmayı güncelledi.
- Kaydedilmiş tamamlanan konu göstergesi görüntülendi. Test sırasında öğrenme ilerlemesi değiştirilmedi.
- Sık sorulan sorular açıldı; modelin sınırlarını açıklayan metin doğrulandı.
- Öğrenci, öğretmen, konu, görev listesi ve H₂O laboratuvarına geçiş doğrulandı. H₂O laboratuvarında doğru senaryo ve H/O seçimleri görüldü. Geri gezinmeyle ana sayfa önizlemesi yeniden açıldı.
- Son sürümün temiz tarayıcı sekmesinde hata/uyarı konsol kaydı: [].

## Gerçek derleme çıktısı

```text
> chemlab@1.0.0 build
> tsc && vite build

vite v5.4.21 building for production...
transforming...
✓ 1923 modules transformed.
rendering chunks...
computing gzip size...
dist/index.html                   1.36 kB │ gzip:   0.78 kB
dist/assets/index-DQLe4p5C.css   33.74 kB │ gzip:   7.35 kB
dist/assets/index-DpGXEnEt.js   382.68 kB │ gzip: 111.91 kB
✓ built in 1.86s
```

## Gerçek test çıktısı

Mevcut npm test yapılandırması .kilo/worktrees/future-sing altındaki test kopyalarını da keşfediyor. Aşağıdaki 213 test toplamı bu kopyaları içerir. Bu değişikliğin 17 yeni testi üç dosyada yer alır. Node'un localStorage deneysel uyarısı başarısızlık üretmedi.

```text
> chemlab@1.0.0 test
> vitest run


 RUN  v2.1.9 /Users/mehmetcankocakurt/Documents/development/ChemLab

(node:35851) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/store/useLearningProgressStore.test.ts (5 tests) 2ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/strategies/IonicReactionStrategy.test.ts (8 tests) 3ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/strategies/CovalentReactionStrategy.test.ts (9 tests) 3ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/strategies/ReactionEngine.test.ts (13 tests) 9ms
 ✓ src/lib/chemistry/strategies/IonicReactionStrategy.test.ts (8 tests) 3ms
 ✓ src/lib/chemistry/strategies/ReactionEngine.test.ts (13 tests) 8ms
 ✓ src/lib/chemistry/strategies/CovalentReactionStrategy.test.ts (9 tests) 5ms
(node:35881) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ .kilo/worktrees/future-sing/src/store/useLearningProgressStore.test.ts (5 tests) 4ms
 ✓ src/lib/chemistry/strategies/InertReactionStrategy.test.ts (5 tests) 14ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/strategies/InertReactionStrategy.test.ts (5 tests) 6ms
 ✓ src/lib/canvas/FittedRenderEngine.test.ts (7 tests) 3ms
 ✓ .kilo/worktrees/future-sing/src/data/teachingExperiments.test.ts (7 tests) 7ms
 ✓ src/data/teachingExperiments.test.ts (7 tests) 3ms
 ✓ src/store/createLandingPreviewStore.test.ts (9 tests) 6ms
 ✓ src/navigation/routes.test.ts (6 tests) 2ms
 ✓ .kilo/worktrees/future-sing/src/navigation/routes.test.ts (6 tests) 4ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/taskEvaluation.test.ts (3 tests) 4ms
 ✓ src/lib/canvas/RenderEngine.test.ts (3 tests) 5ms
 ✓ src/data/learningTopics.test.ts (4 tests) 4ms
 ✓ src/lib/chemistry/taskEvaluation.test.ts (3 tests) 5ms
 ✓ .kilo/worktrees/future-sing/src/lib/canvas/RenderEngine.test.ts (3 tests) 9ms
 ✓ src/store/useChemistryStore.test.ts (4 tests) 5ms
 ✓ .kilo/worktrees/future-sing/src/data/learningTopics.test.ts (4 tests) 3ms
(node:35910) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ .kilo/worktrees/future-sing/src/store/useThemeStore.test.ts (3 tests) 3ms
(node:35908) ExperimentalWarning: localStorage is not available because --localstorage-file was not provided.
(Use `node --trace-warnings ...` to show where the warning was created)
 ✓ src/store/useThemeStore.test.ts (3 tests) 5ms
 ✓ .kilo/worktrees/future-sing/src/store/useChemistryStore.test.ts (4 tests) 29ms
 ✓ src/lib/canvas/animationPhysics.test.ts (4 tests) 4ms
 ✓ .kilo/worktrees/future-sing/src/lib/canvas/animationPhysics.test.ts (4 tests) 6ms
 ✓ src/navigation/shareOrigin.test.ts (3 tests) 3ms
 ✓ src/store/useLessonSessionStore.test.ts (3 tests) 2ms
 ✓ .kilo/worktrees/future-sing/src/store/useLessonSessionStore.test.ts (3 tests) 6ms
 ✓ .kilo/worktrees/future-sing/src/navigation/shareOrigin.test.ts (3 tests) 3ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/singleElementGuide.test.ts (2 tests) 2ms
 ✓ src/lib/chemistry/singleElementGuide.test.ts (2 tests) 7ms
 ✓ src/lib/chemistry/equationFormatter.test.ts (2 tests) 3ms
 ✓ .kilo/worktrees/future-sing/src/presentation/revealPolicy.test.ts (4 tests) 3ms
 ✓ src/presentation/revealPolicy.test.ts (4 tests) 2ms
 ✓ .kilo/worktrees/future-sing/src/lib/chemistry/equationFormatter.test.ts (2 tests) 2ms
 ✓ src/store/useTaskSessionStore.test.ts (2 tests) 2ms
 ✓ .kilo/worktrees/future-sing/src/store/useTaskSessionStore.test.ts (2 tests) 4ms
 ✓ src/store/useSharedExperimentSessionStore.test.ts (2 tests) 2ms
 ✓ .kilo/worktrees/future-sing/src/store/useSharedExperimentSessionStore.test.ts (2 tests) 2ms
 ✓ src/data/learningTasks.test.ts (1 test) 3ms
 ✓ src/data/landingExperiments.test.ts (1 test) 3ms
 ✓ src/store/useTeacherPresentationStore.test.ts (2 tests) 1ms
 ✓ .kilo/worktrees/future-sing/src/data/learningTasks.test.ts (1 test) 5ms
 ✓ .kilo/worktrees/future-sing/src/store/useTeacherPresentationStore.test.ts (2 tests) 1ms
 ✓ src/data/sharedExperiment.test.ts (2 tests) 3ms
 ✓ .kilo/worktrees/future-sing/src/data/sharedExperiment.test.ts (2 tests) 2ms
 ✓ src/data/teacherFlows.test.ts (1 test) 3ms
 ✓ .kilo/worktrees/future-sing/src/data/teacherFlows.test.ts (1 test) 3ms

 Test Files  51 passed (51)
      Tests  213 passed (213)
   Start at  14:12:46
   Duration  3.32s (transform 1.14s, setup 0ms, collect 3.10s, tests 229ms, environment 5ms, prepare 3.05s)
```
