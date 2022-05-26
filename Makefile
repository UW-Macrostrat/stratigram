start:
	cd manager && poetry run stratiform up

down:
	cd manager && poetry run stratiform down

schema:
	cd manager && poetry run stratiform sync