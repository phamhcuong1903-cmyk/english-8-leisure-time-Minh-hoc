import { UsefulQuestion } from '../types';

export const dialogueQuestions: UsefulQuestion[] = [
  {
    id: 1,
    question: "What leisure activities do you usually do with your family?",
    usefulLanguage: [
      "We usually go for a bike ride / go swimming / cook together.",
      "My family and I are into [activity]."
    ],
    pronunciationTip: "Nhớ nhấn trọng âm đúng vào các từ chính trong câu như 'AC-ti-vi-ties', 'FA-mi-ly'. Với câu trả lời kể chuyện, giọng nên xuống nhẹ ở cuối câu.",
    depthPrompt: "Con có thể kể thêm: hoạt động đó diễn ra khi nào (cuối tuần, buổi tối...) và có gì đặc biệt so với các hoạt động khác không?",
    sampleAnswer: "At the weekend, my family and I are into going for a bike ride around the lake and cooking dinner together."
  },
  {
    id: 2,
    question: "Which one do you like the most? Why?",
    usefulLanguage: [
      "The activity I like the most is...",
      "...because it helps me to relax / connect with my family / learn new things."
    ],
    pronunciationTip: "Với câu hỏi 'Why', giọng nên lên nhẹ ở phần đầu câu hỏi và xuống ở phần giải thích lý do.",
    depthPrompt: "Con đã nêu được lý do chưa? Hãy thử giải thích cụ thể hơn: hoạt động đó mang lại cảm giác gì, hay giúp con học được điều gì mới.",
    sampleAnswer: "The activity I like the most is cooking with my brother because it helps me to relax and learn new delicious recipes."
  },
  {
    id: 3,
    question: "How do you feel when you spend time with your family members?",
    usefulLanguage: [
      "I feel happy/relaxed/close to my family when...",
      "It helps me to connect with them."
    ],
    pronunciationTip: "Các tính từ chỉ cảm xúc (happy, relaxed, excited) thường được nhấn mạnh hơn trong câu.",
    depthPrompt: "Con có thể thêm 1 ví dụ cụ thể về khoảnh khắc khiến con cảm thấy như vậy, để câu trả lời thuyết phục và sinh động hơn.",
    sampleAnswer: "I feel very happy and close to my family when we prepare food together, because it helps us to talk and connect with each other."
  }
];
