import dbConnect from "../../lib/mongodb"; // adjust path as needed
import Payment from "../../../Models/Payment";   // adjust path as needed

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  await dbConnect();

  try {
    const {
      userId,
      email,
      amount,
      method,
      transactionId,
      cart,
      status,
      timestamp,
    } = req.body;

    // Basic validation
    if (!userId || !amount || !method || !transactionId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const payment = new Payment({
      userId,
      email,
      amount,
      method,
      transactionId,
      cart,
      status,
      timestamp,
    });

    await payment.save();

    return res.status(201).json({ message: "Payment recorded", payment });
  } catch (error) {
    console.error("[API] Payment save error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}