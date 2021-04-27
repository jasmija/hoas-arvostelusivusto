### 28.4.2021

-npm install hbs

-When opening file ".env", it might tell you "Plugins supporting .env files found" and propose to install said plugins.
No need to install them, everything should work fine as is.

-Cookies can be checked by opening developer tools (F12 in Firefox) -> "Storage" -> "Cookies" -> http://localhost:3000
Cookie name should be "jwt". It will only appear if user logs in successfully (current test account is admin:admin).
Always delete cookie after testing (could affect other testing later?)

### 27.4.2021

-npm install dotenv

### 26.4.2021

-npm install bcryptjs cookie-parser jsonwebtoken
