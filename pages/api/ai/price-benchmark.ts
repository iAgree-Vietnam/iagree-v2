import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { title, skills, category } = req.body;

  if (!title && !category) {
    return res.status(400).json({ error: "Vui lòng cung cấp title hoặc category" });
  }

  try {
    // Query completed jobs from Supabase
    let query = supabase
      .from("jobs")
      .select("price, price_min, price_max, salary_type, name, status")
      .in("status", [4, 5]) // completed/closed statuses
      .not("price", "is", null);

    // Filter by category if provided
    if (category) {
      query = query.ilike("name", `%${category}%`);
    }

    // Limit results
    query = query.limit(100);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error:", error);
      // Return empty benchmark if DB error
      return res.status(200).json({
        min: 0,
        max: 0,
        avg: 0,
        sample_size: 0,
        currency: "VND",
        note: "Chưa có đủ dữ liệu để tham chiếu",
      });
    }

    if (!data || data.length === 0) {
      // Try broader search
      const { data: allData } = await supabase
        .from("jobs")
        .select("price, price_min, price_max, salary_type")
        .in("status", [4, 5])
        .not("price", "is", null)
        .limit(50);

      if (!allData || allData.length === 0) {
        return res.status(200).json({
          min: 0,
          max: 0,
          avg: 0,
          sample_size: 0,
          currency: "VND",
          note: "Chưa có đủ dữ liệu để tham chiếu",
        });
      }
    }

    // Calculate statistics from found jobs
    const prices: number[] = [];

    for (const job of data || []) {
      if (job.price && job.price > 0) {
        prices.push(job.price);
      } else if (job.price_min && job.price_max) {
        prices.push((job.price_min + job.price_max) / 2);
      }
    }

    if (prices.length === 0) {
      return res.status(200).json({
        min: 0,
        max: 0,
        avg: 0,
        sample_size: 0,
        currency: "VND",
        note: "Chưa có đủ dữ liệu để tham chiếu",
      });
    }

    const sorted = prices.sort((a, b) => a - b);
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const avg = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

    return res.status(200).json({
      min,
      max,
      avg,
      sample_size: prices.length,
      currency: "VND",
    });
  } catch (error: any) {
    console.error("Price benchmark error:", error);
    return res.status(500).json({
      error: "Không thể lấy dữ liệu tham chiếu giá",
      detail: error.message,
    });
  }
}
