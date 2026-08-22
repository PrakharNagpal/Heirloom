import type { StoredMemory } from "./store";
import type { Lesson } from "./types";

/**
 * PLACEHOLDER — replace before the freeze.
 *
 * This is a real, validated run of the UNDERSTAND pipeline, but the audio behind it
 * is machine-generated (public/synthetic-test.wav), which means the dialect claim,
 * the uncertainty flag and the warmth of the translations are all untested here.
 * Swap in a real recording of a real grandparent and re-run:
 *
 *   npm run understand -- public/demo.webm
 *
 * then paste the resulting understand-output.json in below, with the real peaks.
 * Phase 6 also needs pre-generated Lesson objects added here so the whole app
 * renders with the network off.
 */
export const SEED_MEMORY: StoredMemory = {
  "memory": {
    "id": "mem_seed",
    "createdAt": "2026-08-22T02:00:00.000Z",
    "audioUrl": "/synthetic-test.wav",
    "durationSec": 52.67038548752834,
    "sourceLanguage": "zh / Mandarin",
    "speakerName": "Ah Ma",
    "title": "阿妈教我做咖椰",
    "titleTranslated": "Ah Ma Teaching Me How to Make Kaya",
  "titleTranslations": {"en": "Ah Ma Teaching Me How to Make Kaya", "zh": "阿妈教我做咖椰", "ms": "Ah Ma Ajar Saya Buat Kaya", "ta": "ஆமா எனக்கு காயா செய்யக் கத்துக் கொடுத்தாங்க"},
    "segments": [
      {
        "startSec": 0,
        "endSec": 8.22,
        "originalText": "我阿妈教我做咖椰的时候，我才14岁。那个时候是196几年，我们住在芽笼那边。",
        "uncertain": false,
        "translations": {
          "en": "When my mother taught me to make kaya, I was only 14 years old. That was sometime in the 1960s, and we were living over at Geylang.",
          "zh": "我妈妈教我做咖椰的时候，我才14岁。那个时候是196几年，我们住在芽笼那边。",
          "ms": "Masa mak saya ajar buat kaya, saya baru umur 14 tahun. Waktu itu sekitar tahun 1960-an, kami tinggal di kawasan Geylang.",
          "ta": "என் அம்மா எனக்குக் காயா செய்யக் கற்றுக்கொடுத்தபோது, எனக்கு 14 வயதுதான். அது 1960-களில், நாங்கள் கேலாங் பகுதியில் வசித்து வந்தோம்."
        }
      },
      {
        "startSec": 8.22,
        "endSec": 12.44,
        "originalText": "她说，咖椰一定要用斑斓叶，不然没有香味。",
        "uncertain": false,
        "translations": {
          "en": "She said you must use pandan leaves for kaya, otherwise it won't have any fragrance.",
          "zh": "她说，做咖椰一定要用斑斓叶，不然没有香味。",
          "ms": "Dia kata, buat kaya mesti guna daun pandan, kalau tidak tak ada wangi.",
          "ta": "காயா செய்வதற்குப் பாண்டான் இலைகள் கட்டாயம் வேண்டும், இல்லையென்றால் நறுமணம் இருக்காது என்று அவர் சொன்னார்."
        }
      },
      {
        "startSec": 12.44,
        "endSec": 16.38,
        "originalText": "要用十个鸭蛋，不是鸡蛋，鸭蛋比较香。",
        "uncertain": false,
        "translations": {
          "en": "You have to use ten duck eggs, not chicken eggs—duck eggs are more fragrant.",
          "zh": "要用十个鸭蛋，不是鸡蛋，鸭蛋比较香。",
          "ms": "Kena guna sepuluh biji telur itik, bukan telur ayam, telur itik lebih wangi.",
          "ta": "பத்து வாத்து முட்டைகளைப் பயன்படுத்த வேண்டும், கோழி முட்டைகள் அல்ல; வாத்து முட்டைகள் அதிக நறுமணத்தைக் கொடுக்கும்."
        }
      },
      {
        "startSec": 16.38,
        "endSec": 23.09,
        "originalText": "椰浆要自己磨，不可以买现成的。我妈妈每天早上5点就起来磨椰子。",
        "uncertain": false,
        "translations": {
          "en": "The coconut milk had to be freshly extracted yourself, you couldn't buy ready-made. My mother would get up at 5 in the morning every day to grate the coconut.",
          "zh": "椰浆要自己榨，不能买现成的。我妈妈每天早上5点就起来磨椰子。",
          "ms": "Santan kena perah sendiri, tak boleh beli yang siap. Mak saya bangun pukul 5 pagi setiap hari untuk parut kelapa.",
          "ta": "தேங்காய்ப்பாலை நாமே பிழிய வேண்டும், கடையில் வாங்கக் கூடாது. என் அம்மா தினமும் காலை 5 மணிக்கே எழுந்து தேங்காய் துருவுவார்."
        }
      },
      {
        "startSec": 23.09,
        "endSec": 30.16,
        "originalText": "糖要用马六甲的椰糖，一块一块的那种。她说白糖不行，白糖没有味道。",
        "uncertain": false,
        "translations": {
          "en": "For sugar, you had to use Gula Melaka, the kind that comes in solid blocks. She said white sugar wouldn't do, white sugar has no depth of flavor.",
          "zh": "糖要用马六甲的椰糖，一块一块的那种。她说白糖不行，白糖没有味道。",
          "ms": "Gula kena guna gula Melaka, jenis yang berketul-ketul tu. Dia kata gula pasir tak boleh, gula pasir tak ada rasa.",
          "ta": "சர்க்கரைக்கு மலாக்கா பனைவெல்லம் பயன்படுத்த வேண்டும், கட்டியாக இருக்கும் வகை. வெள்ளைச் சர்க்கரை கூடாது, அதில் சுவை இருக்காது என்று சொன்னார்."
        }
      },
      {
        "startSec": 30.16,
        "endSec": 34.1,
        "originalText": "然后要慢慢搅，一直搅，搅一个钟头，手很酸。",
        "uncertain": false,
        "translations": {
          "en": "Then you had to stir it slowly, non-stop, stirring for an entire hour until your arm ached.",
          "zh": "然后要慢慢搅，一直不停地搅，搅上一个小时，手臂非常酸痛。",
          "ms": "Lepas tu kena kacau perlahan-lahan, kacau terus sampai sejam, lenguh sangat tangan.",
          "ta": "பிறகு மெதுவாகக் கிளற வேண்டும், இடைவிடாமல் ஒரு மணி நேரம் கிளற வேண்டும், கை மிகவும் வலிக்கும்."
        }
      },
      {
        "startSec": 34.1,
        "endSec": 40.79,
        "originalText": "火不可以太大，太大就结块了。我第一次做的时候结块了，我阿妈骂我。",
        "uncertain": false,
        "translations": {
          "en": "The flame cannot be too big, if it's too big it will curdle into lumps. The first time I made it, it curdled, and my mother scolded me.",
          "zh": "火不能太大，太大就会结块。我第一次做的时候结块了，我妈妈责怪了我。",
          "ms": "Api tak boleh terlalu besar, kalau besar sangat nanti berketul. Masa pertama kali saya buat, ia berketul, mak saya marahkan saya.",
          "ta": "நெருப்பு அதிகமாக இருக்கக் கூடாது, அதிகமானால் அது கட்டியாகிவிடும். நான் முதல் முறை செய்தபோது கட்டியாகிவிட்டது, என் அம்மா என்னைத் திட்டினார்."
        }
      },
      {
        "startSec": 40.79,
        "endSec": 45.35,
        "originalText": "她说你太急了，做咖椰不可以急。",
        "uncertain": false,
        "translations": {
          "en": "She said, 'You're too rushed. You can't rush making kaya.'",
          "zh": "她说，‘你太着急了，做咖椰绝不能心急。’",
          "ms": "Dia kata, 'Kau terlalu gopoh, buat kaya tak boleh gopoh.'",
          "ta": "'நீ மிகவும் அவசரப்படுகிறாய், காயா செய்வதில் அவசரம் கூடாது' என்று அவர் சொன்னார்."
        }
      },
      {
        "startSec": 45.35,
        "endSec": 52.67,
        "originalText": "现在我的孙子都不会做了，他们只会去超市买，买的那种，一点都不像我阿妈做的。",
        "uncertain": false,
        "translations": {
          "en": "Now my grandchildren don't know how to make it at all; they just buy it from the supermarket, and what they buy doesn't taste anything like what my mother made.",
          "zh": "现在我的孙子们都不会做了，他们只会去超市买，买来的那种，一点都不像我妈妈做的味道。",
          "ms": "Sekarang cucu-cucu saya semua tak tahu buat dah, cuma tahu beli dekat pasar raya, yang dibeli tu langsung tak sama macam mak saya buat.",
          "ta": "இப்போது என் பேரக்குழந்தைகளுக்கு இதைச் செய்யவே தெரியாது, அவர்கள் பல்பொருள் அங்காடியில் வாங்க மட்டுமே செய்கிறார்கள்; வாங்கும் பொருள் என் அம்மா செய்தது போல் சிறிதும் இருப்பதில்லை."
        }
      }
    ],
    "summary": "She recalls learning to make kaya from her mother at age 14 in the 1960s while living in Geylang. Her mother taught her to use pandan leaves, ten duck eggs instead of chicken eggs, freshly grated coconut milk prepared at 5 am, and blocks of Melaka palm sugar. She explains that kaya requires continuous stirring over low heat for an hour, recalling being scolded when hers curdled because she rushed. She notes that her grandchildren today do not know how to make it and only buy store-bought kaya, which does not taste like her mother's.",
    "era": "196几年",
    "places": [
      "芽笼",
      "马六甲"
    ],
    "people": [
      "阿妈",
      "妈妈",
      "孙子"
    ],
    "skills": [
      "做咖椰",
      "磨椰子",
      "搅拌咖椰"
    ],
    "emotionalCore": "A reflection on patience, care, and the irreplaceable warmth of family tradition passed down through slow, handmade food.",
    "suggestedFormats": [
      {
        "format": "cookalong",
        "reason": "She describes step-by-step ingredients, timings, stirring techniques, and temperature control for traditional kaya."
      },
      {
        "format": "skillcard",
        "reason": "The precise tips on duck eggs, Gula Melaka, and low-heat stirring form a concise guide to traditional kaya making."
      },
      {
        "format": "storybook",
        "reason": "The narrative has a clear personal arc from learning in 1960s Geylang to the generational loss seen in her grandchildren."
      },
      {
        "format": "quiz",
        "reason": "Clear, specific culinary facts (why duck eggs, which sugar, what causes curdling) make for engaging trivia questions."
      }
    ]
  },
  "peaks": [0.882,0.641,0.745,0.723,0.595,0.638,0.746,0.809,0.944,0.561,0.695,0.601,0.669,0.646,0.669,0.6,0.673,0.691,0.646,1,0.749,0.63,0.699,0.657,0.482,0.573,0.693,0.518,0.599,0.572,0.801,0.565,0.683,0.15,0.605,0.644,0.75,0.743,0.73,0.562,0.659,0.555,0.084,0.566,0.537,0.354,0.546,0.563,0.795,0.661,0.605,0.752,0.507,0.821,0.362,0.711,0.596,0.646,0.604,0.426,0.963,0.638,0.631,0.716,0.695,0.654,0.577,0.638,0.646,0.67,0.531,0.728,0.617,0.678,0.603,0.639,0.264,0.607,0.521,0.634,0.764,0.74,0.644,0.658,0.568,0.58,0.398,0.623,0.636,0.762,0.826,0.648,0.705,0.723,0.533,0.652,0.612,0.628,0.64,0.856,0.727,0.636,0.676,0.242,0.673,0.743,0.523,0.808,0.635,0.603,0.664,0.086,0.653,0.707,0.657,0.582,0.848,0.551,0.526,0.665,0.729,0.634,0.639,0.114,0.894,0.62,0.758,0.573,0.572,0.632,0.619,0.59,0.508,0.635,0.641,0.673,0.435,0.253,0.673,0.761,0.607,0.599,0.632,0.757,0.214,0.674,0.599,0.621,0.692,0.634,0.745,0.604,0.704,0.437,0.685,0.623,0.682,0.804,0.591,0.752],
  "seeded": true
};

