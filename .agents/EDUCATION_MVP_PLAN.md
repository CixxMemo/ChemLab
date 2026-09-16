# ChemLab Eğitim MVP’si Geliştirme Planı

## Özet ve sabit kararlar

ChemLab, açılışta doğrudan periyodik tabloyu göstermek yerine bir **ana sayfa** açacak. Üst çubuktaki **Öğrenci** ve **Öğretmen** düğmeleri kullanıcıyı ayrı deneyimlere götürecek. Bunlar hesap veya yetki rolleri değil, kullanım modlarıdır; kullanıcı istediği zaman mod değiştirebilir.

MVP’nin hedefi tek seferde bitirilebilen, sınırları belirli bir ürün: Öğrenci bir konuyu kendi başına öğrenip deney ve kısa değerlendirmeyi tamamlayabilmeli; öğretmen aynı kimya çekirdeğiyle hazır bir dersi akıllı tahtada anlatabilmeli. Öğretmenin quiz hazırlaması, sınıf yönetimi ve hesap sistemi bu MVP’ye dahil değil.

Bu belge `.agents/agents.md` ve `.agents/chemistry-rules.md` kurallarını değiştirmez. Ana anlatım lise düzeyindedir. TYT/AYT notları yalnızca MVP’nin atom, periyodik özellikler ve bağ konularıyla sınırlıdır. Hesap yoktur; öğrenci ilerlemesi tamamlandığında yalnızca bu cihazda saklanacaktır.

## MVP içeriği ve kullanıcı akışları

| Konu | Temel kazanım | Başlıca deneyler |
|---|---|---|
| Periyodik tabloyu okuma | Grup, periyot ve element sınıflarını konumla ilişkilendirme | Na–Cl, He–Ne |
| Değerlik elektronları ve kararlılık | Dublet, oktet ve soygaz kararlılığını açıklama | Na–Cl, He–Ne |
| Elektronegatiflik | Elektron çekimini ve bağ kutupluluğunu yorumlama | H–F, H–O |
| İyonik bağ | Metal–ametal etkileşimi ve elektron aktarımını açıklama | Na–Cl |
| Kovalent bağ | Paylaşım, polar/apolar ayrımı ve bağ sayısını açıklama | H–F, H₂O, CH₄, O₂ |
| Karşılaştırma ve tepkimesizlik | Bağ türlerini karşılaştırma; tepkimesiz durumu tanıma | He–Ne ve önceki deneyler |

Her konuda üç açıklamalı mikro soru bulunacak: toplam 18 soru.

- **Öğrenci:** Hedefi gör → kısa açıklamayı oku → tahmin et → deneyi çalıştır → sonucu karşılaştır → üç soruyu çöz → geri bildirim ve sonraki konuyu gör.
- **Öğretmen:** Hazır dersi aç → hedefi ve atomları göster → cevapları perdele → sınıftan tahmin al → animasyonu adım adım yürüt → cevabı ve kavram yanılgısını aç → üç soruluk çıkış bileti uygula.

## Atomik uygulama fazları

### Faz 0 — İçerik ve kimya güvenlik sınırı

- **0.1 — Desteklenen deney kümesini sabitle:** Mevcut NaCl, H₂O, CH₄, O₂ ve He–Ne deneylerine H–F’yi ekleyerek altı doğrulanmış öğretim örneği belirle. H–F için yeni, moleküle özel çizim fonksiyonu yazma; genel çizim yolunu doğrula.
- **0.2 — Kimya doğrulama matrisi hazırla:** Her örnek için element sınıfı, değerlik elektronu, ΔEN, bağ türü, formül, elektron davranışı ve oktet/dublet sonucunu ayrı ayrı kontrol et. Özellikle H–F polar kovalent, Na–Cl iyonik, He–Ne tepkimesiz olmalı. ΔEN öğretim sezgisini, kategori öncelikli H–F kuralıyla çelişecek biçimde tek başına kullanma.
- **0.3 — Öğretim sınırını görünür kıl:** Rehberli görevler ve puanlanan sorular yalnızca doğrulanmış örnekleri kullansın. Serbest keşifteki 118 elementin tamamı, doğrulanmış eğitim senaryosu gibi sunulmasın. Bağ kutupluluğu ile molekül kutupluluğunun farklı kavramlar olduğu açıkça belirtilecek.

**Faz kabulü:** Altı örneğin beklenen kimyasal sonuçları testlerle doğrulanır; desteklenmeyen bir kombinasyondan notlandırılmış soru üretilmez.

### Faz 1 — Ana sayfa, yönlendirme ve iki mod

