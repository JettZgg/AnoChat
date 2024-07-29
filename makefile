.PHONY: start

start:
	@echo "Starting backend server..."
	@cd backend && uvicorn app.main:app --reload &
	@echo "Starting frontend server..."
	@cd web && npm start &
	@echo "Servers started. Access the web page at http://localhost:3000"
	@wait