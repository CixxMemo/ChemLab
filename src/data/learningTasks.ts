export type TaskKind =
  | 'element-location' | 'valence' | 'ionic-pair' | 'transfer-direction'
  | 'bond-type' | 'shared-pairs' | 'stability-targets'
  | 'electron-behavior' | 'reactivity';

export interface LearningTaskOption {
  readonly value: string;
  readonly label: string;
  readonly misconception: string;
}

export interface LearningTask {
  readonly id: string;
  readonly topicId: string;
  readonly scenarioId: string;
  readonly kind: TaskKind;
  readonly title: string;
  readonly prompt: string;
  readonly hint: string;
  readonly successExplanation: string;
  readonly options: readonly [LearningTaskOption, LearningTaskOption, LearningTaskOption];
}

export const learningTasks: readonly LearningTask[] = [
  {
    id: 'konum', topicId: 'periyodik-tablo', scenarioId: 'nacl', kind: 'element-location',
    title: 'Konumdan elementi bul', prompt: '3. periyot, 1. gruptaki elementi seç.',
    hint: 'Grup sütun, periyot satırdır.',
    successExplanation: 'Seçtiğin atomun grup ve periyot konumu, sorudaki iki koşulla da örtüşüyor.',
    options: [
      { value: 'Na', label: 'Sodyum (Na)', misconception: '' },
      { value: 'Mg', label: 'Magnezyum (Mg)', misconception: 'Mg aynı periyottadır ama 2. gruptadır.' },
      { value: 'Cl', label: 'Klor (Cl)', misconception: 'Cl aynı periyottadır ama 17. gruptadır.' }
    ]
  },
  {
    id: 'degerlik', topicId: 'degerlik-oktet', scenarioId: 'nacl', kind: 'valence',
    title: 'Dış katmanı oku', prompt: 'Na + Cl deneyindeki Cl atomunun değerlik elektronu kaçtır?',
    hint: 'Değerlik elektronları en dış katmandadır.',
    successExplanation: 'Bağ oluşmadan önce atomun en dış katmanındaki elektron sayısını doğru okudun.',
    options: [
      { value: '1', label: '1', misconception: 'Bu Na atomunun dış elektron sayısıdır; Cl için dış katmana bak.' },
      { value: '7', label: '7', misconception: '' },
      { value: '8', label: '8', misconception: '8, Cl atomunun bağ sonrası oktet hedefidir; başlangıç değerliği değildir.' }
    ]
  },
  {
    id: 'iyonik-cift', topicId: 'iyonik-bag', scenarioId: 'nacl', kind: 'ionic-pair',
    title: 'İyonik çifti seç', prompt: 'Hangi atom çifti bu modelde iyonik bağ kurar?',
    hint: 'Önce atomların metal/ametal sınıfını düşün.',
    successExplanation: 'Seçtiğin çift, motor tarafından iyonik bağ olarak çözülüyor: elektron aktarımı gerçekleşiyor.',
    options: [
      { value: 'H|F', label: 'H + F', misconception: 'İki ametal elektron paylaşır; büyük ΔEN tek başına iyonik bağ oluşturmaz.' },
      { value: 'Na|Cl', label: 'Na + Cl', misconception: '' },
      { value: 'He|Ne', label: 'He + Ne', misconception: 'Soygaz çifti bu modelde yeni bir bağ oluşturmaz.' }
    ]
  },
  {
    id: 'aktarim-yonu', topicId: 'iyonik-bag', scenarioId: 'nacl', kind: 'transfer-direction',
    title: 'Elektronun yönünü bul', prompt: 'Na + Cl deneyinde elektron hangi yönde aktarılır?',
    hint: 'Elektron veren atom katyon olur.',
    successExplanation: 'Elektron daha az elektronegatif atomdan daha elektronegatif olana aktarılır.',
    options: [
      { value: 'secondary-to-primary', label: 'Cl → Na', misconception: 'Elektron veren Na katyon olur; yönü ters çevirdin.' },
      { value: 'primary-to-secondary', label: 'Na → Cl', misconception: '' },
      { value: 'none', label: 'Aktarım olmaz', misconception: 'İyonik bağda elektron aktarımı gerçekleşir.' }
    ]
  },
  {
    id: 'polarite', topicId: 'kovalent-bag', scenarioId: 'o2', kind: 'bond-type',
    title: 'Polar mı apolar mı?', prompt: 'O₂ içindeki O–O bağını sınıflandır.',
    hint: 'Özdeş atomların elektronegatiflikleri eşittir.',
    successExplanation: 'Özdeş atomlar bağ elektronlarını yaklaşık eşit çeker; bağ apolar kovalenttir.',
    options: [
      { value: 'ionic', label: 'İyonik', misconception: 'İki özdeş ametal arasında elektron aktarımı beklenmez.' },
      { value: 'polar-covalent', label: 'Polar kovalent', misconception: 'Özdeş atomlar bağ elektronlarını eşit çeker.' },
      { value: 'nonpolar-covalent', label: 'Apolar kovalent', misconception: '' }
    ]
  },
  {
    id: 'cift-bag', topicId: 'kovalent-bag', scenarioId: 'o2', kind: 'shared-pairs',
    title: 'O₂ çift bağını tanı', prompt: 'O₂ bağında kaç elektron çifti paylaşılır?',
    hint: 'Bağ analizindeki ortak elektron çifti sayısına bak.',
    successExplanation: 'Çözülmüş bağ analizinde iki ortak elektron çifti bulunur; bu bir çift bağdır.',
    options: [
      { value: '1', label: '1 çift', misconception: 'Tek bağ bir ortak çift içerir; O₂ için iki çift gerekir.' },
      { value: '2', label: '2 çift', misconception: '' },
      { value: '3', label: '3 çift', misconception: 'Üç çift üçlü bağdır; O₂ için geçerli değildir.' }
    ]
  },
  {
    id: 'hf-yanilgisi', topicId: 'elektronegatiflik', scenarioId: 'hf', kind: 'bond-type',
    title: 'HF yanılgısını düzelt', prompt: 'ΔEN büyük olsa da H–F bağının türü nedir?',
    hint: 'Bağ türünde element sınıfları da belirleyicidir.',
    successExplanation: 'İki ametal elektronları eşit olmayan biçimde paylaşır; HF polar kovalenttir.',
    options: [
      { value: 'ionic', label: 'İyonik', misconception: 'H ve F iki ametaldir; elektron aktarmaz, eşit olmayan biçimde paylaşır.' },
      { value: 'polar-covalent', label: 'Polar kovalent', misconception: '' },
      { value: 'nonpolar-covalent', label: 'Apolar kovalent', misconception: 'F bağ elektronlarını H’den daha güçlü çeker.' }
    ]
  },
  {
    id: 'su-kararlilik', topicId: 'degerlik-oktet', scenarioId: 'h2o', kind: 'stability-targets',
    title: 'Suda dublet ve oktet', prompt: 'H₂O deneyinde H ve O atomlarının kararlılık hedefleri sırasıyla kaç elektrondur?',
    hint: 'Her atomun çözülmüş dublet/oktet hedefini incele.',
    successExplanation: 'H ilk katmanında dubleti, O ise dış katmanında okteti hedefler.',
    options: [
      { value: '2|8', label: 'H: 2 · O: 8', misconception: '' },
      { value: '8|8', label: 'H: 8 · O: 8', misconception: 'H ilk katmanında dublet hedefler.' },
      { value: '2|2', label: 'H: 2 · O: 2', misconception: 'O için kararlılık hedefi oktettir.' }
    ]
  },
  {
    id: 'metan-paylasim', topicId: 'kovalent-bag', scenarioId: 'ch4', kind: 'electron-behavior',
    title: 'Metanda paylaşım', prompt: 'CH₄ deneyinde C ve H atomlarının bağ elektronları nasıl kullanılır?',
    hint: 'Kovalent bağın temel elektron davranışını düşün.',
    successExplanation: 'Bu kovalent bağda elektronlar aktarılmaz; ortaklaşa kullanılır.',
    options: [
      { value: 'transfer', label: 'Bir atomdan diğerine aktarılır', misconception: 'Elektron aktarımı iyonik bağın özelliğidir.' },
      { value: 'share', label: 'Ortaklaşa kullanılır', misconception: '' },
      { value: 'none', label: 'Bağ oluşmaz', misconception: 'CH₄ örneğinde kovalent bağ oluşur.' }
    ]
  },
  {
    id: 'soygaz', topicId: 'bag-karsilastirma', scenarioId: 'inert_gas', kind: 'reactivity',
    title: 'Soygazları yorumla', prompt: 'He + Ne deneyinde bu model yeni bir kimyasal bağ gösterir mi?',
    hint: 'Kararlı dış katmanların tepkimeye eğilimini düşün.',
    successExplanation: 'Model bu kararlı soygaz çifti için yeni bir bağ çözümlemiyor.',
    options: [
      { value: 'yes', label: 'Evet, iyonik bağ', misconception: 'Kararlı soygazlar burada elektron aktarımı yapmaz.' },
      { value: 'no', label: 'Hayır, bağ oluşmaz', misconception: '' },
      { value: 'share', label: 'Evet, kovalent bağ', misconception: 'Bu soygaz çifti burada elektron çifti paylaşmaz.' }
    ]
  }
];

export function getLearningTask(id: string): LearningTask | undefined {
  return learningTasks.find(task => task.id === id);
}
