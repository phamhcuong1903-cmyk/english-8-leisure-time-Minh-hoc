import { PronunciationWord } from '../types';

export const PRONUNCIATION_WORDS: PronunciationWord[] = [
  // 7 words with /ʊ/ (Short Vowel)
  { id: 'w1', word: 'cook', sound: 'short_u', ipa: '/kʊk/', meaning: 'nấu ăn' },
  { id: 'w2', word: 'push', sound: 'short_u', ipa: '/pʊʃ/', meaning: 'đẩy' },
  { id: 'w3', word: 'would', sound: 'short_u', ipa: '/wʊd/', meaning: 'sẽ, muốn' },
  { id: 'w4', word: 'woman', sound: 'short_u', ipa: '/ˈwʊm.ən/', meaning: 'phụ nữ' },
  { id: 'w5', word: 'book', sound: 'short_u', ipa: '/bʊk/', meaning: 'sách' },
  { id: 'w6', word: 'foot', sound: 'short_u', ipa: '/fʊt/', meaning: 'bàn chân' },
  { id: 'w7', word: 'wood', sound: 'short_u', ipa: '/wʊd/', meaning: 'gỗ, rừng' },

  // 7 words with /uː/ (Long Vowel)
  { id: 'w8', word: 'group', sound: 'long_u', ipa: '/ɡruːp/', meaning: 'nhóm' },
  { id: 'w9', word: 'June', sound: 'long_u', ipa: '/dʒuːn/', meaning: 'tháng sáu' },
  { id: 'w10', word: 'school', sound: 'long_u', ipa: '/skuːl/', meaning: 'trường học' },
  { id: 'w11', word: 'move', sound: 'long_u', ipa: '/muːv/', meaning: 'di chuyển' },
  { id: 'w12', word: 'food', sound: 'long_u', ipa: '/fuːd/', meaning: 'thức ăn' },
  { id: 'w13', word: 'choose', sound: 'long_u', ipa: '/tʃuːz/', meaning: 'chọn lựa' },
  { id: 'w14', word: 'true', sound: 'long_u', ipa: '/truː/', meaning: 'đúng, sự thật' },
];
