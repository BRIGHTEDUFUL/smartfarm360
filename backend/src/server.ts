import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { initDatabase, query, saveDatabase, db } from "./config/database";
import { runMigrations } from "./config/migrate";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import cartRoutes from "./routes/cart.routes";
import orderRoutes from "./routes/order.routes";
import userRoutes from "./routes/user.routes";
import auditRoutes from "./routes/audit.routes";
import { errorHandler } from "./middleware/errorHandler";
import { AuthService } from "./services/auth.service";

// ─── Environment ────────────────────────────────────────────────────────────
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";

// ─── Path resolution ─────────────────────────────────────────────────────────
//
//  __dirname at runtime:
//    ts-node-dev  →  <root>/backend/src
//    node (built) →  <root>/backend/dist
//
//  Both are exactly 2 levels below the project root, so:
//    path.resolve(__dirname, '../..')  →  <root>  (always)
//
const ROOT_DIR = path.resolve(__dirname, "../..");
const FRONTEND_DIST =
  process.env.FRONTEND_DIST_PATH || path.resolve(ROOT_DIR, "frontend", "dist");
const UPLOADS_DIR = path.resolve(__dirname, "..", "uploads");

// ─── App ─────────────────────────────────────────────────────────────────────
const app = express();

// ─── Security headers ────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // React inlines scripts via Vite
    crossOriginEmbedderPolicy: false,
  }),
);

// ─── CORS ────────────────────────────────────────────────────────────────────
//  • Production  → same origin; CORS headers not needed for browser requests,
//                  but we leave it open so curl / Postman / mobile apps still work.
//  • Development → allow Vite dev server on :3000
const corsOrigins = IS_PROD
  ? process.env.CORS_ORIGIN || "*"
  : [
      "http://localhost:3000",
      "http://127.0.0.1:3000",
      "http://192.168.1.64:3000",
    ];

app.use(
  cors({
    origin: corsOrigins,
    credentials: true,
    optionsSuccessStatus: 200,
  }),
);

// ─── Body parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── Uploaded product images ──────────────────────────────────────────────────
app.use("/uploads", express.static(UPLOADS_DIR));

// ─── API routes ───────────────────────────────────────────────────────────────
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/users", userRoutes);
app.use("/api/audit-logs", auditRoutes);

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    message: "Smart Farming 360 API is running",
    env: NODE_ENV,
    port: PORT,
  });
});

// API-only error handler (must come after all /api/* routes)
app.use("/api", errorHandler);

// ─── Frontend (production) ────────────────────────────────────────────────────
//
//  In production the React app is pre-built into frontend/dist/.
//  Express serves those static files and falls back to index.html for
//  any path that is not an API call (client-side routing).
//
//  In development this block is skipped — Vite's own dev server handles
//  the frontend on :3000 and proxies /api to this Express server on :5000.
//
const frontendReady = fs.existsSync(path.join(FRONTEND_DIST, "index.html"));

if (frontendReady) {
  // Serve every static asset (JS, CSS, images, fonts …)
  app.use(express.static(FRONTEND_DIST));

  // SPA fallback — everything that is NOT an /api/* route gets index.html
  app.get("*", (_req, res) => {
    res.sendFile(path.join(FRONTEND_DIST, "index.html"));
  });
} else {
  // Friendly message when someone hits the root in API-only / dev mode
  app.get("/", (_req, res) => {
    res.json({
      message: "Smart Farming 360 API — frontend not built yet.",
      hint: "Run 'npm run build' from the project root, then restart.",
      api: `http://localhost:${PORT}/api/health`,
    });
  });
}

