import type { Lang, LessonFormat } from "./types";

/**
 * The app's own words, in the four languages it reads in.
 *
 * A Tamil lesson under headings that say "STEP 1 OF 4" and "Next step" is a
 * multilingual product only halfway. These are written, not machine-translated at
 * runtime — they never change, so paying for them would be silly, and the register
 * matters: plain, warm, no jargon. Nothing here says "generate", "process" or "AI".
 */

type Copy = {
  // landing
  // shell
  navHome: string;
  navRecord: string;
  navStories: string;
  greeting: string;
  familyStories: string;
  memoryFrom: string;
  memoriesFrom: string;
  recordNewMemory: string;
  justPressPlay: string;
  savedMemories: string;
  everythingKept: string;
  storiesBlurb: string;
  seeAll: string;
  nothingYet: string;
  openIt: string;
  ready: string;
  lessonsReady: string;
  allMemories: string;
  recordedToday: string;
  makeItALesson: string;
  tapToHearHer: string;
  stepByStep: string;
  serves: string;
  tapToHearMeta: string;
  panelsMeta: string;
  whenToUseIt: string;
  askHerOneQuestion: string;
  tapToFinish: string;
  tagline: string;
  blurb: string;
  record: string;
  empty: string;
  kept: string;
  // recording
  askHerHow: string;
  putThePhoneDown: string;
  startListening: string;
  done: string;
  listening: string;
  letHerFinish: string;
  askOneThing: string;
  dialectPrompt: string;
  whichLanguage: string;
  onlyAHint: string;
  useExisting: string;
  thinking: string;
  thinkingSub: string;
  micRefused: string;
  recordingTooBig: string;
  // the one gold moment
  keptHer: string;
  seeWhatSheSaid: string;
  // memory
  tapToHear: string;
  playing: string;
  notCertain: string;
  nowMakeSomething: string;
  pickHow: string;
  notYet: string;
  deleteMemory: string;
  deleteConfirm: string;
  gone: string;
  goneSub: string;
  back: string;
  backToHerWords: string;
  backToStart: string;
  wontPlay: string;
  translatingInto: string;
  onceOnly: string;
  // lessons
  writingThisIn: string;
  makingThis: string;
  writtenOnce: string;
  tryAgain: string;
  step: string;
  of: string;
  nextStep: string;
  lastStep: string;
  whatSheUsed: string;
  makes: string;
  herWords: string;
  pronunciationNote: string;
  hearHerSayThis: string;
  sheIsSpeaking: string;
  listen: string;
  when: string;
  youAre: string;
  whatDoYouDo: string;
  yourChoices: string;
  actuallyDid: string;
  choseDifferently: string;
  startOver: string;
  undoChoice: string;
  whereThisCameFrom: string;
  drawnNotPhotographed: string;
  turnThePage: string;
  theEnd: string;
  drawingThis: string;
  couldNotDraw: string;
  goAskHer: string;
  onlyShe: string;
  weLeftThese: string;
};

