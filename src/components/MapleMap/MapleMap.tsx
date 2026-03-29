'use client';

export default function MapleMap() {
  return (
    <div className="pb-4 pt-2">
      <svg viewBox="0 0 200 118" width="100%" xmlns="http://www.w3.org/2000/svg">
        <style>{`
          @keyframes monster-walk {
            0%        { transform: translateX(0px)  scaleX(1);  }
            5%        { transform: translateX(0px)  scaleX(1);  }
            45%       { transform: translateX(90px) scaleX(1);  }
            50%       { transform: translateX(90px) scaleX(-1); }
            90%       { transform: translateX(0px)  scaleX(-1); }
            95%, 100% { transform: translateX(0px)  scaleX(1);  }
          }
          @keyframes body-hop {
            0%, 100% { transform: translateY(0px);  }
            50%      { transform: translateY(-2.5px); }
          }
          @keyframes foot-l {
            0%, 100% { transform: translateY(0px);  }
            25%      { transform: translateY(-4px); }
          }
          @keyframes foot-r {
            0%, 100% { transform: translateY(0px);  }
            75%      { transform: translateY(-4px); }
          }
          @keyframes cloud-drift {
            0%   { transform: translateX(0px);  }
            100% { transform: translateX(12px); }
          }
          .monster-group {
            animation: monster-walk 7s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center bottom;
          }
          .body-hop {
            animation: body-hop 0.55s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center bottom;
          }
          .foot-l {
            animation: foot-l 0.55s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
          .foot-r {
            animation: foot-r 0.55s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
          .cloud-a {
            animation: cloud-drift 6s ease-in-out infinite alternate;
          }
          .cloud-b {
            animation: cloud-drift 9s ease-in-out infinite alternate-reverse;
          }
        `}</style>

        {/* Sky */}
        <rect width="200" height="118" fill="#b8e4ff"/>

        {/* Clouds */}
        <g className="cloud-a" opacity="0.92">
          <ellipse cx="38" cy="22" rx="17" ry="9"  fill="white"/>
          <ellipse cx="52" cy="18" rx="13" ry="8"  fill="white"/>
          <ellipse cx="26" cy="20" rx="11" ry="7"  fill="white"/>
        </g>
        <g className="cloud-b" opacity="0.85">
          <ellipse cx="148" cy="16" rx="15" ry="8"  fill="white"/>
          <ellipse cx="161" cy="12" rx="11" ry="7"  fill="white"/>
          <ellipse cx="137" cy="14" rx="10" ry="6.5" fill="white"/>
        </g>

        {/* Left tree */}
        <rect  x="19" y="66" width="7"  height="30" fill="#7a4f1d"/>
        <ellipse cx="22" cy="56" rx="17" ry="16" fill="#2e8b1e"/>
        <ellipse cx="22" cy="52" rx="12" ry="11" fill="#3ca824"/>

        {/* Right tree */}
        <rect  x="169" y="70" width="6"  height="27" fill="#7a4f1d"/>
        <ellipse cx="172" cy="62" rx="15" ry="14" fill="#2e8b1e"/>
        <ellipse cx="172" cy="58" rx="10" ry="10" fill="#3ca824"/>

        {/* Ground */}
        <rect x="0" y="95" width="200" height="23" fill="#7a5c1e"/>
        {/* Grass */}
        <rect x="0" y="92" width="200" height="7"  fill="#5a9e3a"/>
        <rect x="0" y="92" width="200" height="2"  fill="#70c24a"/>

        {/* Grass tufts */}
        {[65,68,72,118,122,126].map((x, i) => (
          <path key={i} d={`M${x} 92 Q${x+1} ${86+i%2} ${x+2} 92`}
                stroke="#3d7a22" strokeWidth="1.2" fill="none"/>
        ))}

        {/* Flowers */}
        <circle cx="88"  cy="91" r="2.2" fill="#fda4af"/>
        <circle cx="88"  cy="91" r="1"   fill="white"/>
        <circle cx="112" cy="91" r="2.2" fill="#fde68a"/>
        <circle cx="112" cy="91" r="1"   fill="white"/>

        {/* Monster shadow */}
        <ellipse cx="52" cy="95" rx="13" ry="2.5" fill="#000" opacity="0.1"/>

        {/* Monster */}
        <g className="monster-group">
          <g className="body-hop">
            {/* Feet */}
            <ellipse className="foot-l" cx="46" cy="93" rx="6"  ry="3.5" fill="#f5c88a"/>
            <ellipse className="foot-r" cx="58" cy="93" rx="6"  ry="3.5" fill="#f5c88a"/>

            {/* Body */}
            <ellipse cx="52" cy="82" rx="12" ry="11" fill="#fef3c7"/>

            {/* Mushroom cap */}
            <path d="M34 79 Q36 58 52 55 Q68 58 70 79 Z" fill="#e85d04"/>
            <path d="M34 79 Q35 75 52 74 Q69 75 70 79 Z" fill="#c44c02"/>

            {/* Cap spots */}
            <circle cx="44" cy="67" r="4"   fill="white" opacity="0.88"/>
            <circle cx="60" cy="65" r="3.5" fill="white" opacity="0.88"/>
            <circle cx="53" cy="60" r="2.5" fill="white" opacity="0.88"/>

            {/* Eyes */}
            <circle cx="46" cy="82" r="4"   fill="white"/>
            <circle cx="58" cy="82" r="4"   fill="white"/>
            <circle cx="47" cy="83" r="2.2" fill="#1e1b4b"/>
            <circle cx="59" cy="83" r="2.2" fill="#1e1b4b"/>
            <circle cx="47.8" cy="82" r="0.9" fill="white"/>
            <circle cx="59.8" cy="82" r="0.9" fill="white"/>

            {/* Mouth */}
            <path d="M48 89 Q52 93 56 89"
                  stroke="#c44c02" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </g>
        </g>

      </svg>
    </div>
  );
}
