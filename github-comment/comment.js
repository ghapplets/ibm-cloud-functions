const octokit = require("@octokit/rest")();
const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const appId = "17334"
const pem = fs.readFileSync(__dirname + '/ibm-cloud-function-comment.2018-09-10.private-key.pem');

function generateJwtToken() {
  // Sign with RSA SHA256
  // console.log(`PEM = ${pem}`)
  return jsonwebtoken.sign(
    {
      iat: Math.floor(new Date() / 1000),
      exp: Math.floor(new Date() / 1000) + 60,
      iss: appId
    },
    pem,
    { algorithm: "RS256" }
  );
}

async function postIssueComment(
  installationId,
  owner,
  repository,
  number,
  action
) {
  console.log(`generate jwt token`);
  await octokit.authenticate({
    type: "app",
    token: generateJwtToken()
  });

  console.log(`generate installation token ${installationId}`);
  const { data: { token } } = await octokit.apps.createInstallationToken({
    installation_id: installationId,
  });

  console.log(`authenticate with token`);
  octokit.authenticate({ type: "app", token });

  console.log(`creating new comment`);
  var result = await octokit.issues.createComment({
    owner,
    repo: repository,
    number,
    body: `Updated Function for IBM Functions demo for action ${action} and appId ${appId}.`
  });
  return result;
}

async function entryPoint(params) {
  const stringBody = JSON.stringify(params)
  const body = JSON.parse(stringBody)
  const action = body.action
  const number = body.issue.number
  const repository = body.repository.name
  const owner = body.repository.owner.login
  const installationId = body.installation.id
  try {
    var response = ""
    if (action === "opened") {
      response = await postIssueComment(
        installationId,
        owner,
        repository,
        number,
        action
      );
    }
    return {
      status: 200,
      body: {
        text: response
      },
      headers: {
        "Content-Type": "application/json"
      }
    }
  } catch (e) {
    console.log(`error:: ${e}`);
    return {
      status: 500,
      body: e
    }
  }
}

module.exports.main = entryPoint;
