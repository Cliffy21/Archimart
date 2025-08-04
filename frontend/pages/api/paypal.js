export default async function handler(req, res) {
    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_API_BASE_URL } = process.env;
  
    if (req.method === "POST") {
      const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString("base64");
  
      try {
        const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
          method: "POST",
          headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "grant_type=client_credentials",
        });
  
        const data = await response.json();
  
        if (data.access_token) {
          res.status(200).json({ accessToken: data.access_token });
        } else {
          res.status(400).json({ error: "Failed to retrieve access token" });
        }
      } catch (error) {
        console.error("Error fetching PayPal access token:", error);
        res.status(500).json({ error: "Internal server error" });
      }
    } else {
      res.setHeader("Allow", ["POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  }
  