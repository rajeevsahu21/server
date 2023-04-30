const { google } = require("googleapis");

const auth = new google.auth.GoogleAuth({
  keyFile: "googleCred.json",
  scopes: "https://www.googleapis.com/auth/spreadsheets",
});
const client = auth.getClient();
const Sheets = google.sheets({ version: "v4", auth: client });

const sheetId = "18YDADvyi6grgC5ZKMcpa9YtDU-qCNbGGH1BSNyQgxR4";
const sampleInvoiceSheetId = "1466105040";
const month = "January";
const monthInShort = "Jan";
const duplicateInvoiceToGSheet = async () => {
  // Adding the lead as a new row
  const response = await Sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: sheetId,
    range: "Invoice Register",
  });
  const data = response.data.values;
  let index = 2;
  for (let i = 1; i < data.length; i++) {
    const st = getStateCodeByName(data[i][8]);
    await Sheets.spreadsheets.batchUpdate({
      auth: auth,
      spreadsheetId: sheetId,
      requestBody: {
        requests: [
          {
            duplicateSheet: {
              sourceSheetId: sampleInvoiceSheetId,
              insertSheetIndex: ++index,
              newSheetName: data[i][1],
            },
          },
        ],
      },
    });
    await Sheets.spreadsheets.values.update({
      auth: auth,
      spreadsheetId: sheetId,
      range: `${data[i][1]}!B6:K40`,
      valueInputOption: "RAW",
      resource: {
        values: [
          [
            ,
            ,
            ,
            ,
            st
              ? null
              : "(SUPPLY MEANT FOR EXPORT/SUPPLY TO SEZ UNIT OR SEZ DEVELOPER FOR AUTHORISED",
          ],
          [
            ,
            ,
            ,
            ,
            st
              ? null
              : "OPERATIONS UNDER BOND OR LETTER OF UNDERTAKING WITHOUT PAYMENT OF IGST)",
          ],
          [],
          [],
          [, , , , , , , , data[i][3]],
          [, , , , , , , , data[i][4]],
          [],
          [],
          [
            ,
            ,
            ,
            ,
            ,
            ,
            st ? null : "LUT Number",
            st ? null : ":",
            st ? null : "AD290322011711K",
          ],
          [],
          [],
          [data[i][5], , , , , , , , data[i][7]],
          [data[i][6], , , , , , , , month],
          [, data[i][9], , , , , , , data[i][8]],
          [, data[i][10], , , , , , , st ? st : "-"],
          [],
          [],
          [],
          [data[i][12], , , , , data[i][15], data[i][17], , , data[i][17]],
          [],
          [],
          [],
          [],
          [, , , , , , , , , data[i][17]],
          [
            ,
            ,
            data[i][18] !== "-" ? "9.0" : "0.0",
            ,
            data[i][19] !== "-" ? "9.0" : "0.0",
            ,
            data[i][20] !== "-" ? "18" : "0.0",
            ,
            ,
            data[i][13] === "Books" ? "-" : st ? "18" : "-",
          ],
          [
            ,
            ,
            data[i][18],
            ,
            data[i][19],
            ,
            data[i][20],
            ,
            ,
            data[i][13] === "Books"
              ? "-"
              : st
              ? st === 29
                ? +data[i][18] + +data[i][19]
                : data[i][20]
              : "-",
          ],
          [
            `Amount in Words: ${convert_number(data[i][16])} Rupees Only`,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            ,
            data[i][16],
          ],
        ],
      },
    });
  }
};

const createInvoiceRegister = async () => {
  // Adding the lead as a new row
  const response = await Sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: sheetId,
    range: "Supply Recon",
  });
  const data = response.data.values;
  let sl = 1,
    slB = 1,
    slE = 1;
  let da = [];
  for (let i = 1; i < data.length; i++) {
    const st = getStateCodeByName(data[i][32]);
    da.push([
      "22-23",
      data[i][34] === "Books"
        ? `EXMT/FT${slB}`
        : st
        ? `FT${sl}`
        : `EXPO/FT${slE}`,
      `${monthInShort}-23`,
      data[i][34] === "Books"
        ? `EXMT/FT${slB++}/${monthInShort}/22-23`
        : st
        ? `FT${sl++}/${monthInShort}/22-23`
        : `EXP/FT${slE++}/${monthInShort}/22-23`,
      data[i][27].split(" ")[0],
      data[i][30],
      ,
      data[i][31],
      data[i][32],
      data[i][21],
      data[i][20],
      ,
      data[i][33],
      data[i][34],
      data[i][34] === "Books" ? null : st ? (st === 29 ? "No" : "Yes") : null,
      "1",
      data[i][3],
      data[i][34] === "Books"
        ? data[i][3]
        : st
        ? Math.round((data[i][3] / 1.18) * 100) / 100
        : data[i][3],
      data[i][34] === "Books"
        ? "-"
        : data[i][32] === "Karnataka"
        ? Math.round((data[i][3] / 1.18) * 0.09 * 100) / 100
        : "-",
      data[i][34] === "Books"
        ? "-"
        : data[i][32] === "Karnataka"
        ? Math.round((data[i][3] / 1.18) * 0.09 * 100) / 100
        : "-",
      data[i][34] === "Books"
        ? "-"
        : st
        ? st === 29
          ? "-"
          : Math.round((data[i][3] / 1.18) * 0.18 * 100) / 100
        : "-",
    ]);
  }
  await Sheets.spreadsheets.values.append({
    auth: auth,
    spreadsheetId: sheetId,
    range: "Invoice Register",
    valueInputOption: "RAW",
    resource: {
      values: da,
    },
  });
};