const en: Copy = {
  everythingKept: "Everything she's told you",
  storiesBlurb: "Every memory, and every way you can go through it.",
  seeAll: "See all",
  nothingYet: "Nothing here yet. Call your grandmother.",
  openIt: "Open",
  ready: "ready",
  navHome: "Home",
  navRecord: "Record",
  navStories: "Stories",
  greeting: "Good morning",
  familyStories: "Your family's stories",
  memoryFrom: "memory from",
  memoriesFrom: "memories from",
  recordNewMemory: "Record a new memory",
  justPressPlay: "Just press play and let her talk",
  savedMemories: "Saved memories",
  lessonsReady: "lessons ready",
  allMemories: "All memories",
  recordedToday: "Recorded today",
  makeItALesson: "Make it a lesson",
  tapToHearHer: "tap the speaker to hear her",
  stepByStep: "step by step",
  serves: "serves",
  tapToHearMeta: "Cook-along",
  panelsMeta: "6 panels · illustrated · for the youngest grandchild",
  whenToUseIt: "When to use it:",
  askHerOneQuestion: "Ask her one question. Let her talk.",
  tapToFinish: "Tap to finish",
  tagline: "Your grandmother knows something you don't.",
  blurb:
    "She talks. You get something you can actually follow — her recipe, her words, the choice she made. In her voice, in your language.",
  record: "Record her story",
  empty: "Nothing here yet. Call your grandmother.",
  kept: "Kept",
  askHerHow: "Ask her how she learned to make it.",
  putThePhoneDown: "Then put the phone down between you and let her tell it her way.",
  startListening: "Start\nlistening",
  done: "Done",
  listening: "listening",
  letHerFinish: "Let her finish. Tap Done when she's said everything.",
  askOneThing: "Ask her one thing, then let her talk. Any language — hers is fine.",
  dialectPrompt: "She speaks a dialect? Tell us which",
  whichLanguage: "What is she most likely to speak?",
  onlyAHint: "Only a hint. She can switch language mid-sentence and it still works.",
  useExisting: "Or use a recording you already have",
  thinking: "Listening to her.",
  thinkingSub: "Working out what she said, and what it means. About half a minute.",
  micRefused:
    "We can't reach the microphone. Allow it in your browser, or upload a recording instead.",
  recordingTooBig:
    "That recording is too big to send. About two minutes of her is as much as we can take at once — try a shorter one.",
  keptHer: "Kept.",
  seeWhatSheSaid: "See what she said",
  tapToHear: "tap to hear her",
  playing: "playing",
  notCertain: "tap to hear the word Ah Ma used",
  nowMakeSomething: "Now make something of it.",
  pickHow: "Pick how you want to learn this.",
  notYet: "not yet",
  deleteMemory: "Delete this memory and her recording",
  deleteConfirm: "Delete this memory and her recording? This cannot be undone.",
  gone: "That memory is gone.",
  goneSub: "It may have been deleted, or saved on another phone.",
  back: "Back",
  backToHerWords: "Back to her words",
  backToStart: "Back to the start",
  wontPlay: "Her recording won't play on this browser. The words are all still here.",
  translatingInto: "Putting her words into",
  onceOnly: "Once only — it stays.",
  writingThisIn: "Writing this in",
  makingThis: "Making this from what she said.",
  writtenOnce: "Written once, then it's yours.",
  tryAgain: "Try again",
  step: "Step",
  of: "of",
  nextStep: "Next step",
  lastStep: "That's the last step",
  whatSheUsed: "What she used",
  makes: "Makes",
  herWords: "Her words",
  pronunciationNote: "She is the pronunciation guide — nothing here is a machine voice.",
  hearHerSayThis: "Hear her say this",
  sheIsSpeaking: "She's speaking",
  listen: "Listen",
  when: "When",
  youAre: "You are",
  whatDoYouDo: "What do you do?",
  yourChoices: "Your choices",
  actuallyDid: "That is what she actually did.",
  choseDifferently: "That is not the way it went. She chose differently.",
  startOver: "Go back to the start",
  undoChoice: "Undo that choice",
  whereThisCameFrom: "Hear where this came from",
  drawnNotPhotographed:
    "Drawn, not photographed. These are pictures of her story, not pictures of her.",
  turnThePage: "Turn the page",
  theEnd: "The end",
  drawingThis: "Drawing this page",
  couldNotDraw: "We couldn't draw this one.",
  goAskHer: "Go ask her",
  onlyShe: "Things only she can tell you.",
  weLeftThese: "We left these out rather than guess at them.",
};

