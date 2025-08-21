# 🚀 쿠팡 물류 시뮬레이션 시스템 (Coupang Logistics Reality Simulator)

**단일 HTML 파일로 동작하는 정적 시뮬레이터**입니다. 로켓배송/프레시·콜드체인/허브&스포크/AI 자동화/재고·WMS 등 전반의 전자상거래 물류 플로우를 **현실적인 가정치**로 생성·가시화하고, KPI와 CSV를 바로 출력합니다.

> TL;DR — `index.html` 하나로 실행 · KPI 확인 · CSV 다운로드 · GitHub Pages/Netlify로 즉시 배포

---

## ✨ 주요 기능 (Features)

* **데이터 생성기**: 연도 범위/주문수/고객수/로켓비중/WOW비중/순이익률 목표 등 입력 → 대량의 사실적 주문·물류 데이터 생성
* **네트워크 타임라인**: FC 출고 → 허브 경유 → 캠프 로드아웃 → OFD → 배송 완료까지의 타임스탬프 자동 생성
* **콜드체인/신선**: 온도 목표/실측, 위반 여부, 품질 점수, 유통기한·Lot/빈-슬롯(Bin/Slot) 등
* **자동화/AI**: 지역별 자동화 레벨(Manual/Auto/AI Optimized), 피킹·패킹시간, 라우팅 점수, 오류율
* **고객/수익성**: WOW, LTV/CAC, AOV/ARPPU, 손익(매출/총이익/순이익), 반품/재판매 가능 여부
* **KPI 대시보드**: 로켓·풀필·WOW·신선·네트워크·AI·수익·고객·배송·반품·재고 KPI 표시
* **정합성 검사 & 리스크 탐지**: 쿠팡 시나리오에 특화된 룰 기반 검사 결과 표시
* **CSV 다운로드**: 깔끔한 헤더 별칭으로 바로 분석 도구(Tableau/Excel/BigQuery 등)로 이식 가능
* **성능 고려**: 청크 처리/메모리 상한/간헐 GC 등으로 수십만 행까지 브라우저에서 처리

---

## 🖥️ 실행 & 배포

### 로컬 실행

그냥 `index.html` 더블클릭(또는 간단한 정적 서버로 서빙)하면 끝입니다.

### 빠른 배포 (택1)

**A) GitHub Pages**

```bash
git init
echo > .nojekyll
git add .
git commit -m "init: coupang logistics simulator"
git branch -M main
git remote add origin https://github.com/<YOUR_ID>/<REPO>.git
git push -u origin main
```

* GitHub → **Settings → Pages → Deploy from a branch → Branch: `main` / Folder: `/ (root)`**
* 접속: `https://<YOUR_ID>.github.io/<REPO>/`

**B) Netlify Drop**

* `app.netlify.com/drop` 에 폴더(또는 `index.html`) 드래그&드롭 → 즉시 URL 발급

---

## 🔧 화면 구성 & 사용법

### 1) 컨트롤 패널

* **Start/End Year**: 시뮬레이션 연도 범위
* **#Users / #Orders / Chunk Size**: 고객 수, 주문 수, 생성 청크 크기
* **Rocket Rate / WOW Rate**: 로켓배송·WOW 가입률 목표(%)
* **Target Net Margin**: 전체 순이익률 목표(%)
* **Buttons**

  * ▶️ **Generate**: 데이터 생성 시작
  * ⚙️ **DIALS**: 손실·온도위반·과재고 등 분포 튜닝
  * ⏹️ **Stop**: 생성 중단
  * 📥 **Download CSV**: CSV 저장

### 2) KPI 패널

* 로켓/풀필/신선/네트워크/AI/수익/고객/배송/반품/재고 각 섹션의 핵심 지표 표시

### 3) 검사/리스크/성능

* **정합성 검사**: 시나리오 위반 또는 이상값 요약
* **복합 위험 요소**: 지역·날씨·신선/온도·라스트마일 리스크
* **처리 성능**: 처리 속도, 메모리 효율, 현실성 점수 등

### 4) 데이터 테이블

