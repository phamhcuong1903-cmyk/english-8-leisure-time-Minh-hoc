import { ReadingPassage, VocabularyWord } from '../types';

export const readingPassageData: ReadingPassage = {
  title: "Trang's leisure activities",
  paragraphs: [
    "Some teenagers enjoy spending free time with their friends. Others prefer doing leisure activities with their family members. I love spending time with my family because it's a great way to connect with them.",
    "At the weekend, we usually go for a bike ride. We cycle to some nearby villages to enjoy the fresh air. We take photos and look at them later. My big brother and I are also into cooking. My brother looks for easy recipes. After that, we prepare the ingredients and cook. Sometimes the food is good, but sometimes it isn't; nevertheless, we love whatever we cook.",
    "The leisure activity I like the most is doing DIY projects with my mum. She teaches me to make my own dresses and doll clothes. On special occasions, we make special dresses together. Once I won the first prize in a costume contest at my school."
  ]
};

export const vocabularyList: Record<string, VocabularyWord> = {
  "teenagers": {
    word: "teenagers",
    phonetic: "/ˈtiːneɪdʒərz/",
    meaning: "thanh thiếu niên (13 - 19 tuổi)",
    type: "danh từ",
    example: "Some teenagers enjoy spending free time with their friends."
  },
  "leisure": {
    word: "leisure",
    phonetic: "/ˈleʒər/",
    meaning: "thời gian rảnh rỗi, giải trí",
    type: "danh từ",
    example: "Others prefer doing leisure activities with family."
  },
  "activities": {
    word: "activities",
    phonetic: "/ækˈtɪvətiz/",
    meaning: "các hoạt động",
    type: "danh từ số nhiều",
    example: "I love doing outdoor activities."
  },
  "connect": {
    word: "connect",
    phonetic: "/kəˈnekt/",
    meaning: "gắn kết, kết nối",
    type: "động từ",
    example: "It's a great way to connect with my family."
  },
  "cycle": {
    word: "cycle",
    phonetic: "/ˈsaɪkl/",
    meaning: "đạp xe",
    type: "động từ",
    example: "We cycle to some nearby villages."
  },
  "recipes": {
    word: "recipes",
    phonetic: "/ˈresəpiz/",
    meaning: "công thức nấu ăn",
    type: "danh từ",
    example: "My brother looks for easy recipes."
  },
  "ingredients": {
    word: "ingredients",
    phonetic: "/ɪnˈɡriːdiənts/",
    meaning: "nguyên liệu nấu ăn",
    type: "danh từ",
    example: "We prepare the ingredients and cook."
  },
  "nevertheless": {
    word: "nevertheless",
    phonetic: "/ˌnevərðəˈles/",
    meaning: "tuy nhiên, dù sao đi nữa",
    type: "trạng từ",
    example: "Nevertheless, we love whatever we cook."
  },
  "DIY": {
    word: "DIY (Do It Yourself)",
    phonetic: "/ˌdiː aɪ ˈwaɪ/",
    meaning: "tự làm đồ thủ công",
    type: "danh từ/cụm từ",
    example: "Doing DIY projects with my mum."
  },
  "occasions": {
    word: "occasions",
    phonetic: "/əˈkeɪʒnz/",
    meaning: "dịp đặc biệt, sự kiện",
    type: "danh từ",
    example: "On special occasions, we make special dresses."
  },
  "costume": {
    word: "costume",
    phonetic: "/ˈkɑːstuːm/",
    meaning: "trang phục hóa trang / biểu diễn",
    type: "danh từ",
    example: "Won first prize in a costume contest."
  }
};
