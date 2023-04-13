import axios from "axios";
import moment from "moment";

const insertRecordinZohoCRM = async (
  firstName,
  lastName,
  email,
  phoneNumber,
  leadSource,
  note,
  concerns
) => {
  console.log(firstName, lastName, email, phoneNumber, leadSource);
  let access_token = "";
  const url = `https://accounts.zoho.in/oauth/v2/token?refresh_token=${process.env.refresh_token}&client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=refresh_token`;
  await axios.post(url).then((res) => {
    console.log("access token", res.data.access_token);
    access_token = res.data.access_token;
  });
  let headers = {
    Authorization: `Zoho-oauthtoken ${access_token}`,
  };
  let newId, oldId;

  let requestBody = [
    {
      Email_Id: email,
      Phone: phoneNumber,
      Last_Name: lastName,
      First_Name: firstName,
      Lead_Source: leadSource,
      Lead_Status: "First Call",
      Concerns_Conditions1: concerns,
      Created_Date: moment().format(),
    },
  ];

  await axios({
    url: "https://www.zohoapis.in/crm/v2/Leads",
    method: "POST",
    headers: headers,
    data: JSON.stringify(requestBody),
    encoding: "utf8",
    throwHttpErrors: false,
  })
    .then((res) => {
      console.log("status code Lead Created", res.status);
      console.log("data", res.data.data);
      if (res.status === 201) {
        newId = res.data.data[0].details.id;
      } else if (
        res.status === 202 &&
        res.data.data[0].code === "DUPLICATE_DATA"
      ) {
        oldId = res.data.data[0].details.id;
      }
    })
    .catch((err) => {
      console.log("error", err);
    });
  console.log("newId oldId", newId, oldId);
  if (oldId)
    await axios({
      url: "https://www.zohoapis.in/crm/v2/Leads",
      method: "PUT",
      headers: headers,
      data: JSON.stringify({
        data: [{ id: oldId, Lead_Status: "Resubmission" }],
      }),
      encoding: "utf8",
      throwHttpErrors: false,
    })
      .then((res) => {
        console.log("status code Lead updated", res.status);
        console.log("data", res.config.data);
      })
      .catch((err) => {
        console.log(err);
      });

  if (oldId || leadSource === "Exotel")
    await axios({
      url: `https://www.zohoapis.in/crm/v2/Leads/${
        oldId ? oldId : newId
      }/Notes`,
      method: "POST",
      headers: headers,
      data: JSON.stringify({
        data: [note],
      }),
    })
      .then((res) => {
        console.log("status code Note added", res.status);
        console.log("data", res.config.data);
      })
      .catch((err) => {
        console.log("error", err);
      });
};

export default insertRecordinZohoCRM;
