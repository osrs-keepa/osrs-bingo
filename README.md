# OSRS Bingo

Goal is to make managing a bingo in oldschool runescape a better experience.

Task board is located at https://gatekeepr.monday.com/boards/4167339901

## DB Schema

---

### access_keys

- key : string (pkey)
- role: user | moderator | admin
- gameId: string
- boardId: string | null
- name: string

### boards

- id: string (pkey)
- name: string
- tiles: tile[]

## Roles

---

### Users

- have access to 1 board (boardId)
- cannot approve/reject

### Moderators

- can see all boards in game
- can approve

### Admins

- can see all boards in a game
- can approve/reject