* 생성된 모든 열을 표로 확인 (CSV 헤더 별칭 적용)

---

## 🧮 핵심 KPI 정의(발췌)

| 분류 | KPI           | 정의(개략)                                  |
| -- | ------------- | --------------------------------------- |
| 로켓 | 로켓비중          | `Is_Rocket_Delivery` 비율                 |
| 로켓 | 당일/새벽 정시율     | 해당 모드 중 `SLA_Breach=0` 비율               |
| 풀필 | 정시 출고율        | 주문→FC Exit가 SLA 분(모드별) 이하               |
| 풀필 | 60분 내 출고율     | `Order_To_Ship_Minutes ≤ 60` 비율         |
| 신선 | 콜드체인 준수율      | 냉장/냉동 주문 중 `Temperature_Violation=0` 비율 |
| 수익 | 순이익률          | `sum(Net_Profit)/sum(Order_Amount)`     |
| 고객 | LTV\:CAC      | `avg(Customer_LTV)/avg(CAC)`            |
| 배송 | 정시율/예외율       | SLA 위반/오배송·파손 비율 등                      |
| 반품 | 반품률/손실률       | 반품 플래그/반품손실/재판매 가능률                     |
| 재고 | 회전/품절/과재고/정확도 | 재고 관련 파생 지표들                            |

---

## 🧱 데이터 모델 (주요 열)

> 전체 열은 코드 내 `CSV_SPECIAL_LABELS`와 생성 로직을 참고. 아래는 분석에 자주 쓰는 핵심 그룹만 발췌했습니다.

### 주문/고객/상품

* `Order_ID`, `Order_Timestamp`, `Region/City/District/Address`
* `Customer_ID`, `Is_WOW_Member`, `WOW_Tier`, `WOW_Tenure_Days`
* `Product_Category`, `SKU`, `ABC_Category`, `Unit_Price`, `Quantity`, `Order_Amount`

### 배송 모드/상태

* `Delivery_Mode`(로켓당일/새벽/익일/프레시/일반)
* `Planned_Delivery_Date`, `Actual_Delivery_Date`, `Is_Delayed`, `SLA_Breach`, `Delivery_Status`
* 파생: `Is_Rocket_Delivery`, `Is_Same_Day_Delivery`, `Is_Dawn_Delivery`, `Is_Fresh_Delivery`

### 네트워크 타임라인(동적 키)

* `__net_FC_Exit_TS`, `__net_Hub_In_TS`, `__net_Hub_Out_TS`, `__net_Camp_In_TS`, `__net_Loadout_Start_TS`, `__net_Loadout_End_TS`, `__net_OFD_TS`
* 체류시간: `__net_FC_Dwell_Min`, `__net_Hub_Dwell_Min`, `__net_Camp_Dwell_Min`
* 라우팅: `__net_Route_Type`(DIRECT/VIA\_HUB), `__net_Sortation_Hub_Name`

### 풀필/WMS/자동화

* `Fulfillment_Center`, `Order_To_Ship_Minutes`, `On_Time_Dispatch_Flag`
* `Automation_Level`(MANUAL/SEMI\_AUTO/AUTO/AI\_OPTIMIZED)
* `Picking_Time_Seconds`, `Packing_Time_Seconds`, `WMS_Advanced_Score`, `Routing_Score`

### 콜드체인/신선

* `Is_Cold_Chain_Required`, `Target_Temperature`, `Actual_Temperature`, `Temperature_Violation`, `Cold_Chain_Quality_Score`
* 유통기한/로케이션: `Receiving_Date`, `Putaway_Date`, `Lot_ID`, `Expiry_Date`, `Bin`, `Slot`

### 수익/고객가치/반품

* `Actual_Logistics_Cost`, `Customer_Delivery_Charge`, `Gross_Profit`, `Net_Profit`
* `CAC`, `Customer_LTV`, `LTV_to_CAC`, `CLV_Quartile/Label`
* `Return_Flag`, `Return_Reason`, `Return_Cost`, `Is_Resellable`

---

## 🧪 현실 가정(요약)

