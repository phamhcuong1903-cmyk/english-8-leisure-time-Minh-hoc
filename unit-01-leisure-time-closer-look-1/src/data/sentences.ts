import { SentenceItem, PrepositionStructure, PracticeQuestion } from '../types';

export const ANIMATION_SENTENCES: SentenceItem[] = [
  {
    id: 1,
    text: "I'm crazy about cooking.",
    subject: "I",
    be: "'m",
    adjective: "crazy",
    preposition: "about",
    gerundOrNoun: "cooking",
    color: "#3B82C4",
    translation: "Tôi rất thích / phát cuồng vì nấu ăn.",
    icon: "fa-solid fa-fire-burner"
  },
  {
    id: 2,
    text: "I'm keen on doing puzzles.",
    subject: "I",
    be: "'m",
    adjective: "keen",
    preposition: "on",
    gerundOrNoun: "doing puzzles",
    color: "#F59E42",
    translation: "Tôi mê giải đố câu đố.",
    icon: "fa-solid fa-puzzle-piece"
  },
  {
    id: 3,
    text: "I'm fond of playing sport.",
    subject: "I",
    be: "'m",
    adjective: "fond",
    preposition: "of",
    gerundOrNoun: "playing sport",
    color: "#4ADE80",
    translation: "Tôi thích chơi thể thao.",
    icon: "fa-solid fa-volleyball"
  },
  {
    id: 4,
    text: "I'm not interested in surfing the net.",
    subject: "I",
    be: "'m not",
    adjective: "interested",
    preposition: "in",
    gerundOrNoun: "surfing the net",
    color: "#A78BFA",
    translation: "Tôi không hứng thú với việc lướt mạng.",
    icon: "fa-solid fa-globe"
  },
  {
    id: 5,
    text: "I'm not into messaging friends.",
    subject: "I",
    be: "'m not",
    adjective: "into",
    preposition: "(into)",
    gerundOrNoun: "messaging friends",
    color: "#F472B6",
    translation: "Tôi không thích nhắn tin cho bạn bè.",
    icon: "fa-solid fa-comments"
  }
];

export const PREPOSITION_STRUCTURES: PrepositionStructure[] = [
  {
    id: 'keen_on',
    adjective: 'keen',
    preposition: 'on',
    meaning: 'hăng hái, mê, thích',
    exampleSentence: "Actually, I'm keen on many DIY activities.",
    exampleHighlight: 'many DIY activities',
    color: '#F59E42'
  },
  {
    id: 'crazy_about',
    adjective: 'crazy',
    preposition: 'about',
    meaning: 'phát cuồng, cực kỳ thích',
    exampleSentence: "My brother is crazy about cooking Italian food.",
    exampleHighlight: 'cooking Italian food',
    color: '#3B82C4'
  },
  {
    id: 'fond_of',
    adjective: 'fond',
    preposition: 'of',
    meaning: 'thích, yêu thích',
    exampleSentence: "She is fond of playing sport in the afternoon.",
    exampleHighlight: 'playing sport',
    color: '#4ADE80'
  },
  {
    id: 'interested_in',
    adjective: 'interested',
    preposition: 'in',
    meaning: 'quan tâm, có hứng thú với',
    exampleSentence: "They are interested in history and geography.",
    exampleHighlight: 'history and geography',
    color: '#A78BFA'
  },
  {
    id: 'be_into',
    adjective: 'be',
    preposition: 'into',
    meaning: 'thích, say mê',
    exampleSentence: "He is not into messaging friends all day.",
    exampleHighlight: 'messaging friends',
    color: '#F472B6'
  }
];

export const PRACTICE_QUESTIONS: PracticeQuestion[] = [
  {
    id: 1,
    type: 'preposition',
    questionPrompt: 'Điền giới từ thích hợp vào chỗ trống:',
    sentenceBefore: "Nam is very keen",
    sentenceAfter: "building models on weekends.",
    options: ['on', 'about', 'in', 'of'],
    correctAnswer: 'on',
    explanation: 'Cấu trúc: be keen ON + V-ing/N (thích, mê làm gì).'
  },
  {
    id: 2,
    type: 'verb_form',
    questionPrompt: 'Chọn dạng từ chính xác sau giới từ:',
    sentenceBefore: "I'm crazy about",
    sentenceAfter: "delicious cakes for my family.",
    options: ['baking', 'to bake', 'bake', 'baked'],
    correctAnswer: 'baking',
    explanation: 'Sau giới từ "about", động từ phải ở dạng V-ing (baking), không dùng to-infinitive.'
  },
  {
    id: 3,
    type: 'preposition',
    questionPrompt: 'Chọn giới từ chính xác cho tính từ "fond":',
    sentenceBefore: "My sister is fond",
    sentenceAfter: "reading comic books.",
    options: ['of', 'on', 'with', 'about'],
    correctAnswer: 'of',
    explanation: 'Cấu trúc cố định: be fond OF + V-ing/N (thích làm gì).'
  },
  {
    id: 4,
    type: 'verb_form',
    questionPrompt: 'Chọn dạng đúng của từ trong ví dụ bài học:',
    sentenceBefore: "Actually, I'm keen on",
    sentenceAfter: "activities in my free time.",
    options: ['many DIY', 'to do DIY', 'do DIY', 'did DIY'],
    correctAnswer: 'many DIY',
    explanation: 'Sau giới từ "on" có thể theo sau bởi Danh từ (many DIY activities) chứ không dùng to-infinitive.'
  },
  {
    id: 5,
    type: 'preposition',
    questionPrompt: 'Hoàn thành câu phủ định về sở thích:',
    sentenceBefore: "Are you interested",
    sentenceAfter: "surfing the net?",
    options: ['in', 'at', 'on', 'for'],
    correctAnswer: 'in',
    explanation: 'Cấu trúc cố định: be interested IN + V-ing/N (có hứng thú với việc gì).'
  }
];
