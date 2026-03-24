Complete this repository as a polished submission for the Zeerostock Database-Focused Assignment.

Must-have behavior:
- POST /supplier
- POST /inventory
- GET /inventory
- inventory must belong to a valid supplier
- quantity must be >= 0
- price must be > 0
- GET /inventory must group by supplier, compute totalInventoryValue, and sort descending by totalInventoryValue
- update README with schema explanation, SQL/NoSQL choice rationale, and one optimization suggestion

Do not add auth, Docker, or unnecessary architecture.
Keep the implementation simple and easy to run locally.
