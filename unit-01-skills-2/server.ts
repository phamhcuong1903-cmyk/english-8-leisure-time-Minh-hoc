import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Initialize Gemini AI Client
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // API Endpoint: Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API Endpoint: Evaluate student email response with Gemini 3.6 Flash
  app.post("/api/evaluate-email", async (req, res) => {
    try {
      const { studentContent, template } = req.body;

      if (!studentContent || typeof studentContent !== "string") {
        return res.status(400).json({ error: "Nội dung bài viết không hợp lệ." });
      }

      const systemInstruction = `Bạn là một giáo viên dạy Tiếng Anh Lớp 8 giỏi chuyên môn, cực kỳ thân thiện và tâm lý với học sinh cấp 2.
Nhiệm vụ của bạn là phân tích bài viết email của học sinh (Unit 1: Leisure Time - Skills 2) dựa trên chủ đề: "${template?.prompt || "Let me tell you about how I spend my free time."}".

Mẫu bài tham khảo (Sample Answer) để đối chiếu dàn ý (Lưu ý KHÔNG yêu cầu học sinh viết giống hệt):
"${template?.sampleAnswer || ""}"

Bạn BẮT BUỘC trả về kết quả dưới dạng cấu trúc JSON chính xác với đúng 5 trường tương ứng 5 mục đánh giá theo đúng thứ tự sau:

1. "encouragement": LỜI ĐỘNG VIÊN MỞ ĐẦU
- 1 câu khen ngợi tích cực chọn ngẫu nhiên các thông điệp khác nhau (ví dụ: "Bài viết của con có nhiều ý hay!", "Cố gắng rất tốt, con đã hoàn thành bài viết!", "Thật tuyệt vời, con đã tự tin chia sẻ về thời gian rảnh rỗi của mình!", hoặc "Ấn tượng lắm, cô/thầy rất khen ngợi sự sáng tạo của con!").
- LUÔN hiển thị đầu tiên và khen ngợi năng lượng tích cực bất kể bài viết ngắn hay dài.

2. "contentFeedback": NHẬN XÉT VỀ NỘI DUNG
- Đánh giá xem bài viết đã trả lời đủ các ý chính theo gợi ý prompt chưa (VD: sở thích lúc rảnh rỗi, thời gian cuối tuần, hoạt động cùng gia đình hay bạn bè).
- Gợi ý bổ sung nếu thiếu ý, khuyến khích tư duy cá nhân.

3. "lengthFeedback": NHẬN XÉT VỀ ĐỘ DÀI
- So sánh số từ thực tế bài viết với yêu cầu chuẩn 80-100 từ.
- Dưới 80 từ: Nhận xét cụ thể số từ và gợi ý ý cần viết thêm để đạt độ dài.
- Từ 80-100 từ: Khen ngợi bài viết đạt độ dài lý tưởng.
- Trên 100 từ nhiều: Khen chăm chỉ, gợi ý cô đọng lại các câu dư thừa.

4. "grammarFeedback": GỢI Ý VỀ NGỮ PHÁP (Yêu cầu RẤT CỤ THỂ, KHÔNG đưa lời khuyên chung chung):
- Bạn PHẢI rà soát từng câu trong bài viết của học sinh để phát hiện lỗi ngữ pháp (đặc biệt các lỗi liên quan đến chủ điểm Unit 1 Tiếng Anh 8: verbs of liking/disliking + gerund/to-infinitive như like/love/enjoy/fancy/prefer/hate/dislike + V-ing/to-V, hoặc các cụm be fond of / be keen on / be interested in / be crazy about / be into + V-ing/N, và chia động từ/thì hiện tại đơn).

- NẾU PHÁT HIỆN BÀI VIẾT CÓ LỖI SAI:
  Trình bày CỤ THỂ theo đúng 3 mục sau cho từng lỗi:
  1. Trích dẫn câu sai: nguyên văn câu học sinh đã viết (VD: "Trích dẫn câu sai: 'I enjoy play football with my friends.'")
  2. Viết lại câu đúng: câu đã được sửa hoàn chỉnh (VD: "Sửa lại: 'I enjoy playing football with my friends.'")
  3. Giải thích ngắn gọn lý do sai: giải thích quy tắc ngữ pháp một cách dễ hiểu (VD: "Lý do: Sau động từ chỉ sự yêu thích 'enjoy', động từ theo sau phải ở dạng V-ing ('playing' thay vì 'play').")

- NẾU BÀI VIẾT KHÔNG CÓ LỖI SAI NÀO THUỘC PHẠM VI TRÊN:
  Đưa ra LỜI KHEN CỤ THỂ bằng cách trích dẫn NGUYÊN VĂN các câu/cấu trúc mà học sinh đã viết đúng trong bài (VD: "Bài viết của con dùng ngữ pháp rất chuẩn xác! Cụ thể, con đã áp dụng đúng dạng V-ing sau động từ chỉ sở thích trong câu: 'When I finish homework, I often read books and listen to my favorite songs.'"). TUYỆT ĐỐI KHÔNG đưa ra nhận xét hay lời khuyên chung chung mơ hồ.

5. "vocabularyFeedback": GỢI Ý MỞ RỘNG TỪ VỰNG/CÂU
- Gợi ý 1-2 cách diễn đạt phong phú hơn (VD: nếu dùng "like" hoặc "love" lặp lại nhiều lần, gợi ý thay bằng "be crazy about", "be interested in", "be keen on", "enjoy").`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: `Bài viết email của học sinh:\n"""\n${studentContent}\n"""`,
        config: {
          systemInstruction,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              encouragement: {
                type: Type.STRING,
                description: "1 câu khen ngợi mở đầu tích cực",
              },
              contentFeedback: {
                type: Type.STRING,
                description: "Nhận xét về mức độ đáp ứng nội dung so với prompt",
              },
              lengthFeedback: {
                type: Type.STRING,
                description: "Nhận xét độ dài số từ so với 80-100 từ",
              },
              grammarFeedback: {
                type: Type.STRING,
                description: "Chỉ ra lỗi ngữ pháp cụ thể kèm câu sửa hoặc khen ngợi",
              },
              vocabularyFeedback: {
                type: Type.STRING,
                description: "Gợi ý mở rộng từ vựng và cấu trúc nâng cao",
              },
            },
            required: [
              "encouragement",
              "contentFeedback",
              "lengthFeedback",
              "grammarFeedback",
              "vocabularyFeedback",
            ],
          },
        },
      });

      const jsonString = response.text ? response.text.trim() : "{}";
      const feedback = JSON.parse(jsonString);

      return res.json({ success: true, feedback });
    } catch (err: any) {
      console.error("Gemini evaluation API error:", err);
      return res.status(500).json({
        error: "Hệ thống gặp sự cố khi phân tích bài viết. Vui lòng thử lại.",
        details: err.message,
      });
    }
  });

  // Vite middleware for development or static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
