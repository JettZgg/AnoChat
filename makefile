.PHONY: start

start:
	@echo "Starting backend server..."
	@cd backend && uvicorn app.main:app --reload &
	@wait