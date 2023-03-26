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

### games

- id : string (pkey)
- name: string
- boardIds: string[]

### boards

- id: string (pkey)
- name: string
- tiles: tile[]

### tile

- id: string (pkey)
- name: string
- description: string
- icon: string
- currentPoints: string
- possiblePoints: string

### files

- id: string
- name: string
- date: string
- approvedBy: string | null
- path: string
- tileId: string (pkey?)
- boardId: string
- gameId: string (pkey?)

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
