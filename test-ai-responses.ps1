# Test ODIADEV AI Agent with Real Questions
Write-Host "🤖 Testing ODIADEV AI Agent with Real Questions" -ForegroundColor Cyan
Write-Host "===============================================" -ForegroundColor Cyan

# Set environment variable for Groq API (you'll need to replace with your actual key)
$env:GROQ_API_KEY = "gsk_your_actual_groq_api_key_here"

# Start the backend server
Write-Host "🚀 Starting ODIADEV Brain server..." -ForegroundColor Green
$serverProcess = Start-Process -FilePath "node" -ArgumentList "server/brain.js" -PassThru -WindowStyle Hidden

# Wait for server to start
Start-Sleep -Seconds 3

# Test questions
$questions = @(
    "What are your capabilities and capacities? What are your strengths and weaknesses?",
    "Who is the CEO of ODIADEV?",
    "Tell me about Adaqua AI"
)

foreach ($question in $questions) {
    Write-Host "`n❓ Question: $question" -ForegroundColor Yellow
    Write-Host "🤖 AI Response:" -ForegroundColor Green
    
    try {
        $body = @{message=$question} | ConvertTo-Json
        $response = Invoke-WebRequest -Uri "http://localhost:10000/api/chat" -Method POST -ContentType "application/json" -Body $body -UseBasicParsing
        $data = $response.Content | ConvertFrom-Json
        
        Write-Host $data.reply -ForegroundColor White
        Write-Host "`n" + "="*50 -ForegroundColor Gray
        
    } catch {
        Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    Start-Sleep -Seconds 2
}

# Clean up
Write-Host "`n🧹 Stopping server..." -ForegroundColor Yellow
$serverProcess | Stop-Process -Force

Write-Host "✅ AI Agent testing complete!" -ForegroundColor Green