module.exports = {
  duplicateInvoiceToGSheet,
  createInvoiceRegister,
};

const getStateCodeByName = (st) => {
  let state = [
    [10, "Bihar"],
    [11, "Sikkim"],
    [12, "Arunachal Pradesh"],
    [13, "Nagaland"],
    [14, "Manipur"],
    [15, "Mizoram"],
    [16, "Tripura"],
    [17, "Meghalaya"],
    [18, "Assam"],
    [19, "West Bengal"],
    [20, "Jharkhand"],
    [21, "Odisha"],
    [22, "Chhattisgarh"],
    [23, "Madhya Pradesh"],
    [24, "Gujarat"],
    [25, "Daman And Diu (old)"],
    [26, "Dadra & Nagar Haveli and Daman & Diu"],
    [27, "Maharashtra"],
    [28, "Andhra Pradesh (Old)"],
    [29, "Karnataka"],
    [30, "Goa"],
    [31, "Lakshadweep"],
    [32, "Kerala"],
    [33, "Tamil Nadu"],
    [34, "Puducherry"],
    [35, "Andaman And Nicobar islands"],
    [36, "Telangana"],
    [37, "Andhra Pradesh"],
    [38, "Ladakh"],
    [97, "Other Territory"],
    ["01", "Jammu And Kashmir"],
    ["02", "Himachal Pradesh"],
    ["03", "Punjab"],
    ["04", "Chandigarh"],
    ["05", "Uttarakhand"],
    ["06", "Haryana"],
    ["07", "Delhi"],
    ["08", "Rajasthan"],
    ["09", "Uttar Pradesh"],
  ];

  return state.find((s) => s[1] === st)
    ? state.find((s) => s[1] === st)[0]
    : null;
};

function number2text(value) {
  var fraction = Math.round(frac(value) * 100);
  var f_text = "";

  if (fraction > 0) {
    f_text = "AND " + convert_number(fraction) + " PAISE";
  }

  return convert_number(value) + " RUPEE " + f_text + " ONLY";
}

function frac(f) {
  return f % 1;
}

function convert_number(number) {
  if (number < 0 || number > 999999999) {
    return "NUMBER OUT OF RANGE!";
  }
  var Gn = Math.floor(number / 10000000); /* Crore */
  number -= Gn * 10000000;
  var kn = Math.floor(number / 100000); /* lakhs */
  number -= kn * 100000;
  var Hn = Math.floor(number / 1000); /* thousand */
  number -= Hn * 1000;
  var Dn = Math.floor(number / 100); /* Tens (deca) */
  number = number % 100; /* Ones */
  var tn = Math.floor(number / 10);
  var one = Math.floor(number % 10);
  var res = "";

  if (Gn > 0) {
    res += convert_number(Gn) + " CRORE";
  }
  if (kn > 0) {
    res += (res == "" ? "" : " ") + convert_number(kn) + " LAKH";
  }
  if (Hn > 0) {
    res += (res == "" ? "" : " ") + convert_number(Hn) + " THOUSAND";
  }

  if (Dn) {
    res += (res == "" ? "" : " ") + convert_number(Dn) + " HUNDRED";
  }

  var ones = Array(
    "",
    "ONE",
    "TWO",
    "THREE",
    "FOUR",
    "FIVE",
    "SIX",
    "SEVEN",
    "EIGHT",
    "NINE",
    "TEN",
    "ELEVEN",
    "TWELVE",
    "THIRTEEN",
    "FOURTEEN",
    "FIFTEEN",
    "SIXTEEN",
    "SEVENTEEN",
    "EIGHTEEN",
    "NINETEEN"
  );
  var tens = Array(
    "",
    "",
    "TWENTY",
    "THIRTY",
    "FOURTY",
    "FIFTY",
    "SIXTY",
    "SEVENTY",
    "EIGHTY",
    "NINETY"
  );

  if (tn > 0 || one > 0) {
    if (!(res == "")) {
      res += " AND ";
    }
    if (tn < 2) {
      res += ones[tn * 10 + one];
    } else {
      res += tens[tn];
      if (one > 0) {
        res += "-" + ones[one];
      }
    }
  }

  if (res == "") {
    res = "zero";
  }
  return res;
}