const zh: Copy = {
  everythingKept: "她讲过的每一段",
  storiesBlurb: "所有回忆，还有每一种学法。",
  seeAll: "看全部",
  nothingYet: "这里还什么都没有。打个电话给阿嬷吧。",
  openIt: "打开",
  ready: "已备好",
  navHome: "主页",
  navRecord: "录音",
  navStories: "故事",
  greeting: "早安",
  familyStories: "你家的故事",
  memoryFrom: "段回忆，来自",
  memoriesFrom: "段回忆，来自",
  recordNewMemory: "录一段新的回忆",
  justPressPlay: "按一下，让她慢慢讲",
  savedMemories: "收好的回忆",
  lessonsReady: "个学法准备好了",
  allMemories: "所有回忆",
  recordedToday: "今天录的",
  makeItALesson: "做成一堂课",
  tapToHearHer: "点喇叭听她说",
  stepByStep: "一步一步来",
  serves: "份量",
  tapToHearMeta: "跟着做",
  panelsMeta: "六页 · 手绘 · 给最小的孙子",
  whenToUseIt: "什么时候用：",
  askHerOneQuestion: "问她一个问题，让她慢慢讲。",
  tapToFinish: "点一下结束",
  tagline: "你的阿嬷懂一些你不懂的事。",
  blurb: "她讲，你就能真的跟着做——她的食谱、她的话、她当年的决定。用她的声音，用你的语言。",
  record: "录下她的故事",
  empty: "这里还什么都没有。打个电话给阿嬷吧。",
  kept: "已收藏",
  askHerHow: "问问她当年是怎么学会做的。",
  putThePhoneDown: "然后把手机放在你们中间，让她慢慢讲。",
  startListening: "开始\n聆听",
  done: "讲完了",
  listening: "聆听中",
  letHerFinish: "让她讲完。她说完了再按「讲完了」。",
  askOneThing: "问她一件事，然后让她讲。什么话都可以——她的话最好。",
  dialectPrompt: "她说方言？告诉我们是哪一种",
  whichLanguage: "她最可能讲哪一种？",
  onlyAHint: "只是提示。她讲到一半换语言也没问题。",
  useExisting: "或者用你已经有的录音",
  thinking: "正在听她讲。",
  thinkingSub: "在弄清楚她说了什么、是什么意思。大概半分钟。",
  micRefused: "我们连不上麦克风。请在浏览器里允许，或者改成上传录音。",
  recordingTooBig: "这段录音太大了，传不过去。一次大概只能收两分钟，换一段短一点的吧。",
  keptHer: "收好了。",
  seeWhatSheSaid: "看看她说了什么",
  tapToHear: "点一下听她说",
  playing: "播放中",
  notCertain: "点一下，听阿嬷用的那个词",
  nowMakeSomething: "现在把它做成点什么。",
  pickHow: "选一个你想学的方式。",
  notYet: "还没做",
  deleteMemory: "删除这段回忆和她的录音",
  deleteConfirm: "删除这段回忆和她的录音？删了就找不回来了。",
  gone: "这段回忆不在了。",
  goneSub: "可能被删掉了，或者存在另一台手机里。",
  back: "返回",
  backToHerWords: "回到她的话",
  backToStart: "回到开头",
  wontPlay: "这个浏览器放不出她的录音。她的话都还在。",
  translatingInto: "正在把她的话译成",
  onceOnly: "只需一次，之后就留着了。",
  writingThisIn: "正在用这个语言写",
  makingThis: "正在用她说的话做成这个。",
  writtenOnce: "写一次，之后就是你的了。",
  tryAgain: "再试一次",
  step: "第",
  of: "步，共",
  nextStep: "下一步",
  lastStep: "这是最后一步",
  whatSheUsed: "她用了什么",
  makes: "份量",
  herWords: "她的话",
  pronunciationNote: "她就是发音示范——这里没有一句是机器声音。",
  hearHerSayThis: "听她这样说",
  sheIsSpeaking: "她在说",
  listen: "听",
  when: "什么时候用",
  youAre: "你就是",
  whatDoYouDo: "你会怎么做？",
  yourChoices: "你的选择",
  actuallyDid: "她当年就是这样做的。",
  choseDifferently: "事情不是这样的。她做了别的选择。",
  startOver: "回到开头重来",
  undoChoice: "退回上一步",
  whereThisCameFrom: "听这句从哪里来",
  drawnNotPhotographed:
    "这些是画出来的，不是照片。画的是她的故事，不是她的样子。",
  turnThePage: "翻下一页",
  theEnd: "完",
  drawingThis: "正在画这一页",
  couldNotDraw: "这一页画不出来。",
  goAskHer: "去问她",
  onlyShe: "只有她才讲得出来的事。",
  weLeftThese: "我们宁可留白，也不乱猜。",
};

