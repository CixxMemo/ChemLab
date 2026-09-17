export interface TeacherFlow {
  readonly topicId: string;
  readonly openingQuestion: string;
  readonly predictionPrompt: string;
  readonly explanationPrompt: string;
  readonly exitTicket: string;
}

export const teacherFlows: readonly TeacherFlow[] = [
  { topicId: 'periyodik-tablo', openingQuestion: 'Na ve Cl tabloda aynı satırda mı, aynı sütunda mı?', predictionPrompt: 'Bu konumlar dış elektron davranışı hakkında ne düşündürüyor?', explanationPrompt: 'Grup ve periyot bilgisini seçili atomlarla eşleştir.', exitTicket: 'Bir elementin grubunu ve periyodunu nasıl ayırt edersin?' },
  { topicId: 'degerlik-oktet', openingQuestion: 'H ve O için kararlı dış katman aynı sayıda elektron mu ister?', predictionPrompt: 'Bağ kurulduğunda hangi atom dublet, hangisi oktet hedefler?', explanationPrompt: 'Elektron sayıları açılınca hedeflerle karşılaştır.', exitTicket: 'H neden oktet değil dublet hedefler?' },
  { topicId: 'elektronegatiflik', openingQuestion: 'Büyük ΔEN her durumda iyonik bağ mı demektir?', predictionPrompt: 'HF için bağ türünü, atom sınıflarını düşünerek tahmin et.', explanationPrompt: 'Önce ametal sınıflarını, sonra ΔEN değerini yorumla.', exitTicket: 'HF neden yalnız sayısal eşikle sınıflandırılamaz?' },
  { topicId: 'iyonik-bag', openingQuestion: 'Na ve Cl karşılaştığında elektron hangi yönde ilerler?', predictionPrompt: 'Elektron aktarımı ve oluşacak iyon yüklerini tahmin ettir.', explanationPrompt: 'Aktarım yönünü iyon yükleriyle ilişkilendir.', exitTicket: 'İyonik bağda iyonları bir arada tutan etki nedir?' },
  { topicId: 'kovalent-bag', openingQuestion: 'İki ametal elektronlarını verir mi, paylaşır mı?', predictionPrompt: 'HF bağını ve elektronların eşit paylaşılıp paylaşılmadığını tahmin ettir.', explanationPrompt: 'Bağ polaritesi ile bütün molekül polaritesini ayır.', exitTicket: 'O₂ ile HF bağlarında paylaşım nasıl farklıdır?' },
  { topicId: 'bag-karsilastirma', openingQuestion: 'Her atom çifti yeni bir bağ kurar mı?', predictionPrompt: 'He ve Ne için tepkime beklentisini sınıfa sor.', explanationPrompt: 'Kararlı dış katmanları sonuçla karşılaştır.', exitTicket: 'Bağ oluşmayan bir çifti nasıl tanırsın?' }
];

export function getTeacherFlow(topicId: string): TeacherFlow | undefined {
  return teacherFlows.find(flow => flow.topicId === topicId);
}
