# OSRS Bingo

Goal is to make managing a bingo in oldschool runescape a better experience.

## Technicals

- Frontend is nextjs and gets hosted on vercel. Redeploys with every merge to master.
- Backend is just a couple lambdas that run on AWS.
- Board data is in DynamoDB
- File data is in S3
