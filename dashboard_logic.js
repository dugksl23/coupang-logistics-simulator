
let generatedData = [];

    // ➕ 고객별 요약 생성
    const customerSummary = {};
    for (let row of generatedData) {
      if (!customerSummary[row.Customer_ID]) {
        customerSummary[row.Customer_ID] = {
          orders: 0,
          totalAmount: 0,
          totalNet: 0,
          totalGross: 0,
          totalReturnCost: 0,
          ltv: row.LTV,
          cac: row.CAC
        };
      }
      customerSummary[row.Customer_ID].orders += 1;
      customerSummary[row.Customer_ID].totalAmount += row.Order_Amount;
      customerSummary[row.Customer_ID].totalNet += row.Net_Profit;
      customerSummary[row.Customer_ID].totalGross += row.Gross_Profit;
      customerSummary[row.Customer_ID].totalReturnCost += row.Return_Cost;
    }


function generateData() {
  const startYear = parseInt(document.getElementById("startYear").value);
  const endYear = parseInt(document.getElementById("endYear").value);
  const rowCount = parseInt(document.getElementById("rowCount").value);
  const loading = document.getElementById("loading");
  const error = document.getElementById("error");

  if (startYear > endYear) {
    error.textContent = "시작년도는 종료년도보다 작거나 같아야 합니다.";
    return;
  }

  loading.style.display = "block";
  error.textContent = "";
  generatedData = [];

    // ➕ 고객별 요약 생성
    const customerSummary = {};
    for (let row of generatedData) {
      if (!customerSummary[row.Customer_ID]) {
        customerSummary[row.Customer_ID] = {
          orders: 0,
          totalAmount: 0,
          totalNet: 0,
          totalGross: 0,
          totalReturnCost: 0,
          ltv: row.LTV,
          cac: row.CAC
        };
      }
      customerSummary[row.Customer_ID].orders += 1;
      customerSummary[row.Customer_ID].totalAmount += row.Order_Amount;
      customerSummary[row.Customer_ID].totalNet += row.Net_Profit;
      customerSummary[row.Customer_ID].totalGross += row.Gross_Profit;
      customerSummary[row.Customer_ID].totalReturnCost += row.Return_Cost;
    }


  const regions = ["수도권", "영남권", "호남권", "충청권"];
  const cities = {
    수도권: ["서울", "인천", "수원"],
    영남권: ["부산", "대구", "울산"],
    호남권: ["광주", "전주", "여수"],
    충청권: ["대전", "청주", "천안"]
  };
  const productCategories = ["식품", "의류", "전자제품", "뷰티", "가전"];
  const deliveryModes = ["일반", "당일", "새벽"];
  const returnReasons = ["단순변심", "상품불량", "배송지연"];

  for (let i = 0; i < rowCount; i++) {
    const customerId = `CUST${(i % 300 + 1).toString().padStart(4, "0")}`;
    const orderDate = new Date(startYear + Math.floor(Math.random() * (endYear - startYear + 1)), Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    const region = regions[Math.floor(Math.random() * regions.length)];
    const city = cities[region][Math.floor(Math.random() * cities[region].length)];
    const category = productCategories[Math.floor(Math.random() * productCategories.length)];
    const deliveryMode = deliveryModes[Math.floor(Math.random() * deliveryModes.length)];
    const isWOW = Math.random() < 0.6;

    const amount = Math.floor(Math.random() * 90000 + 10000);
    const gross = amount * (0.1 + Math.random() * 0.1);
    const deliveryCost = isWOW ? 0 : 3000;
    const internalCost = Math.floor(Math.random() * 3000 + 2000);
    const net = gross - deliveryCost - internalCost;
    const returnCost = Math.random() < 0.08 ? 45000 : 0;
    const isDelayed = Math.random() < 0.06 ? 1 : 0;
    const returnReason = returnCost > 0 ? returnReasons[Math.floor(Math.random() * returnReasons.length)] : "";

    generatedData.push({
      Order_ID: `ORD${(i + 1).toString().padStart(6, "0")}`,
      Customer_ID: customerId,
      Order_Date: orderDate.toISOString().split("T")[0],
      Region: region,
      City: city,
      Product_Category: category,
      Delivery_Mode: deliveryMode,
      Order_Amount: amount,
      Gross_Profit: gross,
      Net_Profit: net,
      Delivery_Cost: deliveryCost,
      Internal_Logistics_Cost: internalCost,
      Is_Delayed: isDelayed,
      Return_Cost: returnCost,
      Return_Reason: returnReason,
      Is_WOW: isWOW ? 1 : 0,
      LTV: isWOW ? 2000000 : 1200000,
      CAC: isWOW ? 200000 : 400000,
      SLA_Breach: isDelayed,
      WOW_Free_Delivery_Count: isWOW ? Math.floor(Math.random() * 15) : 0,
      Order_Count_Per_Customer: Math.floor(Math.random() * 20) + 1,
      Customer_ARPPU: net,
      Discount_Applied: Math.random() < 0.3 ? 1 : 0
    });
  }

  loading.style.display = "none";
  alert("데이터가 생성되었습니다. KPI는 추후 계산 로직을 추가해주세요.");
}

function downloadCSV() {
  if (!generatedData.length) return alert("데이터를 먼저 생성하세요.");
  const headers = Object.keys(generatedData[0]).join(",");
  const rows = generatedData.map(r => Object.values(r).join(",")).join("\n");
  const blob = new Blob([headers + "\n" + rows], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "enhanced_kpi_data.csv";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
