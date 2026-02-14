'use client';

export function XPBootProgress() {
  return (
    <div className="flex justify-center">
      <style>{`
        @keyframes xp-boot-slide {
          0% { transform: translateX(-34px); }
          100% { transform: translateX(194px); }
        }
        @keyframes xp-block-hue {
          0%   { background: linear-gradient(180deg, #FF6644 0%, #DD2200 30%, #BB1100 60%, #881000 100%); }
          14%  { background: linear-gradient(180deg, #FF9944 0%, #EE6600 30%, #CC4400 60%, #993300 100%); }
          28%  { background: linear-gradient(180deg, #FFCC55 0%, #FFAA00 30%, #DD8800 60%, #AA6600 100%); }
          42%  { background: linear-gradient(180deg, #FFEE77 0%, #FFCC22 30%, #DDAA00 60%, #AA8800 100%); }
          57%  { background: linear-gradient(180deg, #FFBB55 0%, #FF8811 30%, #DD5500 60%, #AA3300 100%); }
          71%  { background: linear-gradient(180deg, #FF7744 0%, #EE4422 30%, #CC2200 60%, #991100 100%); }
          85%  { background: linear-gradient(180deg, #FF4433 0%, #CC1100 30%, #AA0000 60%, #770000 100%); }
          100% { background: linear-gradient(180deg, #FF6644 0%, #DD2200 30%, #BB1100 60%, #881000 100%); }
        }
      `}</style>
      {/* Outer container - silver/gray recessed bar */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{
          width: '200px',
          height: '20px',
          background: 'linear-gradient(180deg, #808080 0%, #C0C0C0 2px, #E0E0E0 4px, #C0C0C0 100%)',
          border: '1px solid #606060',
          padding: '3px',
        }}
      >
        {/* Inner dark track */}
        <div className="relative w-full h-full overflow-hidden rounded-sm bg-[#1a1a2e]">
          {/* Sliding group of three blue blocks */}
          <div
            className="absolute inset-y-0 flex gap-[2px]"
            style={{ animation: 'xp-boot-slide 1.4s steps(19) infinite' }}
          >
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="h-full rounded-[1px]"
                style={{
                  width: '10px',
                  background: 'linear-gradient(180deg, #FF9966 0%, #E05030 30%, #CC2200 60%, #991A00 100%)',
                  animation: `xp-block-hue 1.2s ease-in-out ${i * 0.2}s infinite`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