* **시간대별 주문 분포**: 저녁 피크(19–21시) 강화
* **지역/도시/구**: 시·도 → 시/구 기본 맵 적용, 평균 거리·원가 지역별 파라미터
* **날씨**: 계절/지역 가중, 제주 강풍·지연 상승
* **배송 모드**: 지역/품목(신선·냉동) 제약 반영, 마감시간에 따른 계획 납기
* **차량/기사/적재율/연비**: 지역 적합도와 가변 원가 반영
* **자동화**: 지역별 레벨에 따라 피킹/패킹/오류율/라우팅 차등
* **신선/콜드체인**: 목표온도 범위, 위반 시 반품률·손실 가중
* **비용**: 기본/거리/처리/날씨·섬·피크 가중치로 실제 물류비 추정

---

## ⚙️ DIALS(튜닝) & 보정

* **Loss/TempViolation/JejuWeather/Overstock/ExpiryImminent** 범위를 UI에서 조절 → 시뮬레이션 분포에 반영
* **Target Net Margin**으로 전체 손익 밸런스 재보정(출고/반품/보관·예외코스트 등 내부 변수 가중)

---

## 📤 CSV 헤더 별칭

* 내보낼 때 사람이 읽기 좋은 헤더로 매핑됩니다.
  예) `Order_ID → "Order ID"`, `__net_FC_Exit_TS → "FC Exit TS"`, `Is_WOW_Member → "Is WOW Member"`
* 분석 도구에서 바로 차트/필터에 쓰기 좋게 거리 버킷(`Distance_Bucket`, `Distance_Band_Label`) 등 파생 컬럼 포함

---

## 🧱 예시 레코드(JSON 발췌)

```json
{
  "Order_ID": "ORD01000000",
  "Order_Timestamp": "2024-07-03T19:21:42.000Z",
  "Delivery_Mode": "로켓새벽",
  "Region": "경기도",
  "Customer_ID": "CUST0100000",
  "Product_Category": "신선식품",
  "Order_Amount": 32800,
  "Is_Cold_Chain_Required": 1,
  "Target_Temperature": 2.5,
  "Actual_Temperature": 6.8,
  "Temperature_Violation": 1,
  "__net_FC_Exit_TS": "2024-07-03T20:05:00.000Z",
  "__net_Camp_In_TS": "2024-07-03T23:10:00.000Z",
  "__net_OFD_TS": "2024-07-04T00:20:00.000Z",
  "Actual_Logistics_Cost": 5890,
  "Net_Profit": -1200
}
```

---

## 🛠️ 개발 메모

* **정적 SPA**: 외부 빌드/의존성 없음. 단일 `index.html`로 유지
* **성능**: `CHUNK_CONFIG` 기반 청크 생성·부분 KPI 업데이트·메모리 상한 관리
* **알려진 이슈(정리)**

  * `calculateCoupangKPIs` 내 `arppu` 변수가 선언 없이 사용됨 → `avg(Order_Amount / 유료고객수)` 등으로 계산식 추가 권장
  * `generateCoupangRealisticRow` 말미 중복 `return`/타임라인 세팅 블록 중복 → 한 번만 남기기 권장
  * 일부 하단 함수가 편집 중 잘렸을 수 있음(예: `calculateRealityMetrics` 이어짐 확인)

---

## 📦 리포 구조(권장)

```
.
├─ index.html          # 앱 본체 (현재 파일)
├─ README.md           # 이 문서
└─ .nojekyll           # (GitHub Pages 사용 시 권장)
```

---

## 🤝 Contributing

* PR/Issue 환영합니다. KPI 정의·현실 가정·데이터 모델 확장에 대한 제안 특히 환영!
* 커밋 메시지는 `feat|fix|refactor|docs|perf|chore: ...` 포맷 권장

---

## 📄 라이선스

* 미정(Repository 소유자가 지정). 필요 시 MIT/Apache-2.0 등으로 설정하세요.

---

## 🙏 고지

* 본 시뮬레이터는 **가상의 생성 데이터**를 사용합니다. 특정 기업의 실제 운영 수치와 다르며, 의사결정 참고용 샘플/데모 목적입니다.
