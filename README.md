# IBM Cloud Functions Example
## GitHub Comment Example
1. Create a [GitHub App](https://developer.github.com/apps/)
  - Fill out all of the required fields
  - In the `Webhook URL`, put in a dummy URL for now
2. Download the PEM and place it into this folder
3. Replace the `pem` in `comment.js` with the name of your PEM read
4. Replace the `appId` in `comment.js` with the ID from your GitHub App
5. Run `npm install`
6. Run `zip -r github-comment.zip .`
7. Upload your function to IBM Cloud
  - `ibmcloud fn action create comment github-comment.zip --kind nodejs:8`
8. Grap the Endpoint from your `comment` function in IBM Cloud
  - In the `Webhook URL` for your GitHub App, replace that with the Endpoint from your IBM Cloud Function