const ms: Copy = {
  everythingKept: "Semua yang dia ceritakan",
  storiesBlurb: "Setiap memori, dan setiap cara untuk melaluinya.",
  seeAll: "Lihat semua",
  nothingYet: "Belum ada apa-apa di sini. Telefon nenek anda.",
  openIt: "Buka",
  ready: "sedia",
  navHome: "Utama",
  navRecord: "Rakam",
  navStories: "Cerita",
  greeting: "Selamat pagi",
  familyStories: "Cerita keluarga anda",
  memoryFrom: "memori daripada",
  memoriesFrom: "memori daripada",
  recordNewMemory: "Rakam memori baharu",
  justPressPlay: "Tekan main dan biar dia bercerita",
  savedMemories: "Memori tersimpan",
  lessonsReady: "pelajaran sedia",
  allMemories: "Semua memori",
  recordedToday: "Dirakam hari ini",
  makeItALesson: "Jadikan ia pelajaran",
  tapToHearHer: "ketik pembesar suara untuk dengar dia",
  stepByStep: "langkah demi langkah",
  serves: "untuk",
  tapToHearMeta: "Masak bersama",
  panelsMeta: "6 halaman · berilustrasi · untuk cucu termuda",
  whenToUseIt: "Bila hendak guna:",
  askHerOneQuestion: "Tanya dia satu soalan. Biar dia bercakap.",
  tapToFinish: "Ketik untuk selesai",
  tagline: "Nenek anda tahu sesuatu yang anda tidak tahu.",
  blurb:
    "Dia bercerita. Anda dapat sesuatu yang boleh diikut — resipinya, kata-katanya, pilihan yang dibuatnya. Dengan suaranya, dalam bahasa anda.",
  record: "Rakam ceritanya",
  empty: "Belum ada apa-apa di sini. Telefon nenek anda.",
  kept: "Disimpan",
  askHerHow: "Tanya dia bagaimana dia belajar membuatnya.",
  putThePhoneDown: "Kemudian letakkan telefon antara kamu berdua dan biar dia bercerita.",
  startListening: "Mula\nmendengar",
  done: "Sudah",
  listening: "mendengar",
  letHerFinish: "Biar dia habis bercerita. Tekan Sudah bila dia selesai.",
  askOneThing: "Tanya satu perkara, kemudian biar dia bercakap. Bahasa apa pun boleh.",
  dialectPrompt: "Dia bercakap dialek? Beritahu kami yang mana",
  whichLanguage: "Apa yang paling mungkin dia tuturkan?",
  onlyAHint: "Sekadar petunjuk. Dia boleh tukar bahasa di tengah ayat dan ia tetap berfungsi.",
  useExisting: "Atau guna rakaman yang anda sudah ada",
  thinking: "Sedang mendengar dia.",
  thinkingSub: "Memahami apa yang dia kata dan apa maksudnya. Lebih kurang setengah minit.",
  micRefused:
    "Kami tidak dapat mencapai mikrofon. Benarkan dalam pelayar anda, atau muat naik rakaman.",
  recordingTooBig:
    "Rakaman itu terlalu besar untuk dihantar. Lebih kurang dua minit sahaja yang boleh kami terima sekali gus — cuba yang lebih pendek.",
  keptHer: "Tersimpan.",
  seeWhatSheSaid: "Lihat apa yang dia kata",
  tapToHear: "ketik untuk dengar dia",
  playing: "sedang main",
  notCertain: "ketik untuk dengar perkataan yang Ah Ma guna",
  nowMakeSomething: "Sekarang jadikan ia sesuatu.",
  pickHow: "Pilih cara anda mahu belajar.",
  notYet: "belum ada",
  deleteMemory: "Padam memori ini dan rakamannya",
  deleteConfirm: "Padam memori ini dan rakamannya? Ini tidak boleh dibatalkan.",
  gone: "Memori itu sudah tiada.",
  goneSub: "Mungkin ia dipadam, atau disimpan pada telefon lain.",
  back: "Kembali",
  backToHerWords: "Kembali ke kata-katanya",
  backToStart: "Kembali ke mula",
  wontPlay: "Rakamannya tidak dapat dimainkan di pelayar ini. Kata-katanya masih ada.",
  translatingInto: "Menukar kata-katanya ke",
  onceOnly: "Sekali sahaja — ia kekal.",
  writingThisIn: "Menulis ini dalam",
  makingThis: "Membuat ini daripada apa yang dia kata.",
  writtenOnce: "Ditulis sekali, kemudian ia milik anda.",
  tryAgain: "Cuba lagi",
  step: "Langkah",
  of: "daripada",
  nextStep: "Langkah seterusnya",
  lastStep: "Itu langkah terakhir",
  whatSheUsed: "Apa yang dia guna",
  makes: "Untuk",
  herWords: "Kata-katanya",
  pronunciationNote: "Dialah panduan sebutan — tiada suara mesin di sini.",
  hearHerSayThis: "Dengar dia sebut ini",
  sheIsSpeaking: "Dia sedang bercakap",
  listen: "Dengar",
  when: "Bila",
  youAre: "Anda ialah",
  whatDoYouDo: "Apa yang anda buat?",
  yourChoices: "Pilihan anda",
  actuallyDid: "Itulah yang dia benar-benar lakukan.",
  choseDifferently: "Bukan begitu ceritanya. Dia memilih jalan lain.",
  startOver: "Kembali ke permulaan",
  undoChoice: "Batalkan pilihan itu",
  whereThisCameFrom: "Dengar dari mana ini datang",
  drawnNotPhotographed:
    "Dilukis, bukan difoto. Ini gambar ceritanya, bukan gambar dirinya.",
  turnThePage: "Selak halaman",
  theEnd: "Tamat",
  drawingThis: "Melukis halaman ini",
  couldNotDraw: "Kami tidak dapat melukis yang ini.",
  goAskHer: "Pergi tanya dia",
  onlyShe: "Perkara yang hanya dia boleh beritahu.",
  weLeftThese: "Kami tinggalkan ini kosong daripada meneka.",
};

