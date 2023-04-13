import axios from "axios";
import moment from "moment";

const zoho = async (req, res) => {
  let access_token = "";
  const url = `https://accounts.zoho.in/oauth/v2/token?refresh_token=${process.env.refresh_token}&client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=refresh_token`;
  await axios.post(url).then((res) => {
    console.log("access token", res.data.access_token);
    access_token = res.data.access_token;
  });
  let headers = {
    Authorization: `Zoho-oauthtoken ${access_token}`,
  };
  let data = [];
  await axios({
    url: "https://www.zohoapis.in/crm/v2/Leads",
    headers: headers,
    encoding: "utf8",
    throwHttpErrors: false,
  })
    .then((res) => {
      data = res.data.data;
    })
    .catch((err) => {
      console.log("error", err);
    });
  let request = [];
  console.log(data.length);
  for (let i = 0; i < data.length; i++) {
    let phone = data[i].Phone;
    let id = data[i].id;
    let object;
    if (phone && phone[0] == "0") {
      object = {
        id: id,
        Phone: phone.substr(1),
      };
      request.push(object);
    }
  }
  console.log(request.length);
  let requestBody = {};
  requestBody["data"] = request;
  let datas = [];
  for (let i = 0; i < request.length; i++) {
    await axios({
      url: `https://www.zohoapis.in/crm/v2/Leads/search?phone=${request[i]["Phone"]}`,
      headers: headers,
      //   data: JSON.stringify(requestBody),
      encoding: "utf8",
      throwHttpErrors: false,
    }).then((res) => {
      let d = { ...res.data.data };
      datas.push(d);
    });
  }
  console.log(datas.length);
  return res.status(200).json(datas);
};

export default zoho;
