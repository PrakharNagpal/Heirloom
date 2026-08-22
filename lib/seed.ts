import type { StoredMemory } from "./store";

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
