const MATCHMAKE_URL = "http://localhost:3000/api/ai-matchmake";
const INTERVAL_SECONDS = 30; // 30 giây quét 1 lần

console.log(`🤖 Hệ thống Auto-Matchmaking đã khởi động!`);
console.log(`🕒 Tần suất quét: Mỗi ${INTERVAL_SECONDS} giây...`);
console.log(`--------------------------------------------------`);

setInterval(async () => {
  try {
    const res = await fetch(MATCHMAKE_URL, { 
        method: "POST",
        headers: { "Content-Type": "application/json" }
    });
    const data = await res.json();
    
    // Nếu ghép thành công hoặc có lỗi, in ra log rõ ràng
    if (res.ok && data.message !== 'Chưa đủ người chơi trong hàng đợi, tiếp tục chờ...' && data.message !== 'Chưa đủ người chơi hợp lệ') {
       console.log(`\n[${new Date().toLocaleTimeString()}] 🎉 MATCH FOUND!`);
       console.log(`Chi tiết:`, data);
    } else if (!res.ok) {
       console.error(`\n[${new Date().toLocaleTimeString()}] ⚠️ AI Server báo lỗi:`, data);
    } else {
       // Nếu chưa đủ người, chỉ in dấu chấm cho đỡ rác Terminal
       process.stdout.write(".");
    }
  } catch (error) {
    console.error(`\n[${new Date().toLocaleTimeString()}] ❌ Lỗi mất kết nối tới Next.js API:`, error.message);
  }
}, INTERVAL_SECONDS * 1000);

// Chạy lệnh này ở một terminal riêng: node cron.js