// ─── Database seed ────────────────────────────────────────────────────────────
async function seedDatabase(): Promise<void> {
  try {
    if (!db) {
      await initDatabase();
    }

    const existingAdmin = await query("SELECT id FROM users WHERE email = ?", [
      "admin@smartfarming.com",
    ]);

    if (existingAdmin.rows.length > 0) {
      console.log("✓ Database already seeded");
      return;
    }

    console.log("Seeding database with initial data…");

    // Admin
    const adminPw = await AuthService.hashPassword("admin123");
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "admin@smartfarming.com",
        adminPw,
        "Admin",
        "User",
        "+233501234567",
        "Admin",
        "Active",
      ],
    );
    console.log("✓ Admin user created");

    // Farmers
    const farmerPw = await AuthService.hashPassword("farmer123");
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "farmer1@test.com",
        farmerPw,
        "Kwame",
        "Mensah",
        "+233501234568",
        "Farmer",
        "Active",
      ],
    );
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "farmer2@test.com",
        farmerPw,
        "Ama",
        "Asante",
        "+233501234569",
        "Farmer",
        "Active",
      ],
    );
    console.log("✓ Farmer users created");

    // Consumer
    const consumerPw = await AuthService.hashPassword("consumer123");
    await query(
      `INSERT INTO users (email, password_hash, first_name, last_name, phone, role, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        "consumer@test.com",
        consumerPw,
        "Kofi",
        "Owusu",
        "+233501234570",
        "Consumer",
        "Active",
      ],
    );
    console.log("✓ Consumer user created");

    // Products
    const f1 = await query("SELECT id FROM users WHERE email = ?", [
      "farmer1@test.com",
    ]);
    const f2 = await query("SELECT id FROM users WHERE email = ?", [
      "farmer2@test.com",
    ]);
    const id1 = f1.rows[0].id;
    const id2 = f2.rows[0].id;

    const products = [
      {
        fid: id1,
        name: "Fresh Tomatoes",
        desc: "Organic red tomatoes, perfect for salads and cooking",
        cat: "Vegetables",
        price: 15.0,
        unit: "kg",
        stock: 100,
      },
      {
        fid: id1,
        name: "Garden Eggs",
        desc: "Fresh garden eggs (eggplant), locally grown",
        cat: "Vegetables",
        price: 12.0,
        unit: "kg",
        stock: 50,
      },
      {
        fid: id1,
        name: "Fresh Carrots",
        desc: "Crunchy orange carrots, rich in vitamins",
        cat: "Vegetables",
        price: 10.0,
        unit: "kg",
        stock: 80,
      },
      {
        fid: id2,
        name: "Fresh Onions",
        desc: "Quality onions for all your cooking needs",
        cat: "Vegetables",
        price: 8.0,
        unit: "kg",
        stock: 120,
      },
      {
        fid: id2,
        name: "Fresh Okra",
        desc: "Tender okra, perfect for soups and stews",
        cat: "Vegetables",
        price: 14.0,
        unit: "kg",
        stock: 60,
      },
      {
        fid: id2,
        name: "Ripe Bananas",
        desc: "Sweet ripe bananas, naturally grown",
        cat: "Fruits",
        price: 10.0,
        unit: "bunch",
        stock: 80,
      },
      {
        fid: id2,
        name: "Fresh Pineapples",
        desc: "Juicy sweet pineapples from local farms",
        cat: "Fruits",
        price: 20.0,
        unit: "piece",
        stock: 60,
      },
      {
        fid: id1,
        name: "Watermelon",
        desc: "Large sweet watermelon, perfect for hot days",
        cat: "Fruits",
        price: 25.0,
        unit: "piece",
        stock: 40,
      },
      {
        fid: id1,
        name: "Fresh Avocado",
        desc: "Creamy avocados, rich in healthy fats",
        cat: "Fruits",
        price: 18.0,
        unit: "kg",
        stock: 45,
      },
      {
        fid: id2,
        name: "Ripe Mangoes",
        desc: "Sweet juicy mangoes, seasonal favorite",
        cat: "Fruits",
        price: 22.0,
        unit: "kg",
        stock: 70,
      },
      {
        fid: id1,
        name: "Sweet Corn",
        desc: "Fresh yellow corn, perfect for roasting",
        cat: "Grains",
        price: 8.0,
        unit: "piece",
        stock: 200,
      },
      {
        fid: id1,
        name: "Premium Rice",
        desc: "High-quality local rice, aromatic and fluffy",
        cat: "Grains",
        price: 35.0,
        unit: "kg",
        stock: 150,
      },
      {
        fid: id1,
        name: "Free Range Eggs",
        desc: "Fresh farm eggs from free-range chickens",
        cat: "Poultry",
        price: 30.0,
        unit: "crate",
        stock: 50,
      },
      {
        fid: id1,
        name: "Whole Chicken",
        desc: "Fresh whole chicken, farm-raised",
        cat: "Poultry",
        price: 55.0,
        unit: "piece",
        stock: 30,
      },
    ];

    for (const p of products) {
      await query(
        `INSERT INTO products
           (farmer_id, name, description, category, price, unit, stock_quantity, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [p.fid, p.name, p.desc, p.cat, p.price, p.unit, p.stock, "Active"],
      );
    }
    console.log("✓ Sample products created");

    saveDatabase();
    console.log("✓ Database seeded successfully");
  } catch (err) {
    console.error("Seeding failed:", err);
  }
}

// ─── Startup ──────────────────────────────────────────────────────────────────
async function startServer(): Promise<void> {
  try {
    await runMigrations();
    await seedDatabase();

    const server = app.listen(PORT, () => {
      const url = `http://localhost:${PORT}`;
      console.log("");
      console.log("🌾  Smart Farming 360");
      console.log(`    Mode     : ${NODE_ENV}`);
      console.log(`    API      : ${url}/api/health`);
      if (frontendReady) {
        console.log(`    Frontend : ${url}`);
      } else {
        console.log("    Frontend : not built  (run: npm run build)");
      }
      console.log("");
    });

    // ── Graceful shutdown ───────────────────────────────────────────────────
    //  Ensures the SQLite database is flushed to disk before the process exits.
    //  Cloud platforms (Render, Railway, Fly.io …) send SIGTERM on deploy/scale.
    const shutdown = (signal: string) => {
      console.log(`\nReceived ${signal} — shutting down gracefully…`);
      server.close(() => {
        try {
          saveDatabase();
          console.log("✓ Database saved");
        } catch {
          // ignore save errors during shutdown
        }
        process.exit(0);
      });

      // Force exit after 10 s if connections refuse to close
      setTimeout(() => {
        console.error("Forced exit after timeout");
        process.exit(1);
      }, 10_000).unref();
    };

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

export default app;
