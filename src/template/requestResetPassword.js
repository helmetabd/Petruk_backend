const REQUEST_TEMPLATE = (payload, subject, template) => {
  if (template === "REQUEST") {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>NodeMailer Email Template</title>
            <style>
              .container {
                width: 100%;
                height: 100%;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .email {
                width: 80%;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
              }
              .email-header {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
              .email-body {
                padding: 20px;
                text-align: center;
              }
              .email-footer {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email">
                <div class="email-header">
                  <h1>${subject}</h1>
                </div>
                <div class="email-body">
                  <p>Hi ${payload.name},</p>
                  <p>You requested to reset your password.</p>
                  <p> Please, click the link below to reset your password</p>
                </div>
                <div class="email-footer">
                  <a href="https://${payload.link}">Reset Password</a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
  } else if (template === "RESET") {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>NodeMailer Email Template</title>
            <style>
              .container {
                width: 100%;
                height: 100%;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .email {
                width: 80%;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
              }
              .email-header {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
              .email-body {
                padding: 20px;
                text-align: center;
              }
              .email-footer {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email">
                <div class="email-header">
                  <h1>${subject}</h1>
                </div>
                <div class="email-body">
                  <p>Hi ${payload.name},</p>
                  <p>Your password has been changed successfully</p>
                </div>
                <div class="email-footer">
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
  } else if (template === "VERIFY") {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>NodeMailer Email Template</title>
            <style>
              .container {
                width: 100%;
                height: 100%;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .email {
                width: 80%;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
              }
              .email-header {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
              .email-body {
                padding: 20px;
                text-align: center;
              }
              .email-footer {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email">
                <div class="email-header">
                  <h1>${subject}</h1>
                </div>
                <div class="email-body">
                  <p>Hi ${payload.name},</p>
                  <p>You requested to verify your account.</p>
                  <p> Please, click the link below to verify your email</p>
                </div>
                <div class="email-footer">
                  <a href="https://${payload.link}">Verify Email</a>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
  } else if (template === "VERIFIED") {
    return `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>NodeMailer Email Template</title>
            <style>
              .container {
                width: 100%;
                height: 100%;
                padding: 20px;
                background-color: #f4f4f4;
              }
              .email {
                width: 80%;
                margin: 0 auto;
                background-color: #fff;
                padding: 20px;
              }
              .email-header {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
              .email-body {
                padding: 20px;
                text-align: center;
              }
              .email-footer {
                background-color: #333;
                color: #fff;
                padding: 20px;
                text-align: center;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="email">
                <div class="email-header">
                  <h1>${subject}</h1>
                </div>
                <div class="email-body">
                  <p>Hi ${payload.name},</p>
                  <p>Your email has been Verified successfully</p>
                </div>
                <div class="email-footer">
                </div>
              </div>
            </div>
          </body>
        </html>
      `;
  }
}

export default REQUEST_TEMPLATE;