import sql from "@/app/api/utils/sql";
import { performScan } from "@/app/api/utils/scanner";

export async function GET() {
  try {
    const scans =
      await sql`SELECT * FROM scans ORDER BY created_at DESC LIMIT 50`;
    return Response.json(scans);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // 1. Create scan entry
    const [scan] = await sql`
      INSERT INTO scans (target_url) 
      VALUES (${url}) 
      RETURNING id
    `;

    // 2. Start scan asynchronously (don't await fully if we want to return fast,
    // but in serverless we usually want to wait or use a background task.
    // Here we'll wait for simplicity or return ID and let client poll)
    // Actually, let's wait to keep it simple for the user to see results immediately.
    const result = await performScan(scan.id, url);

    return Response.json({ scanId: scan.id, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