- **1.1 — Ana sayfa oluştur:** ChemLab’ın ne öğrettiğini, “Öğrenci olarak çalış” ve “Öğretmen olarak anlat” girişlerini, altı konuya kısa erişimi ve örnek deney bağlantısını göster. Pazarlama metrikleri veya çalışmayan özellik vaatleri ekleme.
- **1.2 — Üst çubuk mod seçimini kur:** Öğrenci ve Öğretmen düğmeleri her iki deneyimde de görünür olsun. Mod seçimi hesap veya kimlik doğrulama istemesin; modun yalnızca arayüz davranışı olduğu kullanıcıya açık olsun.
- **1.3 — İstemci tarafı adresleri tanımla:** `/`, `/ogrenci`, `/ogretmen`, `/ogrenci/konu/:id`, `/ogretmen/ders/:id` ve `/deney/:id` adresleri kullanılacak. Deney bağlantısı geçerli mod ve isteğe bağlı görev kimliğini taşıyacak. Geçersiz kimlik kullanıcı dostu bir hata görünümüne düşecek. Mevcut statik dağıtımın SPA yönlendirmesi korunacak. Ders/konu ve görev içerikleri, ilgili sonraki fazdan önce sahte çalışır özellik olarak açılmayacak.
- **1.4 — Düzenleri ayır:** Ana sayfa ve konu sayfaları gerektiğinde kaydırılabilir olacak; mevcut simülasyon ekranının masaüstündeki yaklaşık %60 periyodik tablo / %40 deney ve teori düzeni korunacak. Dar ekranlarda içerik üst üste akacak. Bütün etkileşimli hedefler en az 40×40 px olacak.

**Faz kabulü:** İlk açılış ana sayfadır; her iki mod doğrudan bağlantıyla açılır; tarayıcı yenilemesi ve geri/ileri gezinme çalışır; mevcut simülasyon kaybolmaz.

### Faz 2 — Ortak ders içeriği ve ilk uçtan uca öğrenme döngüsü

- **2.1 — Tek kaynaklı içerik modeli oluştur:** Her konu için sabit kimlik, öğrenme hedefi, kısa anlatım, ön koşul, ilişkili deneyler, sık karıştırılan nokta, isteğe bağlı TYT/AYT notu, kaynak ve kontrol tarihi tanımla. Öğrenci ve öğretmen aynı konu verisini farklı sunumlarla kullanacak.
- **2.2 — İlk dikey dilimi tamamla:** “İyonik bağ” konusunu baştan sona işler hâle getir: konu kartı, Na–Cl tahmini, kontrollü deney, neden açıklaması ve üç soruluk değerlendirme. Diğer konulara geçmeden bu döngüyü test et.
- **2.3 — Tahmin Et ve Gör akışını kur:** Rehberli deney açıldığında otomatik oynatma başlamasın. Tahmin alındıktan sonra gözlem aşamasına geçilsin. Öğrencinin tahmini, motorun çözümünden üretilen gerçek sonuçla karşılaştırılsın; kimya kuralı soru bileşeninde tekrar yazılmasın.
- **2.4 — Tüm cevap sızıntılarını kapat:** Tahmin öncesinde ürün rozeti, bağ analizi, teori paneli, büyük ekran penceresi ve erişilebilir metin çıktıları doğru cevabı erkenden göstermesin. Serbest keşif akışının mevcut anında sonuç gösterme davranışı korunabilir.
- **2.5 — Kalan beş konuyu aynı şablonla doldur:** Her konu kısa açıklama, deney bağlantısı, hedef, sık karıştırılan nokta ve üç soruyla tamamlanacak; uzun, tekrar eden sınav notu sayfaları oluşturulmayacak.

**Faz kabulü:** Öğrenci altı konunun her birinde konu → tahmin → deney → açıklama → üç soru döngüsünü tamamlayabilir. H–F örneğinde ΔEN tek başına iyonik cevap üretemez.

### Faz 3 — Rehberli görevler ve öğrenci ilerlemesi

- **3.1 — On rehberli görev hazırla:** Periyodik konumdan element bulma, değerlik elektronunu belirleme, iyonik çifti seçme, elektron aktarım yönünü tahmin etme, polar/apolar ayrımı, O₂’de çift bağı tanıma, H–F yanılgısını düzeltme, H₂O’da dublet/oktet, CH₄’te paylaşım ve He–Ne tepkimesizliği.
- **3.2 — Görevleri sonuç özellikleriyle doğrula:** Kimyasal doğruluk ham sembol veya senaryo kimliği için yazılmış koşullara değil, çözülmüş domain sonucuna dayansın. İçerik kimlikleri yalnızca doğru deneyin açılması gibi sunumsal seçimlerde kullanılsın.
- **3.3 — Açıklamalı geri bildirim ver:** Her soruda doğru cevap kadar yanlış seçeneklerin temsil ettiği kavram yanılgısı da açıklansın. Öğrenci yanlıştan sonra yeniden deneyebilsin; cezalandırıcı ses veya gösteriş amaçlı puanlama zorunlu olmasın.
- **3.4 — Hesapsız ilerlemeyi sakla:** Tamamlanan konu, görev ve soru sonuçları sürümlü bir şemayla yalnızca bu tarayıcıda tutulacak. Öğrenci kaydı temizleyebilecek. Kişisel veri, cihazlar arası eşitleme, sahte lider tablosu veya hesap izlenimi olmayacak.

