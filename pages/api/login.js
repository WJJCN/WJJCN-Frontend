// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from "axios";

export default async function login(req, res) {
  try {
    const resonse = await axios.get(`${process.env.API_URL}/login`, {
      headers: {
        "x-api-key": process.env.API_KEY,
      },
      data: {
        password: req.query.password,
      },
    });

    res.status(200).json({ status: "ok", data: resonse.data });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
}
