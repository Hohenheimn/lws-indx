import { useRouter } from "next/router";
import { NextRequest, NextResponse } from "next/server";

export default function handler(req: NextRequest, res: any) {
  if (req.method === "POST") {
    const data = req.body; // The data sent in the POST request
    res.status(200).json({ message: "Data received", data });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
