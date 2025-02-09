const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.logo {
				max-width: 200px;
				margin-bottom: 20px;
			}
	
			.message {
				font-size: 18px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #FFD60A;
				color: #000000;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<a href="https://files.oaiusercontent.com/file-CKWhJDSKd3F5GqdKfwwnZL?se=2025-02-09T17%3A05%3A33Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D563bcb16-4446-4975-ab0c-e3a31d7099eb.webp&sig=ZlfQYxr2rYIdLNMnZ5CgJciq26qUdJICUbfYDZk4qG4%3D"><img class="logo"
					src="https://files.oaiusercontent.com/file-CKWhJDSKd3F5GqdKfwwnZL?se=2025-02-09T17%3A05%3A33Z&sp=r&sv=2024-08-04&sr=b&rscc=max-age%3D604800%2C%20immutable%2C%20private&rscd=attachment%3B%20filename%3D563bcb16-4446-4975-ab0c-e3a31d7099eb.webp&sig=ZlfQYxr2rYIdLNMnZ5CgJciq26qUdJICUbfYDZk4qG4%3D" alt="CourseVista Logo"></a>
			<div class="message">OTP Verification Email</div>
			<div class="body">
				<p>Dear User,</p>
				<p>Thank you for registering with CourseVista - The Ultimate Learning Hub. To complete your registration, please use the following OTP
					(One-Time Password) to verify your account:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for 5 minutes. If you did not request this verification, please disregard this email.
				Once your account is verified, you will have access to our platform and its features.</p>
			</div>
			<div class="support">If you have any questions or need assistance, please feel free to reach out to us at <a
					href="mailto:23mca20377@cuchd.in">23mca20377@cuchd.in</a>. We are here to help!</div>
		</div>
	</body>
	
	</html>`;
};
module.exports = otpTemplate;