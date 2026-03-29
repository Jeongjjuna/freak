'use client';

export default function SlimeCharacter() {
  return (
    <div className="flex justify-center py-2">
      <svg viewBox="0 0 100 110" width="96" xmlns="http://www.w3.org/2000/svg">
        <style>{`
          @keyframes slime-squish {
            0%   { transform: scaleX(1)    scaleY(1);    }
            20%  { transform: scaleX(0.9)  scaleY(1.12); }
            40%  { transform: scaleX(1)    scaleY(1);    }
            65%  { transform: scaleX(1.12) scaleY(0.9);  }
            80%  { transform: scaleX(1)    scaleY(1);    }
            100% { transform: scaleX(1)    scaleY(1);    }
          }
          @keyframes slime-blink {
            0%, 84%, 100% { transform: scaleY(1);    }
            90%           { transform: scaleY(0.07); }
          }
          @keyframes slime-shadow {
            0%   { transform: scaleX(1);    opacity: 0.12; }
            20%  { transform: scaleX(0.87); opacity: 0.08; }
            65%  { transform: scaleX(1.12); opacity: 0.16; }
            100% { transform: scaleX(1);    opacity: 0.12; }
          }
          @keyframes drip-wobble {
            0%, 100% { transform: rotate(-6deg); }
            50%      { transform: rotate(6deg);  }
          }
          .slime-body {
            animation: slime-squish 2.6s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: bottom center;
          }
          .slime-eye-l {
            animation: slime-blink 3.8s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
          .slime-eye-r {
            animation: slime-blink 3.8s ease-in-out infinite 0.12s;
            transform-box: fill-box;
            transform-origin: center;
          }
          .slime-shadow-el {
            animation: slime-shadow 2.6s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: center;
          }
          .slime-drip {
            animation: drip-wobble 2.6s ease-in-out infinite;
            transform-box: fill-box;
            transform-origin: bottom center;
          }
        `}</style>

        {/* Shadow */}
        <ellipse className="slime-shadow-el" cx="50" cy="103" rx="27" ry="4.5" fill="#000" opacity="0.12"/>

        <g className="slime-body">
          {/* Body */}
          <ellipse cx="50" cy="60" rx="36" ry="34" fill="#86efac"/>

          {/* Bottom depth */}
          <ellipse cx="50" cy="88" rx="29" ry="7" fill="#4ade80" opacity="0.5"/>

          {/* Top drip */}
          <g className="slime-drip">
            <path d="M47 27 Q45 16 49 9 Q53 16 53 27" fill="#86efac"/>
            <circle cx="50" cy="8" r="5" fill="#86efac"/>
          </g>

          {/* Highlight */}
          <ellipse cx="36" cy="45" rx="9" ry="7" fill="white" opacity="0.22" transform="rotate(-18,36,45)"/>

          {/* Left eye */}
          <g className="slime-eye-l">
            <ellipse cx="37" cy="61" rx="10.5" ry="10.5" fill="white"/>
            <ellipse cx="39"  cy="63" rx="6"    ry="6"    fill="#1e1b4b"/>
            <circle  cx="41.5" cy="59.5" r="2.2" fill="white"/>
          </g>

          {/* Right eye */}
          <g className="slime-eye-r">
            <ellipse cx="63" cy="61" rx="10.5" ry="10.5" fill="white"/>
            <ellipse cx="65"  cy="63" rx="6"    ry="6"    fill="#1e1b4b"/>
            <circle  cx="67.5" cy="59.5" r="2.2" fill="white"/>
          </g>

          {/* Cheeks */}
          <ellipse cx="27" cy="72" rx="6.5" ry="4.5" fill="#fda4af" opacity="0.45"/>
          <ellipse cx="73" cy="72" rx="6.5" ry="4.5" fill="#fda4af" opacity="0.45"/>

          {/* Smile */}
          <path d="M42 76 Q50 84 58 76" stroke="#16a34a" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        </g>
      </svg>
    </div>
  );
}