const ta: Copy = {
  everythingKept: "அவங்க சொன்ன எல்லாம்",
  storiesBlurb: "ஒவ்வொரு நினைவும், அதைக் கடக்க ஒவ்வொரு வழியும்.",
  seeAll: "எல்லாம் பார்",
  nothingYet: "இங்கே இன்னும் ஒன்றுமில்லை. பாட்டிக்கு ஒரு கால் பண்ணுங்க.",
  openIt: "திற",
  ready: "தயார்",
  navHome: "முகப்பு",
  navRecord: "பதிவு",
  navStories: "கதைகள்",
  greeting: "காலை வணக்கம்",
  familyStories: "உங்க குடும்பக் கதைகள்",
  memoryFrom: "நினைவு —",
  memoriesFrom: "நினைவுகள் —",
  recordNewMemory: "புதிய நினைவைப் பதிவு செய்",
  justPressPlay: "ஒரு தட்டு, அவங்க பேசட்டும்",
  savedMemories: "சேமித்த நினைவுகள்",
  lessonsReady: "பாடங்கள் தயார்",
  allMemories: "எல்லா நினைவுகளும்",
  recordedToday: "இன்று பதிவு செய்தது",
  makeItALesson: "இதை ஒரு பாடமாக்கு",
  tapToHearHer: "ஸ்பீக்கரைத் தட்டி அவங்க குரலைக் கேளுங்க",
  stepByStep: "படிப்படியாக",
  serves: "அளவு",
  tapToHearMeta: "சேர்ந்து சமையுங்க",
  panelsMeta: "6 பக்கங்கள் · ஓவியம் · சின்ன பேரக்குழந்தைக்கு",
  whenToUseIt: "எப்போது சொல்வது:",
  askHerOneQuestion: "ஒரு கேள்வி கேளுங்க. அவங்க பேசட்டும்.",
  tapToFinish: "முடிக்கத் தட்டுங்க",
  tagline: "உங்கள் பாட்டிக்கு உங்களுக்குத் தெரியாத ஒன்று தெரியும்.",
  blurb:
    "அவங்க பேசுறாங்க. நீங்க உண்மையிலேயே பின்பற்றக்கூடிய ஒன்று கிடைக்கும் — அவங்க சமையல், அவங்க வார்த்தைகள், அவங்க எடுத்த முடிவு. அவங்க குரலில், உங்க மொழியில்.",
  record: "அவங்க கதையைப் பதிவு செய்",
  empty: "இங்கே இன்னும் ஒன்றுமில்லை. பாட்டிக்கு ஒரு கால் பண்ணுங்க.",
  kept: "சேமித்தவை",
  askHerHow: "இதை எப்படிக் கத்துக்கிட்டாங்கன்னு கேளுங்க.",
  putThePhoneDown: "பிறகு ஃபோனை நடுவில் வைத்துவிட்டு, அவங்க பாட்டுக்குச் சொல்லட்டும்.",
  startListening: "கேட்க\nஆரம்பி",
  done: "முடிந்தது",
  listening: "கேட்கிறது",
  letHerFinish: "அவங்க முடிக்கட்டும். எல்லாம் சொல்லி முடிச்சதும் தட்டுங்க.",
  askOneThing: "ஒரு விஷயம் கேளுங்க, அப்புறம் அவங்க பேசட்டும். எந்த மொழியும் சரி.",
  dialectPrompt: "அவங்க வட்டார மொழி பேசுறாங்களா? எது என்று சொல்லுங்க",
  whichLanguage: "அவங்க எதைப் பேச வாய்ப்பு அதிகம்?",
  onlyAHint: "இது ஒரு குறிப்பு மட்டும்தான். இடையில் மொழி மாறினாலும் வேலை செய்யும்.",
  useExisting: "அல்லது உங்களிடம் ஏற்கனவே உள்ள பதிவைப் பயன்படுத்துங்கள்",
  thinking: "அவங்க சொல்றதைக் கேட்கிறோம்.",
  thinkingSub: "அவங்க என்ன சொன்னாங்க, அதன் அர்த்தம் என்னன்னு பார்க்கிறோம். அரை நிமிடம்.",
  micRefused:
    "மைக்ரோஃபோனை அணுக முடியல. உலாவியில் அனுமதி கொடுங்க, அல்லது ஒரு பதிவைப் பதிவேற்றுங்க.",
  recordingTooBig:
    "இந்தப் பதிவு அனுப்ப முடியாத அளவு பெரிசு. ஒரு தடவைக்கு ரெண்டு நிமிஷம் மட்டும்தான் முடியும் — கொஞ்சம் குறைவா இருக்கிற ஒண்ணைப் பாருங்க.",
  keptHer: "சேமிச்சாச்சு.",
  seeWhatSheSaid: "அவங்க சொன்னதைப் பாருங்க",
  tapToHear: "அவங்க குரலைக் கேட்க தட்டுங்க",
  playing: "ஒலிக்கிறது",
  notCertain: "அஹ் மா சொன்ன வார்த்தையைக் கேட்க தட்டுங்க",
  nowMakeSomething: "இப்போ இதை ஒரு பொருளாக்குங்க.",
  pickHow: "எப்படிக் கத்துக்க விரும்புறீங்கன்னு தேர்ந்தெடுங்க.",
  notYet: "இன்னும் இல்லை",
  deleteMemory: "இந்த நினைவையும் அவங்க பதிவையும் நீக்கு",
  deleteConfirm: "இந்த நினைவையும் அவங்க பதிவையும் நீக்கவா? இதைத் திரும்பப் பெற முடியாது.",
  gone: "அந்த நினைவு போயிடுச்சு.",
  goneSub: "நீக்கப்பட்டிருக்கலாம், அல்லது வேறு ஃபோனில் இருக்கலாம்.",
  back: "பின்செல்",
  backToHerWords: "அவங்க வார்த்தைகளுக்குத் திரும்பு",
  backToStart: "ஆரம்பத்துக்குத் திரும்பு",
  wontPlay: "இந்த உலாவியில் அவங்க பதிவு ஒலிக்காது. வார்த்தைகள் எல்லாம் இங்கேயே இருக்கு.",
  translatingInto: "அவங்க வார்த்தைகளை இதில் மாற்றுகிறோம்",
  onceOnly: "ஒரு தடவை மட்டும் — அப்புறம் அது இருக்கும்.",
  writingThisIn: "இதை இந்த மொழியில் எழுதுகிறோம்",
  makingThis: "அவங்க சொன்னதிலிருந்து இதைச் செய்கிறோம்.",
  writtenOnce: "ஒரு தடவை எழுதினா, அப்புறம் அது உங்களுடையது.",
  tryAgain: "மறுபடியும் முயற்சி செய்",
  step: "படி",
  of: "/",
  nextStep: "அடுத்த படி",
  lastStep: "இதுதான் கடைசிப் படி",
  whatSheUsed: "அவங்க பயன்படுத்தியது",
  makes: "அளவு",
  herWords: "அவங்க வார்த்தைகள்",
  pronunciationNote: "அவங்கதான் உச்சரிப்பு வழிகாட்டி — இங்கே எந்த இயந்திரக் குரலும் இல்லை.",
  hearHerSayThis: "அவங்க இதைச் சொல்றதைக் கேளுங்க",
  sheIsSpeaking: "அவங்க பேசுறாங்க",
  listen: "கேளுங்க",
  when: "எப்போது",
  youAre: "நீங்கதான்",
  whatDoYouDo: "நீங்க என்ன செய்வீங்க?",
  yourChoices: "உங்க தேர்வுகள்",
  actuallyDid: "அவங்க உண்மையிலேயே அப்படித்தான் செய்தாங்க.",
  choseDifferently: "அப்படி நடக்கல. அவங்க வேற மாதிரி முடிவு பண்ணாங்க.",
  startOver: "ஆரம்பத்துக்குத் திரும்பு",
  undoChoice: "அந்தத் தேர்வை மாற்று",
  whereThisCameFrom: "இது எங்கிருந்து வந்ததுன்னு கேளுங்க",
  drawnNotPhotographed:
    "வரையப்பட்டவை, புகைப்படம் அல்ல. இவை அவங்க கதையின் படங்கள், அவங்களோட படங்கள் அல்ல.",
  turnThePage: "அடுத்த பக்கம்",
  theEnd: "முற்றும்",
  drawingThis: "இந்தப் பக்கத்தை வரைகிறோம்",
  couldNotDraw: "இதை வரைய முடியல.",
  goAskHer: "போய் கேளுங்க",
  onlyShe: "அவங்க மட்டுமே சொல்லக்கூடிய விஷயங்கள்.",
  weLeftThese: "ஊகிக்கிறதுக்குப் பதிலா இதை விட்டுட்டோம்.",
};

