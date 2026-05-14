import "./App.css";

export default function App() {
  return (
    <div className="app">
      {/* LEFT */}
      <section className="phone">
        <div className="topbar">
          <div className="menu">☰</div>
          <div className="logo">우리 사이 🤍</div>
        </div>

        <div className="hero">
          <h1>
            너희 사이,
            <br />
            얼마나 특별할까?
          </h1>

          <p>
            생년월일, MBTI, 처음 만난 날로
            <br />
            둘만의 흐름을 분석해줄게!
          </p>

          <div className="hero-turtle">🐢💕</div>
        </div>

        <div className="card">
          <div className="section-title">🟡 내 정보</div>

          <label>생년월일</label>

          <div className="date-row">
            <input placeholder="1998" maxLength={4} />
            <input placeholder="05" maxLength={2} />
            <input placeholder="14" maxLength={2} />
          </div>

          <label>MBTI</label>

          <select>
            <option>MBTI를 선택하세요</option>
            <option>ENFP</option>
            <option>INFP</option>
            <option>INTJ</option>
            <option>ESTP</option>
          </select>

          <div className="divider" />

          <div className="section-title">🟢 상대 정보</div>

          <label>생년월일</label>

          <div className="date-row">
            <input placeholder="1996" maxLength={4} />
            <input placeholder="09" maxLength={2} />
            <input placeholder="23" maxLength={2} />
          </div>

          <label>MBTI</label>

          <select>
            <option>MBTI를 선택하세요</option>
          </select>

          <div className="divider" />

          <div className="section-title">💗 우리 관계</div>

          <label>처음 만난 날</label>

          <div className="date-row">
            <input placeholder="2024" maxLength={4} />
            <input placeholder="11" maxLength={2} />
          </div>

          <label>현재 관계</label>

          <select>
            <option>관계 상태를 선택하세요</option>
            <option>친구(썸)</option>
            <option>연애 중</option>
            <option>짝사랑</option>
          </select>

          <button className="main-btn">
            🐢 우리 사이 분석하기
          </button>
        </div>

        <div className="bottom-bubble">
          정확한 분석을 위해
          <br />
          정확하게 입력해주세요 🐢
        </div>
      </section>

      {/* RIGHT */}
      <section className="phone result">
        <div className="result-top">
          <button className="back-btn">‹</button>

          <div className="result-title">
            우리 사이 분석 결과
          </div>

          <button className="share-btn">⤴</button>
        </div>

        <div className="result-hero">
          <div className="big-turtle">🐢</div>

          <div className="speech">와아!</div>
        </div>

        <div className="score-card">
          <div className="score-label">궁합 점수</div>

          <div className="score">
            80<span>%</span>
          </div>

          <div className="score-desc">
            생각보다 엄청 잘 맞는 조합이야!
          </div>

          <div className="bar-wrap">
            <div className="bar-fill" />
          </div>

          <div className="percent-row">
            <span>0%</span>
            <span>20%</span>
            <span>40%</span>
            <span>60%</span>
            <span>80%</span>
            <span>100%</span>
          </div>

          <div className="stat">
            <div>
              ❤️ <b>사랑 궁합</b>
              <p>감정 흐름과 표현 방식</p>
            </div>

            <span>90%</span>
          </div>

          <div className="stat">
            <div>
              💬 <b>대화 궁합</b>
              <p>대화가 잘 통하는 정도</p>
            </div>

            <span>70%</span>
          </div>

          <div className="stat">
            <div>
              ✨ <b>성향 궁합</b>
              <p>생활/가치관 조화</p>
            </div>

            <span>80%</span>
          </div>

          <div className="stat">
            <div>
              🐢 <b>미래 궁합</b>
              <p>장기적 연애 지속 가능성</p>
            </div>

            <span>85%</span>
          </div>
        </div>

        <div className="detail-card">
          <h3>✨ 솔직하게 말해줄게!</h3>

          <div className="talk">
            <div className="emoji">🐢</div>

            <div>
              <b>너희는 처음엔 장난처럼 친해져.</b>
              <p>
                근데 서로 감정이 깊어지는 순간이 꽤
                빨리 와. 특히 한 명이 먼저
                집착하게 되는 흐름이 보여.
              </p>
            </div>
          </div>

          <div className="talk">
            <div className="emoji orange">🧡</div>

            <div>
              <b>싸울 땐 확실히 극단적으로 부딪혀.</b>
              <p>
                한쪽은 바로 말하고, 다른 한쪽은
                갑자기 거리 두는 스타일이야.
              </p>
            </div>
          </div>

          <div className="talk">
            <div className="emoji yellow">✨</div>

            <div>
              <b>근데 묘하게 다시 끌린다.</b>
              <p>
                감정 온도가 쉽게 식지 않는 조합이라
                헤어져도 다시 연락할 확률 높아.
              </p>
            </div>
          </div>

          <div className="blur-box">
            <div className="blur-content">
              사주 오행 흐름 / 연애 시기 /
              집착 포인트 / 결혼 가능성 /
              바람 위험도 / 감정 우위 /
              싸움 패턴 / 연락 스타일
            </div>

            <div className="blur-overlay">
              🔒 유료 결제 후 전체 공개
            </div>
          </div>

          <button className="pay-btn">
            💛 전체 상세 분석 보기 (990원)
          </button>

          <button className="share-full">
            📤 결과 공유하기
          </button>
        </div>
      </section>
    </div>
  );
}