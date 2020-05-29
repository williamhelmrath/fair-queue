const express = require("express"); // Express web server framework
const request = require("request"); // "Request" library
const queryString = require("query-string");
const cookieParser = require("cookie-parser");
const cors = require("cors");

require("dotenv").config();

const app = express();

const client_id = process.env.SPOTIFY_CLIENT_ID;
const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
const redirect_uri = process.env.REDIRECT_URI;

const stateKey = "spotify_auth_state";

let generateRandomString = (length) => {
  let text = "";
  let possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/login", (req, res) => {
  let state = generateRandomString(16);

  res.cookie(stateKey, state);

  let scope = "user-read-private user-read-email user-read-currently-playing";

  const url = "https://accounts.spotify.com/authorize";
  const query = {
    client_id,
    response_type: "code",
    redirect_uri,
    scope,
    state,
  };
  const requestUrl = queryString.stringifyUrl({ url: url, query: query });
  res.redirect(requestUrl);
});

app.get("/callback", (req, res) => {
  let code = req.query.code || null;
  let state = req.query.state || null;
  let storedState = req.cookies ? req.cookies[stateKey] : null;

  if (!state || state !== storedState) {
    res.redirect("/#" + queryString.stringify({ error: "state_mismatch" }));
  } else {
    res.clearCookie(stateKey);
    let authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        grant_type: "authorization_code",
        code,
        redirect_uri,
        client_id,
        client_secret,
      },
      json: true,
    };

    request.post(authOptions, (error, response, body) => {
      if (!error && response.statusCode === 200) {
        let access_token = body.access_token;
        let refresh_token = body.refresh_token;
        let options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        request.get(options, (error, response, body) => {
          console.log(body);

          res.redirect(
            "http://localhost:3000/#" +
              queryString.stringify({ access_token, refresh_token })
          );
        });
      } else {
        res.redirect(
          "http://localhost:3000/#" +
            queryString.stringify({ error: "invalid_token" })
        );
      }
    });
  }
});

app.get("/refresh_token", (req, res) => {
  // requesting access token from refresh token
  let refresh_token = req.query.refresh_token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      let access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});
// app.use(express.static(path.join(__dirname, "build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "build/index.html"));
// });

let PORT = process.env.PORT || 8888;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
