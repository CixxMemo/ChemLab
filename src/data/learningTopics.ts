export interface LearningQuestion {
  readonly id: string;
  readonly prompt: string;
  readonly options: readonly [string, string, string];
  readonly correctIndex: 0 | 1 | 2;
  readonly explanation: string;
}

export interface LearningTopic {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly summary: string;
  readonly prerequisiteId: string | null;
  readonly experimentIds: readonly string[];
  readonly misconception: string;
  readonly examNote?: string;
  readonly source: string;
  readonly checkedAt: string;
  readonly questions: readonly [LearningQuestion, LearningQuestion, LearningQuestion];
}

const SOURCE = 'ChemLab kimya alan modeli ve doğrulanmış deney verisi';
const CHECKED_AT = '2026-09-16';

export const learningTopics: readonly LearningTopic[] = [
  {
    id: 'periyodik-tablo', title: 'Periyodik tabloyu oku',
    objective: 'Grup ve periyodu ayırt ederek elementlerin tablodaki yerini yorumlar.',
    summary: 'Periyot yatay sırayı, grup dikey sütunu gösterir. Ana grup elementlerinde aynı gruptakiler benzer dış katman özellikleri taşır.',
    prerequisiteId: null, experimentIds: ['nacl'],
    misconception: 'Grup ile periyot aynı değildir: grup dikey, periyot yatay yönde izlenir.',
    source: SOURCE, checkedAt: CHECKED_AT,
    questions: [
      { id: 'pt-1', prompt: 'Periyodik tabloda periyot hangi yöndedir?', options: ['Yatay', 'Dikey', 'Çapraz'], correctIndex: 0, explanation: 'Periyot, soldan sağa uzanan yatay sıradır.' },
      { id: 'pt-2', prompt: 'Bir elementin grubu tabloda hangi yönde izlenir?', options: ['Yatay', 'Dikey', 'Çapraz'], correctIndex: 1, explanation: 'Grup, yukarıdan aşağıya uzanan dikey sütundur.' },
      { id: 'pt-3', prompt: 'Aynı gruptaki ana grup elementleri için hangisi beklenir?', options: ['Aynı proton sayısı', 'Benzer dış katman özellikleri', 'Aynı periyot'], correctIndex: 1, explanation: 'Benzer değerlik elektron düzeni, benzer kimyasal davranışa yol açabilir.' }
    ]
  },
  {
    id: 'degerlik-oktet', title: 'Değerlik, dublet ve oktet',
    objective: 'Dış katman elektronlarını ve dublet/oktet hedeflerini açıklar.',
    summary: 'Değerlik elektronları en dış katmandadır. Hidrojen ve helyum için iki, birçok ana grup atomu için sekiz dış elektron kararlılık hedefidir.',
    prerequisiteId: 'periyodik-tablo', experimentIds: ['h2o', 'inert_gas', 'nacl'],
    misconception: 'Helyumun iki değerlik elektronu olması onu 2A grubu yapmaz; helyum soygazdır.',
    source: SOURCE, checkedAt: CHECKED_AT,
    questions: [
      { id: 'do-1', prompt: 'Değerlik elektronları nerede bulunur?', options: ['Çekirdekte', 'En dış katmanda', 'Yalnız ilk katmanda'], correctIndex: 1, explanation: 'Değerlik elektronları atomun en dış enerji katmanındadır.' },
      { id: 'do-2', prompt: 'Hidrojen için kararlı dış elektron hedefi nedir?', options: ['2', '8', '18'], correctIndex: 0, explanation: 'Hidrojen dublet kuralıyla iki dış elektrona ulaşır.' },
      { id: 'do-3', prompt: 'Helyumun iki dış elektronu hangi kavramla açıklanır?', options: ['Oktet', 'Dublet', 'İyonik bağ'], correctIndex: 1, explanation: 'Helyum ilk katmanı dolu olduğu için dubletle kararlıdır.' }
    ]
  },
  {
    id: 'elektronegatiflik', title: 'Elektronegatiflik farkı',
    objective: 'Elektronegatiflik farkını bağdaki elektron davranışıyla ilişkilendirir.',
    summary: 'Elektronegatiflik, atomun bağ elektronlarını çekme eğilimidir. Fark, paylaşımın ne kadar eşit olduğunu yorumlamaya yardım eder; bağ türü yalnızca sayısal eşikle belirlenmez.',
    prerequisiteId: 'degerlik-oktet', experimentIds: ['hf', 'ch4'],
    misconception: 'Büyük elektronegatiflik farkı tek başına iyonik bağ kanıtı değildir; iki ametal arasında HF polar kovalenttir.',
    examNote: 'Önce elementlerin metal/ametal sınıfına, sonra elektronegatiflik farkına bak.',
    source: SOURCE, checkedAt: CHECKED_AT,
    questions: [
      { id: 'en-1', prompt: 'Elektronegatiflik neyi ifade eder?', options: ['Bağ elektronlarını çekme eğilimini', 'Proton sayısını', 'Atom kütlesini'], correctIndex: 0, explanation: 'Bu büyüklük bağ elektronlarını çekme eğilimini tanımlar.' },
      { id: 'en-2', prompt: 'İki özdeş atomun elektronegatiflik farkı kaçtır?', options: ['0', '1,7', 'Bilinemez'], correctIndex: 0, explanation: 'Aynı elementin iki atomunun elektronegatiflik değerleri aynıdır.' },
      { id: 'en-3', prompt: 'HF için yalnız farkın büyüklüğünden iyonik bağ sonucu çıkar mı?', options: ['Evet, her zaman', 'Hayır, atom sınıfları da önemlidir', 'Sadece atom kütlesi gerekir'], correctIndex: 1, explanation: 'H ve F ametaldir; motor HF bağını polar kovalent çözer.' }
    ]
  },
  {
    id: 'iyonik-bag', title: 'İyonik bağ ve elektron aktarımı',
    objective: 'Na ve Cl arasında elektron aktarımını, iyonları ve elektrostatik çekimi açıklar.',
    summary: 'Bir metal elektron verdiğinde pozitif, bir ametal elektron aldığında negatif iyon oluşabilir. Karşıt yüklü iyonlar arasındaki çekimi Na ve Cl ile incele.',
    prerequisiteId: 'elektronegatiflik', experimentIds: ['nacl'],
    misconception: 'İyonik bağ, iki atomun ortak elektron çifti kullanması değil; oluşan iyonlar arasındaki çekimdir.',
    examNote: 'NaCl örneğinde elektron aktarımı ile oluşan iyonların yükünü ayrı ayrı düşün.',
    source: SOURCE, checkedAt: CHECKED_AT,
    questions: [
      { id: 'ib-1', prompt: 'NaCl örneğinde elektron hangi yönde aktarılır?', options: ['Cl → Na', 'Na → Cl', 'Aktarım olmaz'], correctIndex: 1, explanation: 'Na bir dış elektronunu Cl atomuna verir.' },
      { id: 'ib-2', prompt: 'Elektron veren Na hangi yüklü iyon olur?', options: ['Pozitif', 'Negatif', 'Yüksüz'], correctIndex: 0, explanation: 'Elektron kaybeden Na pozitif yüklü Na⁺ olur.' },
      { id: 'ib-3', prompt: 'Na⁺ ve Cl⁻ arasındaki bağın temel çekimi nedir?', options: ['Kütle çekimi', 'Elektrostatik çekim', 'Elektronların eşit paylaşımı'], correctIndex: 1, explanation: 'Karşıt elektrik yükleri birbirini elektrostatik olarak çeker.' }
    ]
  },
  {
    id: 'kovalent-bag', title: 'Kovalent bağ ve paylaşım',
    objective: 'Ametallerin ortak elektron kullanmasını ve bağ polaritesini ayırt eder.',
    summary: 'İki ametal elektron çiftlerini paylaşır. Paylaşım eşit değilse bağ polar, yaklaşık eşitse apolar kovalent olarak yorumlanır.',
    prerequisiteId: 'iyonik-bag', experimentIds: ['hf', 'o2', 'h2o', 'ch4'],
    misconception: 'Bir bağın polaritesi ile bütün molekülün polaritesi aynı soru değildir.',
    source: SOURCE, checkedAt: CHECKED_AT,
    questions: [
      { id: 'kb-1', prompt: 'Kovalent bağda elektronlar nasıl kullanılır?', options: ['Paylaşılır', 'Yok olur', 'Çekirdeğe geçer'], correctIndex: 0, explanation: 'Kovalent bağ ortak kullanılan elektron çiftlerinden doğar.' },
      { id: 'kb-2', prompt: 'O₂ bağında elektron paylaşımı nasıldır?', options: ['Eşit', 'Yalnız ilk O yönünde', 'Yalnız ikinci O yönünde'], correctIndex: 0, explanation: 'Özdeş O atomlarının elektronegatiflikleri eşittir; bağ apolardır.' },
      { id: 'kb-3', prompt: 'HF içindeki H–F bağının türü nedir?', options: ['İyonik', 'Polar kovalent', 'Apolar kovalent'], correctIndex: 1, explanation: 'İki ametal elektron paylaşır; fark nedeniyle paylaşım eşit değildir.' }
    ]
  },
  {
    id: 'bag-karsilastirma', title: 'Bağları karşılaştır',
    objective: 'İyonik, polar/apolar kovalent ve tepkimesiz örnekleri karşılaştırır.',
    summary: 'Bağ türünü atom sınıfları ve elektronların aktarılması veya paylaşılmasıyla değerlendir. Bazı karşılaşmalarda bağ oluşmayabileceğini de göz önünde bulundur.',
    prerequisiteId: 'kovalent-bag', experimentIds: ['inert_gas', 'nacl', 'ch4'],
    misconception: 'Her iki atom bir araya geldiğinde mutlaka kimyasal bağ oluşmaz.',
    source: SOURCE, checkedAt: CHECKED_AT,
    questions: [
      { id: 'bk-1', prompt: 'NaCl örneğinde elektron davranışı nedir?', options: ['Aktarım', 'Eşit paylaşım', 'Tepkimesizlik'], correctIndex: 0, explanation: 'NaCl örneği elektron aktarımını ve iyonik çekimi gösterir.' },
      { id: 'bk-2', prompt: 'He ve Ne örneğinin sonucu nedir?', options: ['İyonik bağ', 'Kovalent bağ', 'Bağ oluşmaz'], correctIndex: 2, explanation: 'Bu modelde kararlı soygaz çiftinde yeni bağ oluşmaz.' },
      { id: 'bk-3', prompt: 'İki ametal için büyük EN farkı tek başına neyi kanıtlar?', options: ['İyonik bağı', 'İyon oluşmasını', 'İyonik bağı kanıtlamaz'], correctIndex: 2, explanation: 'Ametal–ametal bağı kovalent sınıfında değerlendirilir; HF polar kovalenttir.' }
    ]
  }
];

export function getLearningTopic(id: string): LearningTopic | undefined {
  return learningTopics.find(topic => topic.id === id);
}