const COPY: Record<Lang, Copy> = { en, zh, ms, ta };

export function t(lang: Lang): Copy {
  return COPY[lang] ?? en;
}

export const FORMAT_NAMES: Record<Lang, Record<LessonFormat, string>> = {
  en: {
    cookalong: "Cook along with her",
    branching: "Live her decision",
    phrasecoach: "Learn her words",
    storybook: "Storybook",
    quiz: "How well do you know her?",
    skillcard: "Skill card",
  },
  zh: {
    cookalong: "跟着她一起做",
    branching: "换你来做那个决定",
    phrasecoach: "学她的话",
    storybook: "图画故事",
    quiz: "你有多了解她？",
    skillcard: "手艺卡",
  },
  ms: {
    cookalong: "Masak bersamanya",
    branching: "Hidupi pilihannya",
    phrasecoach: "Belajar kata-katanya",
    storybook: "Buku cerita",
    quiz: "Sejauh mana anda kenal dia?",
    skillcard: "Kad kemahiran",
  },
  ta: {
    cookalong: "அவங்களோட சேர்ந்து சமையுங்க",
    branching: "அவங்க முடிவை நீங்க வாழுங்க",
    phrasecoach: "அவங்க வார்த்தைகளைக் கத்துக்குங்க",
    storybook: "கதைப் புத்தகம்",
    quiz: "அவங்களை உங்களுக்கு எவ்வளவு தெரியும்?",
    skillcard: "திறன் அட்டை",
  },
};

/**
 * Tamil and Chinese glyphs are taller and wider than latin at the same point size,
 * so a display line set for English runs to five lines in Tamil and pushes the
 * button under the fold. Same hierarchy, adjusted so it lands the same way.
 */
export const DISPLAY_SIZE: Record<Lang, string> = {
  en: "text-[2.6rem] leading-[1.03]",
  ms: "text-[2.35rem] leading-[1.05]",
  zh: "text-[2.2rem] leading-[1.25]",
  ta: "text-[1.9rem] leading-[1.3]",
};
