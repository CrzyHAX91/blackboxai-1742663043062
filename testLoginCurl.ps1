$body = @{
    email = "test@example.com"
    password = "password"
} | ConvertTo-Json

Invoke-RestMethod -Uri http://localhost:3000/api/auth/login -Method POST -Body $body -ContentType "application/json"
