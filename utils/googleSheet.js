import { google } from "googleapis";
import moment from "moment";
import axios from "axios";

const googleAPI = async (req, res) => {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
  });
  const client = await auth.getClient();
  const googleSheets = google.sheets({ version: "v4", auth: client });

  const respone = await googleSheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: "1u0MX5aUYkzxhegrN3DF5chYMylT_Fb6VnduCee4cQ_s",
    // range: "Final Sheet",
  });
  const data = respone.data.values;
  let Notes = [];
  let request = [];
  for (let i = 1; i < data.length; i++) {
    let da = {};
    let n = {};
    da.First_Name = data[i][0];
    da.Last_Name = "-";
    da.Phone = data[i][1];
    da.Email_Id = data[i][2];
    da.City = data[i][3];
    da.Child_Name = data[i][4];
    da.Age = data[i][5];
    da.Concerns_Conditions1 = data[i][6];
    da.Service_required = data[i][7];
    da.Lead_associate = data[i][10];
    da.Lead_Source = data[i][12];
    da.Lead_Status = data[i][15];
    da.Created_Date = moment(data[i][18]).format();
    n.Notes = data[i][11];
    Notes.push(n);
    request.push(da);
  }
  for (let i = 0; i < request.length; i++) {
    console.log(request[i].Created_Date);
    let requestBody = {};
    requestBody["data"] = [request[i]];
    console.log("Request Body", requestBody);
    let notes = {
      Note_Title: "*System Generated Note (While importing from gSheet)*",
      Note_Content: Notes[i].Notes,
    };
    // let access_token = "";
    // const url = `https://accounts.zoho.in/oauth/v2/token?refresh_token=${process.env.refresh_token}&client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=refresh_token`;
    // await axios.post(url).then((res) => {
    //   console.log("access token", res.data.access_token);
    //   access_token = res.data.access_token;
    // });
    //   let headers = {
    //     Authorization: `Zoho-oauthtoken 1000.c9b77031eabf1b7576e3d9d16d256be2.65c20a00a7d55bd08f01e555518d7ff6`,
    //   };
    //   let newId, oldId;
    //   await axios({
    //     url: "https://www.zohoapis.in/crm/v2/Leads",
    //     method: "POST",
    //     headers: headers,
    //     data: JSON.stringify(requestBody),
    //     encoding: "utf8",
    //     throwHttpErrors: false,
    //   })
    //     .then((res) => {
    //       console.log("status code Lead Created", res.status);
    //       console.log("data", res.data.data);
    //       if (res.status === 201) {
    //         newId = res.data.data[0].details.id;
    //       } else if (
    //         res.status === 202 &&
    //         res.data.data[0].code === "DUPLICATE_DATA"
    //       ) {
    //         oldId = res.data.data[0].details.id;
    //       }
    //     })
    //     .catch((err) => {
    //       console.log("error", err);
    //     });
    //   console.log("newId oldId", newId, oldId);
    //   await axios({
    //     url: `https://www.zohoapis.in/crm/v2/Leads/${
    //       oldId ? oldId : newId
    //     }/Notes`,
    //     method: "POST",
    //     headers: headers,
    //     data: JSON.stringify({
    //       data: [notes],
    //     }),
    //   })
    //     .then((res) => {
    //       console.log("status code Note added", res.status);
    //       console.log("data", res.config.data);
    //     })
    //     .catch((err) => {
    //       console.log("error", err);
    //     });
  }
  res.status(200).json(request);
};

export default googleAPI;
