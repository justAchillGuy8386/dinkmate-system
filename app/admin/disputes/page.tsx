"use client";

import { useEffect, useState } from "react";

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [resolvingId, setResolvingId] = useState<string | null>(null);

  // Lấy danh sách khiếu nại Pending
  const fetchDisputes = async () => {
    try {
      const res = await fetch("/api/disputes");
      const json = await res.json();
      if (res.ok) {
        setDisputes(json.data);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, []);

  const handleResolve = async (
    matchId: string,
    winnerId: string,
    scoresData: string,
    liarId: string | null
  ) => {
    if (!confirm("Bạn có chắc chắn với phán quyết này không? AI sẽ bắt đầu tính toán ELO.")) return;
    
    setResolvingId(matchId);
    
    try {
      const res = await fetch("/api/disputes/resolve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          match_id: matchId,
          final_winner_id: winnerId,
          final_scores_data: scoresData,
          liar_id: liarId,
        }),
      });

      const json = await res.json();
      if (res.ok) {
        alert("🎉 Phán xử thành công! Trận đấu đã khép lại.");
        fetchDisputes(); // Refresh lại danh sách
      } else {
        alert("Lỗi: " + json.error);
      }
    } catch (error) {
      alert("Lỗi hệ thống khi phán xử!");
    } finally {
      setResolvingId(null);
    }
  };

  if (loading) return <div className="p-10 text-center font-bold text-gray-500">Đang tải hồ sơ...</div>;

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">⚖️ Bàn Phân Xử (Admin)</h1>
        <span className="bg-red-100 text-red-600 px-4 py-2 rounded-full font-bold">
          {disputes.length} ca chờ xử lý
        </span>
      </div>

      {disputes.length === 0 ? (
        <div className="bg-white p-10 rounded-xl shadow text-center text-gray-500">
          Không có trận đấu nào đang bị tranh chấp.
        </div>
      ) : (
        <div className="grid gap-6">
          {disputes.map((dispute) => {
            const match = dispute.match;
            const playerA = match.player_a;
            const playerB = match.player_b;
            const reporter = dispute.reporter;

            return (
              <div key={dispute.id} className="bg-white rounded-xl shadow-lg border border-red-200 overflow-hidden">
                {/* Header Trận đấu */}
                <div className="bg-red-50 p-4 border-b border-red-100 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-red-500 font-bold uppercase tracking-wider">Mã trận: {match.id}</span>
                    <h3 className="font-bold text-lg mt-1">{playerA.full_name} ⚡ {playerB.full_name}</h3>
                  </div>
                  <span className="bg-red-500 text-white text-xs px-3 py-1 rounded-full animate-pulse">Disputed</span>
                </div>

                {/* Nội dung khiếu nại */}
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Người gửi khiếu nại</h4>
                    <p className="font-bold text-lg text-gray-800">{reporter.full_name} (SĐT: {reporter.phone})</p>
                    <div className="mt-4 bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm text-gray-700">
                      <strong>Lý do: </strong> {dispute.reason}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-sm font-bold text-gray-500 uppercase mb-2">Bằng chứng</h4>
                    {dispute.proof_image_url ? (
                      <img src={dispute.proof_image_url} alt="Bằng chứng" className="w-full h-32 object-cover rounded-lg border border-gray-300" />
                    ) : (
                      <div className="w-full h-32 bg-gray-100 rounded-lg border border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                        Không có ảnh đính kèm
                      </div>
                    )}
                  </div>
                </div>

                {/* Búa Quan Tòa (Actions) */}
                <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap gap-4 justify-end">
                  <button 
                    disabled={resolvingId === match.id}
                    onClick={() => handleResolve(match.id, playerA.id, "2-0", playerB.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    🔨 {playerA.full_name} THẮNG (Phạt {playerB.full_name})
                  </button>
                  
                  <button 
                    disabled={resolvingId === match.id}
                    onClick={() => handleResolve(match.id, playerB.id, "2-0", playerA.id)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all disabled:opacity-50"
                  >
                    🔨 {playerB.full_name} THẮNG (Phạt {playerA.full_name})
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}