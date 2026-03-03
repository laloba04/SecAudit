import sql from "@/app/api/utils/sql";

export async function GET(request, { params }) {
  const { id } = params;
  try {
    const [scan] = await sql`SELECT * FROM scans WHERE id = ${id}`;
    if (!scan) {
      return Response.json({ error: "Scan not found" }, { status: 404 });
    }

    const findings =
      await sql`SELECT * FROM findings WHERE scan_id = ${id} ORDER BY severity DESC`;

    return Response.json({ ...scan, findings });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
