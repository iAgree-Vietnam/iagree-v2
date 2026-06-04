import type { NextApiRequest, NextApiResponse } from "next";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `Bạn là trợ lý AI chuyên về thị trường freelancer Việt Nam trên nền tảng iAgree.
Khi nhận mô tả công việc bằng tiếng Việt, hãy tạo ra một job brief chuyên nghiệp và có cấu trúc.

Quy tắc về ngân sách (VND):
- Công việc nhỏ (1-3 ngày): 500,000 - 3,000,000 VND
- Công việc trung bình (1-2 tuần): 3,000,000 - 15,000,000 VND  
- Công việc lớn (1 tháng+): 15,000,000 - 100,000,000 VND
- Luôn đặt budget_min thấp hơn budget_max ít nhất 20%

Trả về JSON hợp lệ, không có text thêm.`;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text } = req.body;

  if (!text || typeof text !== "string" || text.trim().length < 10) {
    return res.status(400).json({ error: "Vui lòng nhập mô tả công việc (ít nhất 10 ký tự)" });
  }

  try {
    const today = new Date();
    const message = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Phân tích và tạo job brief cho mô tả công việc sau:\n\n"${text.trim()}"\n\nHôm nay: ${today.toISOString().split("T")[0]}\n\nTrả về JSON với cấu trúc sau (không thêm text ngoài JSON):\n{\n  "title": "tên công việc ngắn gọn, chuyên nghiệp",\n  "category": "lĩnh vực chính (ví dụ: Thiết kế đồ họa, Lập trình web, Marketing, ...)",\n  "skills": ["kỹ năng 1", "kỹ năng 2", "kỹ năng 3"],\n  "scope": "mô tả phạm vi công việc 2-3 câu rõ ràng",\n  "deliverables": ["sản phẩm bàn giao 1", "sản phẩm bàn giao 2"],\n  "budget_min": <số nguyên VND>,\n  "budget_max": <số nguyên VND>,\n  "timeline_days": <số ngày>,\n  "suggested_deadline": "<YYYY-MM-DD>"\n}`,
        },
      ],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      throw new Error("Unexpected response type from Claude");
    }

    // Extract JSON from response (in case there's extra text)
    const jsonMatch = content.text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in Claude response");
    }

    const jobBrief = JSON.parse(jsonMatch[0]);

    // Validate required fields
    const required = ["title", "category", "skills", "scope", "deliverables", "budget_min", "budget_max", "timeline_days", "suggested_deadline"];
    for (const field of required) {
      if (!(field in jobBrief)) {
        throw new Error(`Missing field: ${field}`);
      }
    }

    return res.status(200).json(jobBrief);
  } catch (error: any) {
    console.error("AI Job Brief error:", error);
    return res.status(500).json({
      error: "Không thể tạo job brief. Vui lòng thử lại.",
      detail: error.message,
    });
  }
}