/**
 * Every lesson this app ships, for the seeded memory, already written — three
 * formats in four languages.
 *
 * A lesson written once never changes, so there is no reason to pay for it or wait
 * twenty seconds for it during a demo. More importantly it means the whole app
 * renders and plays with the network disabled, which is the difference between
 * having a demo and not having one when venue wifi dies.
 */
export const SEED_LESSONS: Lesson[] = [
  {
    "id": "les_mem_seed_cookalong_en",
    "memoryId": "mem_seed",
    "format": "cookalong",
    "language": "en",
    "payload": {
      "dish": "Ah Ma's Mother's Hand-Stirred Kaya",
      "servings": "She didn't say",
      "ingredients": [
        "Pandan leaves",
        "10 duck eggs",
        "Freshly extracted coconut milk",
        "Gula Melaka (Melaka palm sugar in solid blocks)"
      ],
      "steps": [
        {
          "n": 1,
          "instruction": "Grate fresh coconut and extract the coconut milk by hand. Ah Ma did not specify how many coconuts or how much milk to press out.",
          "tip": "Her mother woke up at 5:00 AM every morning to grate the coconut by hand; store-bought coconut milk is never allowed.",
          "askHer": "Ah Ma, how many coconuts did your mother grate to get enough milk for the ten duck eggs?",
          "segmentIndex": 3
        },
        {
          "n": 2,
          "instruction": "Prepare the pandan leaves. Ah Ma did not state how many leaves to use or whether to knot them or juice them.",
          "tip": "Pandan leaves are mandatory; without them, she says the kaya will have no fragrance.",
          "askHer": "Ah Ma, how many pandan leaves did you use, and did you tie them in a knot to cook with the custard or blend them in?",
          "segmentIndex": 1
        },
        {
          "n": 3,
          "instruction": "Crack and prepare ten duck eggs, using duck eggs rather than chicken eggs.",
          "tip": "Ah Ma says duck eggs are much more fragrant than chicken eggs.",
          "askHer": null,
          "segmentIndex": 2
        },
        {
          "n": 4,
          "instruction": "Prepare solid blocks of Melaka palm sugar (Gula Melaka). Ah Ma did not specify how many blocks to use or how to break them down.",
          "tip": "White sugar is not acceptable because it lacks depth of flavor; it must be solid blocks from Melaka.",
          "askHer": "Ah Ma, how many blocks of Gula Melaka did you add, and did you chop or melt them before mixing with the eggs?",
          "segmentIndex": 4
        },
        {
          "n": 5,
          "instruction": "Combine the ingredients and cook over a very gentle, low flame, stirring slowly and continuously for a full hour without stopping.",
          "tip": "Do not rush or let the heat get too high, or the mixture will curdle into lumps. Ah Ma was scolded by her mother the first time she made it because she rushed and it curdled.",
          "askHer": null,
          "segmentIndex": 6
        }
      ],
      "openQuestions": [
        "Ah Ma, how many coconuts and how many blocks of Gula Melaka did you use for the ten duck eggs?",
        "Did you strain the duck eggs and coconut milk before putting the pot on the stove?",
        "How did you prepare the pandan leaves—did you tie them into a knot or squeeze out their juice?"
      ]
    }
  },
  {
    "id": "les_mem_seed_cookalong_zh",
    "memoryId": "mem_seed",
    "format": "cookalong",
    "language": "zh",
    "payload": {
      "dish": "咖椰",
      "servings": "She didn't say",
      "ingredients": [
        "斑斓叶",
        "十个鸭蛋",
        "新鲜磨的椰浆",
        "马六甲椰糖（一块一块的那种）"
      ],
      "steps": [
        {
          "n": 1,
          "instruction": "准备新鲜椰浆。Ah Ma 提到椰浆要自己磨，不能买现成的，但没有具体说明磨椰子和榨浆的用量与方法，去问问 Ah Ma 该怎么做。",
          "tip": "Ah Ma 说她妈妈当年每天早上5点就起来磨椰子。",
          "askHer": "Ah Ma，新鲜椰浆要用多少个椰子来磨？具体要怎么榨出浓椰浆？",
          "segmentIndex": 3
        },
        {
          "n": 2,
          "instruction": "准备十个鸭蛋与马六甲椰糖。Ah Ma 说要用十个鸭蛋（不用鸡蛋，鸭蛋比较香），椰糖要用马六甲一块一块的那种（不用白糖），但没有说明椰糖的具体块数或重量以及如何处理混合，去问问 Ah Ma。",
          "tip": "Ah Ma 说用鸭蛋比较香，糖一定要用马六甲椰糖，白糖没有味道。",
          "askHer": "Ah Ma，十个鸭蛋需要配多少块马六甲椰糖？蛋和糖在下锅前要先打散融化吗？",
          "segmentIndex": 2
        },
        {
          "n": 3,
          "instruction": "放入斑斓叶增添香气。Ah Ma 强调一定要放斑斓叶，但没说需要几片叶子以及怎么处理（打结还是切段），去问问 Ah Ma。",
          "tip": "Ah Ma 说咖椰一定要用斑斓叶，不然没有香味。",
          "askHer": "Ah Ma，煮的时候要放几片斑斓叶？叶子要打结放进去还是怎么弄？",
          "segmentIndex": 1
        },
        {
          "n": 4,
          "instruction": "开小火，持续不断地搅拌煮一个小时。火绝对不能太大，必须慢慢搅，不能着急。",
          "tip": "Ah Ma 记得自己第一次做的时候火太大结块了，被她妈妈骂说太着急，做咖椰不可以急。",
          "askHer": null,
          "segmentIndex": 5
        }
      ],
      "openQuestions": [
        "Ah Ma，当年在芽笼做咖椰，要用几块马六甲椰糖才够甜？",
        "Ah Ma，煮咖椰是用隔水加热炖，还是直接放在炉火上慢慢搅？",
        "Ah Ma，新鲜斑斓叶要放几片？煮好之后什么时候把叶子捞出来？"
      ]
    }
  },
  {
    "id": "les_mem_seed_cookalong_ms",
    "memoryId": "mem_seed",
    "format": "cookalong",
    "language": "ms",
    "payload": {
      "dish": "Kaya Tradisional",
      "servings": "She didn't say",
      "ingredients": [
        "Daun pandan",
        "10 biji telur itik",
        "Santan segar yang diparut sendiri",
        "Gula Melaka berketul"
      ],
      "steps": [
        {
          "n": 1,
          "instruction": "Sediakan santan segar dengan memarut dan memerah sendiri kelapa pada awal pagi, jangan gunakan santan segera.",
          "tip": "Mak Ah Ma bangun seawal pukul 5 pagi setiap hari semata-mata untuk parut kelapa segar.",
          "askHer": "Ah Ma, berapa banyak biji kelapa yang mak Ah Ma parut untuk buat kaya ini?",
          "segmentIndex": 3
        },
        {
          "n": 2,
          "instruction": "Sediakan sepuluh biji telur itik dan daun pandan untuk memberi aroma wangi pada kaya.",
          "tip": "Mesti guna telur itik, bukan telur ayam, sebab telur itik aromanya jauh lebih wangi. Dan mesti guna daun pandan, kalau tidak kaya tiada baunya.",
          "askHer": "Ah Ma, macam mana mak Ah Ma campurkan telur itik dengan daun pandan tu dulu? Daun pandan disimpul atau diperah airnya?",
          "segmentIndex": 1
        },
        {
          "n": 3,
          "instruction": "Masukkan gula Melaka jenis berketul-ketul ke dalam bancuhan.",
          "tip": "Jangan sesekali guna gula pasir putih kerana mak Ah Ma kata gula pasir tak ada rasa yang betul.",
          "askHer": "Berapa banyak ketul gula Melaka yang perlu dimasukkan untuk sepuluh biji telur itik ini, Ah Ma?",
          "segmentIndex": 4
        },
        {
          "n": 4,
          "instruction": "Masak adunan dengan api yang perlahan sambil mengacau tanpa henti selama satu jam.",
          "tip": "Kacau terus-menerus perlahan-lahan walaupun tangan rasa sangat lenguh.",
          "askHer": null,
          "segmentIndex": 5
        },
        {
          "n": 5,
          "instruction": "Kawal api supaya tidak terlalu besar bagi mengelakkan kaya daripada berketul.",
          "tip": "Kali pertama Ah Ma buat sendiri, kaya itu berketul sebab api terlalu besar sampai kena marah dengan maknya: 'Kau terlalu gopoh, buat kaya tak boleh gopoh.'",
          "askHer": null,
          "segmentIndex": 6
        }
      ],
      "openQuestions": [
        "Ah Ma, waktu tinggal di Geylang dulu, macam mana rupa dapur tempat Ah Ma dan mak buat kaya pada tahun 1960-an?",
        "Berapa ketul gula Melaka dan berapa banyak santan kelapa yang mak Ah Ma gunakan untuk sepuluh biji telur itik itu?",
        "Macam mana cara Ah Ma tapis atau sediakan daun pandan sebelum dimasukkan ke dalam adunan telur dan santan?"
      ]
    }
  },
  {
    "id": "les_mem_seed_cookalong_ta",
    "memoryId": "mem_seed",
    "format": "cookalong",
    "language": "ta",
    "payload": {
      "dish": "காயா (Kaya)",
      "servings": "She didn't say",
      "ingredients": [
        "பாண்டான் இலைகள்",
        "10 வாத்து முட்டைகள்",
        "புதிதாகத் துருவிப் பிழிந்த தேங்காய்ப்பால்",
        "மலாக்கா பனைவெல்லக் கட்டிகள்"
      ],
      "steps": [
        {
          "n": 1,
          "instruction": "தேங்காயை வீட்டிலேயே புதிதாகத் துருவித் தேங்காய்ப்பால் பிழிந்து எடுக்கவும். எவ்வளவு தேங்காய்ப்பால் தேவை என்று அஹ் மாவிடம் கேட்கவும்.",
          "tip": "என் அம்மா தினமும் காலை 5 மணிக்கே எழுந்து தேங்காய் துருவுவார், கடையில் வாங்கும் தேங்காய்ப்பால் கூடாது.",
          "askHer": "காயா செய்வதற்கு எத்தனை தேங்காய்களில் இருந்து பால் பிழிய வேண்டும்?",
          "segmentIndex": 3
        },
        {
          "n": 2,
          "instruction": "பத்து வாத்து முட்டைகளை எடுத்துக்கொள்ளவும்.",
          "tip": "கோழி முட்டைகள் அல்ல, வாத்து முட்டைகள் தான் அதிக நறுமணத்தைக் கொடுக்கும்.",
          "askHer": null,
          "segmentIndex": 2
        },
        {
          "n": 3,
          "instruction": "மலாக்கா பனைவெல்லக் கட்டிகளைச் சேர்க்கவும். எவ்வளவு சேர்க்க வேண்டும் என்று அஹ் மாவிடம் கேட்கவும்.",
          "tip": "வெள்ளைச் சர்க்கரை கூடாது, அதில் சுவை இருக்காது.",
          "askHer": "பத்து வாத்து முட்டைகளுக்கு எத்தனை பனைவெல்லக் கட்டிகள் சேர்க்க வேண்டும்?",
          "segmentIndex": 4
        },
        {
          "n": 4,
          "instruction": "கலவையில் நறுமணத்திற்காகப் பாண்டான் இலைகளைச் சேர்க்கவும்.",
          "tip": "காயா செய்வதற்குப் பாண்டான் இலைகள் கட்டாயம் வேண்டும், இல்லையென்றால் நறுமணம் இருக்காது.",
          "askHer": "எத்தனை பாண்டான் இலைகளை எவ்வாறு நசுக்கி அல்லது முடிந்து போட வேண்டும்?",
          "segmentIndex": 1
        },
        {
          "n": 5,
          "instruction": "அடுப்பை மிகக் குறைந்த தீயில் வைக்கவும்.",
          "tip": "நெருப்பு அதிகமாக இருக்கக் கூடாது, அதிகமானால் அது கட்டியாகிவிடும். நான் முதல் முறை செய்தபோது கட்டியாகிவிட்டது, என் அம்மா என்னைத் திட்டினார்.",
          "askHer": null,
          "segmentIndex": 6
        },
        {
          "n": 6,
          "instruction": "கலவையை அவசரப்படாமல், இடைவிடாமல் மெதுவாக ஒரு மணி நேரம் கிளறிக்கொண்டே இருக்கவும்.",
          "tip": "நீ மிகவும் அவசரப்படுகிறாய், காயா செய்வதில் அவசரம் கூடாது என்று என் அம்மா சொன்னார்.",
          "askHer": null,
          "segmentIndex": 5
        }
      ],
      "openQuestions": [
        "1960-களில் கேலாங் பகுதியில் வாழ்ந்தபோது, பனைவெல்லத்தை எவ்வாறு எளிதாகக் கரைத்தீர்கள்?",
        "காயா கிளறும்போது பாத்திரம் நேரடியாகத் தீயில் இருந்ததா அல்லது இரட்டைப் பாத்திர முறையில் (Double boiler) சமைத்தீர்களா?",
        "காயா சரியான பதத்திற்கு வந்துவிட்டது என்பதை எப்படித் தெரிந்துகொள்வது?"
      ]
    }
  },
  {
    "id": "les_mem_seed_phrasecoach_en",
    "memoryId": "mem_seed",
    "format": "phrasecoach",
    "language": "en",
    "payload": {
      "phrases": [
        {
          "original": "斑斓叶，不然没有香味",
          "romanisation": "bān lán yè, bù rán méi yǒu xiāng wèi",
          "meaning": "Pandan leaves, without which there is simply no fragrance or soul in the kaya.",
          "whenToUse": "Use when someone tries to cut corners or omit the fresh pandan leaves when cooking.",
          "askHer": null,
          "segmentIndex": 1
        },
        {
          "original": "鸭蛋比较香",
          "romanisation": "yā dàn bǐ jiào xiāng",
          "meaning": "Duck eggs have a richer aroma and fat content compared to ordinary chicken eggs.",
          "whenToUse": "Say this when explaining why traditional kaya requires duck eggs rather than standard chicken eggs.",
          "askHer": null,
          "segmentIndex": 2
        },
        {
          "original": "不可以买现成的",
          "romanisation": "bù kě yǐ mǎi xiàn chéng de",
          "meaning": "You must make it from scratch by hand rather than buying pre-packaged, ready-made shortcuts.",
          "whenToUse": "Use whenever someone suggests buying canned coconut milk or store shortcuts instead of grating and squeezing fresh coconut.",
          "askHer": null,
          "segmentIndex": 3
        },
        {
          "original": "一块一块的那种",
          "romanisation": "yī kuài yī kuài de nà zhǒng",
          "meaning": "The solid, unrefined blocks of authentic Melaka palm sugar (Gula Melaka), rather than granulated sugar.",
          "whenToUse": "Use when picking out genuine block palm sugar at the sundry shop or market.",
          "askHer": "Ah Ma, which brand or type of Melaka palm sugar block did your family look for back then?",
          "segmentIndex": 4
        },
        {
          "original": "慢慢搅，一直搅",
          "romanisation": "màn màn jiǎo, yī zhí jiǎo",
          "meaning": "Stir slowly and continuously without stopping for a moment.",
          "whenToUse": "Say this to someone standing over the pot who wants to take a break or walk away from the kaya.",
          "askHer": null,
          "segmentIndex": 5
        },
        {
          "original": "结块了",
          "romanisation": "jié kuài le",
          "meaning": "It curdled into lumps because the flame was too high or it was rushed.",
          "whenToUse": "Said with disappointment when an egg mixture or custard overheats and splits into scrambled lumps.",
          "askHer": null,
          "segmentIndex": 6
        },
        {
          "original": "做咖椰不可以急",
          "romanisation": "zuò kā yē bù kě yǐ jí",
          "meaning": "Making kaya cannot be rushed; good results require absolute patience.",
          "whenToUse": "Say this when someone gets impatient while cooking slow food or wants to turn up the flame to finish sooner.",
          "askHer": null,
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "Ah Ma, what kind of grater or tool did your mother use to grate the coconut at 5 am in Geylang?",
        "Where in Geylang did your family buy the duck eggs and Melaka palm sugar blocks back in the 1960s?",
        "How did your mother know the exact moment the kaya was done cooking after stirring for an hour?"
      ]
    }
  },
  {
    "id": "les_mem_seed_phrasecoach_zh",
    "memoryId": "mem_seed",
    "format": "phrasecoach",
    "language": "zh",
    "payload": {
      "phrases": [
        {
          "original": "斑斓叶",
          "romanisation": "bān lán yè",
          "meaning": "做咖椰不可或缺的灵魂香草，Ah Ma强调没有它就完全没有香气。",
          "whenToUse": "在挑选做南洋甜点的香草原料时使用；若用普通香精代替，在Ah Ma看来就是不对的。",
          "askHer": "Ah Ma，当年芽笼家里种的斑斓叶是种在院子里还是花盆里的？",
          "segmentIndex": 1
        },
        {
          "original": "鸭蛋比较香",
          "romanisation": "yā dàn bǐ jiào xiāng",
          "meaning": "传统咖椰浓郁风味的秘诀，坚持用鸭蛋而非鸡蛋来达到浓稠与醇香。",
          "whenToUse": "讨论烘焙或传统甜品用料时，向不解为什么不用鸡蛋的人解释。",
          "askHer": null,
          "segmentIndex": 2
        },
        {
          "original": "椰浆要自己磨，不可以买现成的",
          "romanisation": "yē jiāng yào zì jǐ mó, bù kě yǐ mǎi xiàn chéng de",
          "meaning": "代表对手工新鲜度的绝对坚持，体现早年食物倾注的心血与讲究。",
          "whenToUse": "提醒别人做事或做饭不要图省事偷工减料时使用。",
          "askHer": "Ah Ma，当年阿太是用什么工具在早上5点磨椰子的？",
          "segmentIndex": 3
        },
        {
          "original": "一块一块的那种",
          "romanisation": "yī kuài yī kuài de nà zhǒng",
          "meaning": "特指正宗马六甲椰糖（Gula Melaka）的原生态块状质感，绝非精制白糖或散装糖粉。",
          "whenToUse": "去杂货铺寻找真正地道椰糖时向店员描述。",
          "askHer": null,
          "segmentIndex": 4
        },
        {
          "original": "慢慢搅，一直搅，搅一个钟头",
          "romanisation": "màn màn jiǎo, yī zhí jiǎo, jiǎo yí gè zhōng tóu",
          "meaning": "制作咖椰最考验耐力的一步，用低火不断搅拌以防结块，是功夫与时间的投入。",
          "whenToUse": "形容需要极大耐心、不能停歇的精细手工劳动。",
          "askHer": null,
          "segmentIndex": 5
        },
        {
          "original": "做咖椰不可以急",
          "romanisation": "zuò kā yē bù kě yǐ jí",
          "meaning": "不仅是烹饪法则，更是Ah Ma从母亲那里学到的人生处事哲学——心急就会把事情搞砸。",
          "whenToUse": "当有人急躁想要走捷径、结果把事情做坏时，用来提醒对方稳住心态。",
          "askHer": null,
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "Ah Ma，你们196几年在芽笼住的时候，具体是住在芽笼哪一条巷？",
        "阿太当年早上5点磨椰子，是用刨椰丝的木凳还是石磨磨出来的？",
        "你第一次做咖椰太急结块被阿太骂，那一锅最后是怎么处理的？"
      ]
    }
  },
  {
    "id": "les_mem_seed_phrasecoach_ms",
    "memoryId": "mem_seed",
    "format": "phrasecoach",
    "language": "ms",
    "payload": {
      "phrases": [
        {
          "original": "鸭蛋比较香",
          "romanisation": "yādàn bǐjiào xiāng",
          "meaning": "Telur itik memberi aroma dan rasa yang jauh lebih harum serta berlemak berbanding telur ayam bila membuat kaya.",
          "whenToUse": "Gunakan apabila membincangkan petua orang lama tentang pemilihan bahan masakan asli yang tidak boleh diganti sebarangan.",
          "askHer": null,
          "segmentIndex": 2
        },
        {
          "original": "不可以买现成的",
          "romanisation": "bù kěyǐ mǎi xiànchéng de",
          "meaning": "Tak boleh beli barang atau santan yang sudah siap diproses di kedai; mesti parut dan perah sendiri demi kualiti.",
          "whenToUse": "Cakap bila mahu menegaskan bahawa kerja tangan dan kesegaran bahan tidak boleh dipotong kompas dengan jalan pintas.",
          "askHer": null,
          "segmentIndex": 3
        },
        {
          "original": "手很酸",
          "romanisation": "shǒu hěn suān",
          "meaning": "Rasa sengal dan lenguh pada otot tangan akibat mengacau periuk kaya secara berterusan selama sejam tanpa henti.",
          "whenToUse": "Bila mengadu secara berseloroh tentang keletihan fizikal selepas membuat kerja dapur yang memerlukan tenaga konsisten.",
          "askHer": null,
          "segmentIndex": 5
        },
        {
          "original": "做咖椰不可以急",
          "romanisation": "zuò kāyē bù kěyǐ jí",
          "meaning": "Membuat kaya memerlukan kesabaran penuh di hadapan api kecil; jika gopoh, adunan akan berketul dan rosak.",
          "whenToUse": "Nasihat kepada sesiapa yang hilang sabar atau cuba mengambil jalan mudah dalam tugas yang menuntut ketelitian.",
          "askHer": null,
          "segmentIndex": 7
        },
        {
          "original": "一点都不像我阿妈做的",
          "romanisation": "yìdiǎn dōu bú xiàng wǒ āmā zuò de",
          "meaning": "Rasa kaya jualan kedai zaman sekarang langsung tidak dapat menandingi keaslian dan keikhlasan air tangan ibunya.",
          "whenToUse": "Digunakan bila membandingkan makanan komersial yang tawar dengan hidangan tradisional penuh nostalgia yang dimasak oleh keluarga.",
          "askHer": null,
          "segmentIndex": 8
        }
      ],
      "openQuestions": [
        "Ah Ma, masa umur 14 tahun dulu di Geylang, Ah Ma parut kelapa guna kukur kelapa jenis apa waktu pukul 5 pagi?",
        "Berapa ketul gula Melaka yang Ah Ma dan emak masukkan untuk sepuluh biji telur itik tu?",
        "Kaya yang Ah Ma buat beramai-ramai masa tu simpan dalam bekas apa, dan tahan sampai berapa lama?"
      ]
    }
  },
  {
    "id": "les_mem_seed_phrasecoach_ta",
    "memoryId": "mem_seed",
    "format": "phrasecoach",
    "language": "ta",
    "payload": {
      "phrases": [
        {
          "original": "一定要用斑斓叶，不然没有香味",
          "romanisation": "yī dìng yào yòng bān lán yè, bù rán méi yǒu xiāng wèi",
          "meaning": "பாண்டான் இலைகள் இல்லாமல் உண்மையான காயாவின் நறுமணம் வராது என்று Ah Ma தன் தாயிடமிருந்து கற்றுக்கொண்ட முக்கிய விதி.",
          "whenToUse": "பாரம்பரிய நறுமணம் கொண்ட உணவைச் சமைக்கும்போது, முக்கிய மூலப்பொருளைத் தவிர்க்க நினைப்பவர்களிடம் சொல்ல வேண்டியது.",
          "askHer": null,
          "segmentIndex": 1
        },
        {
          "original": "要用十个鸭蛋，不是鸡蛋，鸭蛋比较香",
          "romanisation": "yào yòng shí gè yā dàn, bù shì jī dàn, yā dàn bǐ jiào xiāng",
          "meaning": "கோழி முட்டையை விட பத்து வாத்து முட்டைகளே காயாவுக்குச் சரியான கெட்டியான தன்மையையும் சுவையையும் தரும் என்ற Ah Ma-வின் விளக்கம்.",
          "whenToUse": "காயா செய்யும்போது ஏன் கோழி முட்டைக்குப் பதிலாக வாத்து முட்டையைப் பயன்படுத்த வேண்டும் என்று விவரிக்கும்போது.",
          "askHer": null,
          "segmentIndex": 2
        },
        {
          "original": "椰浆要自己磨，不可以买现成的",
          "romanisation": "yē jiāng yào zì jǐ mó, bù kě yǐ mǎi xiàn chéng de",
          "meaning": "கடையில் வாங்கும் தேங்காய்ப்பாலைப் பயன்படுத்தாமல், அதிகாலையிலேயே கைப்படத் துருவிப் பிழிய வேண்டும் என்ற கடுமையான பாரம்பரிய முறை.",
          "whenToUse": "உணவின் தரத்திற்குக் குறுக்குவழிகளைத் தேடாமல் உழைப்பைக் கொடுக்க வேண்டும் என்பதை வலியுறுத்தும்போது.",
          "askHer": "Ah Ma, கேலாங்கில் அதிகாலை 5 மணிக்குத் தேங்காய் துருவப் பயன்படுத்திய பழைய கருவி எப்படி இருக்கும் என்று கேளுங்கள்.",
          "segmentIndex": 3
        },
        {
          "original": "马六甲的椰糖，一块一块的那种",
          "romanisation": "mǎ liù jiǎ de yē táng, yī kuài yī kuài de nà zhǒng",
          "meaning": "வெள்ளைச் சர்க்கரைக்கு மாற்றாக, மலாக்காவிலிருந்து வரும் பாரம்பரியக் கெட்டியான பனைவெல்லக் கட்டிகள்.",
          "whenToUse": "காயாவுக்குச் சரியான நிறமும் பிரத்யேக நறுமணமும் தரும் பனைவெல்லத்தைப் பற்றிக் குறிப்பிடும்போது.",
          "askHer": null,
          "segmentIndex": 4
        },
        {
          "original": "一直搅，搅一个钟头，手很酸",
          "romanisation": "yī zhí jiǎo, jiǎo yī gè zhōng tóu, shǒu hěn suān",
          "meaning": "ஒரு மணி நேரம் சளைக்காமல் கிளறும்போது கை வலித்தாலும் விடாமுயற்சியுடன் செய்த சமையல் அனுபவம்.",
          "whenToUse": "பொறுமையும் தொடர் உழைப்பும் தேவைப்படும் ஒரு கடினமான வேலையைச் செய்யும்போது சொல்லலாம்.",
          "askHer": null,
          "segmentIndex": 5
        },
        {
          "original": "你太急了，做咖椰不可以急",
          "romanisation": "nǐ tài jí le, zuò kā yē bù kě yǐ jí",
          "meaning": "அவசரப்பட்டால் காயா கெட்டுப்போய் கட்டியாகிவிடும், சமையலில் பொறுமை அவசியம் என்று Ah Ma-வின் அம்மா கூறிய அறிவுரை.",
          "whenToUse": "யாராவது பொறுமையிழந்து வேலையை அவசரமாக முடித்துவிடப் பார்க்கும்போது அவர்களுக்கு நினைவூட்டப் பயன்படுத்தலாம்.",
          "askHer": null,
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "Ah Ma, 1960-களில் நீங்கள் கேலாங்கில் இருந்தபோது வாத்து முட்டைகளையும் மலாக்கா பனைவெல்லத்தையும் எந்தக் கடையிலிருந்து வாங்கினீர்கள்?",
        "Ah Ma, அடுப்பில் ஒரு மணி நேரம் காயாவைக் கிளறும்போது என்ன மாதிரியான பாத்திரத்தையும் கரண்டியையும் பயன்படுத்தினீர்கள்?",
        "Ah Ma, நீங்கள் முதல் முறை செய்த காயா கட்டியானபோது, உங்கள் அம்மா அதைச் சரிசெய்தாரா அல்லது புதிதாக மீண்டும் செய்ய வைத்தாரா?"
      ]
    }
  },
  {
    "id": "les_mem_seed_branching_en",
    "memoryId": "mem_seed",
    "format": "branching",
    "language": "en",
    "payload": {
      "premise": "You are fourteen years old in the 1960s, standing in the kitchen of your home in Geylang as your mother teaches you how to make kaya.",
      "nodes": [
        {
          "id": "kitchen_prep",
          "text": "You are fourteen years old in Geylang. Your mother has prepared ten duck eggs, fresh pandan leaves, and blocks of Melaka palm sugar by the stove.",
          "segmentIndex": 0,
          "choices": [
            {
              "label": "Turn up the fire so the mixture cooks faster.",
              "nextId": "flame_too_high"
            },
            {
              "label": "Keep the flame low and begin stirring continuously.",
              "nextId": "stirring_pot"
            }
          ]
        },
        {
          "id": "flame_too_high",
          "text": "The flame is too big. The mixture quickly curdles into lumps, and your mother scolds you for trying to hurry.",
          "segmentIndex": 6,
          "choices": [
            {
              "label": "Listen to her words and learn why patience is the only way.",
              "nextId": "kaya_lesson"
            }
          ]
        },
        {
          "id": "stirring_pot",
          "text": "You stir slowly without stopping. As you push past half an hour over the low heat, your arm aches from the continuous motion.",
          "segmentIndex": 5,
          "choices": [
            {
              "label": "Turn up the heat to speed things up and rest your arm.",
              "nextId": "flame_too_high"
            },
            {
              "label": "Keep stirring slowly for the full hour despite the ache.",
              "nextId": "kaya_lesson"
            }
          ]
        },
        {
          "id": "kaya_lesson",
          "text": "Your mother tells you that you cannot rush making kaya. You learn that slow, steady heat is what makes it fragrant and smooth.",
          "segmentIndex": 7,
          "choices": []
        }
      ],
      "trueEndingId": "kaya_lesson",
      "openQuestions": [
        "Ah Ma, what kind of tool did your mother use to grate the coconut at five in the morning?",
        "What kind of stove or pot did you use to cook the kaya in Geylang?",
        "Did you eat the kaya with toast, or did your family eat it in other ways?"
      ]
    }
  },
  {
    "id": "les_mem_seed_branching_zh",
    "memoryId": "mem_seed",
    "format": "branching",
    "language": "zh",
    "payload": {
      "premise": "那是196几年的芽笼，你才14岁，站在灶台前，妈妈正准备教你做家里的咖椰。",
      "nodes": [
        {
          "id": "node_ingredients",
          "text": "妈妈清晨5点就起来磨好了新鲜椰浆，拿出了马六甲的一块块椰糖和斑斓叶。现在要准备蛋，灶台边放着鸭蛋和鸡蛋。",
          "segmentIndex": 2,
          "choices": [
            {
              "label": "照妈妈说的，拿十个鸭蛋来做",
              "nextId": "node_stirring"
            },
            {
              "label": "图方便，拿手边的鸡蛋来做",
              "nextId": "node_alt_eggs"
            }
          ]
        },
        {
          "id": "node_alt_eggs",
          "text": "如果用了鸡蛋，做出来的咖椰可能就少了鸭蛋特有的香味，妈妈定会提醒你：鸭蛋才够香。",
          "segmentIndex": 2,
          "choices": [
            {
              "label": "换回十个鸭蛋，开始起锅慢慢煮",
              "nextId": "node_stirring"
            }
          ]
        },
        {
          "id": "node_stirring",
          "text": "食材都下了锅，需要一直搅动。手越来越酸，必须持续搅上一个钟头，而且火候容不得大意。",
          "segmentIndex": 5,
          "choices": [
            {
              "label": "心里着急想快点好，把火开大一点",
              "nextId": "node_curdled"
            },
            {
              "label": "耐住性子，用小火一直慢慢搅",
              "nextId": "node_slow_stir"
            }
          ]
        },
        {
          "id": "node_curdled",
          "text": "火开得太大，锅里的咖椰一下子结块了。妈妈当场骂了你，说你太急了，做咖椰不可以急。",
          "segmentIndex": 6,
          "choices": [
            {
              "label": "记住这顿责备，懂得做咖椰绝不能心急",
              "nextId": "node_true_ending"
            }
          ]
        },
        {
          "id": "node_slow_stir",
          "text": "如果第一次就耐着性子小火慢搅，咖椰自然不会结块，但你就少挨了一次那句让你记了一辈子的训话。",
          "segmentIndex": 7,
          "choices": [
            {
              "label": "回想妈妈当年的教导",
              "nextId": "node_true_ending"
            }
          ]
        },
        {
          "id": "node_true_ending",
          "text": "妈妈对你说：做咖椰不可以急。那份需要早上5点磨椰浆、慢火搅足一个钟头的味道，成了超市买来的咖椰永远比不上的记忆。",
          "segmentIndex": 7,
          "choices": []
        }
      ],
      "trueEndingId": "node_true_ending",
      "openQuestions": [
        "阿妈，当年您第一次做咖椰把火开大结块之后，那一锅后来是怎么处理的？",
        "阿妈，您14岁在芽笼住的时候，家里是用什么样的炉灶和锅来搅咖椰的？",
        "阿妈，太婆当年教您挑斑斓叶和马六甲椰糖时，有没有教过怎么看好坏？"
      ]
    }
  },
  {
    "id": "les_mem_seed_branching_ms",
    "memoryId": "mem_seed",
    "format": "branching",
    "language": "ms",
    "payload": {
      "premise": "Tahun 1960-an di Geylang. Anda berumur 14 tahun, berdiri di dapur bersama emak anda untuk belajar cara membuat kaya tradisional.",
      "nodes": [
        {
          "id": "node_bahan",
          "text": "Emak anda bangun pukul 5 pagi untuk memarut kelapa sendiri bagi mendapatkan santan segar. Sekarang tiba giliran anda memilih bahan lain: daun pandan, ketulan gula Melaka, dan telur.",
          "segmentIndex": 3,
          "choices": [
            {
              "label": "Gunakan sepuluh biji telur itik dan ketulan gula Melaka seperti yang dipesan emak.",
              "nextId": "node_kacau"
            },
            {
              "label": "Gunakan telur ayam dan gula pasir biasa supaya lebih mudah disediakan.",
              "nextId": "node_gula_putih"
            }
          ]
        },
        {
          "id": "node_gula_putih",
          "text": "Emak anda segera menegur. Kata emak, gula pasir tiada rasa berbanding gula Melaka, dan kaya mesti menggunakan sepuluh biji telur itik kerana telur itik lebih wangi berbanding telur ayam.",
          "segmentIndex": 4,
          "choices": [
            {
              "label": "Tukar semula kepada sepuluh biji telur itik dan ketulan gula Melaka.",
              "nextId": "node_kacau"
            }
          ]
        },
        {
          "id": "node_kacau",
          "text": "Semua bahan sudah ada dalam kuali bersama daun pandan yang wangi. Sekarang anda perlu mengacau adunan di atas dapur.",
          "segmentIndex": 1,
          "choices": [
            {
              "label": "Kuatkan api sedikit dan kacau laju-laju supaya cepat masak.",
              "nextId": "node_berketul"
            },
            {
              "label": "Gunakan api perlahan dan terus mengacau selama satu jam walaupun tangan terasa sangat lenguh.",
              "nextId": "node_berjaya"
            }
          ]
        },
        {
          "id": "node_berketul",
          "text": "Api yang terlalu besar menyebabkan kaya anda menjadi berketul-ketul. Emak memarahi anda dan berpesan: 'Kau terlalu gopoh, buat kaya tak boleh gopoh.'",
          "segmentIndex": 6,
          "choices": [
            {
              "label": "Belajar daripada kesilapan: kecilkan api dan terus kacau perlahan-lahan dengan sabar selama satu jam.",
              "nextId": "node_berjaya"
            }
          ]
        },
        {
          "id": "node_berjaya",
          "text": "Anda mengawal api supaya tetap kecil dan terus mengacau tanpa henti selama satu jam. Tangan memang lenguh, tetapi kayanya licin, wangi dengan daun pandan dan santan segar—rasa asli yang langsung tidak sama seperti kaya yang dibeli di pasar raya hari ini.",
          "segmentIndex": 5,
          "choices": []
        }
      ],
      "trueEndingId": "node_berjaya",
      "openQuestions": [
        "Ah Ma, waktu di Geylang dulu, macam mana rupa dapur dan kuali yang Ah Ma guna untuk kacau kaya tu?",
        "Macam mana Ah Ma dan mak Ah Ma dapatkan bekalan gula Melaka dan telur itik masa tahun 1960-an dulu?",
        "Berapa lama masa yang diambil untuk Ah Ma betul-betul mahir buat kaya tanpa berketul selepas kali pertama kena marah?"
      ]
    }
  },
  {
    "id": "les_mem_seed_branching_ta",
    "memoryId": "mem_seed",
    "format": "branching",
    "language": "ta",
    "payload": {
      "premise": "1960-களில், கேலாங்கில் உள்ள உங்கள் வீட்டுச் சமையலறையில் நீங்கள் 14 வயதுச் சிறுமியாக நிற்கிறீர்கள். உங்கள் அம்மா உங்களுக்குக் காயா செய்யக் கற்றுக்கொடுக்கத் தொடங்குகிறார்.",
      "nodes": [
        {
          "id": "prep_ingredients",
          "text": "மலாக்கா பனைவெல்லக் கட்டிகள், பாண்டான் இலைகள், அதிகாலை 5 மணிக்கே எழுந்து துருவிப் பிழிந்த தேங்காய்ப்பால் எல்லாம் தயாராக உள்ளன. இப்போது முட்டைகளைச் சேர்க்க வேண்டும்.",
          "segmentIndex": 4,
          "choices": [
            {
              "label": "வீட்டில் இருக்கும் கோழி முட்டைகளை எடுக்கலாம்",
              "nextId": "chicken_eggs"
            },
            {
              "label": "பத்து வாத்து முட்டைகளைத் தேடி எடுக்கலாம்",
              "nextId": "stirring_step"
            }
          ]
        },
        {
          "id": "chicken_eggs",
          "text": "கோழி முட்டைகளை எடுக்க நினைத்தால் அம்மா உடனே தடுத்துவிடுவார். வாத்து முட்டைகள்தான் காயாவுக்கு நல்ல நறுமணத்தைத் தரும் என்று அவர் கண்டிப்பாகக் கூறுகிறார்.",
          "segmentIndex": 2,
          "choices": [
            {
              "label": "அம்மா சொன்னபடி பத்து வாத்து முட்டைகளை எடுத்து வரலாம்",
              "nextId": "stirring_step"
            }
          ]
        },
        {
          "id": "stirring_step",
          "text": "எல்லாவற்றையும் பாத்திரத்தில் இட்டுக் கிளறத் தொடங்குகிறீர்கள். ஒரு மணி நேரம் தொடர்ந்து கிளற வேண்டும், கை மிகவும் வலிக்கிறது.",
          "segmentIndex": 5,
          "choices": [
            {
              "label": "சீக்கிரம் முடியட்டும் என்று அடுப்பின் தீயை அதிகரிக்கலாம்",
              "nextId": "rushed_curdled"
            },
            {
              "label": "கை வலித்தாலும் பொறுமையுடன் குறைந்த தீயிலேயே தொடர்ந்து கிளறலாம்",
              "nextId": "patient_success"
            }
          ]
        },
        {
          "id": "rushed_curdled",
          "text": "தீயை அதிகப்படுத்தியதால் காயா சட்டெனக் கட்டியாகிவிடுகிறது. அம்மா உங்களைத் திட்டுகிறார்: 'நீ மிகவும் அவசரப்படுகிறாய், காயா செய்யும்போது அவசரப்படவே கூடாது.'",
          "segmentIndex": 6,
          "choices": [
            {
              "label": "அம்மாவின் கண்டிப்பைப் புரிந்து கொண்டு, மீண்டும் பக்குவமாகக் கிளறக் கற்றுக்கொள்ளலாம்",
              "nextId": "patient_success"
            }
          ]
        },
        {
          "id": "patient_success",
          "text": "காயா செய்வதற்குப் பொறுமைதான் மிக முக்கியம் என்பதைப் புரிந்து கொள்கிறீர்கள். குறைந்த தீயில் ஒரு மணி நேரம் கை வலிக்கக் கிளறி, பாண்டான் இலை மணக்க அம்மாவின் கைப்பக்குவத்தில் காயாவைச் செய்து முடிக்கிறீர்கள்.",
          "segmentIndex": 7,
          "choices": []
        }
      ],
      "trueEndingId": "patient_success",
      "openQuestions": [
        "அம்மா, கேலாங் வீட்டில் அன்று தேங்காய் துருவ என்ன மாதிரியான துருவல் பலகையைப் பயன்படுத்தினீர்கள்?",
        "வாத்து முட்டைகளை வாங்க கேலாங்கில் எந்தக் கடைக்கு அல்லது சந்தைக்குச் செல்வீர்கள்?",
        "மலாக்கா பனைவெல்லக் கட்டிகளை உங்கள் அம்மா எங்கிருந்து வாங்கி வந்தார்?"
      ]
    }
  },
  {
    "id": "les_mem_seed_storybook_en",
    "memoryId": "mem_seed",
    "format": "storybook",
    "language": "en",
    "payload": {
      "panels": [
        {
          "caption": "Ah Ma's mother wakes up early while it is still dark outside. She grates fresh coconut to squeeze out thick coconut milk.",
          "imagePrompt": "A woman sitting on a wooden stool in an old kitchen at dawn, grating a fresh coconut half over a bowl.",
          "segmentIndex": 3
        },
        {
          "caption": "Ah Ma counts out ten big duck eggs on the kitchen table. Duck eggs make the sweet spread rich and fragrant.",
          "imagePrompt": "A fourteen-year-old girl placing large duck eggs into a clay bowl on a rustic wooden table.",
          "segmentIndex": 2
        },
        {
          "caption": "They cut thick blocks of dark palm sugar. Ah Ma's mother explains that this sugar gives the best flavor.",
          "imagePrompt": "A mother and teenage daughter slicing solid dark brown palm sugar blocks with a knife on a wooden board.",
          "segmentIndex": 4
        },
        {
          "caption": "Ah Ma washes long green pandan leaves. She ties them into tight knots to cook in the pot.",
          "imagePrompt": "A young girl tying long green pandan leaves into neat knots next to a metal pot on a counter.",
          "segmentIndex": 1
        },
        {
          "caption": "Ah Ma stirs the warm pot round and round without stopping. Her arm gets very tired after stirring for a whole hour.",
          "imagePrompt": "A young girl holding a wooden spoon with both hands, continuously stirring a wide pot over a small stove.",
          "segmentIndex": 5
        },
        {
          "caption": "Ah Ma watches the tiny flame closely. She learns to stir slowly and gently so the sweet kaya turns completely smooth.",
          "imagePrompt": "A mother and daughter leaning over a stove with a tiny blue flame, watching the thick smooth brown spread cook.",
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "Ah Ma, what kind of tool did your mother use to grate the coconut so early in the morning?",
        "What did your kitchen in Geylang look like back in the 1960s?",
        "How did you usually eat the warm kaya once it was finished?"
      ]
    }
  },
  {
    "id": "les_mem_seed_storybook_zh",
    "memoryId": "mem_seed",
    "format": "storybook",
    "language": "zh",
    "payload": {
      "panels": [
        {
          "caption": "天还没亮，妈妈就在厨房里磨新鲜的椰子。",
          "imagePrompt": "A woman sitting on a wooden stool in an old kitchen at dawn, grating a fresh coconut half over a bowl.",
          "segmentIndex": 3
        },
        {
          "caption": "桌上放着绿绿的斑斓叶和十个圆圆的鸭蛋。",
          "imagePrompt": "A fourteen-year-old girl placing large duck eggs into a clay bowl on a rustic wooden table.",
          "segmentIndex": 2
        },
        {
          "caption": "阿妈把一块块深褐色的马六甲椰糖拿在手里。",
          "imagePrompt": "A mother and teenage daughter slicing solid dark brown palm sugar blocks with a knife on a wooden board.",
          "segmentIndex": 4
        },
        {
          "caption": "阿妈握着木勺慢慢搅，一直搅了一个钟头。",
          "imagePrompt": "A young girl tying long green pandan leaves into neat knots next to a metal pot on a counter.",
          "segmentIndex": 1
        },
        {
          "caption": "火太大了，锅里的咖椰结成了小块，妈妈提醒她不能心急。",
          "imagePrompt": "A young girl holding a wooden spoon with both hands, continuously stirring a wide pot over a small stove.",
          "segmentIndex": 5
        },
        {
          "caption": "阿妈看着超市买来的咖椰，心里还是想念当年那一锅香香的味道。",
          "imagePrompt": "A mother and daughter leaning over a stove with a tiny blue flame, watching the thick smooth brown spread cook.",
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "阿妈，你妈妈当年是用什么工具在早上五点磨椰子的？",
        "斑斓叶放进锅里之前，需要先打结或者剪碎吗？",
        "你第一次成功做好的咖椰，是抹在什么样的面包上吃的？"
      ]
    }
  },
  {
    "id": "les_mem_seed_storybook_ms",
    "memoryId": "mem_seed",
    "format": "storybook",
    "language": "ms",
    "payload": {
      "panels": [
        {
          "caption": "Ibu Ah Ma bangun pada awal pagi untuk memarut kelapa. Dia memerah santan segar sendiri di dapur.",
          "imagePrompt": "A woman sitting on a wooden stool in an old kitchen at dawn, grating a fresh coconut half over a bowl.",
          "segmentIndex": 3
        },
        {
          "caption": "Ah Ma menyediakan sepuluh biji telur itik. Daun pandan hijau yang wangi turut diletakkan di atas meja.",
          "imagePrompt": "A fourteen-year-old girl placing large duck eggs into a clay bowl on a rustic wooden table.",
          "segmentIndex": 2
        },
        {
          "caption": "Ah Ma memotong ketulan gula Melaka yang manis. Gula ini membuatkan kaya berasa sungguh enak.",
          "imagePrompt": "A mother and teenage daughter slicing solid dark brown palm sugar blocks with a knife on a wooden board.",
          "segmentIndex": 4
        },
        {
          "caption": "Ah Ma berdiri di tepi dapur mengacau kaya dengan senduk kayu. Tangannya terasa lenguh kerana mengacau selama satu jam.",
          "imagePrompt": "A young girl tying long green pandan leaves into neat knots next to a metal pot on a counter.",
          "segmentIndex": 1
        },
        {
          "caption": "Ah Ma mengacau terlalu cepat sehingga adunan kaya menjadi berketul. Ibunya menegur Ah Ma supaya tidak gopoh.",
          "imagePrompt": "A young girl holding a wooden spoon with both hands, continuously stirring a wide pot over a small stove.",
          "segmentIndex": 5
        },
        {
          "caption": "Ah Ma rindu akan rasa kaya buatan ibunya dahulu. Kaya dari kedai langsung tidak sama rasanya.",
          "imagePrompt": "A mother and daughter leaning over a stove with a tiny blue flame, watching the thick smooth brown spread cook.",
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "Ah Ma, macam mana rupa rumah dan dapur Ah Ma di Geylang waktu tahun 1960-an dulu?",
        "Alat apa yang emak Ah Ma gunakan untuk memarut kelapa pada pukul lima pagi itu?",
        "Berapa kali Ah Ma cuba buat kaya sampai berjaya dan tidak berketul lagi?"
      ]
    }
  },
  {
    "id": "les_mem_seed_storybook_ta",
    "memoryId": "mem_seed",
    "format": "storybook",
    "language": "ta",
    "payload": {
      "panels": [
        {
          "caption": "அதிகாலையில் அம்மாவின் அம்மா புதுத் தேங்காயைத் துருவுகிறார். அஹ் மா பக்கத்தில் நின்று பார்க்கிறார்.",
          "imagePrompt": "A woman sitting on a wooden stool in an old kitchen at dawn, grating a fresh coconut half over a bowl.",
          "segmentIndex": 3
        },
        {
          "caption": "மேஜை மீது வாசனை தரும் பச்சை பாண்டான் இலைகளும் பத்து வாத்து முட்டைகளும் இருக்கின்றன.",
          "imagePrompt": "A fourteen-year-old girl placing large duck eggs into a clay bowl on a rustic wooden table.",
          "segmentIndex": 2
        },
        {
          "caption": "அஹ் மா மலாக்கா பனைவெல்லக் கட்டிகளைப் பாத்திரத்தில் போடுகிறார்.",
          "imagePrompt": "A mother and teenage daughter slicing solid dark brown palm sugar blocks with a knife on a wooden board.",
          "segmentIndex": 4
        },
        {
          "caption": "அஹ் மா கரண்டியால் விடாமல் கிளறுகிறார். நேரம் ஆக ஆகக் கை வலிக்கிறது.",
          "imagePrompt": "A young girl tying long green pandan leaves into neat knots next to a metal pot on a counter.",
          "segmentIndex": 1
        },
        {
          "caption": "அஹ் மா அவசரப்பட்டதால் காயா கட்டியாகிவிட்டது. அவசரம் கூடாது என்று அம்மா சொல்லிக்கொடுக்கிறார்.",
          "imagePrompt": "A young girl holding a wooden spoon with both hands, continuously stirring a wide pot over a small stove.",
          "segmentIndex": 5
        },
        {
          "caption": "அன்று அம்மா கையால் செய்த சுவையான காயாவை அஹ் மா இன்றும் நினைத்துப் பார்க்கிறார்.",
          "imagePrompt": "A mother and daughter leaning over a stove with a tiny blue flame, watching the thick smooth brown spread cook.",
          "segmentIndex": 7
        }
      ],
      "openQuestions": [
        "அஹ் மா, கேலாங்கில் உங்கள் பழைய சமையலறை எப்படி இருக்கும்?",
        "வாத்து முட்டைகளை வாங்க எந்தக் கடைக்குச் செல்வீர்கள்?",
        "காயா சரியான பதத்திற்கு வந்துவிட்டது என்பதை எதைப் பார்த்துத் தெரிந்துகொள்வீர்கள்?"
      ]
    }
  }
];
