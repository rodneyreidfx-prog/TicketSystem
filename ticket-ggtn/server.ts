import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase payload limit for base64 images
  app.use(express.json({ limit: '50mb' }));

  app.post("/api/notify", async (req, res) => {
    try {
      const { zone, subArea, issueType, urgency, notes, supplyDetails, photoBase64 } = req.body;

      const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

      if (!webhookUrl) {
        console.warn("Discord notification skipped: Missing webhook URL.");
        return res.json({ success: true, warning: "Discord webhook not configured" });
      }

      const formData = new FormData();
      
      const getZoneEmoji = (z: string) => {
        const m: any = { "Men's Locker Room": "🚹", "Women's Locker Room": "🚺", "Yoga Room (GGX)": "🧘", "Cycle Studio": "🚴", "Turf Room": "🏃", "Machines": "🦾", "Cardio": "🏃‍♂️", "Free Weights": "🏋️", "Basketball Court": "🏀", "Pool Area": "🏊" };
        return m[z] || "🏢";
      };
      const getSubAreaEmoji = (s: string) => {
        const m: any = { "Toilets": "🚽", "Showers": "🚿", "Sinks": "🚰", "Locker Area": "🛅", "General Floor": "🧹", "Paper Towel Dispenser": "🧻", "Cleaning Spray": "🧴", "Mirrors": "🪞", "Yoga Mats": "🪷", "Bikes": "🚲", "Turf Area": "🟩", "Sleds/Equipment": "🛷", "Cable Machines": "🏗️", "Selectorized Machines": "⚙️", "Treadmills": "🏃‍♀️", "Ellipticals": "🎿", "Stair Climbers": "🧗", "Dumbbells": "🏋️‍♂️", "Benches": "🪑", "Squat Racks": "🏋️‍♀️", "Hoops": "🪩", "Pool Deck": "🏖️", "Hot Tub": "🛁", "Sauna": "🧖", "Steam Room": "🌫️" };
        return m[s] || "🚪";
      };
      const getIssueEmoji = (i: string) => {
        const m: any = { "Machine Broken": "🔧", "Spill": "💧", "Empty Supplies": "🗑️", "Out of Order": "🚫", "Clogged / Maintenance": "🪠", "Other": "⚠️" };
        return m[i] || "⚠️";
      };

      let description = ``;
      description += `${getZoneEmoji(zone)} **Area:** ${zone}\n`;
      if (subArea) {
        description += `${getSubAreaEmoji(subArea)} **Amenity:** ${subArea}\n`;
      }
      description += `${getIssueEmoji(issueType)} **Issue:** ${issueType}\n`;
      
      if (supplyDetails && supplyDetails.length > 0) {
        description += `🧻 **Supplies:** ${supplyDetails.join(', ')}\n`;
      }
      
      if (notes) {
        description += `📝 **Notes:** ${notes}\n`;
      }

      const embed: any = {
        title: "📋 Ticket Details",
        description: description,
        color: urgency === 'Urgent' ? 0xff0000 : urgency === 'Needs Attention' ? 0xffaa00 : 0x00ff00,
        timestamp: new Date().toISOString(),
      };

      if (photoBase64) {
        const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, "");
        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: 'image/jpeg' });
        
        formData.append('file', blob, 'issue-photo.jpg');
        embed.image = { url: 'attachment://issue-photo.jpg' };
      }

      formData.append('payload_json', JSON.stringify({
        content: `@everyone 🚨 **New Facility Issue Reported** - ${urgency}`,
        embeds: [embed]
      }));

      const response = await fetch(webhookUrl, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Discord Webhook error:", errorText);
        return res.status(500).json({ error: "Failed to send notification" });
      }

      res.json({ success: true, message: "Ticket received successfully." });
    } catch (error) {
      console.error("Error in /api/notify:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });



  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