**Faz kabulü:** On görev bitirilebilir; sayfa yenilendiğinde öğrenci ilerlemesi korunur; cihazlar arası eşitlenme vaat edilmez.

### Faz 4 — Öğretmen sunum deneyimi

- **4.1 — Altı hazır ders akışı oluştur:** Her konuda hedef, başlangıç sorusu, önerilen deney, tahmin anı, açıklama anı, kavram yanılgısı ve çıkış bileti sıralı olarak sunulsun.
- **4.2 — Öğretmen perdesini uygula:** Bağ türü, ürün formülü, ΔEN, oktet sonucu ve açıklama ayrı aşamalarda açılabilsin. “Tahmin görünümü” ve “cevapları göster” hazır durumları bulunsun. Perdeleme tüm simülasyon yüzeylerinde tutarlı olsun.
- **4.3 — Akıllı tahta kullanımını tamamla:** Büyük yazı, yüksek kontrast, tam ekran, klavye ve dokunmatik kontrol, duraklat/ileri/geri/sıfırla ve azaltılmış hareket tercihi desteklensin.
- **4.4 — Paylaşılabilir deney bağlantısı üret:** Öğretmen seçtiği doğrulanmış deney ve görevin bağlantısını kopyalayabilsin. Öğrenci bağlantıyı açınca ilgili deneyin tahmin aşamasına ulaşsın; hesap gerektirmesin.

**Faz kabulü:** Öğretmen sıfır kurulumla hazır bir dersi açıp anlatımı sürdürebilir; cevaplar öğretmen açmadan görünmez; bağlantı farklı tarayıcıda doğru deneyi açar.

### Faz 5 — Ürün kalitesi ve tek seferlik MVP çıkış kapısı

- **5.1 — Otomatik testleri tamamla:** İçerik–deney bağlantıları, görev değerlendirmesi, tahmin akışı, perde politikası, yerel ilerleme ve geçersiz bağlantılar test edilsin. `/lib/chemistry/` veya `/lib/canvas/` altına eklenen her saf fonksiyonun yanında sınır değerlerini kapsayan Vitest testi bulunsun.
- **5.2 — Tarayıcı uçtan uca kontrol yap:** Öğrenci ve öğretmen yolları; 0%, 50% ve 100% oynatma; H–F, Na–Cl ve He–Ne; mobil, tablet ve projeksiyon boyutları; yalnız klavye ve dokunmatik kullanım doğrulansın. Canvas bilgisinin metinsel karşılığı bulunsun. Yakınlaştırmayı engelleyen viewport ayarı erişilebilirlik kapsamında düzeltilsin.
- **5.3 — Mimari öz denetimi uygula:** Kimya doğrusu UI zaman çizgisinden türetilmeyecek; yeni sembol-özel domain koşulu, molekül-özel çizim fonksiyonu veya paylaşılan değişken durumlu renderer eklenmeyecek. Sunum, öğrenme oturumu, yerel ilerleme ve kimya durumu ayrı sorumluluklarda kalacak. Tasarım `.agents/agents.md` kurallarına uyacak.
- **5.4 — Çıkış ölçütlerini kapat:** `npm test` ve `npm run build` başarılı olacak; mevcut 39 test korunacak. Test raporu gerçek komut çıktısını içerecek. Yarım kalmış özellik MVP işlevi gibi gösterilmeyecek.

## Tamamlanma tanımı ve kapsam dışı işler

- **Öğrenci:** Ana sayfadan Öğrenci moduna geçer; bir konuyu okur, tahmin yapar, deneyi izler, üç açıklamalı soruyu çözer ve ilerlemesini yenilemeden sonra görür.
- **Öğretmen:** Ana sayfadan Öğretmen moduna geçer; hazır ders açar, cevapları gizleyerek sınıfa tahmin yaptırır, deneyi aşamalı gösterir, çıkış biletini uygular ve deney bağlantısını paylaşır.

Bu MVP’ye hesap, Google ile giriş, öğretmen quiz editörü, sınıf/ödev yönetimi, sunucu, cihazlar arası senkronizasyon, tüm AYT kimyası ve yeni molekül-özel çizim fonksiyonları dahil değildir. Sonraki geliştirme evreleri bu planın tamamlanma koşulu olmayacak. Uygulama sırasında `.agents/agents.md` ve `.agents/chemistry-rules.md` önce okunacak; eski `.agents/` planları bağlayıcı kural yerine proje geçmişi olarak değerlendirilecek. Özellikle H–F sınıflandırmasında mevcut kategori öncelikli domain davranışı korunacak.
